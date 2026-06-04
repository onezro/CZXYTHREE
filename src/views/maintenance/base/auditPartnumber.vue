<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="mb-2">
                <el-button type="primary" :size="'small'" @click="openAdd">{{ t('publicText.add') }}</el-button>
            </div>
            <el-table :data="displayData" border :height="tableHeight" style="width: 100%" size="small">
                <el-table-column :label="t('publicText.index')" width="55" fixed="left" align="center">
                    <template #default="{ $index }">
                        {{ (currentPage - 1) * pageSize + $index + 1 }}
                    </template>
                </el-table-column>
                <el-table-column prop="examine_productname" :label="t('deviceManage.auditPartnumber.partnumber')" />
                <el-table-column prop="examine_status" :label="t('deviceManage.auditPartnumber.enable')">
                    <template #default="{ row }">
                        <el-switch v-model="row.examine_status" :active-value="1" :inactive-value="0"
                            @change="(val: number) => editSubmit(val, row)" />
                    </template>
                </el-table-column>
                <el-table-column fixed="right" :label="t('publicText.operation')" width="80" align="center">
                    <template #default="{ row }">
                        <el-button type="danger" size="small" icon="Delete" @click="deleteData(row)"></el-button>
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
                    @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
                    :page-sizes="[10, 20, 50, 100, 200]" layout="total,sizes, prev, pager, next"
                    :total="tableData.length" />
            </div>

            <!-- 添加对话框 -->
            <el-dialog :title="t('publicText.add')" v-model="addVisible" width="450px" @close="addCancel"
                :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false">
                <el-form :model="addForm" ref="addFormRef" label-width="auto" :rules="formRules">
                    <el-form-item :label="t('deviceManage.auditPartnumber.partnumber')" prop="examine_productname">
                        <el-input v-model="addForm.examine_productname"
                            :placeholder="t('deviceManage.auditPartnumber.partnumberPlaceholder')" autocomplete="off" />
                    </el-form-item>
                    <el-form-item :label="t('deviceManage.auditPartnumber.enable')" prop="examine_status">
                        <el-switch v-model="addForm.examine_status" :active-value="1" :inactive-value="0" />
                    </el-form-item>
                </el-form>
                <template #footer>
                    <el-button @click="addCancel">{{ t('publicText.cancel') }}</el-button>
                    <el-button type="primary" @click="addSubmit">{{ t('publicText.confirm') }}</el-button>
                </template>
            </el-dialog>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useUserStoreWithOut } from '@/stores/modules/user'
import {
    QueryXYL_BadExamine,
    InsertXYL_BadExamine,
    UpdateXYL_BadExamine,
    DeleteXYL_BadExamine
} from '@/api/deviceManage/index'  // 请根据实际路径调整

const userStore = useUserStoreWithOut()
const { t } = useI18n()

// 数据类型定义
interface AuditPartnumberItem {
    examine_productname: string
    examine_status: number   // 1-启用，0-禁用
}

// 表格数据
const tableData = ref<AuditPartnumberItem[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const tableHeight = ref(0)

// 添加表单数据
const addForm = ref<AuditPartnumberItem>({
    examine_productname: '',
    examine_status: 1
})

// 对话框显示状态
const addVisible = ref(false)

// 表单引用
const addFormRef = ref()

// 表单校验规则
const formRules = {
    examine_productname: [
        { required: true, message: t('deviceManage.auditPartnumber.partnumberRequired'), trigger: 'blur' }
    ]
}

// 前端分页数据
const displayData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return tableData.value.slice(start, end)
})

// 获取数据列表
const getData = () => {
    QueryXYL_BadExamine({ examine_productname: '' }).then((res: any) => {
        if (res && res.Data) {
            tableData.value = res.Data
            // 重置当前页，防止删除后当前页无效
            currentPage.value = 1
        }
    })
}

// 打开添加对话框
const openAdd = () => {
    addVisible.value = true
}

// 取消添加
const addCancel = () => {
    addVisible.value = false
    addForm.value = {
        examine_productname: '',
        examine_status: 1
    }
    addFormRef.value?.resetFields()
}

// 提交添加
const addSubmit = () => {
    addFormRef.value?.validate((valid: boolean) => {
        if (valid) {
            const params = {
                ...addForm.value,
                UserNo: userStore.getUserInfo
            }
            InsertXYL_BadExamine(params).then((res: any) => {
                if (res.Success) {
                    ElMessage({
                        type: 'success',
                        message: res.Msg || t('deviceManage.auditPartnumber.addSuccess')
                    })
                    getData()
                    addVisible.value = false
                } else {
                    ElMessage({
                        type: 'error',
                        message: res.Msg || t('deviceManage.auditPartnumber.addFailed')
                    })
                }
            })
        }
    })
}

// 开关状态修改（启用/禁用）
const editSubmit = (val: number, row: AuditPartnumberItem) => {
    const params = {
        examine_productname: row.examine_productname,
        examine_status: val,
        UserNo: userStore.getUserInfo
    }
    UpdateXYL_BadExamine(params).then((res: any) => {
        if (res.Success) {
            ElMessage({
                type: 'success',
                message: res.Msg || t('deviceManage.auditPartnumber.editSuccess')
            })
            getData()
        } else {
            ElMessage({
                type: 'error',
                message: res.Msg || t('deviceManage.auditPartnumber.editFailed')
            })
        }
    })
}

// 删除料号
const deleteData = (row: AuditPartnumberItem) => {
    ElMessageBox.confirm(t('deviceManage.auditPartnumber.deleteConfirm'), t('publicText.confirm'), {
        confirmButtonText: t('publicText.confirm'),
        cancelButtonText: t('publicText.cancel'),
        type: 'warning',
    })
        .then(() => {
            DeleteXYL_BadExamine({ examine_productname: row.examine_productname }).then((res: any) => {
                if (res.Success) {
                    ElMessage({
                        type: 'success',
                        message: res.Msg || t('deviceManage.auditPartnumber.deleteSuccess')
                    })
                    getData()
                } else {
                    ElMessage({
                        type: 'error',
                        message: res.Msg || t('deviceManage.auditPartnumber.deleteFailed')
                    })
                }
            })
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: t('deviceManage.auditPartnumber.deleteCancel')
            })
        })
}

// 分页大小变化
const handleSizeChange = (val: number) => {
    pageSize.value = val
    currentPage.value = 1
}

// 当前页变化
const handleCurrentChange = (val: number) => {
    currentPage.value = val
}

// 自适应表格高度
const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 180
    })
}

// 生命周期
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