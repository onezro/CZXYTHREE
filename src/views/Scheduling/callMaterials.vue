<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <el-form ref="formRef" :inline="true" size="small" label-width="auto" @submit.native.prevent>
                <el-form-item :label="t('Scheduling.assist.productOrder')" prop="productOrder" class="mb-2">
                    <el-input v-model="getForm.KittingNo" placeholder="" clearable @clear="getData"
                        @keyup.enter.native="getData" style="width: 200px" />
                </el-form-item>
                <el-form-item class="mb-2">
                    <el-button :type="'primary'" @click="getData">查询</el-button>
                    <!-- <el-button :type="'warning'">叫料</el-button> -->
                        <el-button :type="'warning'" :disabled="selectList.length !== 1" @click="handleCallMaterial">
                        {{ t('Scheduling.CallMaterials.call') }}
                    </el-button>
                </el-form-item>
            </el-form>
            <el-table :data="tableData" size="small" :style="{ width: '100%' }" :height="tableHeight"
                :tooltip-effect="'dark'" border fit ref="eltableRef"  @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{
                            scope.$index + getForm.PageSize * (getForm.PageIndex - 1) + 1
                            }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="t('Scheduling.CallMaterials.CallOrder')" fixed prop="MaterialRequest_No"
                    :min-width="getColumnWidth1('MaterialRequest_No')" />
                <el-table-column :label="t('Scheduling.ProductSched.MesOrder')" prop="MaterialRequest_Wo"
                    :min-width="getColumnWidth1('MaterialRequest_Wo')" />

                <el-table-column :label="t('Scheduling.CallMaterials.GroupOrder')" fixed prop="MaterialRequest_WoGroup"
                    :min-width="getColumnWidth1('MaterialRequest_WoGroup')" />

                <el-table-column :label="t('Scheduling.ERPDocument.Status')" prop="MaterialRequest_Status"
                    :min-width="getColumnWidth1('MaterialRequest_Status')">

                    <template #default="{ row }">
                        <el-tag type="info" v-if="row.MaterialRequest_Status === 0">{{
                            t('Scheduling.CallMaterials.StatusPending') }}</el-tag>
                        <el-tag type="warning" v-else-if="row.MaterialRequest_Status === 1">{{
                            t('Scheduling.CallMaterials.StatusIssuing') }}</el-tag>
                        <el-tag type="success" v-else-if="row.MaterialRequest_Status === 2">{{
                            t('Scheduling.CallMaterials.StatusCompleted') }}</el-tag>
                        <el-tag type="danger" v-else-if="row.MaterialRequest_Status === 3">{{
                            t('Scheduling.CallMaterials.StatusCancelled') }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column :label="t('Scheduling.ERPDocument.Creator')" prop="MaterialRequest_InsertUser"
                    :min-width="getColumnWidth1('MaterialRequest_InsertUser')" />
                <el-table-column :label="t('publicText.operation')" prop="operation" width="130" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" @click="fetchDetail(row)">{{
                            $t('Scheduling.CallMaterials.Detail') }}</el-button>
                        <!-- <el-button type="warning" size="small" @click="handleChangeStatus(row)">{{
                            $t('Scheduling.CallMaterials.changeStatus') }}</el-button> -->
                        <el-button type="danger" size="small" @click="handleCancel(row)">{{
                            $t('Scheduling.CallMaterials.Cancel') }}</el-button>
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

        <!-- 详情弹窗 -->
        <el-dialog :title="t('Scheduling.CallMaterials.Detail')" v-model="detailVisible" width="80%" align-center
            @close="closeDetail">
            <el-table :data="detailData.list" size="small" border fit style="width: 100%" height="250">
                <el-table-column prop="MaterialRequestList_No" :label="t('Scheduling.CallMaterials.CallOrder')"
                    min-width="120" />
                <el-table-column prop="MaterialRequestList_PN" :label="t('Scheduling.CallMaterials.PN')"
                    min-width="120" />
                <el-table-column prop="MaterialRequestList_Qty" :label="t('Scheduling.CallMaterials.RequiredQty')"
                    min-width="100" />
                <el-table-column prop="MaterialRequestList_ActiveQty" :label="t('Scheduling.CallMaterials.ActiveQty')"
                    min-width="120" />
                <el-table-column prop="MaterialRequestList_LotNumber" :label="t('Scheduling.CallMaterials.LotNumber')"
                    min-width="120" />
            </el-table>
            <el-table :data="detailData.detail" size="small" border fit style="width: 100%" height="300">
                <el-table-column prop="MaterialRequestDetail_No" :label="t('Scheduling.CallMaterials.CallOrder')"
                    min-width="120" />
                <el-table-column prop="MaterialRequestDetail_ReelId" :label="t('Scheduling.CallMaterials.ReelId')"
                    min-width="120" />
                <el-table-column prop="MaterialRequestDetail_PN" :label="t('Scheduling.CallMaterials.PN')"
                    min-width="120" />
                <el-table-column prop="MaterialRequestDetail_Qty" :label="t('Scheduling.CallMaterials.Qty')"
                    min-width="100" />
                <el-table-column prop="MaterialRequestDetail_CellId" :label="t('Scheduling.CallMaterials.CellId')"
                    min-width="100" />
                <el-table-column prop="MaterialRequestDetail_IsMesCell" :label="t('Scheduling.CallMaterials.IsMesCell')"
                    min-width="100">
                    <template #default="{ row }">
                        {{ row.MaterialRequestDetail_IsMesCell === 1 ? t('Scheduling.CallMaterials.FangCang') :
                            t('Scheduling.CallMaterials.SaiYi') }}
                    </template>
                </el-table-column>
                <el-table-column prop="MaterialRequestDetail_Lotnumber" :label="t('Scheduling.CallMaterials.LotNumber')"
                    min-width="120" />
            </el-table>
            <template #footer>
                <el-button @click="detailVisible = false">{{ $t("publicText.close") }}</el-button>
            </template>
        </el-dialog>

        <!-- 修改状态弹窗 -->
        <el-dialog :title="t('Scheduling.CallMaterials.changeStatus')" v-model="statusDialogVisible" width="30%"
            @close="closeStatusDialog">
            <el-form :model="statusForm" label-width="auto">
                <el-form-item :label="t('Scheduling.CallMaterials.changeStatus')" required>
                    <el-select v-model="statusForm.Status" clearable>
                        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="statusDialogVisible = false">{{ $t("publicText.cancel") }}</el-button>
                <el-button type="primary" @click="submitStatusChange" :loading="statusLoading">
                    {{ $t("publicText.confirm") }}
                </el-button>
            </template>
        </el-dialog>

        <!-- 原未使用的dialog保留，避免影响其他逻辑 -->
        <el-dialog :title="$t('publicText.add')" v-model="addVisible" width="80%" @close="addCancel">
            <el-form :model="addForm" ref="addFormRef" label-width="auto" :inline="false"></el-form>
            <template #footer>
                <el-button @click="addCancel">{{ $t("publicText.cancel") }}</el-button>
                <el-button type="primary" @click="addSubmit">{{ $t("publicText.confirm") }}</el-button>
            </template>
        </el-dialog>
        <el-dialog :title="$t('publicText.edit')" v-model="editVisible" width="80%" @close="editCancel">
            <el-form :model="editForm" ref="editFormRef" label-width="auto" :inline="false"></el-form>
            <template #footer>
                <el-button @click="editCancel">{{ $t("publicText.cancel") }}</el-button>
                <el-button type="primary" @click="editSubmit">{{ $t("publicText.confirm") }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import {
    QueryMaterialRequestList,
    QueryMaterialRequestDetail,
    CancelMaterialRequest,
    UpdateMaterialRequestStatus,
    ManualSubmitSaiYiMaterialRequest
} from "@/api/Scheduling/index"
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
const tableHeight = ref(0);
const tableData = ref([]); // 备料单列表
const total = ref(0);
const selectList = ref<any>([]);

const getForm = ref({
    PageIndex: 1,
    PageSize: 50,
    KittingNo: '',
})

// 详情弹窗相关
const detailVisible = ref(false);
const detailLoading = ref(false);
const detailData = reactive({
    list: [],
    detail: []
});

// 状态修改弹窗相关
const statusDialogVisible = ref(false);
const statusLoading = ref(false);
const currentRow = ref<any>(null);
const statusForm = reactive({
    Status: null as number | null
});
const statusOptions = [
    // { value: 0, label: t('Scheduling.CallMaterials.StatusPending') },    // 待发料
    { value: 1, label: t('Scheduling.CallMaterials.StatusIssuing') },    // 发料中
    { value: 2, label: t('Scheduling.CallMaterials.StatusCompleted') },  // 发料完成
    { value: 3, label: t('Scheduling.CallMaterials.StatusCancelled') }    // 已取消
];

const addVisible = ref(false)
const editVisible = ref(false)
const addForm = ref({})
const editForm = ref({})
const eltableRef = ref()
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

const getData = () => {
    QueryMaterialRequestList(getForm.value).then((res: any) => {
        if (res.Success) {
            tableData.value = res.Data.rows
            total.value = res.Data.total
        }
    })
}

// 完善详情功能：弹窗展示两个表格
const fetchDetail = (row: any) => {
    detailVisible.value = true;
    // 重置数据
    detailData.list = [];
    detailData.detail = [];

    QueryMaterialRequestDetail({ MaterialRequestNo: row.MaterialRequest_No }).then((res: any) => {
        if (res.Success) {
            detailData.list = res.Data.List || [];
            detailData.detail = res.Data.Detail || [];
        } else {
            ElNotification({
                title: t('publicText.tipTitle'),
                message: res.Message || t('Scheduling.CallMaterials.FetchDetailFailed'),
                type: "error",
            });
        }
    }).catch((err) => {
        ElNotification({
            title: t('publicText.tipTitle'),
            message: err.message || t('Scheduling.CallMaterials.FetchDetailFailed'),
            type: "error",
        });
    })
}

const closeDetail = () => {
    detailVisible.value = false;
    detailData.list = [];
    detailData.detail = [];
}

// 完善状态修改功能
const handleChangeStatus = (row: any) => {
    currentRow.value = row;
    statusForm.Status = null;
    statusDialogVisible.value = true;
}

const closeStatusDialog = () => {
    statusDialogVisible.value = false;
    currentRow.value = null;
    statusForm.Status = null;
}

const submitStatusChange = () => {
    if (statusForm.Status === null || statusForm.Status === undefined) {
        ElMessage.warning(t('Scheduling.CallMessages.SelectStatusWarning'));
        return;
    }

    statusLoading.value = true;
    const params = {
        MaterialRequestNo: currentRow.value.MaterialRequest_No,
        Status: statusForm.Status,
        CreateUser: userStore.getUserInfo,  // 根据实际接口需要，可选
    };

    UpdateMaterialRequestStatus(params).then((res: any) => {
        ElNotification({
            title: t('publicText.tipTitle'),
            message: res.Message,
            type: res.Success ? "success" : "error",
        });
        if (res.Success) {
            statusDialogVisible.value = false;
            getData();  // 刷新列表
        }
    }).catch((err) => {
        ElNotification({
            title: t('publicText.tipTitle'),
            message: err.message || t('Scheduling.CallMessages.UpdateStatusFailed'),
            type: "error",
        });
    }).finally(() => {
        statusLoading.value = false;
    });
}

const handleCancel = (row: any) => {
    ElMessageBox.prompt(t('Scheduling.CallMaterials.CancelReason'), t('publicText.confirm'), {
        confirmButtonText: t('publicText.confirm'),
        cancelButtonText: t('publicText.cancel'),
        inputType: "textarea",
    }).then((val: any) => {
        if (val.action == 'confirm') {
            const params = {
                MaterialRequestNo: row.MaterialRequest_No,
                CreateUser: userStore.getUserInfo,
                CancelReason: val.value || "",
            };
            CancelMaterialRequest(params).then((res: any) => {
                ElNotification({
                    title: t('publicText.tipTitle'),
                    message: res.Message,
                    type: res.Success ? "success" : "error",
                });
                if (res.Success) getData();
            });
        }
    }).catch(() => { });
}

const addCancel = () => { addVisible.value = false }
const addSubmit = () => { }
const editCancel = () => { editVisible.value = false }
const editSubmit = () => { }

const handleCallMaterial = () => {
    const selected = selectList.value[0];
    if (!selected) return;

    if (selected.MaterialRequest_RequestInfo !== 1) {
        ElMessage.warning(t('Scheduling.CallMaterials.onlySaiYi'));
        return;
    }

    const params = {
        MaterialRequestNo: selected.MaterialRequest_No,
        OpUser: userStore.getUserInfo
    };

    ManualSubmitSaiYiMaterialRequest(params).then((res: any) => {
        ElNotification({
            title: t('publicText.tipTitle'),
            message: res.Message,
            type: res.Success ? "success" : "error",
        });
        if (res.Success) getData();
    });
}
const handleSelectionChange = (val: any[]) => {
    selectList.value = val;
};
const handleSizeChange = (val: any) => {
    getForm.value.PageSize = val
    getData()
};
const handleCurrentChange = (val: any) => {
    getForm.value.PageIndex = val
    getData()
};

const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 180;
    });
};

const columnWidths1 = computed(() => {
    if (!eltableRef.value) return {};
    let columns: any = [];
    columns = eltableRef.value.columns
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
</script>

<style scoped>
.el-pagination {
    justify-content: center;
}

.detail-section {
    margin-bottom: 20px;
}

.mt-4 {
    margin-top: 16px;
}
</style>