<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <el-form ref="formRef" :inline="true" size="small" label-width="auto" @submit.native.prevent>
                <el-form-item :label="t('Scheduling.MESProductOrder.MergeGroup')" prop="MergeGroup" class="mb-2">
                    <el-input v-model="getForm.MergeGroup" placeholder="" clearable @clear="getData"
                        @keyup.enter.native="getData" style="width: 200px" />
                </el-form-item>
                <el-form-item class="mb-2">
                    <el-button :type="'primary'" @click="getData">查询</el-button>

                </el-form-item>
            </el-form>
            <el-table :data="tableData.slice(
                (pageObj.currentPage - 1) * pageObj.pageSize,
                pageObj.currentPage * pageObj.pageSize
            )
                " size="small" :style="{ width: '100%' }" :height="tableHeight" :tooltip-effect="'dark'" border fit>
                 <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{
                            scope.$index + pageObj.pageSize * (pageObj.currentPage - 1) + 1
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="t('Scheduling.teamWorkOrder.MergeGroup')" fixed prop="MergeGroup"
                    :min-width="getColumnWidth1('MergeGroup')" />
                <el-table-column :label="t('Scheduling.teamWorkOrder.TotalNumSet')" fixed prop="TotalNumSet"
                    :min-width="getColumnWidth1('TotalNumSet')" />
                <el-table-column :label="t('Scheduling.teamWorkOrder.Line')" fixed prop="Line"
                    :min-width="getColumnWidth1('Line')" />
                <el-table-column :label="t('Scheduling.teamWorkOrder.DeliveryDate')" fixed prop="DeliveryDate"
                    :min-width="getColumnWidth1('DeliveryDate')" />
                <el-table-column :label="t('Scheduling.teamWorkOrder.PlanStartDate')" prop="PlanStartDate"
                    :min-width="getColumnWidth1('PlanStartDate')" />
                <el-table-column :label="t('Scheduling.teamWorkOrder.PlanEndDate')" prop="PlanEndDate"
                    :min-width="getColumnWidth1('PlanEndDate')" />
                <el-table-column :label="t('Scheduling.teamWorkOrder.PreparationOrder')" prop="PreparationOrder"
                    :min-width="getColumnWidth1('PreparationOrder')" />
                <el-table-column :label="t('Scheduling.teamWorkOrder.Status')" prop="Status"
                    :min-width="getColumnWidth1('Status')" />
                <el-table-column :label="t('Scheduling.teamWorkOrder.Creator')" prop="creator"
                    :min-width="getColumnWidth1('creator')" />
                <el-table-column :label="t('Scheduling.teamWorkOrder.Creatime')" prop="creatime"
                    :min-width="getColumnWidth1('creatime')" />
                <el-table-column :label="t('Scheduling.teamWorkOrder.Updator')" prop="updator"
                    :min-width="getColumnWidth1('updator')" />
                <el-table-column :label="t('Scheduling.teamWorkOrder.UpdateTime')" prop="updateTime"
                    :min-width="getColumnWidth1('updateTime')" />
                <template #empty>
                    <div class="flex items-center justify-center h-100%">
                        <el-empty />
                    </div>
                </template>
            </el-table>
            <div class="mt-2 mb-1">
                <el-pagination :size="'small'" background @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :pager-count="5" :current-page="pageObj.currentPage"
                    :page-size="pageObj.pageSize" :page-sizes="[30, 50, 100, 200, 300]"
                    layout="total,sizes, prev, pager, next" :total="tableData.length">
                </el-pagination>
            </div>
             <el-table :data="tableData2" size="small" :style="{ width: '100%' }" :height="tableHeight2" :tooltip-effect="'dark'" border fit>
                 <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                </el-table-column>
                <el-table-column :label="t('Scheduling.teamWorkOrder.MergeGroup')" fixed prop="MergeGroup"
                    :min-width="getColumnWidth2('MergeGroup')" />
                <el-table-column :label="t('Scheduling.teamWorkOrder.Product')" fixed prop="Product"
                    :min-width="getColumnWidth2('Product')" />
                <el-table-column :label="t('Scheduling.teamWorkOrder.order')" fixed prop="order"
                    :min-width="getColumnWidth2('order')" />
                <el-table-column :label="t('Scheduling.teamWorkOrder.TeamOrder')" fixed prop="TeamOrder"
                    :min-width="getColumnWidth2('TeamOrder')" />
                <el-table-column :label="t('Scheduling.teamWorkOrder.TeamProduct')" prop="TeamProduct"
                    :min-width="getColumnWidth2('TeamProduct')" />
                <el-table-column :label="t('Scheduling.teamWorkOrder.ProductNum')" prop="ProductNum"
                    :min-width="getColumnWidth2('ProductNum')" />
                <el-table-column :label="t('Scheduling.teamWorkOrder.Line')" prop="Line"
                    :min-width="getColumnWidth2('Line')" />
                <el-table-column :label="t('Scheduling.teamWorkOrder.ScheduledQty')" prop="ScheduledQty"
                    :min-width="getColumnWidth2('ScheduledQty')" />
                <el-table-column :label="t('Scheduling.teamWorkOrder.RemainQty')" prop="RemainQty"
                    :min-width="getColumnWidth2('RemainQty')" />
                <el-table-column :label="t('Scheduling.teamWorkOrder.PreparatLine')" prop="PreparatLine"
                    :min-width="getColumnWidth2('PreparatLine')" />
                      <el-table-column :label="t('Scheduling.teamWorkOrder.DeliveryDate')" fixed prop="DeliveryDate"
                    :min-width="getColumnWidth2('DeliveryDate')" />
                <el-table-column :label="t('Scheduling.teamWorkOrder.PlanStartDate')" prop="PlanStartDate"
                    :min-width="getColumnWidth2('PlanStartDate')" />
                <el-table-column :label="t('Scheduling.teamWorkOrder.PlanEndDate')" prop="PlanEndDate"
                    :min-width="getColumnWidth2('PlanEndDate')" />
                <el-table-column :label="t('Scheduling.teamWorkOrder.PreparatOrder')" prop="PreparatOrder"
                    :min-width="getColumnWidth2('PreparatOrder')" />
                <el-table-column :label="t('Scheduling.teamWorkOrder.Status')" prop="Status"
                    :min-width="getColumnWidth2('Status')" />
                <el-table-column :label="t('Scheduling.teamWorkOrder.Creator')" prop="creator"
                    :min-width="getColumnWidth2('Creator')" />
                <el-table-column :label="t('Scheduling.teamWorkOrder.Creatime')" prop="creatime"
                    :min-width="getColumnWidth2('Creatime')" />
                <el-table-column :label="t('Scheduling.teamWorkOrder.Updator')" prop="updator"
                    :min-width="getColumnWidth2('Updator')" />
                <el-table-column :label="t('Scheduling.teamWorkOrder.UpdateTime')" prop="updateTime"
                    :min-width="getColumnWidth2('UpdateTime')" />
                <template #empty>
                    <div class="flex items-center justify-center h-100%">
                        <el-empty />
                    </div>
                </template>
            </el-table>
        </el-card>
    </div>
</template>

<script setup lang="ts">
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
import { useUserStoreWithOut } from "@/stores/modules/user";
const userStore = useUserStoreWithOut();
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const tableHeight = ref(0);
const tableData = ref([
    {
        MergeGroup: "MG20230608001",
        Product: "ProductA",
        order: "PO20230608001",
        ProductNum: 100,
        RemainQty: 50,
        PreparatLine: "Line1",
        DeliveryDate: "2023-06-15",
        PreparationOrder: "PR20230608001",
        Status: "已排程",
        mesOrder: "MES20230608001",
        creator: "User1",
        creatime: "2023-06-08 10:00:00",
        updator: "User2",
        updateTime: "2023-06-09 15:30:00",
    }
]);

const pageObj = reactive({
    currentPage: 1,
    pageSize: 50,
});
const getForm = ref({
    MergeGroup: ''
})
const addVisible = ref(false)
const editVisible = ref(false)
const addForm = ref({
})
const editForm = ref({
})
const tableHeight2 = ref(0);
const tableData2 = ref([]);
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
    pageObj.pageSize = val;
};
const handleCurrentChange = (val: any) => {
    pageObj.currentPage = val;
};
const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 500;
        tableHeight2.value = window.innerHeight -tableHeight.value-185;
    });
};
const columnWidths1 = computed(() => {
    const columns = [
        { label: t("Scheduling.MESProductOrder.MergeGroup"), prop: "MergeGroup" },
        { label: t("Scheduling.MESProductOrder.Product"), prop: "Product" },
        { label: t("Scheduling.MESProductOrder.order"), prop: "order" },
        { label: t("Scheduling.MESProductOrder.ProductNum"), prop: "ProductNum" },
        { label: t("Scheduling.MESProductOrder.RemainQty"), prop: "RemainQty" },
        { label: t("Scheduling.MESProductOrder.PreparatLine"), prop: "PreparatLine" },
        { label: t("Scheduling.assist.ProductNum"), prop: "ProductNum" },
        { label: t("Scheduling.assist.DeliveryDate"), prop: "DeliveryDate" },
        { label: t("Scheduling.assist.PreparationOrder"), prop: "PreparationOrder" },
        { label: t("Scheduling.assist.Status"), prop: "Status" },
        { label: t("Scheduling.assist.mesOrder"), prop: "mesOrder" },
        { label: t("Scheduling.assist.creator"), prop: "creator" },
        { label: t("Scheduling.assist.creatime"), prop: "creatime" },
        { label: t("Scheduling.assist.updator"), prop: "updator" },
        { label: t("Scheduling.assist.updateTime"), prop: "updateTime" },
       

    ];

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
const columnWidths2= computed(() => {
    const columns = [
     { label: t("Scheduling.teamWorkOrder.MergeGroup"), prop: "MergeGroup" },
        { label: t("Scheduling.teamWorkOrder.Product"), prop: "Product" },
        { label: t("Scheduling.teamWorkOrder.order"), prop: "order" },
        { label: t("Scheduling.teamWorkOrder.TeamOrder"), prop: "TeamOrder" },
        { label: t("Scheduling.teamWorkOrder.TeamProduct"), prop: "TeamProduct" },
        { label: t("Scheduling.teamWorkOrder.ProductNum"), prop: "ProductNum" },
        { label: t("Scheduling.teamWorkOrder.Line"), prop: "Line" },
        { label: t("Scheduling.teamWorkOrder.ScheduledQty"), prop: "ScheduledQty" },
        { label: t("Scheduling.teamWorkOrder.RemainQty"), prop: "RemainQty" },
        { label: t("Scheduling.teamWorkOrder.PreparatLine"), prop: "PreparatLine" },
          { label: t("Scheduling.teamWorkOrder.DeliveryDate"), fixed:true, prop: "DeliveryDate" },
        { label: t("Scheduling.teamWorkOrder.PlanStartDate"), prop: "PlanStartDate" },
        { label: t("Scheduling.teamWorkOrder.PlanEndDate"), prop: "PlanEndDate" },
        { label: t("Scheduling.teamWorkOrder.PreparatOrder"), prop: "PreparatOrder" },
        { label: t("Scheduling.teamWorkOrder.Status"), prop: "Status" },
        { label: t("Scheduling.teamWorkOrder.Creator"), prop: "creator" },
        { label: t("Scheduling.teamWorkOrder.Creatime"), prop: "creatime" },
        { label: t("Scheduling.teamWorkOrder.Updator"), prop: "updator" },
        { label: t("Scheduling.teamWorkOrder.UpdateTime"), prop: "updateTime" },
       

    ];

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
</script>
<style scoped>
.el-pagination {
    justify-content: center;
}
</style>
<style lang="scss" scoped></style>