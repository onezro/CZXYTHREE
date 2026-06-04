<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div
                class="mb-2 pl-2 pr-2 flex justify-between items-center text-xl font-bold border-solid border-2 border-[#bdbdbd]">
                <div>{{ t('deviceManage.badRegistration.line') }}：{{ form.baddata_line }}</div>
                <div>{{ t('deviceManage.badRegistration.equipment') }}：{{ form.baddata_equipment }}</div>
                <div class="text-2xl cursor-pointer">
                    <el-icon :size="24" @click="openSet">
                        <Setting />
                    </el-icon>
                </div>
            </div>
            <div>
                <el-form ref="formRef" :model="form" label-width="auto" class="inbound" :inline="true" @submit.prevent>
                    <el-form-item :label="t('deviceManage.badRegistration.productSN')" prop="baddata_pcbid"
                        class="mb-2">
                        <el-input v-model="form.baddata_pcbid" ref="pcbRef"
                            :placeholder="t('deviceManage.badRegistration.snPlaceholder')" style="width: 640px"
                            @keyup.enter="changeInput" />
                    </el-form-item>
                    <el-form-item :label="t('deviceManage.badRegistration.side')" prop="Side" class="mb-2">
                        <el-select v-model="form.Side" style="width: 400px;">
                            <el-option label="TOP" value="TOP" />
                            <el-option label="BOT" value="BOT" />
                        </el-select>
                    </el-form-item>
                </el-form>

                <el-table :data="form.badrecodeList" border :style="{ width: '100%' }" :height="tableHeight">
                    <el-table-column :label="t('publicText.index')" width="60" align="center">
                        <template #default="{ $index }">{{ $index + 1 }}</template>
                    </el-table-column>
                    <el-table-column :label="t('deviceManage.badRegistration.badLocation')" prop="baddata_item">
                        <template #default="{ row }">
                            <el-input v-model="row.baddata_item"  />
                        </template>
                    </el-table-column>
                    <el-table-column :label="t('deviceManage.badRegistration.badCode')" prop="baddata_component">
                        <template #default="{ row }">
                            <el-select v-model="row.baddata_code"
                                :placeholder="t('deviceManage.badRegistration.selectBadCode')" filterable
                                style="width: 100%">
                                <el-option v-for="item in badList" :key="item.badphenomena_name"
                                    :label="item.badphenomena_value" :value="item.badphenomena_name" />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column :label="t('deviceManage.badRegistration.remark')" prop="baddata_code">
                        <template #default="{ row }">
                            <el-input v-model="row.baddata_remark"  />
                        </template>
                    </el-table-column>
                    <el-table-column :label="t('publicText.operation')" width="100" align="center">
                        <template #default="{ $index }">
                            <el-button v-if="$index === form.badrecodeList.length - 1" type="primary" link :icon="Plus"
                                @click="addSmallBoard" />
                            <el-button v-else type="danger" link :icon="Delete" @click="removeBoardItem($index)" />
                        </template>
                    </el-table-column>
                </el-table>

                <div class="flex justify-end pt-2">
                    <el-button @click="restSubmit">{{ t('publicText.reset') }}</el-button>
                    <el-button type="primary" @click="handleSubmit">{{ t('publicText.submit') }}</el-button>
                </div>
            </div>
        </el-card>

        <!-- 设置对话框 -->
        <el-dialog :title="t('deviceManage.badRegistration.setting')" v-model="dialogSetVisible" width="30%"
            @close="dialogSetVisible = false" :append-to-body="true" :close-on-click-modal="false" align-center >
            <el-form ref="setFormRef" :model="changeForm" label-width="auto">
                <el-form-item :label="t('deviceManage.badRegistration.line')" prop="line">
                    <el-select v-model="changeForm.line" :placeholder="t('deviceManage.badRegistration.selectLine')"
                        style="width: 100%" @change="changeEquipment">
                        <el-option v-for="item in lineData" :key="item.MfgLineName" :label="item.MfgLineName"
                            :value="item.MfgLineName" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="t('deviceManage.badRegistration.equipment')" prop="equipment">
                    <el-select v-model="changeForm.equipment"
                        :placeholder="t('deviceManage.badRegistration.selectEquipment')" style="width: 100%">
                        <el-option v-for="item in equipmentData" :key="item.RESOURCENAME" :label="item.Description"
                            :value="item.RESOURCENAME" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogSetVisible = false">{{ t('publicText.close') }}</el-button>
                <el-button type="primary" @click="onSubmitSet">{{ t('publicText.confirm') }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Setting, Plus, Delete } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { useUserStoreWithOut } from '@/stores/modules/user'
import {
    QueryMfgLine,
    QueryEquipment,
    InsertXYL_BadProductInformation,
    QueryBadCodeFromType
} from '@/api/deviceManage/index'   // 请根据实际路径调整

const { t } = useI18n()
const userStore = useUserStoreWithOut()

// ========== 类型定义 ==========
interface BadRecordItem {
    baddata_item: string
    baddata_code: string
    baddata_remark: string
}

interface FormData {
    baddata_line: string
    baddata_equipment: string
    baddata_pcbid: string
    Side: string
    badrecodeList: BadRecordItem[]
    UserNo: string
}

interface ChangeForm {
    line: string
    equipment: string
}

