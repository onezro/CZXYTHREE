<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between">
                <el-form ref="searchFormRef" :model="searchForm" label-width="auto" :inline="true" :size="'small'"
                    @submit.prevent>
                    <el-form-item :label="t('materialManage.bomChangeRecord.eventTime')" prop="TimeRange" class="mb-2">
                        <el-date-picker style="width: 350px;" v-model="queryTime" type="datetimerange"
                            range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                            value-format="YYYY-MM-DD HH:mm:ss" :shortcuts="shortcuts1" :default-time="[
                                new Date(2000, 1, 1, 0, 0, 0),
                                new Date(2000, 1, 1, 23, 59, 59),
                            ]" :clearable="false" @change="handleDateRangeChange" />
                    </el-form-item>
                    <el-form-item :label="t('materialManage.bomChangeRecord.bomCode')" prop="bomCode" class="mb-2">
                        <el-input v-model="searchForm.bomCode" clearable @clear="handleSearch"
                            @keyup.enter="handleSearch" style="width: 200px"
                            :placeholder="t('materialManage.bomChangeRecord.inputBomCode')" />
                    </el-form-item>
                    <el-form-item :label="t('materialManage.bomChangeRecord.bomVersion')" prop="bomVersion"
                        class="mb-2">
                        <el-input v-model="searchForm.bomVersion" clearable @clear="handleSearch"
                            @keyup.enter="handleSearch" style="width: 180px"
                            :placeholder="t('materialManage.bomChangeRecord.inputBomVersion')" />
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
                        <span>{{ scope.$index + pageObj.pageSize * (pageObj.pageIndex - 1) + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="eventTime" :label="t('materialManage.bomChangeRecord.eventTime')"
                    width="150" fixed >
                    <template #default="{ row }">
                        {{ formatDate(row.eventTime) }}
                    </template>
                </el-table-column>
                <el-table-column prop="eventType" :label="t('materialManage.bomChangeRecord.eventType')"
                    :min-width="getColumnWidth('eventType')" align="center" fixed>
                    <template #default="{ row }">
                        <el-tag :type="getEventTypeTag(row.eventType)" size="small">{{ row.eventType }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="bomCode" :label="t('materialManage.bomChangeRecord.bomCode')"
                    :min-width="getColumnWidth('bomCode')" show-overflow-tooltip fixed >
                    <template #default="{ row }"  >
                      <span class="text-[#006487] pointer underline " @click="viewEventContent(row)">{{ row.bomCode }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="bomVersion" :label="t('materialManage.bomChangeRecord.bomVersion')" 
                    :min-width="getColumnWidth('bomVersion')" show-overflow-tooltip  align="center"/>
                <el-table-column prop="name" :label="t('materialManage.bomChangeRecord.pnDsc')"
                    :min-width="getColumnWidth('name')" show-overflow-tooltip />
                <el-table-column prop="pn_spec" :label="t('materialManage.bomChangeRecord.pnSpec')"
                    :min-width="250" show-overflow-tooltip />
                <el-table-column prop="eventContent" :label="t('materialManage.bomChangeRecord.eventContent')"
                    :min-width="250">
                    <template #default="{ row }">
                        <div v-if="row.eventContent" class="flex items-center gap-1">
                            <span class="event-content-summary">{{ getContentSummary(row.eventContent) }}</span>
                            <el-button link type="primary" @click="viewEventContent(row)">
                                {{ t('publicText.look') }}
                            </el-button>
                        </div>
                        <span v-else>-</span>
                    </template>
                </el-table-column>

                <el-table-column prop="notifyEmps" :label="t('materialManage.bomChangeRecord.notifyEmps')"
                    :min-width="getColumnWidth('notifyEmps')" show-overflow-tooltip />
                <template #empty>
                    <div class="flex items-center justify-center h-100%">
                        <el-empty />
                    </div>
                </template>
            </el-table>

            <div class="mt-2">
                <el-pagination :size="'small'" background @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :pager-count="5" :current-page="pageObj.pageIndex"
                    :page-size="pageObj.pageSize" :page-sizes="[10, 20, 30, 50, 100]"
                    layout="total, sizes, prev, pager, next" :total="total" />
            </div>
        </el-card>

        <el-dialog v-model="contentDialogVisible" :title=" bomCode +'-'+ t('materialManage.bomChangeRecord.eventContent')"
            width="60%" top="8vh" align-center :close-on-click-modal="false">
            <template v-if="parsedRows.length">
                <div v-if="contentPrefix" class="event-content-prefix">{{ contentPrefix }}</div>
                <el-table :data="parsedRows" border size="small" max-height="60vh">
                    <el-table-column type="index" :label="t('publicText.index')" width="60" align="center" />
                    <el-table-column prop="code" :label="t('materialManage.bomChangeRecord.materialCode')"
                        show-overflow-tooltip />
                    <el-table-column prop="before" :label="t('materialManage.bomChangeRecord.beforeQty')"
                        show-overflow-tooltip />
                    <el-table-column prop="after" :label="t('materialManage.bomChangeRecord.afterQty')"
                        show-overflow-tooltip />
                </el-table>
            </template>
            <pre v-else class="event-content-pre">{{ currentContent }}</pre>
            <template #footer>
                <el-button @click="contentDialogVisible = false">{{ t('publicText.close') }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { QueryBomChangeRecord } from "@/api/materialManage/index";
import { shortcuts1 } from "@/utils/dataMenu";
import { ref, reactive, onMounted, watch } from "vue";
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
    bomCode: "",
    bomVersion: "",
    startTime: "",
    endTime: "",
});

const pageObj = reactive({
    pageIndex: 1,
    pageSize: 50,
});
const bomCode = ref('');

const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === "1900-01-01T00:00:00") return "-";
    return dayjs(dateStr).format("YYYY-MM-DD HH:mm:ss");
};

const getEventTypeTag = (eventType: string) => {
    if (eventType === '新增') return 'success';
    if (eventType === '修改') return 'warning';
    return 'info';
};

const SUMMARY_LENGTH = 40;

// 单元格摘要：前 N 个字 + 省略号
const getContentSummary = (text: string) => {
    const flat = String(text || '').replace(/[\r\n]+/g, ' ');
    return flat.length > SUMMARY_LENGTH ? `${flat.slice(0, SUMMARY_LENGTH)}...` : flat;
};

// 解析异动内容为「物料编码 / 变更前 / 变更后」多条记录
const parseEventContent = (text: string) => {
    const raw = String(text || '');
    const rows: any[] = [];
    const regex = /物料编码[:：]\s*([^，,\]]+?)\s*[，,]\s*变更前[:：]\s*([^，,\]]+?)\s*[，,]\s*变更后[:：]\s*([^，,\]]+?)\s*\]/g;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(raw)) !== null) {
        rows.push({ code: match[1], before: match[2], after: match[3] });
    }
    const firstBracket = raw.indexOf('[');
    const prefix = firstBracket > 0 ? raw.slice(0, firstBracket).replace(/[;；,，\s]+$/, '') : '';
    return { prefix, rows };
};

