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
            <el-row :gutter="20">
                <!-- 左侧：检验规则主表列表 -->
                <el-col :span="9">
                    <el-table :data="tableData" size="small" :style="{ width: '100%' }" :height="tableHeight"
                        :tooltip-effect="'dark'" border fit @row-click="handleRowClick" highlight-current-row>
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
                        <el-table-column :label="t('incomingManage.inspectionRule.isDouble')" prop="IsDouble"
                            :min-width="getColumnWidth1('IsDouble')">
                            <template #default="{ row }">
                                <span>{{ row.IsDouble === 1 ? t('publicText.yes') : t('publicText.no') }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="t('incomingManage.testItems.creator')" prop="CreateUser"
                            :min-width="getColumnWidth1('CreateUser')" />
                        <el-table-column :label="t('incomingManage.testItems.creatime')" prop="CreateTime"
                            :min-width="getColumnWidth1('CreateTime')" />
                        <!-- <el-table-column :label="t('incomingManage.testItems.updator')" prop="UpdateUser"
                            :min-width="getColumnWidth1('UpdateUser')" />
                        <el-table-column :label="t('incomingManage.testItems.updatetime')" prop="UpdateTime"
                            :min-width="getColumnWidth1('UpdateTime')" /> -->
                        <el-table-column :label="$t('publicText.operation')" :fixed="'right'" width="120"
                            :align="'center'">
                            <template #default="{ row }">
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
                            :page-size="getForm.PageSize" :page-sizes="[30, 50, 100, 200, 300]"
                            layout="total,sizes, prev, pager, next" :total="total">
                        </el-pagination>
                    </div>
                </el-col>
                <!-- 右侧：标签页展示明细或已选项目组 -->
                <el-col :span="15">
                    <el-tabs v-model="activeName" class="demo-tabs">
                        <el-tab-pane :label="t('incomingManage.inspectionRule.details')" name="detail">
                            <el-table :data="detailData" size="small" :style="{ width: '100%' }" :height="tableHeight2"
                                :tooltip-effect="'dark'" border fit>
                                <el-table-column type="index" align="center" :label="$t('publicText.index')"
                                    width="50" />
                                <el-table-column :label="t('incomingManage.testItems.gaugeCode')" prop="InspectionCode"
                                    :min-width="getColumnWidth2('InspectionCode')" />
                                <el-table-column :label="t('incomingManage.testItems.gaugeName')" prop="InspectionName"
                                    :min-width="getColumnWidth2('InspectionName')" />
                                <!-- <el-table-column :label="t('incomingManage.testItems.IsInspectionTool')"
                                    prop="IsInspectionTool" :min-width="getColumnWidth2('IsInspectionTool')">
                                    <template #default="{ row }">
                                        <span>{{ row.IsInspectionTool === 1 ? t('publicText.yes') : t('publicText.no')
                                        }}</span>
                                    </template>
                                </el-table-column> -->
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
                        <el-tab-pane :label="t('incomingManage.inspectionRule.projectGroups')" name="projects">
                            <el-table :data="projectGroupData" size="small" :style="{ width: '100%' }"
                                :height="tableHeight2" :tooltip-effect="'dark'" border fit>
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
                                <el-table-column :label="t('incomingManage.testItems.creator')" prop="CreateUser"
                                    :min-width="120" />
                                <el-table-column :label="t('incomingManage.testItems.creatime')" prop="CreateTime"
                                    :min-width="150" />
                                <template #empty>
                                    <div class="flex items-center justify-center h-100%">
                                        <el-empty :description="t('incomingManage.inspectionRule.noProject')" />
                                    </div>
                                </template>
                            </el-table>
                        </el-tab-pane>
                    </el-tabs>
                </el-col>
            </el-row>
        </el-card>

        <!-- 新增/编辑检验规则对话框（使用 tabs 区分项目组和明细） -->
        <el-dialog :title="isEditMode ? $t('publicText.edit') : $t('publicText.add')" v-model="addVisible" width="85%"
            @close="addCancel" align-center :append-to-body="true" :close-on-click-modal="false"
            :close-on-press-escape="false">
            <el-form :model="addForm" ref="addFormRef" label-width="auto" :inline="false" :rules="addRules">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('incomingManage.inspectionRule.materialCode')" prop="MaterialCode"
                            required>
                            <el-select v-model="addForm.MaterialCode" style="width: 100%" filterable remote
                                :remote-method="searchMaterial" :loading="materialLoading" clearable
                                :placeholder="t('incomingManage.inspectionRule.materialCodePlaceholder')"
                                :disabled="isEditMode" @change="handleMaterialSelect">
                                <el-option v-for="item in materialList" :key="item.MaterialCode"
                                    :label="`${item.MaterialCode} - ${item.MaterialName}`" :value="item.MaterialCode">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('incomingManage.inspectionRule.isDouble')" prop="IsDouble">
                            <el-select v-model="addForm.IsDouble" style="width: 100%">
                                <el-option :label="t('publicText.yes')" :value="1"></el-option>
                                <el-option :label="t('publicText.no')" :value="0"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12"> <el-form-item :label="t('incomingManage.inspectionRule.materialName')"
                            prop="MaterialName">
                            <el-input v-model="addForm.MaterialName" placeholder="" disabled style="width: 100%" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12"> <el-form-item :label="t('incomingManage.inspectionRule.materialSpec')"
                            prop="MaterialSpec">
                            <el-input  type="textarea" v-model="addForm.MaterialSpec" placeholder="" disabled style="width: 100%" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- 使用 Tabs 区分项目组和明细配置 -->
                <el-tabs v-model="dialogActiveTab" class="dialog-tabs">
                    <!-- 项目组 Tab -->
                    <el-tab-pane :label="t('incomingManage.inspectionRule.projectGroups')" name="project">
                        <div class="detail-table-wrapper">
                            <el-button type="primary" size="small" @click="addProjectRow" class="mb-2">{{
                                t('publicText.add')
                            }}项目组</el-button>
                            <el-table :data="addForm.Projects" border size="small" style="width: 100%" height="350">
                                <el-table-column :label="t('incomingManage.inspectionRule.projectCode')"
                                    min-width="200">
                                    <template #default="{ row, $index }">
                                        <el-select v-model="row.ProjectCode" size="small" style="width: 100%" filterable
                                            clearable placeholder=""
                                            @change="(val: any) => handleProjectSelect(row, val)">
                                            <el-option v-for="item in projectList" :key="item.ProjectCode"
                                                :label="`${item.ProjectCode} - ${item.ProjectName}`"
                                                :value="item.ProjectCode">
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column :label="t('incomingManage.inspectionRule.versionNo')" prop="VersionNo"
                                    width="100">
                                    <template #default="{ row }">
                                        <el-input v-model="row.VersionNo" size="small" disabled />
                                    </template>
                                </el-table-column>
                                <el-table-column :label="t('incomingManage.inspectionRule.isDefault')" width="120"
                                    align="center">
                                    <template #default="{ $index, row }">
                                        <el-radio v-model="addForm.defaultProjectIndex" :label="$index"
                                            @change="() => setDefaultProject($index)">默认</el-radio>
                                    </template>
                                </el-table-column>
                                <el-table-column :label="$t('publicText.operation')" width="80" align="center">
                                    <template #default="{ $index }">
                                        <el-button type="danger" size="small" link @click="removeProjectRow($index)">{{
                                            t('publicText.delete') }}</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-tab-pane>

                    <!-- 明细 Tab -->
                    <el-tab-pane :label="t('incomingManage.inspectionRule.details')" name="detail">
                        <div class="detail-table-wrapper">
                            <el-button type="primary" size="small" @click="addDetailRow" class="mb-2">{{
                                t('publicText.add')
                            }}检验项</el-button>
                            <el-table :data="addForm.Details" border size="small" style="width: 100%" height="350">
                                <el-table-column :label="t('incomingManage.testItems.gaugeCode')" width="180">
                                    <template #default="{ row, $index }">
                                        <el-select v-model="row.InspectionCode" size="small" style="width: 100%"
                                            filterable clearable :placeholder="t('incomingManage.testItems.gaugeCode')"
                                            @change="handleInspectionSelect(row, $event)">
                                            <el-option v-for="item in inspectionItemList" :key="item.InspectionCode"
                                                :label="`${item.InspectionCode} - ${item.InspectionName}`"
                                                :value="item.InspectionCode">
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column :label="t('incomingManage.testItems.gaugeName')" min-width="120">
                                    <template #default="{ row }">
                                        <el-input v-model="row.InspectionName" size="small" disabled />
                                    </template>
                                </el-table-column>
                                <el-table-column :label="t('incomingManage.testItems.IsInspectionTool')" width="100">
                                    <template #default="{ row }">
                                        <span>{{ row.IsInspectionTool === 1 ? t('publicText.yes') : t('publicText.no')
                                        }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column :label="t('incomingManage.testItems.inspectionType')" width="140">
                                    <template #default="{ row }">
                                        <el-select v-model="row.InspectionType" size="small" style="width: 100%"
                                            @change="handleInspectionTypeChange(row)">
                                            <el-option :label="t('incomingManage.testItems.qualitative')" :value="1" />
                                            <el-option :label="t('incomingManage.testItems.quantitative')" :value="2" />
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column :label="t('incomingManage.inspectionRule.lowerLimit')" width="120">
                                    <template #default="{ row }">
                                        <el-input-number v-model="row.LowerLimit" size="small" :controls="false"
                                            style="width: 100%" :disabled="row.InspectionType === 1"
                                            :placeholder="t('incomingManage.inspectionRule.lowerLimitPlaceholder')" />
                                    </template>
                                </el-table-column>
                                <el-table-column :label="t('incomingManage.inspectionRule.upperLimit')" width="120">
                                    <template #default="{ row }">
                                        <el-input-number v-model="row.UpperLimit" size="small" :controls="false"
                                            style="width: 100%" :disabled="row.InspectionType === 1"
                                            :placeholder="t('incomingManage.inspectionRule.upperLimitPlaceholder')" />
                                    </template>
                                </el-table-column>

                                <el-table-column :label="t('incomingManage.inspectionRule.unit')" width="100">
                                    <template #default="{ row }">
                                        <el-input v-model="row.Unit" size="small" :disabled="row.InspectionType === 1"
                                            :placeholder="t('incomingManage.inspectionRule.unitPlaceholder')" />
                                    </template>
                                </el-table-column>
                                <el-table-column :label="$t('publicText.operation')" width="80" align="center">
                                    <template #default="{ $index }">
                                        <el-button type="danger" size="small" link @click="removeDetailRow($index)">{{
                                            t('publicText.delete') }}</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="tips">{{ t('incomingManage.inspectionRule.detailTips') }}</div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
            <template #footer>
                <el-button @click="addCancel">{{ $t("publicText.cancel") }}</el-button>
                <el-button type="primary" @click="addSubmit">{{ $t("publicText.confirm") }}</el-button>
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
    UpdateInspectionRule
} from "@/api/incomingManage/index";
import { calculateColumnsWidth } from "@/utils/tableminWidth";
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
import { useUserStoreWithOut } from "@/stores/modules/user";
import { useI18n } from "vue-i18n";

const userStore = useUserStoreWithOut();
const { t } = useI18n();

// 表格高度自适应
const tableHeight = ref(0);
const tableHeight2 = ref(0);

// 主表数据
const tableData = ref<any[]>([]);
const total = ref(0);
const getForm = reactive({
    PageIndex: 1,
    PageSize: 50,
    MaterialCode: "",
});

// 右侧标签页
const activeName = ref("detail"); // 'detail' 或 'projects'
// 子表数据（明细）
const detailData = ref<any[]>([]);
// 项目组数据
const projectGroupData = ref<any[]>([]);
const currentRuleId = ref<number | null>(null);

// 新增/编辑对话框相关
const addVisible = ref(false);
const addFormRef = ref();
const isEditMode = ref(false);
const dialogActiveTab = ref("project"); // 对话框内当前激活的 Tab，新增时默认项目组，编辑时根据数据决定
const addForm = reactive({
    ruleId: 0,
    MaterialCode: "",
    MaterialName: "",
    MaterialSpec: '',
    IsDouble: 0,
    Projects: [] as any[],   // 项目组列表
    Details: [] as any[],    // 明细列表
    defaultProjectIndex: -1,
});
const addRules = {
    MaterialCode: [{ required: true, message: "请选择物料编码", trigger: "change" }],
};

// 物料搜索相关
const materialList = ref<any[]>([]);
const materialLoading = ref(false);
// 检验项列表（检具）
const inspectionItemList = ref<any[]>([]);
// 检验项目组列表（用于下拉选择）
const projectList = ref<any[]>([]);

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

// 搜索物料（远程）
const searchMaterial = (keyword: string) => {
    if (!keyword) {
        materialList.value = [];
        return;
    }
    materialLoading.value = true;
    QueryPartNumbersIqc({ keyword })
        .then((res: any) => {
            if (res.Success && res.Data) {
                materialList.value = res.Data.map((item: any) => ({
                    MaterialCode: item.PN || item.MaterialCode,
                    MaterialName: item.name || item.MaterialName,
                    MaterialSpec: item.Spec || item.MaterialSpec || "",
                }));
            } else {
                materialList.value = [];
            }
        })
        .catch(() => {
            materialList.value = [];
        })
        .finally(() => {
            materialLoading.value = false;
        });
};

// 物料选中后自动填充物料名称
const handleMaterialSelect = (selectedCode: string) => {
    if (!selectedCode) {
        addForm.MaterialName = "";
        addForm.MaterialSpec = "";
        return;
    }
    const selected = materialList.value.find(item => item.MaterialCode === selectedCode);
    if (selected) {
        addForm.MaterialName = selected.MaterialName;
        addForm.MaterialSpec = selected.MaterialSpec;
    } else {
        addForm.MaterialName = "";
        addForm.MaterialSpec = "";
    }
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

// ==================== 新增/编辑对话框操作 ====================
const openAdd = () => {
    isEditMode.value = false;
    addForm.ruleId = 0;
    addForm.MaterialCode = "";
    addForm.MaterialName = "";
    addForm.IsDouble = 0;
    addForm.Projects = [];
    addForm.Details = [];
    addForm.defaultProjectIndex = -1;
    // 新增时默认激活项目组 Tab，并添加一行空项目组
    dialogActiveTab.value = "project";
    addProjectRow(); // 添加一个空项目组行
    getInspectionItems();
    getProjectList();
    addVisible.value = true;
};

// 打开编辑对话框
const openEdit = async (row: any) => {
    isEditMode.value = true;
    addForm.ruleId = row.RuleId;
    addForm.MaterialCode = row.MaterialCode;
    addForm.MaterialName = row.MaterialName;
    addForm.MaterialSpec = row.MaterialSpec;
    addForm.IsDouble = row.IsDouble;

    // 并行加载明细和项目组
    try {
        const [detailRes, projectRes] = await Promise.all([
            QueryInspectionRuleDetail({ RuleId: row.RuleId }),
            QueryInspectionRuleProject({ RuleId: row.RuleId })
        ]);
        const details = (detailRes as any).Success ? ((detailRes as any).Data ?? []) : [];
        const projects = (projectRes as any).Success ? ((projectRes as any).Data ?? []) : [];

        if (projects.length > 0) {
            // 项目组模式
            addForm.Projects = projects.map((p: any) => ({
                ProjectCode: p.ProjectCode,
                VersionNo: p.VersionNo,
                IsDefault: p.IsDefault,
            }));
            const defaultIdx = addForm.Projects.findIndex((p: any) => p.IsDefault === 1);
            addForm.defaultProjectIndex = defaultIdx !== -1 ? defaultIdx : 0;
            updateProjectsDefaultFlag();
            addForm.Details = [];
            dialogActiveTab.value = "project";
        } else if (details.length > 0) {
            // 明细模式
            addForm.Details = details.map((item: any) => ({
                InspectionCode: item.InspectionCode,
                InspectionName: item.InspectionName,
                IsInspectionTool: item.IsInspectionTool,
                InspectionType: item.InspectionType,
                UpperLimit: item.UpperLimit,
                LowerLimit: item.LowerLimit,
                Unit: item.Unit || "",
            }));
            if (addForm.Details.length === 0) {
                addDetailRow();
            }
            addForm.Projects = [];
            addForm.defaultProjectIndex = -1;
            dialogActiveTab.value = "detail";
        } else {
            // 既无项目组也无明细，默认展示项目组并给一行空行
            addForm.Projects = [];
            addForm.Details = [];
            addProjectRow();
            dialogActiveTab.value = "project";
        }
    } catch (error) {
        ElMessage.error("加载规则详情失败");
        addForm.Projects = [];
        addForm.Details = [];
        addProjectRow();
        dialogActiveTab.value = "project";
    }
    getInspectionItems();
    getProjectList();
    addVisible.value = true;
};

// 项目组相关操作
const addProjectRow = () => {
    addForm.Projects.push({
        ProjectCode: "",
        VersionNo: "",
        IsDefault: 0,
    });
    // 如果只有一个项目组且没有默认项，设为默认
    if (addForm.Projects.length === 1 && addForm.defaultProjectIndex === -1) {
        addForm.defaultProjectIndex = 0;
        updateProjectsDefaultFlag();
    }
};
const removeProjectRow = (index: number) => {
    if (addForm.Projects.length <= 1) {
        ElMessage.warning("至少保留一个项目组");
        return;
    }
    if (addForm.defaultProjectIndex === index) {
        addForm.defaultProjectIndex = -1;
    } else if (addForm.defaultProjectIndex > index) {
        addForm.defaultProjectIndex--;
    }
    addForm.Projects.splice(index, 1);
    updateProjectsDefaultFlag();
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
const setDefaultProject = (index: number) => {
    addForm.defaultProjectIndex = index;
    updateProjectsDefaultFlag();
};
const updateProjectsDefaultFlag = () => {
    addForm.Projects.forEach((proj: any, idx: number) => {
        proj.IsDefault = idx === addForm.defaultProjectIndex ? 1 : 0;
    });
};

// 明细相关操作
const addDetailRow = () => {
    addForm.Details.push({
        InspectionCode: "",
        InspectionName: "",
        IsInspectionTool: 1,
        InspectionType: 1,
        UpperLimit: null,
        LowerLimit: null,
        Unit: "",
    });
};
const removeDetailRow = (index: number) => {
    if (addForm.Details.length <= 1) {
        ElMessage.warning("至少保留一个检验项");
        return;
    }
    addForm.Details.splice(index, 1);
};
const addCancel = () => {
    addVisible.value = false;
    addFormRef.value?.resetFields();
    isEditMode.value = false;
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

// 提交新增/编辑
const addSubmit = () => {
    addFormRef.value.validate((valid: boolean) => {
        if (!valid) return;

        // 根据哪个 Tab 有数据决定提交哪种模式
        const hasProjects = addForm.Projects.some(p => p.ProjectCode && p.ProjectCode.trim() !== "");
        const hasDetails = addForm.Details.some(d => d.InspectionCode && d.InspectionCode.trim() !== "");

        let projectsParams: any[] = [];
        let detailsParams: any[] = [];

        if (hasProjects) {
            // 项目组模式：校验项目组数据
            if (addForm.Projects.length === 0) {
                ElMessage.warning("请至少添加一个检验项目组");
                return;
            }
            const defaultCount = addForm.Projects.filter((p: any) => p.IsDefault === 1).length;
            if (defaultCount !== 1) {
                ElMessage.warning("请设置且仅设置一个默认项目组");
                return;
            }
            const invalidProject = addForm.Projects.some((p: any) => !p.ProjectCode);
            if (invalidProject) {
                ElMessage.warning("请完整填写项目组编码");
                return;
            }
            projectsParams = addForm.Projects.map((proj: any) => ({
                ProjectCode: proj.ProjectCode,
                VersionNo: proj.VersionNo,
                IsDefault: proj.IsDefault,
            }));
            // detailsParams = [];
        } else if (hasDetails) {
            // 明细模式：校验明细数据
            if (addForm.Details.length === 0) {
                ElMessage.warning("请至少添加一个检验项");
                return;
            }
            for (let i = 0; i < addForm.Details.length; i++) {
                const item = addForm.Details[i];
                if (!item.InspectionCode || !item.InspectionName) {
                    ElMessage.warning(`第${i + 1}行检验项编码和名称不能为空`);
                    return;
                }
                if (item.InspectionType === 2) {
                    if (item.UpperLimit === null || item.UpperLimit === undefined || item.UpperLimit === "") {
                        ElMessage.warning(`第${i + 1}行定量检验必须填写上限`);
                        return;
                    }
                    if (item.LowerLimit === null || item.LowerLimit === undefined || item.LowerLimit === "") {
                        ElMessage.warning(`第${i + 1}行定量检验必须填写下限`);
                        return;
                    }
                    if (!item.Unit || item.Unit.trim() === "") {
                        ElMessage.warning(`第${i + 1}行定量检验必须填写单位`);
                        return;
                    }
                    if (Number(item.UpperLimit) <= Number(item.LowerLimit)) {
                        ElMessage.warning(`第${i + 1}行上限必须大于下限`);
                        return;
                    }
                }
            }
            detailsParams = addForm.Details.map((item: any) => {
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
            // projectsParams = [];
        } else {
            ElMessage.warning("请至少配置项目组或检验明细");
            return;
        }

        const params: any = {
            MaterialCode: addForm.MaterialCode,
            MaterialName: addForm.MaterialName,
            MaterialSpec: addForm.MaterialSpec,
            IsDouble: addForm.IsDouble,
            UpdateUser: userStore.getUserInfo || "admin",
            Details: detailsParams,
            Projects: projectsParams,
        };

        if (isEditMode.value) {

            params.RuleId = addForm.ruleId;
            UpdateInspectionRule(params).then((res: any) => {
                if (res.Success) {
                    ElMessage.success(res.Message || "更新成功");
                    addVisible.value = false;
                    getData();
                    if (currentRuleId.value === addForm.ruleId) {
                        handleRowClick({ RuleId: addForm.ruleId });
                    }
                } else {
                    ElMessage.error(res.Message || "更新失败");
                }
            }).catch(() => {
                ElMessage.error("更新失败");
            });
        } else {
            const ruleParams = {
                MaterialCode: addForm.MaterialCode,
                MaterialName: addForm.MaterialName,
                MaterialSpec: addForm.MaterialSpec,
                IsDouble: addForm.IsDouble,
                CreateUser: userStore.getUserInfo || "admin",
            };
            AddInspectionRule({
                Rule: ruleParams,
                Projects: projectsParams,
                Details: detailsParams,
            }).then((res: any) => {
                if (res.Success) {
                    ElMessage.success(res.Message || "新增成功");
                    addVisible.value = false;
                    getData();
                } else {
                    ElMessage.error(res.Message || "新增失败");
                }
            }).catch(() => {
                ElMessage.error("新增失败");
            });
        }
    });
};

// ==================== 列宽自适应 ====================
const columnWidths1 = computed(() => {
    const columns = [
        { label: t("incomingManage.inspectionRule.materialCode"), prop: "MaterialCode" },
        { label: t("incomingManage.inspectionRule.materialName"), prop: "MaterialName" },
        { label: t("incomingManage.inspectionRule.isDouble"), prop: "IsDouble" },
        { label: t("incomingManage.testItems.creator"), prop: "CreateUser" },
        { label: t("incomingManage.testItems.creatime"), prop: "CreateTime" },
        { label: t("incomingManage.testItems.updator"), prop: "UpdateUser" },
        { label: t("incomingManage.testItems.updatetime"), prop: "UpdateTime" },
    ];
    return calculateColumnsWidth(columns, tableData.value, { padding: 25, fontSize: 13 });
});
const getColumnWidth1 = (prop: string) => columnWidths1.value[prop] || "auto";

const columnWidths2 = computed(() => {
    const columns = [
        { label: t("incomingManage.testItems.gaugeCode"), prop: "InspectionCode" },
        { label: t("incomingManage.testItems.gaugeName"), prop: "InspectionName" },
        { label: t("incomingManage.testItems.IsInspectionTool"), prop: "IsInspectionTool" },
        { label: t("incomingManage.testItems.inspectionType"), prop: "InspectionType" },
        { label: t("incomingManage.inspectionRule.upperLimit"), prop: "UpperLimit" },
        { label: t("incomingManage.inspectionRule.lowerLimit"), prop: "LowerLimit" },
        { label: t("incomingManage.inspectionRule.unit"), prop: "Unit" },
        { label: t("incomingManage.testItems.creator"), prop: "CreateUser" },
        { label: t("incomingManage.testItems.creatime"), prop: "CreateTime" },
    ];
    return calculateColumnsWidth(columns, detailData.value, { padding: 25, fontSize: 13 });
});
const getColumnWidth2 = (prop: string) => columnWidths2.value[prop] || "auto";

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
</style>