<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <!-- 查询表单 -->
            <div class="flex justify-between items-center">
                <el-form ref="queryFormRef" :inline="true" :model="queryParams" label-width="auto" @submit.prevent>
                    <el-form-item :label="t('esd.checklist.formName')" class="mb-2">
                        <el-input v-model="queryParams.FormName" :placeholder="t('esd.checklist.formNamePlaceholder')"
                            clearable style="width: 180px" size="small" />
                    </el-form-item>
                    <el-form-item :label="t('esd.checklist.formCode')" class="mb-2">
                        <el-input v-model="queryParams.FormCode" :placeholder="t('esd.checklist.formCodePlaceholder')"
                            clearable style="width: 180px" size="small" />
                    </el-form-item>
                    <el-form-item :label="t('esd.checklist.esdType')" class="mb-2">
                        <el-select v-model="queryParams.EsdType" placeholder="请选择" clearable size="small"
                            style="width: 150px" popper-class="esd-type-popper" v-loading="selectData.esdType.loading">
                            <el-option v-for="item in selectData.esdType.list" :key="item.value" :label="item.label"
                                :value="item.value" />
                            <template #footer>
                                <el-pagination small layout="prev, pager, next" :total="selectData.esdType.total"
                                    :page-size="selectData.esdType.pageSize"
                                    v-model:current-page="selectData.esdType.pageIndex"
                                    @current-change="loadEsdTypeData" class="pagination-wrapper" />
                            </template>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="t('esd.checklist.checkFrequency')" class="mb-2">
                        <el-select v-model="queryParams.CheckFrequency" placeholder="请选择" clearable size="small"
                            style="width: 150px" popper-class="frequency-popper"
                            v-loading="selectData.checkFrequency.loading">
                            <el-option v-for="item in selectData.checkFrequency.list" :key="item.value"
                                :label="item.label" :value="item.value" />
                            <template #footer>
                                <el-pagination small layout="prev, pager, next" :total="selectData.checkFrequency.total"
                                    :page-size="selectData.checkFrequency.pageSize"
                                    v-model:current-page="selectData.checkFrequency.pageIndex"
                                    @current-change="loadCheckFrequencyData" class="pagination-wrapper" />
                            </template>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="mb-2">
                        <el-button type="primary" @click="handleSearch" size="small">{{ t("publicText.query")
                            }}</el-button>
                        <el-button @click="resetSearch" size="small">{{ t("publicText.reset") }}</el-button>
                    </el-form-item>
                </el-form>

                <div class="mb-2">
                    <el-button type="warning" @click="openAdd" size="small">
                        {{ t("publicText.add") }}
                    </el-button>
                </div>
            </div>

            <!-- 表格 -->
            <el-row :gutter="20">
                <el-col :span="14">
                     <el-table :data="tableData" ref="tableRef" border :height="tableHeight"
                        style="width: 100%" stripe size="small" highlight-current-row tooltip-effect="light" @row-click="handleRowClick">
                        <el-table-column type="index" :label="t('publicText.index')" width="55" fixed="left"
                            align="center">
                            <template #default="{ $index }">
                                {{ $index + 1 + (queryParams.PageIndex - 1) * queryParams.PageSize }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="FormName" :label="t('esd.checklist.formName')"
                            :min-width="getColumnWidth('FormName')" />
                        <el-table-column prop="FormCode" :label="t('esd.checklist.formCode')"
                            :min-width="getColumnWidth('FormCode')" />
                        <el-table-column prop="EsdType" :label="t('esd.checklist.esdType')"
                            :min-width="getColumnWidth('EsdType')" />
                        <el-table-column prop="EsdCategory" :label="t('esd.checklist.esdCategory')"
                            :min-width="getColumnWidth('EsdCategory')" />
                        <el-table-column prop="CheckFrequency" :label="t('esd.checklist.checkFrequency')"
                            :min-width="getColumnWidth('CheckFrequency')" />
                        <!-- <el-table-column prop="CheckContent" :label="t('esd.checklist.checkContent')" min-width="120" />
                <el-table-column prop="MeasureDevice" :label="t('esd.checklist.measureDevice')" min-width="120" />
                <el-table-column prop="LowerLimit" :label="t('esd.checklist.lowerLimit')" min-width="80"
                    align="center" />
                <el-table-column prop="UpperLimit" :label="t('esd.checklist.upperLimit')" min-width="80"
                    align="center" /> -->
                        <el-table-column :label="$t('publicText.operation')" fixed="right" width="120" align="center">
                            <template #default="{ row }">
                                <el-button size="small" type="primary" @click="openEdit(row)" icon="Edit" />
                                <el-button size="small" type="danger" @click="handleDelete(row)" icon="Delete" />
                            </template>
                        </el-table-column>
                        <template #empty>
                            <div class="flex items-center justify-center h-100%">
                                <el-empty />
                            </div>
                        </template>
                    </el-table>
                    <!-- 表格分页 -->
                    <div style="margin-top: 8px">
                        <el-pagination align="center" background size="small" @size-change="handleSizeChange"
                            @current-change="handleCurrentChange" :current-page="queryParams.PageIndex"
                            :page-size="queryParams.PageSize" :page-sizes="[10, 20, 50, 100, 200]"
                            layout="total,sizes, prev, pager, next" :total="total" />
                    </div>
                </el-col>
                <el-col :span="10">
                    <div class="flex items-center justify-between mb-2">
                        <!-- <span class="font-bold text-base">{{ t('esd.checklist.details') }}</span> -->
                        <span v-if="currentRow" class="font-bold text-base text-[#006487]">
                            {{ t('esd.checklist.formName') }}：{{ currentRow.FormName }}
                        </span>
                    </div>
                    <el-table :data="currentRow?.Details || []" border :height="tableHeight" stripe size="small">
                        <el-table-column type="index" :label="t('publicText.index')" width="55" align="center" />
                        <el-table-column prop="MeasureDevice" :label="t('esd.checklist.measureDevice')"
                            min-width="120" />
                        <el-table-column prop="CheckContent" :label="t('esd.checklist.checkContent')" min-width="120" />
                        <el-table-column prop="LowerLimit" :label="t('esd.checklist.lowerLimit')" width="100"
                            align="center" />
                        <el-table-column prop="UpperLimit" :label="t('esd.checklist.upperLimit')" width="100"
                            align="center" />
                        <el-table-column prop="SortNo" :label="t('esd.checklist.sortNo')" width="80" align="center" />
                        <template #empty>
                            <div class="flex items-center justify-center h-100%">
                                <el-empty :description="t('esd.checklist.selectFormToViewDetails')" />
                            </div>
                        </template>
                    </el-table>
                </el-col>
            </el-row>
        </el-card>

        <!-- ========== 新增弹窗（独立） ========== -->
        <el-dialog :title="t('publicText.add') + t('esd.checklist.form')" v-model="addDialogVisible" width="80%"
            align-center :close-on-click-modal="false" @closed="handleAddDialogClosed">
            <el-form ref="addFormRef" :model="addFormData" :rules="formRules" label-width="120px" size="small">
                <!-- 主信息 -->
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('esd.checklist.esdType')" prop="EsdType" required>
                            <el-select v-model="addFormData.EsdType" placeholder="请选择" clearable style="width: 100%"
                                popper-class="esd-type-popper" v-loading="selectData.esdType.loading">
                                <el-option v-for="item in selectData.esdType.list" :key="item.value" :label="item.label"
                                    :value="item.value" />
                                <template #footer>
                                    <el-pagination small layout="prev, pager, next" :total="selectData.esdType.total"
                                        :page-size="selectData.esdType.pageSize"
                                        v-model:current-page="selectData.esdType.pageIndex"
                                        @current-change="loadEsdTypeData" class="pagination-wrapper" />
                                </template>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('esd.checklist.esdCategory')" prop="EsdCategory" required>
                            <el-select v-model="addFormData.EsdCategory" placeholder="请选择" clearable style="width: 100%"
                                popper-class="esd-category-popper" v-loading="selectData.esdCategory.loading">
                                <el-option v-for="item in selectData.esdCategory.list" :key="item.value"
                                    :label="item.label" :value="item.value" />
                                <template #footer>
                                    <el-pagination small layout="prev, pager, next"
                                        :total="selectData.esdCategory.total"
                                        :page-size="selectData.esdCategory.pageSize"
                                        v-model:current-page="selectData.esdCategory.pageIndex"
                                        @current-change="loadEsdCategoryData" class="pagination-wrapper" />
                                </template>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('esd.checklist.formName')" prop="FormName" required>
                            <el-input v-model="addFormData.FormName"
                                :placeholder="t('esd.checklist.formNamePlaceholder')" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('esd.checklist.formCode')" prop="FormCode" required>
                            <el-input v-model="addFormData.FormCode"
                                :placeholder="t('esd.checklist.formCodePlaceholder')" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('esd.checklist.checkFrequency')" prop="CheckFrequency" required>
                            <el-select v-model="addFormData.CheckFrequency" placeholder="请选择" clearable
                                style="width: 100%" popper-class="frequency-popper"
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
                    </el-col>
                </el-row>

                <!-- 明细列表 -->
                <div class="detail-section">
                    <div class="flex justify-between items-center mb-2">
                        <span class="font-bold">{{ t('esd.checklist.details') }}</span>
                        <el-button type="primary" size="small" @click="addDetailRow(addFormData.Details)">
                            {{ t('publicText.add') }}
                        </el-button>
                    </div>
                    <el-table :data="addFormData.Details" border size="small" style="width: 100%" :height="350">
                        <el-table-column type="index" label="序号" width="55" align="center" />
                        <el-table-column :label="t('esd.checklist.measureDevice')" min-width="150">
                            <template #default="{ row, $index }">
                                <el-form-item :prop="`Details.${$index}.MeasureDevice`"
                                    :rules="detailRules.MeasureDevice" label-width="0" class="mb-0">
                                    <el-select v-model="row.MeasureDevice" placeholder="请选择" clearable
                                        style="width: 100%" popper-class="device-popper"
                                        v-loading="selectData.measureDevice.loading">
                                        <el-option v-for="item in selectData.measureDevice.list" :key="item.value"
                                            :label="item.label" :value="item.value" />
                                        <template #footer>
                                            <el-pagination small layout="prev, pager, next"
                                                :total="selectData.measureDevice.total"
                                                :page-size="selectData.measureDevice.pageSize"
                                                v-model:current-page="selectData.measureDevice.pageIndex"
                                                @current-change="loadMeasureDeviceData" class="pagination-wrapper" />
                                        </template>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column :label="t('esd.checklist.checkContent')" min-width="150">
                            <template #default="{ row, $index }">
                                <el-form-item :prop="`Details.${$index}.CheckContent`" :rules="detailRules.CheckContent"
                                    label-width="0" class="mb-0">
                                    <el-select v-model="row.CheckContent" placeholder="请选择" clearable
                                        style="width: 100%" popper-class="content-popper"
                                        v-loading="selectData.checkContent.loading">
                                        <el-option v-for="item in selectData.checkContent.list" :key="item.value"
                                            :label="item.label" :value="item.value" />
                                        <template #footer>
                                            <el-pagination small layout="prev, pager, next"
                                                :total="selectData.checkContent.total"
                                                :page-size="selectData.checkContent.pageSize"
                                                v-model:current-page="selectData.checkContent.pageIndex"
                                                @current-change="loadCheckContentData" class="pagination-wrapper" />
                                        </template>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column :label="t('esd.checklist.lowerLimit')" width="150">
                            <template #default="{ row, $index }">
                                <el-form-item :prop="`Details.${$index}.LowerLimit`" :rules="detailRules.LowerLimit"
                                    label-width="0" class="mb-0">
                                    <el-input v-model="row.LowerLimit" placeholder="请输入" />
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column :label="t('esd.checklist.upperLimit')" width="150">
                            <template #default="{ row, $index }">
                                <el-form-item :prop="`Details.${$index}.UpperLimit`" :rules="detailRules.UpperLimit"
                                    label-width="0" class="mb-0">
                                    <el-input v-model="row.UpperLimit" placeholder="请输入" />
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column :label="t('esd.checklist.sortNo')" width="100">
                            <template #default="{ row, $index }">
                                <el-input-number v-model="row.SortNo" :min="1" controls-position="right"
                                    style="width: 100%" />
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('publicText.operation')" width="80" align="center">
                            <template #default="{ $index }">
                                <el-button size="small" type="danger"
                                    @click="removeDetailRow(addFormData.Details, $index)" icon="Delete" />
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-form>
            <template #footer>
                <el-button @click="addDialogVisible = false">{{ t('publicText.cancel') }}</el-button>
                <el-button type="primary" @click="submitAddForm" :loading="submitLoading">{{ t('publicText.confirm')
                    }}</el-button>
            </template>
        </el-dialog>

        <!-- ========== 编辑弹窗（独立） ========== -->
        <el-dialog :title="t('publicText.edit') + t('esd.checklist.form')" v-model="editDialogVisible" width="80%"
            align-center :close-on-click-modal="false" @closed="handleEditDialogClosed">
            <el-form ref="editFormRef" :model="editFormData" :rules="formRules" label-width="120px" size="small">
                <!-- 主信息 -->
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('esd.checklist.esdType')" prop="EsdType" required>
                            <el-select v-model="editFormData.EsdType" placeholder="请选择" clearable style="width: 100%"
                                popper-class="esd-type-popper" v-loading="selectData.esdType.loading">
                                <el-option v-for="item in selectData.esdType.list" :key="item.value" :label="item.label"
                                    :value="item.value" />
                                <template #footer>
                                    <el-pagination small layout="prev, pager, next" :total="selectData.esdType.total"
                                        :page-size="selectData.esdType.pageSize"
                                        v-model:current-page="selectData.esdType.pageIndex"
                                        @current-change="loadEsdTypeData" class="pagination-wrapper" />
                                </template>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('esd.checklist.esdCategory')" prop="EsdCategory" required>
                            <el-select v-model="editFormData.EsdCategory" placeholder="请选择" clearable
                                style="width: 100%" popper-class="esd-category-popper"
                                v-loading="selectData.esdCategory.loading">
                                <el-option v-for="item in selectData.esdCategory.list" :key="item.value"
                                    :label="item.label" :value="item.value" />
                                <template #footer>
                                    <el-pagination small layout="prev, pager, next"
                                        :total="selectData.esdCategory.total"
                                        :page-size="selectData.esdCategory.pageSize"
                                        v-model:current-page="selectData.esdCategory.pageIndex"
                                        @current-change="loadEsdCategoryData" class="pagination-wrapper" />
                                </template>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('esd.checklist.formName')" prop="FormName" required>
                            <el-input v-model="editFormData.FormName"
                                :placeholder="t('esd.checklist.formNamePlaceholder')" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('esd.checklist.formCode')" prop="FormCode" required>
                            <el-input v-model="editFormData.FormCode"
                                :placeholder="t('esd.checklist.formCodePlaceholder')" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('esd.checklist.checkFrequency')" prop="CheckFrequency" required>
                            <el-select v-model="editFormData.CheckFrequency" placeholder="请选择" clearable
                                style="width: 100%" popper-class="frequency-popper"
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
                    </el-col>
                </el-row>

                <!-- 明细列表 -->
                <div class="detail-section">
                    <div class="flex justify-between items-center mb-2">
                        <span class="font-bold">{{ t('esd.checklist.details') }}</span>
                        <el-button type="primary" size="small" @click="addDetailRow(editFormData.Details)">
                            {{ t('publicText.add') }}
                        </el-button>
                    </div>
                    <el-table :data="editFormData.Details" border size="small" style="width: 100%" :height="350">
                        <el-table-column type="index" label="序号" width="55" align="center" />
                        <el-table-column :label="t('esd.checklist.measureDevice')" min-width="150">
                            <template #default="{ row, $index }">
                                <el-form-item :prop="`Details.${$index}.MeasureDevice`"
                                    :rules="detailRules.MeasureDevice" label-width="0" class="mb-0">
                                    <el-select v-model="row.MeasureDevice" placeholder="请选择" clearable
                                        style="width: 100%" popper-class="device-popper"
                                        v-loading="selectData.measureDevice.loading">
                                        <el-option v-for="item in selectData.measureDevice.list" :key="item.value"
                                            :label="item.label" :value="item.value" />
                                        <template #footer>
                                            <el-pagination small layout="prev, pager, next"
                                                :total="selectData.measureDevice.total"
                                                :page-size="selectData.measureDevice.pageSize"
                                                v-model:current-page="selectData.measureDevice.pageIndex"
                                                @current-change="loadMeasureDeviceData" class="pagination-wrapper" />
                                        </template>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column :label="t('esd.checklist.checkContent')" min-width="150">
                            <template #default="{ row, $index }">
                                <el-form-item :prop="`Details.${$index}.CheckContent`" :rules="detailRules.CheckContent"
                                    label-width="0" class="mb-0">
                                    <el-select v-model="row.CheckContent" placeholder="请选择" clearable
                                        style="width: 100%" popper-class="content-popper"
                                        v-loading="selectData.checkContent.loading">
                                        <el-option v-for="item in selectData.checkContent.list" :key="item.value"
                                            :label="item.label" :value="item.value" />
                                        <template #footer>
                                            <el-pagination small layout="prev, pager, next"
                                                :total="selectData.checkContent.total"
                                                :page-size="selectData.checkContent.pageSize"
                                                v-model:current-page="selectData.checkContent.pageIndex"
                                                @current-change="loadCheckContentData" class="pagination-wrapper" />
                                        </template>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column :label="t('esd.checklist.lowerLimit')" width="150">
                            <template #default="{ row, $index }">
                                <el-form-item :prop="`Details.${$index}.LowerLimit`" :rules="detailRules.LowerLimit"
                                    label-width="0" class="mb-0">
                                    <el-input v-model="row.LowerLimit" placeholder="请输入" />
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column :label="t('esd.checklist.upperLimit')" width="150">
                            <template #default="{ row, $index }">
                                <el-form-item :prop="`Details.${$index}.UpperLimit`" :rules="detailRules.UpperLimit"
                                    label-width="0" class="mb-0">
                                    <el-input v-model="row.UpperLimit" placeholder="请输入" />
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column :label="t('esd.checklist.sortNo')" width="100">
                            <template #default="{ row, $index }">
                                <el-input-number v-model="row.SortNo" :min="1" controls-position="right"
                                    style="width: 100%" />
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('publicText.operation')" width="80" align="center">
                            <template #default="{ $index }">
                                <el-button size="small" type="danger"
                                    @click="removeDetailRow(editFormData.Details, $index)" icon="Delete" />
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-form>
            <template #footer>
                <el-button @click="editDialogVisible = false">{{ t('publicText.cancel') }}</el-button>
                <el-button type="primary" @click="submitEditForm" :loading="submitLoading">{{ t('publicText.confirm')
                    }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onBeforeMount, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { useUserStoreWithOut } from '@/stores/modules/user';
import {
    QueryCheckFormList,
    QueryCheckFormDetail,
    AddCheckForm,
    UpdateCheckForm,
    DeleteCheckForm,
} from '@/api/esdManage/ESDChecklist';
import {
    QueryEsdObjectList,
    QueryCheckContentList,
    QueryMeasureDeviceList,
    QueryCheckFrequencyList,
} from '@/api/esdManage/base';
import { calculateColumnsWidth } from "@/utils/tableminWidth";

const { t } = useI18n();
const userStore = useUserStoreWithOut();

// ==================== 表格与查询 ====================
const tableData = ref<any[]>([]);
const total = ref(0);
const tableHeight = ref(0);
const tableRef = ref();
const loading = ref(false);
const currentRow = ref<any>(null); 
const queryParams = reactive({
    FormName: '',
    FormCode: '',
    EsdType: '',
    CheckFrequency: '',
    PageIndex: 1,
    PageSize: 20,
});

// ==================== 下拉数据源（分页） ====================
// 每个下拉独立维护分页状态和选项列表
const selectData = reactive({
    esdType: {
        list: [] as { label: string; value: string }[],
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        loading: false,
    },
    esdCategory: {
        list: [] as { label: string; value: string }[],
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        loading: false,
    },
    checkFrequency: {
        list: [] as { label: string; value: string }[],
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        loading: false,
    },
    measureDevice: {
        list: [] as { label: string; value: string }[],
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        loading: false,
    },
    checkContent: {
        list: [] as { label: string; value: string }[],
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        loading: false,
    },
});

// 加载ESD类型（从QueryEsdObjectList提取EsdType，去重）
const loadEsdTypeData = async () => {
    const state = selectData.esdType;
    state.loading = true;
    try {
        const res: any = await QueryEsdObjectList({ EsdType: '', PageIndex: state.pageIndex, PageSize: state.pageSize });
        if (res.Success) {
            const rows = res.Data.rows || [];
            // 提取唯一 EsdType
            const unique = new Map<string, string>();
            rows.forEach((item: any) => {
                if (item.EsdType && !unique.has(item.EsdType)) {
                    unique.set(item.EsdType, item.EsdType);
                }
            });
            state.list = Array.from(unique).map(([value, label]) => ({ label, value }));
            state.total = res.Data.total || 0;
        }
    } catch (error) {
        console.error('加载ESD类型失败', error);
    } finally {
        state.loading = false;
    }
};

// 加载ESD品类（从QueryEsdObjectList提取EsdCategory，去重）
const loadEsdCategoryData = async () => {
    const state = selectData.esdCategory;
    state.loading = true;
    try {
        const res: any = await QueryEsdObjectList({ EsdType: '', PageIndex: state.pageIndex, PageSize: state.pageSize });
        if (res.Success) {
            const rows = res.Data.rows || [];
            const unique = new Map<string, string>();
            rows.forEach((item: any) => {
                if (item.EsdCategory && !unique.has(item.EsdCategory)) {
                    unique.set(item.EsdCategory, item.EsdCategory);
                }
            });
            state.list = Array.from(unique).map(([value, label]) => ({ label, value }));
            state.total = res.Data.total || 0;
        }
    } catch (error) {
        console.error('加载ESD品类失败', error);
    } finally {
        state.loading = false;
    }
};

// 加载点检频率
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
    } catch (error) {
        console.error('加载点检频率失败', error);
    } finally {
        state.loading = false;
    }
};

