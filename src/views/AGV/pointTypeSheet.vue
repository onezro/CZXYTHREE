<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <!-- 查询条件 -->
            <div class="flex justify-between">
                <el-form ref="searchFormRef" :model="searchForm" label-width="auto" :inline="true" :size="'small'"
                    @submit.prevent>
                    <el-form-item :label="t('AGV.pointTypeSheet.startpointtype')" prop="startpointtype" class="mb-2">
                        <el-select v-model="searchForm.startpointtype" clearable filterable style="width: 240px"
                            :placeholder="t('AGV.pointTypeSheet.startPlaceholder')" @change="handleSearch">
                            <el-option v-for="item in pointTypeOptions" :key="'qs-' + item.pointtype_no"
                                :value="item.pointtype_no"
                                :label="`${item.pointtype_no} ${item.pointtype_name ?? ''}`" />
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="t('AGV.pointTypeSheet.magazine_pointtypeId')" prop="endpointtype" class="mb-2">
                        <el-select v-model="searchForm.endpointtype" clearable filterable style="width: 240px"
                            :placeholder="t('AGV.pointTypeSheet.endPlaceholder')" @change="handleSearch">
                            <el-option v-for="item in pointTypeOptions" :key="'qe-' + item.pointtype_no"
                                :value="item.pointtype_no"
                                :label="`${item.pointtype_no} ${item.pointtype_name ?? ''}`" />
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="t('AGV.pointTypeSheet.status')" prop="status" class="mb-2">
                        <el-select v-model="searchForm.status" clearable style="width: 140px"
                            :placeholder="t('AGV.pointTypeSheet.statusPlaceholder')" @change="handleSearch">
                            <el-option :label="t('AGV.pointTypeSheet.status0')" value="0" />
                            <el-option :label="t('AGV.pointTypeSheet.status1')" value="1" />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="mb-2">
                        <el-button type="primary" @click="handleSearch">{{ t("publicText.query") }}</el-button>
                        <el-button @click="handleReset">{{ t("publicText.reset") }}</el-button>
                          <el-button size="small" type="primary" icon="Plus" @click="openAdd">
                    {{ t("publicText.add") }}
                </el-button>
                    </el-form-item>
                </el-form>
            </div>

            <!-- 表格 -->
            <el-table :data="tableData" size="small" ref="eltableRef" v-loading="loading" :style="{ width: '100%' }"
                :height="tableHeight" border fit highlight-current-row
                :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }">
                <el-table-column type="index" align="center" fixed :label="t('publicText.index')" width="60">
                    <template #default="scope">
                        <span>{{ scope.$index + pageObj.pageSize * (pageObj.currentPage - 1) + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="pointtypeID" fixed :label="t('AGV.pointTypeSheet.startpointtype')"
                    :min-width="getColumnWidth('pointtypeID')" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ raw(row.pointtypeID, row.startpointtype) }}
                    </template>
                </el-table-column>
                <el-table-column prop="pointtypeName" :label="t('AGV.pointTypeSheet.pointtypeName')"
                    :min-width="getColumnWidth('pointtypeName')" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ raw(row.pointtypeName, row.startpointtype_name, '-') }}
                    </template>
                </el-table-column>
                <el-table-column prop="magazine_pointtypeId" :label="t('AGV.pointTypeSheet.magazine_pointtypeId')"
                    :min-width="getColumnWidth('magazine_pointtypeId')" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ raw(row.magazine_pointtypeId, row.endpointtype, '-') }}
                    </template>
                </el-table-column>
                <el-table-column prop="magazine_pointtypeName"
                    :label="t('AGV.pointTypeSheet.magazine_pointtypeName')"
                    :min-width="getColumnWidth('magazine_pointtypeName')" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ raw(row.magazine_pointtypeName, row.endpointtype_name, '-') }}
                    </template>
                </el-table-column>
                <el-table-column prop="status" :label="t('AGV.pointTypeSheet.status')" width="110" align="center"
                    :min-width="getColumnWidth('status')">
                    <template #default="{ row }">
                        <el-switch :model-value="isStatusEnabled(row.status)" :loading="row._toggleLoading"
                            inline-prompt :active-text="t('AGV.pointTypeSheet.status0')"
                            :inactive-text="t('AGV.pointTypeSheet.status1')"
                            @change="(val: boolean) => handleToggleStatus(row, val)" />
                    </template>
                </el-table-column>
                <el-table-column prop="remark" :label="t('AGV.pointTypeSheet.remark')"
                    :min-width="getColumnWidth('remark')" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ raw(row.remark, '-') }}
                    </template>
                </el-table-column>
                <el-table-column prop="cr_user" :label="t('AGV.pointTypeSheet.crUser')"
                    :min-width="getColumnWidth('cr_user')" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ raw(row.cr_user, row.createuser, row.c_user, '-') }}
                    </template>
                </el-table-column>
                <el-table-column prop="cr_date" :label="t('AGV.pointTypeSheet.crDate')"
                    :min-width="getColumnWidth('cr_date')">
                    <template #default="{ row }">
                        {{ formatDate(raw(row.cr_date, row.createtime, row.cr_time)) }}
                    </template>
                </el-table-column>
                <el-table-column prop="ud_user" :label="t('AGV.pointTypeSheet.udUser')"
                    :min-width="getColumnWidth('ud_user')" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ raw(row.ud_user, row.updateuser, row.u_user, '-') }}
                    </template>
                </el-table-column>
                <el-table-column prop="ud_date" :label="t('AGV.pointTypeSheet.udDate')"
                    :min-width="getColumnWidth('ud_date')">
                    <template #default="{ row }">
                        {{ formatDate(raw(row.ud_date, row.updatetime, row.u_time)) }}
                    </template>
                </el-table-column>
                <el-table-column :label="t('publicText.operation')" :fixed="'right'" width="140" align="center">
                    <template #default="{ row }">
                        <el-button size="small" type="primary" icon="Edit" @click="openEdit(row)" />
                        <el-button size="small" type="danger" icon="Delete" :loading="row._deleteLoading"
                            @click="handleDelete(row)" />
                    </template>
                </el-table-column>
                <template #empty>
                    <div class="flex items-center justify-center h-100%">
                        <el-empty />
                    </div>
                </template>
            </el-table>

            <!-- 分页 -->
            <div class="mt-2">
                <el-pagination :size="'small'" background @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :pager-count="5" :current-page="pageObj.currentPage"
                    :page-size="pageObj.pageSize" :page-sizes="[10, 20, 30, 50, 100]"
                    layout="total, sizes, prev, pager, next" :total="total" />
            </div>
        </el-card>

        <!-- 新增/修改弹窗 -->
        <el-dialog v-model="dialogVisible"
            :title="isEdit ? t('AGV.pointTypeSheet.editTitle') : t('AGV.pointTypeSheet.addTitle')" width="560px"
            top="12vh" destroy-on-close @close="resetForm">
            <el-form ref="formRef" :model="form" :rules="formRules" label-width="140px" @submit.prevent>
                <el-form-item :label="t('AGV.pointTypeSheet.startpointtype')" prop="startpointtype">
                    <el-select v-model="form.startpointtype" filterable style="width: 100%"
                        :disabled="isEdit" :placeholder="t('AGV.pointTypeSheet.startPlaceholder')">
                        <el-option v-for="item in pointTypeOptions" :key="'ds-' + item.pointtype_no"
                            :value="item.pointtype_no"
                            :label="`${item.pointtype_no} ${item.pointtype_name ?? ''}`" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="t('AGV.pointTypeSheet.magazine_pointtypeId')" prop="endpointtype">
                    <el-select v-model="form.endpointtype" filterable style="width: 100%"
                        :disabled="isEdit" :placeholder="t('AGV.pointTypeSheet.endPlaceholder')">
                        <el-option v-for="item in pointTypeOptions" :key="'de-' + item.pointtype_no"
                            :value="item.pointtype_no"
                            :label="`${item.pointtype_no} ${item.pointtype_name ?? ''}`" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="t('AGV.pointTypeSheet.status')" prop="status">
                    <el-select v-model="form.status" style="width: 100%"
                        :placeholder="t('AGV.pointTypeSheet.statusPlaceholder')">
                        <el-option :label="t('AGV.pointTypeSheet.status0')" value="0" />
                        <el-option :label="t('AGV.pointTypeSheet.status1')" value="1" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="t('AGV.pointTypeSheet.remark')" prop="remark">
                    <el-input v-model="form.remark" type="textarea" :rows="2" resize="none"
                        :placeholder="t('AGV.pointTypeSheet.remarkPlaceholder')" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button size="small" @click="dialogVisible = false">{{ t("publicText.cancel") }}</el-button>
                <el-button size="small" type="primary" :loading="submitLoading"
                    @click="handleSubmit">{{ t("publicText.confirm") }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import {
    InsertUpdatePointTypeSheet,
    DeletePointTypeSheet,
    QueryPointTypeSheet,
    GetEnablePointType,
} from "@/api/AGV/index";
import {
    ref,
    reactive,
    nextTick,
    onMounted,
    onBeforeUnmount,
} from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { useTableColumnWidth } from '@/hooks/useTableColumnWidth';
import dayjs from 'dayjs';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const userStore = useUserStoreWithOut();

const loading = ref(false);
const submitLoading = ref(false);
const tableHeight = ref(0);
const eltableRef = ref();
const tableData = ref<any[]>([]);
const total = ref(0);

const dialogVisible = ref(false);
const isEdit = ref(false);
const formRef = ref<any>(null);
const pointTypeOptions = ref<any[]>([]);

const searchForm = reactive({
    startpointtype: "",
    endpointtype: "",
    status: "",
});

const pageObj = reactive({
    currentPage: 1,
    pageSize: 50,
});

const form = reactive({
    startpointtype: "",
    endpointtype: "",
    status: "0",
    remark: "",
});

const formRules = {
    startpointtype: [{ required: true, message: () => t("AGV.pointTypeSheet.startRequired"), trigger: "change" }],
    endpointtype: [{ required: true, message: () => t("AGV.pointTypeSheet.endRequired"), trigger: "change" }],
};

const { getColumnWidth } = useTableColumnWidth(eltableRef, tableData, {
    excludeLabels: [t('publicText.index'), t('publicText.operation')]
});

const raw = (...args: any[]) => {
    for (const v of args) {
        if (v !== undefined && v !== null && v !== "") return v;
    }
    return "-";
};

const formatDate = (value: any) => {
    if (!value) return "-";
    const s = String(value);
    if (s.startsWith("1900") || s.startsWith("0001")) return "-";
    try {
        const d = dayjs(s);
        if (d.isValid()) return d.format("YYYY-MM-DD HH:mm:ss");
    } catch { /* ignore */ }
    return s;
};

const isStatusEnabled = (value: any) => {
    const s = String(value ?? "0");
    return s === "0" || s === "Y" || s.toLowerCase() === "enabled";
};

const resetForm = () => {
    Object.assign(form, {
        startpointtype: "",
        endpointtype: "",
        status: "0",
        remark: "",
    });
};

const loadPointTypeOptions = () => {
    return GetEnablePointType().then((res: any) => {
        if (res && res.Success && Array.isArray(res.Data)) {
            pointTypeOptions.value = res.Data;
        } else {
            pointTypeOptions.value = [];
        }
    }).catch(() => {
        pointTypeOptions.value = [];
    });
};

const getData = () => {
    loading.value = true;
    const params: any = {
        PageIndex: pageObj.currentPage,
        PageSize: pageObj.pageSize,
        startpointtype: searchForm.startpointtype || undefined,
        endpointtype: searchForm.endpointtype || undefined,
    };
    if (searchForm.status !== "" && searchForm.status !== undefined && searchForm.status !== null) {
        params.status = searchForm.status;
    }
    QueryPointTypeSheet(params)
        .then((res: any) => {
            if (res.Success) {
                const data = res.Data || {};
                tableData.value = Array.isArray(data.rows) ? data.rows : [];
                total.value = Number(data.total) || 0;
            } else {
                tableData.value = [];
                total.value = 0;
                ElMessage.warning(res.Message || t("message.queryFailure"));
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
    pageObj.currentPage = 1;
    getData();
};

const handleReset = () => {
    searchForm.startpointtype = "";
    searchForm.endpointtype = "";
    searchForm.status = "";
    pageObj.currentPage = 1;
    getData();
};

const handleSizeChange = (val: number) => {
    pageObj.pageSize = val;
    pageObj.currentPage = 1;
    getData();
};

const handleCurrentChange = (val: number) => {
    pageObj.currentPage = val;
    getData();
};

const openAdd = () => {
    isEdit.value = false;
    resetForm();
    dialogVisible.value = true;
};

const openEdit = (row: any) => {
    isEdit.value = true;
    const st = String(raw(row.status, "0"));
    Object.assign(form, {
        startpointtype: raw(row.pointtypeID, row.startpointtype, ""),
        endpointtype: raw(row.magazine_pointtypeId, row.endpointtype, ""),
        status: (st === "1" || st === "N" || st.toLowerCase() === "disabled") ? "1" : "0",
        remark: raw(row.remark, ""),
    });
    dialogVisible.value = true;
};

const handleSubmit = () => {
    formRef.value?.validate().then(() => {
        submitLoading.value = true;
        const params = {
            startpointtype: form.startpointtype,
            endpointtype: form.endpointtype,
            remark: form.remark,
            status: String(form.status),
            UserNo: userStore.getUserInfo || "",
        };
        InsertUpdatePointTypeSheet(params)
            .then((res: any) => {
                if (res.Success) {
                    ElMessage.success(isEdit.value ? t("message.editSuccess") : t("message.addSuccess"));
                    dialogVisible.value = false;
                    getData();
                } else {
                    ElMessage.error(res.Message || res.Msg || (isEdit.value ? t("message.editFailure") : t("message.addFailure")));
                }
            })
            .catch(() => {
                ElMessage.error(isEdit.value ? t("message.editFailure") : t("message.addFailure"));
            })
            .finally(() => {
                submitLoading.value = false;
            });
    }).catch(() => { /* validation canceled */ });
};

const handleDelete = (row: any) => {
    const start = raw(row.pointtypeID, row.startpointtype, "");
    const end = raw(row.magazine_pointtypeId, row.endpointtype, "");
    const text = t("AGV.pointTypeSheet.deleteConfirm")
        .replace("{start}", String(start))
        .replace("{end}", String(end));
    ElMessageBox.confirm(text, t("publicText.tip"), {
        confirmButtonText: t("publicText.confirm"),
        cancelButtonText: t("publicText.cancel"),
        type: "warning",
    })
        .then(() => {
            row._deleteLoading = true;
            DeletePointTypeSheet({
                startpointtype: start,
                endpointtype: end,
                UserNo: userStore.getUserInfo || "",
            })
                .then((res: any) => {
                    if (res.Success) {
                        ElMessage.success(t("message.delSuccess"));
                        const remain = tableData.value.length - 1;
                        if (remain === 0 && pageObj.currentPage > 1) pageObj.currentPage -= 1;
                        getData();
                    } else {
                        ElMessage.error(res.Message || res.Msg || t("message.delFailure"));
                    }
                })
                .catch(() => {
                    ElMessage.error(t("message.delFailure"));
                })
                .finally(() => {
                    row._deleteLoading = false;
                });
        })
        .catch(() => {
            ElMessage.info(t("publicText.cancel"));
        });
};

const handleToggleStatus = (row: any, enabled: boolean) => {
    const prevStatus = row.status;
    const targetStatus = enabled ? "0" : "1";
    if (isStatusEnabled(prevStatus) === enabled) return;
    row._toggleLoading = true;
    InsertUpdatePointTypeSheet({
        startpointtype: raw(row.pointtypeID, row.startpointtype, ""),
        endpointtype: raw(row.magazine_pointtypeId, row.endpointtype, ""),
        remark: raw(row.remark, ""),
        status: targetStatus,
        UserNo: userStore.getUserInfo || "",
    })
        .then((res: any) => {
            if (res.Success) {
                row.status = targetStatus;
                ElMessage.success((enabled ? t("AGV.pointTypeSheet.status0") : t("AGV.pointTypeSheet.status1")) + t("message.editSuccess"));
                getData();
            } else {
                row.status = prevStatus;
                ElMessage.error(res.Message || res.Msg || t("message.editFailure"));
            }
        })
        .catch(() => {
            row.status = prevStatus;
            ElMessage.error(t("message.editFailure"));
        })
        .finally(() => {
            row._toggleLoading = false;
        });
};

const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 180;
    });
};

const onResize = () => getScreenHeight();

onMounted(async () => {
    getScreenHeight();
    window.addEventListener("resize", onResize);
    await loadPointTypeOptions();
    getData();
});

onBeforeUnmount(() => {
    window.removeEventListener("resize", onResize);
});
</script>
