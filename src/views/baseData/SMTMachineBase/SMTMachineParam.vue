<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between">
                <el-form :model="searchForm" :inline="true" size="small" @submit.native.prevent>
                    <el-form-item :label="t('baseData.smtMachineParam.mcId')" prop="MCID" class="mb-2">
                        <el-input v-model.number="searchForm.MCID" clearable
                            :placeholder="t('baseData.smtMachineParam.inputMcId')" style="width: 180px"
                            @keyup.enter="handleSearch" type="number" />
                    </el-form-item>
                    <el-form-item :label="t('baseData.smtMachineParam.mcType')" prop="MCTYPE" class="mb-2">
                        <el-select v-model="searchForm.MCTYPE" clearable filterable
                            :placeholder="t('baseData.smtMachineParam.selectMcType')" style="width: 180px">
                            <el-option v-for="item in machineTypeList" :key="item.ID"
                                :label="item.MCTYPE" :value="item.MCTYPE" />
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="t('baseData.smtMachineParam.variable')" prop="Variable" class="mb-2">
                        <el-input v-model="searchForm.Variable" clearable
                            :placeholder="t('baseData.smtMachineParam.inputVariable')" style="width: 200px"
                            @keyup.enter="handleSearch" />
                    </el-form-item>
                    <el-form-item class="mb-2">
                        <el-button type="primary" @click="handleSearch">{{ t('publicText.query') }}</el-button>
                        <el-button @click="handleReset">{{ t('publicText.reset') }}</el-button>
                    </el-form-item>
                </el-form>
                <div class="mb-2">
                    <el-button type="warning" size="small" @click="openAdd">{{ t('publicText.add') }}</el-button>
                </div>
            </div>
            <el-table ref="eltableRef" :data="pagedData" size="small" border fit highlight-current-row
                :height="tableHeight" style="width: 100%" :tooltip-effect="'dark'">
                <el-table-column type="index" align="center" fixed :label="t('publicText.index')" width="55">
                    <template #default="scope">
                        <span>{{ scope.$index + (pageObj.currentPage - 1) * pageObj.pageSize + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="MCID" :label="t('baseData.smtMachineParam.mcId')" width="100" align="center" />
                <el-table-column prop="MCTYPE" :label="t('baseData.smtMachineParam.mcType')"
                    :min-width="getColumnWidth('MCTYPE')" />
                <el-table-column prop="Variable" :label="t('baseData.smtMachineParam.variable')"
                    :min-width="getColumnWidth('Variable')" />
                <el-table-column prop="Value" :label="t('baseData.smtMachineParam.value')"
                    :min-width="getColumnWidth('Value')" />
                <el-table-column prop="Description" :label="t('baseData.smtMachineParam.description')"
                    :min-width="getColumnWidth('Description')" />
                <el-table-column prop="OperatorID" :label="t('baseData.smtMachineParam.operatorId')"
                    :min-width="getColumnWidth('OperatorID')" />
                <el-table-column prop="Timestamp" :label="t('baseData.smtMachineParam.timestamp')"
                    :min-width="getColumnWidth('Timestamp')" />
                <el-table-column :label="t('publicText.operation')" fixed="right" width="130" align="center">
                    <template #default="{ row }">
                        <el-tooltip :content="t('publicText.edit')" placement="top">
                            <el-button size="small" type="primary" icon="Edit" @click="openEdit(row)" />
                        </el-tooltip>
                        <el-tooltip :content="t('publicText.delete')" placement="top">
                            <el-button size="small" type="danger" icon="Delete" @click="handleDelete(row)" />
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
                <el-pagination size="small" background @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :pager-count="5"
                    :current-page="pageObj.currentPage" :page-size="pageObj.pageSize"
                    :page-sizes="[10, 20, 30, 50, 100]"
                    layout="total, sizes, prev, pager, next" :total="total" />
            </div>
        </el-card>

        <!-- 新增弹窗 -->
        <el-dialog :title="t('publicText.add')" v-model="addDialogVisible" width="550px" :close-on-click-modal="false"
            @closed="handleAddDialogClosed">
            <el-form ref="addFormRef" :model="addForm" :rules="formRules" label-width="auto">
                <el-form-item :label="t('baseData.smtMachineParam.mcId')" prop="MCID">
                    <el-input v-model.number="addForm.MCID" :placeholder="t('baseData.smtMachineParam.inputMcId')"
                        type="number" />
                </el-form-item>
                <el-form-item :label="t('baseData.smtMachineParam.mcType')" prop="MCTYPE">
                    <el-select v-model="addForm.MCTYPE" :placeholder="t('baseData.smtMachineParam.selectMcType')"
                        @change="handleAddMcTypeChange">
                        <el-option v-for="item in machineTypeList" :key="item.ID"
                            :label="item.MCTYPE" :value="item.MCTYPE" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="t('baseData.smtMachineParam.variable')" prop="Variable">
                    <el-select v-model="addForm.Variable" :placeholder="t('baseData.smtMachineParam.selectVariable')"
                        @change="handleAddVariableChange">
                        <el-option v-for="item in addFilteredVariableList" :key="item.Variable"
                            :label="item.Variable" :value="item.Variable" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="t('baseData.smtMachineParam.value')" prop="Value">
                    <el-input v-model="addForm.Value" :placeholder="t('baseData.smtMachineParam.inputValue')" />
                </el-form-item>
                <el-form-item :label="t('baseData.smtMachineParam.description')" prop="Description">
                    <el-input v-model="addForm.Description" disabled />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="addDialogVisible = false">{{ t('publicText.cancel') }}</el-button>
                <el-button type="primary" @click="submitAddForm" :loading="submitLoading">
                    {{ t('publicText.confirm') }}
                </el-button>
            </template>
        </el-dialog>

        <!-- 修改弹窗 -->
        <el-dialog :title="t('publicText.edit')" v-model="editDialogVisible" width="550px" :close-on-click-modal="false"
            @closed="handleEditDialogClosed">
            <el-form ref="editFormRef" :model="editForm" :rules="formRules" label-width="auto">
                <el-form-item :label="t('baseData.smtMachineParam.mcId')" prop="MCID">
                    <el-input v-model.number="editForm.MCID" disabled type="number" />
                </el-form-item>
                <el-form-item :label="t('baseData.smtMachineParam.mcType')" prop="MCTYPE">
                    <el-select v-model="editForm.MCTYPE" :placeholder="t('baseData.smtMachineParam.selectMcType')"
                        disabled>
                        <el-option v-for="item in machineTypeList" :key="item.ID"
                            :label="item.MCTYPE" :value="item.MCTYPE" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="t('baseData.smtMachineParam.variable')" prop="Variable">
                    <el-select v-model="editForm.Variable" :placeholder="t('baseData.smtMachineParam.selectVariable')"
                        disabled>
                        <el-option v-for="item in editFilteredVariableList" :key="item.Variable"
                            :label="item.Variable" :value="item.Variable" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="t('baseData.smtMachineParam.value')" prop="Value">
                    <el-input v-model="editForm.Value" :placeholder="t('baseData.smtMachineParam.inputValue')" />
                </el-form-item>
                <el-form-item :label="t('baseData.smtMachineParam.description')" prop="Description">
                    <el-input v-model="editForm.Description" disabled />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="editDialogVisible = false">{{ t('publicText.cancel') }}</el-button>
                <el-button type="primary" @click="submitEditForm" :loading="submitLoading">
                    {{ t('publicText.confirm') }}
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import {
    GetMachineSettingById,
    AddMachineSetting,
    UpdateMachineSetting,
    DeleteMachineSetting,
    GetMachineTypeById,
} from "@/api/baseData/SMTMachineBase";
import { ref, reactive, computed, nextTick, onMounted, onBeforeMount, onBeforeUnmount } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import dayjs from "dayjs";
import { useI18n } from "vue-i18n";

const userStore = useUserStoreWithOut();
const { t } = useI18n();

const submitLoading = ref(false);
const tableHeight = ref(0);
const eltableRef = ref();
const allData = ref<any[]>([]);
const total = ref(0);
const addDialogVisible = ref(false);
const editDialogVisible = ref(false);
const addFormRef = ref();
const editFormRef = ref();
const machineTypeList = ref<any[]>([]);

const searchForm = reactive({
    MCID: "",
    MCTYPE: "",
    Variable: "",
});

const pageObj = reactive({
    currentPage: 1,
    pageSize: 50,
});

const addForm = reactive({
    MCID: 0,
    MCTYPE: "",
    Variable: "",
    Value: "",
    Description: "",
});

const editForm = reactive({
    ID: 0,
    MCID: 0,
    MCTYPE: "",
    Variable: "",
    Value: "",
    Description: "",
    OperatorID: "",
    Timestamp: "",
});

const formRules = reactive({
    MCID: [
        {
            required: true,
            message: t("baseData.smtMachineParam.inputMcId"),
            trigger: "blur",
        },
    ],
    MCTYPE: [
        {
            required: true,
            message: t("baseData.smtMachineParam.selectMcType"),
            trigger: "change",
        },
    ],
    Variable: [
        {
            required: true,
            message: t("baseData.smtMachineParam.selectVariable"),
            trigger: "change",
        },
    ],
});

const pagedData = computed(() => {
    const start = (pageObj.currentPage - 1) * pageObj.pageSize;
    return allData.value.slice(start, start + pageObj.pageSize);
});

const addFilteredVariableList = computed(() => {
    if (!addForm.MCTYPE) return [];
    return machineTypeList.value.filter((item: any) => item.MCTYPE === addForm.MCTYPE);
});

const editFilteredVariableList = computed(() => {
    if (!editForm.MCTYPE) return [];
    return machineTypeList.value.filter((item: any) => item.MCTYPE === editForm.MCTYPE);
});

const { getColumnWidth } = useTableColumnWidth(eltableRef, allData, {
    excludeLabels: [t("publicText.index"), t("publicText.operation")],
});

const getMachineTypeList = () => {
    GetMachineTypeById({}).then((res: any) => {
        if (res.Success && res.Data) {
            machineTypeList.value = res.Data;
        }
    });
};

const getData = () => {
    GetMachineSettingById({})
        .then((res: any) => {
            if (res.Success && res.Data) {
                let list = res.Data;
                if (searchForm.MCID) {
                    list = list.filter((item: any) => item.MCID === searchForm.MCID);
                }
                if (searchForm.MCTYPE) {
                    list = list.filter((item: any) =>
                        item.MCTYPE?.toLowerCase().includes(searchForm.MCTYPE.toLowerCase())
                    );
                }
                if (searchForm.Variable) {
                    list = list.filter((item: any) =>
                        item.Variable?.toLowerCase().includes(searchForm.Variable.toLowerCase())
                    );
                }
                allData.value = list;
                total.value = list.length;
            } else {
                allData.value = [];
                total.value = 0;
                if (!res.Success) {
                    ElMessage.warning(res.Message || t("message.queryFailure"));
                }
            }
        })
        .catch(() => {
            allData.value = [];
            total.value = 0;
        });
};

const handleSearch = () => {
    pageObj.currentPage = 1;
    getData();
};

const handleReset = () => {
    searchForm.MCID = "";
    searchForm.MCTYPE = "";
    searchForm.Variable = "";
    pageObj.currentPage = 1;
    getData();
};

const handleSizeChange = (val: number) => {
    pageObj.pageSize = val;
    pageObj.currentPage = 1;
};

const handleCurrentChange = (val: number) => {
    pageObj.currentPage = val;
};

const handleAddMcTypeChange = () => {
    addForm.Variable = "";
    addForm.Description = "";
};

const handleAddVariableChange = (value: string) => {
    const selectedItem = addFilteredVariableList.value.find((item: any) => item.Variable === value);
    if (selectedItem) {
        addForm.Description = selectedItem.Description || "";
    }
};

const resetAddForm = () => {
    addForm.MCID = 0;
    addForm.MCTYPE = "";
    addForm.Variable = "";
    addForm.Value = "";
    addForm.Description = "";
};

const resetEditForm = () => {
    editForm.ID = 0;
    editForm.MCID = 0;
    editForm.MCTYPE = "";
    editForm.Variable = "";
    editForm.Value = "";
    editForm.Description = "";
    editForm.OperatorID = "";
    editForm.Timestamp = "";
};

const openAdd = () => {
    resetAddForm();
    getMachineTypeList();
    addDialogVisible.value = true;
};

const openEdit = (row: any) => {
    editForm.ID = row.ID;
    editForm.MCID = row.MCID || 0;
    editForm.MCTYPE = row.MCTYPE || "";
    editForm.Variable = row.Variable || "";
    editForm.Value = row.Value || "";
    editForm.Description = row.Description || "";
    editForm.OperatorID = row.OperatorID || "";
    editForm.Timestamp = row.Timestamp || "";
    getMachineTypeList();
    editDialogVisible.value = true;
};

const handleAddDialogClosed = () => {
    addFormRef.value?.resetFields();
    resetAddForm();
};

const handleEditDialogClosed = () => {
    editFormRef.value?.resetFields();
    resetEditForm();
};

const submitAddForm = () => {
    addFormRef.value.validate((valid: boolean) => {
        if (!valid) return;
        submitLoading.value = true;
        const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
        const params = {
            MCID: addForm.MCID,
            MCTYPE: addForm.MCTYPE,
            Variable: addForm.Variable,
            Value: addForm.Value,
            Description: addForm.Description,
            OperatorID: userStore.getUserInfo || "",
            Timestamp: now,
        };
        AddMachineSetting(params)
            .then((res: any) => {
                if (res.Success) {
                    ElMessage.success(t("baseData.smtMachineParam.addSuccess"));
                    addDialogVisible.value = false;
                    getData();
                } else {
                    ElMessage.error(res.Message || t("baseData.smtMachineParam.addFailed"));
                }
            })
            .finally(() => {
                submitLoading.value = false;
            });
    });
};

const submitEditForm = () => {
    editFormRef.value.validate((valid: boolean) => {
        if (!valid) return;
        submitLoading.value = true;
        const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
        const params = {
            ID: editForm.ID,
            MCID: editForm.MCID,
            MCTYPE: editForm.MCTYPE,
            Variable: editForm.Variable,
            Value: editForm.Value,
            Description: editForm.Description,
            OperatorID: userStore.getUserInfo || "",
            Timestamp: now,
        };
        UpdateMachineSetting(params)
            .then((res: any) => {
                if (res.Success) {
                    ElMessage.success(t("baseData.smtMachineParam.editSuccess"));
                    editDialogVisible.value = false;
                    getData();
                } else {
                    ElMessage.error(res.Message || t("baseData.smtMachineParam.editFailed"));
                }
            })
            .finally(() => {
                submitLoading.value = false;
            });
    });
};

const handleDelete = (row: any) => {
    ElMessageBox.confirm(
        t("baseData.smtMachineParam.deleteConfirm"),
        t("publicText.tip"),
        {
            confirmButtonText: t("publicText.confirm"),
            cancelButtonText: t("publicText.cancel"),
            type: "warning",
        }
    )
        .then(() => {
            DeleteMachineSetting({ ID: row.ID })
                .then((res: any) => {
                    if (res.Success) {
                        ElMessage.success(t("baseData.smtMachineParam.deleteSuccess"));
                        if (pagedData.value.length === 1 && pageObj.currentPage > 1) {
                            pageObj.currentPage--;
                        }
                        getData();
                    } else {
                        ElMessage.error(res.Message || t("baseData.smtMachineParam.deleteFailed"));
                    }
                });
        });
};

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
    getMachineTypeList();
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
