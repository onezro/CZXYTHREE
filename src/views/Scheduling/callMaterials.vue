<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <el-form ref="formRef" :inline="true" size="small" label-width="auto" @submit.prevent>
                <el-form-item :label="t('Scheduling.PrepareMaterials.MaterialPreparationNo')" prop="KittingNo" class="mb-2">
                    <el-input v-model="getForm.KittingNo" :placeholder="t('Scheduling.CallMaterials.inputKittingNo')" clearable
                        @clear="searchData" @keyup.enter="searchData" style="width: 200px" />
                </el-form-item>
                <el-form-item :label="t('Scheduling.CallMaterials.GroupOrder')" prop="WOGroup" class="mb-2">
                    <el-input v-model="getForm.WOGroup" :placeholder="t('Scheduling.CallMaterials.inputGroupOrder')" clearable
                        @clear="searchData" @keyup.enter="searchData" style="width: 200px" />
                </el-form-item>
                <el-form-item class="mb-2">
                    <el-button type="primary" @click="searchData">{{ t('publicText.query') }}</el-button>
                </el-form-item>
                <el-form-item class="mb-2">
                    <el-button type="warning" icon="Bell" :disabled="!canCall" :loading="btnLoading.call"
                        @click="handleCall">{{ t('Scheduling.CallMaterials.call') }}</el-button>
                    <el-button type="success" icon="Promotion" :disabled="!canPush" :loading="btnLoading.push"
                        @click="handlePush">{{ t('Scheduling.CallMaterials.pushShelter') }}</el-button>
                    <el-button type="info" icon="Close" :disabled="!canCancelShelter" :loading="btnLoading.cancelShelter"
                        @click="handleCancelShelter">{{ t('Scheduling.CallMaterials.cancelShelter') }}</el-button>
                    <el-button type="danger" icon="DocumentDelete" :disabled="!canCancel" :loading="btnLoading.cancel"
                        @click="handleCancel">{{ t('Scheduling.CallMaterials.Cancel') }}</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="tableData" size="small" :style="{ width: '100%' }" :height="tableHeight"
                :tooltip-effect="'dark'" border fit ref="eltableRef" :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }">
                <el-table-column width="45" align="center" fixed>
                    <template #default="{ row }">
                        <el-radio v-model="selectedNo" :value="row.MaterialRequest_No"
                            :disabled="row.MaterialRequest_Status === 3"><span /></el-radio>
                    </template>
                </el-table-column>
                <el-table-column type="index" align="center" fixed :label="t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{ scope.$index + getForm.PageSize * (getForm.PageIndex - 1) + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="t('Scheduling.CallMaterials.CallOrder')" fixed prop="MaterialRequest_No"
                    :min-width="getColumnWidth('MaterialRequest_No')" show-overflow-tooltip>
                    <template #default="{ row }">
                        <span :class="{ 'call-order-link': row.MaterialRequest_Status !== 3 }"
                            @click="handleCallOrderClick(row)">
                            {{ row.MaterialRequest_No }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column :label="t('Scheduling.PrepareMaterials.MaterialPreparationNo')" fixed
                    prop="MaterialRequest_KittingNo" :min-width="getColumnWidth('MaterialRequest_KittingNo')" show-overflow-tooltip />
                <el-table-column :label="t('Scheduling.CallMaterials.GroupOrder')" fixed prop="MaterialRequest_WoGroup"
                    :min-width="getColumnWidth('MaterialRequest_WoGroup')" show-overflow-tooltip />
                <el-table-column :label="t('Scheduling.CallMaterials.RequestType')" prop="MaterialRequest_Type"
                    width="100" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.MaterialRequest_Type === 0 ? 'primary' : 'warning'" size="small">
                            {{ row.MaterialRequest_Type === 0 ? t('Scheduling.CallMaterials.TypeNormal') : t('Scheduling.CallMaterials.TypeSupplement') }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column :label="t('Scheduling.CallMaterials.IsFirst')" prop="IsFirst"
                    :min-width="getColumnWidth('IsFirst')" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.IsFirst === true ? 'info' : 'success'" size="small" effect="dark">
                            {{ row.IsFirst === true ? t('Scheduling.CallMaterials.NotFirstSet') : t('Scheduling.CallMaterials.FirstSet') }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column :label="t('Scheduling.CallMaterials.RequestInfo')" prop="RequestInfo"
                    :min-width="getColumnWidth('RequestInfo')" align="center">
                    <template #default="{ row }">
                        <el-tag :type="getRequestInfoType(row.RequestInfo)" :effect="row.RequestInfo === 0 ? 'dark' : 'plain'"  size="small">
                            {{ getRequestInfoText(row.RequestInfo) }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column :label="t('Scheduling.ERPDocument.Status')" prop="MaterialRequest_Status"
                    :min-width="100" align="center">
                    <template #default="{ row }">
                        <el-tag :type="getStatusType(row.MaterialRequest_Status)" size="small">
                            {{ getStatusText(row.MaterialRequest_Status) }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column :label="t('Scheduling.CallMaterials.InsertUser')" prop="MaterialRequest_InsertUser"
                    :min-width="getColumnWidth('MaterialRequest_InsertUser')" />
                <el-table-column :label="t('Scheduling.CallMaterials.InsertDt')" prop="MaterialRequest_InsertDt"
                    width="160" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ formatDate(row.MaterialRequest_InsertDt) }}
                    </template>
                </el-table-column>
                <el-table-column :label="t('Scheduling.CallMaterials.UpdateUser')" prop="MaterialRequest_UpdateUser"
                    :min-width="getColumnWidth('MaterialRequest_UpdateUser')" />
                <el-table-column :label="t('Scheduling.CallMaterials.UpdateDt')" prop="MaterialRequest_UpdateDt"
                   width="160" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ formatDate(row.MaterialRequest_UpdateDt) }}
                    </template>
                </el-table-column>
                <el-table-column :label="t('Scheduling.CallMaterials.Reason')" prop="Reason"
                    :min-width="getColumnWidth('Reason')" show-overflow-tooltip />
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
        <el-dialog :title="t('Scheduling.CallMaterials.ListTitle')" v-model="detailVisible" width="90%" align-center
            @close="closeDetail" :close-on-click-modal="false">
            <!-- <div class="mb-2 font-bold">{{ t('Scheduling.CallMaterials.ListTitle')t('Scheduling.CallMaterials.Detail') }}</div> -->
            <el-table :data="detailData.list" size="small" border fit style="width: 100%" height="250"
                ref="detailListRef" :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }">
               
                <el-table-column fixed prop="MaterialRequestList_No" :label="t('Scheduling.CallMaterials.CallOrder')"
                    :min-width="getListColumnWidth('MaterialRequestList_No')" show-overflow-tooltip />
                <el-table-column prop="MaterialRequestList_WO" :label="t('Scheduling.CallMaterials.WorkOrder')"
                    :min-width="getListColumnWidth('MaterialRequestList_WO')" show-overflow-tooltip />
                <el-table-column prop="MaterialRequestList_PN" :label="t('Scheduling.CallMaterials.PN')"
                    :min-width="getListColumnWidth('MaterialRequestList_PN')" show-overflow-tooltip />
                <el-table-column prop="name" :label="t('Scheduling.CallMaterials.PNName')"
                    :min-width="getListColumnWidth('name')" show-overflow-tooltip />
                <el-table-column prop="pn_spec" :label="t('Scheduling.CallMaterials.PNDesc')"
                    :min-width="200" show-overflow-tooltip />
                <el-table-column prop="MaterialRequestList_Qty" :label="t('Scheduling.CallMaterials.RequiredQty')"
                    :min-width="getListColumnWidth('MaterialRequestList_Qty')" align="right" />
                <el-table-column prop="MaterialRequestList_ActiveQty" :label="t('Scheduling.CallMaterials.ActiveQty')"
                    :min-width="getListColumnWidth('MaterialRequestList_ActiveQty')" align="right" />
                <el-table-column fixed="right" :label="t('Scheduling.CallMaterials.Result')" :min-width="getListColumnWidth('MaterialRequestList_Result')" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.MaterialRequestList_ActiveQty >= row.MaterialRequestList_Qty ? 'success' : 'danger'" size="small">
                            {{ row.MaterialRequestList_ActiveQty >= row.MaterialRequestList_Qty ? t('Scheduling.CallMaterials.Satisfied') : t('Scheduling.CallMaterials.NotSatisfied') }}
                        </el-tag>
                    </template>
                </el-table-column>
                <!-- <el-table-column :label="t('Scheduling.CallMaterials.IsDisabled')" :min-width="getListColumnWidth('MaterialRequestList_IsDisabled')" align="center">
                    <template #default="{ row }">
                        <el-tag :type="getIsDisabledType(row.MaterialRequestList_IsDisabled)" size="small">
                            {{ getIsDisabledText(row.MaterialRequestList_IsDisabled) }}
                        </el-tag>
                    </template>
                </el-table-column> -->
                <!-- <el-table-column :label="t('Scheduling.CallMaterials.IsOverShoot')" :min-width="getListColumnWidth('MaterialRequestList_isOverShoot')" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.MaterialRequestList_isOverShoot === 1 ? 'danger' : 'info'" size="small">
                            {{ row.MaterialRequestList_isOverShoot === 1 ? t('publicText.yes') : t('publicText.no') }}
                        </el-tag>
                    </template>
                </el-table-column> -->
            </el-table>
            <div class="mt-2 text-sm flex justify-end items-center">
                {{ t('Scheduling.CallMaterials.Statistics') }}：
                {{ t('Scheduling.CallMaterials.TotalRows') }} {{ listStatistics.total }} {{ t('Scheduling.CallMaterials.Rows') }}，
                <el-tag type="success" size="small" effect="plain">{{ t('Scheduling.CallMaterials.Satisfied') }} {{ listStatistics.satisfied }} {{ t('Scheduling.CallMaterials.Rows') }}</el-tag>，
                <el-tag type="danger" size="small" effect="plain">{{ t('Scheduling.CallMaterials.NotSatisfied') }} {{ listStatistics.notSatisfied }} {{ t('Scheduling.CallMaterials.Rows') }}</el-tag>
            </div>
            <div class="mt-1 mb-1 font-bold">{{ t('Scheduling.CallMaterials.DetailTitle') }}</div>
            <el-table :data="pagedDetailData" size="small" border fit style="width: 100%" height="270"
                 ref="detailDetailRef">
                 <el-table-column type="index" align="center" fixed :label="t('publicText.index')" width="50">
                </el-table-column>
                <!-- <el-table-column prop="MaterialRequestDetail_No" :label="t('Scheduling.CallMaterials.CallOrder')"
                    :min-width="getDetailColumnWidth('MaterialRequestDetail_No')" show-overflow-tooltip /> -->
                 
                <el-table-column prop="MaterialRequestDetail_ReelId" :label="t('Scheduling.CallMaterials.ReelId')"
                    :min-width="getDetailColumnWidth('MaterialRequestDetail_ReelId')" show-overflow-tooltip />
                <!-- <el-table-column prop="MaterialRequestDetail_Wo" :label="t('Scheduling.CallMaterials.WorkOrder')"
                    :min-width="getDetailColumnWidth('MaterialRequestDetail_Wo')" show-overflow-tooltip /> -->
                   <el-table-column prop="MaterialRequestDetail_PN" :label="t('Scheduling.CallMaterials.PN')"
                    :min-width="getDetailColumnWidth('MaterialRequestDetail_PN')" show-overflow-tooltip />
                    <el-table-column prop="MaterialRequestDetail_Lotnumber" :label="t('Scheduling.CallMaterials.LotNumber')"
                    :min-width="getDetailColumnWidth('MaterialRequestDetail_Lotnumber')" show-overflow-tooltip />
                <el-table-column prop="MaterialRequestDetail_Qty" :label="t('Scheduling.CallMaterials.Qty')"
                    :min-width="getDetailColumnWidth('MaterialRequestDetail_Qty')" align="right" />
                <!-- <el-table-column prop="MaterialRequestDetail_CellId" :label="t('Scheduling.CallMaterials.CellId')"
                    :min-width="getDetailColumnWidth('MaterialRequestDetail_CellId')" show-overflow-tooltip /> -->
                
                <el-table-column :label="t('Scheduling.CallMaterials.IsMesCell')" :min-width="getDetailColumnWidth('MaterialRequestDetail_IsMesCell')" align="center">
                    <template #default="{ row }">
                        <el-tag :type="getRequestInfoType(row.MaterialRequestDetail_IsMesCell)" size="small">
                            {{ getRequestInfoText(row.MaterialRequestDetail_IsMesCell) }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column :label="t('Scheduling.CallMaterials.SyncMES')" :min-width="getDetailColumnWidth('MaterialRequestDetail_SyncMES')" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.MaterialRequestDetail_SyncMES === 1 ? 'success' : 'info'" size="small">
                            {{ row.MaterialRequestDetail_SyncMES === 1 ? t('Scheduling.CallMaterials.Synced') : t('Scheduling.CallMaterials.NotSynced') }}
                        </el-tag>
                    </template>
                </el-table-column>
            </el-table>
            <div class="mt-2">
                <el-pagination :size="'small'" background @size-change="handleDetailSizeChange"
                    @current-change="handleDetailCurrentChange" :current-page="detailPage.PageIndex"
                    :page-size="detailPage.PageSize" :page-sizes="[50, 100, 200, 300]"
                    layout="total,sizes, prev, pager, next" :total="detailTotal">
                </el-pagination>
            </div>
            <template #footer>
                <el-button @click="detailVisible = false">{{ t("publicText.close") }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import {
    QueryMaterialRequestList,
    QueryMaterialRequestDetail,
    CancelMaterialRequest,
    ManualSubmitSaiYiMaterialRequest,
    ManualSubmitWorkOrderSupplementSaiYiMaterialRequest,
    OutOrderPushBySN,
    OutOrderCancel,
} from "@/api/Scheduling/index"
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import {
    ref,
    reactive,
    computed,
    nextTick,
    onMounted,
    onBeforeUnmount,
} from "vue";
import { ElNotification, ElMessage, ElMessageBox } from "element-plus";
import { useUserStoreWithOut } from "@/stores/modules/user";
import dayjs from "dayjs";
import { useI18n } from "vue-i18n";

const userStore = useUserStoreWithOut();
const { t } = useI18n();

const eltableRef = ref();
const tableHeight = ref(0);
const loading = ref(false);
const tableData = ref<any[]>([]);
const total = ref(0);

const getForm = reactive({
    PageIndex: 1,
    PageSize: 50,
    KittingNo: '',
    WOGroup: '',
});

// 单选 & 操作按钮 loading
const selectedNo = ref('');
const selectedRow = computed(() => tableData.value.find((r: any) => r.MaterialRequest_No === selectedNo.value));
const btnLoading = reactive({ call: false, push: false, cancelShelter: false, cancel: false });
// 按钮可用条件
const canCall = computed(() => { const r = selectedRow.value; return !!r && r.RequestInfo === 1 && r.MaterialRequest_Status !== 3; });
const canPush = computed(() => { const r = selectedRow.value; return !!r && r.RequestInfo === 0 && r.MaterialRequest_Status !== 3; });
const canCancelShelter = computed(() => { const r = selectedRow.value; return !!r && r.RequestInfo === 0 && r.MaterialRequest_Status !== 3 && r.MaterialRequest_Status !== 99; });
const canCancel = computed(() => { const r = selectedRow.value; return !!r && r.MaterialRequest_Status !== 3 && r.MaterialRequest_Status !== 99; });

// 详情弹窗相关
const detailListRef = ref();
const detailDetailRef = ref();
const detailVisible = ref(false);
const detailLoading = ref(false);
const detailData = reactive({
    list: [] as any[],
    detail: [] as any[],
});

// 料盘明细分页
const detailPage = reactive({
    PageIndex: 1,
    PageSize: 50,
});
const detailTotal = computed(() => detailData.detail.length);
const pagedDetailData = computed(() => {
    const start = (detailPage.PageIndex - 1) * detailPage.PageSize;
    return detailData.detail.slice(start, start + detailPage.PageSize);
});
const handleDetailSizeChange = (val: number) => {
    detailPage.PageSize = val;
    detailPage.PageIndex = 1;
};
const handleDetailCurrentChange = (val: number) => {
    detailPage.PageIndex = val;
};

// 料盘明细 - 相同物料编码合并
const detailSpanArr = computed(() => {
    const arr: number[] = [];
    pagedDetailData.value.forEach((row: any, index: number) => {
        if (index === 0) {
            arr.push(1);
        } else {
            const prev = pagedDetailData.value[index - 1];
            if (row.MaterialRequestDetail_PN === prev.MaterialRequestDetail_PN) {
                let countIdx = index - 1;
                while (countIdx >= 0 && arr[countIdx] === 0) countIdx--;
                arr[countIdx]++;
                arr.push(0);
            } else {
                arr.push(1);
            }
        }
    });
    return arr;
});

const detailSpanMethod = ({ rowIndex, columnIndex }: { row: any; column: any; rowIndex: number; columnIndex: number }) => {
    if (columnIndex === 1) { // 物料编号列
        const span = detailSpanArr.value[rowIndex] ?? 0;
        return { rowspan: span, colspan: span > 0 ? 1 : 0 };
    }
};

// 料号明细统计
const listStatistics = computed(() => {
    const total = detailData.list.length;
    const satisfied = detailData.list.filter(
        (row: any) => row.MaterialRequestList_ActiveQty >= row.MaterialRequestList_Qty
    ).length;
    return { total, satisfied, notSatisfied: total - satisfied };
});

const { getColumnWidth } = useTableColumnWidth(eltableRef, tableData, {
    excludeLabels: [t('publicText.index'), t('publicText.operation')]
});

const { getColumnWidth: getListColumnWidth } = useTableColumnWidth(detailListRef, computed(() => detailData.list), {});

const { getColumnWidth: getDetailColumnWidth } = useTableColumnWidth(detailDetailRef, computed(() => detailData.detail), {});

const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr.startsWith("1900-01-01")) return "-";
    return dayjs(dateStr).format("YYYY-MM-DD HH:mm:ss");
};

