<template>
    <div class="p-2">
        <el-card :body-style="{ padding: '8px' }">
            <div class="mb-2 flex justify-between items-center">
                <el-button type="primary" @click="openAdd" size="small">{{ t('finishProduct.finishProdRule.add') }}</el-button>
                <div>
                    <el-input v-model="getForm.SearchModel.product_code"
                        :placeholder="t('finishProduct.finishProdRule.searchPlaceholder')" style="width: 350px"
                        @change="getData" clearable size="small">
                        <template #append>
                            <el-button icon="Search" @click="getData"></el-button>
                        </template>
                    </el-input>
                </div>
            </div>
           
                <el-table ref="tableRef" :data="tableData" border :height="tableHeight" style="width: 100%"
                    size="small">
                    <el-table-column :label="t('publicText.index')" width="55" align="center">
                        <template #default="scope">
                            <span>{{ scope.$index + 1 + (getForm.PageIndex - 1) * getForm.PageSize }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="product_name" :label="t('finishProduct.finishProdRule.productName')"
                        :min-width="getColumnWidth('product_name')">
                    </el-table-column>
                    <el-table-column prop="product_code" :label="t('finishProduct.finishProdRule.productCode')"
                        :min-width="getColumnWidth('product_code')">
                    </el-table-column>
                    <el-table-column prop="code_identifier" :label="t('finishProduct.finishProdRule.codeIdentifier')"
                        :min-width="getColumnWidth('code_identifier')">
                    </el-table-column>
                    <el-table-column prop="updater" :label="t('finishProduct.finishProdRule.updater')" width="150">
                    </el-table-column>
                    <el-table-column prop="create_time" :label="t('finishProduct.finishProdRule.createTime')"
                        width="170">
                    </el-table-column>

                    <el-table-column fixed="right" :label="t('publicText.operation')" width="120" align="center">
                        <template #default="scope">
                            <el-tooltip  effect="dark" :content=" t('publicText.edit')" placement="top-start">
                              <el-button type="primary" size="small" icon="Edit" @click="handleEdit(scope.row)"></el-button>
                            </el-tooltip>
                            <el-tooltip  effect="dark" :content=" t('publicText.delete')" placement="top-start">
                              <el-button type="danger" size="small" icon="Delete" @click="handleDelete(scope.row)"></el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
           
            <div class="block" style="margin-top: 8px">
                <el-pagination size="small" background @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :current-page="getForm.PageIndex"
                    :page-size="getForm.PageSize" :page-sizes="[5, 10, 20, 50, 100]"
                    layout="total,sizes, prev, pager, next" :total="total">
                </el-pagination>
            </div>
        </el-card>

        <el-dialog :title="t('finishProduct.finishProdRule.addTitle')" v-model="dialogVisible" width="500px"
            @close="addCancel()">
            <el-form :model="form" ref="formRef" label-width="auto">
                <el-form-item :label="t('finishProduct.finishProdRule.productName')" prop="product_name">
                    <el-input v-model="form.product_name" placeholder="" />
                </el-form-item>
                <el-form-item :label="t('finishProduct.finishProdRule.productCode')" prop="product_code">
                    <el-input v-model="form.product_code" placeholder="" />
                </el-form-item>
                <el-form-item :label="t('finishProduct.finishProdRule.codeIdentifier')" prop="code_identifier">
                    <el-input v-model="form.code_identifier" placeholder="" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addCancel()">{{ t('publicText.cancel') }}</el-button>
                    <el-button type="primary" @click="onSubmit()">{{ t('publicText.confirm') }}</el-button>
                </span>
            </template>
        </el-dialog>

        <el-dialog :title="t('finishProduct.finishProdRule.editTitle')" v-model="editVisible" width="500px"
            @close="editCancel()">
            <el-form :model="editForm" ref="editFormRef" label-width="auto">
                <el-form-item :label="t('finishProduct.finishProdRule.productName')" prop="product_name">
                    <el-input v-model="editForm.product_name" placeholder="" />
                </el-form-item>
                <el-form-item :label="t('finishProduct.finishProdRule.productCode')" prop="product_code">
                    <el-input v-model="editForm.product_code" placeholder="" />
                </el-form-item>
                <el-form-item :label="t('finishProduct.finishProdRule.codeIdentifier')" prop="code_identifier">
                    <el-input v-model="editForm.code_identifier" placeholder="" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editCancel()">{{ t('publicText.cancel') }}</el-button>
                    <el-button type="primary" @click="editSubmit()">{{ t('publicText.confirm') }}</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import {
    addProductCodeRules,
    findProductCodeRules,
    DeleteProductCodeRules,
    updateProductCodeRules,
} from "@/api/finishProduct/finishProdRule";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import { useI18n } from "vue-i18n";
import { ElMessage, ElMessageBox } from "element-plus";
import dayjs from "dayjs";
import { ref, reactive, onMounted, onBeforeMount, onUnmounted, nextTick } from "vue";

const { t } = useI18n();
const userStore = useUserStoreWithOut();

const tableRef = ref();
const formRef = ref();
const editFormRef = ref();

const dialogVisible = ref(false);
const editVisible = ref(false);
const tableData = ref<any[]>([]);
const tableHeight = ref(0);
const total = ref(0);

const form = reactive({
    product_name: "",
    product_code: "",
    code_identifier: "",
    creator: "",
    create_time: "",
});

const editForm = reactive({
    id: 0,
    product_name: "",
    product_code: "",
    code_identifier: "",
    status: 0,
    creator: "",
    create_time: "",
    updater: "",
    update_time: "",
    remark: "",
});

const getForm = reactive({
    PageIndex: 1,
    PageSize: 50,
    SearchText: "",
    SearchModel: {
        product_name: "",
        product_code: "",
        code_identifier: "",
        creator: "",
        create_time: "",
    },
    StartTime: "",
    EndTime: "",
});

const { getColumnWidth } = useTableColumnWidth(tableRef, tableData, {
    excludeLabels: [t("publicText.index"), t("publicText.operation")],
});

const getData = () => {
    findProductCodeRules(getForm).then((res: any) => {
        tableData.value = [];
        total.value = res.Data.Total;
        tableData.value = res.Data.list.map((item: any) => {
            return {
                ...item,
                create_time: dayjs(item.create_time).format("YYYY-MM-DD HH:mm:ss"),
                update_time: dayjs(item.update_time).format("YYYY-MM-DD HH:mm:ss"),
            };
        });
    });
};

const openAdd = () => {
    dialogVisible.value = true;
};

const addCancel = () => {
    formRef.value?.resetFields();
    dialogVisible.value = false;
};

const handleEdit = (row: any) => {
    Object.assign(editForm, { ...row });
    editVisible.value = true;
};

const handleDelete = (row: any) => {
    ElMessageBox.confirm(t('finishProduct.finishProdRule.deleteConfirm'), t('publicText.confirmOperation'), {
        confirmButtonText: t('publicText.confirm'),
        cancelButtonText: t('publicText.cancel'),
        type: "warning",
    })
        .then(() => {
            DeleteProductCodeRules([row.id]).then((res: any) => {
                if (res.Success) {
                    ElMessage.success(t('finishProduct.finishProdRule.deleteSuccess'));
                    getData();
                } else {
                    ElMessage.error(res.Msg);
                }
            });
        })
        .catch(() => {
            ElMessage.info(t('finishProduct.finishProdRule.deleteCancelled'));
        });
};

const onSubmit = () => {
    formRef.value?.validate((valid: boolean) => {
        if (valid) {
            form.creator = userStore.getUserInfo || "";
            form.create_time = dayjs().format("YYYY-MM-DD HH:mm:ss");
            addProductCodeRules({ ...form }).then((res: any) => {
                if (res.Success) {
                    ElMessage.success(t('finishProduct.finishProdRule.addSuccess'));
                    getData();
                    formRef.value?.resetFields();
                    dialogVisible.value = false;
                } else {
                    ElMessage.error(res.Msg);
                }
            });
        } else {
            ElMessageBox.alert(t('finishProduct.finishProdRule.completeRequired'), t('publicText.error'), {
                confirmButtonText: t('publicText.confirm'),
            });
        }
    });
};

const editCancel = () => {
    editForm.product_name = "";
    editForm.product_code = "";
    editForm.code_identifier = "";
    editFormRef.value?.resetFields();
    editVisible.value = false;
};

const editSubmit = () => {
    editFormRef.value?.validate((valid: boolean) => {
        if (valid) {
            editForm.updater = userStore.getUserInfo || "";
            editForm.update_time = dayjs().format("YYYY-MM-DD HH:mm:ss");
            updateProductCodeRules({ ...editForm }).then((res: any) => {
                if (res.Success) {
                    ElMessage.success(t('finishProduct.finishProdRule.updateSuccess'));
                    getData();
                    editFormRef.value?.resetFields();
                    editVisible.value = false;
                } else {
                    ElMessage.error(res.Msg);
                }
            });
        } else {
            ElMessageBox.alert(t('finishProduct.finishProdRule.completeRequired'), t('publicText.error'), {
                confirmButtonText: t('publicText.confirm'),
            });
        }
    });
};

const handleSizeChange = (value: number) => {
    getForm.PageSize = value;
    getData();
};

const handleCurrentChange = (val: number) => {
    getForm.PageIndex = val;
    getData();
};

const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 190;
    });
};

onBeforeMount(() => {
    getScreenHeight();
});

onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    getData();
});

onUnmounted(() => {
    window.removeEventListener("resize", getScreenHeight);
});
</script>

<style lang="scss" scoped></style>