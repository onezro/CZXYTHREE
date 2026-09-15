<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between">
                <el-form ref="searchFormRef" :model="searchForm" label-width="auto" :inline="true" :size="'small'"
                    @submit.prevent>
                    <el-form-item :label="t('AGV.containerBox.boxNo')" prop="BoxNo" class="mb-2">
                        <el-input v-model="searchForm.BoxNo" clearable @clear="handleSearch"
                            @keyup.enter="handleSearch" style="width: 180px"
                            :placeholder="t('AGV.containerBox.inputBoxNo')" />
                    </el-form-item>
                    <el-form-item :label="t('AGV.containerBox.barCode')" prop="BarCode" class="mb-2">
                        <el-input v-model="searchForm.BarCode" clearable @clear="handleSearch"
                            @keyup.enter="handleSearch" style="width: 180px"
                            :placeholder="t('AGV.containerBox.inputBarCode')" />
                    </el-form-item>
                    <el-form-item :label="t('AGV.containerBox.category')" prop="Category" class="mb-2">
                        <el-input v-model="searchForm.Category" clearable @clear="handleSearch"
                            @keyup.enter="handleSearch" style="width: 160px"
                            :placeholder="t('AGV.containerBox.inputCategory')" />
                    </el-form-item>
                    <el-form-item :label="t('AGV.containerBox.insertDt')" prop="TimeRange" class="mb-2">
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

            <el-table :data="tableData" size="small" ref="eltableRef" :style="{ width: '100%' }" :height="tableHeight"
                border fit highlight-current-row v-loading="loading"
                :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }">
                <el-table-column type="index" align="center" fixed :label="t('publicText.index')" width="60">
                    <template #default="scope">
                        <span>{{ scope.$index + pageObj.pageSize * (pageObj.currentPage - 1) + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="ContainerBox_No" fixed :label="t('AGV.containerBox.plateNo')"
                    :min-width="getColumnWidth('ContainerBox_No')" show-overflow-tooltip />
                <el-table-column prop="ContainerBox_Box" :label="t('AGV.containerBox.boxNo')"
                    :min-width="getColumnWidth('ContainerBox_Box')" show-overflow-tooltip />
                <el-table-column prop="ContainerBox_Stts" :label="t('AGV.containerBox.stts')"
                    :min-width="getColumnWidth('ContainerBox_Stts')" align="center">
                    <template #default="{ row }">
                        <el-tag v-if="row.ContainerBox_Stts === 'Y'" type="success" size="small">
                            {{ t('AGV.containerBox.sttsY') }}
                        </el-tag>
                        <el-tag v-else-if="row.ContainerBox_Stts === 'N'" type="info" size="small">
                            {{ t('AGV.containerBox.sttsN') }}
                        </el-tag>
                        <span v-else>{{ row.ContainerBox_Stts }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="ContainerBox_IsEnd" :label="t('AGV.containerBox.isEnd')"
                    :min-width="getColumnWidth('ContainerBox_IsEnd')" align="center">
                    <template #default="{ row }">
                        <el-tag v-if="row.ContainerBox_IsEnd === 1" type="warning" size="small">
                            {{ t('AGV.containerBox.isEndY') }}
                        </el-tag>
                        <el-tag v-else type="info" size="small">
                            {{ t('AGV.containerBox.isEndN') }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="ContainerBox_IsEndUser" :label="t('AGV.containerBox.isEndUser')"
                    :min-width="getColumnWidth('ContainerBox_IsEndUser')" show-overflow-tooltip />
                <el-table-column prop="ContainerBox_IsEndDt" :label="t('AGV.containerBox.isEndDt')"
                    :min-width="getColumnWidth('ContainerBox_IsEndDt')">
                    <template #default="{ row }">
                        {{ formatDate(row.ContainerBox_IsEndDt) }}
                    </template>
                </el-table-column>
                <el-table-column prop="ContainerBox_Wo" :label="t('AGV.containerBox.wo')"
                    :min-width="getColumnWidth('ContainerBox_Wo')" show-overflow-tooltip />
                <el-table-column prop="ProductCode" :label="t('AGV.containerBox.productCode')"
                    :min-width="getColumnWidth('ProductCode')" show-overflow-tooltip />
                <el-table-column prop="ProductName" :label="t('AGV.containerBox.productName')"
                    :min-width="getColumnWidth('ProductName')" show-overflow-tooltip />
                <el-table-column prop="Category" :label="t('AGV.containerBox.category')"
                    :min-width="getColumnWidth('Category')" show-overflow-tooltip />
                <el-table-column prop="ContainerBox_InsertDt" :label="t('AGV.containerBox.insertDt')"
                    :min-width="getColumnWidth('ContainerBox_InsertDt')">
                    <template #default="{ row }">
                        {{ formatDate(row.ContainerBox_InsertDt) }}
                    </template>
                </el-table-column>
                <el-table-column prop="ContainerBox_UpdateDt" :label="t('AGV.containerBox.updateDt')"
                    :min-width="getColumnWidth('ContainerBox_UpdateDt')">
                    <template #default="{ row }">
                        {{ formatDate(row.ContainerBox_UpdateDt) }}
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
import { QueryContainerBoxPage } from "@/api/AGV/index";
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
    BoxNo: "",
    BarCode: "",
    Category: "",
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
    excludeLabels: [t('publicText.index')]
});

const handleDateRangeChange = (val: any[]) => {
    searchForm.StartTime = val?.[0] || "";
    searchForm.EndTime = val?.[1] || "";
};

const getData = () => {
    loading.value = true;
    const params = {
        BoxNo: searchForm.BoxNo || "",
        BarCode: searchForm.BarCode || "",
        Category: searchForm.Category || "",
        StartTime: searchForm.StartTime || "",
        EndTime: searchForm.EndTime || "",
        PageIndex: pageObj.currentPage,
        PageSize: pageObj.pageSize,
    };
    QueryContainerBoxPage(params)
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
    searchForm.BoxNo = "";
    searchForm.BarCode = "";
    searchForm.Category = "";
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
        tableHeight.value = window.innerHeight - 180;
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
