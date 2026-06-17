<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between items-center">
                <!-- 查询表单 -->
                <el-form ref="searchFormRef" :inline="true" :model="searchForm" label-width="auto" @submit.prevent>
                    <el-form-item :label="t('deviceManage.maintenanceStand.standardCode')" class="mb-2">
                        <el-input v-model="searchForm.standardCode"
                            :placeholder="t('deviceManage.maintenanceStand.standardCodePlaceholder')" clearable
                            style="width: 150px" size="small" />
                    </el-form-item>
                    <el-form-item :label="t('deviceManage.maintenanceStand.standardName')" class="mb-2">
                        <el-input v-model="searchForm.standardName"
                            :placeholder="t('deviceManage.maintenanceStand.standardNamePlaceholder')" clearable
                            style="width: 150px" size="small" />
                    </el-form-item>
                    <el-form-item class="mb-2">
                        <el-button type="primary" @click="handleSearch" :size="'small'">{{ t("publicText.query")
                            }}</el-button>
                        <el-button @click="resetSearch" :size="'small'">{{ t("publicText.reset") }}</el-button>
                    </el-form-item>
                </el-form>

                <div class="mb-2">
                    <el-button type="warning" @click="openAdd" :size="'small'">
                        {{ t("publicText.add") }}
                    </el-button>
                </div>
            </div>

            <el-table :data="paginatedData" ref="maintenanceStandTableRef" border :height="tableHeight"
                style="width: 100%" stripe size="small" highlight-current-row tooltip-effect="light"
                v-loading="loading">
                <el-table-column type="index" :label="t('publicText.index')" width="55" fixed="left" align="center">
                    <template #default="{ $index }">
                        {{ $index + 1 + (currentPage - 1) * pageSize }}
                    </template>
                </el-table-column>
                <el-table-column prop="standard_code" :label="t('deviceManage.maintenanceStand.standardCode')"
                    :min-width="getColumnWidth('standard_code')" />
                <el-table-column prop="standard_name" :label="t('deviceManage.maintenanceStand.standardName')"
                    :min-width="getColumnWidth('standard_name')" />
                <el-table-column prop="description" :label="t('deviceManage.maintenanceStand.description')"
                    :min-width="getColumnWidth('description')" />
                <el-table-column prop="cycle_type" :label="t('deviceManage.maintenanceStand.cycleType')"
                    :min-width="getColumnWidth('cycle_type')">
                    <template #default="{ row }">
                        {{ getCycleTypeText(row.cycle_type) }}
                    </template>
                </el-table-column>
                <el-table-column prop="cycle_interval" :label="t('deviceManage.maintenanceStand.cycleInterval')"
                    width="100" align="center" />
                <el-table-column prop="cycle_day_of_week" :label="t('deviceManage.maintenanceStand.cycleDayOfWeek')"
                    width="100" align="center" />
                <el-table-column prop="cycle_day_of_month" :label="t('deviceManage.maintenanceStand.cycleDayOfMonth')"
                    width="100" align="center" />
                <el-table-column prop="lead_time" :label="t('deviceManage.maintenanceStand.leadTime')" width="100"
                    align="center" />
                <el-table-column prop="status" :label="t('deviceManage.maintenanceStand.status')" width="80"
                    align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.status ? 'success' : 'danger'" size="small">
                            {{ row.status ? t("deviceManage.maintenanceStand.enable") :
                                t("deviceManage.maintenanceStand.disable") }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="create_by" :label="t('deviceManage.maintenanceStand.createBy')"
                    :min-width="getColumnWidth('create_by')" />
                <el-table-column prop="create_time" :label="t('deviceManage.maintenanceStand.createTime')"
                    :min-width="getColumnWidth('create_time')" />
                <el-table-column :label="$t('publicText.operation')" fixed="right" width="120" align="center">
                    <template #default="{ row }">
                        <el-button size="small" type="primary" @click="openEdit(row)" icon="Edit"></el-button>
                        <el-button size="small" type="danger" @click="handleDelete(row)" icon="Delete"></el-button>
                    </template>
                </el-table-column>
                <template #empty>
                    <div class="flex items-center justify-center h-100%">
                        <el-empty />
                    </div>
                </template>
            </el-table>

            <div style="margin-top: 8px">
                <el-pagination align="center" background :size="'small'" @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
                    :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next"
                    :total="filteredData.length" />
            </div>
        </el-card>

        <!-- 新增/编辑保养标准对话框 -->
        <el-dialog :title="dialogTitle" v-model="dialogVisible" width="800px" align-center :close-on-click-modal="false"
            @closed="handleDialogClosed">
            <el-form ref="formRef" :model="formData" :rules="formRules" label-width="130px" size="small">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('deviceManage.maintenanceStand.standardCode')" prop="standardCode">
                            <el-input v-model="formData.standardCode"
                                :placeholder="t('deviceManage.maintenanceStand.standardCodePlaceholder')"
                                :disabled="isEdit" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('deviceManage.maintenanceStand.standardName')" prop="standardName">
                            <el-input v-model="formData.standardName"
                                :placeholder="t('deviceManage.maintenanceStand.standardNamePlaceholder')" />
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12"> <el-form-item :label="t('deviceManage.maintenanceStand.description')"
                            prop="description">
                            <el-input v-model="formData.description" type="textarea" :rows="2"
                                :placeholder="t('deviceManage.maintenanceStand.descriptionPlaceholder')" />
                        </el-form-item></el-col>
                    <el-col :span="12"><el-form-item :label="t('deviceManage.maintenanceStand.cycleType')"
                            prop="cycleType">
                            <el-select v-model="formData.cycleType"
                                :placeholder="t('deviceManage.maintenanceStand.cycleTypePlaceholder')"
                                style="width: 100%">
                                <el-option label="日" value="D" />
                                <el-option label="周" value="W" />
                                <el-option label="月" value="M" />
                            </el-select>
                        </el-form-item></el-col>

                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('deviceManage.maintenanceStand.cycleInterval')" prop="cycleInterval">
                            <el-input-number v-model="formData.cycleInterval" :min="1" controls-position="right"
                                style="width: 100%" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('deviceManage.maintenanceStand.cycleDayOfWeek')" prop="cycleDayOfWeek"
                            v-if="formData.cycleType === 'W'">
                            <!-- <el-input-number v-model="formData.cycleDayOfWeek" :min="1" controls-position="right" style="width: 100%" /> -->
                            <el-select v-model="formData.cycleDayOfWeek"
                                :placeholder="t('deviceManage.maintenanceStand.cycleDayOfWeekPlaceholder')"
                                style="width: 100%">
                                <el-option label="星期一" :value="1" />
                                <el-option label="星期二" :value="2" />
                                <el-option label="星期三" :value="3" />
                                <el-option label="星期四" :value="4" />
                                <el-option label="星期五" :value="5" />
                                <el-option label="星期六" :value="6" />
                                <el-option label="星期日" :value="7" />
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="t('deviceManage.maintenanceStand.cycleDayOfMonth')" prop="cycleDayOfMonth"
                            v-if="formData.cycleType === 'M'">
                            <el-input-number v-model="formData.cycleDayOfMonth" :min="1" :max="31"
                                controls-position="right" style="width: 100%" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item :label="t('deviceManage.maintenanceStand.leadTime')" prop="leadTime">
                    <el-input-number v-model="formData.leadTime" :min="0" controls-position="right"
                        style="width: 100%" />
                </el-form-item>
                <el-form-item :label="t('deviceManage.maintenanceStand.status')" prop="status">
                    <el-switch v-model="formData.status" :active-value="true" :inactive-value="false"
                        :active-text="t('deviceManage.maintenanceStand.enable')"
                        :inactive-text="t('deviceManage.maintenanceStand.disable')" />
                </el-form-item>

                <!-- 关联保养项目区域 -->

                <div style="width: 100%">
                    <el-button type="primary" size="small" @click="openAddItemDialog" style="margin-bottom: 10px">
                        {{ t('deviceManage.maintenanceStand.addItem') }}
                    </el-button>
                    <el-table :data="formData.items" border size="small" style="width: 100%" height="300">
                        <el-table-column prop="item_code" :label="t('deviceManage.maintenance.itemCode')" width="120" />
                        <el-table-column prop="item_name" :label="t('deviceManage.maintenance.itemName')" width="150" />
                        <el-table-column prop="description" :label="t('deviceManage.maintenance.description')"
                            min-width="150" />
                        <el-table-column prop="sort_order" :label="t('deviceManage.maintenance.sortOrder')" width="100"
                            align="center">
                            <template #default="{ row }">
                                <el-input-number v-model="row.sort_order" :min="0" size="small"
                                    controls-position="right" style="width: 100%" />
                            </template>
                        </el-table-column>
                        <el-table-column prop="remark" :label="t('deviceManage.maintenanceStand.remark')"
                            min-width="150">
                            <template #default="{ row }">
                                <el-input v-model="row.remark" size="small"
                                    :placeholder="t('deviceManage.maintenanceStand.remarkPlaceholder')" />
                            </template>
                        </el-table-column>
                        <el-table-column :label="t('publicText.operation')" width="80" align="center">
                            <template #default="{ $index }">
                                <el-button size="small" type="danger" @click="removeItem($index)"
                                    icon="Delete"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div v-if="formData.items.length === 0" class="text-center text-gray-400 p-2 border rounded"
                        style="font-size: 12px">
                        {{ t('deviceManage.maintenanceStand.noItemsTip') }}
                    </div>
                </div>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">{{ t('publicText.cancel') }}</el-button>
                <el-button type="primary" @click="submitForm" :loading="submitLoading">{{ t('publicText.confirm')
                    }}</el-button>
            </template>
        </el-dialog>

        <!-- 添加保养项目对话框 -->
        <el-dialog :title="t('deviceManage.maintenanceStand.selectItem')" v-model="addItemDialogVisible" width="500px"
            align-center :close-on-click-modal="false">
            <el-form :model="newItemForm" label-width="100px" size="small">
                <el-form-item :label="t('deviceManage.maintenance.itemName')" required>
                    <el-select v-model="newItemForm.itemId"
                        :placeholder="t('deviceManage.maintenanceStand.selectItemPlaceholder')" filterable
                        style="width: 100%" @change="onItemSelect">
                        <el-option v-for="item in availableItems" :key="item.item_id"
                            :label="`${item.item_code} - ${item.item_name}`" :value="item.item_id" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="t('deviceManage.maintenance.sortOrder')">
                    <el-input-number v-model="newItemForm.sortOrder" :min="0" controls-position="right"
                        style="width: 100%" />
                </el-form-item>
                <el-form-item :label="t('deviceManage.maintenanceStand.remark')">
                    <el-input v-model="newItemForm.remark" type="textarea" :rows="2"
                        :placeholder="t('deviceManage.maintenanceStand.remarkPlaceholder')" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="addItemDialogVisible = false">{{ t('publicText.cancel') }}</el-button>
                <el-button type="primary" @click="confirmAddItem" :disabled="!newItemForm.itemId">{{
                    t('publicText.confirm') }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import {
    ref,
    reactive,
    computed,
    onBeforeMount,
    onMounted,
    onBeforeUnmount,
    nextTick,
} from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
import { useUserStoreWithOut } from "@/stores/modules/user";
import {
    GetAllMaintenanceStands,
    AddOrUpdateMaintenanceStands,
    DeleteMaintenanceStands,
    GetAllMaintenanceItems
} from "@/api/deviceManage/MaintenanceStand";
import { calculateColumnsWidth } from "@/utils/tableminWidth";

const { t } = useI18n();
const userStore = useUserStoreWithOut();

// 表格数据
const allData = ref<any[]>([]);
const allMaintenanceItems = ref<any[]>([]);
const loading = ref(false);
const submitLoading = ref(false);
const tableHeight = ref(0);
const maintenanceStandTableRef = ref();

// 前端分页与筛选
const searchForm = reactive({
    standardCode: "",
    standardName: "",
});
const currentPage = ref(1);
const pageSize = ref(20);

// 筛选后的数据
const filteredData = computed(() => {
    let data = [...allData.value];
    if (searchForm.standardCode) {
        data = data.filter(item => item.standard_code?.toLowerCase().includes(searchForm.standardCode.toLowerCase()));
    }
    if (searchForm.standardName) {
        data = data.filter(item => item.standard_name?.toLowerCase().includes(searchForm.standardName.toLowerCase()));
    }
    return data;
});

// 分页后的数据
const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return filteredData.value.slice(start, end);
});

