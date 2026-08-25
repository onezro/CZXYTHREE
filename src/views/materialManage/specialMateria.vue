<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <el-form ref="formRef" :inline="true" size="small" label-width="auto" @submit.prevent>
                <el-form-item :label="t('materialManage.specialMateria.productCode')" prop="product_code" class="mb-2">
                    <el-input v-model="getForm.product_code" clearable @clear="searchData" @keyup.enter="searchData"
                        style="width: 180px" />
                </el-form-item>
                <el-form-item :label="t('materialManage.specialMateria.pn')" prop="pn" class="mb-2">
                    <el-input v-model="getForm.pn" clearable @clear="searchData" @keyup.enter="searchData"
                        style="width: 180px" />
                </el-form-item>
                <el-form-item :label="t('materialManage.specialMateria.batch')" prop="batch" class="mb-2">
                    <el-input v-model="getForm.batch" clearable @clear="searchData" @keyup.enter="searchData"
                        style="width: 180px" />
                </el-form-item>
                <el-form-item :label="t('materialManage.specialMateria.specialType')" prop="special_type" class="mb-2">
                    <el-select v-model="getForm.special_type" clearable @change="searchData" style="width: 150px">
                        <el-option label="Disable" value="Disable" />
                        <el-option label="Special" value="Special" />
                    </el-select>
                </el-form-item>
                <el-form-item class="mb-2">
                    <el-button type="primary" @click="searchData">{{ t('publicText.query') }}</el-button>
                </el-form-item>
                <el-form-item class="mb-2">
                    <el-button type="success" @click="openAdd">{{ t('publicText.add') }}</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="tableData" size="small" :style="{ width: '100%' }" :height="tableHeight"
                :tooltip-effect="'dark'" border fit ref="eltableRef"
                :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }">
                <el-table-column type="index" align="center" fixed :label="t('publicText.index')" width="55">
                    <template #default="scope">
                        <span>{{ scope.$index + getForm.PageSize * (getForm.PageIndex - 1) + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="t('materialManage.specialMateria.productCode')" prop="product_code"
                    :min-width="getColumnWidth('product_code')" show-overflow-tooltip />
                <el-table-column :label="t('materialManage.specialMateria.pn')" prop="pn"
                    :min-width="getColumnWidth('pn')" show-overflow-tooltip />
                <el-table-column :label="t('materialManage.specialMateria.batch')" prop="batch"
                    :min-width="getColumnWidth('batch')" />
                <el-table-column :label="t('materialManage.specialMateria.specialType')" prop="special_type"
                    :min-width="getColumnWidth('special_type')" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.special_type === 'Disable' ? 'danger' : 'warning'" size="small">
                            {{ row.special_type === 'Disable' ? t('materialManage.specialMateria.disable') : t('materialManage.specialMateria.special') }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column :label="t('materialManage.specialMateria.stts')" prop="stts"
                    :min-width="getColumnWidth('stts')" align="center" />
                <el-table-column :label="t('materialManage.specialMateria.remarks')" prop="remarks"
                    :min-width="getColumnWidth('remarks')" show-overflow-tooltip />
                <el-table-column :label="t('materialManage.specialMateria.crUser')" prop="cr_user"
                    :min-width="getColumnWidth('cr_user')" />
                <el-table-column :label="t('materialManage.specialMateria.crDt')" prop="cr_dt"
                    :min-width="getColumnWidth('cr_dt')" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ formatDate(row.cr_dt) }}
                    </template>
                </el-table-column>
                <el-table-column :label="t('materialManage.specialMateria.udUser')" prop="ud_user"
                    :min-width="getColumnWidth('ud_user')" />
                <el-table-column :label="t('materialManage.specialMateria.udDt')" prop="ud_dt"
                    :min-width="getColumnWidth('ud_dt')" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ formatDate(row.ud_dt) }}
                    </template>
                </el-table-column>
                <el-table-column :label="t('publicText.operation')" prop="operation" width="140" align="center" fixed="right">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" @click="openEdit(row)">{{ t('publicText.edit') }}</el-button>
                        <el-button type="danger" size="small" @click="handleDelete(row)">{{ t('publicText.delete') }}</el-button>
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
                    :page-size="getForm.PageSize" :page-sizes="[10, 20, 30, 50, 100]"
                    layout="total,sizes, prev, pager, next" :total="total">
                </el-pagination>
            </div>
        </el-card>

        <!-- 新增/编辑弹窗 -->
        <el-dialog :title="dialogTitle" v-model="dialogVisible" width="500px" align-center
            :close-on-click-modal="false">
            <el-form ref="dialogFormRef" :model="dialogForm" :rules="dialogRules" label-width="100px">
                <el-form-item :label="t('materialManage.specialMateria.productCode')" prop="product_code">
                    <el-input v-model="dialogForm.product_code"
                        :placeholder="t('materialManage.specialMateria.inputProductCode')" clearable />
                </el-form-item>
                <el-form-item :label="t('materialManage.specialMateria.pn')" prop="pn">
                    <el-input v-model="dialogForm.pn" :placeholder="t('materialManage.specialMateria.inputPn')"
                        clearable />
                </el-form-item>
                <el-form-item :label="t('materialManage.specialMateria.batch')" prop="batch">
                    <el-input v-model="dialogForm.batch" :placeholder="t('materialManage.specialMateria.inputBatch')"
                        clearable />
                </el-form-item>
                <el-form-item :label="t('materialManage.specialMateria.specialType')" prop="special_type">
                    <el-select v-model="dialogForm.special_type" style="width: 100%">
                        <el-option label="Disable" value="Disable" />
                        <el-option label="Special" value="Special" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="t('materialManage.specialMateria.remarks')" prop="remarks">
                    <el-input v-model="dialogForm.remarks" type="textarea" :rows="3"
                        :placeholder="t('materialManage.specialMateria.inputRemarks')" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">{{ t('publicText.cancel') }}</el-button>
                <el-button type="primary" :loading="dialogLoading" @click="submitDialog">{{ t('publicText.confirm') }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import {
    QuerySpecialMaterial,
    AddSpecialMaterial,
    UpdateSpecialMaterial,
    DeleteSpecialMaterial
} from "@/api/materialManage/index";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import { ref, reactive, nextTick, onMounted, onBeforeUnmount } from "vue";
import { ElNotification, ElMessageBox } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import { useUserStoreWithOut } from "@/stores/modules/user";
import dayjs from "dayjs";
import { useI18n } from "vue-i18n";

const userStore = useUserStoreWithOut();
const { t } = useI18n();
const eltableRef = ref();
const tableHeight = ref(0);
const tableData = ref<any[]>([]);
const total = ref(0);

const getForm = reactive({
    PageIndex: 1,
    PageSize: 20,
    product_code: "",
    pn: "",
    batch: "",
    special_type: "",
    stts: "",
});

const { getColumnWidth } = useTableColumnWidth(eltableRef, tableData, {
    excludeLabels: [t('publicText.index'), t('publicText.operation')]
});

const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr.startsWith("1900-01-01")) return "-";
    return dayjs(dateStr).format("YYYY-MM-DD HH:mm:ss");
};

