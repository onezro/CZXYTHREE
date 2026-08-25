<template>
    <div class="p-2">
        <!-- 主表区域 -->
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <el-form ref="formRef" :inline="true" size="small" label-width="auto" @submit.prevent>
                <el-form-item :label="t('Scheduling.ProReturnTransfer.returnNo')" prop="return_no" class="mb-2">
                    <el-input v-model="getForm.return_no" :placeholder="t('Scheduling.ProReturnTransfer.inputReturnNo')"
                        clearable @clear="searchData" @keyup.enter="searchData" style="width: 250px" />
                </el-form-item>
                <el-form-item class="mb-2">
                    <el-button type="primary" @click="searchData">{{ t('publicText.query') }}</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="tableData" size="small" :style="{ width: '100%' }" :height="masterTableHeight"
                :tooltip-effect="'dark'" border fit ref="masterTableRef" highlight-current-row
                :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }"
                @row-click="handleRowClick">
                <el-table-column type="index" align="center" fixed :label="t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{ scope.$index + getForm.PageSize * (getForm.PageIndex - 1) + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="t('Scheduling.ProReturnTransfer.returnNo')" fixed prop="return_no"
                    :min-width="getMasterColumnWidth('return_no')" show-overflow-tooltip />
                <el-table-column :label="t('Scheduling.ProReturnTransfer.reelCount')" prop="reel_count"
                    :min-width="getMasterColumnWidth('reel_count')" align="center" />
                <el-table-column :label="t('Scheduling.ProReturnTransfer.completedReelCount')" prop="completed_reel_count"
                    :min-width="getMasterColumnWidth('completed_reel_count')" align="center" />
                <el-table-column :label="t('Scheduling.ProReturnTransfer.returnTime')" prop="return_time"
                    :min-width="getMasterColumnWidth('return_time')" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ formatDate(row.return_time) }}
                    </template>
                </el-table-column>
                <el-table-column :label="t('Scheduling.ProReturnTransfer.createUser')" prop="create_user"
                    :min-width="getMasterColumnWidth('create_user')" />
                <el-table-column :label="t('Scheduling.ProReturnTransfer.status')" prop="status"
                    :min-width="getMasterColumnWidth('status')" align="center">
                    <template #default="{ row }">
                        <el-tag :type="getStatusType(row.status)" size="small">
                            {{ row.status_name || '-' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column :label="t('Scheduling.ProReturnTransfer.lastSubmitTime')" prop="last_submit_time"
                    :min-width="getMasterColumnWidth('last_submit_time')" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ formatDate(row.last_submit_time) }}
                    </template>
                </el-table-column>
                <el-table-column :label="t('Scheduling.ProReturnTransfer.lastSubmitUser')" prop="last_submit_user"
                    :min-width="getMasterColumnWidth('last_submit_user')" />
                <el-table-column :label="t('Scheduling.ProReturnTransfer.lastError')" prop="last_error"
                    :min-width="getMasterColumnWidth('last_error')" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ row.last_error || '-' }}
                    </template>
                </el-table-column>
                <el-table-column :label="t('publicText.operation')" prop="operation" width="140" align="center" fixed="right">
                    <template #default="{ row }">
                        <el-tooltip effect="dark" :content="t('Scheduling.ProReturnTransfer.resubmit')" placement="top">
                            <el-button type="warning" size="small" icon="Refresh"
                                :disabled="!canResubmit(row)" @click.stop="handleResubmit(row)" />
                        </el-tooltip>
                        <el-tooltip effect="dark" :content="t('publicText.delete')" placement="top">
                            <el-button type="danger" size="small" icon="Delete"
                                :disabled="!row.can_delete" @click.stop="handleDeleteMaster(row)" />
                        </el-tooltip>
                    </template>
                </el-table-column>
                <template #empty>
                    <div class="flex items-center justify-center h-100%">
                        <el-empty />
                    </div>
                </template>
            </el-table>
            <div class="mt-1">
                <el-pagination :size="'small'" background @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :pager-count="5" :current-page="getForm.PageIndex"
                    :page-size="getForm.PageSize" :page-sizes="[30, 50, 100, 200, 300]"
                    layout="total,sizes, prev, pager, next" :total="total">
                </el-pagination>
            </div>
             <div class="mb-2 font-bold">
                {{ currentReturnNo
                    ? t('Scheduling.ProReturnTransfer.detailTitle') + ' - ' + currentReturnNo
                    : t('Scheduling.ProReturnTransfer.selectMasterTip') }}
            </div>
            <el-table :data="detailData" size="small" :style="{ width: '100%' }" :height="detailTableHeight"
                :tooltip-effect="'dark'" border fit ref="detailTableRef"
                :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }">
                <el-table-column type="index" align="center" :label="t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{ scope.$index + detailForm.PageSize * (detailForm.PageIndex - 1) + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="t('Scheduling.ProReturnTransfer.reelId')" prop="reel_id"
                    :min-width="getDetailColumnWidth('reel_id')" show-overflow-tooltip />
                <el-table-column :label="t('Scheduling.ProReturnTransfer.materialPn')" prop="material_pn"
                    :min-width="getDetailColumnWidth('material_pn')" show-overflow-tooltip />
                <el-table-column :label="t('Scheduling.ProReturnTransfer.outOri')" prop="out_ori"
                    :min-width="getDetailColumnWidth('out_ori')" align="center" />
                <el-table-column :label="t('Scheduling.ProReturnTransfer.outWareHouse')" prop="out_ware_house"
                    :min-width="getDetailColumnWidth('out_ware_house')" align="center" />
                <el-table-column :label="t('Scheduling.ProReturnTransfer.inOri')" prop="in_ori"
                    :min-width="getDetailColumnWidth('in_ori')" align="center" />
                <el-table-column :label="t('Scheduling.ProReturnTransfer.inWareHouse')" prop="in_ware_house"
                    :min-width="getDetailColumnWidth('in_ware_house')" align="center" />
                <el-table-column :label="t('Scheduling.ProReturnTransfer.virtualLineNo')" prop="virtual_line_no"
                    :min-width="getDetailColumnWidth('virtual_line_no')" align="center" />
                <el-table-column :label="t('Scheduling.ProReturnTransfer.status')" prop="status"
                    :min-width="getDetailColumnWidth('status')" align="center">
                    <template #default="{ row }">
                        <el-tag :type="getStatusType(row.status)" size="small">
                            {{ row.status_name || '-' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column :label="t('Scheduling.ProReturnTransfer.submitCount')" prop="submit_count"
                    :min-width="getDetailColumnWidth('submit_count')" align="center" />
                <el-table-column :label="t('Scheduling.ProReturnTransfer.lastSubmitTime')" prop="last_submit_time"
                    :min-width="getDetailColumnWidth('last_submit_time')" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ formatDate(row.last_submit_time) }}
                    </template>
                </el-table-column>
                <el-table-column :label="t('Scheduling.ProReturnTransfer.completeTime')" prop="complete_time"
                    :min-width="getDetailColumnWidth('complete_time')" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ formatDate(row.complete_time) }}
                    </template>
                </el-table-column>
                <el-table-column :label="t('publicText.operation')" prop="operation" width="100" align="center" fixed="right">
                    <template #default="{ row }">
                        <el-tooltip effect="dark" :content="t('publicText.delete')" placement="top">
                            <el-button type="danger" size="small" icon="Delete"
                                :disabled="!canDeleteDetail(row)" @click="handleDeleteDetail(row)" />
                        </el-tooltip>
                    </template>
                </el-table-column>
                <template #empty>
                    <div class="flex items-center justify-center h-100%">
                        <el-empty />
                    </div>
                </template>
            </el-table>
            <div class="mt-1">
                <el-pagination :size="'small'" background @size-change="handleDetailSizeChange"
                    @current-change="handleDetailCurrentChange" :pager-count="5" :current-page="detailForm.PageIndex"
                    :page-size="detailForm.PageSize" :page-sizes="[10, 20, 30, 50, 100]"
                    layout="total,sizes, prev, pager, next" :total="detailTotal">
                </el-pagination>
            </div>
        </el-card>

        <!-- 明细表区域 -->
        
    </div>
