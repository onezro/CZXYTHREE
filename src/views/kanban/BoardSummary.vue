<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <el-icon :size="24" class="text-white"><Monitor /></el-icon>
          </div>
          <div>
            <h1 class="text-xl font-bold text-slate-800">{{ t('kanban.summary.title') }}</h1>
            <p class="text-sm text-gray-500">{{ t('kanban.summary.desc') }}</p>
          </div>
        </div>
        
        <div class="flex items-center gap-4">
          <div class="relative">
            <el-icon :size="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Search /></el-icon>
            <el-input 
              v-model="searchText" 
              placeholder="搜索看板名称..." 
              prefix-icon=""
              class="w-64 pl-10"
              @keyup.enter="handleSearch"
            />
          </div>
          <el-button type="primary" @click="handleRefresh">
            <el-icon><Refresh /></el-icon>
            {{ t('publicText.refresh') }}
          </el-button>
        </div>
      </div>
    </header>

    <main class="px-6 py-8 max-w-none">
      <div v-if="loading" class="space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="i in 6" 
            :key="i"
            class="bg-white rounded-xl p-6 shadow-sm"
          >
            <el-skeleton :rows="4" animated>
              <template #template>
                <div class="flex items-start gap-4">
                  <el-skeleton-item variant="circle" class="w-14 h-14" />
                  <div class="flex-1 space-y-3">
                    <el-skeleton-item class="h-5 w-3/4 rounded" />
                    <el-skeleton-item class="h-4 w-full rounded" />
                    <el-skeleton-item class="h-4 w-2/3 rounded" />
                  </div>
                </div>
              </template>
            </el-skeleton>
          </div>
        </div>
      </div>

      <div v-else>
        <div v-if="filteredBoards.length === 0" class="text-center py-20">
          <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
            <el-icon :size="40" class="text-gray-400"><Search /></el-icon>
          </div>
          <h3 class="text-lg font-medium text-gray-600 mb-2">{{ t('kanban.summary.noResult') }}</h3>
          <p class="text-gray-400">{{ t('kanban.summary.noResultDesc') }}</p>
        </div>

        <div v-else class="space-y-8">
          <div v-for="(group, groupIndex) in boardGroups" :key="groupIndex" v-show="hasVisibleBoards(group.items)">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-1 h-6 rounded-full" :class="group.colorClass"></div>
              <h2 class="text-xl font-semibold text-slate-800">{{ group.title }}</h2>
              <span class="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-500">
                {{ getGroupCount(group.items) }}
              </span>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="board in group.items"
                :key="board.path"
                v-show="isBoardVisible(board)"
                class="board-card bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col"
                @click="navigateTo(board.path)"
              >
                <div class="flex items-start gap-4 flex-1">
                  <div class="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110" :class="board.iconBg">
                    <el-icon :size="28" :class="board.iconColor"><component :is="board.icon" /></el-icon>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="text-lg font-semibold text-slate-800 mb-2">{{ board.title }}</h3>
                    <p class="text-sm text-gray-500 line-clamp-2 mb-3">{{ board.description }}</p>
                    <div class="flex items-center gap-2">
                      <el-tag size="small" :type="board.tagType" class="bg-opacity-10">
                        {{ board.tagLabel }}
                      </el-tag>
                    </div>
                  </div>
                </div>
                <div class="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span class="text-xs text-gray-400 truncate flex-1 mr-3">{{ board.path }}</span>
                  <div class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors duration-300 shrink-0">
                    <el-icon :size="16"><ArrowRight /></el-icon>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer class="bg-white border-t border-gray-100 mt-12">
      <div class="max-w-7xl mx-auto px-6 py-6 text-center">
        <p class="text-sm text-gray-400">
          {{ t('kanban.summary.footer') }}
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Monitor, Search, Refresh, ArrowRight, Cpu } from '@element-plus/icons-vue'

const { t } = useI18n()

const loading = ref(true)
const searchText = ref('')

interface BoardItem {
  path: string
  title: string
  description: string
  icon: any
  iconBg: string
  iconColor: string
  tagType: string
  tagIcon: any
  tagLabel: string
}

interface BoardGroup {
  title: string
  colorClass: string
  items: BoardItem[]
}

