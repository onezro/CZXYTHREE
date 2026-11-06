<template>
    <div class=" p-2">
        <el-card :body-style="{ padding: '8px' }">
            <div class="mb-2 flex justify-between">
                <el-button type="primary" size="small" @click="openAdd">{{ t('publicText.add') }}</el-button>
                <div>
                    <el-input v-model="searchText" size="small" :placeholder="t('baseData.puzzlesBase.searchPlaceholder')" style="width: 350px"
                        clearable @keyup.enter="getSearchData" @clear="clearData">
                        <template #append>
                            <el-button icon="Search" size="small" @click="getSearchData" />
                        </template>
                    </el-input>
                </div>
            </div>
            <el-table ref="tableMasterRef" :data="tableData" border :height="tableHeight" size="small" style="width: 100%"  :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }">
                <el-table-column :label="t('publicText.index')" width="55" align="center" fixed="left">
                    <template #default="scope">
                        <span>{{ scope.$index + 1 + (getForm.PageIndex - 1) * getForm.PageSize }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="pn" :label="t('baseData.puzzlesBase.pn')" :min-width="getColumnWidth('pn')" fixed="left"/>
                <el-table-column prop="name" :label="t('baseData.puzzlesBase.name')" :min-width="getColumnWidth('name')" />
                <el-table-column prop="model" :label="t('baseData.puzzlesBase.spec')" :min-width="getColumnWidth('model')" />
                <el-table-column :label="t('baseData.puzzlesBase.side')" width="80" align="center">
                    <template #default="scope">
                        <span>{{ scope.row.sideText || '--' }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="t('baseData.puzzlesBase.changeType')" width="100" align="center">
                    <template #default="scope">
                        <el-tag v-if="scope.row.change_type" :type="changeTypeTag(scope.row.change_type)" size="small">
                            {{ changeTypeText(scope.row.change_type) }}
                        </el-tag>
                        <span v-else>--</span>
                    </template>
                </el-table-column>
                <el-table-column :label="t('baseData.puzzlesBase.draftStatus')" width="110" align="center">
                    <template #default="scope">
                        <el-tag :type="draftTagType(scope.row)" size="small">{{ draftTagText(scope.row) }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column :label="t('baseData.puzzlesBase.draftVersion')" width="100" align="center">
                    <template #default="scope">
                        <span>{{ scope.row.has_draft ? scope.row.draft_version : '--' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="update_user" :label="t('baseData.puzzlesBase.operator')" :min-width="getColumnWidth('update_user')">
                    <template #default="scope">
                        <span>{{ scope.row.update_user || scope.row.create_user || '--' }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="t('baseData.puzzlesBase.operateTime')" :min-width="getColumnWidth('update_time')">
                    <template #default="scope">
                        <span>{{ formatTime(scope.row.update_time) || formatTime(scope.row.create_time) || '--' }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="t('publicText.enable')" width="80" align="center" fixed="right">
                    <template #default="scope">
                        <el-switch :model-value="scope.row.effective_enabled === true" :disabled="!canEnable(scope.row)"
                            @change="handleEnable(scope.row)" />
                    </template>
                </el-table-column>
                <el-table-column fixed="right" :label="t('publicText.operation')" width="180" align="center">
                    <template #default="scope">
                        <el-tooltip :content="t('publicText.edit')" placement="top">
                            <el-button type="primary" size="small" icon="Edit" @click="handleEdit(scope.row)" />
                        </el-tooltip>
                        <el-tooltip :content="t('baseData.puzzlesBase.discard')" placement="top">
                            <el-button type="warning" size="small" icon="RefreshLeft"
                                :disabled="!scope.row.has_pending_draft" @click="handleDiscard(scope.row)" />
                        </el-tooltip>
                        <el-tooltip :content="t('baseData.puzzlesBase.markDelete')" placement="top">
                            <el-button type="danger" size="small" icon="Delete" @click="handleMarkDelete(scope.row)" />
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

        <!-- 新增/修改草稿对话框 -->
        <el-dialog v-model="dialogVisible" :title="isEdit ? t('publicText.edit') : t('publicText.add')" width="85%" @close="addCancel">
            <el-form :model="form" ref="formRef" label-width="auto" :rules="rules">
                <el-row :gutter="20">
                    <el-col :span="8" :offset="0">
                        <el-form-item :label="t('baseData.puzzlesBase.pn')" prop="list.pn" class="mb-2">
                            <el-input v-model="form.list.pn" :disabled="isEdit" size="small" />
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
                            <el-select v-model="form.list.side" :placeholder="t('publicText.pleaseSelect')"
                                style="width: 100%" size="small">
                                <el-option :label="t('baseData.puzzlesBase.single')" value="1" />
                                <el-option :label="t('baseData.puzzlesBase.double')" value="2" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" :offset="0">
                        <el-form-item :label="t('baseData.puzzlesBase.pcbMaterial')" prop="list.PCBMaterial" class="mb-2">
                            <el-input v-model="form.list.PCBMaterial" size="small" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class="form-section">
                    <el-tabs type="border-card">
                        <el-tab-pane :label="t('baseData.puzzlesBase.smallBoardDetail')">
                            <div class="mb-2">
                                <el-button type="primary" size="small" icon="Plus" @click="addSmallBoard">
                                    {{ t('publicText.add') }}
                                </el-button>
                            </div>
                            <el-table :data="detailTable" style="width: 100%" border :height="300" size="small">
                                <el-table-column :label="t('publicText.index')" width="55">
                                    <template #default="scope">
                                        <span>{{ scope.$index + 1 }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column :label="t('baseData.puzzlesBase.pcbCode')" width="150">
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
                                <el-table-column :label="t('baseData.puzzlesBase.finishedCode')" width="150">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.finished_code" size="small" />
                                    </template>
                                </el-table-column>
                                <el-table-column :label="t('baseData.puzzlesBase.boxType')" width="120">
                                    <template #default="scope">
                                        <el-select v-model="scope.row.boxtype" size="small" clearable filterable
                                            >
                                            <el-option v-for="item in boxTypeOptions" :key="item.value"
                                                :label="item.label" :value="item.value" />
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column :label="t('baseData.boxType.caseNo')" width="120">
                                    <template #default="scope">
                                        <el-select v-model="scope.row.caseno" size="small" clearable filterable
                                            >
                                            <el-option v-for="item in boxInfoList" :key="item.box_code"
                                                :label="item.box_code" :value="item.box_code" />
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column :label="t('baseData.puzzlesBase.caseNoProductNum')" width="120">
                                    <template #default="scope">
                                        <el-input v-model.number="scope.row.casenoproductnum" type="number"
                                            size="small" />
                                    </template>
                                </el-table-column>
                                <el-table-column :label="t('baseData.puzzlesBase.caseNo2')" width="120">
                                    <template #default="scope">
                                        <el-select v-model="scope.row.caseno2" size="small" clearable filterable
                                            >
                                            <el-option v-for="item in boxInfoList" :key="item.box_code"
                                                :label="item.box_code" :value="item.box_code" />
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column :label="t('baseData.puzzlesBase.caseNoProductNum2')" width="120">
                                    <template #default="scope">
                                        <el-input v-model.number="scope.row.casenoproductnum2" type="number"
                                            size="small" />
                                    </template>
                                </el-table-column>
                                <el-table-column :label="t('baseData.puzzlesBase.name')" prop="name">
                                </el-table-column>
                                <el-table-column :label="t('baseData.puzzlesBase.spec')" prop="model" width="200" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column :label="t('publicText.operation')" width="80" align="center">
                                    <template #default="{ $index }">
                                        <el-button type="danger" size="small" icon="Delete"
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
    </div>
</template>

<script setup lang="ts">
import {
  FindPanelizationDraftPage,
  GetPanelizationDraft,
  SavePanelizationDraft,
  EnablePanelizationDraft,
  MarkDeletePanelizationDraft,
  DiscardPanelizationDraft,
  FindPartNumberData
} from '@/api/baseData/puzzlesBase'
import { QueryBoxInfoList } from '@/api/baseData/boxBase'
import { ref, nextTick, onMounted, onBeforeMount, onBeforeUnmount } from 'vue'
import { ElNotification, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import { useTableColumnWidth } from '@/hooks/useTableColumnWidth';

const { t } = useI18n();

const searchText = ref('')
const tableData = ref<any[]>([])
const total = ref(0)
const tableHeight = ref(0)
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref()
const tableMasterRef = ref()
const boxInfoList = ref<any[]>([])
// 当前编辑数据的草稿版本号，保存和启用时必须回传
const draftVersion = ref(0)

// 盒箱类型固定三种：L左 R右 C共用
const boxTypeOptions = [
    { value: 'L', label: t('baseData.puzzlesBase.boxTypeOptionL') },
    { value: 'R', label: t('baseData.puzzlesBase.boxTypeOptionR') },
    { value: 'C', label: t('baseData.puzzlesBase.boxTypeOptionC') }
]

const getForm = ref({
    PageIndex: 1,
    PageSize: 50,
    SearchText: ''
})

const emptyList = () => ({
    pn: '',
    model: '',
    name: '',
    side: '',
    version: '',
    softwareVersion: '',
    PCBMaterial: ''
})

const emptyDetail = () => ({
    version: '',
    softwareVersion: '',
    small_board_qty: 0,
    finished_code: '',
    name: '',
    model: '',
    pcb_code: '',
    module_start: 0,
    module_end: 0,
    boxtype: '',
    caseno: '',
    casenoproductnum: 0,
    caseno2: '',
    casenoproductnum2: null
})

const form = ref({
    list: emptyList()
})

// 明细可为空数组，提交时表示清空草稿明细
const detailTable = ref<any[]>([])

const rules = {
    'list.pn': [{ required: true, message: t('baseData.puzzlesBase.pnRequired'), trigger: 'blur' }],
    'list.name': [{ required: true, message: t('baseData.puzzlesBase.nameRequired'), trigger: 'change' }],
    'list.model': [{ required: true, message: t('baseData.puzzlesBase.specRequired'), trigger: 'change' }],
    'list.side': [{ required: true, message: t('baseData.puzzlesBase.sideRequired'), trigger: 'change' }]
}

const formatTime = (val: any) => {
    if (!val) return ''
    return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
}

// 单双面沿用原页面编码：1-单，2-双
const normalizeSide = (val: any) => {
    if (val === 1 || val === '1' || val === '单') return '1'
    if (val === 2 || val === '2' || val === '双') return '2'
    return ''
}

const sideText = (val: any) => {
    const side = normalizeSide(val)
    if (side === '1') return t('baseData.puzzlesBase.single')
    if (side === '2') return t('baseData.puzzlesBase.double')
    return val ?? ''
}

// 统一列表行字段，兼容大小写命名
const normalizeRow = (row: any) => ({
    ...row,
    pn: row.pn ?? row.PN ?? '',
    model: row.model ?? row.pn_spec ?? '',
    sideText: sideText(row.side ?? row.faceNumber)
})

const draftTagText = (row: any) => {
    if (!row.has_draft || row.draft_status === -1 || row.draft_status == null) return t('baseData.puzzlesBase.draftNone')
    return row.draft_status === 1 ? t('baseData.puzzlesBase.draftEnabled') : t('baseData.puzzlesBase.draftPending')
}

const draftTagType = (row: any): any => {
    if (!row.has_draft || row.draft_status === -1 || row.draft_status == null) return 'info'
    return row.draft_status === 1 ? 'success' : 'warning'
}

const changeTypeText = (type: string) => {
    if (type === 'ADD') return t('baseData.puzzlesBase.changeAdd')
    if (type === 'UPDATE') return t('baseData.puzzlesBase.changeUpdate')
    if (type === 'DELETE') return t('baseData.puzzlesBase.changeDelete')
    return type
}

const changeTypeTag = (type: string): any => {
    if (type === 'ADD') return 'success'
    if (type === 'UPDATE') return 'warning'
    if (type === 'DELETE') return 'danger'
    return 'info'
}

// 只有待启用草稿才允许启用
const canEnable = (row: any) => !!row.has_draft && row.draft_status === 0

const notify = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
    ElNotification({ type, title: t('publicText.tip'), message })
}

const getData = () => {
    FindPanelizationDraftPage(getForm.value).then((res: any) => {
        if (res.Success) {
            const list = res.Data?.list || []
            tableData.value = list.map(normalizeRow)
            total.value = res.Data?.Total ?? 0
        } else {
            tableData.value = []
            total.value = 0
        }
    })
}

const getBoxInfoList = () => {
    QueryBoxInfoList({ box_code: '', box_name: '', pageIndex: 1, pageSize: 9999 }).then((res: any) => {
        if (res.Success && res.Data) {
            boxInfoList.value = res.Data
        } else {
            boxInfoList.value = []
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
    getBoxInfoList()
    isEdit.value = false
    draftVersion.value = 0
    form.value.list = emptyList()
    detailTable.value = []
    dialogVisible.value = true
}

const change = (val: any, index: number) => {
    detailTable.value[index].name = val.name
    detailTable.value[index].model = val.pn_spec
}

const remoteMethod = (query: string, cb: any) => {
    FindPartNumberData(query).then((res: any) => {
        if (res.Success) {
            if (res.Data === null || res.Data.length === 0) {
                notify('error', t('baseData.puzzlesBase.noData'))
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

const removeBoardItem = (index: number) => {
    detailTable.value.splice(index, 1)
}

const addSmallBoard = () => {
    detailTable.value.push(emptyDetail())
}

// 明细接口返回的 Data 可能是 JSON 字符串
const parseDetail = (data: any): any[] => {
    if (data == null || data === '') return []
    try {
        const parsed = typeof data === 'string' ? JSON.parse(data) : data
        return Array.isArray(parsed) ? parsed : []
    } catch {
        return []
    }
}

// 从接口返回的 Data 中取出最新的 draft_version（取不到时不覆盖原值）
const parseDraftVersion = (data: any): number | null => {
    if (data == null || data === '') return null
    try {
        const parsed = typeof data === 'string' ? JSON.parse(data) : data
        if (typeof parsed === 'number') return parsed
        const version = parsed?.draft_version ?? parsed?.list?.draft_version
        return version != null ? Number(version) : null
    } catch {
        return null
    }
}

const addCancel = () => {
    dialogVisible.value = false
    formRef.value?.resetFields()
    form.value.list = emptyList()
    detailTable.value = []
}

// 修改前先查询最新数据，取最新 draft_version 和明细
const handleEdit = (row: any) => {
    getBoxInfoList()
    GetPanelizationDraft({ pn: row.pn }).then((res: any) => {
        if (!res.Success) {
            notify('error', res.Msg || res.Message)
            return
        }
        const data = res.Data || {}
        const list = data.list || {}
        const detail = parseDetail(data.detail)
        // 没有草稿时传 0，已有草稿时传接口返回的最新版本
        draftVersion.value = Number(list.draft_version ?? row.draft_version ?? 0)
        form.value.list = {
            pn: list.pn ?? row.pn,
            model: list.model ?? row.model,
            name: list.name ?? row.name,
            side: normalizeSide(list.side ?? row.side ?? row.faceNumber),
            version: list.version ?? '',
            softwareVersion: list.softwareVersion ?? '',
            PCBMaterial: list.PCBMaterial ?? ''
        }
        detailTable.value = detail
        isEdit.value = true
        dialogVisible.value = true
    })
}

// 新增 draft_version 传 0，修改传最新版本；整份主表+明细提交（detail 为空数组表示清空明细）
const onSubmit = () => {
    formRef.value.validate((valid: boolean) => {
        if (valid) {
            const detail = detailTable.value
                .map((item) => ({
                    ...item,
                    version: form.value.list.version,
                    softwareVersion: form.value.list.softwareVersion,
                    caseno2: item.caseno2 || '',
                    // 不使用第二个吸塑盒时容量传 null
                    casenoproductnum2: item.caseno2 ? item.casenoproductnum2 : null
                }))
            SavePanelizationDraft({
                list: { ...form.value.list },
                detail,
                draft_version: isEdit.value ? draftVersion.value : 0
            }).then((res: any) => {
                if (res.Success) {
                    const newVersion = parseDraftVersion(res.Data)
                    if (newVersion != null) {
                        draftVersion.value = newVersion
                    }
                    notify('success', res.Msg || res.Message)
                    dialogVisible.value = false
                    getData()
                } else if (res.Code === 409) {
                    notify('error', t('baseData.puzzlesBase.conflictTip'))
                    dialogVisible.value = false
                    getData()
                } else {
                    notify('error', res.Msg || res.Message)
                }
            })
        } else {
            notify('error', t('baseData.puzzlesBase.checkForm'))
            return false
        }
    })
}

// 启用：写入正式表
const handleEnable = (row: any) => {
    const isDelete = row.change_type === 'DELETE'
    ElMessageBox.confirm(
        isDelete
            ? t('baseData.puzzlesBase.enableDeleteConfirm', { pn: row.pn })
            : t('baseData.puzzlesBase.enableConfirm', { pn: row.pn }),
        t('publicText.tip'),
        {
            confirmButtonText: t('publicText.confirm'),
            cancelButtonText: t('publicText.cancel'),
            type: 'warning'
        }
    )
        .then(() => {
            EnablePanelizationDraft({
                pn: row.pn,
                draft_version: row.draft_version ?? 0
            }).then((res: any) => {
                if (res.Success) {
                    const newVersion = parseDraftVersion(res.Data)
                    if (newVersion != null) {
                        draftVersion.value = newVersion
                    }
                    notify('success', res.Msg || res.Message)
                } else {
                    notify('error', res.Msg || res.Message)
                }
                getData()
            })
        })
        .catch(() => {})
}

// 暂存删除：只标记为待删除草稿，需启用后才真正删除
const handleMarkDelete = (row: any) => {
    ElMessageBox.confirm(t('baseData.puzzlesBase.markDeleteConfirm', { pn: row.pn }), t('publicText.tip'), {
        confirmButtonText: t('publicText.confirm'),
        cancelButtonText: t('publicText.cancel'),
        type: 'warning'
    })
        .then(() => {
            MarkDeletePanelizationDraft({ pn: row.pn }).then((res: any) => {
                if (res.Success) {
                    const newVersion = parseDraftVersion(res.Data)
                    if (newVersion != null) {
                        draftVersion.value = newVersion
                    }
                    notify('success', res.Msg || res.Message)
                    getData()
                } else {
                    notify('error', res.Msg || res.Message)
                }
            })
        })
        .catch(() => {})
}

// 放弃当前待处理草稿，不影响正式数据
const handleDiscard = (row: any) => {
    ElMessageBox.confirm(t('baseData.puzzlesBase.discardConfirm', { pn: row.pn }), t('publicText.tip'), {
        confirmButtonText: t('publicText.confirm'),
        cancelButtonText: t('publicText.cancel'),
        type: 'warning'
    })
        .then(() => {
            DiscardPanelizationDraft({
                pn: row.pn,
                draft_version: row.draft_version ?? 0
            }).then((res: any) => {
                if (res.Success) {
                    notify('success', res.Msg || res.Message)
                    getData()
                } else {
                    notify('error', res.Msg || res.Message)
                }
            })
        })
        .catch(() => {})
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
.form-section {
    .section-title {
        color: #409eff;
        font-size: 16px;
        margin: 0 0 16px 0;
        padding-bottom: 8px;
        border-bottom: 1px solid #eee;
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