</template>

<script setup lang="ts">
import {
    GetProductionReturnAllocationList,
    GetProductionReturnAllocationDetailList,
    DeleteProductionReturnAllocation,
    DeleteProductionReturnAllocationDetail,
    ResubmitProductionReturnAllocation
} from "@/api/Scheduling/index";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import { ref, reactive, nextTick, onMounted, onBeforeUnmount } from "vue";
import { ElNotification, ElMessageBox } from "element-plus";
import { useUserStoreWithOut } from "@/stores/modules/user";
import dayjs from "dayjs";
import { useI18n } from "vue-i18n";

const userStore = useUserStoreWithOut();
const { t } = useI18n();
const masterTableRef = ref();
const detailTableRef = ref();
const masterTableHeight = ref(0);
const detailTableHeight = ref(0);
const tableData = ref<any[]>([]);
const total = ref(0);

const getForm = reactive({
    PageIndex: 1,
    PageSize: 30,
    return_no: "",
    status: null as number | null,
});

// 明细表相关
const detailData = ref<any[]>([]);
const detailTotal = ref(0);
const currentReturnNo = ref("");
const detailForm = reactive({
    return_no: "",
    PageIndex: 1,
    PageSize: 10,
});

const { getColumnWidth: getMasterColumnWidth } = useTableColumnWidth(masterTableRef, tableData, {
    excludeLabels: [t('publicText.index'), t('publicText.operation')]
});