// 无法解析为多条时的兜底文本（按条换行）
const formatEventContent = (text: string) => {
    if (!text) return '';
    return String(text).replace(/\],\s*/g, '],\n');
};

const contentDialogVisible = ref(false);
const currentContent = ref('');
const contentPrefix = ref('');
const parsedRows = ref<any[]>([]);

const viewEventContent = (row: any) => {
    bomCode.value = row.bomCode || '';
    const raw = row.eventContent || '';
    currentContent.value = formatEventContent(raw);
    const { prefix, rows } = parseEventContent(raw);
    contentPrefix.value = prefix;
    parsedRows.value = rows;
    contentDialogVisible.value = true;
};

// 默认查询近三天（含今天）
const getDefaultTimeRange = (): string[] => {
    return [
        dayjs().subtract(2, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    ];
};

const { getColumnWidth } = useTableColumnWidth(eltableRef, tableData, {
    excludeLabels: [t('publicText.index')]
});

const handleDateRangeChange = (val: any[]) => {
    searchForm.startTime = val?.[0] || "";
    searchForm.endTime = val?.[1] || "";
};

const getData = () => {
    loading.value = true;
    const params = {
        startTime: searchForm.startTime || "",
        endTime: searchForm.endTime || "",
        bomCode: searchForm.bomCode || "",
        bomVersion: searchForm.bomVersion || "",
        pageIndex: pageObj.pageIndex,
        pageSize: pageObj.pageSize,
    };
    QueryBomChangeRecord(params)
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
    pageObj.pageIndex = 1;
    getData();
};

const handleReset = () => {
    const [start, end] = getDefaultTimeRange();
    queryTime.value = [start, end];
    searchForm.startTime = start;
    searchForm.endTime = end;
    searchForm.bomCode = "";
    searchForm.bomVersion = "";
    pageObj.pageIndex = 1;
    getData();
};

const handleSizeChange = (val: number) => {
    pageObj.pageSize = val;
    pageObj.pageIndex = 1;
    getData();
};

const handleCurrentChange = (val: number) => {
    pageObj.pageIndex = val;
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

.event-content-summary {
    flex: 0 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.event-content-prefix {
    margin-bottom: 8px;
    font-weight: 500;
}

.event-content-pre {
    margin: 0;
    max-height: 60vh;
    overflow: auto;
    white-space: pre-wrap;
    word-break: break-all;
    font-size: 13px;
    line-height: 1.7;
    padding: 12px;
    background-color: #f5f7fa;
    border-radius: 4px;
}
</style>
