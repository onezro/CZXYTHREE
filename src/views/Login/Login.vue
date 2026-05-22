<script setup lang="ts">
import { onMounted, onBeforeMount } from "vue";
import {
  empolyeeLogin,
  getEmpoyeeInfo,
  findEmployeeRoles,
  // GetVersion,
} from "@/api/permiss/index";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from "vue-router";
import { useRouter } from "vue-router";
import { ElNotification } from "element-plus";
import { useAppStore } from "@/stores/modules/app";
import { ref, watch } from "vue";
import axios from "axios";

const userStore = useUserStoreWithOut();
const { currentRoute, addRoute, push } = useRouter();
const appStore = useAppStore();
const version = ref("");
const form = ref({
  EmployeeName: "",
  DocManagerUser: "",
  EmployeeId: "",
  CanLogin: 0,
  FullName: "",
});
const redirect = ref<string>("");
const userNameRef=ref()
const passwordRef=ref()

watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    redirect.value = route?.query?.redirect as string;
  },
  {
    immediate: true,
  }
);
onBeforeMount(() => {
  // axios.get("http://localhost:5173/getvs.json").then((data) => {
  //   let res = data.data;
  //   version.value = res.content.CurrentVer;
  // });
  // GetVersion().then((res: any) => {
  //   version.value = res.content.CurrentVer;
  // });
});
onMounted(() => {
  if (localStorage.getItem('LOGINNAME')) {
    let data = localStorage.getItem('LOGINNAME')
    if (data !== null) {
      // let formData=JSON.parse(data)
      form.value.EmployeeName = data
      if (form.value.EmployeeName !== "") {
        passwordRef.value.focus()
      }else{
        userNameRef.value.focus()
      }
    }
  }
});
const loginClick = () => {
  // axios.get("http://localhost:5173/login.json").then((data) => {
  //   let res = data.data;
  //   if (res.code == 100200) {
  //     localStorage.setItem("OPCENTER_ROLE", form.value.EmployeeName);
  //     setToken(res.content.Token);
  //     if (appStore.getSystemType && localStorage.getItem("OPUIData")) {
  //       let routestr = appStore.getOpuiData.path || "/";
  //       push({ path: routestr });
  //     } else {
  //       push({ path: redirect.value });
  //     }
  //   }
  // });
  empolyeeLogin(form.value).then((data: any) => {
    const dataText = data.Data;
    if (data.Code == 100200) {
      localStorage.setItem('LOGINNAME', form.value.EmployeeName)
      localStorage.setItem("OPCENTER_ROLE", form.value.EmployeeName);
      setToken(dataText.Token);
      if (appStore.getSystemType && localStorage.getItem("OPUIData")) {
        let routestr = appStore.getOpuiData.path || "/";
        push({ path: routestr });
      } else {
        push({ path: redirect.value });
      }
    }
  });
};
const switchSystems = () => {
  localStorage.setItem("SYSTEM_TYPE", JSON.stringify(!appStore.getSystemType));
  appStore.setSystemType(!appStore.getSystemType);
  if (appStore.getSystemType && localStorage.getItem("OPUIData")) {
    let routestr = appStore.getOpuiData.path || "/";
    push(routestr);
  } else {
    push({ path: "/login", query: { redirect: "/dashboard/index" } });
  }
  // ElNotification({
  //   title: "系统已切换",
  //   message: appStore.getSystemType ? "当前为操作端" : "当前为系统端",
  //   type: "warning",
  // });
};
</script>

<template>
  <div class="w-[100vw] h-[100vh] bg-no-repeat bg-cover bg-[url('../assets/bg.jpg')]">

    <div class="w-[100%] absolute h-[100%] flex bg-[#00000036]">
      <!-- <div class="m-auto"> -->
      <div class="m-auto bg-white p-4 rounded-2xl shadow-2xl">
        <el-form ref="formRef" label-position="top" :model="form" label-width="auto">
          <h2 class="text-center text-2xl font-bold p-2.5 mb-5">
            {{ appStore.getSystemType ? "OPUI登录" : "Portal登录" }}
          </h2>
          <el-form-item label="用户名" prop="userName"><el-input ref="userNameRef" v-model="form.EmployeeName" size="large" class="w-[440px]"
              placeholder="请输入用户名" /></el-form-item>
          <el-form-item label="密码" prop="password"><el-input ref="passwordRef" v-model="form.DocManagerUser" size="large"
              class="w-[440px]" type="password" placeholder="请输入密码" show-password
              @keyup.enter.native="loginClick" /></el-form-item>
          <el-form-item class="mt-5">
            <el-button @click="loginClick" size="large" class="w-[440px]" type="primary"><span
                class="font-bold">登录</span></el-button>
          </el-form-item>
          <!-- <el-form-item>
            <el-button @click="switchSystems" size="large" class="w-[440px]"><span
                class="text-[#e6b33c] font-bold">切换系统</span></el-button>
          </el-form-item> -->
          <!-- <div class="text-center">
              当前为<span class="text-lg text-[#e6b33c] font-bold">{{
                appStore.getSystemType ? "操作端" : "系统端"
                }}</span>你可以切换为<span class="text-lg text-[#006487] font-bold underline cursor-pointer"
                @click="switchSystems">{{ appStore.getSystemType ? "系统端" : "操作端" }}</span>
            </div> -->
          <div class="flex justify-end">
            <!-- <span></span> -->
            <!-- <el-link href="http://192.168.9.50:8022/Chrome_apk/android.aichrome.apk">浏览器下载</el-link> -->
            <span class="text-[#7c7c7c]">{{ version }}</span>
          </div>
        </el-form>
      </div>
      <!-- </div> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.flipper {
  transition: 0.6s;
  transform-style: preserve-3d;
  position: relative;
}

.front,
.back {
  backface-visibility: hidden;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  /* 使用Tailwind的间距类作为参考 */
  box-sizing: border-box;
  border: 1px solid #ccc;
  /* 可选，仅用于视觉分隔 */
}

.front {
  z-index: 2;
  background-color: white;
  /* 可选 */
}

.back {
  transform: rotateY(180deg);
  background-color: #f8fafc;
  /* 可选，使用Tailwind颜色类作为参考 */
}

.is-flipped .front {
  transform: rotateY(180deg);
}

.is-flipped .back {
  transform: rotateY(0deg);
  z-index: 2;
}
</style>