// 新增/编辑对话框
const dialogVisible = ref(false);
const isEdit = ref(false);
const formRef = ref();
const formData = reactive({
    standardId: "",
    standardCode: "",
    standardName: "",
    description: "",
    cycleType: "Daily",
    cycleInterval: 1,
    cycleDayOfWeek: 1,
    cycleDayOfMonth: 1,
    leadTime: 0,
    status: true,
    items: [] as any[],
});

// 添加项目对话框
const addItemDialogVisible = ref(false);
const newItemForm = reactive({
    itemId: null as number | null,
    sortOrder: 0,
    remark: "",
});
const selectedItemDetail = ref<any>(null);

// 表单验证规则
const formRules = {
    standardCode: [{ required: true, message: t("message.pleaseInput") + t("deviceManage.maintenanceStand.standardCode"), trigger: "blur" }],
    standardName: [{ required: true, message: t("message.pleaseInput") + t("deviceManage.maintenanceStand.standardName"), trigger: "blur" }],
    cycleType: [{ required: true, message: t("message.pleaseSelect") + t("deviceManage.maintenanceStand.cycleType"), trigger: "change" }],
    cycleInterval: [{ type: 'number', required: true, message: t("message.pleaseInput") + t("deviceManage.maintenanceStand.cycleInterval"), trigger: "blur" }],
    leadTime: [{ type: 'number', required: true, message: t("message.pleaseInput") + t("deviceManage.maintenanceStand.leadTime"), trigger: "blur" }],
};

