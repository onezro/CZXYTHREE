import { ref, nextTick, onMounted, onBeforeUnmount, type Ref } from 'vue';

export interface UseTableHeightOptions {
  /** 最小高度，避免极端情况下表格被压缩到不可见 */
  minHeight?: number;
  /** 额外需要扣除的高度，例如自定义底部留白 */
  offset?: number;
  /** 自定义滚动/可视容器，默认自动向上查找最近的滚动容器 */
  getContainer?: (tableEl: HTMLElement) => HTMLElement | null;
}

const toPx = (value?: string | null): number => {
  const num = parseFloat(value ?? '');
  return Number.isFinite(num) ? num : 0;
};

const resolveElement = (target: unknown): HTMLElement | null => {
  if (!target) return null;
  if (target instanceof HTMLElement) return target;
  const t = target as {
    $el?: unknown;
    vnode?: { el?: unknown };
    $?: { subTree?: { el?: unknown } };
  };
  const candidates: unknown[] = [t.$el, t.vnode?.el, t.$?.subTree?.el];
  for (const candidate of candidates) {
    if (candidate instanceof HTMLElement) return candidate;
  }
  return null;
};

// 判断元素高度是否“由内容撑开”（auto）：其 clientHeight 等于各子元素(含内边距)的布局高度之和。
// 这类元素（如 el-card__body）高度会随表格高度变化，作为高度基准会产生循环依赖。
const isContentDriven = (el: HTMLElement): boolean => {
  const style = getComputedStyle(el);
  let childrenHeight = toPx(style.paddingTop) + toPx(style.paddingBottom);
  for (let i = 0; i < el.children.length; i++) {
    const child = el.children[i] as HTMLElement;
    const childStyle = getComputedStyle(child);
    childrenHeight += child.offsetHeight + toPx(childStyle.marginTop) + toPx(childStyle.marginBottom);
  }
  return Math.abs(el.clientHeight - childrenHeight) <= 2;
};

// 向上查找最近的“固定高度”滚动容器（如布局中的 AppView），跳过被内容撑开的 auto 高度容器
const findScrollContainer = (el: HTMLElement): HTMLElement | null => {
  let node = el.parentElement;
  while (node) {
    const style = getComputedStyle(node);
    if (
      (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
      node.clientHeight > 0 &&
      !isContentDriven(node)
    ) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
};

/**
 * 累加表格某一方向上、直到 container 为止的所有占位高度（只使用 offsetHeight 布局尺寸，
 * 不使用 getBoundingClientRect，避免受路由过渡 transform、滚动位置影响）：
 * - above=true ：表格上方（查询操作区，即 <div class="flex justify-between"> 表单块）的
 *                兄弟块高度 + 外边距 + 各祖先的上内边距
 * - above=false：表格下方（分页等）的兄弟块高度 + 外边距 + 各祖先的下内边距
 */
const getSiblingSpace = (tableEl: HTMLElement, container: HTMLElement, above: boolean): number => {
  let space = 0;
  let current: HTMLElement | null = tableEl;
  while (current && current !== container) {
    let sibling = above ? current.previousElementSibling : current.nextElementSibling;
    while (sibling) {
      const el = sibling as HTMLElement;
      const style = getComputedStyle(el);
      space += el.offsetHeight + toPx(style.marginTop) + toPx(style.marginBottom);
      sibling = above ? el.previousElementSibling : el.nextElementSibling;
    }
    current = current.parentElement;
    if (current && current !== container) {
      space += above ? toPx(getComputedStyle(current).paddingTop) : toPx(getComputedStyle(current).paddingBottom);
    }
  }
  return space;
};

/**
 * 动态计算表格高度：滚动容器可用高度 − 查询操作区高度 − 分页等下方占位 = 表格高度。
 * 查询操作区换行、标签页切换、侧边栏收缩等导致的高度变化都会被自动感知，
 * 替代 window.innerHeight - 固定值 的写法。
 */
export const useTableHeight = (tableRef: Ref<unknown>, options: UseTableHeightOptions = {}) => {
  const { minHeight = 120, offset = 0 } = options;
  const tableHeight = ref(minHeight);
  const observers: ResizeObserver[] = [];

  const getContainer = (tableEl: HTMLElement): HTMLElement | null => {
    if (options.getContainer) return options.getContainer(tableEl);
    return findScrollContainer(tableEl);
  };

  const calcTableHeight = () => {
    nextTick(() => {
      const tableEl = resolveElement(tableRef.value);
      // 标签页隐藏时视口尺寸为 0，跳过计算避免把高度算错
      if (!tableEl || window.innerHeight <= 0) return;
      const container = getContainer(tableEl);
      if (!container) {
        // 未找到滚动容器时降级为按视口计算
        const rect = tableEl.getBoundingClientRect();
        tableHeight.value = Math.max(window.innerHeight - rect.top - offset, minHeight);
        return;
      }
      const style = getComputedStyle(container);
      const available = container.clientHeight - toPx(style.paddingTop) - toPx(style.paddingBottom);
      // 减去表格上方的查询操作区（查询 div）高度
      const queryAreaHeight = getSiblingSpace(tableEl, container, true);
      // 减去表格下方的分页等占位高度
      const pagerAreaHeight = getSiblingSpace(tableEl, container, false);
      tableHeight.value = Math.max(available - queryAreaHeight - pagerAreaHeight - offset-5, minHeight);
    });
  };

  const observe = (el: HTMLElement | null) => {
    if (!el || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => calcTableHeight());
    observer.observe(el);
    observers.push(observer);
  };

  onMounted(() => {
    calcTableHeight();
    window.addEventListener('resize', calcTableHeight);
    const tableEl = resolveElement(tableRef.value);
    if (tableEl) {
      // 容器尺寸变化（窗口缩放、侧边栏收缩等）时重算，查询操作区换行也随之被感知
      observe(getContainer(tableEl));
    }
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', calcTableHeight);
    observers.forEach((observer) => observer.disconnect());
    observers.length = 0;
  });

  return { tableHeight, calcTableHeight };
};
