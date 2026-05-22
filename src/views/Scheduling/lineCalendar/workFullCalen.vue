<template>
  <div class="p-1">
    <el-card shadow="always" :body-style="{ padding: '4px' }">
      <div class="flex flex-col">
        <div class="flex items-center justify-between">
          <div>
            <el-button icon="ArrowLeftBold" circle @click="getPrev"></el-button>
            <el-button icon="ArrowRightBold" circle @click="getNext"></el-button>
          </div>
          <div>
            <div class="text-xl font-bold">{{ calendarTitle }}</div>
          </div>
          <div class="flex gap-2">
            <el-select v-model="calendarLine" placeholder="请选择产线" style="width: 150px" :clearble="false"
              @change="changeLine">
              <el-option v-for="l in lineData" :label="l.Description" :value="l.MfgLineName" />
            </el-select>
            <el-select v-model="viewType" placeholder="视图类型" style="width: 80px" class="header_select"
              @change="handleChangeType">
              <el-option label="月" value="dayGridMonth" />
              <el-option label="周" value="timeGridWeek" />
              <el-option label="日" value="timeGridDay" />
            </el-select>

            <el-button icon="Plus" type="primary" @click="openAdd">
              主日程
            </el-button>
            <el-button icon="Plus" type="warning" @click="openShith">次日程</el-button>
          </div>
        </div>
        <div class="w-[100%] h-[calc(100vh-130px)]">
          <FullCalendar ref="fullcalendar" :options="calendarOptions" ></FullCalendar>
        </div>
      </div>
    </el-card>
    <el-drawer v-model="drawer" title="新增日程计划" direction="rtl" size="400" @close="handleClose">
      <el-form ref="formRef" :model="formData" label-width="auto">
        <el-form-item label="产线" prop="WorkLineName">
          <el-select v-model="formData.WorkLineName" placeholder="请选择产线" :clearble="false" style="width: 220px">
            <el-option v-for="l in lineData" :label="l.Description" :value="l.MfgLineName" />
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="计划类型" prop="ClassType">
          <el-radio-group v-model="formData.ClassType">
            <el-radio value="白班">白班</el-radio>
            <el-radio value="夜班">夜班</el-radio>
          </el-radio-group>
        </el-form-item> -->

        <el-form-item label="开始日期" prop="StartDate">
          <el-date-picker v-model="formData.StartDate" value-format="YYYY-MM-DD" type="date" placeholder="请选择日期"
            :clearble="false" @change="changeDate" />
        </el-form-item>
        <el-form-item label="持续天数" prop="LongDate">
          <el-input type="number" v-model.number="formData.LongDate" style="width: 220px">
            <template #append>天</template>
          </el-input>
        </el-form-item>

        <el-divider content-position="center">白班</el-divider>
        <el-form-item label="开始时间" prop="formData.classtime[0].ClassStartTime">
          <el-time-select v-model="formData.classtime[0].ClassStartTime" style="width: 220px" start="07:00" step="00:15"
            end="12:00" format="HH:mm:ss" />
          <!-- <el-time-picker v-model="formData.classtime[0].ClassStartTime" value-format="HH:mm:ss" /> -->
        </el-form-item>
        <el-form-item label="结束时间" prop="formData.classtime[0].ClassEndTime">
          <el-time-select v-model="formData.classtime[0].ClassEndTime" style="width: 220px" start="15:00" step="00:15"
            end="24:00" format="HH:mm:ss" />
          <!-- <el-time-picker v-model="formData.classtime[0].ClassEndTime" value-format="HH:mm:ss" /> -->
        </el-form-item>
        <el-divider ontent-position="center">夜班</el-divider>
        <el-form-item label="开始时间" prop="formData.classtime[1].ClassStartTime">
          <el-time-select v-model="formData.classtime[1].ClassStartTime" style="width: 220px" start="17:00" step="00:15"
            end="24:00" format="HH:mm:ss" />
          <!-- <el-time-picker v-model="formData.classtime[1].ClassStartTime" value-format="HH:mm:ss" /> -->
        </el-form-item>
        <el-form-item label="结束时间" prop="formData.classtime[1].ClassEndTime">
          <el-time-select v-model="formData.classtime[1].ClassEndTime" style="width: 220px" start="05:00" step="00:15"
            end="12:00" format="HH:mm:ss" />
          <!-- <el-time-picker v-model="formData.classtime[1].ClassEndTime" value-format="HH:mm:ss" /> -->
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="handleClose">取消</el-button>
      </template>
    </el-drawer>
    <el-drawer v-model="secondDrawer" title="次日程计划" direction="rtl" size="400" @close="secondClose">
      <el-form ref="planFormRef" :model="planForm" label-width="auto">

        <el-form-item label="计划名称" prop="PlanName">
          <el-input v-model="planForm.PlanName" style="width: 220px">
          </el-input>
        </el-form-item>
        <el-form-item label="开始日期" prop="PlanDate">
          <el-date-picker v-model="planForm.PlanDate" value-format="YYYY-MM-DD" type="date" placeholder="请选择日期"
            :clearble="false" @change="changeDate" />
        </el-form-item>
        <el-form-item label="开始时间" prop="StartTime">
          <el-time-select v-model="planForm.StartTime" style="width: 220px" start="00:00" step="00:15" end="23:00"
            format="HH:mm:ss" />
          <!-- <el-time-picker v-model="formData.classtime[1].ClassStartTime" value-format="HH:mm:ss" /> -->
        </el-form-item>

        <el-form-item label="持续时间" prop="TimeLong">
          <el-input type="number" v-model.number="planForm.TimeLong" style="width: 220px">
            <template #append>小时</template>
          </el-input>
        </el-form-item>
        <el-form-item label="工作状态" prop="WorkStatus">
          <el-radio-group v-model="planForm.WorkStatus">
            <el-radio value="工作">工作</el-radio>
            <el-radio value="计划停机">计划停机</el-radio>
            <el-radio value="其他">其他</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="产线" prop="WorkLine">
          <el-select v-model="planForm.WorkLine" placeholder="请选择产线" :clearble="false" style="width: 220px">
            <el-option v-for="l in lineData" :label="l.Description" :value="l.MfgLineName" />
          </el-select>
        </el-form-item>
        <el-form-item label="计划类型" prop="SelectType">
          <el-select v-model="planForm.SelectType" placeholder="计划类型" :clearble="false" style="width: 100px" :disabled="planForm.WorkStatus!='其他'"
            @change="changeLevel">
            <el-option v-for="l in levelOneList" :label="l.CalendarSelectType_Name"
              :value="l.CalendarSelectType_Name" />
          </el-select>
          <el-select v-model="planForm.SelectType2" placeholder="" :clearble="false" style="width: 100px" :disabled="planForm.WorkStatus!='其他'"
            class="ml-[20px]">
            <el-option v-for="l in levelTwoList" :label="l.CalendarSelectType_Name"
              :value="l.CalendarSelectType_Name" />
          </el-select>
        </el-form-item>

        <el-form-item label="描述" prop="PlanDescription">
          <el-input v-model="planForm.PlanDescription" style="width: 220px">
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="onSubmitSecond">保存</el-button>
        <el-button @click="secondClose">取消</el-button>
      </template>
    </el-drawer>
    <el-dialog v-model="planVisible" title="日程计划" draggable width="500px" :append-to-body="true"
      :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="planFormRef" :model="editForm" label-width="auto">

        <el-form-item label="计划名称" prop="PlanName">
          <el-input v-model="editForm.PlanName" style="width: 220px">
          </el-input>
        </el-form-item>
        <el-form-item label="开始日期" prop="PlanDate">
          <el-date-picker v-model="editForm.PlanDate" value-format="YYYY-MM-DD" type="date" placeholder="请选择日期"
            :clearble="false" @change="changeDate" />
        </el-form-item>
        <el-form-item label="开始时间" prop="StartTime">
          <el-time-select v-model="editForm.StartTime" style="width: 220px" start="00:00" step="00:15" end="23:00"
            format="HH:mm:ss" />

        </el-form-item>

        <el-form-item label="持续小时" prop="TimeLong">
          <el-input type="number" v-model.number="editForm.TimeLong" style="width: 220px">
            <template #append>小时</template>
          </el-input>
        </el-form-item>
        <el-form-item label="工作状态" prop="WorkStatus">
          <el-radio-group v-model="editForm.WorkStatus">
            <el-radio value="工作">工作</el-radio>
            <el-radio value="计划停机">计划停机</el-radio>
            <el-radio value="其他">其他</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="产线" prop="WorkLine">
          <el-select v-model="editForm.WorkLine" placeholder="请选择产线" :clearble="false" style="width: 220px" disabled>
            <el-option v-for="l in lineData" :label="l.Description" :value="l.MfgLineName" />
          </el-select>
        </el-form-item>
        <el-form-item label="计划类型" prop="SelectType">
          <el-select v-model="editForm.SelectType" placeholder="计划类型" :clearble="false" style="width: 100px" :disabled="editForm.WorkStatus!='其他'"
            @change="changeLevel">
            <el-option v-for="l in levelOneList" :label="l.CalendarSelectType_Name"
              :value="l.CalendarSelectType_Name" />
          </el-select>
          <el-select v-model="editForm.SelectType2" placeholder="" :clearble="false" style="width: 100px" :disabled="editForm.WorkStatus!='其他'"
            class="ml-[20px]">
            <el-option v-for="l in levelTwoList" :label="l.CalendarSelectType_Name"
              :value="l.CalendarSelectType_Name" />
          </el-select>
        </el-form-item>

        <el-form-item label="描述" prop="PlanDescription">
          <el-input v-model="editForm.PlanDescription" style="width: 220px">
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="danger" @click="deletePlan">删除</el-button>
          <el-button type="primary" @click="editPlan"> 修改 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  GetMESWorkLineNews,
  GetWorkLineCalendarAndPlan,
  AddUpdateHostCalendar,
  AddCalendarPlan,
  GetWorkLineCalendarSelectTypeLevelOne,
  GetWorkLineCalendarSelectTypeLevelTwo,
  DeleteCalendarPlan,
  SelectCalendarPlan,
  UpdateCalendarPlan
} from "@/api/Scheduling/lineCalendar";
import { ElNotification, ElMessageBox } from "element-plus";
import { ref, nextTick, onMounted, reactive, computed } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { parseDateString } from "@/utils/dataMenu";
import { CalendarDataType } from "@/typing";
import dayjs from "dayjs";
const userStore = useUserStoreWithOut();
const fullcalendar = ref();
const Tcalendar = ref();
const viewType = ref("timeGridWeek");
const calendarApi = ref();
const calendarTitle = ref("");
const calendarLine = ref("M08-SMT-Line-01");
interface GetForm {
  WorkLineName: Array<any>;
  SelectStartDate: string;
  SelectEndDate: string;
}
const getForm = ref<GetForm>({
  WorkLineName: [],
  SelectStartDate: "",
  SelectEndDate: "",
});
const lineData = ref<any[]>([]);

