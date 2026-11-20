<template>
    <div ref="containerRef" class="split-pane" :class="{ 'is-resizing': isResizing }" :style="paneStyle">
        <div class="split-pane__pane">
            <slot name="left" />
        </div>
        <div class="split-pane__splitter" role="separator" aria-orientation="vertical" :title="splitterTitle"
            @dblclick="resetPaneWidth" @pointerdown="startResize" @pointermove="resize" @pointerup="stopResize"
            @pointercancel="stopResize" />
        <div class="split-pane__pane">
            <slot name="right" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useHorizontalPaneResize } from '@/hooks/useHorizontalPaneResize'

const props = withDefaults(defineProps<{
    /** 左侧面板最小宽度（px） */
    minLeft?: number
    /** 右侧面板最小宽度（px） */
    minRight?: number
    /** 分隔条宽度（px） */
    splitterWidth?: number
    /** 分隔条悬浮提示 */
    splitterTitle?: string
}>(), {
    minLeft: 340,
    minRight: 480,
    splitterWidth: 8,
    splitterTitle: '左右拖动调整宽度，双击恢复',
})

const { containerRef, gridStyle, isResizing, resetPaneWidth, resize, startResize, stopResize } =
    useHorizontalPaneResize({
        minLeft: props.minLeft,
        minRight: props.minRight,
        splitterWidth: props.splitterWidth,
    })

// 未手动拖动前使用默认比例，拖动后使用 hook 计算的固定左侧宽度
const paneStyle = computed(() => {
    if ('gridTemplateColumns' in gridStyle.value) return gridStyle.value
    return {
        gridTemplateColumns: `minmax(${props.minLeft}px, 2fr) ${props.splitterWidth}px minmax(${props.minRight}px, 3fr)`,
    }
})

defineExpose({ resetPaneWidth })
</script>

<style scoped>
.split-pane {
    display: grid;
    min-width: 0;
}

.split-pane.is-resizing {
    cursor: col-resize;
    user-select: none;
}

.split-pane__pane {
    min-width: 0;
    overflow: hidden;
}

.split-pane__splitter {
    position: relative;
    z-index: 3;
    display: flex;
    align-items: stretch;
    justify-content: center;
    cursor: col-resize;
    touch-action: none;
}

.split-pane__splitter::before {
    width: 1px;
    content: "";
    background: #d6dee8;
    transition: width 0.15s ease, background-color 0.15s ease;
}

.split-pane__splitter:hover::before,
.split-pane.is-resizing .split-pane__splitter::before {
    width: 3px;
    background: var(--el-color-primary);
}
</style>
