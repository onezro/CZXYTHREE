<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between">
                <el-form ref="formRef" :model="searchForm" label-width="auto" :inline="true" :size="'small'"
                    @submit.native.prevent>
                    <el-form-item :label="t('Scheduling.productCapacity.lineName')" prop="LineName" class="mb-2">
                        <el-select v-model="searchForm.LineName" clearable filterable @change="handleSearch"
                            style="width: 200px" :placeholder="t('Scheduling.productCapacity.selectLine')">
                            <el-option v-for="item in lineData" :key="item.MfgLineName" :label="item.MfgLineName"
                                :value="item.MfgLineName" />
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="t('Scheduling.productCapacity.productName')" prop="ProductName" class="mb-2">
                        <el-input v-model="searchForm.ProductName" clearable @clear="handleSearch"
                            @keyup.enter.native="handleSearch" style="width: 200px"
                            :placeholder="t('Scheduling.productCapacity.inputProductName')" />
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
                :tooltip-effect="'dark'" border fit highlight-current-row v-loading="loading">
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{
                            scope.$index + pageObj.pageSize * (pageObj.currentPage - 1) + 1
                            }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="ProductName" fixed :label="t('Scheduling.productCapacity.productName')"
                    min-width="150" />
                <el-table-column prop="LineName" :label="t('Scheduling.productCapacity.lineName')" min-width="150" />
                <el-table-column prop="TimeLong" :label="t('Scheduling.productCapacity.timeLong')" min-width="120"
                    align="center">
                    <template #default="{ row }">
                        {{ row.TimeLong }}
                    </template>
                </el-table-column>
                <el-table-column prop="Unit" :label="t('Scheduling.productCapacity.unit')" min-width="100"
                    align="center">

                </el-table-column>
                <el-table-column :label="$t('publicText.operation')" :fixed="'right'" width="130" align="center">
                    <template #default="{ row }">
                        <el-button size="small" type="primary" @click="openEdit(row)">
                            {{ $t("publicText.edit") }}
                        </el-button>
                        <el-button size="small" type="danger" @click="handleDelete(row)">
                            {{ $t("publicText.delete") }}
                        </el-button>
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

        <!-- 新增对话框 -->
        <el-dialog :title="t('publicText.add')" v-model="addVisible" width="500px" :close-on-click-modal="false"
            @closed="handleAddDialogClosed">
            <el-form ref="addFormRef" :model="addForm" :rules="formRules" label-width="auto">
                <el-form-item :label="t('Scheduling.productCapacity.lineName')" prop="LineName">
                    <el-select v-model="addForm.LineName" clearable filterable
                        :placeholder="t('Scheduling.productCapacity.selectLine')">
                        <el-option v-for="item in lineData" :key="item.MfgLineName" :label="item.MfgLineName"
                            :value="item.MfgLineName" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="t('Scheduling.productCapacity.productName')" prop="ProductName">
                    <el-input v-model="addForm.ProductName"
                        :placeholder="t('Scheduling.productCapacity.inputProductName')" clearable />
                </el-form-item>
                <el-form-item :label="t('Scheduling.productCapacity.timeLong')" prop="TimeLong">
                    <el-input-number v-model="addForm.TimeLong" :min="0" :precision="0"
                        :placeholder="t('Scheduling.productCapacity.inputTimeLong')" style="width: 100%">
                        <template #suffix>
                            <span class="text-sm text-[#006487]">S</span>
                        </template>
                    </el-input-number>
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

        <!-- 编辑对话框 -->
        <el-dialog :title="t('publicText.edit')" v-model="editVisible" width="500px" :close-on-click-modal="false"
            @closed="handleEditDialogClosed">
            <el-form ref="editFormRef" :model="editForm" :rules="formRules" label-width="auto">
                <el-form-item :label="t('Scheduling.productCapacity.lineName')" prop="LineName">
                    <el-input v-model="editForm.LineName" disabled />
                </el-form-item>
                <el-form-item :label="t('Scheduling.productCapacity.productName')" prop="ProductName">
                    <el-input v-model="editForm.ProductName" disabled />
                </el-form-item>
                <el-form-item :label="t('Scheduling.productCapacity.timeLong')" prop="TimeLong">
                    <el-input-number v-model="editForm.TimeLong" :min="0" :precision="0"
                        :placeholder="t('Scheduling.productCapacity.inputTimeLong')" style="width: 100%" >
                        <template #suffix>
                            <span class="text-sm text-[#006487]">S</span>
                        </template>
                    </el-input-number>
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
import { GetProductLineCapacity, InsertUpdateProductLineCapacity, DeleteProductLineCapacity } from "@/api/Scheduling/apsBaseApi"
import { GetMESWorkLineNews } from "@/api/Scheduling/lineCalendar"
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
import { useI18n } from "vue-i18n";

