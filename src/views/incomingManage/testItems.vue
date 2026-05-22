<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between">
                <el-form ref="formRef" :model="getForm" label-width="auto" :inline="true" :size="'small'"
                    @submit.native.prevent>
                    <el-form-item :label="t('incomingManage.testItems.projectCode')" prop="projectCode" class="mb-2">
                        <el-input v-model="getForm.ProjectCode" :placeholder="t('incomingManage.testItems.projectCodePlaceholder')" clearable @clear="searchData"
                            @keyup.enter.native="searchData" style="width: 200px" />
                    </el-form-item>
                    <el-form-item :label="t('incomingManage.testItems.projectName')" prop="projectName" class="mb-2">
                        <el-input v-model="getForm.ProjectName" :placeholder="t('incomingManage.testItems.projectNamePlaceholder')" clearable @clear="searchData"
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
                <!-- 左侧：检验项目主表列表 -->
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
                        <el-table-column :label="t('incomingManage.testItems.projectCode')" prop="ProjectCode"
                            :min-width="getColumnWidth1('ProjectCode')" />
                        <el-table-column :label="t('incomingManage.testItems.projectName')" prop="ProjectName"
                            :min-width="getColumnWidth1('ProjectName')" />
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
                <!-- 右侧：选中项目的子表明细 -->
                <el-col :span="12">
                    <div class="detail-header">
                        <span class="detail-title">{{ t('incomingManage.testItems.detailTitle') }}</span>
                        <span v-if="currentProjectCode" class="detail-project-code">{{ currentProjectCode }}</span>
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
                        <el-table-column :label="t('incomingManage.inspectionItem.creator')" prop="CreateUser"
                            :min-width="getColumnWidth2('CreateUser')" />
                        <el-table-column :label="t('incomingManage.inspectionItem.creatime')" prop="CreateTime"
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

        <!-- 新增检验项目对话框 -->
        <el-dialog :title="$t('publicText.add')" v-model="addVisible" width="800px" @close="addCancel" align-center :append-to-body="true" :close-on-click-modal="false"
            :close-on-press-escape="false">
            <el-form :model="addForm" ref="addFormRef" label-width="auto" :inline="false" :rules="addRules">
                <el-form-item :label="t('incomingManage.testItems.projectCode')" prop="ProjectCode">
                    <el-input v-model="addForm.ProjectCode" :placeholder="t('incomingManage.testItems.projectCodePlaceholder')" clearable style="width: 100%" />
                </el-form-item>
                <el-form-item :label="t('incomingManage.testItems.projectName')" prop="ProjectName">
                    <el-input v-model="addForm.ProjectName" :placeholder="t('incomingManage.testItems.projectNamePlaceholder')" clearable style="width: 100%" />
                </el-form-item>
                <el-form-item :label="t('incomingManage.testItems.details')" prop="Details" required>
                    <div class="detail-table-wrapper">
                        <el-button type="primary" size="small" @click="addDetailRow" class="mb-2">{{ t('publicText.add') }}检验项</el-button>
                        <el-table :data="addForm.Details" border size="small" style="width: 100%" height="300">
                            <el-table-column :label="t('incomingManage.testItems.gaugeName')" width="220">
                                <template #default="{ row, $index }">
                                    <el-select v-model="row.InspectionCode" size="small" style="width: 100%" filterable clearable
                                        placeholder=""
                                        @change="handleInspectionSelect(row, $event)">
                                        <el-option
                                            v-for="item in inspectionItemList"
                                            :key="item.InspectionCode"
                                            :label="` ${item.InspectionName}`"
                                            :value="item.InspectionCode">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column :label="t('incomingManage.testItems.gaugeCode')" prop="InspectionCode">
                                <!-- <template #default="{ row, $index }">
                                    <el-input v-model="row.InspectionName" size="small" :placeholder="t('incomingManage.inspectionItem.gaugeName')" />
                                </template> -->
                            </el-table-column>
                            <el-table-column :label="t('incomingManage.inspectionItem.isGauge')" width="120" prop="IsInspectionTool">
                                <template #default="{ row, $index }">
                                   {{ row.IsInspectionTool === 1 ? t('publicText.yes') : t('publicText.no') }}
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('publicText.operation')" width="80" align="center">
                                <template #default="{ $index }">
                                    <el-button type="danger" size="small" link @click="removeDetailRow($index)">{{ t('publicText.delete') }}</el-button>
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
import { RefreshInspectionItem, RefreshInspectionProject, QueryInspectionProjectDetail, AddInspectionProject, DeleteInspectionProject } from "@/api/incomingManage/index";
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

// 新增对话框
const addVisible = ref(false);
const addFormRef = ref();
const addForm = reactive({
    ProjectCode: "",
    ProjectName: "",
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

// 新增对话框操作
const openAdd = () => {
    addForm.ProjectCode = "";
    addForm.ProjectName = "";
    addForm.Details = [
        { InspectionCode: "", InspectionName: "", IsInspectionTool: '' }
    ];
    // 确保检验项列表已加载
    if (inspectionItemList.value.length === 0) {
        getInspectionItems();
    }
    addVisible.value = true;
};
const addDetailRow = () => {
    addForm.Details.push({ InspectionCode: "", InspectionName: "", IsInspectionTool: 1 });
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

// 下拉框选中后自动填充检验项名称和是否量具标记
const handleInspectionSelect = (row: any, selectedCode: string) => {
    if (!selectedCode) {
        // 清空时也清空关联字段
        row.InspectionName = "";
        row.IsInspectionTool = 1; // 默认是
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
        
        // 校验明细至少有一行且编码名称不能为空
        const invalidDetail = addForm.Details.some(
            (item: any) => !item.InspectionCode || !item.InspectionName
        );
        if (invalidDetail) {
            ElMessage.warning("请完整填写检验项编码和名称");
            return;
        }
        
        const params = {
            Project: {
                ProjectCode: addForm.ProjectCode,
                ProjectName: addForm.ProjectName,
                CreateUser: userStore.getUserInfo || "admin",
                
            },
            Details: addForm.Details.map((item: any) => ({
                InspectionCode: item.InspectionCode,
                InspectionName: item.InspectionName,
                IsInspectionTool: item.IsInspectionTool,
            })),
        };
        
        AddInspectionProject(params).then((res: any) => {
            if (res.Success) {
                ElMessage.success(res.Message || "新增成功");
                addVisible.value = false;
                getData();
                // 如果新增的项目编码与当前选中的相同，可重新加载明细（可选）
                if (currentProjectCode.value === addForm.ProjectCode) {
                    handleRowClick({ ProjectCode: addForm.ProjectCode });
                }
            } else {
                ElMessage.error(res.Message || "新增失败");
            }
        }).catch(() => {
            ElMessage.error("新增失败");
        });
    });
};

// 列宽自适应（主表）
const columnWidths1 = computed(() => {
    const columns = [
        { label: t("incomingManage.testItems.projectCode"), prop: "ProjectCode" },
        { label: t("incomingManage.testItems.projectName"), prop: "ProjectName" },
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
        { label: t("incomingManage.inspectionItem.gaugeCode"), prop: "InspectionCode" },
        { label: t("incomingManage.inspectionItem.gaugeName"), prop: "InspectionName" },
        { label: t("incomingManage.inspectionItem.isGauge"), prop: "IsInspectionTool" },
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
    getInspectionItems(); // 预先加载检验项列表
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