const dataSelet = ref<InstanceType<typeof CalendarDataType>[]>([
  {
    title: "白班",
    start: "2026-05-21 08:00:00",
    end: "2026-05-21 20:00:00",
    allDay: false,
    shift: "day", // 自定义属性，表示白班
    dataID: 1234234,
    color: "#000000", // 可以设置事件颜色（可选）
    backgroundColor: "#67C23A", // 背景颜色（可选）
    borderColor: "#529b2e", // 边框颜色（可选）
  },
  {
    title: "保养",
    start: "2026-05-21 09:30:00",
    end: "2026-05-21 10:30:00",
    allDay: false,
    shift: "repair", // 自定义属性，表示夜班
    color: "#000000", // 可以设置事件颜色（可选）
    backgroundColor: "#E6A23C", // 背景颜色（可选）
    borderColor: "#b88230", // 边框颜色（可选）
  },
  {
    title: "夜班",
    start: "2026-05-21 20:00:00",
    end: "2026-05-22 08:00:00",
    allDay: false,
    shift: "night", // 自定义属性，表示夜班
    color: "#000000", // 可以设置事件颜色（可选）
    backgroundColor: "#409EFF", // 背景颜色（可选）
    borderColor: "#337ecc", // 边框颜色（可选）
  },
   {
    title: "停机",
    start: "2026-05-21 11:30:00",
    end: "2026-05-21 12:30:00",
    allDay: false,
    shift: "stop", // 自定义属性，表示夜班
    color: "#000000", // 可以设置事件颜色（可选）
    backgroundColor: "#F56C6C", // 背景颜色（可选）
    borderColor: "#c45656", // 边框颜色（可选）
  },
]);
const drawer = ref(false);
interface Classtime {
  ClassType: string;
  ClassStartTime: string;
  ClassEndTime: string;
}
interface FormData {
  WorkLineName: string;
  StartDate: string;
  LongDate: string | number;
  ClassType: string;
  ClassStartTime: string;
  ClassEndTime: string;
  UserNo: string;
  classtime: Array<Classtime>;
}
const formData = ref<FormData>({
  WorkLineName: "",
  StartDate: "",
  LongDate: "",
  ClassType: "白班",
  ClassStartTime: "",
  ClassEndTime: "",
  classtime: [
    {
      ClassType: "白班",
      ClassStartTime: "",
      ClassEndTime: "",
    },
    {
      ClassType: "夜班",
      ClassStartTime: "",
      ClassEndTime: "",
    },
  ],
  UserNo: userStore.getUserInfo,
});
const formRef = ref();
const planFormRef = ref();
const planForm = ref({
  WorkLine: "",
  PlanName: "",
  PlanDate: "",
  StartTime: "",
  TimeLong: "",
  WorkStatus: "其他",
  SelectType: "",
  SelectType2: "",
  PlanDescription: "",
  UserNo: userStore.getUserInfo,
});
const secondDrawer = ref(false);
const levelOneList = ref<any[]>([]);
const levelTwoList = ref<any[]>([]);
const levelName = ref("");
const planVisible = ref(false)
const editForm = ref<any>({
  PlanId: "",
  WorkLine: "",
  PlanName: "",
  PlanDate: "",
  StartTime: "",
  TimeLong: "",
  WorkStatus: "其他",
  SelectType: "",
  SelectType2: "",
  PlanDescription: "",
  UserNo: "",
})

