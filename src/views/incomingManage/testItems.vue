<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between">
                <el-form ref="formRef" :model="getForm" label-width="auto" :inline="true" :size="'small'"
                    @submit.native.prevent>
                    <el-form-item :label="t('incomingManage.testItems.projectCode')" prop="projectCode" class="mb-2">
                        <el-input v-model="getForm.ProjectCode"
                            :placeholder="t('incomingManage.testItems.projectCodePlaceholder')" clearable
                            @clear="searchData" @keyup.enter.native="searchData" style="width: 200px" />
                    </el-form-item>
                    <el-form-item :label="t('incomingManage.testItems.projectName')" prop="projectName" class="mb-2">
                        <el-input v-model="getForm.ProjectName"
                            :placeholder="t('incomingManage.testItems.projectNamePlaceholder')" clearable
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
                <!-- 左侧：检验项目主表列表 -->
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
                        <el-table-column :label="t('incomingManage.testItems.projectCode')" prop="ProjectCode"
                            :min-width="getColumnWidth1('ProjectCode')"  fixed/>
                        <el-table-column :label="t('incomingManage.testItems.projectName')" prop="ProjectName"
                            :min-width="getColumnWidth1('ProjectName')"  />
                        <el-table-column :label="t('incomingManage.testItems.VersionNo')" prop="VersionNo"
                            :min-width="getColumnWidth1('VersionNo')" />
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
                <!-- 右侧：选中项目的子表明细 -->
                <el-col :span="15">
                    <div class="detail-header">
                        <span class="detail-title">{{ t('incomingManage.testItems.detailTitle') }}</span>
                        <span v-if="currentProjectCode" class="detail-project-code">{{ currentProjectCode }}</span>
                    </div>
                    <el-table :data="detailData" size="small" :style="{ width: '100%' }" :height="tableHeight2"
                        :tooltip-effect="'dark'" border fit>
                        <el-table-column type="index" align="center" :label="$t('publicText.index')" width="50" />
                        <el-table-column :label="t('incomingManage.testItems.gaugeCode')" prop="InspectionCode"
                            :min-width="getColumnWidth2('InspectionCode')" />
                        <el-table-column :label="t('incomingManage.testItems.gaugeName')" prop="InspectionName"
                            :min-width="getColumnWidth2('InspectionName')" />
                        <el-table-column :label="t('incomingManage.testItems.IsInspectionTool')" prop="IsInspectionTool"
                            width="100">
                            <template #default="{ row }">
                                <span>{{ row.IsInspectionTool === 1 ? t('publicText.yes') : t('publicText.no') }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="t('incomingManage.testItems.inspectionType')" prop="InspectionType"
                            :min-width="getColumnWidth2('InspectionType')">
                            <template #default="{ row }">
                                <span>{{ row.InspectionType === 1 ? t('incomingManage.testItems.qualitative') :
                                    t('incomingManage.testItems.quantitative') }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="t('incomingManage.testItems.lowerLimit')" prop="LowerLimit"
                            :min-width="getColumnWidth2('LowerLimit')" />
                        <el-table-column :label="t('incomingManage.testItems.upperLimit')" prop="UpperLimit"
                            :min-width="getColumnWidth2('UpperLimit')" />

                        <el-table-column :label="t('incomingManage.testItems.unit')" prop="Unit"
                            :min-width="getColumnWidth2('Unit')" />
                        <el-table-column :label="t('incomingManage.testItems.creator')" prop="CreateUser"
                            :min-width="getColumnWidth2('CreateUser')" />
                        <el-table-column :label="t('incomingManage.testItems.creatime')" prop="CreateTime"
                            :min-width="getColumnWidth2('CreateTime')" />
                        <template #empty>
                            <div class="flex items-center justify-center h-100%">
                                <el-empty :description="t('incomingManage.testItems.noDetail')" />
                            </div>
                        </template>
                    </el-table>
                </el-col>
            </el-row>
        </el-card>

        <!-- 新增/编辑检验项目对话框（复用） -->
        <el-dialog :title="isEditMode ? $t('publicText.edit') : $t('publicText.add')" v-model="addVisible" width="80%"
            @close="addCancel" align-center :append-to-body="true" :close-on-click-modal="false"
            :close-on-press-escape="false">
            <el-form :model="addForm" ref="addFormRef" label-width="auto" :inline="false" :rules="addRules">
                <el-form-item :label="t('incomingManage.testItems.projectCode')" prop="ProjectCode">
                    <el-input v-model="addForm.ProjectCode" :disabled="isEditMode"
                        :placeholder="t('incomingManage.testItems.projectCodePlaceholder')" clearable
                        style="width: 100%" />
                </el-form-item>
                <el-form-item :label="t('incomingManage.testItems.projectName')" prop="ProjectName">
                    <el-input v-model="addForm.ProjectName"
                        :placeholder="t('incomingManage.testItems.projectNamePlaceholder')" clearable
                        style="width: 100%" />
                </el-form-item>
                <!-- 版本号隐藏域，仅编辑时使用 -->
                <el-form-item v-if="isEditMode" prop="VersionNo" style="display: none;">
                    <el-input v-model="addForm.VersionNo" />
                </el-form-item>
                <el-form-item :label="t('incomingManage.testItems.details')" prop="Details" required>
                    <div class="detail-table-wrapper">
                        <el-button type="primary" size="small" @click="addDetailRow" class="mb-2">{{
                            t('publicText.add') }}检验项</el-button>
                        <el-table :data="addForm.Details" border size="small" style="width: 100%" height="400">
                            <el-table-column :label="t('incomingManage.testItems.gaugeName')" >
                                <template #default="{ row, $index }">
                                    <el-select v-model="row.InspectionCode" size="small" style="width: 100%" filterable
                                        clearable placeholder="请选择检验项" @change="handleInspectionSelect(row, $event)">
                                        <el-option v-for="item in inspectionItemList" :key="item.InspectionCode"
                                            :label="` ${item.InspectionName}`" :value="item.InspectionCode">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column :label="t('incomingManage.testItems.gaugeCode')" prop="InspectionCode"
                                width="150" />
                            <!-- <el-table-column :label="t('incomingManage.testItems.IsInspectionTool')" width="100"
                                prop="IsInspectionTool">
                                <template #default="{ row, $index }">
                                    {{ row.IsInspectionTool === 1 ? t('publicText.yes') : t('publicText.no') }}
                                </template>
                            </el-table-column> -->
                            <el-table-column :label="t('incomingManage.testItems.inspectionType')" width="140">
                                <template #default="{ row }">
                                    <el-select v-model="row.InspectionType" size="small" style="width: 100%"
                                        @change="handleInspectionTypeChange(row)">
                                        <el-option :label="t('incomingManage.testItems.qualitative')" :value="1" />
                                        <el-option :label="t('incomingManage.testItems.quantitative')" :value="2" />
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column :label="t('incomingManage.testItems.lowerLimit')" width="120">
                                <template #default="{ row }">
                                    <el-input-number v-model="row.LowerLimit" size="small" style="width: 100%"
                                        :disabled="row.InspectionType === 1" :controls="false" :precision="2"
                                        placeholder="下限" />
                                </template>
                            </el-table-column>
                            <el-table-column :label="t('incomingManage.testItems.upperLimit')" width="120">
                                <template #default="{ row }">
                                    <el-input-number v-model="row.UpperLimit" size="small" style="width: 100%"
                                        :disabled="row.InspectionType === 1" :controls="false" :precision="2"
                                        placeholder="上限" />
                                </template>
                            </el-table-column>
                            <el-table-column :label="t('incomingManage.testItems.unit')" width="100">
                                <template #default="{ row }">
                                    <el-input v-model="row.Unit" size="small" :disabled="row.InspectionType === 1"
                                        placeholder="单位" />
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('publicText.operation')" width="80" align="center">
                                <template #default="{ $index }">
                                    <el-button type="danger" size="small" link @click="removeDetailRow($index)">{{
                                        t('publicText.delete') }}</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="tips">{{ t('incomingManage.testItems.detailTips') }}</div>
                    </div>
                </el-form-item>
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
    RefreshInspectionProject,
    QueryInspectionProjectDetail,
    AddInspectionProject,
    DeleteInspectionProject,
    UpdateInspectionProject
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
    ProjectCode: "",
    ProjectName: "",
});