// 加载量测设备
const loadMeasureDeviceData = async () => {
    const state = selectData.measureDevice;
    state.loading = true;
    try {
        const res: any = await QueryMeasureDeviceList({ MeasureDevice: '', PageIndex: state.pageIndex, PageSize: state.pageSize });
        if (res.Success) {
            const rows = res.Data.rows || [];
            state.list = rows.map((item: any) => ({ label: item.MeasureDevice, value: item.MeasureDevice }));
            state.total = res.Data.total || 0;
        }
    } catch (error) {
        console.error('加载量测设备失败', error);
    } finally {
        state.loading = false;
    }
};

// 加载点检内容
const loadCheckContentData = async () => {
    const state = selectData.checkContent;
    state.loading = true;
    try {
        const res: any = await QueryCheckContentList({ CheckContent: '', PageIndex: state.pageIndex, PageSize: state.pageSize });
        if (res.Success) {
            const rows = res.Data.rows || [];
            state.list = rows.map((item: any) => ({ label: item.CheckContent, value: item.CheckContent }));
            state.total = res.Data.total || 0;
        }
    } catch (error) {
        console.error('加载点检内容失败', error);
    } finally {
        state.loading = false;
    }
};

// ==================== 新增弹窗 ====================
const addDialogVisible = ref(false);
const addFormRef = ref();
const addFormData = reactive({
    EsdType: '',
    FormName: '',
    EsdCategory: '',
    CheckFrequency: '',
    FormCode: '',
    Details: [] as any[],
});