const eventClickData = (val: any) => {

  let data = val.event._def.extendedProps
  if (data.Calendar_Type == "日程计划") {

    // editForm.value.TimeLong = dayjs(data.Calendary_End).diff(
    //   data.Calendar_Start,
    //   "hours"
    // );
    SelectCalendarPlan({ PlanId: data.Calendar_PlanId }).then((res: any) => {
      console.log(res);
      editForm.value = {
        PlanId: data.Calendar_PlanId,
        WorkLine: res.content[0].CalendarHead_ProductLine,
        PlanName: data.Calendar_Name,
        PlanDate: res.content[0].CalendarPlan_SelectDate,
        StartTime: res.content[0].CalendarPlan_SelectTime,
        TimeLong: res.content[0].CalendarPlan_TimeLong,
        WorkStatus: res.content[0].CalendarPlan_StatusType,
        SelectType: res.content[0].CalendarPlan_SelectType,
        SelectType2: res.content[0].CalendarPlan_SelectType2,
        PlanDescription: res.content[0].CalendarPlan_Description,
        UserNo: userStore.getUserInfo,
      }

    })
    GetWorkLineCalendarSelectTypeLevelOne({
      SelectType: "",
      UserNo: "",
    }).then((res: any) => {
      levelOneList.value = res.content;
    });
    planVisible.value = true
  }

};
const deletePlan = () => {
  ElMessageBox.confirm("确定删除", "确认操作", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      DeleteCalendarPlan({ PlanId: editForm.value.PlanId }).then((res: any) => {
        if (res.success) {
          ElNotification({
            title: "提示信息",
            message: res.msg,
            type: "success",
          });
          editForm.value = {
            PlanId: "",
            WorkLine: "",
            PlanName: "",
            PlanDate: "",
            StartTime: "",
            TimeLong: "",
            WorkStatus: "其他",
            SelectType: "",
            SelectType2: "",
            PlanDescription: "",
            UserNo: "",
          }
          planVisible.value = false
          getData()
        }
      })
    })
    .catch(() => {
      // ElMessage({
      //   type: "info",
      //   message: "取消操作",
      // });
      ElNotification({
        title: "提示信息",
        message: "取消操作",
        type: "info",
      });
    });
}
const editPlan = () => {
  UpdateCalendarPlan(editForm.value).then((res: any) => {
    if (res.success) {
      ElNotification({
        title: "提示信息",
        message: res.msg,
        type: "success",
      });
      editForm.value = {
        PlanId: "",
        WorkLine: "",
        PlanName: "",
        PlanDate: "",
        StartTime: "",
        TimeLong: "",
        WorkStatus: "",
        SelectType: "",
        SelectType2: "",
        PlanDescription: "",
        UserNo: "",
      }
      planVisible.value = false
      getData()
    }
  })
}
const calendarOptions = reactive({
  height: "100%",
  plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
  initialView: "timeGridWeek", // 默认为那个视图（月：dayGridMonth，周：timeGridWeek，日：timeGridDay）
  weekends: true, // 显示周末
  headerToolbar: true, //是否隐藏默认工具栏
  // navLinks: true,//日期是否可以被点击
  dayMaxEvents: 4, // 最大事件数
  firstDay: 1, // 设置一周中显示的第一天是哪天，周日是0，周一是1，类推  new Date().getDay()当前天
  locale: "zh-cn", // 切换语言，当前为中文
  allDaySlot: false,
  unselectAuto: false, //当点击页⾯⽇历以外的位置时，是否⾃动取消当前的选中状态。false是不取消
  selectable: true, //是否可以选中日历格
  dayCellClassNames: "month-day-cell", //单元格类名
  nowIndicator: true, //是否显示时间线
  // slotEventOverlap:false,
  // slotMinutes:0,
  slotDuration: '01:00',
  displayEventTime: false,
  
  // headerToolbar: {
  //   left: 'prev next',
  //   center: 'title',
  //   right: 'today'
  // },
  buttonText: { today: "今天", month: "月", week: "周", day: "日" },
  eventOverlap: false, // 允许事件叠堆
  events: computed(() => dataSelet.value),
  // datesSet: (arg:any) => {
  //   const start = dayjs(arg.start).format("YYYY-MM-DD");
  //   const end = dayjs(arg.end).format("YYYY-MM-DD");
  //   getForm.value.SelectStartDate = start;
  //   getForm.value.SelectEndDate = end;
  //   // getLineData();
  // },
  eventClick: eventClickData,
});
onMounted(() => {
  nextTick(() => {
    calendarApi.value = fullcalendar.value.getApi();
    calendarTitle.value = calendarApi.value.view.title;
    const [startDate, endDate] = parseDateString(calendarTitle.value);
    getForm.value.SelectStartDate = startDate;
    getForm.value.SelectEndDate = endDate;
    getLineData();
    // getData()
  });
});

