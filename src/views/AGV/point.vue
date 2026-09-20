<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between">
                <el-form ref="formRef" :model="searchForm" label-width="auto" :inline="true" :size="'small'"
                    @submit.prevent>
                    <el-form-item :label="$t('AGV.point.point')" prop="point" class="mb-2">
                        <el-input v-model="searchForm.point" clearable @clear="handleSearch"
                            @keyup.enter="handleSearch" style="width: 200px"
                            :placeholder="$t('AGV.point.inputPoint')" />
                    </el-form-item>
                    <el-form-item class="mb-2">
                        <el-button :type="'primary'" @click="handleSearch">{{
                            t("publicText.query")
                            }}</el-button>
                        <el-button @click="handleReset">{{ t("publicText.reset") }}</el-button>
                    </el-form-item>
                </el-form>
                <div>
                    <el-button type="warning" size="small" @click="openAdd">{{
                        t("publicText.add")
                        }}</el-button>
                </div>
            </div>
            <el-table :data="tableData" size="small" ref="eltableRef" :style="{ width: '100%' }" :height="tableHeight"
                :tooltip-effect="'dark'" border fit highlight-current-row
                :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }">
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{
                            scope.$index + pageObj.pageSize * (pageObj.currentPage - 1) + 1
                            }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="pointID" fixed :label="$t('AGV.point.point')"
                    :min-width="getColumnWidth('pointID')" show-overflow-tooltip />
                <el-table-column prop="pointName" :label="$t('AGV.point.pointName')"
                    :min-width="getColumnWidth('pointName')" show-overflow-tooltip />
                <el-table-column prop="workstationID" :label="$t('AGV.workstation.workstationID')"
                    :min-width="getColumnWidth('workstationID')" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ getWorkstationName(row.workstationID) }}
                    </template>
                </el-table-column>
                <el-table-column prop="pointType" :label="$t('AGV.point.pointType')"
                    :min-width="getColumnWidth('pointType')" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ getPointTypeName(row.pointType) }}
                    </template>
                </el-table-column>
                <el-table-column prop="pathtypeName" :label="$t('AGV.point.pathType')"
                    :min-width="getColumnWidth('pathtypeName')" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ getPathTypeName(row) }}
                    </template>
                </el-table-column>
                <el-table-column prop="pointType2" :label="$t('AGV.point.lineList')" align="center"
                    :min-width="getColumnWidth('pointType2')">
                    <template #default="{ row }">
                        <el-link v-if="parseLineList(row.pointType2).length" type="primary" :underline="false"
                            @click="openLineDetail(row)">
                            {{ t('AGV.point.lineCount', { n: parseLineList(row.pointType2).length }) }}
                        </el-link>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" :label="$t('AGV.point.status')" width="100" align="center" fixed="right">
                    <template #default="{ row }">
                        <el-switch :model-value="isStatusEnabled(row.status)" :loading="row._toggleLoading"
                            @change="(val: boolean) => handleToggleStatus(row, val)" />
                    </template>
                </el-table-column>
                <el-table-column prop="cr_user" :label="$t('AGV.point.crUser')"
                    :min-width="getColumnWidth('cr_user')" />
                <el-table-column prop="cr_date" :label="$t('AGV.point.crDate')"
                    :min-width="getColumnWidth('cr_date')">
                    <template #default="{ row }">
                        {{ formatDate(row.cr_date) }}
                    </template>
                </el-table-column>
                <el-table-column prop="ud_user" :label="$t('AGV.point.udUser')"
                    :min-width="getColumnWidth('ud_user')" />
                <el-table-column prop="ud_date" :label="$t('AGV.point.udDate')"
                    :min-width="getColumnWidth('ud_date')">
                    <template #default="{ row }">
                        {{ formatDate(row.ud_date) }}
                    </template>
                </el-table-column>
                <el-table-column :label="$t('publicText.operation')" :fixed="'right'" width="130" align="center">
                    <template #default="{ row }">
                        <el-tooltip :content="$t('publicText.edit')" placement="top">
                            <el-button size="small" type="primary" @click="openEdit(row)" icon="Edit" />
                        </el-tooltip>
                        <el-tooltip :content="$t('publicText.delete')" placement="top">
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
                    layout="total,sizes, prev, pager, next" :total="total">
                </el-pagination>
            </div>
        </el-card>

        <el-dialog :title="t('publicText.add')" v-model="addVisible" width="640px" top="8vh"
            :close-on-click-modal="false" @closed="handleAddDialogClosed">
            <el-form ref="addFormRef" :model="addForm" :rules="formRules" label-width="110px">
                <el-form-item :label="$t('AGV.point.point')" prop="point">
                    <el-input v-model="addForm.point" :placeholder="$t('AGV.point.inputPoint')" clearable />
                </el-form-item>
                <el-form-item :label="$t('AGV.point.pointName')" prop="pointName">
                    <el-input v-model="addForm.pointName" :placeholder="$t('AGV.point.inputPointName')" clearable />
                </el-form-item>
                <el-form-item :label="$t('AGV.workstation.workstationID')" prop="workstationID">
                    <el-select v-model="addForm.workstationID" clearable filterable style="width: 100%"
                        :placeholder="$t('AGV.workstation.selectWorkstation')">
                        <el-option v-for="item in workstationData" :key="item.workstationID"
                            :label="item.workstationID + '-' + item.name" :value="item.workstationID" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('AGV.point.pointType')" prop="pointType">
                    <el-select v-model="addForm.pointType" clearable filterable style="width: 100%"
                        :placeholder="$t('AGV.point.selectPointType')">
                        <el-option v-for="item in pointTypeOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('AGV.point.pointTag')" prop="pointTag">
                    <el-select v-model="addForm.pointTag" clearable filterable style="width: 100%"
                        :placeholder="$t('AGV.point.selectPointTag')">
                        <el-option v-for="item in pointTagOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('AGV.point.pathType')" prop="pathtype">
                    <el-select v-model="addForm.pathtype" clearable filterable style="width: 100%"
                        :placeholder="$t('AGV.point.selectPathType')">
                        <el-option v-for="item in pathTypeOptions" :key="'ap-' + item.pointtype_no"
                            :value="String(item.pointtype_no)"
                            :label="`${item.pointtype_no} ${item.pointtype_name ?? ''}`" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('AGV.point.lineList')" prop="linelist">
                    <el-select v-model="addForm.linelist" multiple clearable filterable collapse-tags
                        collapse-tags-tooltip style="width: 100%" :placeholder="$t('AGV.point.lineListPlaceholder')"
                        @change="(val: any) => handleLineChange(val, addForm)">
                        <el-option :label="$t('AGV.point.selectAll')" :value="ALL_LINE" />
                        <el-option v-for="item in lineOptions" :key="'al-' + item.line" :value="String(item.line)"
                            :label="item.line" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('AGV.point.status')" prop="status">
                    <el-switch v-model="addForm.status" active-value="0" inactive-value="-1" />
                    <span class="status-hint">
                        {{ isStatusEnabled(addForm.status) ? t('publicText.enable') : t('publicText.disable') }}
                    </span>
                </el-form-item>
                <el-form-item :label="$t('AGV.point.remark')" prop="remark">
                    <el-input v-model="addForm.remark" :placeholder="$t('AGV.point.inputRemark')" clearable
                        type="textarea" :rows="2" resize="none" />
                </el-form-item>
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

        <el-dialog :title="t('publicText.edit')" v-model="editVisible" width="640px" top="8vh"
            :close-on-click-modal="false" @closed="handleEditDialogClosed">
            <el-form ref="editFormRef" :model="editForm" :rules="formRules" label-width="110px">
                <el-form-item :label="$t('AGV.point.point')" prop="point">
                    <el-input v-model="editForm.point" disabled />
                </el-form-item>
                <el-form-item :label="$t('AGV.point.pointName')" prop="pointName">
                    <el-input v-model="editForm.pointName" :placeholder="$t('AGV.point.inputPointName')" clearable />
                </el-form-item>
                <el-form-item :label="$t('AGV.workstation.workstationID')" prop="workstationID">
                    <el-select v-model="editForm.workstationID" clearable filterable style="width: 100%"
                        :placeholder="$t('AGV.workstation.selectWorkstation')">
                        <el-option v-for="item in workstationData" :key="item.workstationID"
                            :label="item.workstationID + '-' + item.name" :value="item.workstationID" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('AGV.point.pointType')" prop="pointType">
                    <el-select v-model="editForm.pointType" clearable filterable style="width: 100%"
                        :placeholder="$t('AGV.point.selectPointType')">
                        <el-option v-for="item in pointTypeOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('AGV.point.pointTag')" prop="pointTag">
                    <el-select v-model="editForm.pointTag" clearable filterable style="width: 100%"
                        :placeholder="$t('AGV.point.selectPointTag')">
                        <el-option v-for="item in pointTagOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('AGV.point.pathType')" prop="pathtype">
                    <el-select v-model="editForm.pathtype" clearable filterable style="width: 100%"
                        :placeholder="$t('AGV.point.selectPathType')">
                        <el-option v-for="item in pathTypeOptions" :key="'ep-' + item.pointtype_no"
                            :value="String(item.pointtype_no)"
                            :label="`${item.pointtype_no} ${item.pointtype_name ?? ''}`" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('AGV.point.lineList')" prop="linelist">
                    <el-select v-model="editForm.linelist" multiple clearable filterable collapse-tags
                        collapse-tags-tooltip style="width: 100%" :placeholder="$t('AGV.point.lineListPlaceholder')"
                        @change="(val: any) => handleLineChange(val, editForm)">
                        <el-option :label="$t('AGV.point.selectAll')" :value="ALL_LINE" />
                        <el-option v-for="item in lineOptions" :key="'el-' + item.line" :value="String(item.line)"
                            :label="item.line" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('AGV.point.status')" prop="status">
                    <el-switch v-model="editForm.status" active-value="0" inactive-value="-1" />
                    <span class="status-hint">
                        {{ isStatusEnabled(editForm.status) ? t('publicText.enable') : t('publicText.disable') }}
                    </span>
                </el-form-item>
                <el-form-item :label="$t('AGV.point.remark')" prop="remark">
                    <el-input v-model="editForm.remark" :placeholder="$t('AGV.point.inputRemark')" clearable
                        type="textarea" :rows="2" resize="none" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="editVisible = false">{{ t("publicText.cancel") }}</el-button>
                    <el-button type="primary" @click="submitEdit" :loading="submitLoading">{{
                        t("publicText.confirm")
                        }}</el-button>
                </div>
            </template>
        </el-dialog>

        <!-- 线体明细弹窗 -->
        <el-dialog v-model="lineDetailVisible" :title="t('AGV.point.lineDetail')" width="520px" top="12vh"
            @closed="resetLineDetail">
            <div class="line-detail-info">
                <span class="line-detail-info-label">{{ t('AGV.point.point') }}</span>
                <span class="line-detail-info-value">{{ lineDetailRow?.pointID ?? '-' }}</span>
                <span class="line-detail-info-arrow">→</span>
                <span class="line-detail-info-label">{{ t('AGV.point.pointName') }}</span>
                <span class="line-detail-info-value">{{ lineDetailRow?.pointName ?? '-' }}</span>
            </div>
            <el-table :data="lineDetailRows" size="small" border stripe max-height="360" style="width: 100%">
                <el-table-column type="index" :label="t('publicText.index')" width="70" align="center" />
                <el-table-column prop="line" :label="t('AGV.point.lineList')" />
            </el-table>
            <template #footer>
                <el-button size="small" type="primary" @click="lineDetailVisible = false">
                    {{ t("publicText.close") }}
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import {
  SelectWorkstation,
  InsertUpdatePoint,
  GetpointType,
  GetpointTag,
  GetEnablePointType,
  GetAllValorLine,
  DeletePoint,
  QueryPoint,
} from "@/api/AGV/index";
import {
    ref,
    reactive,
    nextTick,
    onMounted,
    onBeforeMount,
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

const workstationData = ref<any[]>([]);
const pointTypeOptions = ref<any[]>([]);
const pointTagOptions = ref<any[]>([]);
const pathTypeOptions = ref<any[]>([]);
const lineOptions = ref<any[]>([]);

const searchForm = reactive({
    point: "",
});

const pageObj = reactive({
    currentPage: 1,
    pageSize: 50,
});

const addForm = reactive({
    point: "",
    pointName: "",
    workstationID: "",
    pointType: "",
    pointTag: "",
    pathtype: "",
    linelist: [] as string[],
    status: "0",
    remark: "",
});

const editForm = reactive({
    point: "",
    pointName: "",
    workstationID: "",
    pointType: "",
    pointTag: "",
    pathtype: "",
    linelist: [] as string[],
    status: "0",
    remark: "",
});

const addVisible = ref(false);
const editVisible = ref(false);
const addFormRef = ref();
const editFormRef = ref();

const formRules = reactive({
    point: [
        {
            required: true,
            message: t("message.pleaseInput") + t("AGV.point.point"),
            trigger: "blur",
        },
    ],
    pointName: [
        {
            required: true,
            message: t("message.pleaseInput") + t("AGV.point.pointName"),
            trigger: "blur",
        },
    ],
    workstationID: [
        {
            required: true,
            message: t("message.pleaseSelect") + t("AGV.workstation.workstationID"),
            trigger: "change",
        },
    ],
    pointType: [
        {
            required: true,
            message: t("message.pleaseSelect") + t("AGV.point.pointType"),
            trigger: "change",
        },
    ],
});

const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === "1900-01-01T00:00:00") return "-";
    return dayjs(dateStr).format("YYYY-MM-DD HH:mm:ss");
};

