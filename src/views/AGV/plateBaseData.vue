<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between">
                <el-form ref="searchFormRef" :model="searchForm" label-width="auto" :inline="true" :size="'small'"
                    @submit.prevent>
                    <el-form-item :label="t('AGV.plateBaseData.mcNo')" prop="agvmcid_no" class="mb-2">
                        <el-select v-model="searchForm.agvmcid_no" clearable filterable style="width: 180px"
                            :placeholder="t('AGV.plateBaseData.selectMcNo')">
                            <el-option v-for="(item, idx) in equipmentList" :key="'eq-' + idx" :label="getEqLabel(item)"
                                :value="getEqValue(item)" />
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="t('AGV.plateBaseData.point')" prop="agvmcid_Point" class="mb-2">
                        <el-select v-model="searchForm.agvmcid_Point" clearable filterable style="width: 180px"
                            :placeholder="t('AGV.plateBaseData.selectPoint')">
                            <el-option v-for="(item, idx) in pointList" :key="'pt-' + idx" :label="getPtLabel(item)"
                                :value="getPtValue(item)" />
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="t('AGV.plateBaseData.lineName')" prop="agvmcid_LineName" class="mb-2">
                        <el-select v-model="searchForm.agvmcid_LineName" clearable filterable style="width: 180px"
                            :placeholder="t('AGV.plateBaseData.selectLineName')">
                            <el-option v-for="(item, idx) in lineList" :key="'ln-' + idx" :label="getLineLabel(item)"
                                :value="getLineValue(item)" />
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="t('AGV.plateBaseData.type')" prop="agvmcid_Type" class="mb-2">
                        <el-select v-model="searchForm.agvmcid_Type" clearable style="width: 180px"
                            :placeholder="t('AGV.plateBaseData.selectType')">
                            <el-option :label="t('AGV.plateBaseData.typeLoader')" :value="1" />
                            <el-option :label="t('AGV.plateBaseData.typeUnloader')" :value="2" />
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="t('AGV.plateBaseData.operate')" prop="agvmcid_Operate" class="mb-2">
                        <el-select v-model="searchForm.agvmcid_Operate" clearable style="width: 180px"
                            :placeholder="t('AGV.plateBaseData.selectOperate')">
                            <el-option :label="t('AGV.plateBaseData.operateIn')" :value="1" />
                            <el-option :label="t('AGV.plateBaseData.operateOut')" :value="2" />
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="t('AGV.plateBaseData.sts')" prop="agvmcid_Stts" class="mb-2">
                        <el-select v-model="searchForm.agvmcid_Stts" clearable style="width: 180px"
                            :placeholder="t('AGV.plateBaseData.selectSts')">
                            <el-option :label="t('publicText.enable')" value="Y" />
                            <el-option :label="t('publicText.disable')" value="N" />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="mb-2">
                        <el-button type="primary" @click="handleSearch">{{ t("publicText.query") }}</el-button>
                    </el-form-item>
                </el-form>
                <div>
                    <el-button type="warning" size="small" @click="openAdd">{{ t("publicText.add") }}</el-button>
                </div>
            </div>

            <el-table :data="tableData" size="small" ref="eltableRef" :style="{ width: '100%' }" :height="tableHeight"
                border fit highlight-current-row 
                :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }">
                <el-table-column type="index" align="center" fixed :label="t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{ scope.$index + pageObj.pageSize * (pageObj.currentPage - 1) + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="agvmcid_no" fixed :label="t('AGV.plateBaseData.mcNo')"
                    :min-width="getColumnWidth('agvmcid_no')" show-overflow-tooltip>
                    <template #default="{ row }">{{ cellText(row.agvmcid_no) }}</template>
                </el-table-column>
                <el-table-column prop="agvmcid_Point" :label="t('AGV.plateBaseData.point')"
                    :min-width="getColumnWidth('agvmcid_Point')" show-overflow-tooltip>
                    <template #default="{ row }">{{ cellText(row.agvmcid_Point) }}</template>
                </el-table-column>
                <el-table-column prop="agvmcid_LineName" :label="t('AGV.plateBaseData.lineName')"
                    :min-width="getColumnWidth('agvmcid_LineName')" show-overflow-tooltip>
                    <template #default="{ row }">{{ cellText(row.agvmcid_LineName) }}</template>
                </el-table-column>
                <el-table-column prop="agvmcid_Stts" :label="t('AGV.plateBaseData.sts')"
                    :min-width="getColumnWidth('agvmcid_Stts')" align="center" fixed="right">
                    <template #default="{ row }">
                        <el-switch v-model="row.agvmcid_Stts" active-value="Y" inactive-value="N"
                            :loading="row._statusLoading" @change="handleStatusChange(row)" />
                    </template>
                </el-table-column>
                <el-table-column prop="agvmcid_IpAddress" :label="t('AGV.plateBaseData.ipAddress')"
                    :min-width="getColumnWidth('agvmcid_IpAddress')" show-overflow-tooltip>
                    <template #default="{ row }">{{ cellText(row.agvmcid_IpAddress) }}</template>
                </el-table-column>
                <el-table-column prop="agvmcid_IpPort" :label="t('AGV.plateBaseData.ipPort')"
                    :min-width="getColumnWidth('agvmcid_IpPort')" align="center">
                    <template #default="{ row }">{{ cellText(row.agvmcid_IpPort) }}</template>
                </el-table-column>
                <el-table-column prop="agvmcid_Address" :label="t('AGV.plateBaseData.address')"
                    :min-width="getColumnWidth('agvmcid_Address')" align="center">
                    <template #default="{ row }">{{ cellText(row.agvmcid_Address) }}</template>
                </el-table-column>
                <el-table-column prop="agvmcid_Result" :label="t('AGV.plateBaseData.result')"
                    :min-width="getColumnWidth('agvmcid_Result')" show-overflow-tooltip>
                    <template #default="{ row }">{{ cellText(row.agvmcid_Result) }}</template>
                </el-table-column>
                <el-table-column prop="agvmcid_Operate" :label="t('AGV.plateBaseData.operate')"
                    :min-width="getColumnWidth('agvmcid_Operate')" align="center">
                    <template #default="{ row }">
                        <el-tag v-if="row.agvmcid_Operate === 1" type="warning" size="small">
                            {{ t('AGV.plateBaseData.operateIn') }}
                        </el-tag>
                        <el-tag v-else-if="row.agvmcid_Operate === 2" type="info" size="small">
                            {{ t('AGV.plateBaseData.operateOut') }}
                        </el-tag>
                        <span v-else class="cell-empty">--</span>
                    </template>
                </el-table-column>
                <el-table-column prop="agvmcid_Type" :label="t('AGV.plateBaseData.type')"
                    :min-width="getColumnWidth('agvmcid_Type')" align="center">
                    <template #default="{ row }">
                        <el-tag v-if="row.agvmcid_Type === 1" type="primary" size="small">
                            {{ t('AGV.plateBaseData.typeLoader') }}
                        </el-tag>
                        <el-tag v-else-if="row.agvmcid_Type === 2" type="success" size="small">
                            {{ t('AGV.plateBaseData.typeUnloader') }}
                        </el-tag>
                        <span v-else class="cell-empty">--</span>
                    </template>
                </el-table-column>
                <el-table-column prop="agvmcid_Remark" :label="t('AGV.plateBaseData.remark')"
                    :min-width="getColumnWidth('agvmcid_Remark')" show-overflow-tooltip>
                    <template #default="{ row }">{{ cellText(row.agvmcid_Remark) }}</template>
                </el-table-column>
                <el-table-column prop="agvmcid_Side" :label="t('AGV.plateBaseData.side')"
                    :min-width="getColumnWidth('agvmcid_Side')" align="center">
                    <template #default="{ row }">{{ cellText(row.agvmcid_Side) }}</template>
                </el-table-column>
                <el-table-column prop="agvmcid_InsertUser" :label="t('AGV.plateBaseData.insertUser')"
                    :min-width="getColumnWidth('agvmcid_InsertUser')" show-overflow-tooltip>
                    <template #default="{ row }">{{ cellText(row.agvmcid_InsertUser) }}</template>
                </el-table-column>
                <el-table-column prop="agvmcid_InsertDt" :label="t('AGV.plateBaseData.insertDt')"
                    :min-width="getColumnWidth('agvmcid_InsertDt')">
                    <template #default="{ row }">{{ formatDateTime(row.agvmcid_InsertDt) }}</template>
                </el-table-column>
                <el-table-column prop="agvmcid_UpdateUser" :label="t('AGV.plateBaseData.updateUser')"
                    :min-width="getColumnWidth('agvmcid_UpdateUser')" show-overflow-tooltip>
                    <template #default="{ row }">{{ cellText(row.agvmcid_UpdateUser) }}</template>
                </el-table-column>
                <el-table-column prop="agvmcid_UpdateDt" :label="t('AGV.plateBaseData.updateDt')"
                    :min-width="getColumnWidth('agvmcid_UpdateDt')">
                    <template #default="{ row }">{{ formatDateTime(row.agvmcid_UpdateDt) }}</template>
                </el-table-column>
                <el-table-column prop="agv_containeraddress" :label="t('AGV.plateBaseData.containerAddress')"
                    :min-width="getColumnWidth('agv_containeraddress')" show-overflow-tooltip>
                    <template #default="{ row }">{{ cellText(row.agv_containeraddress) }}</template>
                </el-table-column>
                <el-table-column prop="Agv_StatusType" :label="t('AGV.plateBaseData.statusType')"
                    :min-width="getColumnWidth('Agv_StatusType')" show-overflow-tooltip>
                    <template #default="{ row }">{{ cellText(row.Agv_StatusType) }}</template>
                </el-table-column>
                <el-table-column prop="VerifyPoint" :label="t('AGV.plateBaseData.verifyPoint')"
                    :min-width="getColumnWidth('VerifyPoint')" show-overflow-tooltip>
                    <template #default="{ row }">{{ cellText(row.VerifyPoint) }}</template>
                </el-table-column>
                <el-table-column prop="VerifyMcidUrl" :label="t('AGV.plateBaseData.verifyMcidUrl')"
                    :min-width="getColumnWidth('VerifyMcidUrl')" show-overflow-tooltip>
                    <template #default="{ row }">{{ cellText(row.VerifyMcidUrl) }}</template>
                </el-table-column>
                <el-table-column prop="IsAutoVerify" :label="t('AGV.plateBaseData.isAutoVerify')"
                    :min-width="getColumnWidth('IsAutoVerify')" align="center">
                    <template #default="{ row }">{{ yesNoText(row.IsAutoVerify) }}</template>
                </el-table-column>
                <el-table-column prop="IsCalcBox" :label="t('AGV.plateBaseData.isCalcBox')"
                    :min-width="getColumnWidth('IsCalcBox')" align="center">
                    <template #default="{ row }">{{ yesNoText(row.IsCalcBox) }}</template>
                </el-table-column>
                <el-table-column prop="InStoreType" :label="t('AGV.plateBaseData.inStoreType')"
                    :min-width="getColumnWidth('InStoreType')" align="center">
                    <template #default="{ row }">{{ cellText(row.InStoreType) }}</template>
                </el-table-column>
                <el-table-column prop="AcceptType" :label="t('AGV.plateBaseData.acceptType')"
                    :min-width="getColumnWidth('AcceptType')" align="center">
                    <template #default="{ row }">{{ cellText(row.AcceptType) }}</template>
                </el-table-column>
                <el-table-column prop="SortType" :label="t('AGV.plateBaseData.sortType')"
                    :min-width="getColumnWidth('SortType')" align="center">
                    <template #default="{ row }">{{ cellText(row.SortType) }}</template>
                </el-table-column>
                <el-table-column :label="t('publicText.operation')" :fixed="'right'" width="130" align="center">
                    <template #default="{ row }">
                        <el-tooltip :content="t('publicText.edit')" placement="top">
                            <el-button size="small" type="primary" @click="openEdit(row)" icon="Edit" />
                        </el-tooltip>
                        <el-tooltip :content="t('publicText.delete')" placement="top">
                            <el-button size="small" type="danger" @click="handleDelete(row)" icon="Delete" />
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

        <!-- 新增对话框 -->
        <el-dialog :title="t('publicText.add')" v-model="addVisible" width="75%" :close-on-click-modal="false"
            @closed="handleAddDialogClosed" align-center>
            <el-form ref="addFormRef" :model="addForm" :rules="formRules" label-width="110px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateBaseData.mcNo')" prop="agvmcid_no">
                            <el-select v-model="addForm.agvmcid_no" filterable clearable style="width: 100%"
                                :placeholder="t('AGV.plateBaseData.selectMcNo')">
                                <el-option v-for="(item, idx) in equipmentList" :key="'add-eq-' + idx"
                                    :label="getEqLabel(item)" :value="getEqValue(item)" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateBaseData.point')" prop="agvmcid_Point">
                            <el-select v-model="addForm.agvmcid_Point" filterable clearable style="width: 100%"
                                :placeholder="t('AGV.plateBaseData.selectPoint')">
                                <el-option v-for="(item, idx) in pointList" :key="'add-pt-' + idx"
                                    :label="getPtLabel(item)" :value="getPtValue(item)" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateBaseData.lineName')" prop="agvmcid_LineName">
                            <el-select v-model="addForm.agvmcid_LineName" filterable clearable style="width: 100%"
                                :placeholder="t('AGV.plateBaseData.selectLineName')">
                                <el-option v-for="(item, idx) in lineList" :key="'add-ln-' + idx"
                                    :label="getLineLabel(item)" :value="getLineValue(item)" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateBaseData.type')" prop="agvmcid_Type">
                            <el-select v-model="addForm.agvmcid_Type" style="width: 100%"
                                :placeholder="t('AGV.plateBaseData.selectType')">
                                <el-option :label="t('AGV.plateBaseData.typeLoader')" :value="1" />
                                <el-option :label="t('AGV.plateBaseData.typeUnloader')" :value="2" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateBaseData.operate')" prop="agvmcid_Operate">
                            <el-select v-model="addForm.agvmcid_Operate" style="width: 100%"
                                :placeholder="t('AGV.plateBaseData.selectOperate')">
                                <el-option :label="t('AGV.plateBaseData.operateIn')" :value="1" />
                                <el-option :label="t('AGV.plateBaseData.operateOut')" :value="2" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateBaseData.sts')" prop="agvmcid_Stts">
                            <el-switch v-model="addForm.agvmcid_Stts" active-value="Y" inactive-value="N"
                                :active-text="t('publicText.enable')" :inactive-text="t('publicText.disable')" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateBaseData.ipAddress')" prop="agvmcid_IpAddress">
                            <el-input v-model="addForm.agvmcid_IpAddress"
                                :placeholder="t('AGV.plateBaseData.inputIpAddress')" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateBaseData.ipPort')" prop="agvmcid_IpPort">
                            <el-input-number v-model="addForm.agvmcid_IpPort" :min="1" :max="65535"
                                controls-position="right" style="width: 100%"
                                :placeholder="t('AGV.plateBaseData.inputIpPort')" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateBaseData.address')" prop="agvmcid_Address">
                            <el-input-number v-model="addForm.agvmcid_Address" :min="0" controls-position="right"
                                style="width: 100%" :placeholder="t('AGV.plateBaseData.inputAddress')" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateBaseData.side')" prop="agvmcid_Side">
                            <el-input v-model="addForm.agvmcid_Side" :placeholder="t('AGV.plateBaseData.inputSide')"
                                clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateBaseData.containerAddress')" prop="agv_containeraddress">
                            <el-input v-model="addForm.agv_containeraddress"
                                :placeholder="t('AGV.plateBaseData.inputContainerAddress')" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateBaseData.statusType')" prop="Agv_StatusType">
                            <el-input v-model="addForm.Agv_StatusType"
                                :placeholder="t('AGV.plateBaseData.inputStatusType')" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateBaseData.verifyPoint')" prop="VerifyPoint">
                            <el-input v-model="addForm.VerifyPoint"
                                :placeholder="t('AGV.plateBaseData.inputVerifyPoint')" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateBaseData.verifyMcidUrl')" prop="VerifyMcidUrl">
                            <el-input v-model="addForm.VerifyMcidUrl"
                                :placeholder="t('AGV.plateBaseData.inputVerifyMcidUrl')" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateBaseData.isAutoVerify')" prop="IsAutoVerify">
                            <el-select v-model="addForm.IsAutoVerify" style="width: 100%">
                                <el-option :label="t('publicText.yes')" value="Y" />
                                <el-option :label="t('publicText.no')" value="N" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateBaseData.isCalcBox')" prop="IsCalcBox">
                            <el-select v-model="addForm.IsCalcBox" style="width: 100%">
                                <el-option :label="t('publicText.yes')" value="Y" />
                                <el-option :label="t('publicText.no')" value="N" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item :label="t('AGV.plateBaseData.remark')" prop="agvmcid_Remark">
                            <el-input v-model="addForm.agvmcid_Remark" type="textarea" :rows="2"
                                :placeholder="t('AGV.plateBaseData.inputRemark')" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="addVisible = false">{{ t("publicText.cancel") }}</el-button>
                    <el-button type="primary" @click="submitAdd" :loading="submitLoading">{{
                        t("publicText.confirm")
                    }}</el-button>
                </div>
            </template>
        </el-dialog>

        <!-- 编辑对话框 -->
        <el-dialog :title="t('publicText.edit')" v-model="editVisible" width="75%" :close-on-click-modal="false"
            @closed="handleEditDialogClosed" align-center>
            <el-form ref="editFormRef" :model="editForm" :rules="formRules" label-width="110px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateBaseData.mcNo')" prop="agvmcid_no">
                            <el-select v-model="editForm.agvmcid_no" filterable disabled style="width: 100%">
                                <el-option v-for="(item, idx) in equipmentList" :key="'edit-eq-' + idx"
                                    :label="getEqLabel(item)" :value="getEqValue(item)" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateBaseData.point')" prop="agvmcid_Point">
                            <el-select v-model="editForm.agvmcid_Point" filterable disabled style="width: 100%">
                                <el-option v-for="(item, idx) in pointList" :key="'edit-pt-' + idx"
                                    :label="getPtLabel(item)" :value="getPtValue(item)" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateBaseData.lineName')" prop="agvmcid_LineName">
                            <el-select v-model="editForm.agvmcid_LineName" filterable clearable style="width: 100%"
                                :placeholder="t('AGV.plateBaseData.selectLineName')">
                                <el-option v-for="(item, idx) in lineList" :key="'edit-ln-' + idx"
                                    :label="getLineLabel(item)" :value="getLineValue(item)" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateBaseData.type')" prop="agvmcid_Type">
                            <el-select v-model="editForm.agvmcid_Type" style="width: 100%"
                                :placeholder="t('AGV.plateBaseData.selectType')">
                                <el-option :label="t('AGV.plateBaseData.typeLoader')" :value="1" />
                                <el-option :label="t('AGV.plateBaseData.typeUnloader')" :value="2" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateBaseData.operate')" prop="agvmcid_Operate">
                            <el-select v-model="editForm.agvmcid_Operate" style="width: 100%"
                                :placeholder="t('AGV.plateBaseData.selectOperate')">
                                <el-option :label="t('AGV.plateBaseData.operateIn')" :value="1" />
                                <el-option :label="t('AGV.plateBaseData.operateOut')" :value="2" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateBaseData.sts')" prop="agvmcid_Stts">
                            <el-switch v-model="editForm.agvmcid_Stts" active-value="Y" inactive-value="N"
                                :active-text="t('publicText.enable')" :inactive-text="t('publicText.disable')" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateBaseData.ipAddress')" prop="agvmcid_IpAddress">
                            <el-input v-model="editForm.agvmcid_IpAddress"
                                :placeholder="t('AGV.plateBaseData.inputIpAddress')" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateBaseData.ipPort')" prop="agvmcid_IpPort">
                            <el-input-number v-model="editForm.agvmcid_IpPort" :min="1" :max="65535"
                                controls-position="right" style="width: 100%"
                                :placeholder="t('AGV.plateBaseData.inputIpPort')" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateBaseData.address')" prop="agvmcid_Address">
                            <el-input-number v-model="editForm.agvmcid_Address" :min="0" controls-position="right"
                                style="width: 100%" disabled :placeholder="t('AGV.plateBaseData.inputAddress')" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateBaseData.side')" prop="agvmcid_Side">
                            <el-input v-model="editForm.agvmcid_Side" :placeholder="t('AGV.plateBaseData.inputSide')"
                                clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateBaseData.containerAddress')" prop="agv_containeraddress">
                            <el-input v-model="editForm.agv_containeraddress"
                                :placeholder="t('AGV.plateBaseData.inputContainerAddress')" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateBaseData.statusType')" prop="Agv_StatusType">
                            <el-input v-model="editForm.Agv_StatusType"
                                :placeholder="t('AGV.plateBaseData.inputStatusType')" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateBaseData.verifyPoint')" prop="VerifyPoint">
                            <el-input v-model="editForm.VerifyPoint"
                                :placeholder="t('AGV.plateBaseData.inputVerifyPoint')" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateBaseData.verifyMcidUrl')" prop="VerifyMcidUrl">
                            <el-input v-model="editForm.VerifyMcidUrl"
                                :placeholder="t('AGV.plateBaseData.inputVerifyMcidUrl')" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateBaseData.isAutoVerify')" prop="IsAutoVerify">
                            <el-select v-model="editForm.IsAutoVerify" style="width: 100%">
                                <el-option :label="t('publicText.yes')" value="Y" />
                                <el-option :label="t('publicText.no')" value="N" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateBaseData.isCalcBox')" prop="IsCalcBox">
                            <el-select v-model="editForm.IsCalcBox" style="width: 100%">
                                <el-option :label="t('publicText.yes')" value="Y" />
                                <el-option :label="t('publicText.no')" value="N" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item :label="t('AGV.plateBaseData.remark')" prop="agvmcid_Remark">
                            <el-input v-model="editForm.agvmcid_Remark" type="textarea" :rows="2"
                                :placeholder="t('AGV.plateBaseData.inputRemark')" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="editVisible = false">{{ t("publicText.cancel") }}</el-button>
                    <el-button type="primary" @click="submitEdit" :loading="submitLoading">{{
                        t("publicText.confirm")
                    }}</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { AddPlateBaseData, UpdatePlateBaseData, UpdatePlateBaseDataStatus, DeletePlateBaseData, QueryPlateBaseData, GetEquipment, GetPoint, GetAllValorLine } from "@/api/AGV/plateBaseData";
