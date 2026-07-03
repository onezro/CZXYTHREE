<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">

            <el-form ref="formRef" :model="getForm" label-width="auto" :inline="true">
                <el-form-item label="时间范围" class="mb-2">
                    <el-date-picker v-model="dateValue" type="datetimerange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" size="small" :shortcuts="shortcuts"
                        :disabled-date="disabledDate" value-format="YYYY-MM-DD HH:mm:ss"
                        :default-time="['00:00:00', '23:59:59']" :clearable="false">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="条码" class="mb-2"><el-input v-model="getForm.SearchText" placeholder="请输入条码"
                        style="width: 300px;" size="small" clearable @keyup.enter="getData"
                        @clear="handleClear"  ></el-input></el-form-item>
                <el-form-item class="mb-2">
                    <el-button type="primary" size="small" @click="getData" >{{ t('publicText.query')
                    }}</el-button>
                </el-form-item>
            </el-form>

            <el-table :data="tableData" ref="imageTable" border :height="tableHeight" style="width: 100%"
                highlight-current-row size="small" >
                <el-table-column type="index" :label="t('publicText.index')" width="55" align="center">
                    <template #default="{ $index }">
                        <span>{{ $index + getForm.PageSize * (getForm.PageIndex - 1) + 1 }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="tpm_container" :label="t('smtapply.threePoints.barcode')" />
                <el-table-column prop="tpm_mfgorder" :label="t('smtapply.threePoints.workOrder')" />
                <el-table-column prop="tpm_stts" :label="t('smtapply.threePoints.equipmentJudgment')" align="center"
                    width="100">
                </el-table-column>
                <el-table-column prop="tpm_stts2" :label="t('smtapply.threePoints.manualJudgment')" align="center"
                    width="100">
                </el-table-column>

                <el-table-column :label="t('publicText.detail')" width="120" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" @click="rowClick(row)" icon="Tickets"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="mt-3 flex justify-center">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="getForm.PageIndex" :page-size="getForm.PageSize" :page-sizes="[5, 10, 20, 50, 100]"
                    layout="total,sizes,prev,pager,next" :total="total">
                </el-pagination>
            </div>
        </el-card>

        <el-dialog v-model="previewVisible" :title="t('smtapply.threePoints.filePreview')" width="60%">
            <div v-loading="progress < 100" element-loading-text="文件加载中...">
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
                <el-button type="primary" size="small" @click="downloadFile(previewUrl)">{{ t('publicText.export')
                    }}</el-button>
                <el-button size="small" @click="previewVisible = false">{{ t('publicText.close') }}</el-button>
            </template>
        </el-dialog>

        <el-dialog v-model="detailVisible" :title="`${t('publicText.detail')}: ${container}`" width="75%">
            <el-table :data="tableData2" border style="width: 100%" size="small" height="450" tooltip-effect="light">
                <el-table-column type="index" :label="t('publicText.index')" width="55" align="center">
                    <template #default="{ $index }">
                        <span>{{ $index + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="tpm_equip" :label="t('smtapply.threePoints.equipmentName')" width="80"
                    align="center" />
                <el-table-column prop="tpm_line" :label="t('smtapply.threePoints.line')" width="80" align="center" />
                <el-table-column prop="tpm_productname" :label="t('smtapply.threePoints.product')" />
                <el-table-column prop="tpm_productdsc" :label="t('smtapply.threePoints.productDesc')"
                    show-overflow-tooltip />
                <el-table-column prop="tpm_position" :label="t('smtapply.threePoints.position')" />
                <el-table-column prop="tpm_createuser" :label="t('smtapply.threePoints.createEquipment')" />
                <el-table-column prop="tpm_logtime" :label="t('smtapply.threePoints.createTime')" width="150" />
                <el-table-column prop="tpm_stts" :label="t('smtapply.threePoints.equipmentJudgment')" align="center"
                    width="80" />
                <el-table-column prop="tpm_stts2" :label="t('smtapply.threePoints.manualJudgment')" align="center"
                    width="80" />

                <el-table-column :label="t('smtapply.threePoints.image')" width="100" align="center">
                    <template #default="{ row }">
                        <el-image :src="row.tpm_imgno" lazy style="width: 60px; height: 33.35px"
                            :preview-src-list="[row.tpm_imgno]"  :preview-teleported="true">
                            <template #placeholder>
                                <div class="image-placeholder">
                                    <el-icon :size="20">
                                        <Loading />
                                    </el-icon>
                                </div>
                            </template>
                            <template #error>
                                <div class="image-error">
                                    <el-icon :size="20">
                                        <PictureOutline />
                                    </el-icon>
                                </div>
                            </template>
                        </el-image>
                    </template>
                </el-table-column>

                <el-table-column :label="t('publicText.operation')" width="120" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" @click="previewFile(row.tpm_logno)" icon="View"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <template #footer>
                <el-button size="small" @click="detailVisible = false">{{ t('publicText.close') }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import { shortcuts, disabledDate } from '@/utils/dataMenu';
import { QueryXYL_ThreePointMatchingDetailFinalStateInfo, QueryXYL_ThreePointMatchingDetailInfo } from '@/api/smtApply/threePoints';

const { t } = useI18n();

const loading = ref(false);
const tableData = ref<any[]>([]);
const tableData2 = ref<any[]>([]);
const tableHeight = ref(0);
const dateValue = ref<string[]>([]);
const total = ref(0);

const getForm = reactive({
    PageIndex: 1,
    PageSize: 20,
    SearchText: '',
    StartTime: '',
    EndTime: '',
});


const previewVisible = ref(false);
const previewUrl = ref('');
const previewContent = ref('');
const progress = ref(0);
const previewError = ref('');

const detailVisible = ref(false);
const container = ref('');

const refreshDate = () => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    dateValue.value = [
        dayjs(todayStart).format('YYYY-MM-DD HH:mm:ss'),
        dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    ];
};

const handleClear = () => {
    getForm.SearchText = '';
    getData();
};

const getData = async () => {
    loading.value = true;
    tableData2.value = [];
    try {
        const res: any = await QueryXYL_ThreePointMatchingDetailFinalStateInfo(getForm);
        tableData.value = res.Data.list.map((item: any) => ({
            ...item,
            tpm_imgno: `${item.tpm_imgno}`,
            tpm_logno: `${item.tpm_logno}`,
        }));
        total.value = res.Data.Total;
    } finally {
        loading.value = false;
    }
};

const previewFile = (url: string) => {
    if (!url) {
        ElMessage.warning('文件路径不存在');
        return;
    }
    previewVisible.value = true;
    previewUrl.value = url;
    previewContent.value = '';
    previewError.value = '';
    progress.value = 0;

    const progressInterval = setInterval(() => {
        if (progress.value < 90) {
            progress.value += 10;
        }
    }, 200);

    fetch(url)
        .then((response) => {
            if (!response.ok) throw new Error('文件加载失败');
            return response.text();
        })
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
            previewError.value = error.message || '无法加载文件内容';
        });
};

const downloadFile = (url: string) => {
    if (!url) {
        ElMessage.warning('文件路径不存在');
        return;
    }

    const fileName = url.split('/').pop();
    ElMessage.info(`开始下载: ${fileName}`);

    fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = fileName || '';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
            ElMessage.success(`文件下载成功: ${fileName}`);
        })
        .catch((error) => {
            ElMessage.error(`文件下载失败: ${error.message}`);
        });
};

