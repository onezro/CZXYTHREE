<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between items-center">
                <el-form ref="searchFormRef" :inline="true" :model="searchForm" label-width="auto" @submit.prevent>
                    <el-form-item :label="t('smtapply.laserPnConfig.pn')" class="mb-1">
                        <el-input v-model="searchForm.pn"
                            :placeholder="t('smtapply.laserPnConfig.pnPlaceholder')" clearable
                            style="width: 200px" size="small" @keyup.enter="handleSearch" />
                    </el-form-item>
                    <el-form-item :label="t('smtapply.laserPnConfig.side')" class="mb-1">
                        <el-select v-model="searchForm.side" clearable
                            :placeholder="t('smtapply.laserPnConfig.sidePlaceholder')"
                            style="width: 140px" size="small" @change="handleSearch">
                            <el-option :label="t('smtapply.laserPnConfig.sideTOP')" value="TOP" />
                            <el-option :label="t('smtapply.laserPnConfig.sideBOT')" value="BOT" />
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="t('smtapply.laserPnConfig.mode')" class="mb-1">
                        <el-select v-model="searchForm.mode" clearable filterable
                            :placeholder="t('smtapply.laserPnConfig.modePlaceholder')"
                            style="width: 180px" size="small" @change="handleSearch">
                            <el-option v-for="item in modeOptions" :key="item.ID"
                                :label="item.ModeName" :value="item.ModeName" />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="mb-1">
                        <el-button type="primary" size="small" @click="handleSearch">{{ t("publicText.query") }}</el-button>
                        <el-button size="small" @click="resetSearch">{{ t("publicText.reset") }}</el-button>
                        <el-button type="warning" size="small" @click="openAdd">{{ t("publicText.add") }}</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <el-table :data="paginatedData" ref="tableRef" border :height="tableHeight"
                stripe size="small" v-loading="loading"
                :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }">
                <el-table-column type="index" :label="t('publicText.index')" width="55" fixed="left" align="center">
                    <template #default="{ $index }">
                        {{ $index + 1 + (currentPage - 1) * pageSize }}
                    </template>
                </el-table-column>
                <el-table-column prop="PN" :label="t('smtapply.laserPnConfig.pn')"
                    :min-width="getColumnWidth('PN')" fixed="left" show-overflow-tooltip />
                <el-table-column prop="Side" :label="t('smtapply.laserPnConfig.side')"
                    :min-width="getColumnWidth('Side')" align="center" />
                <el-table-column prop="ModeName" :label="t('smtapply.laserPnConfig.mode')"
                    :min-width="getColumnWidth('ModeName')" show-overflow-tooltip />
                <el-table-column prop="CProgram" :label="t('smtapply.laserPnConfig.cProgram')"
                    :min-width="getColumnWidth('CProgram')" show-overflow-tooltip />
                <el-table-column prop="SProgram" :label="t('smtapply.laserPnConfig.sProgram')"
                    :min-width="getColumnWidth('SProgram')" show-overflow-tooltip />
                <el-table-column prop="Editor" :label="t('smtapply.laserPnConfig.editor')"
                    :min-width="getColumnWidth('Editor')" align="center" />
                <el-table-column prop="LastUpdated" :label="t('smtapply.laserPnConfig.lastUpdated')"
                    :min-width="getColumnWidth('LastUpdated')" align="center">
                    <template #default="{ row }">
                        {{ formatDate(row.LastUpdated) }}
                    </template>
                </el-table-column>
                <el-table-column fixed="right" :label="t('publicText.operation')" width="140" align="center">
                    <template #default="{ row }">
                        <el-button size="small" type="primary" @click="openEdit(row)" icon="Edit" />
                        <el-button size="small" type="danger" @click="handleDelete(row)" icon="Delete" />
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

        <!-- 新增/编辑弹窗 -->
        <el-dialog :title="dialogType === 'add' ? t('smtapply.laserPnConfig.addTitle') : t('smtapply.laserPnConfig.editTitle')"
            v-model="dialogVisible" width="560px"
            :close-on-click-modal="false" @closed="handleDialogClosed">
            <el-form ref="formRef" :model="form" :rules="formRules" label-width="120px" size="small">
                <el-form-item :label="t('smtapply.laserPnConfig.pn')" prop="pn">
                    <el-input v-model="form.pn"
                        :placeholder="t('smtapply.laserPnConfig.pnPlaceholder')" />
                </el-form-item>
                <el-form-item :label="t('smtapply.laserPnConfig.side')" prop="side">
                    <el-select v-model="form.side"
                        :placeholder="t('smtapply.laserPnConfig.sidePlaceholder')" style="width: 100%">
                        <el-option :label="t('smtapply.laserPnConfig.sideTOP')" value="TOP" />
                        <el-option :label="t('smtapply.laserPnConfig.sideBOT')" value="BOT" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="t('smtapply.laserPnConfig.mode')" prop="mode">
                    <el-select v-model="form.mode" filterable
                        :placeholder="t('smtapply.laserPnConfig.modePlaceholder')" style="width: 100%"
                        @change="onModeChange">
                        <el-option v-for="item in modeOptions" :key="item.ID"
                            :label="item.ModeName" :value="item.ModeName" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="t('smtapply.laserPnConfig.cProgram')" prop="cProgram">
                    <el-input v-model="form.cProgram"
                        :placeholder="t('smtapply.laserPnConfig.cProgramPlaceholder')" />
                </el-form-item>
                <el-form-item :label="t('smtapply.laserPnConfig.sProgram')" prop="sProgram">
                    <el-input v-model="form.sProgram"
                        :placeholder="t('smtapply.laserPnConfig.sProgramPlaceholder')" />
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
    QueryLaserPnConfigList,
    AddLaserPnConfig,
    UpdateLaserPnConfig,
    DeleteLaserPnConfig,
} from "@/api/smtApply/LaserPnConfig";
import { QueryLaserModeList } from "@/api/baseData/index";
import { ref, reactive, computed, nextTick, watch, onMounted, onBeforeUnmount } from "vue";
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
const allData = ref<any[]>([]);
const modeOptions = ref<any[]>([]);

