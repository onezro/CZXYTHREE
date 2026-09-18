<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between">
                <el-form ref="searchFormRef" :model="searchForm" label-width="auto" :inline="true" :size="'small'"
                    @submit.prevent>
                    <el-form-item :label="t('AGV.magazineOutTask.taskNo')" prop="TaskNo" class="mb-2">
                        <el-input v-model="searchForm.TaskNo" clearable @clear="handleSearch"
                            @keyup.enter="handleSearch" style="width: 180px"
                            :placeholder="t('AGV.magazineOutTask.inputTaskNo')" />
                    </el-form-item>
                    <el-form-item :label="t('AGV.magazineOutTask.boxNo')" prop="BoxNo" class="mb-2">
                        <el-input v-model="searchForm.BoxNo" clearable @clear="handleSearch"
                            @keyup.enter="handleSearch" style="width: 180px"
                            :placeholder="t('AGV.magazineOutTask.inputBoxNo')" />
                    </el-form-item>
                    <el-form-item :label="t('AGV.magazineOutTask.status')" prop="Status" class="mb-2">
                        <el-select v-model="searchForm.Status" clearable @change="handleSearch" style="width: 180px"
                            :placeholder="t('AGV.magazineOutTask.selectStatus')">
                            <el-option :label="t('AGV.magazineOutTask.statusN')" value="N" />
                            <el-option :label="t('AGV.magazineOutTask.statusY')" value="Y" />
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="t('AGV.magazineOutTask.isEmpty')" prop="IsEmpty" class="mb-2">
                        <el-select v-model="searchForm.IsEmpty" clearable @change="handleSearch" style="width: 180px"
                            :placeholder="t('AGV.magazineOutTask.selectIsEmpty')">
                            <el-option :label="t('AGV.magazineOutTask.isEmptyY')" value="Y" />
                            <el-option :label="t('AGV.magazineOutTask.isEmptyN')" value="N" />
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="t('AGV.magazineOutTask.executionPoint')" prop="ExecutionPoint" class="mb-2">
                        <el-select v-model="searchForm.ExecutionPoint" clearable filterable @change="handleSearch"
                            style="width: 180px" :placeholder="t('AGV.magazineOutTask.selectExecutionPoint')">
                            <el-option v-for="item in pointList" :key="item.PointCode" :label="item.PointName"
                                :value="item.PointCode" />
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="t('AGV.magazineOutTask.insertTime')" prop="TimeRange" class="mb-2">
                        <el-date-picker style="width: 330px;" v-model="queryTime" type="datetimerange" range-separator="-"
                            start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD HH:mm:ss"
                            :shortcuts="shortcuts1" :default-time="[
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

            <el-table :data="tableData" size="small" ref="eltableRef" :style="{ width: '100%' }" :height="tableHeight"
                border fit highlight-current-row 
                :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }">
                <el-table-column type="index" align="center" fixed :label="t('publicText.index')" width="60">
                    <template #default="scope">
                        <span>{{ scope.$index + pageObj.pageSize * (pageObj.currentPage - 1) + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="TaskNo" fixed :label="t('AGV.magazineOutTask.taskNo')"
                    :min-width="getColumnWidth('TaskNo')" show-overflow-tooltip />
                <el-table-column prop="Status" :label="t('AGV.magazineOutTask.status')"
                    :min-width="getColumnWidth('Status')" align="center">
                    <template #default="{ row }">
                        <el-tag v-if="row.Status === 'N'" type="info" size="small">
                            {{ t('AGV.magazineOutTask.statusN') }}
                        </el-tag>
                        <el-tag v-else-if="row.Status === 'Y'" type="success" size="small">
                            {{ t('AGV.magazineOutTask.statusY') }}
                        </el-tag>
                        <el-tag v-else type="info" size="small">
                            {{ row.Status }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="ExecutionPoint" :label="t('AGV.magazineOutTask.executionPoint')"
                    :min-width="getColumnWidth('ExecutionPoint')" show-overflow-tooltip />
                <el-table-column prop="ExecutionPointName" :label="t('AGV.magazineOutTask.executionPointName')"
                    :min-width="getColumnWidth('ExecutionPointName')" show-overflow-tooltip />
                <el-table-column prop="BoxNo" :label="t('AGV.magazineOutTask.boxNo')"
                    :min-width="getColumnWidth('BoxNo')" show-overflow-tooltip />
                <el-table-column prop="BoxName" :label="t('AGV.magazineOutTask.boxName')"
                    :min-width="getColumnWidth('BoxName')" show-overflow-tooltip />
                <el-table-column prop="WorkOrder" :label="t('AGV.magazineOutTask.workOrder')"
                    :min-width="getColumnWidth('WorkOrder')" show-overflow-tooltip />
                <el-table-column prop="Side" :label="t('AGV.magazineOutTask.side')"
                    :min-width="getColumnWidth('Side')" align="center" />
                <el-table-column prop="Product" :label="t('AGV.magazineOutTask.product')"
                    :min-width="getColumnWidth('Product')" show-overflow-tooltip />
                <el-table-column prop="InventoryCategory" :label="t('AGV.magazineOutTask.inventoryCategory')"
                    :min-width="getColumnWidth('InventoryCategory')" show-overflow-tooltip />
                <el-table-column prop="IsEmpty" :label="t('AGV.magazineOutTask.isEmpty')"
                    :min-width="getColumnWidth('IsEmpty')" align="center">
                    <template #default="{ row }">
                        <el-tag v-if="row.IsEmpty === 'Y'" type="warning" size="small">
                            {{ t('AGV.magazineOutTask.isEmptyY') }}
                        </el-tag>
                        <el-tag v-else-if="row.IsEmpty === 'N'" type="success" size="small">
                            {{ t('AGV.magazineOutTask.isEmptyN') }}
                        </el-tag>
                        <el-tag v-else type="info" size="small">
                            {{ row.IsEmpty }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="InsertTime" :label="t('AGV.magazineOutTask.insertTime')"
                    :min-width="getColumnWidth('InsertTime')">
                    <template #default="{ row }">
                        {{ formatDate(row.InsertTime) }}
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
import { QueryMagazineOutTaskPage, GetExecutionPoints } from "@/api/AGV/index";
import { shortcuts1 } from "@/utils/dataMenu";
import {
    ref,
    reactive,
    nextTick,
    onMounted,
    onBeforeUnmount,
    watch,
} from "vue";
import { ElMessage } from "element-plus";
import { useTableColumnWidth } from '@/hooks/useTableColumnWidth';
import dayjs from 'dayjs';
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const loading = ref(false);
const tableHeight = ref(0);
const eltableRef = ref();
const tableData = ref<any[]>([]);
const total = ref(0);

const queryTime = ref<any[]>([]);

const searchForm = reactive({
    TaskNo: "",
    BoxNo: "",
    Status: "",
    IsEmpty: "",
    ExecutionPoint: "",
    StartTime: "",
    EndTime: "",
});

const pointList = ref<any[]>([]);

const pageObj = reactive({
    currentPage: 1,
    pageSize: 20,
});

const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === "1900-01-01T00:00:00") return "-";
    return dayjs(dateStr).format("YYYY-MM-DD HH:mm:ss");
};

const { getColumnWidth } = useTableColumnWidth(eltableRef, tableData, {
    excludeLabels: [t('publicText.index')]
});

const loadPoints = () => {
    GetExecutionPoints({}).then((res: any) => {
        if (res.Data && Array.isArray(res.Data)) {
            pointList.value = res.Data;
        }
    });
};

const handleDateRangeChange = (val: any[]) => {
    searchForm.StartTime = val?.[0] || "";
    searchForm.EndTime = val?.[1] || "";
};

const getData = () => {
    loading.value = true;
    const params = {
        TaskNo: searchForm.TaskNo || "",
        BoxNo: searchForm.BoxNo || "",
        Status: searchForm.Status || "",
        IsEmpty: searchForm.IsEmpty || "",
        ExecutionPoint: searchForm.ExecutionPoint || "",
        StartTime: searchForm.StartTime || null,
        EndTime: searchForm.EndTime || null,
        PageIndex: pageObj.currentPage,
        PageSize: pageObj.pageSize,
    };
    QueryMagazineOutTaskPage(params)
        .then((res: any) => {
            if (res.Data && res.Data.rows && Array.isArray(res.Data.rows)) {
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
    searchForm.StartTime = queryTime.value[0] || "";
    searchForm.EndTime = queryTime.value[1] || "";
    searchForm.TaskNo = "";
    searchForm.BoxNo = "";
    searchForm.Status = "";
    searchForm.IsEmpty = "";
    searchForm.ExecutionPoint = "";
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

const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 220;
    });
};

watch(
    queryTime,
    (newVal) => {
        handleDateRangeChange(newVal);
    },
);

onMounted(() => {
    getScreenHeight();
    window.addEventListener("resize", getScreenHeight);
    loadPoints();
    handleReset();
});

onBeforeUnmount(() => {
    window.removeEventListener("resize", getScreenHeight);
});
</script>

<style lang="scss" scoped>
.el-pagination {
    justify-content: center;
}
</style>
