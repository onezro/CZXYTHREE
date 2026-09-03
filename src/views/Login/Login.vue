<script setup lang="ts">
import { onMounted, onBeforeMount } from "vue";
import {
  empolyeeLogin,
  getEmpoyeeInfo,
  findEmployeeRoles,
  // GetVersion,
} from "@/api/permiss";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from "vue-router";
import { useRouter } from "vue-router";
import { ElNotification } from "element-plus";
import { useAppStore } from "@/stores/modules/app";
import { ref, watch } from "vue";
import axios from "axios";
import { useI18n } from "vue-i18n";
import { setLocale } from "@/locale/index";

const userStore = useUserStoreWithOut();
const { currentRoute, addRoute, push } = useRouter();
const appStore = useAppStore();
const { t } = useI18n();
const version = ref("");
const form = ref({
  EmployeeName: "",
  DocManagerUser: "",
  EmployeeId: "",
  CanLogin: 0,
  FullName: "",
});
const redirect = ref<string>("");
const userNameRef = ref();
const passwordRef = ref();
const currentLang = ref(localStorage.getItem('OPCENTER_LANG') || 'zh');

const languageOptions = [
  { value: 'zh', label: () => t('login.chinese') },
  { value: 'en', label: () => t('login.english') },
  // { value: 'ja', label: () => t('login.japanese') },
];

const changeLang = (lang: string) => {
  currentLang.value = lang;
  setLocale(lang);
};

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
      } else {
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
    } else {
      ElNotification({
        title: t('login.loginFailed'),
        message: data.Message || t('login.loginFailed'),
        type: "error",
      });
    }
  }).catch((err: any) => {
    ElNotification({
      title: t('login.loginFailed'),
      message: err?.Message || err?.message || t('login.loginFailed'),
      type: "error",
    });
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
  <div class="login-container w-[100vw] h-[100vh] relative overflow-hidden">
    <div id="stars" />
    <div id="stars2" />
    <div id="stars3" />
    <div class="login-glow login-glow--1" />
    <div class="login-glow login-glow--2" />
    <div class="w-[100%] absolute h-[100%] flex items-center justify-center">
      <div class="login-card relative z-10">
        <div class="login-card-inner">
          <div class="login-brand">
            <!-- <div class="brand-logo">
              <svg viewBox="0 0 48 48" width="40" height="40" fill="none">
                <path d="M24 4L44 16V32L24 44L4 32V16L24 4Z" stroke="#00b4d8" stroke-width="2" fill="none"/>
                <path d="M24 12L36 20V28L24 36L12 28V20L24 12Z" stroke="#00b4d8" stroke-width="1.5" fill="none" opacity="0.6"/>
                <circle cx="24" cy="24" r="3" fill="#00b4d8"/>
              </svg>
            </div> -->
            <h2 class="login-title">
              {{ appStore.getSystemType ? t('login.opuiLogin') : t('login.portalLogin') }}
            </h2>
          </div>
          <el-form ref="formRef" label-position="top" :model="form" label-width="auto" class="login-form">
            <el-form-item :label="t('login.user')" prop="userName">
              <el-input ref="userNameRef" v-model="form.EmployeeName" size="large" class="login-input"
                :placeholder="t('login.usernamePlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('login.password')" prop="password">
              <el-input ref="passwordRef" v-model="form.DocManagerUser" size="large"
                class="login-input" type="password" :placeholder="t('login.passwordPlaceholder')" show-password
                @keyup.enter.native="loginClick" />
            </el-form-item>
            <el-form-item class="login-submit">
              <el-button @click="loginClick" size="large" class="login-btn" type="primary">
                <span class="font-bold">{{ t('login.loginButton') }}</span>
              </el-button>
            </el-form-item>
          </el-form>
          <div class="login-footer">
            <span class="version-text">{{ version }}</span>
            <el-dropdown trigger="click" @command="changeLang">
              <div class="locale-trigger">
                <img src="../../assets/svgs/locale.svg" alt="locale" class="locale-icon" />
                <span class="locale-text">{{ languageOptions.find(o => o.value === currentLang)?.label() }}</span>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-for="item in languageOptions" :key="item.value" :command="item.value">
                    {{ item.label() }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
}

@function multiple-box-shadow($n) {
  $value: '#{random(2000)}px #{random(2000)}px #FFF';
  @for $i from 2 through $n {
    $value: '#{$value} , #{random(2000)}px #{random(2000)}px #FFF';
  }
  @return unquote($value);
}

$shadows1: multiple-box-shadow(400);
$shadows2: multiple-box-shadow(200);
$shadows3: multiple-box-shadow(100);

#stars {
  width: 1px;
  height: 1px;
  background: transparent;
  box-shadow: $shadows1;
  animation: animStar 80s linear infinite;
}

#stars::after {
  content: ' ';
  position: absolute;
  top: 2000px;
  width: 1px;
  height: 1px;
  background: transparent;
  box-shadow: $shadows1;
}

#stars2 {
  width: 2px;
  height: 2px;
  background: transparent;
  box-shadow: $shadows2;
  animation: animStar 120s linear infinite;
}

#stars2::after {
  content: ' ';
  position: absolute;
  top: 2000px;
  width: 2px;
  height: 2px;
  background: transparent;
  box-shadow: $shadows2;
}

#stars3 {
  width: 3px;
  height: 3px;
  background: transparent;
  box-shadow: $shadows3;
  animation: animStar 160s linear infinite;
}

#stars3::after {
  content: ' ';
  position: absolute;
  top: 2000px;
  width: 3px;
  height: 3px;
  background: transparent;
  box-shadow: $shadows3;
}

