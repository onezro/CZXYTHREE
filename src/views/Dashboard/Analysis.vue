<template>
  <div class="bgimg">
    <el-carousel :height="'calc(100vh - 80px)'" motion-blur :interval="6500">
      <el-carousel-item v-for="item in dataimg" :key="item">
      
         <el-image :src="item.img"   :style="{ width: `${item.width}%`, height: `${item.height}%` }"/>
      </el-carousel-item>
    </el-carousel>
    <!-- <img src="../../assets/bg.jpg" alt=""> -->
    <!-- <el-image src="https://www.bicv.com/skin/default/images/pic09.png" fit="contain" /> -->
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
// const dataimg=ref(['https://www.bicv.com/skin/default/images/homeabout.jpg','	https://www.bicv.com/skin/default/images/pic09_m.jpg','https://www.bicv.com/skin/default/images/mBanner02.jpg'])
import img1 from '@/assets/dashboard/1714269459418.png'
import img2 from '@/assets/dashboard/img_v3_00a6_a9d491a4-3940-43a0-9cc0-81b732bcef1g.jpg'

const dataimg = ref([
  {
    img: img1,
    width: 100,
    height: 100,
  }
])
</script>

<style scoped lang="scss">
.bgimg {
  height: calc(100vh - 80px);
  // background-repeat: no-repeat;
  // background-size: cover;
  // background-image: url('../../assets/pic09.png');
}
</style>