const { getColumnWidth: getDetailColumnWidth } = useTableColumnWidth(detailTableRef, detailData, {
    excludeLabels: [t('publicText.index'), t('publicText.operation')]
});

const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr.startsWith("1900-01-01")) return "-";
    return dayjs(dateStr).format("YYYY-MM-DD HH:mm:ss");
};

const getStatusType = (status: number) => {
    switch (status) {
        case 0: return "info";
        case 1: return "success";
        case 2: return "success";
        default: return "warning";
    }
};

const canDeleteDetail = (row: any) => {
    return row.status !== 1 && row.status !== 2;
};

const canResubmit = (row: any) => {
    return row.status === 0 || row.status === 1;
};

const handleResubmit = (row: any) => {
    ElMessageBox.confirm(t('Scheduling.ProReturnTransfer.resubmitConfirm'), t('publicText.confirm'), {
        confirmButtonText: t('publicText.confirm'),
        cancelButtonText: t('publicText.cancel'),
        type: "warning",
    }).then(() => {
        const params = {
            return_no: row.return_no,
            userno: userStore.getUserInfo,
        };
        ResubmitProductionReturnAllocation(params).then((res: any) => {
            ElNotification({
                title: t('publicText.tipTitle'),
                message: res.Success ? t('Scheduling.ProReturnTransfer.resubmitSuccess') : res.Message,
                type: res.Success ? "success" : "error",
            });
            if (res.Success) {
                getData();
            }
        });
    }).catch(() => { });
};

const getData = () => {
    GetProductionReturnAllocationList(getForm).then((res: any) => {
        if (res.Success) {
            tableData.value = res.Data?.rows || [];
            total.value = res.Data?.total || 0;
            currentReturnNo.value = "";
            detailData.value = [];
            detailTotal.value = 0;
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

const handleRowClick = (row: any) => {
    if (!row) return;
    currentReturnNo.value = row.return_no;
    detailForm.return_no = row.return_no;
    detailForm.PageIndex = 1;
    getDetailData();
};

const getDetailData = () => {
    if (!detailForm.return_no) return;
    GetProductionReturnAllocationDetailList(detailForm).then((res: any) => {
        if (res.Success) {
            detailData.value = res.Data?.rows || [];
            detailTotal.value = res.Data?.total || 0;
        } else {
            detailData.value = [];
            detailTotal.value = 0;
        }
    }).catch(() => {
        detailData.value = [];
        detailTotal.value = 0;
    });
};

const handleDeleteMaster = (row: any) => {
    ElMessageBox.confirm(t('Scheduling.ProReturnTransfer.deleteConfirm'), t('publicText.confirm'), {
        confirmButtonText: t('publicText.confirm'),
        cancelButtonText: t('publicText.cancel'),
        type: "warning",
    }).then(() => {
        const params = {
            return_no: row.return_no,
            userno: userStore.getUserInfo,
        };
        DeleteProductionReturnAllocation(params).then((res: any) => {
            ElNotification({
                title: t('publicText.tipTitle'),
                message: res.Success ? t('Scheduling.ProReturnTransfer.deleteSuccess') : res.Message,
                type: res.Success ? "success" : "error",
            });
            if (res.Success) {
                if (currentReturnNo.value === row.return_no) {
                    currentReturnNo.value = "";
                    detailData.value = [];
                    detailTotal.value = 0;
                }
                getData();
            }
        });
    }).catch(() => { });
};

const handleDeleteDetail = (row: any) => {
    ElMessageBox.confirm(t('Scheduling.ProReturnTransfer.deleteDetailConfirm'), t('publicText.confirm'), {
        confirmButtonText: t('publicText.confirm'),
        cancelButtonText: t('publicText.cancel'),
        type: "warning",
    }).then(() => {
        const params = {
            detail_id: row.id,
            return_no: row.return_no,
            userno: userStore.getUserInfo,
        };
        DeleteProductionReturnAllocationDetail(params).then((res: any) => {
            ElNotification({
                title: t('publicText.tipTitle'),
                message: res.Success ? t('Scheduling.ProReturnTransfer.deleteSuccess') : res.Message,
                type: res.Success ? "success" : "error",
            });
            if (res.Success) {
                getDetailData();
                getData();
            }
        });
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

const handleDetailSizeChange = (val: number) => {
    detailForm.PageSize = val;
    getDetailData();
};

const handleDetailCurrentChange = (val: number) => {
    detailForm.PageIndex = val;
    getDetailData();
};

const getScreenHeight = () => {
    nextTick(() => {
        const availableHeight = window.innerHeight - 240;
        masterTableHeight.value = Math.floor(availableHeight*0.6);
        detailTableHeight.value = Math.ceil(availableHeight*0.4);
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
