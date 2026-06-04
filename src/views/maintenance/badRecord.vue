<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between items-center">
                <el-form ref="formRef" :inline="true" :model="getForm" label-width="auto" @submit.prevent>
                    <el-form-item :label="t('deviceManage.badRecord.timeRange')" class="mb-2">
                        <el-date-picker v-model="dateValue" type="datetimerange"
                            :range-separator="t('deviceManage.badRecord.to')"
                            :start-placeholder="t('deviceManage.badRecord.startDate')"
                            :end-placeholder="t('deviceManage.badRecord.endDate')" size="small" :shortcuts="shortcuts"
                            value-format="YYYY-MM-DD HH:mm:ss" :clearable="false" :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]" />
                    </el-form-item>
                    <el-form-item :label="t('deviceManage.badRecord.snCode')" class="mb-2">
                        <el-input v-model="getForm.SearchModel.baddata_pcbid"
                            :placeholder="t('deviceManage.badRecord.snPlaceholder')" clearable style="width: 300px"
                            size="small" @clear="clearInput" @keyup.enter="clearInput" />
                    </el-form-item>
                    <el-form-item class="mb-2">
                        <el-button type="primary" @click="getData" :size="'small'">{{ t('publicText.query')
                            }}</el-button>
                    </el-form-item>
                </el-form>

                <div class="mb-2">
                    <el-button type="success" @click="openExportDialog" :disabled="tableData.length === 0" :size="'small'">
                        {{ t('publicText.export') }}
                    </el-button>
                </div>
            </div>

            <el-table :data="tableData" ref="repairRoomRef" border :height="tableHeight" style="width: 100%" stripe
                size="small" highlight-current-row tooltip-effect="light">
                <!-- 表格列定义保持不变 -->
                <el-table-column type="index" :label="t('publicText.index')" width="55" fixed="left" align="center">
                    <template #default="{ $index }">
                        {{ $index + 1 + (getForm.PageIndex - 1) * getForm.PageSize }}
                    </template>
                </el-table-column>
                <el-table-column prop="baddata_no" :label="t('deviceManage.badRecord.repairNo')" fixed="left"
                    :min-width="getColumnWidth('baddata_no')">
                    <template #default="{ row }">
                        <span class="underline text-cyan cursor-pointer" @click="handleCellClick(row)">
                            {{ row.baddata_no }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="baddata_pcbid" :label="t('deviceManage.badRecord.productSN')"
                    :min-width="getColumnWidth('baddata_pcbid')" />
                <el-table-column prop="baddata_line" :label="t('deviceManage.badRecord.line')"
                    :min-width="getColumnWidth('baddata_line')" />
                <el-table-column prop="baddatadetail_item" :label="t('deviceManage.badRecord.badLocation')"
                    :min-width="getColumnWidth('baddatadetail_item')" />
                <el-table-column prop="baddatadetail_code" :label="t('deviceManage.badRecord.badCode')"
                    :min-width="getColumnWidth('baddatadetail_code')" />
                <el-table-column prop="badphenomena_value" :label="t('deviceManage.badRecord.badName')"
                    :min-width="getColumnWidth('badphenomena_value')" />
                <el-table-column prop="mfgordername" :label="t('deviceManage.badRecord.workOrderNo')"
                    :min-width="getColumnWidth('mfgordername')" />
                <el-table-column prop="baddata_produtside" :label="t('deviceManage.badRecord.side')"
                    :min-width="getColumnWidth('baddata_produtside')" />
                <el-table-column prop="productname" :label="t('deviceManage.badRecord.productCode')"
                    :min-width="getColumnWidth('productname')" />
                <el-table-column prop="baddata_productname" :label="t('deviceManage.badRecord.productName')"
                    :min-width="getColumnWidth('baddata_productname')" />
                <el-table-column prop="baddata_productdsc" :label="t('deviceManage.badRecord.productDesc')" width="120"
                    show-overflow-tooltip :min-width="getColumnWidth('baddata_productdsc')" />
                <el-table-column prop="baddata_equip" :label="t('deviceManage.badRecord.equipment')"
                    :min-width="getColumnWidth('baddata_equip')" />
                <el-table-column prop="baddata_stts" :label="t('deviceManage.badRecord.status')" align="center"
                    width="100" fixed="right" :min-width="getColumnWidth('baddata_stts')">
                    <template #default="{ row }">
                        <el-tag effect="plain" v-if="row.baddata_stts == '完成维修' || row.baddata_stts == '完成报废'"
                            type="success">
                            {{ row.baddata_stts }}
                        </el-tag>
                        <el-tag effect="plain" v-else-if="row.baddata_stts == '维修中'" type="warning">
                            {{ row.baddata_stts }}
                        </el-tag>
                        <el-tag effect="plain" v-else-if="row.baddata_stts == '未维修'" type="info">
                            {{ row.baddata_stts }}
                        </el-tag>
                        <el-tag effect="dark" v-else type="danger">
                            {{ row.baddata_stts }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="badphenomena_desc" :label="t('deviceManage.badRecord.badDesc')"
                    :min-width="getColumnWidth('badphenomena_desc')" />
                <el-table-column prop="baddatadetail_remark" :label="t('deviceManage.badRecord.badRemark')"
                    :min-width="getColumnWidth('baddatadetail_remark')" />
                <el-table-column prop="baddata_user" :label="t('deviceManage.badRecord.reporter')"
                    :min-width="getColumnWidth('baddata_user')" />
                <el-table-column prop="baddata_datetime" :label="t('deviceManage.badRecord.reportTime')" width="150"
                    :min-width="getColumnWidth('baddata_datetime')" />
                <el-table-column prop="baddata_uuser" :label="t('deviceManage.badRecord.repairer')"
                    :min-width="getColumnWidth('baddata_uuser')" />
                <el-table-column prop="baddata_udatetime" :label="t('deviceManage.badRecord.repairTime')" width="150"
                    :min-width="getColumnWidth('baddata_udatetime')" />
                    <template #empty>
          <div class="flex items-center justify-center h-100%">
            <el-empty />
          </div>
        </template>
            </el-table>

            <div style="margin-top: 8px">
                <el-pagination align="center" background :size="'small'" @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :current-page="getForm.PageIndex"
                    :page-size="getForm.PageSize" :page-sizes="[10, 20, 50, 100, 200]"
                    layout="total,sizes, prev, pager, next" :total="total" />
            </div>
        </el-card>

        <!-- 详情对话框 -->
        <el-dialog :title="`${t('deviceManage.badRecord.repairNoDetail')}：${replaceForm.baddatadetail_pcbid}`"
            v-model="replaceVisible" width="75%" @close="replaceCancel" :append-to-body="true"
            :close-on-click-modal="false"  align-center>
            <!-- 详情内容保持不变 -->
            <el-form :model="replaceForm" label-width="auto" :inline="true">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item :label="t('deviceManage.badRecord.productSN')" class="mb-2">
                            <el-input v-model="replaceForm.containerName" disabled style="width: 270px" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="t('deviceManage.badRecord.workOrderNo')" class="mb-2">
                            <el-input v-model="replaceForm.mfgordername" disabled style="width: 270px" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="t('deviceManage.badRecord.side')" class="mb-2">
                            <el-input v-model="replaceForm.baddata_produtside" disabled style="width: 270px" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item :label="t('deviceManage.badRecord.productCode')" class="mb-2">
                            <el-input v-model="replaceForm.productname" disabled style="width: 270px" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="t('deviceManage.badRecord.productName')" class="mb-2">
                            <el-input v-model="replaceForm.baddata_productname" disabled style="width: 270px" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item :label="t('deviceManage.badRecord.productDesc')" class="mb-2">
                            <el-input v-model="replaceForm.baddata_productdsc" disabled style="width: 645px" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-table :data="replaceForm.tableData" border stripe height="300" size="small">
                    <el-table-column type="index" width="50" :label="t('publicText.index')" align="center" />
                    <el-table-column prop="baddatadetail_item" :label="t('deviceManage.badRecord.badLocation')" />
                    <el-table-column prop="baddatadetail_code" :label="t('deviceManage.badRecord.badCode')" />
                    <el-table-column prop="badphenomena_value" :label="t('deviceManage.badRecord.badName')" />
                </el-table>

                <el-form-item :label="t('deviceManage.badRecord.badRemark')" class="mt-2">
                    <el-input v-model="replaceForm.baddatadetail_remark" disabled type="textarea"
                        style="width: 645px" />
                </el-form-item>
            </el-form>

            <template #footer>
                <el-button @click="replaceCancel">{{ t('publicText.close') }}</el-button>
            </template>
        </el-dialog>

        <!-- 导出选择对话框 -->
        <el-dialog :title="t('deviceManage.badRecord.exportTitle')" v-model="deducedVisible" width="30%"
            @close="deducedVisible = false" :append-to-body="true" :close-on-click-modal="false" >
            <el-select v-model="deducedVal" :placeholder="t('deviceManage.badRecord.selectExportRange')">
                <el-option :label="t('deviceManage.badRecord.currentPage')" :value="'1'" />
                <el-option :label="t('deviceManage.badRecord.allData')" :value="'0'" />
            </el-select>
            <template #footer>
                <el-button @click="deducedVisible = false">{{ t('publicText.cancel') }}</el-button>
                <el-button type="primary" @click="handleExport">{{ t('publicText.confirm') }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onBeforeMount, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import {
    QueryXYL_BadProductInformation,
    QueryXYL_BadProductInformationFromByNo,
} from '@/api/deviceManage/index'
import { exportTableByRef } from "@/utils/exportExcel/generalExportExcel"
import { useExport } from '@/utils/exportExcel/loadingExcel';
import { shortcuts, setTodayDate, setLastDate } from '@/utils/dataMenu'
import { calculateColumnsWidth } from '@/utils/tableminWidth'
import dayjs from 'dayjs'

const { showLoading, hideLoading, handleExportSuccess, handleExportError } = useExport();
const { t } = useI18n()

// ========== 类型定义 ==========
interface SearchModel {
    baddata_pcbid: string
    stts: string
}

interface GetForm {
    PageIndex: number
    PageSize: number
    SearchText: string
    SearchModel: SearchModel
    StartTime: string
    EndTime: string
}

interface BadDetailItem {
    baddatadetail_item: string
    baddatadetail_code: string
    badphenomena_value: string
}

interface ReplaceForm {
    baddatadetail_pcbid: string
    containerName: string
    mfgordername: string
    productname: string
    productvalue: string
    baddata_productname: string
    baddata_productdsc: string
    baddata_produtside: string
    baddatadetail_remark: string
    tableData: BadDetailItem[]
}

interface TableRow {
    baddata_no: string
    baddata_pcbid: string
    baddata_stts: string
    [key: string]: any
}

// ========== 响应式数据 ==========
const dateValue = ref<string[]>([])
const tableData = ref<TableRow[]>([])
const total = ref(0)
const tableHeight = ref(0)
const repairRoomRef = ref()

const getForm = reactive<GetForm>({
    PageIndex: 1,
    PageSize: 50,
    SearchText: '',
    SearchModel: {
        baddata_pcbid: '',
        stts: 'Y',
    },
    StartTime: '',
    EndTime: '',
})

const replaceForm = ref<ReplaceForm>({
    baddatadetail_pcbid: '',
    containerName: '',
    mfgordername: '',
    productname: '',
    productvalue: '',
    baddata_productname: '',
    baddata_productdsc: '',
    baddata_produtside: '',
    baddatadetail_remark: '',
    tableData: [],
})
const replaceVisible = ref(false)

// 导出相关
const deducedVisible = ref(false)
const deducedVal = ref('0')   // '0': 所有, '1': 当前页

// ========== 监听时间范围 ==========
watch(dateValue, (val) => {
    if (val == null || val.length === 0) {
        getForm.StartTime = ''
        getForm.EndTime = ''
    } else {
        getForm.StartTime = val[0]
        getForm.EndTime = val[1]
    }
})

// ========== 表格列宽自动计算 ==========
const tableColumns = computed(() => {
    if (!repairRoomRef.value) return []
    const columns = repairRoomRef.value.columns
        .map((item: any) => ({
            prop: item.property,
            label: item.label,
        }))
        .filter(
            (item: any) =>
                item.label !== t('publicText.index') &&
                item.label !== t('publicText.operation')
        )
    return columns
})

const columnWidths = computed(() => {
    return calculateColumnsWidth(tableColumns.value, tableData.value, { padding: 25, fontSize: 13 })
})

const getColumnWidth = (prop: string) => {
    return columnWidths.value[prop] || 'auto'
}

// ========== 数据获取 ==========
const getData = () => {
    QueryXYL_BadProductInformation(getForm).then((res: any) => {
        if (res.Success) {
            tableData.value = res.Data.list
            total.value = res.Data.Total
        } else {
            tableData.value = []
            total.value = 0
        }
    })
}

const clearInput = () => {
    getForm.PageIndex = 1
    getData()
}

// ========== 导出 Excel ==========
const openExportDialog = () => {
    deducedVisible.value = true
}

const handleExport = async () => {
    deducedVisible.value = false
    showLoading(t('deviceManage.badRecord.exportLoading') || '正在导出表格数据...')
    try {
        let dataToExport = [...tableData.value]
        if (deducedVal.value === '0') {
            // 导出所有数据
            const allForm = {
                ...getForm,
                PageIndex: 1,
                PageSize: total.value,
            }
            const res: any = await QueryXYL_BadProductInformation(allForm)
            if (res.Success) {
                dataToExport = res.Data.list
            } else {
                ElMessage.error(res.Msg || t('deviceManage.badRecord.exportFailed'))
                hideLoading()
                return
            }
        }
        await exportTableByRef(
            repairRoomRef.value,
            dataToExport,
            {
                fileName: `${t('deviceManage.badRecord.exportFileName') || '不良记录表'}`,
                sheetName: t('deviceManage.badRecord.sheetName') || 'Sheet1',
                excludeProps: ['publicText.index', 'publicText.operation'],
                i18nT: t,
            }
        )
        handleExportSuccess(t('deviceManage.badRecord.exportFileName') || '不良记录表')
    } catch (err) {
        handleExportError(err)
    } finally {
        hideLoading()
    }
}

// ========== 详情弹窗 ==========
const handleCellClick = (row: TableRow) => {
    replaceForm.value.baddatadetail_pcbid = row.baddata_no
    replaceForm.value.containerName = row.baddata_pcbid
    replaceForm.value.mfgordername = row.mfgordername
    replaceForm.value.productname = row.productname
    replaceForm.value.baddata_productname = row.baddata_productname
    replaceForm.value.baddata_productdsc = row.baddata_productdsc
    replaceForm.value.baddata_produtside = row.baddata_produtside
    replaceForm.value.baddatadetail_remark = row.baddatadetail_remark

    QueryXYL_BadProductInformationFromByNo({ baddatadetail_no: row.baddata_no }).then((res: any) => {
        replaceForm.value.tableData = res.Data
        replaceVisible.value = true
    })
}

const replaceCancel = () => {
    replaceForm.value.tableData = []
    replaceVisible.value = false
}

// ========== 分页 ==========
const handleSizeChange = (val: number) => {
    getForm.PageSize = val
    getData()
}

const handleCurrentChange = (val: number) => {
    getForm.PageIndex = val
    getData()
}

// ========== 表格高度自适应 ==========
const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 190
    })
}

// ========== 生命周期 ==========
onBeforeMount(() => {
    const yesterday = setLastDate() + ' 00:00:00'
    const today = setTodayDate() + ' 23:59:59'
    dateValue.value = [yesterday, today]
    getForm.StartTime = yesterday
    getForm.EndTime = today
    getScreenHeight()
    getData()
})

onMounted(() => {
    window.addEventListener('resize', getScreenHeight)
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', getScreenHeight)
})
</script>

<style scoped>
.el-pagination {
    justify-content: center;
}
</style>