const isStatusEnabled = (value: any) => {
    const s = String(value ?? "0");
    return s !== "-1" && s !== "N" && s.toLowerCase() !== "disabled";
};

const getWorkstationName = (workstationID: number | string) => {
    const item = workstationData.value.find(w => String(w.workstationID) === String(workstationID));
    return item ? item.name : workstationID;
};

const getPointTypeName = (pointType: string) => {
    const item = pointTypeOptions.value.find(opt => String(opt.value) === String(pointType));
    return item ? item.label : pointType;
};

const ALL_LINE = "__ALL__";

const parseLineList = (value: any): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value.map((v) => String(v)).filter(Boolean);
    return String(value).split(";").map((s) => s.trim()).filter(Boolean);
};

const parsePathType = (value: any): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value.map((v) => String(v)).filter(Boolean);
    return String(value).split(",").map((s) => s.trim()).filter(Boolean);
};

const getPathTypeName = (row: any) => {
    if (row.pathtypeName) return row.pathtypeName;
    const codes = parsePathType(row.pathtype);
    if (!codes.length) return "-";
    return codes.map((code) => {
        const item = pathTypeOptions.value.find(opt => String(opt.pointtype_no) === String(code));
        return item ? `${item.pointtype_no}-${item.pointtype_name}` : code;
    }).join(",");
};

