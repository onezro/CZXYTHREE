<template>
  <div class="traceability"  v-loading="iframeloading">
    <div v-loading="iframeloading" ></div>
    <iframe
      class="iframe"
      id="ifra"
      style="border: none"
      :src="reportUrl"
      @load="onIframeLoad"
    ></iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      iframeloading: true,
      reportUrl: '/ValorMSS/shopfloor/production'
    }
  },
  methods: {
    onIframeLoad() {
      this.iframeloading = false
      console.log('iframe已加载完毕')
    }
  }
}
</script>

<style lang="scss" scoped>
.traceability {
  width: 100%;
  height: calc(100vh - 80px);
  .iframe {
    width: 100%;
    height: 100%;
  }
}
</style>