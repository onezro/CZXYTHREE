<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <!-- Tabs -->
            <el-tabs v-model="activeTab" @tab-change="handleTabChange">
                <!-- 待执行任务 -->
                <el-tab-pane :label="t('esd.task.pending')" name="pending">
                    <div class="tab-content">
                        <!-- 查询表单 -->
                        <el-form :inline="true" :model="pendingQuery" label-width="auto" @submit.prevent size="small">
                            <el-form-item :label="t('esd.task.taskCode')" class="mb-2">
                                <el-input v-model="pendingQuery.TaskCode"
                                    :placeholder="t('esd.task.taskCodePlaceholder')" clearable style="width:160px" />
                            </el-form-item>
                            <el-form-item :label="t('esd.checklist.formName')" class="mb-2">
                                <el-input v-model="pendingQuery.FormName"
                                    :placeholder="t('esd.checklist.formNamePlaceholder')" clearable
                                    style="width:160px" />
                            </el-form-item>
                            <el-form-item :label="t('esd.checklist.esdType')" class="mb-2">
                                <el-select v-model="pendingQuery.EsdType" placeholder="请选择" clearable
                                    style="width:160px" popper-class="esd-type-popper"
                                    v-loading="selectData.esdType.loading">
                                    <el-option v-for="item in selectData.esdType.list" :key="item.value"
                                        :label="item.label" :value="item.value" />
                                    <template #footer>
                                        <el-pagination small layout="prev, pager, next"
                                            :total="selectData.esdType.total" :page-size="selectData.esdType.pageSize"
                                            v-model:current-page="selectData.esdType.pageIndex"
                                            @current-change="loadEsdTypeData" class="pagination-wrapper" />
                                    </template>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="t('esd.checklist.checkFrequency')" class="mb-2">
                                <el-select v-model="pendingQuery.CheckFrequency" placeholder="请选择" clearable
                                    style="width:160px" popper-class="frequency-popper"
                                    v-loading="selectData.checkFrequency.loading">
                                    <el-option v-for="item in selectData.checkFrequency.list" :key="item.value"
                                        :label="item.label" :value="item.value" />
                                    <template #footer>
                                        <el-pagination small layout="prev, pager, next"
                                            :total="selectData.checkFrequency.total"
                                            :page-size="selectData.checkFrequency.pageSize"
                                            v-model:current-page="selectData.checkFrequency.pageIndex"
                                            @current-change="loadCheckFrequencyData" class="pagination-wrapper" />
                                    </template>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="t('esd.task.timeQueryType')" class="mb-2">
                                <el-select v-model="pendingQuery.TimeQueryType" placeholder="请选择" clearable
                                    style="width:160px">
                                    <el-option label="Day" value="Day" />
                                    <el-option label="Week" value="Week" />
                                    <el-option label="Month" value="Month" />
                                    <el-option label="Custom" value="Custom" />
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="t('esd.task.baseDate')" class="mb-2">
                                <el-date-picker v-model="pendingQuery.BaseDate" type="date" placeholder="选择日期"
                                    value-format="YYYY-MM-DD" style="width:160px" />
                            </el-form-item>
                            <el-form-item :label="t('esd.task.Time')" class="mb-2">
                                <el-date-picker v-model="pendingTime" type="datetimerange" range-separator="至"
                                    start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD HH:mm:ss"
                                    :shortcuts="shortcuts"
                                    :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
                                    :clearable="false" @change="handleDateRangeChange" />
                            </el-form-item>

                            <!-- <el-form-item :label="t('esd.task.startExecuteTime')">
                                <el-date-picker v-model="pendingQuery.StartExecuteTime" type="datetime"
                                    placeholder="开始时间" value-format="YYYY-MM-DD HH:mm:ss" style="width:180px" />
                            </el-form-item>
                            <el-form-item :label="t('esd.task.endExecuteTime')">
                                <el-date-picker v-model="pendingQuery.EndExecuteTime" type="datetime" placeholder="结束时间"
                                    value-format="YYYY-MM-DD HH:mm:ss" style="width:180px" />
                            </el-form-item> -->
                            <el-form-item class="mb-2">
                                <el-button type="primary" @click="handlePendingSearch">{{ t('publicText.query')
                                    }}</el-button>
                                <el-button @click="resetPendingSearch">{{ t('publicText.reset') }}</el-button>
                                <el-button type="warning" size="small" @click="openAddTask">{{ t('esd.task.addTask')
                                    }}</el-button>
                            </el-form-item>
                        </el-form>
                        <!-- 操作按钮 -->
                        <!-- <div class="mb-2 flex justify-between">
                            <div>
                                
                                <el-button type="success" size="small" @click="handleAutoDispatch">{{
                                    t('esd.task.autoDispatch') }}</el-button>
                            </div>
                        </div> -->
                        <!-- 表格 -->
                        <el-table ref="pendTableRef" :data="pendingTasks" border :height="tableHeight" stripe
                            size="small">
                            <el-table-column type="index" :label="t('publicText.index')" width="55" align="center">
                                <template #default="{ $index }">
                                    {{ $index + 1 + (pendingQuery.PageIndex - 1) * pendingQuery.PageSize }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="TaskCode" :label="t('esd.task.taskCode')"
                                :min-width="getColumnWidth('TaskCode')" />
                            <el-table-column prop="EsdType" :label="t('esd.checklist.esdType')"
                                :min-width="getColumnWidth('EsdType')" />
                            <el-table-column prop="FormName" :label="t('esd.checklist.formName')"
                                :min-width="getColumnWidth('FormName')" />
                            <el-table-column prop="FormCode" :label="t('esd.checklist.formCode')"
                                :min-width="getColumnWidth('FormCode')" />
                            <el-table-column prop="ExecuteStatus" :label="t('esd.task.executeStatus')"
                                :min-width="getColumnWidth('ExecuteStatus')" align="center">
                                <template #default="{ row }">
                                    <el-tag :type="getExecuteStatus(row.ExecuteStatus)">
                                        {{ getExecuteStatusText(row.ExecuteStatus) }}
                                    </el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column prop="ExecuteTime" :label="t('esd.task.executeTime')"
                                :min-width="getColumnWidth('ExecuteTime')" />
                            <el-table-column prop="CreateTime" :label="t('esd.checklist.createTime')"
                                :min-width="getColumnWidth('CreateTime')" />
                            <el-table-column prop="CreateUser" :label="t('esd.checklist.createUser')"
                                :min-width="getColumnWidth('CreateUser')" />
                            <el-table-column :label="t('publicText.operation')" fixed="right" width="260"
                                align="center">
                                <template #default="{ row }">
                                    <el-button size="small" type="warning" @click="viewTaskDetail(row.TaskCode)" icon="Tickets"></el-button>
                                    <el-button size="small" type="primary" @click="openEditTask(row)" icon="Edit" />
                                    <el-button size="small" type="info" @click="handleScrapTask(row)"
                                        icon="DocumentDelete" />
                                    <el-button size="small" type="danger" @click="handleDeleteTask(row)"
                                        icon="Delete" />
                                </template>
                            </el-table-column>
                            <template #empty><el-empty /></template>
                        </el-table>
                        <el-pagination class="mt-2" align="center" background size="small"
                            @size-change="handlePendingSizeChange" @current-change="handlePendingCurrentChange"
                            :current-page="pendingQuery.PageIndex" :page-size="pendingQuery.PageSize"
                            :page-sizes="[10, 20, 50, 100]" layout="total,sizes, prev, pager, next"
                            :total="pendingTotal" />
                    </div>
                </el-tab-pane>

                <!-- 已完成任务 -->
                <el-tab-pane :label="t('esd.task.completed')" name="completed">
                    <div class="tab-content">
                        <el-form :inline="true" :model="completedQuery" label-width="auto" @submit.prevent size="small">
                            <el-form-item :label="t('esd.task.taskCode')" class="mb-2">
                                <el-input v-model="completedQuery.TaskCode"
                                    :placeholder="t('esd.task.taskCodePlaceholder')" clearable style="width:160px" />
                            </el-form-item>
                            <el-form-item :label="t('esd.checklist.formName')" class="mb-2">
                                <el-input v-model="completedQuery.FormName"
                                    :placeholder="t('esd.checklist.formNamePlaceholder')" clearable
                                    style="width:160px" />
                            </el-form-item>
                            <el-form-item :label="t('esd.checklist.esdType')" class="mb-2">
                                <el-select v-model="completedQuery.EsdType" placeholder="请选择" clearable
                                    style="width:160px" popper-class="esd-type-popper"
                                    v-loading="selectData.esdType.loading">
                                    <el-option v-for="item in selectData.esdType.list" :key="item.value"
                                        :label="item.label" :value="item.value" />
                                    <template #footer>
                                        <el-pagination small layout="prev, pager, next"
                                            :total="selectData.esdType.total" :page-size="selectData.esdType.pageSize"
                                            v-model:current-page="selectData.esdType.pageIndex"
                                            @current-change="loadEsdTypeData" class="pagination-wrapper" />
                                    </template>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="t('esd.checklist.checkFrequency')" class="mb-2">
                                <el-select v-model="completedQuery.CheckFrequency" placeholder="请选择" clearable
                                    style="width:160px" popper-class="frequency-popper"
                                    v-loading="selectData.checkFrequency.loading">
                                    <el-option v-for="item in selectData.checkFrequency.list" :key="item.value"
                                        :label="item.label" :value="item.value" />
                                    <template #footer>
                                        <el-pagination small layout="prev, pager, next"
                                            :total="selectData.checkFrequency.total"
                                            :page-size="selectData.checkFrequency.pageSize"
                                            v-model:current-page="selectData.checkFrequency.pageIndex"
                                            @current-change="loadCheckFrequencyData" class="pagination-wrapper" />
                                    </template>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="t('esd.task.timeQueryType')" class="mb-2">
                                <el-select v-model="completedQuery.TimeQueryType" placeholder="请选择" clearable
                                    style="width:160px">
                                    <el-option label="Day" value="Day" />
                                    <el-option label="Week" value="Week" />
                                    <el-option label="Month" value="Month" />
                                    <el-option label="Custom" value="Custom" />
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="t('esd.task.baseDate')" class="mb-2">
                                <el-date-picker v-model="completedQuery.BaseDate" type="date" placeholder="选择日期"
                                    value-format="YYYY-MM-DD" style="width:160px" />
                            </el-form-item>
                            <el-form-item :label="t('esd.task.Time')" class="mb-2">
                                <el-date-picker v-model="completedTime" type="datetimerange" range-separator="至"
                                    start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD HH:mm:ss"
                                    :shortcuts="shortcuts"
                                    :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
                                    :clearable="false" @change="handleCompletedDateRangeChange" />
                            </el-form-item>


                            <el-form-item class="mb-2">
                                <el-button type="primary" @click="handleCompletedSearch">{{ t('publicText.query')
                                    }}</el-button>
                                <el-button @click="resetCompletedSearch">{{ t('publicText.reset') }}</el-button>
                            </el-form-item>
                        </el-form>
                        <el-table :data="completedTasks" ref="completedTableRef" border :height="tableHeight" stripe
                            size="small">
                            <el-table-column type="index" :label="t('publicText.index')" width="55" align="center">
                                <template #default="{ $index }">
                                    {{ $index + 1 + (completedQuery.PageIndex - 1) * completedQuery.PageSize }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="TaskCode" :label="t('esd.task.taskCode')"
                                :min-width="getColumnWidth2('TaskCode')" />
                            <el-table-column prop="EsdType" :label="t('esd.checklist.esdType')"
                                :min-width="getColumnWidth2('EsdType')" />
                            <el-table-column prop="FormName" :label="t('esd.checklist.formName')"
                                :min-width="getColumnWidth2('FormName')" />
                            <el-table-column prop="FormCode" :label="t('esd.checklist.formCode')"
                                :min-width="getColumnWidth2('FormCode')" />
                            <el-table-column prop="ExecuteStatus" :label="t('esd.task.executeStatus')"
                                :min-width="getColumnWidth2('ExecuteStatus')" align="center">
                                <template #default="{ row }">
                                    <el-tag :type="getExecuteStatus(row.ExecuteStatus)">
                                        {{ getExecuteStatusText(row.ExecuteStatus) }}
                                    </el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column prop="ExecuteTime" :label="t('esd.task.executeTime')"
                                :min-width="getColumnWidth2('ExecuteTime')" />
                            <el-table-column prop="CreateTime" :label="t('esd.checklist.createTime')"
                                :min-width="getColumnWidth2('CreateTime')" />
                            <el-table-column prop="CreateUser" :label="t('esd.checklist.createUser')"
                                :min-width="getColumnWidth2('CreateUser')" />
                            <el-table-column :label="t('publicText.operation')" fixed="right" width="120"
                                align="center">
                                <template #default="{ row }">
                                    <el-button size="small" type="warning" @click="viewTaskDetail(row.TaskCode)" icon="Tickets"></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-pagination class="mt-2" align="center" background size="small"
                            @size-change="handleCompletedSizeChange" @current-change="handleCompletedCurrentChange"
                            :current-page="completedQuery.PageIndex" :page-size="completedQuery.PageSize"
                            :page-sizes="[10, 20, 50, 100]" layout="total,sizes, prev, pager, next"
                            :total="completedTotal" />
                    </div>
                </el-tab-pane>

                <!-- 已作废任务 -->
                <el-tab-pane :label="t('esd.task.scrapped')" name="scrapped">
                    <!-- 结构与已完成类似，仅接口不同 -->
                    <div class="tab-content">
                        <el-form :inline="true" :model="scrappedQuery" label-width="auto" @submit.prevent size="small">
                            <el-form-item :label="t('esd.task.taskCode')" class="mb-2">
                                <el-input v-model="scrappedQuery.TaskCode"
                                    :placeholder="t('esd.task.taskCodePlaceholder')" clearable style="width:160px" />
                            </el-form-item>
                            <el-form-item :label="t('esd.checklist.formName')" class="mb-2">
                                <el-input v-model="scrappedQuery.FormName"
                                    :placeholder="t('esd.checklist.formNamePlaceholder')" clearable
                                    style="width:160px" />
                            </el-form-item>
                            <el-form-item :label="t('esd.checklist.esdType')" class="mb-2">
                                <el-select v-model="scrappedQuery.EsdType" placeholder="请选择" clearable
                                    style="width:160px" popper-class="esd-type-popper"
                                    v-loading="selectData.esdType.loading">
                                    <el-option v-for="item in selectData.esdType.list" :key="item.value"
                                        :label="item.label" :value="item.value" />
                                    <template #footer>
                                        <el-pagination small layout="prev, pager, next"
                                            :total="selectData.esdType.total" :page-size="selectData.esdType.pageSize"
                                            v-model:current-page="selectData.esdType.pageIndex"
                                            @current-change="loadEsdTypeData" class="pagination-wrapper" />
                                    </template>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="t('esd.checklist.checkFrequency')" class="mb-2">
                                <el-select v-model="scrappedQuery.CheckFrequency" placeholder="请选择" clearable
                                    style="width:160px" popper-class="frequency-popper"
                                    v-loading="selectData.checkFrequency.loading">
                                    <el-option v-for="item in selectData.checkFrequency.list" :key="item.value"
                                        :label="item.label" :value="item.value" />
                                    <template #footer>
                                        <el-pagination small layout="prev, pager, next"
                                            :total="selectData.checkFrequency.total"
                                            :page-size="selectData.checkFrequency.pageSize"
                                            v-model:current-page="selectData.checkFrequency.pageIndex"
                                            @current-change="loadCheckFrequencyData" class="pagination-wrapper" />
                                    </template>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="t('esd.task.timeQueryType')" class="mb-2">
                                <el-select v-model="scrappedQuery.TimeQueryType" placeholder="请选择" clearable
                                    style="width:160px">
                                    <el-option label="Day" value="Day" />
                                    <el-option label="Week" value="Week" />
                                    <el-option label="Month" value="Month" />
                                    <el-option label="Custom" value="Custom" />
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="t('esd.task.baseDate')" class="mb-2">
                                <el-date-picker v-model="scrappedQuery.BaseDate" type="date" placeholder="选择日期"
                                    value-format="YYYY-MM-DD" style="width:160px" />
                            </el-form-item>
                            <el-form-item :label="t('esd.task.Time')" class="mb-2">
                                <el-date-picker v-model="scrappedTime" type="datetimerange" range-separator="至"
                                    start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD HH:mm:ss"
                                    :shortcuts="shortcuts"
                                    :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
                                    :clearable="false" @change="handleScappedDateRangeChange" />
                            </el-form-item>
                            <el-form-item class="mb-2">
                                <el-button type="primary" @click="handleScappedSearch">{{ t('publicText.query')
                                    }}</el-button>
                                <el-button @click="resetScappedSearch">{{ t('publicText.reset') }}</el-button>
                            </el-form-item>
                        </el-form>
                        <el-table :data="scrappedTasks" ref="scrappedTableRef" border :height="tableHeight" stripe
                            size="small">
                            <el-table-column type="index" :label="t('publicText.index')" width="55" align="center">
                                <template #default="{ $index }">
                                    {{ $index + 1 + (scrappedQuery.PageIndex - 1) * scrappedQuery.PageSize }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="TaskCode" :label="t('esd.task.taskCode')"
                                :min-width="getColumnWidth3('TaskCode')" />
                            <el-table-column prop="EsdType" :label="t('esd.checklist.esdType')"
                                :min-width="getColumnWidth3('EsdType')" />
                            <el-table-column prop="FormName" :label="t('esd.checklist.formName')"
                                :min-width="getColumnWidth3('FormName')" />
                            <el-table-column prop="FormCode" :label="t('esd.checklist.formCode')"
                                :min-width="getColumnWidth3('FormCode')" />
                            <el-table-column prop="ExecuteStatus" :label="t('esd.task.executeStatus')"
                                :min-width="getColumnWidth3('ExecuteStatus')" align="center">
                                <template #default="{ row }">
                                    <el-tag :type="getExecuteStatus(row.ExecuteStatus)">
                                        {{ getExecuteStatusText(row.ExecuteStatus) }}
                                    </el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column prop="ExecuteTime" :label="t('esd.task.executeTime')"
                                :min-width="getColumnWidth3('ExecuteTime')" />
                            <el-table-column prop="CreateTime" :label="t('esd.checklist.createTime')"
                                :min-width="getColumnWidth3('CreateTime')" />
                            <el-table-column prop="CreateUser" :label="t('esd.checklist.createUser')"
                                :min-width="getColumnWidth3('CreateUser')" />
                            <!-- 列同上，无操作列（仅查看详情） -->
                            <el-table-column :label="t('publicText.operation')" fixed="right" width="120"
                                align="center">
                                <template #default="{ row }">
                                    <el-button size="small" type="warning" @click="viewTaskDetail(row.TaskCode)" icon="Tickets"></el-button>
                                </template>
                            </el-table-column>

                        </el-table>
                        <el-pagination class="mt-2" align="center" background size="small"
                            @size-change="handleScappedSizeChange" @current-change="handleScappedCurrentChange"
                            :current-page="scrappedQuery.PageIndex" :page-size="scrappedQuery.PageSize"
                            :page-sizes="[10, 20, 50, 100]" layout="total,sizes, prev, pager, next"
                            :total="scrappedTotal" />
                    </div>

                </el-tab-pane>

                <!-- 周期计划 -->
                <el-tab-pane :label="t('esd.task.plan')" name="plan">
                    <div class="tab-content">
                        <el-form :inline="true" :model="planQuery" label-width="auto" @submit.prevent size="small">
                            <el-form-item :label="t('esd.task.planCode')" class="mb-2">
                                <el-input v-model="planQuery.PlanCode" :placeholder="t('esd.task.planCodePlaceholder')"
                                    clearable style="width:160px" />
                            </el-form-item>
                            <el-form-item :label="t('esd.task.planName')" class="mb-2">
                                <el-input v-model="planQuery.PlanName" :placeholder="t('esd.task.planNamePlaceholder')"
                                    clearable style="width:160px" />
                            </el-form-item>
                            <el-form-item :label="t('esd.checklist.esdType')" class="mb-2">
                                <el-select v-model="planQuery.EsdType" placeholder="请选择" clearable style="width:160px"
                                    popper-class="esd-type-popper" v-loading="selectData.esdType.loading">
                                    <el-option v-for="item in selectData.esdType.list" :key="item.value"
                                        :label="item.label" :value="item.value" />
                                    <template #footer>
                                        <el-pagination small layout="prev, pager, next"
                                            :total="selectData.esdType.total" :page-size="selectData.esdType.pageSize"
                                            v-model:current-page="selectData.esdType.pageIndex"
                                            @current-change="loadEsdTypeData" class="pagination-wrapper" />
                                    </template>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="t('esd.task.workshop')" class="mb-2">
                                <el-input v-model="planQuery.Workshop" placeholder="车间" clearable style="width:160px" />
                            </el-form-item>
                            <el-form-item :label="t('esd.task.lineName')" class="mb-2">
                                <el-input v-model="planQuery.LineName" placeholder="线体" clearable style="width:160px" />
                            </el-form-item>
                            <el-form-item :label="t('esd.task.workStation')" class="mb-2">
                                <el-input v-model="planQuery.WorkStation" placeholder="工位" clearable
                                    style="width:160px" />
                            </el-form-item>
                            <el-form-item :label="t('esd.task.responsibleUser')" class="mb-2">
                                <el-input v-model="planQuery.ResponsibleUser"
                                    :placeholder="t('esd.task.responsibleUserPlaceholder')" clearable
                                    style="width:160px" />
                            </el-form-item>
                            <el-form-item :label="t('esd.task.auditStatus')" class="mb-2">
                                <el-select v-model="planQuery.AuditStatus" placeholder="请选择" clearable
                                    style="width:160px">
                                    <el-option :label="t('esd.task.auditStatusPending')" :value="0" />
                                    <el-option :label="t('esd.task.auditStatusApproved')" :value="1" />
                                    <el-option :label="t('esd.task.auditStatusRejected')" :value="2" />
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="t('esd.task.planStatus')" class="mb-2">
                                <el-select v-model="planQuery.PlanStatus" placeholder="请选择" clearable
                                    style="width:160px">
                                    <el-option :label="t('esd.task.planStatusActive')" :value="0" />
                                    <el-option :label="t('esd.task.planStatusInactive')" :value="1" />
                                </el-select>
                            </el-form-item>
                            <el-form-item class="mb-2">
                                <el-button type="primary" @click="handlePlanSearch">{{ t('publicText.query')
                                    }}</el-button>
                                <el-button @click="resetPlanSearch">{{ t('publicText.reset') }}</el-button>
                                <el-button type="warning" size="small" @click="openAddPlan">{{ t('esd.task.addPlan')
                                    }}</el-button>
                                <el-button type="success" size="small" @click="handleAutoDispatch">{{
                                    t('esd.task.autoDispatch')
                                    }}</el-button>
                            </el-form-item>
                        </el-form>
                        <!-- <div class="mb-2">
                            
                        </div> -->
                        <el-table :data="planList" ref="planListRef" border :height="tableHeight" stripe size="small"
                            v-loading="planLoading">
                            <!-- 列：PlanCode, PlanName, FormName, EsdType, Workshop, LineName, WorkStation, ResponsibleUser, EffectiveTime, AuditStatus, PlanStatus -->
                            <el-table-column prop="PlanCode" :label="t('esd.task.planCode')"
                                :min-width="getColumnWidth4('PlanCode')" />
                            <el-table-column prop="PlanName" :label="t('esd.task.planName')"
                                :min-width="getColumnWidth4('PlanName')" />
                            <el-table-column prop="FormName" :label="t('esd.checklist.formName')"
                                :min-width="getColumnWidth4('FormName')" />
                            <el-table-column prop="EsdType" :label="t('esd.checklist.esdType')"
                                :min-width="getColumnWidth4('EsdType')" />
                            <el-table-column prop="Workshop" :label="t('esd.task.workshop')"
                                :min-width="getColumnWidth4('Workshop')" />
                            <el-table-column prop="LineName" :label="t('esd.task.lineName')"
                                :min-width="getColumnWidth4('LineName')" />
                            <el-table-column prop="WorkStation" :label="t('esd.task.workStation')"
                                :min-width="getColumnWidth4('WorkStation')" />
                            <el-table-column prop="ResponsibleUser" :label="t('esd.task.responsibleUser')"
                                :min-width="getColumnWidth4('ResponsibleUser')" />
                            <el-table-column prop="EffectiveTime" :label="t('esd.task.effectiveTime')"
                                :min-width="getColumnWidth4('EffectiveTime')" />
                            <el-table-column :label="t('esd.task.auditStatus')" min-width="100" align="center">
                                <template #default="{ row }">
                                    <el-tag
                                        :type="row.AuditStatus === 0 ? 'info' : row.AuditStatus === 1 ? 'success' : 'danger'">
                                        {{ row.AuditStatus === 0 ? t('esd.task.auditStatusPending') : row.AuditStatus
                                            === 1 ? t('esd.task.auditStatusApproved') : t('esd.task.auditStatusRejected') }}
                                    </el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column :label="t('esd.task.planStatus')" min-width="100" align="center">
                                <template #default="{ row }">
                                    <el-tag :type="row.PlanStatus === 0 ? 'success' : 'info'">
                                        {{ row.PlanStatus === 0 ? t('esd.task.planStatusActive') :
                                            t('esd.task.planStatusInactive') }}
                                    </el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column :label="t('publicText.operation')" fixed="right" width="80" align="center">
                                <template #default="{ row }">
                                    <el-button size="small" type="primary" @click="openAuditPlan(row)"
                                        :disabled="row.AuditStatus !== 0">{{ t('esd.task.audit') }}</el-button>
                                    <!-- 审核通过/驳回可能两个按钮，简化为一个弹窗选择 -->
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-pagination class="mt-2" align="center" background size="small"
                            @size-change="handlePlanSizeChange" @current-change="handlePlanCurrentChange"
                            :current-page="planQuery.PageIndex" :page-size="planQuery.PageSize"
                            :page-sizes="[10, 20, 50, 100]" layout="total,sizes, prev, pager, next"
                            :total="planTotal" />
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <!-- ========== 新增任务弹窗 ========== -->
        <el-dialog :title="t('esd.task.addTask')" v-model="addTaskDialogVisible" width="600px" align-center
            :close-on-click-modal="false">
            <el-form ref="addTaskFormRef" :model="addTaskForm" :rules="addTaskRules" label-width="120px" size="small">
                <el-form-item :label="t('esd.task.selectForm')" prop="FormId" required>
                    <el-select v-model="addTaskForm.FormId" placeholder="请选择点检表单" clearable style="width:100%"
                        popper-class="form-popper" v-loading="formLoading" filterable>
                        <el-option v-for="item in formOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                        <!-- 如果有分页，也可以加footer -->
                    </el-select>
                </el-form-item>
                <el-form-item :label="t('esd.task.esdTypeCode')" prop="EsdTypeCode">
                    <el-select v-model="addTaskForm.EsdTypeCode" placeholder="请选择" 
                        popper-class="esd-type-popper" v-loading="selectData.esdType.loading">
                        <el-option v-for="item in selectData.esdType.list" :key="item.value" :label="item.value+'-'+item.label"
                            :value="item.value" />
                        <template #footer>
                            <el-pagination small layout="prev, pager, next" :total="selectData.esdType.total"
                                :page-size="selectData.esdType.pageSize"
                                v-model:current-page="selectData.esdType.pageIndex" @current-change="loadEsdTypeData"
                                class="pagination-wrapper" />
                        </template>
                    </el-select>
                    <!-- <el-input v-model="addTaskForm.EsdTypeCode" placeholder="ESD类型编码" /> -->
                </el-form-item>
                <el-form-item :label="t('esd.task.workStation')" prop="WorkStation">
                    <el-input v-model="addTaskForm.WorkStation" placeholder="工位" />
                </el-form-item>
                <el-form-item :label="t('esd.task.responsibleUser')" prop="ResponsibleUser">
                    <el-select-v2 v-model="addTaskForm.ResponsibleUser" :multiple="true" filterable
                        :options="employeeList" 
                        :placeholder="t('esd.task.responsibleUserPlaceholder')" style="width:100%">
                        
                    </el-select-v2>
                </el-form-item>
                <el-form-item :label="t('esd.task.productionBatch')" prop="ProductionBatch">
                    <el-input v-model="addTaskForm.ProductionBatch" placeholder="生产批次" />
                </el-form-item>
                <el-form-item :label="t('esd.task.effectiveTime')" prop="EffectiveTime">
                    <el-date-picker v-model="addTaskForm.EffectiveTime" type="datetime" placeholder="选择生效时间"
                        value-format="YYYY-MM-DD HH:mm:ss" style="width:100%" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="addTaskDialogVisible = false">{{ t('publicText.cancel') }}</el-button>
                <el-button type="primary" @click="submitAddTask" :loading="submitLoading">{{ t('publicText.confirm')
                    }}</el-button>
            </template>
        </el-dialog>

        <!-- ========== 编辑任务弹窗 ========== -->
        <el-dialog :title="t('esd.task.editTask')" v-model="editTaskDialogVisible" width="80%" align-center
            :close-on-click-modal="false">
            <el-form ref="editTaskFormRef" :model="editTaskForm" :rules="editTaskRules" label-width="120px" size="small">
                <el-form-item :label="t('esd.task.taskCode')">
                    <el-input v-model="editTaskForm.TaskCode" disabled />
                </el-form-item>
                <el-form-item :label="t('esd.task.workStation')" prop="WorkStation">
                    <el-input v-model="editTaskForm.WorkStation" placeholder="工位" />
                </el-form-item>
                <el-form-item :label="t('esd.task.responsibleUser')" prop="ResponsibleUser">
                    <el-select-v2 v-model="editTaskForm.ResponsibleUser" :multiple="true" filterable
                        :options="employeeList" :label-field="getEmployeeLabel" :value-field="'EmployeeName'"
                        :placeholder="t('esd.task.responsibleUserPlaceholder')" style="width:100%">
                        <template #item-template="{ option }">
                            <span>{{ option.EmployeeName }} {{ option.FullName }}</span>
                        </template>
                    </el-select-v2>
                </el-form-item>
                <el-form-item :label="t('esd.task.productionBatch')" prop="ProductionBatch">
                    <el-input v-model="editTaskForm.ProductionBatch" placeholder="生产批次" />
                </el-form-item>
                <el-form-item :label="t('esd.task.effectiveTime')" prop="EffectiveTime">
                    <el-date-picker v-model="editTaskForm.EffectiveTime" type="datetime" placeholder="选择生效时间"
                        value-format="YYYY-MM-DD HH:mm:ss" style="width:100%" />
                </el-form-item>
                <el-form-item :label="t('esd.task.taskItems')">
                    <el-table :data="editTaskForm.Items" border size="small" height="300">
                        <el-table-column type="index" label="序号" width="50" align="center" />
                         <el-table-column prop="CheckContent" :label="t('esd.checklist.checkContent')" min-width="150">
                            <template #default="{ row }">
                                <el-input v-model="row.CheckContent" size="small" />
                            </template>
                        </el-table-column>
                        <el-table-column prop="MeasureDevice" :label="t('esd.checklist.measureDevice')" min-width="120">
                            <template #default="{ row }">
                                <el-input v-model="row.MeasureDevice" size="small" />
                            </template>
                        </el-table-column>
                        <el-table-column prop="LowerLimit" :label="t('esd.checklist.lowerLimit')" min-width="100" align="center">
                            <template #default="{ row }">
                                <el-input v-model="row.LowerLimit" size="small" />
                            </template>
                        </el-table-column>
                        <el-table-column prop="UpperLimit" :label="t('esd.checklist.upperLimit')" min-width="100" align="center">
                            <template #default="{ row }">
                                <el-input v-model="row.UpperLimit" size="small" />
                            </template>
                        </el-table-column>
                        <el-table-column prop="SortNo" :label="t('esd.checklist.sortNo')" width="150" align="center">
                            <template #default="{ row }">
                                <el-input-number v-model="row.SortNo" size="small" :min="1" />
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="editTaskDialogVisible = false">{{ t('publicText.cancel') }}</el-button>
                <el-button type="primary" @click="submitEditTask" :loading="submitLoading">{{ t('publicText.confirm')
                    }}</el-button>
            </template>
        </el-dialog>

        <!-- ========== 任务详情弹窗 ========== -->
        <el-dialog :title="t('esd.task.taskDetail')" v-model="detailDialogVisible" width="800px" align-center>
            <div v-if="taskDetail">
                <el-descriptions :column="2" border size="small">
                    <el-descriptions-item :label="t('esd.task.taskCode')">{{ taskDetail.Task.TaskCode
                        }}</el-descriptions-item>
                    <el-descriptions-item :label="t('esd.checklist.esdType')">{{ taskDetail.Task.EsdType
                        }}</el-descriptions-item>
                    <el-descriptions-item :label="t('esd.checklist.formName')">{{ taskDetail.Task.FormName
                        }}</el-descriptions-item>
                    <el-descriptions-item :label="t('esd.task.executeStatus')">
                        <!-- <el-tag :type="taskDetail.Task.ExecuteStatus === 0 ? 'warning' : 'success'">
                            {{ taskDetail.Task.ExecuteStatus === 0 ? t('esd.task.pending') : t('esd.task.completed') }}
                        </el-tag> -->
                        <el-tag :type="getExecuteStatus(taskDetail.Task.ExecuteStatus)">
                            {{ getExecuteStatusText(taskDetail.Task.ExecuteStatus) }}
                        </el-tag>
                    </el-descriptions-item>
                </el-descriptions>
                <el-divider>{{ t('esd.task.taskItems') }}</el-divider>
                <el-table :data="taskDetail.Items" border size="small" height="400">
                    <el-table-column type="index" label="序号" width="50" align="center" />
                    <el-table-column prop="CheckContent" :label="t('esd.checklist.checkContent')" min-width="150" />
                    <el-table-column prop="MeasureDevice" :label="t('esd.checklist.measureDevice')" min-width="150" />
                    <el-table-column prop="LowerLimit" :label="t('esd.checklist.lowerLimit')" min-width="100"
                        align="center" />
                    <el-table-column prop="UpperLimit" :label="t('esd.checklist.upperLimit')" min-width="100"
                        align="center" />
                    <el-table-column prop="SortNo" :label="t('esd.checklist.sortNo')" width="80" align="center" />
                </el-table>
            </div>
        </el-dialog>

        <!-- ========== 新增周期计划弹窗 ========== -->
        <el-dialog :title="t('esd.task.addPlan')" v-model="addPlanDialogVisible" width="600px" align-center
            :close-on-click-modal="false">
            <el-form ref="addPlanFormRef" :model="addPlanForm" :rules="addPlanRules" label-width="120px" size="small">
                <el-form-item :label="t('esd.task.planCode')" prop="PlanCode">
                    <el-input v-model="addPlanForm.PlanCode" :placeholder="t('esd.task.planCodePlaceholder')" />
                </el-form-item>
                <el-form-item :label="t('esd.task.planName')" prop="PlanName" required>
                    <el-input v-model="addPlanForm.PlanName" :placeholder="t('esd.task.planNamePlaceholder')" />
                </el-form-item>
                <el-form-item :label="t('esd.task.selectForm')" prop="FormId" required>
                    <el-select v-model="addPlanForm.FormId" placeholder="请选择点检表单" clearable style="width:100%"
                        popper-class="form-popper" v-loading="formLoading" filterable>
                        <el-option v-for="item in formOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="t('esd.task.workshop')" prop="Workshop">
                    <el-input v-model="addPlanForm.Workshop" placeholder="车间" />
                </el-form-item>
                <el-form-item :label="t('esd.task.lineName')" prop="LineName">
                    <el-input v-model="addPlanForm.LineName" placeholder="线体" />
                </el-form-item>
                <el-form-item :label="t('esd.task.workStation')" prop="WorkStation">
                    <el-input v-model="addPlanForm.WorkStation" placeholder="工位" />
                </el-form-item>
                <el-form-item :label="t('esd.task.responsibleUser')" prop="ResponsibleUser" required>
                    <el-select-v2 v-model="addPlanForm.ResponsibleUser" :multiple="true" filterable
                        :options="employeeList" 
                        :placeholder="t('esd.task.responsibleUserPlaceholder')" style="width:100%">
                       
                    </el-select-v2>
                </el-form-item>
                <el-form-item :label="t('esd.task.effectiveTime')" prop="EffectiveTime" required>
                    <el-date-picker v-model="addPlanForm.EffectiveTime" type="datetime" placeholder="选择生效时间"
                        value-format="YYYY-MM-DD HH:mm:ss" style="width:100%" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="addPlanDialogVisible = false">{{ t('publicText.cancel') }}</el-button>
                <el-button type="primary" @click="submitAddPlan" :loading="submitLoading">{{ t('publicText.confirm')
                    }}</el-button>
            </template>
        </el-dialog>

        <!-- ========== 审核计划弹窗 ========== -->
        <el-dialog :title="t('esd.task.audit')" v-model="auditDialogVisible" width="400px" align-center>
            <el-form ref="auditFormRef" :model="auditForm" label-width="100px">
                <el-form-item :label="t('esd.task.auditStatus')" prop="AuditStatus" required>
                    <el-radio-group v-model="auditForm.AuditStatus">
                        <el-radio :label="1">{{ t('esd.task.auditStatusApproved') }}</el-radio>
                        <el-radio :label="2">{{ t('esd.task.auditStatusRejected') }}</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="auditDialogVisible = false">{{ t('publicText.cancel') }}</el-button>
                <el-button type="primary" @click="submitAudit" :loading="submitLoading">{{ t('publicText.confirm')
                    }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onBeforeMount, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { useUserStoreWithOut } from '@/stores/modules/user';
import {
    QueryPendingTaskList,
    QueryCompletedTaskList,
    QueryScrappedTaskList,
    QueryTaskPlanList,
    AddExecutionTask,
    AddTaskPlan,
    AuditTaskPlan,
    AutoDispatchTask,
    DeleteTask,
    UpdateTask,
    QueryTaskDetail,
    ScrapTask
} from '@/api/esdManage/ESDCheckTask';
import {
    QueryEsdObjectList,
    QueryCheckFrequencyList,
} from '@/api/esdManage/base';

import { QueryCheckFormList } from '@/api/esdManage/ESDChecklist';
import {
  getEmployee

} from "@/api/permiss";
import { shortcuts, setTodayDate, setLastDate } from '@/utils/dataMenu'
import { calculateColumnsWidth } from "@/utils/tableminWidth";

const { t } = useI18n();
const userStore = useUserStoreWithOut();

// ==================== 公共下拉数据（ESD类型、点检频率） ====================
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

// ==================== 表单选择下拉（用于新增任务/计划） ====================
const formOptions = ref<{ label: string; value: number }[]>([]);
const formLoading = ref(false);
const loadFormOptions = async (keyword = '') => {
    formLoading.value = true;
    try {
        const res: any = await QueryCheckFormList({ FormName: keyword, PageIndex: 1, PageSize: 100 });
        if (res.Success) {
            const rows = res.Data.rows || [];
            // 去重（按FormId）
            const map = new Map<number, string>();
            rows.forEach((item: any) => { if (!map.has(item.FormId)) map.set(item.FormId, item.FormName); });
            formOptions.value = Array.from(map).map(([value, label]) => ({ label, value }));
        }
    } finally { formLoading.value = false; }
};

const employeeList = ref<any[]>([]);
const getEmployeeLabel = (option: any) => `${option.EmployeeName} ${option.FullName}`;
const loadEmployeeList = async () => {
    try {
        const res: any = await getEmployee();
        if (res.Success) {
            employeeList.value = res.Data.map((item: any) => ({ label: getEmployeeLabel(item), value: item.EmployeeName }));
        }
    } catch (error) {
        console.error('加载员工列表失败:', error);
    }
};

// ==================== 待执行任务 ====================
const pendingTasks = ref<any[]>([]);
const pendingTotal = ref(0);
const pendingLoading = ref(false);
const pendingTime = ref<any[]>([]);
const pendTableRef = ref();

const pendingQuery = reactive({
    TaskCode: '', FormName: '', EsdType: '', CheckFrequency: '',
    TimeQueryType: '', BaseDate: '', StartExecuteTime: '', EndExecuteTime: '',
    PageIndex: 1, PageSize: 20,
});

watch(pendingTime.value, (val: any) => {
    pendingQuery.StartExecuteTime = val[0];
    pendingQuery.EndExecuteTime = val[1];
    getPendingTasks();
})
const handleDateRangeChange = (val: any[]) => {
    pendingQuery.StartExecuteTime = val[0];
    pendingQuery.EndExecuteTime = val[1];
}
const getPendingTasks = async () => {
    pendingLoading.value = true;
    try {
        const res: any = await QueryPendingTaskList(pendingQuery);
        if (res.Success) {
            // 聚合数据：按TaskCode分组
            const rows = res.Data.rows || [];
            const grouped = groupTasks(rows);
            pendingTasks.value = grouped;
            pendingTotal.value = res.Data.total || 0;
        } else {
            ElMessage.error(res.Message || t('message.queryFailure'));
        }
    } finally { pendingLoading.value = false; }
};

// 聚合函数：将平铺明细按TaskCode聚合为任务主信息
const groupTasks = (rows: any[]) => {
    const map = new Map<string, any>();
    rows.forEach(row => {
        const key = row.TaskCode;
        if (!map.has(key)) {
            map.set(key, {
                TaskCode: row.TaskCode,
                EsdType: row.EsdType,
                FormName: row.FormName,
                FormCode: row.FormCode,
                ExecuteStatus: row.ExecuteStatus,
                ExecuteTime: row.ExecuteTime,
                CreateTime: row.CreateTime,
                CreateUser: row.CreateUser,
                // 其他主字段
                _items: []
            });
        }
        // 保存明细（可选）
        map.get(key)._items.push({
            MeasureDevice: row.MeasureDevice,
            CheckContent: row.CheckContent,
            LowerLimit: row.LowerLimit,
            UpperLimit: row.UpperLimit,
        });
    });
    return Array.from(map.values());
};

const handlePendingSearch = () => { pendingQuery.PageIndex = 1; getPendingTasks(); };
const resetPendingSearch = () => {
    pendingQuery.TaskCode = ''; pendingQuery.FormName = ''; pendingQuery.EsdType = '';
    pendingQuery.CheckFrequency = ''; pendingQuery.TimeQueryType = '';
    pendingQuery.BaseDate = ''; pendingQuery.StartExecuteTime = ''; pendingQuery.EndExecuteTime = '';
    pendingQuery.PageIndex = 1;
    getPendingTasks();
};
const handlePendingSizeChange = (val: number) => { pendingQuery.PageSize = val; pendingQuery.PageIndex = 1; getPendingTasks(); };
const handlePendingCurrentChange = (val: number) => { pendingQuery.PageIndex = val; getPendingTasks(); };

// ==================== 已完成任务 ====================
const completedTasks = ref<any[]>([]);
const completedTotal = ref(0);
const completedLoading = ref(false);
const completedTime = ref<any[]>([]);
const completedTableRef = ref();
const completedQuery = reactive({ ...pendingQuery }); // 相同结构
watch(completedTime.value, (val: any) => {
    completedQuery.StartExecuteTime = val[0];
    completedQuery.EndExecuteTime = val[1];
    getCompletedTasks();
})

const handleCompletedDateRangeChange = (val: any[]) => {
    completedQuery.StartExecuteTime = val[0];
    completedQuery.EndExecuteTime = val[1];
    getCompletedTasks();
}
const getCompletedTasks = async () => {
    completedLoading.value = true;
    try {
        const res: any = await QueryCompletedTaskList(completedQuery);
        if (res.Success) {
            completedTasks.value = res.Data.rows || [];
            completedTotal.value = res.Data.total || 0;
        } else {
            ElMessage.error(res.Message || t('message.queryFailure'));
        }
    } finally { completedLoading.value = false; }
};
const handleCompletedSearch = () => { completedQuery.PageIndex = 1; getCompletedTasks(); };
const resetCompletedSearch = () => {
    completedQuery.TaskCode = ''; completedQuery.FormName = ''; completedQuery.EsdType = '';
    completedQuery.CheckFrequency = ''; completedQuery.TimeQueryType = '';
    completedQuery.BaseDate = ''; completedQuery.StartExecuteTime = ''; completedQuery.EndExecuteTime = '';
    completedQuery.PageIndex = 1;
    getCompletedTasks();
};
const handleCompletedSizeChange = (val: number) => { completedQuery.PageSize = val; completedQuery.PageIndex = 1; getCompletedTasks(); };
const handleCompletedCurrentChange = (val: number) => { completedQuery.PageIndex = val; getCompletedTasks(); };
// ==================== 已作废任务 ====================
const scrappedTasks = ref<any[]>([]);
const scrappedTotal = ref(0);
const scrappedLoading = ref(false);
const scrappedQuery = reactive({ ...pendingQuery });
const scrappedTableRef = ref();
const scrappedTime = ref<any[]>([]);
watch(scrappedTime.value, (val: any) => {
    scrappedQuery.StartExecuteTime = val[0];
    scrappedQuery.EndExecuteTime = val[1];
    getScrappedTasks();
})
const handleScappedDateRangeChange = (val: any[]) => {
    scrappedQuery.StartExecuteTime = val[0];
    scrappedQuery.EndExecuteTime = val[1];
    getScrappedTasks();
}



const getScrappedTasks = async () => {
    scrappedLoading.value = true;
    try {
        const res: any = await QueryScrappedTaskList(scrappedQuery);
        if (res.Success) {
            scrappedTasks.value = res.Data.rows || [];
            scrappedTotal.value = res.Data.total || 0;
        } else {
            ElMessage.error(res.Message || t('message.queryFailure'));
        }
    } finally { scrappedLoading.value = false; }
};
const handleScappedSearch = () => { scrappedQuery.PageIndex = 1; getScrappedTasks(); };
const resetScappedSearch = () => {
    scrappedQuery.TaskCode = ''; scrappedQuery.FormName = ''; scrappedQuery.EsdType = '';
    scrappedQuery.CheckFrequency = ''; scrappedQuery.TimeQueryType = '';
    scrappedQuery.BaseDate = ''; scrappedQuery.StartExecuteTime = ''; scrappedQuery.EndExecuteTime = '';
    scrappedQuery.PageIndex = 1;
    getScrappedTasks();
};

const handleScappedSizeChange = (val: number) => { scrappedQuery.PageSize = val; scrappedQuery.PageIndex = 1; getScrappedTasks(); };
const handleScappedCurrentChange = (val: number) => { scrappedQuery.PageIndex = val; getScrappedTasks(); };



// ==================== 周期计划 ====================
const planList = ref<any[]>([]);
const planTotal = ref(0);
const planLoading = ref(false);
const planListRef = ref<any>();
const planQuery = reactive({
    PlanCode: '', PlanName: '', EsdType: '', EsdTypeCode: '',
    Workshop: '', LineName: '', WorkStation: '',
    ResponsibleUser: '', AuditStatus: undefined as number | undefined,
    PlanStatus: undefined as number | undefined,
    PageIndex: 1, PageSize: 20,
});
const getPlanList = async () => {
    planLoading.value = true;
    try {
        const res: any = await QueryTaskPlanList(planQuery);
        if (res.Success) {
            planList.value = res.Data.rows || [];
            planTotal.value = res.Data.total || 0;
        }
    } finally { planLoading.value = false; }
};
const handlePlanSearch = () => { planQuery.PageIndex = 1; getPlanList(); };
const resetPlanSearch = () => {
    planQuery.PlanCode = ''; planQuery.PlanName = ''; planQuery.EsdType = ''; planQuery.EsdTypeCode = '';
    planQuery.Workshop = ''; planQuery.LineName = ''; planQuery.WorkStation = '';
    planQuery.ResponsibleUser = ''; planQuery.AuditStatus = undefined; planQuery.PlanStatus = undefined;
    planQuery.PageIndex = 1;
    getPlanList();
};
const handlePlanSizeChange = (val: number) => { planQuery.PageSize = val; planQuery.PageIndex = 1; getPlanList(); };
const handlePlanCurrentChange = (val: number) => { planQuery.PageIndex = val; getPlanList(); };

// ==================== 新增任务 ====================
const addTaskDialogVisible = ref(false);
const addTaskFormRef = ref();
const addTaskForm = reactive({
    FormId: undefined as number | undefined,
    EsdTypeCode: '',
    WorkStation: '',
    ResponsibleUser: '',
    ProductionBatch: '',
    EffectiveTime: '',
});
const addTaskRules = {
    FormId: [{ required: true, message: t('message.pleaseSelect') + t('esd.task.selectForm'), trigger: 'change' }],
};
const openAddTask = () => {
    addTaskForm.FormId = undefined;
    addTaskForm.EsdTypeCode = '';
    addTaskForm.WorkStation = '';
    addTaskForm.ResponsibleUser = '';
    addTaskForm.ProductionBatch = '';
    addTaskForm.EffectiveTime = '';
    addTaskDialogVisible.value = true;
    loadFormOptions();
    loadEmployeeList();
};
const submitAddTask = async () => {
    await addTaskFormRef.value.validate();
    submitLoading.value = true;
    try {
        const currentUser = userStore.getUserInfo || 'system';
        const responsibleUser = Array.isArray(addTaskForm.ResponsibleUser) 
            ? addTaskForm.ResponsibleUser.join(',') 
            : addTaskForm.ResponsibleUser;
        const params = {
            FormId: addTaskForm.FormId,
            EsdTypeCode: addTaskForm.EsdTypeCode,
            WorkStation: addTaskForm.WorkStation,
            ResponsibleUser: responsibleUser,
            ProductionBatch: addTaskForm.ProductionBatch,
            EffectiveTime: addTaskForm.EffectiveTime,
            UserName: currentUser,
        };
        const res: any = await AddExecutionTask(params);
        if (res.Success) {
            ElMessage.success(t('message.addSuccess'));
            addTaskDialogVisible.value = false;
            getPendingTasks();
        } else {
            ElMessage.error(res.Message || t('message.addFailure'));
        }
    } finally { submitLoading.value = false; }
};

// ==================== 编辑任务 ====================
const editTaskDialogVisible = ref(false);
const editTaskFormRef = ref();
const editTaskForm = reactive({
    TaskId: 0,
    TaskCode: '',
    WorkStation: '',
    ResponsibleUser: [] as string[],
    ProductionBatch: '',
    EffectiveTime: '',
    Items: [] as Array<{
        TaskItemId: number;
        MeasureDevice: string;
        CheckContent: string;
        CheckMethod: string;
        LowerLimit: string;
        UpperLimit: string;
        SortNo: number;
    }>,
});
const editTaskRules = {};
const openEditTask = async (row: any) => {
    try {
        const res: any = await QueryTaskDetail({ TaskCode: row.TaskCode });
        if (res.Success) {
            const detail = res.Data.Task;
            editTaskForm.TaskId = detail.TaskId;
            editTaskForm.TaskCode = detail.TaskCode;
            editTaskForm.WorkStation = detail.WorkStation || '';
            editTaskForm.ResponsibleUser = detail.ResponsibleUser ? detail.ResponsibleUser.split(',') : [];
            editTaskForm.ProductionBatch = detail.ProductionBatch || '';
            editTaskForm.EffectiveTime = detail.EffectiveTime || '';
            editTaskForm.Items = (res.Data.Items || []).map((item: any) => ({
                TaskItemId: item.TaskItemId || 0,
                MeasureDevice: item.MeasureDevice || '',
                CheckContent: item.CheckContent || '',
                CheckMethod: item.CheckMethod || '',
                LowerLimit: item.LowerLimit || '',
                UpperLimit: item.UpperLimit || '',
                SortNo: item.SortNo || 0,
            }));
            editTaskDialogVisible.value = true;
            loadEmployeeList();
        } else {
            ElMessage.error(res.Message || t('message.queryFailure'));
        }
    } catch (error) {
        ElMessage.error(t('message.queryFailure'));
    }
};
const submitEditTask = async () => {
    await editTaskFormRef.value.validate();
    submitLoading.value = true;
    try {
        const currentUser = userStore.getUserInfo || 'system';
        const responsibleUser = Array.isArray(editTaskForm.ResponsibleUser)
            ? editTaskForm.ResponsibleUser.join(',')
            : editTaskForm.ResponsibleUser;
        const params = {
            TaskId: editTaskForm.TaskId,
            TaskCode: editTaskForm.TaskCode,
            WorkStation: editTaskForm.WorkStation,
            ResponsibleUser: responsibleUser,
            ProductionBatch: editTaskForm.ProductionBatch,
            EffectiveTime: editTaskForm.EffectiveTime,
            UserName: currentUser,
            Items: editTaskForm.Items,
        };
        const res: any = await UpdateTask(params);
        if (res.Success) {
            ElMessage.success(t('message.editSuccess'));
            editTaskDialogVisible.value = false;
            getPendingTasks();
        } else {
            ElMessage.error(res.Message || t('message.editFailure'));
        }
    } finally { submitLoading.value = false; }
};

// ==================== 任务详情 ====================
const detailDialogVisible = ref(false);
const taskDetail = ref<any>(null);
const viewTaskDetail = async (taskCode: string) => {
    try {
        const res: any = await QueryTaskDetail({ TaskCode: taskCode });
        if (res.Success) {
            taskDetail.value = res.Data;
            detailDialogVisible.value = true;
        } else {
            ElMessage.error(res.Message || t('message.queryFailure'));
        }
    } catch (error) {
        ElMessage.error(t('message.queryFailure'));
    }
};

// ==================== 修改任务 ====================
// const openEditTask = (row: any) => {
//     ElMessageBox.confirm(
//         t('esd.task.confirmEdit') + `【${row.TaskCode}】？`,
//         t('publicText.tip'),
//         { confirmButtonText: t('publicText.confirm'), cancelButtonText: t('publicText.cancel'), type: 'info' }
//     ).then(async () => {
//         try {
//             const currentUser = userStore.getUserInfo || 'system';
//             const res: any = await UpdateTask({ TaskId: row.TaskId, TaskCode: row.TaskCode, UserName: currentUser });
//             if (res.Success) {
//                 ElMessage.success(t('message.editSuccess'));
//                 getPendingTasks();
//             } else {
//                 ElMessage.error(res.Message || t('message.editFailure'));
//             }
//         } catch (error) { ElMessage.error(t('message.editFailure')); }
//     }).catch(() => { });
// };

// ==================== 作废任务 ====================
const handleScrapTask = (row: any) => {
    ElMessageBox.confirm(
        t('esd.task.confirmScrap') + `【${row.TaskCode}】？`,
        t('publicText.tip'),
        { confirmButtonText: t('publicText.confirm'), cancelButtonText: t('publicText.cancel'), type: 'warning' }
    ).then(async () => {
        try {
            const currentUser = userStore.getUserInfo || 'system';
            const res: any = await ScrapTask({ TaskId: row.TaskId, TaskCode: row.TaskCode, UserName: currentUser });
            if (res.Success) {
                ElMessage.success(t('esd.task.scrapSuccess'));
                getPendingTasks();
            } else {
                ElMessage.error(res.Message || t('esd.task.scrapFailure'));
            }
        } catch (error) { ElMessage.error(t('esd.task.scrapFailure')); }
    }).catch(() => { });
};

// ==================== 删除任务 ====================
const handleDeleteTask = (row: any) => {
    ElMessageBox.confirm(
        t('publicText.confirm') + t('publicText.delete') + `【${row.TaskCode}】？`,
        t('publicText.tip'),
        { confirmButtonText: t('publicText.confirm'), cancelButtonText: t('publicText.cancel'), type: 'warning' }
    ).then(async () => {
        try {
            const currentUser = userStore.getUserInfo || 'system';
            const res: any = await DeleteTask({ TaskId: row.TaskId, TaskCode: row.TaskCode, UserName: currentUser });
            if (res.Success) {
                ElMessage.success(t('message.deleteSuccess'));
                getPendingTasks();
            } else {
                ElMessage.error(res.Message || t('message.deleteFailure'));
            }
        } catch (error) { ElMessage.error(t('message.deleteFailure')); }
    }).catch(() => { });
};

// ==================== 自动下发 ====================
const handleAutoDispatch = async () => {
    try {
        const currentUser = userStore.getUserInfo || 'system';
        const res: any = await AutoDispatchTask({ UserName: currentUser });
        if (res.Success) {
            const codes = res.Data || [];
            ElMessage.success(t('esd.task.dispatchSuccess') + `: ${codes.join(', ')}`);
            // 刷新当前tab
            if (activeTab.value === 'pending') getPendingTasks();
            else if (activeTab.value === 'plan') getPlanList();
        } else {
            ElMessage.error(res.Message || t('esd.task.dispatchFailure'));
        }
    } catch (error) {
        ElMessage.error(t('esd.task.dispatchFailure'));
    }
};

// ==================== 新增周期计划 ====================
const addPlanDialogVisible = ref(false);
const addPlanFormRef = ref();
const addPlanForm = reactive({
    PlanCode: '',
    PlanName: '',
    FormId: undefined as number | undefined,
    Workshop: '',
    LineName: '',
    WorkStation: '',
    ResponsibleUser: '',
    EffectiveTime: '',
});
const addPlanRules = {
    PlanName: [{ required: true, message: t('message.pleaseInput') + t('esd.task.planName'), trigger: 'blur' }],
    FormId: [{ required: true, message: t('message.pleaseSelect') + t('esd.task.selectForm'), trigger: 'change' }],
    ResponsibleUser: [{ required: true, message: t('message.pleaseInput') + t('esd.task.responsibleUser'), trigger: 'blur' }],
    EffectiveTime: [{ required: true, message: t('message.pleaseSelect') + t('esd.task.effectiveTime'), trigger: 'change' }],
};
const openAddPlan = () => {
    addPlanForm.PlanCode = '';
    addPlanForm.PlanName = '';
    addPlanForm.FormId = undefined;
    addPlanForm.Workshop = '';
    addPlanForm.LineName = '';
    addPlanForm.WorkStation = '';
    addPlanForm.ResponsibleUser = '';
    addPlanForm.EffectiveTime = '';
    addPlanDialogVisible.value = true;
    loadFormOptions();
    loadEmployeeList();
};
const submitAddPlan = async () => {
    await addPlanFormRef.value.validate();
    submitLoading.value = true;
    try {
        const currentUser = userStore.getUserInfo || 'system';
        const responsibleUser = Array.isArray(addPlanForm.ResponsibleUser) 
            ? addPlanForm.ResponsibleUser.join(',') 
            : addPlanForm.ResponsibleUser;
        const params = {
            PlanCode: addPlanForm.PlanCode,
            PlanName: addPlanForm.PlanName,
            FormId: addPlanForm.FormId,
            Workshop: addPlanForm.Workshop,
            LineName: addPlanForm.LineName,
            WorkStation: addPlanForm.WorkStation,
            ResponsibleUser: responsibleUser,
            EffectiveTime: addPlanForm.EffectiveTime,
            UserName: currentUser,
        };
        const res: any = await AddTaskPlan(params);
        if (res.Success) {
            ElMessage.success(t('message.addSuccess'));
            addPlanDialogVisible.value = false;
            getPlanList();
        } else {
            ElMessage.error(res.Message || t('message.addFailure'));
        }
    } finally { submitLoading.value = false; }
};

// ==================== 审核计划 ====================
const auditDialogVisible = ref(false);
const auditFormRef = ref();
const auditForm = reactive({ PlanId: 0, PlanCode: '', AuditStatus: 1 }); // 默认通过
const openAuditPlan = (row: any) => {
    auditForm.PlanId = row.PlanId;
    auditForm.PlanCode = row.PlanCode;
    auditForm.AuditStatus = 1;
    auditDialogVisible.value = true;
};
const submitAudit = async () => {
    submitLoading.value = true;
    try {
        const currentUser = userStore.getUserInfo || 'system';
        const res: any = await AuditTaskPlan({
            PlanId: auditForm.PlanId,
            PlanCode: auditForm.PlanCode,
            AuditStatus: auditForm.AuditStatus,
            UserName: currentUser,
        });
        if (res.Success) {
            ElMessage.success(t('esd.task.auditSuccess'));
            auditDialogVisible.value = false;
            getPlanList();
        } else {
            ElMessage.error(res.Message || t('esd.task.auditFailure'));
        }
    } finally { submitLoading.value = false; }
};

// ==================== Tab切换 ====================
const activeTab = ref('pending');
const handleTabChange = (tab: string) => {
    if (tab === 'pending') getPendingTasks();
    else if (tab === 'completed') getCompletedTasks();
    else if (tab === 'scrapped') getScrappedTasks();
    else if (tab === 'plan') getPlanList();
};
//:0待执行,1已完成,2已作废,9已删除
const getExecuteStatus = (status: number) => {
    switch (status) {
        case 0:
            return 'info';
        case 1:
            return 'success';
        case 2:
            return 'warning';
        default:
            return 'danger';
    }
};
const getExecuteStatusText = (status: number) => {
    switch (status) {
        case 0:
            return t('esd.task.status1');
        case 1:
            return t('esd.task.status2');
        case 2:
            return t('esd.task.status3');
        default:
            return t('esd.task.status4');
    }
};
// 表格列宽自动计算
const tableColumns = computed(() => {
    if (!pendTableRef.value) return [];
    const columns = pendTableRef.value.columns
        .map((item: any) => ({ prop: item.property, label: item.label }))
        .filter(
            (item: any) =>
                item.label !== t("publicText.index") &&
                item.label !== t("publicText.operation"),
        );
    return columns;
});

const columnWidths = computed(() => {
    return calculateColumnsWidth(tableColumns.value, pendingTasks.value, {
        padding: 25,
        fontSize: 13,
    });
});

const getColumnWidth = (prop: string) => columnWidths.value[prop] || "auto";

const tableColumns2 = computed(() => {
    if (!completedTableRef.value) return [];
    const columns = completedTableRef.value.columns
        .map((item: any) => ({ prop: item.property, label: item.label }))
        .filter(
            (item: any) =>
                item.label !== t("publicText.index") &&
                item.label !== t("publicText.operation"),
        );
    return columns;
});

const columnWidths2 = computed(() => {
    return calculateColumnsWidth(tableColumns2.value, completedTasks.value, {
        padding: 25,
        fontSize: 13,
    });
});

const getColumnWidth2 = (prop: string) => columnWidths2.value[prop] || "auto";
// 表格列宽自动计算
const tableColumns3 = computed(() => {
    if (!scrappedTableRef.value) return [];
    const columns = scrappedTableRef.value.columns
        .map((item: any) => ({ prop: item.property, label: item.label }))
        .filter(
            (item: any) =>
                item.label !== t("publicText.index") &&
                item.label !== t("publicText.operation"),
        );
    return columns;
});

const columnWidths3 = computed(() => {
    return calculateColumnsWidth(tableColumns3.value, scrappedTasks.value, {
        padding: 25,
        fontSize: 13,
    });
});

const getColumnWidth3 = (prop: string) => columnWidths3.value[prop] || "auto";

const tableColumns4 = computed(() => {
    if (!planListRef.value) return [];
    const columns = planListRef.value.columns
        .map((item: any) => ({ prop: item.property, label: item.label }))
        .filter(
            (item: any) =>
                item.label !== t("publicText.index") &&
                item.label !== t("publicText.operation"),
        );
    return columns;
});

const columnWidths4 = computed(() => {
    return calculateColumnsWidth(tableColumns4.value, planList.value, {
        padding: 25,
        fontSize: 13,
    });
});

const getColumnWidth4 = (prop: string) => columnWidths4.value[prop] || "auto";
// ==================== 表格高度自适应 ====================
const tableHeight = ref(0);
const getScreenHeight = () => {
    nextTick(() => { tableHeight.value = window.innerHeight - 270; });
};



const getData = () => {
  getEmployee().then((res: any) => {
    console.log(res.Data);
    
  });
};
// ==================== 初始化 ====================
const submitLoading = ref(false);

onBeforeMount(() => {
    getScreenHeight();
    loadEsdTypeData();
    loadCheckFrequencyData();
    // 默认加载待执行任务
    getData()
    getPendingTasks();
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