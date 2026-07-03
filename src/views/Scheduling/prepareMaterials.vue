<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <!-- 搜索栏 -->
            <el-form ref="formRef" :inline="true" size="small" label-width="auto" @submit.native.prevent>
                <el-form-item :label="t('Scheduling.PrepareMaterials.WOGroup')" prop="WOGroup" class="mb-2">
                    <el-input v-model="getForm.WOGroup" placeholder="" clearable @clear="getData"
                        @keyup.enter.native="getData" style="width: 200px" />
                </el-form-item>
                <el-form-item class="mb-2">
                    <el-button :type="'primary'" @click="getData">{{ t('publicText.query') }}</el-button>
                    <el-button :type="'primary'" :disabled="selectList.length !== 1" @click="handleGenerateCall">
                        {{ t('Scheduling.PrepareMaterials.generateCall') }}
                    </el-button>
                    <el-button :type="'warning'" @click="addMaterial">{{ t('Scheduling.PrepareMaterials.StatusType2')
                    }}</el-button>
                </el-form-item>
            </el-form>

            <!-- 备料单列表 -->
            <el-table ref="tableMasterRef" :data="tableData" size="small" :style="{ width: '100%' }"
                :height="tableHeight" :tooltip-effect="'dark'" border fit @selection-change="handleSelectionChange"
                @row-click="fetchDetail" highlight-current-row>
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{
                            scope.$index + getForm.PageSize * (getForm.PageIndex - 1) + 1
                            }}</span>
                    </template>
                </el-table-column>
                 <el-table-column :label="t('Scheduling.PrepareMaterials.WOGroup')" fixed prop="WOGroup"
                    :min-width="getColumnWidth1('WOGroup')" />
                <el-table-column :label="t('Scheduling.PrepareMaterials.PreparationNo')" fixed
                    prop="MaterialPreparationNo" :min-width="getColumnWidth1('MaterialPreparationNo')" />
               
                <el-table-column :label="t('Scheduling.PrepareMaterials.Line')" prop="Line"
                    :min-width="getColumnWidth1('Line')" />
                <el-table-column :label="t('Scheduling.PrepareMaterials.BtWorkOrderTotalQty')"
                    prop="BtWorkOrderTotalQty" :min-width="getColumnWidth1('BtWorkOrderTotalQty')" />
                <el-table-column :label="t('Scheduling.PrepareMaterials.PlanStartTime')" prop="PlanStartTime"
                    :min-width="getColumnWidth1('PlanStartTime')" />
                <el-table-column :label="t('Scheduling.PrepareMaterials.PlanEndTime')" prop="PlanEndTime"
                    :min-width="getColumnWidth1('PlanEndTime')" />
                <template #empty>
                    <div class="flex items-center justify-center h-100%">
                        <el-empty />
                    </div>
                </template>
            </el-table>

            <!-- 分页 -->
            <div class="mt-2 mb-1">
                <el-pagination :size="'small'" background @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :pager-count="5" :current-page="getForm.PageIndex"
                    :page-size="getForm.PageSize" :page-sizes="[30, 50, 100, 200, 300]"
                    layout="total,sizes, prev, pager, next" :total="total">
                </el-pagination>
            </div>

            <!-- 备料单明细 -->
            <el-table :data="tableData2.slice(
                (pageObj.currentPage - 1) * pageObj.pageSize,
                pageObj.currentPage * pageObj.pageSize,
            )
                " size="small" :style="{ width: '100%' }" :height="tableHeight2" :tooltip-effect="'dark'" border fit
                ref="tableDetailRef">
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{
                            scope.$index + pageObj.pageSize * (pageObj.currentPage - 1) + 1
                        }}</span>
                    </template>
                </el-table-column>
              
                <el-table-column :label="t('Scheduling.PrepareMaterials.PN')" fixed prop="TeamOrder"
                    :min-width="getColumnWidth2('TeamOrder')" />
                <el-table-column :label="t('Scheduling.PrepareMaterials.BtWorkOrder')" prop="BtWorkOrder"
                    :min-width="getColumnWidth2('BtWorkOrder')" />
                 <el-table-column :label="t('Scheduling.PrepareMaterials.MesWorkOrder')" prop="MesWorkOrder"
                    :min-width="getColumnWidth2('MesWorkOrder')" />
                      <el-table-column :label="t('Scheduling.PrepareMaterials.ProductCode')" prop="ProductCode"
                    :min-width="getColumnWidth2('ProductCode')" />
                            <el-table-column :label="t('Scheduling.PrepareMaterials.Side')" prop="Side"
                    :min-width="getColumnWidth2('Side')" />
                     <el-table-column :label="t('Scheduling.PrepareMaterials.BomVersion')" prop="BomVersion"
                    :min-width="getColumnWidth2('BomVersion')" />
                        <el-table-column :label="t('Scheduling.PrepareMaterials.TeamOrderQty')" prop="TeamOrderQty"
                    :min-width="getColumnWidth2('TeamOrderQty')" />
                <el-table-column :label="t('Scheduling.PrepareMaterials.PlanStartTime')" prop="PlanStartTime"
                    :min-width="getColumnWidth2('PlanStartTime')" />
                <el-table-column :label="t('Scheduling.PrepareMaterials.PlanEndTime')" prop="PlanEndTime"
                    :min-width="getColumnWidth2('PlanEndTime')" />
                <template #empty>
                    <div class="flex items-center justify-center h-100%">
                        <el-empty />
                    </div>
                </template>
            </el-table>
            <div class="mt-2">
                <el-pagination :size="'small'" background @size-change="handleSizeChange1"
                    @current-change="handleCurrentChange1" :pager-count="5" :current-page="pageObj.currentPage"
                    :page-size="pageObj.pageSize" :page-sizes="[30, 50, 100, 200, 300]"
                    layout="total,sizes, prev, pager, next" :total="tableData2.length">
                </el-pagination>
            </div>
        </el-card>
        <el-dialog v-model="addVisible" :title="t('Scheduling.PrepareMaterials.AddSupplement')" width="400px">
            <el-form ref="addFormRef" :model="addForm" label-width="auto">
                <el-form-item :label="t('Scheduling.PrepareMaterials.WOGroup')" prop="WOGroup">
                    <el-input v-model="addForm.WOGroup" placeholder="" clearable />
                </el-form-item>
                <el-form-item :label="t('Scheduling.PrepareMaterials.MaterialPN')" prop="MaterialPN">
                    <el-input v-model="addForm.MaterialPN" placeholder="" clearable />
                </el-form-item>
                <el-form-item :label="t('Scheduling.PrepareMaterials.Qty')" prop="Qty">
                    <el-input v-model.number="addForm.Qty" placeholder="" clearable type="number" />
                </el-form-item>
                <el-form-item :label="t('Scheduling.PrepareMaterials.Reason')" prop="Reason">
                    <el-input v-model="addForm.Reason" placeholder="" clearable type="textarea" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addVisible = false">{{ t('publicText.cancel') }}</el-button>
                    <el-button type="primary" @click="submitAddForm">{{ t('publicText.confirm') }}</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { QueryMaterialPreparationList, QueryMaterialPreparationDetail, GenerateMaterialRequest, AddSupplementMaterialPreparation } from "@/api/Scheduling/index"