const userStore = useUserStoreWithOut();
const { t } = useI18n();

// 线体数据
const lineData = ref<any[]>([]);
const loading = ref(false);
const submitLoading = ref(false);
const tableHeight = ref(0);
const eltableRef = ref();
const tableData = ref<any[]>([]);
const total = ref(0);

// 查询表单
const searchForm = reactive({
    LineName: "",
    ProductName: "",
});

// 分页参数
const pageObj = reactive({
    currentPage: 1,
    pageSize: 50,
});

// 单位映射（仅展示用）
const unitOptions = ref([
    { label: t('Scheduling.lineChangeTime.second'), value: 's' },
    { label: t('Scheduling.lineChangeTime.minute'), value: 'min' },
    { label: t('Scheduling.lineChangeTime.hour'), value: 'h' },
]);

// 新增表单
const addForm = reactive({
    LineName: "",
    ProductName: "",
    TimeLong: undefined as number | undefined,
});

// 编辑表单
const editForm = reactive({
    LineName: "",
    ProductName: "",
    TimeLong: undefined as number | undefined,
});

const addVisible = ref(false);
const editVisible = ref(false);
const addFormRef = ref();
const editFormRef = ref();

// 表单验证规则
const formRules = reactive({
    LineName: [
        {
            required: true,
            message: t("message.pleaseSelect") + t("Scheduling.productCapacity.lineName"),
            trigger: "change",
        },
    ],
    ProductName: [
        {
            required: true,
            message: t("message.pleaseInput") + t("Scheduling.productCapacity.productName"),
            trigger: "blur",
        },
    ],
    TimeLong: [
        {
            required: true,
            message: t("message.pleaseInput") + t("Scheduling.productCapacity.timeLong"),
            trigger: "blur",
        },
        {
            type: "number",
            min: 0,
            message: t("Scheduling.productCapacity.timeLongValid"),
            trigger: "blur",
        },
    ],
});

// 获取线体列表
const getLineData = () => {
    GetMESWorkLineNews({ WorkLineName: "" }).then((res: any) => {
        if (res.Success) {
            lineData.value = res.Data || [];
        }
    });
};

// 获取单位显示文本
const getUnitLabel = (unit: string) => {
    const option = unitOptions.value.find(item => item.value === unit);
    return option ? option.label : unit;
};

