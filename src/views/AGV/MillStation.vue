<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between">
                <el-form ref="formRef" :model="searchForm" label-width="auto" :inline="true" :size="'small'"
                    @submit.native.prevent>
                    <el-form-item :label="$t('AGV.MillStation.pointID')" prop="pointID" class="mb-2">
                        <el-select v-model="searchForm.pointID" clearable filterable
                            :placeholder="$t('AGV.MillStation.selectPoint')" style="width: 250px">
                            <el-option v-for="item in pointNames" :key="item.pointID"
                                :label="item.pointName + '-' + item.pointID " :value="item.pointID" />
                        </el-select>
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
                :tooltip-effect="'dark'" border fit highlight-current-row>
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{
                            scope.$index + pageObj.pageSize * (pageObj.currentPage - 1) + 1
                            }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="pointID" fixed :label="$t('AGV.MillStation.pointID')"
                    :min-width="getColumnWidth('pointID')" />
                <el-table-column prop="pointname" :label="$t('AGV.MillStation.pointName')"
                    :min-width="getColumnWidth('pointname')" />
                <el-table-column prop="minqty" :label="$t('AGV.MillStation.minQty')"
                    :min-width="getColumnWidth('minqty')" />
                <el-table-column prop="remark" :label="$t('AGV.MillStation.remark')"
                    :min-width="getColumnWidth('remark')" />
                <el-table-column prop="status" :label="$t('AGV.MillStation.status')"
                    :min-width="getColumnWidth('status')">
                    <template #default="{ row }">
                        {{ row.status === '0' ? t('publicText.enable') : t('publicText.disable') }}
                    </template>
                </el-table-column>
                <el-table-column prop="created_by" :label="$t('AGV.MillStation.createdBy')"
                    :min-width="getColumnWidth('created_by')" />
                <el-table-column prop="created_time" :label="$t('AGV.MillStation.createdTime')"
                    :min-width="getColumnWidth('created_time')">
                    <template #default="{ row }">
                        {{ formatDate(row.created_time) }}
                    </template>
                </el-table-column>
                <el-table-column prop="updated_time" :label="$t('AGV.MillStation.updatedTime')"
                    :min-width="getColumnWidth('updated_time')">
                    <template #default="{ row }">
                        {{ formatDate(row.updated_time) }}
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

        <el-dialog :title="t('publicText.add')" v-model="addVisible" width="600px" :close-on-click-modal="false"
            @closed="handleAddDialogClosed">
            <el-form ref="addFormRef" :model="addForm" :rules="formRules" label-width="auto">
                <el-form-item :label="$t('AGV.MillStation.pointID')" prop="pointID">
                    <el-select v-model="addForm.pointID" clearable filterable
                        :placeholder="$t('AGV.MillStation.selectPoint')">
                        <el-option v-for="item in pointNames" :key="item.pointID"
                            :label="item.pointName" :value="item.pointID" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('AGV.MillStation.pointName')" prop="pointname">
                    <el-input v-model="addForm.pointname"
                        :placeholder="$t('AGV.MillStation.inputPointName')" clearable />
                </el-form-item>
                <el-form-item :label="$t('AGV.MillStation.minQty')" prop="minqty">
                    <el-input v-model="addForm.minqty" type="number"
                        :placeholder="$t('AGV.MillStation.inputMinQty')" clearable />
                </el-form-item>
                <el-form-item :label="$t('AGV.MillStation.remark')" prop="remark">
                    <el-input v-model="addForm.remark"
                        :placeholder="$t('AGV.MillStation.inputRemark')" clearable type="textarea" />
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
                <el-form-item :label="$t('AGV.MillStation.pointID')" prop="pointID">
                    <el-select v-model="editForm.pointID" disabled>
                        <el-option v-for="item in pointNames" :key="item.pointID"
                            :label="item.pointName" :value="item.pointID" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('AGV.MillStation.pointName')" prop="pointname">
                    <el-input v-model="editForm.pointname"
                        :placeholder="$t('AGV.MillStation.inputPointName')" clearable />
                </el-form-item>
                <el-form-item :label="$t('AGV.MillStation.minQty')" prop="minqty">
                    <el-input v-model="editForm.minqty" type="number"
                        :placeholder="$t('AGV.MillStation.inputMinQty')" clearable />
                </el-form-item>
                <el-form-item :label="$t('AGV.MillStation.remark')" prop="remark">
                    <el-input v-model="editForm.remark"
                        :placeholder="$t('AGV.MillStation.inputRemark')" clearable type="textarea" />
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
    QueryPointNames,
    InsertUpdatePointInfo,
    SoftDeletePointInfo,
    GetPointInfoByID,
} from "@/api/AGV/MillStation";
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
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import dayjs from "dayjs";
import { useI18n } from "vue-i18n";

