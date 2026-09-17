<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <!-- 查询区域 -->
            <div class="flex justify-between">
                <el-form ref="formRef" :model="queryForm" label-width="auto" :inline="true" size="small"
                    @submit.native.prevent>
                    <el-form-item :label="t('smtSpotCheck.CraftBase.product')" class="mb-2">
                        <el-input v-model="queryForm.product"
                            :placeholder="t('smtSpotCheck.CraftBase.productPlaceholder')" clearable @clear="searchData"
                            @keyup.enter.native="searchData" style="width: 200px" />
                    </el-form-item>
                    <el-form-item class="mb-2">
                        <el-button type="primary" @click="searchData">{{ t('publicText.query') }}</el-button>
                    </el-form-item>
                </el-form>
                <div>
                    <el-button type="warning" size="small" @click="openAddStep()">
                        {{ t('smtSpotCheck.CraftBase.addStep') }}
                    </el-button>
                </div>
            </div>

            <el-row :gutter="10">
                <!-- 左侧树形表格 -->
                <el-col :span="10">
                    <el-table ref="treeTableRef" size="small" :data="displayTreeData" stripe border fit
                        :height="tableHeight" row-key="id"
                        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" highlight-current-row
                        @row-click="handleRowClick"
                        :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }">

                        <el-table-column type="index" :label="t('publicText.index')" width="55" align="center" fixed="left">
                            <template #default="{ $index }">
                                {{ $index + 1 + (currentPage - 1) * pageSize }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="label" :label="t('smtSpotCheck.CraftBase.name')"
                            :min-width="getColumnWidth1('label')" />
                        <el-table-column prop="inspectContent" :label="t('smtSpotCheck.CraftBase.inspectContent')"
                            :min-width="getColumnWidth1('inspectContent')">
                            <template #default="{ row }">
                                <span v-if="row.type === 'step'">{{ row.inspectContent || '-' }}</span>
                                <span v-else>-</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('publicText.operation')" fixed="right" width="160" align="center">
                            <template #default="{ row }">
                                <!-- 产品节点操作 -->
                                <template v-if="row.type === 'product'">
                                    <el-tooltip :content="t('smtSpotCheck.CraftBase.addStep')" placement="top">
                                        <el-button size="small" type="warning" icon="Plus"
                                            @click.stop="openAddStep(row)" />
                                    </el-tooltip>
                                    <el-tooltip :content="t('publicText.delete')" placement="top">
                                        <el-button size="small" type="danger" icon="Delete"
                                            @click.stop="handleDeleteProduct(row)" />
                                    </el-tooltip>
                                </template>
                                <!-- 工序节点操作 -->
                                <template v-if="row.type === 'step'">
                                    <el-tooltip :content="t('publicText.add') + t('smtSpotCheck.CraftBase.subItem')"
                                        placement="top">
                                        <el-button size="small" type="warning" icon="Plus"
                                            @click.stop="openAddSubItem(row)" />
                                    </el-tooltip>
                                    <el-tooltip :content="t('publicText.edit')" placement="top">
                                        <el-button size="small" type="primary" icon="Edit"
                                            @click.stop="openEditStep(row)" />
                                    </el-tooltip>
                                    <el-tooltip :content="t('publicText.delete')" placement="top">
                                        <el-button size="small" type="danger" icon="Delete"
                                            @click.stop="handleDeleteStep(row)" />
                                    </el-tooltip>
                                </template>
                            </template>
                        </el-table-column>
                        <template #empty>
                            <el-empty />
                        </template>
                    </el-table>

                    <!-- 分页（仅对顶级产品节点分页） -->
                    <div class="mt-2">
                        <el-pagination size="small" background @size-change="handleSizeChange"
                            @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
                            :page-sizes="[5, 10, 20, 50, 100]" layout="total,sizes, prev, pager, next"
                            :total="filteredTreeData.length" />
                    </div>
                </el-col>

                <!-- 右侧明细区域（显示选中工序的子检测项） -->
                <el-col :span="14">
                    <div class="detail-header" v-if="currentStepNode">
                        <span>{{ t('smtSpotCheck.CraftBase.subItemList') }}: {{ currentStepNode.product }} - {{
                            currentStepNode.label
                            }}</span>
                    </div>
                    <div v-if="!currentStepNode" class="detail-empty">
                        <el-empty :description="t('smtSpotCheck.CraftBase.selectStepTip')" />
                    </div>
                    <el-table v-else :data="currentSubItems" ref="treeDetailsTableRef" border size="small"
                        style="width: 100%" :height="tableHeight - 20">
                        <el-table-column :label="t('smtSpotCheck.CraftBase.subItem')" width="80" prop="SubItem"
                            align="center" />
                        <el-table-column :label="t('smtSpotCheck.CraftBase.subItemName')" prop="SubItemName"
                            :min-width="getColumnWidth2('SubItemName')">
                        </el-table-column>
                        <el-table-column :label="t('smtSpotCheck.CraftBase.subItemMethod')" prop="SubItemMethod"
                            :min-width="getColumnWidth2('SubItemMethod')">
                        </el-table-column>
                        <el-table-column :label="t('smtSpotCheck.CraftBase.subItemAim')" prop="SubItemAim"
                            :min-width="getColumnWidth2('SubItemAim')">

                        </el-table-column>
                        <el-table-column :label="t('smtSpotCheck.CraftBase.subItemBasic')" prop="SubItemBasic"
                            :min-width="getColumnWidth2('SubItemBasic')">

                        </el-table-column>
                        <!-- <el-table-column :label="t('smtSpotCheck.CraftBase.subItemSolution')" prop="SubItemSolution"
                            :min-width="getColumnWidth2('SubItemSolution')">

                        </el-table-column> -->

                        <template #empty>
                            <el-empty :description="t('smtSpotCheck.CraftBase.noSubItem')" />
                        </template>
                    </el-table>
                </el-col>
            </el-row>
        </el-card>

        <!-- 新增工序弹窗 -->
        <el-dialog :title="t('smtSpotCheck.CraftBase.addStep')" v-model="addStepDialogVisible" width="80%"
            @close="addStepDialogCancel" align-center :append-to-body="true" :close-on-click-modal="false">
            <el-form :model="addStepForm" ref="addStepFormRef" label-width="120px" :rules="stepFormRules">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('smtSpotCheck.CraftBase.product')" prop="Product">
                            <el-select v-model="addStepForm.Product"
                                :placeholder="t('smtSpotCheck.CraftBase.productPlaceholder')" filterable
                                allow-create default-first-option style="width: 100%" :disabled="isAddSubItemMode"
                                @change="onAddStepProductChange">
                                <el-option v-for="item in productOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('smtSpotCheck.CraftBase.step')" prop="Step">
                            <el-input-number v-model="addStepForm.Step" :min="1" style="width: 100%"
                                :placeholder="t('smtSpotCheck.CraftBase.stepPlaceholder')" :disabled="isAddSubItemMode" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item :label="t('smtSpotCheck.CraftBase.name')" prop="Name">
                    <el-input v-model="addStepForm.Name" :placeholder="t('smtSpotCheck.CraftBase.namePlaceholder')"
                        clearable :disabled="isAddSubItemMode" />
                </el-form-item>

                <el-button type="primary" size="small" @click="addAddDetailRow" class="mb-2">
                    {{ t('publicText.add') }}{{ t('smtSpotCheck.CraftBase.subItem') }}
                </el-button>
                <el-table :data="addStepForm.StepItemList" border size="small" style="width: 100%" height="400">
                    <el-table-column :label="t('smtSpotCheck.CraftBase.subItem')" width="80" prop="SubItem"
                        align="center" />
                    <el-table-column :label="t('smtSpotCheck.CraftBase.subItemName')" min-width="140">
                        <template #default="{ row }">
                            <el-input v-model="row.SubItemName" size="small"
                                :placeholder="t('smtSpotCheck.CraftBase.subItemNamePlaceholder')" />
                        </template>
                    </el-table-column>
                    <el-table-column :label="t('smtSpotCheck.CraftBase.subItemMethod')" min-width="120">
                        <template #default="{ row }">
                            <el-input v-model="row.SubItemMethod" size="small"
                                :placeholder="t('smtSpotCheck.CraftBase.subItemMethodPlaceholder')" />
                        </template>
                    </el-table-column>
                    <el-table-column :label="t('smtSpotCheck.CraftBase.subItemAim')" min-width="120">
                        <template #default="{ row }">
                            <el-input v-model="row.SubItemAim" size="small"
                                :placeholder="t('smtSpotCheck.CraftBase.subItemAimPlaceholder')" />
                        </template>
                    </el-table-column>
                    <el-table-column :label="t('smtSpotCheck.CraftBase.subItemBasic')" min-width="120">
                        <template #default="{ row }">
                            <el-input v-model="row.SubItemBasic" size="small"
                                :placeholder="t('smtSpotCheck.CraftBase.subItemBasicPlaceholder')" />
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('publicText.operation')" width="80" align="center">
                        <template #default="{ $index }">
                            <el-button type="danger" size="small" link @click="removeAddDetailRow($index)">
                                {{ t('publicText.delete') }}
                            </el-button>
                        </template>
                    </el-table-column>
                    <template #empty>
                        <el-empty :description="t('smtSpotCheck.CraftBase.noSubItem')" />
                    </template>
                </el-table>
            </el-form>
            <template #footer>
                <el-button @click="addStepDialogCancel">{{ t('publicText.cancel') }}</el-button>
                <el-button type="primary" @click="handleSubmitAddStep">{{ t('publicText.confirm') }}</el-button>
            </template>
        </el-dialog>

        <!-- 编辑工序弹窗 -->
        <el-dialog :title="t('publicText.edit') + t('smtSpotCheck.CraftBase.step')" v-model="editStepDialogVisible"
            width="80%" @close="editStepDialogCancel" align-center :append-to-body="true"
            :close-on-click-modal="false">
            <el-form :model="editStepForm" ref="editStepFormRef" label-width="120px" :rules="stepFormRules">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('smtSpotCheck.CraftBase.product')" prop="Product">
                            <el-select v-model="editStepForm.Product"
                                :placeholder="t('smtSpotCheck.CraftBase.productPlaceholder')" filterable
                                style="width: 100%" disabled>
                                <el-option v-for="item in productOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('smtSpotCheck.CraftBase.step')" prop="Step">
                            <el-input-number v-model="editStepForm.Step" :min="1" style="width: 100%"
                                :placeholder="t('smtSpotCheck.CraftBase.stepPlaceholder')" disabled />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item :label="t('smtSpotCheck.CraftBase.name')" prop="Name">
                    <el-input v-model="editStepForm.Name" :placeholder="t('smtSpotCheck.CraftBase.namePlaceholder')"
                        clearable />
                </el-form-item>
                <el-table :data="editStepForm.StepItemList" border size="small" style="width: 100%" height="400">
                    <el-table-column :label="t('smtSpotCheck.CraftBase.subItem')" width="80" prop="SubItem"
                        align="center" />
                    <el-table-column :label="t('smtSpotCheck.CraftBase.subItemName')" min-width="140">
                        <template #default="{ row }">
                            <el-input v-model="row.SubItemName" size="small"
                                :placeholder="t('smtSpotCheck.CraftBase.subItemNamePlaceholder')" />
                        </template>
                    </el-table-column>
                    <el-table-column :label="t('smtSpotCheck.CraftBase.subItemMethod')" min-width="120">
                        <template #default="{ row }">
                            <el-input v-model="row.SubItemMethod" size="small"
                                :placeholder="t('smtSpotCheck.CraftBase.subItemMethodPlaceholder')" />
                        </template>
                    </el-table-column>
                    <el-table-column :label="t('smtSpotCheck.CraftBase.subItemAim')" min-width="120">
                        <template #default="{ row }">
                            <el-input v-model="row.SubItemAim" size="small"
                                :placeholder="t('smtSpotCheck.CraftBase.subItemAimPlaceholder')" />
                        </template>
                    </el-table-column>
                    <el-table-column :label="t('smtSpotCheck.CraftBase.subItemBasic')" min-width="120">
                        <template #default="{ row }">
                            <el-input v-model="row.SubItemBasic" size="small"
                                :placeholder="t('smtSpotCheck.CraftBase.subItemBasicPlaceholder')" />
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('publicText.operation')" width="80" align="center">
                        <template #default="{ $index }">
                            <el-button type="danger" size="small" link @click="removeEditDetailRow($index)">
                                {{ t('publicText.delete') }}
                            </el-button>
                        </template>
                    </el-table-column>
                    <template #empty>
                        <el-empty :description="t('smtSpotCheck.CraftBase.noSubItem')" />
                    </template>
                </el-table>
            </el-form>
            <template #footer>
                <el-button @click="editStepDialogCancel">{{ t('publicText.cancel') }}</el-button>
                <el-button type="primary" @click="handleSubmitEditStep">{{ t('publicText.confirm') }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick, onMounted, onBeforeMount, onBeforeUnmount } from 'vue'
import { calculateColumnsWidth } from "@/utils/tableminWidth";
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import {
    GetCraftInspectData,
    InserCraftInspectData,
    UpdateCraftInspectData,
    DeleteCraftInspectData,
} from '@/api/smtSpotCheck/base/index'

const { t } = useI18n()

// ---------- 全局数据 ----------
const tableHeight = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)
// 原始扁平数据（接口返回，每个子项一条记录）
const rawFlatData = ref<any[]>([])
// 完整树形数据（产品 -> 工序）
const fullTreeData = ref<any[]>([])
// 过滤后的树形数据（用于展示和分页）
const filteredTreeData = ref<any[]>([])
// 查询条件
const queryForm = reactive({
    product: '',
    stepName: '',
})
// 树形表格 ref
const treeTableRef = ref()
const treeDetailsTableRef = ref()
// 当前选中的工序节点
const currentStepNode = ref<any>(null)

