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
                <el-table-column prop="pointID" fixed :label="$t('AGV.pointLine.startPoint')"
                    :min-width="getColumnWidth('pointID')" />
                <el-table-column prop="pointName" :label="$t('AGV.pointLine.startPointName')" 
                    :min-width="getColumnWidth('pointName')" />
                <el-table-column prop="magazine_pointId" :label="$t('AGV.pointLine.endPoint')" 
                    :min-width="getColumnWidth('magazine_pointId')" />
                <el-table-column prop="magazine_pointName" :label="$t('AGV.pointLine.endPointName')" 
                    :min-width="getColumnWidth('magazine_pointName')" />
                <el-table-column prop="remark" :label="$t('AGV.pointLine.remark')" 
                    :min-width="getColumnWidth('remark')" />
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
                <el-form-item :label="$t('AGV.pointLine.startPoint')" prop="startpoint">
                    <el-select v-model="addForm.startpoint" clearable filterable
                        :placeholder="$t('AGV.pointLine.selectStartPoint')">
                        <el-option v-for="item in pointData" :key="item.pointID" 
                            :label="`${item.pointID} - ${item.pointName}`" :value="item.pointID" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('AGV.pointLine.endPoint')" prop="endpoint">
                    <el-select v-model="addForm.endpoint" clearable filterable
                        :placeholder="$t('AGV.pointLine.selectEndPoint')">
                        <el-option v-for="item in pointData" :key="item.pointID" 
                            :label="`${item.pointID} - ${item.pointName}`" :value="item.pointID" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('AGV.pointLine.remark')" prop="remark">
                    <el-input v-model="addForm.remark"
                        :placeholder="$t('AGV.pointLine.inputRemark')" clearable type="textarea" />
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
                <el-form-item :label="$t('AGV.pointLine.startPoint')" prop="startpoint">
                    <el-select v-model="editForm.startpoint" clearable filterable disabled
                        :placeholder="$t('AGV.pointLine.selectStartPoint')">
                        <el-option v-for="item in pointData" :key="item.pointID" 
                            :label="`${item.pointID} - ${item.pointName}`" :value="item.pointID" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('AGV.pointLine.endPoint')" prop="endpoint">
                    <el-select v-model="editForm.endpoint" clearable filterable disabled
                        :placeholder="$t('AGV.pointLine.selectEndPoint')">
                        <el-option v-for="item in pointData" :key="item.pointID" 
                            :label="`${item.pointID} - ${item.pointName}`" :value="item.pointID" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('AGV.pointLine.remark')" prop="remark">
                    <el-input v-model="editForm.remark"
                        :placeholder="$t('AGV.pointLine.inputRemark')" clearable type="textarea" />
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
  SelectPoint,
  InsertUpdatePointSheet,
  DeletePointSheet,
  QueryPointSheet,
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

const pointData = ref<any[]>([]);

const searchForm = reactive({
    point: "",
});

const pageObj = reactive({
    currentPage: 1,
    pageSize: 50,
});

const addForm = reactive({
    startpoint: "",
    endpoint: "",
    remark: "",
});

const editForm = reactive({
    startpoint: "",
    endpoint: "",
    remark: "",
});

const addVisible = ref(false);
const editVisible = ref(false);
const addFormRef = ref();
const editFormRef = ref();

const formRules = reactive({
    startpoint: [
        {
            required: true,
            message: t("message.pleaseSelect") + t("AGV.pointLine.startPoint"),
            trigger: "change",
        },
    ],
    endpoint: [
        {
            required: true,
            message: t("message.pleaseSelect") + t("AGV.pointLine.endPoint"),
            trigger: "change",
        },
    ],
});

const { getColumnWidth } = useTableColumnWidth(eltableRef, tableData, {
    excludeLabels: [t('publicText.index'), t('publicText.operation')]
});

const getPointData = () => {
    SelectPoint({ point: "" })
        .then((res: any) => {
            if ( res.Data) {
                pointData.value = res.Data;
            }
        });
};

const getData = () => {

    const params = {
        point: searchForm.point || "",
        PageIndex: pageObj.currentPage,
        PageSize: pageObj.pageSize,
    };
    QueryPointSheet(params)
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
    addForm.startpoint = "";
    addForm.endpoint = "";
    addForm.remark = "";
    addVisible.value = true;
};

const handleAddDialogClosed = () => {
    addFormRef.value?.resetFields();
};

const submitAdd = () => {
    addFormRef.value.validate((valid: boolean) => {
        if (valid) {
            if (addForm.startpoint === addForm.endpoint) {
                ElMessage.warning(t("AGV.pointLine.startEndSame"));
                return;
            }
            submitLoading.value = true;
            const params = {
                startpoint: addForm.startpoint,
                endpoint: addForm.endpoint,
                remark: addForm.remark,
                UserNo: userStore.getUserInfo || "",
            };
            InsertUpdatePointSheet(params)
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
    editForm.startpoint = row.pointID;
    editForm.endpoint = row.magazine_pointId;
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
                startpoint: editForm.startpoint,
                endpoint: editForm.endpoint,
                remark: editForm.remark,
                UserNo: userStore.getUserInfo || "",
            };
            InsertUpdatePointSheet(params)
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
        `${t("publicText.confirm")}${t("publicText.delete")}【${row.pointID} -> ${row.magazine_pointId}】?`,
        t("publicText.tip"),
        {
            confirmButtonText: t("publicText.confirm"),
            cancelButtonText: t("publicText.cancel"),
            type: "warning",
        }
    )
        .then(() => {
            loading.value = true;
            DeletePointSheet({
                startpoint: row.pointID,
                endpoint: row.magazine_pointId,
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

onBeforeMount(() => {
    getScreenHeight();
});

onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    getPointData();
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