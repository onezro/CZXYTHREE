<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between">
                <el-form ref="searchFormRef" :model="searchForm" label-width="auto" :inline="true" :size="'small'"
                    @submit.prevent>
                     <el-form-item :label="t('report.magazineStockReport.time')" prop="TimeRange" class="mb-2">
                        <el-date-picker style="width: 330px;" v-model="queryTime" type="datetimerange"
                            range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                            value-format="YYYY-MM-DD HH:mm:ss" :shortcuts="shortcuts1" :default-time="[
                                new Date(2000, 1, 1, 0, 0, 0),
                                new Date(2000, 1, 1, 23, 59, 59),
                            ]" :clearable="false" @change="handleDateRangeChange" />
                    </el-form-item>
                    <el-form-item :label="t('report.magazineStockReport.productionOrderNo')" prop="ProductionOrderNo"
                        class="mb-2">
                        <el-input v-model="searchForm.ProductionOrderNo" clearable @clear="handleSearch"
                            @keyup.enter="handleSearch" style="width: 180px"
                            :placeholder="t('report.magazineStockReport.inputProductionOrderNo')" />
                    </el-form-item>
                    <el-form-item :label="t('report.magazineStockReport.productCode')" prop="ProductCode" class="mb-2">
                        <el-input v-model="searchForm.ProductCode" clearable @clear="handleSearch"
                            @keyup.enter="handleSearch" style="width: 180px"
                            :placeholder="t('report.magazineStockReport.inputProductCode')" />
                    </el-form-item>
                    <el-form-item :label="t('report.magazineStockReport.productSpec')" prop="ProductSpec" class="mb-2">
                        <el-input v-model="searchForm.ProductSpec" clearable @clear="handleSearch"
                            @keyup.enter="handleSearch" style="width: 180px"
                            :placeholder="t('report.magazineStockReport.inputProductSpec')" />
                    </el-form-item>
                    <el-form-item :label="t('report.magazineStockReport.workOrderNo')" prop="WorkOrderNo" class="mb-2">
                        <el-input v-model="searchForm.WorkOrderNo" clearable @clear="handleSearch"
                            @keyup.enter="handleSearch" style="width: 180px"
                            :placeholder="t('report.magazineStockReport.inputWorkOrderNo')" />
                    </el-form-item>
                    <el-form-item :label="t('report.magazineStockReport.containerNo')" prop="ContainerNo" class="mb-2">
                        <el-input v-model="searchForm.ContainerNo" clearable @clear="handleSearch"
                            @keyup.enter="handleSearch" style="width: 180px"
                            :placeholder="t('report.magazineStockReport.inputContainerNo')" />
                    </el-form-item>
                   
                    <el-form-item class="mb-2">
                        <el-button type="primary" @click="handleSearch">{{ t("publicText.query") }}</el-button>
                        <el-button @click="handleReset">{{ t("publicText.reset") }}</el-button>
                        <el-button type="success" icon="Download" :loading="exporting" @click="handleExport">
                            {{ t("publicText.export") }}
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>

            <el-table :data="tableData" size="small" ref="eltableRef" :style="{ width: '100%' }" :height="tableHeight"
                border fit highlight-current-row v-loading="loading"
                :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }">
                <el-table-column type="index" align="center" fixed :label="t('publicText.index')" width="60">
                    <template #default="scope">
                        <span>{{ scope.$index + pageObj.pageSize * (pageObj.currentPage - 1) + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="ProductionOrderNo" fixed
                    :label="t('report.magazineStockReport.productionOrderNo')"
                    :min-width="getColumnWidth('ProductionOrderNo')" show-overflow-tooltip />
                <el-table-column prop="ProductionOrderRow" align="center"
                    :label="t('report.magazineStockReport.productionOrderRow')"
                    :min-width="getColumnWidth('ProductionOrderRow')" show-overflow-tooltip />
                <el-table-column prop="ProductCode" :label="t('report.magazineStockReport.productCode')"
                    :min-width="getColumnWidth('ProductCode')" show-overflow-tooltip />
                <el-table-column prop="ProductSpec" :label="t('report.magazineStockReport.productSpec')"
                    :min-width="getColumnWidth('ProductSpec')" show-overflow-tooltip />
                <el-table-column prop="BomVersion" align="center" :label="t('report.magazineStockReport.bomVersion')"
                    :min-width="getColumnWidth('BomVersion')" show-overflow-tooltip />
                <el-table-column prop="WorkOrderNo" :label="t('report.magazineStockReport.workOrderNo')"
                    :min-width="getColumnWidth('WorkOrderNo')" show-overflow-tooltip />
                <el-table-column prop="WorkOrderQuantity" align="center"
                    :label="t('report.magazineStockReport.workOrderQuantity')"
                    :min-width="getColumnWidth('WorkOrderQuantity')" show-overflow-tooltip />
                <el-table-column prop="ContainerNo" :label="t('report.magazineStockReport.containerNo')"
                    :min-width="getColumnWidth('ContainerNo')" show-overflow-tooltip />
                <el-table-column prop="PanelQuantity" align="center"
                    :label="t('report.magazineStockReport.panelQuantity')"
                    :min-width="getColumnWidth('PanelQuantity')" show-overflow-tooltip />
                <el-table-column prop="Warehouse" :label="t('report.magazineStockReport.warehouse')"
                    :min-width="getColumnWidth('Warehouse')" show-overflow-tooltip />
                <el-table-column prop="StorageLocation" :label="t('report.magazineStockReport.storageLocation')"
                    :min-width="getColumnWidth('StorageLocation')" show-overflow-tooltip />
                <el-table-column prop="Side" align="center" :label="t('report.magazineStockReport.side')"
                    :min-width="getColumnWidth('Side')" show-overflow-tooltip />
                <el-table-column prop="RegisteredOperation" :label="t('report.magazineStockReport.registeredOperation')"
                    :min-width="getColumnWidth('RegisteredOperation')" show-overflow-tooltip />
                <el-table-column prop="CompletedOperation" :label="t('report.magazineStockReport.completedOperation')"
                    :min-width="getColumnWidth('CompletedOperation')" show-overflow-tooltip />
                <el-table-column prop="InboundTime" :label="t('report.magazineStockReport.time')"
                    :min-width="getColumnWidth('InboundTime')">
                    <template #default="{ row }">
                        {{ formatDate(row.InboundTime) }}
                    </template>
                </el-table-column>
                <template #empty>
                    <div class="flex items-center justify-center h-100%">
                        <el-empty />
                    </div>
                </template>
            </el-table>

            <div class="mt-2">
                <el-pagination :size="'small'" background @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :pager-count="5" :current-page="pageObj.currentPage"
                    :page-size="pageObj.pageSize" :page-sizes="[10, 20, 30, 50, 100]"
                    layout="total, sizes, prev, pager, next" :total="total" />
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import {
    QueryMagazineStockReportPage,
    ExportMagazineStockReport,
} from "@/api/report/index";
import { shortcuts1 } from "@/utils/dataMenu";
import { ref, reactive, onMounted, watch } from "vue";
import { ElMessage } from "element-plus";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import { useTableHeight } from "@/hooks/useTableHeight";
import dayjs from "dayjs";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const loading = ref(false);
const exporting = ref(false);
const eltableRef = ref();
const { tableHeight, calcTableHeight } = useTableHeight(eltableRef);
const tableData = ref<any[]>([]);
const total = ref(0);

const queryTime = ref<any[]>([]);

const searchForm = reactive({
    ProductionOrderNo: "",
    ProductCode: "",
    ProductSpec: "",
    WorkOrderNo: "",
    ContainerNo: "",
    StartTime: "",
    EndTime: "",
});

const pageObj = reactive({
    currentPage: 1,
    pageSize: 50,
});

const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === "1900-01-01T00:00:00") return "-";
    return dayjs(dateStr).format("YYYY-MM-DD HH:mm:ss");
};