// ---------- 产品下拉选项（从树形数据中提取） ----------
const productOptions = computed(() => {
    return fullTreeData.value.map(node => ({
        value: node.product,
        label: node.product,
    }))
})

// ---------- 弹窗控制 ----------
// 工序表单校验规则（新增/编辑共用）
const stepFormRules = {
    Product: [{ required: true, message: t('smtSpotCheck.CraftBase.productRequired'), trigger: 'change' }],
    Step: [{ required: true, message: t('smtSpotCheck.CraftBase.stepRequired'), trigger: 'blur' }],
    Name: [{ required: true, message: t('smtSpotCheck.CraftBase.nameRequired'), trigger: 'blur' }],
}
const createEmptySubItem = (subItem: number) => ({
    SubItem: subItem,
    SubItemName: '',
    SubItemMethod: '',
    SubItemBasic: '',
    SubItemSolution: '',
    SubItemAim: '',
    SubItemStatus: 'I',
})

// 新增工序弹窗（同时用于为已有工序新增子项）
const addStepDialogVisible = ref(false)
const addStepFormRef = ref()
const addStepForm = reactive({
    Product: '',
    Step: 0,
    Name: '',
    InspectContent: '',
    StepItemList: [] as any[],
})
// 为已有工序新增子项时，产品、工序编号、工序名称不可修改
const isAddSubItemMode = ref(false)

