<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between">
                <el-form ref="formRef" :model="getForm" label-width="auto" :inline="true" :size="'small'"
                    @submit.native.prevent>
                    <el-form-item :label="t('incomingManage.inspectionRule.materialCode')" prop="materialCode" class="mb-2">
                        <el-input v-model="getForm.MaterialCode" :placeholder="t('incomingManage.inspectionRule.materialCodePlaceholder')" clearable @clear="searchData"
                            @keyup.enter.native="searchData" style="width: 200px" />
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
                <el-col :span="12">
                    <el-table :data="tableData" size="small" :style="{ width: '100%' }" :height="tableHeight"
                        :tooltip-effect="'dark'" border fit @row-click="handleRowClick"
                        highlight-current-row>
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
                        <el-table-column :label="t('incomingManage.inspectionRule.projectName')" prop="ProjectName"
                            :min-width="getColumnWidth1('ProjectName')" />
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
                        <el-table-column :label="t('incomingManage.testItems.updator')" prop="UpdateUser"
                            :min-width="getColumnWidth1('UpdateUser')" />
                        <el-table-column :label="t('incomingManage.testItems.updatetime')" prop="UpdateTime"
                            :min-width="getColumnWidth1('UpdateTime')" />
                        <el-table-column :label="$t('publicText.operation')" :fixed="'right'" width="120" :align="'center'">
                            <template #default="{ row }">
                                <el-tooltip :content="$t('publicText.delete')" placement="top">
                                    <el-button size="small" type="danger" icon="Delete" @click.stop="handleDelete(row)"></el-button>
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
                <!-- 右侧：选中规则的子表明细 -->
                <el-col :span="12">
                    <div class="detail-header">
                        <span class="detail-title">{{ t('incomingManage.inspectionRule.detailTitle') }}</span>
                        <span v-if="currentRuleId" class="detail-rule-id">{{ t('incomingManage.inspectionRule.ruleId') }}: {{ currentRuleId }}</span>
                    </div>
                    <el-table :data="detailData" size="small" :style="{ width: '100%' }" :height="tableHeight2"
                        :tooltip-effect="'dark'" border fit>
                        <el-table-column type="index" align="center" :label="$t('publicText.index')" width="50" />
                        <el-table-column :label="t('incomingManage.inspectionItem.gaugeCode')" prop="InspectionCode"
                            :min-width="getColumnWidth2('InspectionCode')" />
                        <el-table-column :label="t('incomingManage.inspectionItem.gaugeName')" prop="InspectionName"
                            :min-width="getColumnWidth2('InspectionName')" />
                        <el-table-column :label="t('incomingManage.inspectionItem.isGauge')" prop="IsInspectionTool"
                            :min-width="getColumnWidth2('IsInspectionTool')">
                            <template #default="{ row }">
                                <span>{{ row.IsInspectionTool === 1 ? t('publicText.yes') : t('publicText.no') }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="t('incomingManage.inspectionRule.upperLimit')" prop="UpperLimit"
                            :min-width="getColumnWidth2('UpperLimit')" />
                        <el-table-column :label="t('incomingManage.inspectionRule.lowerLimit')" prop="LowerLimit"
                            :min-width="getColumnWidth2('LowerLimit')" />
                        <el-table-column :label="t('incomingManage.inspectionRule.unit')" prop="Unit"
                            :min-width="getColumnWidth2('Unit')" />
                        <el-table-column :label="t('incomingManage.inspectionItem.creator')" prop="CreateUser"
                            :min-width="getColumnWidth2('CreateUser')" />
                        <el-table-column :label="t('incomingManage.inspectionItem.creatime')" prop="CreateTime"
                            :min-width="getColumnWidth2('CreateTime')" />
                        <template #empty>
                            <div class="flex items-center justify-center h-100%">
                                <el-empty :description="t('incomingManage.inspectionRule.noDetail')" />
                            </div>
                        </template>
                    </el-table>
                </el-col>
            </el-row>
        </el-card>

        <!-- 新增检验规则对话框 -->
        <el-dialog :title="$t('publicText.add')" v-model="addVisible" width="900px" @close="addCancel" align-center :append-to-body="true" :close-on-click-modal="false"
            :close-on-press-escape="false">
            <el-form :model="addForm" ref="addFormRef" label-width="auto" :inline="false" :rules="addRules">
                <el-form-item :label="t('incomingManage.inspectionRule.materialCode')" prop="MaterialCode" required>
                    <el-select v-model="addForm.MaterialCode" size="small" style="width: 100%" filterable remote
                        :remote-method="searchMaterial" :loading="materialLoading" clearable
                        :placeholder="t('incomingManage.inspectionRule.materialCodePlaceholder')"
                        @change="handleMaterialSelect">
                        <el-option
                            v-for="item in materialList"
                            :key="item.MaterialCode"
                            :label="`${item.MaterialCode} - ${item.MaterialName}`"
                            :value="item.MaterialCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="t('incomingManage.inspectionRule.materialName')" prop="MaterialName">
                    <el-input v-model="addForm.MaterialName" :placeholder="t('incomingManage.inspectionRule.materialNamePlaceholder')" disabled style="width: 100%" />
                </el-form-item>
                <el-form-item :label="t('incomingManage.inspectionRule.projectName')" prop="ProjectName">
                    <el-input v-model="addForm.ProjectName" :placeholder="t('incomingManage.inspectionRule.projectNamePlaceholder')" clearable style="width: 100%" />
                </el-form-item>
                <el-form-item :label="t('incomingManage.inspectionRule.isDouble')" prop="IsDouble">
                    <el-select v-model="addForm.IsDouble" style="width: 100%">
                        <el-option :label="t('publicText.yes')" :value="1"></el-option>
                        <el-option :label="t('publicText.no')" :value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="t('incomingManage.inspectionRule.details')" prop="Details" required>
                    <div class="detail-table-wrapper">
                        <el-button type="primary" size="small" @click="addDetailRow" class="mb-2">{{ t('publicText.add') }}检验项</el-button>
                        <el-table :data="addForm.Details" border size="small" style="width: 100%" height="350">
                            <el-table-column :label="t('incomingManage.inspectionItem.gaugeCode')" width="180">
                                <template #default="{ row, $index }">
                                    <el-select v-model="row.InspectionCode" size="small" style="width: 100%" filterable clearable
                                        :placeholder="t('incomingManage.inspectionItem.gaugeCode')"
                                        @change="handleInspectionSelect(row, $event)">
                                        <el-option
                                            v-for="item in inspectionItemList"
                                            :key="item.InspectionCode"
                                            :label="`${item.InspectionCode} - ${item.InspectionName}`"
                                            :value="item.InspectionCode">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column :label="t('incomingManage.inspectionItem.gaugeName')" min-width="120">
                                <template #default="{ row }">
                                    <el-input v-model="row.InspectionName" size="small" disabled />
                                </template>
                            </el-table-column>
                            <el-table-column :label="t('incomingManage.inspectionItem.isGauge')" width="100">
                                <template #default="{ row }">
                                    <span>{{ row.IsInspectionTool === 1 ? t('publicText.yes') : t('publicText.no') }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column :label="t('incomingManage.inspectionRule.upperLimit')" width="120">
                                <template #default="{ row }">
                                    <el-input-number v-model="row.UpperLimit" size="small" :controls="false" style="width: 100%" :placeholder="t('incomingManage.inspectionRule.upperLimitPlaceholder')" />
                                </template>
                            </el-table-column>
                            <el-table-column :label="t('incomingManage.inspectionRule.lowerLimit')" width="120">
                                <template #default="{ row }">
                                    <el-input-number v-model="row.LowerLimit" size="small" :controls="false" style="width: 100%" :placeholder="t('incomingManage.inspectionRule.lowerLimitPlaceholder')" />
                                </template>
                            </el-table-column>
                            <el-table-column :label="t('incomingManage.inspectionRule.unit')" width="100">
                                <template #default="{ row }">
                                    <el-input v-model="row.Unit" size="small" :placeholder="t('incomingManage.inspectionRule.unitPlaceholder')" />
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('publicText.operation')" width="80" align="center">
                                <template #default="{ $index }">
                                    <el-button type="danger" size="small" link @click="removeDetailRow($index)">{{ t('publicText.delete') }}</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="tips">{{ t('incomingManage.inspectionRule.detailTips') }}</div>
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
import { RefreshInspectionItem, RefreshInspectionRule, QueryInspectionRuleDetail, AddInspectionRule, DeleteInspectionRule, QueryPartNumbersIqc } from "@/api/incomingManage/index";
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

// 子表数据
const detailData = ref<any[]>([]);
const currentRuleId = ref<number | null>(null);

// 新增对话框相关
const addVisible = ref(false);
const addFormRef = ref();
const addForm = reactive({
    MaterialCode: "",
    MaterialName: "",
    ProjectName: "",
    IsDouble: 0,
    Details: [] as any[],
});
const addRules = {
    MaterialCode: [{ required: true, message: "请选择物料编码", trigger: "change" }],
    ProjectName: [{ required: true, message: "请输入检验项目名称", trigger: "blur" }],
};

// 物料搜索相关
const materialList = ref<any[]>([]);
const materialLoading = ref(false);
// 检验项列表（检具）
const inspectionItemList = ref<any[]>([]);

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
                // 假设返回的 Data 是一个数组，每个元素有 MaterialCode(PN) 和 MaterialName(name)
                materialList.value = res.Data.map((item: any) => ({
                    MaterialCode: item.PN || item.MaterialCode,
                    MaterialName: item.name || item.MaterialName,
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
        return;
    }
    const selected = materialList.value.find(item => item.MaterialCode === selectedCode);
    if (selected) {
        addForm.MaterialName = selected.MaterialName;
    } else {
        // 如果不在列表中（可能手动输入的），可以尝试再查一次
        addForm.MaterialName = "";
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

// 点击行加载子表明细
const handleRowClick = (row: any) => {
    currentRuleId.value = row.RuleId;
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
};

// 删除主表（同时删除子表）
const handleDelete = (row: any) => {
    ElMessageBox.confirm(`${t('publicText.confirm')}${t("publicText.delete")}【${row.MaterialCode}】?`, t("publicText.confirm"), {
        confirmButtonText: t("publicText.confirm"),
        cancelButtonText: t("publicText.cancel"),
        type: "warning",
    })
        .then(() => {
            DeleteInspectionRule({ ruleId: row.RuleId }).then((res: any) => {
                if (res.Success) {
                    ElMessage.success(res.Message || "删除成功");
                    if (currentRuleId.value === row.RuleId) {
                        currentRuleId.value = null;
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

// ==================== 新增对话框操作 ====================
const openAdd = () => {
    addForm.MaterialCode = "";
    addForm.MaterialName = "";
    addForm.ProjectName = "";
    addForm.IsDouble = 0;
    addForm.Details = [
        { InspectionCode: "", InspectionName: "", IsInspectionTool: 1, UpperLimit: null, LowerLimit: null, Unit: "" }
    ];
    // 确保检验项列表已加载
    if (inspectionItemList.value.length === 0) {
        getInspectionItems();
    }
    addVisible.value = true;
};

const addDetailRow = () => {
    addForm.Details.push({ InspectionCode: "", InspectionName: "", IsInspectionTool: 1, UpperLimit: null, LowerLimit: null, Unit: "" });
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

const addSubmit = () => {
    addFormRef.value.validate((valid: boolean) => {
        if (!valid) return;

        // 校验明细至少有一行且编码不能为空
        const invalidDetail = addForm.Details.some((item: any) => !item.InspectionCode);
        if (invalidDetail) {
            ElMessage.warning("请完整选择检验项编码");
            return;
        }

        const params = {
            Rule: {
                MaterialCode: addForm.MaterialCode,
                MaterialName: addForm.MaterialName,
                ProjectName: addForm.ProjectName,
                IsDouble: addForm.IsDouble,
                CreateUser: userStore.getUserInfo || "admin",
            },
            Details: addForm.Details.map((item: any) => ({
                InspectionCode: item.InspectionCode,
                InspectionName: item.InspectionName,
                IsInspectionTool: item.IsInspectionTool,
                UpperLimit: item.UpperLimit,
                LowerLimit: item.LowerLimit,
                Unit: item.Unit,
            })),
        };

        AddInspectionRule(params).then((res: any) => {
            if (res.Success) {
                ElMessage.success(res.Message || "新增成功");
                addVisible.value = false;
                getData();
                // 若当前打开的明细 ID 与之相同（理论上不会有，因为新增的 RuleId 是新生成的，但可以不清）
            } else {
                ElMessage.error(res.Message || "新增失败");
            }
        }).catch(() => {
            ElMessage.error("新增失败");
        });
    });
};

// ==================== 列宽自适应 ====================
const columnWidths1 = computed(() => {
    const columns = [
        { label: t("incomingManage.inspectionRule.materialCode"), prop: "MaterialCode" },
        { label: t("incomingManage.inspectionRule.materialName"), prop: "MaterialName" },
        { label: t("incomingManage.inspectionRule.projectName"), prop: "ProjectName" },
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
        { label: t("incomingManage.inspectionItem.gaugeCode"), prop: "InspectionCode" },
        { label: t("incomingManage.inspectionItem.gaugeName"), prop: "InspectionName" },
        { label: t("incomingManage.inspectionItem.isGauge"), prop: "IsInspectionTool" },
        { label: t("incomingManage.inspectionRule.upperLimit"), prop: "UpperLimit" },
        { label: t("incomingManage.inspectionRule.lowerLimit"), prop: "LowerLimit" },
        { label: t("incomingManage.inspectionRule.unit"), prop: "Unit" },
        { label: t("incomingManage.inspectionItem.creator"), prop: "CreateUser" },
        { label: t("incomingManage.inspectionItem.creatime"), prop: "CreateTime" },
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
    getInspectionItems(); // 预先加载检验项列表供下拉使用
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