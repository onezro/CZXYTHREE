<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between">
                <el-form ref="formRef" :model="getForm" label-width="auto" :inline="true" :size="'small'"
                    @submit.native.prevent>
                    <el-form-item :label="t('incomingManage.inspectionRule.materialCode')" prop="materialCode"
                        class="mb-2">
                        <el-input v-model="getForm.MaterialCode"
                            :placeholder="t('incomingManage.inspectionRule.materialCodePlaceholder')" clearable
                            @clear="searchData" @keyup.enter.native="searchData" style="width: 200px" />
                    </el-form-item>
                    <el-form-item class="mb-2">
                        <el-button :type="'primary'" @click="searchData">{{ t('publicText.query') }}</el-button>
                    </el-form-item>
                </el-form>
                <div>
                    <el-button type="warning" size="small" @click="openAdd">{{ t('publicText.add') }}</el-button>
                </div>
            </div>
            <el-row :gutter="10">
                <!-- 左侧：检验规则主表列表 -->
                <el-col :span="11">
                    <el-table :data="tableData" size="small" :style="{ width: '100%' }" :height="tableHeight"
                        ref="eltableRef" border fit @row-click="handleRowClick" highlight-current-row :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }">
                        <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                            <template #default="scope">
                                <span>{{
                                    scope.$index + getForm.PageSize * (getForm.PageIndex - 1) + 1
                                }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="t('incomingManage.inspectionRule.materialCode')" prop="MaterialCode"
                            :min-width="getColumnWidth1('MaterialCode')" />
                        <el-table-column :label="t('incomingManage.inspectionRule.materialName')" prop="MaterialName"
                            :min-width="getColumnWidth1('MaterialName')" />
                        <el-table-column :label="t('incomingManage.inspectionRule.materialSpec')" prop="MaterialSpec"
                            :min-width="getColumnWidth1('MaterialSpec')" />
                        <el-table-column :label="t('incomingManage.inspectionRule.isDouble')" prop="IsDouble"
                            :min-width="getColumnWidth1('IsDouble')">
                            <template #default="{ row }">
                                <span>{{ row.IsDouble === 1 ? t('publicText.yes') : t('publicText.no') }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="数量" prop="DoubleQty" :min-width="getColumnWidth1('DoubleQty')">
                            <template #default="{ row }">
                                <span>{{ row.DoubleQty ?? '-' }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="t('incomingManage.testItems.creator')" prop="CreateUser"
                            :min-width="getColumnWidth1('CreateUser')" />
                        <el-table-column :label="t('incomingManage.testItems.creatime')" prop="CreateTime"
                            :min-width="getColumnWidth1('CreateTime')" />
                        <el-table-column :label="$t('publicText.operation')" :fixed="'right'" width="170"
                            :align="'center'">
                            <template #default="{ row }">
                                <el-tooltip content="检验文件" placement="top">
                                    <el-button size="small" type="info" icon="Document"
                                        @click.stop="handleFilePreview(row)"></el-button>
                                </el-tooltip>
                                <el-tooltip :content="$t('publicText.edit')" placement="top">
                                    <el-button size="small" type="primary" icon="Edit"
                                        @click.stop="openEdit(row)"></el-button>
                                </el-tooltip>
                                <el-tooltip :content="$t('publicText.delete')" placement="top">
                                    <el-button size="small" type="danger" icon="Delete"
                                        @click.stop="handleDelete(row)"></el-button>
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
                            @current-change="handleCurrentChange" :pager-count="5" :current-page="getForm.PageIndex"
                            :page-size="getForm.PageSize" :page-sizes="[10, 20, 30, 50, 100]"
                            layout="total,sizes, prev, pager, next" :total="total">
                        </el-pagination>
                    </div>
                </el-col>
                <!-- 右侧：标签页展示明细或已选项目组 -->
                <el-col :span="13">
                    <el-tabs v-model="activeName" class="demo-tabs">
                        <el-tab-pane :label="t('incomingManage.inspectionRule.projectGroups')" name="projects">
                            <el-table :data="projectGroupData" size="small" :style="{ width: '100%' }"
                                :height="tableHeight2" ref="eltableRef2" border fit :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }">
                                <el-table-column type="index" align="center" :label="$t('publicText.index')"
                                    width="50" />
                                <el-table-column :label="t('incomingManage.inspectionRule.projectCode')"
                                    prop="ProjectCode" :min-width="150" />
                                <el-table-column :label="t('incomingManage.inspectionRule.projectName')"
                                    prop="ProjectName" :min-width="150" />
                                <el-table-column :label="t('incomingManage.inspectionRule.versionNo')" prop="VersionNo"
                                    width="100" />
                                <el-table-column :label="t('incomingManage.inspectionRule.isDefault')" width="100">
                                    <template #default="{ row }">
                                        <span>{{ row.IsDefault === 1 ? t('publicText.yes') : t('publicText.no')
                                            }}</span>
                                    </template>
                                </el-table-column>
                                <template #empty>
                                    <div class="flex items-center justify-center h-100%">
                                        <el-empty :description="t('incomingManage.inspectionRule.noProject')" />
                                    </div>
                                </template>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane :label="t('incomingManage.inspectionRule.details')" name="detail">
                            <el-table :data="detailData" size="small" :style="{ width: '100%' }" :height="tableHeight2"
                                ref="eltableRef3" border fit :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }">
                                <el-table-column type="index" align="center" :label="$t('publicText.index')"
                                    width="50" />
                                <el-table-column :label="t('incomingManage.testItems.gaugeCode')" prop="InspectionCode"
                                    :min-width="getColumnWidth2('InspectionCode')" />
                                <el-table-column :label="t('incomingManage.testItems.gaugeName')" prop="InspectionName"
                                    :min-width="getColumnWidth2('InspectionName')" />
                                <el-table-column :label="t('incomingManage.testItems.inspectionType')"
                                    prop="InspectionType" :min-width="getColumnWidth2('InspectionType')">
                                    <template #default="{ row }">
                                        <span>{{ row.InspectionType === 1 ? t('incomingManage.testItems.qualitative') :
                                            t('incomingManage.testItems.quantitative') }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column :label="t('incomingManage.inspectionRule.lowerLimit')"
                                    prop="LowerLimit" :min-width="getColumnWidth2('LowerLimit')" />
                                <el-table-column :label="t('incomingManage.inspectionRule.upperLimit')"
                                    prop="UpperLimit" :min-width="getColumnWidth2('UpperLimit')" />
                                <el-table-column :label="t('incomingManage.inspectionRule.unit')" prop="Unit"
                                    :min-width="getColumnWidth2('Unit')" />
                                <el-table-column :label="t('incomingManage.testItems.creator')" prop="CreateUser"
                                    :min-width="getColumnWidth2('CreateUser')" />
                                <el-table-column :label="t('incomingManage.testItems.creatime')" prop="CreateTime"
                                    :min-width="getColumnWidth2('CreateTime')" />
                                <template #empty>
                                    <div class="flex items-center justify-center h-100%">
                                        <el-empty :description="t('incomingManage.inspectionRule.noDetail')" />
                                    </div>
                                </template>
                            </el-table>
                        </el-tab-pane>
                    </el-tabs>
                </el-col>
            </el-row>
        </el-card>

        <!-- 新增检验规则对话框 -->
        <el-dialog :title="$t('publicText.add')" v-model="addVisible" width="70%"
            @close="addCancel" align-center :append-to-body="true" :close-on-click-modal="false"
            :close-on-press-escape="false">
            <el-form :model="addForm" ref="addFormRef" label-width="auto" :inline="false" :rules="formRules">
                <el-row :gutter="16">
                    <el-col :span="6">
                        <el-form-item :label="t('incomingManage.inspectionRule.isDouble')" prop="IsDouble">
                            <el-select v-model="addForm.IsDouble" style="width: 100%">
                                <el-option :label="t('publicText.yes')" :value="1"></el-option>
                                <el-option :label="t('publicText.no')" :value="0"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="数量" prop="DoubleQty">
                            <el-input-number v-model="addForm.DoubleQty" :min="0" 
                                style="width: 100%" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="检验文件">
                            <el-upload v-model:file-list="addFileList" :auto-upload="false" :limit="1"
                                :on-exceed="handleExceed"   accept=".pdf">
                                <el-button type="primary" size="small">选择文件</el-button>
                                <template #tip>
                                    <span class="el-upload__tip" style="margin-left: 8px;">只能上传一个文件</span>
                                </template>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="16">
                    <!-- 左边：物料列表 -->
                    <el-col :span="11">
                        <div class="dialog-section-title">物料列表</div>
                        <div class="mb-2">
                            <el-button type="primary" size="small" @click="openMaterialSelectDialog">{{
                                t('publicText.add')
                                }}物料</el-button>
                        </div>
                        <el-table :data="paginatedMaterials" border size="small" style="width: 100%" height="300">
                            <el-table-column type="index" align="center" :label="$t('publicText.index')" width="50">
                                <template #default="scope">
                                    <span>{{ scope.$index + (materialPage.currentPage - 1) * materialPage.pageSize + 1 }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column :label="t('incomingManage.inspectionRule.materialCode')"
                                prop="MaterialCode" min-width="150" />
                            <el-table-column :label="$t('publicText.operation')" width="80" align="center">
                                <template #default="{ $index }">
                                    <el-button type="danger" size="small" link @click="removeMaterialRow($index + (materialPage.currentPage - 1) * materialPage.pageSize)">{{
                                        t('publicText.delete') }}</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="mt-2">
                            <el-pagination :size="'small'" background @size-change="onMaterialSizeChange"
                                @current-change="onMaterialPageChange" :current-page="materialPage.currentPage"
                                :page-size="materialPage.pageSize" :pager-count="5" :page-sizes="[10, 20, 50, 100]"
                                layout="total, sizes, prev, pager, next" :total="addForm.Materials.length">
                            </el-pagination>
                        </div>
                    </el-col>
                    <!-- 右边：项目组和明细 Tab -->
                    <el-col :span="13">
                        <el-tabs v-model="dialogActiveTab" class="dialog-tabs">
                            <el-tab-pane :label="t('incomingManage.inspectionRule.projectGroups')" name="project">
                                <div class="mb-2">
                                    <el-button type="primary" size="small" @click="addProjectRow(addForm)">{{
                                        t('publicText.add')
                                        }}项目组</el-button>
                                </div>
                                <el-table :data="addForm.Projects" border size="small" style="width: 100%" height="300">
                                    <el-table-column :label="t('incomingManage.inspectionRule.projectCode')"
                                        min-width="200">
                                        <template #default="{ row }">
                                            <el-select v-model="row.ProjectCode" size="small" style="width: 100%"
                                                filterable clearable placeholder=""
                                                @change="(val: any) => handleProjectSelect(row, val)">
                                                <el-option v-for="item in availableProjectList"
                                                    :key="item.ProjectCode"
                                                    :label="`${item.ProjectCode} - ${item.ProjectName}`"
                                                    :value="item.ProjectCode">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                    <el-table-column :label="t('incomingManage.inspectionRule.versionNo')"
                                        prop="VersionNo" width="100">
                                        <template #default="{ row }">
                                            <el-input v-model="row.VersionNo" size="small" disabled />
                                        </template>
                                    </el-table-column>
                                    <el-table-column :label="t('incomingManage.inspectionRule.isDefault')"
                                        width="100" align="center">
                                        <template #default="{ $index }">
                                            <el-radio v-model="addForm.defaultProjectIndex" :label="$index"
                                                @change="() => setDefaultProject(addForm, $index)">默认</el-radio>
                                        </template>
                                    </el-table-column>
                                    <el-table-column :label="$t('publicText.operation')" width="80" align="center">
                                        <template #default="{ $index }">
                                            <el-button type="danger" size="small" link
                                                @click="removeProjectRow(addForm, $index)">{{
                                                    t('publicText.delete') }}</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-tab-pane>
                            <el-tab-pane :label="t('incomingManage.inspectionRule.details')" name="detail">
                                <div class="mb-2">
                                    <el-button type="primary" size="small" @click="addDetailRow(addForm)">{{
                                        t('publicText.add')
                                        }}检验项</el-button>
                                </div>
                                <el-table :data="addForm.Details" border size="small" style="width: 100%" height="300">
                                    <el-table-column :label="t('incomingManage.testItems.gaugeCode')" width="180">
                                        <template #default="{ row }">
                                            <el-select v-model="row.InspectionCode" size="small" style="width: 100%"
                                                filterable clearable
                                                :placeholder="t('incomingManage.testItems.gaugeCode')"
                                                @change="handleInspectionSelect(row, $event)">
                                                <el-option v-for="item in availableInspectionList"
                                                    :key="item.InspectionCode"
                                                    :label="`${item.InspectionCode} - ${item.InspectionName}`"
                                                    :value="item.InspectionCode">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                    <el-table-column :label="t('incomingManage.testItems.gaugeName')"
                                        min-width="120">
                                        <template #default="{ row }">
                                            <el-input v-model="row.InspectionName" size="small" disabled />
                                        </template>
                                    </el-table-column>
                                    <el-table-column :label="t('incomingManage.testItems.inspectionType')"
                                        width="100">
                                        <template #default="{ row }">
                                            <span>{{ row.InspectionType === 1 ?
                                                t('incomingManage.testItems.qualitative') :
                                                t('incomingManage.testItems.quantitative') }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column :label="t('incomingManage.inspectionRule.lowerLimit')"
                                        width="100">
                                        <template #default="{ row }">
                                            <el-input-number v-model="row.LowerLimit" size="small" :controls="false"
                                                style="width: 100%" :disabled="row.InspectionType === 1" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column :label="t('incomingManage.inspectionRule.upperLimit')"
                                        width="100">
                                        <template #default="{ row }">
                                            <el-input-number v-model="row.UpperLimit" size="small" :controls="false"
                                                style="width: 100%" :disabled="row.InspectionType === 1" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column :label="t('incomingManage.inspectionRule.unit')" width="80">
                                        <template #default="{ row }">
                                            <el-input v-model="row.Unit" size="small"
                                                :disabled="row.InspectionType === 1" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column :label="$t('publicText.operation')" width="80" align="center">
                                        <template #default="{ $index }">
                                            <el-button type="danger" size="small" link
                                                @click="removeDetailRow(addForm, $index)">{{
                                                    t('publicText.delete') }}</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-tab-pane>
                        </el-tabs>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <el-button @click="addCancel">{{ $t("publicText.cancel") }}</el-button>
                <el-button type="primary" @click="addSubmit">{{ $t("publicText.confirm") }}</el-button>
            </template>
        </el-dialog>

        <!-- 编辑检验规则对话框 -->
        <el-dialog :title="$t('publicText.edit')" v-model="editVisible" width="70%"
            @close="editCancel" align-center :append-to-body="true" :close-on-click-modal="false"
            :close-on-press-escape="false">
            <el-form :model="editForm" ref="editFormRef" label-width="auto" :inline="false" :rules="formRules">
                <el-row :gutter="16">
                    <el-col :span="6">
                        <el-form-item :label="t('incomingManage.inspectionRule.isDouble')" prop="IsDouble">
                            <el-select v-model="editForm.IsDouble" style="width: 100%">
                                <el-option :label="t('publicText.yes')" :value="1"></el-option>
                                <el-option :label="t('publicText.no')" :value="0"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="数量" prop="DoubleQty">
                            <el-input-number v-model="editForm.DoubleQty" :min="0" 
                                style="width: 100%" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="检验文件">
                            <div class="file-area">
                                <template v-if="editExistingFile">
                                    <div class="file-item">
                                        <el-icon color="#006487"><Document /></el-icon>
                                        <span class="file-name" :title="editExistingFile.OriginalFileName">{{ editExistingFile.OriginalFileName }}</span>
                                        <el-button type="primary" link size="small" @click.stop="previewInspectionFile(editExistingFile)">预览</el-button>
                                        <el-button type="primary" link size="small" @click.stop="downloadInspectionFile(editExistingFile)">下载</el-button>
                                        <el-button type="danger" link size="small" @click.stop="deleteInspectionFile(editExistingFile)">删除</el-button>
                                        <el-divider direction="vertical" />
                                        <el-upload v-model:file-list="editFileList" :auto-upload="false" :limit="1"
                                            :on-exceed="handleExceed" accept=".pdf" style="display: inline-flex;">
                                            <el-button type="primary" size="small" plain>替换</el-button>
                                        </el-upload>
                                    </div>
                                </template>
                                <el-upload v-else v-model:file-list="editFileList" :auto-upload="false" :limit="1"
                                    :on-exceed="handleExceed" accept=".pdf">
                                    <el-button type="primary" size="small" plain>选择文件</el-button>
                                </el-upload>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="16">
                    <!-- 左边：物料列表 -->
                    <el-col :span="11">
                        <div class="dialog-section-title">物料列表</div>
                        <div class="mb-2">
                            <el-button type="primary" size="small" @click="openMaterialSelectDialog">{{
                                t('publicText.add')
                                }}物料</el-button>
                        </div>
                        <el-table :data="paginatedMaterials" border size="small" style="width: 100%" height="300">
                            <el-table-column type="index" align="center" :label="$t('publicText.index')" width="50">
                                <template #default="scope">
                                    <span>{{ scope.$index + (materialPage.currentPage - 1) * materialPage.pageSize + 1 }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column :label="t('incomingManage.inspectionRule.materialCode')"
                                prop="MaterialCode" min-width="150" />
                            <el-table-column :label="$t('publicText.operation')" width="80" align="center">
                                <template #default="{ $index }">
                                    <el-button type="danger" size="small" link @click="removeMaterialRow($index + (materialPage.currentPage - 1) * materialPage.pageSize)">{{
                                        t('publicText.delete') }}</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="mt-2">
                            <el-pagination :size="'small'" background @size-change="onMaterialSizeChange"
                                @current-change="onMaterialPageChange" :current-page="materialPage.currentPage"
                                :page-size="materialPage.pageSize" :pager-count="5" :page-sizes="[10, 20, 50, 100]"
                                layout="total, sizes, prev, pager, next" :total="editForm.Materials.length">
                            </el-pagination>
                        </div>
                    </el-col>
                    <!-- 右边：项目组和明细 Tab -->
                    <el-col :span="13">
                        <el-tabs v-model="dialogActiveTab" class="dialog-tabs">
                            <el-tab-pane :label="t('incomingManage.inspectionRule.projectGroups')" name="project">
                                <div class="mb-2">
                                    <el-button type="primary" size="small" @click="addProjectRow(editForm)">{{
                                        t('publicText.add')
                                        }}项目组</el-button>
                                </div>
                                <el-table :data="editForm.Projects" border size="small" style="width: 100%" height="300">
                                    <el-table-column :label="t('incomingManage.inspectionRule.projectCode')"
                                        min-width="200">
                                        <template #default="{ row }">
                                            <el-select v-model="row.ProjectCode" size="small" style="width: 100%"
                                                filterable clearable placeholder=""
                                                @change="(val: any) => handleProjectSelect(row, val)">
                                                <el-option v-for="item in availableProjectList"
                                                    :key="item.ProjectCode"
                                                    :label="`${item.ProjectCode} - ${item.ProjectName}`"
                                                    :value="item.ProjectCode">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                    <el-table-column :label="t('incomingManage.inspectionRule.versionNo')"
                                        prop="VersionNo" width="100">
                                        <template #default="{ row }">
                                            <el-input v-model="row.VersionNo" size="small" disabled />
                                        </template>
                                    </el-table-column>
                                    <el-table-column :label="t('incomingManage.inspectionRule.isDefault')"
                                        width="100" align="center">
                                        <template #default="{ $index }">
                                            <el-radio v-model="editForm.defaultProjectIndex" :label="$index"
                                                @change="() => setDefaultProject(editForm, $index)">默认</el-radio>
                                        </template>
                                    </el-table-column>
                                    <el-table-column :label="$t('publicText.operation')" width="80" align="center">
                                        <template #default="{ $index }">
                                            <el-button type="danger" size="small" link
                                                @click="removeProjectRow(editForm, $index)">{{
                                                    t('publicText.delete') }}</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-tab-pane>
                            <el-tab-pane :label="t('incomingManage.inspectionRule.details')" name="detail">
                                <div class="mb-2">
                                    <el-button type="primary" size="small" @click="addDetailRow(editForm)">{{
                                        t('publicText.add')
                                        }}检验项</el-button>
                                </div>
                                <el-table :data="editForm.Details" border size="small" style="width: 100%" height="300">
                                    <el-table-column :label="t('incomingManage.testItems.gaugeCode')" width="180">
                                        <template #default="{ row }">
                                            <el-select v-model="row.InspectionCode" size="small" style="width: 100%"
                                                filterable clearable
                                                :placeholder="t('incomingManage.testItems.gaugeCode')"
                                                @change="handleInspectionSelect(row, $event)">
                                                <el-option v-for="item in availableInspectionList"
                                                    :key="item.InspectionCode"
                                                    :label="`${item.InspectionCode} - ${item.InspectionName}`"
                                                    :value="item.InspectionCode">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                    <el-table-column :label="t('incomingManage.testItems.gaugeName')"
                                        min-width="120">
                                        <template #default="{ row }">
                                            <el-input v-model="row.InspectionName" size="small" disabled />
                                        </template>
                                    </el-table-column>
                                    <el-table-column :label="t('incomingManage.testItems.inspectionType')"
                                        width="100">
                                        <template #default="{ row }">
                                            <span>{{ row.InspectionType === 1 ?
                                                t('incomingManage.testItems.qualitative') :
                                                t('incomingManage.testItems.quantitative') }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column :label="t('incomingManage.inspectionRule.lowerLimit')"
                                        width="100">
                                        <template #default="{ row }">
                                            <el-input-number v-model="row.LowerLimit" size="small" :controls="false"
                                                style="width: 100%" :disabled="row.InspectionType === 1" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column :label="t('incomingManage.inspectionRule.upperLimit')"
                                        width="100">
                                        <template #default="{ row }">
                                            <el-input-number v-model="row.UpperLimit" size="small" :controls="false"
                                                style="width: 100%" :disabled="row.InspectionType === 1" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column :label="t('incomingManage.inspectionRule.unit')" width="80">
                                        <template #default="{ row }">
                                            <el-input v-model="row.Unit" size="small"
                                                :disabled="row.InspectionType === 1" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column :label="$t('publicText.operation')" width="80" align="center">
                                        <template #default="{ $index }">
                                            <el-button type="danger" size="small" link
                                                @click="removeDetailRow(editForm, $index)">{{
                                                    t('publicText.delete') }}</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-tab-pane>
                        </el-tabs>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <el-button @click="editCancel">{{ $t("publicText.cancel") }}</el-button>
                <el-button type="primary" @click="editSubmit">{{ $t("publicText.confirm") }}</el-button>
            </template>
        </el-dialog>

        <!-- 物料选择对话框 -->
        <el-dialog :title="t('incomingManage.inspectionRule.selectMaterials')" v-model="materialSelectVisible"
            width="700px" @close="materialSelectCancel" align-center :append-to-body="true"
            :close-on-click-modal="false">
            <el-form :model="materialSelectForm" label-width="auto" :inline="true" :size="'small'"
                @submit.native.prevent>
                <el-form-item :label="t('incomingManage.inspectionRule.materialCode')">
                    <el-input v-model="materialSelectForm.keyword"
                        :placeholder="t('incomingManage.inspectionRule.materialCodePlaceholder')" clearable
                        @clear="searchMaterialSelect" @keyup.enter.native="searchMaterialSelect" style="width: 200px" />
                </el-form-item>
                <el-form-item>
                    <el-button :type="'primary'" @click="searchMaterialSelect">{{ t('publicText.query') }}</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="availableMaterialSelectList" size="small" :style="{ width: '100%' }" height="400" border
                @selection-change="handleMaterialSelectionChange">
                <el-table-column type="selection" width="55" />
                <el-table-column :label="t('incomingManage.inspectionRule.materialCode')" prop="MaterialCode"
                    min-width="150" />
                <el-table-column :label="t('incomingManage.inspectionRule.materialName')" prop="MaterialName"
                    min-width="150" />
                <el-table-column :label="t('incomingManage.inspectionRule.materialSpec')" prop="MaterialSpec"
                    min-width="150" />
            </el-table>
            <template #footer>
                <el-button @click="materialSelectCancel">{{ $t("publicText.cancel") }}</el-button>
                <el-button type="primary" @click="confirmMaterialSelection">{{ $t("publicText.confirm") }}</el-button>
            </template>
        </el-dialog>

        <!-- PDF预览弹窗 -->
        <el-dialog v-model="previewVisible" :title="previewFileName" width="85%" align-center :append-to-body="true"
            :close-on-click-modal="false" @close="closePreview" class="preview-dialog">
            <template #header>
                <div class="preview-header">
                    <el-icon class="preview-icon"><Document /></el-icon>
                    <span class="preview-title" :title="previewFileName">{{ previewFileName }}</span>
                </div>
            </template>
            <div class="preview-body">
                <div v-if="previewLoading" class="preview-loading">
                    <el-icon class="is-loading" :size="40" color="#006487"><Loading /></el-icon>
                    <span class="loading-text">文件加载中...</span>
                </div>

                <iframe v-if="previewUrl" :src="previewUrl" class="pdf-preview-frame" @load="previewLoading = false"
                    @error="handlePreviewFailed" />
                <el-empty v-if="!previewUrl && !previewLoading" description="暂无文件" />
            </div>
            <template #footer>
                <el-button type="primary" :disabled="!currentPreviewFile" @click="downloadInspectionFile(currentPreviewFile)">
                    <el-icon style="margin-right: 4px;"><Download /></el-icon>下载
                </el-button>
                <el-button @click="previewVisible = false">{{ $t("publicText.close") }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import {
    RefreshInspectionItem,
    RefreshInspectionRule,
    QueryInspectionRuleDetail,
    AddInspectionRule,
    DeleteInspectionRule,
    QueryPartNumbersIqc,
    RefreshInspectionProject,
    QueryInspectionRuleProject,
    UpdateInspectionRule,
    QueryInspectionRuleMaterial,
    UploadInspectionFile,
    QueryInspectionFile,
    DownloadInspectionFile,
    DeleteInspectionFile
} from "@/api/incomingManage/index";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import {
    ref,
    reactive,
    computed,
    nextTick,
    onMounted,
    onBeforeMount,
    onBeforeUnmount,
} from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Document, Loading, Download, Delete } from "@element-plus/icons-vue";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { useI18n } from "vue-i18n";

const userStore = useUserStoreWithOut();
const { t } = useI18n();

// 表格高度自适应
const tableHeight = ref(0);
const tableHeight2 = ref(0);
const eltableRef = ref();
const eltableRef2 = ref();
const eltableRef3 = ref();

// 主表数据
const tableData = ref<any[]>([]);
const total = ref(0);
const getForm = reactive({
    PageIndex: 1,
    PageSize: 30,
    MaterialCode: "",
});

// 右侧标签页
const activeName = ref("projects");
// 子表数据（明细）
const detailData = ref<any[]>([]);
// 项目组数据
const projectGroupData = ref<any[]>([]);
const currentRuleId = ref<number | null>(null);
// 检验文件
const inspectionFile = ref<any>(null);
// 编辑弹窗中已上传的检验文件
const editExistingFile = ref<any>(null);
// 编辑弹窗中物料原始快照（用于计算增量）
const originalMaterials = ref<any[]>([]);
// PDF预览
const previewVisible = ref(false);
const previewUrl = ref("");
const previewFileName = ref("");
const previewLoading = ref(false);
const currentPreviewFile = ref<any>(null);

// 新增对话框
const addVisible = ref(false);
const addFormRef = ref();
// 编辑对话框
const editVisible = ref(false);
const editFormRef = ref();
// 当前活跃表单（用于共享的计算属性和方法）
const currentForm = ref<any>(null);
// 对话框内Tab
const dialogActiveTab = ref("project");

const addForm = reactive({
    IsDouble: 0,
    DoubleQty: 0,
    Materials: [] as any[],
    Projects: [] as any[],
    Details: [] as any[],
    defaultProjectIndex: -1,
});
const editForm = reactive({
    ruleId: 0,
    IsDouble: 0,
    DoubleQty: 0,
    Materials: [] as any[],
    Projects: [] as any[],
    Details: [] as any[],
    defaultProjectIndex: -1,
});
const formRules = {};

// 文件上传
const addFileList = ref<any[]>([]);
const editFileList = ref<any[]>([]);
const handleExceed = () => {
    ElMessage.warning("只能上传一个文件，请先删除已选文件");
};

// 弹窗物料表格前端分页
const materialPage = reactive({
    currentPage: 1,
    pageSize: 20,
});
const paginatedMaterials = computed(() => {
    const form = currentForm.value || addForm;
    const start = (materialPage.currentPage - 1) * materialPage.pageSize;
    return form.Materials.slice(start, start + materialPage.pageSize);
});
const onMaterialSizeChange = (val: number) => {
    materialPage.pageSize = val;
    materialPage.currentPage = 1;
};
const onMaterialPageChange = (val: number) => {
    materialPage.currentPage = val;
};
const resetMaterialPage = () => {
    materialPage.currentPage = 1;
};

// 物料搜索相关
const materialList = ref<any[]>([]);
const materialLoading = ref(false);

// 物料选择对话框相关
const materialSelectVisible = ref(false);
const materialSelectForm = reactive({
    keyword: "",
});
const materialSelectList = ref<any[]>([]);
const selectedMaterials = ref<any[]>([]);
// 检验项列表（检具）
const inspectionItemList = ref<any[]>([]);
// 检验项目组列表（用于下拉选择）
const projectList = ref<any[]>([]);

// 过滤已选物料后的物料选择列表
const availableMaterialSelectList = computed(() => {
    const form = currentForm.value || addForm;
    const selectedCodes = form.Materials.map((m: any) => m.MaterialCode);
    return materialSelectList.value.filter(item => !selectedCodes.includes(item.MaterialCode));
});

// 过滤已选项目组后的项目组下拉列表
const availableProjectList = computed(() => {
    const form = currentForm.value || addForm;
    const selectedCodes = form.Projects.filter((p: any) => p.ProjectCode).map((p: any) => p.ProjectCode);
    return projectList.value.filter(item => !selectedCodes.includes(item.ProjectCode));
});

// 过滤已选检验项后的检验项下拉列表
const availableInspectionList = computed(() => {
    const form = currentForm.value || addForm;
    const selectedCodes = form.Details.filter((d: any) => d.InspectionCode).map((d: any) => d.InspectionCode);
    return inspectionItemList.value.filter(item => !selectedCodes.includes(item.InspectionCode));
});

// ==================== API 调用 ====================
// 获取主表数据
const getData = () => {
    RefreshInspectionRule({
        PageIndex: getForm.PageIndex,
        PageSize: getForm.PageSize,
        MaterialCode: getForm.MaterialCode || undefined,
    }).then((res: any) => {
        if (res.Success) {
            total.value = res.Data.total;
            tableData.value = res.Data.rows || [];
        } else {
            ElMessage.error(res.Message || "查询失败");
        }
    }).catch(() => {
        ElMessage.error("查询失败");
    });
};

// 获取检验项（检具）列表
const getInspectionItems = () => {
    RefreshInspectionItem({ PageIndex: 1, PageSize: 1000 }).then((res: any) => {
        if (res.Success) {
            inspectionItemList.value = res.Data.rows || [];
        } else {
            ElMessage.error(res.Message || "查询检具失败");
        }
    }).catch(() => {
        ElMessage.error("查询检具失败");
    });
};

// 获取检验项目组列表（用于下拉选择）
const getProjectList = () => {
    RefreshInspectionProject({ PageIndex: 1, PageSize: 1000 }).then((res: any) => {
        if (res.Success) {
            projectList.value = res.Data.rows || [];
        } else {
            ElMessage.error(res.Message || "查询检验项目组失败");
        }
    }).catch(() => {
        ElMessage.error("查询检验项目组失败");
    });
};

// 打开物料选择对话框
const openMaterialSelectDialog = () => {
    materialSelectVisible.value = true;
    materialSelectForm.keyword = "";
    selectedMaterials.value = [];
    searchMaterialSelect();
};

// 搜索物料（用于物料选择对话框）
const searchMaterialSelect = () => {
    materialLoading.value = true;
    QueryPartNumbersIqc({ keyword: materialSelectForm.keyword || "" })
        .then((res: any) => {
            if (res.Success && res.Data) {
                materialSelectList.value = res.Data.map((item: any) => ({
                    MaterialCode: item.PN || item.MaterialCode,
                    MaterialName: item.name || item.MaterialName,
                    MaterialSpec: item.Spec || item.MaterialSpec || "",
                }));
            } else {
                materialSelectList.value = [];
            }
        })
        .catch(() => {
            materialSelectList.value = [];
        })
        .finally(() => {
            materialLoading.value = false;
        });
};

// 物料选择变化
const handleMaterialSelectionChange = (val: any[]) => {
    selectedMaterials.value = val;
};

// 确认物料选择
const confirmMaterialSelection = () => {
    if (selectedMaterials.value.length === 0) {
        ElMessage.warning("请至少选择一个物料");
        return;
    }
    const form = currentForm.value;
    const existingCodes = form.Materials.map((m: any) => m.MaterialCode);
    selectedMaterials.value.forEach(item => {
        if (!existingCodes.includes(item.MaterialCode)) {
            form.Materials.push({
                MaterialCode: item.MaterialCode,
                MaterialName: item.MaterialName,
                MaterialSpec: item.MaterialSpec,
            });
        }
    });
    materialSelectVisible.value = false;
};

// 取消物料选择
const materialSelectCancel = () => {
    materialSelectVisible.value = false;
    selectedMaterials.value = [];
};

// 删除物料行
const removeMaterialRow = (index: number) => {
    const form = currentForm.value;
    form.Materials.splice(index, 1);
    const maxPage = Math.max(1, Math.ceil(form.Materials.length / materialPage.pageSize));
    if (materialPage.currentPage > maxPage) materialPage.currentPage = maxPage;
};

// 查询（重置页码）
const searchData = () => {
    getForm.PageIndex = 1;
    getData();
};

// 分页处理
const handleSizeChange = (val: number) => {
    getForm.PageSize = val;
    getData();
};
const handleCurrentChange = (val: number) => {
    getForm.PageIndex = val;
    getData();
};

// 点击行加载子表明细和项目组
const handleRowClick = (row: any) => {
    currentRuleId.value = row.RuleId;
    // 加载明细
    QueryInspectionRuleDetail({ RuleId: row.RuleId }).then((res: any) => {
        if (res.Success) {
            detailData.value = res.Data || [];
        } else {
            ElMessage.error(res.Message || "查询明细失败");
            detailData.value = [];
        }
    }).catch(() => {
        ElMessage.error("查询明细失败");
        detailData.value = [];
    });
    // 加载项目组
    QueryInspectionRuleProject({ RuleId: row.RuleId }).then((res: any) => {
        if (res.Success) {
            projectGroupData.value = res.Data || [];
        } else {
            ElMessage.error(res.Message || "查询项目组失败");
            projectGroupData.value = [];
        }
    }).catch(() => {
        ElMessage.error("查询项目组失败");
        projectGroupData.value = [];
    });
    // 加载检验文件
    if (row.MaterialCode) {
        QueryInspectionFile({ MaterialCode: row.MaterialCode }).then((res: any) => {
            if (res.Success) {
                const list = res.Data || [];
                inspectionFile.value = list.length > 0 ? list[0] : null;
            } else {
                inspectionFile.value = null;
            }
        }).catch(() => {
            inspectionFile.value = null;
        });
    } else {
        inspectionFile.value = null;
    }
};

// 操作列 - 检验文件预览
const handleFilePreview = async (row: any) => {
    if (!row.MaterialCode) {
        ElMessage.warning("该记录无物料编码，无法查询检验文件");
        return;
    }
    try {
        const res: any = await QueryInspectionFile({ MaterialCode: row.MaterialCode });
        if (res.Success && res.Data && res.Data.length > 0) {
            previewInspectionFile(res.Data[0]);
        } else {
            ElMessage.info("暂无检验文件");
        }
    } catch {
        ElMessage.error("查询检验文件失败");
    }
};

// 删除主表
const handleDelete = (row: any) => {
    ElMessageBox.confirm(`${t('publicText.confirm')}${t("publicText.delete")}【${row.MaterialCode}】?`, t("publicText.confirm"), {
        confirmButtonText: t("publicText.confirm"),
        cancelButtonText: t("publicText.cancel"),
        type: "warning",
    })
        .then(() => {
            DeleteInspectionRule({
                "Id": row.RuleId,
                "DeleteUser": userStore.getUserInfo,
                "DeleteReason": ""
            }).then((res: any) => {
                if (res.Success) {
                    ElMessage.success(res.Message || "删除成功");
                    if (currentRuleId.value === row.RuleId) {
                        currentRuleId.value = null;
                        detailData.value = [];
                        projectGroupData.value = [];
                    }
                    getData();
                } else {
                    ElMessage.error(res.Message || "删除失败");
                }
            }).catch(() => {
                ElMessage.error("删除失败");
            });
        })
        .catch(() => {
            ElMessage.info(t("publicText.cancel"));
        });
};

// ==================== 新增对话框操作 ====================
const openAdd = () => {
    currentForm.value = addForm;
    addForm.IsDouble = 0;
    addForm.DoubleQty = 0;
    addForm.Materials = [];
    addForm.Projects = [];
    addForm.Details = [];
    addForm.defaultProjectIndex = -1;
    addFileList.value = [];
    dialogActiveTab.value = "project";
    resetMaterialPage();
    getInspectionItems();
    getProjectList();
    addVisible.value = true;
};

const addCancel = () => {
    addVisible.value = false;
    addFormRef.value?.resetFields();
    addFileList.value = [];
    currentForm.value = null;
};

// ==================== 编辑对话框操作 ====================
const openEdit = async (row: any) => {
    currentForm.value = editForm;
    editForm.ruleId = row.RuleId;
    editForm.IsDouble = row.IsDouble;
    editForm.DoubleQty = row.DoubleQty || 0;
    editFileList.value = [];
    editExistingFile.value = null;

    // 并行加载物料、明细、项目组和检验文件
    try {
        const [materialRes, detailRes, projectRes] = await Promise.all([
            QueryInspectionRuleMaterial({ RuleId: row.RuleId }),
            QueryInspectionRuleDetail({ RuleId: row.RuleId }),
            QueryInspectionRuleProject({ RuleId: row.RuleId })
        ]);
        const materials = (materialRes as any).Success ? ((materialRes as any).Data ?? []) : [];
        const details = (detailRes as any).Success ? ((detailRes as any).Data ?? []) : [];
        const projects = (projectRes as any).Success ? ((projectRes as any).Data ?? []) : [];

        // 查询已上传的检验文件（使用 MaterialCode）
        const firstMaterialCode = materials.length > 0 ? materials[0].MaterialCode : row.MaterialCode;
        if (firstMaterialCode) {
            try {
                const fileRes: any = await QueryInspectionFile({ MaterialCode: firstMaterialCode });
                if (fileRes.Success && fileRes.Data && fileRes.Data.length > 0) {
                    editExistingFile.value = fileRes.Data[0];
                }
            } catch { /* ignore */ }
        }

        editForm.Materials = materials.map((m: any) => ({
            MaterialCode: m.MaterialCode,
            MaterialName: m.MaterialName,
            MaterialSpec: m.MaterialSpec,
        }));
        // 保存原始物料快照用于提交时计算增量
        originalMaterials.value = editForm.Materials.map((m: any) => ({ ...m }));

        if (projects.length > 0) {
            editForm.Projects = projects.map((p: any) => ({
                ProjectCode: p.ProjectCode,
                VersionNo: p.VersionNo,
                IsDefault: p.IsDefault,
            }));
            const defaultIdx = editForm.Projects.findIndex((p: any) => p.IsDefault === 1);
            editForm.defaultProjectIndex = defaultIdx !== -1 ? defaultIdx : 0;
            updateProjectsDefaultFlag(editForm);
            editForm.Details = [];
            dialogActiveTab.value = "project";
        } else if (details.length > 0) {
            editForm.Details = details.map((item: any) => ({
                InspectionCode: item.InspectionCode,
                InspectionName: item.InspectionName,
                IsInspectionTool: item.IsInspectionTool,
                InspectionType: item.InspectionType,
                UpperLimit: item.UpperLimit,
                LowerLimit: item.LowerLimit,
                Unit: item.Unit || "",
            }));
            editForm.Projects = [];
            editForm.defaultProjectIndex = -1;
            dialogActiveTab.value = "detail";
        } else {
            editForm.Projects = [];
            editForm.Details = [];
            dialogActiveTab.value = "project";
        }
    } catch (error) {
        ElMessage.error("加载规则详情失败");
        editForm.Materials = [];
        editForm.Projects = [];
        editForm.Details = [];
        dialogActiveTab.value = "project";
    }
    resetMaterialPage();
    getInspectionItems();
    getProjectList();
    editVisible.value = true;
};

const editCancel = () => {
    editVisible.value = false;
    editFormRef.value?.resetFields();
    editFileList.value = [];
    editExistingFile.value = null;
    originalMaterials.value = [];
    currentForm.value = null;
};

// ==================== 共享操作方法 ====================
// 项目组相关操作
const addProjectRow = (form: any) => {
    form.Projects.push({
        ProjectCode: "",
        VersionNo: "",
        IsDefault: 0,
    });
    if (form.Projects.length === 1 && form.defaultProjectIndex === -1) {
        form.defaultProjectIndex = 0;
        updateProjectsDefaultFlag(form);
    }
};
const removeProjectRow = (form: any, index: number) => {
    if (form.Projects.length <= 1) {
        ElMessage.warning("至少保留一个项目组");
        return;
    }
    if (form.defaultProjectIndex === index) {
        form.defaultProjectIndex = -1;
    } else if (form.defaultProjectIndex > index) {
        form.defaultProjectIndex--;
    }
    form.Projects.splice(index, 1);
    updateProjectsDefaultFlag(form);
};
const handleProjectSelect = (row: any, selectedCode: string) => {
    if (!selectedCode) {
        row.VersionNo = "";
        return;
    }
    const selected = projectList.value.find(item => item.ProjectCode === selectedCode);
    if (selected) {
        row.VersionNo = selected.VersionNo || 1;
    } else {
        row.VersionNo = "";
    }
};
const setDefaultProject = (form: any, index: number) => {
    form.defaultProjectIndex = index;
    updateProjectsDefaultFlag(form);
};
const updateProjectsDefaultFlag = (form: any) => {
    form.Projects.forEach((proj: any, idx: number) => {
        proj.IsDefault = idx === form.defaultProjectIndex ? 1 : 0;
    });
};

// 明细相关操作
const addDetailRow = (form: any) => {
    form.Details.push({
        InspectionCode: "",
        InspectionName: "",
        IsInspectionTool: 1,
        InspectionType: 1,
        UpperLimit: null,
        LowerLimit: null,
        Unit: "",
    });
};
const removeDetailRow = (form: any, index: number) => {
    if (form.Details.length <= 1) {
        ElMessage.warning("至少保留一个检验项");
        return;
    }
    form.Details.splice(index, 1);
};

// 检验项下拉选中后自动填充
const handleInspectionSelect = (row: any, selectedCode: string) => {
    if (!selectedCode) {
        row.InspectionName = "";
        row.IsInspectionTool = 1;
        return;
    }
    const selectedItem = inspectionItemList.value.find(item => item.InspectionCode === selectedCode);
    if (selectedItem) {
        row.InspectionName = selectedItem.InspectionName;
        row.IsInspectionTool = selectedItem.IsInspectionTool;
        row.InspectionType = selectedItem.InspectionType;
    }
};
// 检验类型变更处理
const handleInspectionTypeChange = (row: any) => {
    if (row.InspectionType === 1) {
        row.UpperLimit = null;
        row.LowerLimit = null;
        row.Unit = "";
    }
};

// ==================== 文件上传 ====================
const uploadInspectionFile = (ruleId: number, fileList: any[]) => {
    if (fileList.length === 0) return;
    const formData = new FormData();
    formData.append("ruleId", String(ruleId));
    formData.append("file", fileList[0].raw);
    return UploadInspectionFile(formData).then((res: any) => {
        if (res.Success) {
            editVisible.value = false;
            addVisible.value=false
            ElMessage.success("文件上传成功");
        } else {
            ElMessage.error(res.Message || "文件上传失败");
        }
    }).catch(() => {
        ElMessage.error("文件上传失败");
    });
};

// 格式化文件大小
const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 B";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
};

// 预览检验文件
const toPreviewBlob = (blob: Blob, fileName: string) => {
    const isPdf = (fileName || "").toLowerCase().endsWith(".pdf");
    if (isPdf && blob.type !== "application/pdf") {
        return new Blob([blob], { type: "application/pdf" });
    }
    return blob;
};

const previewInspectionFile = async (file: any) => {
    try {
        currentPreviewFile.value = file;
        previewFileName.value = file.OriginalFileName;
        previewVisible.value = true;
        previewLoading.value = true;
        previewUrl.value = "";
        const blob = await DownloadInspectionFile(file.AttachmentId);
        previewUrl.value = window.URL.createObjectURL(toPreviewBlob(blob, file.OriginalFileName));
    } catch (e: any) {
        ElMessage.error(e.message || "预览失败");
        previewLoading.value = false;
        previewVisible.value = false;
    }
};

// 下载检验文件
const downloadInspectionFile = async (file: any) => {
    try {
        const blob = await DownloadInspectionFile(file.AttachmentId);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.OriginalFileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
    } catch (e: any) {
        ElMessage.error(e.message || "下载失败");
    }
};

// 删除检验文件
const deleteInspectionFile = (file: any) => {
    ElMessageBox.confirm(
        `确定删除文件「${file.OriginalFileName}」吗？`,
        "提示",
        { type: "warning" }
    ).then(async () => {
        try {
            const res: any = await DeleteInspectionFile(file.AttachmentId);
            if (res.Success) {
                ElMessage.success("删除成功");
                editExistingFile.value = null;
            } else {
                ElMessage.error(res.Message || "删除失败");
            }
        } catch (e: any) {
            ElMessage.error(e.message || "删除失败");
        }
    }).catch(() => {});
};

const handlePreviewFailed = () => {
    ElMessage.error("文件加载失败");
    previewLoading.value = false;
    previewVisible.value = false;
};

const closePreview = () => {
    if (previewUrl.value) {
        window.URL.revokeObjectURL(previewUrl.value);
        previewUrl.value = "";
    }
    previewFileName.value = "";
    previewLoading.value = false;
    currentPreviewFile.value = null;
};

// ==================== 表单验证（共用） ====================
const validateProjectsAndDetails = (form: any): { projectsParams: any[], detailsParams: any[] } | null => {
    if (form.Materials.length === 0) {
        ElMessage.warning("请至少添加一个物料");
        return null;
    }

    const hasProjects = form.Projects.some((p: any) => p.ProjectCode && p.ProjectCode.trim() !== "");
    const hasDetails = form.Details.some((d: any) => d.InspectionCode && d.InspectionCode.trim() !== "");

    let projectsParams: any[] = [];
    let detailsParams: any[] = [];

    if (hasProjects) {
        if (form.Projects.length === 0) {
            ElMessage.warning("请至少添加一个检验项目组");
            return null;
        }
        // 提交前同步 defaultProjectIndex -> IsDefault
        if (form.defaultProjectIndex !== undefined && form.defaultProjectIndex !== -1) {
            updateProjectsDefaultFlag(form);
        }
        const defaultCount = form.Projects.filter((p: any) => p.IsDefault === 1).length;
        if (defaultCount !== 1) {
            ElMessage.warning("请设置且仅设置一个默认项目组");
            return null;
        }
        const invalidProject = form.Projects.some((p: any) => !p.ProjectCode);
        if (invalidProject) {
            ElMessage.warning("请完整填写项目组编码");
            return null;
        }
        projectsParams = form.Projects.map((proj: any) => ({
            ProjectCode: proj.ProjectCode,
            VersionNo: proj.VersionNo,
            IsDefault: proj.IsDefault,
        }));
    } else if (hasDetails) {
        if (form.Details.length === 0) {
            ElMessage.warning("请至少添加一个检验项");
            return null;
        }
        for (let i = 0; i < form.Details.length; i++) {
            const item = form.Details[i];
            if (!item.InspectionCode || !item.InspectionName) {
                ElMessage.warning(`第${i + 1}行检验项编码和名称不能为空`);
                return null;
            }
            if (item.InspectionType === 2) {
                if (item.UpperLimit === null || item.UpperLimit === undefined || item.UpperLimit === "") {
                    ElMessage.warning(`第${i + 1}行定量检验必须填写上限`);
                    return null;
                }
                if (item.LowerLimit === null || item.LowerLimit === undefined || item.LowerLimit === "") {
                    ElMessage.warning(`第${i + 1}行定量检验必须填写下限`);
                    return null;
                }
                if (!item.Unit || item.Unit.trim() === "") {
                    ElMessage.warning(`第${i + 1}行定量检验必须填写单位`);
                    return null;
                }
                if (Number(item.UpperLimit) < Number(item.LowerLimit)) {
                    ElMessage.warning(`第${i + 1}行上限必须大于下限`);
                    return null;
                }
            }
        }
        detailsParams = form.Details.map((item: any) => {
            const detail: any = {
                InspectionCode: item.InspectionCode,
                InspectionName: item.InspectionName,
                IsInspectionTool: item.IsInspectionTool,
                InspectionType: item.InspectionType,
            };
            if (item.InspectionType === 2) {
                detail.UpperLimit = Number(item.UpperLimit);
                detail.LowerLimit = Number(item.LowerLimit);
                detail.Unit = item.Unit.trim();
            } else {
                detail.UpperLimit = null;
                detail.LowerLimit = null;
                detail.Unit = "";
            }
            return detail;
        });
    } else {
        ElMessage.warning("请至少配置项目组或检验明细");
        return null;
    }

    return { projectsParams, detailsParams };
};

// ==================== 提交 ====================
// 提交新增
const addSubmit = () => {
    addFormRef.value.validate((valid: boolean) => {
        if (!valid) return;

        const result = validateProjectsAndDetails(addForm);
        if (!result) return;

        const { projectsParams, detailsParams } = result;
        const materialsParams = addForm.Materials.map((m: any) => ({
            MaterialCode: m.MaterialCode,
            MaterialName: m.MaterialName,
            MaterialSpec: m.MaterialSpec,
        }));

        const params = {
            Rule: {
                IsDouble: addForm.IsDouble,
                DoubleQty: addForm.DoubleQty,
                CreateUser: userStore.getUserInfo || "admin",
            },
            Materials: materialsParams,
            Projects: projectsParams,
            Details: detailsParams,
        };
        AddInspectionRule(params).then((res: any) => {
            if (res.Success) {
                const newRuleId = res.Data?.ruleId;
                // 上传文件
                if (addFileList.value.length > 0 && newRuleId) {
                    uploadInspectionFile(newRuleId, addFileList.value);
                }else{
                    addVisible.value = false;
                }
                ElMessage.success(res.Message || "新增成功");
                getData();
            } else {
                ElMessage.error(res.Message || "新增失败");
            }
        }).catch(() => {
            ElMessage.error("新增失败");
        });
    });
};

// 提交编辑（增量提交：只传本次变更的物料）
const editSubmit = () => {
    editFormRef.value.validate((valid: boolean) => {
        if (!valid) return;

        const result = validateProjectsAndDetails(editForm);
        if (!result) return;

        const { projectsParams, detailsParams } = result;

        // 计算物料增量（用 Set/Map 优化 O(n*m) -> O(n)）
        const origMap = new Map<string, any>();
        for (const m of originalMaterials.value) {
            origMap.set(m.MaterialCode, m);
        }
        const curCodeSet = new Set<string>();
        for (const m of editForm.Materials) {
            curCodeSet.add(m.MaterialCode);
        }

        // 新增的物料
        const addMaterials: any[] = [];
        for (const m of editForm.Materials) {
            if (!origMap.has(m.MaterialCode)) {
                addMaterials.push({ MaterialCode: m.MaterialCode, MaterialName: m.MaterialName, MaterialSpec: m.MaterialSpec });
            }
        }

        // 删除的物料编码
        const deleteMaterialCodes: string[] = [];
        for (const m of originalMaterials.value) {
            if (!curCodeSet.has(m.MaterialCode)) {
                deleteMaterialCodes.push(m.MaterialCode);
            }
        }

        // 更新的物料（编码相同但其他字段有变化）
        const updateMaterials: any[] = [];
        for (const m of editForm.Materials) {
            const orig = origMap.get(m.MaterialCode);
            if (orig && (orig.MaterialName !== m.MaterialName || orig.MaterialSpec !== m.MaterialSpec)) {
                updateMaterials.push({ MaterialCode: m.MaterialCode, MaterialName: m.MaterialName, MaterialSpec: m.MaterialSpec });
            }
        }

        const params = {
            RuleId: editForm.ruleId,
            IsDouble: editForm.IsDouble,
            DoubleQty: editForm.DoubleQty,
            UpdateUser: userStore.getUserInfo || "admin",
            Projects: projectsParams,
            Details: detailsParams,
            AddMaterials: addMaterials,
            DeleteMaterialCodes: deleteMaterialCodes,
            UpdateMaterials: updateMaterials,
        };
        UpdateInspectionRule(params).then((res: any) => {
            if (res.Success) {
                // 上传文件（使用 ruleId）
                if (editFileList.value.length > 0) {
                    uploadInspectionFile(editForm.ruleId, editFileList.value);
                }else{
                       editVisible.value = false;
                }
                ElMessage.success(res.Message || "更新成功");
             
                getData();
                if (currentRuleId.value === editForm.ruleId) {
                    handleRowClick({ RuleId: editForm.ruleId });
                }
            } else {
                ElMessage.error(res.Message || "更新失败");
            }
        }).catch(() => {
            ElMessage.error("更新失败");
        });
    });
};

// ==================== 列宽自适应 ====================
const { getColumnWidth: getColumnWidth1 } = useTableColumnWidth(eltableRef, tableData, {
    excludeLabels: [t('publicText.index'), t('publicText.operation')]
});
const { getColumnWidth: getColumnWidth2 } = useTableColumnWidth(eltableRef3, detailData, {
    excludeLabels: [t('publicText.index')]
});

// 高度自适应
const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 180;
        tableHeight2.value = window.innerHeight - 220;
    });
};

onBeforeMount(() => {
    getScreenHeight();
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    getData();
    getInspectionItems();
    getProjectList();
});
onBeforeUnmount(() => {
    window.removeEventListener("resize", getScreenHeight);
});
</script>

<style scoped>
:deep(.el-table .cell) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.el-pagination {
    justify-content: center;
}

.detail-header {
    margin-bottom: 12px;
    padding: 0 8px;
    font-weight: 500;
}

.detail-title {
    font-size: 14px;
    color: #606266;
}

.detail-rule-id {
    margin-left: 12px;
    font-size: 14px;
    color: #409eff;
    font-weight: normal;
}

.detail-section {
    margin-bottom: 16px;
}

.section-title {
    font-size: 14px;
    font-weight: 500;
    color: #303133;
    margin-bottom: 8px;
    padding-left: 8px;
    border-left: 3px solid #409eff;
}

.detail-table-wrapper {
    width: 100%;
}

.tips {
    font-size: 12px;
    color: #909399;
    margin-top: 8px;
}

.mb-2 {
    margin-bottom: 8px;
}

.demo-tabs {
    margin-left: 0;
    padding-left: 0;
}

.dialog-tabs {
    margin-top: 8px;
}

.dialog-section-title {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 8px;
    padding-left: 8px;
    border-left: 3px solid #006487;
}

/* ============ 检验文件卡片 ============ */
.file-area {
    width: 100%;
    line-height: 32px;
}
.file-item {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: nowrap;
    overflow: hidden;
}
.file-item .file-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex-shrink: 1;
    min-width: 0;
}
.inspection-file-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
    background: #fff;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 100, 135, 0.08);
}
.file-icon-lg {
    font-size: 48px;
    flex-shrink: 0;
}
.file-info {
    flex: 1;
    min-width: 0;
}
.file-name {
    font-size: 15px;
    font-weight: 600;
    color: #303133;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 8px;
}
.file-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    font-size: 12px;
    color: #909399;
}
.file-actions {
    flex-shrink: 0;
    display: flex;
    gap: 8px;
}

