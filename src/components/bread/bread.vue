<script lang="ts" setup>
import { ref, unref, computed, watch, onBeforeMount } from "vue";
import { useRouter, type RouteLocationMatched } from "vue-router";
import { usePermissionStoreWithOut } from "@/stores/modules/permission";
import { filterBreadcrumb } from "./helper";
import type { RouteLocationNormalizedLoaded } from "vue-router";
import { filter, treeToList } from "@/utils/tree";
import { useAppStore } from '@/stores/modules/app'
import { ArrowRight } from '@element-plus/icons-vue'
const appStore = useAppStore()


const { currentRoute } = useRouter();

const permissionStore = usePermissionStoreWithOut();
const menuRouters = computed(() => {
  const routers = permissionStore.getRouters;
  return filterBreadcrumb(routers);
});

// const breadcrumbs = ref<Array<RouteLocationMatched>>([]);
const levelList = ref([]);
watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    if (route.path.startsWith("/redirect/")) {
      return;
    }
    getBreadcrumb();
  }
);
const getBreadcrumb = () => {
  const currentPath = currentRoute.value.matched.slice(-1)[0].path;
  levelList.value = filter(unref(menuRouters), (node: AppRouteRecordRaw) => {
    return node.path === currentPath;
  });
 
};
onBeforeMount(() => {
  getBreadcrumb();
});

</script>

<template>
  <div class="flex items-center h-full">
    <!-- <div class="ml-[10px]">
      <img src="../../assets/logo-white.svg" width="140px" alt="">
    </div> -->
    <div class="pl-2" >
          <img src="../../assets/logo-on.png" width="140px"  alt="">
    </div>
    <el-breadcrumb :separator-icon="ArrowRight" class="flex items-center h-full  " v-if="!appStore.getSystemType">
      <el-icon size="20" color="#fff" class="mr-2 ml-2">
        <Place />
      </el-icon>
      <TransitionGroup appear enter-active-class="animate__animated animate__fadeInRight">
        <el-breadcrumb-item  v-for="item in treeToList(unref(levelList))" :key="item.name" :to="{
          path:
            !item.redirect || item.redirect === 'noredirect' ? '' : item.path,
        }">
          {{ item.meta.title }}
        </el-breadcrumb-item>
      </TransitionGroup>
    </el-breadcrumb>
  </div>
</template>

<style lang="scss" scoped>
.el-breadcrumb {
  ::v-deep .el-breadcrumb__inner {
    color: #fff;
    font-size: 13px;

    &:hover {
      color: #eeeeee;
    }
  }

  ::deep(.el-breadcrumb__item):not(:last-child) .el-breadcrumb__inner {
    color: #fff;
    // font-size: 14px;
    // &:hover {
    //   color: #ffcd50;
    // }
  }

  ::deep(.el-breadcrumb__item):last-child .el-breadcrumb__inner {
    color: #fff;
  }
}
</style>
