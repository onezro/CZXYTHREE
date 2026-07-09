<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between">
                <el-form ref="formRef" :model="searchForm" label-width="auto" :inline="true" :size="'small'"
                    @submit.native.prevent>
                    <el-form-item :label="$t('AGV.workstation.workstationID')" prop="workstationID" class="mb-2">
                        <el-input v-model="searchForm.workstationID" clearable @clear="handleSearch"
                            @keyup.enter.native="handleSearch" style="width: 200px"
                            :placeholder="$t('AGV.workstation.inputWorkstationID')" />
                    </el-form-item>
                    <el-form-item class="mb-2">
                        <el-button :type="'primary'" @click="handleSearch">{{
                            t("publicText.query")
                            }}</el-button>
                    </el-form-item>
                </el-form>
                <div>
                    <el-button type="warning" size="small" @click="openAdd">{{
                        t("publicText.add")
                        }}</el-button>
                </div>
            </div>
            <el-table :data="tableData" size="small" ref="eltableRef" :style="{ width: '100%' }" :height="tableHeight"
                :tooltip-effect="'dark'" border fit highlight-current-row >
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{
                            scope.$index + pageObj.pageSize * (pageObj.currentPage - 1) + 1
                            }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="workstationID" fixed :label="$t('AGV.workstation.workstationID')"
                    :min-width="getColumnWidth('workstationID')" />
                <el-table-column prop="name" :label="$t('AGV.workstation.name')" 
                    :min-width="getColumnWidth('name')" />
                <el-table-column prop="area" :label="$t('AGV.workstation.area')" 
                    :min-width="getColumnWidth('area')" />
                <el-table-column prop="remark" :label="$t('AGV.workstation.remark')" 
                    :min-width="getColumnWidth('remark')" />
                <el-table-column prop="cr_user" :label="$t('AGV.workstation.crUser')" 
                    :min-width="getColumnWidth('cr_user')" />
                <el-table-column prop="cr_date" :label="$t('AGV.workstation.crDate')" 
                    :min-width="getColumnWidth('cr_date')">
                    <template #default="{ row }">
                        {{ formatDate(row.cr_date) }}
                    </template>
                </el-table-column>
                <el-table-column prop="ud_date" :label="$t('AGV.workstation.udDate')" 
                    :min-width="getColumnWidth('ud_date')">
                    <template #default="{ row }">
                        {{ formatDate(row.ud_date) }}
                    </template>
                </el-table-column>
                <el-table-column :label="$t('publicText.operation')" :fixed="'right'" width="130" align="center">
                    <template #default="{ row }">
                        <el-tooltip :content="$t('publicText.edit')" placement="top">
                            <el-button size="small" type="primary" @click="openEdit(row)" icon="Edit"/>
                        </el-tooltip>
                        <el-tooltip :content="$t('publicText.delete')" placement="top">
                            <el-button size="small" type="danger" @click="handleDelete(row)" icon="Delete" />
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
                    @current-change="handleCurrentChange" :pager-count="5" :current-page="pageObj.currentPage"
                    :page-size="pageObj.pageSize" :page-sizes="[10, 20, 30, 50, 100]"
                    layout="total,sizes, prev, pager, next" :total="total">
                </el-pagination>
            </div>
        </el-card>

        <!-- 新增对话框 -->
        <el-dialog :title="t('publicText.add')" v-model="addVisible" width="500px" :close-on-click-modal="false"
            @closed="handleAddDialogClosed">
            <el-form ref="addFormRef" :model="addForm" :rules="formRules" label-width="auto">
                <el-form-item :label="$t('AGV.workstation.name')" prop="name">
                    <el-input v-model="addForm.name"
                        :placeholder="$t('AGV.workstation.inputName')" clearable />
                </el-form-item>
                <el-form-item :label="$t('AGV.workstation.area')" prop="area">
                    <el-input v-model="addForm.area"
                        :placeholder="$t('AGV.workstation.inputArea')" clearable />
                </el-form-item>
                <el-form-item :label="$t('AGV.workstation.remark')" prop="remark">
                    <el-input v-model="addForm.remark"
                        :placeholder="$t('AGV.workstation.inputRemark')" clearable type="textarea" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="addVisible = false">{{ t("publicText.cancel") }}</el-button>
                    <el-button type="primary" @click="submitAdd" :loading="submitLoading">{{
                        t("publicText.confirm")
                        }}</el-button>
                </div>
            </template>
        </el-dialog>

        <!-- 编辑对话框 -->
        <el-dialog :title="t('publicText.edit')" v-model="editVisible" width="500px" :close-on-click-modal="false"
            @closed="handleEditDialogClosed">
            <el-form ref="editFormRef" :model="editForm" :rules="formRules" label-width="auto">
                <el-form-item :label="$t('AGV.workstation.workstationID')" prop="workstationID">
                    <el-input v-model="editForm.workstationID" disabled />
                </el-form-item>
                <el-form-item :label="$t('AGV.workstation.name')" prop="name">
                    <el-input v-model="editForm.name"
                        :placeholder="$t('AGV.workstation.inputName')" clearable />
                </el-form-item>
                <el-form-item :label="$t('AGV.workstation.area')" prop="area">
                    <el-input v-model="editForm.area"
                        :placeholder="$t('AGV.workstation.inputArea')" clearable />
                </el-form-item>
                <el-form-item :label="$t('AGV.workstation.remark')" prop="remark">
                    <el-input v-model="editForm.remark"
                        :placeholder="$t('AGV.workstation.inputRemark')" clearable type="textarea" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="editVisible = false" size="small">{{ t("publicText.cancel") }}</el-button>
                    <el-button type="primary" @click="submitEdit" size="small" :loading="submitLoading">{{
                        t("publicText.confirm")
                        }}</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { InsertUpdateWorkstation, DeleteWorkstation, QueryWorkstation } from "@/api/AGV/index"