interface LineItem {
    MfgLineName: string
}

interface EquipmentItem {
    RESOURCENAME: string
    Description: string
}

interface BadCodeItem {
    badphenomena_name: string
    badphenomena_value: string
}

// ========== 响应式数据 ==========
const form = ref<FormData>({
    baddata_line: '',
    baddata_equipment: '',
    baddata_pcbid: '',
    Side: 'TOP',
    badrecodeList: [{ baddata_item: '', baddata_code: '', baddata_remark: '' }],
    UserNo: userStore.getUserInfo
})

const tableHeight = ref(0)
const lineData = ref<LineItem[]>([])
const equipmentData = ref<EquipmentItem[]>([])
const dialogSetVisible = ref(false)
const changeForm = ref<ChangeForm>({ line: '', equipment: '' })
const badList = ref<BadCodeItem[]>([])

const getBadCodeForm = reactive({
    badphenomena_name: '',
    badphenomena_fathertype: ''
})

// 模板引用
const pcbRef = ref<HTMLInputElement>()
const formRef = ref()
const setFormRef = ref()

// ========== 辅助方法 ==========
const getEquipmentPrefix = (equipment: string): string => {
    return equipment.split('-')[0] || ''
}

// ========== 初始化数据 ==========
const initFormData = () => {
    const line = localStorage.getItem('LINE') || t('deviceManage.badRegistration.defaultLine')
    const equipment = localStorage.getItem('EQUIPMENT') || t('deviceManage.badRegistration.defaultEquipment')

    form.value = {
        ...form.value,
        baddata_line: line,
        baddata_equipment: equipment
    }
    changeForm.value = { line, equipment }
    getBadCodeForm.badphenomena_fathertype = getEquipmentPrefix(equipment)
}

const getBadCode = () => {
    QueryBadCodeFromType(getBadCodeForm).then((res: any) => {
        if (res && res.Data) {
            badList.value = res.Data
        }
    })
}

const getLineData = () => {
    QueryMfgLine({ LineName: '' }).then((res: any) => {
        if (res && res.Data) {
            lineData.value = res.Data
        }
    })
}

const getEquipmentData = () => {
    equipmentData.value = []
    QueryEquipment({
        EquipmenName: '',
        LineName: changeForm.value.line
    }).then((res: any) => {
        if (res && res.Data) {
            equipmentData.value = res.Data
        }
    })
}

// ========== 事件处理 ==========
const changeEquipment = () => {
    changeForm.value.equipment = ''
    getEquipmentData()
}

const onSubmitSet = () => {
    localStorage.setItem('LINE', changeForm.value.line)
    localStorage.setItem('EQUIPMENT', changeForm.value.equipment)
    ElMessage.success(t('deviceManage.badRegistration.settingSuccess'))
    form.value.baddata_line = changeForm.value.line
    form.value.baddata_equipment = changeForm.value.equipment
    getBadCodeForm.badphenomena_fathertype = getEquipmentPrefix(changeForm.value.equipment)
    getBadCode()
    dialogSetVisible.value = false
    pcbRef.value?.focus()
}

const openSet = () => {
    dialogSetVisible.value = true
}

const restSubmit = () => {
    form.value.baddata_pcbid = ''
    form.value.badrecodeList = [{ baddata_item: '', baddata_code: '', baddata_remark: '' }]
    pcbRef.value?.focus()
}

const removeBoardItem = (index: number) => {
    form.value.badrecodeList.splice(index, 1)
    if (form.value.badrecodeList.length === 0) {
        form.value.badrecodeList.push({ baddata_item: '', baddata_code: '', baddata_remark: '' })
    }
}

const handleSubmit = () => {
    InsertXYL_BadProductInformation(form.value).then((res: any) => {
        if (res.Success) {
            ElMessage.success(t('deviceManage.badRegistration.submitSuccess'))
            restSubmit()
        } else {
            ElMessage.error(res.Msg || t('deviceManage.badRegistration.submitFailed'))
        }
    })
}

const addSmallBoard = () => {
    form.value.badrecodeList.push({ baddata_item: '', baddata_code: '', baddata_remark: '' })
}

// 产品 SN 回车事件（原 changeInput，为空则不做额外动作）
const changeInput = () => {
    // 可在此添加扫描后的自动聚焦逻辑，原代码未定义具体内容，保留空实现
}

// ========== 表格高度自适应 ==========
const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 240
    })
}

// ========== 生命周期 ==========
onBeforeMount(() => {
    getScreenHeight()
    initFormData()
})

onMounted(() => {
    window.addEventListener('resize', getScreenHeight)
    getBadCode()
    getLineData()
    getEquipmentData()
    pcbRef.value?.focus()
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
<style lang="scss">
.inbound .el-form-item__label {
  font-size: 20px;
}

.inbound .el-input__inner {
  font-size: 28px;
  font-weight: bolder;
}

.inbound .el-textarea__inner {
  font-size: 28px;
  font-weight: bolder;
}
.inbound .el-select__wrapper {
  font-size: 28px;
  font-weight: bolder;
}

.success-message .el-textarea__inner {
  color: #67c23a !important;
}

/* 失败样式 - 红色文字 */
.error-message .el-textarea__inner {
  color: #f56c6c !important;
}
</style>