const getData = () => {
  GetWorkLineCalendarAndPlan(getForm.value).then((res: any) => {
    // console.log(res);

    // const dataArr = [
    //   {
    //     title: "吃饭休息",
    //     start: "2025-02-07 08:30:00",
    //     end: "2025-02-07 17:30:00",
    //     allDay: false,
    //     shift: "day", // 自定义属性，表示白班
    //     color: "#FFFFFF", // 可以设置事件颜色（可选）
    //     backgroundColor: "#333", // 背景颜色（可选）
    //     borderColor: "#000000", // 边框颜色（可选）
    //   },
    // ];
    dataSelet.value = [];
    dataSelet.value = res.content.map((item: any) => {
      if (item.Calendar_Name == "白班") {
        return {
          ...item,
          title: item.Calendar_Name,
          start: item.Calendar_Start,
          end: item.Calendary_End,
          // color: "#000000", // 可以设置事件颜色（可选）
          // backgroundColor: "#006487", // 背景颜色（可选）
          // borderColor: "#000000", // 边框颜色（可选）
        };
      } else if (item.Calendar_Name == "夜班") {
        return {
          ...item,
          title: item.Calendar_Name,
          start: item.Calendar_Start,
          end: item.Calendary_End,
          shift: "night", // 自定义属性，表示夜班
          color: "#000000", // 可以设置事件颜色（可选）
          backgroundColor: "#094b8e", // 背景颜色（可选）
          borderColor: "#000000", // 边框颜色（可选）
        };
      } else {
        return {
          ...item,
          title: item.Calendar_Name,
          start: item.Calendar_Start,
          end: item.Calendary_End,
          shift: "repair", // 自定义属性，表示夜班
          color: "#000000", // 可以设置事件颜色（可选）
          backgroundColor: "#ffcd50", // 背景颜色（可选）
          borderColor: "#000000", // 边框颜色（可选）
        };
      }
    });

    updateCalendar();
  });
};
// const getData = async () => {
//   try {
//     const res: any = await GetWorkLineCalendarAndPlan(getForm.value);
//     const dataArr = [
//       {
//         title: "吃饭休息",
//         start: "2025-02-07 11:30:00",
//         end: "2025-02-07 13:00:00",
//         allDay: false,
//         shift: "day", // 自定义属性，表示白班
//         color: "#FFFFFF", // 可以设置事件颜色（可选）
//         backgroundColor: "#333", // 背景颜色（可选）
//         borderColor: "#000000", // 边框颜色（可选）
//       }
//     ]
//     dataSelet.value=[]
//     dataSelet.value = dataArr.map((event: any) => {
//       return event
//     });

