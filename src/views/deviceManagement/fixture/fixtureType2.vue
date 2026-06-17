<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between items-center mb-2">
                <el-button type="primary" size="small" @click="addOpen">
                    {{ $t("publicText.add") }}
                </el-button>
                <div class="input_box">
                    <el-input v-model="searchName" style="width: 350px" clearable
                        :placeholder="$t('deviceManage.fixtureType.searchPlaceholder')" @keyup.enter.native="searchData"
                        @clear="clearData" size="small">
                        <template #append>
                            <el-button type="primary" :icon="Search" @click="searchData" />
                        </template>
                    </el-input>
                </div>
            </div>

            <el-table ref="tableRef" :data="paginatedData" border :height="tableHeight"
                style="width: 100%" size="small" stripe highlight-current-row>
                <el-table-column type="index" :label="$t('publicText.index')" width="55" align="center" fixed>
                    <template #default="{ $index }">
                        {{ $index + 1 + (currentPage - 1) * pageSize }}
                    </template>
                </el-table-column>
                <el-table-column prop="Category" :label="$t('deviceManage.fixtureType.category')" fixed width="100"
                    :min-width="getColumnWidth('Category')">
                    <template #default="{ row }">
                        <span v-if="row.Category == 1">{{ $t("deviceManage.fixtureType.printFixture") }}</span>
                        <span v-else-if="row.Category == 2">{{ $t("deviceManage.fixtureType.ictFixture") }}</span>
                        <span v-else-if="row.Category == 3">{{ $t("deviceManage.fixtureType.sample") }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="ToolsMold" :label="$t('deviceManage.fixtureType.code')" fixed
                    :min-width="getColumnWidth('ToolsMold')" />
                <el-table-column prop="MaterialName" :label="$t('deviceManage.fixtureType.description')" fixed
                    :min-width="getColumnWidth('MaterialName')" />
                <el-table-column prop="TotalUses" :label="$t('deviceManage.fixtureType.totalUses')"
                    :min-width="getColumnWidth('TotalUses')" />
                <el-table-column prop="UsesUntilRevalidation" :label="$t('deviceManage.fixtureType.usesUntilRevalidation')"
                    :min-width="getColumnWidth('UsesUntilRevalidation')" />
                <el-table-column prop="PauseUntilRevalidate" :label="$t('deviceManage.fixtureType.pauseUntilRevalidate')"
                    :min-width="getColumnWidth('PauseUntilRevalidate')" />
                <el-table-column prop="TimeUntilRevalidation" :label="$t('deviceManage.fixtureType.timeUntilRevalidation')"
                    :min-width="getColumnWidth('TimeUntilRevalidation')" />
                <el-table-column prop="CleaningTime" :label="$t('deviceManage.fixtureType.cleaningTime')"
                    :min-width="getColumnWidth('CleaningTime')" />
                <el-table-column prop="TensionLimit" :label="$t('deviceManage.fixtureType.tensionLimit')"
                    :min-width="getColumnWidth('TensionLimit')" />
                <el-table-column prop="LowerTensionLimit" :label="$t('deviceManage.fixtureType.lowerTensionLimit')"
                    :min-width="getColumnWidth('LowerTensionLimit')" />
                <el-table-column prop="TensionPoints" :label="$t('deviceManage.fixtureType.tensionPoints')"
                    :min-width="getColumnWidth('TensionPoints')" />
                <el-table-column fixed="right" :label="$t('publicText.operation')" width="120" align="center">
                    <template #default="{ row }">
                        <el-tooltip :content="$t('publicText.edit')" placement="top">
                            <el-button type="primary" :icon="Edit" size="small" @click="handleEdit(row)" />
                        </el-tooltip>
                        <el-tooltip :content="$t('publicText.delete')" placement="top">
                            <el-button type="danger" :icon="Delete" size="small" @click="handleDelete(row)" />
                        </el-tooltip>
                    </template>
                </el-table-column>
                <template #empty>
                    <el-empty :description="$t('publicText.noData')" />
                </template>
            </el-table>

            <div style="margin-top: 8px">
                <el-pagination align="center" background size="small" @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
                    :page-sizes="[5, 10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper"
                    :total="filteredData.length" />
            </div>
        </el-card>

        <!-- 新增对话框 -->
        <el-dialog :title="$t('publicText.add')" v-model="addVisible" width="800px" :close-on-click-modal="false"
            @close="addCancel">
            <el-form ref="addFormRef" :model="addForm" :rules="rules" label-width="auto" size="small">
                <el-form-item :label="$t('deviceManage.fixtureType.category')" prop="category">
                    <el-select v-model="addForm.category" :placeholder="$t('deviceManage.fixtureType.selectCategory')"
                        style="width: 240px" filterable>
                        <el-option v-for="item in categoryList" :key="item.Value" :label="item.Text"
                            :value="item.Value" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('deviceManage.fixtureType.code')" prop="toolsMold">
                    <el-input v-model.trim="addForm.toolsMold" style="width: 240px" />
                </el-form-item>
                <el-form-item :label="$t('deviceManage.fixtureType.description')" prop="materialName">
                    <el-input v-model="addForm.materialName" style="width: 100%" />
                </el-form-item>
                <el-form-item :label="$t('deviceManage.fixtureType.totalUses')" prop="totalUses">
                    <el-input v-model.number="addForm.totalUses" style="width: 240px" type="number" />
                </el-form-item>
                <el-form-item :label="$t('deviceManage.fixtureType.usesUntilRevalidation')">
                    <el-input :disabled="!formControl.cleanAfterUses" v-model.number="addForm.usesUntilRevalidation"
                        style="width: 240px" type="number" />
                    <el-checkbox class="ml-3" v-model="formControl.cleanAfterUses" @change="handleCleanAfterUsesChange">
                        {{ $t("publicText.enable") }}
                    </el-checkbox>
                </el-form-item>
                <el-form-item :label="$t('deviceManage.fixtureType.pauseUntilRevalidate')">
                    <el-input :disabled="!formControl.cleanAfterPause" v-model.number="addForm.pauseUntilRevalidate"
                        style="width: 240px" type="number" />
                    <el-checkbox class="ml-3" v-model="formControl.cleanAfterPause"
                        @change="handleCleanAfterPauseChange">
                        {{ $t("publicText.enable") }}
                    </el-checkbox>
                </el-form-item>
                <el-form-item :label="$t('deviceManage.fixtureType.timeUntilRevalidation')">
                    <el-input :disabled="!formControl.cleanAfterTime" v-model.number="addForm.timeUntilRevalidation"
                        style="width: 240px" type="number" />
                    <el-checkbox class="ml-3" v-model="formControl.cleanAfterTime" @change="handleCleanAfterTimeChange">
                        {{ $t("publicText.enable") }}
                    </el-checkbox>
                </el-form-item>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="$t('deviceManage.fixtureType.cleaningTime')">
                            <el-input v-model.number="addForm.cleaningTime" style="width: 240px" type="number" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('deviceManage.fixtureType.tensionLimit')">
                            <el-input v-model.number="addForm.tensionLimit" type="number" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="$t('deviceManage.fixtureType.tensionPoints')">
                            <el-input v-model.number="addForm.tensionPoints" style="width: 240px" type="number" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('deviceManage.fixtureType.lowerTensionLimit')">
                            <el-input v-model.number="addForm.lowerTensionLimit" type="number" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <el-button @click="addCancel">{{ $t("publicText.cancel") }}</el-button>
                <el-button type="primary" @click="addSubmit" :loading="submitLoading">{{ $t("publicText.confirm")
                }}</el-button>
            </template>
        </el-dialog>

        <!-- 编辑对话框 -->
        <el-dialog :title="$t('publicText.edit')" v-model="editVisible" width="800px" :close-on-click-modal="false"
            @close="editCancel">
            <el-form ref="editFormRef" :model="editForm" :rules="rules" label-width="auto" size="small">
                <el-form-item :label="$t('deviceManage.fixtureType.category')" prop="category">
                    <el-select v-model="editForm.category" :placeholder="$t('deviceManage.fixtureType.selectCategory')"
                        style="width: 240px" filterable>
                        <el-option v-for="item in categoryList" :key="item.Value" :label="item.Text"
                            :value="item.Value" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('deviceManage.fixtureType.code')" prop="toolsMold">
                    <el-input disabled v-model="editForm.toolsMold" style="width: 240px" />
                </el-form-item>
                <el-form-item :label="$t('deviceManage.fixtureType.description')" prop="materialName">
                    <el-input v-model="editForm.materialName" style="width: 100%" />
                </el-form-item>
                <el-form-item :label="$t('deviceManage.fixtureType.totalUses')" prop="totalUses">
                    <el-input disabled v-model.number="editForm.totalUses" style="width: 240px" />
                </el-form-item>
                <el-form-item :label="$t('deviceManage.fixtureType.usesUntilRevalidation')">
                    <el-input :disabled="!editFormControl.cleanAfterUses"
                        v-model.number="editForm.usesUntilRevalidation" style="width: 240px" type="number" />
                    <el-checkbox class="ml-3" v-model="editFormControl.cleanAfterUses" @change="handleEditUsesChange">
                        {{ $t("publicText.enable") }}
                    </el-checkbox>
                </el-form-item>
                <el-form-item :label="$t('deviceManage.fixtureType.pauseUntilRevalidate')">
                    <el-input :disabled="!editFormControl.cleanAfterPause"
                        v-model.number="editForm.pauseUntilRevalidate" style="width: 240px" type="number" />
                    <el-checkbox class="ml-3" v-model="editFormControl.cleanAfterPause" @change="handleEditPauseChange">
                        {{ $t("publicText.enable") }}
                    </el-checkbox>
                </el-form-item>
                <el-form-item :label="$t('deviceManage.fixtureType.timeUntilRevalidation')">
                    <el-input :disabled="!editFormControl.cleanAfterTime"
                        v-model.number="editForm.timeUntilRevalidation" style="width: 240px" type="number" />
                    <el-checkbox class="ml-3" v-model="editFormControl.cleanAfterTime" @change="handleEditTimeChange">
                        {{ $t("publicText.enable") }}
                    </el-checkbox>
                </el-form-item>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="$t('deviceManage.fixtureType.cleaningTime')">
                            <el-input v-model.number="editForm.cleaningTime" style="width: 240px" type="number" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('deviceManage.fixtureType.tensionLimit')">
                            <el-input v-model.number="editForm.tensionLimit" type="number" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="$t('deviceManage.fixtureType.tensionPoints')">
                            <el-input v-model.number="editForm.tensionPoints" style="width: 240px" type="number" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('deviceManage.fixtureType.lowerTensionLimit')">
                            <el-input v-model.number="editForm.lowerTensionLimit" type="number" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <el-button @click="editCancel">{{ $t("publicText.cancel") }}</el-button>
                <el-button type="primary" @click="editSubmit" :loading="submitLoading">{{ $t("publicText.confirm")
                }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onBeforeMount, onMounted, onBeforeUnmount, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Search, Edit, Delete } from "@element-plus/icons-vue";
import { useI18n } from "vue-i18n";
import { queryToolsMold, insertToolsMold, updateToolsMold, deleteToolsMold } from "@/api/deviceManage/fixture";
import { calculateColumnsWidth } from "@/utils/tableminWidth";

const { t } = useI18n();

// ---------- 表格数据 ----------
const tableRef = ref();
const tableData = ref([]);          // 原始数据
const filteredData = ref([]);       // 过滤后的数据
const loading = ref(false);
const submitLoading = ref(false);
const tableHeight = ref(0);
const currentPage = ref(1);
const pageSize = ref(50);
const searchName = ref("");

// 分页数据
const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return filteredData.value.slice(start, end);
});