import {
    ref,
    reactive,
    nextTick,
    onMounted,
    onBeforeUnmount,
} from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { useTableColumnWidth } from '@/hooks/useTableColumnWidth';
import { useI18n } from "vue-i18n";
import dayjs from "dayjs";

const userStore = useUserStoreWithOut();
const { t } = useI18n();

const loading = ref(false);
const submitLoading = ref(false);
const tableHeight = ref(0);
const eltableRef = ref();
const tableData = ref<any[]>([]);
const total = ref(0);

const equipmentList = ref<any[]>([]);
const pointList = ref<any[]>([]);
const lineList = ref<any[]>([]);

const searchForm = reactive({
    agvmcid_no: null as number | null,
    agvmcid_Point: "",
    agvmcid_LineName: "",
    agvmcid_Type: null as number | null,
    agvmcid_Operate: null as number | null,
    agvmcid_Stts: "",
});

const pageObj = reactive({
    currentPage: 1,
    pageSize: 50,
});

const defaultForm = () => ({
    agvmcid_no: null as number | string | null,
    agvmcid_Point: "",
    agvmcid_LineName: "",
    agvmcid_Stts: "Y" as string,
    agvmcid_IpAddress: "",
    agvmcid_IpPort: null as number | string | null,
    agvmcid_Address: null as number | string | null,
    agvmcid_Result: "",
    agvmcid_Operate: null as number | string | null,
    agvmcid_Type: null as number | string | null,
    agvmcid_Remark: "",
    agvmcid_Side: "",
    agv_containeraddress: "",
    Agv_StatusType: "",
    VerifyPoint: "",
    VerifyMcidUrl: "",
    IsAutoVerify: "Y" as string | null,
    IsCalcBox: "N" as string | null,
});

