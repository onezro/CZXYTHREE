<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <el-form ref="formRef" :inline="true" size="small" label-width="auto" @submit.native.prevent>
                <el-form-item :label="t('Scheduling.generatePrepare.OrderName')" prop="MergeGroup" class="mb-2">
                    <el-input v-model="getForm.orderName" placeholder="" clearable @clear="searhData"
                        @keyup.enter.native="searhData" style="width: 200px" />
                </el-form-item>
                <el-form-item class="mb-2">
                    <el-button :type="'primary'" @click="searhData">查询</el-button>
                    <el-button :type="'warning'" @click="handleGenerate"
                        :disabled="selectList.length === 0">生成备料单</el-button>
                    <!-- <el-button :type="'primary'" @click="">缺料详情</el-button> -->
                </el-form-item>
            </el-form>
            <el-table ref="tableMasterRef" :data="tableData" size="small" :style="{ width: '100%' }"
                :height="tableHeight" :tooltip-effect="'dark'" border fit @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{
                            scope.$index + getForm.PageSize * (getForm.PageIndex - 1) + 1
                            }}</span>
                    </template>
                </el-table-column>

                <el-table-column :label="t('Scheduling.ProductSched.TBSide')" prop="orderName"
                    :min-width="getColumnWidth1('orderName')" />
                <el-table-column :label="t('Scheduling.generatePrepare.OrderGroup')" prop="LXGroup"
                    :min-width="getColumnWidth1('LXGroup')" />
                <el-table-column :label="t('Scheduling.generatePrepare.LXLine')" prop="LXLine"
                    :min-width="getColumnWidth1('LXLine')" />
                <el-table-column :label="t('Scheduling.ProductSched.MesOrder')" prop="wo"
                    :min-width="getColumnWidth1('wo')" />
                <el-table-column :label="'面别'" prop="Side" :min-width="getColumnWidth1('Side')" />
                <el-table-column :label="t('Scheduling.ProductSched.ProductCode')" prop="PN"
                    :min-width="getColumnWidth1('PN')" />
                <el-table-column :label="t('Scheduling.ProductSched.bomVersion')" prop="BomVer"
                    :min-width="getColumnWidth1('BomVer')" />
                <el-table-column :label="t('Scheduling.ProductSched.ProductNum')" prop="planQty"
                    :min-width="getColumnWidth1('planQty')" />
                <el-table-column :label="t('Scheduling.ProductSched.PlanStartDate')" prop="LXStartTime" :min-width="getColumnWidth1('LXStartTime')" />
                <el-table-column :label="t('Scheduling.ProductSched.PlanEndDate')" prop="LXEndTime" :min-width="getColumnWidth1('LXEndTime')" />
                <template #empty>
                    <div class="flex items-center justify-center h-100%">
                        <el-empty />
                    </div>
                </template>
            </el-table>
            <div class="mt-2 mb-1">
                <el-pagination :size="'small'" background @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :pager-count="5" :current-page="getForm.PageIndex"
                    :page-size="getForm.PageSize" :page-sizes="[30, 50, 100, 200, 300]"
                    layout="total,sizes, prev, pager, next" :total="total">
                </el-pagination>
            </div>

        </el-card>
    </div>
</template>

<script setup lang="ts">
import { QueryWorkOrderList, GenerateMaterialPreparation } from "@/api/Scheduling/index"
import { calculateColumnsWidth } from "@/utils/tableminWidth";
import {
    ref,
    reactive,
    watch,
    computed,
    nextTick,
    onMounted,
    onBeforeMount,
    onBeforeUnmount,
} from "vue";
import { ElNotification, ElMessage, ElMessageBox } from "element-plus";
import dayjs from "dayjs";
import { useUserStoreWithOut } from "@/stores/modules/user";
const userStore = useUserStoreWithOut();
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const tableHeight = ref(0);
const tableData = ref([
]);