const dialogTitle = computed(() => isEdit.value ? t("publicText.edit") : t("publicText.add"));

// 可用项目（未被选中的）
const availableItems = computed(() => {
    const selectedIds = formData.items.map(item => item.item_id);
    return allMaintenanceItems.value.filter(item => !selectedIds.includes(item.item_id));
});

// 周期类型显示转换
const getCycleTypeText = (type: string) => {
    const typeMap: Record<string, string> = {
        'D': t('deviceManage.maintenanceStand.daily'),
        'W': t('deviceManage.maintenanceStand.weekly'),
        'M': t('deviceManage.maintenanceStand.monthly')
    };
    return typeMap[type] || type;
};

// 获取所有保养标准数据
const fetchAllData = async () => {
    loading.value = true;
    try {
        const res: any = await GetAllMaintenanceStands({});
        if (res.Success && Array.isArray(res.Data)) {
            allData.value = res.Data;
        } else {
            allData.value = [];
            ElMessage.warning(res.Message || t("message.queryFailure"));
        }
    } catch (error) {
        console.error("获取保养标准失败:", error);
        allData.value = [];
        ElMessage.error(t("message.queryFailure"));
    } finally {
        loading.value = false;
    }
};

// 获取所有保养项目（用于关联选择）
const fetchAllItems = async () => {
    try {
        const res: any = await GetAllMaintenanceItems({});
        if (res.Success && Array.isArray(res.Data)) {
            allMaintenanceItems.value = res.Data;
        }
    } catch (error) {
        console.error("获取保养项目失败:", error);
    }
};

