<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between">
                <el-form ref="formRef" :model="searchForm" label-width="auto" :inline="true" :size="'small'"
                    @submit.native.prevent>
                    <el-form-item :label="$t('deviceSetting.processParameter.equipmentCategory')" prop="EquipmentCategory" class="mb-2">
                        <el-input v-model="searchForm.EquipmentCategory" clearable @clear="handleSearch"
                            @keyup.enter.native="handleSearch" style="width: 200px"
                            :placeholder="$t('deviceSetting.processParameter.inputEquipmentCategory')" />
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
              
                <el-table-column prop="EquipmentCategory" :label="$t('deviceSetting.processParameter.equipmentCategory')" 
                    :min-width="getColumnWidth('EquipmentCategory')" />
                <el-table-column prop="ProcessParameterName" :label="$t('deviceSetting.processParameter.processParameterName')" 
                    :min-width="getColumnWidth('ProcessParameterName')" />
                <el-table-column prop="Unit" :label="$t('deviceSetting.processParameter.unit')" 
                    :min-width="getColumnWidth('Unit')" />
                <el-table-column prop="Operator" :label="$t('deviceSetting.processParameter.operator')" 
                    :min-width="getColumnWidth('Operator')" />
                <el-table-column prop="OperationTime" :label="$t('deviceSetting.processParameter.operationTime')" 
                    :min-width="getColumnWidth('OperationTime')">
                    <template #default="{ row }">
                        {{ formatDate(row.OperationTime) }}
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

        <el-dialog :title="t('publicText.add')" v-model="addVisible" width="500px" :close-on-click-modal="false"
            @closed="handleAddDialogClosed">
            <el-form ref="addFormRef" :model="addForm" :rules="formRules" label-width="auto">
                <el-form-item :label="$t('deviceSetting.processParameter.equipmentCategory')" prop="EquipmentCategory">
                    <el-select v-model="addForm.EquipmentCategory" clearable filterable
                        :placeholder="$t('deviceSetting.processParameter.selectEquipmentCategory')"
                        @change="handleEquipmentCategoryChange('add')">
                        <el-option v-for="item in equipmentTypeData" :key="item.EquipTypeId" 
                            :label="item.EquipmentCategory" :value="item.EquipmentCategory" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('deviceSetting.processParameter.processParameterName')" prop="ProcessParameterName">
                    <el-input v-model="addForm.ProcessParameterName"
                        :placeholder="$t('deviceSetting.processParameter.inputProcessParameterName')" clearable />
                </el-form-item>
                <el-form-item :label="$t('deviceSetting.processParameter.unit')" prop="Unit">
                    <el-input v-model="addForm.Unit"
                        :placeholder="$t('deviceSetting.processParameter.inputUnit')" clearable />
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

        <el-dialog :title="t('publicText.edit')" v-model="editVisible" width="500px" :close-on-click-modal="false"
            @closed="handleEditDialogClosed">
            <el-form ref="editFormRef" :model="editForm" :rules="formRules" label-width="auto">
                <el-form-item :label="$t('deviceSetting.processParameter.equipmentCategory')" prop="EquipmentCategory">
                    <el-select v-model="editForm.EquipmentCategory" clearable filterable
                        :placeholder="$t('deviceSetting.processParameter.selectEquipmentCategory')"
                        @change="handleEquipmentCategoryChange('edit')">
                        <el-option v-for="item in equipmentTypeData" :key="item.EquipTypeId" 
                            :label="item.EquipmentCategory" :value="item.EquipmentCategory" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('deviceSetting.processParameter.processParameterName')" prop="ProcessParameterName">
                    <el-input v-model="editForm.ProcessParameterName"
                        :placeholder="$t('deviceSetting.processParameter.inputProcessParameterName')" clearable />
                </el-form-item>
                <el-form-item :label="$t('deviceSetting.processParameter.unit')" prop="Unit">
                    <el-input v-model="editForm.Unit"
                        :placeholder="$t('deviceSetting.processParameter.inputUnit')" clearable />
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
  QueryEquipmentType,
  QueryProcessParameterName,
  AddProcessParameterName,
  UpdateProcessParameterName,
  DeleteProcessParameterName,
} from "@/api/baseData/DeviceSetting";
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
const allData = ref<any[]>([]);
const equipmentTypeData = ref<any[]>([]);