// 编辑工序弹窗
const editStepDialogVisible = ref(false)
const editStepFormRef = ref()
const editStepForm = reactive({
    Product: '',
    Step: 0,
    Name: '',
    InspectContent: '',
    StepItemList: [] as any[],
})

// ---------- 辅助函数：构建树形数据（产品 -> 工序） ----------
// 从扁平数据构建树（只构建到工序层级，子项不包含在树中）
const buildTreeFromFlatData = (flatData: any[]) => {
    const productMap = new Map<string, any>()
    flatData.forEach(item => {
        const product = item.Product
        if (!productMap.has(product)) {
            productMap.set(product, {
                id: `product_${product}`,
                type: 'product',
                product: product,
                label: product,
                inspectContent: '',
                children: [],
            })
        }
        const productNode = productMap.get(product)
        const existingStep = productNode.children.find((child: any) => child.step === item.Step)
        if (!existingStep) {
            const stepItems = flatData.filter((it: any) => it.Product === product && it.Step === item.Step)
            const inspectContents = [...new Set(
                stepItems
                    .map((it: any) => it.InspectContent?.trim())
                    .filter((c: string) => c && c.length > 0)
            )]
            productNode.children.push({
                id: `step_${product}_${item.Step}`,
                type: 'step',
                product: product,
                step: item.Step,
                label: item.Name,
                inspectContent: inspectContents.join(' / '),
            })
        }
    })
    for (const productNode of productMap.values()) {
        productNode.children.sort((a: any, b: any) => a.step - b.step)
    }
    return Array.from(productMap.values())
}

