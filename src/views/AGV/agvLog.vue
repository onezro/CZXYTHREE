<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between">
                <el-form ref="searchFormRef" :model="searchForm" label-width="auto" :inline="true" :size="'small'"
                    @submit.prevent>
                    <el-form-item :label="t('AGV.agvLog.timeRange')" prop="TimeRange" class="mb-2">
                        <el-date-picker style="width: 330px;" v-model="queryTime" type="datetimerange" range-separator="-"
                            start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD HH:mm:ss"
                            :shortcuts="shortcuts1" :default-time="[
                                new Date(2000, 1, 1, 0, 0, 0),
                                new Date(2000, 1, 1, 23, 59, 59),
                            ]" :clearable="false" @change="handleDateRangeChange" :disabled-date="disabledDate" />
                    </el-form-item>
                    <el-form-item :label="t('AGV.agvLog.lineName')" prop="LineName" class="mb-2">
                        <el-select v-model="searchForm.LineName" clearable filterable @change="handleSearch"
                            style="width: 180px" :placeholder="t('AGV.agvLog.selectLineName')">
                            <el-option v-for="(item, idx) in lineList" :key="'ln-' + idx" :label="getLineLabel(item)"
                                :value="getLineValue(item)" />
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="t('AGV.agvLog.point')" prop="Point" class="mb-2">
                        <el-input v-model="searchForm.Point" clearable @clear="handleSearch" @keyup.enter="handleSearch"
                            style="width: 180px" :placeholder="t('AGV.agvLog.inputPoint')" />
                    </el-form-item>
                    <el-form-item :label="t('AGV.agvLog.boxNo')" prop="BoxNo" class="mb-2">
                        <el-input v-model="searchForm.BoxNo" clearable @clear="handleSearch" @keyup.enter="handleSearch"
                            style="width: 180px" :placeholder="t('AGV.agvLog.inputBoxNo')" />
                    </el-form-item>
                    <el-form-item :label="t('AGV.agvLog.success')" prop="Success" class="mb-2">
                        <el-select v-model="searchForm.Success" clearable @change="handleSearch" style="width: 180px"
                            :placeholder="t('AGV.agvLog.selectSuccess')">
                            <el-option :label="t('AGV.agvLog.successY')" value="Y" />
                            <el-option :label="t('AGV.agvLog.successN')" value="N" />
                        </el-select>
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
                <el-table-column prop="LineName" fixed :label="t('AGV.agvLog.lineName')"
                    :min-width="getColumnWidth('LineName')" show-overflow-tooltip />
                <el-table-column prop="Point" :label="t('AGV.agvLog.point')"
                    :min-width="getColumnWidth('Point')" show-overflow-tooltip />
                <el-table-column prop="BoxNo" :label="t('AGV.agvLog.boxNo')"
                    :min-width="getColumnWidth('BoxNo')" />
                <el-table-column prop="Success" :label="t('AGV.agvLog.success')"
                    :min-width="getColumnWidth('Success')" align="center">
                    <template #default="{ row }">
                        <el-tag v-if="row.Success === 'Y'" type="success" size="small">
                            {{ t('AGV.agvLog.successY') }}
                        </el-tag>
                        <el-tag v-else-if="row.Success === 'N'" type="danger" size="small">
                            {{ t('AGV.agvLog.successN') }}
                        </el-tag>
                        <el-tag v-else type="info" size="small">
                            {{ row.Success }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="Code" :label="t('AGV.agvLog.code')"
                    :min-width="getColumnWidth('Code')" align="center" />
                <el-table-column prop="Message" :label="t('AGV.agvLog.message')"
                    :min-width="getColumnWidth('Message')" show-overflow-tooltip />
                <el-table-column :label="t('publicText.operation')" :fixed="'right'" width="110" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" @click="viewJson(row)">
                            {{ t('AGV.agvLog.viewMessage') }}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="InsertDateTime" :label="t('AGV.agvLog.insertDateTime')"
                    :min-width="getColumnWidth('InsertDateTime')">
                    <template #default="{ row }">
                        {{ formatDate(row.InsertDateTime) }}
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
                    :page-size="pageObj.pageSize" :page-sizes="[20, 30, 50, 100, 200]"
                    layout="total, sizes, prev, pager, next" :total="total" />
            </div>
        </el-card>

        <el-dialog v-model="jsonDialogVisible" :title="t('AGV.agvLog.detail')" width="80%" top="5vh"
            :close-on-click-modal="false" :close-on-press-escape="false" align-center>
            <div class="dialog-info-bar">
                <div class="info-item">
                    <span class="info-label">{{ t('AGV.agvLog.lineName') }}:</span>
                    <el-tag type="primary" effect="plain">{{ currentRow.LineName }}</el-tag>
                </div>
                <div class="info-item">
                    <span class="info-label">{{ t('AGV.agvLog.point') }}:</span>
                    <el-tag type="primary" effect="plain">{{ currentRow.Point }}</el-tag>
                </div>
                <div class="info-item">
                    <span class="info-label">{{ t('AGV.agvLog.boxNo') }}:</span>
                    <el-tag type="primary" effect="plain">{{ currentRow.BoxNo }}</el-tag>
                </div>
                <div class="info-item">
                    <span class="info-label">{{ t('AGV.agvLog.success') }}:</span>
                    <el-tag effect="plain" :type="currentRow.Success === 'Y' ? 'success' : 'danger'" size="small">
                        {{ currentRow.Success === 'Y' ? t('AGV.agvLog.successY') : t('AGV.agvLog.successN') }}
                    </el-tag>
                </div>
                <div class="info-item">
                    <span class="info-label">{{ t('AGV.agvLog.code') }}:</span>
                    <el-tag type="primary" effect="plain">{{ currentRow.Code }}</el-tag>
                </div>
                <div class="info-item">
                    <span class="info-label">{{ t('AGV.agvLog.insertDateTime') }}:</span>
                    <el-tag type="primary" effect="plain">{{ formatDate(currentRow.InsertDateTime) }}</el-tag>
                </div>
                <div class="info-item">
                    <span class="info-label">{{ t('AGV.agvLog.message') }}:</span>
                    <el-tag type="primary" effect="plain">{{ currentRow.Message }}</el-tag>
                </div>
            </div>
            <div class="json-container">
                <div class="json-left">
                    <div class="json-header">
                        <span>{{ t('AGV.agvLog.requestJson') }}</span>
                        <el-button type="success" size="small" @click="copyRequestJson">
                            {{ t('publicText.copy') }}
                        </el-button>
                    </div>
                    <pre class="json-pre">{{ formattedRequestJson }}</pre>
                </div>
                <div class="json-right">
                    <div class="json-header">
                        <span>{{ t('AGV.agvLog.responseJson') }}</span>
                        <el-button type="success" size="small" @click="copyResponseJson">
                            {{ t('publicText.copy') }}
                        </el-button>
                    </div>
                    <pre class="json-pre">{{ formattedResponseJson }}</pre>
                </div>
            </div>
            <template #footer>
                <el-button @click="jsonDialogVisible = false">{{ t('publicText.close') }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { QueryAGVTriggerLogPage, GetAllValorLine } from "@/api/AGV/index";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import { shortcuts1 } from "@/utils/dataMenu";
import { ref, reactive, onMounted, nextTick, watch } from "vue";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
import dayjs from "dayjs";

const { t } = useI18n();

const searchFormRef = ref();
const eltableRef = ref();
const tableHeight = ref(0);
const total = ref(0);
const tableData = ref<any[]>([]);

const queryTime = ref<any[]>([]);

const searchForm = reactive({
    LineName: "",
    Point: "",
    BoxNo: "",
    Success: "",
    StartTime: "",
    EndTime: "",
});

const lineList = ref<any[]>([]);

const getLineValue = (item: any) => {
    if (!item) return "";
    return typeof item === "object" ? (item.line ?? "") : String(item);
};
const getLineLabel = (item: any) => getLineValue(item);

const loadLines = () => {
    GetAllValorLine({}).then((res: any) => {
        if (res.Data && Array.isArray(res.Data)) {
            lineList.value = res.Data;
        }
    });
};

const pageObj = reactive({
    currentPage: 1,
    pageSize: 30,
});

const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === "1900-01-01T00:00:00") return "";
    return dayjs(dateStr).format("YYYY-MM-DD HH:mm:ss");
};