// ==================== 编辑弹窗 ====================
const editDialogVisible = ref(false);
const editFormRef = ref();
const editFormData = reactive({
    FormId: '',
    EsdType: '',
    FormName: '',
    EsdCategory: '',
    CheckFrequency: '',
    FormCode: '',
    Details: [] as any[],
});

// ==================== 表单校验规则 ====================
const formRules = {
    EsdType: [{ required: true, message: t('message.pleaseSelect') + t('esd.checklist.esdType'), trigger: 'change' }],
    FormName: [{ required: true, message: t('message.pleaseInput') + t('esd.checklist.formName'), trigger: 'blur' }],
    EsdCategory: [{ required: true, message: t('message.pleaseSelect') + t('esd.checklist.esdCategory'), trigger: 'change' }],
    CheckFrequency: [{ required: true, message: t('message.pleaseSelect') + t('esd.checklist.checkFrequency'), trigger: 'change' }],
    FormCode: [{ required: true, message: t('message.pleaseInput') + t('esd.checklist.formCode'), trigger: 'blur' }],
};

const detailRules = {
    MeasureDevice: [{ required: true, message: t('message.pleaseSelect') + t('esd.checklist.measureDevice'), trigger: 'change' }],
    CheckContent: [{ required: true, message: t('message.pleaseSelect') + t('esd.checklist.checkContent'), trigger: 'change' }],
    LowerLimit: [{ required: true, message: t('message.pleaseInput') + t('esd.checklist.lowerLimit'), trigger: 'blur' }],
    UpperLimit: [{ required: true, message: t('message.pleaseInput') + t('esd.checklist.upperLimit'), trigger: 'blur' }],
};