// 递归过滤树形数据（根据产品编码和工序名称）
const filterTree = (tree: any[], productKeyword: string, stepNameKeyword: string): any[] => {
    if (!productKeyword && !stepNameKeyword) return tree
    return tree
        .map(node => {
            if (node.type !== 'product') return null
            const children = node.children || []
            const productMatch = productKeyword ? node.product.includes(productKeyword) : true
            const matchedChildren = stepNameKeyword
                ? children.filter((child: any) => child.label?.includes(stepNameKeyword))
                : []
            // 产品编码不匹配：仅当其下存在匹配工序名称的工序时才保留
            if (!productMatch) {
                return matchedChildren.length ? { ...node, children: matchedChildren } : null
            }
            // 产品编码匹配且填写了工序名称：只展示匹配的工序
            if (stepNameKeyword) {
                return matchedChildren.length ? { ...node, children: matchedChildren } : null
            }
            return { ...node, children }
        })
        .filter(Boolean) as any[]
}

// 获取数据
const getData = () => {
    GetCraftInspectData({}).then((res: any) => {
        if (res.Success) {
            rawFlatData.value = res.Data || []
            fullTreeData.value = buildTreeFromFlatData(rawFlatData.value)
            searchData()
            // 恢复之前选中的工序节点
            if (currentStepNode.value) {
                const { product, step } = currentStepNode.value
                const newStepNode = findStepNodeInTree(fullTreeData.value, product, step)
                if (newStepNode) {
                    currentStepNode.value = newStepNode
                    nextTick(() => {
                        // 展开父产品节点并高亮当前行
                        expandParentNode(newStepNode)
                    })
                } else {
                    currentStepNode.value = null
                }
            }
        } else {
            ElMessage.error(res.Msg || t('publicText.queryFailed'))
        }
    }).catch(() => {
        ElMessage.error(t('publicText.queryFailed'))
    })
}

