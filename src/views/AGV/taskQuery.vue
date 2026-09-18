<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between">
                <el-form ref="searchFormRef" :model="searchForm" label-width="auto" :inline="true" :size="'small'"
                    @submit.prevent>
                    <el-form-item :label="t('AGV.taskQuery.boxNo')" prop="BoxNo" class="mb-2">
                        <el-input v-model="searchForm.BoxNo" clearable @clear="handleSearch"
                            @keyup.enter="handleSearch" style="width: 180px"
                            :placeholder="t('AGV.taskQuery.inputBoxNo')" />
                    </el-form-item>
                    <el-form-item :label="t('AGV.taskQuery.insertDate')" prop="TimeRange" class="mb-2">
                        <el-date-picker style="width: 330px;" v-model="queryTime" type="datetimerange" range-separator="-"
                            start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD HH:mm:ss"
                            :shortcuts="shortcuts1" :default-time="[
                                new Date(2000, 1, 1, 0, 0, 0),
                                new Date(2000, 1, 1, 23, 59, 59),
                            ]" :clearable="false" @change="handleDateRangeChange" :disabled-date="disabledDate" />
                    </el-form-item>
                    <el-form-item :label="t('AGV.taskQuery.startPoint')" prop="StartPoint" class="mb-2">
                        <el-input v-model="searchForm.StartPoint" clearable @clear="handleSearch"
                            @keyup.enter="handleSearch" style="width: 180px"
                            :placeholder="t('AGV.taskQuery.inputStartPoint')" />
                    </el-form-item>
                    <el-form-item :label="t('AGV.taskQuery.endPoint')" prop="EndPoint" class="mb-2">
                        <el-input v-model="searchForm.EndPoint" clearable @clear="handleSearch"
                            @keyup.enter="handleSearch" style="width: 180px"
                            :placeholder="t('AGV.taskQuery.inputEndPoint')" />
                    </el-form-item>
                    <el-form-item :label="t('AGV.taskQuery.lineName')" prop="LineName" class="mb-2">
                        <el-select v-model="searchForm.LineName" clearable filterable @change="handleSearch"
                            style="width: 180px" :placeholder="t('AGV.taskQuery.selectLineName')">
                            <el-option v-for="(item, idx) in lineList" :key="'ln-' + idx" :label="getLineLabel(item)"
                                :value="getLineValue(item)" />
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
                <el-table-column prop="TaskGuid" fixed :label="t('AGV.taskQuery.taskGuid')"
                    :min-width="getColumnWidth('TaskGuid')" show-overflow-tooltip />
                <el-table-column prop="BoxNo" :label="t('AGV.taskQuery.boxNo')"
                    :min-width="getColumnWidth('BoxNo')" />
                <el-table-column prop="ReturnStatus" :label="t('AGV.taskQuery.returnStatus')"
                    :min-width="getColumnWidth('ReturnStatus')" align="center">
                    <template #default="{ row }">
                        <el-tag v-if="row.ReturnStatus === -2" type="danger" size="small">
                            {{ t('AGV.taskQuery.returnStatusFailed') }}
                        </el-tag>
                        <el-tag v-else-if="row.ReturnStatus === -1" type="danger" size="small">
                            {{ t('AGV.taskQuery.returnStatusCanceled') }}
                        </el-tag>
                        <el-tag v-else-if="row.ReturnStatus === 0" type="info" size="small">
                            {{ t('AGV.taskQuery.returnStatusPrepare') }}
                        </el-tag>
                        <el-tag v-else-if="row.ReturnStatus === 2" type="warning" size="small">
                            {{ t('AGV.taskQuery.returnStatusStart') }}
                        </el-tag>
                        <el-tag v-else-if="row.ReturnStatus === 1" type="success" size="small">
                            {{ t('AGV.taskQuery.returnStatusDone') }}
                        </el-tag>
                        <el-tag v-else type="info" size="small">
                            {{ row.ReturnStatus }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="CylinderStatus" :label="t('AGV.taskQuery.cylinderStatus')"
                    :min-width="getColumnWidth('CylinderStatus')" align="center">
                    <template #default="{ row }">
                        <el-tag v-if="row.CylinderStatus === -2" type="danger" size="small">
                            {{ t('AGV.taskQuery.cylinderStatusFailed') }}
                        </el-tag>
                        <el-tag v-else-if="row.CylinderStatus === -1" type="danger" size="small">
                            {{ t('AGV.taskQuery.cylinderStatusCanceled') }}
                        </el-tag>
                        <el-tag v-else-if="row.CylinderStatus === 0" type="info" size="small">
                            {{ t('AGV.taskQuery.cylinderStatusPrepare') }}
                        </el-tag>
                        <el-tag v-else-if="row.CylinderStatus === 2" type="warning" size="small">
                            {{ t('AGV.taskQuery.cylinderStatusStart') }}
                        </el-tag>
                        <el-tag v-else-if="row.CylinderStatus === 1" type="success" size="small">
                            {{ t('AGV.taskQuery.cylinderStatusDone') }}
                        </el-tag>
                        <el-tag v-else type="info" size="small">
                            {{ row.CylinderStatus }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="Point" :label="t('AGV.taskQuery.point')"
                    :min-width="getColumnWidth('Point')" show-overflow-tooltip />
                <el-table-column prop="PointName" :label="t('AGV.taskQuery.pointName')"
                    :min-width="getColumnWidth('PointName')" show-overflow-tooltip />
                <el-table-column prop="StartPoint" :label="t('AGV.taskQuery.startPoint')"
                    :min-width="getColumnWidth('StartPoint')" show-overflow-tooltip />
                <el-table-column prop="StartPointName" :label="t('AGV.taskQuery.startPointName')"
                    :min-width="getColumnWidth('StartPointName')" show-overflow-tooltip />
                <el-table-column prop="EndPoint" :label="t('AGV.taskQuery.endPoint')"
                    :min-width="getColumnWidth('EndPoint')" show-overflow-tooltip />
                <el-table-column prop="EndPointName" :label="t('AGV.taskQuery.endPointName')"
                    :min-width="getColumnWidth('EndPointName')" show-overflow-tooltip />
                <el-table-column prop="LineName" :label="t('AGV.taskQuery.lineName')"
                    :min-width="getColumnWidth('LineName')" show-overflow-tooltip />
                <el-table-column prop="DeviceNo" :label="t('AGV.taskQuery.deviceNo')"
                    :min-width="getColumnWidth('DeviceNo')" show-overflow-tooltip />
                <el-table-column prop="WorkOrder" :label="t('AGV.taskQuery.workOrder')"
                    :min-width="getColumnWidth('WorkOrder')" show-overflow-tooltip />
                <el-table-column prop="Side" :label="t('AGV.taskQuery.side')"
                    :min-width="getColumnWidth('Side')" align="center" />
                <el-table-column prop="Product" :label="t('AGV.taskQuery.product')"
                    :min-width="getColumnWidth('Product')" show-overflow-tooltip />
                <el-table-column prop="IsMesTask" :label="t('AGV.taskQuery.isMesTask')"
                    :min-width="getColumnWidth('IsMesTask')" align="center">
                    <template #default="{ row }">
                        <el-tag v-if="row.IsMesTask === 1" type="success" size="small">
                            {{ t('AGV.taskQuery.isMesTaskY') }}
                        </el-tag>
                        <el-tag v-else-if="row.IsMesTask === 0" type="info" size="small">
                            {{ t('AGV.taskQuery.isMesTaskN') }}
                        </el-tag>
                        <el-tag v-else type="info" size="small">
                            {{ row.IsMesTask }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="InStoreType" :label="t('AGV.taskQuery.inStoreType')"
                    :min-width="getColumnWidth('InStoreType')" align="center" />
                <el-table-column prop="InsertDate" :label="t('AGV.taskQuery.insertDate')"
                    :min-width="getColumnWidth('InsertDate')">
                    <template #default="{ row }">
                        {{ formatDate(row.InsertDate) }}
                    </template>
                </el-table-column>
                <el-table-column prop="AgvStartDate" :label="t('AGV.taskQuery.agvStartDate')"
                    :min-width="getColumnWidth('AgvStartDate')">
                    <template #default="{ row }">
                        {{ formatDate(row.AgvStartDate) }}
                    </template>
                </el-table-column>
                <el-table-column prop="AgvEndDate" :label="t('AGV.taskQuery.agvEndDate')"
                    :min-width="getColumnWidth('AgvEndDate')">
                    <template #default="{ row }">
                        {{ formatDate(row.AgvEndDate) }}
                    </template>
                </el-table-column>
                <el-table-column prop="CylinderDate" :label="t('AGV.taskQuery.cylinderDate')"
                    :min-width="getColumnWidth('CylinderDate')">
                    <template #default="{ row }">
                        {{ formatDate(row.CylinderDate) }}
                    </template>
                </el-table-column>
                <el-table-column prop="ReturnMsg" :label="t('AGV.taskQuery.returnMsg')"
                    :min-width="getColumnWidth('ReturnMsg')" show-overflow-tooltip />
                <el-table-column :label="t('AGV.taskQuery.message')" :fixed="'right'" width="110" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" @click="viewMessage(row)">
                            {{ t('AGV.taskQuery.viewMessage') }}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column :label="t('publicText.operation')" :fixed="'right'" width="80" align="center">
                    <template #default="{ row }">
                        <el-tooltip :content="[1, -1].includes(row.ReturnStatus) ? t('AGV.taskQuery.cancelTaskDisabled') : t('AGV.taskQuery.cancelTask')" placement="top">
                            <el-button size="small" type="danger" icon="Close"
                                :disabled="[1, -1].includes(row.ReturnStatus)"
                                :loading="row._cancelLoading"
                                @click="handleCancelTask(row)" />
                        </el-tooltip>
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

        <el-dialog v-model="messageDialogVisible" :title="t('AGV.taskQuery.taskDetail')" width="80%" top="5vh"
            :close-on-click-modal="false" align-center>
            <div class="dialog-info-bar">
                <div class="info-item">
                    <span class="info-label">{{ t('AGV.taskQuery.taskGuid') }}:</span>
                    <el-tag type="primary" effect="plain">{{ currentRow.TaskGuid }}</el-tag>
                </div>
                <div class="info-item">
                    <span class="info-label">{{ t('AGV.taskQuery.boxNo') }}:</span>
                    <el-tag type="primary" effect="plain">{{ currentRow.BoxNo }}</el-tag>
                </div>
                <div class="info-item">
                    <span class="info-label">{{ t('AGV.taskQuery.point') }}:</span>
                    <el-tag type="primary" effect="plain">{{ currentRow.PointName || currentRow.Point }}</el-tag>
                </div>
                <div class="info-item">
                    <span class="info-label">{{ t('AGV.taskQuery.lineName') }}:</span>
                    <el-tag type="primary" effect="plain">{{ currentRow.LineName }}</el-tag>
                </div>
                <div class="info-item">
                    <span class="info-label">{{ t('AGV.taskQuery.workOrder') }}:</span>
                    <el-tag type="primary" effect="plain">{{ currentRow.WorkOrder }}</el-tag>
                </div>
                <div class="info-item">
                    <span class="info-label">{{ t('AGV.taskQuery.returnMsg') }}:</span>
                    <el-tag type="primary" effect="plain">{{ currentRow.ReturnMsg }}</el-tag>
                </div>
            </div>
            <el-tabs v-model="activeMessageTab">
                <el-tab-pane :label="t('AGV.taskQuery.requestJson')" name="RequestJson">
                    <div class="json-header">
                        <span>{{ t('AGV.taskQuery.requestJson') }}</span>
                        <el-button type="success" size="small" @click="copyMessageJson(formattedRequestJson)">
                            {{ t('publicText.copy') }}
                        </el-button>
                    </div>
                    <pre class="json-pre">{{ formattedRequestJson }}</pre>
                </el-tab-pane>
                <el-tab-pane :label="t('AGV.taskQuery.returnJsonStart')" name="ReturnJsonStart">
                    <div class="json-header">
                        <span>{{ t('AGV.taskQuery.returnJsonStart') }}</span>
                        <el-button type="success" size="small" @click="copyMessageJson(formattedReturnJsonStart)">
                            {{ t('publicText.copy') }}
                        </el-button>
                    </div>
                    <pre class="json-pre">{{ formattedReturnJsonStart }}</pre>
                </el-tab-pane>
                <el-tab-pane :label="t('AGV.taskQuery.returnJson')" name="ReturnJson">
                    <div class="json-header">
                        <span>{{ t('AGV.taskQuery.returnJson') }}</span>
                        <el-button type="success" size="small" @click="copyMessageJson(formattedReturnJson)">
                            {{ t('publicText.copy') }}
                        </el-button>
                    </div>
                    <pre class="json-pre">{{ formattedReturnJson }}</pre>
                </el-tab-pane>
                <el-tab-pane :label="t('AGV.taskQuery.cylinderJson')" name="CylinderJson">
                    <div class="json-header">
                        <span>{{ t('AGV.taskQuery.cylinderJson') }}</span>
                        <el-button type="success" size="small" @click="copyMessageJson(formattedCylinderJson)">
                            {{ t('publicText.copy') }}
                        </el-button>
                    </div>
                    <pre class="json-pre">{{ formattedCylinderJson }}</pre>
                </el-tab-pane>
            </el-tabs>
            <template #footer>
                <el-button @click="messageDialogVisible = false">{{ t('publicText.close') }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { QueryAgvTaskPage, GiveAgvTask, GetAllValorLine } from "@/api/AGV/index";
import { shortcuts1 } from "@/utils/dataMenu";
import {
    ref,
    reactive,
    nextTick,
    onMounted,
    onBeforeUnmount,
    watch,
} from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { useTableColumnWidth } from '@/hooks/useTableColumnWidth';
import dayjs from 'dayjs';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const userStore = useUserStoreWithOut();

const loading = ref(false);
const tableHeight = ref(0);
const eltableRef = ref();
const tableData = ref<any[]>([]);
const total = ref(0);

const queryTime = ref<any[]>([]);

const searchForm = reactive({
    BoxNo: "",
    StartTime: "",
    EndTime: "",
    StartPoint: "",
    EndPoint: "",
    LineName: "",
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
    pageSize: 50,
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
    loading.value = true;
    const params = {
        BoxNo: searchForm.BoxNo || "",
        StartTime: searchForm.StartTime || "",
        EndTime: searchForm.EndTime || "",
        StartPoint: searchForm.StartPoint || "",
        EndPoint: searchForm.EndPoint || "",
        LineName: searchForm.LineName || "",
        PageIndex: pageObj.currentPage,
        PageSize: pageObj.pageSize,
    };
    QueryAgvTaskPage(params)
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
    searchForm.StartPoint = "";
    searchForm.EndPoint = "";
    searchForm.LineName = "";
    pageObj.currentPage = 1;
    getData();
};

const handleCancelTask = (row: any) => {
    ElMessageBox.confirm(
        t("AGV.taskQuery.confirmCancelTask", [row.TaskGuid || '']),
        t("publicText.tip"),
        {
            confirmButtonText: t("publicText.confirm"),
            cancelButtonText: t("publicText.cancel"),
            type: "warning",
        }
    )
        .then(() => {
            row._cancelLoading = true;
            GiveAgvTask({
                robotTaskCode: row.TaskGuid,
            })
                .then((res: any) => {
                    if (res.Success) {
                        ElMessage.success(t("AGV.taskQuery.cancelSuccess"));
                        getData();
                    } else {
                        ElMessage.error(res.Message || t("AGV.taskQuery.cancelFailure"));
                    }
                })
                .catch(() => {
                    ElMessage.error(t("AGV.taskQuery.cancelFailure"));
                })
                .finally(() => {
                    row._cancelLoading = false;
                });
        })
        .catch(() => {
            ElMessage.info(t("publicText.cancel"));
        });
};

const messageDialogVisible = ref(false);
const activeMessageTab = ref("RequestJson");
const formattedRequestJson = ref("");
const formattedReturnJsonStart = ref("");
const formattedReturnJson = ref("");
const formattedCylinderJson = ref("");
const currentRow = reactive({
    TaskGuid: "",
    BoxNo: "",
    Point: "",
    PointName: "",
    LineName: "",
    WorkOrder: "",
    ReturnMsg: "",
});

const formatJsonStr = (jsonStr: string) => {
    if (!jsonStr) return "";
    try {
        return JSON.stringify(JSON.parse(jsonStr), null, 2);
    } catch {
        return jsonStr;
    }
};

const viewMessage = (row: any) => {
    currentRow.TaskGuid = row.TaskGuid || "";
    currentRow.BoxNo = row.BoxNo || "";
    currentRow.Point = row.Point || "";
    currentRow.PointName = row.PointName || "";
    currentRow.LineName = row.LineName || "";
    currentRow.WorkOrder = row.WorkOrder || "";
    currentRow.ReturnMsg = row.ReturnMsg || "";
    formattedRequestJson.value = formatJsonStr(row.RequestJson);
    formattedReturnJsonStart.value = formatJsonStr(row.ReturnJsonStart);
    formattedReturnJson.value = formatJsonStr(row.ReturnJson);
    formattedCylinderJson.value = formatJsonStr(row.CylinderJson);
    activeMessageTab.value = "RequestJson";
    messageDialogVisible.value = true;
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

const copyMessageJson = (text: string) => {
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

onBeforeUnmount(() => {
    window.removeEventListener("resize", getScreenHeight);
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
    // margin-bottom: 16px;
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
    max-height: 400px;
    overflow: auto;
    border-top: 1px solid #e4e7ed;
}
</style>