// 类别选项
const categoryList = [
    { Value: "1", Text: t("deviceManage.fixtureType.printFixture") },
    { Value: "2", Text: t("deviceManage.fixtureType.ictFixture") },
    // { Value: "3", Text: t("deviceManage.fixtureType.sample") },
];

// ---------- 动态列宽 ----------
// 定义需要计算宽度的列
const tableColumns = computed(() => {
    if (!tableRef.value) return [];
    // 模拟列配置，也可直接从表格获取，这里手动定义保证准确
    const columns = tableRef.value.columns
        .map((item: any) => ({ prop: item.property, label: item.label }))
        .filter((item: any) => item.label !== t("publicText.index") && item.label !== t("publicText.operation"));
    return columns;
});

const columnWidths = computed(() => {
    return calculateColumnsWidth(tableColumns.value, filteredData.value, { padding: 25, fontSize: 13 });
});

const getColumnWidth = (prop:any) => columnWidths.value[prop] || "auto";

// ---------- 新增表单 ----------
const addVisible = ref(false);
const addFormRef = ref();
const addForm = reactive({
    category: "",
    toolsMold: "",
    materialName: "",
    totalUses: 0,
    usesUntilRevalidation: 0,
    pauseUntilRevalidate: 0,
    timeUntilRevalidation: 0,
    cleaningTime: 0,
    tensionLimit: 0,
    lowerTensionLimit: 0,
    tensionPoints: 0,
    operationType: "I",
});
const formControl = reactive({
    cleanAfterUses: false,
    cleanAfterPause: false,
    cleanAfterTime: false,
});