const getData = () => {
    QuerySpecialMaterial(getForm).then((res: any) => {
        if (res.Success) {
            tableData.value = res.Data?.rows || [];
            total.value = res.Data?.total || 0;
        } else {
            tableData.value = [];
            total.value = 0;
        }
    }).catch(() => {
        tableData.value = [];
        total.value = 0;
    });
};

const searchData = () => {
    getForm.PageIndex = 1;
    getData();
};

const handleSizeChange = (val: number) => {
    getForm.PageSize = val;
    getData();
};

const handleCurrentChange = (val: number) => {
    getForm.PageIndex = val;
    getData();
};

// 弹窗相关
const dialogVisible = ref(false);
const dialogLoading = ref(false);
const dialogFormRef = ref<any>();
const isEdit = ref(false);
const dialogTitle = ref("");

const dialogForm = reactive({
    id: 0,
    product_code: "",
    pn: "",
    batch: "",
    special_type: "Disable",
    stts: "",
    remarks: "",
});

const dialogRules = reactive<any>({
    product_code: [{ required: true, message: t('materialManage.specialMateria.inputProductCode'), trigger: 'blur' }],
    pn: [{ required: true, message: t('materialManage.specialMateria.inputPn'), trigger: 'blur' }],
    special_type: [{ required: true, message: t('materialManage.specialMateria.specialType'), trigger: 'change' }],
});

