<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between items-center">
                <el-form ref="searchFormRef" :inline="true" :model="searchForm" label-width="auto" @submit.prevent>
                    <el-form-item :label="t('deviceManage.smtSample.sampleNo')" class="mb-2">
                        <el-input v-model="searchForm.sample_no"
                            :placeholder="t('deviceManage.smtSample.sampleNoPlaceholder')" clearable
                            style="width: 160px" size="small" @keyup.enter="handleSearch" />
                    </el-form-item>
                    <el-form-item :label="t('deviceManage.smtSample.sampleType')" class="mb-2">
                        <el-select v-model="searchForm.sample_type" clearable
                            :placeholder="t('deviceManage.smtSample.sampleTypePlaceholder')"
                            style="width: 140px" size="small" @change="handleSearch">
                            <el-option v-for="item in sampleTypeOptions" :key="item.value"
                                :label="item.label" :value="item.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="t('deviceManage.smtSample.finishedCode')" class="mb-2">
                        <el-input v-model="searchForm.finished_code"
                            :placeholder="t('deviceManage.smtSample.finishedCodePlaceholder')" clearable
                            style="width: 160px" size="small" @keyup.enter="handleSearch" />
                    </el-form-item>
                    <el-form-item :label="t('deviceManage.smtSample.productName')" class="mb-2">
                        <el-input v-model="searchForm.product_name"
                            :placeholder="t('deviceManage.smtSample.productNamePlaceholder')" clearable
                            style="width: 160px" size="small" @keyup.enter="handleSearch" />
                    </el-form-item>
                    <el-form-item :label="t('deviceManage.smtSample.version')" class="mb-2">
                        <el-input v-model="searchForm.version"
                            :placeholder="t('deviceManage.smtSample.versionPlaceholder')" clearable
                            style="width: 120px" size="small" @keyup.enter="handleSearch" />
                    </el-form-item>
                    <el-form-item class="mb-2">
                        <el-button type="primary" size="small" @click="handleSearch">{{ t("publicText.query") }}</el-button>
                        <el-button size="small" @click="resetSearch">{{ t("publicText.reset") }}</el-button>
                        <el-button type="warning" size="small" @click="openAdd">{{ t("publicText.add") }}</el-button>
                        <el-button type="success" size="small" @click="importDialogVisible = true">{{ t("publicText.import") }}</el-button>
                        <el-button type="info" size="small" :disabled="selectedRows.length === 0"
                            @click="handleClearCell">
                            {{ t("deviceManage.smtSample.clearCell") }}
                        </el-button>
                        <el-button size="small" type="danger" :disabled="selectedRows.length === 0"
                        @click="handleBatchDelete">
                        {{ t("publicText.batchDelete") }}
                    </el-button>
                    </el-form-item>
                </el-form>
            </div>

            <el-table :data="tableData" ref="tableRef" border :height="tableHeight"
                stripe size="small" :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }" @selection-change="handleSelectionChange" >
                <el-table-column type="selection" width="40" align="center" />
                <el-table-column type="index" :label="t('publicText.index')" width="55" fixed="left" align="center">
                    <template #default="{ $index }">
                        {{ $index + 1 + (currentPage - 1) * pageSize }}
                    </template>
                </el-table-column>
                <el-table-column prop="sample_no" :label="t('deviceManage.smtSample.sampleNo')"
                    :min-width="getColumnWidth('sample_no')" fixed="left" show-overflow-tooltip />
                <el-table-column prop="sample_type" :label="t('deviceManage.smtSample.sampleType')"
                    :min-width="getColumnWidth('sample_type')" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ getSampleTypeText(row.sample_type) }}
                    </template>
                </el-table-column>
                <el-table-column prop="finished_code" :label="t('deviceManage.smtSample.finishedCode')"
                    :min-width="getColumnWidth('finished_code')" show-overflow-tooltip />
                <el-table-column prop="product_name" :label="t('deviceManage.smtSample.productName')"
                    :min-width="getColumnWidth('product_name')" show-overflow-tooltip />
                <el-table-column prop="defect_content" :label="t('deviceManage.smtSample.defectContent')"
                    :min-width="getColumnWidth('defect_content')" show-overflow-tooltip />
                <el-table-column prop="seal_content" :label="t('deviceManage.smtSample.sealContent')"
                    :min-width="getColumnWidth('seal_content')" show-overflow-tooltip />
                <el-table-column prop="version" :label="t('deviceManage.smtSample.version')"
                    :min-width="getColumnWidth('version')" show-overflow-tooltip />
                <el-table-column prop="seal_date" :label="t('deviceManage.smtSample.sealDate')"
                    :min-width="getColumnWidth('seal_date')" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ formatDate(row.seal_date) }}
                    </template>
                </el-table-column>
                <el-table-column prop="refresh_date" :label="t('deviceManage.smtSample.refreshDate')"
                    :min-width="getColumnWidth('refresh_date')" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ formatDate(row.refresh_date) }}
                    </template>
                </el-table-column>
                <el-table-column prop="valid_period" :label="t('deviceManage.smtSample.validPeriod')"
                    :min-width="getColumnWidth('valid_period')" show-overflow-tooltip />
                <el-table-column prop="sealer" :label="t('deviceManage.smtSample.sealer')"
                    :min-width="getColumnWidth('sealer')" show-overflow-tooltip />
                <el-table-column prop="location" :label="t('deviceManage.smtSample.location')"
                    :min-width="getColumnWidth('location')" show-overflow-tooltip />
                <el-table-column prop="remark" :label="t('deviceManage.smtSample.remark')"
                    :min-width="getColumnWidth('remark')" show-overflow-tooltip />
                <el-table-column prop="create_by" :label="t('deviceManage.smtSample.createBy')"
                    :min-width="getColumnWidth('create_by')" show-overflow-tooltip />
                <el-table-column prop="create_time" :label="t('deviceManage.smtSample.createTime')"
                    :min-width="getColumnWidth('create_time')" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ formatDate(row.create_time) }}
                    </template>
                </el-table-column>
                <el-table-column prop="update_by" :label="t('deviceManage.smtSample.updateBy')"
                    :min-width="getColumnWidth('update_by')" show-overflow-tooltip />
                <el-table-column prop="update_time" :label="t('deviceManage.smtSample.updateTime')"
                    :min-width="getColumnWidth('update_time')" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ formatDate(row.update_time) }}
                    </template>
                </el-table-column>
                <el-table-column fixed="right" :label="t('publicText.operation')" width="150" align="center">
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

            <div class="mt-2 ">
                <el-pagination size="small" background @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :current-page="currentPage"
                    :page-size="pageSize"
                    :page-sizes="[10, 20, 50, 100]"
                    layout="total, sizes, prev, pager, next, jumper" :total="total" />
            </div>
        </el-card>

        <!-- 新增弹窗 -->
        <el-dialog :title="t('deviceManage.smtSample.addTitle')" v-model="addDialogVisible" width="70%"
            :close-on-click-modal="false" @closed="handleAddDialogClosed">
            <el-form ref="addFormRef" :model="addForm" :rules="formRules" label-width="110px" size="small">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item :label="t('deviceManage.smtSample.sampleNo')" prop="sample_no">
                            <el-input v-model="addForm.sample_no"
                                :placeholder="t('deviceManage.smtSample.sampleNoPlaceholder')" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="t('deviceManage.smtSample.sampleType')" prop="sample_type">
                            <el-select v-model="addForm.sample_type"
                                :placeholder="t('deviceManage.smtSample.sampleTypePlaceholder')" style="width: 100%">
                                <el-option v-for="item in sampleTypeOptions" :key="item.value"
                                    :label="item.label" :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="t('deviceManage.smtSample.finishedCode')" prop="finished_code">
                            <el-input v-model="addForm.finished_code"
                                :placeholder="t('deviceManage.smtSample.finishedCodePlaceholder')" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item :label="t('deviceManage.smtSample.version')" prop="version">
                            <el-input v-model="addForm.version" type="textarea" :rows="2"
                                :placeholder="t('deviceManage.smtSample.versionPlaceholder') + '（多个用/分隔）'" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="t('deviceManage.smtSample.sealer')" prop="sealer">
                            <el-input v-model="addForm.sealer"
                                :placeholder="t('deviceManage.smtSample.sealerPlaceholder')" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="t('deviceManage.smtSample.sealDate')" prop="seal_date">
                            <el-date-picker v-model="addForm.seal_date" type="date"
                                format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                                :placeholder="t('deviceManage.smtSample.selectDateTime')" style="width: 100%" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item :label="t('deviceManage.smtSample.refreshDate')" prop="refresh_date">
                            <el-date-picker v-model="addForm.refresh_date" type="date"
                                format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                                :placeholder="t('deviceManage.smtSample.selectDateTime')" style="width: 100%" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="t('deviceManage.smtSample.validPeriod')" prop="valid_period">
                            <el-input v-model="addForm.valid_period"
                                :placeholder="t('deviceManage.smtSample.validPeriodPlaceholder')" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('deviceManage.smtSample.defectContent')" prop="defect_content">
                            <el-input v-model="addForm.defect_content" type="textarea" :rows="2"
                                :placeholder="t('deviceManage.smtSample.defectContentPlaceholder')" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('deviceManage.smtSample.sealContent')" prop="seal_content">
                            <el-input v-model="addForm.seal_content" type="textarea" :rows="2"
                                :placeholder="t('deviceManage.smtSample.sealContentPlaceholder')" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item :label="t('deviceManage.smtSample.remark')" prop="remark">
                    <el-input v-model="addForm.remark" type="textarea" :rows="2"
                        :placeholder="t('deviceManage.smtSample.remarkPlaceholder')" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="addDialogVisible = false">{{ t('publicText.cancel') }}</el-button>
                <el-button type="primary" :loading="submitLoading" @click="submitAdd">{{ t('publicText.confirm') }}</el-button>
            </template>
        </el-dialog>

        <!-- 编辑弹窗 -->
        <el-dialog :title="t('deviceManage.smtSample.editTitle')" v-model="editDialogVisible" width="70%"
            :close-on-click-modal="false" @closed="handleEditDialogClosed">
            <el-form ref="editFormRef" :model="editForm" :rules="formRules" label-width="110px" size="small">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item :label="t('deviceManage.smtSample.sampleNo')" prop="sample_no">
                            <el-input v-model="editForm.sample_no" disabled />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="t('deviceManage.smtSample.sampleType')" prop="sample_type">
                            <el-select v-model="editForm.sample_type"
                                :placeholder="t('deviceManage.smtSample.sampleTypePlaceholder')" style="width: 100%">
                                <el-option v-for="item in sampleTypeOptions" :key="item.value"
                                    :label="item.label" :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="t('deviceManage.smtSample.finishedCode')" prop="finished_code">
                            <el-input v-model="editForm.finished_code"
                                :placeholder="t('deviceManage.smtSample.finishedCodePlaceholder')" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item :label="t('deviceManage.smtSample.version')" prop="version">
                            <el-input v-model="editForm.version" type="textarea" :rows="2"
                                :placeholder="t('deviceManage.smtSample.versionPlaceholder') + '（多个用/分隔）'" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="t('deviceManage.smtSample.sealer')" prop="sealer">
                            <el-input v-model="editForm.sealer"
                                :placeholder="t('deviceManage.smtSample.sealerPlaceholder')" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="t('deviceManage.smtSample.sealDate')" prop="seal_date">
                            <el-date-picker v-model="editForm.seal_date" type="date"
                                format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                                :placeholder="t('deviceManage.smtSample.selectDateTime')" style="width: 100%" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item :label="t('deviceManage.smtSample.refreshDate')" prop="refresh_date">
                            <el-date-picker v-model="editForm.refresh_date" type="date"
                                format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                                :placeholder="t('deviceManage.smtSample.selectDateTime')" style="width: 100%" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="t('deviceManage.smtSample.validPeriod')" prop="valid_period">
                            <el-input v-model="editForm.valid_period"
                                :placeholder="t('deviceManage.smtSample.validPeriodPlaceholder')" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('deviceManage.smtSample.defectContent')" prop="defect_content">
                            <el-input v-model="editForm.defect_content" type="textarea" :rows="2"
                                :placeholder="t('deviceManage.smtSample.defectContentPlaceholder')" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('deviceManage.smtSample.sealContent')" prop="seal_content">
                            <el-input v-model="editForm.seal_content" type="textarea" :rows="2"
                                :placeholder="t('deviceManage.smtSample.sealContentPlaceholder')" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item :label="t('deviceManage.smtSample.remark')" prop="remark">
                    <el-input v-model="editForm.remark" type="textarea" :rows="2"
                        :placeholder="t('deviceManage.smtSample.remarkPlaceholder')" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="editDialogVisible = false">{{ t('publicText.cancel') }}</el-button>
                <el-button type="primary" :loading="submitLoading" @click="submitEdit">{{ t('publicText.confirm') }}</el-button>
            </template>
        </el-dialog>

        <!-- 导入弹窗 -->
        <el-dialog :title="t('deviceManage.smtSample.importTitle')" v-model="importDialogVisible" width="500px"
            :close-on-click-modal="false" @closed="handleImportDialogClosed">
            <el-form :model="importForm" label-width="100px" size="small">
                <el-form-item :label="t('deviceManage.smtSample.file')">
                    <el-upload :auto-upload="false" :limit="1" accept=".xlsx,.xls"
                        :on-change="handleFileChange" :show-file-list="true"
                        :file-list="fileList" style="width: 100%">
                        <el-button size="small">{{ t('deviceManage.smtSample.selectFile') }}</el-button>
                    </el-upload>
                    <div class="el-form-item__error" style="position: static; margin-top: 4px;">
                        {{ t('deviceManage.smtSample.fileTypeTip') }}
                    </div>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="importDialogVisible = false">{{ t('publicText.cancel') }}</el-button>
                <el-button type="primary" :loading="importLoading" @click="handleImport">
                    {{ t('publicText.confirm') }}
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import {
    AddSMTSample,
    UpdateSMTSample,
    DeleteSMTSample,
    QuerySMTSampleList,
    ImportSMTSample,
} from "@/api/deviceManage/SMTSample";
import { CancelRackTask } from "@/api/deviceManage/fixture";
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
const importLoading = ref(false);
const tableHeight = ref(0);
const tableRef = ref();