const searchForm = reactive({
    pn: "",
    side: "",
    mode: "",
});

// 前端过滤后的分页数据
const filteredData = computed(() => {
    return allData.value.filter((r: any) => {
        const pnOk = !searchForm.pn || (r.PN && r.PN.toLowerCase().includes(searchForm.pn.toLowerCase()));
        const sideOk = !searchForm.side || r.Side === searchForm.side;
        const modeOk = !searchForm.mode || r.ModeName === searchForm.mode;
        return pnOk && sideOk && modeOk;
    });
});

const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return filteredData.value.slice(start, end);
});

watch(
    () => filteredData.value.length,
    (val) => { total.value = val; },
    { immediate: true }
);

const { getColumnWidth } = useTableColumnWidth(tableRef, allData, {
    excludeLabels: [t("publicText.index"), t("publicText.operation")],
});

const dialogVisible = ref(false);
const dialogType = ref<"add" | "edit">("add");
const formRef = ref();
const form = reactive({
    ID: "",
    pn: "",
    side: "",
    mode: "",
    cProgram: "",
    sProgram: "",
    Editor: "",
});

// 当前选中模式的 C/S 必填配置
const selectedModeObj = computed(() =>
    modeOptions.value.find((m: any) => m.ModeName === form.mode)
);
const cProgramRequired = computed(() => !!selectedModeObj.value?.HasCProgram);
const sProgramRequired = computed(() => !!selectedModeObj.value?.HasSProgram);

const formRules = computed(() => ({
    pn: [
        { required: true, message: t("smtapply.laserPnConfig.pnRequired"), trigger: "blur" },
    ],
    side: [
        { required: true, message: t("smtapply.laserPnConfig.sideRequired"), trigger: "change" },
    ],
    mode: [
        { required: true, message: t("smtapply.laserPnConfig.modeRequired"), trigger: "change" },
    ],
    cProgram: cProgramRequired.value
        ? [{ required: true, message: t("smtapply.laserPnConfig.cProgramPlaceholder"), trigger: "blur" }]
        : [],
    sProgram: sProgramRequired.value
        ? [{ required: true, message: t("smtapply.laserPnConfig.sProgramPlaceholder"), trigger: "blur" }]
        : [],
}));

