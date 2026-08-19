<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between items-center">
                <el-form ref="searchFormRef" :inline="true" :model="searchForm" label-width="auto" @submit.prevent>
                    <el-form-item :label="t('stockVirtual.stockId')" class="mb-2">
                        <el-input v-model="searchForm.StockId"
                            :placeholder="t('stockVirtual.stockIdPlaceholder')" clearable
                            style="width: 160px" size="small" @keyup.enter="handleSearch" />
                    </el-form-item>
                    <el-form-item :label="t('stockVirtual.stockName')" class="mb-2">
                        <el-input v-model="searchForm.StockName"
                            :placeholder="t('stockVirtual.stockNamePlaceholder')" clearable
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
                        {{ $index + 1 + (searchForm.pageIndex - 1) * searchForm.pageSize }}
                    </template>
                </el-table-column>
                <el-table-column prop="StockId" :label="t('stockVirtual.stockId')"
                    :min-width="getColumnWidth('StockId')" fixed="left" show-overflow-tooltip />
                <el-table-column prop="StockName" :label="t('stockVirtual.stockName')"
                    :min-width="getColumnWidth('StockName')" show-overflow-tooltip />
                <el-table-column prop="StockPositionNo" :label="t('stockVirtual.stockPositionNo')"
                    :min-width="getColumnWidth('StockPositionNo')" align="center" />
                <el-table-column prop="GoodsStartCode" :label="t('stockVirtual.goodsStartCode')"
                    :min-width="getColumnWidth('GoodsStartCode')" show-overflow-tooltip />
                <el-table-column prop="GoodsEndCode" :label="t('stockVirtual.goodsEndCode')"
                    :min-width="getColumnWidth('GoodsEndCode')" show-overflow-tooltip />
                <el-table-column prop="SortCode" :label="t('stockVirtual.sortCode')"
                    :min-width="getColumnWidth('SortCode')" align="center" />
                <el-table-column prop="Description" :label="t('stockVirtual.description')"
                    :min-width="getColumnWidth('Description')" show-overflow-tooltip />
                <el-table-column prop="cr_dt" :label="t('stockVirtual.cr_dt')"
                    :min-width="getColumnWidth('cr_dt')" align="center">
                    <template #default="{ row }">
                        {{ formatDate(row.cr_dt) }}
                    </template>
                </el-table-column>
                <el-table-column prop="cr_user" :label="t('stockVirtual.cr_user')"
                    :min-width="getColumnWidth('cr_user')" align="center" />
                <el-table-column prop="ud_dt" :label="t('stockVirtual.ud_dt')"
                    :min-width="getColumnWidth('ud_dt')" align="center">
                    <template #default="{ row }">
                        {{ formatDate(row.ud_dt) }}
                    </template>
                </el-table-column>
                <el-table-column prop="ud_user" :label="t('stockVirtual.ud_user')"
                    :min-width="getColumnWidth('ud_user')" align="center" />
                <el-table-column fixed="right" :label="t('publicText.operation')" width="140" align="center">
                    <template #default="{ row }">
                        <el-button size="small" type="primary" :icon="Edit" @click="openEdit(row)" />
                        <el-button size="small" type="danger" :icon="Delete" @click="handleDelete(row)" />
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
                    @current-change="handleCurrentChange" :current-page="searchForm.pageIndex"
                    :page-size="searchForm.pageSize"
                    :page-sizes="[10, 20, 50, 100, 200]"
                    layout="total, sizes, prev, pager, next, jumper" :total="total" />
            </div>
        </el-card>

        <!-- 新增/编辑弹窗 -->
        <el-dialog :title="dialogType === 'add' ? t('stockVirtual.addTitle') : t('stockVirtual.editTitle')"
            v-model="dialogVisible" width="560px"
            :close-on-click-modal="false" @closed="handleDialogClosed">
            <el-form ref="formRef" :model="form" :rules="formRules" label-width="120px" size="small">
                <el-form-item :label="t('stockVirtual.stockId')" prop="StockId">
                    <el-input v-model="form.StockId"
                        :placeholder="t('stockVirtual.stockIdPlaceholder')"
                        :disabled="dialogType === 'edit'" />
                </el-form-item>
                <el-form-item :label="t('stockVirtual.stockName')" prop="StockName">
                    <el-input v-model="form.StockName"
                        :placeholder="t('stockVirtual.stockNamePlaceholder')" />
                </el-form-item>
                <el-form-item :label="t('stockVirtual.stockPositionNo')" prop="StockPositionNo">
                    <el-input v-model="form.StockPositionNo"
                        :placeholder="t('stockVirtual.stockIdPlaceholder')" />
                </el-form-item>
                <el-form-item :label="t('stockVirtual.goodsStartCode')" prop="GoodsStartCode">
                    <el-input v-model="form.GoodsStartCode"
                        :placeholder="t('stockVirtual.stockIdPlaceholder')" />
                </el-form-item>
                <el-form-item :label="t('stockVirtual.goodsEndCode')" prop="GoodsEndCode">
                    <el-input v-model="form.GoodsEndCode"
                        :placeholder="t('stockVirtual.stockIdPlaceholder')" />
                </el-form-item>
                <el-form-item :label="t('stockVirtual.sortCode')" prop="SortCode">
                    <el-input-number v-model="form.SortCode" :min="0" controls-position="right"
                        style="width: 100%" />
                </el-form-item>
                <el-form-item :label="t('stockVirtual.description')" prop="Description">
                    <el-input v-model="form.Description" type="textarea" :rows="2"
                        :placeholder="t('stockVirtual.stockIdPlaceholder')" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">{{ t('publicText.cancel') }}</el-button>
                <el-button type="primary" :loading="submitLoading" @click="submitForm">{{ t('publicText.confirm') }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import {
    QueryStockVirtual,
    AddStockVirtual,
    UpdateStockVirtual,
    DeleteStockVirtual,
} from "@/api/warehouseManage/stockVirtual";
import { ref, reactive, computed, nextTick, onMounted, onBeforeUnmount } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Edit, Delete } from "@element-plus/icons-vue";
import { useI18n } from "vue-i18n";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import dayjs from "dayjs";