// 搜索与重置
const handleSearch = () => {
    currentPage.value = 1;
};

const resetSearch = () => {
    searchForm.standardCode = "";
    searchForm.standardName = "";
    currentPage.value = 1;
};

// 前端分页
const handleSizeChange = (val: number) => {
    pageSize.value = val;
    currentPage.value = 1;
};

const handleCurrentChange = (val: number) => {
    currentPage.value = val;
};

// 新增
const openAdd = () => {
    isEdit.value = false;
    resetFormData();
    dialogVisible.value = true;
};

// 编辑
const openEdit = (row: any) => {
    isEdit.value = true;
    formData.standardId = row.standard_id;
    formData.standardCode = row.standard_code;
    formData.standardName = row.standard_name;
    formData.description = row.description || "";
    formData.cycleType = row.cycle_type || "Daily";
    formData.cycleInterval = row.cycle_interval ?? 1;
    formData.cycleDayOfWeek = row.cycle_day_of_week ?? 1;
    formData.cycleDayOfMonth = row.cycle_day_of_month ?? 1;
    formData.leadTime = row.lead_time ?? 0;
    formData.status = row.status ?? true;

    // 处理关联项目
    formData.items = (row.items || []).map((item: any) => ({
        item_id: item.item_id,
        item_code: item.item_code,
        item_name: item.item_name,
        description: item.description,
        sort_order: item.sort_order ?? 0,
        remark: item.remark || "",
    }));

    dialogVisible.value = true;
};

// 重置表单数据
const resetFormData = () => {
    formData.standardId = "";
    formData.standardCode = "";
    formData.standardName = "";
    formData.description = "";
    formData.cycleType = "Daily";
    formData.cycleInterval = 1;
    formData.cycleDayOfWeek = 1;
    formData.cycleDayOfMonth = 1;
    formData.leadTime = 0;
    formData.status = true;
    formData.items = [];
};

// 打开添加项目对话框
const openAddItemDialog = () => {
    newItemForm.itemId = null;
    newItemForm.sortOrder = 0;
    newItemForm.remark = "";
    selectedItemDetail.value = null;
    addItemDialogVisible.value = true;
};

