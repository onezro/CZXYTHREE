<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between">
                <el-form ref="formRef" :model="getForm" label-width="auto" :inline="true" :size="'small'"
                    @submit.native.prevent>
                    <el-form-item :label="t('smtSpotCheck.firstBase.name')" prop="name" class="mb-2">
                        <el-input v-model="getForm.Name" :placeholder="t('smtSpotCheck.firstBase.namePlaceholder')"
                            clearable @clear="searchData" @keyup.enter.native="searchData" style="width: 200px" />
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
              
                <el-col :span="8">
                       
                    <el-table ref="eltableRef" size="small" :data="displayData" stripe border fit :height="tableHeight">
                        <el-table-column type="index" :label="$t('publicText.index')" width="50" align="center" />
                        <el-table-column prop="Name" :label="t('smtSpotCheck.firstBase.name')"
                            :min-width="getColumnWidth1('Name')" />
                        <el-table-column prop="InspectContent" :label="t('smtSpotCheck.firstBase.inspectContent')"
                            :min-width="getColumnWidth1('InspectContent')" show-overflow-tooltip />
                        <el-table-column :label="$t('publicText.operation')" fixed="right" width="120" align="center">
                            <template #default="{ row }">
                                <el-tooltip :content="$t('publicText.edit')" placement="top">
                                    <el-button size="small" type="primary" icon="Edit"
                                        @click.stop="openEdit(row)"></el-button>
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
                            @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
                            :page-sizes="[5, 10, 20, 50, 100]" layout="total,sizes, prev, pager, next, jumper"
                            :total="filteredData.length">
                        </el-pagination>
                    </div>

                </el-col>
                <el-col :span="16">
                    <!-- 明细 -->

                </el-col>

            </el-row>

        </el-card>

        <!-- 新增工序弹窗（支持动态增删子项） -->
        <el-dialog :title="$t('publicText.add')" v-model="addDialogVisible" width="80%" @close="addDialogCancel"
            align-center :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form :model="addForm" ref="addFormRef" label-width="120px" :rules="formRules">
                <el-form-item :label="t('smtSpotCheck.firstBase.step')" prop="Step">
                    <el-input-number v-model="addForm.Step" :min="1" style="width: 100%"
                        :placeholder="t('smtSpotCheck.firstBase.stepPlaceholder')" controls-position="right" />
                </el-form-item>
                <el-form-item :label="t('smtSpotCheck.firstBase.name')" prop="Name">
                    <el-input v-model="addForm.Name" :placeholder="t('smtSpotCheck.firstBase.namePlaceholder')"
                        clearable style="width: 100%" />
                </el-form-item>
                <el-form-item :label="t('smtSpotCheck.firstBase.inspectContent')" prop="InspectContent">
                    <el-input v-model="addForm.InspectContent" type="textarea" :rows="2"
                        :placeholder="t('smtSpotCheck.firstBase.inspectContentPlaceholder')" style="width: 100%" />
                </el-form-item>
                <el-form-item :label="t('smtSpotCheck.firstBase.stepItemList')" prop="StepItemList" required>
                    <div class="detail-table-wrapper">
                        <el-button type="primary" size="small" @click="addDetailRow" class="mb-2">
                            {{ t('publicText.add') }}{{ t('smtSpotCheck.firstBase.subItem') }}
                        </el-button>
                        <el-table :data="addForm.StepItemList" border size="small" style="width: 100%" height="400">
                            <el-table-column :label="t('smtSpotCheck.firstBase.subItem')" width="100">
                                <template #default="{ row, $index }">
                                    <el-input-number v-model="row.SubItem" size="small" style="width: 100%" :min="1"
                                        :controls="false"
                                        :placeholder="t('smtSpotCheck.firstBase.subItemPlaceholder')" />
                                </template>
                            </el-table-column>
                            <el-table-column :label="t('smtSpotCheck.firstBase.subItemName')" min-width="140">
                                <template #default="{ row }">
                                    <el-input v-model="row.SubItemName" size="small"
                                        :placeholder="t('smtSpotCheck.firstBase.subItemNamePlaceholder')" />
                                </template>
                            </el-table-column>
                            <el-table-column :label="t('smtSpotCheck.firstBase.subItemMethod')" min-width="120">
                                <template #default="{ row }">
                                    <el-input v-model="row.SubItemMethod" size="small"
                                        :placeholder="t('smtSpotCheck.firstBase.subItemMethodPlaceholder')" />
                                </template>
                            </el-table-column>
                            <el-table-column :label="t('smtSpotCheck.firstBase.subItemBasic')" min-width="120">
                                <template #default="{ row }">
                                    <el-input v-model="row.SubItemBasic" size="small"
                                        :placeholder="t('smtSpotCheck.firstBase.subItemBasicPlaceholder')" />
                                </template>
                            </el-table-column>
                            <el-table-column :label="t('smtSpotCheck.firstBase.subItemSolution')" min-width="120">
                                <template #default="{ row }">
                                    <el-input v-model="row.SubItemSolution" size="small"
                                        :placeholder="t('smtSpotCheck.firstBase.subItemSolutionPlaceholder')" />
                                </template>
                            </el-table-column>
                            <el-table-column :label="t('smtSpotCheck.firstBase.subItemAim')" min-width="120">
                                <template #default="{ row }">
                                    <el-input v-model="row.SubItemAim" size="small"
                                        :placeholder="t('smtSpotCheck.firstBase.subItemAimPlaceholder')" />
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('publicText.operation')" width="80" align="center">
                                <template #default="{ $index }">
                                    <el-button type="danger" size="small" link @click="removeDetailRow($index)">{{
                                        t('publicText.delete') }}</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="tips">{{ t('smtSpotCheck.firstBase.detailTips') }}</div>
                    </div>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="addDialogCancel">{{ $t("publicText.cancel") }}</el-button>
                <el-button type="primary" @click="submitAdd">{{ $t("publicText.confirm") }}</el-button>
            </template>
        </el-dialog>

        <!-- 编辑工序弹窗（只允许修改内容，不允许增删子项） -->
        <el-dialog :title="$t('publicText.edit')" v-model="editDialogVisible" width="80%" @close="editDialogCancel"
            align-center :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form :model="editForm" ref="editFormRef" label-width="120px" :rules="formRules">
                <el-form-item :label="t('smtSpotCheck.firstBase.step')" prop="Step">
                    <el-input-number v-model="editForm.Step" disabled style="width: 100%" />
                </el-form-item>
                <el-form-item :label="t('smtSpotCheck.firstBase.name')" prop="Name">
                    <el-input v-model="editForm.Name" :placeholder="t('smtSpotCheck.firstBase.namePlaceholder')"
                        clearable style="width: 100%" />
                </el-form-item>
                <el-form-item :label="t('smtSpotCheck.firstBase.inspectContent')" prop="InspectContent">
                    <el-input v-model="editForm.InspectContent" type="textarea" :rows="2"
                        :placeholder="t('smtSpotCheck.firstBase.inspectContentPlaceholder')" style="width: 100%" />
                </el-form-item>
                <el-form-item :label="t('smtSpotCheck.firstBase.stepItemList')" prop="StepItemList" required>
                    <div class="detail-table-wrapper">
                        <el-table :data="editForm.StepItemList" border size="small" style="width: 100%" height="400">
                            <el-table-column :label="t('smtSpotCheck.firstBase.subItem')" width="100">
                                <template #default="{ row }">
                                    <el-input-number v-model="row.SubItem" size="small" style="width: 100%" :min="1"
                                        :controls="false" disabled />
                                </template>
                            </el-table-column>
                            <el-table-column :label="t('smtSpotCheck.firstBase.subItemName')" min-width="140">
                                <template #default="{ row }">
                                    <el-input v-model="row.SubItemName" size="small"
                                        :placeholder="t('smtSpotCheck.firstBase.subItemNamePlaceholder')" />
                                </template>
                            </el-table-column>
                            <el-table-column :label="t('smtSpotCheck.firstBase.subItemMethod')" min-width="120">
                                <template #default="{ row }">
                                    <el-input v-model="row.SubItemMethod" size="small"
                                        :placeholder="t('smtSpotCheck.firstBase.subItemMethodPlaceholder')" />
                                </template>
                            </el-table-column>
                            <el-table-column :label="t('smtSpotCheck.firstBase.subItemBasic')" min-width="120">
                                <template #default="{ row }">
                                    <el-input v-model="row.SubItemBasic" size="small"
                                        :placeholder="t('smtSpotCheck.firstBase.subItemBasicPlaceholder')" />
                                </template>
                            </el-table-column>
                            <el-table-column :label="t('smtSpotCheck.firstBase.subItemSolution')" min-width="120">
                                <template #default="{ row }">
                                    <el-input v-model="row.SubItemSolution" size="small"
                                        :placeholder="t('smtSpotCheck.firstBase.subItemSolutionPlaceholder')" />
                                </template>
                            </el-table-column>
                            <el-table-column :label="t('smtSpotCheck.firstBase.subItemAim')" min-width="120">
                                <template #default="{ row }">
                                    <el-input v-model="row.SubItemAim" size="small"
                                        :placeholder="t('smtSpotCheck.firstBase.subItemAimPlaceholder')" />
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="tips">{{ t('smtSpotCheck.firstBase.editDetailTips') }}</div>
                    </div>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="editDialogCancel">{{ $t("publicText.cancel") }}</el-button>
                <el-button type="primary" @click="submitEdit">{{ $t("publicText.confirm") }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { GetFirstInspectData, InsertFirstInspectData, UpdateFirstInspectData, DeleteFirstInspectData } from "@/api/smtSpotCheck/base/index"
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

// 表格高度
const tableHeight = ref(0);
// 分页
const pageSize = ref(10);
const currentPage = ref(1);
// 原始扁平数据
const rawFlatData = ref<any[]>([]);
// 工序主表列表（去重后）
const stepList = ref<any[]>([]);
// 过滤后的工序列表
const filteredData = ref<any[]>([]);
// 查询条件
const getForm = reactive({
    Step: "",
    Name: "",
});

const eltableRef = ref();

// ==================== 新增弹窗 ====================
const addDialogVisible = ref(false);
const addFormRef = ref();
const addForm = reactive({
    Step: 0,
    Name: "",
    InspectContent: "",
    StepItemList: [] as any[],
});

// ==================== 编辑弹窗 ====================
const editDialogVisible = ref(false);
const editFormRef = ref();
const editForm = reactive({
    Step: 0,
    Name: "",
    InspectContent: "",
    StepItemList: [] as any[],
});

// 表单校验规则
const formRules = {
    Step: [{ required: true, message: "请输入工序编号", trigger: "blur" }, { type: 'number', min: 1, message: "工序编号必须大于0", trigger: "blur" }],
    Name: [{ required: true, message: "请输入工序名称", trigger: "blur" }],
    InspectContent: [{ required: true, message: "请输入检验内容", trigger: "blur" }],
};

// ==================== 数据转换 ====================
// 从扁平数据生成工序主表（去重）
const generateStepList = (flatData: any[]) => {
    const stepMap = new Map<number, any>();
    flatData.forEach(item => {
        const step = item.Step;
        if (!stepMap.has(step)) {
            stepMap.set(step, {
                Step: step,
                Name: item.Name,
                InspectContent: item.InspectContent || "",
            });
        }
    });
    return Array.from(stepMap.values()).sort((a, b) => a.Step - b.Step);
};

// 获取某个工序下的所有子项
const getSubItemsByStep = (step: number) => {
    return rawFlatData.value.filter(item => item.Step === step).map(item => ({
        SubItem: item.SubItem,
        SubItemName: item.SubItemName,
        SubItemMethod: item.SubItemMethod || "",
        SubItemBasic: item.SubItemBasic || "",
        SubItemSolution: item.SubItemSolution || "",
        SubItemAim: item.SubItemAim || "",
        SubItemStatus: item.SubItemStatus || "I",
    })).sort((a, b) => a.SubItem - b.SubItem);
};

// 获取数据
const getData = () => {
    GetFirstInspectData({}).then((res: any) => {
        if (res.Success) {
            rawFlatData.value = res.Data || [];
            stepList.value = generateStepList(rawFlatData.value);
            searchData();
        } else {
            ElMessage.error(res.message || "获取数据失败");
        }
    }).catch(() => {
        ElMessage.error("获取数据失败");
    });
};

// 前端搜索
const searchData = () => {
    let result = [...stepList.value];
    if (getForm.Step) {
        result = result.filter(item => item.Step.toString().includes(getForm.Step));
    }
    if (getForm.Name) {
        result = result.filter(item => item.Name.includes(getForm.Name));
    }
    filteredData.value = result;
    currentPage.value = 1;
};

const displayData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return filteredData.value.slice(start, end);
});

