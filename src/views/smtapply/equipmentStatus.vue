<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <el-form ref="searchFormRef" :model="searchForm" label-width="auto" :inline="true" :size="'small'"
                @submit.prevent>
                <el-form-item :label="t('smtapply.equipmentStatus.equipmentCode')" prop="EquipmentCode" class="mb-2">
                    <el-input v-model="searchForm.EquipmentCode" clearable @clear="handleSearch"
                        @keyup.enter="handleSearch" style="width: 200px"
                        :placeholder="t('smtapply.equipmentStatus.equipmentCodePlaceholder')" />
                </el-form-item>
                <el-form-item :label="t('smtapply.equipmentStatus.timeRange')" prop="TimeRange" class="mb-2">
                    <el-date-picker style="width: 330px;" v-model="queryTime" type="datetimerange" range-separator="-"
                        start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD HH:mm:ss"
                        :shortcuts="shortcuts1" :default-time="[
                            new Date(2000, 1, 1, 0, 0, 0),
                            new Date(2000, 1, 1, 23, 59, 59),
                        ]" :clearable="false" @change="handleDateRangeChange" :disabled-date="disabledDate" />
                </el-form-item>
                <el-form-item class="mb-2">
                    <el-button type="primary" @click="handleSearch">{{ t("publicText.query") }}</el-button>
                    <el-button @click="handleReset">{{ t("publicText.reset") }}</el-button>
                </el-form-item>
            </el-form>

            <el-table :data="tableData" size="small" ref="eltableRef"  :style="{ width: '100%' }"
                :height="tableHeight" :tooltip-effect="'dark'" border fit highlight-current-row
                :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }">
                <el-table-column type="index" align="center" fixed :label="t('publicText.index')" width="50">
                    <template #default="{ $index }">
                        <span>{{ $index + pageObj.pageSize * (pageObj.currentPage - 1) + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="EquipmentCode" :label="t('smtapply.equipmentStatus.equipmentCode')"
                    :min-width="getColumnWidth('EquipmentCode')" show-overflow-tooltip />
                <el-table-column prop="EquipmentName" :label="t('smtapply.equipmentStatus.equipmentName')"
                    :min-width="getColumnWidth('EquipmentName')" show-overflow-tooltip />
                <el-table-column prop="OperationName" :label="t('smtapply.equipmentStatus.operationName')"
                    :min-width="getColumnWidth('OperationName')" show-overflow-tooltip />
                <el-table-column prop="StatusDesc" :label="t('smtapply.equipmentStatus.statusDesc')"
                    :min-width="getColumnWidth('StatusDesc')" align="center" >
                    <template #default="{ row }">
                        <el-tag size="small" :type="getStatusTagType(row.StatusDesc)" >
                            {{ getStatusText(row.StatusDesc) }}
                        </el-tag>
                    </template>
                </el-table-column>
               
                <el-table-column prop="DurationSecond" :label="t('smtapply.equipmentStatus.durationSecond')"
                    :min-width="getColumnWidth('DurationSecond')" align="center" />
                <el-table-column prop="DurationHour" :label="t('smtapply.equipmentStatus.durationHour')"
                    :min-width="getColumnWidth('DurationHour')" align="center" />
                     <el-table-column prop="StartDateTime" :label="t('smtapply.equipmentStatus.startDateTime')"
                    width="160">
                    <template #default="{ row }">
                        {{ formatDate(row.StartDateTime) }}
                    </template>
                </el-table-column>
                <el-table-column prop="EndDateTime" :label="t('smtapply.equipmentStatus.endDateTime')"
                    width="160">
                    <template #default="{ row }">
                        {{ formatDate(row.EndDateTime) }}
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
import { QueryEquipmentColStatus } from "@/api/smtApply/equipmentStatus";
import { shortcuts1 } from "@/utils/dataMenu";
import { ref, reactive, nextTick, onMounted, onBeforeUnmount } from "vue";
import { ElMessage } from "element-plus";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import dayjs from "dayjs";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const loading = ref(false);
const tableHeight = ref(0);
const eltableRef = ref();
const tableData = ref<any[]>([]);
const total = ref(0);
const queryTime = ref<any[]>([]);

const searchForm = reactive({
    EquipmentCode: "",
    StartTime: "",
    EndTime: "",
});

const pageObj = reactive({
    currentPage: 1,
    pageSize: 20,
});

const { getColumnWidth } = useTableColumnWidth(eltableRef, tableData, {
    excludeLabels: [t("publicText.index")],
});

const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === "1900-01-01T00:00:00") return "";
    return dayjs(dateStr).format("YYYY-MM-DD HH:mm:ss");
};

// 设备状态标签颜色：Run=运行 / ErrorStop=故障停机(红) / ChangeStop=换线停机(橙) / WaitStart=等待开机(灰)
const getStatusTagType = (status: string): "primary" | "success" | "info" | "warning" | "danger" => {
    switch (status) {
        case "Run": return "primary";
        case "ErrorStop": return "danger";
        case "ChangeStop": return "warning";
        case "WaitStart": return "info";
        default: return "info";
    }
};

// 设备状态文案映射
const getStatusText = (status: string) => {
    switch (status) {
        case "Run": return t("smtapply.equipmentStatus.statusRun");
        case "ErrorStop": return t("smtapply.equipmentStatus.statusErrorStop");
        case "ChangeStop": return t("smtapply.equipmentStatus.statusChangeStop");
        case "WaitStart": return t("smtapply.equipmentStatus.statusWaitStart");
        default: return status || "-";
    }
};

const disabledDate = (time: Date) => {
    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return time.getTime() < oneMonthAgo.getTime() || time.getTime() > now.getTime();
};

const handleDateRangeChange = (val: any[]) => {
    searchForm.StartTime = val?.[0] || "";
    searchForm.EndTime = val?.[1] || "";
};

const getData = () => {
    loading.value = true;
    const params = {
        EquipmentCode: searchForm.EquipmentCode || "",
        StartTime: searchForm.StartTime || "",
        EndTime: searchForm.EndTime || "",
        PageIndex: pageObj.currentPage,
        PageSize: pageObj.pageSize,
    };
    QueryEquipmentColStatus(params)
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
        dayjs(start).format("YYYY-MM-DD HH:mm:ss"),
        dayjs(end).format("YYYY-MM-DD HH:mm:ss"),
    ];
    searchForm.StartTime = queryTime.value[0] || "";
    searchForm.EndTime = queryTime.value[1] || "";
    searchForm.EquipmentCode = "";
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

onMounted(() => {
    getScreenHeight();
    window.addEventListener("resize", getScreenHeight);
    handleReset();
});

onBeforeUnmount(() => {
    window.removeEventListener("resize", getScreenHeight);
});
</script>
