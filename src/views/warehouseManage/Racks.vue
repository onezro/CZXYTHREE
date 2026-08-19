<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between items-center">
                <el-form ref="searchFormRef" :inline="true" :model="searchForm" label-width="auto" @submit.prevent>
                    <el-form-item :label="t('racks.rack')" class="mb-2">
                        <el-input v-model="searchForm.rack"
                            :placeholder="t('racks.rackPlaceholder')" clearable
                            style="width: 160px" size="small" @keyup.enter="handleSearch" />
                    </el-form-item>
                    <el-form-item :label="t('racks.name')" class="mb-2">
                        <el-input v-model="searchForm.name"
                            :placeholder="t('racks.namePlaceholder')" clearable
                            style="width: 160px" size="small" @keyup.enter="handleSearch" />
                    </el-form-item>
                    <el-form-item :label="t('racks.type')" class="mb-2">
                        <el-select v-model="searchForm.type" clearable
                            :placeholder="t('racks.typePlaceholder')"
                            style="width: 140px" size="small" @change="handleSearch">
                            <el-option :label="t('racks.type0')" :value="0" />
                            <el-option :label="t('racks.type1')" :value="1" />
                        </el-select>
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
                <el-table-column prop="rack" :label="t('racks.rack')"
                    :min-width="getColumnWidth('rack')" fixed="left" show-overflow-tooltip />
                <el-table-column prop="name" :label="t('racks.name')"
                    :min-width="getColumnWidth('name')" show-overflow-tooltip />
                <el-table-column prop="type" :label="t('racks.type')"
                    :min-width="getColumnWidth('type')" align="center">
                    <template #default="{ row }">
                        {{ row.type === 1 ? t('racks.type1') : t('racks.type0') }}
                    </template>
                </el-table-column>
                <el-table-column prop="mode" :label="t('racks.mode')"
                    :min-width="getColumnWidth('mode')" align="center" />
                <el-table-column prop="qty" :label="t('racks.qty')"
                    :min-width="getColumnWidth('qty')" align="right" />
                <el-table-column prop="level" :label="t('racks.level')"
                    :min-width="getColumnWidth('level')" align="center" />
                <el-table-column prop="stts" :label="t('racks.stts')"
                    :min-width="getColumnWidth('stts')" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.stts === 1 ? 'success' : 'info'" size="small">
                            {{ row.stts === 1 ? t('racks.sttsOnline') : t('racks.sttsOffline') }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="usage" :label="t('racks.usage')"
                    :min-width="getColumnWidth('usage')" align="right" />
                <el-table-column prop="cell_begin" :label="t('racks.cell_begin')"
                    :min-width="getColumnWidth('cell_begin')" show-overflow-tooltip />
                <el-table-column prop="cell_end" :label="t('racks.cell_end')"
                    :min-width="getColumnWidth('cell_end')" show-overflow-tooltip />
                <el-table-column prop="ip_eth" :label="t('racks.ip_eth')"
                    :min-width="getColumnWidth('ip_eth')" show-overflow-tooltip />
                <el-table-column prop="mac_eth" :label="t('racks.mac_eth')"
                    :min-width="getColumnWidth('mac_eth')" show-overflow-tooltip />
                <el-table-column prop="ip_wifi" :label="t('racks.ip_wifi')"
                    :min-width="getColumnWidth('ip_wifi')" show-overflow-tooltip />
                <el-table-column prop="mac_wifi" :label="t('racks.mac_wifi')"
                    :min-width="getColumnWidth('mac_wifi')" show-overflow-tooltip />
                <el-table-column prop="warehouse" :label="t('racks.warehouse')"
                    :min-width="getColumnWidth('warehouse')" show-overflow-tooltip />
                <el-table-column prop="controller" :label="t('racks.controller')"
                    :min-width="getColumnWidth('controller')" show-overflow-tooltip />
                <el-table-column prop="customer" :label="t('racks.customer')"
                    :min-width="getColumnWidth('customer')" show-overflow-tooltip />
                <el-table-column prop="dsc" :label="t('racks.dsc')"
                    :min-width="getColumnWidth('dsc')" show-overflow-tooltip />
                <el-table-column prop="crt_dt" :label="t('racks.crt_dt')"
                    :min-width="getColumnWidth('crt_dt')" align="center">
                    <template #default="{ row }">
                        {{ formatDate(row.crt_dt) }}
                    </template>
                </el-table-column>
                <el-table-column prop="crt_usr" :label="t('racks.crt_usr')"
                    :min-width="getColumnWidth('crt_usr')" align="center" />
                <el-table-column prop="ud_dt" :label="t('racks.ud_dt')"
                    :min-width="getColumnWidth('ud_dt')" align="center">
                    <template #default="{ row }">
                        {{ formatDate(row.ud_dt) }}
                    </template>
                </el-table-column>
                <el-table-column prop="ud_usr" :label="t('racks.ud_usr')"
                    :min-width="getColumnWidth('ud_usr')" align="center" />
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
        <el-dialog :title="dialogType === 'add' ? t('racks.addTitle') : t('racks.editTitle')"
            v-model="dialogVisible" width="640px"
            :close-on-click-modal="false" @closed="handleDialogClosed">
            <el-form ref="formRef" :model="form" :rules="formRules" label-width="120px" size="small">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('racks.rack')" prop="rack">
                            <el-input v-model="form.rack"
                                :placeholder="t('racks.rackPlaceholder')"
                                :disabled="dialogType === 'edit'" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('racks.name')" prop="name">
                            <el-input v-model="form.name"
                                :placeholder="t('racks.namePlaceholder')" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('racks.type')" prop="type">
                            <el-select v-model="form.type"
                                :placeholder="t('racks.typePlaceholder')" style="width: 100%">
                                <el-option :label="t('racks.type0')" :value="0" />
                                <el-option :label="t('racks.type1')" :value="1" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('racks.mode')" prop="mode">
                            <el-select v-model="form.mode" style="width: 100%">
                                <el-option :label="t('racks.mode0')" :value="0" />
                                <el-option :label="t('racks.mode1')" :value="1" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('racks.qty')" prop="qty">
                            <el-input-number v-model="form.qty" :min="0" controls-position="right"
                                style="width: 100%" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('racks.level')" prop="level">
                            <el-input-number v-model="form.level" :min="0" controls-position="right"
                                style="width: 100%" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('racks.cell_begin')" prop="cell_begin">
                            <el-input v-model="form.cell_begin"
                                :placeholder="t('racks.rackPlaceholder')" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('racks.cell_end')" prop="cell_end">
                            <el-input v-model="form.cell_end"
                                :placeholder="t('racks.rackPlaceholder')" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('racks.ip_eth')" prop="ip_eth">
                            <el-input v-model="form.ip_eth"
                                :placeholder="t('racks.rackPlaceholder')" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('racks.mac_eth')" prop="mac_eth">
                            <el-input v-model="form.mac_eth"
                                :placeholder="t('racks.rackPlaceholder')" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('racks.ip_wifi')" prop="ip_wifi">
                            <el-input v-model="form.ip_wifi"
                                :placeholder="t('racks.rackPlaceholder')" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('racks.mac_wifi')" prop="mac_wifi">
                            <el-input v-model="form.mac_wifi"
                                :placeholder="t('racks.rackPlaceholder')" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('racks.warehouse')" prop="warehouse">
                            <el-input v-model="form.warehouse"
                                :placeholder="t('racks.rackPlaceholder')" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('racks.controller')" prop="controller">
                            <el-input v-model="form.controller"
                                :placeholder="t('racks.rackPlaceholder')" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('racks.customer')" prop="customer">
                            <el-input v-model="form.customer"
                                :placeholder="t('racks.rackPlaceholder')" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('racks.point')" prop="point">
                            <el-input v-model="form.point"
                                :placeholder="t('racks.rackPlaceholder')" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item :label="t('racks.dsc')" prop="dsc">
                            <el-input v-model="form.dsc" type="textarea" :rows="2"
                                :placeholder="t('racks.rackPlaceholder')" />
                        </el-form-item>
                    </el-col>
                </el-row>
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
    QueryRacks,
    AddRacks,
    UpdateRacks,
    DeleteRacks,
} from "@/api/warehouseManage/racks";
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
    rack: "",
    name: "",
    type: undefined as number | undefined,
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
    rack: "",
    name: "",
    type: 0,
    mode: 0,
    qty: 0,
    level: 0,
    cell_begin: "",
    cell_end: "",
    ip_eth: "",
    mac_eth: "",
    ip_wifi: "",
    mac_wifi: "",
    warehouse: "",
    controller: "",
    dsc: "",
    customer: "",
    point: "",
});

