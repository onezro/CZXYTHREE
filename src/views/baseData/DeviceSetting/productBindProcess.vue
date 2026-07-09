<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between">
                <el-form ref="formRef" :model="searchForm" label-width="auto" :inline="true" :size="'small'"
                    @submit.native.prevent>
                    <el-form-item :label="$t('deviceSetting.productBindProcess.equipmentCategory')" prop="EquipmentCategory" class="mb-2">
                        <el-input v-model="searchForm.EquipmentCategory" clearable @clear="handleSearch"
                            @keyup.enter.native="handleSearch" style="width: 200px"
                            :placeholder="$t('deviceSetting.productBindProcess.inputEquipmentCategory')" />
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
                <!-- <el-table-column prop="ProdParamId" fixed :label="$t('deviceSetting.productBindProcess.prodParamId')"
                    :min-width="getColumnWidth('ProdParamId')" /> -->
                <el-table-column prop="EquipmentCategory" :label="$t('deviceSetting.productBindProcess.equipmentCategory')" 
                    :min-width="getColumnWidth('EquipmentCategory')" />
                <el-table-column prop="EquipmentModel" :label="$t('deviceSetting.productBindProcess.equipmentModel')" 
                    :min-width="getColumnWidth('EquipmentModel')" />
                <el-table-column prop="ProcessParameterName" :label="$t('deviceSetting.productBindProcess.processParameterName')" 
                    :min-width="getColumnWidth('ProcessParameterName')" />
                <el-table-column prop="StandardValue" :label="$t('deviceSetting.productBindProcess.standardValue')" 
                    :min-width="getColumnWidth('StandardValue')" />
                     <el-table-column prop="LowerLimit" :label="$t('deviceSetting.productBindProcess.lowerLimit')" 
                    :min-width="getColumnWidth('LowerLimit')" />
                <el-table-column prop="UpperLimit" :label="$t('deviceSetting.productBindProcess.upperLimit')" 
                    :min-width="getColumnWidth('UpperLimit')" />
               
                <el-table-column prop="Unit" :label="$t('deviceSetting.productBindProcess.unit')" 
                    :min-width="getColumnWidth('Unit')" />
                <el-table-column prop="ProductType" :label="$t('deviceSetting.productBindProcess.productType')" 
                    :min-width="getColumnWidth('ProductType')">
                    <template #default="{ row }">
                        {{ row.ProductType === '*' ? t('deviceSetting.productBindProcess.universal') : row.ProductType }}
                    </template>
                </el-table-column>
                <el-table-column prop="Operator" :label="$t('deviceSetting.productBindProcess.operator')" 
                    :min-width="getColumnWidth('Operator')" />
                <el-table-column prop="OperationTime" :label="$t('deviceSetting.productBindProcess.operationTime')" 
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

        <el-dialog :title="t('publicText.add')" v-model="addVisible" width="600px" :close-on-click-modal="false"
            @closed="handleAddDialogClosed">
            <el-form ref="addFormRef" :model="addForm" :rules="formRules" label-width="auto">
                <el-form-item :label="$t('deviceSetting.productBindProcess.equipmentCategory')" prop="EquipmentCategory">
                    <el-select v-model="addForm.EquipmentCategory" clearable filterable
                        :placeholder="$t('deviceSetting.productBindProcess.selectEquipmentCategory')"
                        @change="handleEquipmentCategoryChange('add')">
                        <el-option v-for="item in equipmentTypeData" :key="item.EquipTypeId" 
                            :label="item.EquipmentCategory" :value="item.EquipmentCategory" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('deviceSetting.productBindProcess.equipmentModel')" prop="EquipmentModel">
                    <el-select v-model="addForm.EquipmentModel" clearable
                        :placeholder="$t('deviceSetting.productBindProcess.selectEquipmentModel')"
                        @change="handleEquipmentModelChange('add')">
                        <el-option v-for="item in filteredEquipmentModels" :key="item.EquipTypeId" 
                            :label="item.EquipmentModel" :value="item.EquipmentModel" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('deviceSetting.productBindProcess.processParameterName')" prop="ProcessParameterName">
                    <el-select v-model="addForm.ProcessParameterName" clearable 
                        :placeholder="$t('deviceSetting.productBindProcess.selectProcessParameterName')"  @change="handleProcessParameterChange('add')">
                        <el-option v-for="item in filteredProcessParameters" :key="item.ParamNameId" 
                            :label="item.ProcessParameterName" :value="item.ProcessParameterName" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('deviceSetting.productBindProcess.standardValue')" prop="StandardValue">
                    <el-input-number v-model="addForm.StandardValue" :min="0" style="width: 100%"
                        :placeholder="$t('deviceSetting.productBindProcess.inputStandardValue')" />
                </el-form-item>
                
                <el-form-item :label="$t('deviceSetting.productBindProcess.lowerLimit')" prop="LowerLimit">
                    <el-input-number v-model="addForm.LowerLimit" :min="0" style="width: 100%"
                        :placeholder="$t('deviceSetting.productBindProcess.inputLowerLimit')" />
                </el-form-item>
                <el-form-item :label="$t('deviceSetting.productBindProcess.upperLimit')" prop="UpperLimit">
                    <el-input-number v-model="addForm.UpperLimit" :min="0" style="width: 100%"
                        :placeholder="$t('deviceSetting.productBindProcess.inputUpperLimit')" />
                </el-form-item>
                <el-form-item :label="$t('deviceSetting.productBindProcess.unit')" prop="Unit">
                    <el-input v-model="addForm.Unit"
                        :placeholder="$t('deviceSetting.productBindProcess.inputUnit')" clearable disabled />
                </el-form-item>
                <el-form-item :label="$t('deviceSetting.productBindProcess.productType')" prop="ProductType">
                   <el-input v-model="addForm.ProductType"
                        :placeholder="$t('deviceSetting.productBindProcess.inputProductType')" clearable />
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
                <el-form-item :label="$t('deviceSetting.productBindProcess.prodParamId')" prop="ProdParamId">
                    <el-input v-model="editForm.ProdParamId" disabled />
                </el-form-item>
                <el-form-item :label="$t('deviceSetting.productBindProcess.equipmentCategory')" prop="EquipmentCategory">
                    <el-select v-model="editForm.EquipmentCategory" clearable filterable
                        :placeholder="$t('deviceSetting.productBindProcess.selectEquipmentCategory')"
                        @change="handleEquipmentCategoryChange('edit')">
                        <el-option v-for="item in equipmentTypeData" :key="item.EquipTypeId" 
                            :label="item.EquipmentCategory" :value="item.EquipmentCategory" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('deviceSetting.productBindProcess.equipmentModel')" prop="EquipmentModel">
                    <el-select v-model="editForm.EquipmentModel" clearable
                        :placeholder="$t('deviceSetting.productBindProcess.selectEquipmentModel')"
                        @change="handleEquipmentModelChange('edit')">
                        <el-option v-for="item in filteredEditEquipmentModels" :key="item.EquipTypeId" 
                            :label="item.EquipmentModel" :value="item.EquipmentModel" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('deviceSetting.productBindProcess.processParameterName')" prop="ProcessParameterName">
                    <el-select v-model="editForm.ProcessParameterName" clearable
                        :placeholder="$t('deviceSetting.productBindProcess.selectProcessParameterName')">
                        <el-option v-for="item in filteredEditProcessParameters" :key="item.ParamNameId" 
                            :label="item.ProcessParameterName" :value="item.ProcessParameterName" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('deviceSetting.productBindProcess.standardValue')" prop="StandardValue">
                    <el-input-number v-model="editForm.StandardValue" :min="0" style="width: 100%"
                        :placeholder="$t('deviceSetting.productBindProcess.inputStandardValue')" />
                </el-form-item>
                <el-form-item :label="$t('deviceSetting.productBindProcess.lowerLimit')" prop="LowerLimit">
                    <el-input-number v-model="editForm.LowerLimit" :min="0"  style="width: 100%"
                        :placeholder="$t('deviceSetting.productBindProcess.inputLowerLimit')" />
                </el-form-item>
                <el-form-item :label="$t('deviceSetting.productBindProcess.upperLimit')" prop="UpperLimit">
                    <el-input-number v-model="editForm.UpperLimit" :min="0"  style="width: 100%"
                        :placeholder="$t('deviceSetting.productBindProcess.inputUpperLimit')" />
                </el-form-item>
                
                <el-form-item :label="$t('deviceSetting.productBindProcess.unit')" prop="Unit">
                    <el-input v-model="editForm.Unit"
                        :placeholder="$t('deviceSetting.productBindProcess.inputUnit')" clearable disabled />
                </el-form-item>
                <el-form-item :label="$t('deviceSetting.productBindProcess.productType')" prop="ProductType">
                   <el-input v-model="editForm.ProductType"
                        :placeholder="$t('deviceSetting.productBindProcess.inputProductType')" clearable />
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
  QueryProductProcessParameter,
  AddProductProcessParameter,
  UpdateProductProcessParameter,
  DeleteProductProcessParameter,
} from "@/api/baseData/DeviceSetting";
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
const processParameterData = ref<any[]>([]);
const equipmentLineBindingData = ref<any[]>([]);