const submitLoading = ref(false);

// ==================== 明细操作 ====================
const addDetailRow = (details: any[]) => {
    details.push({
        MeasureDevice: '',
        CheckContent: '',
        LowerLimit: 0,
        UpperLimit: 0,
        SortNo: details.length + 1,
    });
};

const removeDetailRow = (details: any[], index: number) => {
    if (details.length <= 1) {
        ElMessage.warning(t('esd.checklist.atLeastOneDetail'));
        return;
    }
    details.splice(index, 1);
    // 重新调整SortNo
    details.forEach((item, idx) => (item.SortNo = idx + 1));
};

// ==================== 表格数据加载 ====================
const getData = async () => {
      try {
    const res: any = await QueryCheckFormList(queryParams);
    if (res.Success) {
      tableData.value = res.Data.rows || [];
      total.value = res.Data.total || 0;
      // 自动选中第一行
      if (tableData.value.length > 0) {
        currentRow.value = tableData.value[0];
      } else {
        currentRow.value = null;
      }
    } else {
      ElMessage.error(res.Message || t('message.queryFailure'));
    }
  } catch (error) {
    console.error('查询失败:', error);
    tableData.value = [];
    total.value = 0;
    currentRow.value = null;
  }
};

// ==================== 行点击事件 ====================
const handleRowClick = (row: any) => {
  currentRow.value = row;
};
const handleSearch = () => {
    queryParams.PageIndex = 1;
    getData();
};