@keyframes animStar {
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(-2000px);
  }
}

.login-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.45;
  pointer-events: none;
  z-index: 1;
}

.login-glow--1 {
  width: 500px;
  height: 500px;
  background: #006487;
  top: -120px;
  right: -80px;
  animation: glowFloat1 12s ease-in-out infinite;
}

.login-glow--2 {
  width: 400px;
  height: 400px;
  background: #00b4d8;
  bottom: -100px;
  left: -60px;
  animation: glowFloat2 15s ease-in-out infinite;
}

@keyframes glowFloat1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-40px, 30px) scale(1.1); }
}

@keyframes glowFloat2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, -40px) scale(1.15); }
}

.login-card {
  width: 460px;
  max-width: 92vw;
  border-radius: 20px;
  position: relative;
  padding: 1px;
  background: linear-gradient(135deg, rgba(0, 180, 216, 0.5), rgba(0, 100, 135, 0.15), rgba(6, 42, 66, 0.3));
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5), 0 0 80px rgba(0, 180, 216, 0.12);
  animation: cardGlow 6s ease-in-out infinite alternate;
}

@keyframes cardGlow {
  from { box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5), 0 0 60px rgba(0, 180, 216, 0.08); }
  to   { box-shadow: 0 25px 60px rgba(0, 0, 0, 0.55), 0 0 100px rgba(0, 180, 216, 0.18); }
}

.login-card-inner {
  border-radius: 19px;
  padding: 40px 44px 28px;
  background: rgba(10, 25, 47, 0.72);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  display: flex;
  flex-direction: column;
}

.login-brand {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 8px;
}

.brand-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(0, 180, 216, 0.12);
  border: 1px solid rgba(0, 180, 216, 0.25);
}

.login-title {
  font-size: 26px;
  font-weight: 700;
  color: #e6f1f8;
  margin: 0;
  letter-spacing: 1px;
  background: linear-gradient(120deg, #ffffff 0%, #00b4d8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-form {
  margin-top: 28px;
}

.login-form :deep(.el-form-item) {
  margin-bottom: 22px;
}

.login-form :deep(.el-form-item__label) {
  color: rgba(200, 220, 240, 0.85) !important;
  font-size: 13px;
  font-weight: 500;
  padding-bottom: 6px;
}

.login-input :deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(0, 180, 216, 0.2);
  border-radius: 10px;
  box-shadow: none !important;
  padding: 4px 14px;
  transition: all 0.25s ease;
}

.login-input :deep(.el-input__wrapper:hover) {
  border-color: rgba(0, 180, 216, 0.5);
  background: rgba(255, 255, 255, 0.08);
}

.login-input :deep(.el-input__wrapper.is-focus) {
  border-color: #00b4d8;
  background: rgba(0, 180, 216, 0.08);
  box-shadow: 0 0 0 3px rgba(0, 180, 216, 0.15) !important;
}

.login-input :deep(.el-input__inner) {
  color: #e6f1f8;
  height: 44px;
  font-size: 14px;
}

.login-input :deep(.el-input__inner::placeholder) {
  color: rgba(180, 200, 220, 0.45);
}

.login-input :deep(.el-input__password) {
  color: rgba(180, 200, 220, 0.5);
}

.login-submit {
  margin-top: 28px !important;
  margin-bottom: 0 !important;
}

.login-btn {
  width: 100%;
  height: 50px;
  border-radius: 12px;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 8px;
  color: #ffffff !important;
  background: linear-gradient(135deg, #0077b6 0%, #00b4d8 50%, #48cae4 100%) !important;
  border: none !important;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 28px rgba(0, 180, 216, 0.45), 0 0 0 1px rgba(0, 180, 216, 0.3);
  transition: all 0.3s ease;
  animation: btnPulse 3s ease-in-out infinite;
}

.login-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
  animation: btnShimmer 2.8s ease-in-out infinite;
}

@keyframes btnPulse {
  0%, 100% { box-shadow: 0 8px 28px rgba(0, 180, 216, 0.45), 0 0 0 1px rgba(0, 180, 216, 0.3); }
  50%      { box-shadow: 0 10px 36px rgba(0, 180, 216, 0.65), 0 0 0 1px rgba(0, 180, 216, 0.5), 0 0 40px rgba(0, 180, 216, 0.25); }
}

@keyframes btnShimmer {
  0%   { left: -100%; }
  100% { left: 100%; }
}

.login-btn:hover {
  transform: translateY(-2px);
  background: linear-gradient(135deg, #0099d6 0%, #00c2e8 50%, #5dd6f2 100%) !important;
  box-shadow: 0 14px 40px rgba(0, 180, 216, 0.7), 0 0 0 1px rgba(0, 180, 216, 0.5) !important;
}

.login-btn:active {
  transform: translateY(0);
  animation-duration: 1.5s;
}

.login-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 22px;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 180, 216, 0.15);
}

.version-text {
  color: rgba(180, 200, 220, 0.4);
  font-size: 12px;
}

.locale-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.25s ease;
  color: rgba(200, 220, 240, 0.75);
  border: 1px solid rgba(0, 180, 216, 0.15);
  background: rgba(255, 255, 255, 0.04);

  &:hover {
    background: rgba(0, 180, 216, 0.1);
    border-color: rgba(0, 180, 216, 0.35);
    color: #e6f1f8;
  }
}

.locale-icon {
  width: 18px;
  height: 18px;
  filter: brightness(0) invert(0.85);
}

.locale-text {
  font-size: 12px;
}
</style>
