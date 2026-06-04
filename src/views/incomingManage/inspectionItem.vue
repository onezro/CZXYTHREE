<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between">

                <el-form ref="formRef" :model="getForm" label-width="auto" :inline="true" :size="'small'"
                    @submit.native.prevent>
                    <el-form-item :label="t('incomingManage.inspectionItem.gaugeCode')" prop="gaugeCode" class="mb-2">
                        <el-input v-model="getForm.InspectionCode" placeholder="" clearable @clear="searchData"
                            @keyup.enter.native="searchData" style="width: 200px" />
                    </el-form-item>
                    <el-form-item class="mb-2">
                        <el-button :type="'primary'" @click="searchData">{{ t('publicText.query') }}</el-button>
                    </el-form-item>
                </el-form>
                <div>
                    <el-button type="warning" size="small" @click="openAdd">{{ t('publicText.add') }}</el-button>
                </div>
            </div>
            <el-table :data="tableData" size="small" :style="{ width: '100%' }" :height="tableHeight"
                :tooltip-effect="'dark'" border fit>
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{
                            scope.$index + getForm.PageSize * (getForm.PageIndex - 1) + 1
                            }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="t('incomingManage.inspectionItem.gaugeCode')" prop="InspectionCode"
                    :min-width="getColumnWidth1('InspectionCode')" />
                <el-table-column :label="t('incomingManage.inspectionItem.gaugeName')" prop="InspectionName"
                    :min-width="getColumnWidth1('InspectionName')" />
                <el-table-column :label="t('incomingManage.inspectionItem.creator')" prop="CreateUser"
                    :min-width="getColumnWidth1('CreateUser')" />
                <el-table-column :label="t('incomingManage.inspectionItem.creatime')" prop="CreateTime"
                    :min-width="getColumnWidth1('CreateTime')" />
                <el-table-column :label="t('incomingManage.inspectionItem.updator')" prop="UpdateUser"
                    :min-width="getColumnWidth1('UpdateUser')" />
                <el-table-column :label="t('incomingManage.inspectionItem.updatetime')" prop="UpdateTime"
                    :min-width="getColumnWidth1('UpdateTime')" />
                <el-table-column :label="$t('publicText.operation')" :fixed="'right'" width="160" :align="'center'">
                    <template #default="{ row }">
                        <el-tooltip :content="t('publicText.edit')" placement="top">
                            <el-button size="small" type="primary" icon="Edit" @click="handleEdit(row)"></el-button>
                        </el-tooltip>
                        <el-tooltip :content="t('publicText.delete')" placement="top">
                            <el-button size="small" type="danger" icon="Delete" @click="handleDelete(row)"></el-button>
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
                    @current-change="handleCurrentChange" :pager-count="5" :current-page="getForm.PageIndex"
                    :page-size="getForm.PageSize" :page-sizes="[30, 50, 100, 200, 300]"
                    layout="total,sizes, prev, pager, next" :total="total">
                </el-pagination>
            </div>
        </el-card>
        <el-dialog :title="$t('publicText.add')" v-model="addVisible" width="400px" @close="addCancel" :append-to-body="true" :close-on-click-modal="false"
            :close-on-press-escape="false">
            <el-form :model="addForm" ref="addFormRef" label-width="auto" :inline="false" :rules="rules">
                <el-form-item :label="t('incomingManage.inspectionItem.gaugeCode')" prop="InspectionCode">
                    <el-input v-model="addForm.InspectionCode" placeholder="" clearable style="width: 100%" />
                </el-form-item>
                <el-form-item :label="t('incomingManage.inspectionItem.gaugeName')" prop="InspectionName">
                    <el-input v-model="addForm.InspectionName" placeholder="" clearable style="width: 100%" />
                </el-form-item>
                <el-form-item :label="t('incomingManage.inspectionItem.isGauge')" prop="IsInspectionTool">
                    <el-select v-model="addForm.IsInspectionTool" placeholder="" style="width: 100%">
                        <el-option :label="t('publicText.yes')" :value="1"></el-option>
                        <el-option :label="t('publicText.no')" :value="0"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="addCancel">{{ $t("publicText.cancel") }}</el-button>
                <el-button type="primary" @click="addSubmit">{{
                    $t("publicText.confirm")
                    }}</el-button>
            </template>
        </el-dialog>
        <el-dialog :title="$t('publicText.edit')" v-model="editVisible" width="500px" @close="editCancel" :append-to-body="true" :close-on-click-modal="false"
            :close-on-press-escape="false">
            <el-form :model="editForm" ref="editFormRef" label-width="auto" :inline="false" :rules="rules">
                <el-form-item :label="t('incomingManage.inspectionItem.gaugeCode')" prop="InspectionCode">
                    <el-input v-model="editForm.InspectionCode" placeholder="" clearable style="width: 100%" />
                </el-form-item>
                <el-form-item :label="t('incomingManage.inspectionItem.gaugeName')" prop="InspectionName">
                    <el-input v-model="editForm.InspectionName" placeholder="" clearable style="width: 100%" />
                </el-form-item>
                <el-form-item :label="t('incomingManage.inspectionItem.isGauge')" prop="IsInspectionTool">
                    <el-select v-model="editForm.IsInspectionTool" placeholder="" style="width: 100%">
                        <el-option :label="t('publicText.yes')" :value="1"></el-option>
                        <el-option :label="t('publicText.no')" :value="0"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="editCancel">{{ $t("publicText.cancel") }}</el-button>
                <el-button type="primary" @click="editSubmit">{{
                    $t("publicText.confirm")
                    }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { RefreshInspectionItem, AddInspectionItem, DeleteInspectionItem, UpdateInspectionItem } from "@/api/incomingManage/index";
import { calculateColumnsWidth } from "@/utils/tableminWidth";
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
const userStore = useUserStoreWithOut();
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const tableHeight = ref(0);
const tableData = ref([]);
const total = ref(0);

const getForm = ref({
    PageIndex: 1,
    PageSize: 50,
    InspectionCode: "",
});
const addVisible = ref(false);
const editVisible = ref(false);
const addForm = ref({
    InspectionCode: "",
    InspectionName: "",
    IsInspectionTool: 1,
    CreateUser: userStore.getUserInfo
});
const editForm = ref({
    InspectionCode: "",
    InspectionName: "",
    IsInspectionTool: 1,
    CreateUser: userStore.getUserInfo
});
const addFormRef = ref();
const editFormRef = ref();
const rules = reactive({
    InspectionCode: [{ required: true, message: "请输入检验项编码", trigger: "blur" }],
    InspectionName: [{ required: true, message: "请输入检验项名称", trigger: "blur" }]
});
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
const searchData = () => {
    getForm.value.PageIndex = 1;
    getData();
};
const getData = () => {
    RefreshInspectionItem(getForm.value).then((res: any) => {
        total.value = res.Data.total;
        tableData.value = res.Data.rows
    });
};
const openAdd = () => {
    addVisible.value = true;
};
const handleEdit = (row: any) => {
    editForm.value = { ...row };
    editVisible.value = true;
    nextTick(() => {
        editFormRef.value?.clearValidate();
    });
};
const handleDelete = (row: any) => {
    ElMessageBox.confirm(t('publicText.confirm') + t("publicText.delete") + '?', t("publicText.confirm"), {
        confirmButtonText: t("publicText.confirm"),
        cancelButtonText: t("publicText.cancel"),
        type: "warning",
    })
        .then(() => {
            DeleteInspectionItem({ InspectionCode: row.InspectionCode }).then((res: any) => {
                if (res.Success) {
                    ElMessage({
                        type: "success",
                        message: res.Message,
                    });
                    getData();
                } else {
                    ElMessage({
                        type: "error",
                        message: res.Message,
                    });
                }
            });
        })
        .catch(() => {
            ElMessage({
                type: "info",
                message: t("publicText.cancel"),
            });
        });
};
const addCancel = () => {
    addVisible.value = false;
    addFormRef.value?.resetFields();
};
const addSubmit = () => {
    addFormRef.value.validate((valid: any) => {
        if (valid) {
            AddInspectionItem(addForm.value).then((res: any) => {
                if (res.Success) {
                    ElMessage({
                        type: "success",
                        message: res.Message,
                    });
                    addForm.value = {
                        InspectionCode: "",
                        InspectionName: "",
                        IsInspectionTool: 1,
                        CreateUser: userStore.getUserInfo
                    };
                    addVisible.value = false;
                    getData();
                } else {
                    ElMessage({
                        type: "error",
                        message: res.Message,
                    });
                }
            });
        }
    });
};
const editCancel = () => {
    editVisible.value = false;
    editFormRef.value?.resetFields();
};
const editSubmit = () => {
    editFormRef.value.validate((valid: any) => {
        if (valid) {
            const updateParams = {
                InspectionCode: editForm.value.InspectionCode,
                InspectionName: editForm.value.InspectionName,
                IsInspectionTool: editForm.value.IsInspectionTool,
                UpdateUser: userStore.getUserInfo
            };
            UpdateInspectionItem(updateParams).then((res: any) => {
                if (res.Success) {
                    ElMessage({
                        type: "success",
                        message: res.Message,
                    });
                    editVisible.value = false;
                    getData();
                } else {
                    ElMessage({
                        type: "error",
                        message: res.Message,
                    });
                }
            });
        }
    });
};
const handleSizeChange = (val: any) => {
    getForm.value.PageSize = val;
    getData();
};
const handleCurrentChange = (val: any) => {
    getForm.value.PageIndex = val;
    getData();
};
// ---------- 列宽自动计算 ----------
const columnWidths1 = computed(() => {
    const columns = [
        { label: t("incomingManage.inspectionItem.gaugeCode"), prop: "InspectionCode" },
        { label: t("incomingManage.inspectionItem.gaugeName"), prop: "InspectionName" },
        { label: t("incomingManage.inspectionItem.isGauge"), prop: "IsInspectionTool" },
        { label: t("incomingManage.inspectionItem.creator"), prop: "CreateUser" },
        { label: t("incomingManage.inspectionItem.creatime"), prop: "CreateTime" },
        { label: t("incomingManage.inspectionItem.updator"), prop: "UpdateUser" },
        { label: t("incomingManage.inspectionItem.updatetime"), prop: "UpdateTime" },
    ];
    return calculateColumnsWidth(columns, tableData.value, {
        padding: 25,
        fontSize: 13,
    });
});
const getColumnWidth1 = (prop: string) => {
    return columnWidths1.value[prop] || "auto";
};
const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 180;
    });
};
</script>
<style scoped>
.el-pagination {
    justify-content: center;
}
</style>
<style lang="scss" scoped></style>