import {
    ref,
    reactive,
    nextTick,
    onMounted,
    onBeforeMount,
    onBeforeUnmount,
} from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { useTableColumnWidth } from '@/hooks/useTableColumnWidth';
import dayjs from 'dayjs';
import { useI18n } from "vue-i18n";

const userStore = useUserStoreWithOut();
const { t } = useI18n();

const loading = ref(false);
const submitLoading = ref(false);
const tableHeight = ref(0);
const eltableRef = ref();
const tableData = ref<any[]>([]);
const total = ref(0);

const searchForm = reactive({
    workstationID: "",
});

const pageObj = reactive({
    currentPage: 1,
    pageSize: 50,
});

const addForm = reactive({
    name: "",
    area: "",
    remark: "",
});

const editForm = reactive({
    workstationID: 0,
    name: "",
    area: "",
    remark: "",
});

const addVisible = ref(false);
const editVisible = ref(false);
const addFormRef = ref();
const editFormRef = ref();

const formRules = reactive({
    name: [
        {
            required: true,
            message: t("message.pleaseInput") + t("AGV.workstation.name"),
            trigger: "blur",
        },
    ],
    area: [
        {
            required: true,
            message: t("message.pleaseInput") + t("AGV.workstation.area"),
            trigger: "blur",
        },
    ],
});

const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === "1900-01-01T00:00:00") return "-";
    return dayjs(dateStr).format("YYYY-MM-DD HH:mm:ss");
};

const { getColumnWidth } = useTableColumnWidth(eltableRef, tableData, {
    excludeLabels: [t('publicText.index'), t('publicText.operation')]
});

const getData = () => {
    loading.value = true;
    const params = {
        workstationID: searchForm.workstationID || "",
        PageIndex: pageObj.currentPage,
        PageSize: pageObj.pageSize,
    };
    QueryWorkstation(params)
        .then((res: any) => {
            if (res.Data) {
                tableData.value = res.Data.rows || [];
                total.value = res.Data.total || 0;
            } else {
                tableData.value = [];
                total.value = 0;
                ElMessage.warning(res.Message || t("message.queryFailure"));
            }
        })
        .catch(() => {
            tableData.value = [];
            total.value = 0;
        })
        .finally(() => {
            loading.value = false;
        });
};

const handleSearch = () => {
    pageObj.currentPage = 1;
    getData();
};

const handleSizeChange = (val: number) => {
    pageObj.pageSize = val;
    pageObj.currentPage = 1;
    getData();
};

const handleCurrentChange = (val: number) => {
    pageObj.currentPage = val;
    getData();
};

const openAdd = () => {
    addForm.name = "";
    addForm.area = "";
    addForm.remark = "";
    addVisible.value = true;
};

const handleAddDialogClosed = () => {
    addFormRef.value?.resetFields();
};

const submitAdd = () => {
    addFormRef.value.validate((valid: boolean) => {
        if (valid) {
            submitLoading.value = true;
            const params = {
                name: addForm.name,
                area: addForm.area,
                remark: addForm.remark,
                UserNo: userStore.getUserInfo || "",
            };
            InsertUpdateWorkstation(params)
                .then((res: any) => {
                    if (res.Success) {
                        ElMessage.success(t("message.addSuccess"));
                        addVisible.value = false;
                        pageObj.currentPage = 1;
                        getData();
                    } else {
                        ElMessage.error(res.Message || t("message.addFailure"));
                    }
                })
                .finally(() => {
                    submitLoading.value = false;
                });
        }
    });
};

const openEdit = (row: any) => {
    editForm.workstationID = row.workstationID;
    editForm.name = row.name;
    editForm.area = row.area;
    editForm.remark = row.remark || "";
    editVisible.value = true;
};

const handleEditDialogClosed = () => {
    editFormRef.value?.resetFields();
};

const submitEdit = () => {
    editFormRef.value.validate((valid: boolean) => {
        if (valid) {
            submitLoading.value = true;
            const params = {
                workstationID: editForm.workstationID,
                name: editForm.name,
                area: editForm.area,
                remark: editForm.remark,
                UserNo: userStore.getUserInfo || "",
            };
            InsertUpdateWorkstation(params)
                .then((res: any) => {
                    if (res.Success) {
                        ElMessage.success(t("message.editSuccess"));
                        editVisible.value = false;
                        getData();
                    } else {
                        ElMessage.error(res.Message || t("message.editFailure"));
                    }
                })
                .finally(() => {
                    submitLoading.value = false;
                });
        }
    });
};

const handleDelete = (row: any) => {
    ElMessageBox.confirm(
        `${t("publicText.confirm")}${t("publicText.delete")}【${row.name}】?`,
        t("publicText.tip"),
        {
            confirmButtonText: t("publicText.confirm"),
            cancelButtonText: t("publicText.cancel"),
            type: "warning",
        }
    )
        .then(() => {
            loading.value = true;
            DeleteWorkstation({
                workstationID: row.workstationID,
                UserNo: userStore.getUserInfo || "",
            })
                .then((res: any) => {
                    if (res.Success) {
                        ElMessage.success(t("message.deleteSuccess"));
                        if (tableData.value.length === 1 && pageObj.currentPage > 1) {
                            pageObj.currentPage--;
                        }
                        getData();
                    } else {
                        ElMessage.error(res.Message || t("message.deleteFailure"));
                    }
                })
                .finally(() => {
                    loading.value = false;
                });
        })
        .catch(() => {
            ElMessage.info(t("publicText.cancel"));
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