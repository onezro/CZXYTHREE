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
                        生成叫料单
                    </el-button>
                    <el-button :type="'warning'" @click="addMaterial">补料</el-button>
                </el-form-item>
            </el-form>

            <!-- 备料单列表 -->
            <el-table ref="tableMasterRef" :data="tableData" size="small" :style="{ width: '100%' }" :height="tableHeight"
                :tooltip-effect="'dark'" border fit @selection-change="handleSelectionChange" @row-click="fetchDetail"
                highlight-current-row>
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{
                            scope.$index + getForm.PageSize * (getForm.PageIndex - 1) + 1
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="t('Scheduling.PrepareMaterials.PreparationNo')" fixed
                    prop="MaterialPreparation_No" :min-width="getColumnWidth1('MaterialPreparation_No')" />
                <el-table-column :label="t('Scheduling.PrepareMaterials.WOGroup')" prop="MaterialPreparation_WOGroup"
                    :min-width="getColumnWidth1('MaterialPreparation_WOGroup')" />
                <el-table-column :label="t('Scheduling.PrepareMaterials.Type')" prop="MaterialPreparation_Type"
                    :min-width="getColumnWidth1('MaterialPreparation_Type')">
                    <!-- <template #default="{ row }">
                        <el-tag :type="getStatusTagType(row.MaterialPreparation_Type)" size="small">
                            {{ getStatusText(row.MaterialPreparation_Type) }}
                        </el-tag>
                    </template> -->
                </el-table-column>
                <el-table-column :label="t('Scheduling.PrepareMaterials.Status')" prop="MaterialPreparation_Status"
                    :min-width="getColumnWidth1('MaterialPreparation_Status')">
                    <template #default="{ row }">
                         <el-tag :type="getStatusTagType(row.MaterialPreparation_Status)" size="small">
                            {{ getStatusText(row.MaterialPreparation_Status) }}
                        </el-tag>
                        <!-- <el-tag :type="row.MaterialPreparation_Status === 1 ? 'success' : 'info'" size="small">
                            {{ row.MaterialPreparation_Status === 0 ? '准备叫料' : '已叫料' }}
                        </el-tag> -->
                    </template>
                </el-table-column>
                <el-table-column :label="t('Scheduling.PrepareMaterials.WorkOrderCount')"
                    prop="MaterialPreparation_WoList"
                    :min-width="getColumnWidth1('MaterialPreparation_WoList')" />
                <!-- <el-table-column :label="t('Scheduling.PrepareMaterials.TotalMaterialCount')"
                    prop="MaterialPreparation_WoList"
                    :min-width="getColumnWidth1('MaterialPreparation_TotalMaterialCount')" /> -->
                <el-table-column :label="t('Scheduling.PrepareMaterials.InsertUser')"
                    prop="MaterialPreparation_InsertUser"
                    :min-width="getColumnWidth1('MaterialPreparation_InsertUser')" />
                <el-table-column :label="t('Scheduling.PrepareMaterials.InsertDt')" prop="MaterialPreparation_InsertDt"
                    :min-width="getColumnWidth1('MaterialPreparation_InsertDt')" />
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
               " size="small" :style="{ width: '100%' }" :height="tableHeight2"
                :tooltip-effect="'dark'" border fit ref="tableDetailRef">
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50" >
                    <template #default="scope">
                        <span>{{
                            scope.$index + pageObj.pageSize * (pageObj.currentPage - 1) + 1
                            }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="t('Scheduling.PrepareMaterials.PN')" fixed prop="MaterialPreparationList_Pn"
                    :min-width="getColumnWidth2('MaterialPreparationList_Pn')" />
                <el-table-column :label="t('Scheduling.PrepareMaterials.PNName')" prop="MaterialPreparationList_PnName"
                    :min-width="getColumnWidth2('MaterialPreparationList_PnName')" />
                <!-- <el-table-column :label="t('Scheduling.PrepareMaterials.PNDesc')" prop="MaterialPreparationList_PnDesc"
                     :min-width="getColumnWidth2('MaterialPreparationList_PnDesc')" />  -->
                <el-table-column :label="t('Scheduling.PrepareMaterials.Qty')" prop="MaterialPreparationList_Qty"
                    :min-width="getColumnWidth2('MaterialPreparationList_Qty')" />
                <el-table-column :label="t('Scheduling.PrepareMaterials.LockNum1')" prop="MaterialPreparationList_LockNum1"
                    :min-width="getColumnWidth2('MaterialPreparationList_LockNum1')" />
                <el-table-column :label="t('Scheduling.PrepareMaterials.LockNum2')" prop="MaterialPreparationList_LockNum2"
                    :min-width="getColumnWidth2('MaterialPreparationList_LockNum2')" />
                <!-- <el-table-column :label="t('Scheduling.PrepareMaterials.IsOverIssuance')" prop="MaterialPreparationList_IsOverIssuance"
                    :min-width="getColumnWidth2('MaterialPreparationList_IsOverIssuance')">
                    <template #default="{ row }">
                        {{ row.MaterialPreparationList_IsOverIssuance === 1 ? '是' : '否' }}
                    </template>
                </el-table-column> -->
                <el-table-column :label="t('Scheduling.PrepareMaterials.IsDisabled')" prop="MaterialPreparationList_IsDisabled"
                    :min-width="getColumnWidth2('MaterialPreparationList_IsDisabled')">
                    <template #default="{ row }">
                        {{ row.MaterialPreparationList_IsDisabled === 1 ? '是' : '否' }}
                    </template>
                </el-table-column>
                <el-table-column :label="t('Scheduling.PrepareMaterials.LotNumber')" prop="MaterialPreparationList_LotNumber"
                    :min-width="getColumnWidth2('MaterialPreparationList_LotNumber')" />
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
            <el-form ref="addFormRef" :model="addForm" label-width="80px" size="small">
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
// 获取备料单明细
const fetchDetail = (row: any) => {
    QueryMaterialPreparationDetail({ MaterialPreparationNo: row.MaterialPreparation_No }).then((res: any) => {
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
    ElMessageBox.prompt("请输入补料原因（正常叫料可留空）", "生成叫料单", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputType: "textarea",
    }).then((val: any) => {
        // console.log(val);
        if (val.action == 'confirm') {
            const params = {
                MaterialPreparationNo: selected.MaterialPreparation_No,
                CreateUser: userStore.getUserInfo,
                Reason: val.value || "",
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
        }


    }).catch(() => { });
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