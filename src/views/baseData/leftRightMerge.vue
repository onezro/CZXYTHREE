<template>
    <div class="p-2">
        <el-card :body-style="{ padding: '8px' }">
            <div class="mb-2 flex justify-between">
                <el-button type="primary" @click="openAdd">{{ t('publicText.add') }}</el-button>
                <div>
                    <el-input v-model="searchText" :placeholder="t('baseData.leftRightMerge.searchPlaceholder')"
                        style="width: 350px" clearable @keyup.enter="getSearchData" @clear="clearData">
                        <template #append>
                            <el-button :icon="Search" @click="getSearchData" />
                        </template>
                    </el-input>
                </div>
            </div>

            <el-table :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)" border
                :height="tableHeight" style="width: 100%" size="small">
                <el-table-column type="index" :label="t('publicText.index')" width="55" fixed="left" align="center">
                    <template #default="{ $index }">
                        {{ $index + 1 + (currentPage - 1) * pageSize }}
                    </template>
                </el-table-column>

                <el-table-column prop="panelmerge_id" :label="t('baseData.leftRightMerge.mergeId')" width="220"
                    fixed="left" />
                <el-table-column prop="panelmerge_name" :label="t('baseData.leftRightMerge.mergeName')" width="150" />

                <!-- 左灯信息列组 -->
                <el-table-column :label="t('baseData.leftRightMerge.leftInfo')">
                    <el-table-column prop="panelmerge_left_no" :label="t('baseData.leftRightMerge.materialCode')"
                        width="120" />
                    <el-table-column prop="panelmerge_left_name" :label="t('baseData.leftRightMerge.materialName')"
                        width="150" />
                    <el-table-column prop="panelmerge_left_desc" :label="t('baseData.leftRightMerge.materialSpec')"
                        width="200" />
                </el-table-column>

                <!-- 右灯信息列组 -->
                <el-table-column :label="t('baseData.leftRightMerge.rightInfo')">
                    <el-table-column prop="panelmerge_right_no" :label="t('baseData.leftRightMerge.materialCode')"
                        width="120" />
                    <el-table-column prop="panelmerge_right_name" :label="t('baseData.leftRightMerge.materialName')"
                        width="150" />
                    <el-table-column prop="panelmerge_right_desc" :label="t('baseData.leftRightMerge.materialSpec')"
                        width="200" />
                </el-table-column>

                <el-table-column prop="panelmerge_manywo" :label="t('baseData.leftRightMerge.multiWo')" width="90"
                    align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.panelmerge_manywo ? 'primary' : 'info'">
                            {{ row.panelmerge_manywo ? t('publicText.yes') : t('publicText.no') }}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="panelmerge_updateuser" :label="t('baseData.puzzlesBase.operator')" />
                <el-table-column prop="panelmerge_updatedate" :label="t('baseData.puzzlesBase.operateTime')" />

                <el-table-column fixed="right" :label="t('publicText.operation')" width="140" align="center">
                    <template #default="{ row }">
                        <el-tooltip :content="t('publicText.detail')" placement="top">
                            <el-button type="primary" size="small" :icon="Document" @click="handleEdit(row)" />
                        </el-tooltip>
                        <el-tooltip :content="t('publicText.delete')" placement="top">
                            <el-button type="danger" size="small" :icon="Delete" @click="handleDelete(row)" />
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <div class="block" style="margin-top: 8px">
                <el-pagination align="center" :size="'small'" background @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
                    :page-sizes="[10, 20, 50, 100, 200]" layout="total,sizes, prev, pager, next"
                    :total="tableData.length" />
            </div>
        </el-card>

        <!-- 添加对话框 -->
        <el-dialog v-model="dialogVisible" :title="t('publicText.add')" width="85%" @close="addCancel">
            <el-form :model="form" ref="formRef" label-width="auto" size="small">
                <div class="form-section">
                    <el-row :gutter="20" class="dense-row">
                        <el-col :span="12">
                            <el-form-item :label="t('baseData.leftRightMerge.mergeName')" class="mb-2"
                                prop="panelmerge_name">
                                <el-input v-model="form.panelmerge_name" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item :label="t('baseData.leftRightMerge.mergeId')" class="mb-2">
                                <el-input v-model="allCode" readonly />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>

                <div class="form-section">
                    <el-row :gutter="20">
                        <!-- 左灯信息 -->
                        <el-col :span="12" class="compact-col">
                            <div class="section-title">{{ t('baseData.leftRightMerge.leftInfo') }}</div>
                            <el-row :gutter="8">
                                <el-col :span="12">
                                    <el-form-item :label="t('baseData.leftRightMerge.materialCode')" class="mb-2">
                                        <el-autocomplete v-model="form.panelmerge_left_no"
                                            :fetch-suggestions="remoteMethod"
                                            :placeholder="t('baseData.leftRightMerge.inputCode')" @select="change1" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item :label="t('baseData.leftRightMerge.materialName')" class="mb-2">
                                        <el-input v-model="form.panelmerge_left_name" disabled />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item :label="t('baseData.leftRightMerge.materialSpec')" class="mb-2">
                                        <el-input v-model="form.panelmerge_left_desc" type="textarea" disabled />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-col>

                        <!-- 分隔线 -->
                        <div class="vertical-divider"></div>

                        <!-- 右灯信息 -->
                        <el-col :span="12" class="compact-col">
                            <div class="section-title">{{ t('baseData.leftRightMerge.rightInfo') }}</div>
                            <el-row :gutter="8">
                                <el-col :span="12">
                                    <el-form-item :label="t('baseData.leftRightMerge.materialCode')" class="mb-2">
                                        <el-autocomplete v-model="form.panelmerge_right_no"
                                            :fetch-suggestions="remoteMethod"
                                            :placeholder="t('baseData.leftRightMerge.inputCode')" @select="change2" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item :label="t('baseData.leftRightMerge.materialName')" class="mb-2">
                                        <el-input v-model="form.panelmerge_right_name" disabled />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item :label="t('baseData.leftRightMerge.materialSpec')" class="mb-2">
                                        <el-input v-model="form.panelmerge_right_desc" type="textarea" disabled />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </div>

                <el-form-item :label="t('baseData.leftRightMerge.multiWoMode')" prop="order">
                    <el-switch v-model="form.panelmerge_manywo" :active-text="t('publicText.enable')"
                        :inactive-text="t('publicText.disable')" :active-value="true" :inactive-value="false" />
                </el-form-item>

                <div class="form-section">
                    <h3 class="section-title">{{ t('baseData.leftRightMerge.panelDetail') }}</h3>
                    <el-table :data="form.bomlist" border size="small" class="sub-table" :height="200">
                        <el-table-column :label="t('publicText.index')" width="60" align="center">
                            <template #default="{ $index }">{{ $index + 1 }}</template>
                        </el-table-column>

                        <el-table-column :label="t('baseData.leftRightMerge.panelMaterialCode')">
                            <template #default="{ row, $index }">
                                <el-select v-model="row.panelmergebom_no" filterable size="small" style="width: 100%"
                                    @change="(val: string) => changePuzzle1(val, $index)">
                                    <el-option v-for="item in puzzlesOptions" :key="item.PN" :label="item.PN"
                                        :value="item.PN" />
                                </el-select>
                            </template>
                        </el-table-column>

                        <el-table-column :label="t('baseData.leftRightMerge.usageQty')">
                            <template #default="{ row }">
                                <el-input-number v-model="row.panelmergebom_qty" size="small" :min="1" />
                            </template>
                        </el-table-column>

                        <el-table-column :label="t('baseData.leftRightMerge.finishedName')">
                            <template #default="{ row }">
                                <el-input v-model="row.panelmergebom_name" size="small" />
                            </template>
                        </el-table-column>

                        <el-table-column :label="t('baseData.leftRightMerge.finishedSpec')">
                            <template #default="{ row }">
                                <el-input v-model="row.panelmergebom_desc" size="small" />
                            </template>
                        </el-table-column>

                        <el-table-column :label="t('publicText.operation')" width="100" align="center">
                            <template #default="{ $index }">
                                <el-button v-if="$index === form.bomlist.length - 1" type="primary" size="small"
                                    :icon="Plus" @click="addSmallBoard" />
                                <el-button v-else type="danger" size="small" :icon="Delete"
                                    @click="removeBoardItem($index)" />
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-form>
            <template #footer>
                <el-button @click="addCancel">{{ t('publicText.cancel') }}</el-button>
                <el-button type="primary" @click="onSubmit">{{ t('publicText.confirm') }}</el-button>
            </template>
        </el-dialog>

        <!-- 详情/编辑对话框 -->
        <el-dialog v-model="detailVisible" :title="t('publicText.detail')" width="85%" @close="addDetailCancel">
            <el-form :model="editForm" ref="editFormRef" label-width="auto" size="small">
                <div class="form-section">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item :label="t('baseData.leftRightMerge.mergeName')" class="mb-2">
                                <el-input v-model="editForm.panelmerge_name" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item :label="t('baseData.leftRightMerge.mergeId')" class="mb-2">
                                <el-input :value="editForm.panelmerge_id" readonly />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>

                <div class="form-section">
                    <el-row :gutter="20">
                        <!-- 左灯信息 -->
                        <el-col :span="12" class="compact-col">
                            <div class="section-title">{{ t('baseData.leftRightMerge.leftInfo') }}</div>
                            <el-row :gutter="8">
                                <el-col :span="12">
                                    <el-form-item :label="t('baseData.leftRightMerge.materialCode')" class="mb-2">
                                        <el-autocomplete v-model="editForm.panelmerge_left_no"
                                            :fetch-suggestions="remoteMethod"
                                            :placeholder="t('baseData.leftRightMerge.inputCode')" @select="change3" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item :label="t('baseData.leftRightMerge.materialName')" class="mb-2">
                                        <el-input v-model="editForm.panelmerge_left_name" disabled />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item :label="t('baseData.leftRightMerge.materialSpec')" class="mb-2">
                                        <el-input v-model="editForm.panelmerge_left_desc" type="textarea" disabled />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-col>

                        <div class="vertical-divider"></div>

                        <!-- 右灯信息 -->
                        <el-col :span="12" class="compact-col">
                            <div class="section-title">{{ t('baseData.leftRightMerge.rightInfo') }}</div>
                            <el-row :gutter="8">
                                <el-col :span="12">
                                    <el-form-item :label="t('baseData.leftRightMerge.materialCode')" class="mb-2">
                                        <el-autocomplete v-model="editForm.panelmerge_right_no"
                                            :fetch-suggestions="remoteMethod"
                                            :placeholder="t('baseData.leftRightMerge.inputCode')" @select="change4" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item :label="t('baseData.leftRightMerge.materialName')" class="mb-2">
                                        <el-input v-model="editForm.panelmerge_right_name" disabled />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item :label="t('baseData.leftRightMerge.materialSpec')" class="mb-2">
                                        <el-input v-model="editForm.panelmerge_right_desc" type="textarea" disabled />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </div>

                <el-form-item :label="t('baseData.leftRightMerge.multiWoMode')" prop="order">
                    <el-switch v-model="editForm.panelmerge_manywo" :active-text="t('publicText.enable')"
                        :inactive-text="t('publicText.disable')" :active-value="true" :inactive-value="false" />
                </el-form-item>

                <div class="form-section">
                    <h3 class="section-title">{{ t('baseData.leftRightMerge.panelDetail') }}</h3>
                    <el-table :data="editForm.bomlist" style="width: 100%" border :height="200" size="small">
                        <el-table-column :label="t('publicText.index')" width="55">
                            <template #default="{ $index }">
                                <span>{{ $index + 1 }}</span>
                            </template>
                        </el-table-column>

                        <el-table-column :label="t('baseData.leftRightMerge.panelMaterialCode')">
                            <template #default="{ row, $index }">
                                <el-select v-model="row.panelmergebom_no" filterable size="small" style="width: 100%"
                                    @change="(val: string) => changePuzzle(val, $index)">
                                    <el-option v-for="item in puzzlesOptions" :key="item.PN" :label="item.PN"
                                        :value="item.PN" />
                                </el-select>
                            </template>
                        </el-table-column>

                        <el-table-column :label="t('baseData.leftRightMerge.usageQty')">
                            <template #default="{ row }">
                                <el-input-number v-model="row.panelmergebom_qty" size="small" :min="1" />
                            </template>
                        </el-table-column>

                        <el-table-column :label="t('baseData.leftRightMerge.finishedName')">
                            <template #default="{ row }">
                                <el-input v-model="row.panelmergebom_name" size="small" />
                            </template>
                        </el-table-column>

                        <el-table-column :label="t('baseData.leftRightMerge.finishedSpec')">
                            <template #default="{ row }">
                                <el-input v-model="row.panelmergebom_desc" size="small" />
                            </template>
                        </el-table-column>

                        <el-table-column :label="t('publicText.operation')" width="120">
                            <template #default="{ $index }">
                                <el-button type="danger" size="small" :icon="Delete"
                                    @click="handleDetailDelete($index)" />
                                <el-button v-if="$index === editForm.bomlist.length - 1" type="primary" size="small"
                                    :icon="Plus" @click="addDetailSmallBoard" />
                            </template>
                        </el-table-column>
                    </el-table>
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
import { ref, reactive, computed, watch, nextTick, onMounted, onBeforeMount, onBeforeUnmount } from 'vue'
import { ElNotification, ElMessageBox } from 'element-plus'
import { Search, Document, Delete, Plus } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { getToken } from '@/utils/auth'
// 请根据实际 API 路径调整
// import {
//   QueryPanelmergeAllList,
//   QueryPanelmerge,
//   addPanelmergeList,
//   DeletePanelmerge,
//   QueryFoundation,
//   findPanelizationList
// } from '@/api/puzzleApi'

