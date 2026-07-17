<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <el-form ref="formRef" :inline="true" size="small" label-width="auto" @submit.native.prevent>
                <el-form-item :label="t('permissions.operationLog.timeRange')" prop="TimeRange" class="mb-2">
                    <el-date-picker v-model="queryTime" type="datetimerange" range-separator="-"
                        start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD HH:mm:ss"
                        :shortcuts="shortcuts1" :default-time="[
                            new Date(2000, 1, 1, 0, 0, 0),
                            new Date(2000, 1, 1, 23, 59, 59),
                        ]" :clearable="false" @change="handleDateRangeChange" :disabled-date="disabledDate" />
                </el-form-item>
                <el-form-item class="mb-2">
                    <el-button :type="'primary'" @click="getData">{{
                        t("publicText.query")
                        }}</el-button>
                    <el-button @click="resetForm">{{ t("publicText.reset") }}</el-button>
                </el-form-item>
            </el-form>

            <el-table ref="tableMasterRef" :data="tableData" size="small" :style="{ width: '100%' }"
                :height="tableHeight" :tooltip-effect="'dark'" border fit highlight-current-row @row-click="viewJson">
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{
                            scope.$index + getForm.PageSize * (getForm.PageIndex - 1) + 1
                            }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="t('permissions.operationLog.ipAddress')" prop="IpAddress"
                    :min-width="getColumnWidth('IpAddress')" />
                <el-table-column :label="t('permissions.operationLog.requestUrl')" prop="RequestUrl"
                    :min-width="getColumnWidth('RequestUrl')" />
                <el-table-column :label="t('permissions.operationLog.requestType')" prop="RequestType"
                    :min-width="getColumnWidth('RequestType')" />
                <el-table-column :label="t('permissions.operationLog.requestDateTime')" prop="RequestDateime"
                    :min-width="getColumnWidth('RequestDateime')" />
                <el-table-column :label="t('permissions.operationLog.returnDateTime')" prop="ReturnDateime"
                    :min-width="getColumnWidth('ReturnDateime')" />
                <el-table-column :label="t('permissions.operationLog.returnStatus')" prop="ReturnStatus"
                    :min-width="getColumnWidth('ReturnStatus')">
                    <template #default="scope">
                        <el-tag :type="scope.row.ReturnStatus ? 'success' : 'danger'">
                            {{
                                scope.row.ReturnStatus
                                    ? t("permissions.operationLog.success")
                                    : t("permissions.operationLog.failed")
                            }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column :label="t('permissions.operationLog.isMESApi')" prop="IsMESApi"
                    :min-width="getColumnWidth('IsMESApi')">
                    <template #default="scope">
                        <el-tag :type="scope.row.IsMESApi ? 'primary' : 'info'">
                            {{
                                scope.row.IsMESApi
                                    ? t("permissions.operationLog.yes")
                                    : t("permissions.operationLog.no")
                            }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column :label="t('permissions.operationLog.requestJson')" prop="RequestJson">
                    <template #default="scope">
                        <el-button type="primary" size="small" @click="viewJson(scope.row)">
                            {{
                                (scope.row.RequestJson || "").length > 0
                                    ? `${(scope.row.RequestJson || "").length
                                    }${t("permissions.operationLog.characters")}`
                            : t("publicText.empty")
                            }}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column :label="t('permissions.operationLog.returnJson')" prop="ReturnJson">
                    <template #default="scope">
                        <el-button type="primary" size="small" @click="viewJson(scope.row)">
                            {{
                                (scope.row.ReturnJson || "").length > 0
                                    ? `${(scope.row.ReturnJson || "").length
                                    }${t("permissions.operationLog.characters")}`
                            : t("publicText.empty")
                            }}
                        </el-button>
                    </template>
                </el-table-column>
                <template #empty>
                    <div class="flex items-center justify-center h-100%">
                        <el-empty />
                    </div>
                </template>
            </el-table>

            <div class="mt-2 mb-1">
                <el-pagination :size="'small'" background @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :pager-count="5" :current-page="getForm.PageIndex"
                    :page-size="getForm.PageSize" :page-sizes="[20, 50, 100, 200]"
                    layout="total,sizes, prev, pager, next" :total="total">
                </el-pagination>
            </div>
        </el-card>

        <el-dialog v-model="jsonDialogVisible" :title="t('permissions.operationLog.detail')" width="80%" top="5vh"
            :close-on-click-modal="false" :close-on-press-escape="false" align-center>
            <div class="dialog-info-bar">
                <div class="info-item">
                    <span class="info-label">{{ t("permissions.operationLog.requestUrl") }}:</span>
                    <!-- <span class="info-value">{{ currentRow.RequestUrl }}</span> -->
                    <el-tag type="primary" effect="plain">{{ currentRow.RequestUrl }}</el-tag>
                </div>
                <div class="info-item">
                    <span class="info-label">{{ t("permissions.operationLog.requestType") }}:</span>
                    <el-tag effect="plain" :type="currentRow.RequestType === 'POST' ? 'success' : 'primary'" size="small">{{
                        currentRow.RequestType }}</el-tag>
                </div>
                <div class="info-item">
                    <span class="info-label">{{ t("permissions.operationLog.requestDateTime") }}:</span>
                    <el-tag type="primary" effect="plain">{{ currentRow.RequestDateime }}</el-tag>
                </div>
                <div class="info-item">
                    <span class="info-label">{{ t("permissions.operationLog.returnDateTime") }}:</span>
                    <el-tag type="primary" effect="plain">{{ currentRow.ReturnDateime }}</el-tag>
                </div>
                <div class="info-item">
                    <span class="info-label">{{ t("permissions.operationLog.returnStatus") }}:</span>
                    <el-tag effect="plain" :type="currentRow.ReturnStatus ? 'success' : 'danger'" size="small">{{
                        currentRow.ReturnStatus ? t("permissions.operationLog.success") : t("permissions.operationLog.failed")
                    }}</el-tag>
                </div>
            </div>
            <div class="json-container">
                <div class="json-left">
                    <div class="json-header">
                        <span>{{ t("permissions.operationLog.requestJson") }}</span>
                        <el-button type="text" size="small" @click="copyRequestJson">{{
                            t("publicText.copy")
                            }}</el-button>
                    </div>
                    <pre class="json-pre">{{ formattedRequestJson }}</pre>
                </div>
                <div class="json-right">
                    <div class="json-header">
                        <span>{{ t("permissions.operationLog.returnJson") }}</span>
                        <el-button type="text" size="small" @click="copyReturnJson">{{
                            t("publicText.copy")
                            }}</el-button>
                    </div>
                    <pre class="json-pre">{{ formattedReturnJson }}</pre>
                </div>
            </div>
            <template #footer>
                <el-button @click="jsonDialogVisible = false">{{
                    t("publicText.close")
                    }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { QueryOperationLog } from "@/api/Scheduling/index";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import { shortcuts1 } from "@/utils/dataMenu";
import { ref, reactive, onMounted, nextTick, watch } from "vue";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
const { t } = useI18n();

const formRef = ref();
const tableMasterRef = ref();
const tableHeight = ref();
const total = ref(0);

const queryTime = ref<any[]>([]);

const getForm = reactive({
    StartTime: "",
    EndTime: "",
    PageIndex: 1,
    PageSize: 20,
});

const tableData = ref([]);

const { getColumnWidth } = useTableColumnWidth(tableMasterRef, tableData, {
    excludeLabels: [t("publicText.index"), t("publicText.operation")],
});

const dialogVisible = ref(false);
const detailForm = reactive({
    RequestJson: "",
    ReturnJson: "",
});

const jsonDialogVisible = ref(false);
const formattedRequestJson = ref("");
const formattedReturnJson = ref("");
const currentRow = reactive({
    RequestUrl: "",
    RequestType: "",
    RequestDateime: "",
    ReturnDateime: "",
    ReturnStatus: false,
});

const formatJsonStr = (jsonStr: string) => {
    if (!jsonStr) return "";
    try {
        const parsed = JSON.parse(jsonStr);
        return JSON.stringify(parsed, null, 2);
    } catch {
        return jsonStr;
    }
};

const viewJson = (row: any) => {
    currentRow.RequestUrl = row.RequestUrl || "";
    currentRow.RequestType = row.RequestType || "";
    currentRow.RequestDateime = row.RequestDateime || "";
    currentRow.ReturnDateime = row.ReturnDateime || "";
    currentRow.ReturnStatus = row.ReturnStatus || false;
    formattedRequestJson.value = formatJsonStr(row.RequestJson);
    formattedReturnJson.value = formatJsonStr(row.ReturnJson);
    jsonDialogVisible.value = true;
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

const copyRequestJson = () => {
    copyText(formattedRequestJson.value);
};

const copyReturnJson = () => {
    copyText(formattedReturnJson.value);
};

const handleDateRangeChange = (val: any[]) => {
    getForm.StartTime = val[0] || "";
    getForm.EndTime = val[1] || "";
};

const disabledDate = (time: Date) => {
    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return time.getTime() < oneMonthAgo.getTime() || time.getTime() > now.getTime();
};

const getData = () => {
    QueryOperationLog(getForm).then((res: any) => {
        if (res.Success) {
            tableData.value = res.Data?.rows || [];
            total.value = res.Data?.total || 0;
        }
    });
};

const viewDetail = (row: any) => {
    detailForm.RequestJson = row.RequestJson || "";
    detailForm.ReturnJson = row.ReturnJson || "";
    dialogVisible.value = true;
};

const truncateJson = (jsonStr: string) => {
    if (!jsonStr) return "";
    const maxLength = 100;
    return jsonStr.length > maxLength
        ? jsonStr.substring(0, maxLength) + "..."
        : jsonStr;
};

const resetForm = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    queryTime.value = [
        `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}-${String(start.getDate()).padStart(2, "0")} 00:00:00`,
        `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, "0")}-${String(end.getDate()).padStart(2, "0")} 23:59:59`,
    ];
    getForm.StartTime = queryTime.value[0] || "";
    getForm.EndTime = queryTime.value[1] || "";
    getForm.PageIndex = 1;
    getData();
};

const handleSizeChange = (val: number) => {
    getForm.PageSize = val;
    getForm.PageIndex = 1;
    getData();
};

const handleCurrentChange = (val: number) => {
    getForm.PageIndex = val;
    getData();
};

const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 190;
    });
};
watch(
    () => queryTime.value,
    (newVal: any[]) => {
        handleDateRangeChange(newVal);
    },
);
onMounted(() => {
    getScreenHeight();
    resetForm();
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

.info-value {
    font-size: 13px;
    color: #303133;
    font-weight: 500;
    max-width: 400px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