const resetSearch = () => {
    queryParams.FormName = '';
    queryParams.FormCode = '';
    queryParams.EsdType = '';
    queryParams.CheckFrequency = '';
    queryParams.PageIndex = 1;
    getData();
};

const handleSizeChange = (val: number) => {
    queryParams.PageSize = val;
    queryParams.PageIndex = 1;
    getData();
};

const handleCurrentChange = (val: number) => {
    queryParams.PageIndex = val;
    getData();
};

// ==================== 新增逻辑 ====================
const openAdd = () => {
    // 重置新增表单
    addFormData.EsdType = '';
    addFormData.FormName = '';
    addFormData.EsdCategory = '';
    addFormData.CheckFrequency = '';
    addFormData.FormCode = '';
    addFormData.Details = [];
    // 默认添加一行明细
    addDetailRow(addFormData.Details);
    addDialogVisible.value = true;
    loadEsdTypeData();
    loadEsdCategoryData();
    loadCheckFrequencyData();
    loadMeasureDeviceData();
    loadCheckContentData();
    // 下次打开弹窗时清空校验
    nextTick(() => {
        addFormRef.value?.clearValidate();
    });
};

const submitAddForm = async () => {
    await addFormRef.value.validate();
    // 校验明细
    const details = addFormData.Details;
    for (let i = 0; i < details.length; i++) {
        const row = details[i];
        if (!row.MeasureDevice) {
            ElMessage.error(t('message.pleaseSelect') + t('esd.checklist.measureDevice') + ` (第${i + 1}行)`);
            return;
        }
        if (!row.CheckContent) {
            ElMessage.error(t('message.pleaseSelect') + t('esd.checklist.checkContent') + ` (第${i + 1}行)`);
            return;
        }
        if (row.LowerLimit === undefined || row.LowerLimit === null) {
            ElMessage.error(t('message.pleaseInput') + t('esd.checklist.lowerLimit') + ` (第${i + 1}行)`);
            return;
        }
        if (row.UpperLimit === undefined || row.UpperLimit === null) {
            ElMessage.error(t('message.pleaseInput') + t('esd.checklist.upperLimit') + ` (第${i + 1}行)`);
            return;
        }
    }
    submitLoading.value = true;
    try {
        const currentUser = userStore.getUserInfo || 'system';
        const params = {
            EsdType: addFormData.EsdType,
            FormName: addFormData.FormName,
            EsdCategory: addFormData.EsdCategory,
            CheckFrequency: addFormData.CheckFrequency,
            FormCode: addFormData.FormCode,
            UserName: currentUser,
            Details: addFormData.Details.map(item => ({
                MeasureDevice: item.MeasureDevice,
                CheckContent: item.CheckContent,
                LowerLimit: item.LowerLimit,
                UpperLimit: item.UpperLimit,
                SortNo: item.SortNo,
            })),
        };
        const res: any = await AddCheckForm(params);
        if (res.Success) {
            ElMessage.success(t('message.addSuccess'));
            addDialogVisible.value = false;
            getData();
        } else {
            ElMessage.error(res.Message || t('message.addFailure'));
        }
    } catch (error) {
        console.error('新增失败', error);
        ElMessage.error(t('message.submitFailure'));
    } finally {
        submitLoading.value = false;
    }
};