const currentPage = ref(1);
const pageSize = ref(20);
const total = ref(0);
const tableData = ref<any[]>([]);
const selectedRows = ref<any[]>([]);

const sampleTypeOptions = [
    { label: "合格样件", value: "合格样件" },
    { label: "缺陷样件", value: "缺陷样件" },
];

const searchForm = reactive({
    sample_no: "",
    sample_type: "",
    finished_code: "",
    product_name: "",
    version: "",
});

const { getColumnWidth } = useTableColumnWidth(tableRef, tableData, {
    excludeLabels: [t("publicText.index"), t("publicText.operation")],
});

const formRules = {
    sample_no: [{ required: true, message: t("message.pleaseInput") + t("deviceManage.smtSample.sampleNo"), trigger: "blur" }],
    sample_type: [{ required: true, message: t("message.pleaseSelect") + t("deviceManage.smtSample.sampleType"), trigger: "change" }],
    finished_code: [{ required: true, message: t("message.pleaseInput") + t("deviceManage.smtSample.finishedCode"), trigger: "blur" }],
    version: [{ required: true, message: t("message.pleaseInput") + t("deviceManage.smtSample.version"), trigger: "blur" }],
};

const parseVersions = (versionStr: string): string[] => {
    if (!versionStr) return [];
    return versionStr
        .split(/[\/\n]+/)
        .map(v => v.trim())
        .filter(v => v.length > 0);
};

