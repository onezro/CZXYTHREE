import './assets/main.css'
import "animate.css"
import './assets/css/index.scss'
import "./style/tailwind.css";


import { createApp } from 'vue'
import { createPinia } from 'pinia'


import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import zhCN from "element-plus/dist/locale/zh-cn.mjs" //引入中文
// import { ClickOutside } from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// import TuiPlus from '@wocwin/t-ui-plus'
// import '@wocwin/t-ui-plus/lib/style.css'
import './permission'
// import AFTableColumn from 'af-table-column'

// import 'element-plus/dist/index.css'
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

import i18n from "./locale/index";
import DataVVue3 from '@kjgl77/datav-vue3'
import Antd from "ant-design-vue";
// import "ant-design-vue/dist/antd.css";
const app = createApp(App)
// app.directive(ClickOutside)
// app.use(AFTableColumn)
app.use(VXETable)
app.use(DataVVue3)
app.use(i18n)
app.use(ElementPlus, {locale:zhCN,size: ''})
// app.use(TuiPlus)
app.use(Antd)
app.use(createPinia())
app.use(router)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) { 
    app.component(key, component)
}

// app.use(ClickOutside)

app.mount('#app')
