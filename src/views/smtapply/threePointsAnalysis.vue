<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <el-form ref="formRef" :model="getForm" label-width="auto" :inline="true">
                <el-form-item :label="t('smtapply.threePointsAnalysis.timeRange')" class="mb-1">
                    <el-date-picker v-model="dateValue" type="datetimerange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" size="small" :shortcuts="shortcuts"
                        :disabled-date="disabledDate" value-format="YYYY-MM-DD HH:mm:ss"
                        :default-time="defaultTimeRange" :clearable="false">
                    </el-date-picker>
                </el-form-item>
                <el-form-item :label="t('smtapply.threePointsAnalysis.container')" class="mb-1">
                    <el-input v-model="getForm.Container"
                        :placeholder="t('smtapply.threePointsAnalysis.containerPlaceholder')" style="width: 200px;"
                        size="small" clearable @keyup.enter="handleQuery"></el-input>
                </el-form-item>
                <el-form-item :label="t('smtapply.threePointsAnalysis.workOrder')" class="mb-1">
                    <el-input v-model="getForm.MfgOrder" :placeholder="t('smtapply.threePointsAnalysis.workOrderPlaceholder')"
                        style="width: 200px;" size="small" clearable @keyup.enter="handleQuery"></el-input>
                </el-form-item>
                <el-form-item :label="t('smtapply.threePointsAnalysis.product')" class="mb-1">
                    <el-input v-model="getForm.Product" :placeholder="t('smtapply.threePointsAnalysis.productPlaceholder')"
                        style="width: 200px;" size="small" clearable @keyup.enter="handleQuery"></el-input>
                </el-form-item>
                <el-form-item :label="t('smtapply.threePointsAnalysis.process')" class="mb-1">
                     <el-select v-model="getForm.Process" placeholder=""
                        style="width: 200px;" size="small" clearable>
                        <el-option label="AOI" value="AOI" />
                        <el-option label="SPI" value="SPI" />
                    </el-select>
                    <el-input v-model="getForm.Process" :placeholder="t('smtapply.threePointsAnalysis.processPlaceholder')"
                        style="width: 200px;" size="small" clearable @keyup.enter="handleQuery"></el-input>
                </el-form-item>
                <el-form-item :label="t('smtapply.threePointsAnalysis.status')" class="mb-1">
                    <el-select v-model="getForm.Status" :placeholder="t('smtapply.threePointsAnalysis.statusPlaceholder')"
                        style="width: 200px;" size="small" clearable>
                        <el-option label="OK" value="OK" />
                        <el-option label="NG" value="NG" />
                    </el-select>
                </el-form-item>
                <el-form-item class="mb-1">
                    <el-button type="primary" size="small" @click="handleQuery">{{ t('publicText.query') }}</el-button>
                    <el-button size="small" @click="handleReset">{{ t('publicText.reset') }}</el-button>
                </el-form-item>
            </el-form>

            <el-table :data="tableData" ref="tableRef" border :height="tableHeight"
                style="width: 100%" highlight-current-row size="small" :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }">
                <el-table-column type="index" :label="t('publicText.index')" width="55" align="center" fixed="left">
                    <template #default="{ $index }">
                        <span>{{ $index + getForm.PageSize * (getForm.PageIndex - 1) + 1 }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="Container" :label="t('smtapply.threePointsAnalysis.container')"
                    :min-width="getColumnWidth('Container')" show-overflow-tooltip fixed="left" />
                <el-table-column prop="MfgOrder" :label="t('smtapply.threePointsAnalysis.workOrder')"
                    :min-width="getColumnWidth('MfgOrder')" show-overflow-tooltip fixed="left" />
                <el-table-column prop="Product" :label="t('smtapply.threePointsAnalysis.product')"
                    :min-width="getColumnWidth('Product')" show-overflow-tooltip />
                <el-table-column prop="ProductDescription" :label="t('smtapply.threePointsAnalysis.productDescription')"
                    :min-width="getColumnWidth('ProductDescription')" show-overflow-tooltip />
                <el-table-column prop="BomVer" :label="t('smtapply.threePointsAnalysis.bomVer')"
                    :min-width="getColumnWidth('BomVer')" show-overflow-tooltip />
                <el-table-column prop="Process" :label="t('smtapply.threePointsAnalysis.process')"
                    :min-width="getColumnWidth('Process')" align="center" />
                <el-table-column prop="Status" :label="t('smtapply.threePointsAnalysis.status')" width="90" align="center">
                    <template #default="{ row }">
                        <el-tag v-if="row.Status" :type="isOk(row.Status) ? 'success' : 'danger'" size="small">
                            {{ normalizeStatus(row.Status) }}
                        </el-tag>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column prop="MatchingStatus" :label="t('smtapply.threePointsAnalysis.matchingStatus')"
                    width="100" align="center">
                    <template #default="{ row }">
                        <el-tag v-if="row.MatchingStatus" :type="isOk(row.MatchingStatus) ? 'success' : 'danger'"
                            size="small">
                            {{ normalizeStatus(row.MatchingStatus) }}
                        </el-tag>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column prop="FinalState" :label="t('smtapply.threePointsAnalysis.finalState')" width="100"
                    align="center">
                    <template #default="{ row }">
                        <el-tag v-if="row.FinalState" :type="isOk(row.FinalState) ? 'success' : 'danger'" size="small">
                            {{ normalizeStatus(row.FinalState) }}
                        </el-tag>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column prop="CauseAnalysis" :label="t('smtapply.threePointsAnalysis.causeAnalysis')"
                    :min-width="getColumnWidth('CauseAnalysis')" show-overflow-tooltip />
                <el-table-column prop="Countermeasure" :label="t('smtapply.threePointsAnalysis.countermeasure')"
                    :min-width="getColumnWidth('Countermeasure')" show-overflow-tooltip />
                <el-table-column prop="RecordTime" :label="t('smtapply.threePointsAnalysis.occurrenceTime')" width="160"
                    align="center">
                    <template #default="{ row }">{{ formatTime(row.RecordTime) }}</template>
                </el-table-column>
                <el-table-column prop="UpdateUser" :label="t('smtapply.threePointsAnalysis.analyst')" width="100"
                    align="center" show-overflow-tooltip />
                <el-table-column prop="UpdateTime" :label="t('smtapply.threePointsAnalysis.analysisTime')" width="160"
                    align="center">
                    <template #default="{ row }">{{ formatTime(row.UpdateTime) }}</template>
                </el-table-column>

                <el-table-column :label="t('publicText.operation')" width="180" align="center" fixed="right">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" @click="openDetail(row)" icon="Tickets">{{ t('publicText.detail') }}</el-button>
                        <el-button type="success" size="small" @click="previewTxt(row)" icon="Document">TXT</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="mt-2 flex justify-center">
                <el-pagination background :size="'small'" @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :current-page="getForm.PageIndex" :page-size="getForm.PageSize"
                    :page-sizes="[5, 10, 20, 50, 100]" layout="total,sizes,prev,pager,next" :total="total">
                </el-pagination>
            </div>
        </el-card>

        <el-dialog v-model="detailVisible" :title="`${t('publicText.detail')}: ${currentContainer}`" width="85%">
            <el-table v-loading="detailLoading" :data="detailData" border style="width: 100%" size="small"
                height="400" tooltip-effect="light">
                <el-table-column type="index" :label="t('publicText.index')" width="55" align="center">
                    <template #default="{ $index }">
                        <span>{{ $index + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="Process" :label="t('smtapply.threePointsAnalysis.process')" width="90"
                    align="center" />
                <el-table-column prop="Line" :label="t('smtapply.threePointsAnalysis.line')" width="100" align="center" />
                <el-table-column prop="Equipment" :label="t('smtapply.threePointsAnalysis.equipment')" min-width="120"
                    show-overflow-tooltip />
                <el-table-column prop="ImageName" :label="t('smtapply.threePointsAnalysis.imageName')" min-width="140"
                    show-overflow-tooltip />
                <el-table-column prop="ImageTime" :label="t('smtapply.threePointsAnalysis.imageTime')" width="160"
                    align="center">
                    <template #default="{ row }">{{ formatTime(row.ImageTime) }}</template>
                </el-table-column>
                <el-table-column prop="Status" :label="t('smtapply.threePointsAnalysis.status')" width="80" align="center">
                    <template #default="{ row }">
                        <el-tag v-if="row.Status" :type="isOk(row.Status) ? 'success' : 'danger'" size="small">
                            {{ normalizeStatus(row.Status) }}
                        </el-tag>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column prop="MatchingStatus" :label="t('smtapply.threePointsAnalysis.matchingStatus')" width="90"
                    align="center">
                    <template #default="{ row }">
                        <el-tag v-if="row.MatchingStatus" :type="isOk(row.MatchingStatus) ? 'success' : 'danger'"
                            size="small">
                            {{ normalizeStatus(row.MatchingStatus) }}
                        </el-tag>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column prop="RecordTime" :label="t('smtapply.threePointsAnalysis.recordTime')" width="160"
                    align="center">
                    <template #default="{ row }">{{ formatTime(row.RecordTime) }}</template>
                </el-table-column>
                <el-table-column :label="t('smtapply.threePointsAnalysis.image')" width="110" align="center">
                    <template #default="{ row }">
                        <el-image v-if="row.ImageUrl" :src="row.ImageUrl" lazy style="width: 80px; height: 45px"
                            :preview-src-list="[row.ImageUrl]" :preview-teleported="true" fit="cover">
                            <template #placeholder>
                                <div class="image-placeholder">
                                    <el-icon class="is-loading" :size="18">
                                        <Loading />
                                    </el-icon>
                                </div>
                            </template>
                            <template #error>
                                <div class="image-error">
                                    <el-icon :size="18">
                                        <PictureOutline />
                                    </el-icon>
                                </div>
                            </template>
                        </el-image>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column :label="t('publicText.operation')" width="120" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" icon="Download" :disabled="!row.RecordGuid"
                            @click="downloadOriginalImage(row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-divider />
            <el-form :model="editForm" label-width="auto" class="cause-form">
                <div class="cause-row">
                    <el-form-item :label="t('smtapply.threePointsAnalysis.causeAnalysis')" class="cause-item">
                        <el-input v-model="editForm.CauseAnalysis" type="textarea" :rows="2" maxlength="2000"
                            show-word-limit :placeholder="t('smtapply.threePointsAnalysis.causeAnalysisPlaceholder')" />
                    </el-form-item>
                    <el-form-item :label="t('smtapply.threePointsAnalysis.countermeasure')" class="cause-item">
                        <el-input v-model="editForm.Countermeasure" type="textarea" :rows="2" maxlength="2000"
                            show-word-limit :placeholder="t('smtapply.threePointsAnalysis.countermeasurePlaceholder')" />
                    </el-form-item>
                </div>
                <el-form-item :label="t('smtapply.threePointsAnalysis.finalState')">
                    <el-select v-model="editForm.FinalState" style="width: 160px" size="small" clearable>
                        <el-option label="OK" value="OK" />
                        <el-option label="NG" value="NG" />
                    </el-select>
                </el-form-item>
            </el-form>

            <template #footer>
                <el-button type="primary" size="small" :loading="saveLoading" @click="saveCause">
                    {{ t('publicText.submit') }}
                </el-button>
                <el-button type="success" size="small" @click="downloadTxt({ Container: currentContainer })">
                    {{ t('smtapply.threePointsAnalysis.downloadTxt') }}
                </el-button>
                <el-button size="small" @click="detailVisible = false">{{ t('publicText.close') }}</el-button>
            </template>
        </el-dialog>

        <el-dialog v-model="previewVisible" :title="t('smtapply.threePointsAnalysis.txtPreview')" width="60%">
            <div v-loading="txtLoading" element-loading-text="文件加载中...">
                <el-alert v-if="previewError" :title="previewError" type="error" show-icon style="margin-bottom: 15px">
                </el-alert>
                <div v-if="!previewError && previewContent"
                    class="preview-container bg-gray-50 p-4 rounded border border-gray-200">
                    <pre class="whitespace-pre-wrap break-all font-mono m-0">{{ previewContent }}</pre>
                </div>
                <el-progress v-show="progress > 0 && progress < 100" :percentage="progress" :stroke-width="16"
                    :status="progress === 100 ? 'success' : ''">
                </el-progress>
            </div>
            <template #footer>
                <el-button type="primary" size="small"
                    @click="downloadTxt({ Container: currentContainer })">{{ t('publicText.export') }}</el-button>
                <el-button size="small" @click="previewVisible = false">{{ t('publicText.close') }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage, ElNotification } from 'element-plus';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import { shortcuts, disabledDate } from '@/utils/dataMenu';
import { useUserStoreWithOut } from '@/stores/modules/user';
import { useTableColumnWidth } from '@/hooks/useTableColumnWidth';
import { useTableHeight } from '@/hooks/useTableHeight';
import {
    QuerySummaryPage,
    QueryDetailList,
    SaveCauseAnalysis,
    DownloadOriginalImage,
    DownloadTxt,
    GetTxtContent,
} from '@/api/smtApply/threePointMatching';

const { t } = useI18n();
const userStore = useUserStoreWithOut();

const tableRef = ref();
const loading = ref(false);
const detailLoading = ref(false);
const saveLoading = ref(false);
const tableData = ref<any[]>([]);
const detailData = ref<any[]>([]);
const dateValue = ref<string[]>([]);
const defaultTimeRange = [
    new Date(2000, 0, 1, 0, 0, 0),
    new Date(2000, 0, 1, 23, 59, 59),
];
const total = ref(0);

const getForm = reactive({
    PageIndex: 1,
    PageSize: 20,
    Container: '',
    MfgOrder: '',
    Product: '',
    Process: '',
    Status: '',
});

const detailVisible = ref(false);
const currentContainer = ref('');
const editForm = reactive({
    CauseAnalysis: '',
    Countermeasure: '',
    FinalState: 'OK',
});

const previewVisible = ref(false);
const previewContent = ref('');
const previewError = ref('');
const progress = ref(0);
const txtLoading = ref(false);

const { tableHeight, calcTableHeight } = useTableHeight(tableRef);
const { getColumnWidth } = useTableColumnWidth(tableRef, tableData, {
    excludeLabels: [t('publicText.index'), t('publicText.operation')],
});

const isOk = (val: any) => ['OK', 'GOOD', 'PASS', '合格'].includes(String(val ?? '').toUpperCase());

const normalizeStatus = (val: any) => (isOk(val) ? 'OK' : 'NG');

const formatTime = (val: any) => {
    if (!val) return '-';
    const d = dayjs(val);
    return d.isValid() ? d.format('YYYY-MM-DD HH:mm:ss') : String(val);
};

const refreshDate = () => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    dateValue.value = [
        dayjs(todayStart).format('YYYY-MM-DD HH:mm:ss'),
        dayjs(todayEnd).format('YYYY-MM-DD HH:mm:ss'),
    ];
};

const getData = async () => {
    loading.value = true;
    try {
        const res: any = await QuerySummaryPage({
            Container: getForm.Container,
            MfgOrder: getForm.MfgOrder,
            Product: getForm.Product,
            Process: getForm.Process,
            Status: getForm.Status,
            StartTime: dateValue.value?.[0] || '',
            EndTime: dateValue.value?.[1] || '',
            PageIndex: getForm.PageIndex,
            PageSize: getForm.PageSize,
        });
        tableData.value = res?.Data?.rows || [];
        total.value = res?.Data?.total || 0;
        calcTableHeight();
    } finally {
        loading.value = false;
    }
};

const handleQuery = () => {
    getForm.PageIndex = 1;
    getData();
};

const handleReset = () => {
    getForm.Container = '';
    getForm.MfgOrder = '';
    getForm.Product = '';
    getForm.Process = '';
    getForm.Status = '';
    refreshDate();
    handleQuery();
};

const openDetail = async (row: any) => {
    currentContainer.value = row.Container;
    editForm.CauseAnalysis = row.CauseAnalysis || '';
    editForm.Countermeasure = row.Countermeasure || '';
    editForm.FinalState = row.FinalState || 'OK';
    detailData.value = [];
    detailVisible.value = true;
    detailLoading.value = true;
    try {
        const res: any = await QueryDetailList({
            Container: row.Container,
            PageIndex: 1,
            PageSize: 500,
        });
        detailData.value = res?.Data?.rows || [];
    } finally {
        detailLoading.value = false;
    }
};

const saveCause = async () => {
    if (!editForm.CauseAnalysis) {
        ElMessage.warning(t('smtapply.threePointsAnalysis.causeAnalysisRequired'));
        return;
    }
    saveLoading.value = true;
    try {
        const res: any = await SaveCauseAnalysis({
            Container: currentContainer.value,
            CauseAnalysis: editForm.CauseAnalysis,
            Countermeasure: editForm.Countermeasure,
            FinalState: editForm.FinalState,
            UpdateUser: userStore.getUserInfo || '',
        });
        if (res && res.Success) {
            ElNotification({
                title: t('publicText.tipTitle'),
                message: res.Message || t('smtapply.threePointsAnalysis.saveSuccess'),
                type: 'success',
            });
            detailVisible.value = false;
            getData();
        } else {
            ElMessage.error(res?.Message || t('smtapply.threePointsAnalysis.saveFailed'));
        }
    } finally {
        saveLoading.value = false;
    }
};

const saveBlob = (blob: Blob, fileName: string) => {
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
};

const downloadOriginalImage = async (row: any) => {
    if (!row.RecordGuid) {
        ElMessage.warning(t('publicText.isEmpty'));
        return;
    }
    try {
        const blob = await DownloadOriginalImage(row.RecordGuid);
        const fileName = row.ImageName || `${row.RecordGuid}.jpg`;
        saveBlob(blob, fileName);
    } catch (error: any) {
        ElMessage.error(error?.message || t('smtapply.threePointsAnalysis.downloadFailed'));
    }
};

const downloadTxt = async (row: any) => {
    if (!row.Container) {
        ElMessage.warning(t('publicText.isEmpty'));
        return;
    }
    try {
        const blob = await DownloadTxt(row.Container);
        saveBlob(blob, `${row.Container}_ThreePointMatching.txt`);
    } catch (error: any) {
        ElMessage.error(error?.message || t('smtapply.threePointsAnalysis.downloadFailed'));
    }
};

const previewTxt = (row: any) => {
    if (!row.Container) {
        ElMessage.warning(t('publicText.isEmpty'));
        return;
    }
    currentContainer.value = row.Container;
    previewVisible.value = true;
    previewContent.value = '';
    previewError.value = '';
    progress.value = 0;
    txtLoading.value = true;

    const progressInterval = setInterval(() => {
        if (progress.value < 90) {
            progress.value += 10;
        }
    }, 200);

    GetTxtContent(row.Container)
        .then((text) => {
            clearInterval(progressInterval);
            progress.value = 100;
            setTimeout(() => {
                previewContent.value = text;
            }, 300);
        })
        .catch((error) => {
            clearInterval(progressInterval);
            progress.value = 100;
            previewError.value = error.message || t('smtapply.threePointsAnalysis.downloadFailed');
        })
        .finally(() => {
            txtLoading.value = false;
        });
};

const handleSizeChange = (value: number) => {
    getForm.PageSize = value;
    getData();
};

const handleCurrentChange = (value: number) => {
    getForm.PageIndex = value;
    getData();
};

refreshDate();
getData();
</script>

<style lang="scss" scoped>
.cause-form {
    padding-top: 4px;
}

.cause-row {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
}

.cause-item {
    flex: 1 1 0;
    min-width: 0;
}

.cause-item :deep(.el-textarea__inner) {
    width: 100%;
}

.image-placeholder,
.image-error {
    width: 80px;
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f5f7fa;
    color: #909399;
}

.image-error {
    background: #fef0f0;
    color: #f56c6c;
}

.preview-container {
    max-height: 60vh;
    overflow: auto;
}

:deep(.el-dialog) {
    display: flex;
    flex-direction: column;
    margin: 0 !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-height: calc(100% - 30px);
    max-width: calc(100% - 30px);
}

:deep(.el-dialog .el-dialog__body) {
    flex: 1;
    overflow: auto;
    min-height: 0;
}
</style>