// ---------- 编辑表单 ----------
const editVisible = ref(false);
const editFormRef = ref();
const editForm = reactive({
    category: "",
    toolsMold: "",
    materialName: "",
    totalUses: 0,
    usesUntilRevalidation: 0,
    pauseUntilRevalidate: 0,
    timeUntilRevalidation: 0,
    cleaningTime: 0,
    tensionLimit: 0,
    lowerTensionLimit: 0,
    tensionPoints: 0,
    operationType: "U",
});
const editFormControl = reactive({
    cleanAfterUses: false,
    cleanAfterPause: false,
    cleanAfterTime: false,
});

// 表单校验规则
const rules = {
    toolsMold: [{ required: true, message: t("message.pleaseInput") + t("deviceManage.fixtureType.code"), trigger: "change" }],
    category: [{ required: true, message: t("message.pleaseSelect") + t("deviceManage.fixtureType.category"), trigger: "change" }],
    materialName: [{ required: true, message: t("message.pleaseInput") + t("deviceManage.fixtureType.description"), trigger: "change" }],
};

// ---------- API 交互 ----------
const getData = async () => {
   
    try {
        const res:any = await queryToolsMold({ toolsMold: "*", remark: "", operationType: "Q" });
        if (res.Success) {
            tableData.value = res.Data || [];
            filteredData.value = [...tableData.value];
        } else {
            ElMessage.error(res.Msg|| t("message.queryFailure"));
        }
    } catch (error) {
        console.error("请求数据失败:", error);
        ElMessage.error(t("message.queryFailure"));
    }
};

