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

        <!-- 新增弹窗 -->
        <el-dialog :title="t('publicText.add')" v-model="addDialogVisible" width="500px"
            :close-on-click-modal="false" @closed="handleAddDialogClosed">
            <el-form ref="addFormRef" :model="addForm" :rules="formRules" label-width="100px">
                <el-form-item :label="t('smtset.auxiliary.product')" prop="Product">
                    <el-select v-model="addForm.Product" filterable
                        :placeholder="t('smtset.auxiliary.selectPlaceholder')" style="width: 100%">
                        <el-option v-for="item in productOptions" :key="item" :label="item" :value="item" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="t('smtset.auxiliary.width')" prop="Width">
                    <el-input v-model="addForm.Width" :placeholder="t('smtset.auxiliary.widthPlaceholder')" />
                </el-form-item>
                <el-form-item :label="t('smtset.auxiliary.speed')" prop="Speed">
                    <el-input v-model="addForm.Speed" :placeholder="t('smtset.auxiliary.speedPlaceholder')" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="addDialogVisible = false">{{ t('publicText.cancel') }}</el-button>
                <el-button type="primary" @click="onAddSubmit" :loading="addSubmitLoading">
                    {{ t('publicText.confirm') }}
                </el-button>
            </template>
        </el-dialog>

        <!-- 修改弹窗 -->
        <el-dialog :title="t('smtset.auxiliary.editTitle')" v-model="editDialogVisible" width="500px"
            :close-on-click-modal="false" @closed="handleEditDialogClosed">
            <el-form ref="editFormRef" :model="editForm" :rules="formRules" label-width="100px">
                <el-form-item :label="t('smtset.auxiliary.product')" prop="Product">
                    <el-select v-model="editForm.Product" filterable disabled
                        :placeholder="t('smtset.auxiliary.selectPlaceholder')" style="width: 100%">
                        <el-option v-for="item in productOptions" :key="item" :label="item" :value="item" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="t('smtset.auxiliary.width')" prop="Width">
                    <el-input v-model="editForm.Width" :placeholder="t('smtset.auxiliary.widthPlaceholder')" />
                </el-form-item>
                <el-form-item :label="t('smtset.auxiliary.speed')" prop="Speed">
                    <el-input v-model="editForm.Speed" :placeholder="t('smtset.auxiliary.speedPlaceholder')" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="editDialogVisible = false">{{ t('publicText.cancel') }}</el-button>
                <el-button type="primary" @click="onEditSubmit" :loading="editSubmitLoading">
                    {{ t('publicText.confirm') }}
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { getProduct, insetProductData, queryProductQControl, insetConveyorWidth } from "@/api/smtSet/auxiliary";
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

// 新增弹窗
const addDialogVisible = ref(false);
const addSubmitLoading = ref(false);
const addFormRef = ref();
const addForm = reactive({
    Product: "",
    Width: "",
    Speed: "",
});

// 修改弹窗
const editDialogVisible = ref(false);
const editSubmitLoading = ref(false);
const editFormRef = ref();
const editForm = reactive({
    Product: "",
    Width: "",
    Speed: "",
});

const formRules = {
    Product: [
        { required: true, message: t('smtset.auxiliary.productRequired'), trigger: 'change' },
    ],
    Width: [
        { required: true, message: t('smtset.auxiliary.widthRequired'), trigger: 'blur' },
    ],
    Speed: [
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

// 重置新增表单
const resetAddForm = () => {
    addForm.Product = "";
    addForm.Width = "";
    addForm.Speed = "";
};

// 重置修改表单
const resetEditForm = () => {
    editForm.Product = "";
    editForm.Width = "";
    editForm.Speed = "";
};

// 打开新增
const openAdd = () => {
    resetAddForm();
    addDialogVisible.value = true;
};

// 编辑
const handleEdit = (row: any) => {
    editForm.Product = row.ProductName || "";
    editForm.Width = row.Width != null ? String(row.Width) : "";
    editForm.Speed = row.Speed != null ? String(row.Speed) : "";
    editDialogVisible.value = true;
};

// 新增提交 -> insetProductData {Product, Width(number), speed(lowercase, number), updatetime}
const onAddSubmit = () => {
    addFormRef.value?.validate((valid: boolean) => {
        if (!valid) return;
        addSubmitLoading.value = true;
        const payload = {
            Product: addForm.Product,
            Width: Number(addForm.Width) || 0,
            speed: Number(addForm.Speed) || 0,
            updatetime: new Date().toJSON(),
        };
        insetProductData(payload).then((res: any) => {
            if (res.Success) {
                ElMessage.success(t('smtset.auxiliary.setSuccess'));
                addDialogVisible.value = false;
                getData();
            } else {
                ElMessage.error(res.Message);
            }
        }).catch(() => {
            ElMessage.error(t('smtset.auxiliary.setError'));
        }).finally(() => {
            addSubmitLoading.value = false;
        });
    });
};

// 修改提交 -> insetConveyorWidth {Product, Width, Speed}
const onEditSubmit = () => {
    editFormRef.value?.validate((valid: boolean) => {
        if (!valid) return;
        editSubmitLoading.value = true;
        const payload = {
            Product: editForm.Product,
            Width: editForm.Width,
            Speed: editForm.Speed,
        };
        insetConveyorWidth(payload).then((res: any) => {
            if (res.Success) {
                ElMessage.success(t('smtset.auxiliary.setSuccess'));
                editDialogVisible.value = false;
                getData();
            } else {
                ElMessage.error(res.Message);
            }
        }).catch(() => {
            ElMessage.error(t('smtset.auxiliary.setError'));
        }).finally(() => {
            editSubmitLoading.value = false;
        });
    });
};

// 弹窗关闭后重置表单验证
const handleAddDialogClosed = () => {
    addFormRef.value?.resetFields();
    resetAddForm();
};
const handleEditDialogClosed = () => {
    editFormRef.value?.resetFields();
    resetEditForm();
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
