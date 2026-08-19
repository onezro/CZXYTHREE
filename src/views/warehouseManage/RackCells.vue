<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between items-center">
                <el-form ref="searchFormRef" :inline="true" :model="searchForm" label-width="auto" @submit.prevent>
                    <el-form-item :label="t('rackCells.rack')" class="mb-2">
                        <el-input v-model="searchForm.rack"
                            :placeholder="t('rackCells.rackPlaceholder')" clearable
                            style="width: 160px" size="small" @keyup.enter="handleSearch" />
                    </el-form-item>
                    <el-form-item :label="t('rackCells.cell')" class="mb-2">
                        <el-input v-model="searchForm.cell"
                            :placeholder="t('rackCells.cellPlaceholder')" clearable
                            style="width: 160px" size="small" @keyup.enter="handleSearch" />
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
                <el-table-column prop="rack" :label="t('rackCells.rack')"
                    :min-width="getColumnWidth('rack')" fixed="left" show-overflow-tooltip />
                <el-table-column prop="cell" :label="t('rackCells.cell')"
                    :min-width="getColumnWidth('cell')" fixed="left" show-overflow-tooltip />
                <el-table-column prop="name" :label="t('rackCells.name')"
                    :min-width="getColumnWidth('name')" show-overflow-tooltip />
                <el-table-column prop="spec" :label="t('rackCells.spec')"
                    :min-width="getColumnWidth('spec')" show-overflow-tooltip />
                <el-table-column prop="tray" :label="t('rackCells.tray')"
                    :min-width="getColumnWidth('tray')" show-overflow-tooltip />
                <el-table-column prop="type" :label="t('rackCells.type')"
                    :min-width="getColumnWidth('type')" align="center">
                    <template #default="{ row }">
                        {{ row.type === 1 ? t('rackCells.type1') : t('rackCells.type0') }}
                    </template>
                </el-table-column>
                <el-table-column prop="side" :label="t('rackCells.side')"
                    :min-width="getColumnWidth('side')" align="center">
                    <template #default="{ row }">
                        {{ getSideText(row.side) }}
                    </template>
                </el-table-column>
                <el-table-column prop="led" :label="t('rackCells.led')"
                    :min-width="getColumnWidth('led')" align="center">
                    <template #default="{ row }">
                        {{ row.led === 1 ? t('rackCells.led1') : t('rackCells.led0') }}
                    </template>
                </el-table-column>
                <el-table-column prop="led_color" :label="t('rackCells.led_color')"
                    :min-width="getColumnWidth('led_color')" align="center" />
                <el-table-column prop="blink" :label="t('rackCells.blink')"
                    :min-width="getColumnWidth('blink')" align="center" />
                <el-table-column prop="Capacity" :label="t('rackCells.Capacity')"
                    :min-width="getColumnWidth('Capacity')" align="right" />
                <el-table-column prop="sensor" :label="t('rackCells.sensor')"
                    :min-width="getColumnWidth('sensor')" align="center">
                    <template #default="{ row }">
                        {{ row.sensor === 1 ? t('rackCells.sensor1') : t('rackCells.sensor0') }}
                    </template>
                </el-table-column>
                <el-table-column prop="stts" :label="t('rackCells.stts')"
                    :min-width="getColumnWidth('stts')" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.stts === 1 ? 'danger' : 'success'" size="small">
                            {{ row.stts === 1 ? t('rackCells.stts1') : t('rackCells.stts0') }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="used" :label="t('rackCells.used')"
                    :min-width="getColumnWidth('used')" align="right" />
                <el-table-column prop="need_chk" :label="t('rackCells.need_chk')"
                    :min-width="getColumnWidth('need_chk')" align="center" />
                <el-table-column prop="lock_md" :label="t('rackCells.lock_md')"
                    :min-width="getColumnWidth('lock_md')" align="center" />
                <el-table-column prop="lock_id" :label="t('rackCells.lock_id')"
                    :min-width="getColumnWidth('lock_id')" show-overflow-tooltip />
                <el-table-column prop="lock_sht" :label="t('rackCells.lock_sht')"
                    :min-width="getColumnWidth('lock_sht')" show-overflow-tooltip />
                <el-table-column prop="chkin_sht" :label="t('rackCells.chkin_sht')"
                    :min-width="getColumnWidth('chkin_sht')" show-overflow-tooltip />
                <el-table-column prop="dsc" :label="t('rackCells.dsc')"
                    :min-width="getColumnWidth('dsc')" show-overflow-tooltip />
                <el-table-column prop="ud_dt" :label="t('rackCells.ud_dt')"
                    :min-width="getColumnWidth('ud_dt')" align="center">
                    <template #default="{ row }">
                        {{ formatDate(row.ud_dt) }}
                    </template>
                </el-table-column>
                <el-table-column prop="ud_usr" :label="t('rackCells.ud_usr')"
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
        <el-dialog :title="dialogType === 'add' ? t('rackCells.addTitle') : t('rackCells.editTitle')"
            v-model="dialogVisible" width="600px"
            :close-on-click-modal="false" @closed="handleDialogClosed">
            <el-form ref="formRef" :model="form" :rules="formRules" label-width="100px" size="small">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('rackCells.rack')" prop="rack">
                            <el-input v-model="form.rack"
                                :placeholder="t('rackCells.rackPlaceholder')" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('rackCells.cell')" prop="cell">
                            <el-input v-model="form.cell"
                                :placeholder="t('rackCells.cellPlaceholder')"
                                :disabled="dialogType === 'edit'" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('rackCells.name')" prop="name">
                            <el-input v-model="form.name"
                                :placeholder="t('rackCells.rackPlaceholder')" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('rackCells.spec')" prop="spec">
                            <el-input v-model="form.spec"
                                :placeholder="t('rackCells.rackPlaceholder')" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('rackCells.tray')" prop="tray">
                            <el-input v-model="form.tray"
                                :placeholder="t('rackCells.rackPlaceholder')" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('rackCells.type')" prop="type">
                            <el-select v-model="form.type" style="width: 100%">
                                <el-option :label="t('rackCells.type0')" :value="0" />
                                <el-option :label="t('rackCells.type1')" :value="1" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('rackCells.side')" prop="side">
                            <el-select v-model="form.side" style="width: 100%">
                                <el-option :label="t('rackCells.side0')" :value="0" />
                                <el-option :label="t('rackCells.side1')" :value="1" />
                                <el-option :label="t('rackCells.side2')" :value="2" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('rackCells.led')" prop="led">
                            <el-select v-model="form.led" style="width: 100%">
                                <el-option :label="t('rackCells.led0')" :value="0" />
                                <el-option :label="t('rackCells.led1')" :value="1" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('rackCells.Capacity')" prop="Capacity">
                            <el-input-number v-model="form.Capacity" :min="0" controls-position="right"
                                style="width: 100%" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('rackCells.sensor')" prop="sensor">
                            <el-select v-model="form.sensor" style="width: 100%">
                                <el-option :label="t('rackCells.sensor0')" :value="0" />
                                <el-option :label="t('rackCells.sensor1')" :value="1" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item :label="t('rackCells.dsc')" prop="dsc">
                            <el-input v-model="form.dsc" type="textarea" :rows="2"
                                :placeholder="t('rackCells.rackPlaceholder')" />
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
    QueryRackCells,
    AddRackCells,
    UpdateRackCells,
    DeleteRackCells,
} from "@/api/warehouseManage/rackCells";
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
    cell: "",
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
    ID: 0,
    rack: "",
    cell: "",
    led: 0,
    side: 0,
    type: 0,
    Capacity: 0,
    sensor: 0,
    name: "",
    spec: "",
    tray: "",
    dsc: "",
});

