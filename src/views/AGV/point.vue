<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between">
                <el-form ref="formRef" :model="searchForm" label-width="auto" :inline="true" :size="'small'"
                    @submit.native.prevent>
                    <el-form-item :label="$t('AGV.point.point')" prop="point" class="mb-2">
                        <el-input v-model="searchForm.point" clearable @clear="handleSearch"
                            @keyup.enter.native="handleSearch" style="width: 200px"
                            :placeholder="$t('AGV.point.inputPoint')" />
                    </el-form-item>
                    <el-form-item class="mb-2">
                        <el-button :type="'primary'" @click="handleSearch">{{
                            t("publicText.query")
                            }}</el-button>
                    </el-form-item>
                </el-form>
                <div>
                    <el-button type="warning" size="small" @click="openAdd">{{
                        t("publicText.add")
                        }}</el-button>
                </div>
            </div>
            <el-table :data="tableData" size="small" ref="eltableRef" :style="{ width: '100%' }" :height="tableHeight"
                :tooltip-effect="'dark'" border fit highlight-current-row >
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{
                            scope.$index + pageObj.pageSize * (pageObj.currentPage - 1) + 1
                            }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="pointID" fixed :label="$t('AGV.point.point')"
                    :min-width="getColumnWidth('pointID')" />
                <el-table-column prop="pointName" :label="$t('AGV.point.pointName')" 
                    :min-width="getColumnWidth('pointName')" />
                <el-table-column prop="workstationID" :label="$t('AGV.workstation.workstationID')" 
                    :min-width="getColumnWidth('workstationID')">
                    <template #default="{ row }">
                        {{ getWorkstationName(row.workstationID) }}
                    </template>
                </el-table-column>
                <el-table-column prop="pointType" :label="$t('AGV.point.pointType')" 
                    :min-width="getColumnWidth('pointType')">
                    <template #default="{ row }">
                        {{ getPointTypeName(row.pointType) }}
                    </template>
                </el-table-column>
                <el-table-column prop="status" :label="$t('AGV.point.status')" 
                    :min-width="getColumnWidth('status')">
                    <template #default="{ row }">
                        {{ row.status === '0' ? t('publicText.enable') : t('publicText.disable') }}
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
                            <el-button size="small" type="primary" @click="openEdit(row)" icon="Edit"/>
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

        <el-dialog :title="t('publicText.add')" v-model="addVisible" width="600px" :close-on-click-modal="false"
            @closed="handleAddDialogClosed">
            <el-form ref="addFormRef" :model="addForm" :rules="formRules" label-width="auto">
                <el-form-item :label="$t('AGV.point.point')" prop="point">
                    <el-input v-model="addForm.point"
                        :placeholder="$t('AGV.point.inputPoint')" clearable />
                </el-form-item>
                <el-form-item :label="$t('AGV.point.pointName')" prop="pointName">
                    <el-input v-model="addForm.pointName"
                        :placeholder="$t('AGV.point.inputPointName')" clearable />
                </el-form-item>
                <el-form-item :label="$t('AGV.workstation.workstationID')" prop="workstationID">
                    <el-select v-model="addForm.workstationID" clearable filterable
                        :placeholder="$t('AGV.workstation.selectWorkstation')">
                        <el-option v-for="item in workstationData" :key="item.workstationID" 
                            :label="item.workstationID + '-' + item.name" :value="item.workstationID" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('AGV.point.pointType')" prop="pointType">
                    <el-select v-model="addForm.pointType" clearable
                        :placeholder="$t('AGV.point.selectPointType')">
                        <el-option v-for="item in pointTypeOptions" :key="item.value" 
                            :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('AGV.point.pointTag')" prop="pointTag">
                    <el-select v-model="addForm.pointTag" clearable
                        :placeholder="$t('AGV.point.selectPointTag')">
                        <el-option v-for="item in pointTagOptions" :key="item.value" 
                            :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('AGV.point.remark')" prop="remark">
                    <el-input v-model="addForm.remark"
                        :placeholder="$t('AGV.point.inputRemark')" clearable type="textarea" />
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

        <el-dialog :title="t('publicText.edit')" v-model="editVisible" width="600px" :close-on-click-modal="false"
            @closed="handleEditDialogClosed">
            <el-form ref="editFormRef" :model="editForm" :rules="formRules" label-width="auto">
                <el-form-item :label="$t('AGV.point.point')" prop="point">
                    <el-input v-model="editForm.point" disabled />
                </el-form-item>
                <el-form-item :label="$t('AGV.point.pointName')" prop="pointName">
                    <el-input v-model="editForm.pointName"
                        :placeholder="$t('AGV.point.inputPointName')" clearable />
                </el-form-item>
                <el-form-item :label="$t('AGV.workstation.workstationID')" prop="workstationID">
                    <el-select v-model="editForm.workstationID" clearable filterable
                        :placeholder="$t('AGV.workstation.selectWorkstation')">
                        <el-option v-for="item in workstationData" :key="item.workstationID" 
                            :label="item.workstationID + '-' + item.name" :value="item.workstationID" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('AGV.point.pointType')" prop="pointType">
                    <el-select v-model="editForm.pointType" clearable
                        :placeholder="$t('AGV.point.selectPointType')">
                        <el-option v-for="item in pointTypeOptions" :key="item.value" 
                            :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('AGV.point.pointTag')" prop="pointTag">
                    <el-select v-model="editForm.pointTag" clearable
                        :placeholder="$t('AGV.point.selectPointTag')">
                        <el-option v-for="item in pointTagOptions" :key="item.value" 
                            :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('AGV.point.remark')" prop="remark">
                    <el-input v-model="editForm.remark"
                        :placeholder="$t('AGV.point.inputRemark')" clearable type="textarea" />
                </el-form-item>
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
import {
  SelectWorkstation,
  InsertUpdatePoint,
  GetpointType,
  GetpointTag,
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
    remark: "",
});

const editForm = reactive({
    point: "",
    pointName: "",
    workstationID: "",
    pointType: "",
    pointTag: "",
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
});

const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === "1900-01-01T00:00:00") return "-";
    return dayjs(dateStr).format("YYYY-MM-DD HH:mm:ss");
};

const getWorkstationName = (workstationID: number | string) => {
    const item = workstationData.value.find(w => w.workstationID === workstationID);
    return item ? item.name : workstationID;
};

const getPointTypeName = (pointType: string) => {
    const item = pointTypeOptions.value.find(opt => opt.value === pointType);
    return item ? item.label : pointType;
};

const { getColumnWidth } = useTableColumnWidth(eltableRef, tableData, {
    excludeLabels: [t('publicText.index'), t('publicText.operation')]
});

const getWorkstationData = () => {
    SelectWorkstation({ workstationID: "" })
        .then((res: any) => {
            if ( res.Data) {
                workstationData.value = res.Data;
            }
        });
};

const getPointTypeData = () => {
    GetpointType({})
        .then((res: any) => {
            if ( res.Data) {
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
    addForm.remark = "";
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
                remark: addForm.remark,
                Userno: userStore.getUserInfo || "",
            };
            InsertUpdatePoint(params)
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
     getWorkstationData();
   
    editForm.point = row.pointID;
    editForm.pointName = row.pointName;
    editForm.workstationID = row.workstationID;
    editForm.pointType = row.pointType || "";
    editForm.pointTag = row.pointTag || "";
    editForm.remark = row.remark || "";
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
                remark: editForm.remark,
                Userno: userStore.getUserInfo || "",
            };
            InsertUpdatePoint(params)
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

onBeforeMount(() => {
    getScreenHeight();
});

onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
   getPointTypeData();
    getPointTagData();
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