const { getColumnWidth } = useTableColumnWidth(eltableRef, tableData, {
    excludeLabels: [t("publicText.index")],
});

const handleDateRangeChange = (val: any[]) => {
    searchForm.StartTime = val?.[0] || "";
    searchForm.EndTime = val?.[1] || "";
};

// 查询与导出使用相同的筛选条件
const getFilterParams = () => ({
    ProductionOrderNo: searchForm.ProductionOrderNo || "",
    ProductCode: searchForm.ProductCode || "",
    ProductSpec: searchForm.ProductSpec || "",
    WorkOrderNo: searchForm.WorkOrderNo || "",
    ContainerNo: searchForm.ContainerNo || "",
    StartTime: searchForm.StartTime || "",
    EndTime: searchForm.EndTime || "",
});

const getData = () => {
    loading.value = true;
    const params = {
        ...getFilterParams(),
        PageIndex: pageObj.currentPage,
        PageSize: pageObj.pageSize,
    };
    QueryMagazineStockReportPage(params)
        .then((res: any) => {
            if (res.Success && res.Data && Array.isArray(res.Data.rows)) {
                tableData.value = res.Data.rows;
                total.value = res.Data.total || 0;
            } else {
                tableData.value = [];
                total.value = 0;
                ElMessage.warning(res.Message || t("message.queryFailure"));
            }
        })
        .catch(() => {
            tableData.value = [];
            total.value = 0;
        })
        .finally(() => {
            loading.value = false;
            calcTableHeight();
        });
};

const handleSearch = () => {
    pageObj.currentPage = 1;
    getData();
};

const handleExport = async () => {
    exporting.value = true;
    try {
        const res: any = await ExportMagazineStockReport(getFilterParams());
        // 当后端返回 JSON（如异常信息）时，responseType 为 blob，需要单独处理
        if (res && res.type && res.type.includes("application/json")) {
            const text = await res.text();
            let msg = t("message.queryFailure");
            try {
                const json = JSON.parse(text);
                msg = json.Message || json.message || msg;
            } catch {
                // 忽略解析异常，使用默认提示
            }
            ElMessage.error(msg);
            return;
        }
        const blob = res instanceof Blob ? res : new Blob([res]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${t("report.magazineStockReport.fileName")}_${dayjs().format("YYYYMMDD_HHmmss")}.xlsx`;
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch {
        // 请求拦截器已统一提示错误
    } finally {
        exporting.value = false;
    }
};

const handleReset = () => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const start = new Date();
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    queryTime.value = [
        `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}-${String(start.getDate()).padStart(2, "0")} 00:00:00`,
        `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, "0")}-${String(end.getDate()).padStart(2, "0")} 23:59:59`,
    ];
    searchForm.StartTime = queryTime.value[0] || "";
    searchForm.EndTime = queryTime.value[1] || "";
    searchForm.ProductionOrderNo = "";
    searchForm.ProductCode = "";
    searchForm.ProductSpec = "";
    searchForm.WorkOrderNo = "";
    searchForm.ContainerNo = "";
    pageObj.currentPage = 1;
    getData();
};

const handleSizeChange = (val: number) => {
    pageObj.pageSize = val;
    pageObj.currentPage = 1;
    getData();
};

const handleCurrentChange = (val: number) => {
    pageObj.currentPage = val;
    getData();
};

watch(
    queryTime,
    (newVal) => {
        handleDateRangeChange(newVal);
    },
);

onMounted(() => {
    handleReset();
});
</script>

<style lang="scss" scoped>
.el-pagination {
    justify-content: center;
}
</style>
