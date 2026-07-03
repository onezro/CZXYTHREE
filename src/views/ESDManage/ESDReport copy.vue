<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <el-tabs v-model="activeTab" @tab-change="handleTabChange">
                <el-tab-pane :label="t('esd.report.recordReport')" name="recordReport">
                    <div class="tab-content">
                        <el-form :inline="true" :model="recordQuery" label-width="auto" @submit.prevent size="small">
                            <el-form-item :label="t('esd.task.timeQueryType')" class="mb-2">
                                <el-select v-model="recordQuery.TimeQueryType" placeholder="请选择" clearable style="width:160px">
                                    <el-option label="Day" value="Day" />
                                    <el-option label="Week" value="Week" />
                                    <el-option label="Month" value="Month" />
                                    <el-option label="Custom" value="Custom" />
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="t('esd.task.baseDate')" class="mb-2">
                                <el-date-picker v-model="recordQuery.BaseDate" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" style="width:160px" />
                            </el-form-item>
                            <el-form-item :label="t('esd.report.inspectTime')" class="mb-2">
                                <el-date-picker v-model="recordTime" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD HH:mm:ss" :shortcuts="shortcuts" :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]" :clearable="false" @change="handleDateRangeChange" />
                            </el-form-item>
                            <el-form-item :label="t('esd.task.workshop')" class="mb-2">
                                <el-input v-model="recordQuery.Workshop" placeholder="车间" clearable style="width:160px" />
                            </el-form-item>
                            <el-form-item :label="t('esd.task.lineName')" class="mb-2">
                                <el-input v-model="recordQuery.LineName" placeholder="线体" clearable style="width:160px" />
                            </el-form-item>
                            <el-form-item :label="t('esd.task.workStation')" class="mb-2">
                                <el-input v-model="recordQuery.WorkStation" placeholder="工位" clearable style="width:160px" />
                            </el-form-item>
                            <el-form-item :label="t('esd.checklist.esdType')" class="mb-2">
                                <el-select v-model="recordQuery.EsdType" placeholder="请选择" clearable style="width:160px" popper-class="esd-type-popper" v-loading="selectData.esdType.loading">
                                    <el-option v-for="item in selectData.esdType.list" :key="item.value" :label="item.label" :value="item.value" />
                                    <template #footer>
                                        <el-pagination small layout="prev, pager, next" :total="selectData.esdType.total" :page-size="selectData.esdType.pageSize" v-model:current-page="selectData.esdType.pageIndex" @current-change="loadEsdTypeData" class="pagination-wrapper" />
                                    </template>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="t('esd.task.esdTypeCode')" class="mb-2">
                                <el-input v-model="recordQuery.EsdTypeCode" placeholder="ESD类型编码" clearable style="width:160px" />
                            </el-form-item>
                            <el-form-item :label="t('esd.report.esdCategory')" class="mb-2">
                                <el-input v-model="recordQuery.EsdCategory" placeholder="ESD品类" clearable style="width:160px" />
                            </el-form-item>
                            <el-form-item :label="t('esd.checklist.checkFrequency')" class="mb-2">
                                <el-select v-model="recordQuery.CheckFrequency" placeholder="请选择" clearable style="width:160px" popper-class="frequency-popper" v-loading="selectData.checkFrequency.loading">
                                    <el-option v-for="item in selectData.checkFrequency.list" :key="item.value" :label="item.label" :value="item.value" />
                                    <template #footer>
                                        <el-pagination small layout="prev, pager, next" :total="selectData.checkFrequency.total" :page-size="selectData.checkFrequency.pageSize" v-model:current-page="selectData.checkFrequency.pageIndex" @current-change="loadCheckFrequencyData" class="pagination-wrapper" />
                                    </template>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="t('esd.task.taskCode')" class="mb-2">
                                <el-input v-model="recordQuery.TaskCode" placeholder="任务编号" clearable style="width:160px" />
                            </el-form-item>
                            <el-form-item :label="t('esd.checklist.formName')" class="mb-2">
                                <el-input v-model="recordQuery.FormName" placeholder="表单名称" clearable style="width:160px" />
                            </el-form-item>
                            <el-form-item :label="t('esd.report.deviceName')" class="mb-2">
                                <el-input v-model="recordQuery.DeviceName" placeholder="设备名称" clearable style="width:160px" />
                            </el-form-item>
                            <el-form-item :label="t('esd.report.deviceCode')" class="mb-2">
                                <el-input v-model="recordQuery.DeviceCode" placeholder="设备编号" clearable style="width:160px" />
                            </el-form-item>
                            <el-form-item :label="t('esd.report.inspector')" class="mb-2">
                                <el-input v-model="recordQuery.Inspector" placeholder="点检人" clearable style="width:160px" />
                            </el-form-item>
                            <el-form-item :label="t('esd.report.checkResult')" class="mb-2">
                                <el-select v-model="recordQuery.CheckResult" placeholder="请选择" clearable style="width:160px">
                                    <el-option label="OK" value="OK" />
                                    <el-option label="NG" value="NG" />
                                </el-select>
                            </el-form-item>
                            <el-form-item class="mb-2">
                                <el-button type="primary" @click="handleRecordSearch">{{ t('publicText.query') }}</el-button>
                                <el-button @click="resetRecordSearch">{{ t('publicText.reset') }}</el-button>
                                <el-button type="success" size="small" @click="openExportDialog" :disabled="recordReportList.length === 0" icon="Download">
                                {{ t('publicText.export') }}
                            </el-button>
                            </el-form-item>
                        </el-form>
                        <!-- <div class="mb-2">
                            <el-button type="success" size="small" @click="openExportDialog" :disabled="recordReportList.length === 0" icon="Download">
                                {{ t('publicText.export') }}
                            </el-button>
                        </div> -->
                        <el-table :data="recordReportList" ref="recordTableRef" border :height="tableHeight" stripe size="small" v-loading="recordLoading">
                            <el-table-column type="index" :label="t('publicText.index')" width="55" align="center">
                                <template #default="{ $index }">
                                    {{ $index + 1 + (recordQuery.PageIndex - 1) * recordQuery.PageSize }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="TaskCode" :label="t('esd.task.taskCode')" :min-width="getColumnWidth('TaskCode')" />
                            <el-table-column prop="FormName" :label="t('esd.checklist.formName')" :min-width="getColumnWidth('FormName')" />
                            <el-table-column prop="FormCode" :label="t('esd.checklist.formCode')" :min-width="getColumnWidth('FormCode')" />
                            <el-table-column prop="EsdType" :label="t('esd.checklist.esdType')" :min-width="getColumnWidth('EsdType')" />
                            <el-table-column prop="EsdTypeCode" :label="t('esd.task.esdTypeCode')" :min-width="getColumnWidth('EsdTypeCode')" />
                            <el-table-column prop="EsdCategory" :label="t('esd.report.esdCategory')" :min-width="getColumnWidth('EsdCategory')" />
                            <el-table-column prop="CheckFrequency" :label="t('esd.checklist.checkFrequency')" :min-width="getColumnWidth('CheckFrequency')" />
                            <el-table-column prop="Workshop" :label="t('esd.task.workshop')" :min-width="getColumnWidth('Workshop')" />
                            <el-table-column prop="LineName" :label="t('esd.task.lineName')" :min-width="getColumnWidth('LineName')" />
                            <el-table-column prop="WorkStation" :label="t('esd.task.workStation')" :min-width="getColumnWidth('WorkStation')" />
                            <el-table-column prop="DeviceName" :label="t('esd.report.deviceName')" :min-width="getColumnWidth('DeviceName')" />
                            <el-table-column prop="DeviceCode" :label="t('esd.report.deviceCode')" :min-width="getColumnWidth('DeviceCode')" />
                            <el-table-column prop="MeasureDevice" :label="t('esd.checklist.measureDevice')" :min-width="getColumnWidth('MeasureDevice')" />
                            <el-table-column prop="CheckContent" :label="t('esd.checklist.checkContent')" :min-width="getColumnWidth('CheckContent')" />
                            <el-table-column prop="CheckMethod" :label="t('esd.report.checkMethod')" :min-width="getColumnWidth('CheckMethod')" />
                            <el-table-column prop="LowerLimit" :label="t('esd.checklist.lowerLimit')" :min-width="getColumnWidth('LowerLimit')" align="center" />
                            <el-table-column prop="UpperLimit" :label="t('esd.checklist.upperLimit')" :min-width="getColumnWidth('UpperLimit')" align="center" />
                            <el-table-column prop="CheckValue" :label="t('esd.report.checkValue')" :min-width="getColumnWidth('CheckValue')" align="center" />
                            <el-table-column prop="CheckResult" :label="t('esd.report.checkResult')" :min-width="getColumnWidth('CheckResult')" align="center">
                                <template #default="{ row }">
                                    <el-tag :type="row.CheckResult === 'OK' ? 'success' : 'danger'">{{ row.CheckResult }}</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column prop="Inspector" :label="t('esd.report.inspector')" :min-width="getColumnWidth('Inspector')" />
                            <el-table-column prop="InspectTime" :label="t('esd.report.inspectTime')" :min-width="getColumnWidth('InspectTime')" />
                            <el-table-column prop="ResponsibleUser" :label="t('esd.task.responsibleUser')" :min-width="getColumnWidth('ResponsibleUser')" />
                            <el-table-column prop="ProductionBatch" :label="t('esd.task.productionBatch')" :min-width="getColumnWidth('ProductionBatch')" />
                            <el-table-column prop="AbnormalPhenomenon" :label="t('esd.report.abnormalPhenomenon')" :min-width="getColumnWidth('AbnormalPhenomenon')" />
                            <el-table-column prop="ProblemLocation" :label="t('esd.report.problemLocation')" :min-width="getColumnWidth('ProblemLocation')" />
                            <el-table-column prop="PreliminaryCause" :label="t('esd.report.preliminaryCause')" :min-width="getColumnWidth('PreliminaryCause')" />
                            <el-table-column prop="RectifyStatus" :label="t('esd.report.rectifyStatus')" :min-width="getColumnWidth('RectifyStatus')" align="center">
                                <template #default="{ row }">
                                    <el-tag :type="row.RectifyStatus === 0 ? 'warning' : 'success'">{{ row.RectifyStatus === 0 ? t('esd.report.rectifyPending') : t('esd.report.rectifyCompleted') }}</el-tag>
                                </template>
                            </el-table-column>
                            <template #empty><el-empty /></template>
                        </el-table>
                        <el-pagination class="mt-2" align="center" background size="small" @size-change="handleRecordSizeChange" @current-change="handleRecordCurrentChange" :current-page="recordQuery.PageIndex" :page-size="recordQuery.PageSize" :page-sizes="[10, 20, 50, 100]" layout="total,sizes, prev, pager, next" :total="recordTotal" />
                    </div>
                </el-tab-pane>

                <el-tab-pane :label="t('esd.report.typeSummary')" name="typeSummary">
                    <div class="tab-content">
                        <el-form :inline="true" :model="typeQuery" label-width="auto" @submit.prevent size="small">
                            <el-form-item :label="t('esd.task.timeQueryType')" class="mb-2">
                                <el-select v-model="typeQuery.TimeQueryType" placeholder="请选择" clearable style="width:160px">
                                    <el-option label="Day" value="Day" />
                                    <el-option label="Week" value="Week" />
                                    <el-option label="Month" value="Month" />
                                    <el-option label="Custom" value="Custom" />
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="t('esd.task.baseDate')" class="mb-2">
                                <el-date-picker v-model="typeQuery.BaseDate" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" style="width:160px" />
                            </el-form-item>
                            <el-form-item :label="t('esd.report.inspectTime')" class="mb-2">
                                <el-date-picker v-model="typeTime" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD HH:mm:ss" :shortcuts="shortcuts" :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]" :clearable="false" @change="handleTypeDateRangeChange" />
                            </el-form-item>
                            <el-form-item :label="t('esd.checklist.esdType')" class="mb-2">
                                <el-select v-model="typeQuery.EsdType" placeholder="请选择" clearable style="width:160px" popper-class="esd-type-popper" v-loading="selectData.esdType.loading">
                                    <el-option v-for="item in selectData.esdType.list" :key="item.value" :label="item.label" :value="item.value" />
                                    <template #footer>
                                        <el-pagination small layout="prev, pager, next" :total="selectData.esdType.total" :page-size="selectData.esdType.pageSize" v-model:current-page="selectData.esdType.pageIndex" @current-change="loadEsdTypeData" class="pagination-wrapper" />
                                    </template>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="t('esd.report.esdCategory')" class="mb-2">
                                <el-input v-model="typeQuery.EsdCategory" placeholder="ESD品类" clearable style="width:160px" />
                            </el-form-item>
                            <el-form-item class="mb-2">
                                <el-button type="primary" @click="handleTypeSearch">{{ t('publicText.query') }}</el-button>
                                <el-button @click="resetTypeSearch">{{ t('publicText.reset') }}</el-button>
                            </el-form-item>
                        </el-form>
                        <el-table :data="typeSummaryList" ref="typeTableRef" border :height="tableHeight2" stripe size="small" v-loading="typeLoading">
                            <el-table-column type="index" :label="t('publicText.index')" width="55" align="center" />
                            <el-table-column prop="EsdType" :label="t('esd.checklist.esdType')" :min-width="getColumnWidth2('EsdType')" />
                            <el-table-column prop="EsdCategory" :label="t('esd.report.esdCategory')" :min-width="getColumnWidth2('EsdCategory')" />
                            <el-table-column prop="TotalCount" :label="t('esd.report.totalCount')" :min-width="getColumnWidth2('TotalCount')" align="center" />
                            <el-table-column prop="OkCount" :label="t('esd.report.okCount')" :min-width="getColumnWidth2('OkCount')" align="center">
                                <template #default="{ row }">
                                    <span style="color: green">{{ row.OkCount }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="NgCount" :label="t('esd.report.ngCount')" :min-width="getColumnWidth2('NgCount')" align="center">
                                <template #default="{ row }">
                                    <span style="color: red">{{ row.NgCount }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="UncheckedCount" :label="t('esd.report.uncheckedCount')" :min-width="getColumnWidth2('UncheckedCount')" align="center">
                                <template #default="{ row }">
                                    <span style="color: orange">{{ row.UncheckedCount }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="PassRate" :label="t('esd.report.passRate')" :min-width="getColumnWidth2('PassRate')" align="center">
                                <template #default="{ row }">
                                    <span>{{ row.PassRate }}%</span>
                                </template>
                            </el-table-column>
                            <template #empty><el-empty /></template>
                        </el-table>
                    </div>
                </el-tab-pane>

                <el-tab-pane :label="t('esd.report.statistics')" name="statistics">
                    <div class="tab-content">
                        <el-form :inline="true" :model="statQuery" label-width="auto" @submit.prevent size="small">
                            <el-form-item :label="t('esd.report.statisticDimension')" class="mb-2">
                                <el-select v-model="statQuery.StatisticDimension" placeholder="请选择" clearable style="width:160px">
                                    <el-option label="按天统计" value="Day" />
                                    <el-option label="按月统计" value="Month" />
                                    <el-option label="按年统计" value="Year" />
                                    <el-option label="按ESD类型统计" value="EsdType" />
                                    <el-option label="按ESD品类统计" value="EsdCategory" />
                                    <el-option label="按车间统计" value="Workshop" />
                                    <el-option label="按线体统计" value="LineName" />
                                    <el-option label="按工位统计" value="WorkStation" />
                                    <el-option label="按生产批次统计" value="ProductionBatch" />
                                    <el-option label="按点检内容统计" value="CheckContent" />
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="t('esd.task.timeQueryType')" class="mb-2">
                                <el-select v-model="statQuery.TimeQueryType" placeholder="请选择" clearable style="width:160px">
                                    <el-option label="Day" value="Day" />
                                    <el-option label="Week" value="Week" />
                                    <el-option label="Month" value="Month" />
                                    <el-option label="Custom" value="Custom" />
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="t('esd.task.baseDate')" class="mb-2">
                                <el-date-picker v-model="statQuery.BaseDate" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" style="width:160px" />
                            </el-form-item>
                            <el-form-item :label="t('esd.report.inspectTime')" class="mb-2">
                                <el-date-picker v-model="statTime" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD HH:mm:ss" :shortcuts="shortcuts" :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]" :clearable="false" @change="handleStatDateRangeChange" />
                            </el-form-item>
                            <el-form-item :label="t('esd.checklist.esdType')" class="mb-2">
                                <el-select v-model="statQuery.EsdType" placeholder="请选择" clearable style="width:160px" popper-class="esd-type-popper" v-loading="selectData.esdType.loading">
                                    <el-option v-for="item in selectData.esdType.list" :key="item.value" :label="item.label" :value="item.value" />
                                    <template #footer>
                                        <el-pagination small layout="prev, pager, next" :total="selectData.esdType.total" :page-size="selectData.esdType.pageSize" v-model:current-page="selectData.esdType.pageIndex" @current-change="loadEsdTypeData" class="pagination-wrapper" />
                                    </template>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="t('esd.report.checkResult')" class="mb-2">
                                <el-select v-model="statQuery.CheckResult" placeholder="请选择" clearable style="width:160px">
                                    <el-option label="OK" value="OK" />
                                    <el-option label="NG" value="NG" />
                                </el-select>
                            </el-form-item>
                            <el-form-item class="mb-2">
                                <el-button type="primary" @click="handleStatSearch">{{ t('publicText.query') }}</el-button>
                                <el-button @click="resetStatSearch">{{ t('publicText.reset') }}</el-button>
                            </el-form-item>
                        </el-form>
                        <div class="mb-4">
                            <div class="grid grid-cols-4 gap-4">
                                <el-card shadow="hover" body-style="{ padding: '12px' }">
                                    <div class="text-center">
                                        <div class="text-2xl font-bold text-blue-600">{{ statSummary.TotalCount || 0 }}</div>
                                        <div class="text-sm text-gray-500">{{ t('esd.report.totalCount') }}</div>
                                    </div>
                                </el-card>
                                <el-card shadow="hover" body-style="{ padding: '12px' }">
                                    <div class="text-center">
                                        <div class="text-2xl font-bold text-green-600">{{ statSummary.OkCount || 0 }}</div>
                                        <div class="text-sm text-gray-500">{{ t('esd.report.okCount') }}</div>
                                    </div>
                                </el-card>
                                <el-card shadow="hover" body-style="{ padding: '12px' }">
                                    <div class="text-center">
                                        <div class="text-2xl font-bold text-red-600">{{ statSummary.NgCount || 0 }}</div>
                                        <div class="text-sm text-gray-500">{{ t('esd.report.ngCount') }}</div>
                                    </div>
                                </el-card>
                                <el-card shadow="hover" body-style="{ padding: '12px' }">
                                    <div class="text-center">
                                        <div class="text-2xl font-bold text-orange-600">{{ statSummary.PassRate || '0.00' }}%</div>
                                        <div class="text-sm text-gray-500">{{ t('esd.report.passRate') }}</div>
                                    </div>
                                </el-card>
                            </div>
                        </div>
                        <el-table :data="statisticsList" ref="statTableRef" border :height="tableHeight3" stripe size="small" v-loading="statLoading">
                            <el-table-column type="index" :label="t('publicText.index')" width="55" align="center" />
                            <el-table-column prop="StatisticKey" :label="getStatDimensionLabel()" :min-width="getColumnWidth3('StatisticKey')" />
                            <el-table-column prop="TotalCount" :label="t('esd.report.totalCount')" :min-width="getColumnWidth3('TotalCount')" align="center" />
                            <el-table-column prop="OkCount" :label="t('esd.report.okCount')" :min-width="getColumnWidth3('OkCount')" align="center">
                                <template #default="{ row }">
                                    <span style="color: green">{{ row.OkCount }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="NgCount" :label="t('esd.report.ngCount')" :min-width="getColumnWidth3('NgCount')" align="center">
                                <template #default="{ row }">
                                    <span style="color: red">{{ row.NgCount }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="UncheckedCount" :label="t('esd.report.uncheckedCount')" :min-width="getColumnWidth3('UncheckedCount')" align="center">
                                <template #default="{ row }">
                                    <span style="color: orange">{{ row.UncheckedCount }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="PassRate" :label="t('esd.report.passRate')" :min-width="getColumnWidth3('PassRate')" align="center">
                                <template #default="{ row }">
                                    <span>{{ row.PassRate }}%</span>
                                </template>
                            </el-table-column>
                            <template #empty><el-empty /></template>
                        </el-table>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <el-dialog :title="t('esd.report.exportTitle')" v-model="exportDialogVisible" width="30%" @close="exportDialogVisible = false" :append-to-body="true" :close-on-click-modal="false">
            <el-select v-model="exportRange" :placeholder="t('esd.report.selectExportRange')" style="width: 100%">
                <el-option :label="t('esd.report.currentPage')" :value="'1'" />
                <el-option :label="t('esd.report.allData')" :value="'0'" />
            </el-select>
            <template #footer>
                <el-button @click="exportDialogVisible = false">{{ t('publicText.cancel') }}</el-button>
                <el-button type="primary" @click="handleExport">{{ t('publicText.confirm') }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onBeforeMount, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import {
    QueryCheckRecordReport,
    QueryCheckRecordTypeSummary,
    QueryCheckRecordStatistics
} from '@/api/esdManage/ESDReport';
import {
    QueryEsdObjectList,
    QueryCheckFrequencyList,
} from '@/api/esdManage/base';
import { shortcuts } from '@/utils/dataMenu'
import { useTableColumnWidth } from '@/hooks/useTableColumnWidth';
import { exportTableByRef } from "@/utils/exportExcel/generalExportExcel";
import { useExport } from "@/utils/exportExcel/loadingExcel";

const { t } = useI18n();
const { showLoading, hideLoading, handleExportSuccess, handleExportError } = useExport();

const selectData = reactive({
    esdType: { list: [] as { label: string; value: string }[], total: 0, pageIndex: 1, pageSize: 10, loading: false },
    checkFrequency: { list: [] as { label: string; value: string }[], total: 0, pageIndex: 1, pageSize: 10, loading: false },
});

const loadEsdTypeData = async () => {
    const state = selectData.esdType;
    state.loading = true;
    try {
        const res: any = await QueryEsdObjectList({ EsdType: '', PageIndex: state.pageIndex, PageSize: state.pageSize });
        if (res.Success) {
            const rows = res.Data.rows || [];
            const unique = new Map<string, string>();
            rows.forEach((item: any) => { if (item.EsdType && !unique.has(item.EsdType)) unique.set(item.EsdTypeCode, item.EsdType); });
            state.list = Array.from(unique).map(([value, label]) => ({ label, value }));
            state.total = res.Data.total || 0;
        }
    } finally { state.loading = false; }
};

const loadCheckFrequencyData = async () => {
    const state = selectData.checkFrequency;
    state.loading = true;
    try {
        const res: any = await QueryCheckFrequencyList({ CheckFrequency: '', PageIndex: state.pageIndex, PageSize: state.pageSize });
        if (res.Success) {
            const rows = res.Data.rows || [];
            state.list = rows.map((item: any) => ({ label: item.CheckFrequency, value: item.CheckFrequency }));
            state.total = res.Data.total || 0;
        }
    } finally { state.loading = false; }
};

const recordReportList = ref<any[]>([]);
const recordTotal = ref(0);
const recordLoading = ref(false);
const recordTime = ref<any[]>([]);
const recordTableRef = ref();

const recordQuery = reactive({
    PageIndex: 1,
    PageSize: 20,
    TimeQueryType: '',
    BaseDate: '',
    StartInspectTime: '',
    EndInspectTime: '',
    Workshop: '',
    LineName: '',
    WorkStation: '',
    EsdType: '',
    EsdTypeCode: '',
    EsdCategory: '',
    CheckFrequency: '',
    TaskCode: '',
    FormName: '',
    DeviceName: '',
    DeviceCode: '',
    Inspector: '',
    CheckResult: '',
    CheckContent: '',
    ProductionBatch: '',
    AbnormalPhenomenon: ''
});

const handleDateRangeChange = (val: any[]) => {
    recordQuery.StartInspectTime = val[0];
    recordQuery.EndInspectTime = val[1];
}

const getRecordReport = async () => {
    recordLoading.value = true;
    try {
        const res: any = await QueryCheckRecordReport(recordQuery);
        if (res.Success) {
            recordReportList.value = res.Data.rows || [];
            recordTotal.value = res.Data.total || 0;
        } else {
            ElMessage.error(res.Message || t('message.queryFailure'));
        }
    } finally { recordLoading.value = false; }
};

const handleRecordSearch = () => { recordQuery.PageIndex = 1; getRecordReport(); };
const resetRecordSearch = () => {
    recordQuery.TimeQueryType = '';
    recordQuery.BaseDate = '';
    recordQuery.StartInspectTime = '';
    recordQuery.EndInspectTime = '';
    recordQuery.Workshop = '';
    recordQuery.LineName = '';
    recordQuery.WorkStation = '';
    recordQuery.EsdType = '';
    recordQuery.EsdTypeCode = '';
    recordQuery.EsdCategory = '';
    recordQuery.CheckFrequency = '';
    recordQuery.TaskCode = '';
    recordQuery.FormName = '';
    recordQuery.DeviceName = '';
    recordQuery.DeviceCode = '';
    recordQuery.Inspector = '';
    recordQuery.CheckResult = '';
    recordQuery.CheckContent = '';
    recordQuery.ProductionBatch = '';
    recordQuery.AbnormalPhenomenon = '';
    recordQuery.PageIndex = 1;
    getRecordReport();
};
const handleRecordSizeChange = (val: number) => { recordQuery.PageSize = val; recordQuery.PageIndex = 1; getRecordReport(); };
const handleRecordCurrentChange = (val: number) => { recordQuery.PageIndex = val; getRecordReport(); };

const exportDialogVisible = ref(false);
const exportRange = ref('1');

const openExportDialog = () => {
    exportDialogVisible.value = true;
};

const handleExport = async () => {
    exportDialogVisible.value = false;
    showLoading(t("esd.report.exportLoading") || "正在导出表格数据...");
    try {
        let dataToExport = [...recordReportList.value];
        if (exportRange.value === "0") {
            const allParams = { ...recordQuery, PageIndex: 1, PageSize: recordTotal.value };
            const res: any = await QueryCheckRecordReport(allParams);
            if (res.Success) {
                dataToExport = res.Data.rows || [];
            } else {
                ElMessage.error(res.Message || t("esd.report.exportFailed"));
                hideLoading();
                return;
            }
        }
        await exportTableByRef(recordTableRef.value, dataToExport, {
            fileName: `${t("esd.report.recordReport") || "ESD点检记录报表"}`,
            sheetName: t("esd.report.recordReport") || "Sheet1",
            excludeProps: ["publicText.index", "publicText.operation"],
            i18nT: t,
        });
        handleExportSuccess(t("esd.report.recordReport") || "ESD点检记录报表");
    } catch (err) {
        handleExportError(err);
    } finally {
        hideLoading();
    }
};

const typeSummaryList = ref<any[]>([]);
const typeLoading = ref(false);
const typeTime = ref<any[]>([]);
const typeTableRef = ref();

const typeQuery = reactive({
    TimeQueryType: '',
    BaseDate: '',
    StartInspectTime: '',
    EndInspectTime: '',
    Workshop: '',
    LineName: '',
    WorkStation: '',
    EsdType: '',
    EsdTypeCode: '',
    EsdCategory: '',
    CheckFrequency: '',
    TaskCode: '',
    FormName: '',
    DeviceName: '',
    DeviceCode: '',
    Inspector: '',
    CheckResult: '',
    CheckContent: '',
    ProductionBatch: '',
    AbnormalPhenomenon: ''
});

const handleTypeDateRangeChange = (val: any[]) => {
    typeQuery.StartInspectTime = val[0];
    typeQuery.EndInspectTime = val[1];
}

const getTypeSummary = async () => {
    typeLoading.value = true;
    try {
        const res: any = await QueryCheckRecordTypeSummary(typeQuery);
        if (res.Success) {
            typeSummaryList.value = res.Data || [];
        } else {
            ElMessage.error(res.Message || t('message.queryFailure'));
        }
    } finally { typeLoading.value = false; }
};

const handleTypeSearch = () => { getTypeSummary(); };
const resetTypeSearch = () => {
    typeQuery.TimeQueryType = '';
    typeQuery.BaseDate = '';
    typeQuery.StartInspectTime = '';
    typeQuery.EndInspectTime = '';
    typeQuery.Workshop = '';
    typeQuery.LineName = '';
    typeQuery.WorkStation = '';
    typeQuery.EsdType = '';
    typeQuery.EsdTypeCode = '';
    typeQuery.EsdCategory = '';
    typeQuery.CheckFrequency = '';
    typeQuery.TaskCode = '';
    typeQuery.FormName = '';
    typeQuery.DeviceName = '';
    typeQuery.DeviceCode = '';
    typeQuery.Inspector = '';
    typeQuery.CheckResult = '';
    typeQuery.CheckContent = '';
    typeQuery.ProductionBatch = '';
    typeQuery.AbnormalPhenomenon = '';
    getTypeSummary();
};

const statisticsList = ref<any[]>([]);
const statLoading = ref(false);
const statTime = ref<any[]>([]);
const statTableRef = ref();
const statSummary = reactive({ TotalCount: 0, OkCount: 0, NgCount: 0, PassRate: '0.00' });

const statQuery = reactive({
    StatisticDimension: '',
    TimeQueryType: '',
    BaseDate: '',
    StartInspectTime: '',
    EndInspectTime: '',
    Workshop: '',
    LineName: '',
    WorkStation: '',
    EsdType: '',
    EsdTypeCode: '',
    EsdCategory: '',
    CheckFrequency: '',
    TaskCode: '',
    FormName: '',
    DeviceName: '',
    DeviceCode: '',
    Inspector: '',
    CheckResult: '',
    CheckContent: '',
    ProductionBatch: '',
    AbnormalPhenomenon: ''
});

const handleStatDateRangeChange = (val: any[]) => {
    statQuery.StartInspectTime = val[0];
    statQuery.EndInspectTime = val[1];
}

const getStatistics = async () => {
    statLoading.value = true;
    try {
        const res: any = await QueryCheckRecordStatistics(statQuery);
        if (res.Success) {
            statisticsList.value = res.Data || [];
            statSummary.TotalCount = statisticsList.value.reduce((sum, item) => sum + (item.TotalCount || 0), 0);
            statSummary.OkCount = statisticsList.value.reduce((sum, item) => sum + (item.OkCount || 0), 0);
            statSummary.NgCount = statisticsList.value.reduce((sum, item) => sum + (item.NgCount || 0), 0);
            statSummary.PassRate = statSummary.TotalCount > 0 ? ((statSummary.OkCount / statSummary.TotalCount) * 100).toFixed(2) : '0.00';
        } else {
            ElMessage.error(res.Message || t('message.queryFailure'));
        }
    } finally { statLoading.value = false; }
};

const handleStatSearch = () => { getStatistics(); };
const resetStatSearch = () => {
    statQuery.StatisticDimension = '';
    statQuery.TimeQueryType = '';
    statQuery.BaseDate = '';
    statQuery.StartInspectTime = '';
    statQuery.EndInspectTime = '';
    statQuery.Workshop = '';
    statQuery.LineName = '';
    statQuery.WorkStation = '';
    statQuery.EsdType = '';
    statQuery.EsdTypeCode = '';
    statQuery.EsdCategory = '';
    statQuery.CheckFrequency = '';
    statQuery.TaskCode = '';
    statQuery.FormName = '';
    statQuery.DeviceName = '';
    statQuery.DeviceCode = '';
    statQuery.Inspector = '';
    statQuery.CheckResult = '';
    statQuery.CheckContent = '';
    statQuery.ProductionBatch = '';
    statQuery.AbnormalPhenomenon = '';
    statSummary.TotalCount = 0;
    statSummary.OkCount = 0;
    statSummary.NgCount = 0;
    statSummary.PassRate = '0.00';
    getStatistics();
};

const getStatDimensionLabel = () => {
    const map: Record<string, string> = {
        'Day': t('esd.report.day'),
        'Month': t('esd.report.month'),
        'Year': t('esd.report.year'),
        'EsdType': t('esd.checklist.esdType'),
        'EsdCategory': t('esd.report.esdCategory'),
        'Workshop': t('esd.task.workshop'),
        'LineName': t('esd.task.lineName'),
        'WorkStation': t('esd.task.workStation'),
        'ProductionBatch': t('esd.task.productionBatch'),
        'CheckContent': t('esd.checklist.checkContent'),
    };
    return map[statQuery.StatisticDimension] || t('esd.report.statisticKey');
};

const activeTab = ref('recordReport');
const handleTabChange = (tab: string) => {
    if (tab === 'recordReport') getRecordReport();
    else if (tab === 'typeSummary') getTypeSummary();
    else if (tab === 'statistics') getStatistics();
};

const tableHeight = ref(0);
const tableHeight2 = ref(0);
const tableHeight3 = ref(0);
const getScreenHeight = () => {
    nextTick(() => { tableHeight.value = window.innerHeight - 330;
        tableHeight2.value = window.innerHeight - 250;
        tableHeight3.value = window.innerHeight - 350;
     });
   
};

const excludeLabels = [t("publicText.index"), t("publicText.operation")];

const { getColumnWidth } = useTableColumnWidth(recordTableRef, recordReportList, {
    padding: 25,
    fontSize: 13,
    excludeLabels
});

const { getColumnWidth: getColumnWidth2 } = useTableColumnWidth(typeTableRef, typeSummaryList, {
    padding: 25,
    fontSize: 13,
    excludeLabels
});

const { getColumnWidth: getColumnWidth3 } = useTableColumnWidth(statTableRef, statisticsList, {
    padding: 25,
    fontSize: 13,
    excludeLabels
});

onBeforeMount(() => {
    getScreenHeight();
    loadEsdTypeData();
    loadCheckFrequencyData();
    getRecordReport();
});

onMounted(() => window.addEventListener('resize', getScreenHeight));
onBeforeUnmount(() => window.removeEventListener('resize', getScreenHeight));
</script>

<style scoped>
.pagination-wrapper {
    display: flex;
    justify-content: center;
    padding: 4px 0;
    border-top: 1px solid #dcdfe6;
}

.el-pagination {
    justify-content: center;
}
</style>