const userStore = useUserStoreWithOut();
const { t } = useI18n();

const loading = ref(false);
const submitLoading = ref(false);
const tableHeight = ref(0);
const eltableRef = ref();
const tableData = ref<any[]>([]);
const allData = ref<any[]>([]);
const total = ref(0);

const pointNames = ref<any[]>([]);

const searchForm = reactive({
    pointID: "",
});

const pageObj = reactive({
    currentPage: 1,
    pageSize: 50,
});

const addForm = reactive({
    pointID: "",
    pointname: "",
    minqty: 0,
    remark: "",
});

const editForm = reactive({
    pointID: "",
    pointname: "",
    minqty: 0,
    remark: "",
});

const addVisible = ref(false);
const editVisible = ref(false);
const addFormRef = ref();
const editFormRef = ref();

const formRules = reactive({
    pointID: [
        {
            required: true,
            message: t("message.pleaseSelect") + t("AGV.MillStation.pointID"),
            trigger: "change",
        },
    ],
    pointname: [
        {
            required: true,
            message: t("message.pleaseInput") + t("AGV.MillStation.pointName"),
            trigger: "blur",
        },
    ],
    minqty: [
        {
            required: true,
            message: t("message.pleaseInput") + t("AGV.MillStation.minQty"),
            trigger: "blur",
        }
    ],
});

const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === "1900-01-01T00:00:00") return "-";
    return dayjs(dateStr).format("YYYY-MM-DD HH:mm:ss");
};

const { getColumnWidth } = useTableColumnWidth(eltableRef, tableData, {
    excludeLabels: [t("publicText.index"), t("publicText.operation")],
});

const getPointNames = () => {
    QueryPointNames({})
        .then((res: any) => {
            if (res.Data) {
                pointNames.value = res.Data;
            }
        });
};

const getData = () => {
    const params = {
        pointID: searchForm.pointID || "",
    };
    GetPointInfoByID(params)
        .then((res: any) => {
            if (res.Data) {
                const data = res.Data;
                if (Array.isArray(data)) {
                    allData.value = data;
                } else {
                    allData.value = [data];
                }
                total.value = allData.value.length;
                handlePageChange();
            } else {
                allData.value = [];
                tableData.value = [];
                total.value = 0;
                ElMessage.warning(res.Message || t("message.queryFailure"));
            }
        })
        .catch(() => {
            allData.value = [];
            tableData.value = [];
            total.value = 0;
        })
       
};

const handlePageChange = () => {
    const start = (pageObj.currentPage - 1) * pageObj.pageSize;
    const end = start + pageObj.pageSize;
    tableData.value = allData.value.slice(start, end);
};

const handleSearch = () => {
    pageObj.currentPage = 1;
    getData();
};

const handleSizeChange = (val: number) => {
    pageObj.pageSize = val;
    pageObj.currentPage = 1;
    handlePageChange();
};

const handleCurrentChange = (val: number) => {
    pageObj.currentPage = val;
    handlePageChange();
};

const openAdd = () => {
    getPointNames();
    addForm.pointID = "";
    addForm.pointname = "";
    addForm.minqty = 0;
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
                pointID: addForm.pointID,
                pointname: addForm.pointname,
                minqty: addForm.minqty,
                remark: addForm.remark,
                Userno: userStore.getUserInfo || "",
            };
            InsertUpdatePointInfo(params)
                .then((res: any) => {
                    if (res.Code === 100200 || res.Code === 100300) {
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
    getPointNames();
    editForm.pointID = row.pointID;
    editForm.pointname = row.pointname;
    editForm.minqty = row.minqty;
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
                pointID: editForm.pointID,
                pointname: editForm.pointname,
                minqty: editForm.minqty,
                remark: editForm.remark,
                Userno: userStore.getUserInfo || "",
            };
            InsertUpdatePointInfo(params)
                .then((res: any) => {
                    if (res.Code === 100200 || res.Code === 100300) {
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
        `${t("publicText.confirm")}${t("publicText.delete")}【${row.pointID} - ${row.pointname}】?`,
        t("publicText.tip"),
        {
            confirmButtonText: t("publicText.confirm"),
            cancelButtonText: t("publicText.cancel"),
            type: "warning",
        }
    )
        .then(() => {
            loading.value = true;
            SoftDeletePointInfo({
                pointID: row.pointID,
                Userno: userStore.getUserInfo || "",
            })
                .then((res: any) => {
                    if (res.Code === 100200 || res.Code === 100300) {
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
    getPointNames();
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