const { t } = useI18n();
const userStore = useUserStoreWithOut();

const submitLoading = ref(false);
const tableHeight = ref(0);
const tableRef = ref();

const total = ref(0);

const searchForm = reactive({
    StockId: "",
    StockName: "",
    pageIndex: 1,
    pageSize: 50,
});

const tableData = ref<any[]>([]);

const { getColumnWidth } = useTableColumnWidth(tableRef, tableData, {
    excludeLabels: [t("publicText.index"), t("publicText.operation")],
});

const dialogVisible = ref(false);
const dialogType = ref<"add" | "edit">("add");
const formRef = ref();
const form = reactive({
    ID: "",
    StockId: "",
    StockName: "",
    StockPositionNo: "",
    GoodsStartCode: "",
    GoodsEndCode: "",
    SortCode: 0,
    Description: "",
});

const formRules = computed(() => ({
    StockId: [
        { required: true, message: t("stockVirtual.stockIdRequired"), trigger: "blur" },
    ],
    StockName: [
        { required: true, message: t("stockVirtual.stockNameRequired"), trigger: "blur" },
    ],
}));

const resetForm = () => {
    Object.assign(form, {
        ID: "",
        StockId: "",
        StockName: "",
        StockPositionNo: "",
        GoodsStartCode: "",
        GoodsEndCode: "",
        SortCode: 0,
        Description: "",
    });
};

const handleDialogClosed = () => {
    formRef.value?.resetFields();
    resetForm();
};

const openAdd = () => {
    dialogType.value = "add";
    resetForm();
    dialogVisible.value = true;
};

const openEdit = (row: any) => {
    dialogType.value = "edit";
    Object.assign(form, {
        ID: row.ID || "",
        StockId: row.StockId || "",
        StockName: row.StockName || "",
        StockPositionNo: row.StockPositionNo || "",
        GoodsStartCode: row.GoodsStartCode || "",
        GoodsEndCode: row.GoodsEndCode || "",
        SortCode: row.SortCode ?? 0,
        Description: row.Description || "",
    });
    dialogVisible.value = true;
};

const submitForm = async () => {
    await formRef.value?.validate();
    submitLoading.value = true;
    try {
        const userNo = userStore.getUserInfo || "";
        const params = {
            UserNo: userNo,
            ID: form.ID,
            StockId: form.StockId,
            StockName: form.StockName,
            StockPositionNo: form.StockPositionNo,
            GoodsStartCode: form.GoodsStartCode,
            GoodsEndCode: form.GoodsEndCode,
            SortCode: form.SortCode,
            Description: form.Description,
        };
        const apiFn = dialogType.value === "add" ? AddStockVirtual : UpdateStockVirtual;
        const res: any = await apiFn(params);
        if (res.Success || res.Code === 200 || res.code === 200) {
            ElMessage.success(dialogType.value === "add" ? t("message.addSuccess") : t("message.editSuccess"));
            dialogVisible.value = false;
            getData();
        } else {
            ElMessage.error(res.Msg || res.Message || (dialogType.value === "add" ? t("message.addFailure") : t("message.editFailure")));
        }
    } catch (error) {
        ElMessage.error(dialogType.value === "add" ? t("message.addFailure") : t("message.editFailure"));
    } finally {
        submitLoading.value = false;
    }
};

const handleDelete = (row: any) => {
    ElMessageBox.confirm(
        t("stockVirtual.deleteConfirm").replace("{stockId}", row.StockId || ""),
        t("publicText.tip"),
        { confirmButtonText: t("publicText.confirm"), cancelButtonText: t("publicText.cancel"), type: "warning" }
    )
        .then(async () => {
            try {
                const userNo = userStore.getUserInfo || "";
                const res: any = await DeleteStockVirtual({ UserNo: userNo, ID: row.ID, StockId: row.StockId });
                if (res.Success || res.Code === 200 || res.code === 200) {
                    ElMessage.success(t("message.deleteSuccess"));
                    getData();
                } else {
                    ElMessage.error(res.Msg || res.Message || t("message.deleteFailure"));
                }
            } catch (error) {
                ElMessage.error(t("message.deleteFailure"));
            }
        })
        .catch(() => { });
};

const getData = async () => {
    try {
        const res: any = await QueryStockVirtual(searchForm);
        if (res.Success || res.Code === 200 || res.code === 200) {
            if (res.Data && Array.isArray(res.Data.list)) {
                tableData.value = res.Data.list;
                total.value = res.Data.Total ?? 0;
            } else {
                tableData.value = [];
                total.value = 0;
            }
        } else {
            ElMessage.error(res.Msg || res.Message || t("message.queryFailure"));
            tableData.value = [];
            total.value = 0;
        }
    } catch (error) {
        ElMessage.error(t("message.queryFailure"));
    }
};

const handleSearch = () => {
    searchForm.pageIndex = 1;
    getData();
};

const resetSearch = () => {
    searchForm.StockId = "";
    searchForm.StockName = "";
    searchForm.pageIndex = 1;
    getData();
};

const handleSizeChange = (val: number) => {
    searchForm.pageSize = val;
    searchForm.pageIndex = 1;
    getData();
};

const handleCurrentChange = (val: number) => {
    searchForm.pageIndex = val;
    getData();
};

const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return dayjs(dateStr).format("YYYY-MM-DD HH:mm:ss");
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
