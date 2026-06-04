<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="mb-2 flex justify-between">
                <div></div>
                <div>
                    <el-input v-model="getForm.SearchModel.pcbid"
                        :placeholder="t('deviceManage.onlineRepairRoom.snPlaceholder')" style="width: 350px"
                        @keyup.enter="getSearchData" clearable @clear="clearData">
                        <template #append>
                            <el-button :icon="Search" @click="getSearchData" />
                        </template>
                    </el-input>
                </div>
            </div>

            <el-table :data="tableData" ref="repairRoomRef" highlight-current-row border :height="tableHeight"
                style="width: 100%" stripe size="small" tooltip-effect="dark">
                <el-table-column type="index" :label="t('publicText.index')" width="55" fixed="left" align="center">
                    <template #default="{ $index }">
                        {{ $index + 1 + (getForm.PageIndex - 1) * getForm.PageSize }}
                    </template>
                </el-table-column>
                <el-table-column prop="baddata_no" :label="t('deviceManage.onlineRepairRoom.repairNo')" fixed="left"
                    :min-width="getColumnWidth('baddata_no')" />
                <el-table-column prop="baddata_pcbid" :label="t('deviceManage.onlineRepairRoom.productSN')"
                    :min-width="getColumnWidth('baddata_pcbid')" />
                <el-table-column prop="mfgordername" :label="t('deviceManage.onlineRepairRoom.workOrderNo')"
                    :min-width="getColumnWidth('mfgordername')" />
                <el-table-column prop="baddata_produtside" :label="t('deviceManage.onlineRepairRoom.side')"
                    :min-width="getColumnWidth('baddata_produtside')" />
                <el-table-column prop="productname" :label="t('deviceManage.onlineRepairRoom.productCode')"
                    :min-width="getColumnWidth('productname')" />
                <el-table-column prop="baddata_productname" :label="t('deviceManage.onlineRepairRoom.productName')"
                    :min-width="getColumnWidth('baddata_productname')" />
                <el-table-column prop="baddata_productdsc" :label="t('deviceManage.onlineRepairRoom.productDesc')"
                    width="120" show-overflow-tooltip :min-width="getColumnWidth('baddata_productdsc')" />
                <el-table-column prop="baddata_line" :label="t('deviceManage.onlineRepairRoom.line')"
                    :min-width="getColumnWidth('baddata_line')" />
                <el-table-column prop="baddata_equip" :label="t('deviceManage.onlineRepairRoom.equipment')"
                    :min-width="getColumnWidth('baddata_equip')" />
                <el-table-column prop="baddata_stts" :label="t('deviceManage.onlineRepairRoom.status')" align="center"
                    width="100" :min-width="getColumnWidth('baddata_stts')">
                    <template #default="{ row }">
                        <el-tag  v-if="row.baddata_stts == '完成维修' || row.baddata_stts == '完成报废'"
                            type="success">
                            {{ row.baddata_stts }}
                        </el-tag>
                        <el-tag  v-else-if="row.baddata_stts == '维修中'" type="warning">
                            {{ row.baddata_stts }}
                        </el-tag>
                        <el-tag  v-else-if="row.baddata_stts == '未维修'" type="info">
                            {{ row.baddata_stts }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="baddata_user" :label="t('deviceManage.onlineRepairRoom.reporter')"
                    :min-width="getColumnWidth('baddata_user')" />
                <el-table-column prop="baddata_datetime" :label="t('deviceManage.onlineRepairRoom.reportTime')"
                    width="150" :min-width="getColumnWidth('baddata_datetime')" />
                <el-table-column prop="baddata_uuser" :label="t('deviceManage.onlineRepairRoom.repairer')"
                    :min-width="getColumnWidth('baddata_uuser')" />
                <el-table-column prop="baddata_udatetime" :label="t('deviceManage.onlineRepairRoom.repairTime')"
                    width="150" :min-width="getColumnWidth('baddata_udatetime')" />
                <el-table-column :label="t('publicText.operation')" fixed="right" width="210" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" @click="handleEdit(row)"
                            :disabled="row.baddata_stts == '报废审核' || row.baddata_stts == '完成报废' || row.baddata_stts == '完成维修'">
                            {{ t('deviceManage.onlineRepairRoom.repair') }}
                        </el-button>
                        <el-button type="info" size="small" @click="handleScrap(row)"
                            :disabled="row.baddata_stts == '报废审核' || row.baddata_stts == '完成报废' || row.baddata_stts == '完成维修'">
                            {{ t('deviceManage.onlineRepairRoom.scrap') }}
                        </el-button>
                        <el-button type="warning" size="small" @click="handleMistrial(row)"
                            :disabled="row.baddata_stts == '报废审核' || row.baddata_stts == '完成报废' || row.baddata_stts == '完成维修'">
                            {{ t('deviceManage.onlineRepairRoom.mistrial') }}
                        </el-button>
                    </template>
                </el-table-column>
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

        <!-- 维修对话框 -->
        <el-dialog :title="`${t('deviceManage.onlineRepairRoom.repair')}：${repairForm.containerName}`"
            v-model="repairVisible" width="75%" @close="repairCancel" :append-to-body="true"
            :close-on-click-modal="false" align-center>
            <el-form :model="repairForm" ref="repairFormRef" label-width="auto" :inline="true">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item :label="t('deviceManage.onlineRepairRoom.productSN')" class="mb-2">
                            <el-input v-model="repairForm.containerName" disabled style="width: 270px" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="t('deviceManage.onlineRepairRoom.workOrderNo')" class="mb-2">
                            <el-input v-model="repairForm.mfgordername" disabled readonly style="width: 270px" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="t('deviceManage.onlineRepairRoom.side')" class="mb-2">
                            <el-input v-model="repairForm.baddata_produtside" disabled readonly style="width: 270px" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item :label="t('deviceManage.onlineRepairRoom.productCode')" class="mb-2">
                            <el-input v-model="repairForm.productname" disabled readonly style="width: 270px" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="t('deviceManage.onlineRepairRoom.productName')" class="mb-2">
                            <el-input v-model="repairForm.baddata_productname" disabled style="width: 270px" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item :label="t('deviceManage.onlineRepairRoom.productDesc')" class="mb-2">
                            <el-input v-model="repairForm.baddata_productdsc" disabled style="width: 645px" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-table :data="repairForm.tableData" border stripe height="300" size="small">
                    <el-table-column type="index" width="50" :label="t('publicText.index')" align="center" />
                    <el-table-column prop="baddatadetail_item"
                        :label="t('deviceManage.onlineRepairRoom.badLocation')" />
                    <el-table-column prop="baddatadetail_code" :label="t('deviceManage.onlineRepairRoom.badCode')" />
                    <el-table-column prop="badphenomena_value" :label="t('deviceManage.onlineRepairRoom.badName')" />
                </el-table>

                <el-form-item :label="t('deviceManage.onlineRepairRoom.repairRemark')" class="mt-2">
                    <el-input v-model="repairForm.remark" type="textarea" style="width: 440px" />
                </el-form-item>
                <el-form-item class="mt-2">
                    <el-button type="primary" @click="handleProductname">{{
                        t('deviceManage.onlineRepairRoom.changeMaterial')
                        }}</el-button>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="repairCancel">{{ t('publicText.cancel') }}</el-button>
                <el-button type="primary" @click="onSubmit">{{ t('publicText.confirm') }}</el-button>
            </template>
        </el-dialog>

        <!-- 报废对话框 -->
        <el-dialog :title="`${t('deviceManage.onlineRepairRoom.scrap')}：${scrapForm.containerName}`"
            v-model="scrapVisible" width="75%" @close="scrapCancel" :append-to-body="true"
            :close-on-click-modal="false" align-center>
            <el-form :model="scrapForm" ref="scrapFormRef" label-width="auto" :inline="true">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item :label="t('deviceManage.onlineRepairRoom.productSN')" class="mb-2">
                            <el-input v-model="scrapForm.containerName" disabled style="width: 270px" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="t('deviceManage.onlineRepairRoom.workOrderNo')" class="mb-2">
                            <el-input v-model="scrapForm.mfgordername" disabled readonly style="width: 270px" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="t('deviceManage.onlineRepairRoom.side')" class="mb-2">
                            <el-input v-model="scrapForm.baddata_produtside" disabled readonly style="width: 270px" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item :label="t('deviceManage.onlineRepairRoom.productCode')" class="mb-2">
                            <el-input v-model="scrapForm.productname" disabled readonly style="width: 270px" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="t('deviceManage.onlineRepairRoom.productName')" class="mb-2">
                            <el-input v-model="scrapForm.baddata_productname" disabled style="width: 270px" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item :label="t('deviceManage.onlineRepairRoom.productDesc')" class="mb-2">
                            <el-input v-model="scrapForm.baddata_productdsc" disabled style="width: 645px" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-table :data="scrapForm.tableData" border stripe height="300" size="small">
                    <el-table-column type="index" width="50" :label="t('publicText.index')" align="center" />
                    <el-table-column prop="baddatadetail_item"
                        :label="t('deviceManage.onlineRepairRoom.badLocation')" />
                    <el-table-column prop="baddatadetail_code" :label="t('deviceManage.onlineRepairRoom.badCode')" />
                    <el-table-column prop="badphenomena_value" :label="t('deviceManage.onlineRepairRoom.badName')" />
                </el-table>

                <el-form-item :label="t('deviceManage.onlineRepairRoom.scrapRemark')" class="mt-2">
                    <el-input v-model="scrapForm.remark" type="textarea" style="width: 440px" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="scrapCancel">{{ t('publicText.cancel') }}</el-button>
                <el-button type="primary" @click="scrapSubmit">{{ t('publicText.confirm') }}</el-button>
            </template>
        </el-dialog>

        <!-- 更换物料对话框 -->
        <el-dialog :title="t('deviceManage.onlineRepairRoom.changeMaterial')" v-model="addVisible" width="70%"
            @close="addCancel" :append-to-body="true" :close-on-click-modal="false" align-center >
            <el-table :data="productid" border style="width: 100%" height="350">
                <el-table-column type="index" width="50" :label="t('publicText.index')" />
                <el-table-column :label="t('deviceManage.onlineRepairRoom.changeMaterialNo')">
                    <template #default="{ row, $index }">
                        <el-input v-model="row.productname" @change="(val: any) => getMarterialData(val, row, $index)"
                            :ref="(el: any) => setMaterialInputRef(el, $index)" />
                    </template>
                </el-table-column>
                <el-table-column prop="pnname" :label="t('deviceManage.onlineRepairRoom.materialName')" />
                <el-table-column prop="pn_spec" :label="t('deviceManage.onlineRepairRoom.materialSpec')" />
                <el-table-column :label="t('publicText.operation')">
                    <template #default="{ $index }">
                        <el-button v-if="$index === productid.length - 1" type="primary" link :icon="Plus"
                            @click="addSmallBoard" />
                        <el-button v-else type="danger" link :icon="Delete" @click="productid.splice($index, 1)" />
                    </template>
                </el-table-column>
            </el-table>
            <template #footer>
                <el-button @click="addCancel">{{ t('publicText.close') }}</el-button>
                <el-button type="primary" @click="addSubmit">{{ t('publicText.confirm') }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onBeforeMount, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus'
import { Search, Plus, Delete } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { useUserStoreWithOut } from '@/stores/modules/user'
import {
    QueryXYL_BadProductInformationFromContainer,
    QueryXYL_BadProductInformationFromByNo,
    UpdateXYL_BadProductInformation,
    GetGetMarterialNameDesc
} from '@/api/deviceManage/index'
// import { exportTableToExcel } from '@/utils/exportExcel'
import { calculateColumnsWidth } from '@/utils/tableminWidth'
import dayjs from 'dayjs'

const { t } = useI18n()
const userStore = useUserStoreWithOut()

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

interface BadDetailItem {
    baddatadetail_item: string
    baddatadetail_code: string
    badphenomena_value: string
}

interface RepairForm {
    baddatadetail_pcbid: string
    containerName: string
    mfgordername: string
    productname: string
    productvalue: string
    baddata_productname: string
    baddata_productdsc: string
    baddata_produtside: string
    remark: string
    productid: any[]
    tableData: BadDetailItem[]
}

interface ScrapForm {
    baddatadetail_pcbid: string
    containerName: string
    mfgordername: string
    productname: string
    productvalue: string
    baddata_productname: string
    baddata_productdsc: string
    baddata_produtside: string
    remark: string
    tableData: BadDetailItem[]
}

interface MaterialItem {
    productname: string
    pnname?: string
    pn_spec?: string
}

interface TableRow {
    baddata_no: string
    baddata_pcbid: string
    baddata_stts: string
    // ... 其他字段
}

// ========== 响应式数据 ==========
const tableData = ref<TableRow[]>([])
const total = ref(0)
const tableHeight = ref(0)
const repairRoomRef = ref()
const getForm = reactive<GetForm>({
    PageIndex: 1,
    PageSize: 50,
    SearchText: '',
    SearchModel: {
        pcbid: '',
        stts: 'Y'
    },
    StartTime: '',
    EndTime: ''
})

const repairForm = ref<RepairForm>({
    baddatadetail_pcbid: '',
    containerName: '',
    mfgordername: '',
    productname: '',
    productvalue: '',
    baddata_productname: '',
    baddata_productdsc: '',
    baddata_produtside: '',
    remark: '',
    productid: [],
    tableData: []
})

const scrapForm = ref<ScrapForm>({
    baddatadetail_pcbid: '',
    containerName: '',
    mfgordername: '',
    productname: '',
    productvalue: '',
    baddata_productname: '',
    baddata_productdsc: '',
    baddata_produtside: '',
    remark: '',
    tableData: []
})

const productid = ref<MaterialItem[]>([{ productname: '' }])
const addVisible = ref(false)
const scrapVisible = ref(false)
const repairVisible = ref(false)

const repairFormRef = ref()
const scrapFormRef = ref()
const materialInputRefs = ref<(HTMLInputElement | null)[]>([])

// ========== 表格列宽自动计算 ==========

const columnWidths = computed(() => {
    if (!repairRoomRef.value) return {};
    let columns: any = [];
    columns = repairRoomRef.value.columns
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
    return calculateColumnsWidth(columns, tableData.value, { padding: 25, fontSize: 13 })
})

const getColumnWidth = (prop: string) => {
    return columnWidths.value[prop] || 'auto'
}

// ========== 数据获取 ==========
const getData = () => {
    QueryXYL_BadProductInformationFromContainer(getForm).then((res: any) => {
        if (res.Success) {
            tableData.value = res.Data.list
            total.value = res.Data.Total
        } else {
            tableData.value = []
            total.value = 0
        }
    })
}

const getSearchData = () => {
    getForm.PageIndex = 1
    getData()
}

const clearData = () => {
    getForm.PageIndex = 1
    getData()
}

// ========== 导出 ==========
const fetchAllUsers = async () => {
    const res: any = await QueryXYL_BadProductInformationFromContainer(getForm)
    return res.Data.list
}

// const deducedClick = () => {
//     exportTableToExcel({
//         tableRef: repairRoomRef.value,
//         fetchAllData: fetchAllUsers,
//         fileName: `${t('deviceManage.onlineRepairRoom.exportFileName')}_${dayjs().format('YYYYMMDDHHmmss')}`,
//         styles: {
//             headerBgColor: '',
//             headerFont: { color: { argb: '' }, bold: true, size: 14 },
//             cell: { numFmt: '@' }
//         }
//     })
// }

// ========== 维修相关 ==========
const repairCancel = () => {
    repairVisible.value = false
    repairForm.value = {
        baddatadetail_pcbid: '',
        containerName: '',
        mfgordername: '',
        productname: '',
        productvalue: '',
        baddata_productname: '',
        baddata_productdsc: '',
        baddata_produtside: '',
        remark: '',
        productid: [],
        tableData: []
    }
}

const handleEdit = (row: any) => {
    repairForm.value.baddatadetail_pcbid = row.baddata_no
    repairForm.value.containerName = row.baddata_pcbid
    repairForm.value.mfgordername = row.mfgordername
    repairForm.value.productname = row.productname
    repairForm.value.productvalue = row.productvalue
    repairForm.value.baddata_productname = row.baddata_productname
    repairForm.value.baddata_productdsc = row.baddata_productdsc
    repairForm.value.baddata_produtside = row.baddata_produtside

    QueryXYL_BadProductInformationFromByNo({ baddatadetail_no: row.baddata_no }).then((res: any) => {
        repairForm.value.tableData = res.Data
        repairVisible.value = true
    })
}

const handleProductname = () => {
    addVisible.value = true
    if (repairForm.value.productid.length === 0) {
        productid.value = [{ productname: '' }]
    } else {
        productid.value = repairForm.value.productid
    }
    nextTick(() => {
        materialInputRefs.value[0]?.focus()
    })
}

const addCancel = () => {
    addVisible.value = false
    productid.value = [{ productname: '' }]
}

const addSmallBoard = () => {
    productid.value.push({ productname: '' })
    nextTick(() => {
        const idx = productid.value.length - 1
        materialInputRefs.value[idx]?.focus()
    })
}

const setMaterialInputRef = (el: any, index: number) => {
    if (el) {
        materialInputRefs.value[index] = el.$el?.querySelector('input') || el
    }
}

const getMarterialData = (value: string, row: MaterialItem, index: number) => {
    if (!value) return
    GetGetMarterialNameDesc({ material: value }).then((res: any) => {
        if (res.Success && res.Data && res.Data.length > 0) {
            row.pnname = res.Data[0].pnname
            row.pn_spec = res.Data[0].pn_spec
        }
    })
}

const addSubmit = () => {
    repairForm.value.productid = productid.value.map(item => ({ productname: item.productname }))
    addVisible.value = false
    productid.value = [{ productname: '' }]
}

const UpdateBadProductInformation = (data: any) => {
    UpdateXYL_BadProductInformation(data).then((res: any) => {
        if (res.Success) {
            ElMessage.success(res.Msg)
            repairCancel()
            getData()
        } else {
            ElMessage.error(res.Msg)
        }
    })
}

const onSubmit = () => {
    const data: any = {
        baddatadetail_no: repairForm.value.baddatadetail_pcbid,
        baddata_way: '常规维修',
        baddata_remark: repairForm.value.remark,
        repairList: [],
        UserNo: userStore.getUserInfo
    }
    const validMaterials = repairForm.value.productid.filter(item => item.productname !== '')
    if (validMaterials.length === 0) {
        ElMessageBox.confirm(t('deviceManage.onlineRepairRoom.confirmNormalRepair'), t('publicText.confirm'), {
            confirmButtonText: t('publicText.confirm'),
            cancelButtonText: t('publicText.cancel'),
            type: 'warning'
        }).then(() => {
            UpdateBadProductInformation(data)
        }).catch(() => {
            ElMessage.info(t('publicText.cancel'))
        })
    } else {
        data.baddata_way = '更换物料'
        data.repairList = validMaterials.map(item => ({ productname: item.productname }))
        ElMessageBox.confirm(t('deviceManage.onlineRepairRoom.confirmChangeMaterial'), t('publicText.confirm'), {
            confirmButtonText: t('publicText.confirm'),
            cancelButtonText: t('publicText.cancel'),
            type: 'warning'
        }).then(() => {
            UpdateBadProductInformation(data)
        }).catch(() => {
            ElMessage.info(t('publicText.cancel'))
        })
    }
}

// ========== 报废相关 ==========
const scrapCancel = () => {
    scrapVisible.value = false
    scrapForm.value = {
        baddatadetail_pcbid: '',
        containerName: '',
        mfgordername: '',
        productname: '',
        productvalue: '',
        baddata_productname: '',
        baddata_productdsc: '',
        baddata_produtside: '',
        remark: '',
        tableData: []
    }
}

const handleScrap = (row: any) => {
    scrapForm.value.baddatadetail_pcbid = row.baddata_no
    scrapForm.value.containerName = row.baddata_pcbid
    scrapForm.value.mfgordername = row.mfgordername
    scrapForm.value.productname = row.productname
    scrapForm.value.productvalue = row.productvalue
    scrapForm.value.baddata_productname = row.baddata_productname
    scrapForm.value.baddata_productdsc = row.baddata_productdsc
    scrapForm.value.baddata_produtside = row.baddata_produtside
    QueryXYL_BadProductInformationFromByNo({ baddatadetail_no: row.baddata_no }).then((res: any) => {
        scrapForm.value.tableData = res.Data
        scrapVisible.value = true
    })
}

const scrapSubmit = () => {
    const data = {
        baddatadetail_no: scrapForm.value.baddatadetail_pcbid,
        baddata_way: '报废',
        baddata_remark: scrapForm.value.remark,
        repairList: [],
        UserNo: userStore.getUserInfo
    }
    UpdateXYL_BadProductInformation(data).then((res: any) => {
        if (res.Success) {
            ElMessage.success(res.Msg)
            scrapCancel()
            getData()
        } else {
            ElMessage.error(res.Msg)
        }
    })
}

// ========== 误判 ==========
const handleMistrial = (row: TableRow) => {
    ElMessageBox.confirm(t('deviceManage.onlineRepairRoom.confirmMistrial'), t('publicText.confirm'), {
        confirmButtonText: t('publicText.confirm'),
        cancelButtonText: t('publicText.cancel'),
        type: 'warning'
    }).then(() => {
        const data = {
            baddatadetail_no: row.baddata_no,
            baddata_way: '误判',
            baddata_remark: '',
            repairList: [],
            UserNo: userStore.getUserInfo
        }
        UpdateXYL_BadProductInformation(data).then((res: any) => {
            if (res.Success) {
                ElMessage.success(res.Msg)
                getData()
            } else {
                ElMessage.error(res.Msg)
            }
        })
    }).catch(() => {
        ElMessage.info(t('publicText.cancel'))
    })
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