//     updateCalendar()
//   } catch (error) {
//     console.error("数据加载失败:", error);
//   }
// };
const getPrev = () => {
  calendarApi.value.prev();
  calendarTitle.value = calendarApi.value.view.title;
  changeTerm();
};
const getNext = () => {
  calendarApi.value.next();
  calendarTitle.value = calendarApi.value.view.title;
  changeTerm();
};
const getLineData = () => {
  GetMESWorkLineNews({ WorkLineName: "" }).then((res: any) => {
    lineData.value = res.Data;
    calendarLine.value = res.Data[0].MfgLineName;
    // console.log(res.Data[0].MfgLineName);
    getForm.value.WorkLineName[0] = res.Data[0].MfgLineName;
    // getData();
  });
};
const changeLine = (val: any) => {
  getForm.value.WorkLineName[0] = calendarLine.value;
  changeTerm();
};
const openAdd = () => {
  formData.value.WorkLineName = calendarLine.value;
  formData.value.StartDate = dayjs(new Date()).format("YYYY-MM-DD");
  const today = new Date(formData.value.StartDate);
  formData.value.LongDate = dayjs(`${today.getFullYear()}-12-31`).diff(
    formData.value.StartDate,
    "day"
  );
  drawer.value = true;
};
//添加主日程
const onSubmit = () => {
  // console.log(formData.value);

  AddUpdateHostCalendar(formData.value).then((res: any) => {

    if (res.success) {
      ElNotification({
        title: "提示信息",
        message: res.msg,
        type: "success",
      });
      formRef.value.resetFields();
      getData();
      formData.value.classtime[0].ClassStartTime = "";
      formData.value.classtime[1].ClassStartTime = "";
      formData.value.classtime[0].ClassEndTime = "";
      formData.value.classtime[1].ClassEndTime = "";
      drawer.value = false;
    }
  });
};
const handleClose = () => {
  drawer.value = false;
  formData.value.classtime[0].ClassStartTime = "";
  formData.value.classtime[1].ClassStartTime = "";
  formData.value.classtime[0].ClassEndTime = "";
  formData.value.classtime[1].ClassEndTime = "";
  formRef.value.resetFields();
};

