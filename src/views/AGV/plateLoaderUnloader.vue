<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between">
                <el-form ref="searchFormRef" :model="searchForm" label-width="auto" :inline="true" :size="'small'"
                    @submit.prevent>
                    <el-form-item :label="t('AGV.plateLoaderUnloader.mcNo')" prop="mcNo" class="mb-2">
                        <el-input v-model="searchForm.mcNo" clearable @clear="handleSearch"
                            @keyup.enter="handleSearch" style="width: 180px"
                            :placeholder="t('AGV.plateLoaderUnloader.inputMcNo')" />
                    </el-form-item>
                    <el-form-item :label="t('AGV.plateLoaderUnloader.lineName')" prop="lineName" class="mb-2">
                        <el-input v-model="searchForm.lineName" clearable @clear="handleSearch"
                            @keyup.enter="handleSearch" style="width: 180px"
                            :placeholder="t('AGV.plateLoaderUnloader.inputLineName')" />
                    </el-form-item>
                    <el-form-item :label="t('AGV.plateLoaderUnloader.type')" prop="type" class="mb-2">
                        <el-select v-model="searchForm.type" clearable style="width: 150px"
                            :placeholder="t('AGV.plateLoaderUnloader.selectType')">
                            <el-option :label="t('AGV.plateLoaderUnloader.typeLoader')" :value="1" />
                            <el-option :label="t('AGV.plateLoaderUnloader.typeUnloader')" :value="2" />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="mb-2">
                        <el-button type="primary" @click="handleSearch">{{ t("publicText.query") }}</el-button>
                    </el-form-item>
                </el-form>
                <div>
                    <el-button type="warning" size="small" @click="openAdd">{{ t("publicText.add") }}</el-button>
                </div>
            </div>

            <el-table :data="tableData" size="small" ref="eltableRef" :style="{ width: '100%' }" :height="tableHeight"
                border fit highlight-current-row v-loading="loading">
                <el-table-column type="index" align="center" fixed :label="t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{ scope.$index + pageObj.pageSize * (pageObj.currentPage - 1) + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="agvmc_no" fixed :label="t('AGV.plateLoaderUnloader.mcNo')"
                    :min-width="getColumnWidth('agvmc_no')" />
                <el-table-column prop="agvmc_Point" :label="t('AGV.plateLoaderUnloader.point')"
                    :min-width="getColumnWidth('agvmc_Point')" />
                <el-table-column prop="agvmc_LineName" :label="t('AGV.plateLoaderUnloader.lineName')"
                    :min-width="getColumnWidth('agvmc_LineName')" />
                <el-table-column prop="agvmc_Type" :label="t('AGV.plateLoaderUnloader.type')"
                    :min-width="getColumnWidth('agvmc_Type')" align="center">
                    <template #default="{ row }">
                        <el-tag v-if="row.agvmc_Type === 1" type="primary" size="small">
                            {{ t('AGV.plateLoaderUnloader.typeLoader') }}
                        </el-tag>
                        <el-tag v-else-if="row.agvmc_Type === 2" type="success" size="small">
                            {{ t('AGV.plateLoaderUnloader.typeUnloader') }}
                        </el-tag>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column prop="agvmc_Operate" :label="t('AGV.plateLoaderUnloader.operate')"
                    :min-width="getColumnWidth('agvmc_Operate')" align="center">
                    <template #default="{ row }">
                        <el-tag v-if="row.agvmc_Operate === 1" type="warning" size="small">
                            {{ t('AGV.plateLoaderUnloader.operateIn') }}
                        </el-tag>
                        <el-tag v-else-if="row.agvmc_Operate === 2" type="info" size="small">
                            {{ t('AGV.plateLoaderUnloader.operateOut') }}
                        </el-tag>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column prop="agvmc_Sts" :label="t('AGV.plateLoaderUnloader.sts')"
                    :min-width="getColumnWidth('agvmc_Sts')" align="center" />
                <el-table-column prop="agvmc_IpAddress" :label="t('AGV.plateLoaderUnloader.ipAddress')"
                    :min-width="getColumnWidth('agvmc_IpAddress')" />
                <el-table-column prop="agvmc_IpPort" :label="t('AGV.plateLoaderUnloader.ipPort')"
                    :min-width="getColumnWidth('agvmc_IpPort')" align="center" />
                <el-table-column prop="agvmc_Address" :label="t('AGV.plateLoaderUnloader.address')"
                    :min-width="getColumnWidth('agvmc_Address')" align="center" />
                <el-table-column prop="agvmc_Side" :label="t('AGV.plateLoaderUnloader.side')"
                    :min-width="getColumnWidth('agvmc_Side')" align="center" />
                <el-table-column prop="agvmc_Remark" :label="t('AGV.plateLoaderUnloader.remark')"
                    :min-width="getColumnWidth('agvmc_Remark')" show-overflow-tooltip />
                <el-table-column prop="agvmc_InsertUser" :label="t('AGV.plateLoaderUnloader.insertUser')"
                    :min-width="getColumnWidth('agvmc_InsertUser')" />
                <el-table-column prop="agvmc_InsertDt" :label="t('AGV.plateLoaderUnloader.insertDt')"
                    :min-width="getColumnWidth('agvmc_InsertDt')">
                    <template #default="{ row }">
                        {{ formatDate(row.agvmc_InsertDt) }}
                    </template>
                </el-table-column>
                <el-table-column prop="agvmc_UpdateUser" :label="t('AGV.plateLoaderUnloader.updateUser')"
                    :min-width="getColumnWidth('agvmc_UpdateUser')" />
                <el-table-column prop="agvmc_UpdateDt" :label="t('AGV.plateLoaderUnloader.updateDt')"
                    :min-width="getColumnWidth('agvmc_UpdateDt')">
                    <template #default="{ row }">
                        {{ formatDate(row.agvmc_UpdateDt) }}
                    </template>
                </el-table-column>
                <el-table-column :label="t('publicText.operation')" :fixed="'right'" width="130" align="center">
                    <template #default="{ row }">
                        <el-tooltip :content="t('publicText.edit')" placement="top">
                            <el-button size="small" type="primary" @click="openEdit(row)" icon="Edit" />
                        </el-tooltip>
                        <el-tooltip :content="t('publicText.delete')" placement="top">
                            <el-button size="small" type="danger" @click="handleDelete(row)" icon="Delete" />
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
                <el-pagination :size="'small'" background @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :pager-count="5" :current-page="pageObj.currentPage"
                    :page-size="pageObj.pageSize" :page-sizes="[10, 20, 30, 50, 100]"
                    layout="total, sizes, prev, pager, next" :total="total" />
            </div>
        </el-card>

        <!-- 新增对话框 -->
        <el-dialog :title="t('publicText.add')" v-model="addVisible" width="600px" :close-on-click-modal="false"
            @closed="handleAddDialogClosed">
            <el-form ref="addFormRef" :model="addForm" :rules="formRules" label-width="120px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateLoaderUnloader.mcNo')" prop="agvmc_no">
                            <el-input v-model="addForm.agvmc_no"
                                :placeholder="t('AGV.plateLoaderUnloader.inputMcNo')" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateLoaderUnloader.point')" prop="agvmc_Point">
                            <el-input v-model="addForm.agvmc_Point"
                                :placeholder="t('AGV.plateLoaderUnloader.inputPoint')" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateLoaderUnloader.lineName')" prop="agvmc_LineName">
                            <el-input v-model="addForm.agvmc_LineName"
                                :placeholder="t('AGV.plateLoaderUnloader.inputLineName')" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateLoaderUnloader.type')" prop="agvmc_Type">
                            <el-select v-model="addForm.agvmc_Type" style="width: 100%"
                                :placeholder="t('AGV.plateLoaderUnloader.selectType')">
                                <el-option :label="t('AGV.plateLoaderUnloader.typeLoader')" :value="1" />
                                <el-option :label="t('AGV.plateLoaderUnloader.typeUnloader')" :value="2" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateLoaderUnloader.operate')" prop="agvmc_Operate">
                            <el-select v-model="addForm.agvmc_Operate" style="width: 100%"
                                :placeholder="t('AGV.plateLoaderUnloader.selectOperate')">
                                <el-option :label="t('AGV.plateLoaderUnloader.operateIn')" :value="1" />
                                <el-option :label="t('AGV.plateLoaderUnloader.operateOut')" :value="2" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateLoaderUnloader.sts')" prop="agvmc_Sts">
                            <el-input v-model="addForm.agvmc_Sts"
                                :placeholder="t('AGV.plateLoaderUnloader.inputSts')" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateLoaderUnloader.ipAddress')" prop="agvmc_IpAddress">
                            <el-input v-model="addForm.agvmc_IpAddress"
                                :placeholder="t('AGV.plateLoaderUnloader.inputIpAddress')" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateLoaderUnloader.ipPort')" prop="agvmc_IpPort">
                            <el-input-number v-model="addForm.agvmc_IpPort" :min="1" :max="65535"
                                :placeholder="t('AGV.plateLoaderUnloader.inputIpPort')" controls-position="right"
                                style="width: 100%" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateLoaderUnloader.address')" prop="agvmc_Address">
                            <el-input-number v-model="addForm.agvmc_Address" :min="0"
                                :placeholder="t('AGV.plateLoaderUnloader.inputAddress')" controls-position="right"
                                style="width: 100%" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateLoaderUnloader.side')" prop="agvmc_Side">
                            <el-input v-model="addForm.agvmc_Side"
                                :placeholder="t('AGV.plateLoaderUnloader.inputSide')" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item :label="t('AGV.plateLoaderUnloader.remark')" prop="agvmc_Remark">
                            <el-input v-model="addForm.agvmc_Remark" type="textarea" :rows="2"
                                :placeholder="t('AGV.plateLoaderUnloader.inputRemark')" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="addVisible = false">{{ t("publicText.cancel") }}</el-button>
                    <el-button type="primary" @click="submitAdd" :loading="submitLoading">{{
                        t("publicText.confirm")
                    }}</el-button>
                </div>
            </template>
        </el-dialog>

        <!-- 编辑对话框 -->
        <el-dialog :title="t('publicText.edit')" v-model="editVisible" width="600px" :close-on-click-modal="false"
            @closed="handleEditDialogClosed">
            <el-form ref="editFormRef" :model="editForm" :rules="formRules" label-width="120px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateLoaderUnloader.mcNo')" prop="agvmc_no">
                            <el-input v-model="editForm.agvmc_no" disabled />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateLoaderUnloader.point')" prop="agvmc_Point">
                            <el-input v-model="editForm.agvmc_Point"
                                :placeholder="t('AGV.plateLoaderUnloader.inputPoint')" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateLoaderUnloader.lineName')" prop="agvmc_LineName">
                            <el-input v-model="editForm.agvmc_LineName"
                                :placeholder="t('AGV.plateLoaderUnloader.inputLineName')" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateLoaderUnloader.type')" prop="agvmc_Type">
                            <el-select v-model="editForm.agvmc_Type" style="width: 100%"
                                :placeholder="t('AGV.plateLoaderUnloader.selectType')">
                                <el-option :label="t('AGV.plateLoaderUnloader.typeLoader')" :value="1" />
                                <el-option :label="t('AGV.plateLoaderUnloader.typeUnloader')" :value="2" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateLoaderUnloader.operate')" prop="agvmc_Operate">
                            <el-select v-model="editForm.agvmc_Operate" style="width: 100%"
                                :placeholder="t('AGV.plateLoaderUnloader.selectOperate')">
                                <el-option :label="t('AGV.plateLoaderUnloader.operateIn')" :value="1" />
                                <el-option :label="t('AGV.plateLoaderUnloader.operateOut')" :value="2" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateLoaderUnloader.sts')" prop="agvmc_Sts">
                            <el-input v-model="editForm.agvmc_Sts"
                                :placeholder="t('AGV.plateLoaderUnloader.inputSts')" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateLoaderUnloader.ipAddress')" prop="agvmc_IpAddress">
                            <el-input v-model="editForm.agvmc_IpAddress"
                                :placeholder="t('AGV.plateLoaderUnloader.inputIpAddress')" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateLoaderUnloader.ipPort')" prop="agvmc_IpPort">
                            <el-input-number v-model="editForm.agvmc_IpPort" :min="1" :max="65535"
                                :placeholder="t('AGV.plateLoaderUnloader.inputIpPort')" controls-position="right"
                                style="width: 100%" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateLoaderUnloader.address')" prop="agvmc_Address">
                            <el-input-number v-model="editForm.agvmc_Address" :min="0"
                                :placeholder="t('AGV.plateLoaderUnloader.inputAddress')" controls-position="right"
                                style="width: 100%" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('AGV.plateLoaderUnloader.side')" prop="agvmc_Side">
                            <el-input v-model="editForm.agvmc_Side"
                                :placeholder="t('AGV.plateLoaderUnloader.inputSide')" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item :label="t('AGV.plateLoaderUnloader.remark')" prop="agvmc_Remark">
                            <el-input v-model="editForm.agvmc_Remark" type="textarea" :rows="2"
                                :placeholder="t('AGV.plateLoaderUnloader.inputRemark')" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="editVisible = false" size="small">{{ t("publicText.cancel") }}</el-button>
                    <el-button type="primary" @click="submitEdit" size="small" :loading="submitLoading">{{
                        t("publicText.confirm")
                    }}</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { InsertUpdatePlateLoaderUnloader, DeletePlateLoaderUnloader, QueryPlateLoaderUnloader } from "@/api/AGV/plateLoaderUnloader";
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