/* ============ PDF预览弹窗 ============ */
:deep(.preview-dialog) {
    border-radius: 8px;
    overflow: hidden;
}
:deep(.preview-dialog .el-dialog__header) {
    background: linear-gradient(135deg, #006487 0%, #0088aa 100%);
    padding: 14px 20px;
    margin-right: 0;
    border-bottom: none;
}
:deep(.preview-dialog .el-dialog__headerbtn) {
    top: 14px;
}
:deep(.preview-dialog .el-dialog__headerbtn .el-dialog__close) {
    color: #fff;
    font-size: 18px;
}
:deep(.preview-dialog .el-dialog__headerbtn:hover .el-dialog__close) {
    color: #ffd666;
}
:deep(.preview-dialog .el-dialog__body) {
    padding: 0;
    background: #f5f7fa;
}
:deep(.preview-dialog .el-dialog__footer) {
    padding: 12px 20px;
    border-top: 1px solid #e4e7ed;
    text-align: center;
}
.preview-header {
    display: flex;
    align-items: center;
    gap: 10px;
}
.preview-icon {
    font-size: 20px;
    color: #fff;
}
.preview-title {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    max-width: 70%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.preview-body {
    position: relative;
    width: 100%;
    max-height: 65vh;
    overflow-y: auto;
    background: #f5f7fa;
}
.preview-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 65vh;
    gap: 16px;
}
.loading-text {
    font-size: 14px;
    color: #909399;
}
.pdf-preview-frame {
    width: 100%;
    height: 65vh;
    border: none;
    display: block;
    background: #fff;
}
</style>
<style lang="scss" scoped></style>
