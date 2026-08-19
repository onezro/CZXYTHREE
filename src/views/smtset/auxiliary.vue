<template>
    <div class="auxiliary p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="table_header flex justify-between items-center mb-2">
                <div>
                    <el-button type="primary" size="small" @click="openAdd">
                        {{ t('publicText.add') }}
                    </el-button>
                </div>
                <div class="input_box">
                    <el-input v-model="searchText" :placeholder="t('smtset.auxiliary.searchPlaceholder')"
                        clearable size="small" @keyup.enter="handleSearch" @clear="handleSearch">
                        <template #append>
                            <el-button icon="Search" @click="handleSearch" />
                        </template>
                    </el-input>
                </div>
            </div>

            <div class="table_container">
                <el-table ref="tableMasterRef" :data="tableData" :height="tableHeight" border size="small" style="width: 100%" stripe
                    highlight-current-row :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }">
                    <el-table-column :label="t('publicText.index')" width="55" align="center" type="index">
                        <template #default="{ $index }">
                            {{ $index + 1 + (currentPage - 1) * pageSize }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="ProductName" :label="t('smtset.auxiliary.product')" :min-width="getColumnWidth('ProductName')" />
                    <el-table-column prop="Width" :label="t('smtset.auxiliary.width')" :min-width="getColumnWidth('Width')" align="center" />
                    <el-table-column prop="Speed" :label="t('smtset.auxiliary.speed')" :min-width="getColumnWidth('Speed')" align="center" />
                    <el-table-column prop="UpdateTime" :label="t('smtset.auxiliary.updateTime')" :min-width="getColumnWidth('UpdateTime')">
                        <template #default="{ row }">
                            {{ formatDate(row.UpdateTime) }}
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" :label="t('publicText.operation')" width="100" align="center">
                        <template #default="{ row }">
                            <el-tooltip :content="t('publicText.edit')" placement="top">
                                <el-button type="primary" icon="Edit" size="small" @click="handleEdit(row)" />
                            </el-tooltip>
                        </template>
                    </el-table-column>

                    <template #empty>
                        <div class="flex items-center justify-center h-100%">
                            <el-empty />
                        </div>
                    </template>
                </el-table>

                <div class="block" style="margin-top: 8px">
                    <el-pagination background align="center" @size-change="handleSizeChange" :size="'small'"
                        @current-change="handleCurrentChange" :page-sizes="[10, 20, 50, 100]"
                        :current-page="currentPage" :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper" :total="total" />
                </div>
            </div>
        </el-card>

        <!-- 添加/编辑弹窗 -->
        <el-dialog :title="isEdit ? t('smtset.auxiliary.editTitle') : t('publicText.add')" v-model="dialogVisible" width="500px"
            :close-on-click-modal="false" @closed="handleDialogClosed">
            <el-form ref="formRef" :model="form" :rules="formRules" label-width="100px">
                <el-form-item :label="t('smtset.auxiliary.product')" prop="product">
                    <el-select v-model="form.product" :disabled="isEdit" filterable
                        :placeholder="t('smtset.auxiliary.selectPlaceholder')" style="width: 100%">
                        <el-option v-for="item in productOptions" :key="item" :label="item" :value="item" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="t('smtset.auxiliary.width')" prop="width">
                    <el-input v-model="form.width" :placeholder="t('smtset.auxiliary.widthPlaceholder')" />
                </el-form-item>
                <el-form-item :label="t('smtset.auxiliary.speed')" prop="speed">
                    <el-input v-model="form.speed" :placeholder="t('smtset.auxiliary.speedPlaceholder')" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">{{ t('publicText.cancel') }}</el-button>
                <el-button type="primary" @click="onSubmit" :loading="submitLoading">
                    {{ t('publicText.confirm') }}
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { getProduct, insetProductData, queryProductQControl } from "@/api/smtSet/auxiliary";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import { ref, reactive, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useTableColumnWidth } from '@/hooks/useTableColumnWidth';
import dayjs from 'dayjs';

const { t } = useI18n();

// ==================== 数据 ====================
const tableMasterRef = ref();
const tableHeight = ref(0);
const loading = ref(false);
const submitLoading = ref(false);
const tableData = ref<any[]>([]);
const searchText = ref("");
const total = ref(0);
const productOptions = ref<string[]>([]);

// 分页
const currentPage = ref(1);
const pageSize = ref(50);

// 动态列宽
const { getColumnWidth } = useTableColumnWidth(tableMasterRef, tableData, {
    excludeLabels: [t('publicText.index'), t('publicText.operation')]
});

// 弹窗
const dialogVisible = ref(false);
const isEdit = ref(false);
const formRef = ref();
const form = reactive({
    product: "",
    width: "",
    speed: "",
    updatetime: "",
});

const formRules = {
    product: [
        { required: true, message: t('smtset.auxiliary.productRequired'), trigger: 'change' },
    ],
    width: [
        { required: true, message: t('smtset.auxiliary.widthRequired'), trigger: 'blur' },
    ],
    speed: [
        { required: true, message: t('smtset.auxiliary.speedRequired'), trigger: 'blur' },
    ],
};

// ==================== 方法 ====================
const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === "1900-01-01T00:00:00") return "-";
    return dayjs(dateStr).format("YYYY-MM-DD HH:mm:ss");
};