// 新增
const addDialogVisible = ref(false);
const addFormRef = ref();
const addForm = reactive({
    sample_no: "",
    sample_type: "",
    finished_code: "",
    defect_content: "",
    seal_content: "",
    version: "",
    seal_date: "",
    refresh_date: "",
    valid_period: "",
    sealer: "",
    remark: "",
});

const resetAddForm = () => {
    Object.assign(addForm, {
        sample_no: "", sample_type: "", finished_code: "",
        defect_content: "", seal_content: "", version: "", seal_date: "",
        refresh_date: "", valid_period: "", sealer: "", remark: "",
    });
};

const openAdd = () => {
    resetAddForm();
    addDialogVisible.value = true;
};

const handleAddDialogClosed = () => {
    addFormRef.value?.resetFields();
    resetAddForm();
};

// 编辑
const editDialogVisible = ref(false);
const editFormRef = ref();
const editForm = reactive({
    sample_no: "",
    sample_type: "",
    finished_code: "",
    defect_content: "",
    seal_content: "",
    version: "",
    seal_date: "",
    refresh_date: "",
    valid_period: "",
    sealer: "",
    remark: "",
});

const resetEditForm = () => {
    Object.assign(editForm, {
        sample_no: "", sample_type: "", finished_code: "",
        defect_content: "", seal_content: "", version: "", seal_date: "",
        refresh_date: "", valid_period: "", sealer: "", remark: "",
    });
};

