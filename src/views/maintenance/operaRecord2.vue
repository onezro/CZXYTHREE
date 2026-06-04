<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between">
                <el-form ref="formRef" :model="getForm" :inline="true" label-width="auto" @submit.prevent>
                    <el-form-item :label="t('deviceManage.operaRecord.timeRange')" class="mb-2">
                        <el-date-picker v-model="dateValue" type="datetimerange"
                            :range-separator="t('deviceManage.operaRecord.to')"
                            :start-placeholder="t('deviceManage.operaRecord.startDate')"
                            :end-placeholder="t('deviceManage.operaRecord.endDate')" size="small" :shortcuts="shortcuts"
                            value-format="YYYY-MM-DD HH:mm:ss" :clearable="false"
                            :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]" />
                    </el-form-item>
                    <el-form-item :label="t('deviceManage.operaRecord.snCode')" class="mb-2">
                        <el-input v-model="getForm.SearchModel.pcbid"
                            :placeholder="t('deviceManage.operaRecord.snPlaceholder')" clearable style="width: 300px"
                            size="small" @clear="clearInput" @keyup.enter="clearInput" />
                    </el-form-item>
                    <el-form-item class="mb-2">
                        <el-button type="primary" @click="getData" :size="'small'">{{ t('publicText.query')
                            }}</el-button>
                    </el-form-item>
                </el-form>
                <div class="mb-2">
                    <el-button type="success" @click="openExportDialog" :disabled="tableData.length === 0"
                        :size="'small'">
                        {{ t('publicText.export') }}
                    </el-button>
                </div>
            </div>

            <el-table :data="tableData" border :height="tableHeight" style="width: 100%" stripe size="small"
                ref="operaRecordRef" highlight-current-row tooltip-effect="light">
                <el-table-column type="index" :label="t('publicText.index')" width="55" fixed="left" align="center">
                    <template #default="{ $index }">
                        {{ $index + 1 + (getForm.PageIndex - 1) * getForm.PageSize }}
                    </template>
                </el-table-column>

                <el-table-column prop="repair_no" :label="t('deviceManage.operaRecord.repairNo')" fixed="left"
                    :min-width="getColumnWidth('repair_no')">
                    <template #default="{ row }">
                        <span class="underline text-cyan cursor-pointer" @click="handleCellClick(row)">
                            {{ row.repair_no }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="repair_badno" :label="t('deviceManage.operaRecord.reportNo')"
                    :min-width="getColumnWidth('repair_badno')" />
                <el-table-column prop="baddata_pcbid" :label="t('deviceManage.operaRecord.productSN')"
                    :min-width="getColumnWidth('baddata_pcbid')" />
                <el-table-column prop="baddata_line" :label="t('deviceManage.operaRecord.line')"
                    :min-width="getColumnWidth('baddata_line')" />
                <el-table-column prop="baddatadetail_item" :label="t('deviceManage.operaRecord.badLocation')"
                    :min-width="getColumnWidth('baddatadetail_item')" />
                <el-table-column prop="baddatadetail_code" :label="t('deviceManage.operaRecord.badCode')"
                    :min-width="getColumnWidth('baddatadetail_code')" />
                <el-table-column prop="badphenomena_value" :label="t('deviceManage.operaRecord.badName')"
                    :min-width="getColumnWidth('badphenomena_value')" />
                <el-table-column prop="mfgordername" :label="t('deviceManage.operaRecord.workOrderNo')"
                    :min-width="getColumnWidth('mfgordername')" />
                <el-table-column prop="baddata_produtside" :label="t('deviceManage.operaRecord.side')"
                    :min-width="getColumnWidth('baddata_produtside')" />
                <el-table-column prop="productname" :label="t('deviceManage.operaRecord.productCode')"
                    :min-width="getColumnWidth('productname')" />
                <el-table-column prop="baddata_productname" :label="t('deviceManage.operaRecord.productName')"
                    :min-width="getColumnWidth('baddata_productname')" />
                <el-table-column prop="baddata_productdsc" :label="t('deviceManage.operaRecord.productDesc')"
                    width="120" show-overflow-tooltip :min-width="getColumnWidth('baddata_productdsc')" />
                <el-table-column prop="baddata_equip" :label="t('deviceManage.operaRecord.equipment')"
                    :min-width="getColumnWidth('baddata_equip')" />
                <el-table-column prop="badphenomena_desc" :label="t('deviceManage.operaRecord.badDesc')"
                    :min-width="getColumnWidth('badphenomena_desc')" />
                <el-table-column prop="baddatadetail_remark" :label="t('deviceManage.operaRecord.badRemark')"
                    :min-width="getColumnWidth('baddatadetail_remark')" />
                <el-table-column prop="repair_way" :label="t('deviceManage.operaRecord.repairWay')" width="100"
                    align="center" fixed="right" :min-width="getColumnWidth('repair_way')">
                    <template #default="{ row }">
                        <span v-if="row.repair_way == '常规维修'">
                            <el-tag type="primary">{{ row.repair_way }}</el-tag>
                        </span>
                        <span v-else-if="row.repair_way == '误判'">
                            <el-tag type="info">{{ row.repair_way }}</el-tag>
                        </span>
                        <span v-else-if="row.repair_way == '报废'">
                            <el-tag type="danger">{{ row.repair_way }}</el-tag>
                        </span>
                        <span v-else>
                            <el-tag type="warning">{{ row.repair_way }}</el-tag>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="baddata_stts" :label="t('deviceManage.operaRecord.status')" width="100"
                    align="center" fixed="right" :min-width="getColumnWidth('baddata_stts')">
                    <template #default="{ row }">
                        <el-tag effect="dark" v-if="row.baddata_stts == '完成维修'" type="success">{{ row.baddata_stts
                            }}</el-tag>
                        <el-tag effect="dark" v-else-if="row.baddata_stts == '维修中'" type="primary">{{ row.baddata_stts
                            }}</el-tag>
                        <el-tag effect="dark" v-else-if="row.baddata_stts == '未维修'" type="info">{{ row.baddata_stts
                            }}</el-tag>
                        <el-tag effect="dark" v-else type="danger">{{ row.baddata_stts }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="repair_remark" :label="t('deviceManage.operaRecord.repairRemark')"
                    :min-width="getColumnWidth('repair_remark')" />
                <el-table-column prop="baddata_user" :label="t('deviceManage.operaRecord.repairer')"
                    :min-width="getColumnWidth('baddata_user')" />
                <el-table-column prop="repair_datetime" :label="t('deviceManage.operaRecord.repairTime')"
                    :min-width="getColumnWidth('repair_datetime')" />
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

        <!-- 维修单号详情对话框（更换物料记录） -->
        <el-dialog :title="`${t('deviceManage.operaRecord.changeMaterialDetail')}：${replaceForm.baddatadetail_pcbid}`"
            v-model="replaceVisible" width="75%" @close="replaceCancel" :append-to-body="true"
            :close-on-click-modal="false" align-center >
            <el-form :model="replaceForm" label-width="auto" :inline="true">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item :label="t('deviceManage.operaRecord.productSN')" class="mb-2">
                            <el-input v-model="replaceForm.containerName" disabled style="width: 270px" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="t('deviceManage.operaRecord.workOrderNo')" class="mb-2">
                            <el-input v-model="replaceForm.mfgordername" disabled style="width: 270px" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="t('deviceManage.operaRecord.side')" class="mb-2">
                            <el-input v-model="replaceForm.baddata_produtside" disabled style="width: 270px" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item :label="t('deviceManage.operaRecord.productCode')" class="mb-2">
                            <el-input v-model="replaceForm.productname" disabled style="width: 270px" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="t('deviceManage.operaRecord.productName')" class="mb-2">
                            <el-input v-model="replaceForm.baddata_productname" disabled style="width: 270px" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item :label="t('deviceManage.operaRecord.productDesc')" class="mb-2">
                            <el-input v-model="replaceForm.baddata_productdsc" disabled style="width: 645px" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-table :data="replaceForm.tableData" border stripe height="300" size="small">
                    <el-table-column type="index" width="50" :label="t('publicText.index')" align="center" />
                    <el-table-column prop="repairpro_productname" width="550"
                        :label="t('deviceManage.operaRecord.materialCode')" />
                    <el-table-column prop="repairpro_productnoname"
                        :label="t('deviceManage.operaRecord.materialName')" />
                    <el-table-column prop="repairpro_productnodesc"
                        :label="t('deviceManage.operaRecord.materialSpec')" />
                    <el-table-column prop="repairpro_user" :label="t('deviceManage.operaRecord.operator')" />
                    <el-table-column prop="repairpro_datetime" :label="t('deviceManage.operaRecord.operateTime')" />
                </el-table>

                <el-form-item :label="t('deviceManage.operaRecord.repairRemark')" class="mt-2">
                    <el-input v-model="replaceForm.repair_remark" disabled type="textarea" style="width: 645px" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="replaceCancel">{{ t('publicText.close') }}</el-button>
            </template>
        </el-dialog>

        <!-- 导出选择对话框 -->
        <el-dialog :title="t('deviceManage.operaRecord.exportTitle')" v-model="deducedVisible" width="30%"
            @close="deducedVisible = false" :append-to-body="true" :close-on-click-modal="false" >
            <el-select v-model="deducedVal" :placeholder="t('deviceManage.operaRecord.selectExportRange')">
                <el-option :label="t('deviceManage.operaRecord.currentPage')" :value="'1'" />
                <el-option :label="t('deviceManage.operaRecord.allData')" :value="'0'" />
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
    QueryXYL_BadProductInformationRepairRecord,
    QueryXYL_BadProductInformationRepairMaterial,
} from '@/api/deviceManage/index'
import { exportTableByRef } from '@/utils/exportExcel/generalExportExcel'
import { useExport } from '@/utils/exportExcel/loadingExcel'
import { shortcuts, setTodayDate, setLastDate } from '@/utils/dataMenu'
import { calculateColumnsWidth } from '@/utils/tableminWidth'
import dayjs from 'dayjs'

const { showLoading, hideLoading, handleExportSuccess, handleExportError } = useExport()
const { t } = useI18n()

// ========== 类型定义 ==========
interface SearchModel {
    pcbid: string
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

interface ReplaceMaterialItem {
    repairpro_productname: string
    repairpro_productnoname: string
    repairpro_productnodesc: string
    repairpro_user: string
    repairpro_datetime: string
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
    repair_remark: string
    tableData: ReplaceMaterialItem[]
}

interface TableRow {
    repair_no: string
    baddata_pcbid: string
    // ... 其他字段
    [key: string]: any
}

// ========== 响应式数据 ==========
const tableData = ref<TableRow[]>([])
const total = ref(0)
const tableHeight = ref(0)
const getForm = reactive<GetForm>({
    PageIndex: 1,
    PageSize: 50,
    SearchText: '',
    SearchModel: {
        pcbid: '',
        stts: 'Y',
    },
    StartTime: '',
    EndTime: '',
})

const dateValue = ref<string[]>([])
const operaRecordRef = ref()

const replaceForm = ref<ReplaceForm>({
    baddatadetail_pcbid: '',
    containerName: '',
    mfgordername: '',
    productname: '',
    productvalue: '',
    baddata_productname: '',
    baddata_productdsc: '',
    baddata_produtside: '',
    repair_remark: '',
    tableData: [],
})
const replaceVisible = ref(false)

// 导出相关
const deducedVisible = ref(false)
const deducedVal = ref('0')

// ========== 监听时间范围 ==========
watch(dateValue, (val) => {
    if (!val || val.length === 0) {
        getForm.StartTime = ''
        getForm.EndTime = ''
    } else {
        getForm.StartTime = val[0]
        getForm.EndTime = val[1]
    }
})

// ========== 表格列宽自动计算 ==========
const tableColumns = computed(() => {
    if (!operaRecordRef.value) return []
    const columns = operaRecordRef.value.columns
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
    QueryXYL_BadProductInformationRepairRecord(getForm).then((res: any) => {
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

// ========== 导出功能 ==========
const openExportDialog = () => {
    deducedVisible.value = true
}

const handleExport = async () => {
    deducedVisible.value = false
    showLoading(t('deviceManage.operaRecord.exportLoading'))
    try {
        let dataToExport = [...tableData.value]
        if (deducedVal.value === '0') {
            // 导出所有数据
            const allForm = {
                ...getForm,
                PageIndex: 1,
                PageSize: total.value,
            }
            const res: any = await QueryXYL_BadProductInformationRepairRecord(allForm)
            if (res.Success) {
                dataToExport = res.Data.list
            } else {
                ElMessage.error(res.Msg || t('deviceManage.operaRecord.exportFailed'))
                hideLoading()
                return
            }
        }
        await exportTableByRef(
            operaRecordRef.value,
            dataToExport,
            {
                fileName: `${t('deviceManage.operaRecord.exportFileName')}`,
                sheetName: t('deviceManage.operaRecord.sheetName'),
                excludeProps: ['publicText.index', 'publicText.operation'],
                i18nT: t,
            }
        )
        handleExportSuccess(t('deviceManage.operaRecord.exportFileName'))
    } catch (err) {
        handleExportError(err)
    } finally {
        hideLoading()
    }
}

// ========== 维修单号详情弹窗 ==========
const handleCellClick = (row: TableRow) => {
    replaceForm.value.baddatadetail_pcbid = row.repair_no
    replaceForm.value.containerName = row.baddata_pcbid
    replaceForm.value.mfgordername = row.mfgordername
    replaceForm.value.productname = row.productname
    replaceForm.value.productvalue = row.productvalue
    replaceForm.value.baddata_productname = row.baddata_productname
    replaceForm.value.baddata_productdsc = row.baddata_productdsc
    replaceForm.value.baddata_produtside = row.baddata_produtside
    replaceForm.value.repair_remark = row.repair_remark

    QueryXYL_BadProductInformationRepairMaterial({ repairpro_repairno: row.repair_no }).then((res: any) => {
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
        tableHeight.value = window.innerHeight - 210
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