// 搜索
const searchData = () => {
    if (!searchName.value.trim()) {
        filteredData.value = [...tableData.value];
    } else {
        const keyword = searchName.value.toLowerCase();
        filteredData.value = tableData.value.filter(
            (item:any) =>
                (item.ToolsMold && item.ToolsMold.toLowerCase().includes(keyword)) ||
                (item.MaterialName && item.MaterialName.toLowerCase().includes(keyword))
        );
    }
    currentPage.value = 1;
};

const clearData = () => {
    searchName.value = "";
    filteredData.value = [...tableData.value];
    currentPage.value = 1;
};

// 新增
const addOpen = () => {
    addVisible.value = true;
};

const addCancel = () => {
    addVisible.value = false;
    addFormRef.value?.resetFields();
    // 重置表单数据
    Object.assign(addForm, {
        category: "",
        toolsMold: "",
        materialName: "",
        totalUses: 0,
        usesUntilRevalidation: 0,
        pauseUntilRevalidate: 0,
        timeUntilRevalidation: 0,
        cleaningTime: 0,
        tensionLimit: 0,
        lowerTensionLimit: 0,
        tensionPoints: 0,
        operationType: "I",
    });
    formControl.cleanAfterUses = false;
    formControl.cleanAfterPause = false;
    formControl.cleanAfterTime = false;
};

const addSubmit = async () => {
    try {
        await addFormRef.value.validate();
        submitLoading.value = true;
        const submitData = {
            ...addForm,
            cleanAfterUses: formControl.cleanAfterUses ? "Y" : "N",
            cleanAfterPause: formControl.cleanAfterPause ? "Y" : "N",
            cleanAfterTime: formControl.cleanAfterTime ? "Y" : "N",
            operationType: "I",
        };
        const res:any = await insertToolsMold(submitData);
        if (res.Success) {
            ElMessage.success(t("message.addSuccess"));
            addVisible.value = false;
            getData();
        } else {
            ElMessage.error(res.Msg|| t("message.addFailure"));
        }
    } catch (error) {
        console.error("提交失败:", error);
    } finally {
        submitLoading.value = false;
    }
};

