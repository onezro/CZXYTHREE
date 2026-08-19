<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between">
                <el-form :model="searchForm" :inline="true" size="small" @submit.prevent>
                    <el-form-item :label="t('baseData.boxBase.boxCode')" prop="box_code" class="mb-2">
                        <el-input v-model="searchForm.box_code" clearable
                            :placeholder="t('baseData.boxBase.inputBoxCode')" style="width: 180px"
                            @keyup.enter="handleSearch" />
                    </el-form-item>
                    <el-form-item :label="t('baseData.boxBase.boxName')" prop="box_name" class="mb-2">
                        <el-input v-model="searchForm.box_name" clearable
                            :placeholder="t('baseData.boxBase.inputBoxName')" style="width: 180px"
                            @keyup.enter="handleSearch" />
                    </el-form-item>
                    <el-form-item class="mb-2">
                        <el-button type="primary" @click="handleSearch">{{ t('publicText.query') }}</el-button>
                    </el-form-item>
                </el-form>
                <div class="mb-2">
                    <el-button type="warning" size="small" @click="openAdd">{{ t('publicText.add') }}</el-button>
                </div>
            </div>
            <el-table ref="eltableRef" :data="tableData" size="small" border fit highlight-current-row
                :height="tableHeight" style="width: 100%" :tooltip-effect="'dark'" :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }">
                <el-table-column type="index" align="center" fixed :label="t('publicText.index')" width="55">
                    <template #default="scope">
                        <span>{{ scope.$index + (pageObj.pageIndex - 1) * pageObj.pageSize + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="box_code" :label="t('baseData.boxBase.boxCode')"
                    :min-width="getColumnWidth('box_code')" fixed />
                <el-table-column prop="box_name" :label="t('baseData.boxBase.boxName')"
                    :min-width="getColumnWidth('box_name')" show-overflow-tooltip />
                <el-table-column prop="capacity" :label="t('baseData.boxBase.capacity')"
                    :min-width="getColumnWidth('capacity')" align="right" />
                <el-table-column prop="create_by" :label="t('baseData.boxBase.createBy')"
                    :min-width="getColumnWidth('create_by')" />
                <el-table-column prop="create_time" :label="t('baseData.boxBase.createTime')"
                    :min-width="getColumnWidth('create_time')">
                    <template #default="{ row }">
                        {{ formatDate(row.create_time) }}
                    </template>
                </el-table-column>
                <el-table-column prop="update_by" :label="t('baseData.boxBase.updateBy')"
                    :min-width="getColumnWidth('update_by')" />
                <el-table-column prop="update_time" :label="t('baseData.boxBase.updateTime')"
                    :min-width="getColumnWidth('update_time')">
                    <template #default="{ row }">
                        {{ formatDate(row.update_time) }}
                    </template>
                </el-table-column>
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
                    :current-page="pageObj.pageIndex" :page-size="pageObj.pageSize"
                    :page-sizes="[10, 20, 30, 50, 100]"
                    layout="total, sizes, prev, pager, next" :total="total" />
            </div>
        </el-card>

        <!-- 新增/修改弹窗 -->
        <el-dialog :title="dialogTitle" v-model="dialogVisible" width="500px" :close-on-click-modal="false"
            @closed="handleDialogClosed">
            <el-form ref="formRef" :model="form" :rules="formRules" label-width="auto" size="small">
                <el-form-item :label="t('baseData.boxBase.boxCode')" prop="box_code">
                    <el-input v-model="form.box_code" :placeholder="t('baseData.boxBase.inputBoxCode')" clearable />
                </el-form-item>
                <el-form-item :label="t('baseData.boxBase.boxName')" prop="box_name">
                    <el-input v-model="form.box_name" :placeholder="t('baseData.boxBase.inputBoxName')" clearable />
                </el-form-item>
                <el-form-item :label="t('baseData.boxBase.capacity')" prop="capacity">
                    <el-input-number v-model="form.capacity" :min="0" :controls="false"
                        :placeholder="t('baseData.boxBase.inputCapacity')" style="width: 100%" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">{{ t('publicText.cancel') }}</el-button>
                <el-button type="primary" @click="submitForm" :loading="submitLoading">
                    {{ t('publicText.confirm') }}
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import {
    QueryBoxInfoList,
    AddBoxInfo,
    UpdateBoxInfo,
    DeleteBoxInfo,
} from "@/api/baseData/boxBase";
import { ref, reactive, nextTick, onMounted, onBeforeUnmount } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import dayjs from "dayjs";
import { useI18n } from "vue-i18n";

const userStore = useUserStoreWithOut();
const { t } = useI18n();

const loading = ref(false);
const submitLoading = ref(false);
const tableHeight = ref(0);
const eltableRef = ref();
const tableData = ref<any[]>([]);
const total = ref(0);
const dialogVisible = ref(false);
const dialogTitle = ref("");
const isEdit = ref(false);
const formRef = ref();

const searchForm = reactive({
    box_code: "",
    box_name: "",
});

const pageObj = reactive({
    pageIndex: 1,
    pageSize: 50,
});

const form = reactive({
    id: "",
    box_code: "",
    box_name: "",
    capacity: 0,
    create_by: "",
    update_by: "",
});

const formRules = reactive({
    box_code: [
        {
            required: true,
            message: t("baseData.boxBase.inputBoxCode"),
            trigger: "blur",
        },
    ],
    box_name: [
        {
            required: true,
            message: t("baseData.boxBase.inputBoxName"),
            trigger: "blur",
        },
    ],
    capacity: [
        {
            required: true,
            message: t("baseData.boxBase.inputCapacity"),
            trigger: "blur",
        },
    ],
});

const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr.startsWith("1900-01-01")) return "-";
    return dayjs(dateStr).format("YYYY-MM-DD HH:mm:ss");
};