// 在树中查找工序节点
const findStepNodeInTree = (tree: any[], product: string, step: number): any => {
    for (const node of tree) {
        if (node.type === 'product' && node.product === product && node.children) {
            const stepNode = node.children.find((child: any) => child.step === step)
            if (stepNode) return stepNode
        }
    }
    return null
}

// 展开工序节点的父级
const expandParentNode = (stepNode: any) => {
    if (!treeTableRef.value) return
    const parentProduct = stepNode.product
    const productNode = filteredTreeData.value.find(node => node.product === parentProduct)
    if (productNode) {
        treeTableRef.value.toggleRowExpansion(productNode, true)
    }
}

// 前端搜索
const searchData = () => {
    const filtered = filterTree(fullTreeData.value, queryForm.product, queryForm.stepName)
    filteredTreeData.value = filtered
    currentPage.value = 1
}

// 分页展示的树形数据（仅对顶级产品节点分页）
const displayTreeData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return filteredTreeData.value.slice(start, end)
})

const handleSizeChange = (val: number) => {
    pageSize.value = val
    currentPage.value = 1
}
const handleCurrentChange = (val: number) => {
    currentPage.value = val
}

// 点击行处理：只有工序节点才显示右侧明细
const handleRowClick = (row: any) => {
    if (row.type === 'step') {
        currentStepNode.value = row
    } else {
        currentStepNode.value = null
    }
}

// 根据产品+工序获取子项列表
const getSubItemsByProductAndStep = (product: string, step: number) => {
    return rawFlatData.value
        .filter(item => item.Product === product && item.Step === step)
        .map(item => ({
            SubItem: item.SubItem,
            SubItemName: item.SubItemName,
            SubItemMethod: item.SubItemMethod || '',
            SubItemBasic: item.SubItemBasic || '',
            SubItemSolution: item.SubItemSolution || '',
            SubItemAim: item.SubItemAim || '',
            SubItemStatus: item.SubItemStatus || 'I',
        }))
        .sort((a, b) => a.SubItem - b.SubItem)
}

