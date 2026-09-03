<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between items-center mb-2">
                <el-button type="primary" size="small" @click="openAdd">
                    {{ t("publicText.add") }}
                </el-button>
                <div class="input_box">
                    <el-input v-model="searchName" style="width: 350px" clearable
                        :placeholder="t('AGV.pointType.searchTip')" @keyup.enter="handleSearch" @clear="handleSearch"
                        size="small">
                        <template #append>
                            <el-button type="primary" icon="Search" @click="handleSearch" />
                        </template>
                    </el-input>
                </div>
            </div>

            <el-table ref="tableRef" :data="tableData" border :height="tableHeight" style="width: 100%" size="small"
                stripe highlight-current-row tooltip-effect="dark"
                :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }" v-loading="loading">
                <el-table-column type="index" :label="t('publicText.index')" width="55" align="center" fixed="left">
                    <template #default="{ $index }">
                        {{ $index + 1 + (currentPage - 1) * pageSize }}
                    </template>
                </el-table-column>
                <el-table-column prop="pointtype_no" :label="t('AGV.pointType.pointtype_no')" width="130"
                    :min-width="getColumnWidth('pointtype_no')" show-overflow-tooltip fixed="left" />
                <el-table-column prop="pointtype_name" :label="t('AGV.pointType.pointtype_name')" width="180"
                    :min-width="getColumnWidth('pointtype_name')" show-overflow-tooltip />
                <el-table-column prop="pointtype_type" :label="t('AGV.pointType.pointtype_type')" width="120"
                    :min-width="getColumnWidth('pointtype_type')" align="center">
                    <template #default="{ row }">
                        <el-tag :type="getTypeTagType(row.pointtype_type)">
                            {{ getTypeText(row.pointtype_type) }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="pointtype_status" :label="t('AGV.pointType.pointtype_status')" width="120"
                    :min-width="getColumnWidth('pointtype_status')" align="center">
                    <template #default="{ row }">
                        <el-switch :model-value="isStatusEnabled(row.pointtype_status)" :loading="row._toggleLoading"
                         
                            @change="(val: boolean) => handleToggleStatus(row, val)" />
                    </template>
                </el-table-column>
                <el-table-column prop="startpointtype" :label="t('AGV.pointType.startpointtype')" width="150"
                    :min-width="getColumnWidth('startpointtype')" show-overflow-tooltip />
                <el-table-column prop="endpointtype" :label="t('AGV.pointType.endpointtype')" width="150"
                    :min-width="getColumnWidth('endpointtype')" show-overflow-tooltip />
                <el-table-column prop="remark" :label="t('AGV.pointType.remark')" width="200"
                    :min-width="getColumnWidth('remark')" show-overflow-tooltip />
               
                <el-table-column prop="pointtype_updateuser" :label="t('AGV.pointType.updateuser')" width="110"
                    :min-width="getColumnWidth('pointtype_updateuser')" />
                <el-table-column prop="pointtype_updatedt" :label="t('AGV.pointType.updatedt')" width="160"
                    :min-width="getColumnWidth('pointtype_updatedt')">
                    <template #default="{ row }">
                        {{ formatDateTime(row.pointtype_updatedt) }}
                    </template>
                </el-table-column>
                <el-table-column fixed="right" :label="t('publicText.operation')" width="160" align="center">
                    <template #default="{ row }">
                        <el-tooltip :content="t('publicText.edit')" placement="top">
                            <el-button type="primary" icon="Edit" size="small" @click="openEdit(row)" />
                        </el-tooltip>
                        <el-tooltip :content="t('publicText.delete')" placement="top">
                            <el-button type="danger" icon="Delete" size="small" @click="handleDelete(row)" />
                        </el-tooltip>
                    </template>
                </el-table-column>
                <template #empty>
                    <el-empty :description="t('publicText.noData')" />
                </template>
            </el-table>

            <div style="margin-top: 8px">
                <el-pagination align="center" background size="small" @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
                    :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next" :total="total" />
            </div>
        </el-card>

        <!-- 新增/修改弹窗 -->
        <el-dialog :title="isEdit ? t('AGV.pointType.editTitle') : t('AGV.pointType.addTitle')" v-model="dialogVisible"
            width="520px" :close-on-click-modal="false" @closed="handleDialogClosed">
            <el-form ref="formRef" :model="form" :rules="formRules" label-width="120px" size="small">
                <el-row>
                    <el-col :span="24">
                        <el-form-item :label="t('AGV.pointType.pointtype_no')" prop="pointtype_no">
                            <el-input v-model="form.pointtype_no" :placeholder="t('AGV.pointType.noPlaceholder')"
                                :disabled="isEdit" style="width: 340px" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item :label="t('AGV.pointType.pointtype_name')" prop="pointtype_name">
                            <el-input v-model="form.pointtype_name" :placeholder="t('AGV.pointType.namePlaceholder')"
                                style="width: 340px" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.pointType.pointtype_type')" prop="pointtype_type">
                            <el-select v-model="form.pointtype_type" :placeholder="t('AGV.pointType.typePlaceholder')"
                                style="width: 100%" clearable>
                                <el-option :label="t('AGV.pointType.typeSMT')" value="SMT" />
                                <el-option :label="t('AGV.pointType.typeICT')" value="ICT" />
                                <el-option :label="t('AGV.pointType.typeXianBan')" value="铣板" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.pointType.pointtype_status')" prop="pointtype_status">
                            <el-switch v-model="form.pointtype_status" active-value="Y" inactive-value="N" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item :label="t('AGV.pointType.remark')" prop="remark">
                            <el-input v-model="form.remark" type="textarea" :rows="2"
                                :placeholder="t('AGV.pointType.remarkPlaceholder')" style="width: 340px" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">{{ t('publicText.cancel') }}</el-button>
                <el-button type="primary" :loading="submitLoading" @click="handleSubmit">{{ t('publicText.confirm')
                }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import {
    InsertUpdatePointType,
    DeletePointType,
    QueryPointType,
} from "@/api/AGV/index";
import { ref, reactive, nextTick, onMounted, onBeforeUnmount } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import dayjs from "dayjs";

const { t } = useI18n();
const userStore = useUserStoreWithOut();

const loading = ref(false);
const submitLoading = ref(false);
const tableHeight = ref(0);
const tableRef = ref();

const currentPage = ref(1);
const pageSize = ref(20);
const total = ref(0);
const tableData = ref<any[]>([]);
const searchName = ref("");
const searchType = ref("");
const searchStatus = ref("");

const { getColumnWidth } = useTableColumnWidth(tableRef, tableData, {
    excludeLabels: [t("publicText.index"), t("publicText.operation")],
});

const isEdit = ref(false);
const dialogVisible = ref(false);
const formRef = ref();
const form = reactive({
    pointtype_no: "",
    pointtype_name: "",
    pointtype_type: "",
    remark: "",
    pointtype_status: "Y",
});

const formRules = {
    pointtype_no: [{ required: true, message: t("AGV.pointType.pointtype_noRequired"), trigger: "blur" }],
    pointtype_name: [{ required: true, message: t("AGV.pointType.pointtype_nameRequired"), trigger: "blur" }],
};

const resetForm = () => {
    Object.assign(form, {
        pointtype_no: "",
        pointtype_name: "",
        pointtype_type: "",
        remark: "",
        pointtype_status: "Y",
    });
};

const openAdd = () => {
    isEdit.value = false;
    resetForm();
    dialogVisible.value = true;
};

const openEdit = (row: any) => {
    isEdit.value = true;
    const st = String(row.pointtype_status ?? "Y").toUpperCase();
    Object.assign(form, {
        pointtype_no: row.pointtype_no ?? "",
        pointtype_name: row.pointtype_name ?? "",
        pointtype_type: row.pointtype_type ?? "",
        remark: row.remark ?? "",
        pointtype_status: (st === "Y" || st === "0") ? "Y" : "N",
    });
    dialogVisible.value = true;
};

const handleDialogClosed = () => {
    formRef.value?.resetFields();
    resetForm();
};

const handleSubmit = async () => {
    await formRef.value?.validate();
    submitLoading.value = true;
    try {
        const params = {
            pointtype_no: form.pointtype_no,
            pointtype_name: form.pointtype_name,
            pointtype_type: form.pointtype_type,
            pointtype_status: String(form.pointtype_status).toUpperCase(),
            UserNo: userStore.getUserInfo || "",
        };
        const res: any = await InsertUpdatePointType(params);
        if (res.Success) {
            ElMessage.success(isEdit.value ? t("message.editSuccess") : t("message.addSuccess"));
            dialogVisible.value = false;
            getData();
        } else {
            ElMessage.error(res.Message || res.Msg || (isEdit.value ? t("message.editFailure") : t("message.addFailure")));
        }
    } catch (error) {
        ElMessage.error(isEdit.value ? t("message.editFailure") : t("message.addFailure"));
    } finally {
        submitLoading.value = false;
    }
};

const handleDelete = (row: any) => {
    ElMessageBox.confirm(
        t("message.confirmDelete", { code: row.pointtype_no, name: row.pointtype_name }),
        t("publicText.tip"),
        { confirmButtonText: t("publicText.confirm"), cancelButtonText: t("publicText.cancel"), type: "warning" }
    )
        .then(async () => {
            loading.value = true;
            try {
                const res: any = await DeletePointType({
                    pointtype_no: row.pointtype_no,
                    UserNo: userStore.getUserInfo || "",
                });
                if (res.Success) {
                    ElMessage.success(t("message.deleteSuccess"));
                    if (tableData.value.length === 1 && currentPage.value > 1) currentPage.value--;
                    getData();
                } else {
                    ElMessage.error(res.Message || res.Msg || t("message.deleteFailure"));
                }
            } catch (error) {
                ElMessage.error(t("message.deleteFailure"));
            } finally {
                loading.value = false;
            }
        })
        .catch(() => { });
};

const getData = async () => {
    loading.value = true;
    try {
        const params = {
            PageIndex: currentPage.value,
            PageSize: pageSize.value,
            pointtype_no: searchName.value.trim().includes("-") || /^\d+$/.test(searchName.value.trim()) ? searchName.value.trim() : "",
            pointtype_name: !searchName.value.trim().includes("-") && !/^\d+$/.test(searchName.value.trim()) ? searchName.value.trim() : "",
            pointtype_type: searchType.value,
            pointtype_status: searchStatus.value,
        };
        const res: any = await QueryPointType(params);
        if (res.Success) {
            const d = res.Data;
            if (Array.isArray(d)) {
                tableData.value = d;
                total.value = d.length;
            } else if (d && Array.isArray(d.rows)) {
                tableData.value = d.rows;
                total.value = d.total ?? d.rows.length;
            } else if (d && Array.isArray(d.list)) {
                tableData.value = d.list;
                total.value = d.Total ?? d.list.length;
            } else {
                tableData.value = [];
                total.value = 0;
            }
            if (tableData.value.length === 0 && currentPage.value > 1) {
                currentPage.value--;
                getData();
                return;
            }
        } else {
            ElMessage.error(res.Message || res.Msg || t("message.queryFailure"));
            tableData.value = [];
            total.value = 0;
        }
    } catch (error) {
        ElMessage.error(t("message.queryFailure"));
    } finally {
        loading.value = false;
    }
};

const handleSearch = () => {
    currentPage.value = 1;
    getData();
};

const handleSizeChange = (val: number) => {
    pageSize.value = val;
    currentPage.value = 1;
    getData();
};
const handleCurrentChange = (val: number) => {
    currentPage.value = val;
    getData();
};

const getTypeText = (value: string) => {
    switch (value) {
        case "SMT": return t("AGV.pointType.typeSMT");
        case "ICT": return t("AGV.pointType.typeICT");
        case "铣板": return t("AGV.pointType.typeXianBan");
        default: return value ?? "";
    }
};
const getTypeTagType = (value: string) => {
    switch (value) {
        case "SMT": return "success";
        case "ICT": return "warning";
        case "铣板": return "primary";
        default: return "info";
    }
};
const isStatusEnabled = (value: any) => {
    const s = String(value ?? "").toUpperCase();
    return s === "Y" || s === "0";
};

const getStatusText = (value: any) => {
    const s = String(value).toUpperCase();
    if (s === "Y" || s === "0") return t("AGV.pointType.statusY");
    if (s === "N" || s === "1") return t("AGV.pointType.statusN");
    return value ?? "-";
};

const handleToggleStatus = async (row: any, enabled: boolean) => {
    const prevStatus = row.pointtype_status;
    const targetStatus = enabled ? "Y" : "N";
    if (isStatusEnabled(prevStatus) === enabled) return;
    row._toggleLoading = true;
    try {
        const res: any = await InsertUpdatePointType({
            pointtype_no: row.pointtype_no,
            pointtype_name: row.pointtype_name ?? "",
            pointtype_type: row.pointtype_type ?? "",
            pointtype_status: targetStatus,
            UserNo: userStore.getUserInfo || "",
        });
        if (res.Success) {
            row.pointtype_status = targetStatus;
            ElMessage.success((enabled ? t("AGV.pointType.statusY") : t("AGV.pointType.statusN")) + t("message.editSuccess"));
            getData();
        } else {
            row.pointtype_status = prevStatus;
            ElMessage.error(res.Message || res.Msg || t("message.editFailure"));
        }
    } catch (error) {
        row.pointtype_status = prevStatus;
        ElMessage.error(t("message.editFailure"));
    } finally {
        row._toggleLoading = false;
    }
};
const formatDateTime = (dt: any) => {
    if (!dt) return "-";
    try { return dayjs(dt).format("YYYY-MM-DD HH:mm:ss"); } catch { return dt; }
};

const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 200;
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

<style scoped>
.el-pagination {
    justify-content: center;
}
</style>
