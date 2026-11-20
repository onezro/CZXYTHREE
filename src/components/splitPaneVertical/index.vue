<template>
    <div ref="containerRef" class="v-split" :class="{ 'is-resizing': isResizing }">
        <div class="v-split__pane" :style="paneStyle(0)">
            <slot name="top" />
        </div>

        <div class="v-split__splitter" role="separator" aria-orientation="horizontal" :title="splitterTitle"
            :style="splitterStyle" @dblclick="resetSizes" @pointerdown="startResize(0, $event)" @pointermove="resize"
            @pointerup="stopResize" @pointercancel="stopResize" />

        <template v-if="hasMiddle">
            <div class="v-split__pane" :style="paneStyle(1)">
                <slot name="middle" />
            </div>

            <div class="v-split__splitter" role="separator" aria-orientation="horizontal" :title="splitterTitle"
                :style="splitterStyle" @dblclick="resetSizes" @pointerdown="startResize(1, $event)"
                @pointermove="resize" @pointerup="stopResize" @pointercancel="stopResize" />
        </template>

        <div class="v-split__pane" :style="paneStyle(hasMiddle ? 2 : 1)">
            <slot name="bottom" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'

const props = withDefaults(defineProps<{
    /** 每个面板的最小高度（px） */
    minSize?: number
    /** 分隔条高度（px） */
    splitterHeight?: number
    /** 分隔条悬浮提示 */
    splitterTitle?: string
}>(), {
    minSize: 120,
    splitterHeight: 8,
    splitterTitle: '上下拖动调整高度，双击恢复',
})

const slots = useSlots()
// 传入 #middle 插槽即为三段布局（上/中/下），否则为上/下两段
const hasMiddle = computed(() => Boolean(slots.middle))
const paneCount = computed(() => (hasMiddle.value ? 3 : 2))

const containerRef = ref<HTMLElement | null>(null)
// null 表示默认均分，拖动后为各面板固定高度
const sizes = ref<number[] | null>(null)
const isResizing = ref(false)
let startY = 0
let startSizes: number[] = []
let resizeIndex = 0

const splitterStyle = computed(() => ({
    flexBasis: `${props.splitterHeight}px`,
}))

const paneStyle = (index: number) => {
    const size = sizes.value?.[index]
    return size === undefined ? { flex: '1 1 0' } : { flex: `0 0 ${size}px` }
}

function getPaneHeights() {
    const container = containerRef.value
    if (!container) return []
    return Array.from(container.children)
        .filter((el) => el.classList.contains('v-split__pane'))
        .map((el) => el.getBoundingClientRect().height)
}

function startResize(index: number, event: PointerEvent) {
    const heights = getPaneHeights()
    if (!containerRef.value || heights.length !== paneCount.value) return

    event.preventDefault()
    resizeIndex = index
    startY = event.clientY
    startSizes = heights
    sizes.value = heights.map((height) => Math.round(height))
    isResizing.value = true
    ;(event.currentTarget as HTMLElement)?.setPointerCapture?.(event.pointerId)
}

function resize(event: PointerEvent) {
    if (!isResizing.value || !sizes.value) return
    const delta = event.clientY - startY
    const index = resizeIndex
    // 只调整分隔条上下相邻的两个面板，保证两者都不小于最小高度
    const maxDelta = startSizes[index + 1] - props.minSize
    const minDelta = props.minSize - startSizes[index]
    const effective = Math.min(maxDelta, Math.max(minDelta, delta))
    const next = [...startSizes]
    next[index] = Math.round(startSizes[index] + effective)
    next[index + 1] = Math.round(startSizes[index + 1] - effective)
    sizes.value = next
}

function stopResize(event: PointerEvent) {
    if (!isResizing.value) return
    isResizing.value = false
    const target = event.currentTarget as HTMLElement
    if (target?.hasPointerCapture?.(event.pointerId)) target.releasePointerCapture(event.pointerId)
}

function resetSizes() {
    sizes.value = null
}

defineExpose({ reset: resetSizes })
</script>

<style scoped>
.v-split {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-width: 0;
    min-height: 0;
}

.v-split.is-resizing {
    cursor: row-resize;
    user-select: none;
}

.v-split__pane {
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
}

.v-split__splitter {
    position: relative;
    z-index: 3;
    display: flex;
    flex: 0 0 8px;
    align-items: center;
    justify-content: center;
    cursor: row-resize;
    touch-action: none;
}

.v-split__splitter::before {
    width: 100%;
    height: 1px;
    content: "";
    background: #d6dee8;
    transition: height 0.15s ease, background-color 0.15s ease;
}

.v-split__splitter:hover::before,
.v-split.is-resizing .v-split__splitter::before {
    height: 3px;
    background: var(--el-color-primary);
}
</style>
