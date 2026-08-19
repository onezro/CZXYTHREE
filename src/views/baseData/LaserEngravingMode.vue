<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between items-center">
                <el-form ref="searchFormRef" :inline="true" :model="searchForm" label-width="auto" @submit.prevent>
                    <el-form-item :label="t('baseData.laserEngravingMode.modeName')" class="mb-1">
                        <el-input v-model="searchForm.modeName"
                            :placeholder="t('baseData.laserEngravingMode.searchPlaceholder')" clearable
                            style="width: 220px" size="small" @keyup.enter="handleSearch" />
                    </el-form-item>
                    <el-form-item class="mb-1">
                        <el-button type="primary" size="small" @click="handleSearch">{{ t("publicText.query") }}</el-button>
                        <el-button size="small" @click="resetSearch">{{ t("publicText.reset") }}</el-button>
                        <el-button type="warning" size="small" @click="openAdd">{{ t("publicText.add") }}</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <el-table :data="paginatedData" ref="tableRef" border :height="tableHeight"
                stripe size="small" 
                :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }">
                <el-table-column type="index" :label="t('publicText.index')" width="55" fixed="left" align="center">
                    <template #default="{ $index }">
                        {{ $index + 1 + (currentPage - 1) * pageSize }}
                    </template>
                </el-table-column>
                <el-table-column prop="ModeName" :label="t('baseData.laserEngravingMode.modeName')"
                    :min-width="getColumnWidth('ModeName')" fixed="left" show-overflow-tooltip />
                <el-table-column prop="HasCProgram" :label="t('baseData.laserEngravingMode.hasCProgram')"
                    :min-width="getColumnWidth('HasCProgram')" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.HasCProgram ? 'success' : 'info'" size="small">
                            {{ row.HasCProgram ? t('publicText.yes') : t('publicText.no') }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="HasSProgram" :label="t('baseData.laserEngravingMode.hasSProgram')"
                    :min-width="getColumnWidth('HasSProgram')" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.HasSProgram ? 'success' : 'info'" size="small">
                            {{ row.HasSProgram ? t('publicText.yes') : t('publicText.no') }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="Editor" :label="t('baseData.laserEngravingMode.editor')"
                    :min-width="getColumnWidth('Editor')" align="center" />
                <el-table-column prop="LastUpdated" :label="t('baseData.laserEngravingMode.lastUpdated')"
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
        <el-dialog :title="dialogType === 'add' ? t('baseData.laserEngravingMode.addTitle') : t('baseData.laserEngravingMode.editTitle')"
            v-model="dialogVisible" width="520px"
            :close-on-click-modal="false" @closed="handleDialogClosed">
            <el-form ref="formRef" :model="form" :rules="formRules" label-width="130px" size="small">
                <el-form-item :label="t('baseData.laserEngravingMode.modeName')" prop="mode">
                    <el-input v-model="form.mode"
                        :placeholder="t('baseData.laserEngravingMode.modeNamePlaceholder')" />
                </el-form-item>
                <el-form-item :label="t('baseData.laserEngravingMode.hasCProgram')" prop="hasCProgram">
                    <el-switch v-model="form.hasCProgram"
                        :active-text="t('publicText.yes')" :inactive-text="t('publicText.no')" />
                </el-form-item>
                <el-form-item :label="t('baseData.laserEngravingMode.hasSProgram')" prop="hasSProgram">
                    <el-switch v-model="form.hasSProgram"
                        :active-text="t('publicText.yes')" :inactive-text="t('publicText.no')" />
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
    QueryLaserModeList,
    AddLaserMode,
    UpdateLaserMode,
    DeleteLaserMode,
} from "@/api/baseData/index";
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

const searchForm = reactive({
    modeName: "",
});

// 前端过滤后的分页数据
const filteredData = computed(() => {
    if (!searchForm.modeName) return allData.value;
    const keyword = searchForm.modeName.toLowerCase();
    return allData.value.filter((r: any) =>
        r.ModeName && r.ModeName.toLowerCase().includes(keyword)
    );
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
    mode: "",
    hasCProgram: false,
    hasSProgram: false,
    Editor: "",
});

const formRules = {
    mode: [
        { required: true, message: t("baseData.laserEngravingMode.modeRequired"), trigger: "blur" },
    ],
};

const resetForm = () => {
    Object.assign(form, {
        ID: "",
        mode: "",
        hasCProgram: false,
        hasSProgram: false,
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
        mode: row.ModeName || "",
        hasCProgram: !!row.HasCProgram,
        hasSProgram: !!row.HasSProgram,
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
            mode: form.mode,
            hasCProgram: form.hasCProgram,
            hasSProgram: form.hasSProgram,
            Editor: userNo,
            UserNo: userNo,
        };
        const apiFn = dialogType.value === "add" ? AddLaserMode : UpdateLaserMode;
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
        t("baseData.laserEngravingMode.deleteConfirm").replace("{name}", row.ModeName || ""),
        t("publicText.tip"),
        { confirmButtonText: t("publicText.confirm"), cancelButtonText: t("publicText.cancel"), type: "warning" }
    )
        .then(async () => {
            loading.value = true;
            try {
                const userNo = userStore.getUserInfo || "";
                const res: any = await DeleteLaserMode({ ID: row.ID, UserNo: userNo });
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
        const res: any = await QueryLaserModeList({});
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

const handleSearch = () => {
    currentPage.value = 1;
};

const resetSearch = () => {
    searchForm.modeName = "";
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
