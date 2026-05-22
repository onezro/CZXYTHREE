<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between">
                <el-form ref="formRef" :model="getForm" label-width="auto" :inline="true" :size="'small'"
                    @submit.native.prevent>
                    <el-form-item :label="t('incomingManage.materialReview.reviewNo')" prop="reviewNo" class="mb-2">
                        <el-input v-model="getForm.ReviewNo"
                            :placeholder="t('incomingManage.materialReview.reviewNoPlaceholder')" clearable
                            @clear="searchData" @keyup.enter.native="searchData" style="width: 180px" />
                    </el-form-item>
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
                    <el-form-item :label="t('incomingManage.materialReview.reviewResult')" prop="reviewResult"
                        class="mb-2">
                        <el-select v-model="getForm.ReviewResult" clearable
                            :placeholder="t('incomingManage.materialReview.reviewResultPlaceholder')"
                            style="width: 150px">
                            <el-option :label="t('incomingManage.materialReview.concessionAccept')" :value="0" />
                            <el-option :label="t('incomingManage.materialReview.pickAccept')" :value="1" />
                            <el-option :label="t('incomingManage.materialReview.returnGoods')" :value="2" />
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
                <el-table-column :label="t('incomingManage.materialReview.reviewNo')" prop="ReviewNo"
                    :min-width="getColumnWidth1('ReviewNo')" fixed />
                <el-table-column :label="t('incomingManage.deliveryNote.iqcNo')" prop="IQCNo"
                    :min-width="getColumnWidth1('IQCNo')" />
                <el-table-column :label="t('incomingManage.deliveryNote.arrivalNo')" prop="ArrivalNo"
                    :min-width="getColumnWidth1('ArrivalNo')" />
                <el-table-column :label="t('incomingManage.deliveryNote.materialCode')" prop="MaterialCode"
                    :min-width="getColumnWidth1('MaterialCode')" />
                <el-table-column :label="t('incomingManage.deliveryNote.materialName')" prop="MaterialName"
                  width="200" show-overflow-tooltip />
                <el-table-column :label="t('incomingManage.deliveryNote.projectName')" prop="ProjectName"
                    :min-width="getColumnWidth1('ProjectName')" />
                <el-table-column :label="t('incomingManage.deliveryNote.arrivalQty')" prop="ArrivalQty" width="100"
                    align="right" />
                <el-table-column :label="t('incomingManage.materialReview.acceptedQty')" prop="AcceptedQty" width="100"
                    align="right" />
                <el-table-column :label="t('incomingManage.materialReview.rejectedQty')" prop="RejectedQty" width="100"
                    align="right" />
                <el-table-column :label="t('incomingManage.materialReview.reviewResult')" prop="ReviewResult"
                    width="120" align="center">
                    <template #default="{ row }">
                        <el-tag :type="getReviewResultType(row.ReviewResult)" size="small">
                            {{ getReviewResultText(row.ReviewResult) }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column :label="t('incomingManage.deliveryNote.remarks')" prop="Remarks" min-width="120"
                    show-overflow-tooltip />
                <el-table-column :label="t('incomingManage.materialReview.ngAuditUser')" prop="NgAuditUser"
                    width="100" />
                <el-table-column :label="t('incomingManage.materialReview.ngAuditDate')" prop="NgAuditDate"
                    width="160" />
                <el-table-column :label="t('incomingManage.testItems.creator')" prop="CreateUser" width="100" />
                <el-table-column :label="t('incomingManage.testItems.creatime')" prop="CreateTime" width="160" />
                <el-table-column :label="$t('publicText.operation')" fixed="right" width="80" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" @click="openReviewDialog(row)">
                            {{ t('incomingManage.materialReview.review') }}
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

        <!-- 评审弹窗 -->
        <el-dialog :title="t('incomingManage.materialReview.reviewTitle')" v-model="reviewDialogVisible" width="1000px"
            @close="closeReviewDialog" align-center :append-to-body="true" :close-on-click-modal="false"
            :close-on-press-escape="false">
            <el-form :model="reviewForm" ref="reviewFormRef" label-width="auto" :inline="true" size="small" :rules="reviewRules">
                <el-form-item :label="t('incomingManage.materialReview.reviewNo')">
                    <el-input v-model="reviewForm.ReviewNo" disabled style="width: 200px" />
                </el-form-item>
                <el-form-item :label="t('incomingManage.deliveryNote.iqcNo')">
                    <el-input v-model="reviewForm.IQCNo" disabled style="width: 200px" />
                </el-form-item>
                <el-form-item :label="t('incomingManage.deliveryNote.arrivalNo')">
                    <el-input v-model="reviewForm.ArrivalNo" disabled style="width: 200px" />
                </el-form-item>
                <el-form-item :label="t('incomingManage.deliveryNote.materialCode')">
                    <el-input v-model="reviewForm.MaterialCode" disabled style="width: 200px" />
                </el-form-item>
                <el-form-item :label="t('incomingManage.deliveryNote.materialName')">
                    <el-input v-model="reviewForm.MaterialName" disabled style="width: 510px" />
                </el-form-item>

                <el-form-item :label="t('incomingManage.deliveryNote.arrivalQty')">
                    <el-input v-model="reviewForm.ArrivalQty" disabled style="width: 200px" />
                </el-form-item>

                <el-form-item :label="t('incomingManage.materialReview.acceptedQty')" prop="AcceptedQty">
                    <el-input-number v-model="reviewForm.AcceptedQty" size="small" :controls="false" style="width: 100%"
                        :min="0"  />
                </el-form-item>

                <el-form-item :label="t('incomingManage.materialReview.rejectedQty')" prop="RejectedQty">
                    <el-input-number v-model="reviewForm.RejectedQty" size="small" :controls="false" style="width: 100%"
                        :min="0"  />
                </el-form-item>


                <el-form-item :label="t('incomingManage.materialReview.reviewResult')" prop="ReviewResult">
                    <el-select v-model="reviewForm.ReviewResult" style="width: 200px" disabled>
                        <el-option :label="t('incomingManage.materialReview.concessionAccept')" :value="0" />
                        <el-option :label="t('incomingManage.materialReview.pickAccept')" :value="1" />
                        <el-option :label="t('incomingManage.materialReview.returnGoods')" :value="2" />
                    </el-select>
                </el-form-item>


                <el-form-item :label="t('incomingManage.deliveryNote.remarks')" prop="Remarks">
                    <el-input v-model="reviewForm.Remarks" type="textarea" :rows="2" style="width: 510px"
                        :placeholder="t('incomingManage.materialReview.remarksPlaceholder')" />
                </el-form-item>



                <!-- <div class="detail-title">{{ t('incomingManage.materialReview.inspectionDetails') }}</div> -->
                <el-table :data="reviewForm.Details" border size="small" style="width: 100%" height="300">
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
                    <el-table-column :label="t('incomingManage.deliveryNote.measuredValue')" prop="MeasuredValue"
                        width="120" align="right" />
                    <el-table-column :label="t('incomingManage.deliveryNote.detailResult')" width="100" align="center">
                        <template #default="{ row }">{{ row.Result === 1 ? t('incomingManage.deliveryNote.qualified') :
                            t('incomingManage.deliveryNote.unqualified') }}</template>
                    </el-table-column>
                </el-table>
            </el-form>
            <template #footer>
                <el-button @click="reviewDialogVisible = false">{{ t("publicText.cancel") }}</el-button>
                <el-button type="primary" @click="submitReview" :loading="reviewSubmitting">{{ t("publicText.confirm")
                    }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { QueryInspectionReviewList, QueryInspectionReviewDetailList, SaveInspectionReview } from "@/api/incomingManage/index";
import { calculateColumnsWidth } from "@/utils/tableminWidth";
import { ref, reactive, computed, nextTick, onMounted, onBeforeUnmount } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { useI18n } from "vue-i18n";
import dayjs from "dayjs";
const userStore = useUserStoreWithOut();
const { t } = useI18n();

// 表格高度自适应
const tableHeight = ref(0);
const tableData = ref<any[]>([]);
const total = ref(0);
const getForm = reactive({
    PageIndex: 1,
    PageSize: 50,
    ReviewNo: "",
    IQCNo: "",
    ArrivalNo: "",
    ReviewResult: undefined as number | undefined,
});

// 评审弹窗
const reviewDialogVisible = ref(false);
const reviewSubmitting = ref(false);
const reviewFormRef = ref();
const reviewForm = reactive({
    ReviewId: null as number | null,
    ReviewNo: "",
    IQCNo: "",
    ArrivalNo: "",
    MaterialCode: "",
    MaterialName: "",
    ArrivalQty: 0,
    AcceptedQty: 0,
    RejectedQty: 0,
    ReviewResult: 0,
    Remarks: "",
    Details: [] as any[],
});

const reviewRules = {
    ReviewResult: [{ required: true, message: "请选择评审结果", trigger: "change" }],
    AcceptedQty: [{ required: true, message: "请输入允收数量", trigger: "blur" }],
    RejectedQty: [{ required: true, message: "请输入拒收数量", trigger: "blur" }],
};

// ==================== API 调用 ====================
const getData = () => {
    QueryInspectionReviewList(getForm).then((res: any) => {
        if (res.Success) {
            total.value = res.Data.total;
            tableData.value = res.Data.rows.map((item: any) => ({
                ...item,
                CreateTime: item.CreateTime ? dayjs(item.CreateTime).format("YYYY-MM-DD HH:mm:ss") : "",
                NgAuditDate: item.NgAuditDate ? dayjs(item.NgAuditDate).format("YYYY-MM-DD HH:mm:ss") : "",
            }));
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

// 辅助函数：评审结果文本/标签类型
const getReviewResultText = (result: number) => {
    if (result === 0) return t("incomingManage.materialReview.concessionAccept");
    if (result === 1) return t("incomingManage.materialReview.pickAccept");
    return t("incomingManage.materialReview.returnGoods");
};
const getReviewResultType = (result: number) => {
    if (result === 0) return "warning";
    if (result === 1) return "success";
    return "danger";
};

// ==================== 评审弹窗逻辑 ====================
const openReviewDialog = async (row: any) => {
    try {
        // 加载检验明细
        const detailRes: any = await QueryInspectionReviewDetailList({ ReviewId: row.ReviewId });
        if (!detailRes.Success) {
            ElMessage.error(detailRes.Message || "加载明细失败");
            return;
        }
        const details = (detailRes.Data || []).map((item: any) => ({
            DetailId: item.DetailId,
            InspectionCode: item.InspectionCode,
            InspectionName: item.InspectionName,
            IsInspectionTool: item.IsInspectionTool,
            UpperLimit: item.UpperLimit,
            LowerLimit: item.LowerLimit,
            Unit: item.Unit,
            MeasuredValue: item.MeasuredValue,
            Result: item.Result,
        }));

        reviewForm.ReviewId = row.ReviewId;
        reviewForm.ReviewNo = row.ReviewNo;
        reviewForm.IQCNo = row.IQCNo;
        reviewForm.ArrivalNo = row.ArrivalNo;
        reviewForm.MaterialCode = row.MaterialCode;
        reviewForm.MaterialName = row.MaterialName;
        reviewForm.ArrivalQty = row.ArrivalQty;
        reviewForm.AcceptedQty = row.AcceptedQty ?? 0;
        reviewForm.RejectedQty = row.RejectedQty ?? 0;
        reviewForm.ReviewResult = row.ReviewResult ?? 0;
        reviewForm.Remarks = row.Remarks ?? "";
        reviewForm.Details = details;
        reviewDialogVisible.value = true;
    } catch {
        ElMessage.error("加载评审详情失败");
    }
};

const submitReview = () => {
    reviewFormRef.value.validate(async (valid: boolean) => {
        if (!valid) return;

        // 校验允收+拒收不能超过到货数量
        if (reviewForm.AcceptedQty + reviewForm.RejectedQty > reviewForm.ArrivalQty) {
            ElMessage.warning(t("incomingManage.materialReview.qtyExceedWarning"));
            return;
        }

        const params = {
            ReviewId: reviewForm.ReviewId,
            AcceptedQty: reviewForm.AcceptedQty,
            RejectedQty: reviewForm.RejectedQty,
            ReviewResult: reviewForm.ReviewResult,
            Remarks: reviewForm.Remarks,
            InspectionUser: userStore.getUserInfo || "",
            NgAuditUser: userStore.getUserInfo || "admin",
            NgAuditDate: new Date().toISOString(),
            Details: reviewForm.Details.map((d: any) => ({
                DetailId: d.DetailId,
                MeasuredValue: d.MeasuredValue,
                Result: d.Result,
            })),
        };

        reviewSubmitting.value = true;
        try {
            const res: any = await SaveInspectionReview(params);
            if (res.Success) {
                ElMessage.success(res.Message || "评审保存成功");
                reviewDialogVisible.value = false;
                getData(); // 刷新列表
            } else {
                ElMessage.error(res.Message || "评审保存失败");
            }
        } catch {
            ElMessage.error("评审保存失败");
        } finally {
            reviewSubmitting.value = false;
        }
    });
};

const closeReviewDialog = () => {
    reviewDialogVisible.value = false;
    reviewFormRef.value?.resetFields();
};

// ==================== 列宽自适应 ====================
const columnWidths1 = computed(() => {
    const columns = [
        { label: t("incomingManage.materialReview.reviewNo"), prop: "ReviewNo" },
        { label: t("incomingManage.deliveryNote.iqcNo"), prop: "IQCNo" },
        { label: t("incomingManage.deliveryNote.arrivalNo"), prop: "ArrivalNo" },
        { label: t("incomingManage.deliveryNote.materialCode"), prop: "MaterialCode" },
        { label: t("incomingManage.deliveryNote.materialName"), prop: "MaterialName" },
        { label: t("incomingManage.deliveryNote.projectName"), prop: "ProjectName" },
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

.detail-title {
    font-size: 14px;
    font-weight: 500;
    margin: 16px 0 8px 0;
    color: #606266;
}
</style>