const handleAddDialogClosed = () => {
    addFormRef.value?.resetFields();
    // 清空明细
    addFormData.Details = [];
};

// ==================== 编辑逻辑 ====================
const openEdit = async (row: any) => {
    // 根据FormId查询明细
    try {
        const res: any = await QueryCheckFormDetail({ FormId: row.FormId });
        if (res.Success) {
            const form = res.Data.Form || {};
            const details = res.Data.Details || [];
            editFormData.FormId = form.FormId;
            editFormData.EsdType = form.EsdType || '';
            editFormData.FormName = form.FormName || '';
            editFormData.EsdCategory = form.EsdCategory || '';
            editFormData.CheckFrequency = form.CheckFrequency || '';
            editFormData.FormCode = form.FormCode || '';
            editFormData.Details = details.map((item: any) => ({
                DetailId: item.DetailId,
                MeasureDevice: item.MeasureDevice || '',
                CheckContent: item.CheckContent || '',
                LowerLimit: item.LowerLimit ?? 0,
                UpperLimit: item.UpperLimit ?? 0,
                SortNo: item.SortNo ?? 1,
            }));
            // 如果没有明细，添加一行空行
            if (editFormData.Details.length === 0) {
                addDetailRow(editFormData.Details);
            }
            editDialogVisible.value = true;
            nextTick(() => {
                editFormRef.value?.clearValidate();
            });
        } else {
            ElMessage.error(res.Message || t('message.queryFailure'));
        }
    } catch (error) {
        console.error('查询明细失败', error);
        ElMessage.error(t('message.queryFailure'));
    }
};

