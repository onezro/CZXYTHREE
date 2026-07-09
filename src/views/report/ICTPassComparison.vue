<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between">
                <el-form :inline="true" :model="searchForm" @submit.prevent size="small">
                    <el-form-item :label="t('report.ictPassComparison.orderName')" class="mb-2">
                        <el-input v-model="searchForm.OrderName" placeholder="" clearable
                            @keyup.enter.native="handleSearch" style="width:200px" />
                    </el-form-item>
                    <el-form-item :label="t('report.ictPassComparison.dateRange')" class="mb-2">
                        <el-date-picker v-model="dateRange" type="datetimerange" range-separator="至"
                            start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD HH:mm:ss"
                            :shortcuts="shortcuts"
                            :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
                            :clearable="false" @change="handleDateRangeChange" style="width:350px" />
                    </el-form-item>
                    <el-form-item class="mb-2">
                        <el-button type="primary" @click="handleSearch">{{ t('publicText.query') }}</el-button>
                        <el-button @click="handleReset">{{ t('publicText.reset') }}</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <el-tabs v-model="activeTab" @tab-change="handleTabChange">
                <el-tab-pane :label="t('report.ictPassComparison.summary')" name="summary">
                    <el-row :gutter="10">
                        <el-col :span="6"> <el-descriptions :column="1" border>
                                <el-descriptions-item :label="t('report.ictPassComparison.aoiPassCount')">
                                    <span class="text-xl font-bold text-blue-600">{{ summaryData.SmtAoiPassProductCount
                                        || 0 }}</span>
                                </el-descriptions-item>
                                <el-descriptions-item :label="t('report.ictPassComparison.ictTestCount')">
                                    <span class="text-xl font-bold text-gray-600">{{ summaryData.IctTestProductCount ||
                                        0 }}</span>
                                </el-descriptions-item>
                                <el-descriptions-item :label="t('report.ictPassComparison.ictOkCount')">
                                    <span class="text-xl font-bold text-green-600">{{ summaryData.IctOkProductCount || 0
                                        }}</span>
                                </el-descriptions-item>
                                <el-descriptions-item :label="t('report.ictPassComparison.ictNgCount')">
                                    <span class="text-xl font-bold text-red-600">{{ summaryData.IctNgProductCount || 0
                                        }}</span>
                                </el-descriptions-item>

                                <el-descriptions-item :label="t('report.ictPassComparison.notIctTestCount')">
                                    <span class="text-xl font-bold text-gray-500">{{ summaryData.NotIctTestProductCount
                                        || 0 }}</span>
                                </el-descriptions-item>
                                <el-descriptions-item :label="t('report.ictPassComparison.matchCount')">
                                    <span class="text-xl font-bold text-purple-600">{{ summaryData.AoiIctMatchCount || 0
                                        }}</span>
                                </el-descriptions-item>
                                <el-descriptions-item :label="t('report.ictPassComparison.notMatchCount')">
                                    <span class="text-xl font-bold text-pink-600">{{ summaryData.AoiIctNotMatchCount ||
                                        0 }}</span>
                                </el-descriptions-item>
                                <el-descriptions-item :label="t('report.ictPassComparison.abnormalCount')">
                                    <span class="text-xl font-bold text-yellow-600">{{
                                        summaryData.NotAoiButIctOkAbnormalCount || 0 }}</span>
                                </el-descriptions-item>
                                <el-descriptions-item :label="t('report.ictPassComparison.ictPassRate')">
                                    <span class="text-xl font-bold text-orange-600">{{ summaryData.IctPassRate || '0%'
                                        }}</span>
                                </el-descriptions-item>
                                <el-descriptions-item :label="t('report.ictPassComparison.matchRate')">
                                    <span class="text-xl font-bold text-teal-600">{{ summaryData.AoiIctProductMatchRate
                                        || '0%' }}</span>
                                </el-descriptions-item>
                                <el-descriptions-item :label="t('report.ictPassComparison.abnormalRate')">
                                    <span class="text-xl font-bold text-red-500">{{ summaryData.AbnormalProductRate ||
                                        '0%' }}</span>
                                </el-descriptions-item>
                            </el-descriptions></el-col>
                        <el-col :span="18"> <el-table :data="dailyStatistics" ref="dailyTableRef" border
                                :height="tableHeight2" stripe size="small" >
                                <el-table-column type="index" :label="t('publicText.index')" width="55"
                                    align="center" />
                                <el-table-column prop="Date" :label="t('report.ictPassComparison.date')"
                                    :min-width="getColumnWidth('Date')" />
                                <el-table-column prop="AoiPassCount" :label="t('report.ictPassComparison.aoiPassCount')"
                                    :min-width="getColumnWidth('AoiPassCount')" align="center">
                                    <template #default="{ row }">
                                        <span style="color: blue">{{ row.AoiPassCount }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="IctTestCount" :label="t('report.ictPassComparison.ictTestCount')"
                                    :min-width="getColumnWidth('IctTestCount')" align="center" />
                                <el-table-column prop="IctOkCount" :label="t('report.ictPassComparison.ictOkCount')"
                                    :min-width="getColumnWidth('IctOkCount')" align="center">
                                    <template #default="{ row }">
                                        <span style="color: green">{{ row.IctOkCount }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="DailyPassRate"
                                    :label="t('report.ictPassComparison.dailyPassRate')"
                                    :min-width="getColumnWidth('DailyPassRate')" align="center" />
                                <el-table-column prop="DailyMatchRate"
                                    :label="t('report.ictPassComparison.dailyMatchRate')"
                                    :min-width="getColumnWidth('DailyMatchRate')" align="center" />
                                <template #empty><el-empty /></template>
                            </el-table>
                        </el-col>
                    </el-row>
                </el-tab-pane>

                <el-tab-pane :label="t('report.ictPassComparison.compareDetail')" name="compareDetail">
                    <div class="tab-content">
                        <el-table :data="compareDetailList" ref="compareDetailTableRef" border :height="tableHeight"
                            stripe size="small">
                            <el-table-column type="index" :label="t('publicText.index')" width="55" align="center">
                                <template #default="{ $index }">
                                    {{ $index + 1 + (searchForm.PageIndex - 1) * searchForm.PageSize }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="ProductCode" :label="t('report.ictPassComparison.productCode')"
                                :min-width="getColumnWidth2('ProductCode')" />
                            <el-table-column prop="SmtAoiMoveStatus"
                                :label="t('report.ictPassComparison.aoiMoveStatus')"
                                :min-width="getColumnWidth2('SmtAoiMoveStatus')" align="center">
                                <template #default="{ row }">
                                    <el-tag :type="row.SmtAoiMoveStatus === '是' ? 'success' : 'info'">{{
                                        row.SmtAoiMoveStatus }}</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column prop="AoiResult" :label="t('report.ictPassComparison.aoiResult')"
                                :min-width="getColumnWidth2('AoiResult')" align="center">
                                <template #default="{ row }">
                                    <el-tag :type="row.AoiResult === 'OK' ? 'success' : 'danger'">{{ row.AoiResult
                                        }}</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column prop="IctTestResult" :label="t('report.ictPassComparison.ictTestResult')"
                                :min-width="getColumnWidth2('IctTestResult')" align="center">
                                <template #default="{ row }">
                                    <el-tag :type="row.IctTestResult === 'OK' ? 'success' : 'danger'">{{
                                        row.IctTestResult }}</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column prop="CompareResult" :label="t('report.ictPassComparison.compareResult')"
                                :min-width="getColumnWidth2('CompareResult')" align="center">
                                <template #default="{ row }">
                                    <el-tag :type="row.CompareResult === '匹配' ? 'success' : 'danger'">{{
                                        row.CompareResult }}</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column prop="AbnormalType" :label="t('report.ictPassComparison.abnormalType')"
                                :min-width="getColumnWidth2('AbnormalType')" />
                            <el-table-column prop="Remark" :label="t('report.ictPassComparison.remark')"
                                :min-width="getColumnWidth2('Remark')" />
                            <el-table-column prop="AoiMoveTime" :label="t('report.ictPassComparison.aoiMoveTime')"
                                :min-width="getColumnWidth2('AoiMoveTime')" />
                            <el-table-column prop="IctTestTime" :label="t('report.ictPassComparison.ictTestTime')"
                                :min-width="getColumnWidth2('IctTestTime')" />
                            <template #empty><el-empty /></template>
                        </el-table>
                        <el-pagination class="mt-2" align="center" background size="small"
                            @size-change="handleCompareSizeChange" @current-change="handleCompareCurrentChange"
                            :current-page="searchForm.PageIndex" :page-size="searchForm.PageSize"
                            :page-sizes="[10, 20, 50, 100]" layout="total,sizes, prev, pager, next"
                            :total="compareDetailTotal" />
                    </div>
                </el-tab-pane>

                <el-tab-pane :label="t('report.ictPassComparison.notAoiButIct')" name="notAoiButIct">
                    <div class="tab-content">
                        <el-table :data="notAoiButIctList" ref="notAoiTableRef" border :height="tableHeight" stripe
                            size="small">
                            <el-table-column type="index" :label="t('publicText.index')" width="55" align="center">
                                <template #default="{ $index }">
                                    {{ $index + 1 + (searchForm.PageIndex - 1) * searchForm.PageSize }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="ProductCode" :label="t('report.ictPassComparison.productCode')"
                                :min-width="getColumnWidth3('ProductCode')" />
                            <el-table-column prop="IctTestTime" :label="t('report.ictPassComparison.ictTestTime')"
                                :min-width="getColumnWidth3('IctTestTime')" />
                            <el-table-column prop="Remark" :label="t('report.ictPassComparison.remark')"
                                :min-width="getColumnWidth3('Remark')">
                                <template #default="{ row }">
                                    <el-tag type="warning">{{ row.Remark }}</el-tag>
                                </template>
                            </el-table-column>
                            <template #empty><el-empty /></template>
                        </el-table>
                        <el-pagination class="mt-2" align="center" background size="small"
                            @size-change="handleNotAoiSizeChange" @current-change="handleNotAoiCurrentChange"
                            :current-page="searchForm.PageIndex" :page-size="searchForm.PageSize"
                            :page-sizes="[10, 20, 50, 100]" layout="total,sizes, prev, pager, next"
                            :total="notAoiTotal" />
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, onBeforeUnmount } from 'vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { GetCompareDetailPage, GetNotAoiButIctOkPage, GetSummaryStatistics } from '@/api/report/ICTPassComparison';
import { shortcuts } from '@/utils/dataMenu';
import { useTableColumnWidth } from '@/hooks/useTableColumnWidth';

const { t } = useI18n();

const activeTab = ref('summary');

const searchForm = reactive({
    OrderName: '',
    StartTime: '',
    EndTime: '',
    PageIndex: 1,
    PageSize: 50,
});

const dateRange = ref<any[]>([]);

const tableHeight = ref(0);
const tableHeight2 = ref(0);

const summaryLoading = ref(false);
const compareDetailLoading = ref(false);
const notAoiLoading = ref(false);

const summaryData = reactive({
    SmtAoiPassProductCount: 0,
    IctTestProductCount: 0,
    IctOkProductCount: 0,
    IctNgProductCount: 0,
    NotIctTestProductCount: 0,
    AoiIctMatchCount: 0,
    AoiIctNotMatchCount: 0,
    NotAoiButIctOkAbnormalCount: 0,
    IctPassRate: '0%',
    AoiIctProductMatchRate: '0%',
    AbnormalProductRate: '0%',
});

const dailyStatistics = ref<any[]>([]);

const compareDetailList = ref<any[]>([]);
const compareDetailTotal = ref(0);

const notAoiButIctList = ref<any[]>([]);
const notAoiTotal = ref(0);

const dailyTableRef = ref();
const compareDetailTableRef = ref();
const notAoiTableRef = ref();

const excludeLabels = [t("publicText.index"), t("publicText.operation")];

const { getColumnWidth } = useTableColumnWidth(dailyTableRef, dailyStatistics, {
    padding: 25,
    fontSize: 13,
    excludeLabels
});

const { getColumnWidth: getColumnWidth2 } = useTableColumnWidth(compareDetailTableRef, compareDetailList, {
    padding: 25,
    fontSize: 13,
    excludeLabels
});

const { getColumnWidth: getColumnWidth3 } = useTableColumnWidth(notAoiTableRef, notAoiButIctList, {
    padding: 25,
    fontSize: 13,
    excludeLabels
});

const handleDateRangeChange = (val: any[]) => {
    searchForm.StartTime = val[0];
    searchForm.EndTime = val[1];
};

const handleSearch = () => {
    searchForm.PageIndex = 1;
    if (activeTab.value === 'summary') {
        getSummaryStatistics();
    } else if (activeTab.value === 'compareDetail') {
        getCompareDetail();
    } else if (activeTab.value === 'notAoiButIct') {
        getNotAoiButIct();
    }
};

const handleReset = () => {
    searchForm.OrderName = '';
    searchForm.StartTime = '';
    searchForm.EndTime = '';
    searchForm.PageIndex = 1;
    dateRange.value = [];
    handleSearch();
};

const getSummaryStatistics = async () => {
    summaryLoading.value = true;
    try {
        const params = {
            OrderName: searchForm.OrderName || '',
            StartTime: searchForm.StartTime || '',
            EndTime: searchForm.EndTime || '',
            PageIndex: 1,
            PageSize: 50,
        };
        const res: any = await GetSummaryStatistics(params);
        if (res.Success && res.Data) {
            const summary = res.Data.Summary || {};
            Object.assign(summaryData, summary);
            dailyStatistics.value = res.Data.DailyStatistics || [];
        } else {
            ElMessage.error(res.Message || t('message.queryFailure'));
        }
    } finally {
        summaryLoading.value = false;
    }
};

const getCompareDetail = async () => {
    compareDetailLoading.value = true;
    try {
        const params = {
            OrderName: searchForm.OrderName || '',
            StartTime: searchForm.StartTime || '',
            EndTime: searchForm.EndTime || '',
            PageIndex: searchForm.PageIndex,
            PageSize: searchForm.PageSize,
        };
        const res: any = await GetCompareDetailPage(params);
        if (res.Success && res.Data) {
            compareDetailList.value = res.Data.rows || [];
            compareDetailTotal.value = res.Data.total || 0;
        } else {
            ElMessage.error(res.Message || t('message.queryFailure'));
        }
    } finally {
        compareDetailLoading.value = false;
    }
};

const getNotAoiButIct = async () => {
    notAoiLoading.value = true;
    try {
        const params = {
            OrderName: searchForm.OrderName || '',
            StartTime: searchForm.StartTime || '',
            EndTime: searchForm.EndTime || '',
            PageIndex: searchForm.PageIndex,
            PageSize: searchForm.PageSize,
        };
        const res: any = await GetNotAoiButIctOkPage(params);
        if (res.Success && res.Data) {
            notAoiButIctList.value = res.Data.rows || [];
            notAoiTotal.value = res.Data.total || 0;
        } else {
            ElMessage.error(res.Message || t('message.queryFailure'));
        }
    } finally {
        notAoiLoading.value = false;
    }
};

const handleCompareSizeChange = (val: number) => {
    searchForm.PageSize = val;
    searchForm.PageIndex = 1;
    getCompareDetail();
};

const handleCompareCurrentChange = (val: number) => {
    searchForm.PageIndex = val;
    getCompareDetail();
};

const handleNotAoiSizeChange = (val: number) => {
    searchForm.PageSize = val;
    searchForm.PageIndex = 1;
    getNotAoiButIct();
};

const handleNotAoiCurrentChange = (val: number) => {
    searchForm.PageIndex = val;
    getNotAoiButIct();
};

const handleTabChange = (tab: string) => {
    searchForm.PageIndex = 1;
    if (tab === 'summary') {
        getSummaryStatistics();
    } else if (tab === 'compareDetail') {
        getCompareDetail();
    } else if (tab === 'notAoiButIct') {
        getNotAoiButIct();
    }
};

const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 235;
        tableHeight2.value = window.innerHeight - 205;
    });
};

onMounted(() => {
    getScreenHeight();
    window.addEventListener('resize', getScreenHeight);
    getSummaryStatistics();
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', getScreenHeight);
});
</script>

<style lang="scss" scoped>
.el-pagination {
    justify-content: center;
}
</style>