const formRules = computed(() => ({
    rack: [
        { required: true, message: t("racks.rackRequired"), trigger: "blur" },
    ],
    name: [
        { required: true, message: t("racks.nameRequired"), trigger: "blur" },
    ],
}));

const resetForm = () => {
    Object.assign(form, {
        ID: "",
        rack: "",
        name: "",
        type: 0,
        mode: 0,
        qty: 0,
        level: 0,
        cell_begin: "",
        cell_end: "",
        ip_eth: "",
        mac_eth: "",
        ip_wifi: "",
        mac_wifi: "",
        warehouse: "",
        controller: "",
        dsc: "",
        customer: "",
        point: "",
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
        rack: row.rack || "",
        name: row.name || "",
        type: row.type ?? 0,
        mode: row.mode ?? 0,
        qty: row.qty ?? 0,
        level: row.level ?? 0,
        cell_begin: row.cell_begin || "",
        cell_end: row.cell_end || "",
        ip_eth: row.ip_eth || "",
        mac_eth: row.mac_eth || "",
        ip_wifi: row.ip_wifi || "",
        mac_wifi: row.mac_wifi || "",
        warehouse: row.warehouse || "",
        controller: row.controller || "",
        dsc: row.dsc || "",
        customer: row.customer || "",
        point: "",
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
            rack: form.rack,
            name: form.name,
            type: form.type,
            mode: form.mode,
            qty: form.qty,
            level: form.level,
            cell_begin: form.cell_begin,
            cell_end: form.cell_end,
            ip_eth: form.ip_eth,
            mac_eth: form.mac_eth,
            ip_wifi: form.ip_wifi,
            mac_wifi: form.mac_wifi,
            warehouse: form.warehouse,
            controller: form.controller,
            dsc: form.dsc,
            customer: form.customer,
            point: form.point,
        };
        const apiFn = dialogType.value === "add" ? AddRacks : UpdateRacks;
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
        t("racks.deleteConfirm").replace("{rack}", row.rack || ""),
        t("publicText.tip"),
        { confirmButtonText: t("publicText.confirm"), cancelButtonText: t("publicText.cancel"), type: "warning" }
    )
        .then(async () => {
            try {
                const userNo = userStore.getUserInfo || "";
                const res: any = await DeleteRacks({ UserNo: userNo, ID: row.ID, rack: row.rack });
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
        const res: any = await QueryRacks(searchForm);
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
    searchForm.rack = "";
    searchForm.name = "";
    searchForm.type = undefined;
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
