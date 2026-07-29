<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between">
                <el-form :model="searchForm" :inline="true" size="small" @submit.native.prevent>
                    <el-form-item :label="t('baseData.boxType.boxType')" prop="boxtype" class="mb-2">
                        <el-select v-model="searchForm.boxtype" clearable filterable
                            :placeholder="t('baseData.boxType.selectBoxType')" style="width: 180px">
                            <el-option label="L" value="L" />
                            <el-option label="R" value="R" />
                            <el-option label="C" value="C" />
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="t('baseData.boxType.caseNo')" prop="caseno" class="mb-2">
                        <el-input v-model="searchForm.caseno" clearable
                            :placeholder="t('baseData.boxType.inputCaseNo')" style="width: 200px"
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
            <el-table ref="eltableRef" :data="pagedData" size="small" border fit highlight-current-row
                :height="tableHeight" style="width: 100%" :tooltip-effect="'dark'">
                <el-table-column type="index" align="center" fixed :label="t('publicText.index')" width="55">
                    <template #default="scope">
                        <span>{{ scope.$index + (pageObj.currentPage - 1) * pageObj.pageSize + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="boxtype" :label="t('baseData.boxType.boxType')"
                    :min-width="getColumnWidth('boxtype')" align="center" />
                <el-table-column prop="caseno" :label="t('baseData.boxType.caseNo')"
                    :min-width="getColumnWidth('caseno')" />
                <el-table-column prop="create_by" :label="t('baseData.boxType.createBy')"
                    :min-width="getColumnWidth('create_by')" />
                <el-table-column prop="create_time" :label="t('baseData.boxType.createTime')"
                    :min-width="getColumnWidth('create_time')">
                    <template #default="{ row }">
                        {{ formatDate(row.create_time) }}
                    </template>
                </el-table-column>
                <el-table-column prop="update_by" :label="t('baseData.boxType.updateBy')"
                    :min-width="getColumnWidth('update_by')" />
                <el-table-column prop="update_time" :label="t('baseData.boxType.updateTime')"
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
                    :current-page="pageObj.currentPage" :page-size="pageObj.pageSize"
                    :page-sizes="[10, 20, 30, 50, 100]"
                    layout="total, sizes, prev, pager, next" :total="total" />
            </div>
        </el-card>

        <!-- 新增/修改弹窗 -->
        <el-dialog :title="dialogTitle" v-model="dialogVisible" width="500px" :close-on-click-modal="false"
            @closed="handleDialogClosed">
            <el-form ref="formRef" :model="form" :rules="formRules" label-width="auto">
                <el-form-item :label="t('baseData.boxType.boxType')" prop="boxtype">
                    <el-select v-model="form.boxtype" :placeholder="t('baseData.boxType.selectBoxType')">
                        <el-option label="L" value="L" />
                        <el-option label="R" value="R" />
                        <el-option label="C" value="C" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="t('baseData.boxType.caseNo')" prop="caseno">
                    <el-input v-model="form.caseno" :placeholder="t('baseData.boxType.inputCaseNo')" clearable />
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
    QueryBoxTypeList,
    AddBoxType,
    UpdateBoxType,
    DeleteBoxType,
} from "@/api/baseData/boxType";
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
const dialogVisible = ref(false);
const dialogTitle = ref("");
const isEdit = ref(false);
const formRef = ref();

const searchForm = reactive({
    boxtype: "",
    caseno: "",
});

const pageObj = reactive({
    currentPage: 1,
    pageSize: 50,
});

const form = reactive({
    id: "",
    boxtype: "",
    caseno: "",
    create_by: "",
    update_by: "",
});

const formRules = reactive({
    boxtype: [
        {
            required: true,
            message: t("baseData.boxType.selectBoxType"),
            trigger: "change",
        },
    ],
    caseno: [
        {
            required: true,
            message: t("baseData.boxType.inputCaseNo"),
            trigger: "blur",
        },
    ],
});

const pagedData = computed(() => {
    const start = (pageObj.currentPage - 1) * pageObj.pageSize;
    return allData.value.slice(start, start + pageObj.pageSize);
});

const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr.startsWith("1900-01-01")) return "-";
    return dayjs(dateStr).format("YYYY-MM-DD HH:mm:ss");
};

const { getColumnWidth } = useTableColumnWidth(eltableRef, allData, {
    excludeLabels: [t("publicText.index"), t("publicText.operation")],
});

const getData = () => {
    
    QueryBoxTypeList({
        boxtype: searchForm.boxtype || "",
        caseno: searchForm.caseno || "",
    })
        .then((res: any) => {
            if (res.Success && res.Data) {
                allData.value = res.Data;
                total.value = res.Data.length;
            } else {
                allData.value = [];
                total.value = 0;
                if (!res.Success) {
                    ElMessage.warning(res.Msg || t("message.queryFailure"));
                }
            }
        })
        .catch(() => {
            allData.value = [];
            total.value = 0;
        })
};

const handleSearch = () => {
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

const resetForm = () => {
    form.id = "";
    form.boxtype = "";
    form.caseno = "";
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
    form.boxtype = row.boxtype;
    form.caseno = row.caseno;
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
                    boxtype: form.boxtype,
                    caseno: form.caseno,
                    create_by: form.create_by,
                    update_by: userStore.getUserInfo || "",
                },
            };
            UpdateBoxType(params)
                .then((res: any) => {
                    if (res.Success) {
                        ElMessage.success(t("baseData.boxType.editSuccess"));
                        dialogVisible.value = false;
                        getData();
                    } else {
                        ElMessage.error(res.Msg || t("baseData.boxType.editFailed"));
                    }
                })
                .finally(() => {
                    submitLoading.value = false;
                });
        } else {
            const params = {
                data: {
                    id: "",
                    boxtype: form.boxtype,
                    caseno: form.caseno,
                    create_by: userStore.getUserInfo || "",
                    update_by: "",
                },
            };
            AddBoxType(params)
                .then((res: any) => {
                    if (res.Success) {
                        ElMessage.success(t("baseData.boxType.addSuccess"));
                        dialogVisible.value = false;
                        getData();
                    } else {
                        ElMessage.error(res.Msg || t("baseData.boxType.addFailed"));
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
        t("baseData.boxType.deleteConfirm"),
        t("publicText.tip"),
        {
            confirmButtonText: t("publicText.confirm"),
            cancelButtonText: t("publicText.cancel"),
            type: "warning",
        }
    )
        .then(() => {
          
            DeleteBoxType({ ids: [row.id] })
                .then((res: any) => {
                    if (res.Success) {
                        ElMessage.success(t("baseData.boxType.deleteSuccess"));
                        if (pagedData.value.length === 1 && pageObj.currentPage > 1) {
                            pageObj.currentPage--;
                        }
                        getData();
                    } else {
                        ElMessage.error(res.Msg || t("baseData.boxType.deleteFailed"));
                    }
                })
               
        })
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