const onModeChange = () => {
    // 模式切换后重新校验 C/S 程序字段
    nextTick(() => {
        formRef.value?.clearValidate(["cProgram", "sProgram"]);
    });
};

const resetForm = () => {
    Object.assign(form, {
        ID: "",
        pn: "",
        side: "",
        mode: "",
        cProgram: "",
        sProgram: "",
        Editor: "",
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
        pn: row.PN || "",
        side: row.Side || "",
        mode: row.ModeName || "",
        cProgram: row.CProgram || "",
        sProgram: row.SProgram || "",
        Editor: row.Editor || "",
    });
    dialogVisible.value = true;
};

const submitForm = async () => {
    await formRef.value?.validate();
    submitLoading.value = true;
    try {
        const userNo = userStore.getUserInfo || "";
        const params = {
            ID: form.ID,
            pn: form.pn,
            side: form.side,
            mode: form.mode,
            cProgram: form.cProgram,
            sProgram: form.sProgram,
            Editor: userNo,
            UserNo: userNo,
        };
        const apiFn = dialogType.value === "add" ? AddLaserPnConfig : UpdateLaserPnConfig;
        const res: any = await apiFn(params);
        if (res.Success || res.Code === 0 || res.code === 200) {
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
        t("smtapply.laserPnConfig.deleteConfirm")
            .replace("{pn}", row.PN || "")
            .replace("{side}", row.Side || ""),
        t("publicText.tip"),
        { confirmButtonText: t("publicText.confirm"), cancelButtonText: t("publicText.cancel"), type: "warning" }
    )
        .then(async () => {
            loading.value = true;
            try {
                const userNo = userStore.getUserInfo || "";
                const res: any = await DeleteLaserPnConfig({ ID: row.ID, pn: row.PN, side: row.Side, UserNo: userNo });
                if (res.Success || res.Code === 0 || res.code === 200) {
                    ElMessage.success(t("message.deleteSuccess"));
                    getData();
                } else {
                    ElMessage.error(res.Msg || res.Message || t("message.deleteFailure"));
                }
            } catch (error) {
                ElMessage.error(t("message.deleteFailure"));
            } finally {
                loading.value = false;
            }
        })
        .catch(() => { });
};

// 查询 - 后端返回数组（无分页），前端做过滤+分页
const getData = async () => {
    loading.value = true;
    try {
        const params = {
            pn: searchForm.pn,
            side: searchForm.side,
            mode: searchForm.mode,
        };
        const res: any = await QueryLaserPnConfigList(params);
        if (res.Success || res.Code === 0 || res.code === 200) {
            if (res.Data && Array.isArray(res.Data)) {
                allData.value = res.Data;
            } else if (res.Data && Array.isArray(res.Data.rows)) {
                allData.value = res.Data.rows;
            } else {
                allData.value = [];
            }
            currentPage.value = 1;
        } else {
            ElMessage.error(res.Msg || res.Message || t("message.queryFailure"));
        }
    } catch (error) {
        ElMessage.error(t("message.queryFailure"));
    } finally {
        loading.value = false;
    }
};

// 获取模式列表
const getModeOptions = async () => {
    try {
        const res: any = await QueryLaserModeList({});
        if (res.Success || res.Code === 0 || res.code === 200) {
            if (res.Data && Array.isArray(res.Data)) {
                modeOptions.value = res.Data;
            } else if (res.Data && Array.isArray(res.Data.rows)) {
                modeOptions.value = res.Data.rows;
            } else {
                modeOptions.value = [];
            }
        }
    } catch (error) {
        // 静默失败
    }
};

const handleSearch = () => {
    currentPage.value = 1;
};

const resetSearch = () => {
    searchForm.pn = "";
    searchForm.side = "";
    searchForm.mode = "";
    currentPage.value = 1;
};

const handleSizeChange = (val: number) => {
    pageSize.value = val;
    currentPage.value = 1;
};

const handleCurrentChange = (val: number) => {
    currentPage.value = val;
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
    getModeOptions();
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