const submitEditForm = async () => {
    await editFormRef.value.validate();
    // 校验明细
    const details = editFormData.Details;
    for (let i = 0; i < details.length; i++) {
        const row = details[i];
        if (!row.MeasureDevice) {
            ElMessage.error(t('message.pleaseSelect') + t('esd.checklist.measureDevice') + ` (第${i + 1}行)`);
            return;
        }
        if (!row.CheckContent) {
            ElMessage.error(t('message.pleaseSelect') + t('esd.checklist.checkContent') + ` (第${i + 1}行)`);
            return;
        }
        if (row.LowerLimit === undefined || row.LowerLimit === null) {
            ElMessage.error(t('message.pleaseInput') + t('esd.checklist.lowerLimit') + ` (第${i + 1}行)`);
            return;
        }
        if (row.UpperLimit === undefined || row.UpperLimit === null) {
            ElMessage.error(t('message.pleaseInput') + t('esd.checklist.upperLimit') + ` (第${i + 1}行)`);
            return;
        }
    }
    submitLoading.value = true;
    try {
        const currentUser = userStore.getUserInfo || 'system';
        const params = {
            FormId: editFormData.FormId,
            EsdType: editFormData.EsdType,
            FormName: editFormData.FormName,
            EsdCategory: editFormData.EsdCategory,
            CheckFrequency: editFormData.CheckFrequency,
            FormCode: editFormData.FormCode,
            UserName: currentUser,
            Details: editFormData.Details.map(item => ({
                DetailId: item.DetailId || undefined, // 新增时无DetailId
                MeasureDevice: item.MeasureDevice,
                CheckContent: item.CheckContent,
                LowerLimit: item.LowerLimit,
                UpperLimit: item.UpperLimit,
                SortNo: item.SortNo,
            })),
        };
        const res: any = await UpdateCheckForm(params);
        if (res.Success) {
            ElMessage.success(t('message.editSuccess'));
            editDialogVisible.value = false;
            getData();
        } else {
            ElMessage.error(res.Message || t('message.editFailure'));
        }
    } catch (error) {
        console.error('编辑失败', error);
        ElMessage.error(t('message.submitFailure'));
    } finally {
        submitLoading.value = false;
    }
};

