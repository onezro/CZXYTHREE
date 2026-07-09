<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <el-form ref="formRef" :inline="true" size="small" label-width="auto" @submit.native.prevent>
                <el-form-item :label="t('Scheduling.generatePrepare.MesOrder')" prop="MergeGroup" class="mb-2">
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

                <el-table-column :label="t('Scheduling.generatePrepare.OrderGroup')" prop="LXGroup" fixed
                    :min-width="getColumnWidth('LXGroup')" />
                <el-table-column :label="t('Scheduling.generatePrepare.TeamOrder')" prop="TeamOrder" 
                    :min-width="getColumnWidth('TeamOrder')" />
                <el-table-column :label="t('Scheduling.generatePrepare.MesOrder')" prop="wo"
                    :min-width="getColumnWidth('wo')" />
                <el-table-column :label="t('Scheduling.generatePrepare.BtOrder')" prop="orderName"
                    :min-width="getColumnWidth('orderName')" />
                <el-table-column :label="t('Scheduling.generatePrepare.Product')" prop="PN"
                    :min-width="getColumnWidth('PN')" />
                <el-table-column :label="t('Scheduling.generatePrepare.BomVersion')" prop="BomVer"
                    :min-width="getColumnWidth('BomVer')" />
                <el-table-column :label="t('Scheduling.generatePrepare.Quantity')" prop="planQty"
                    :min-width="getColumnWidth('planQty')" />
                <el-table-column :label="t('Scheduling.generatePrepare.Side')" prop="Side"
                    :min-width="getColumnWidth('Side')" />
                <el-table-column :label="t('Scheduling.generatePrepare.LXLine')" prop="LXLine"
                    :min-width="getColumnWidth('LXLine')" />
                <el-table-column :label="t('Scheduling.generatePrepare.PlanStartTime')" prop="PlanStartTime" :min-width="getColumnWidth('PlanStartTime')" />
                <el-table-column :label="t('Scheduling.generatePrepare.PlanEndTime')" prop="PlanEndTime" :min-width="getColumnWidth('PlanEndTime')" />
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
import { useTableColumnWidth } from '@/hooks/useTableColumnWidth';
import {
    ref,
    reactive,
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
const tableMasterRef = ref()
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
            tableData.value = res.Data.rows
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
        OrderList.push(v.LXGroup)
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

const { getColumnWidth } = useTableColumnWidth(tableMasterRef, tableData, {
    excludeLabels: [t('publicText.index'), t('publicText.operation')],
    excludeTypes: ['selection']
});
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
    });
};
</script>
<style scoped>
.el-pagination {
    justify-content: center;
}
</style>
<style lang="scss" scoped></style>