const { t } = useI18n()

// 搜索相关
const searchText = ref('')
const tableData = ref<any[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const tableHeight = ref(0)
const dialogVisible = ref(false)
const detailVisible = ref(false)
const formRef = ref()
const editFormRef = ref()
const puzzlesOptions = ref<any[]>([])

// 表单数据
const form = ref({
    id: 0,
    panelmerge_name: '',
    panelmerge_left_no: '',
    panelmerge_left_name: '',
    panelmerge_left_desc: '',
    panelmerge_right_no: '',
    panelmerge_right_name: '',
    panelmerge_right_desc: '',
    panelmerge_manywo: false,
    panelmerge_updateuser: '',
    bomlist: [
        {
            panelmergebom_no: '',
            panelmergebom_name: '',
            panelmergebom_desc: '',
            panelmergebom_qty: 1
        }
    ]
})

const editForm = ref({
    id: 0,
    panelmerge_id: '',
    panelmerge_name: '',
    panelmerge_left_no: '',
    panelmerge_left_name: '',
    panelmerge_left_desc: '',
    panelmerge_right_no: '',
    panelmerge_right_name: '',
    panelmerge_right_desc: '',
    panelmerge_manywo: false,
    panelmerge_updateuser: '',
    bomlist: [
        {
            panelmergebom_no: '',
            panelmergebom_name: '',
            panelmergebom_desc: '',
            panelmergebom_qty: 1
        }
    ]
})

// 自动生成合并ID
const allCode = computed(() => {
    if (form.value.panelmerge_left_no && form.value.panelmerge_right_no) {
        return `${form.value.panelmerge_left_no}+${form.value.panelmerge_right_no}`
    }
    return form.value.panelmerge_left_no || form.value.panelmerge_right_no || ''
})

// 监听左右编码变化，自动设置多工单及清空名称规格
watch(() => form.value.panelmerge_left_no, (val) => {
    if (!val) {
        form.value.panelmerge_left_name = ''
        form.value.panelmerge_left_desc = ''
    }
    if (val && form.value.panelmerge_right_no) {
        form.value.panelmerge_manywo = true
    }
})

watch(() => form.value.panelmerge_right_no, (val) => {
    if (!val) {
        form.value.panelmerge_right_name = ''
        form.value.panelmerge_right_desc = ''
    }
    if (val && form.value.panelmerge_left_no) {
        form.value.panelmerge_manywo = true
    }
})

watch(() => editForm.value.panelmerge_left_no, (val) => {
    if (!val) {
        editForm.value.panelmerge_left_name = ''
        editForm.value.panelmerge_left_desc = ''
    }
})

watch(() => editForm.value.panelmerge_right_no, (val) => {
    if (!val) {
        editForm.value.panelmerge_right_name = ''
        editForm.value.panelmerge_right_desc = ''
    }
})

// 获取数据
const getData = () => {
    // 模拟或实际调用
    // QueryPanelmergeAllList({ panelmerge_id: '' }).then((res) => {
    //   if (res.Success) {
    //     tableData.value = res.Data
    //   }
    // })
}

const getPuzzles = () => {
    // findPanelizationList({ PageIndex: 1, PageSize: 1000, SearchText: '', StartTime: '', EndTime: '' }).then((res) => {
    //   if (res.Success) {
    //     puzzlesOptions.value = res.Data.list
    //   }
    // })
}

const getSearchData = () => {
    // QueryPanelmergeAllList({ panelmerge_id: '' }).then((res) => {
    //   if (res.Success) {
    //     if (res.Data.length === 0) {
    //       ElNotification({ type: 'error', title: t('publicText.tip'), message: t('baseData.leftRightMerge.noData') })
    //       return
    //     }
    //     const searchName = searchText.value.toLowerCase()
    //     currentPage.value = 1
    //     tableData.value = res.Data.filter((v: any) =>
    //       String(v.panelmerge_id).toLowerCase().includes(searchName) ||
    //       String(v.panelmerge_name).toLowerCase().includes(searchName)
    //     )
    //   }
    // })
}

const clearData = () => {
    searchText.value = ''
    currentPage.value = 1
    getData()
}

const openAdd = () => {
    dialogVisible.value = true
}

// 自动完成远程搜索
const remoteMethod = (query: string, cb: any) => {
    if (query.length >= 13) {
        // QueryFoundation({ part_no: query, part_type: '0' }).then((res) => {
        //   if (!res.Data || res.Data.length === 0) {
        //     ElNotification({ type: 'error', title: t('publicText.tip'), message: t('baseData.leftRightMerge.noData') })
        //     cb([])
        //     return
        //   }
        //   cb(res.Data.map((item: any) => ({ value: item.part_no, ...item })))
        // })
    } else {
        cb([])
    }
}

const change1 = (val: any) => {
    form.value.panelmerge_left_name = val.part_name
    form.value.panelmerge_left_desc = val.part_desc
}
const change2 = (val: any) => {
    form.value.panelmerge_right_name = val.part_name
    form.value.panelmerge_right_desc = val.part_desc
}
const change3 = (val: any) => {
    editForm.value.panelmerge_left_name = val.part_name
    editForm.value.panelmerge_left_desc = val.part_desc
}
const change4 = (val: any) => {
    editForm.value.panelmerge_right_name = val.part_name
    editForm.value.panelmerge_right_desc = val.part_desc
}

// 大板明细操作
const addSmallBoard = () => {
    form.value.bomlist.push({
        panelmergebom_no: '',
        panelmergebom_name: '',
        panelmergebom_desc: '',
        panelmergebom_qty: 1
    })
}
const removeBoardItem = (index: number) => {
    form.value.bomlist.splice(index, 1)
    if (form.value.bomlist.length === 0) {
        addSmallBoard()
    }
}
const changePuzzle1 = (val: string, index: number) => {
    const selected = puzzlesOptions.value.find((item) => item.PN === val)
    if (selected) {
        form.value.bomlist[index].panelmergebom_no = selected.PN
        form.value.bomlist[index].panelmergebom_name = selected.name
        form.value.bomlist[index].panelmergebom_desc = selected.pn_spec
    }
}
const changePuzzle = (val: string, index: number) => {
    const selected = puzzlesOptions.value.find((item) => item.PN === val)
    if (selected) {
        editForm.value.bomlist[index].panelmergebom_name = selected.name
        editForm.value.bomlist[index].panelmergebom_desc = selected.pn_spec
    }
}

// 提交添加
const onSubmit = () => {
    if (form.value.bomlist.length === 1 && !form.value.bomlist[0].panelmergebom_no) {
        ElNotification({ type: 'error', title: t('publicText.tip'), message: t('baseData.leftRightMerge.requiredPanel') })
        return
    }
    //   form.value.panelmerge_updateuser = getToken()
    // addPanelmergeList(form.value).then((res) => {
    //   if (res.Success) {
    //     ElNotification({ type: 'success', title: t('publicText.tip'), message: t('publicText.addSuccess') })
    //     dialogVisible.value = false
    //     getData()
    //   } else {
    //     ElNotification({ type: 'error', title: t('publicText.tip'), message: res.Msg })
    //   }
    // })
}

const addCancel = () => {
    dialogVisible.value = false
    form.value = {
        id: 0,
        panelmerge_name: '',
        panelmerge_left_no: '',
        panelmerge_left_name: '',
        panelmerge_left_desc: '',
        panelmerge_right_no: '',
        panelmerge_right_name: '',
        panelmerge_right_desc: '',
        panelmerge_manywo: false,
        panelmerge_updateuser: '',
        bomlist: [{ panelmergebom_no: '', panelmergebom_name: '', panelmergebom_desc: '', panelmergebom_qty: 1 }]
    }
}

// 编辑
const handleEdit = (row: any) => {
    // QueryPanelmerge({ id: row.id }).then((res) => {
    //   if (res.Success) {
    //     editForm.value = res.Data
    //     if (editForm.value.bomlist.length === 0) {
    //       editForm.value.bomlist.push({ panelmergebom_no: '', panelmergebom_name: '', panelmergebom_desc: '', panelmergebom_qty: 1 })
    //     }
    //     detailVisible.value = true
    //   } else {
    //     ElNotification({ type: 'error', title: t('publicText.tip'), message: res.Msg })
    //   }
    // })
    // 临时模拟
    editForm.value = JSON.parse(JSON.stringify(row))
    if (editForm.value.bomlist.length === 0) {
        editForm.value.bomlist.push({ panelmergebom_no: '', panelmergebom_name: '', panelmergebom_desc: '', panelmergebom_qty: 1 })
    }
    detailVisible.value = true
}

const handleDelete = (row: any) => {
    ElMessageBox.confirm(t('publicText.confirmDelete'), t('publicText.tip'), { type: 'warning' })
        .then(() => {
            // DeletePanelmerge({ id: row.id }).then((res) => {
            //   if (res.Success) {
            //     ElNotification({ type: 'success', title: t('publicText.tip'), message: t('publicText.deleteSuccess') })
            //     getData()
            //   }
            // })
        })
        .catch(() => { })
}

const handleDetailDelete = (index: number) => {
    editForm.value.bomlist.splice(index, 1)
    if (editForm.value.bomlist.length === 0) {
        editForm.value.bomlist.push({ panelmergebom_no: '', panelmergebom_name: '', panelmergebom_desc: '', panelmergebom_qty: 1 })
    }
}

const addDetailSmallBoard = () => {
    editForm.value.bomlist.push({ panelmergebom_no: '', panelmergebom_name: '', panelmergebom_desc: '', panelmergebom_qty: 1 })
}

const onDetailSubmit = () => {
    //   editForm.value.panelmerge_updateuser = getToken()
    // addPanelmergeList(editForm.value).then((res) => {
    //   if (res.Success) {
    //     ElNotification({ type: 'success', title: t('publicText.tip'), message: t('publicText.editSuccess') })
    //     detailVisible.value = false
    //     getData()
    //   }
    // })
}

const addDetailCancel = () => {
    detailVisible.value = false
    editForm.value = {
        id: 0,
        panelmerge_id: '',
        panelmerge_name: '',
        panelmerge_left_no: '',
        panelmerge_left_name: '',
        panelmerge_left_desc: '',
        panelmerge_right_no: '',
        panelmerge_right_name: '',
        panelmerge_right_desc: '',
        panelmerge_manywo: false,
        panelmerge_updateuser: '',
        bomlist: [{ panelmergebom_no: '', panelmergebom_name: '', panelmergebom_desc: '', panelmergebom_qty: 1 }]
    }
}

// 分页
const handleSizeChange = (val: number) => {
    pageSize.value = val
}
const handleCurrentChange = (val: number) => {
    currentPage.value = val
}

const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 220
    })
}

// 生命周期
onBeforeMount(() => {
    getScreenHeight()
    getData()
    getPuzzles()
})

onMounted(() => {
    window.addEventListener('resize', getScreenHeight)
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', getScreenHeight)
})
</script>

<style lang="scss" scoped>
.el-pagination {
    justify-content: center;
}

.form-section {
    .section-title {
        color: #409eff;
        font-size: 16px;
        margin: 0 0 16px 0;
        padding-bottom: 8px;
        border-bottom: 1px solid #eee;
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
    padding: 10px;
}
</style>