const resetDialogForm = () => {
    dialogForm.id = 0;
    dialogForm.product_code = "";
    dialogForm.pn = "";
    dialogForm.batch = "";
    dialogForm.special_type = "Disable";
    dialogForm.stts = "";
    dialogForm.remarks = "";
};

const openAdd = () => {
    isEdit.value = false;
    dialogTitle.value = t('materialManage.specialMateria.addTitle');
    resetDialogForm();
    dialogVisible.value = true;
    nextTick(() => {
        dialogFormRef.value?.clearValidate();
    });
};

const openEdit = (row: any) => {
    isEdit.value = true;
    dialogTitle.value = t('materialManage.specialMateria.editTitle');
    dialogForm.id = row.ID;
    dialogForm.product_code = row.product_code;
    dialogForm.pn = row.pn;
    dialogForm.batch = row.batch;
    dialogForm.special_type = row.special_type;
    dialogForm.stts = row.stts || "";
    dialogForm.remarks = row.remarks || "";
    dialogVisible.value = true;
    nextTick(() => {
        dialogFormRef.value?.clearValidate();
    });
};

const submitDialog = async () => {
    if (!dialogFormRef.value) return;
    await dialogFormRef.value.validate((valid: any) => {
        if (!valid) return;
        dialogLoading.value = true;
        const params = {
            id: dialogForm.id,
            product_code: dialogForm.product_code,
            pn: dialogForm.pn,
            batch: dialogForm.batch,
            special_type: dialogForm.special_type,
            stts: dialogForm.stts,
            remarks: dialogForm.remarks,
            userno: userStore.getUserInfo,
        };
        const apiCall = isEdit.value ? UpdateSpecialMaterial(params) : AddSpecialMaterial(params);
        apiCall.then((res: any) => {
            ElNotification({
                title: t('publicText.tipTitle'),
                message: res.Success
                    ? (isEdit.value ? t('materialManage.specialMateria.editSuccess') : t('materialManage.specialMateria.addSuccess'))
                    : res.Message,
                type: res.Success ? "success" : "error",
            });
            if (res.Success) {
                dialogVisible.value = false;
                getData();
            }
        }).catch(() => { }).finally(() => {
            dialogLoading.value = false;
        });
    });
};

const handleDelete = (row: any) => {
    ElMessageBox.confirm(t('materialManage.specialMateria.deleteConfirm'), t('publicText.confirm'), {
        confirmButtonText: t('publicText.confirm'),
        cancelButtonText: t('publicText.cancel'),
        type: "warning",
    }).then(() => {
        const params = {
            id: row.ID,
            product_code: row.product_code,
            pn: row.pn,
            batch: row.batch,
            special_type: row.special_type,
            stts: row.stts,
            remarks: row.remarks,
            userno: userStore.getUserInfo,
        };
        DeleteSpecialMaterial(params).then((res: any) => {
            ElNotification({
                title: t('publicText.tipTitle'),
                message: res.Success ? t('materialManage.specialMateria.deleteSuccess') : res.Message,
                type: res.Success ? "success" : "error",
            });
            if (res.Success) getData();
        });
    }).catch(() => { });
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

<style scoped>
.el-pagination {
    justify-content: center;
}

.mt-2 {
    margin-top: 8px;
}
</style>