const openShith = () => {
  planForm.value.WorkLine = calendarLine.value;
  planForm.value.WorkStatus = "其他"
  planForm.value.PlanDate = dayjs(new Date()).format("YYYY-MM-DD");
   GetWorkLineCalendarSelectTypeLevelOne({
    SelectType: "",
    UserNo: "",
  }).then((res: any) => {
    levelOneList.value = res.content;
  });
  secondDrawer.value = true;
};
const changeLevel = (val: any) => {
  // console.log(val);
  levelTwoList.value = [];
  // const onelevel = levelOneList.value.find(
  //   (item: any) => item.CalendarSelectType_Guid == val
  // );
  // console.log(onelevel.CalendarSelectType_Name);
  GetWorkLineCalendarSelectTypeLevelTwo({
    SelectType: val,
    SelectType2: "",
    UserNo: "",
  }).then((res: any) => {
    // console.log(res);
    levelTwoList.value = res.content;
  });
};
//次日程
const secondClose = () => {
  planForm.value.SelectType2 = "";
  planForm.value.SelectType = "";
  planFormRef.value.resetFields();
  secondDrawer.value = false;
};
//次日程
const onSubmitSecond = () => {
  console.log(planForm.value);
  AddCalendarPlan(planForm.value).then((res: any) => {
    if (res.success) {
      getData();
      ElNotification({
        title: "提示信息",
        message: res.msg,
        type: "success",
      });
      planForm.value.SelectType2 = "";
      planForm.value.SelectType = "";
      planFormRef.value.resetFields();
      secondDrawer.value = false;

    }

  });
};

const handleChangeType = (val: any) => {
  // console.log(calendarApi.value.view.title);
  calendarApi.value.changeView(val);
  calendarTitle.value = calendarApi.value.view.title;
  changeTerm();
};
const changeTerm = () => {
  const [startDate, endDate] = parseDateString(calendarTitle.value);
  getForm.value.SelectStartDate = startDate;
  getForm.value.SelectEndDate = endDate;
  getData();
};

const updateCalendar = () => {
  nextTick(() => {
    if (fullcalendar.value) {
      calendarApi.value.refetchEvents();
    }
  });
};
const changeDate = () => {
  // console.log(formData.value.StartDate);
  const today = new Date(formData.value.StartDate);
  formData.value.LongDate = dayjs(`${today.getFullYear()}-12-31`).diff(
    formData.value.StartDate,
    "day"
  );
};
</script>

<style scoped></style>