const lineDetailVisible = ref(false);
const lineDetailRows = ref<{ line: string }[]>([]);
const lineDetailRow = ref<any>(null);

const openLineDetail = (row: any) => {
    lineDetailRow.value = row;
    lineDetailRows.value = parseLineList(row.pointType2).map((line) => ({ line }));
    lineDetailVisible.value = true;
};

const resetLineDetail = () => {
    lineDetailRows.value = [];
    lineDetailRow.value = null;
};

const enabledLineValues = () => lineOptions.value.map((item) => String(item.line)).filter(Boolean);

const buildLineSelection = (value: any): string[] => {
    const parsed = parseLineList(value);
    const allLines = enabledLineValues();
    if (allLines.length > 0 && allLines.every((line) => parsed.includes(line))) {
        return [ALL_LINE, ...allLines];
    }
    return parsed;
};

const prevLineValue = ref<string[]>([]);

const handleLineChange = (val: string[], target: { linelist: string[] }) => {
    const selected = Array.isArray(val) ? [...val] : [];
    const allLines = enabledLineValues();
    const hasAll = selected.includes(ALL_LINE);
    const hadAll = prevLineValue.value.includes(ALL_LINE);
    const currentLines = selected.filter((v) => v !== ALL_LINE);
    let next = selected;
    if (hasAll && !hadAll) {
        next = [ALL_LINE, ...allLines];
    } else if (hadAll) {
        next = currentLines;
    }
    target.linelist = next;
    prevLineValue.value = [...next];
};

