<template>
    <div class=" p-2">
        <el-card :body-style="{ padding: '8px' }">
            <div class="mb-2 flex justify-between">
              
                <div>
                    <el-input v-model="searchText" size="small" :placeholder="t('baseData.puzzlesBase.searchPlaceholder')" style="width: 350px"
                        clearable @keyup.enter="getSearchData" @clear="clearData">
                        <template #append>
                            <el-button icon="Search" size="small" @click="getSearchData" />
                        </template>
                    </el-input>
                </div>
                  <el-button type="primary" size="small" @click="openAdd">{{ t('publicText.add') }}</el-button>
            </div>
            <el-table ref="tableMasterRef" :data="tableData.slice(
                (getForm.PageIndex - 1) * getForm.PageSize,
                getForm.PageIndex * getForm.PageSize,
            )" border :height="tableHeight" size="small" style="width: 100%">
                <el-table-column :label="t('publicText.index')" width="55" align="center" fixed="left">
                    <template #default="scope">
                        <span>{{ scope.$index + 1 + (getForm.PageIndex - 1) * getForm.PageSize }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="PN" :label="t('baseData.puzzlesBase.pn')" :min-width="getColumnWidth('PN')" fixed="left"/>
                <el-table-column prop="name" :label="t('baseData.puzzlesBase.name')" :min-width="getColumnWidth('name')" />
                <el-table-column prop="pn_spec" :label="t('baseData.puzzlesBase.spec')" :min-width="getColumnWidth('pn_spec')" />
                <el-table-column prop="faceNumber" :label="t('baseData.puzzlesBase.side')" :min-width="getColumnWidth('faceNumber')" align="center">
                    <template #default="scope">
                        <span v-if="scope.row.faceNumber == 1">{{ t('baseData.puzzlesBase.single') }}</span>
                        <span v-else>{{ t('baseData.puzzlesBase.double') }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="softwareVersion" :label="t('baseData.puzzlesBase.softwareVersion')" :min-width="getColumnWidth('softwareVersion')" />
                <el-table-column prop="Ud_usr" :label="t('baseData.puzzlesBase.operator')" :min-width="getColumnWidth('Ud_usr')" />
                <el-table-column prop="Ud_dt" :label="t('baseData.puzzlesBase.operateTime')" :min-width="getColumnWidth('Ud_dt')" />
                <el-table-column fixed="right" :label="t('publicText.operation')" width="120" align="center">
                    <template #default="scope">
                        <el-tooltip :content="t('publicText.detail')" placement="top">
                            <el-button type="primary" size="small" icon="Document" @click="handleEdit(scope.row)" />
                        </el-tooltip>
                        <el-tooltip :content="t('publicText.delete')" placement="top">
                            <el-button type="danger" size="small" icon="Delete" @click="handleDelete(scope.row)" />
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <div class="block" style="margin-top: 8px">
                <el-pagination align="center" :size="'small'" background @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :current-page="getForm.PageIndex"
                      :page-size="getForm.PageSize" :page-sizes="[10, 50, 100, 150]"
                    layout="total,sizes, prev, pager, next" :total="total" />
            </div>
        </el-card>

        <!-- 添加对话框 -->
        <el-dialog v-model="dialogVisible" :title="t('publicText.add')" width="85%" @close="addCancel">
            <el-form :model="form" ref="formRef" label-width="auto" :rules="rules">
                <el-row :gutter="20">
                    <el-col :span="8" :offset="0">
                        <el-form-item :label="t('baseData.puzzlesBase.pn')" prop="list.pn" class="mb-2">
                            <el-input v-model="form.list.pn" size="small" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" :offset="0">
                        <el-form-item :label="t('baseData.puzzlesBase.name')" prop="list.name" class="mb-2">
                            <el-input v-model="form.list.name" size="small" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" :offset="0">
                        <el-form-item :label="t('baseData.puzzlesBase.spec')" prop="list.model" class="mb-2">
                            <el-input v-model="form.list.model" type="textarea" size="small" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8" :offset="0">
                        <el-form-item :label="t('baseData.puzzlesBase.side')" prop="list.side" class="mb-2">
                            <el-select v-model="form.list.side" :placeholder="t('publicText.select')"
                                style="width: 100%" size="small">
                                <el-option :label="t('baseData.puzzlesBase.single')" value="1" />
                                <el-option :label="t('baseData.puzzlesBase.double')" value="2" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" :offset="0">
                        <el-form-item :label="t('baseData.puzzlesBase.pcbMaterial')" prop="PCBMaterial" class="mb-2">
                            <el-input v-model="form.list.PCBMaterial" size="small" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class="form-section">
                    <el-tabs type="border-card">
                        <el-tab-pane :label="t('baseData.puzzlesBase.smallBoardDetail')">
                            <el-table :data="form.Detail" style="width: 100%" border :height="300" size="small">
                                <el-table-column :label="t('publicText.index')" width="55">
                                    <template #default="scope">
                                        <span>{{ scope.$index + 1 }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column :label="t('baseData.puzzlesBase.pcbCode')">
                                    <template #default="scope">
                                        <el-autocomplete v-model="scope.row.pcb_code" :fetch-suggestions="remoteMethod"
                                            @select="(item:any) => change(item, scope.$index)" size="small" />
                                    </template>
                                </el-table-column>
                                <el-table-column :label="t('baseData.puzzlesBase.pcbQty')">
                                    <template #default="scope">
                                        <el-input v-model.number="scope.row.small_board_qty" type="number"
                                            size="small" />
                                    </template>
                                </el-table-column>
                                <el-table-column :label="t('baseData.puzzlesBase.moduleStart')">
                                    <template #default="scope">
                                        <el-input v-model.number="scope.row.module_start" type="number" size="small" />
                                    </template>
                                </el-table-column>
                                <el-table-column :label="t('baseData.puzzlesBase.moduleEnd')">
                                    <template #default="scope">
                                        <el-input v-model.number="scope.row.module_end" type="number" size="small" />
                                    </template>
                                </el-table-column>
                                <el-table-column :label="t('baseData.puzzlesBase.finishedCode')">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.finished_code" size="small" />
                                    </template>
                                </el-table-column>
                                <el-table-column :label="t('baseData.puzzlesBase.name')" prop="name">
                                </el-table-column>
                                <el-table-column :label="t('baseData.puzzlesBase.spec')" prop="model" width="200" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column :label="t('publicText.operation')" width="80" align="center">
                                    <template #default="{ $index }">
                                        <el-button v-if="$index === form.Detail.length - 1" type="primary" size="small"
                                            icon="Plus" @click="addSmallBoard" />
                                        <el-button v-else type="danger" size="small" icon="Delete"
                                            @click="removeBoardItem($index)" />
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </el-form>
            <template #footer>
                <el-button @click="addCancel">{{ t('publicText.cancel') }}</el-button>
                <el-button type="primary" @click="onSubmit">{{ t('publicText.confirm') }}</el-button>
            </template>
        </el-dialog>

        <!-- 详情对话框 -->
        <el-dialog v-model="detailVisible" :title="t('publicText.detail')" width="85%" @close="addDetailCancel">
            <el-form :model="editForm" ref="editFormRef" label-width="auto">
                <el-row :gutter="20">
                    <el-col :span="8" :offset="0">
                        <el-form-item :label="t('baseData.puzzlesBase.pn')" prop="pn" class="mb-2">
                            <el-input v-model="editForm.pn" disabled size="small" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" :offset="0">
                        <el-form-item :label="t('baseData.puzzlesBase.name')" prop="name" class="mb-2">
                            <el-input v-model="editForm.name" size="small" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" :offset="0">
                        <el-form-item :label="t('baseData.puzzlesBase.spec')" prop="model" class="mb-2">
                            <el-input v-model="editForm.model" size="small" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8" :offset="0">
                        <el-form-item :label="t('baseData.puzzlesBase.side')" prop="side" class="mb-2">
                            <el-select v-model="editForm.side" :placeholder="t('publicText.select')" style="width: 100%"
                                size="small">
                                <el-option :label="t('baseData.puzzlesBase.single')" value="1" />
                                <el-option :label="t('baseData.puzzlesBase.double')" value="2" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" :offset="0">
                        <el-form-item :label="t('baseData.puzzlesBase.pcbMaterial')" prop="PCBMaterial" class="mb-2">
                            <el-input v-model="editForm.PCBMaterial" size="small" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class="form-section">
                    <el-tabs type="border-card">
                        <el-tab-pane :label="t('baseData.puzzlesBase.smallBoardDetail')">
                            <el-table :data="smallBoardTable" style="width: 100%" border :height="350" size="small">
                                <el-table-column :label="t('publicText.index')" width="55">
                                    <template #default="scope">
                                        <span>{{ scope.$index + 1 }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column :label="t('baseData.puzzlesBase.pcbCode')" prop="pcb_code">
                                    <template #default="scope">
                                        <el-autocomplete v-model="scope.row.pcb_code" :fetch-suggestions="remoteMethod"
                                            @select="(item: any) => change1(item, scope.$index)" size="small" />
                                    </template>
                                </el-table-column>
                                <el-table-column :label="t('baseData.puzzlesBase.pcbQty')" prop="small_board_qty" width="100">
                                    <template #default="scope">
                                        <el-input v-model.number="scope.row.small_board_qty" type="number"
                                            size="small" />
                                    </template>
                                </el-table-column>
                                <el-table-column :label="t('baseData.puzzlesBase.moduleStart')" prop="module_start" width="120">
                                    <template #default="scope">
                                        <el-input v-model.number="scope.row.module_start" type="number" size="small" />
                                    </template>
                                </el-table-column>
                                <el-table-column :label="t('baseData.puzzlesBase.moduleEnd')" prop="module_end" width="120">
                                    <template #default="scope">
                                        <el-input v-model.number="scope.row.module_end" type="number" size="small" />
                                    </template>
                                </el-table-column>
                                <el-table-column :label="t('baseData.puzzlesBase.finishedCode')" prop="finished_code">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.finished_code" size="small" />
                                    </template>
                                </el-table-column>
                                <el-table-column :label="t('baseData.puzzlesBase.name')" prop="name">
                                </el-table-column>
                                <el-table-column :label="t('baseData.puzzlesBase.spec')" prop="model" width="200" show-overflow-tooltip>

                                </el-table-column>
                                <el-table-column :label="t('publicText.operation')" width="120">
                                    <template #default="scope">
                                        <el-button type="danger" size="small" icon="Delete"
                                            @click="handleDetailDelete(scope.row)" />
                                        <el-button v-if="scope.$index === smallBoardTable.length - 1" type="primary"
                                            size="small" icon="Plus" @click="handleDetailEdit" />
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </el-form>
            <template #footer>
                <el-button @click="addDetailCancel">{{ t('publicText.cancel') }}</el-button>
                <el-button type="primary" @click="onDetailSubmit">{{ t('publicText.confirm') }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import {
  findPanelizationList,
  DeletePanelizationList,
  findPnDetail,
  addPanelizationdetail,
  UpdatePanelizationDetail,
  findPartNumberData,
  UpdatePanelizationList
} from '@/api/baseData'
import { ref, reactive, nextTick, onMounted, onBeforeMount, onBeforeUnmount } from 'vue'
import { ElNotification, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import { useTableColumnWidth } from '@/hooks/useTableColumnWidth';
import { useUserStoreWithOut } from "@/stores/modules/user";


const userStore = useUserStoreWithOut();
const { t } = useI18n();




const searchText = ref('')
const tableData = ref<any[]>([])
const total = ref(0)
const tableHeight = ref(0)
const dialogVisible = ref(false)
const detailVisible = ref(false)
const formRef = ref()
const editFormRef = ref()
const options = ref<any[]>([])
const tableMasterRef = ref()

const getForm = ref({
    PageIndex: 1,
    PageSize: 50,
    SearchText: '',
    StartTime: '',
    EndTime: ''
})

const form = ref({
    list: {
        pn: '',
        model: '',
        side: '',
        name: '',
        version: '',
        softwareVersion: '',
        PCBMaterial: '',
        cr_user: '',
        cr_time: ''
    },
    Detail: [
        {
            version: '',
            softwareVersion: '',
            small_board_qty: 0,
            finished_code: '',
            name: '',
            model: '',
            pcb_code: '',
            module_start: 0,
            module_end: 0
        }
    ]
})

const editForm = ref({
    pn: '',
    model: '',
    side: '',
    name: '',
    version: '',
    softwareVersion: '',
    PCBMaterial: '',
    cr_user: '',
    cr_time: ''
})

const upDateForm = reactive({
    pnl_code: '',
    list: [] as any[]
})

const smallBoardTable = ref<any[]>([])

const rules = {
    'list.pn': [{ required: true, message: '拼板物料编号不能为空', trigger: 'blur' }],
    'list.name': [{ required: true, message: '物料名称不能为空', trigger: 'change' }],
    'list.model': [{ required: true, message: '物料规格不能为空', trigger: 'change' }],
    'list.side': [{ required: true, message: '单双面不能为空', trigger: 'change' }]
}

const getData = () => {
      findPanelizationList(getForm.value).then((res:any) => {
        if (res.Success) {
          tableData.value = res.Data.list.map((item: any) => ({
            ...item,
            Ud_dt: dayjs(item.Ud_dt).format('YYYY-MM-DD HH:mm:ss')
          }))
          total.value = res.Data.Total
        } else {
          tableData.value = []
          total.value = 0
        }
      })
}

const getSearchData = () => {
      getForm.value.PageIndex = 1
      getForm.value.SearchText = searchText.value
      getData()
}

const clearData = () => {
    searchText.value = ''
    getForm.value.PageIndex = 1
    getData()
}

const openAdd = () => {
    dialogVisible.value = true
}

const change = (val: any, index: number) => {
    form.value.Detail[index].name = val.name
    form.value.Detail[index].model = val.pn_spec
}

const remoteMethod = (query: string, cb: any) => {
      findPartNumberData(query).then((res:any) => {
        if (res.Success) {
          if (res.Data === null || res.Data.length === 0) {
            ElNotification({
              type: 'error',
              title: t('publicText.tip'),
              message: t('puzzles.noData')
            })
            cb([])
            return
          }
          const searchData = JSON.parse(res.Data)
          cb(
            searchData.map((item: any) => ({
              value: item.PN,
              ...item
            }))
          )
        }
      })
}

const change1 = (val: any, index: number) => {
    smallBoardTable.value[index].name = val.name
    smallBoardTable.value[index].model = val.pn_spec
}

const removeBoardItem = (index: number) => {
    form.value.Detail.splice(index, 1)
    if (form.value.Detail.length === 0) {
        form.value.Detail.push({
            version: '',
            softwareVersion: '',
            small_board_qty: 0,
            finished_code: '',
            name: '',
            model: '',
            pcb_code: '',
            module_start: 0,
            module_end: 0
        })
    }
}

const addSmallBoard = () => {
    form.value.Detail.push({
        version: '',
        softwareVersion: '',
        small_board_qty: 0,
        finished_code: '',
        name: '',
        model: '',
        pcb_code: '',
        module_start: 0,
        module_end: 0
    })
}

const handleDelete = (row: any) => {
    ElMessageBox.confirm(t('puzzles.deleteConfirm'), t('publicText.tip'), {
        confirmButtonText: t('publicText.confirm'),
        cancelButtonText: t('publicText.cancel'),
        type: 'warning'
    })
        .then(() => {
              DeletePanelizationList(row.PN).then((res:any) => {
                if (res.Success) {
                  ElNotification({
                    type: 'success',
                    title: t('publicText.tip'),
                    message: res.Msg
                  })
                  getData()
                } else {
                  ElNotification({
                    type: 'error',
                    title: t('publicText.tip'),
                    message: res.Msg
                  })
                }
              })
        })
        .catch(() => {
            ElNotification({
                type: 'info',
                title: t('publicText.tip'),
                message: t('puzzles.cancelDelete')
            })
        })
}

const onSubmit = () => {
    formRef.value.validate((valid: boolean) => {
        if (valid) {
            if (form.value.Detail.length === 1 && form.value.Detail[0].finished_code === '') {
                ElNotification({
                    type: 'error',
                    title: t('publicText.tip'),
                    message: t('puzzles.smallBoardRequired')
                })
                return
            }
            const filteredDetail = form.value.Detail.filter((item) => item.finished_code !== '')
            form.value.list.cr_user = userStore.getUserInfo
            form.value.list.cr_time = dayjs().format('YYYY-MM-DD HH:mm:ss')
            filteredDetail.forEach((item: any) => {
                item.cr_user = userStore.getUserInfo
                item.cr_time = dayjs().format('YYYY-MM-DD HH:mm:ss')
            })
            addPanelizationdetail({ list: form.value.list, Detail: filteredDetail }).then((res:any) => {
                if (res.Success) {
                    ElNotification({
                        type: 'success',
                        title: t('publicText.tip'),
                        message: res.Msg
                    })
                    restForm()
                    dialogVisible.value = false
                    getData()
                } else {
                    ElNotification({
                        type: 'error',
                        title: t('publicText.tip'),
                        message: res.Msg
                    })
                }
            })
        } else {
            ElNotification({
                type: 'error',
                title: t('publicText.tip'),
                message: t('puzzles.checkForm')
            })
            return false
        }
    })
}

const restForm = () => {
    form.value.list = {
        pn: '',
        model: '',
        side: '',
        name: '',
        version: '',
        softwareVersion: '',
        PCBMaterial: '',
        cr_user: '',
        cr_time: ''
    }
    form.value.Detail = [
        {
            version: '',
            softwareVersion: '',
            small_board_qty: 0,
            finished_code: '',
            name: '',
            model: '',
            pcb_code: '',
            module_start: 0,
            module_end: 0
        }
    ]
}

const addCancel = () => {
    dialogVisible.value = false
    formRef.value.resetFields()
    restForm()
}

const handleEdit = (row: any) => {
    upDateForm.pnl_code = row.PN
    editForm.value.pn = row.PN
    editForm.value.model = row.pn_spec
    editForm.value.side = row.faceNumber
    editForm.value.name = row.name
    editForm.value.version = row.version
    editForm.value.softwareVersion = row.softwareVersion
    editForm.value.PCBMaterial = row.PCBMaterial

      findPnDetail(row.PN).then((res: any) => {
        if (res.Data == null || res.Data.length === 0) {
          smallBoardTable.value = [
            {
              version: '',
              small_board_qty: 0,
              finished_code: '',
              name: '',
              model: '',
              pcb_code: '',
              module_start: 0,
              module_end: 0
            }
          ]
        } else {
          smallBoardTable.value = JSON.parse(res.Data)
        }
        detailVisible.value = true
      })
}

const upDateSubmit = () => {
    editForm.value.cr_user = ''
    editForm.value.cr_time = dayjs().format('YYYY-MM-DD HH:mm:ss')
      UpdatePanelizationList(editForm.value).then((res:any) => {
        if (!res.Success) {
          ElNotification({
            type: 'error',
            title: t('publicText.tip'),
            message: res.Msg
          })
        }
      })
}

const addDetailCancel = () => {
    detailVisible.value = false
    smallBoardTable.value = []
    editFormRef.value.resetFields()
}

const handleDetailEdit = () => {
    smallBoardTable.value.push({
        version: '',
        small_board_qty: 0,
        finished_code: '',
        name: '',
        model: '',
        pcb_code: '',
        module_start: 0,
        module_end: 0
    })
}

const handleDetailDelete = (row: any) => {
    const index = smallBoardTable.value.indexOf(row)
    if (index > -1) {
        smallBoardTable.value.splice(index, 1)
    }
    if (smallBoardTable.value.length === 0) {
        smallBoardTable.value.push({
            version: '',
            small_board_qty: 0,
            finished_code: '',
            name: '',
            model: '',
            pcb_code: '',
            module_start: 0,
            module_end: 0
        })
    }
}

const onDetailSubmit = () => {
    upDateSubmit()
    const filteredTable = smallBoardTable.value.filter((item) => item.finished_code !== '')
    filteredTable.forEach((item) => {
        item.cr_user = userStore.getUserInfo
        item.cr_time = dayjs().format('YYYY-MM-DD HH:mm:ss')
        item.softwareVersion = editForm.value.softwareVersion
    })
    upDateForm.list = filteredTable
    UpdatePanelizationDetail(upDateForm).then((res:any) => {
        if (res.Success) {
            ElNotification({
                type: 'success',
                title: t('publicText.tip'),
                message: res.Msg
            })
            detailVisible.value = false
            getData()
        } else {
            ElNotification({
                type: 'error',
                title: t('publicText.tip'),
                message: res.Msg
            })
        }
    })
}

const handleSizeChange = (val: number) => {
    getForm.value.PageSize = val
    getData()
}

const handleCurrentChange = (val: number) => {
    getForm.value.PageIndex = val
    getData()
}

const { getColumnWidth } = useTableColumnWidth(tableMasterRef, tableData, {
    excludeLabels: [t('publicText.index'), t('publicText.operation')]
})

const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 190
    })
}

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
<style lang="scss" scoped>
.puzzles {
    padding: 8px;

    .table_header {
        margin-bottom: 8px;
    }
}

.form-section {
    .section-title {
        color: #409eff;
        font-size: 16px;
        margin: 0 0 16px 0;
        padding-bottom: 8px;
        border-bottom: 1px solid #eee;
    }

    .sub-title {
        font-size: 12px;
        color: #409eff;
        margin-bottom: 6px;
        padding-left: 4px;
    }

    .vertical-divider {
        position: absolute;
        left: 50%;
        top: 40px;
        bottom: 20px;
        width: 1px;
        background: #eee;
    }
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
    padding: 20px 15px;
}
</style>