const handleSizeChange = (val: number) => {
    pageSize.value = val;
    currentPage.value = 1;
};
const handleCurrentChange = (val: number) => {
    currentPage.value = val;
};

// ==================== 删除工序 ====================
const handleDelete = (row: any) => {
    ElMessageBox.confirm(`${t('publicText.confirmDelete')}【${row.Step}】?`, t("publicText.confirm"), {
        confirmButtonText: t("publicText.confirm"),
        cancelButtonText: t("publicText.cancel"),
        type: "warning",
    }).then(() => {
        DeleteFirstInspectData({ Step: row.Step }).then((res: any) => {
            if (res.Success) {
                ElMessage.success(res.message || "删除成功");
                getData();
            } else {
                ElMessage.error(res.message || "删除失败");
            }
        }).catch(() => {
            ElMessage.error("删除失败");
        });
    }).catch(() => {
        ElMessage.info(t("publicText.cancel"));
    });
};

// ==================== 新增逻辑 ====================
const openAdd = () => {
    addForm.Step = 0;
    addForm.Name = "";
    addForm.InspectContent = "";
    addForm.StepItemList = [
        {
            SubItem: 1,
            SubItemName: "",
            SubItemMethod: "",
            SubItemBasic: "",
            SubItemSolution: "",
            SubItemAim: "",
            SubItemStatus: "I",
        }
    ];
    addDialogVisible.value = true;
};