const { getColumnWidth } = useTableColumnWidth(eltableRef, tableData, {
    excludeLabels: [t('publicText.index'), t('publicText.operation')]
});

const getWorkstationData = () => {
    SelectWorkstation({ workstationID: "" })
        .then((res: any) => {
            if (res.Data) {
                workstationData.value = res.Data;
            }
        });
};

const getPointTypeData = () => {
    GetpointType({})
        .then((res: any) => {
            if (res.Data) {
                pointTypeOptions.value = Object.entries(res.Data).map(([value, label]) => ({
                    label,
                    value
                }));
            }
        });
};

const getPointTagData = () => {
    GetpointTag({})
        .then((res: any) => {
            if (res.Data) {
                pointTagOptions.value = Object.entries(res.Data).map(([value, label]) => ({
                    label: label,
                    value
                }));
            }
        });
};

const getPathTypeData = () => {
    return GetEnablePointType()
        .then((res: any) => {
            pathTypeOptions.value = Array.isArray(res?.Data) ? res.Data : [];
        })
        .catch(() => {
            pathTypeOptions.value = [];
        });
};

const getLineData = () => {
    return GetAllValorLine({})
        .then((res: any) => {
            lineOptions.value = Array.isArray(res?.Data) ? res.Data : [];
        })
        .catch(() => {
            lineOptions.value = [];
        });
};