// 获取数据（后端分页）
const getData = () => {
    loading.value = true;
    const params = {
        LineName: searchForm.LineName || "",
        ProductName: searchForm.ProductName || "",
        PageIndex: pageObj.currentPage,
        PageSize: pageObj.pageSize,
    };
    GetProductLineCapacity(params)
        .then((res: any) => {
            if (res.Success && res.Data) {
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
        .finally(() => {
            loading.value = false;
        });
};

// 搜索
const handleSearch = () => {
    pageObj.currentPage = 1;
    getData();
};

// 分页大小变化
const handleSizeChange = (val: number) => {
    pageObj.pageSize = val;
    pageObj.currentPage = 1;
    getData();
};

// 当前页变化
const handleCurrentChange = (val: number) => {
    pageObj.currentPage = val;
    getData();
};

// 打开新增对话框
const openAdd = () => {
    addForm.LineName = "";
    addForm.ProductName = "";
    addForm.TimeLong = undefined;
    addVisible.value = true;
};

// 新增对话框关闭回调
const handleAddDialogClosed = () => {
    addFormRef.value?.resetFields();
};

// 新增提交
const submitAdd = () => {
    addFormRef.value.validate((valid: boolean) => {
        if (valid) {
            // 检查线体+产品组合是否已存在
            const existItem = tableData.value.find(item =>
                item.LineName === addForm.LineName && item.ProductName === addForm.ProductName
            );
            if (existItem) {
                ElMessageBox.confirm(
                    t("Scheduling.productCapacity.productExistConfirm", {
                        lineName: addForm.LineName,
                        productName: addForm.ProductName
                    }),
                    t("publicText.tip"),
                    {
                        confirmButtonText: t("publicText.confirm"),
                        cancelButtonText: t("publicText.cancel"),
                        type: "warning",
                    }
                ).then(() => {
                    doSave();
                }).catch(() => { });
            } else {
                doSave();
            }
        }
    });
};

const doSave = () => {
    submitLoading.value = true;
    const params = {
        LineName: addForm.LineName,
        ProductName: addForm.ProductName,
        TimeLong: String(addForm.TimeLong),
        UserNo: userStore.getUserInfo || "",
    };
    InsertUpdateProductLineCapacity(params)
        .then((res: any) => {
            if (res.Success) {
                ElMessage.success(t("message.addSuccess"));
                addVisible.value = false;
                pageObj.currentPage = 1;
                getData();
                getLineData(); // 刷新线体列表（可选）
            } else {
                ElMessage.error(res.Message || t("message.addFailure"));
            }
        })
        .finally(() => {
            submitLoading.value = false;
        });
};

// 打开编辑对话框
const openEdit = (row: any) => {
    editForm.LineName = row.LineName;
    editForm.ProductName = row.ProductName;
    editForm.TimeLong = row.TimeLong;
    editVisible.value = true;
};

// 编辑对话框关闭回调
const handleEditDialogClosed = () => {
    editFormRef.value?.resetFields();
};

// 编辑提交
const submitEdit = () => {
    editFormRef.value.validate((valid: boolean) => {
        if (valid) {
            submitLoading.value = true;
            const params = {
                LineName: editForm.LineName,
                ProductName: editForm.ProductName,
                TimeLong: String(editForm.TimeLong),
                UserNo: userStore.getUserInfo || "",
            };
            InsertUpdateProductLineCapacity(params)
                .then((res: any) => {
                    if (res.Success) {
                        ElMessage.success(t("message.editSuccess"));
                        editVisible.value = false;
                        getData();
                        getLineData();
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

// 删除
const handleDelete = (row: any) => {
    ElMessageBox.confirm(
        `${t("publicText.confirm")}${t("publicText.delete")}【${row.LineName} - ${row.ProductName}】?`,
        t("publicText.tip"),
        {
            confirmButtonText: t("publicText.confirm"),
            cancelButtonText: t("publicText.cancel"),
            type: "warning",
        }
    )
        .then(() => {
            loading.value = true;
            DeleteProductLineCapacity({
                LineName: row.LineName,
                ProductName: row.ProductName,
                UserNo: userStore.getUserInfo || "",
            })
                .then((res: any) => {
                    if (res.Success) {
                        ElMessage.success(t("message.deleteSuccess"));
                        // 如果当前页只有一条数据且不是第一页，则跳转到上一页
                        if (tableData.value.length === 1 && pageObj.currentPage > 1) {
                            pageObj.currentPage--;
                        }
                        getData();
                        getLineData();
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

// 高度自适应
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
    getLineData();
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