const addForm = reactive(defaultForm());
const editForm = reactive(defaultForm());

const addVisible = ref(false);
const editVisible = ref(false);
const addFormRef = ref();
const editFormRef = ref();

const formRules = reactive({
    agvmcid_no: [
        {
            required: true,
            message: t("message.pleaseSelect") + t("AGV.plateBaseData.mcNo"),
            trigger: "change",
        },
    ],
    agvmcid_Point: [
        {
            required: true,
            message: t("message.pleaseSelect") + t("AGV.plateBaseData.point"),
            trigger: "change",
        },
    ],
    agvmcid_Address: [
        {
            required: true,
            message: t("message.pleaseInput") + t("AGV.plateBaseData.address"),
            trigger: "change",
        },
    ],
    agvmcid_Type: [
        {
            required: true,
            message: t("message.pleaseSelect") + t("AGV.plateBaseData.type"),
            trigger: "change",
        },
    ],
    agvmcid_Operate: [
        {
            required: true,
            message: t("message.pleaseSelect") + t("AGV.plateBaseData.operate"),
            trigger: "change",
        },
    ],
});

const { getColumnWidth } = useTableColumnWidth(eltableRef, tableData, {
    excludeLabels: [t('publicText.index'), t('publicText.operation')]
});

// 设备下拉：value = AssetNumber, label = name - AssetNumber
const getEqValue = (item: any) => item?.AssetNumber ?? "";
const getEqLabel = (item: any) => {
    if (!item) return "";
    const parts = [item.name, item.AssetNumber].filter(Boolean);
    return parts.length > 1 ? parts.join(" - ") : (parts[0] ?? getEqValue(item));
};