const searchForm = reactive({
    EquipmentCategory: "",
});

const pageObj = reactive({
    currentPage: 1,
    pageSize: 50,
});

const addForm = reactive({
    ProdParamId: 0,
    LineBindId: 0,
    EquipmentCategory: "",
    EquipmentModel: "",
    ProcessParameterName: "",
    StandardValue: null,
    UpperLimit: null,
    LowerLimit: null,
    Unit: "",
    ProductType: "*",
});

const editForm = reactive({
    ProdParamId: 0,
    LineBindId: 0,
    EquipmentCategory: "",
    EquipmentModel: "",
    ProcessParameterName: "",
    StandardValue: null,
    UpperLimit: null,
    LowerLimit: null,
    Unit: "",
    ProductType: "*",
});

const addVisible = ref(false);
const editVisible = ref(false);
const addFormRef = ref();
const editFormRef = ref();

const formRules = reactive({
    EquipmentCategory: [
        {
            required: true,
            message: t("message.pleaseSelect") + t("deviceSetting.productBindProcess.equipmentCategory"),
            trigger: "change",
        },
    ],
    EquipmentModel: [
        {
            required: true,
            message: t("message.pleaseSelect") + t("deviceSetting.productBindProcess.equipmentModel"),
            trigger: "change",
        },
    ],
    ProcessParameterName: [
        {
            required: true,
            message: t("message.pleaseSelect") + t("deviceSetting.productBindProcess.processParameterName"),
            trigger: "change",
        },
    ],
    StandardValue: [
        {
            required: true,
            message: t("message.pleaseInput") + t("deviceSetting.productBindProcess.standardValue"),
            trigger: "blur",
        },
    ],
    UpperLimit: [
        {
            required: true,
            message: t("message.pleaseInput") + t("deviceSetting.productBindProcess.upperLimit"),
            trigger: "blur",
        },
    ],
    LowerLimit: [
        {
            required: true,
            message: t("message.pleaseInput") + t("deviceSetting.productBindProcess.lowerLimit"),
            trigger: "blur",
        },
    ],
    Unit: [
        {
            required: true,
            message: t("message.pleaseInput") + t("deviceSetting.productBindProcess.unit"),
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

const filteredEquipmentModels = computed(() => {
    if (!addForm.EquipmentCategory) return [];
    return equipmentTypeData.value.filter(e => e.EquipmentCategory === addForm.EquipmentCategory);
});

const filteredEditEquipmentModels = computed(() => {
    if (!editForm.EquipmentCategory) return [];
    return equipmentTypeData.value.filter(e => e.EquipmentCategory === editForm.EquipmentCategory);
});

const filteredProcessParameters = computed(() => {
    if (!addForm.EquipmentCategory) return [];
    return processParameterData.value.filter(e => e.EquipmentCategory === addForm.EquipmentCategory);
});

const filteredEditProcessParameters = computed(() => {
    if (!editForm.EquipmentCategory) return [];
    return processParameterData.value.filter(e => e.EquipmentCategory === editForm.EquipmentCategory);
});

const getEquipmentTypeData = () => {
    QueryEquipmentType({ EquipmentCategory: "" })
        .then((res: any) => {
            if (res.Success && res.Data) {
                equipmentTypeData.value = res.Data;
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

const getEquipmentLineBindingData = () => {
    QueryEquipmentLineBinding({ EquipmentCategory: "" })
        .then((res: any) => {
            if (res.Success && res.Data) {
                equipmentLineBindingData.value = res.Data;
            }
        });
};

const getData = () => {
    loading.value = true;
    const params = {
        EquipmentCategory: searchForm.EquipmentCategory || "",
    };
    QueryProductProcessParameter(params)
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
    form.ProcessParameterName = "";
    form.LineBindId = 0;
};

const handleEquipmentModelChange = (type: string) => {
    const form = type === 'add' ? addForm : editForm;
    const item = equipmentLineBindingData.value.find(
        e => e.EquipmentCategory === form.EquipmentCategory && e.EquipmentModel === form.EquipmentModel
    );
    if (item) {
        form.LineBindId = item.LineBindId;
    } else {
        form.LineBindId = 0;
    }
};

const handleProcessParameterChange = (type: string) => {
    
const form = type === 'add' ? addForm : editForm;
    const item = processParameterData.value.find(
        e => e.EquipmentCategory === form.EquipmentCategory && e.ProcessParameterName === form.ProcessParameterName
    );
    if (item) {
        form.Unit = item.Unit;
    } else {
        form.Unit = "";
    }
};

const openAdd = () => {
    getEquipmentTypeData();
    getProcessParameterData();
    getEquipmentLineBindingData();
    addForm.ProdParamId = 0;
    addForm.LineBindId = 0;
    addForm.EquipmentCategory = "";
    addForm.EquipmentModel = "";
    addForm.ProcessParameterName = "";
    addForm.StandardValue = null;
    addForm.UpperLimit = null;
    addForm.LowerLimit = null;
    addForm.Unit = "";
    addForm.ProductType = "*";
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
                LineBindId: addForm.LineBindId,
                EquipmentCategory: addForm.EquipmentCategory,
                EquipmentModel: addForm.EquipmentModel,
                ProcessParameterName: addForm.ProcessParameterName,
                StandardValue: addForm.StandardValue,
                UpperLimit: addForm.UpperLimit,
                LowerLimit: addForm.LowerLimit,
                Unit: addForm.Unit,
                ProductType: addForm.ProductType,
                Operator: userStore.getUserInfo || "",
            };
            AddProductProcessParameter(params)
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
    getProcessParameterData();
    getEquipmentLineBindingData();
    editForm.ProdParamId = row.ProdParamId;
    editForm.LineBindId = row.LineBindId;
    editForm.EquipmentCategory = row.EquipmentCategory;
    editForm.EquipmentModel = row.EquipmentModel;
    editForm.ProcessParameterName = row.ProcessParameterName;
    editForm.StandardValue = row.StandardValue;
    editForm.UpperLimit = row.UpperLimit;
    editForm.LowerLimit = row.LowerLimit;
    editForm.Unit = row.Unit;
    editForm.ProductType = row.ProductType || "*";
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
                ProdParamId: editForm.ProdParamId,
                LineBindId: editForm.LineBindId,
                EquipmentCategory: editForm.EquipmentCategory,
                EquipmentModel: editForm.EquipmentModel,
                ProcessParameterName: editForm.ProcessParameterName,
                StandardValue: editForm.StandardValue,
                UpperLimit: editForm.UpperLimit,
                LowerLimit: editForm.LowerLimit,
                Unit: editForm.Unit,
                ProductType: editForm.ProductType,
                Operator: userStore.getUserInfo || "",
            };
            UpdateProductProcessParameter(params)
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
        `${t("publicText.confirm")}${t("publicText.delete")}【${row.ProcessParameterName} - ${row.ProductType}】?`,
        t("publicText.tip"),
        {
            confirmButtonText: t("publicText.confirm"),
            cancelButtonText: t("publicText.cancel"),
            type: "warning",
        }
    )
        .then(() => {
            loading.value = true;
            DeleteProductProcessParameter({
                ProdParamId: row.ProdParamId,
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