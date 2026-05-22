<template>
  <div class="line-container" ref="containerRef" id="fullDiv5">
    <div class="content-wrapper" ref="contentRef" :style="contentStyle">
      <!-- <lineIndex :isVertical="isVertical"/> -->
      <southIndex/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick } from "vue";
import southIndex from "./southOperatComp/index.vue";

const containerRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);

const baseWidth = ref(1920);
const baseHeight = ref(1080);
const isVertical = ref(false);
const windowWidth = ref(0);
const windowHeight = ref(0);
const isRotate = ref(false);
const key = ref(1);

let timer: ReturnType<typeof setTimeout> | null = null;

const baseProportion = computed(() => baseWidth.value / baseHeight.value);

const contentStyle = computed(() => ({
  width: baseWidth.value + "px",
  height: baseHeight.value + "px",
}));

function checkOrientation() {
  if (isRotate.value) {
    isVertical.value = true;
    baseWidth.value = 1080;
    baseHeight.value = 1920;
    return;
  }
  isVertical.value = window.innerHeight > window.innerWidth;

  if (isVertical.value) {
    baseWidth.value = 1080;
    baseHeight.value = 1920;
  } else {
    baseWidth.value = 1920;
    baseHeight.value = 1080;
  }
}

function calcScaleRatio() {
  const container = containerRef.value;
  const content = contentRef.value;

  if (!container || !content) return;

  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  if (containerWidth === 0 || containerHeight === 0) return;

  const currentRatio = containerWidth / containerHeight;
  let scaleX: number, scaleY: number;

  if (currentRatio > baseProportion.value) {
    scaleX = (containerHeight * baseProportion.value) / baseWidth.value;
    scaleY = containerHeight / baseHeight.value;
  } else {
    scaleX = containerWidth / baseWidth.value;
    scaleY = containerWidth / (baseProportion.value * baseHeight.value);
  }

  if (isRotate.value) {
    scaleX = containerHeight / baseWidth.value;
    scaleY = containerHeight / baseWidth.value;
  }

  content.style.transform = `scale(${scaleX}, ${scaleY}) translate(-50%, -50%)`;
}

function handleResize() {
  checkOrientation();
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    calcScaleRatio();
    windowWidth.value = window.innerWidth;
    windowHeight.value = window.innerHeight;
  }, 200);
}

function toggleOrientation() {
  isVertical.value = !isVertical.value;

  if (isVertical.value) {
    baseWidth.value = 1080;
    baseHeight.value = 1920;
  } else {
    baseWidth.value = 1920;
    baseHeight.value = 1080;
  }

  nextTick(() => {
    calcScaleRatio();
  });
}

function refreshWindow() {
  windowWidth.value = window.innerWidth;
  windowHeight.value = window.innerHeight;
  calcScaleRatio();
}

function changeMsg() {
  isRotate.value = !isRotate.value;

  if (isRotate.value) {
    isVertical.value = true;
    baseWidth.value = 1080;
    baseHeight.value = 1920;
  } else {
    isVertical.value = false;
    baseWidth.value = 1920;
    baseHeight.value = 1080;
  }

  nextTick(() => {
    calcScaleRatio();
  });

  key.value += 1;
}

onMounted(() => {
  checkOrientation();
  calcScaleRatio();
  window.addEventListener("resize", handleResize);
  windowWidth.value = window.innerWidth;
  windowHeight.value = window.innerHeight;
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
  if (timer) {
    clearTimeout(timer);
  }
});
</script>

<style lang="scss" scoped>
.line-container {
  height: calc(100vh - 80px);
  overflow: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  background-image: url("../../assets/bg.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
}

.content-wrapper {
  color: #000;
  // width: 1920px;
  // height: 1080px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transform-origin: left top;
  transition: transform 0.3s ease;
}

.isRotate {
  transform: rotate(270deg);
}
</style>