const formRules = computed(() => ({
    rack: [
        { required: true, message: t("rackCells.rackRequired"), trigger: "blur" },
    ],
    cell: [
        { required: true, message: t("rackCells.cellRequired"), trigger: "blur" },
    ],
}));

const getSideText = (side: number) => {
    if (side === 1) return t('rackCells.side1');
    if (side === 2) return t('rackCells.side2');
    return t('rackCells.side0');
};

const resetForm = () => {
    Object.assign(form, {
        ID: 0,
        rack: "",
        cell: "",
        led: 0,
        side: 0,
        type: 0,
        Capacity: 0,
        sensor: 0,
        name: "",
        spec: "",
        tray: "",
        dsc: "",
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
        ID: row.ID ?? 0,
        rack: row.rack || "",
        cell: row.cell || "",
        led: row.led ?? 0,
        side: row.side ?? 0,
        type: row.type ?? 0,
        Capacity: row.Capacity ?? 0,
        sensor: row.sensor ?? 0,
        name: row.name || "",
        spec: row.spec || "",
        tray: row.tray || "",
        dsc: row.dsc || "",
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
            cell: form.cell,
            led: form.led,
            side: form.side,
            type: form.type,
            Capacity: form.Capacity,
            sensor: form.sensor,
            name: form.name,
            spec: form.spec,
            tray: form.tray,
            dsc: form.dsc,
        };
        const apiFn = dialogType.value === "add" ? AddRackCells : UpdateRackCells;
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
        t("rackCells.deleteConfirm").replace("{cell}", row.cell || ""),
        t("publicText.tip"),
        { confirmButtonText: t("publicText.confirm"), cancelButtonText: t("publicText.cancel"), type: "warning" }
    )
        .then(async () => {
            try {
                const userNo = userStore.getUserInfo || "";
                const res: any = await DeleteRackCells({ UserNo: userNo, ID: row.ID, cell: row.cell });
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
        const res: any = await QueryRackCells(searchForm);
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
    searchForm.cell = "";
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
