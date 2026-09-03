<template>
  <div class="p-[10px]">
    <el-card shadow="always" :body-style="{ padding: '10px' }">
      <div>
        <el-form ref="formRef" class="form flex justify-between" :inline="true" :model="getDataText">
          <div>
            <!-- <el-form> -->
            <el-form-item class="flex items-center">
              <el-input size="default" placeholder="请输入板边码" clearable v-model="getDataText.SN"
                class="input-with-select">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-select v-model="getDataText.OperationType" placeholder="操作类型" style="width: 120px">
                <el-option v-for="item in repairList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getData()">查询</el-button>
            </el-form-item>
            <!-- </el-form> -->
          </div>
          <el-form-item>
            <el-button type="primary" @click="historyTableVisible = true">维修记录</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table_container">
        <el-table :data="tableData.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        )
          " border :height="tableHeight" row-key="step1" style="width: 100%"
          :tree-props="{ children: 'stepItemList' }">
          <el-table-column prop="BarCode" label="SN条码" width="180">
          </el-table-column>
          <el-table-column prop="PadID" label="PadID"> </el-table-column>
          <el-table-column prop="Result" label="原因"> </el-table-column>
          <el-table-column prop="Remark" label="操作">
            <template #default="scope">
              <el-button type="primary" @click="maintenance(scope.row)">维修</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="margin-top: 15px">
          <el-pagination align="center" background @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="currentPage" :page-size="pageSize" :page-sizes="[5, 10, 20, 50, 100]"
            layout="total,sizes, prev, pager, next, jumper" :total="tableData.length">
          </el-pagination>
        </div>
      </div>
    </el-card>
    <el-dialog v-model="dialogTableVisible" title="维修" width="1000">
      <el-form :model="maintenanceForm" :rules="rules" :inline="true" ref="ruleFormRef">
        <el-row>
          <el-col :span="6">
            <el-form-item label="内控SN" label-width="100px" prop="InternalSN">
              <el-input size="default" v-model="maintenanceForm.InternalSN" class="input-with-select">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="生产计划号" label-width="100px" prop="WorkOrderNumber">
              <el-input size="default" v-model="maintenanceForm.WorkOrderNumber" class="input-with-select">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="维修类别" label-width="100px" prop="RepairType">
              <el-select v-model="maintenanceForm.RepairType" placeholder="Select" style="width: 120px">
                <el-option v-for="item in ['测试']" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="100px" label="不良原因" prop="RepairReason">
              <el-select v-model="maintenanceForm.RepairReason" placeholder="Select" style="width: 120px">
                <el-option v-for="item in ['测试']" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider />
        <el-form-item label="当前SN" label-width="100px">
          <el-input size="default" v-model="maintenanceForm.CurrentBarcode" class="input-with-select">
          </el-input>
        </el-form-item>
        <el-form-item label="面别" label-width="100px">
          <el-select v-model="maintenanceForm.FaceType" placeholder="Select" style="width: 180px">
            <el-option v-for="item in ['Top', 'Bot']" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单号" label-width="100px">
          <el-input size="default" v-model="maintenanceForm.OrderNo" class="input-with-select">
          </el-input>
        </el-form-item>
        <el-form-item label="计划编号" label-width="100px">
          <el-input size="default" v-model="maintenanceForm.PlanNumber" class="input-with-select">
          </el-input>
        </el-form-item>
        <el-form-item label="客户名称" label-width="100px">
          <el-input size="default" v-model="maintenanceForm.CustomerName" class="input-with-select">
          </el-input>
        </el-form-item>
        <el-form-item label="产品描述" label-width="100px">
          <el-input size="default" v-model="maintenanceForm.ProductName" class="input-with-select">
          </el-input>
        </el-form-item>
        <el-form-item label="工序名称" label-width="100px">
          <el-input size="default" v-model="maintenanceForm.Processes" class="input-with-select">
          </el-input>
        </el-form-item>
        <el-form-item label="工序编码" label-width="100px">
          <el-input size="default" v-model="maintenanceForm.ProcessesNumber" class="input-with-select">
          </el-input>
        </el-form-item>
        <el-form-item label="拉线名称" label-width="100px">
          <el-input size="default" v-model="maintenanceForm.StayWireName" class="input-with-select">
          </el-input>
        </el-form-item>
        <el-form-item label="拉线编码" label-width="100px">
          <el-input size="default" v-model="maintenanceForm.StayWireNumber" class="input-with-select">
          </el-input>
        </el-form-item>
        <el-form-item label="返修工序" label-width="100px">
          <el-input size="default" v-model="maintenanceForm.RepairProcesses" class="input-with-select">
          </el-input>
        </el-form-item>
        <el-form-item label="返修工序编码" label-width="100px">
          <el-input size="default" v-model="maintenanceForm.RepairProcessesNumber" class="input-with-select">
          </el-input>
        </el-form-item>
        <el-form-item label-width="100px" label="维修备注" style="width: calc(100% - 70px)">
          <el-input v-model="maintenanceForm.Repairlnformation" :rows="2" type="textarea" placeholder="请输入" />
        </el-form-item>
        <!-- <el-form-item label="订单号"> </el-form-item>
        <el-form-item label="计划编号"> </el-form-item>
        <el-form-item label="客户名称"> </el-form-item>
        <el-form-item label="产品描述"> </el-form-item>
        <el-form-item label="工序名称"> </el-form-item>
        <el-form-item label="工序编号"> </el-form-item>
        <el-form-item label="拉线名称"> </el-form-item>
        <el-form-item label="拉线编码"> </el-form-item>
        <el-form-item label="返修工序"> </el-form-item>
        <el-form-item label="返修工序编号"> </el-form-item>
        <el-form-item label="维修备注"> </el-form-item>
        <el-form-item label="维修类别"> </el-form-item>
        <el-form-item label="不良原因"> </el-form-item>
        <el-form-item label="面别"> </el-form-item> -->
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogTableVisible = false">取消</el-button>
          <el-button type="primary" @click="sureMaintenance(ruleFormRef)">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="historyTableVisible" title="查询返修维修记录" width="1000" align-center>
      <el-form :inline="true">
        <el-form-item>
          <el-input size="default" placeholder="请输入内控SN" clearable v-model="getHistoryText.InternalSN"
            class="input-with-select">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input size="default" placeholder="请输入位号" clearable v-model="getHistoryText.Position"
            class="input-with-select">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getHistory()">查询</el-button>
        </el-form-item>
      </el-form>
      <table-tem :showIndex="true" :tableData="historyTable" :tableHeight="'60vh'" :columnData="columnData"
        :pageObj="pageObj1" @handleSizeChange="handleSizeChange1"
        @handleCurrentChange="handleCurrentChange1"></table-tem>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { getCheckResults } from "@/api/operate";
