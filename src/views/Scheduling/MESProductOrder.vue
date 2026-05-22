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
                <el-table-column :label="t('Scheduling.MESProductOrder.MergeGroup')" fixed prop="MergeGroup"
                    :min-width="getColumnWidth1('MergeGroup')" />
                <el-table-column :label="t('Scheduling.MESProductOrder.Product')" fixed prop="Product"
                    :min-width="getColumnWidth1('Product')" />
                <el-table-column :label="t('Scheduling.MESProductOrder.order')" fixed prop="order"
                    :min-width="getColumnWidth1('order')" />
                <el-table-column :label="t('Scheduling.MESProductOrder.ProductNum')" fixed prop="ProductNum"
                    :min-width="getColumnWidth1('ProductNum')" />
                <el-table-column :label="t('Scheduling.MESProductOrder.RemainQty')" prop="RemainQty"
                    :min-width="getColumnWidth1('RemainQty')" />
                <el-table-column :label="t('Scheduling.MESProductOrder.PreparatLine')" prop="PreparatLine"
                    :min-width="getColumnWidth1('PreparatLine')" />
                <el-table-column :label="t('Scheduling.assist.ProductNum')" prop="ProductNum"
                    :min-width="getColumnWidth1('ProductNum')" />
                <el-table-column :label="t('Scheduling.assist.DeliveryDate')" prop="DeliveryDate"
                    :min-width="getColumnWidth1('DeliveryDate')" />
                <el-table-column :label="t('Scheduling.assist.PreparationOrder')" prop="PreparationOrder"
                    :min-width="getColumnWidth1('PreparationOrder')" />
                <el-table-column :label="t('Scheduling.assist.Status')" prop="Status"
                    :min-width="getColumnWidth1('Status')" />
                <el-table-column :label="t('Scheduling.assist.mesOrder')" prop="mesOrder"
                    :min-width="getColumnWidth1('mesOrder')" />
                <el-table-column :label="t('Scheduling.assist.creator')" prop="creator"
                    :min-width="getColumnWidth1('creator')" />
                <el-table-column :label="t('Scheduling.assist.creatime')" prop="creatime"
                    :min-width="getColumnWidth1('creatime')" />
                <el-table-column :label="t('Scheduling.assist.updator')" prop="updator"
                    :min-width="getColumnWidth1('updator')" />
                <el-table-column :label="t('Scheduling.assist.updateTime')" prop="updateTime"
                    :min-width="getColumnWidth1('updateTime')" />
                <template #empty>
                    <div class="flex items-center justify-center h-100%">
                        <el-empty />
                    </div>
                </template>
            </el-table>
            <div class="mt-2">
                <el-pagination :size="'small'" background @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :pager-count="5" :current-page="pageObj.currentPage"
                    :page-size="pageObj.pageSize" :page-sizes="[30, 50, 100, 200, 300]"
                    layout="total,sizes, prev, pager, next" :total="tableData.length">
                </el-pagination>
            </div>
        </el-card>
        <el-dialog :title="$t('publicText.add')" v-model="addVisible" width="80%" @close="addCancel">
            <el-form :model="addForm" ref="addFormRef" label-width="auto" :inline="false"></el-form>
            <template #footer>
                <el-button @click="addCancel">{{ $t("publicText.cancel") }}</el-button>
                <el-button type="primary" @click="addSubmit">{{
                    $t("publicText.confirm")
                    }}</el-button>
            </template>
        </el-dialog>
        <el-dialog :title="$t('publicText.edit')" v-model="editVisible" width="80%" @close="editCancel">
            <el-form :model="editForm" ref="editFormRef" label-width="auto" :inline="false"></el-form>
            <template #footer>
                <el-button @click="editCancel">{{ $t("publicText.cancel") }}</el-button>
                <el-button type="primary" @click="editSubmit">{{
                    $t("publicText.confirm")
                }}</el-button>
            </template>
        </el-dialog>
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
        tableHeight.value = window.innerHeight - 180;
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
</script>
<style scoped>
.el-pagination {
    justify-content: center;
}
</style>
<style lang="scss" scoped></style>