const searchForm = reactive({
    EquipmentCategory: "",
});

const pageObj = reactive({
    currentPage: 1,
    pageSize: 50,
});

const addForm = reactive({
    EquipTypeId: 0,
    EquipmentCategory: "",
    ProcessParameterName: "",
    Unit: "",
});

const editForm = reactive({
    ParamNameId: 0,
    EquipTypeId: 0,
    EquipmentCategory: "",
    ProcessParameterName: "",
    Unit: "",
});

const addVisible = ref(false);
const editVisible = ref(false);
const addFormRef = ref();
const editFormRef = ref();

const formRules = reactive({
    EquipmentCategory: [
        {
            required: true,
            message: t("message.pleaseSelect") + t("deviceSetting.processParameter.equipmentCategory"),
            trigger: "change",
        },
    ],
    ProcessParameterName: [
        {
            required: true,
            message: t("message.pleaseInput") + t("deviceSetting.processParameter.processParameterName"),
            trigger: "blur",
        },
    ],
    Unit: [
        {
            required: true,
            message: t("message.pleaseInput") + t("deviceSetting.processParameter.unit"),
            trigger: "blur",
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

const getEquipmentTypeData = () => {
    QueryEquipmentType({ EquipmentCategory: "" })
        .then((res: any) => {
            if (res.Success && res.Data) {
                equipmentTypeData.value = res.Data;
            }
        });
};

const getData = () => {
    loading.value = true;
    const params = {
        EquipmentCategory: searchForm.EquipmentCategory || "",
    };
    QueryProcessParameterName(params)
        .then((res: any) => {
            if (res.Success && res.Data) {
                allData.value = res.Data;
                handlePageData();
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
        .finally(() => {
            loading.value = false;
        });
};

const handlePageData = () => {
    const start = (pageObj.currentPage - 1) * pageObj.pageSize;
    const end = start + pageObj.pageSize;
    tableData.value = allData.value.slice(start, end);
    total.value = allData.value.length;
};

const handleSearch = () => {
    pageObj.currentPage = 1;
    getData();
};

const handleSizeChange = (val: number) => {
    pageObj.pageSize = val;
    pageObj.currentPage = 1;
    handlePageData();
};

const handleCurrentChange = (val: number) => {
    pageObj.currentPage = val;
    handlePageData();
};

const handleEquipmentCategoryChange = (type: string) => {
    const form = type === 'add' ? addForm : editForm;
    const item = equipmentTypeData.value.find(e => e.EquipmentCategory === form.EquipmentCategory);
    if (item) {
        form.EquipTypeId = item.EquipTypeId;
    } else {
        form.EquipTypeId = 0;
    }
};

const openAdd = () => {
    getEquipmentTypeData();
    addForm.EquipTypeId = 0;
    addForm.EquipmentCategory = "";
    addForm.ProcessParameterName = "";
    addForm.Unit = "";
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
                EquipTypeId: addForm.EquipTypeId,
                EquipmentCategory: addForm.EquipmentCategory,
                ProcessParameterName: addForm.ProcessParameterName,
                Unit: addForm.Unit,
                Operator: userStore.getUserInfo || "",
            };
            AddProcessParameterName(params)
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
    getEquipmentTypeData();
    editForm.ParamNameId = row.ParamNameId;
    editForm.EquipTypeId = row.EquipTypeId;
    editForm.EquipmentCategory = row.EquipmentCategory;
    editForm.ProcessParameterName = row.ProcessParameterName;
    editForm.Unit = row.Unit;
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
                ParamNameId: editForm.ParamNameId,
                EquipTypeId: editForm.EquipTypeId,
                EquipmentCategory: editForm.EquipmentCategory,
                ProcessParameterName: editForm.ProcessParameterName,
                Unit: editForm.Unit,
                Operator: userStore.getUserInfo || "",
            };
            UpdateProcessParameterName(params)
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
        `${t("publicText.confirm")}${t("publicText.delete")}【${row.ProcessParameterName}】?`,
        t("publicText.tip"),
        {
            confirmButtonText: t("publicText.confirm"),
            cancelButtonText: t("publicText.cancel"),
            type: "warning",
        }
    )
        .then(() => {
            loading.value = true;
            DeleteProcessParameterName({
                ParamNameId: row.ParamNameId,
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