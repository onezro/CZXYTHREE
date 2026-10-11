<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between items-center">
                <el-form ref="searchFormRef" :inline="true" :model="searchForm" label-width="auto" @submit.prevent>
                    <el-form-item :label="t('smtapply.laserPnConfig.updateTime')" class="mb-1">
                        <el-date-picker v-model="searchForm.timeRange" type="datetimerange" size="small"
                            :range-separator="t('publicText.to')"
                            :start-placeholder="t('publicText.startDate')"
                            :end-placeholder="t('publicText.endDate')"
                            value-format="YYYY-MM-DD HH:mm:ss" style="width: 340px"
                            :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
                            @change="handleSearch" />
                    </el-form-item>
                    <el-form-item :label="t('smtapply.laserPnConfig.pn')" class="mb-1">
                        <el-select v-model="searchForm.pn" clearable filterable
                            :placeholder="t('smtapply.laserPnConfig.pnPlaceholder')"
                            style="width: 200px" size="small" @change="handleSearch">
                            <el-option v-for="item in productOptions" :key="item" :label="item" :value="item" />
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="t('smtapply.laserPnConfig.panelShape')" class="mb-1">
                        <el-select v-model="searchForm.pannelShape" clearable
                            :placeholder="t('smtapply.laserPnConfig.panelShapePlaceholder')"
                            style="width: 140px" size="small" @change="handleSearch">
                            <el-option :label="t('smtapply.laserPnConfig.panelSingle')" value="1" />
                            <el-option :label="t('smtapply.laserPnConfig.panelDouble')" value="2" />
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="t('smtapply.laserPnConfig.side')" class="mb-1">
                        <el-select v-model="searchForm.side" clearable
                            :placeholder="t('smtapply.laserPnConfig.sidePlaceholder')"
                            style="width: 120px" size="small" @change="handleSearch">
                            <el-option :label="t('smtapply.laserPnConfig.sideTOP')" value="TOP" />
                            <el-option :label="t('smtapply.laserPnConfig.sideBOT')" value="BOT" />
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="t('smtapply.laserPnConfig.mode')" class="mb-1">
                        <el-select v-model="searchForm.mode" clearable filterable
                            :placeholder="t('smtapply.laserPnConfig.modePlaceholder')"
                            style="width: 180px" size="small" @change="handleSearch">
                            <el-option v-for="item in modeOptions" :key="item.value"
                                :label="item.label" :value="item.value" />
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
                <el-table-column prop="pn" :label="t('smtapply.laserPnConfig.pn')"
                    :min-width="getColumnWidth('pn')" fixed="left" show-overflow-tooltip />
                <el-table-column prop="PanelName" :label="t('smtapply.laserPnConfig.panelShape')"
                    :min-width="getColumnWidth('PanelName')" align="center" />
                <el-table-column prop="Side" :label="t('smtapply.laserPnConfig.side')"
                    :min-width="getColumnWidth('Side')" align="center" />
                <el-table-column prop="ModeName" :label="t('smtapply.laserPnConfig.mode')"
                    :min-width="getColumnWidth('ModeName')" show-overflow-tooltip />
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

        <!-- 新增绑定 -->
        <el-dialog :title="t('smtapply.laserPnConfig.addTitle')" v-model="addVisible" width="560px"
            :close-on-click-modal="false" @closed="handleAddClosed">
            <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="120px" size="small">
                <el-form-item :label="t('smtapply.laserPnConfig.pn')" prop="pn">
                    <el-select v-model="addForm.pn" filterable clearable
                        :placeholder="t('smtapply.laserPnConfig.pnPlaceholder')"
                        style="width: 100%" @change="onAddPnChange">
                        <el-option v-for="item in productOptions" :key="item" :label="item" :value="item" />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="addPanelShape" :label="t('smtapply.laserPnConfig.panelShape')">
                    <el-tag :type="addPanelShape === '2' ? 'warning' : 'success'" size="small">
                        {{ addPanelShape === '2' ? t('smtapply.laserPnConfig.panelDouble') : t('smtapply.laserPnConfig.panelSingle') }}
                    </el-tag>
                </el-form-item>
                <el-form-item v-if="addPanelShape" :label="t('smtapply.laserPnConfig.topMode')" prop="topMode">
                    <el-select v-model="addForm.topMode" filterable
                        :placeholder="t('smtapply.laserPnConfig.topModePlaceholder')" style="width: 100%">
                        <el-option v-for="item in modeOptions" :key="item.value"
                            :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="addPanelShape === '2'" :label="t('smtapply.laserPnConfig.botMode')" prop="botMode">
                    <el-select v-model="addForm.botMode" filterable
                        :placeholder="t('smtapply.laserPnConfig.botModePlaceholder')" style="width: 100%">
                        <el-option v-for="item in modeOptions" :key="item.value"
                            :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="addVisible = false">{{ t('publicText.cancel') }}</el-button>
                <el-button type="primary" :loading="submitLoading" @click="submitAdd">{{ t('publicText.confirm') }}</el-button>
            </template>
        </el-dialog>

        <!-- 编辑绑定 -->
        <el-dialog :title="t('smtapply.laserPnConfig.editTitle')" v-model="editVisible" width="560px"
            :close-on-click-modal="false" @closed="handleEditClosed">
            <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="120px" size="small">
                <el-form-item :label="t('smtapply.laserPnConfig.pn')" prop="pn">
                    <el-input v-model="editForm.pn" disabled />
                </el-form-item>
                <el-form-item :label="t('smtapply.laserPnConfig.side')" prop="side">
                    <el-select v-model="editForm.side"
                        :placeholder="t('smtapply.laserPnConfig.sidePlaceholder')" style="width: 100%">
                        <el-option :label="t('smtapply.laserPnConfig.sideTOP')" value="TOP" />
                        <el-option :label="t('smtapply.laserPnConfig.sideBOT')" value="BOT" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="t('smtapply.laserPnConfig.mode')" prop="mode">
                    <el-select v-model="editForm.mode" filterable
                        :placeholder="t('smtapply.laserPnConfig.modePlaceholder')" style="width: 100%">
                        <el-option v-for="item in modeOptions" :key="item.value"
                            :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="editVisible = false">{{ t('publicText.cancel') }}</el-button>
                <el-button type="primary" :loading="submitLoading" @click="submitEdit">{{ t('publicText.confirm') }}</el-button>
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
    QueryLaserProductList,
    QueryLaserPanelShape,
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
const productOptions = ref<string[]>([]);
const modeList = ref<any[]>([]);

