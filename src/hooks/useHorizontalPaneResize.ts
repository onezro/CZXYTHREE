import { computed, ref } from "vue";

type ResizeOptions = {
  minLeft?: number;
  minRight?: number;
  splitterWidth?: number;
};

export function useHorizontalPaneResize(options: ResizeOptions = {}) {
  const minLeft = options.minLeft ?? 320;
  const minRight = options.minRight ?? 480;
  const splitterWidth = options.splitterWidth ?? 8;

  const containerRef = ref<HTMLElement | null>(null);
  const leftPaneWidth = ref<number | null>(null);
  const isResizing = ref(false);
  let startX = 0;
  let startWidth = 0;

  function getContentWidth(container: HTMLElement) {
    const style = window.getComputedStyle(container);
    const paddingLeft = Number.parseFloat(style.paddingLeft) || 0;
    const paddingRight = Number.parseFloat(style.paddingRight) || 0;
    return Math.max(0, container.clientWidth - paddingLeft - paddingRight);
  }

  const gridStyle = computed(() =>
    leftPaneWidth.value === null
      ? {}
      : {
          gridTemplateColumns: `${leftPaneWidth.value}px ${splitterWidth}px minmax(${minRight}px, 1fr)`,
        },
  );

  function startResize(event: PointerEvent) {
    const container = containerRef.value;
    const leftPane = container?.firstElementChild as HTMLElement | null;
    if (!container || !leftPane) return;

    event.preventDefault();
    startX = event.clientX;
    startWidth = leftPane.getBoundingClientRect().width;
    isResizing.value = true;
    (event.currentTarget as HTMLElement)?.setPointerCapture?.(event.pointerId);
  }

  function resize(event: PointerEvent) {
    if (!isResizing.value || !containerRef.value) return;
    const contentWidth = getContentWidth(containerRef.value);
    const maxLeft = Math.max(minLeft, contentWidth - splitterWidth - minRight);
    leftPaneWidth.value = Math.round(
      Math.min(maxLeft, Math.max(minLeft, startWidth + event.clientX - startX)),
    );
  }

  function stopResize(event: PointerEvent) {
    if (!isResizing.value) return;
    isResizing.value = false;
    const target = event.currentTarget as HTMLElement;
    if (target?.hasPointerCapture?.(event.pointerId)) target.releasePointerCapture(event.pointerId);
  }

  function resetPaneWidth() {
    leftPaneWidth.value = null;
  }

  return {
    containerRef,
    gridStyle,
    isResizing,
    resetPaneWidth,
    resize,
    startResize,
    stopResize,
  };
}