const rowClick = async (val: any) => {
    container.value = val.tpm_container;
    const res: any = await QueryXYL_ThreePointMatchingDetailInfo({ Container: val.tpm_container });
    tableData2.value = res.Data.map((item: any) => ({
        ...item,
        tpm_stts: item.tpm_stts === 'GOOD' || item.tpm_stts === 'OK' ? 'OK' : 'NG',
        tpm_stts2: item.tpm_stts2 === 'GOOD' || item.tpm_stts2 === 'OK' ? 'OK' : 'NG',
    }));
    detailVisible.value = true;
};

const handleSizeChange = (value: number) => {
    getForm.PageSize = value;
    getData();
};

const handleCurrentChange = (value: number) => {
    getForm.PageIndex = value;
    getData();
};

const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 210;
    });
};

watch(dateValue, (value) => {
    if (!value) {
        getForm.StartTime = '';
        getForm.EndTime = '';
    } else {
        getForm.StartTime = value[0];
        getForm.EndTime = value[1];
    }
    getForm.PageIndex = 1;
    getData();
});

onMounted(() => {
    refreshDate();
    getScreenHeight();
    window.addEventListener('resize', getScreenHeight);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', getScreenHeight);
});
</script>

<style lang="scss" scoped>
.preview-container {
    max-height: 60vh;
    overflow: auto;
}

.image-placeholder,
.image-error {
    width: 60px;
    height: 33.3px;
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
}
</style>