// 点位下拉：value = pointID, label = pointName - pointID
const getPtValue = (item: any) => item?.pointID ?? "";
const getPtLabel = (item: any) => {
    if (!item) return "";
    const parts = [item.pointName, item.pointID].filter(Boolean);
    return parts.length > 1 ? parts.join(" - ") : (parts[0] ?? getPtValue(item));
};

// 产线下拉：value = line, label = line
const getLineValue = (item: any) => {
    if (!item) return "";
    return typeof item === "object" ? (item.line ?? "") : String(item);
};
const getLineLabel = (item: any) => getLineValue(item);

// 修改接口提交字段：原数据 + 用户修改后的数据；
// 不含 4 个红线字段 agvmcid_taskno / agv_listen / agv_upstts / agv_listenDt
const pickFields = (src: any) => ({
    agvmcid_no: src.agvmcid_no ?? null,
    agvmcid_Point: src.agvmcid_Point ?? "",
    agvmcid_LineName: src.agvmcid_LineName ?? "",
    agvmcid_Stts: src.agvmcid_Stts ?? "Y",
    agvmcid_IpAddress: src.agvmcid_IpAddress ?? "",
    agvmcid_IpPort: src.agvmcid_IpPort ?? null,
    agvmcid_Address: src.agvmcid_Address ?? null,
    agvmcid_Result: src.agvmcid_Result ?? "",
    agvmcid_Operate: src.agvmcid_Operate ?? null,
    agvmcid_Type: src.agvmcid_Type ?? null,
    agvmcid_Remark: src.agvmcid_Remark ?? "",
    agvmcid_Side: src.agvmcid_Side ?? "",
    agv_containeraddress: src.agv_containeraddress ?? "",
    Agv_StatusType: src.Agv_StatusType ?? "",
    VerifyPoint: src.VerifyPoint ?? "",
    VerifyMcidUrl: src.VerifyMcidUrl ?? "",
    IsAutoVerify: src.IsAutoVerify ?? "",
    IsCalcBox: src.IsCalcBox ?? "",
});

