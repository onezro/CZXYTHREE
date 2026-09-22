<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between">
                <el-form ref="searchFormRef" :model="searchForm" label-width="auto" :inline="true" :size="'small'"
                    @submit.prevent>
                    <el-form-item :label="t('report.packingDataQuery.workOrder')" prop="WorkOrder" class="mb-2">
                        <el-input v-model="searchForm.WorkOrder" clearable @clear="handleSearch" @keyup.enter="handleSearch"
                            style="width: 180px" :placeholder="t('report.packingDataQuery.inputWorkOrder')" />
                    </el-form-item>
                    <el-form-item :label="t('report.packingDataQuery.box')" prop="Box" class="mb-2">
                        <el-input v-model="searchForm.Box" clearable @clear="handleSearch" @keyup.enter="handleSearch"
                            style="width: 180px" :placeholder="t('report.packingDataQuery.inputBox')" />
                    </el-form-item>
                    <el-form-item :label="t('report.packingDataQuery.snNumber')" prop="SNNumber" class="mb-2">
                        <el-input v-model="searchForm.SNNumber" clearable @clear="handleSearch" @keyup.enter="handleSearch"
                            style="width: 180px" :placeholder="t('report.packingDataQuery.inputSNNumber')" />
                    </el-form-item>
                    <el-form-item :label="t('report.packingDataQuery.bigBoardProductCode')" prop="BigBoardProductCode"
                        class="mb-2">
                        <el-input v-model="searchForm.BigBoardProductCode" clearable @clear="handleSearch"
                            @keyup.enter="handleSearch" style="width: 180px"
                            :placeholder="t('report.packingDataQuery.inputBigBoardProductCode')" />
                    </el-form-item>
                    <el-form-item :label="t('report.packingDataQuery.pnlCode')" prop="PnlCode" class="mb-2">
                        <el-input v-model="searchForm.PnlCode" clearable @clear="handleSearch" @keyup.enter="handleSearch"
                            style="width: 180px" :placeholder="t('report.packingDataQuery.inputPnlCode')" />
                    </el-form-item>
                    <el-form-item :label="t('report.packingDataQuery.smallBoardProductCode')" prop="SmallBoardProductCode"
                        class="mb-2">
                        <el-input v-model="searchForm.SmallBoardProductCode" clearable @clear="handleSearch"
                            @keyup.enter="handleSearch" style="width: 180px"
                            :placeholder="t('report.packingDataQuery.inputSmallBoardProductCode')" />
                    </el-form-item>
                    <el-form-item :label="t('report.packingDataQuery.finishedCode')" prop="FinishedCode" class="mb-2">
                        <el-input v-model="searchForm.FinishedCode" clearable @clear="handleSearch"
                            @keyup.enter="handleSearch" style="width: 180px"
                            :placeholder="t('report.packingDataQuery.inputFinishedCode')" />
                    </el-form-item>
                    <el-form-item :label="t('report.packingDataQuery.parentSN')" prop="ParentSN" class="mb-2">
                        <el-input v-model="searchForm.ParentSN" clearable @clear="handleSearch" @keyup.enter="handleSearch"
                            style="width: 180px" :placeholder="t('report.packingDataQuery.inputParentSN')" />
                    </el-form-item>
                    <el-form-item :label="t('report.packingDataQuery.insertDate')" prop="TimeRange" class="mb-2">
                        <el-date-picker style="width: 350px;" v-model="queryTime" type="datetimerange"
                            range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                            value-format="YYYY-MM-DD HH:mm:ss" :shortcuts="shortcuts1" :default-time="[
                                new Date(2000, 1, 1, 0, 0, 0),
                                new Date(2000, 1, 1, 23, 59, 59),
                            ]" :clearable="false" @change="handleDateRangeChange" />
                    </el-form-item>
                    <el-form-item class="mb-2">
                        <el-button type="primary" @click="handleSearch">{{ t("publicText.query") }}</el-button>
                        <el-button @click="handleReset">{{ t("publicText.reset") }}</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <el-table :data="pagedTableData" size="small" ref="eltableRef" :style="{ width: '100%' }" :height="tableHeight"
                border fit highlight-current-row v-loading="loading"
                :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }">
                <el-table-column type="index" align="center" fixed :label="t('publicText.index')" width="60">
                    <template #default="scope">
                        <span>{{ scope.$index + pageObj.pageSize * (pageObj.currentPage - 1) + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="WorkOrder" fixed :label="t('report.packingDataQuery.workOrder')"
                    :min-width="getColumnWidth('WorkOrder')" show-overflow-tooltip />
                <el-table-column prop="ProductName" :label="t('report.packingDataQuery.productName')"
                    :min-width="getColumnWidth('ProductName')" show-overflow-tooltip />
                <el-table-column prop="Box" :label="t('report.packingDataQuery.box')"
                    :min-width="getColumnWidth('Box')" show-overflow-tooltip />
                <el-table-column prop="BoxType" :label="t('report.packingDataQuery.boxType')"
                    :min-width="getColumnWidth('BoxType')" align="center" show-overflow-tooltip />
                <el-table-column prop="CaseNo" :label="t('report.packingDataQuery.caseNo')"
                    :min-width="getColumnWidth('CaseNo')" align="center" show-overflow-tooltip />
                <el-table-column prop="ParentSN" :label="t('report.packingDataQuery.parentSN')"
                    :min-width="getColumnWidth('ParentSN')" show-overflow-tooltip />
                <el-table-column prop="SNNumber" :label="t('report.packingDataQuery.snNumber')"
                    :min-width="getColumnWidth('SNNumber')" show-overflow-tooltip />
                <el-table-column prop="BigBoardProductCode" :label="t('report.packingDataQuery.bigBoardProductCode')"
                    :min-width="getColumnWidth('BigBoardProductCode')" show-overflow-tooltip />
                <el-table-column prop="PnlCode" :label="t('report.packingDataQuery.pnlCode')"
                    :min-width="getColumnWidth('PnlCode')" show-overflow-tooltip />
                <el-table-column prop="SmallBoardProductCode" :label="t('report.packingDataQuery.smallBoardProductCode')"
                    :min-width="getColumnWidth('SmallBoardProductCode')" show-overflow-tooltip />
                <el-table-column prop="StatusName" :label="t('report.packingDataQuery.status')"
                    :min-width="getColumnWidth('StatusName')" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.Status === 0 ? 'info' : 'success'" size="small">
                            {{ row.StatusName }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="IsInMESLine" :label="t('report.packingDataQuery.isInMESLine')"
                    :min-width="getColumnWidth('IsInMESLine')" align="center">
                    <template #default="{ row }">
                        <el-tag v-if="row.IsInMESLine" type="success" size="small">
                            {{ t('publicText.yes') }}
                        </el-tag>
                        <el-tag v-else type="info" size="small">
                            {{ t('publicText.no') }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="InsertDate" :label="t('report.packingDataQuery.insertDate')"
                    :min-width="getColumnWidth('InsertDate')">
                    <template #default="{ row }">
                        {{ formatDate(row.InsertDate) }}
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
import { QueryPackingData } from "@/api/report/index";
import { shortcuts1 } from "@/utils/dataMenu";
import {
    ref,
    reactive,
    computed,
    onMounted,
    watch,
} from "vue";
import { ElMessage } from "element-plus";
import { useTableColumnWidth } from '@/hooks/useTableColumnWidth';
import { useTableHeight } from '@/hooks/useTableHeight';
import dayjs from 'dayjs';
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const loading = ref(false);
const eltableRef = ref();
const { tableHeight, calcTableHeight } = useTableHeight(eltableRef);
const tableData = ref<any[]>([]);
const total = ref(0);

const queryTime = ref<any[]>([]);

const searchForm = reactive({
    WorkOrder: "",
    Box: "",
    SNNumber: "",
    BigBoardProductCode: "",
    PnlCode: "",
    SmallBoardProductCode: "",
    FinishedCode: "",
    ParentSN: "",
    StartDate: "",
    EndDate: "",
});

const pageObj = reactive({
    currentPage: 1,
    pageSize: 50,
});

const pagedTableData = computed(() => {
    const start = (pageObj.currentPage - 1) * pageObj.pageSize;
    const end = start + pageObj.pageSize;
    return tableData.value.slice(start, end);
});

const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === "1900-01-01T00:00:00") return "-";
    return dayjs(dateStr).format("YYYY-MM-DD HH:mm:ss");
};

const { getColumnWidth } = useTableColumnWidth(eltableRef, tableData, {
    excludeLabels: [t('publicText.index')]
});

const handleDateRangeChange = (val: any[]) => {
    searchForm.StartDate = val?.[0] || "";
    searchForm.EndDate = val?.[1] || "";
};

const getData = () => {
    loading.value = true;
    const params = {
        WorkOrder: searchForm.WorkOrder || "",
        Box: searchForm.Box || "",
        SNNumber: searchForm.SNNumber || "",
        BigBoardProductCode: searchForm.BigBoardProductCode || "",
        PnlCode: searchForm.PnlCode || "",
        SmallBoardProductCode: searchForm.SmallBoardProductCode || "",
        FinishedCode: searchForm.FinishedCode || "",
        ParentSN: searchForm.ParentSN || "",
        StartDate: searchForm.StartDate || "",
        EndDate: searchForm.EndDate || "",
    };
    QueryPackingData(params)
        .then((res: any) => {
            if (res.Success && Array.isArray(res.Data)) {
                tableData.value = res.Data;
                total.value = res.Data.length;
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

const handleReset = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    queryTime.value = [
        `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}-${String(start.getDate()).padStart(2, "0")} 00:00:00`,
        `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, "0")}-${String(end.getDate()).padStart(2, "0")} 23:59:59`,
    ];
    searchForm.StartDate = queryTime.value[0] || "";
    searchForm.EndDate = queryTime.value[1] || "";
    searchForm.WorkOrder = "";
    searchForm.Box = "";
    searchForm.SNNumber = "";
    searchForm.BigBoardProductCode = "";
    searchForm.PnlCode = "";
    searchForm.SmallBoardProductCode = "";
    searchForm.FinishedCode = "";
    searchForm.ParentSN = "";
    pageObj.currentPage = 1;
    getData();
};

const handleSizeChange = (val: number) => {
    pageObj.pageSize = val;
    pageObj.currentPage = 1;
};

const handleCurrentChange = (val: number) => {
    pageObj.currentPage = val;
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