import type { InspectionResult } from "@/typing";
import { ElMessageBox, ElMessage, ElLoading } from "element-plus";
import tableTem from "@/components/tableTem/index.vue";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { QuerySN, MaintenanceAdd, QueryMaintenance } from "@/api/smtApi";
import {
  ref,
  reactive,
  watch,
  nextTick,
  onMounted,
  onBeforeMount,
  onBeforeUnmount,
} from "vue";
const tableData = ref<any>([]);
const historyTable = ref<any>([]);
const pageSize = ref(10);
const currentPage = ref(1);
const tableHeight = ref(0);
const ruleFormRef = ref();
const OperationType = ref("");
const userStore = useUserStoreWithOut();
const loginName = userStore.getUserInfo;
const getDataText = reactive({
  SN: "",
  OperationType: "",
});
const getHistoryText = reactive({
  InternalSN: "",
  Position: "",
});
const dialogTableVisible = ref(false);
const historyTableVisible = ref(false);
const repairList = ref([
  {
    label: "SPI",
    value: "SPI",
  },
  {
    label: "AOI",
    value: "AOI",
  },
  {
    label: "AOII",
    value: "AOII",
  },
]);

const columnData = reactive([
  {
    text: true,
    prop: "InternalSN",
    label: "内控SN",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "CurrentBarcode",
    label: "当前SN",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "WorkOrderNumber",
    label: "生产计划号",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "RepairReason",
    label: "不良原因",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "RepairType",
    label: "维修类别",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "Repairlnformation",
    label: "维修备注",
    width: "",
    min: true,
    align: "1",
  },
]);

interface RuleForm {
  FaceType: string;
  InternalSN: string;
  CurrentBarcode: string;
  WorkOrderNumber: string;
  OrderNo: string;
  PlanNumber: string;
  CustomerName: string;
  ProductName: string;
  Processes: string;
  ProcessesNumber: string;
  StayWireName: string;
  StayWireNumber: string;
  RepairProcesses: string;
  RepairProcessesNumber: string;
  Repairlnformation: string;
  RepairType: string;
  RepairReason: string;
  UpdateUser: string;
  OperationType: string;
  Position: string;
}

