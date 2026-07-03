<template>
    <div class="smdPro p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="table_header flex justify-between items-center">
                <div>
                    <el-button type="primary" size="small" @click="openAdd">
                        {{ t('smtapply.smdPro.addEditTitle') }}
                    </el-button>
                </div>
                <div class="input_box">
                    <el-input v-model="getlistText.searchText" :placeholder="t('smtapply.smdPro.searchPlaceholder')"
                        clearable size="small" @input="getSearchData" @change="getSearchData">
                        <template #append>
                            <el-button icon="Search" />
                        </template>
                    </el-input>
                </div>
            </div>

            <div class="table_container">
                <el-table :data="tableData" :height="tableHeight" border size="small" style="width: 100%" stripe
                    highlight-current-row>
                    <el-table-column :label="t('publicText.index')" width="55" align="center" type="index" />
                    <el-table-column prop="ProductName" :label="t('smtapply.smdPro.productName')" min-width="120" />
                    <el-table-column prop="MjsId" :label="t('smtapply.smdPro.mjsId')" min-width="120" />
                    <el-table-column fixed="right" :label="t('publicText.operation')" width="120" align="center">
                        <template #default="{ row, $index }">
                            <el-button type="primary" icon="Edit" size="small" @click="handleEdit($index, row)">
                            
                            </el-button>
                            <el-button type="danger" icon="Delete" size="small" @click="handleDelete($index, row)">
                               
                            </el-button>
                        </template>
                    </el-table-column>

                    <template #empty>
                        <div class="flex items-center justify-center h-100%">
                            <el-empty />
                        </div>
                    </template>
                </el-table>

                <div class="block" style="margin-top: 8px">
                    <el-pagination background align="center" @size-change="handleSizeChange" :size="'small'"
                        @current-change="handleCurrentChange" :page-sizes="[5, 10, 20, 50, 100]"
                        :current-page="currentPage" :page-size="getlistText.pageSize"
                        layout="total, sizes, prev, pager, next, jumper" :total="total" />
                </div>
            </div>
        </el-card>

        <!-- 添加/修改弹窗 -->
        <el-dialog :title="t('smtapply.smdPro.addEditTitle')" v-model="dialogVisible" width="500px"
            :close-on-click-modal="false" @closed="handleDialogClosed">
            <el-form ref="formRef" :model="form" :rules="formRules" label-width="120px" >
                <el-form-item :label="t('smtapply.smdPro.productName')" prop="productName">
                    <el-input v-model="form.productName" :placeholder="t('smtapply.smdPro.productNamePlaceholder')" />
                </el-form-item>
                <el-form-item :label="t('smtapply.smdPro.mjsId')" prop="mjsId">
                    <el-input v-model="form.mjsId" :placeholder="t('smtapply.smdPro.mjsIdPlaceholder')" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="addCancel">{{ t('publicText.cancel') }}</el-button>
                <el-button type="primary" @click="onSubmit" :loading="submitLoading">
                    {{ t('publicText.confirm') }}
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { SaveMjsID, GetMjsList, DeleteMjsID } from '@/api/smtSet/smdPro'

const { t } = useI18n()

// ==================== 数据 ====================
const tableData = ref<any[]>([])
const total = ref(0)
const currentPage = ref(1)
const tableHeight = ref(0)
const submitLoading = ref(false)

// 查询参数
const getlistText = reactive({
    pageIndex: 1,
    pageSize: 50,
    searchText: '',
})

// 表单数据
const form = reactive({
    productName: '',
    mjsId: '',
})

// 弹窗
const dialogVisible = ref(false)
const isEdit = ref(false) // 区分新增/修改

// 表单引用
const formRef = ref()

// 表单验证规则（可根据需要调整）
const formRules = {
    productName: [
        { required: true, message: t('smtapply.smdPro.productNameRequired'), trigger: 'blur' },
    ],
    mjsId: [
        { required: true, message: t('smtapply.smdPro.mjsIdRequired'), trigger: 'blur' },
    ],
}

// ==================== 方法 ====================
// 获取数据
const getData = () => {

    GetMjsList(getlistText)
        .then((res: any) => {
            const parsed = JSON.parse(res.data)
            console.log(parsed);

            total.value = parsed.Total
            tableData.value = parsed.MjsList || []
        })


}

// 搜索
const getSearchData = () => {
    getlistText.pageIndex = 0
    currentPage.value = 1
    getData()
}

// 分页
const handleSizeChange = (val: number) => {
    getlistText.pageSize = val
    getData()
}
const handleCurrentChange = (val: number) => {
    getlistText.pageIndex = val - 1
    currentPage.value = val
    getData()
}

// 重置表单
const resetForm = () => {
    form.productName = ''
    form.mjsId = ''
}

// 打开新增
const openAdd = () => {
    isEdit.value = false
    resetForm()
    dialogVisible.value = true
}

// 修改
const handleEdit = (index: number, row: any) => {
    isEdit.value = true
    form.productName = row.ProductName
    form.mjsId = row.MjsId
    dialogVisible.value = true
}

// 提交表单
const onSubmit = () => {
    formRef.value?.validate((valid: boolean) => {
        if (!valid) return
        submitLoading.value = true
        const apiCall = isEdit.value
            ? SaveMjsID(form) // 修改接口（后端可能用相同接口，但这里逻辑不变）
            : SaveMjsID(form)

        apiCall
            .then((res: any) => {
                if (res.code === 1) {
                    ElMessage.success(res.msg || t('message.addSuccess'))
                    dialogVisible.value = false
                    resetForm()
                    getData()
                } else {
                    ElMessage.error(res.msg || t('message.addFailure'))
                }
            })
            .catch(() => {
                ElMessage.error(t('message.submitFailure'))
            })
            .finally(() => {
                submitLoading.value = false
            })
    })
}

// 取消
const addCancel = () => {
    dialogVisible.value = false
    resetForm()
}

// 弹窗关闭后重置表单验证
const handleDialogClosed = () => {
    formRef.value?.resetFields()
    resetForm()
}

// 删除
const handleDelete = (index: number, row: any) => {
    ElMessageBox.confirm(
        t('smtapply.smdPro.deleteConfirm', { name: row.ProductName }),
        t('publicText.tip'),
        {
            confirmButtonText: t('publicText.confirm'),
            cancelButtonText: t('publicText.cancel'),
            type: 'warning',
        }
    )
        .then(() => {
            return DeleteMjsID({ MjsID: row.MjsId })
        })
        .then(() => {
            ElMessage.success(t('message.deleteSuccess'))
            // 如果当前页只有一条数据且不是第一页，页码减一
            if (tableData.value.length === 1 && getlistText.pageIndex > 0) {
                getlistText.pageIndex--
                currentPage.value = getlistText.pageIndex + 1
            }
            getData()
        })
        .catch(() => {
            ElMessage.info(t('publicText.cancel'))
        })
}

// ==================== 表格高度自适应 ====================
const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 190
    })
}

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