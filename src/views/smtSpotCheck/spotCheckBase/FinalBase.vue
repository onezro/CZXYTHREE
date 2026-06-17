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
                    <el-table ref="eltableRef" size="small" :data="displayData" stripe border fit :height="tableHeight"
                        highlight-current-row @row-click="handleRowClick">
                        <el-table-column type="index" :label="$t('publicText.index')" width="50" align="center" />
                        <el-table-column prop="Name" :label="t('smtSpotCheck.firstBase.name')"
                            :min-width="getColumnWidth1('Name')" />
                        <el-table-column prop="InspectContent" :label="t('smtSpotCheck.firstBase.inspectContent')"
                            :min-width="getColumnWidth1('InspectContent')" show-overflow-tooltip />
                        <el-table-column :label="$t('publicText.operation')" fixed="right" width="120" align="center">
                            <template #default="{ row }">
                                <el-tooltip :content="$t('publicText.add')" placement="top">
                                    <el-button size="small" type="warning" icon="Plus"
                                        @click.stop="openAddRow(row)"></el-button>
                                </el-tooltip>
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
                            :page-sizes="[5, 10, 20, 50, 100]" layout="total,sizes, prev, pager, next"
                            :total="filteredData.length">
                        </el-pagination>
                    </div>
                </el-col>

                <!-- 右侧明细区域 -->
                <el-col :span="16">

                    <div class="detail-header" v-if="currentSelectedRow">
                        <span>{{ t('smtSpotCheck.firstBase.subItemList') }} - {{ currentSelectedRow.Name }}</span>
                    </div>
                    <div v-if="!currentSelectedRow" class="detail-empty">
                        <el-empty :description="t('smtSpotCheck.firstBase.selectStepTip')" />
                    </div>
                    <el-table v-else :data="currentSubItems" border size="small" style="width: 100%"
                        :height="tableHeight - 20">
                        <el-table-column :label="t('smtSpotCheck.firstBase.subItem')" width="80" prop="SubItem"
                            :align="'center'">
                            <template #default="{ row }">
                                {{ row.SubItem }}
                            </template>
                        </el-table-column>
                        <el-table-column :label="t('smtSpotCheck.firstBase.subItemName')" min-width="140">
                            <template #default="{ row }">
                                {{ row.SubItemName }}
                            </template>
                        </el-table-column>
                        <el-table-column :label="t('smtSpotCheck.firstBase.subItemMethod')" min-width="120">
                            <template #default="{ row }">
                                {{ row.SubItemMethod || '-' }}
                            </template>
                        </el-table-column>
                        <el-table-column :label="t('smtSpotCheck.firstBase.subItemBasic')" min-width="120">
                            <template #default="{ row }">
                                {{ row.SubItemBasic || '-' }}
                            </template>
                        </el-table-column>
                        <el-table-column :label="t('smtSpotCheck.firstBase.subItemSolution')" min-width="120">
                            <template #default="{ row }">
                                {{ row.SubItemSolution || '-' }}
                            </template>
                        </el-table-column>
                        <el-table-column :label="t('smtSpotCheck.firstBase.subItemAim')" min-width="120">
                            <template #default="{ row }">
                                {{ row.SubItemAim || '-' }}
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('publicText.operation')" width="80" align="center">
                            <template #default="{ $index }">
                                <el-button type="danger" size="small" link @click="deleteSubItem($index)">
                                    {{ t('publicText.delete') }}
                                </el-button>
                            </template>
                        </el-table-column>
                        <template #empty>
                            <el-empty :description="t('smtSpotCheck.firstBase.noSubItem')" />
                        </template>
                    </el-table>
                </el-col>
            </el-row>
        </el-card>

        <!-- 新增工序弹窗（支持动态增删子项） -->
        <el-dialog :title="$t('publicText.add')"  :lock-scroll="false" v-model="addDialogVisible" width="80%" @close="addDialogCancel"
            align-center :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form :model="addForm" ref="addFormRef" label-width="120px" :rules="formRules">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('smtSpotCheck.firstBase.step')" prop="Step">
                            <el-input-number v-model="addForm.Step" :min="1" style="width: 100%"
                                :placeholder="t('smtSpotCheck.firstBase.stepPlaceholder')" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('smtSpotCheck.firstBase.name')" prop="Name">
                            <el-input v-model="addForm.Name" :placeholder="t('smtSpotCheck.firstBase.namePlaceholder')"
                                clearable style="width: 100%" />
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-form-item :label="t('smtSpotCheck.firstBase.inspectContent')" prop="InspectContent">
                    <el-input v-model="addForm.InspectContent" type="textarea" :rows="2"
                        :placeholder="t('smtSpotCheck.firstBase.inspectContentPlaceholder')" style="width: 100%" />
                </el-form-item>

                <el-button type="primary" size="small" @click="addDetailRow" class="mb-2">
                    {{ t('publicText.add') }}{{ t('smtSpotCheck.firstBase.subItem') }}
                </el-button>
                <el-table :data="addForm.StepItemList" border size="small" style="width: 100%" height="400">
                    <el-table-column :label="t('smtSpotCheck.firstBase.subItem')" width="80" prop="SubItem"
                        :align="'center'">
                        <!-- <template #default="{ row, $index }">
                            <el-input-number v-model="row.SubItem" size="small" style="width: 100%" :min="1"
                                :controls="false" disabled
                                :placeholder="t('smtSpotCheck.firstBase.subItemPlaceholder')" />
                        </template> -->
                    </el-table-column>
                    <el-table-column :label="t('smtSpotCheck.firstBase.subItemName')" min-width="140">
                        <template #default="{ row }">
                            <el-input v-model="row.SubItemName" size="small" type="textarea"
                                :placeholder="t('smtSpotCheck.firstBase.subItemNamePlaceholder')" />
                        </template>
                    </el-table-column>
                    <el-table-column :label="t('smtSpotCheck.firstBase.subItemMethod')" min-width="120">
                        <template #default="{ row }">
                            <el-input v-model="row.SubItemMethod" size="small" type="textarea"
                                :placeholder="t('smtSpotCheck.firstBase.subItemMethodPlaceholder')" />
                        </template>
                    </el-table-column>
                    <el-table-column :label="t('smtSpotCheck.firstBase.subItemBasic')" min-width="120">
                        <template #default="{ row }">
                            <el-input v-model="row.SubItemBasic" size="small" type="textarea"
                                :placeholder="t('smtSpotCheck.firstBase.subItemBasicPlaceholder')" />
                        </template>
                    </el-table-column>
                    <el-table-column :label="t('smtSpotCheck.firstBase.subItemSolution')" min-width="120">
                        <template #default="{ row }">
                            <el-input v-model="row.SubItemSolution" size="small" type="textarea"
                                :placeholder="t('smtSpotCheck.firstBase.subItemSolutionPlaceholder')" />
                        </template>
                    </el-table-column>
                    <el-table-column :label="t('smtSpotCheck.firstBase.subItemAim')" min-width="120">
                        <template #default="{ row }">
                            <el-input v-model="row.SubItemAim" size="small" type="textarea"
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
            </el-form>
            <template #footer>
                <el-button @click="addDialogCancel">{{ $t("publicText.cancel") }}</el-button>
                <el-button type="primary" @click="submitAdd">{{ $t("publicText.confirm") }}</el-button>
            </template>
        </el-dialog>

        <!-- 编辑工序弹窗（只允许修改内容，不允许增删子项） -->
        <el-dialog :title="$t('publicText.edit')" :lock-scroll="false" v-model="editDialogVisible" width="80%" @close="editDialogCancel"
            align-center :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form :model="editForm" ref="editFormRef" label-width="auto" :rules="formRules">
                <el-row :gutter="20">
                    <el-col :span="12"> <el-form-item :label="t('smtSpotCheck.firstBase.step')" prop="Step">
                            <el-input-number v-model="editForm.Step" disabled style="width: 100%" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12"><el-form-item :label="t('smtSpotCheck.firstBase.name')" prop="Name">
                            <el-input v-model="editForm.Name" :placeholder="t('smtSpotCheck.firstBase.namePlaceholder')"
                                clearable style="width: 100%" />
                        </el-form-item>
                    </el-col>

                </el-row>


                <el-form-item :label="t('smtSpotCheck.firstBase.inspectContent')" prop="InspectContent">
                    <el-input v-model="editForm.InspectContent" type="textarea" :rows="2"
                        :placeholder="t('smtSpotCheck.firstBase.inspectContentPlaceholder')" style="width: 100%" />
                </el-form-item>
                <el-table :data="editForm.StepItemList" border size="small" style="width: 100%" height="400">
                    <el-table-column :label="t('smtSpotCheck.firstBase.subItem')" width="80" prop="SubItem"
                        :align="'center'">
                    </el-table-column>
                    <el-table-column :label="t('smtSpotCheck.firstBase.subItemName')" min-width="140">
                        <template #default="{ row }">
                            <el-input v-model="row.SubItemName" size="small" type="textarea"
                                :placeholder="t('smtSpotCheck.firstBase.subItemNamePlaceholder')" />
                        </template>
                    </el-table-column>
                    <el-table-column :label="t('smtSpotCheck.firstBase.subItemMethod')" min-width="120">
                        <template #default="{ row }">
                            <el-input v-model="row.SubItemMethod" size="small" type="textarea"
                                :placeholder="t('smtSpotCheck.firstBase.subItemMethodPlaceholder')" />
                        </template>
                    </el-table-column>
                    <el-table-column :label="t('smtSpotCheck.firstBase.subItemBasic')" min-width="120">
                        <template #default="{ row }">
                            <el-input v-model="row.SubItemBasic" size="small" type="textarea"
                                :placeholder="t('smtSpotCheck.firstBase.subItemBasicPlaceholder')" />
                        </template>
                    </el-table-column>
                    <el-table-column :label="t('smtSpotCheck.firstBase.subItemSolution')" min-width="120">
                        <template #default="{ row }">
                            <el-input v-model="row.SubItemSolution" size="small" type="textarea"
                                :placeholder="t('smtSpotCheck.firstBase.subItemSolutionPlaceholder')" />
                        </template>
                    </el-table-column>
                    <el-table-column :label="t('smtSpotCheck.firstBase.subItemAim')" min-width="120">
                        <template #default="{ row }">
                            <el-input v-model="row.SubItemAim" size="small" type="textarea"
                                :placeholder="t('smtSpotCheck.firstBase.subItemAimPlaceholder')" />
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <template #footer>
                <el-button @click="editDialogCancel">{{ $t("publicText.cancel") }}</el-button>
                <el-button type="primary" @click="submitEdit">{{ $t("publicText.confirm") }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { GetFinalInspectData, InserFinalInspectData, UpdateFinalInspectData, DeleteFinalInspectData } from "@/api/smtSpotCheck/base/index"
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

// 当前选中的工序行
const currentSelectedRow = ref<any>(null);
// 当前选中工序的子项列表（用于右侧明细）
const currentSubItems = computed(() => {
    if (!currentSelectedRow.value) return [];
    return getSubItemsByStep(currentSelectedRow.value.Step);
});

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
    Name: [{ required: true, message: "请输入工序名称", trigger: "blur" }]
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

// 获取某个工序的最大子项编号
const getMaxSubItemByStep = (step: number) => {
    const subItems = getSubItemsByStep(step);
    if (subItems.length === 0) return 0;
    return Math.max(...subItems.map(item => item.SubItem));
};
// 获取下一个可用的工序编号
const getNextStepNumber = () => {
    if (stepList.value.length === 0) return 1;
    const maxStep = Math.max(...stepList.value.map(item => item.Step));
    return maxStep + 1;
};
// 获取数据
const getData = () => {
    GetFinalInspectData({}).then((res: any) => {
        if (res.Success) {
            rawFlatData.value = res.Data || [];
            stepList.value = generateStepList(rawFlatData.value);
            searchData();
            // 数据刷新后，恢复之前选中的工序
            if (currentSelectedRow.value) {
                const step = currentSelectedRow.value.Step;
                const newRow = stepList.value.find(item => item.Step === step);
                if (newRow) {
                    currentSelectedRow.value = newRow;
                    nextTick(() => {
                        if (eltableRef.value) {
                            eltableRef.value.setCurrentRow(newRow);
                        }
                    });
                } else {
                    currentSelectedRow.value = null;
                }
            }
        } else {
            ElMessage.error(res.Msg || "获取数据失败");
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

// 点击左侧表格行
const handleRowClick = (row: any) => {
    currentSelectedRow.value = row;
};

// ==================== 右侧明细删除子项 ====================
const deleteSubItem = (index: number) => {
    const subItems = currentSubItems.value;
    // if (subItems.length <= 1) {
    //     ElMessage.warning(t('smtSpotCheck.firstBase.cannotDeleteLastSubItem'));
    //     return;
    // }
    const deletedItem = subItems[index];
    ElMessageBox.confirm(`${t('publicText.confirmDelete')}【${deletedItem.SubItemName}】?`, t("publicText.confirm"), {
        confirmButtonText: t("publicText.confirm"),
        cancelButtonText: t("publicText.cancel"),
        type: "warning",
    }).then(() => {
        // 构造删除后的子项列表
        const newSubItems = subItems.filter((_, idx) => idx == index).map(item => ({
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
                    Step: currentSelectedRow.value.Step,
                    Status: "",
                    Name: currentSelectedRow.value.Name,
                    InspectContent: currentSelectedRow.value.InspectContent || "",
                    StepItemList: newSubItems,
                }
            ]
        };
        DeleteFinalInspectData(requestData).then((res: any) => {
            if (res.Success) {
                ElMessage.success(res.Msg || "删除成功");
                getData();
            } else {
                ElMessage.error(res.Msg || "删除失败");
            }
        }).catch(() => {
            ElMessage.error("删除失败");
        });
    }).catch(() => {
        ElMessage.info(t("publicText.cancel"));
    });
};

// ==================== 删除工序 ====================
const handleDelete = (row: any) => {
    ElMessageBox.confirm(`${t('publicText.confirmDelete')}【${row.Step}】?`, t("publicText.confirm"), {
        confirmButtonText: t("publicText.confirm"),
        cancelButtonText: t("publicText.cancel"),
        type: "warning",
    }).then(() => {
        DeleteFinalInspectData({ Step: row.Step }).then((res: any) => {
            if (res.Success) {
                ElMessage.success(res.Msg || "删除成功");
                getData();
            } else {
                ElMessage.error(res.Msg || "删除失败");
            }
        }).catch(() => {
            ElMessage.error("删除失败");
        });
    }).catch(() => {
        ElMessage.info(t("publicText.cancel"));
    });
};

// ==================== 新增逻辑（支持选中自动填充） ====================
const openAdd = () => {
     const nextStep = getNextStepNumber();
    // 重置表单
    addForm.Step = nextStep;
    addForm.Name = "";
    addForm.InspectContent = "";
    // 默认新增一条空子项
    
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
const openAddRow = (row: any) => {
    if (!row) {
        ElMessage.warning(t('smtSpotCheck.firstBase.selectStepFirst'));
        return;
    }
    // 以选中行的工序为基础新增子项
    addForm.Step = row.Step;
    addForm.Name = row.Name;
    addForm.InspectContent = row.InspectContent || "";
    const maxSubItem = getMaxSubItemByStep(row.Step);
    addForm.StepItemList.push({
        SubItem: maxSubItem + 1,
        SubItemName: "",
        SubItemMethod: "",
        SubItemBasic: "",
        SubItemSolution: "",
        SubItemAim: "",
        SubItemStatus: "I",
    });
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
        ElMessage.warning(t('smtSpotCheck.firstBase.cannotDeleteLastSubItem'));
        return;
    }
    addForm.StepItemList.splice(index, 1);
};

const addDialogCancel = () => {
    addFormRef.value?.resetFields();
    addDialogVisible.value = false;
    addForm.StepItemList = [];
};

const validateSubItemUnique = (list: any[]) => {
    const subItems = list.map(item => item.SubItem);
    return subItems.length === new Set(subItems).size;
};

const submitAdd = () => {
    addFormRef.value.validate(async (valid: boolean) => {
        if (!valid) return;

        if (!addForm.StepItemList.length) {
            ElMessage.warning(t('smtSpotCheck.firstBase.atLeastOneSubItem'));
            return;
        }
        for (let i = 0; i < addForm.StepItemList.length; i++) {
            const item = addForm.StepItemList[i];
            if (!item.SubItem) {
                ElMessage.warning(t('smtSpotCheck.firstBase.subItemRequired', { index: i + 1 }));
                return;
            }
            if (!item.SubItemName) {
                ElMessage.warning(t('smtSpotCheck.firstBase.subItemNameRequired', { index: i + 1 }));
                return;
            }
        }
        if (!validateSubItemUnique(addForm.StepItemList)) {
            ElMessage.warning(t('smtSpotCheck.firstBase.subItemUnique'));
            return;
        }

        // 校验工序编号唯一性
        const exists = stepList.value.some(item => item.Step === addForm.Step);

        // if (exists) {
        //     ElMessage.warning(t('smtSpotCheck.firstBase.stepExists', { step: addForm.Step }));
        //     return;
        // }

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
            const res: any = await InserFinalInspectData(requestData);
            if (res.Success) {
                ElMessage.success(res.Msg || t('publicText.addSuccess'));
                addDialogVisible.value = false;
                getData();
            } else {
                ElMessage.error(res.Msg || t('publicText.addFailed'));
            }
        } catch {
            ElMessage.error(t('publicText.addFailed'));
        }
    });
};

// ==================== 编辑逻辑 ====================
const openEdit = (row: any) => {
    const step = row.Step;
    const subItems = getSubItemsByStep(step);
    if (subItems.length === 0) {
        ElMessage.warning(t('smtSpotCheck.firstBase.noSubItemData'));
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
            ElMessage.warning(t('smtSpotCheck.firstBase.atLeastOneSubItem'));
            return;
        }
        for (let i = 0; i < editForm.StepItemList.length; i++) {
            const item = editForm.StepItemList[i];
            if (!item.SubItemName) {
                ElMessage.warning(t('smtSpotCheck.firstBase.subItemNameRequired', { index: i + 1 }));
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
        console.log("更新请求数据：", requestData);
        try {
            const res: any = await UpdateFinalInspectData(requestData);
            if (res.Success) {
                ElMessage.success(res.Msg || t('publicText.updateSuccess'));
                editDialogVisible.value = false;
                getData();
            } else {
                ElMessage.error(res.Msg || t('publicText.updateFailed'));
            }
        } catch {
            ElMessage.error(t('publicText.updateFailed'));
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

.detail-container {
    border: 1px solid #ebeef5;
    border-radius: 4px;
    padding: 12px;
    background-color: #fafafa;
    min-height: 400px;
}

.detail-header {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e4e7ed;
}

.detail-empty {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
}
</style>