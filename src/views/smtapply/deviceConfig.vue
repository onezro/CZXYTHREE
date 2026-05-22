<template>
    <div class="p-2 flex gap-[10px]">
        <el-card shadow="always" :body-style="{ padding: '8px' }" class="w-[250px] h-[calc(100vh-97px)]">
            <template #header>
                <div class="card-header flex justify-between items-center">
                    <div class="flex gap-[5px] items-center">
                        <img style="width: 24px; height: 24px" src="../../assets/svgs/or.svg" alt="" />
                        <div class="h-[24px] box-border pt-[3px]">线体</div>
                    </div>

                    <el-tooltip content="重置" placement="right">
                        <el-icon size="24" :class="isLoding" color="#006487" @click="refreshData">
                            <RefreshRight />
                        </el-icon>
                    </el-tooltip>
                </div>
            </template>
            <el-scrollbar class="h-[calc(100vh-160px)] pb-2">
                <el-tree style="max-width: 600px" :default-expanded-keys="['所有线体']"  node-key="OrganizationName" highlight-current :data="organTree"
                    :expand-on-click-node="false" :props="{
                        children: 'children',
                        label: 'OrganizationName',
                    }" @node-click="handleNodeClick" />
            </el-scrollbar>
        </el-card>
        <el-card shadow="always" :body-style="{ padding: '8px 8px 0 8px' }" class="flex-1">
            <el-table size="small" :data="tableData1.slice((currentPage - 1) * pageSize, currentPage * pageSize)
                " border :height="tableHeight" stripe>
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{
                            scope.$index +
                            pageSize * (currentPage - 1) +
                            1
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="LineName" :label="$t('smtapply.lineName')" />
                <el-table-column prop="McId" :label="$t('smtapply.deviceCode')" />
                <el-table-column prop="EquipType" :label="$t('smtapply.equipType')" />
                <!-- <el-table-column prop="deviceName" :label="$t('smtapply.deviceName')" /> -->
                <el-table-column prop="Sequence" :label="$t('smtapply.sequence')" />

                <el-table-column prop="equipmentIp" :label="$t('smtapply.deviceIP')" />
                <el-table-column prop="Status" :label="$t('smtapply.isEnable')" width="100">
                    <template #default="scope">
                        <el-switch style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                            v-model="scope.row.Status" :active-value="'Y'" :inactive-value="'N'"
                            @change="handleStatusChange(scope.row)" />
                    </template>
                </el-table-column>
            </el-table>
            <div class="mt-2">
                <el-pagination :size="'small'" background @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
                    :page-sizes="[30, 50, 100, 150, 200]" layout="total,sizes, prev, pager, next, jumper"
                    :total="tableData1.length">
                </el-pagination>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import {
    GetChangeOverMcAndConveyorSetting,
    UpdateMcAndConveyorSetting
} from "@/api/smtApply/changeover";
import { ElMessage, ElNotification } from "element-plus";

import {
    ref,
    unref,
    nextTick,
    reactive,
    onBeforeMount,
    watch,
    onMounted,
    computed,
    onBeforeUnmount,
} from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const tableData = ref([]);
const tableData1 = ref([
]);
const pageSize = ref(50);
const currentPage = ref(1);
const tableHeight = ref(0);
const organTree = ref<any>([

])
const nodeData = ref<any>(null)
const isLoding = ref("");
onBeforeMount(() => {
    getScreenHeight();
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    getData();

});
onBeforeUnmount(() => {
    window.addEventListener("resize", getScreenHeight);
});
const getData = () => {
    GetChangeOverMcAndConveyorSetting({ Mcid: '' }).then((res: any) => {
        tableData.value = res.Data;
        tableData1.value = res.Data;

        if (nodeData.value !== null) {
            tableData1.value = tableData.value.filter((item: any) => {
                if (nodeData.value.EquipType === '设备') {
                    return item.McId === nodeData.value.McId;
                } else if (nodeData.value.EquipType === '轨道') {
                    return item.McId === nodeData.value.McId && item.EquipType === nodeData.value.EquipType && item.Sequence === nodeData.value.Sequence;
                } else {
                    return item.LineName === nodeData.value.OrganizationName;
                }
            })
        } else {
            organTree.value = OrganData(res.Data);
        }
    });
}
const refreshData = () => {
    nodeData.value = null;
    isLoding.value = "is-loading";
    getData();
    let timer = setTimeout(() => {
        isLoding.value = "";
        clearTimeout(timer);
    }, 2000);
}
const OrganData = (data: any[]) => {
    // 1. 创建根节点
    const root: any = { OrganizationName: '所有线体', children: [] };

    // 2. 按线体分组
    const lineMap = new Map(); // key: LineName, value: 线体节点
    data.forEach(item => {
        const lineName = item.LineName;
        if (!lineMap.has(lineName)) {
            lineMap.set(lineName, { OrganizationName: lineName, children: [] });
        }
    });

    // 3. 按 McId 分组
    const mcMap = new Map(); // key: McId, value: 该 McId 下的所有条目
    data.forEach(item => {
        const mcId = item.McId;
        if (!mcMap.has(mcId)) {
            mcMap.set(mcId, []);
        }
        mcMap.get(mcId).push(item);
    });

    // 4. 处理每个 McId 组
    mcMap.forEach((items, mcId) => {
        // 找到设备项（每个 McId 下应有一个设备）
        const deviceItem = items.find((i: any) => i.EquipType === '设备');
        if (!deviceItem) return; // 无设备则跳过（根据实际数据调整）

        // 创建设备节点
        const deviceNode: any = {
            OrganizationName: deviceItem.EquipType + deviceItem.McId, // 可用模板字符串自定义显示
            equipmentIp: deviceItem.equipmentIp,
            EquipType: deviceItem.EquipType,
            McId: deviceItem.McId,
            Sequence: deviceItem.Sequence,
            Status: deviceItem.Status,
            children: []
        };

        // 添加轨道子节点
        const trackItems = items.filter((i: any) => i.EquipType === '轨道');
        trackItems.forEach((track: any) => {
            const trackNode = {
                OrganizationName: track.EquipType + '-' + track.Sequence, // 可自定义显示格式
                equipmentIp: track.equipmentIp,
                EquipType: track.EquipType,
                McId: track.McId,
                Sequence: track.Sequence,
                Status: track.Status,
                children: [] // 轨道无子节点
            };
            deviceNode.children.push(trackNode);
        });

        // 将设备节点放入对应线体
        const lineNode = lineMap.get(deviceItem.LineName);
        if (lineNode) {
            lineNode.children.push(deviceNode);
        }
    });

    // 5. 将线体节点挂到根节点下
    root.children = Array.from(lineMap.values());

    // 返回根节点数组（与原函数返回类型一致）
    return [root];
};
const handleNodeClick = (data: any) => {
    if(data.OrganizationName === '所有线体') {
        nodeData.value = null;
        tableData1.value = tableData.value;
        return;
    }
    nodeData.value = data;
    tableData1.value = tableData.value.filter((item: any) => {
        if (data.EquipType === '设备') {
            return item.McId === data.McId;
        } else if (data.EquipType === '轨道') {
            return item.McId === data.McId && item.EquipType === data.EquipType && item.Sequence === data.Sequence;
        } else {
            return item.LineName === data.OrganizationName;
        }
    })
};
const handleStatusChange = (row: any) => {
    console.log(nodeData.value);
    UpdateMcAndConveyorSetting({
        Mcid: row.McId.toString(),
        Sequence: row.Sequence.toString(),
        Status: row.Status
    }).then((res: any) => {
        ElNotification({
            title: t('publicText.tipTitle'),
            message: res.Message || (res.Success ? '操作成功' : '操作失败'),
            type: res.Success ? 'success' : 'error',
        })
        getData();


    });
}
const handleSizeChange = (val: any) => {
    // currentPage.value = 1;
    pageSize.value = val;
};
const handleCurrentChange = (val: any) => {
    currentPage.value = val;
};
const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 150;
    });
};
</script>
<style scoped>
.el-pagination {
    justify-content: center;
}
</style>
<style lang="scss" scoped></style>