const pageObj = reactive({
    currentPage: 1,
    pageSize: 50,
});
const getForm = ref({
    PageIndex: 1,
    PageSize: 50,
    orderName: ''
})
const total = ref(0)
const selectList = ref<any>([])
const addVisible = ref(false)
const editVisible = ref(false)
const addForm = ref({
})
const editForm = ref({
})
const tableHeight2 = ref(0);
const tableData2 = ref([]);
const tableMasterRef = ref()
const tableDetailRef = ref()
const handleSelectionChange = (val: any) => {
    selectList.value = val
}
const searhData = () => {
    getForm.value.PageIndex = 1
    getData()
}
const getData = () => {
    QueryWorkOrderList(getForm.value).then((res: any) => {
        if (res.Success) {
            total.value = res.Data.total
            tableData.value = res.Data.rows.map((item: any) => {
                return {
                    ...item,
                    LXStartTime: item.LXStartTime ? dayjs(item.LXStartTime).format('YYYY-MM-DD HH:mm:ss') : '',
                    LXEndTime: item.LXEndTime ? dayjs(item.LXEndTime).format('YYYY-MM-DD HH:mm:ss') : '',
                }
            })
        }
    })
}
const handleGenerate = () => {
    let data = {
        OrderNames: '',
        CreateUser: userStore.getUserInfo
    }
    let OrderList: any = []
    selectList.value.forEach((v: any) => {
        OrderList.push(v.orderName)
    });
    data.OrderNames = OrderList.join(',')
    console.log(data);

    GenerateMaterialPreparation(data).then((res: any) => {
        if (res.Success) {
            getData()
        }
        ElNotification({
            title: "提示信息",
            message: res.Message,
            type: res.Success ? "success" : "error",
            duration: 4000
        });
    })
}
const addCancel = () => {
    addVisible.value = false
}
const addSubmit = () => {

}
const editCancel = () => {
    editVisible.value = false
}
const editSubmit = () => {

}
const handleSizeChange = (val: any) => {
    getForm.value.PageSize = val
    // pageObj.pageSize = val;
};
const handleCurrentChange = (val: any) => {
    getForm.value.PageIndex = val
    // pageObj.currentPage = val;
};

const columnWidths1 = computed(() => {
    if (!tableMasterRef.value) return {};
    let columns: any = [];
    columns = tableMasterRef.value.columns
        .map((item: any) => {
            return {
                prop: item.property,
                label: item.label,
                type: item.type
            };
        })
        .filter(
            (item: any) =>
                item.label !== t("publicText.index") &&
                item.label !== t("publicText.operation") && item.type !== 'selection',
        );

    // 批量计算列宽
    return calculateColumnsWidth(columns, tableData.value, {
        padding: 25,
        fontSize: 13,
    });
});

// 在模板中使用
const getColumnWidth1 = (prop: string) => {
    return columnWidths1.value[prop] || "auto";
};
const columnWidths2 = computed(() => {
    if (!tableDetailRef.value) return {};
    let columns: any = [];
    columns = tableDetailRef.value.columns
        .map((item: any) => {
            return {
                prop: item.property,
                label: item.label,
            };
        })
        .filter(
            (item: any) =>
                item.label !== t("publicText.index") &&
                item.label !== t("publicText.operation"),
        );

    // 批量计算列宽
    return calculateColumnsWidth(columns, tableData2.value, {
        padding: 25,
        fontSize: 13,
    });
});

// 在模板中使用
const getColumnWidth2 = (prop: string) => {
    return columnWidths2.value[prop] || "auto";
};
onBeforeMount(() => {
    getScreenHeight();

});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    getData();

});
onBeforeUnmount(() => {
    window.removeEventListener("resize", getScreenHeight);
});

const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 190;
        tableHeight2.value = window.innerHeight - tableHeight.value - 185;
    });
};
</script>
<style scoped>
.el-pagination {
    justify-content: center;
}
</style>
<style lang="scss" scoped></style>