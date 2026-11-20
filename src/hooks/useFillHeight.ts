import { nextTick, onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

type FillHeightOptions = {
  /** 高度上限（px），防止异常尺寸撑破页面 */
  max?: number
}

/**
 * 计算目标元素在父容器内容区中剩余可用高度，并在窗口/容器/前一个兄弟元素尺寸变化时自动重算。
 * 适用于「查询条件 + 可伸缩内容区」这类上下布局，避免页面出现外层滚动条。
 *
 * 用法：
 * const contentRef = ref()
 * const { height } = useFillHeight(contentRef)
 * <div ref="contentRef" :style="{ height: height + 'px' }" />
 *
 * 注意：父容器需要有确定高度（如 flex:1 / 固定高度），否则高度变化会引起反复计算。
 */
export function useFillHeight(targetRef: Ref<any>, options: FillHeightOptions = {}) {
  const height = ref(0)
  const observers: ResizeObserver[] = []

  const resolveElement = (): HTMLElement | null => {
    const target = targetRef.value
    if (!target) return null
    if (target instanceof HTMLElement) return target
    return (target.$el as HTMLElement | undefined) ?? null
  }

  const calcHeight = () => {
    const el = resolveElement()
    const parent = el?.parentElement
    if (!el || !parent) return
    const style = window.getComputedStyle(parent)
    const bottomInset =
      (Number.parseFloat(style.paddingBottom) || 0) +
      (Number.parseFloat(style.borderBottomWidth) || 0)
    const available =
      parent.getBoundingClientRect().bottom - bottomInset - el.getBoundingClientRect().top
    if (available <= 0) return
    const next = Math.floor(available)
    height.value = options.max ? Math.min(options.max, next) : next
  }

  const observe = (node: Element | null) => {
    if (!node) return
    const observer = new ResizeObserver(calcHeight)
    observer.observe(node)
    observers.push(observer)
  }

  onMounted(() => {
    nextTick(() => {
      calcHeight()
      const el = resolveElement()
      if (!el) return
      observe(el.parentElement)
      // 查询表单等前置元素高度变化时同步重算
      observe(el.previousElementSibling)
    })
    window.addEventListener('resize', calcHeight)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', calcHeight)
    observers.forEach((observer) => observer.disconnect())
    observers.length = 0
  })

  return { height, calcHeight }
}