const addDetailRow = () => {
    let maxSubItem = 1;
    if (addForm.StepItemList.length > 0) {
        maxSubItem = Math.max(...addForm.StepItemList.map(item => item.SubItem || 0)) + 1;
    }
    addForm.StepItemList.push({
        SubItem: maxSubItem,
        SubItemName: "",
        SubItemMethod: "",
        SubItemBasic: "",
        SubItemSolution: "",
        SubItemAim: "",
        SubItemStatus: "I",
    });
};

const removeDetailRow = (index: number) => {
    if (addForm.StepItemList.length <= 1) {
        ElMessage.warning("至少保留一个子项");
        return;
    }
    addForm.StepItemList.splice(index, 1);
};

const addDialogCancel = () => {
    addDialogVisible.value = false;
    addFormRef.value?.resetFields();
};

const validateSubItemUnique = (list: any[]) => {
    const subItems = list.map(item => item.SubItem);
    return subItems.length === new Set(subItems).size;
};

const submitAdd = () => {
    addFormRef.value.validate(async (valid: boolean) => {
        if (!valid) return;

        if (!addForm.StepItemList.length) {
            ElMessage.warning("请至少添加一个检验子项");
            return;
        }
        for (let i = 0; i < addForm.StepItemList.length; i++) {
            const item = addForm.StepItemList[i];
            if (!item.SubItem) {
                ElMessage.warning(`第${i + 1}行子项编号不能为空`);
                return;
            }
            if (!item.SubItemName) {
                ElMessage.warning(`第${i + 1}行子项名称不能为空`);
                return;
            }
        }
        if (!validateSubItemUnique(addForm.StepItemList)) {
            ElMessage.warning("子项编号不能重复");
            return;
        }

        // 校验工序编号唯一性
        const exists = stepList.value.some(item => item.Step === addForm.Step);
        if (exists) {
            ElMessage.warning(`工序编号 ${addForm.Step} 已存在，请重新输入`);
            return;
        }

        const stepItemList = addForm.StepItemList.map(item => ({
            SubItemName: item.SubItemName,
            SubItem: item.SubItem,
            SubItemMethod: item.SubItemMethod || "",
            SubItemBasic: item.SubItemBasic || "",
            SubItemSolution: item.SubItemSolution || "",
            SubItemAim: item.SubItemAim || "",
            SubItemStatus: "I",
        }));

        const requestData = {
            Product: "",
            InspectType: "",
            StepList: [
                {
                    Step: addForm.Step,
                    Status: "",
                    Name: addForm.Name,
                    InspectContent: addForm.InspectContent,
                    StepItemList: stepItemList,
                }
            ]
        };

        try {
            const res: any = await InsertFirstInspectData(requestData);
            if (res.Success) {
                ElMessage.success(res.message || "新增成功");
                addDialogVisible.value = false;
                getData();
            } else {
                ElMessage.error(res.message || "新增失败");
            }
        } catch {
            ElMessage.error("新增失败");
        }
    });
};