// 编辑
const handleEdit = (row:any) => {
    editForm.category = row.Category;
    editForm.toolsMold = row.ToolsMold;
    editForm.materialName = row.MaterialName;
    editForm.totalUses = row.TotalUses;
    editForm.usesUntilRevalidation = row.UsesUntilRevalidation;
    editForm.pauseUntilRevalidate = row.PauseUntilRevalidate;
    editForm.timeUntilRevalidation = row.TimeUntilRevalidation;
    editForm.cleaningTime = row.CleaningTime;
    editForm.tensionLimit = row.TensionLimit;
    editForm.lowerTensionLimit = row.LowerTensionLimit;
    editForm.tensionPoints = row.TensionPoints;
    editFormControl.cleanAfterUses = row.UsesUntilRevalidation > 0;
    editFormControl.cleanAfterPause = row.PauseUntilRevalidate > 0;
    editFormControl.cleanAfterTime = row.TimeUntilRevalidation > 0;
    editVisible.value = true;
};

const editCancel = () => {
    editVisible.value = false;
    editFormRef.value?.resetFields();
};

const editSubmit = async () => {
    try {
        await editFormRef.value.validate();
        submitLoading.value = true;
        const submitData = {
            ...editForm,
            cleanAfterUses: editFormControl.cleanAfterUses ? "Y" : "N",
            cleanAfterPause: editFormControl.cleanAfterPause ? "Y" : "N",
            cleanAfterTime: editFormControl.cleanAfterTime ? "Y" : "N",
            operationType: "U",
        };
        const res:any = await updateToolsMold(submitData);
        if (res.Success) {
            ElMessage.success(t("message.editSuccess"));
            editVisible.value = false;
            getData();
        } else {
            ElMessage.error(res.Msg|| t("message.editFailure"));
        }
    } catch (error) {
        console.error("提交失败:", error);
    } finally {
        submitLoading.value = false;
    }
};

// 删除
const handleDelete = (row:any) => {
    ElMessageBox.confirm(
        t("message.confirmDelete", { code: row.ToolsMold, name: row.MaterialName }),
        t("publicText.tip"),
        { confirmButtonText: t("publicText.confirm"), cancelButtonText: t("publicText.cancel"), type: "warning" }
    )
        .then(async () => {
            loading.value = true;
            try {
                const res:any = await deleteToolsMold({ toolsMold: row.ToolsMold, operationType: "D" });
                if (res.Success) {
                    ElMessage.success(t("message.deleteSuccess"));
                    if (filteredData.value.length === 1 && currentPage.value > 1) currentPage.value--;
                    getData();
                } else {
                    ElMessage.error(res.Msg|| t("message.deleteFailure"));
                }
            } catch (error) {
                ElMessage.error(t("message.deleteFailure"));
            } finally {
                loading.value = false;
            }
        })
        .catch(() => {
            ElMessage.info(t("publicText.cancel"));
        });
};

// 新增表单启用复选框逻辑
const handleCleanAfterUsesChange = () => {
    if (!formControl.cleanAfterUses) addForm.usesUntilRevalidation = 0;
};
const handleCleanAfterPauseChange = () => {
    if (!formControl.cleanAfterPause) addForm.pauseUntilRevalidate = 0;
};
const handleCleanAfterTimeChange = () => {
    if (!formControl.cleanAfterTime) addForm.timeUntilRevalidation = 0;
};

// 编辑表单启用复选框逻辑
const handleEditUsesChange = () => {
    if (!editFormControl.cleanAfterUses) editForm.usesUntilRevalidation = 0;
};
const handleEditPauseChange = () => {
    if (!editFormControl.cleanAfterPause) editForm.pauseUntilRevalidate = 0;
};
const handleEditTimeChange = () => {
    if (!editFormControl.cleanAfterTime) editForm.timeUntilRevalidation = 0;
};

// 分页
const handleSizeChange = (val:any) => {
    pageSize.value = val;
    currentPage.value = 1;
};
const handleCurrentChange = (val:any) => {
    currentPage.value = val;
};

// 表格高度自适应
const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 190;
    });
};

// 保留原有Excel导入功能（如需使用可取消注释，注意依赖）
// const readExcelFile = async (num) => { ... };

onBeforeMount(() => {
    getScreenHeight();
    getData();
});

onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
});

onBeforeUnmount(() => {
    window.removeEventListener("resize", getScreenHeight);
});
</script>

<style lang="scss" scoped>

.el-pagination {
  justify-content: center;
}
</style>