const resetAddForm = () => {
    Object.assign(addForm, defaultForm());
};

const resetEditForm = () => {
    Object.assign(editForm, defaultForm());
};

// 空值统一显示 --
const cellText = (value: any) => (value === null || value === undefined || value === "" ? "--" : value);

// Y/N 是否展示
const yesNoText = (value: any) => {
    if (value === null || value === undefined || value === "") return "--";
    const s = String(value).toUpperCase();
    if (s === "Y" || s === "1" || s === "TRUE") return t("publicText.yes");
    if (s === "N" || s === "0" || s === "FALSE") return t("publicText.no");
    return String(value);
};

const formatDateTime = (dt: any) => {
    if (dt === null || dt === undefined || dt === "") return "--";
    const d = dayjs(dt);
    return d.isValid() ? d.format("YYYY-MM-DD HH:mm:ss") : String(dt);
};

const getData = () => {
    loading.value = true;
    const params = {
        agvmcid_no: searchForm.agvmcid_no ?? "",
        agvmcid_Point: searchForm.agvmcid_Point || "",
        agvmcid_LineName: searchForm.agvmcid_LineName || "",
        agvmcid_Operate: searchForm.agvmcid_Operate ?? "",
        agvmcid_Type: searchForm.agvmcid_Type ?? "",
        agvmcid_Stts: searchForm.agvmcid_Stts || "",
        pageIndex: pageObj.currentPage,
        pageSize: pageObj.pageSize,
    };
    QueryPlateBaseData(params)
        .then((res: any) => {
            if (res.Success) {
                const data = res.Data || {};
                tableData.value = data.list || data.rows || [];
                total.value = data.Total ?? data.total ?? 0;
            } else {
                tableData.value = [];
                total.value = 0;
                ElMessage.warning(res.Msg || t("message.queryFailure"));
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

const loadDropdowns = () => {
    GetEquipment({}).then((res: any) => {
        if (res.Data && Array.isArray(res.Data)) {
            equipmentList.value = res.Data;
        }
    });
    GetPoint({}).then((res: any) => {
        if (res.Data && Array.isArray(res.Data)) {
            pointList.value = res.Data;
        }
    });
    GetAllValorLine({}).then((res: any) => {
        if (res.Data && Array.isArray(res.Data)) {
            lineList.value = res.Data;
        }
    });
};

const handleSearch = () => {
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

const openAdd = () => {
    resetAddForm();
    addVisible.value = true;
};

const handleAddDialogClosed = () => {
    addFormRef.value?.resetFields();
    resetAddForm();
};

const submitAdd = () => {
    addFormRef.value.validate((valid: boolean) => {
        if (valid) {
            submitLoading.value = true;
            const params = {
                ...pickFields(addForm),
                UserNo: userStore.getUserInfo || "",
            };
            AddPlateBaseData(params)
                .then((res: any) => {
                    if (res.Success) {
                        ElMessage.success(t("message.addSuccess"));
                        addVisible.value = false;
                        pageObj.currentPage = 1;
                        getData();
                    } else {
                        ElMessage.error(res.Msg || t("message.addFailure"));
                    }
                })
                .finally(() => {
                    submitLoading.value = false;
                });
        }
    });
};

const openEdit = (row: any) => {
    // 保存当前行完整原数据，提交时传「原数据 + 用户修改后的数据」
    Object.assign(editForm, defaultForm(), pickFields(row));
    editVisible.value = true;
};

const handleEditDialogClosed = () => {
    editFormRef.value?.resetFields();
    resetEditForm();
};

const submitEdit = () => {
    editFormRef.value.validate((valid: boolean) => {
        if (valid) {
            submitLoading.value = true;
            const params = {
                ...pickFields(editForm),
                UserNo: userStore.getUserInfo || "",
            };
            UpdatePlateBaseData(params)
                .then((res: any) => {
                    if (res.Success) {
                        ElMessage.success(t("message.editSuccess"));
                        editVisible.value = false;
                        getData();
                    } else {
                        ElMessage.error(res.Msg || t("message.editFailure"));
                    }
                })
                .finally(() => {
                    submitLoading.value = false;
                });
        }
    });
};

// 列表状态开关：只调用 UpdateStatus 接口，失败则回滚
const handleStatusChange = (row: any) => {
    const newVal = row.agvmcid_Stts;
    row._statusLoading = true;
    UpdatePlateBaseDataStatus({
        UserNo: userStore.getUserInfo || "",
        agvmcid_no: row.agvmcid_no,
        agvmcid_Point: row.agvmcid_Point,
        agvmcid_Address: row.agvmcid_Address,
        agvmcid_Stts: newVal,
    })
        .then((res: any) => {
            if (res.Success) {
                ElMessage.success(res.Message || res.Msg || t("message.editSuccess"));
            } else {
                row.agvmcid_Stts = newVal === "Y" ? "N" : "Y";
                ElMessage.error(res.Message || res.Msg || t("message.editFailure"));
            }
        })
        .catch(() => {
            row.agvmcid_Stts = newVal === "Y" ? "N" : "Y";
            ElMessage.error(t("message.editFailure"));
        })
        .finally(() => {
            row._statusLoading = false;
        });
};

const handleDelete = (row: any) => {
    ElMessageBox.confirm(
        `${t("publicText.confirm")}${t("publicText.delete")}【${row.agvmcid_no} - ${row.agvmcid_Point} - ${row.agvmcid_Address}】?`,
        t("publicText.tip"),
        {
            confirmButtonText: t("publicText.confirm"),
            cancelButtonText: t("publicText.cancel"),
            type: "warning",
        }
    )
        .then(() => {
            loading.value = true;
            DeletePlateBaseData({
                UserNo: userStore.getUserInfo || "",
                agvmcid_no: row.agvmcid_no,
                agvmcid_Point: row.agvmcid_Point,
                agvmcid_Address: row.agvmcid_Address,
            })
                .then((res: any) => {
                    if (res.Success) {
                        ElMessage.success(res.Message || res.Msg || t("message.deleteSuccess"));
                        if (tableData.value.length === 1 && pageObj.currentPage > 1) {
                            pageObj.currentPage--;
                        }
                        getData();
                    } else {
                        ElMessage.error(res.Msg || t("message.deleteFailure"));
                    }
                })
                .finally(() => {
                    loading.value = false;
                });
        })
        .catch(() => {
            ElMessage.info(t("publicText.cancel"));
        });
};

const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 220;
    });
};

onMounted(() => {
    getScreenHeight();
    window.addEventListener("resize", getScreenHeight);
    loadDropdowns();
    getData();
});

onBeforeUnmount(() => {
    window.removeEventListener("resize", getScreenHeight);
});
</script>

<style lang="scss" scoped>
.el-pagination {
    justify-content: center;
}

.cell-empty {
    color: #909399;
}
</style>
