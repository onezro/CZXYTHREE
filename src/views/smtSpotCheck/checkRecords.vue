<template>
  <div class="p-2">
    <el-card class="box-card" :body-style="{ padding: '8px' }">
      <!-- 筛选区域 -->
      <div>
        <el-form ref="form" class="form" :inline="true" :size="'small'" :model="getDataText">
          <el-form-item class="mb-2">
            <el-select v-model="getDataText.inspectType" style="width: 200px" @change="handleInspectTypeChange"
              placeholder="检查类型" size="small">
              <el-option v-for="item in typeList" :key="item.value" :label="item.lable" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item class="mb-2">
            <el-date-picker v-model="value1" type="datetimerange" range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期" value-format="YYYY-MM-DD HH:mm:ss" :shortcuts="pickerOptions.shortcuts"
              :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]" :clearable="false"
              @change="handleDateRangeChange" />
          </el-form-item>
          <el-form-item class="mb-2">
            <el-select v-model="getDataText.lineName" placeholder="线体" style="width: 200px" clearable>
              <el-option v-for="item in lineList" :key="item.value" :label="item.lable" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item class="mb-2" v-show="getDataText.inspectType == 'WI'">
            <el-input placeholder="请输入工单" clearable v-model="getDataText.wo" />
          </el-form-item>
          <el-form-item class="mb-2">
            <el-button type="primary" @click="getData">查询</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 左右布局 -->
      <el-row :gutter="16">
        <!-- 左侧：任务-工序 树形表格（两层） -->
        <el-col :span="9">
          <el-table :data="paginatedLeftData" border :height="tableHeight" row-key="id"
            :tree-props="{ children: 'children' }" size="small" @row-click="handleLeftRowClick" highlight-current-row>
            <el-table-column prop="displayName" label="任务/工序" min-width="150">
              <template #default="{ row }">
                <span :style="{ fontWeight: row.nodeType === 'order' ? 'bold' : 'normal' }">
                  {{ row.displayName }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="updateTime" label="更新时间" width="150" />
            <el-table-column prop="stateText" label="状态" width="100">
              <template #default="{ row }">
                <el-tag v-if="row.state !== undefined&&row.state !== null" :type="stateTag(row.state)" effect="plain" size="small">
                  {{ stateText(row.state) }}
                </el-tag>
              </template>
            </el-table-column>
            <template #empty>
              <div class="flex items-center justify-center h-100%">
                <el-empty />
              </div>
            </template>
          </el-table>

          <div class="block" style="margin-top: 8px">
            <el-pagination :size="'small'" background @size-change="handleSizeChange"
              @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
              :page-sizes="[5, 10, 20, 50, 100]" layout="total,sizes, prev, pager, next, jumper"
              :total="leftTableData.length" />
          </div>
        </el-col>

        <!-- 右侧：子项明细表格 -->
        <el-col :span="15">
          <div class="right-table-wrapper" :style="{ height: tableHeight + 40 + 'px' }">
            <el-card shadow="never" class="detail-card" :body-style="{ padding: '8px' }">
              <template #header>
                <div class="detail-header">
                  <span>子项明细：</span>
                  <span v-if="currentStepInfo" class="step-info text-[#409eff]">
                   {{ currentStepInfo.step }}（{{ currentStepInfo.stepName }}）
                  </span>
                </div>
              </template>
              <el-table :data="subItemList" border size="small" :height="subTableHeight" stripe>
                <el-table-column prop="SubItem" label="子项编号" width="80" :align="'center'"/>
                <el-table-column prop="SubItemName" label="检验项" min-width="120" show-overflow-tooltip />
                <el-table-column prop="SubItemMethod" label="检验方法(下限值)" min-width="120" show-overflow-tooltip />
                   <el-table-column prop="SubItemAim" label="检验目标(上限值)" width="120" show-overflow-tooltip />
                
                <el-table-column prop="SubItemSolution" label="解决方案(实际值)" min-width="120" show-overflow-tooltip />
             <el-table-column prop="SubItemBasic" label="标准要求(单位)" min-width="120" show-overflow-tooltip />
                <el-table-column prop="IsStatus" label="NG判定" width="80">
                  <template #default="{ row }">
                    <el-tag v-if="row.IsStatus !== undefined&&row.IsStatus !== null" :type="isStatusTag(row.IsStatus)" effect="plain"
                      size="small">
                      {{ isStatusText(row.IsStatus) }}
                    </el-tag>
                    <span v-else>-</span>
                  </template>
                </el-table-column>
                <el-table-column label="图片" width="100">
                  <template #default="{ row }">
                    <span v-for="(img, idx) in row.attachments" :key="idx">
                      <el-image style="width: 40px; height: 40px; margin-right: 4px" :src="img"
                        :preview-src-list="row.attachments" :preview-teleported="true" fit="cover" />
                    </span>
                  </template>
                </el-table-column>
                <template #empty>
                  <el-empty description="请从左侧选择工序查看子项" />
                </template>
              </el-table>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onBeforeMount, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { ElMessage, ElLoading } from 'element-plus'
import dayjs from 'dayjs'
import { QueryInspection } from '@/api/smtSpotCheck/base/index'
import { shortcuts, setTodayDate, setLastDate } from '@/utils/dataMenu'

// ---------- 类型定义 ----------
interface RawCheckItem {
  InspectOrder: string
  Step: number
  Name: string
  InspectContent: string
  SubItem: number
  SubItemName: string
  SubItemMethod: string
  SubItemBasic: string
  SubItemSolution: string
  SubItemAim: string
  SubItemStatus: string
  SubItemRemark: string
  Status: string
  Attachment1: any
  Attachment2: any
  Attachment3: any
  Attachment4: any
  Remark: string
  UpdateTime: string
  IsStatus: number
  MainInspectOrder: string
  InspectStatus: string
  WorkOrder: string
  LineName: string
  State: number
}

// 左侧树节点（两层：Order 和 Step）
interface LeftTreeNode {
  id: string
  nodeType: 'order' | 'step'
  displayName: string
  parentId?: string
  children?: LeftTreeNode[]
  // 公共字段
  inspectOrder?: string
  step?: number
  stepName?: string
  inspectContent?: string
  updateTime?: string
  lineName?: string
  workOrder?: string
  inspectStatus?: string
  state?: number
  // 原始数据（用于右侧获取子项）
  rawStepItems?: RawCheckItem[]   // 该工序下的所有原始记录，便于右侧展示子项
}

// 右侧子项展示数据
interface SubItemDisplay {
  SubItem: number
  SubItemName: string
  SubItemMethod: string
  SubItemBasic: string
  SubItemSolution: string
  SubItemAim: string
  SubItemStatus: string
  Status: string
  IsStatus?: number
  Remark: string
  attachments: string[]
}

// ---------- 响应式数据 ----------
const leftTableData = ref<LeftTreeNode[]>([])   // 左侧数据（顶层为Order，children为Step）
const currentPage = ref(1)
const pageSize = ref(10)
const tableHeight = ref(0)
const subTableHeight = ref(300)
const selectedStepId = ref<string | null>(null)   // 当前选中的工序ID
const subItemList = ref<SubItemDisplay[]>([])
const currentStepInfo = ref<{ step: number; stepName: string } | null>(null)

const getDataText = reactive({
  inspectType: 'EI',
  inspect: '',
  lineName: '',
  wo: '',
  dateStart: '',
  dateEnd: ''
})

const value1 = ref<string[]>([])

const lineList = [
  { lable: 'Line1', value: 'Line1' }, { lable: 'Line2', value: 'Line2' },
  { lable: 'Line3', value: 'Line3' }, { lable: 'Line4', value: 'Line4' },
  { lable: 'Line5', value: 'Line5' }, { lable: 'Line6', value: 'Line6' }, { lable: 'Line7', value: 'Line7' }
]

const typeList = [
  { lable: '首检', value: 'FI' }, { lable: '巡检', value: 'RI' },
  { lable: '设备点检', value: 'EI' }, { lable: '工艺参数点检', value: 'WI' }
]

const inquire = ref('times')
const pickerOptions = { shortcuts }
let loadingInstance: any = null

// ---------- 状态映射函数 ----------
const stateText = (value: number) => {
  const map: Record<number, string> = { 0: '未检验', 4: '检验中', 1: '检验完成', 2: '检验完成', 5: '已删除' }
  return map[value] || ''
}
const stateTag = (value: number) => {
  const map: Record<number, string> = { 0: 'info', 4: 'warning', 1: 'success', 2: 'success', 5: 'danger' }
  return map[value] || ''
}
const isStatusText = (value: number) => {
  const map: Record<number, string> = { 1: 'OK', 2: 'NG', 3: '不涉及' }
  return map[value] || ''
}
const isStatusTag = (value: number) => {
  const map: Record<number, string> = { 1: 'success', 2: 'danger', 3: 'info' }
  return map[value] || ''
}
const subItemStatusText = (value: string) => {
  const map: Record<string, string> = { 'I': '未开始', 'P': '进行中', 'S': '已检验', 'C': '已完成' }
  return map[value] || value
}
const subItemStatusTag = (value: string) => {
  const map: Record<string, string> = { 'I': 'info', 'P': 'warning', 'S': 'primary', 'C': 'success' }
  return map[value] || ''
}
const resultText = (value: string) => {
  const map: Record<string, string> = { '0': '未检查', '9': '正常', '1': 'NG', '2': '报修', '3': '故障' }
  return map[value] || ''
}
const resultTag = (value: string) => {
  const map: Record<string, string> = { '0': '', '9': 'success', '1': 'danger', '2': 'warning', '3': 'info' }
  return map[value] || ''
}
const resultText1 = (value: string) => {
  const map: Record<string, string> = { C: '已检验', D: '已删除', P: '进行中', I: '未开始' }
  return map[value] || ''
}
const resultTag1 = (value: string) => {
  const map: Record<string, string> = { C: 'success', D: 'danger', P: 'warning', I: 'info' }
  return map[value] || ''
}

// 提取图片URL（兼容字符串和对象）
const extractImageUrl = (attachment: any): string => {
  if (!attachment) return ''
  if (typeof attachment === 'string') return attachment
  if (attachment.Base64String) {
    if (attachment.Base64String.startsWith('data:image') || attachment.Base64String.startsWith('http')) {
      return attachment.Base64String
    }
    return `data:image/png;base64,${attachment.Base64String}`
  }
  return ''
}

// 收集子项的图片附件
const collectAttachments = (item: RawCheckItem): string[] => {
  const attachments: string[] = []
  for (let i = 1; i <= 4; i++) {
    const att = item[`Attachment${i}` as keyof RawCheckItem]
    const url = extractImageUrl(att)
    if (url) attachments.push(url)
  }
  return attachments
}

// 构建左侧两层树（Order -> Step）
const buildLeftTree = (rawData: RawCheckItem[]): LeftTreeNode[] => {
  const orderMap = new Map<string, LeftTreeNode>()
  const stepMap = new Map<string, LeftTreeNode>()

  rawData.forEach((item) => {
    const orderId = item.InspectOrder
    const stepId = `${orderId}-${item.Step}`

    // 1. Order 节点
    if (!orderMap.has(orderId)) {
      orderMap.set(orderId, {
        id: orderId,
        nodeType: 'order',
        displayName: `${item.InspectOrder}`,
        inspectOrder: item.InspectOrder,
        updateTime: dayjs(item.UpdateTime).format('YYYY-MM-DD HH:mm:ss'),
        lineName: item.LineName,
        workOrder: item.WorkOrder,
        inspectStatus: item.InspectStatus,
        state: item.State,
        children: []
      })
    }
    const orderNode = orderMap.get(orderId)!

    // 2. Step 节点（去重）
    if (!stepMap.has(stepId)) {
      const stepNode: LeftTreeNode = {
        id: stepId,
        nodeType: 'step',
        parentId: orderId,
        displayName: `${item.Name || ''}`,
        step: item.Step,
        stepName: item.Name,
        inspectContent: item.InspectContent,
        updateTime: dayjs(item.UpdateTime).format('YYYY-MM-DD HH:mm:ss'),
        rawStepItems: []   // 存储该工序下所有子项原始数据
      }
      stepMap.set(stepId, stepNode)
      orderNode.children!.push(stepNode)
    }
    // 将当前item添加到Step的rawStepItems中
    stepMap.get(stepId)!.rawStepItems!.push(item)
  })

  // 对每个Order下的Step按step排序
  Array.from(orderMap.values()).forEach(order => {
    if (order.children) {
      order.children.sort((a, b) => (a.step || 0) - (b.step || 0))
    }
  })
  return Array.from(orderMap.values())
}

// 根据选中的工序ID，生成右侧子项表格数据
const updateSubItemList = (stepId: string | null) => {
  if (!stepId) {
    subItemList.value = []
    currentStepInfo.value = null
    return
  }
  // 在leftTableData中找到对应Step节点
  let foundStep:any = null
  for (const order of leftTableData.value) {
    const step = order.children?.find(s => s.id === stepId)
    if (step) {
      foundStep = step
      break
    }
  }
  if (!foundStep || !foundStep.rawStepItems) {
    subItemList.value = []
    currentStepInfo.value = null
    return
  }
  // 按SubItem排序
  const items = foundStep.rawStepItems.sort((a:any, b:any) => a.SubItem - b.SubItem)
  const displayList: SubItemDisplay[] = items.map((item:any) => ({
    SubItem: item.SubItem,
    SubItemName: item.SubItemName,
    SubItemMethod: item.SubItemMethod,
    SubItemBasic: item.SubItemBasic,
    SubItemSolution: item.SubItemSolution,
    SubItemAim: item.SubItemAim,
    SubItemStatus: item.SubItemStatus,
    Status: item.Status,
    IsStatus: item.IsStatus,
    Remark: item.Remark || item.SubItemRemark,
    attachments: collectAttachments(item)
  }))
  subItemList.value = displayList
  currentStepInfo.value = {
    step: foundStep.parentId,
    stepName: foundStep.stepName || ''
  }
}

// 左侧行点击
const handleLeftRowClick = (row: LeftTreeNode) => {
  if (row.nodeType === 'step') {
    selectedStepId.value = row.id
    updateSubItemList(row.id)
  } else {
    // 点击order节点不展开子项明细，但可以清空或保留空？这里清空明细
    selectedStepId.value = null
    subItemList.value = []
    currentStepInfo.value = null
  }
}

// 查询数据
const getData = () => {
  startLoading()
  const params = {
    inspectType: getDataText.inspectType,
    lineName: getDataText.lineName,
    wo: getDataText.wo,
    dateStart: getDataText.dateStart,
    dateEnd: getDataText.dateEnd
  }
  QueryInspection(params)
    .then((res: any) => {
      endLoading()
      const rawData = res?.Data || res?.data
      if (rawData && Array.isArray(rawData)) {
        leftTableData.value = buildLeftTree(rawData)
        currentPage.value = 1
        // 默认选中第一个工序（如果存在）
        nextTick(() => {
          let firstStep: LeftTreeNode | null = null
          for (const order of leftTableData.value) {
            if (order.children && order.children.length > 0) {
              firstStep = order.children[0]
              break
            }
          }
          if (firstStep) {
            handleLeftRowClick(firstStep)
            // 高亮行需由表格处理，但这里调用后数据已更新
          } else {
            subItemList.value = []
            currentStepInfo.value = null
          }
        })
      } else {
        ElMessage.warning('返回数据格式异常')
        leftTableData.value = []
        subItemList.value = []
      }
    })
    .catch((err: any) => {
      endLoading()
      ElMessage.error(err.message || '查询失败')
    })
}

// 分页计算（左侧按顶层节点分页）
const paginatedLeftData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return leftTableData.value.slice(start, end)
})

