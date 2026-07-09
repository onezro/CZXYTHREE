<script setup lang="ts">
import {  RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <RouterView />
</template>

<style scoped>

</style>
<style>
/* 全局样式，覆盖 body */
body.el-popup-parent--hidden {
  width: 100% !important;
}
.el-message-box-parent--hidden {
  width: 100% !important;
}
</style>