import { calculateColumnsWidth } from "@/utils/tableminWidth";
import {
    ref,
    reactive,
    watch,
    computed,
    nextTick,
    onMounted,
    onBeforeMount,
    onBeforeUnmount,
} from "vue";
import { ElNotification, ElMessage, ElMessageBox } from "element-plus";
import { useUserStoreWithOut } from "@/stores/modules/user";
const userStore = useUserStoreWithOut();
import { useI18n } from "vue-i18n";
const { t } = useI18n();

// ---------- 高度自适应 ----------
const tableHeight = ref(0);
const tableHeight2 = ref(0);



// ---------- 表格数据 ----------
const tableData = ref([]); // 备料单列表
const tableData2 = ref([
]); // 备料单明细
const total = ref(0);
const selectList = ref<any>([]);

const getForm = ref({
    PageIndex: 1,
    PageSize: 50,
    WOGroup: "", // 工单组筛选
});
const tableRef = ref()
const addVisible = ref(false)
const addForm = ref({
    WOGroup: "",
    MaterialPN: "",
    Qty: 0,
    Reason: ""
})
const addFormRef = ref()
const pageObj = reactive({
    currentPage: 1,
    pageSize: 50,
});
const tableMasterRef = ref()
const tableDetailRef = ref()
// ---------- 接口调用 ----------
const getData = () => {
    QueryMaterialPreparationList(getForm.value).then((res: any) => {
        if (res.Success) {
            total.value = res.Data.total;
            tableData.value = res.Data.rows;
        }
    });
};
const getStatusTagType = (status: number) => {
    switch (status) {
        case 0:
            return "info";
        case 1:
            return "warning";
        case 2:
            return "success";
        default:
            return "";
    }
};
const getStatusText = (status: number) => {
    switch (status) {
        case 0:
            return t('Scheduling.PrepareMaterials.Status0');
        case 1:
            return t('Scheduling.PrepareMaterials.Status1');
        case 2:
            return t('Scheduling.PrepareMaterials.Status2');
        default:
            return "";
    }
};
const getStatusTagType1 = (status: number) => {
    switch (status) {
        case 0:
            return "info";
        case 1:
            return "warning";
        default:
            return "";
    }
};
const getStatusText1 = (status: number) => {
    switch (status) {
        case 0:
            return t('Scheduling.PrepareMaterials.StatusType1');
        case 1:
            return t('Scheduling.PrepareMaterials.StatusType2');
        default:
            return "";
    }
};
// 获取备料单明细
const fetchDetail = (row: any) => {
    QueryMaterialPreparationDetail({ MaterialPreparationNo: row.MaterialPreparationNo }).then((res: any) => {
        if (res.Success) {
            tableData2.value = res.Data || [];
        }
    });
};