// 当前选中工序的子项列表
const currentSubItems = computed(() => {
    if (!currentStepNode.value) return []
    const { product, step } = currentStepNode.value
    return getSubItemsByProductAndStep(product, step)
})

// 获取某个产品下某工序的最大子项编号
const getMaxSubItemByProductAndStep = (product: string, step: number) => {
    const subItems = rawFlatData.value.filter(item => item.Product === product && item.Step === step)
    if (subItems.length === 0) return 0
    return Math.max(...subItems.map(item => item.SubItem))
}

// 获取某个产品下一个可用的工序编号
const getNextStepNumberByProduct = (product: string) => {
    const productNode = fullTreeData.value.find(node => node.product === product)
    if (!productNode || !productNode.children) return 1
    const maxStep = Math.max(...productNode.children.map((child: any) => child.step), 0)
    return maxStep + 1
}

// ---------- 工序操作 ----------
// 新增工序（不传产品节点时，由用户在弹窗中选择产品）
const openAddStep = (productNode?: any) => {
    isAddSubItemMode.value = false
    addStepForm.Product = productNode?.product || ''
    addStepForm.Step = productNode ? getNextStepNumberByProduct(productNode.product) : 1
    addStepForm.Name = ''
    addStepForm.InspectContent = ''
    addStepForm.StepItemList = [createEmptySubItem(1)]
    addStepDialogVisible.value = true
}

// 为已有工序新增子项
const openAddSubItem = (stepNode: any) => {
    isAddSubItemMode.value = true
    addStepForm.Product = stepNode.product
    addStepForm.Step = stepNode.step
    addStepForm.Name = stepNode.label
    addStepForm.InspectContent = stepNode.inspectContent || ''
    addStepForm.StepItemList = [createEmptySubItem(getMaxSubItemByProductAndStep(stepNode.product, stepNode.step) + 1)]
    addStepDialogVisible.value = true
}

// 编辑工序
const openEditStep = (stepNode: any) => {
    editStepForm.Product = stepNode.product
    editStepForm.Step = stepNode.step
    editStepForm.Name = stepNode.label
    editStepForm.InspectContent = stepNode.inspectContent || ''
    editStepForm.StepItemList = getSubItemsByProductAndStep(stepNode.product, stepNode.step)
    editStepDialogVisible.value = true
}

// 新增工序弹窗中产品切换时自动计算工序编号
const onAddStepProductChange = (val: string) => {
    if (val) {
        addStepForm.Step = getNextStepNumberByProduct(val)
    }
}

const addAddDetailRow = () => {
    const list = addStepForm.StepItemList
    const maxSubItem = list.length > 0 ? Math.max(...list.map(item => item.SubItem || 0)) + 1 : 1
    list.push(createEmptySubItem(maxSubItem))
}

const removeAddDetailRow = (index: number) => {
    if (addStepForm.StepItemList.length <= 1) {
        ElMessage.warning(t('smtSpotCheck.CraftBase.cannotDeleteLastSubItem'))
        return
    }
    addStepForm.StepItemList.splice(index, 1)
}

const addStepDialogCancel = () => {
    addStepDialogVisible.value = false
    addStepForm.StepItemList = []
    addStepFormRef.value?.resetFields()
}

const editStepDialogCancel = () => {
    editStepDialogVisible.value = false
    editStepForm.StepItemList = []
    editStepFormRef.value?.resetFields()
}

const validateSubItemUnique = (list: any[]) => {
    const subItems = list.map(item => item.SubItem)
    return subItems.length === new Set(subItems).size
}

const buildStepRequestData = (form: any) => {
    const stepItemList = form.StepItemList.map((item: any) => ({
        SubItemName: item.SubItemName,
        SubItem: item.SubItem,
        SubItemMethod: item.SubItemMethod || '',
        SubItemBasic: item.SubItemBasic || '',
        SubItemSolution: item.SubItemSolution || '',
        SubItemAim: item.SubItemAim || '',
        SubItemStatus: 'I',
    }))
    return {
        Product: form.Product,
        InspectType: '',
        StepList: [
            {
                Step: form.Step,
                Status: '',
                Name: form.Name,
                InspectContent: form.InspectContent,
                StepItemList: stepItemList,
            },
        ],
    }
}