// 子表数据
const detailData = ref<any[]>([]);
const currentProjectCode = ref<string>("");

// 新增/编辑对话框
const addVisible = ref(false);
const addFormRef = ref();
const isEditMode = ref(false); // 是否为编辑模式
const addForm = reactive({
    ProjectCode: "",
    ProjectName: "",
    VersionNo: 0,           // 版本号，编辑时使用
    Details: [] as any[],
});
const addRules = {
    ProjectCode: [{ required: true, message: "请输入项目编码", trigger: "blur" }],
    ProjectName: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
};
const inspectionItemList = ref<any[]>([]);

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

// 获取主表数据
const getData = () => {
    RefreshInspectionProject({
        PageIndex: getForm.PageIndex,
        PageSize: getForm.PageSize,
        ProjectCode: getForm.ProjectCode || undefined,
        ProjectName: getForm.ProjectName || undefined,
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

// 点击行加载子表明细
const handleRowClick = (row: any) => {
    currentProjectCode.value = row.ProjectCode;
    QueryInspectionProjectDetail({ ProjectCode: row.ProjectCode }).then((res: any) => {
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
};

// 删除主表（同时删除子表）
const handleDelete = (row: any) => {
    ElMessageBox.confirm(`${t('publicText.confirm')}${t("publicText.delete")}【${row.ProjectCode}】?`, t("publicText.confirm"), {
        confirmButtonText: t("publicText.confirm"),
        cancelButtonText: t("publicText.cancel"),
        type: "warning",
    })
        .then(() => {
            DeleteInspectionProject({ projectCode: row.ProjectCode }).then((res: any) => {
                if (res.Success) {
                    ElMessage.success(res.Message || "删除成功");
                    // 如果删除的是当前选中的项目，清空子表
                    if (currentProjectCode.value === row.ProjectCode) {
                        currentProjectCode.value = "";
                        detailData.value = [];
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

// 打开新增对话框
const openAdd = () => {
    isEditMode.value = false;
    addForm.ProjectCode = "";
    addForm.ProjectName = "";
    addForm.VersionNo = 0;
    addForm.Details = [
        {
            InspectionCode: "",
            InspectionName: "",
            IsInspectionTool: 1,
            InspectionType: 1,
            UpperLimit: null,
            LowerLimit: null,
            Unit: ""
        }
    ];
    if (inspectionItemList.value.length === 0) {
        getInspectionItems();
    }
    addVisible.value = true;
};

// 打开编辑对话框
const openEdit = async (row: any) => {
    isEditMode.value = true;
    addForm.ProjectCode = row.ProjectCode;
    addForm.ProjectName = row.ProjectName;
    addForm.VersionNo = row.VersionNo || 0;

    // 加载明细数据
    try {
        const res: any = await QueryInspectionProjectDetail({ ProjectCode: row.ProjectCode });
        if (res.Success) {
            const details = res.Data || [];
            // 转换后端字段格式到前端表单格式（字段名一致，直接使用）
            addForm.Details = details.map((item: any) => ({
                InspectionCode: item.InspectionCode,
                InspectionName: item.InspectionName,
                IsInspectionTool: item.IsInspectionTool,
                InspectionType: item.InspectionType,
                UpperLimit: item.UpperLimit,
                LowerLimit: item.LowerLimit,
                Unit: item.Unit || ""
            }));
            // 如果明细为空，至少保留一行空行
            if (addForm.Details.length === 0) {
                addForm.Details = [{
                    InspectionCode: "",
                    InspectionName: "",
                    IsInspectionTool: 1,
                    InspectionType: 1,
                    UpperLimit: null,
                    LowerLimit: null,
                    Unit: ""
                }];
            }
        } else {
            ElMessage.error(res.Message || "加载明细失败");
            addForm.Details = [{
                InspectionCode: "",
                InspectionName: "",
                IsInspectionTool: 1,
                InspectionType: 1,
                UpperLimit: null,
                LowerLimit: null,
                Unit: ""
            }];
        }
    } catch {
        ElMessage.error("加载明细失败");
        addForm.Details = [{
            InspectionCode: "",
            InspectionName: "",
            IsInspectionTool: 1,
            InspectionType: 1,
            UpperLimit: null,
            LowerLimit: null,
            Unit: ""
        }];
    }
    addVisible.value = true;
};

const addDetailRow = () => {
    addForm.Details.push({
        InspectionCode: "",
        InspectionName: "",
        IsInspectionTool: 1,
        InspectionType: 1,
        UpperLimit: null,
        LowerLimit: null,
        Unit: ""
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
    // 重置编辑模式标志
    isEditMode.value = false;
};

// 下拉框选中后自动填充检验项名称和是否量具标记
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

// 检验类型变更处理：定性时清空上下限和单位
const handleInspectionTypeChange = (row: any) => {
    if (row.InspectionType === 1) {
        row.UpperLimit = null;
        row.LowerLimit = null;
        row.Unit = "";
    }
};

const addSubmit = () => {
    addFormRef.value.validate(async (valid: boolean) => {
        if (!valid) return;

        // 校验明细至少有一行且编码名称不能为空
        for (let i = 0; i < addForm.Details.length; i++) {
            const item = addForm.Details[i];
            if (!item.InspectionCode || !item.InspectionName) {
                ElMessage.warning(`第${i + 1}行检验项编码和名称不能为空`);
                return;
            }
            // 定量检验校验
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

        // 构建明细参数，定性检验清空上下限单位
        const detailsParams = addForm.Details.map((item: any) => {
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

        if (isEditMode.value) {
            // 编辑模式：调用更新接口
            const params = {
                ProjectCode: addForm.ProjectCode,
                VersionNo: addForm.VersionNo,
                ProjectName: addForm.ProjectName,
                UpdateUser: userStore.getUserInfo || "admin",
                Details: detailsParams,
            };
            try {
                const res: any = await UpdateInspectionProject(params);
                if (res.Success) {
                    ElMessage.success(res.Message || "更新成功");
                    addVisible.value = false;
                    getData(); // 刷新主表
                    // 如果编辑的是当前选中的项目，重新加载明细
                    if (currentProjectCode.value === addForm.ProjectCode) {
                        handleRowClick({ ProjectCode: addForm.ProjectCode });
                    }
                } else {
                    ElMessage.error(res.Message || "更新失败");
                }
            } catch {
                ElMessage.error("更新失败");
            }
        } else {
            // 新增模式
            const params = {
                Project: {
                    ProjectCode: addForm.ProjectCode,
                    ProjectName: addForm.ProjectName,
                    CreateUser: userStore.getUserInfo || "admin",
                },
                Details: detailsParams,
            };
            try {
                const res: any = await AddInspectionProject(params);
                if (res.Success) {
                    ElMessage.success(res.Message || "新增成功");
                    addVisible.value = false;
                    getData();
                    // 如果新增的项目编码与当前选中的相同，重新加载明细
                    if (currentProjectCode.value === addForm.ProjectCode) {
                        handleRowClick({ ProjectCode: addForm.ProjectCode });
                    }
                } else {
                    ElMessage.error(res.Message || "新增失败");
                }
            } catch {
                ElMessage.error("新增失败");
            }
        }
    });
};

// 列宽自适应（主表）
const columnWidths1 = computed(() => {
    const columns = [
        { label: t("incomingManage.testItems.projectCode"), prop: "ProjectCode" },
        { label: t("incomingManage.testItems.projectName"), prop: "ProjectName" },
        { label: t("incomingManage.testItems.VersionNo"), prop: "VersionNo" },
        { label: t("incomingManage.testItems.creator"), prop: "CreateUser" },
        { label: t("incomingManage.testItems.creatime"), prop: "CreateTime" },
        { label: t("incomingManage.testItems.updator"), prop: "UpdateUser" },
        { label: t("incomingManage.testItems.updatetime"), prop: "UpdateTime" },
    ];
    return calculateColumnsWidth(columns, tableData.value, { padding: 25, fontSize: 13 });
});
const getColumnWidth1 = (prop: string) => columnWidths1.value[prop] || "auto";

// 列宽自适应（子表）
const columnWidths2 = computed(() => {
    const columns = [
        { label: t("incomingManage.testItems.gaugeCode"), prop: "InspectionCode" },
        { label: t("incomingManage.testItems.gaugeName"), prop: "InspectionName" },
        { label: t("incomingManage.testItems.isGauge"), prop: "IsInspectionTool" },
        { label: t("incomingManage.testItems.inspectionType"), prop: "InspectionType" },
        { label: t("incomingManage.testItems.upperLimit"), prop: "UpperLimit" },
        { label: t("incomingManage.testItems.lowerLimit"), prop: "LowerLimit" },
        { label: t("incomingManage.testItems.unit"), prop: "Unit" },
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
        tableHeight2.value = window.innerHeight - 190;
    });
};

onBeforeMount(() => {
    getScreenHeight();
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    getData();
    getInspectionItems();
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

.detail-project-code {
    margin-left: 12px;
    font-size: 14px;
    color: #409eff;
    font-weight: normal;
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
</style>