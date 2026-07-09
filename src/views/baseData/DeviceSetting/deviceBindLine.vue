<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between">
                <el-form ref="formRef" :model="searchForm" label-width="auto" :inline="true" :size="'small'"
                    @submit.native.prevent>
                    <el-form-item :label="$t('deviceSetting.deviceBindLine.equipmentCategory')" prop="EquipmentCategory" class="mb-2">
                        <el-input v-model="searchForm.EquipmentCategory" clearable @clear="handleSearch"
                            @keyup.enter.native="handleSearch" style="width: 200px"
                            :placeholder="$t('deviceSetting.deviceBindLine.inputEquipmentCategory')" />
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
                <!-- <el-table-column prop="LineBindId" fixed :label="$t('deviceSetting.deviceBindLine.lineBindId')"
                    :min-width="getColumnWidth('LineBindId')" /> -->
                <el-table-column prop="EquipmentCategory" :label="$t('deviceSetting.deviceBindLine.equipmentCategory')" 
                    :min-width="getColumnWidth('EquipmentCategory')" />
                <el-table-column prop="EquipmentModel" :label="$t('deviceSetting.deviceBindLine.equipmentModel')" 
                    :min-width="getColumnWidth('EquipmentModel')" />
                <el-table-column prop="EquipmentId" :label="$t('deviceSetting.deviceBindLine.equipmentId')" 
                    :min-width="getColumnWidth('EquipmentId')" />
                <el-table-column prop="ProductionLine" :label="$t('deviceSetting.deviceBindLine.productionLine')" 
                    :min-width="getColumnWidth('ProductionLine')" />
                <el-table-column prop="Operator" :label="$t('deviceSetting.deviceBindLine.operator')" 
                    :min-width="getColumnWidth('Operator')" />
                <el-table-column prop="OperationTime" :label="$t('deviceSetting.deviceBindLine.operationTime')" 
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
                <el-form-item :label="$t('deviceSetting.deviceBindLine.paramName')" prop="ParamNameId">
                    <el-select v-model="addForm.ParamNameId" clearable filterable
                        :placeholder="$t('deviceSetting.deviceBindLine.selectParamName')">
                        <el-option v-for="item in processParameterData" :key="item.ParamNameId" 
                            :label="item.ProcessParameterName" :value="item.ParamNameId" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('deviceSetting.deviceBindLine.equipmentCategory')" prop="EquipmentCategory">
                    <el-select v-model="addForm.EquipmentCategory" clearable filterable
                        :placeholder="$t('deviceSetting.deviceBindLine.selectEquipmentCategory')"
                        @change="handleEquipmentCategoryChange('add')">
                        <el-option v-for="item in equipmentTypeData" :key="item.EquipTypeId" 
                            :label="item.EquipmentCategory" :value="item.EquipmentCategory" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('deviceSetting.deviceBindLine.equipmentModel')" prop="EquipmentModel">
                    <el-select v-model="addForm.EquipmentModel" clearable
                        :placeholder="$t('deviceSetting.deviceBindLine.selectEquipmentModel')">
                        <el-option v-for="item in filteredEquipmentModels" :key="item.EquipTypeId" 
                            :label="item.EquipmentModel" :value="item.EquipmentModel" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('deviceSetting.deviceBindLine.equipmentId')" prop="EquipmentId">
                    <el-input v-model="addForm.EquipmentId"
                        :placeholder="$t('deviceSetting.deviceBindLine.inputEquipmentId')" clearable />
                </el-form-item>
                <el-form-item :label="$t('deviceSetting.deviceBindLine.productionLine')" prop="ProductionLine">
                    <el-select v-model="addForm.ProductionLine" clearable filterable
                        :placeholder="$t('deviceSetting.deviceBindLine.selectProductionLine')">
                        <el-option v-for="item in lineData" :key="item.MfgLineName" :label="item.MfgLineName"
                            :value="item.MfgLineName" />
                    </el-select>
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
                <el-form-item :label="$t('deviceSetting.deviceBindLine.lineBindId')" prop="LineBindId">
                    <el-input v-model="editForm.LineBindId" disabled />
                </el-form-item>
                <el-form-item :label="$t('deviceSetting.deviceBindLine.paramName')" prop="ParamNameId">
                    <el-select v-model="editForm.ParamNameId" clearable filterable
                        :placeholder="$t('deviceSetting.deviceBindLine.selectParamName')">
                        <el-option v-for="item in processParameterData" :key="item.ParamNameId" 
                            :label="item.ProcessParameterName" :value="item.ParamNameId" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('deviceSetting.deviceBindLine.equipmentCategory')" prop="EquipmentCategory">
                    <el-select v-model="editForm.EquipmentCategory" clearable filterable
                        :placeholder="$t('deviceSetting.deviceBindLine.selectEquipmentCategory')"
                        @change="handleEquipmentCategoryChange('edit')">
                        <el-option v-for="item in equipmentTypeData" :key="item.EquipTypeId" 
                            :label="item.EquipmentCategory" :value="item.EquipmentCategory" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('deviceSetting.deviceBindLine.equipmentModel')" prop="EquipmentModel">
                    <el-select v-model="editForm.EquipmentModel" clearable
                        :placeholder="$t('deviceSetting.deviceBindLine.selectEquipmentModel')">
                        <el-option v-for="item in filteredEditEquipmentModels" :key="item.EquipTypeId" 
                            :label="item.EquipmentModel" :value="item.EquipmentModel" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('deviceSetting.deviceBindLine.equipmentId')" prop="EquipmentId">
                    <el-input v-model="editForm.EquipmentId"
                        :placeholder="$t('deviceSetting.deviceBindLine.inputEquipmentId')" clearable />
                </el-form-item>
                <el-form-item :label="$t('deviceSetting.deviceBindLine.productionLine')" prop="ProductionLine">
                    <el-select v-model="editForm.ProductionLine" clearable filterable
                        :placeholder="$t('deviceSetting.deviceBindLine.selectProductionLine')">
                        <el-option v-for="item in lineData" :key="item.MfgLineName" :label="item.MfgLineName"
                            :value="item.MfgLineName" />
                    </el-select>
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
  QueryEquipmentLineBinding,
  AddEquipmentLineBinding,
  UpdateEquipmentLineBinding,
  DeleteEquipmentLineBinding,
} from "@/api/baseData/DeviceSetting";
import { GetMESWorkLineNews } from "@/api/Scheduling/lineCalendar";
import {
    ref,
    reactive,
    computed,
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
const lineData = ref<any[]>([]);
const processParameterData = ref<any[]>([]);

const searchForm = reactive({
    EquipmentCategory: "",
});

const pageObj = reactive({
    currentPage: 1,
    pageSize: 50,
});

const addForm = reactive({
    LineBindId: 0,
    ParamNameId: 0,
    EquipmentCategory: "",
    EquipmentModel: "",
    EquipmentId: "",
    ProductionLine: "",
});

const editForm = reactive({
    LineBindId: 0,
    ParamNameId: 0,
    EquipmentCategory: "",
    EquipmentModel: "",
    EquipmentId: "",
    ProductionLine: "",
});

const addVisible = ref(false);
const editVisible = ref(false);
const addFormRef = ref();
const editFormRef = ref();

const formRules = reactive({
    ParamNameId: [
        {
            required: true,
            message: t("message.pleaseSelect") + t("deviceSetting.deviceBindLine.paramName"),
            trigger: "change",
        },
    ],
    EquipmentCategory: [
        {
            required: true,
            message: t("message.pleaseSelect") + t("deviceSetting.deviceBindLine.equipmentCategory"),
            trigger: "change",
        },
    ],
    EquipmentModel: [
        {
            required: true,
            message: t("message.pleaseSelect") + t("deviceSetting.deviceBindLine.equipmentModel"),
            trigger: "change",
        },
    ],
    EquipmentId: [
        {
            required: true,
            message: t("message.pleaseInput") + t("deviceSetting.deviceBindLine.equipmentId"),
            trigger: "blur",
        },
    ],
    ProductionLine: [
        {
            required: true,
            message: t("message.pleaseSelect") + t("deviceSetting.deviceBindLine.productionLine"),
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

const filteredEquipmentModels = computed(() => {
    if (!addForm.EquipmentCategory) return [];
    return equipmentTypeData.value.filter(e => e.EquipmentCategory === addForm.EquipmentCategory);
});

const filteredEditEquipmentModels = computed(() => {
    if (!editForm.EquipmentCategory) return [];
    return equipmentTypeData.value.filter(e => e.EquipmentCategory === editForm.EquipmentCategory);
});

const getEquipmentTypeData = () => {
    QueryEquipmentType({ EquipmentCategory: "" })
        .then((res: any) => {
            if (res.Success && res.Data) {
                equipmentTypeData.value = res.Data;
            }
        });
};

const getLineData = () => {
    GetMESWorkLineNews({ WorkLineName: "" }).then((res: any) => {
        if (res.Success) {
            lineData.value = res.Data || [];
        }
    });
};

const getProcessParameterData = () => {
    QueryProcessParameterName({ EquipmentCategory: "" })
        .then((res: any) => {
            if (res.Success && res.Data) {
                processParameterData.value = res.Data;
            }
        });
};

const getData = () => {
    loading.value = true;
    const params = {
        EquipmentCategory: searchForm.EquipmentCategory || "",
    };
    QueryEquipmentLineBinding(params)
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
    form.EquipmentModel = "";
};

const openAdd = () => {
    getEquipmentTypeData();
    getLineData();
    getProcessParameterData();
    addForm.LineBindId = 0;
    addForm.ParamNameId = 0;
    addForm.EquipmentCategory = "";
    addForm.EquipmentModel = "";
    addForm.EquipmentId = "";
    addForm.ProductionLine = "";
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
                ParamNameId: addForm.ParamNameId,
                EquipmentCategory: addForm.EquipmentCategory,
                EquipmentModel: addForm.EquipmentModel,
                EquipmentId: addForm.EquipmentId,
                ProductionLine: addForm.ProductionLine,
                Operator: userStore.getUserInfo || "",
            };
            AddEquipmentLineBinding(params)
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
    getLineData();
    getProcessParameterData();
    editForm.LineBindId = row.LineBindId;
    editForm.ParamNameId = row.ParamNameId;
    editForm.EquipmentCategory = row.EquipmentCategory;
    editForm.EquipmentModel = row.EquipmentModel;
    editForm.EquipmentId = row.EquipmentId;
    editForm.ProductionLine = row.ProductionLine;
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
                LineBindId: editForm.LineBindId,
                ParamNameId: editForm.ParamNameId,
                EquipmentCategory: editForm.EquipmentCategory,
                EquipmentModel: editForm.EquipmentModel,
                EquipmentId: editForm.EquipmentId,
                ProductionLine: editForm.ProductionLine,
                Operator: userStore.getUserInfo || "",
            };
            UpdateEquipmentLineBinding(params)
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
        `${t("publicText.confirm")}${t("publicText.delete")}【${row.EquipmentId} - ${row.ProductionLine}】?`,
        t("publicText.tip"),
        {
            confirmButtonText: t("publicText.confirm"),
            cancelButtonText: t("publicText.cancel"),
            type: "warning",
        }
    )
        .then(() => {
            loading.value = true;
            DeleteEquipmentLineBinding({
                LineBindId: row.LineBindId,
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