const validateStepSubItems = (list: any[]) => {
    if (!list.length) {
        ElMessage.warning(t('smtSpotCheck.CraftBase.atLeastOneSubItem'))
        return false
    }
    for (let i = 0; i < list.length; i++) {
        if (!list[i].SubItemName) {
            ElMessage.warning(t('smtSpotCheck.CraftBase.subItemNameRequired', { index: i + 1 }))
            return false
        }
    }
    if (!validateSubItemUnique(list)) {
        ElMessage.warning(t('smtSpotCheck.CraftBase.subItemUnique'))
        return false
    }
    return true
}

const submitStep = async (form: any, isEdit: boolean) => {
    if (!validateStepSubItems(form.StepItemList)) return
    const requestData = buildStepRequestData(form)
    try {
        let res: any
        if (isEdit) {
            res = await UpdateCraftInspectData(requestData)
        } else {
            res = await InserCraftInspectData(requestData)
        }
        if (res.Success) {
            ElMessage.success(res.Msg || (isEdit ? t('publicText.updateSuccess') : t('publicText.addSuccess')))
            if (isEdit) {
                editStepDialogVisible.value = false
            } else {
                addStepDialogVisible.value = false
            }
            getData()
        } else {
            ElMessage.error(res.Msg || (isEdit ? t('publicText.updateFailed') : t('publicText.addFailed')))
        }
    } catch {
        ElMessage.error(isEdit ? t('publicText.updateFailed') : t('publicText.addFailed'))
    }
}

// 新增工序弹窗提交
const handleSubmitAddStep = () => {
    addStepFormRef.value.validate((valid: boolean) => {
        if (!valid) return
        submitStep(addStepForm, false)
    })
}

// 编辑工序弹窗提交
const handleSubmitEditStep = () => {
    editStepFormRef.value.validate((valid: boolean) => {
        if (!valid) return
        submitStep(editStepForm, true)
    })
}

// 删除工序
const handleDeleteStep = (stepNode: any) => {
    console.log(stepNode);

    ElMessageBox.confirm(
        `${t('publicText.confirmDelete')}【${stepNode.product} - ${stepNode.label}】?`,
        t('publicText.confirm'),
        { confirmButtonText: t('publicText.confirm'), cancelButtonText: t('publicText.cancel'), type: 'warning' }
    )
        .then(() => {
            const subItems = rawFlatData.value.filter(
                item => item.Product === stepNode.product && item.Step === stepNode.step
            )
            // 如果子项为空，构造一个虚拟标记项（避免空数组）
            let stepItemList: any[] = []
            stepItemList = subItems.map(item => ({
                SubItemName: item.SubItemName,
                SubItem: item.SubItem,
                SubItemMethod: item.SubItemMethod || '',
                SubItemBasic: item.SubItemBasic || '',
                SubItemSolution: item.SubItemSolution || '',
                SubItemAim: item.SubItemAim || '',
                SubItemStatus: 'D'  // 标记删除
            }))
            const requestData = {
                Product: stepNode.product,
                InspectType: '',
                StepList: [
                    {
                        Step: stepNode.step,
                        Status: '',
                        Name: stepNode.label,
                        InspectContent: stepNode.inspectContent || '',
                        StepItemList:stepItemList,
                    },
                ],
            }
            DeleteCraftInspectData(requestData).then((res: any) => {
                if (res.Success) {
                    ElMessage.success(res.Msg || t('publicText.deleteSuccess'))
                    if (currentStepNode.value === stepNode) currentStepNode.value = null
                    getData()
                } else {
                    ElMessage.error(res.Msg || t('publicText.deleteFailed'))
                }
            }).catch(() => ElMessage.error(t('publicText.deleteFailed')))
        })
        .catch(() => ElMessage.info(t('publicText.cancel')))
}