// 生成叫料单
const handleGenerateCall = () => {
    const selected = selectList.value[0];
    if (!selected) return;
    // 弹出原因输入框（可选）
    const params = {
        MaterialPreparationNo: selected.MaterialPreparationNo,
        CreateUser: userStore.getUserInfo,
        Reason: "",
    };
    // 调用 GenerateMaterialRequest 接口
    GenerateMaterialRequest(params).then((res: any) => {
        ElNotification({
            title: t('publicText.tipTitle'),
            message: res.Message,
            type: res.Success ? "success" : "error",
        });
        if (res.Success) getData();
    });


};

const addMaterial = () => {
    // addFormRef.value.resetFields()
    addVisible.value = true
}
const submitAddForm = () => {
    const params = {
        WOGroup: addForm.value.WOGroup,
        MaterialPN: addForm.value.MaterialPN,
        Qty: addForm.value.Qty,
        Reason: addForm.value.Reason,
        CreateUser: userStore.getUserInfo
    }
    AddSupplementMaterialPreparation(params).then((res: any) => {
        ElNotification({
            title: t('publicText.tip'),
            message: res.Message,
            type: res.Success ? "success" : "error",
        });
        if (res.Success) {
            addFormRef.value.resetFields()
            addVisible.value = false
            getData()
        }
    })
}

// ---------- 选择与分页事件 ----------
const handleSelectionChange = (val: any[]) => {
    selectList.value = val;
};

const handleSizeChange = (val: number) => {
    getForm.value.PageSize = val;
    getData();
};
const handleCurrentChange = (val: number) => {
    getForm.value.PageIndex = val;
    getData();
};
const handleSizeChange1 = (val: any) => {
    pageObj.pageSize = val;
};
const handleCurrentChange1 = (val: any) => {
    pageObj.currentPage = val;
};

// ---------- 列宽自动计算 ----------
const columnWidths1 = computed(() => {
    if (!tableMasterRef.value) return {};
    let columns: any = [];
    columns = tableMasterRef.value.columns
        .map((item: any) => {
            return {
                prop: item.property,
                label: item.label,
            };
        })
        .filter(
            (item: any) =>
                item.label !== t("publicText.index") &&
                item.label !== t("publicText.operation"),
        );
    return calculateColumnsWidth(columns, tableData.value, {
        padding: 25,
        fontSize: 13,
    });
});
const getColumnWidth1 = (prop: string) => {
    return columnWidths1.value[prop] || "auto";
};

const columnWidths2 = computed(() => {
    if (!tableDetailRef.value) return {};
    let columns: any = [];
    columns = tableDetailRef.value.columns
        .map((item: any) => {
            return {
                prop: item.property,
                label: item.label,
            };
        })
        .filter(
            (item: any) =>
                item.label !== t("publicText.index") &&
                item.label !== t("publicText.operation"),
        );
    return calculateColumnsWidth(columns, tableData2.value, {
        padding: 25,
        fontSize: 13,
    });
});
const getColumnWidth2 = (prop: string) => {
    return columnWidths2.value[prop] || "auto";
};
const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 500;
        tableHeight2.value = window.innerHeight - tableHeight.value - 215;
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

<style scoped>
.el-pagination {
    justify-content: center;
}
</style>