const { getColumnWidth } = useTableColumnWidth(eltableRef, tableData, {
    excludeLabels: [t('publicText.index'), t('publicText.operation')]
});

const handleDateRangeChange = (val: any[]) => {
    searchForm.StartTime = val?.[0] || "";
    searchForm.EndTime = val?.[1] || "";
};

const disabledDate = (time: Date) => {
    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return time.getTime() < oneMonthAgo.getTime() || time.getTime() > now.getTime();
};

const getData = () => {
    const params = {
        LineName: searchForm.LineName || "",
        Point: searchForm.Point || "",
        BoxNo: searchForm.BoxNo || "",
        Success: searchForm.Success || "",
        StartTime: searchForm.StartTime || "",
        EndTime: searchForm.EndTime || "",
        PageIndex: pageObj.currentPage,
        PageSize: pageObj.pageSize,
    };
    QueryAGVTriggerLogPage(params)
        .then((res: any) => {
            if (res.Success) {
                tableData.value = res.Data?.rows || [];
                total.value = res.Data?.total || 0;
            } else {
                tableData.value = [];
                total.value = 0;
                ElMessage.warning(res.Message || t("message.queryFailure"));
            }
        })
        .catch(() => {
            tableData.value = [];
            total.value = 0;
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
    searchForm.LineName = "";
    searchForm.Point = "";
    searchForm.BoxNo = "";
    searchForm.Success = "";
    pageObj.currentPage = 1;
    getData();
};

const jsonDialogVisible = ref(false);
const formattedRequestJson = ref("");
const formattedResponseJson = ref("");
const currentRow = reactive({
    LineName: "",
    Point: "",
    BoxNo: "",
    Success: "",
    Code: "",
    Message: "",
    InsertDateTime: "",
});

const formatJsonStr = (jsonStr: string) => {
    if (!jsonStr) return "";
    try {
        return JSON.stringify(JSON.parse(jsonStr), null, 2);
    } catch {
        return jsonStr;
    }
};

const viewJson = (row: any) => {
    currentRow.LineName = row.LineName || "";
    currentRow.Point = row.Point || "";
    currentRow.BoxNo = row.BoxNo || "";
    currentRow.Success = row.Success || "";
    currentRow.Code = row.Code ?? "";
    currentRow.Message = row.Message || "";
    currentRow.InsertDateTime = row.InsertDateTime || "";
    formattedRequestJson.value = formatJsonStr(row.RequestJson);
    formattedResponseJson.value = formatJsonStr(row.ResponseJson);
    jsonDialogVisible.value = true;
};

const fallbackCopy = (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    try {
        const successful = document.execCommand("copy");
        if (successful) {
            ElMessage.success(t("publicText.copySuccess"));
        } else {
            ElMessage.error(t("publicText.copyFailure"));
        }
    } catch {
        ElMessage.error(t("publicText.copyFailure"));
    } finally {
        document.body.removeChild(textarea);
    }
};

const copyText = (text: string) => {
    if (!text) {
        ElMessage.warning(t("publicText.empty"));
        return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            ElMessage.success(t("publicText.copySuccess"));
        }).catch(() => {
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
};

const copyRequestJson = () => {
    copyText(formattedRequestJson.value);
};

const copyResponseJson = () => {
    copyText(formattedResponseJson.value);
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
    loadLines();
    handleReset();
});
</script>

<style lang="scss" scoped>
.el-pagination {
    justify-content: center;
}

.dialog-info-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    padding: 12px 16px;
    background-color: #f5f7fa;
    border-radius: 4px;
    margin-bottom: 16px;
    border: 1px solid #ebeef5;
}

.info-item {
    display: flex;
    align-items: center;
    gap: 6px;
}

.info-label {
    font-size: 13px;
    color: #606266;
    font-weight: 500;
}

.json-container {
    display: flex;
    gap: 16px;
    max-height: 500px;
    overflow: hidden;
}

.json-left,
.json-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.json-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background-color: #f0f2f5;
    border-radius: 4px 4px 0 0;
    font-weight: bold;
    font-size: 14px;
}

.json-pre {
    font-family: "Consolas", "Monaco", "Courier New", monospace;
    font-size: 12px;
    line-height: 1.6;
    color: #333;
    background-color: #f5f5f5;
    padding: 12px;
    border-radius: 0 0 4px 4px;
    white-space: pre-wrap;
    word-break: break-all;
    margin: 0;
    flex: 1;
    overflow: auto;
    border-top: 1px solid #e4e7ed;
}
</style>
