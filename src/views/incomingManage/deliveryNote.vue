<template>
    <div class="p-2 ite">
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
            <el-table :data="tableData" ref="eltableRef" size="small" :style="{ width: '100%' }" :height="tableHeight"
                :tooltip-effect="'dark'" border fit highlight-current-row :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }">
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{ scope.$index + getForm.PageSize * (getForm.PageIndex - 1) + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="t('incomingManage.deliveryNote.iqcNo')" prop="IQCNo"
                    :min-width="getColumnWidth('IQCNo')" fixed />
                <el-table-column :label="t('incomingManage.deliveryNote.arrivalNo')" prop="ArrivalNo"
                    :min-width="getColumnWidth('ArrivalNo')" fixed />
                <el-table-column :label="t('incomingManage.deliveryNote.arrivalBatch')" prop="ArrivalBatch"
                    :min-width="getColumnWidth('ArrivalBatch')" />
                <el-table-column :label="t('incomingManage.deliveryNote.materialCode')" prop="MaterialCode"
                    :min-width="getColumnWidth('MaterialCode')" />
                <el-table-column :label="t('incomingManage.deliveryNote.materialName')" prop="MaterialName"
                    width="200"  show-overflow-tooltip />
                <el-table-column :label="t('incomingManage.deliveryNote.projectName')" prop="ProjectName"
                    :min-width="getColumnWidth('ProjectName')" />
                <el-table-column :label="t('incomingManage.deliveryNote.isDouble')" prop="IsDouble" width="80"
                    align="center">
                    <template #default="{ row }">
                        <span>{{ row.IsDouble === 1 ? t('publicText.yes') : t('publicText.no') }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="t('incomingManage.deliveryNote.arrivalQty')" prop="ArrivalQty" width="100"
                    align="right" />
                <!-- <el-table-column :label="t('incomingManage.deliveryNote.sampleQty')" prop="SampleQty" width="100"
                    align="right" /> -->
                <el-table-column :label="t('incomingManage.deliveryNote.result')" prop="Result" width="100"
                    align="center" fixed="right">
                    <template #default="{ row }">
                        <el-tag :type="getResultType(row.Result)" size="small">{{ getResultText(row.Result) }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column :label="t('incomingManage.deliveryNote.acceptedQty')" prop="AcceptedQty" width="100"
                    align="right" />
                <el-table-column :label="t('incomingManage.deliveryNote.rejectedQty')" prop="RejectedQty" width="100"
                    align="right" />
                <el-table-column :label="t('incomingManage.deliveryNote.inspector')" prop="Inspector"
                    :min-width="getColumnWidth('Inspector')" />
                <el-table-column :label="t('incomingManage.deliveryNote.inspectTime')" prop="InspectTime"
                    :min-width="getColumnWidth('InspectTime')" />
                <el-table-column :label="t('incomingManage.materialReview.reviewStatus')" prop="ReviewStatus" width="100"
                    align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.ReviewStatus === 1 ? 'success' : 'info'" size="small">
                            {{ row.ReviewStatus === 1 ? t('publicText.completed') : t('publicText.notStarted') }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column :label="t('incomingManage.deliveryNote.reviewResult')" prop="ReviewResult" width="110"
                    align="center">
                    <template #default="{ row }">
                        <el-tag v-if="row.ReviewResult !== null && row.ReviewResult !== undefined"
                            :type="getReviewResultType(row.ReviewResult)" size="small">
                            {{ getReviewResultText(row.ReviewResult) }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column :label="t('incomingManage.testItems.creator')" prop="UserName"
                    :min-width="getColumnWidth('UserName')" />
                <el-table-column :label="t('incomingManage.testItems.creatime')" prop="CreateTime"
                    :min-width="getColumnWidth('CreateTime')" />
                <el-table-column :label="$t('publicText.operation')" fixed="right" width="160" align="center">
                    <template #default="{ row }">
                        <el-tooltip effect="dark" :content="row.Result === 0 ? t('incomingManage.deliveryNote.inspect') : t('publicText.detail')"
                            placement="top-start">
                            <el-button type="primary" size="small"
                                @click="openInspectDialog(row)" :icon="row.Result === 0 ? 'Edit' : 'View'">
                            </el-button>
                        </el-tooltip>
                        <el-tooltip effect="dark" :content=" t('incomingManage.deliveryNote.review')"
                            placement="top-start">
                            <el-button type="warning" size="small" @click="openReviewDialog(row)" icon="Check" :disabled="row.Result !== 2||row.ReviewStatus==1"/>
                        </el-tooltip>
                        <el-tooltip effect="dark" :content=" t('publicText.delete')"
                            placement="top-start">
                            <el-button type="danger" size="small" @click="handleDelete(row)" icon="Delete" :disabled="row.Result === 2"/>
                        </el-tooltip>
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

        <!-- 检验弹窗（录入实测值/选择结果） -->
        <el-dialog :title="isInspected ? t('publicText.detail') : t('incomingManage.deliveryNote.inspectTitle')" v-model="inspectDialogVisible" width="1200px"
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
                    <el-input v-model="inspectForm.MaterialName" type="textarea" disabled rows="1"
                        style="width: 100%;" />
                </el-form-item>
                <el-form-item label="附件" style="width: 100%;">
                    <div class="attachment-row">
                        <el-upload :auto-upload="false" :limit="1" :on-change="handleAttachmentChange"
                            :on-remove="handleAttachmentRemove" :on-exceed="handleAttachmentExceed"
                            :file-list="attachmentFileList" accept=".pdf">
                            <el-button type="primary" size="small">选择PDF文件</el-button>
                        </el-upload>
                        <span class="el-upload__tip upload-tip">仅限PDF，最大20MB</span>
                        <template v-if="existingAttachments.length > 0">
                            <el-divider direction="vertical" />
                            <div v-for="file in existingAttachments" :key="file.AttachmentId"
                                class="attachment-item">
                                <el-icon class="file-icon" color="#006487"><Document /></el-icon>
                                <span class="attachment-name" :title="file.OriginalFileName">{{ file.OriginalFileName }}</span>
                                <el-button type="primary" link size="small" @click="previewAttachment(file)">预览</el-button>
                                <el-button type="primary" link size="small" @click="downloadAttachment(file)">下载</el-button>
                            </div>
                        </template>
                    </div>
                </el-form-item>
                <el-form-item :label="t('incomingManage.deliveryNote.result')" style="width: 50%;">
                    <el-select v-model="inspectForm.MainResult" size="small" style="width: 200px" :disabled="isInspected">
                        <el-option :label="t('incomingManage.deliveryNote.qualified')" :value="1" />
                        <el-option :label="t('incomingManage.deliveryNote.unqualified')" :value="2" />
                    </el-select>
                </el-form-item>
                <el-table :data="inspectForm.Details" border size="small" style="width: 100%" height="400">
                    <el-table-column :label="t('incomingManage.inspectionItem.gaugeCode')" prop="InspectionCode"
                        width="120" />
                    <el-table-column :label="t('incomingManage.inspectionItem.gaugeName')" prop="InspectionName"
                        min-width="180" />
                    <el-table-column label="检验项类型" prop="InspectionItemType" width="100" />
                    <el-table-column label="检验工具" prop="InspectionTool" width="100" />
                    <el-table-column label="检测方法" prop="DetectionMethod" width="120" />
                    <el-table-column :label="t('incomingManage.inspectionRule.lowerLimit')" prop="LowerLimit" width="90"
                        align="right" />
                    <el-table-column :label="t('incomingManage.inspectionRule.upperLimit')" prop="UpperLimit" width="90"
                        align="right" />

                    <el-table-column :label="t('incomingManage.inspectionRule.unit')" prop="Unit" width="70" />
                    <!-- 定量检验：显示实测值输入框 -->
                    <el-table-column :label="t('incomingManage.deliveryNote.measuredValue')" width="140">
                        <template #default="{ row }">
                            <el-input-number v-model="row.MeasuredValue" :disabled="isInspected || row.InspectionType !== 2" size="small"
                                :controls="false" style="width: 100%" 
                                @change="() => calculateDetailResult(row)" />
                        </template>
                    </el-table-column>
                    <!-- 检验结果列 -->
                    <el-table-column :label="t('incomingManage.deliveryNote.detailResult')" width="100" align="center">
                        <template #default="{ row }">
                            <!-- 定性检验：手动选择结果 -->
                            <el-select v-if="row.InspectionType === 1" v-model="row.Result" size="small"
                                style="width: 100%" :disabled="isInspected" @change="updateMainResult">
                                <el-option :label="t('incomingManage.deliveryNote.qualified')" :value="1" />
                                <el-option :label="t('incomingManage.deliveryNote.unqualified')" :value="0" />
                            </el-select>
                            <!-- 定量检验：显示自动判定的结果 -->
                            <span v-else>
                                <el-tag :type="row.Result === 1 ? 'success' : 'danger'" size="small">
                                    {{ row.Result === 1 ? t('incomingManage.deliveryNote.qualified') :
                                        t('incomingManage.deliveryNote.unqualified') }}
                                </el-tag>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <template #footer>
                <el-button @click="inspectDialogVisible = false">{{ t("publicText.close") }}</el-button>
                <el-button type="primary" v-if="!isInspected" @click="submitInspect" :loading="inspectSubmitting">{{ t("publicText.confirm")
                    }}</el-button>
            </template>
        </el-dialog>

        <!-- 二次确认（评审）弹窗（保持不变） -->
        <el-dialog :title="t('incomingManage.deliveryNote.reviewTitle')" v-model="reviewDialogVisible" width="1000px"
            @close="closeReviewDialog" align-center :append-to-body="true" :close-on-click-modal="false"
            :close-on-press-escape="false">
            <el-form :model="reviewForm" ref="reviewFormRef" label-width="auto" size="small" :rules="reviewRules"
                :inline="true">
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
                <el-table-column :label="t('incomingManage.inspectionRule.lowerLimit')" prop="LowerLimit" width="90"
                    align="right" />
                <el-table-column :label="t('incomingManage.inspectionRule.upperLimit')" prop="UpperLimit" width="90"
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

        <!-- PDF预览弹窗 -->
        <el-dialog v-model="previewVisible" width="85%" align-center :append-to-body="true"
            :close-on-click-modal="false" @close="closePreview" class="preview-dialog">
            <template #header>
                <div class="preview-header">
                    <el-icon class="preview-icon"><Document /></el-icon>
                    <span class="preview-title" :title="previewFileName">{{ previewFileName }}</span>
                </div>
            </template>
            <div class="preview-body">
                <div v-if="previewLoading" class="preview-loading">
                    <el-icon class="is-loading" :size="40" color="#006487"><Loading /></el-icon>
                    <span class="loading-text">文件加载中...</span>
                </div>
                <VuePdfEmbed v-if="previewUrl" :source="previewUrl"
                    class="pdf-preview-frame" @loaded="previewLoading = false"
                    @loading-failed="handlePreviewFailed" @rendered="previewLoading = false" />
                <el-empty v-if="!previewUrl && !previewLoading" description="暂无文件" />
            </div>
            <template #footer>
                <el-button type="primary" :disabled="!currentPreviewFile" @click="downloadAttachment(currentPreviewFile)">
                    <el-icon style="margin-right: 4px;"><Download /></el-icon>下载
                </el-button>
                <el-button @click="previewVisible = false">{{ t("publicText.close") }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { QueryArrivalInspectionList, QueryArrivalInspectionDetailList, SaveInspectionResult, SubmitInspectionResult, UpdateReviewResult, DeleteArrivalInspection, UploadArrivalAttachment, QueryArrivalAttachment, DownloadArrivalAttachment } from "@/api/incomingManage/index";
import { ref, reactive, computed, nextTick, onMounted, onBeforeUnmount } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Document, Loading, Download } from "@element-plus/icons-vue";
import VuePdfEmbed from "vue-pdf-embed";
import dayjs from "dayjs";
import { useTableColumnWidth } from '@/hooks/useTableColumnWidth';
import { useUserStoreWithOut } from "@/stores/modules/user";
import { useI18n } from "vue-i18n";

const userStore = useUserStoreWithOut();
const { t } = useI18n();
const eltableRef = ref();
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
const isInspected = ref(false);
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
            tableData.value = res.Data.rows.map((item: any) => ({
                ...item,
                CreateTime: dayjs(item.CreateTime).format("YYYY-MM-DD HH:mm:ss"),
                InspectTime: item.InspectTime ? dayjs(item.InspectTime).format("YYYY-MM-DD HH:mm:ss") : "",
            })) || [];
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

const getReviewResultText = (result: number | null) => {
    if (result === null || result === undefined) return "";
    if (result === 0) return t("incomingManage.deliveryReview.concessionAccept");
    if (result === 1) return t("incomingManage.deliveryReview.pickAccept");
    return t("incomingManage.deliveryReview.returnGoods");
};
const getReviewResultType = (result: number | null) => {
    if (result === null || result === undefined) return "info";
    if (result === 0) return "warning";
    if (result === 1) return "primary";
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
                    getData();
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
        const res: any = await QueryArrivalInspectionDetailList({ ArrivalId: row.ArrivalId });
        if (res.Success) {
            const details = (res.Data || []).map((item: any) => ({
                DetailId: item.DetailId,
                InspectionCode: item.InspectionCode,
                InspectionName: item.InspectionName,
                IsInspectionTool: item.IsInspectionTool,
                UpperLimit: item.UpperLimit,
                LowerLimit: item.LowerLimit,
                Unit: item.Unit,
                InspectionType: item.InspectionType,       // 1=定性，2=定量
                InspectionItemType: item.InspectionItemType || '',
                InspectionTool: item.InspectionTool || '',
                DetectionMethod: item.DetectionMethod || '',
                SortNo: item.SortNo,
                MeasuredValue: item.MeasuredValue ?? null,
                Result: row.Result == 0 ? "" : item.Result,
            }));
            inspectForm.ArrivalId = row.ArrivalId;
            inspectForm.IQCNo = row.IQCNo;
            inspectForm.ArrivalNo = row.ArrivalNo;
            inspectForm.MaterialCode = row.MaterialCode;
            inspectForm.MaterialName = row.MaterialName;
            inspectForm.MainResult = row.Result ?? '';
            inspectForm.Details = details;
            isInspected.value = row.Result !== 0;
            attachmentFileList.value = [];
            inspectDialogVisible.value = true;
            loadExistingAttachments();
        } else {
            ElMessage.error(res.Message || "加载明细失败");
        }
    } catch {
        ElMessage.error("加载明细失败");
    }
};

// 定量检验：根据实测值自动判定结果
const calculateDetailResult = (detail: any) => {
    if (detail.InspectionType === 2) {
        const value = detail.MeasuredValue;
        if (value !== null && value !== undefined && !isNaN(value)) {
            let ok = true;
            if (detail.UpperLimit !== null && value > detail.UpperLimit) ok = false;
            if (detail.LowerLimit !== null && value < detail.LowerLimit) ok = false;
            detail.Result = ok ? 1 : 0;
        } else {
            detail.Result = 1; // 未输入时默认合格（但提交时会校验）
        }
        updateMainResult();
    }
};

// 更新主表整体结果
const updateMainResult = () => {
    if (!inspectForm.Details.length) return;
    const allQualified = inspectForm.Details.every(d => d.Result === 1);
    inspectForm.MainResult = allQualified ? 1 : 2;
};

const submitInspect = async () => {
    // 定量检验必须填写实测值，定性检验不需要
    const missing = inspectForm.Details.some(d => d.InspectionType === 2 && (d.MeasuredValue === null || d.MeasuredValue === undefined || isNaN(d.MeasuredValue)));
    if (missing) {
        ElMessage.warning("请填写所有定量检验项的实测值");
        return;
    }
    // 定性检验必须选择结果（但默认已有结果，无需额外校验）

    const params = {
        ArrivalId: inspectForm.ArrivalId,
        Inspector: userStore.getUserInfo,
        Result: inspectForm.MainResult,
        DetailList: inspectForm.Details.map(d => ({
            DetailId: d.DetailId,
            MeasuredValue: d.InspectionType === 2 ? d.MeasuredValue : null,
            Result: d.Result,
        })),
    };

    inspectSubmitting.value = true;
    try {
        const saveRes: any = await SaveInspectionResult(params);
        if (!saveRes.Success) {
            ElMessage.error(saveRes.Message || "保存检验结果失败");
            return;
        }
        const submitRes: any = await SubmitInspectionResult({
            ArrivalId: inspectForm.ArrivalId,
            Inspector: userStore.getUserInfo?.UserName || userStore.getUserInfo,
            Result: inspectForm.MainResult,
        });
        if (submitRes.Success) {
            // 上传附件（如果有）
            if (attachmentFileList.value.length > 0) {
                await uploadAttachment();
            }
            ElMessage.success(submitRes.Message || "检验完成");
            inspectDialogVisible.value = false;
            getData();
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
    isInspected.value = false;
    inspectForm.ArrivalId = null;
    inspectForm.IQCNo = "";
    inspectForm.ArrivalNo = "";
    inspectForm.MaterialCode = "";
    inspectForm.MaterialName = "";
    inspectForm.MainResult = 0;
    inspectForm.Details = [];
    attachmentFileList.value = [];
    existingAttachments.value = [];
};

// ==================== 附件上传 ====================
const attachmentFileList = ref<any[]>([]);
const MAX_ATTACHMENT_SIZE = 20 * 1024 * 1024; // 20MB

const handleAttachmentExceed = () => {
    ElMessage.warning("只能上传一个文件，请先删除已选文件");
};
const handleAttachmentChange = (file: any) => {
    const raw = file.raw as File;
    if (!raw) return;
    if (!raw.name.toLowerCase().endsWith(".pdf")) {
        ElMessage.error("仅限PDF文件");
        attachmentFileList.value = [];
        return;
    }
    if (raw.size > MAX_ATTACHMENT_SIZE) {
        ElMessage.error("文件大小不能超过20MB");
        attachmentFileList.value = [];
        return;
    }
    attachmentFileList.value = [file];
};
const handleAttachmentRemove = () => {
    attachmentFileList.value = [];
};

const uploadAttachment = async () => {
    if (attachmentFileList.value.length === 0 || !inspectForm.ArrivalId) return;
    const formData = new FormData();
    formData.append("file", attachmentFileList.value[0].raw);
    try {
        const res: any = await UploadArrivalAttachment(formData, { ArrivalId: inspectForm.ArrivalId });
        if (res.Success) {
            ElMessage.success(res.Message || "附件上传成功");
            // 上传成功后重新查询附件列表
            await loadExistingAttachments();
        } else {
            ElMessage.error(res.Message || "附件上传失败");
        }
    } catch {
        ElMessage.error("附件上传失败");
    }
};

// ==================== 附件查询/预览/下载 ====================
const existingAttachments = ref<any[]>([]);
const previewVisible = ref(false);
const previewUrl = ref("");
const previewFileName = ref("");
const previewLoading = ref(false);
const currentPreviewFile = ref<any>(null);

// 查询已上传附件
const loadExistingAttachments = async () => {
    if (!inspectForm.ArrivalId) return;
    try {
        const res: any = await QueryArrivalAttachment({ ArrivalId: inspectForm.ArrivalId });
        if (res.Success) {
            existingAttachments.value = res.Data || [];
        } else {
            existingAttachments.value = [];
        }
    } catch {
        existingAttachments.value = [];
    }
};

// 预览附件（PDF）
const previewAttachment = async (file: any) => {
    try {
        currentPreviewFile.value = file;
        previewFileName.value = file.OriginalFileName;
        previewVisible.value = true;
        previewLoading.value = true;
        previewUrl.value = "";
        const blob = await DownloadArrivalAttachment(file.AttachmentId);
        previewUrl.value = window.URL.createObjectURL(blob);
    } catch (e: any) {
        ElMessage.error(e.message || "预览失败");
        previewLoading.value = false;
        previewVisible.value = false;
    }
};

// 下载附件
const downloadAttachment = async (file: any) => {
    try {
        const blob = await DownloadArrivalAttachment(file.AttachmentId);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.OriginalFileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
    } catch (e: any) {
        ElMessage.error(e.message || "下载失败");
    }
};

const handlePreviewFailed = () => {
    ElMessage.error("文件加载失败");
    previewLoading.value = false;
    previewVisible.value = false;
};

const closePreview = () => {
    if (previewUrl.value) {
        window.URL.revokeObjectURL(previewUrl.value);
        previewUrl.value = "";
    }
    previewFileName.value = "";
    previewLoading.value = false;
    currentPreviewFile.value = null;
};

// ==================== 二次确认弹窗（保持不变） ====================
const openReviewDialog = (row: any) => {
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
            ReviewUser: userStore.getUserInfo || 'admin',
        };
        reviewSubmitting.value = true;
        try {
            const res: any = await UpdateReviewResult(params);
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
const { getColumnWidth } = useTableColumnWidth(eltableRef, tableData, {
    excludeLabels: [t('publicText.index'), t('publicText.operation')]
});
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
.attachment-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
}
.upload-tip {
    color: #909399;
    font-size: 12px;
}
.attachment-item {
    display: flex;
    align-items: center;
    gap: 6px;
}
.file-icon {
    font-size: 16px;
}
.attachment-name {
    display: inline-block;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
    color: #303133;
    font-size: 13px;
}

/* ============ PDF预览弹窗样式 ============ */
:deep(.preview-dialog) {
    border-radius: 8px;
    overflow: hidden;
}
:deep(.preview-dialog .el-dialog__header) {
    background: linear-gradient(135deg, #006487 0%, #0088aa 100%);
    padding: 14px 20px;
    margin-right: 0;
    border-bottom: none;
}
:deep(.preview-dialog .el-dialog__headerbtn) {
    top: 14px;
}
:deep(.preview-dialog .el-dialog__headerbtn .el-dialog__close) {
    color: #fff;
    font-size: 18px;
}
:deep(.preview-dialog .el-dialog__headerbtn:hover .el-dialog__close) {
    color: #ffd666;
}
:deep(.preview-dialog .el-dialog__body) {
    padding: 0;
    background: #f5f7fa;
}
:deep(.preview-dialog .el-dialog__footer) {
    padding: 12px 20px;
    border-top: 1px solid #e4e7ed;
    text-align: center;
}

.preview-header {
    display: flex;
    align-items: center;
    gap: 10px;
}
.preview-icon {
    font-size: 20px;
    color: #fff;
}
.preview-title {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    max-width: 70%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.preview-body {
    position: relative;
    width: 100%;
    max-height: 65vh;
    overflow-y: auto;
    background: #f5f7fa;
}
.preview-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 65vh;
    gap: 16px;
}
.loading-text {
    font-size: 14px;
    color: #909399;
}
.pdf-preview-frame {
    width: 100%;
    height: 65vh;
    border: none;
    display: block;
    background: #fff;
}
</style>