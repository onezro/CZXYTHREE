<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="mb-2 flex justify-end">
                <el-input v-model="getForm.SearchModel.pcbid" :placeholder="t('deviceManage.onlineScrap.snPlaceholder')"
                    style="width: 350px" @keyup.enter="getSearchData" clearable @clear="clearData">
                    <template #append>
                        <el-button :icon="Search" @click="getSearchData" />
                    </template>
                </el-input>
            </div>

            <el-table :data="tableData" border :height="tableHeight" style="width: 100%" stripe size="small"
                tooltip-effect="light">
                <el-table-column type="index" width="50" :label="t('publicText.index')" align="center">
                    <template #default="{ $index }">
                        {{ $index + 1 + (getForm.PageIndex - 1) * getForm.PageSize }}
                    </template>
                </el-table-column>

                <el-table-column prop="baddata_no" :label="t('deviceManage.onlineScrap.scrapAuditNo')" />
                <el-table-column prop="baddata_pcbid" :label="t('deviceManage.onlineScrap.productSN')" />
                <el-table-column prop="mfgordername" :label="t('deviceManage.onlineScrap.workOrderNo')" />
                <el-table-column prop="baddata_produtside" :label="t('deviceManage.onlineScrap.side')" />
                <el-table-column prop="productname" :label="t('deviceManage.onlineScrap.productCode')" />
                <el-table-column prop="baddata_productname" :label="t('deviceManage.onlineScrap.productName')" />
                <el-table-column prop="baddata_productdsc" :label="t('deviceManage.onlineScrap.productDesc')"
                    show-overflow-tooltip />

                <el-table-column :label="t('publicText.operation')" width="100" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" :icon="Document" size="small" @click.stop="handleEdit(row)" />
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

        <!-- 报废审核对话框 -->
        <el-dialog :title="`${t('deviceManage.onlineScrap.scrapAudit')}：${titleNum}`" v-model="dialogVisible"
            width="75%" @close="addCancel" :append-to-body="true" :close-on-click-modal="false" align-center >
            <el-form :model="replaceForm" label-width="auto" :inline="true">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item :label="t('deviceManage.onlineScrap.productSN')" class="mb-2">
                            <el-input v-model="replaceForm.baddata_pcbid" disabled style="width: 270px" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="t('deviceManage.onlineScrap.workOrderNo')" class="mb-2">
                            <el-input v-model="replaceForm.mfgordername" disabled style="width: 270px" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="t('deviceManage.onlineScrap.side')" class="mb-2">
                            <el-input v-model="replaceForm.baddata_produtside" disabled style="width: 270px" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item :label="t('deviceManage.onlineScrap.productCode')" class="mb-2">
                            <el-input v-model="replaceForm.productname" disabled style="width: 270px" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="t('deviceManage.onlineScrap.productName')" class="mb-2">
                            <el-input v-model="replaceForm.baddata_productname" disabled style="width: 270px" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item :label="t('deviceManage.onlineScrap.productDesc')" class="mb-2">
                            <el-input v-model="replaceForm.baddata_productdsc" disabled style="width: 645px" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <el-table :data="tableData1" border style="width: 100%" height="300" size="small">
                <el-table-column type="index" width="50" :label="t('publicText.index')" />
                <el-table-column prop="baddatadetail_item" :label="t('deviceManage.onlineScrap.badLocation')" />
                <el-table-column prop="badphenomena_value" :label="t('deviceManage.onlineScrap.badPhenomenon')" />
                <el-table-column prop="baddatadetail_remark" :label="t('deviceManage.onlineScrap.remark')" />
            </el-table>

            <el-form label-width="auto" class="mt-2">
                <el-form-item :label="t('deviceManage.onlineScrap.auditRemark')" class="mb-2">
                    <el-input v-model="remark" style="width: 100%" />
                </el-form-item>
            </el-form>

            <template #footer>
                <el-button @click="onSubmit('N')">{{ t('deviceManage.onlineScrap.notPass') }}</el-button>
                <el-button type="primary" @click="onSubmit('Y')">{{ t('deviceManage.onlineScrap.pass') }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Document } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { useUserStoreWithOut } from '@/stores/modules/user'
import {
    QueryXYL_BadProductInformationScrap,
    QueryXYL_BadProductInformationFromByNo,
    UpdateXYL_BadProductInformationScrapRevd,
} from '@/api/deviceManage/index'

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
    badphenomena_value: string
    baddatadetail_remark: string
}

interface ReplaceForm {
    baddata_pcbid: string
    mfgordername: string
    baddata_produtside: string
    productname: string
    baddata_productname: string
    baddata_productdsc: string
}

interface TableRow {
    baddata_no: string
    baddata_pcbid: string
    // ... 其他字段
    [key: string]: any
}

// ========== 响应式数据 ==========
const tableData = ref<TableRow[]>([])
const tableData1 = ref<BadDetailItem[]>([])
const total = ref(0)
const tableHeight = ref(0)
const dialogVisible = ref(false)
const titleNum = ref('')
const remark = ref('')

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

const replaceForm = ref<ReplaceForm>({
    baddata_pcbid: '',
    mfgordername: '',
    baddata_produtside: '',
    productname: '',
    baddata_productname: '',
    baddata_productdsc: '',
})

// ========== 数据获取 ==========
const getData = () => {
    QueryXYL_BadProductInformationScrap(getForm).then((res: any) => {
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

// ========== 审核对话框 ==========
const handleEdit = (row: any) => {
    replaceForm.value = { ...row } as ReplaceForm
    titleNum.value = row.baddata_no
    QueryXYL_BadProductInformationFromByNo({ baddatadetail_no: row.baddata_no }).then((res: any) => {
        tableData1.value = res.Data
        dialogVisible.value = true
    })
}

const addCancel = () => {
    dialogVisible.value = false
    tableData1.value = []
    remark.value = ''
}

const onSubmit = (val: string) => {
    const data = {
        baddatadetail_no: replaceForm.value.baddata_pcbid,
        remark: remark.value,
        baddata_confirm: val,
        UserNo: userStore.getUserInfo,
    }
    UpdateXYL_BadProductInformationScrapRevd(data).then((res: any) => {
        if (res.Success) {
            ElMessage.success(res.Msg)
            dialogVisible.value = false
            tableData1.value = []
            remark.value = ''
            getData()
        } else {
            ElMessage.error(res.Msg)
        }
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
})

onMounted(() => {
    window.addEventListener('resize', getScreenHeight)
    getData()
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