const userStore = useUserStoreWithOut();
const { t } = useI18n();

const loading = ref(false);
const submitLoading = ref(false);
const tableHeight = ref(0);
const eltableRef = ref();
const tableData = ref<any[]>([]);
const total = ref(0);

const searchForm = reactive({
    mcNo: "",
    lineName: "",
    type: null as number | null,
});

const pageObj = reactive({
    currentPage: 1,
    pageSize: 50,
});

const defaultForm = () => ({
    agvmc_no: null as number | null,
    agvmc_Point: "",
    agvmc_LineName: "",
    agvmc_Type: null as number | null,
    agvmc_Operate: null as number | null,
    agvmc_Sts: "",
    agvmc_IpAddress: "",
    agvmc_IpPort: null as number | null,
    agvmc_Address: null as number | null,
    agvmc_Side: "",
    agvmc_Remark: "",
});

const addForm = reactive(defaultForm());
const editForm = reactive(defaultForm());

const addVisible = ref(false);
const editVisible = ref(false);
const addFormRef = ref();
const editFormRef = ref();

const formRules = reactive({
    agvmc_no: [
        {
            required: true,
            message: t("message.pleaseInput") + t("AGV.plateLoaderUnloader.mcNo"),
            trigger: "blur",
        },
    ],
    agvmc_Point: [
        {
            required: true,
            message: t("message.pleaseInput") + t("AGV.plateLoaderUnloader.point"),
            trigger: "blur",
        },
    ],
    agvmc_LineName: [
        {
            required: true,
            message: t("message.pleaseInput") + t("AGV.plateLoaderUnloader.lineName"),
            trigger: "blur",
        },
    ],
    agvmc_Type: [
        {
            required: true,
            message: t("message.pleaseSelect") + t("AGV.plateLoaderUnloader.type"),
            trigger: "change",
        },
    ],
    agvmc_Operate: [
        {
            required: true,
            message: t("message.pleaseSelect") + t("AGV.plateLoaderUnloader.operate"),
            trigger: "change",
        },
    ],
});