// 判断是否是Order节点（用于列显示）
const isOrderNode = (row: LeftTreeNode) => row.nodeType === 'order'

// 事件处理
const handleInspectTypeChange = () => {
  getDataText.wo = ''
  getDataText.inspect = ''
  value1.value = []
  leftTableData.value = []
  subItemList.value = []
  selectedStepId.value = null
  currentPage.value = 1
}

const handleDateRangeChange = (val: string[]) => {
  if (val && val.length === 2) {
    getDataText.dateStart = val[0]
    getDataText.dateEnd = val[1]
  }
}

const handleSizeChange = (val: number) => {
  currentPage.value = 1
  pageSize.value = val
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  // 切换分页后清空选中
  selectedStepId.value = null
  subItemList.value = []
  currentStepInfo.value = null
}

const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 190
    subTableHeight.value = tableHeight.value - 80
  })
}

const startLoading = () => {
  loadingInstance = ElLoading.service({
    lock: true,
    text: '加载中~',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.2)'
  })
}
const endLoading = () => {
  if (loadingInstance) loadingInstance.close()
}

// 监听筛选条件
watch(value1, (val) => {
  if (val && val.length === 2) {
    getDataText.dateStart = val[0]
    getDataText.dateEnd = val[1]
  }
})
watch(inquire, (val) => {
  if (val === 'times') getDataText.inspect = '*'
  else {
    const type = getDataText.inspectType
    if (type === 'WI') getDataText.inspect = 'XYWI'
    if (type === 'FI') getDataText.inspect = 'XYFI'
    if (type === 'EI') getDataText.inspect = 'XYEI'
    if (type === 'RI') getDataText.inspect = 'XYRI'
  }
})
watch(() => getDataText.inspectType, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    value1.value = []
    leftTableData.value = []
    subItemList.value = []
    selectedStepId.value = null
    currentPage.value = 1
  }
  if (inquire.value !== 'times') {
    if (newVal === 'WI') getDataText.inspect = 'XYWI'
    if (newVal === 'FI') getDataText.inspect = 'XYFI'
    if (newVal === 'EI') getDataText.inspect = 'XYEI'
    if (newVal === 'RI') getDataText.inspect = 'XYRI'
  }
})

onBeforeMount(() => {
  getScreenHeight()
  value1.value = [setLastDate() + ' 00:00:00', setTodayDate() + ' 23:59:59']
  getDataText.inspect = '*'
})
onMounted(() => {
  window.addEventListener('resize', getScreenHeight)
  getData()
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', getScreenHeight)
})
</script>

<style lang="scss" scoped>
.el-pagination {
  justify-content: center;
}
</style>