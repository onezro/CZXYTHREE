<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="mb-2">
                <el-button type="primary" :size="'small'" @click="openAdd">{{ t('publicText.add') }}</el-button>
            </div>
            <el-table :data="displayData" border :height="tableHeight" style="width: 100%" stripe size="small">
                <!-- 序号列 -->
                <el-table-column type="index" :label="t('publicText.index')" width="55" fixed="left" align="center">
                    <template #default="{ $index }">
                        {{ $index + 1 + (currentPage - 1) * pageSize }}
                    </template>
                </el-table-column>

                <!-- 数据列 -->
                <el-table-column prop="badphenomena_name" :label="t('deviceManage.badType.categoryName')" />

                <!-- 操作列 -->
                <el-table-column fixed="right" :label="t('publicText.operation')" width="140" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" icon="Edit" @click="handleEdit(row)" />
                        <el-button type="danger" size="small" icon="Delete" @click="handleDelete(row)" />
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
            <el-dialog :title="t('publicText.add')" v-model="dialogAddVisible" width="30%" @close="addCancel" :append-to-body="true"
                :close-on-click-modal="false" :close-on-press-escape="false">
                <el-form :model="form" ref="addFormRef" label-width="auto" :rules="formRules">
                    <el-form-item :label="t('deviceManage.badType.categoryName')" prop="badphenomena_name">
                        <el-input v-model="form.badphenomena_name" autocomplete="off" />
                    </el-form-item>
                </el-form>
                <template #footer>
                    <el-button @click="addCancel">{{ t('publicText.cancel') }}</el-button>
                    <el-button type="primary" @click="handleSubmit">{{ t('publicText.confirm') }}</el-button>
                </template>
            </el-dialog>

            <!-- 编辑对话框 -->
            <el-dialog :title="t('publicText.edit')" v-model="dialogEditVisible" width="30%" @close="editCancel" :append-to-body="true"
                :close-on-click-modal="false" :close-on-press-escape="false">
                <el-form :model="editFrom" ref="editFormRef" label-width="auto" :rules="formRules">
                    <el-form-item :label="t('deviceManage.badType.categoryName')" prop="badphenomena_name">
                        <el-input v-model="editFrom.badphenomena_name" autocomplete="off" />
                    </el-form-item>
                </el-form>
                <template #footer>
                    <el-button @click="editCancel">{{ t('publicText.cancel') }}</el-button>
                    <el-button type="primary" @click="handleEditSubmit">{{ t('publicText.confirm') }}</el-button>
                </template>
            </el-dialog>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus'
import {
    QueryBadTypebasicInformation,
    InsertBadTypeInformation,
    UpdateBadTypeInformation,
    DeleteBadTypeInformation,
} from '@/api/deviceManage/index'

import { useUserStoreWithOut } from "@/stores/modules/user";
import { useI18n } from "vue-i18n";

const userStore = useUserStoreWithOut();
const { t } = useI18n();

// 定义数据类型
interface BadTypeItem {
    badphenomena_id?: number
    badphenomena_name: string
    UserNo?: string
}

// 表格数据
const tableData = ref<BadTypeItem[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const tableHeight = ref(0)

// 表单数据
const form = ref<BadTypeItem>({
    badphenomena_name: '',
    UserNo:userStore.getUserInfo
})

const editFrom = ref<BadTypeItem>({
    badphenomena_id: undefined,
    badphenomena_name: '',
    UserNo:userStore.getUserInfo
})

// 对话框显示状态
const dialogAddVisible = ref(false)
const dialogEditVisible = ref(false)

// 表单引用
const addFormRef = ref()
const editFormRef = ref()

// 表单校验规则
const formRules = {
    badphenomena_name: [
        { required: true, message: t('deviceManage.badType.nameRequired'), trigger: 'blur' }
    ]
}

// 前端分页：计算当前页显示的数据
const displayData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return tableData.value.slice(start, end)
})

// 获取数据
const getData = () => {
    QueryBadTypebasicInformation({ badphenomena_name: '' }).then((res: any) => {
        if (res && res.Data) {
            tableData.value = res.Data
            // 重置当前页为第一页，防止删除后当前页超出最大页码
            currentPage.value = 1
        }
    })
}

// 打开添加对话框
const openAdd = () => {
    dialogAddVisible.value = true
}

// 取消添加
const addCancel = () => {
    dialogAddVisible.value = false
    form.value.badphenomena_name = ''
    addFormRef.value?.resetFields()
}

// 提交添加
const handleSubmit = () => {
    addFormRef.value?.validate((valid: boolean) => {
        if (valid) {
            InsertBadTypeInformation(form.value).then((res: any) => {
                if (res.Success) {
                    ElMessage({
                        type: 'success',
                        message: t('deviceManage.badType.addSuccess')
                    })
                    getData()
                    dialogAddVisible.value = false
                } else {
                    ElMessage({
                        type: 'error',
                        message: res.Msg || t('deviceManage.badType.addFailed')
                    })
                }
            })
        }
    })
}

// 编辑
const handleEdit = (row: BadTypeItem) => {
    editFrom.value = {
        badphenomena_id: row.badphenomena_id,
        badphenomena_name: row.badphenomena_name,
        UserNo: userStore.getUserInfo
    }
    dialogEditVisible.value = true
}

// 取消编辑
const editCancel = () => {
    dialogEditVisible.value = false
    editFrom.value.badphenomena_name = ''
    editFormRef.value?.resetFields()
}

// 提交编辑
const handleEditSubmit = () => {
    editFormRef.value?.validate((valid: boolean) => {
        if (valid) {
            UpdateBadTypeInformation(editFrom.value).then((res: any) => {
                if (res.Success) {
                    ElMessage({
                        type: 'success',
                        message: t('deviceManage.badType.editSuccess')
                    })
                    getData()
                    dialogEditVisible.value = false
                } else {
                    ElMessage({
                        type: 'error',
                        message: res.Msg || t('deviceManage.badType.editFailed')
                    })
                }
            })
        }
    })
}

// 删除
const handleDelete = (row: BadTypeItem) => {
    ElMessageBox.confirm(t('deviceManage.badType.deleteConfirm'), t('publicText.confirm'), {
        confirmButtonText: t('publicText.confirm'),
        cancelButtonText: t('publicText.cancel'),
        type: 'warning',
    })
        .then(() => {
            DeleteBadTypeInformation(row).then((res: any) => {
                if (res.Success) {
                    ElMessage({
                        type: 'success',
                        message: t('deviceManage.badType.deleteSuccess')
                    })
                    getData()
                } else {
                    ElMessage({
                        type: 'error',
                        message: res.Msg || t('deviceManage.badType.deleteFailed')
                    })
                }
            })
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: t('deviceManage.badType.deleteCancel')
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

// 获取屏幕高度用于表格自适应
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