// RequestInfo 映射：0=MES, 1=WMS, 2=锡膏
const getRequestInfoText = (info: number) => {
    switch (info) {
        case 0: return t('Scheduling.CallMaterials.FangCang');
        case 1: return t('Scheduling.CallMaterials.SaiYi');
        case 2: return t('Scheduling.CallMaterials.XiGao');
        default: return "-";
    }
};

const getRequestInfoType = (info: number) => {
    switch (info) {
        case 0: return "primary";
        case 1: return "info";
        case 2: return "warning";
        default: return "success";
    }
};

// MaterialRequest_Status 映射：0=准备叫料, 1=已叫料, 2=发料中, 99=发料完成, 3=已取消
const getStatusText = (status: number) => {
    switch (status) {
        case 0: return t('Scheduling.CallMaterials.StatusPending');
        case 1: return t('Scheduling.CallMaterials.StatusCalled');
        case 2: return t('Scheduling.CallMaterials.StatusIssuing');
        case 99: return t('Scheduling.CallMaterials.StatusCompleted');
        case 3: return t('Scheduling.CallMaterials.StatusCancelled');
        default: return "-";
    }
};

const getStatusType = (status: number) => {
    switch (status) {
        case 0: return "info";
        case 1: return "primary";
        case 2: return "warning";
        case 99: return "success";
        case 3: return "danger";
        default: return "info";
    }
};