const maintenanceForm = ref<RuleForm>({
  FaceType: "",
  InternalSN: "",
  CurrentBarcode: "",
  WorkOrderNumber: "",
  OrderNo: "",
  PlanNumber: "",
  CustomerName: "",
  ProductName: "",
  Processes: "",
  ProcessesNumber: "",
  StayWireName: "",
  StayWireNumber: "",
  RepairProcesses: "",
  RepairProcessesNumber: "",
  Repairlnformation: "",
  RepairType: "",
  RepairReason: "",
  UpdateUser: loginName,
  OperationType: "",
  Position: "",
});

// watch(

// );
onBeforeMount(() => {
  getScreenHeight();
});

onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

const getData = () => {
  if (getDataText.SN === "" || getDataText.OperationType === "") {
    ElMessage({
      message: "条码或操作类型不能为空",
      type: "warning",
    });
    return;
  }
  QuerySN(getDataText.SN, getDataText.OperationType).then((res: any) => {
    if (!res || res.content === null || res.content.length === 0) {
      tableData.value = [];
      return;
    }
    OperationType.value = getDataText.OperationType;
    // const dataText = JSON.parse(res.content);
    tableData.value = res.content;
  });
};

const maintenance = (row: any) => {
  // maintenanceForm.value.InternalSN = row.BarCode;
  maintenanceForm.value.OperationType = OperationType.value;
  maintenanceForm.value.Position = row.PadID;
  dialogTableVisible.value = true;
};

const sureMaintenance = (formEl: any) => {
  if (!formEl) return;
  formEl.validate((valid: any, fields: any) => {
    if (valid) {
      dialogTableVisible.value = false;
      MaintenanceAdd(maintenanceForm.value).then((res: any) => {
        if (!res || res.content === null || res.content.length === 0) {
          tableData.value = [];
          return;
        }
        getData();
        ElMessage({
          message: res.msg,
          type: "success",
        });
        maintenanceForm.value = {
          FaceType: "",
          InternalSN: "",
          CurrentBarcode: "",
          WorkOrderNumber: "",
          OrderNo: "",
          PlanNumber: "",
          CustomerName: "",
          ProductName: "",
          Processes: "",
          ProcessesNumber: "",
          StayWireName: "",
          StayWireNumber: "",
          RepairProcesses: "",
          RepairProcessesNumber: "",
          Repairlnformation: "",
          RepairType: "",
          RepairReason: "",
          UpdateUser: loginName,
          OperationType: "",
          Position: "",
        };
      });
    } else {
      ElMessage({
        message: "请输入必要信息",
        type: "warning",
      });
      console.log("error submit!", fields);
    }
  });
};

const getHistory = () => {
  if (
    getHistoryText.InternalSN === ""
  ) {
    ElMessage({
      message: "内控SN不能为空",
      type: "warning",
    });
    return;
  }
  QueryMaintenance(
    getHistoryText.InternalSN,
    getHistoryText.Position
  ).then((res: any) => {
    if (!res || res.content === null || res.content.length === 0) {
      tableData.value = [];
      return;
    }
    // const dataText = JSON.parse(res.content);
    historyTable.value = res.content;
  });
};

const handleSizeChange = (val: any) => {
  currentPage.value = 1;
  pageSize.value = val;
};
const handleCurrentChange = (val: any) => {
  currentPage.value = val;
};

const pageObj1 = ref({
  pageSize: 100,
  currentPage: 1,
});

const handleSizeChange1 = (val: any) => {
  pageObj1.value.currentPage = 1;
  pageObj1.value.pageSize = val;
};
const handleCurrentChange1 = (val: any) => {
  pageObj1.value.currentPage = val;
};

const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 230;
  });
};

//表单验证
const rules = reactive({
  InternalSN: [{ required: true, message: "不允许为空", trigger: "blur" }],
  WorkOrderNumber: [{ required: true, message: "不允许为空", trigger: "blur" }],
  RepairType: [{ required: true, message: "不允许为空", trigger: "blur" }],
  RepairReason: [{ required: true, message: "不允许为空", trigger: "change" }],
});
</script>

<style lang="scss" scoped></style>
<style scoped>
.el-pagination {
  justify-content: center;
}
</style>