const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === "1900-01-01T00:00:00") return "-";
    return dayjs(dateStr).format("YYYY-MM-DD HH:mm:ss");
};

const { getColumnWidth } = useTableColumnWidth(eltableRef, tableData, {
    excludeLabels: [t('publicText.index'), t('publicText.operation')]
});

const resetAddForm = () => {
    Object.assign(addForm, defaultForm());
};

const resetEditForm = () => {
    Object.assign(editForm, defaultForm());
};

const getData = () => {
    loading.value = true;
    const params = {
        mcNo: searchForm.mcNo || "",
        lineName: searchForm.lineName || "",
        type: searchForm.type ?? "",
        PageIndex: pageObj.currentPage,
        PageSize: pageObj.pageSize,
    };
    QueryPlateLoaderUnloader(params)
        .then((res: any) => {
            if (res.Data) {
                tableData.value = res.Data.rows || [];
                total.value = res.Data.total || 0;
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
    resetAddForm();
    addVisible.value = true;
};

const handleAddDialogClosed = () => {
    addFormRef.value?.resetFields();
    resetAddForm();
};

const submitAdd = () => {
    addFormRef.value.validate((valid: boolean) => {
        if (valid) {
            submitLoading.value = true;
            const params = {
                ...addForm,
                UserNo: userStore.getUserInfo || "",
            };
            InsertUpdatePlateLoaderUnloader(params)
                .then((res: any) => {
                    if (res.Success) {
                        ElMessage.success(t("message.addSuccess"));
                        addVisible.value = false;
                        pageObj.currentPage = 1;
                        getData();
                    } else {
                        ElMessage.error(res.Message || t("message.addFailure"));
                    }
                })
                .finally(() => {
                    submitLoading.value = false;
                });
        }
    });
};

const openEdit = (row: any) => {
    Object.assign(editForm, {
        agvmc_no: row.agvmc_no,
        agvmc_Point: row.agvmc_Point || "",
        agvmc_LineName: row.agvmc_LineName || "",
        agvmc_Type: row.agvmc_Type ?? null,
        agvmc_Operate: row.agvmc_Operate ?? null,
        agvmc_Sts: row.agvmc_Sts || "",
        agvmc_IpAddress: row.agvmc_IpAddress || "",
        agvmc_IpPort: row.agvmc_IpPort ?? null,
        agvmc_Address: row.agvmc_Address ?? null,
        agvmc_Side: row.agvmc_Side || "",
        agvmc_Remark: row.agvmc_Remark || "",
    });
    editVisible.value = true;
};

const handleEditDialogClosed = () => {
    editFormRef.value?.resetFields();
    resetEditForm();
};

const submitEdit = () => {
    editFormRef.value.validate((valid: boolean) => {
        if (valid) {
            submitLoading.value = true;
            const params = {
                ...editForm,
                UserNo: userStore.getUserInfo || "",
            };
            InsertUpdatePlateLoaderUnloader(params)
                .then((res: any) => {
                    if (res.Success) {
                        ElMessage.success(t("message.editSuccess"));
                        editVisible.value = false;
                        getData();
                    } else {
                        ElMessage.error(res.Message || t("message.editFailure"));
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
        `${t("publicText.confirm")}${t("publicText.delete")}【${row.agvmc_Point}】?`,
        t("publicText.tip"),
        {
            confirmButtonText: t("publicText.confirm"),
            cancelButtonText: t("publicText.cancel"),
            type: "warning",
        }
    )
        .then(() => {
            loading.value = true;
            DeletePlateLoaderUnloader({
                agvmc_no: row.agvmc_no,
                UserNo: userStore.getUserInfo || "",
            })
                .then((res: any) => {
                    if (res.Success) {
                        ElMessage.success(t("message.deleteSuccess"));
                        if (tableData.value.length === 1 && pageObj.currentPage > 1) {
                            pageObj.currentPage--;
                        }
                        getData();
                    } else {
                        ElMessage.error(res.Message || t("message.deleteFailure"));
                    }
                })
                .finally(() => {
                    loading.value = false;
                });
        })
        .catch(() => {
            ElMessage.info(t("publicText.cancel"));
        });
};

const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 180;
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

<style lang="scss" scoped>
.el-pagination {
    justify-content: center;
}
</style>