const getIsDisabledText = (val: number) => {
    if (val === 0) return t('Scheduling.CallMaterials.Preferred');
    if (val === 1) return t('Scheduling.CallMaterials.Disabled');
    return t('Scheduling.CallMaterials.NotUsed');
};

const getIsDisabledType = (val: number) => {
    if (val === 0) return "success";
    if (val === 1) return "danger";
    return "info";
};

const getData = () => {
    loading.value = true;
    QueryMaterialRequestList(getForm).then((res: any) => {
        if (res.Success) {
            tableData.value = res.Data.rows || [];
            total.value = res.Data.total || 0;
        } else {
            tableData.value = [];
            total.value = 0;
        }
    }).catch(() => {
        tableData.value = [];
        total.value = 0;
    }).finally(() => {
        loading.value = false;
    });
};

const searchData = () => {
    getForm.PageIndex = 1;
    getData();
};

const handleCallOrderClick = (row: any) => {
    if (row.MaterialRequest_Status === 3) {
        ElMessage.warning(t('Scheduling.CallMaterials.CancelledNoDetail'));
        return;
    }
    fetchDetail(row);
};

const fetchDetail = (row: any) => {
    detailVisible.value = true;
    detailData.list = [];
    detailData.detail = [];
    detailPage.PageIndex = 1;
    detailPage.PageSize = 50;
    detailLoading.value = true;

    QueryMaterialRequestDetail({ MaterialRequestNo: row.MaterialRequest_No }).then((res: any) => {
        if (res.Success) {
            detailData.list = res.Data.List || [];
            detailData.detail = res.Data.Detail || [];
            // 首套叫料时，料号明细需求数量置0后再对比（首套不需要校验需求量）
            if (!row.IsFirst) {
                detailData.list.forEach((item: any) => {
                    item.MaterialRequestList_Qty = 0;
                });
            }
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
    }).finally(() => {
        detailLoading.value = false;
    });
};

const closeDetail = () => {
    detailVisible.value = false;
    detailData.list = [];
    detailData.detail = [];
};

// WMS叫料
const handleCall = () => {
    const row = selectedRow.value;
    if (!row) return;
    if (row.RequestInfo !== 1) {
        ElMessage.warning(t('Scheduling.CallMaterials.onlySaiYi'));
        return;
    }
    const params = { MaterialRequestNo: row.MaterialRequest_No, OpUser: userStore.getUserInfo };
    const fn = row.MaterialRequest_Type === 1 ? ManualSubmitWorkOrderSupplementSaiYiMaterialRequest : ManualSubmitSaiYiMaterialRequest;
    btnLoading.call = true;
    fn(params).then((res: any) => {
        ElNotification({ title: t('publicText.tipTitle'), message: res.Message, type: res.Success ? "success" : "error" });
        if (res.Success) { selectedNo.value = ''; getData(); }
    }).finally(() => { btnLoading.call = false; });
};

// 下发方仓
const handlePush = () => {
    const row = selectedRow.value;
    if (!row) return;
    ElMessageBox.confirm(
        t('Scheduling.CallMaterials.confirmPushShelter').replace('{0}', row.MaterialRequest_No || ''),
        t('publicText.tip'),
        { confirmButtonText: t('publicText.confirm'), cancelButtonText: t('publicText.cancel'), type: "warning" }
    ).then(() => {
        btnLoading.push = true;
        OutOrderPushBySN({ MaterialRequestNo: row.MaterialRequest_No, UserNo: userStore.getUserInfo || "" })
            .then((res: any) => {
                ElNotification({ title: t('publicText.tipTitle'), message: res.Message, type: res.Success ? "success" : "error" });
                if (res.Success) { selectedNo.value = ''; getData(); }
            }).catch(() => { ElMessage.error(t('Scheduling.CallMaterials.pushShelterFailure')); })
            .finally(() => { btnLoading.push = false; });
    }).catch(() => { });
};

// 取消下发方仓
const handleCancelShelter = () => {
    const row = selectedRow.value;
    if (!row) return;
    ElMessageBox.confirm(
        t('Scheduling.CallMaterials.confirmCancelShelter').replace('{0}', row.MaterialRequest_No || ''),
        t('publicText.tip'),
        { confirmButtonText: t('publicText.confirm'), cancelButtonText: t('publicText.cancel'), type: "warning" }
    ).then(() => {
        btnLoading.cancelShelter = true;
        OutOrderCancel({ MaterialRequestNo: row.MaterialRequest_No, UserNo: userStore.getUserInfo || "" })
            .then((res: any) => {
                ElNotification({ title: t('publicText.tipTitle'), message: res.Message, type: res.Success ? "success" : "error" });
                if (res.Success) { selectedNo.value = ''; getData(); }
            }).catch(() => { ElMessage.error(t('Scheduling.CallMaterials.cancelShelterFailure')); })
            .finally(() => { btnLoading.cancelShelter = false; });
    }).catch(() => { });
};

// 取消
const handleCancel = () => {
    const row = selectedRow.value;
    if (!row) return;
    ElMessageBox.prompt(t('Scheduling.CallMaterials.CancelReason'), t('publicText.confirm'), {
        confirmButtonText: t('publicText.confirm'),
        cancelButtonText: t('publicText.cancel'),
        inputType: "textarea",
    }).then((val: any) => {
        if (val.action !== 'confirm') return;
        btnLoading.cancel = true;
        CancelMaterialRequest({
            MaterialRequestNo: row.MaterialRequest_No,
            CreateUser: userStore.getUserInfo,
            CancelReason: val.value || "",
        }).then((res: any) => {
            ElNotification({ title: t('publicText.tipTitle'), message: res.Message, type: res.Success ? "success" : "error" });
            if (res.Success) { selectedNo.value = ''; getData(); }
        }).finally(() => { btnLoading.cancel = false; });
    }).catch(() => { });
};

const handleSizeChange = (val: number) => {
    getForm.PageSize = val;
    getData();
};

const handleCurrentChange = (val: number) => {
    getForm.PageIndex = val;
    getData();
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

.mt-4 {
    margin-top: 16px;
}

.call-order-link {
    color: #006487;
    text-decoration: underline;
    cursor: pointer;
}

.call-order-link.disabled {
    color: #909399;
    text-decoration: none;
    cursor: not-allowed;
}
</style>