const { getColumnWidth } = useTableColumnWidth(eltableRef, tableData, {
    excludeLabels: [t("publicText.index"), t("publicText.operation")],
});

const getData = () => {
    loading.value = true;
    QueryBoxInfoList({
        box_code: searchForm.box_code || "",
        box_name: searchForm.box_name || "",
        pageIndex: pageObj.pageIndex,
        pageSize: pageObj.pageSize,
    })
        .then((res: any) => {
            if (res.Success && res.Data) {
                tableData.value = res.Data;
                total.value = res.Data.length;
            } else {
                tableData.value = [];
                total.value = 0;
                if (!res.Success) {
                    ElMessage.warning(res.Msg || t("message.queryFailure"));
                }
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
    pageObj.pageIndex = 1;
    getData();
};

const handleSizeChange = (val: number) => {
    pageObj.pageSize = val;
    pageObj.pageIndex = 1;
    getData();
};

const handleCurrentChange = (val: number) => {
    pageObj.pageIndex = val;
    getData();
};

const resetForm = () => {
    form.id = "";
    form.box_code = "";
    form.box_name = "";
    form.capacity = 0;
    form.create_by = "";
    form.update_by = "";
};

const openAdd = () => {
    isEdit.value = false;
    dialogTitle.value = t("publicText.add");
    resetForm();
    dialogVisible.value = true;
};

const openEdit = (row: any) => {
    isEdit.value = true;
    dialogTitle.value = t("publicText.edit");
    form.id = row.id;
    form.box_code = row.box_code;
    form.box_name = row.box_name;
    form.capacity = row.capacity;
    form.create_by = row.create_by || "";
    form.update_by = row.update_by || "";
    dialogVisible.value = true;
};

const handleDialogClosed = () => {
    formRef.value?.resetFields();
    resetForm();
};

const submitForm = () => {
    formRef.value.validate((valid: boolean) => {
        if (!valid) return;
        submitLoading.value = true;
        if (isEdit.value) {
            const params = {
                data: {
                    id: form.id,
                    box_code: form.box_code,
                    box_name: form.box_name,
                    capacity: form.capacity,
                    create_by: form.create_by,
                    update_by: userStore.getUserInfo || "",
                },
            };
            UpdateBoxInfo(params)
                .then((res: any) => {
                    if (res.Success) {
                        ElMessage.success(t("baseData.boxBase.editSuccess"));
                        dialogVisible.value = false;
                        getData();
                    } else {
                        ElMessage.error(res.Msg || t("baseData.boxBase.editFailed"));
                    }
                })
                .finally(() => {
                    submitLoading.value = false;
                });
        } else {
            const params = {
                data: {
                    box_code: form.box_code,
                    box_name: form.box_name,
                    capacity: form.capacity,
                    create_by: userStore.getUserInfo || "",
                    update_by: "",
                },
            };
            AddBoxInfo(params)
                .then((res: any) => {
                    if (res.Success) {
                        ElMessage.success(t("baseData.boxBase.addSuccess"));
                        dialogVisible.value = false;
                        getData();
                    } else {
                        ElMessage.error(res.Msg || t("baseData.boxBase.addFailed"));
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
        t("baseData.boxBase.deleteConfirm"),
        t("publicText.tip"),
        {
            confirmButtonText: t("publicText.confirm"),
            cancelButtonText: t("publicText.cancel"),
            type: "warning",
        }
    )
        .then(() => {
            DeleteBoxInfo({ ids: [row.id] })
                .then((res: any) => {
                    if (res.Success) {
                        ElMessage.success(t("baseData.boxBase.deleteSuccess"));
                        if (tableData.value.length === 1 && pageObj.pageIndex > 1) {
                            pageObj.pageIndex--;
                        }
                        getData();
                    } else {
                        ElMessage.error(res.Msg || t("baseData.boxBase.deleteFailed"));
                    }
                })
        })
};

const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 180;
    });
};

onMounted(() => {
    getScreenHeight();
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