const openEdit = (row: any) => {
    Object.assign(editForm, {
        sample_no: row.sample_no || "",
        sample_type: row.sample_type || "",
        finished_code: row.finished_code || "",
        defect_content: row.defect_content || "",
        seal_content: row.seal_content || "",
        version: row.version || "",
        seal_date: row.seal_date ? dayjs(row.seal_date).format("YYYY-MM-DD") : "",
        refresh_date: row.refresh_date ? dayjs(row.refresh_date).format("YYYY-MM-DD") : "",
        valid_period: row.valid_period || "",
        sealer: row.sealer || "",
        remark: row.remark || "",
    });
    editDialogVisible.value = true;
};

const handleEditDialogClosed = () => {
    editFormRef.value?.resetFields();
    resetEditForm();
};

// 导入
const importDialogVisible = ref(false);
const importForm = reactive({
    file_name: "",
    file_content: "",
});
const fileList = ref<any[]>([]);

const handleImportDialogClosed = () => {
    importForm.file_name = "";
    importForm.file_content = "";
    fileList.value = [];
};

const handleFileChange = (uploadFile: any) => {
    fileList.value = [uploadFile];
    importForm.file_name = uploadFile.raw?.name || uploadFile.name || "";
    const reader = new FileReader();
    reader.onload = (e) => {
        const base64 = e.target?.result as string;
        importForm.file_content = base64.split(",")[1] || base64;
    };
    reader.readAsDataURL(uploadFile.raw || uploadFile);
};

