import router from "./router";
import { useAppStore } from "@/stores/modules/app";
import type { RouteRecordRaw } from "vue-router";
import { useTitle } from "@/hooks/useTitle";
import { getToken } from "@/utils/auth";
import { useNProgress } from "@/hooks/useNProgress";
import { usePermissionStoreWithOut } from "@/stores/modules/permission";
import { NO_REDIRECT_WHITE_LIST } from "@/constants";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { getMenu, getInfo, getMenuOPUI, getWorksMenuOPUI } from "@/api/permiss/index";
// import { asyncRouterMap, constantRouterMap } from '@/router'
import { updateParentMenus } from "@/utils/routerAata";
import { setMenu } from "@/utils/dataMenu";
import axios from "axios";
import { ElNotification, ElMessage, ElMessageBox } from "element-plus";

const { start, done } = useNProgress();

router.beforeEach(async (to, from, next) => {
  start();
  const permissionStore = usePermissionStoreWithOut();
  const appStore = useAppStore();
  const userStore = useUserStoreWithOut();
  const hasUser = getToken();
  if (hasUser) {
    if (to.path === "/login") {
      next({ path: "/" });
    } else {
      const roleRouters = userStore.getRoleRouters || [];
      if (permissionStore.getIsAddRouters) {
        next();
        return;
      }
      await getInfo().then(async (data: any) => {
        userStore.setUserInfo(data.Data);

        if (data.Code == 100200 || data.Code == 100300) {
          if (roleRouters.length == 0) {
            if (appStore.getSystemType) {
              await getWorksMenuOPUI().then(async (data: any) => {
                const routerArr = data.content || [];
                const routerData1 = setMenu(routerArr);
                let routerData = routerData1.map((v: any) => {
                  let data = updateParentMenus([v]);
                  return data;
                });
                userStore.setRoleRouters(routerData);
                await permissionStore.generateRoutes("server", routerData);
              });
              permissionStore.getAddRouters.forEach((route: any) => {
                router.addRoute(route as unknown as RouteRecordRaw); // 动态添加可访问路由表
              });
            } else {
              await getMenu().then(async (data: any) => {
                if (data.Code == 100200) {
                  const routerArr = data.Data || [];
                  const systemRouter = routerArr.filter(
                    (v: any) => v.MenuName == "Portal"
                  );
                  if (systemRouter.length == 0) {
                    await permissionStore.generateRoutes("static");
                  } else {
                    userStore.setRoleRouters(systemRouter[0].childMenu);
                    await permissionStore.generateRoutes(
                      "server",
                      systemRouter[0].childMenu
                    );
                  }
                } else {
                  await permissionStore.generateRoutes("static");
                }
                permissionStore.getAddRouters.forEach((route: any) => {
                  router.addRoute(route as unknown as RouteRecordRaw);
                });
              });
            }
          }
        } else {
          permissionStore.generateRoutes("static");
          permissionStore.getAddRouters.forEach((route: any) => {
            router.addRoute(route as unknown as RouteRecordRaw); // 动态添加可访问路由表
          });
        }
      });
      const redirectPath =
        appStore.getSystemType && localStorage.getItem("OPUIData")
          ? appStore.getOpuiData.path
          : from.query.redirect || to.path;
      // const redirectPath = from.query.redirect || to.path
      const redirect = decodeURIComponent(redirectPath as string);
      const nextData =
        to.path === redirect ? { ...to, replace: true } : { path: redirect };
      permissionStore.setIsAddRouters(true);
      next(nextData);
    }
  } else {
    if (NO_REDIRECT_WHITE_LIST.indexOf(to.path) !== -1) {
      next();
    } else {
      if (appStore.getSystemType && localStorage.getItem("OPUIData")) {
        let routestr = appStore.getOpuiData.path || "/";
        next(`/login?redirect=${routestr}`);
      } else {
        next(`/login?redirect=${to.path}`);
      }
    }
  }
});

router.afterEach((to) => {
  useTitle(to?.meta?.title as string);
  done(); // 结束Progress
});
