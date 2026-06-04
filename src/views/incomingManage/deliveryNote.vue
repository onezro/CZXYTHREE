<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between">
                <el-form ref="formRef" :model="getForm" label-width="auto" :inline="true" :size="'small'"
                    @submit.native.prevent>
                    <el-form-item :label="t('incomingManage.deliveryNote.iqcNo')" prop="iqcNo" class="mb-2">
                        <el-input v-model="getForm.IQCNo"
                            :placeholder="t('incomingManage.deliveryNote.iqcNoPlaceholder')" clearable
                            @clear="searchData" @keyup.enter.native="searchData" style="width: 180px" />
                    </el-form-item>
                    <el-form-item :label="t('incomingManage.deliveryNote.arrivalNo')" prop="arrivalNo" class="mb-2">
                        <el-input v-model="getForm.ArrivalNo"
                            :placeholder="t('incomingManage.deliveryNote.arrivalNoPlaceholder')" clearable
                            @clear="searchData" @keyup.enter.native="searchData" style="width: 180px" />
                    </el-form-item>
                    <el-form-item :label="t('incomingManage.deliveryNote.result')" prop="result" class="mb-2">
                        <el-select v-model="getForm.Result" clearable
                            :placeholder="t('incomingManage.deliveryNote.resultPlaceholder')" style="width: 180px">
                            <el-option :label="t('incomingManage.deliveryNote.notTested')" :value="0" />
                            <el-option :label="t('incomingManage.deliveryNote.qualified')" :value="1" />
                            <el-option :label="t('incomingManage.deliveryNote.unqualified')" :value="2" />
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="t('incomingManage.deliveryNote.reviewResult')" prop="reviewResult"
                        class="mb-2">
                        <el-select v-model="getForm.ReviewResult" clearable
                            :placeholder="t('incomingManage.deliveryNote.reviewResultPlaceholder')"
                            style="width: 180px">
                            <el-option :label="t('incomingManage.deliveryReview.notReviewed')" :value="0" />
                            <el-option :label="t('incomingManage.deliveryReview.pickAccept')" :value="1" />
                            <el-option :label="t('incomingManage.deliveryReview.returnGoods')" :value="2" />
                            <el-option :label="t('incomingManage.deliveryReview.concessionAccept')" :value="3" />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="mb-2">
                        <el-button type="primary" @click="searchData">{{ t('publicText.query') }}</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <!-- 主表列表 -->
            <el-table :data="tableData" size="small" :style="{ width: '100%' }" :height="tableHeight"
                :tooltip-effect="'dark'" border fit highlight-current-row>
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{ scope.$index + getForm.PageSize * (getForm.PageIndex - 1) + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="t('incomingManage.deliveryNote.iqcNo')" prop="IQCNo"
                    :min-width="getColumnWidth1('IQCNo')" fixed />
                <el-table-column :label="t('incomingManage.deliveryNote.arrivalNo')" prop="ArrivalNo"
                    :min-width="getColumnWidth1('ArrivalNo')" fixed />
                <el-table-column :label="t('incomingManage.deliveryNote.arrivalBatch')" prop="ArrivalBatch"
                    :min-width="getColumnWidth1('ArrivalBatch')" />
                <el-table-column :label="t('incomingManage.deliveryNote.materialCode')" prop="MaterialCode"
                    :min-width="getColumnWidth1('MaterialCode')" />
                <el-table-column :label="t('incomingManage.deliveryNote.materialName')" prop="MaterialName"
                    :min-width="getColumnWidth1('MaterialName')" />
                <el-table-column :label="t('incomingManage.deliveryNote.projectName')" prop="ProjectName"
                    :min-width="getColumnWidth1('ProjectName')" />
                <el-table-column :label="t('incomingManage.deliveryNote.isDouble')" prop="IsDouble" width="80"
                    align="center">
                    <template #default="{ row }">
                        <span>{{ row.IsDouble === 1 ? t('publicText.yes') : t('publicText.no') }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="t('incomingManage.deliveryNote.arrivalQty')" prop="ArrivalQty" width="100"
                    align="right" />
                <el-table-column :label="t('incomingManage.deliveryNote.sampleQty')" prop="SampleQty" width="100"
                    align="right" />
                <el-table-column :label="t('incomingManage.deliveryNote.result')" prop="Result" width="100"
                    align="center">
                    <template #default="{ row }">
                        <el-tag :type="getResultType(row.Result)" size="small">{{ getResultText(row.Result) }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column :label="t('incomingManage.testItems.creator')" prop="CreateUser"
                    :min-width="getColumnWidth1('CreateUser')" />
                <el-table-column :label="t('incomingManage.testItems.creatime')" prop="CreateTime"
                    :min-width="getColumnWidth1('CreateTime')" />
                <el-table-column :label="$t('publicText.operation')" fixed="right" width="220" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" @click="openInspectDialog(row)">
                            {{ t('incomingManage.deliveryNote.inspect') }}
                        </el-button>
                        <el-button type="warning" size="small" @click="openReviewDialog(row)">
                            {{ t('incomingManage.deliveryNote.review') }}
                        </el-button>
                        <el-button type="danger" size="small" @click="handleDelete(row)">
                            {{ t('publicText.delete') }}
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
                    @current-change="handleCurrentChange" :pager-count="5" :current-page="getForm.PageIndex"
                    :page-size="getForm.PageSize" :page-sizes="[30, 50, 100, 200, 300]"
                    layout="total,sizes, prev, pager, next" :total="total" />
            </div>
        </el-card>

        <!-- 检验弹窗（录入实测值） -->
        <el-dialog :title="t('incomingManage.deliveryNote.inspectTitle')" v-model="inspectDialogVisible" width="1000px"
            @close="closeInspectDialog" align-center :append-to-body="true" :close-on-click-modal="false"
            :close-on-press-escape="false">
            <el-form :model="inspectForm" size="small" :inline="true" label-width="auto">
                <el-form-item :label="t('incomingManage.deliveryNote.iqcNo')">
                    <el-input v-model="inspectForm.IQCNo" disabled style="width: 200px;" />
                </el-form-item>
                <el-form-item :label="t('incomingManage.deliveryNote.arrivalNo')">
                    <el-input v-model="inspectForm.ArrivalNo" disabled style="width: 200px;" />
                </el-form-item>
                <el-form-item :label="t('incomingManage.deliveryNote.materialCode')">
                    <el-input v-model="inspectForm.MaterialCode" disabled style="width: 200px;" />
                </el-form-item>
                <el-form-item :label="t('incomingManage.deliveryNote.materialName')" style="width: 100%;">
                    <el-input v-model="inspectForm.MaterialName" type="textarea" disabled rows="1"  style="width: 825px;"/>
                </el-form-item>
                <el-form-item :label="t('incomingManage.deliveryNote.result')">
                    <el-select v-model="inspectForm.MainResult" size="small" style="width: 200px">
                        <el-option :label="t('incomingManage.deliveryNote.qualified')" :value="1" />
                        <el-option :label="t('incomingManage.deliveryNote.unqualified')" :value="2" />
                    </el-select>
                </el-form-item>
                <el-table :data="inspectForm.Details" border size="small" style="width: 100%" height="400">
                    <el-table-column :label="t('incomingManage.inspectionItem.gaugeCode')" prop="InspectionCode"
                        width="150" />
                    <el-table-column :label="t('incomingManage.inspectionItem.gaugeName')" prop="InspectionName"
                        min-width="150" />
                    <el-table-column :label="t('incomingManage.inspectionItem.isGauge')" prop="IsInspectionTool"
                        width="80" align="center">
                        <template #default="{ row }">{{ row.IsInspectionTool === 1 ? t('publicText.yes') :
                            t('publicText.no') }}</template>
                    </el-table-column>
                    <el-table-column :label="t('incomingManage.inspectionRule.upperLimit')" prop="UpperLimit" width="90"
                        align="right" />
                    <el-table-column :label="t('incomingManage.inspectionRule.lowerLimit')" prop="LowerLimit" width="90"
                        align="right" />
                    <el-table-column :label="t('incomingManage.inspectionRule.unit')" prop="Unit" width="70" />
                    <el-table-column :label="t('incomingManage.deliveryNote.measuredValue')" width="140">
                        <template #default="{ row }">
                            <el-input-number v-model="row.MeasuredValue" size="small" :controls="false"
                                style="width: 100%" :disabled="row.IsInspectionTool === 0" :precision="4"
                                @change="() => calculateDetailResult(row)" />
                        </template>
                    </el-table-column>
                    <el-table-column :label="t('incomingManage.deliveryNote.detailResult')" width="100" align="center">
                        <template #default="{ row }">
                            <el-select v-model="row.Result" size="small" style="width: 100%" @change="updateMainResult">
                                <el-option :label="t('incomingManage.deliveryNote.qualified')" :value="1" />
                                <el-option :label="t('incomingManage.deliveryNote.unqualified')" :value="0" />
                            </el-select>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <template #footer>
                <el-button @click="inspectDialogVisible = false">{{ t("publicText.cancel") }}</el-button>
                <el-button type="primary" @click="submitInspect" :loading="inspectSubmitting">{{ t("publicText.confirm")
                    }}</el-button>
            </template>
        </el-dialog>

        <!-- 二次确认（评审）弹窗 -->
        <el-dialog :title="t('incomingManage.deliveryNote.reviewTitle')" v-model="reviewDialogVisible" width="1000px"
            @close="closeReviewDialog" align-center :append-to-body="true" :close-on-click-modal="false"
            :close-on-press-escape="false">
            <el-form :model="reviewForm" ref="reviewFormRef" label-width="auto"  size="small" :rules="reviewRules" :inline="true">
                <el-form-item :label="t('incomingManage.deliveryNote.iqcNo')">
                    <el-input v-model="reviewForm.IQCNo" disabled style="width: 200px;" />
                </el-form-item>
                <el-form-item :label="t('incomingManage.deliveryNote.arrivalNo')">
                    <el-input v-model="reviewForm.ArrivalNo" disabled style="width: 200px;" />
                </el-form-item>
                <el-form-item :label="t('incomingManage.deliveryNote.reviewResult')" prop="ReviewResult">
                    <el-select v-model="reviewForm.ReviewResult" style="width: 200px">
                        <el-option :label="t('incomingManage.deliveryReview.pickAccept')" :value="1" />
                        <el-option :label="t('incomingManage.deliveryReview.returnGoods')" :value="2" />
                        <el-option :label="t('incomingManage.deliveryReview.concessionAccept')" :value="0" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="t('incomingManage.deliveryNote.remarks')" prop="Remarks">
                    <el-input v-model="reviewForm.Remarks" type="textarea" :rows="2" style="width: 825px"
                        :placeholder="t('incomingManage.deliveryNote.reviewRemarksPlaceholder')" />
                </el-form-item>
            </el-form>
            <el-table :data="viewDetails" border size="small" style="width: 100%" height="400">
                <el-table-column :label="t('incomingManage.inspectionItem.gaugeCode')" prop="InspectionCode"
                    width="150" />
                <el-table-column :label="t('incomingManage.inspectionItem.gaugeName')" prop="InspectionName"
                    min-width="150" />
                <el-table-column :label="t('incomingManage.inspectionItem.isGauge')" prop="IsInspectionTool" width="80"
                    align="center">
                    <template #default="{ row }">{{ row.IsInspectionTool === 1 ? t('publicText.yes') :
                        t('publicText.no') }}</template>
                </el-table-column>
                <el-table-column :label="t('incomingManage.inspectionRule.upperLimit')" prop="UpperLimit" width="90"
                    align="right" />
                <el-table-column :label="t('incomingManage.inspectionRule.lowerLimit')" prop="LowerLimit" width="90"
                    align="right" />
                <el-table-column :label="t('incomingManage.inspectionRule.unit')" prop="Unit" width="70" />
                <el-table-column :label="t('incomingManage.deliveryNote.measuredValue')" prop="MeasuredValue"
                    width="120" align="right" />
                <el-table-column :label="t('incomingManage.deliveryNote.detailResult')" width="100" align="center">
                    <template #default="{ row }">{{ row.Result === 1 ? t('incomingManage.deliveryNote.qualified') :
                        t('incomingManage.deliveryNote.unqualified') }}</template>
                </el-table-column>
            </el-table>
            <template #footer>
                <el-button @click="reviewDialogVisible = false">{{ t("publicText.cancel") }}</el-button>
                <el-button type="primary" @click="submitReview" :loading="reviewSubmitting">{{ t("publicText.confirm")
                    }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { QueryArrivalInspectionList, QueryArrivalInspectionDetailList, SaveInspectionResult, SubmitInspectionResult, UpdateReviewResult, DeleteArrivalInspection } from "@/api/incomingManage/index";
import { calculateColumnsWidth } from "@/utils/tableminWidth";
import { ref, reactive, computed, nextTick, onMounted, onBeforeUnmount } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { useI18n } from "vue-i18n";

const userStore = useUserStoreWithOut();
const { t } = useI18n();

// 表格高度自适应
const tableHeight = ref(0);
const tableData = ref<any[]>([]);
const total = ref(0);
const getForm = reactive({
    PageIndex: 1,
    PageSize: 50,
    IQCNo: "",
    ArrivalNo: "",
    Result: undefined as number | undefined,
    ReviewResult: undefined as number | undefined,
});

// 检验弹窗
const inspectDialogVisible = ref(false);
const inspectSubmitting = ref(false);
const inspectForm = reactive<{
    ArrivalId: number | null;
    IQCNo: string;
    ArrivalNo: string;
    MaterialCode: string;
    MaterialName: string;
    MainResult: number;
    Details: any[];
}>({
    ArrivalId: null,
    IQCNo: "",
    ArrivalNo: "",
    MaterialCode: "",
    MaterialName: "",
    MainResult: 1,
    Details: [],
});

// 二次确认弹窗
const reviewDialogVisible = ref(false);
const reviewSubmitting = ref(false);
const reviewFormRef = ref();
const reviewForm = reactive({
    ArrivalId: null as number | null,
    IQCNo: "",
    ArrivalNo: "",
    ReviewResult: 1,
    Remarks: "",
});
const reviewRules = {
    ReviewResult: [{ required: true, message: "请选择评审结果", trigger: "change" }],
};

const viewDetails = ref<any[]>([]);

// ==================== API 调用 ====================
const getData = () => {
    QueryArrivalInspectionList({
        PageIndex: getForm.PageIndex,
        PageSize: getForm.PageSize,
        IQCNo: getForm.IQCNo || undefined,
        ArrivalNo: getForm.ArrivalNo || undefined,
        Result: getForm.Result,
        ReviewResult: getForm.ReviewResult,
    }).then((res: any) => {
        if (res.Success) {
            total.value = res.Data.total;
            tableData.value = res.Data.rows || [];
        } else {
            ElMessage.error(res.Message || "查询失败");
        }
    }).catch(() => ElMessage.error("查询失败"));
};

const searchData = () => {
    getForm.PageIndex = 1;
    getData();
};

const handleSizeChange = (val: number) => {
    getForm.PageSize = val;
    getData();
};
const handleCurrentChange = (val: number) => {
    getForm.PageIndex = val;
    getData();
};

// 辅助函数
const getResultText = (result: number) => {
    if (result === 0) return t("incomingManage.deliveryNote.notTested");
    if (result === 1) return t("incomingManage.deliveryNote.qualified");
    return t("incomingManage.deliveryNote.unqualified");
};
const getResultType = (result: number) => {
    if (result === 0) return "info";
    if (result === 1) return "success";
    return "danger";
};

// ==================== 删除 ====================
const handleDelete = (row: any) => {
    ElMessageBox.confirm(
        `${t('publicText.confirm')}${t("publicText.delete")}【${row.IQCNo}】?`,
        t("publicText.confirm"),
        {
            confirmButtonText: t("publicText.confirm"),
            cancelButtonText: t("publicText.cancel"),
            type: "warning",
        }
    )
        .then(() => {
            DeleteArrivalInspection({
                Id: row.ArrivalId,
                DeleteUser: userStore.getUserInfo || "admin",
                DeleteReason: "",
            }).then((res: any) => {
                if (res.Success) {
                    ElMessage.success(res.Message || "删除成功");
                    getData(); // 刷新列表
                } else {
                    ElMessage.error(res.Message || "删除失败");
                }
            }).catch(() => {
                ElMessage.error("删除失败");
            });
        })
        .catch(() => {
            ElMessage.info(t("publicText.cancel"));
        });
};

// ==================== 检验弹窗逻辑 ====================
const openInspectDialog = async (row: any) => {
    try {
        const res:any = await QueryArrivalInspectionDetailList({ ArrivalId: row.ArrivalId });
        if (res.Success) {
            const details = (res.Data || []).map((item: any) => ({
                DetailId: item.DetailId,
                InspectionCode: item.InspectionCode,
                InspectionName: item.InspectionName,
                IsInspectionTool: item.IsInspectionTool,
                UpperLimit: item.UpperLimit,
                LowerLimit: item.LowerLimit,
                Unit: item.Unit,
                MeasuredValue: item.MeasuredValue ?? null,
                Result: (item.Result === undefined || item.Result === null) ? 1 : item.Result,
            }));
            inspectForm.ArrivalId = row.ArrivalId;
            inspectForm.IQCNo = row.IQCNo;
            inspectForm.ArrivalNo = row.ArrivalNo;
            inspectForm.MaterialCode = row.MaterialCode;
            inspectForm.MaterialName = row.MaterialName;
            inspectForm.MainResult = row.Result ?? 0;
            inspectForm.Details = details;
            inspectDialogVisible.value = true;
        } else {
            ElMessage.error(res.Message || "加载明细失败");
        }
    } catch {
        ElMessage.error("加载明细失败");
    }
};

const calculateDetailResult = (detail: any) => {
    if (detail.IsInspectionTool === 1 && (detail.UpperLimit !== null || detail.LowerLimit !== null)) {
        const value = detail.MeasuredValue;
        if (value !== null && value !== undefined && !isNaN(value)) {
            let ok = true;
            if (detail.UpperLimit !== null && value > detail.UpperLimit) ok = false;
            if (detail.LowerLimit !== null && value < detail.LowerLimit) ok = false;
            detail.Result = ok ? 1 : 0;
        } else {
            detail.Result = 1;
        }
    }
    updateMainResult();
};

const updateMainResult = () => {
    if (!inspectForm.Details.length) return;
    const allQualified = inspectForm.Details.every(d => d.Result === 1);
    inspectForm.MainResult = allQualified ? 1 : 2;
};

const submitInspect = async () => {
    // 校验量具类实测值不能为空
    const missing = inspectForm.Details.some(d => d.IsInspectionTool === 1 && (d.MeasuredValue === null || d.MeasuredValue === undefined || isNaN(d.MeasuredValue)));
    if (missing) {
        ElMessage.warning(t("incomingManage.deliveryNote.fillMeasuredValue"));
        return;
    }

    const params = {
        ArrivalId: inspectForm.ArrivalId,
        Inspector: userStore.getUserInfo,
        Result: inspectForm.MainResult,
        DetailList: inspectForm.Details.map(d => ({
            DetailId: d.DetailId,
            MeasuredValue: d.MeasuredValue,
            Result: d.Result,
        })),
    };

    inspectSubmitting.value = true;
    console.log(params);
    
    try {
        const saveRes:any = await SaveInspectionResult(params);
        if (!saveRes.Success) {
            ElMessage.error(saveRes.Message || "保存检验结果失败");
            return;
        }
        // 提交给WMS
        const submitRes:any = await SubmitInspectionResult({
            ArrivalId: inspectForm.ArrivalId,
            Inspector: userStore.getUserInfo?.UserName || userStore.getUserInfo,
            Result: inspectForm.MainResult,
        });
        if (submitRes.Success) {
            ElMessage.success(submitRes.Message || "检验完成");
            inspectDialogVisible.value = false;
            getData(); // 刷新列表
        } else {
            ElMessage.error(submitRes.Message || "提交WMS失败，请稍后重试");
        }
    } catch {
        ElMessage.error("检验失败");
    } finally {
        inspectSubmitting.value = false;
    }
};

const closeInspectDialog = () => {
    inspectDialogVisible.value = false;
    // 重置表单数据，避免下次打开残留
    inspectForm.ArrivalId = null;
    inspectForm.IQCNo = "";
    inspectForm.ArrivalNo = "";
    inspectForm.MaterialCode = "";
    inspectForm.MaterialName = "";
    inspectForm.MainResult = 0;
    inspectForm.Details = [];
};

// ==================== 二次确认弹窗 ====================
const openReviewDialog = (row: any) => {
    // 加载明细用于展示
    QueryArrivalInspectionDetailList({ ArrivalId: row.ArrivalId }).then((res: any) => {
        if (res.Success) {
            viewDetails.value = res.Data || [];
        } else {
            ElMessage.error(res.Message || "加载明细失败");
        }
    }).catch(() => ElMessage.error("加载明细失败"));

    reviewForm.ArrivalId = row.ArrivalId;
    reviewForm.IQCNo = row.IQCNo;
    reviewForm.ArrivalNo = row.ArrivalNo;
    reviewForm.ReviewResult = 1;
    reviewForm.Remarks = "";
    reviewDialogVisible.value = true;
};

const submitReview = () => {
    reviewFormRef.value.validate(async (valid: boolean) => {
        if (!valid) return;
        const params = {
            ArrivalId: reviewForm.ArrivalId,
            ReviewResult: reviewForm.ReviewResult,
            Remarks: reviewForm.Remarks,
            ReviewUser: userStore.getUserInfo ||'admin',
        };
        reviewSubmitting.value = true;
        console.log(params);
        
        try {
            const res:any = await UpdateReviewResult(params);
            if (res.Success) {
                ElMessage.success(res.Message || "二次确认成功");
                reviewDialogVisible.value = false;
                getData();
            } else {
                ElMessage.error(res.Message || "二次确认失败");
            }
        } catch {
            ElMessage.error("二次确认失败");
        } finally {
            reviewSubmitting.value = false;
        }
    });
};

const closeReviewDialog = () => {
    reviewDialogVisible.value = false;
    reviewFormRef.value?.resetFields();
    viewDetails.value = [];
};

// ==================== 列宽自适应 ====================
const columnWidths1 = computed(() => {
    const columns = [
        { label: t("incomingManage.deliveryNote.iqcNo"), prop: "IQCNo" },
        { label: t("incomingManage.deliveryNote.arrivalNo"), prop: "ArrivalNo" },
        { label: t("incomingManage.deliveryNote.arrivalBatch"), prop: "ArrivalBatch" },
        { label: t("incomingManage.deliveryNote.materialCode"), prop: "MaterialCode" },
        { label: t("incomingManage.deliveryNote.materialName"), prop: "MaterialName" },
        { label: t("incomingManage.deliveryNote.projectName"), prop: "ProjectName" },
        { label: t("incomingManage.testItems.creator"), prop: "CreateUser" },
        { label: t("incomingManage.testItems.creatime"), prop: "CreateTime" },
    ];
    return calculateColumnsWidth(columns, tableData.value, { padding: 25, fontSize: 13 });
});
const getColumnWidth1 = (prop: string) => columnWidths1.value[prop] || "auto";

// 高度自适应
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
onBeforeUnmount(() => window.removeEventListener("resize", getScreenHeight));
</script>

<style scoped>
.el-pagination {
    justify-content: center;
}
</style>