// 板型数值 -> 后端约定的板型名称
const panelNameMap: Record<string, string> = { "1": "单面板", "2": "双面板" };

const searchForm = reactive({
    pn: "",
    pannelShape: "",
    side: "",
    mode: "",
    timeRange: [] as string[],
});

// 模式下拉：值统一为「模式编号.模式名称」
const modeOptions = computed(() =>
    modeList.value.map((m: any) => {
        const value = m.ModeCode != null && m.ModeCode !== ""
            ? `${m.ModeCode}.${m.ModeName}`
            : (m.ModeName || "");
        return { label: value, value };
    })
);

// 前端过滤后的分页数据
const filteredData = computed(() => {
    const [start, end] = searchForm.timeRange || [];
    const startVal = start ? dayjs(start).valueOf() : null;
    const endVal = end ? dayjs(end).valueOf() : null;
    return allData.value.filter((r: any) => {
        const pnOk = !searchForm.pn || (r.pn && String(r.pn).toLowerCase().includes(searchForm.pn.toLowerCase()));
        const shapeOk = !searchForm.pannelShape || String(r.PannelShape) === searchForm.pannelShape;
        const sideOk = !searchForm.side || r.Side === searchForm.side;
        const modeOk = !searchForm.mode
            || `${r.ModeCode}.${r.ModeName}` === searchForm.mode
            || r.ModeName === searchForm.mode;
        let timeOk = true;
        if (startVal !== null && endVal !== null) {
            const rowVal = r.LastUpdated ? dayjs(r.LastUpdated).valueOf() : NaN;
            timeOk = !isNaN(rowVal) && rowVal >= startVal && rowVal <= endVal;
        }
        return pnOk && shapeOk && sideOk && modeOk && timeOk;
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

// 新增绑定
const addVisible = ref(false);
const addFormRef = ref();
const addPanelShape = ref("");
const addForm = reactive({
    pn: "",
    topMode: "",
    botMode: "",
});

const addFormRules = computed(() => ({
    pn: [
        { required: true, message: t("smtapply.laserPnConfig.pnRequired"), trigger: "change" },
    ],
    topMode: addPanelShape.value
        ? [{ required: true, message: t("smtapply.laserPnConfig.topModeRequired"), trigger: "change" }]
        : [],
    botMode: addPanelShape.value === "2"
        ? [{ required: true, message: t("smtapply.laserPnConfig.botModeRequired"), trigger: "change" }]
        : [],
}));

const resetAddForm = () => {
    addForm.pn = "";
    addForm.topMode = "";
    addForm.botMode = "";
    addPanelShape.value = "";
};

const openAdd = () => {
    resetAddForm();
    addVisible.value = true;
};

const handleAddClosed = () => {
    addFormRef.value?.resetFields();
    resetAddForm();
};

// 选择产品后查询板型，决定单面板/双面板字段
const onAddPnChange = async (pn: string) => {
    addPanelShape.value = "";
    addForm.topMode = "";
    addForm.botMode = "";
    if (!pn) return;
    try {
        const res: any = await QueryLaserPanelShape({ PartNumber: pn });
        if (res.Success || res.Code === 0 || res.code === 200) {
            addPanelShape.value = String(res.Data?.PannelShape || "");
        }
    } catch (error) {
        // 静默失败
    }
};

const submitAdd = async () => {
    await addFormRef.value?.validate();
    submitLoading.value = true;
    try {
        const userNo = userStore.getUserInfo || "";
        const params: any = {
            pn: addForm.pn,
            topMode: addForm.topMode,
            Editor: userNo,
            UserNo: userNo,
        };
        if (addPanelShape.value === "2") {
            params.botMode = addForm.botMode;
        }
        const res: any = await AddLaserPnConfig(params);
        if (res.Success || res.Code === 0 || res.code === 200) {
            ElMessage.success(res.Msg || res.Message || t("message.addSuccess"));
            addVisible.value = false;
            getData();
        } else {
            ElMessage.error(res.Msg || res.Message || t("message.addFailure"));
        }
    } catch (error) {
        ElMessage.error(t("message.addFailure"));
    } finally {
        submitLoading.value = false;
    }
};

// 编辑绑定（一次改一行）
const editVisible = ref(false);
const editFormRef = ref();
const editForm = reactive({
    ID: "",
    pn: "",
    side: "",
    mode: "",
});

const editFormRules = {
    side: [
        { required: true, message: t("smtapply.laserPnConfig.sideRequired"), trigger: "change" },
    ],
    mode: [
        { required: true, message: t("smtapply.laserPnConfig.modeRequired"), trigger: "change" },
    ],
};

const resetEditForm = () => {
    Object.assign(editForm, { ID: "", pn: "", side: "", mode: "" });
};

const openEdit = (row: any) => {
    Object.assign(editForm, {
        ID: row.ID || "",
        pn: row.pn || "",
        side: row.Side || "",
        mode: row.ModeCode != null && row.ModeCode !== ""
            ? `${row.ModeCode}.${row.ModeName}`
            : (row.ModeName || ""),
    });
    editVisible.value = true;
};

const handleEditClosed = () => {
    editFormRef.value?.resetFields();
    resetEditForm();
};

const submitEdit = async () => {
    await editFormRef.value?.validate();
    submitLoading.value = true;
    try {
        const userNo = userStore.getUserInfo || "";
        const res: any = await UpdateLaserPnConfig({
            ID: editForm.ID,
            pn: editForm.pn,
            side: editForm.side,
            mode: editForm.mode,
            Editor: userNo,
            UserNo: userNo,
        });
        if (res.Success || res.Code === 0 || res.code === 200) {
            ElMessage.success(res.Msg || res.Message || t("message.editSuccess"));
            editVisible.value = false;
            getData();
        } else {
            ElMessage.error(res.Msg || res.Message || t("message.editFailure"));
        }
    } catch (error) {
        ElMessage.error(t("message.editFailure"));
    } finally {
        submitLoading.value = false;
    }
};

const handleDelete = (row: any) => {
    ElMessageBox.confirm(
        t("smtapply.laserPnConfig.deleteConfirm")
            .replace("{pn}", row.pn || "")
            .replace("{side}", row.Side || ""),
        t("publicText.tip"),
        { confirmButtonText: t("publicText.confirm"), cancelButtonText: t("publicText.cancel"), type: "warning" }
    )
        .then(async () => {
            loading.value = true;
            try {
                const res: any = await DeleteLaserPnConfig({ ID: row.ID });
                if (res.Success || res.Code === 0 || res.code === 200) {
                    ElMessage.success(res.Msg || res.Message || t("message.deleteSuccess"));
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
            pannelShape: searchForm.pannelShape,
            panelName: searchForm.pannelShape ? panelNameMap[searchForm.pannelShape] : "",
            side: searchForm.side,
            mode: searchForm.mode,
            startTime: searchForm.timeRange?.[0] || "",
            endTime: searchForm.timeRange?.[1] || "",
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

// 镭雕可选产品
const getProductOptions = async () => {
    try {
        const res: any = await QueryLaserProductList({ pn: "" });
        if (res.Success || res.Code === 0 || res.code === 200) {
            productOptions.value = Array.isArray(res.Data) ? res.Data : [];
        }
    } catch (error) {
        // 静默失败
    }
};

// 镭雕模式列表
const getModeOptions = async () => {
    try {
        const res: any = await QueryLaserModeList({});
        if (res.Success || res.Code === 0 || res.code === 200) {
            if (res.Data && Array.isArray(res.Data)) {
                modeList.value = res.Data;
            } else if (res.Data && Array.isArray(res.Data.rows)) {
                modeList.value = res.Data.rows;
            } else {
                modeList.value = [];
            }
        }
    } catch (error) {
        // 静默失败
    }
};

const handleSearch = () => {
    getData();
};

const resetSearch = () => {
    searchForm.pn = "";
    searchForm.pannelShape = "";
    searchForm.side = "";
    searchForm.mode = "";
    searchForm.timeRange = [];
    getData();
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
        tableHeight.value = window.innerHeight - 220;
    });
};

onMounted(() => {
    getScreenHeight();
    window.addEventListener("resize", getScreenHeight);
    getProductOptions();
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
