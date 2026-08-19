<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between items-center">
                <el-form ref="searchFormRef" :inline="true" :model="searchForm" label-width="auto" @submit.prevent>
                    <el-form-item :label="t('materialManage.bomDetailCheck.pn')" class="mb-2">
                        <el-input v-model="searchForm.PN"
                            :placeholder="t('materialManage.bomDetailCheck.pnPlaceholder')" clearable
                            style="width: 220px" size="small" @keyup.enter="handleSearch" />
                    </el-form-item>
                    <el-form-item class="mb-2">
                        <el-button type="primary" size="small" @click="handleSearch">{{ t("publicText.query") }}</el-button>
                        <el-button size="small" @click="resetSearch">{{ t("publicText.reset") }}</el-button>
                        <el-button type="warning" size="small" @click="openAdd">{{ t("publicText.add") }}</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <el-table :data="tableData" ref="tableRef" border :height="tableHeight"
                stripe size="small"
                :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }">
                <el-table-column type="index" :label="t('publicText.index')" width="55" fixed="left" align="center">
                    <template #default="{ $index }">
                        {{ $index + 1 + (currentPage - 1) * pageSize }}
                    </template>
                </el-table-column>
                <el-table-column prop="PN" :label="t('materialManage.bomDetailCheck.pn')"
                    :min-width="getColumnWidth('PN')" fixed="left" show-overflow-tooltip />
                <el-table-column prop="name" :label="t('materialManage.bomDetailCheck.name')"
                    :min-width="getColumnWidth('name')" show-overflow-tooltip fixed="left" />
                <el-table-column prop="pn_spec" :label="t('materialManage.bomDetailCheck.pnSpec')"
                    :min-width="getColumnWidth('pn_spec')" show-overflow-tooltip />
                <el-table-column prop="Lv" :label="t('materialManage.bomDetailCheck.lv')"
                    :min-width="getColumnWidth('Lv')" align="center" />
                <el-table-column prop="Size" :label="t('materialManage.bomDetailCheck.size')"
                    :min-width="getColumnWidth('Size')" align="right" />
                <el-table-column prop="MPQ" :label="t('materialManage.bomDetailCheck.mpq')"
                    :min-width="getColumnWidth('MPQ')" align="right" />
                <el-table-column prop="Stts" :label="t('materialManage.bomDetailCheck.stts')"
                    :min-width="getColumnWidth('Stts')" align="center" />
                <el-table-column :label="t('publicText.operation')" fixed="right" align="center" width="140">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" @click="openEdit(row)">{{ t("publicText.edit") }}</el-button>
                        <el-button type="danger" size="small" @click="handleDelete(row)">{{ t("publicText.delete") }}</el-button>
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
                    @current-change="handleCurrentChange" :current-page="currentPage"
                    :page-size="pageSize"
                    :page-sizes="[10, 20, 50, 100]"
                    layout="total, sizes, prev, pager, next, jumper" :total="total" />
            </div>
        </el-card>

        <el-dialog v-model="dialogVisible" :title="isEdit ? t('materialManage.bomDetailCheck.editTitle') : t('materialManage.bomDetailCheck.addTitle')" width="500px" @close="closeDialog">
            <el-form ref="formRef" :model="form" :rules="formRules" label-width="100px">
                <el-form-item :label="t('materialManage.bomDetailCheck.pn')" prop="PN">
                    <el-input v-model="form.PN" :placeholder="t('materialManage.bomDetailCheck.pnPlaceholder')" :disabled="isEdit" />
                </el-form-item>
                <el-form-item :label="t('materialManage.bomDetailCheck.name')" prop="name">
                    <el-input v-model="form.name" :placeholder="t('materialManage.bomDetailCheck.namePlaceholder')" />
                </el-form-item>
                <el-form-item :label="t('materialManage.bomDetailCheck.pnSpec')" prop="pn_spec">
                    <el-input v-model="form.pn_spec" :placeholder="t('materialManage.bomDetailCheck.pnSpecPlaceholder')" />
                </el-form-item>
                <el-form-item :label="t('materialManage.bomDetailCheck.lv')" prop="Lv">
                    <el-input v-model="form.Lv" :placeholder="t('materialManage.bomDetailCheck.lvPlaceholder')" />
                </el-form-item>
                <el-form-item :label="t('materialManage.bomDetailCheck.size')" prop="Size">
                    <el-input-number v-model="form.Size" :min="0" controls-position="right" style="width: 100%" />
                </el-form-item>
                <el-form-item :label="t('materialManage.bomDetailCheck.mpq')" prop="MPQ">
                    <el-input-number v-model="form.MPQ" :min="0" controls-position="right" style="width: 100%" />
                </el-form-item>
                <el-form-item :label="t('materialManage.bomDetailCheck.stts')" prop="Stts">
                    <el-input-number v-model="form.Stts" :min="0" controls-position="right" style="width: 100%" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button size="small" @click="closeDialog">{{ t("publicText.cancel") }}</el-button>
                <el-button type="primary" size="small" @click="submitForm">{{ t("publicText.confirm") }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { QueryPartNumbers, AddPartNumber, UpdatePartNumber, DeletePartNumber } from "@/api/materialManage/index";
import { ref, reactive, nextTick, onMounted, onBeforeUnmount } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";

const { t } = useI18n();

const tableHeight = ref(0);
const tableRef = ref();

const currentPage = ref(1);
const pageSize = ref(50);
const total = ref(0);
const tableData = ref<any[]>([]);

const searchForm = reactive({
    PN: "",
});

const { getColumnWidth } = useTableColumnWidth(tableRef, tableData, {
    excludeLabels: [t("publicText.index"), t("publicText.operation")],
});

// 查询
const getData = async () => {
    try {
        const params = {
            PageIndex: currentPage.value,
            PageSize: pageSize.value,
            PN: searchForm.PN,
        };
        const res: any = await QueryPartNumbers(params);
        if (res.Success) {
            if (res.Data && Array.isArray(res.Data.list)) {
                tableData.value = res.Data.list;
                total.value = res.Data.Total || res.Data.list.length;
            } else {
                tableData.value = [];
                total.value = 0;
            }
        } else {
            ElMessage.error(res.Msg || t("materialManage.bomDetailCheck.queryFailure"));
        }
    } catch (error) {
        ElMessage.error(t("materialManage.bomDetailCheck.queryFailure"));
    }
};

const handleSearch = () => {
    currentPage.value = 1;
    getData();
};

const resetSearch = () => {
    searchForm.PN = "";
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

// 新增/编辑
const dialogVisible = ref(false);
const isEdit = ref(false);
const formRef = ref();
const form = reactive({
    id: 0,
    PN: "",
    name: "",
    pn_spec: "",
    Lv: "",
    Size: 0,
    MPQ: 0,
    Stts: 0,
});

const formRules = reactive({
    PN: [{ required: true, message: t("materialManage.bomDetailCheck.pnRequired"), trigger: "blur" }],
});

const openAdd = () => {
    isEdit.value = false;
    resetForm();
    dialogVisible.value = true;
};

const openEdit = (row: any) => {
    isEdit.value = true;
    form.id = row.id;
    form.PN = row.PN || "";
    form.name = row.name || "";
    form.pn_spec = row.pn_spec || "";
    form.Lv = row.Lv ?? "";
    form.Size = row.Size ?? 0;
    form.MPQ = row.MPQ ?? 0;
    form.Stts = row.Stts ?? 0;
    dialogVisible.value = true;
};

const resetForm = () => {
    form.id = 0;
    form.PN = "";
    form.name = "";
    form.pn_spec = "";
    form.Lv = "";
    form.Size = 0;
    form.MPQ = 0;
    form.Stts = 0;
    nextTick(() => {
        formRef.value?.clearValidate();
    });
};

const closeDialog = () => {
    dialogVisible.value = false;
    resetForm();
};

const submitForm = async () => {
    if (!formRef.value) return;
    await formRef.value.validate(async (valid: boolean) => {
        if (!valid) return;
        const payload: any = {
            PN: form.PN,
            name: form.name,
            pn_spec: form.pn_spec,
            Lv: form.Lv,
            Size: form.Size,
            MPQ: form.MPQ,
            Stts: form.Stts,
        };
        try {
            let res: any;
            if (isEdit.value) {
                payload.id = form.id;
                res = await UpdatePartNumber(payload);
            } else {
                res = await AddPartNumber(payload);
            }
            if (res.Success) {
                ElMessage.success(isEdit.value ? t("materialManage.bomDetailCheck.editSuccess") : t("materialManage.bomDetailCheck.addSuccess"));
                closeDialog();
                getData();
            } else {
                ElMessage.error(res.Msg || (isEdit.value ? t("materialManage.bomDetailCheck.editFailed") : t("materialManage.bomDetailCheck.addFailed")));
            }
        } catch (error) {
            ElMessage.error(isEdit.value ? t("materialManage.bomDetailCheck.editFailed") : t("materialManage.bomDetailCheck.addFailed"));
        }
    });
};

const handleDelete = (row: any) => {
    ElMessageBox.confirm(t("materialManage.bomDetailCheck.deleteConfirm"), t("publicText.tipTitle"), {
        confirmButtonText: t("publicText.confirm"),
        cancelButtonText: t("publicText.cancel"),
        type: "warning",
    }).then(async () => {
        try {
            const res: any = await DeletePartNumber({ id: row.id });
            if (res.Success) {
                ElMessage.success(t("materialManage.bomDetailCheck.deleteSuccess"));
                getData();
            } else {
                ElMessage.error(res.Msg || t("materialManage.bomDetailCheck.deleteFailed"));
            }
        } catch (error) {
            ElMessage.error(t("materialManage.bomDetailCheck.deleteFailed"));
        }
    }).catch(() => {});
};

const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 190;
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