const getData = () => {
    loading.value = true;
    const params = {
        point: searchForm.point || "",
        PageIndex: pageObj.currentPage,
        PageSize: pageObj.pageSize,
    };
    QueryPoint(params)
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

const handleReset = () => {
    searchForm.point = "";
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
    getWorkstationData();

    addForm.point = "";
    addForm.pointName = "";
    addForm.workstationID = "";
    addForm.pointType = "";
    addForm.pointTag = "";
    addForm.pathtype = "";
    addForm.linelist = [];
    addForm.status = "0";
    addForm.remark = "";
    prevLineValue.value = [];
    addVisible.value = true;
};

const handleAddDialogClosed = () => {
    addFormRef.value?.resetFields();
};

const submitAdd = () => {
    addFormRef.value.validate((valid: boolean) => {
        if (valid) {
            submitLoading.value = true;
            const params = {
                point: addForm.point,
                pointName: addForm.pointName,
                workstationID: addForm.workstationID,
                pointType: addForm.pointType,
                pointTag: addForm.pointTag,
                status: String(addForm.status),
                pathtype: addForm.pathtype,
                linelist: addForm.linelist.filter((v) => v !== ALL_LINE),
                remark: addForm.remark,
                Userno: userStore.getUserInfo || "",
            };
            InsertUpdatePoint(params)
                .then((res: any) => {
                    if (res.Success) {
                        ElMessage.success(res.Message || t("message.addSuccess"));
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
    getWorkstationData();

    editForm.point = row.pointID;
    editForm.pointName = row.pointName;
    editForm.workstationID = row.workstationID;
    editForm.pointType = row.pointType || "";
    editForm.pointTag = row.pointTag || "";
    editForm.pathtype = parsePathType(row.pathtype)[0] || "";
    editForm.linelist = buildLineSelection(row.pointType2);
    editForm.status = isStatusEnabled(row.status) ? "0" : "-1";
    editForm.remark = row.remark || "";
    prevLineValue.value = [...editForm.linelist];
    editVisible.value = true;
};

const handleEditDialogClosed = () => {
    editFormRef.value?.resetFields();
};

const submitEdit = () => {
    editFormRef.value.validate((valid: boolean) => {
        if (valid) {
            submitLoading.value = true;
            const params = {
                point: editForm.point,
                pointName: editForm.pointName,
                workstationID: editForm.workstationID,
                pointType: editForm.pointType,
                pointTag: editForm.pointTag,
                status: String(editForm.status),
                pathtype: editForm.pathtype,
                linelist: editForm.linelist.filter((v) => v !== ALL_LINE),
                remark: editForm.remark,
                Userno: userStore.getUserInfo || "",
            };
            InsertUpdatePoint(params)
                .then((res: any) => {
                    if (res.Success) {
                        ElMessage.success(res.Message || t("message.editSuccess"));
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
        `${t("publicText.confirm")}${t("publicText.delete")}【${row.pointID} - ${row.pointName}】?`,
        t("publicText.tip"),
        {
            confirmButtonText: t("publicText.confirm"),
            cancelButtonText: t("publicText.cancel"),
            type: "warning",
        }
    )
        .then(() => {
            loading.value = true;
            DeletePoint({
                point: row.pointID,
                Userno: userStore.getUserInfo || "",
            })
                .then((res: any) => {
                    if (res.Success) {
                        ElMessage.success(res.Message || res.Msg || t("message.deleteSuccess"));
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

const handleToggleStatus = (row: any, enabled: boolean) => {
    const prevStatus = row.status;
    const targetStatus = enabled ? "0" : "-1";
    if (isStatusEnabled(prevStatus) === enabled) return;
    row._toggleLoading = true;
    InsertUpdatePoint({
        point: row.pointID,
        pointName: row.pointName,
        workstationID: row.workstationID,
        pointType: row.pointType,
        pointTag: row.pointTag,
        status: targetStatus,
        pathtype: parsePathType(row.pathtype).join(","),
        linelist: parseLineList(row.pointType2),
        remark: row.remark || "",
        Userno: userStore.getUserInfo || "",
    })
        .then((res: any) => {
            if (res.Success) {
                row.status = targetStatus;
                ElMessage.success(res.Message || t("message.editSuccess"));
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

onBeforeMount(() => {
    getScreenHeight();
});

onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    getPointTypeData();
    getPointTagData();
    getPathTypeData();
    getLineData();
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

.status-hint {
    margin-left: 8px;
    font-size: 12px;
    color: #909399;
}

.line-detail-info {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 10px;
    padding: 8px 10px;
    background-color: #f5f7fa;
    border-radius: 4px;
    font-size: 13px;
}

.line-detail-info-label {
    color: #909399;
}

.line-detail-info-value {
    color: #303133;
    font-weight: 600;
}

.line-detail-info-arrow {
    color: #909399;
    padding: 0 4px;
}
</style>