const handleImport = async () => {
    if (!importForm.file_content) {
        ElMessage.warning(t("deviceManage.smtSample.pleaseSelectFile"));
        return;
    }
    importLoading.value = true;
    try {
        const params = {
            FileName: importForm.file_name,
            FileConent: importForm.file_content,
            UserNo: userStore.getUserInfo || "",
            line_name: "",
            equipment_suffix: "",
        };
        const res: any = await ImportSMTSample(params);
        if (res.Success) {
            ElMessage.success(t("deviceManage.smtSample.importSuccess"));
            importDialogVisible.value = false;
            getData();
        } else {
            ElMessage.error(res.Msg || t("deviceManage.smtSample.importFailure"));
        }
    } catch (error) {
        ElMessage.error(t("deviceManage.smtSample.importFailure"));
    } finally {
        importLoading.value = false;
    }
};

// 查询
const getData = async () => {
    loading.value = true;
    try {
        const params = {
            sample_no: searchForm.sample_no,
            sample_type: searchForm.sample_type,
            finished_code: searchForm.finished_code,
            product_name: searchForm.product_name,
            version: searchForm.version,
            pageIndex: currentPage.value,
            pageSize: pageSize.value,
        };
        const res: any = await QuerySMTSampleList(params);
        if (res.Success) {
            if (res.Data && Array.isArray(res.Data)) {
                tableData.value = res.Data;
                total.value = res.Data.length;
            } else if (res.Data && Array.isArray(res.Data.rows)) {
                tableData.value = res.Data.rows;
                total.value = res.Data.total || res.Data.rows.length;
            } else {
                tableData.value = [];
                total.value = 0;
            }
        } else {
            ElMessage.error(res.Msg || t("message.queryFailure"));
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

const resetSearch = () => {
    searchForm.sample_no = "";
    searchForm.sample_type = "";
    searchForm.finished_code = "";
    searchForm.product_name = "";
    searchForm.version = "";
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

const handleSelectionChange = (rows: any[]) => {
    selectedRows.value = rows;
};

// 新增提交
const submitAdd = async () => {
    await addFormRef.value?.validate();
    submitLoading.value = true;
    try {
        const versions = parseVersions(addForm.version);
        const params = {
            sample_no: addForm.sample_no,
            sample_type: addForm.sample_type,
            finished_code: addForm.finished_code,
            product_name: "",
            defect_content: addForm.defect_content,
            seal_content: addForm.seal_content,
            version: addForm.version,
            versions: versions,
            seal_date: addForm.seal_date,
            refresh_date: addForm.refresh_date,
            valid_period: addForm.valid_period,
            sealer: addForm.sealer,
            location: "",
            line_name: "",
            equipment_suffix: "",
            remark: addForm.remark,
            UserNo: userStore.getUserInfo || "",
        };
        const res: any = await AddSMTSample(params);
        if (res.Success) {
            ElMessage.success(t("message.addSuccess"));
            addDialogVisible.value = false;
            getData();
        } else {
            ElMessage.error(res.Msg || t("message.addFailure"));
        }
    } catch (error) {
        ElMessage.error(t("message.addFailure"));
    } finally {
        submitLoading.value = false;
    }
};

// 编辑提交
const submitEdit = async () => {
    await editFormRef.value?.validate();
    submitLoading.value = true;
    try {
        const versions = parseVersions(editForm.version);
        const params = {
            sample_no: editForm.sample_no,
            sample_type: editForm.sample_type,
            finished_code: editForm.finished_code,
            product_name: "",
            defect_content: editForm.defect_content,
            seal_content: editForm.seal_content,
            version: editForm.version,
            versions: versions,
            seal_date: editForm.seal_date,
            refresh_date: editForm.refresh_date,
            valid_period: editForm.valid_period,
            sealer: editForm.sealer,
            location: "",
            line_name: "",
            equipment_suffix: "",
            remark: editForm.remark,
            UserNo: userStore.getUserInfo || "",
        };
        const res: any = await UpdateSMTSample(params);
        if (res.Success) {
            ElMessage.success(t("message.editSuccess"));
            editDialogVisible.value = false;
            getData();
        } else {
            ElMessage.error(res.Msg || t("message.editFailure"));
        }
    } catch (error) {
        ElMessage.error(t("message.editFailure"));
    } finally {
        submitLoading.value = false;
    }
};

// 删除
const handleDelete = (row: any) => {
    ElMessageBox.confirm(
        `${t("publicText.confirm")}${t("publicText.delete")}【${row.sample_no}】?`,
        t("publicText.tip"),
        { confirmButtonText: t("publicText.confirm"), cancelButtonText: t("publicText.cancel"), type: "warning" }
    )
        .then(async () => {
            loading.value = true;
            try {
                const res: any = await DeleteSMTSample({ sample_nos: [row.sample_no] });
                if (res.Success) {
                    ElMessage.success(t("message.deleteSuccess"));
                    getData();
                } else {
                    ElMessage.error(res.Msg || t("message.deleteFailure"));
                }
            } catch (error) {
                ElMessage.error(t("message.deleteFailure"));
            } finally {
                loading.value = false;
            }
        })
        .catch(() => { });
};

const handleBatchDelete = () => {
    if (selectedRows.value.length === 0) return;
    ElMessageBox.confirm(
        `${t("publicText.confirm")}${t("publicText.batchDelete")}（${selectedRows.value.length}条）?`,
        t("publicText.tip"),
        { confirmButtonText: t("publicText.confirm"), cancelButtonText: t("publicText.cancel"), type: "warning" }
    )
        .then(async () => {
            loading.value = true;
            try {
                const sampleNos = selectedRows.value.map((r: any) => r.sample_no);
                const res: any = await DeleteSMTSample({ sample_nos: sampleNos });
                if (res.Success) {
                    ElMessage.success(t("message.deleteSuccess"));
                    selectedRows.value = [];
                    getData();
                } else {
                    ElMessage.error(res.Msg || t("message.deleteFailure"));
                }
            } catch (error) {
                ElMessage.error(t("message.deleteFailure"));
            } finally {
                loading.value = false;
            }
        })
        .catch(() => { });
};

// 储位清除（批量）
const handleClearCell = () => {
    const validRows = selectedRows.value.filter((r: any) => r.location);
    if (validRows.length === 0) return;
    const cells = validRows.map((r: any) => r.location).join(", ");
    ElMessageBox.confirm(
        t("deviceManage.smtSample.confirmClearCell", { cell: cells }),
        t("publicText.tip"),
        { confirmButtonText: t("publicText.confirm"), cancelButtonText: t("publicText.cancel"), type: "warning" }
    )
        .then(async () => {
            loading.value = true;
            try {
                const data = {
                    items: validRows.map((r: any) => ({ rid: r.sample_no, Cell: r.location })),
                    UserNo: userStore.getUserInfo || "",
                };
                const res: any = await CancelRackTask(data);
                if (res.Success) {
                    ElMessage.success(t("deviceManage.smtSample.clearCellSuccess"));
                    getData();
                } else {
                    ElMessage.error(res.Msg || t("deviceManage.smtSample.clearCellFailure"));
                }
            } catch (error) {
                ElMessage.error(t("deviceManage.smtSample.clearCellFailure"));
            } finally {
                loading.value = false;
            }
        })
        .catch(() => { });
};

const getSampleTypeText = (type: string) => {
    const found = sampleTypeOptions.find(o => o.value === type);
    return found ? found.label : type;
};

const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return dayjs(dateStr).format("YYYY-MM-DD");
};

const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 220;
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