// 删除产品（连同其下所有工序）
const handleDeleteProduct = (productNode: any) => {
    ElMessageBox.confirm(
        `${t('publicText.confirmDelete')}【${productNode.product}】${t('smtSpotCheck.CraftBase.deleteProductTip')}?`,
        t('publicText.confirm'),
        { confirmButtonText: t('publicText.confirm'), cancelButtonText: t('publicText.cancel'), type: 'warning' }
    )
        .then(() => {
            const productSubItems = rawFlatData.value.filter(item => item.Product === productNode.product)
            const stepMap = new Map<number, any>()
            productSubItems.forEach(item => {
                if (!stepMap.has(item.Step)) {
                    stepMap.set(item.Step, {
                        Step: item.Step,
                        Status: '',
                        Name: item.Name,
                        InspectContent: item.InspectContent || '',
                        StepItemList: [],
                    })
                }
                stepMap.get(item.Step).StepItemList.push({
                    SubItemName: item.SubItemName,
                    SubItem: item.SubItem,
                    SubItemMethod: item.SubItemMethod || '',
                    SubItemBasic: item.SubItemBasic || '',
                    SubItemSolution: item.SubItemSolution || '',
                    SubItemAim: item.SubItemAim || '',
                    SubItemStatus: 'D'  // 标记删除
                })
            })
            const requestData = {
                Product: productNode.product,
                InspectType: '',
                StepList: Array.from(stepMap.values()).sort((a, b) => a.Step - b.Step),
            }
            DeleteCraftInspectData(requestData).then((res: any) => {
                if (res.Success) {
                    ElMessage.success(res.Msg || t('publicText.deleteSuccess'))
                    if (currentStepNode.value?.product === productNode.product) currentStepNode.value = null
                    getData()
                } else {
                    ElMessage.error(res.Msg || t('publicText.deleteFailed'))
                }
            }).catch(() => ElMessage.error(t('publicText.deleteFailed')))
        })
        .catch(() => ElMessage.info(t('publicText.cancel')))
}

// 修改弹窗内删除子项
const removeEditDetailRow = (index: number) => {
    const subItems = editStepForm.StepItemList
    const deletedItem = subItems[index]
    ElMessageBox.confirm(
        `${t('publicText.confirmDelete')}【${deletedItem.SubItemName}】?`,
        t('publicText.confirm'),
        { confirmButtonText: t('publicText.confirm'), cancelButtonText: t('publicText.cancel'), type: 'warning' }
    )
        .then(() => {
            const requestData = {
                Product: editStepForm.Product,
                InspectType: '',
                StepList: [{
                    Step: editStepForm.Step,
                    Status: '',
                    Name: editStepForm.Name,
                    InspectContent: editStepForm.InspectContent || '',
                    StepItemList: [deletedItem],
                }]
            };
            DeleteCraftInspectData(requestData).then((res: any) => {
                if (res.Success) {
                    ElMessage.success(res.Msg || t('publicText.deleteSuccess'))
                    subItems.splice(index, 1)
                    getData()
                } else {
                    ElMessage.error(res.Msg || t('publicText.deleteFailed'))
                }
            }).catch(() => ElMessage.error(t('publicText.deleteFailed')))
        })
        .catch(() => ElMessage.info(t('publicText.cancel')))
}

// ==================== 列宽自适应 ====================
const columnWidths1 = computed(() => {
    if (!treeTableRef.value) return {};
    let columns: any = [];
    columns = treeTableRef.value.columns
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
    return calculateColumnsWidth(columns, displayTreeData.value, {
        padding: 25,
        fontSize: 13,
    });
});
const getColumnWidth1 = (prop: string) => columnWidths1.value[prop] || "auto";
const columnWidths2 = computed(() => {
    if (!treeDetailsTableRef.value) return {};
    let columns: any = [];
    columns = treeDetailsTableRef.value.columns
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
    return calculateColumnsWidth(columns, currentSubItems.value, {
        padding: 25,
        fontSize: 13,
    });
});
const getColumnWidth2 = (prop: string) => columnWidths2.value[prop] || "auto";
// ---------- 高度自适应 ----------
const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 180
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

.detail-header {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e4e7ed;
}

.detail-empty {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
}
</style>