const handleEditDialogClosed = () => {
    editFormRef.value?.resetFields();
    editFormData.Details = [];
};

// ==================== 删除 ====================
const handleDelete = (row: any) => {
    ElMessageBox.confirm(
        `${t('publicText.confirm')}${t('publicText.delete')}【${row.FormName}】?`,
        t('publicText.tip'),
        { confirmButtonText: t('publicText.confirm'), cancelButtonText: t('publicText.cancel'), type: 'warning' }
    )
        .then(async () => {
            loading.value = true;
            try {
                const currentUser = userStore.getUserInfo || 'system';
                const res: any = await DeleteCheckForm({ FormId: row.FormId, UpdateUser: currentUser });
                if (res.Success) {
                    ElMessage.success(t('message.deleteSuccess'));
                    if (tableData.value.length === 1 && queryParams.PageIndex > 1) queryParams.PageIndex--;
                    getData();
                } else {
                    ElMessage.error(res.Message || t('message.deleteFailure'));
                }
            } catch (error) {
                ElMessage.error(t('message.deleteFailure'));
            } finally {
                loading.value = false;
            }
        })
        .catch(() => ElMessage.info(t('publicText.cancel')));
};

// 表格列宽自动计算
const tableColumns = computed(() => {
    if (!tableRef.value) return [];
    const columns = tableRef.value.columns
        .map((item: any) => ({ prop: item.property, label: item.label }))
        .filter(
            (item: any) =>
                item.label !== t("publicText.index") &&
                item.label !== t("publicText.operation"),
        );
    return columns;
});

const columnWidths = computed(() => {
    return calculateColumnsWidth(tableColumns.value, tableData.value, {
        padding: 25,
        fontSize: 13,
    });
});

const getColumnWidth = (prop: string) => columnWidths.value[prop] || "auto";
// ==================== 表格高度自适应 ====================
const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 190;
    });
};

// ==================== 初始化 ====================
onBeforeMount(() => {
    getScreenHeight();
    // 加载所有下拉数据（第一页）
      loadEsdTypeData();
    //   loadEsdCategoryData();
      loadCheckFrequencyData();
    //   loadMeasureDeviceData();
    //   loadCheckContentData();
    getData();
});

onMounted(() => {
    window.addEventListener('resize', getScreenHeight);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', getScreenHeight);
});
</script>

<style scoped>
.pagination-wrapper {
    display: flex;
    justify-content: center;
    padding: 4px 0;
    border-top: 1px solid #dcdfe6;
}

.detail-section {
    margin-top: 16px;
    border-top: 1px solid #ebeef5;
    padding-top: 16px;
}

.el-pagination {
    justify-content: center;
}
</style>