// ==================== 编辑逻辑 ====================
const openEdit = (row: any) => {
    const step = row.Step;
    const subItems = getSubItemsByStep(step);
    if (subItems.length === 0) {
        ElMessage.warning("该工序没有子项数据");
        return;
    }
    editForm.Step = step;
    editForm.Name = row.Name;
    editForm.InspectContent = row.InspectContent || "";
    editForm.StepItemList = subItems.map(item => ({ ...item }));
    editDialogVisible.value = true;
};

const editDialogCancel = () => {
    editDialogVisible.value = false;
    editFormRef.value?.resetFields();
};

const submitEdit = () => {
    editFormRef.value.validate(async (valid: boolean) => {
        if (!valid) return;

        if (!editForm.StepItemList.length) {
            ElMessage.warning("至少保留一个子项");
            return;
        }
        // 子项编号不可编辑，无需校验唯一性，但需校验名称必填
        for (let i = 0; i < editForm.StepItemList.length; i++) {
            const item = editForm.StepItemList[i];
            if (!item.SubItemName) {
                ElMessage.warning(`第${i + 1}行子项名称不能为空`);
                return;
            }
        }

        const stepItemList = editForm.StepItemList.map(item => ({
            SubItemName: item.SubItemName,
            SubItem: item.SubItem,
            SubItemMethod: item.SubItemMethod || "",
            SubItemBasic: item.SubItemBasic || "",
            SubItemSolution: item.SubItemSolution || "",
            SubItemAim: item.SubItemAim || "",
            SubItemStatus: "I",
        }));

        const requestData = {
            Product: "",
            InspectType: "",
            StepList: [
                {
                    Step: editForm.Step,
                    Status: "",
                    Name: editForm.Name,
                    InspectContent: editForm.InspectContent,
                    StepItemList: stepItemList,
                }
            ]
        };

        try {
            const res: any = await UpdateFirstInspectData(requestData);
            if (res.Success) {
                ElMessage.success(res.message || "更新成功");
                editDialogVisible.value = false;
                getData();
            } else {
                ElMessage.error(res.message || "更新失败");
            }
        } catch {
            ElMessage.error("更新失败");
        }
    });
};

// ==================== 列宽自适应 ====================
const columnWidths1 = computed(() => {
    if (!eltableRef.value) return {};
    let columns: any = [];
    columns = eltableRef.value.columns
        .map((item: any) => {
            return {
                prop: item.property,
                label: item.label,
            };
        })
        .filter(
            (item: any) =>
                item.label !== t("publicText.index") &&
                item.label !== t("publicText.operation"),
        );
    return calculateColumnsWidth(columns, displayData.value, {
        padding: 25,
        fontSize: 13,
    });
});
const getColumnWidth1 = (prop: string) => columnWidths1.value[prop] || "auto";

// 高度自适应
const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 180;
    });
};

onBeforeMount(() => {
    getScreenHeight();
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    getData();
});
onBeforeUnmount(() => {
    window.removeEventListener("resize", getScreenHeight);
});
</script>

<style scoped>
.el-pagination {
    justify-content: center;
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