// 获取数据（服务端分页）
const getData = () => {
    loading.value = true;
    queryProductQControl({
        Product: searchText.value || "",
        pageIndex: currentPage.value,
        pageSize: pageSize.value,
    }).then((res: any) => {
        if (res.Success) {
            tableData.value = res.Data?.list || [];
            total.value = res.Data?.Total || 0;
        } else {
            tableData.value = [];
            total.value = 0;
        }
    }).finally(() => {
        loading.value = false;
    });
};

// 获取产品名下拉
const getProductOptions = () => {
    getProduct({}).then((res: any) => {
        if (res.Success) {
            productOptions.value = res.Data || [];
        }
    });
};

// 搜索
const handleSearch = () => {
    currentPage.value = 1;
    getData();
};

// 分页
const handleSizeChange = (val: number) => {
    pageSize.value = val;
    currentPage.value = 1;
    getData();
};
const handleCurrentChange = (val: number) => {
    currentPage.value = val;
    getData();
};

// 重置表单
const resetForm = () => {
    form.product = "";
    form.width = "";
    form.speed = "";
};

// 打开新增
const openAdd = () => {
    isEdit.value = false;
    resetForm();
    dialogVisible.value = true;
};

// 编辑
const handleEdit = (row: any) => {
    isEdit.value = true;
    form.product = row.ProductName;
    form.width = row.Width != null ? String(row.Width) : "";
    form.speed = row.Speed != null ? String(row.Speed) : "";
    dialogVisible.value = true;
};

// 提交
const onSubmit = () => {
    formRef.value?.validate((valid: boolean) => {
        if (!valid) return;
        submitLoading.value = true;
        form.updatetime = new Date().toJSON();
        insetProductData(form).then((res: any) => {
            if (res.Success) {
                ElMessage.success(t('smtset.auxiliary.setSuccess'));
                dialogVisible.value = false;
                getData();
            } else {
                ElMessage.error(res.Message);
            }
        }).catch(() => {
            ElMessage.error(t('smtset.auxiliary.setError'));
        }).finally(() => {
            submitLoading.value = false;
        });
    });
};

// 弹窗关闭后重置表单验证
const handleDialogClosed = () => {
    formRef.value?.resetFields();
    resetForm();
};

// ==================== 表格高度自适应 ====================
const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 190;
    });
};

onMounted(() => {
    getScreenHeight();
    window.addEventListener('resize', getScreenHeight);
    getData();
    getProductOptions();
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', getScreenHeight);
});
</script>

<style scoped>
.el-pagination {
    justify-content: center;
}
</style>
