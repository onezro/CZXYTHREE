<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between">
                <el-form :model="searchForm" :inline="true" size="small" @submit.native.prevent>
                    <el-form-item :label="t('baseData.smtMachineType.mcType')" prop="MCTYPE" class="mb-2">
                        <el-input v-model="searchForm.MCTYPE" clearable
                            :placeholder="t('baseData.smtMachineType.inputMcType')" style="width: 180px"
                            @keyup.enter="handleSearch" />
                    </el-form-item>
                    <el-form-item :label="t('baseData.smtMachineType.variable')" prop="Variable" class="mb-2">
                        <el-input v-model="searchForm.Variable" clearable
                            :placeholder="t('baseData.smtMachineType.inputVariable')" style="width: 200px"
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
                <el-table-column prop="MCTYPE" :label="t('baseData.smtMachineType.mcType')"
                    :min-width="getColumnWidth('MCTYPE')" />
                <el-table-column prop="Variable" :label="t('baseData.smtMachineType.variable')"
                    :min-width="getColumnWidth('Variable')" />
                <el-table-column prop="Description" :label="t('baseData.smtMachineType.description')"
                    :min-width="getColumnWidth('Description')" />
                <el-table-column prop="OperatorID" :label="t('baseData.smtMachineType.operatorId')"
                    :min-width="getColumnWidth('OperatorID')" />
                <el-table-column prop="Timestamp" :label="t('baseData.smtMachineType.timestamp')"
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
        <el-dialog :title="t('publicText.add')" v-model="addDialogVisible" width="500px" :close-on-click-modal="false"
            @closed="handleAddDialogClosed">
            <el-form ref="addFormRef" :model="addForm" :rules="formRules" label-width="auto">
                <el-form-item :label="t('baseData.smtMachineType.mcType')" prop="MCTYPE">
                    <el-input v-model="addForm.MCTYPE" :placeholder="t('baseData.smtMachineType.inputMcType')"
                        clearable />
                </el-form-item>
                <el-form-item :label="t('baseData.smtMachineType.variable')" prop="Variable">
                    <el-input v-model="addForm.Variable" :placeholder="t('baseData.smtMachineType.inputVariable')"
                        clearable />
                </el-form-item>
                <el-form-item :label="t('baseData.smtMachineType.description')" prop="Description">
                    <el-input v-model="addForm.Description"
                        :placeholder="t('baseData.smtMachineType.inputDescription')" type="textarea" :rows="3" />
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
        <el-dialog :title="t('publicText.edit')" v-model="editDialogVisible" width="500px" :close-on-click-modal="false"
            @closed="handleEditDialogClosed">
            <el-form ref="editFormRef" :model="editForm" :rules="formRules" label-width="auto">
                <el-form-item :label="t('baseData.smtMachineType.mcType')" prop="MCTYPE">
                    <el-input v-model="editForm.MCTYPE" disabled />
                </el-form-item>
                <el-form-item :label="t('baseData.smtMachineType.variable')" prop="Variable">
                    <el-input v-model="editForm.Variable" disabled />
                </el-form-item>
                <el-form-item :label="t('baseData.smtMachineType.description')" prop="Description">
                    <el-input v-model="editForm.Description"
                        :placeholder="t('baseData.smtMachineType.inputDescription')" type="textarea" :rows="3" />
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
    GetMachineTypeById,
    AddMachineType,
    UpdateMachineType,
    DeleteMachineType,
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

const searchForm = reactive({
    MCTYPE: "",
    Variable: "",
});

const pageObj = reactive({
    currentPage: 1,
    pageSize: 50,
});

const addForm = reactive({
     ID: 0,
    MCTYPE: "",
    Variable: "",
    Description: "",
});

const editForm = reactive({
    ID: 0,
    MCTYPE: "",
    Variable: "",
    Description: "",
    OperatorID: "",
    Timestamp: "",
});

const formRules = reactive({
    MCTYPE: [
        {
            required: true,
            message: t("baseData.smtMachineType.inputMcType"),
            trigger: "blur",
        },
    ],
    Variable: [
        {
            required: true,
            message: t("baseData.smtMachineType.inputVariable"),
            trigger: "blur",
        },
    ],
});

const pagedData = computed(() => {
    const start = (pageObj.currentPage - 1) * pageObj.pageSize;
    return allData.value.slice(start, start + pageObj.pageSize);
});

const { getColumnWidth } = useTableColumnWidth(eltableRef, allData, {
    excludeLabels: [t("publicText.index"), t("publicText.operation")],
});

const getData = () => {
    GetMachineTypeById({})
        .then((res: any) => {
            if (res.Success && res.Data) {
                let list = res.Data;
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

const resetAddForm = () => {
    addForm.MCTYPE = "";
    addForm.Variable = "";
    addForm.Description = "";
};

const resetEditForm = () => {
    editForm.ID = 0;
    editForm.MCTYPE = "";
    editForm.Variable = "";
    editForm.Description = "";
    editForm.OperatorID = "";
    editForm.Timestamp = "";
};

const openAdd = () => {
    resetAddForm();
    addDialogVisible.value = true;
};

const openEdit = (row: any) => {
    editForm.ID = row.ID;
    editForm.MCTYPE = row.MCTYPE || "";
    editForm.Variable = row.Variable || "";
    editForm.Description = row.Description || "";
    editForm.OperatorID = row.OperatorID || "";
    editForm.Timestamp = row.Timestamp || "";
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
            ID:0,
            MCTYPE: addForm.MCTYPE,
            Variable: addForm.Variable,
            Description: addForm.Description,
            OperatorID: userStore.getUserInfo || "",
            Timestamp: now,
        };
        AddMachineType(params)
            .then((res: any) => {
                if (res.Success) {
                    ElMessage.success(t("baseData.smtMachineType.addSuccess"));
                    addDialogVisible.value = false;
                    getData();
                } else {
                    ElMessage.error(res.Message || t("baseData.smtMachineType.addFailed"));
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
            MCTYPE: editForm.MCTYPE,
            Variable: editForm.Variable,
            Description: editForm.Description,
            OperatorID: userStore.getUserInfo || "",
            Timestamp: now,
        };
        UpdateMachineType(params)
            .then((res: any) => {
                if (res.Success) {
                    ElMessage.success(t("baseData.smtMachineType.editSuccess"));
                    editDialogVisible.value = false;
                    getData();
                } else {
                    ElMessage.error(res.Message || t("baseData.smtMachineType.editFailed"));
                }
            })
            .finally(() => {
                submitLoading.value = false;
            });
    });
};

const handleDelete = (row: any) => {
    ElMessageBox.confirm(
        t("baseData.smtMachineType.deleteConfirm"),
        t("publicText.tip"),
        {
            confirmButtonText: t("publicText.confirm"),
            cancelButtonText: t("publicText.cancel"),
            type: "warning",
        }
    )
        .then(() => {
            DeleteMachineType({ ID: row.ID })
                .then((res: any) => {
                    if (res.Success) {
                        ElMessage.success(t("baseData.smtMachineType.deleteSuccess"));
                        if (pagedData.value.length === 1 && pageObj.currentPage > 1) {
                            pageObj.currentPage--;
                        }
                        getData();
                    } else {
                        ElMessage.error(res.Message || t("baseData.smtMachineType.deleteFailed"));
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