const boardGroups: BoardGroup[] = [
  {
    title: t('kanban.summary.production'),
    colorClass: 'bg-blue-500',
    items: [
      {
        path: 'http://172.16.28.119:8024/southProComp',
        title: '南区SMT生产管理',
        description: '南区SMT产线实时产量、工单进度、FPY及出勤监控',
        icon: Cpu,
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-500',
        tagType: 'primary',
        tagIcon: "",
        tagLabel: '生产'
      },
      {
        path: 'http://172.16.28.119:8024/northProComp',
        title: '北区SMT生产管理',
        description: '北区SMT产线实时产量、工单进度、FPY及出勤监控',
        icon: Cpu,
        iconBg: 'bg-cyan-50',
        iconColor: 'text-cyan-500',
        tagType: 'info',
        tagIcon: "",
        tagLabel: '生产'
      },
      {
        path: 'http://172.16.28.119:8024/centerProComp',
        title: '中区生产管理',
        description: '中区产线成品入库、设备数据及出勤情况监控',
        icon: Cpu,
        iconBg: 'bg-orange-50',
        iconColor: 'text-orange-500',
        tagType: 'warning',
        tagIcon: "",
        tagLabel: '仓储'
      }
    ]
  },
  {
    title: t('kanban.summary.operation'),
    colorClass: 'bg-green-500',
    items: [
      {
        path: 'http://172.16.28.119:8024/southOperatComp',
        title: '南区运营管理',
        description: '南区月度产能、FPY/SPI/AOI直通率、OEE及MTBF监控',
        icon: Cpu,
        iconBg: 'bg-green-50',
        iconColor: 'text-green-500',
        tagType: 'success',
        tagIcon: "",
        tagLabel: '运营'
      },
      {
        path: 'http://172.16.28.119:8024/northOperatComp',
        title: '北区运营管理',
        description: '北区月度产能、FPY/SPI/AOI直通率、OEE及MTBF监控',
        icon: Cpu,
        iconBg: 'bg-teal-50',
        iconColor: 'text-teal-500',
        tagType: 'success',
        tagIcon: "",
        tagLabel: '运营'
      },
      {
        path: 'http://172.16.28.119:8024/centerOperatComp',
        title: '中区运营管理',
        description: '中区月度产能、ICT/FCT良率及历史目标达成监控',
        icon: Cpu,
        iconBg: 'bg-yellow-50',
        iconColor: 'text-yellow-500',
        tagType: 'warning',
        tagIcon: "",
        tagLabel: '运营'
      }
    ]
  },
  {
    title: t('kanban.summary.comprehensive'),
    colorClass: 'bg-purple-500',
    items: [
      {
        path: 'http://172.16.28.119:8024/blBoard',
        title: '综合大屏看板',
        description: '全厂区综合数据大屏展示，实时监控生产运营状态',
        icon: Cpu,
        iconBg: 'bg-purple-50',
        iconColor: 'text-purple-500',
        tagType: 'info',
        tagIcon: "",
        tagLabel: '综合'
      }
    ]
  }
]

const filteredBoards = computed(() => {
  if (!searchText.value) {
    return boardGroups.flatMap(group => group.items)
  }
  const search = searchText.value.toLowerCase()
  return boardGroups.flatMap(group => 
    group.items.filter(board => 
      board.title.toLowerCase().includes(search) || 
      board.description.toLowerCase().includes(search)
    )
  )
})

const hasVisibleBoards = (items: BoardItem[]) => {
  if (!searchText.value) return true
  const search = searchText.value.toLowerCase()
  return items.some(board => 
    board.title.toLowerCase().includes(search) || 
    board.description.toLowerCase().includes(search)
  )
}

const isBoardVisible = (board: BoardItem) => {
  if (!searchText.value) return true
  const search = searchText.value.toLowerCase()
  return board.title.toLowerCase().includes(search) || 
         board.description.toLowerCase().includes(search)
}

const getGroupCount = (items: BoardItem[]) => {
  if (!searchText.value) return items.length
  const search = searchText.value.toLowerCase()
  return items.filter(board => 
    board.title.toLowerCase().includes(search) || 
    board.description.toLowerCase().includes(search)
  ).length
}

const navigateTo = (path: string) => {
  window.open(path, '_blank')
}

const handleSearch = () => {
}

const handleRefresh = () => {
  loading.value = true
  searchText.value = ''
  setTimeout(() => {
    loading.value = false
  }, 500)
}

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 800)
})
</script>

<style lang="scss" scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
}

.board-card {
  :deep(.el-tag) {
    font-weight: 500;
  }
}
</style>