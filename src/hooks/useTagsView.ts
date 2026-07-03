import { useTagsViewStoreWithOut } from "@/stores/modules/tagsView";
import { type RouteLocationNormalizedLoaded, useRouter } from "vue-router";
import { computed, nextTick, unref } from "vue";

export const useTagsView = () => {
  const tagsViewStore = useTagsViewStoreWithOut();

  const { replace, currentRoute } = useRouter();

  const selectedTag = computed(() => tagsViewStore.getSelectedTag);

  const closeAll = (callback?: Fn) => {
    tagsViewStore.delAllViews();
    const affixTag = tagsViewStore.visitedViews.find((tag:any) => tag.meta?.affix);
    if (affixTag) {
      replace({ path: affixTag.path, query: affixTag.query });
    }
    callback?.();
  };

  const closeLeft = (callback?: Fn) => {
    tagsViewStore.delLeftViews(
      unref(selectedTag) as RouteLocationNormalizedLoaded
    );
    callback?.();
  };

  const closeRight = (callback?: Fn) => {
    tagsViewStore.delRightViews(
      unref(selectedTag) as RouteLocationNormalizedLoaded
    );
    callback?.();
  };

  const closeOther = (callback?: Fn) => {
    tagsViewStore.delOthersViews(
      unref(selectedTag) as RouteLocationNormalizedLoaded
    );
    callback?.();
  };

  const closeCurrent = (
    view?: RouteLocationNormalizedLoaded,
    callback?: Fn
  ) => {
    if (view?.meta?.affix) return;
    tagsViewStore.delView(view || unref(currentRoute));

    callback?.();
  };

  const refreshPage = async (
    view?: RouteLocationNormalizedLoaded,
    callback?: Fn
  ) => {
    try {
      // 确保在下一个 tick 执行
      await nextTick();

      tagsViewStore.delCachedView();

      const { path, fullPath, query } = view || unref(currentRoute);

      // 使用更可靠的重定向方式
      await replace({
        path: "/redirect" + path,
        query: {
          ...query,
          t: Date.now(), // 添加时间戳避免缓存
        },
      });

      callback?.();
    } catch (error) {
      console.error("刷新页面失败:", error);
    }
  };

  const setTitle = (title: string, path?: string) => {
    tagsViewStore.setTitle(title, path);
  };

  return {
    closeAll,
    closeLeft,
    closeRight,
    closeOther,
    closeCurrent,
    refreshPage,
    setTitle,
  };
};