// 项目选择变化
const onItemSelect = (itemId: number) => {
    const item = allMaintenanceItems.value.find(i => i.item_id === itemId);
    selectedItemDetail.value = item || null;
};

// 确认添加项目
const confirmAddItem = () => {
    if (!newItemForm.itemId) return;

    const item = allMaintenanceItems.value.find(i => i.item_id === newItemForm.itemId);
    if (item) {
        formData.items.push({
            item_id: item.item_id,
            item_code: item.item_code,
            item_name: item.item_name,
            description: item.description || "",
            sort_order: newItemForm.sortOrder,
            remark: newItemForm.remark,
        });
    }
    addItemDialogVisible.value = false;
};

// 移除项目
const removeItem = (index: number) => {
    formData.items.splice(index, 1);
};

// 提交表单（新增/编辑）
const submitForm = async () => {
    await formRef.value.validate();

    if (formData.items.length === 0) {
        ElMessage.warning(t("deviceManage.maintenanceStand.addItemFirst"));
        return;
    }

    submitLoading.value = true;
    try {
        const currentUser = userStore.getUserInfo || "System";
        const itemsParams = formData.items.map(item => ({
            item_id: item.item_id,
            sort_order: item.sort_order,
            remark: item.remark || "",
        }));

        const params: any = {
            user: currentUser,
            standard_code: formData.standardCode,
            standard_name: formData.standardName,
            description: formData.description,
            cycle_type: formData.cycleType,
            cycle_interval: formData.cycleInterval,
            cycle_day_of_week: formData.cycleDayOfWeek,
            cycle_day_of_month: formData.cycleDayOfMonth,
            lead_time: formData.leadTime,
            status: formData.status,
            Items: itemsParams,
        };

        if (isEdit.value && formData.standardId) {
            params.standard_id = formData.standardId;
        }

        const res: any = await AddOrUpdateMaintenanceStands(params);
        if (res.Success) {
            ElMessage.success(isEdit.value ? t("message.editSuccess") : t("message.addSuccess"));
            dialogVisible.value = false;
            await fetchAllData();
            currentPage.value = 1;
        } else {
            ElMessage.error(res?.Message || (isEdit.value ? t("message.editFailure") : t("message.addFailure")));
        }
    } catch (error) {
        console.error("提交失败:", error);
        ElMessage.error(t("message.submitFailure"));
    } finally {
        submitLoading.value = false;
    }
};

// 删除
const handleDelete = (row: any) => {
    ElMessageBox.confirm(
        `${t("publicText.confirm")}${t("publicText.delete")}【${row.standard_code} - ${row.standard_name}】?`,
        t("publicText.tip"),
        { confirmButtonText: t("publicText.confirm"), cancelButtonText: t("publicText.cancel"), type: "warning" }
    )
        .then(async () => {
            loading.value = true;
            try {
                const currentUser = userStore.getUserInfo || "System";
                const res: any = await DeleteMaintenanceStands({
                    user: currentUser,
                    StandIds: [row.standard_id],
                });
                if (res.Success) {
                    ElMessage.success(t("message.deleteSuccess"));
                    await fetchAllData();
                    if (paginatedData.value.length === 1 && currentPage.value > 1) {
                        currentPage.value--;
                    }
                } else {
                    ElMessage.error(res.Message || t("message.deleteFailure"));
                }
            } catch (error) {
                ElMessage.error(t("message.deleteFailure"));
            } finally {
                loading.value = false;
            }
        })
        .catch(() => ElMessage.info(t("publicText.cancel")));
};

const handleDialogClosed = () => {
    formRef.value?.resetFields();
    resetFormData();
};

// 表格列宽自动计算
const tableColumns = computed(() => {
    if (!maintenanceStandTableRef.value) return [];
    const columns = maintenanceStandTableRef.value.columns
        .map((item: any) => ({ prop: item.property, label: item.label }))
        .filter((item: any) => item.label !== t("publicText.index") && item.label !== t("publicText.operation"));
    return columns;
});

const columnWidths = computed(() => {
    return calculateColumnsWidth(tableColumns.value, paginatedData.value, { padding: 25, fontSize: 13 });
});

const getColumnWidth = (prop: string) => columnWidths.value[prop] || "auto";

// 表格高度自适应
const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 190;
    });
};

onBeforeMount(() => {
    getScreenHeight();
    fetchAllData();
    fetchAllItems();
});

onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
});

onBeforeUnmount(() => {
    window.removeEventListener("resize", getScreenHeight);
});
</script>

<style scoped>
.el-pagination {
    justify-content: center;
}
</style>