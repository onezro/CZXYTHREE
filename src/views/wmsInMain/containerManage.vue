<template>
  <div class="p-2">
    <el-card class="box-card" :body-style="{ padding: '8px' }">
      <div class="flex justify-between items-center mb-2">
        <el-button type="primary" @click="openAdd()" size="small">{{
          t("wmsInMain.containerManage.add")
          }}</el-button>
        <div class="input_box">
          <el-input :placeholder="t('wmsInMain.containerManage.searchPlaceholder')" clearable size="small"
            v-model="getlistText.searchText" class="input-with-select" @input="getSearchData" @change="getSearchData">
            <template #append>
              <el-button icon="Search"></el-button>
            </template>
          </el-input>
        </div>
      </div>
      <div class="table_container">
        <el-table ref="tableRef" :data="tableData" :height="tableHeight" border stripe style="width: 100%" size="small">
          <el-table-column :label="t('publicText.index')" width="55" align="center">
            <template #default="scope">
              <span>{{
                scope.$index + 1 + (currentPage - 1) * getlistText.pageSize
                }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="containerid" :label="t('wmsInMain.containerManage.containerId')"
            :min-width="getColumnWidth('containerid')">
          </el-table-column>
          <el-table-column prop="containername" :label="t('wmsInMain.containerManage.containerName')"
            :min-width="getColumnWidth('containername')">
          </el-table-column>
          <el-table-column prop="spec" :label="t('wmsInMain.containerManage.spec')" :min-width="getColumnWidth('spec')">
          </el-table-column>
          <el-table-column prop="capacity" :label="t('wmsInMain.containerManage.maxCapacity')"
            :min-width="getColumnWidth('capacity')">
          </el-table-column>
          <el-table-column prop="producetype" :label="t('wmsInMain.containerManage.produceType')"
            :min-width="getColumnWidth('producetype')">
          </el-table-column>
          <el-table-column prop="maxusenum" :label="t('wmsInMain.containerManage.maxUseNum')"
            :min-width="getColumnWidth('maxusenum')">
          </el-table-column>
          <el-table-column prop="exfactorydate" :label="t('wmsInMain.containerManage.exFactoryDate')" width="180">
          </el-table-column>
          <el-table-column fixed="right" :label="t('publicText.operation')" width="200" align="center">
            <template #default="scope">
              <el-button type="primary" icon="Edit" size="small"
                @click="handleEdit(scope.$index, scope.row)"></el-button>
              <el-button type="warning" icon="Clock" size="small"
                @click="handleHistory(scope.$index, scope.row)"></el-button>
              <el-button type="danger" icon="Delete" size="small"
                @click="handleDelete(scope.$index, scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="margin-top: 8px">
          <el-pagination size="small" background align="center" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" :current-page="currentPage" :page-size="getlistText.pageSize"
            :page-sizes="[5, 10, 20, 50, 100]" layout="total,sizes, prev, pager, next" :total="total">
          </el-pagination>
        </div>
      </div>
    </el-card>

    <!-- 添加弹窗 -->
    <el-dialog :title="t('wmsInMain.containerManage.addTitle')" @close="addCancel()" v-model="dialogVisible"
      width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item :label="t('wmsInMain.containerManage.containerId')" prop="containerid">
          <el-input :disabled="show" v-model="form.containerid"
            :placeholder="t('wmsInMain.containerManage.containerId')"></el-input>
        </el-form-item>
        <el-form-item :label="t('wmsInMain.containerManage.containerName')" prop="containername">
          <el-input v-model="form.containername" :placeholder="t('wmsInMain.containerManage.containerName')"></el-input>
        </el-form-item>
        <el-form-item :label="t('wmsInMain.containerManage.spec')" prop="spec">
          <el-input type="textarea" v-model="form.spec" :placeholder="t('wmsInMain.containerManage.spec')"></el-input>
        </el-form-item>
        <el-form-item :label="t('wmsInMain.containerManage.maxCapacity')" prop="capacity">
          <el-input v-model="form.capacity" :placeholder="t('wmsInMain.containerManage.maxCapacity')"></el-input>
        </el-form-item>
        <el-form-item :label="t('wmsInMain.containerManage.produceType')" prop="producetype">
          <el-select v-model="form.producetype" :placeholder="t('wmsInMain.containerManage.produceType')">
            <el-option v-for="item in lineList" :key="item.lineType" :label="item.lineType"
              :value="item.lineType"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="t('wmsInMain.containerManage.maxUseNum')" prop="maxusenum">
          <el-input v-model="form.maxusenum" :placeholder="t('wmsInMain.containerManage.maxUseNum')"></el-input>
        </el-form-item>
        <el-form-item :label="t('wmsInMain.containerManage.exFactoryDate')" prop="exFactoryDate">
          <el-date-picker type="datetime" :placeholder="t('wmsInMain.containerManage.selectDate')"
            format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss"
            v-model="form.exfactorydate"></el-date-picker>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addCancel()">{{
            t("publicText.cancel")
            }}</el-button>
          <el-button type="primary" @click="onSubmit()">{{
            t("publicText.confirm")
            }}</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 历史记录弹窗 -->
    <el-dialog :title="t('wmsInMain.containerManage.historyTitle')" width="65%" v-model="dialogTableVisible">
      <el-table :data="hosity.slice(
        (hositycurrentPage - 1) * hositypageSize,
        hositycurrentPage * hositypageSize,
      )
        " border style="width: 100%" size="small">
        <el-table-column prop="RecordDt" :label="t('wmsInMain.containerManage.operationTime')" width="160">
        </el-table-column>
        <el-table-column prop="MaterialId" :label="t('wmsInMain.containerManage.containerId')" width="80">
        </el-table-column>
        <el-table-column prop="Pn" :label="t('wmsInMain.containerManage.pn')" width="130">
        </el-table-column>
        <el-table-column prop="PnName" :label="t('wmsInMain.containerManage.name')">
        </el-table-column>
        <el-table-column prop="PnSpec" :label="t('wmsInMain.containerManage.spec')">
        </el-table-column>
        <el-table-column prop="Qty" :label="t('wmsInMain.containerManage.qty')" width="80">
        </el-table-column>
        <el-table-column prop="Descript" :label="t('wmsInMain.containerManage.operationEvent')">
        </el-table-column>
        <el-table-column prop="UpdateUserId" :label="t('wmsInMain.containerManage.operator')" width="80">
        </el-table-column>
      </el-table>
      <div class="block" style="margin-top: 8px">
        <el-pagination size="small" align="center" @current-change="hosityhandleCurrentChange"
          :current-page="hositycurrentPage" :page-size="hositypageSize" layout="total, prev, pager, next"
          :total="hosity.length">
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  queryPageContainer,
  saveContainer,
  deleteContainer,
  getHistoy,
} from "@/api/wmsInMain/index";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import { useI18n } from "vue-i18n";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  ref,
  reactive,
  onMounted,
  onBeforeMount,
  onUnmounted,
  nextTick,
  watch,
} from "vue";
import dayjs from "dayjs";

const { t } = useI18n();
const userStore = useUserStoreWithOut();

const tableRef = ref();
const formRef = ref();

const dialogVisible = ref(false);
const show = ref(false);
const dialogTableVisible = ref(false);
const hositycurrentPage = ref(1);
const hositypageSize = ref(5);

const lineList = [{ lineType: "SMT" }, { lineType: "组装" }];

const form = reactive({
  containerid: "",
  containername: "",
  spec: "",
  pn: "",
  qty: 0,
  cellno: "",
  remarks: "",
  capacity: "",
  stts: 0,
  Wo: "",
  Side: "",
  Lock_no: "",
  producetype: "",
  maxusenum: 0,
  usednum: 0,
  updatetime: "",
  updateuser: "",
  createtime: "",
  createuser: "",
  exfactorydate: "",
  checkresult: "",
});

const tableData = ref<any[]>([]);
const total = ref(0);
const currentPage = ref(1);
const tableHeight = ref(0);
const hosity = ref<any[]>([]);

const getlistText = reactive({
  pageIndex: 0,
  pageSize: 50,
  searchText: "",
});

const rules = {
  containerid: [
    {
      required: true,
      message: t("wmsInMain.containerManage.containerIdRequired"),
      trigger: "blur",
    },
  ],
  containerName: [
    {
      required: true,
      message: t("wmsInMain.containerManage.containerNameRequired"),
      trigger: "change",
    },
  ],
  capacity: [
    {
      required: true,
      message: t("wmsInMain.containerManage.capacityRequired"),
      trigger: "change",
    },
  ],
  produceType: [
    {
      required: true,
      message: t("wmsInMain.containerManage.produceTypeRequired"),
      trigger: "change",
    },
  ],
};

const { getColumnWidth } = useTableColumnWidth(tableRef, tableData, {
  excludeLabels: [t("publicText.index"), t("publicText.operation")],
});

// 监听 containerid 变化
watch(
  () => form.containerid,
  (value) => {
    inputValue(value);
  },
);

const getData = () => {
  queryPageContainer(getlistText)
    .then((res: any) => {
      const a = JSON.parse(res.Data);
      console.log(a);
      total.value = a.Total;
      tableData.value = a.list || [];
    })
    .catch(() => { });
};

const openAdd = () => {
  Object.assign(form, {
    containerid: "",
    containerName: "",
    spec: "",
    pn: "",
    qty: "",
    cellNo: "",
    capacity: "",
    stts: "",
    produceType: "",
    maxuseNum: "",
    usedNum: "",
    updateTime: "",
    updateUser: "",
    createTime: "",
    createUser: "",
    exFactoryDate: "",
  });
  show.value = false;
  dialogVisible.value = true;
};

const onSubmit = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (!form.createtime) {
        form.createtime = dayjs().format("YYYY-MM-DD HH:mm:ss");
        form.createuser = userStore.getUserInfo || "";
      }
      form.updateuser = userStore.getUserInfo || "";
      form.updatetime = dayjs().format("YYYY-MM-DD HH:mm:ss");

      saveContainer(form)
        .then((res: any) => {
          if (res.Success) {
            dialogVisible.value = false;
            show.value = false;
            getData();
            ElMessage.success(t("wmsInMain.containerManage.saveSuccess"));
            formRef.value?.resetFields();
          } else {
            ElMessage.error(res.Msg);
          }
        })
        .catch(() => { });
    } else {
      ElMessageBox.alert(
        t("wmsInMain.containerManage.completeRequired"),
        t("publicText.error"),
        {
          confirmButtonText: t("publicText.confirm"),
        },
      );
    }
  });
};

const addCancel = () => {
  dialogVisible.value = false;
  formRef.value?.resetFields();
};

const handleEdit = (index: number, row: any) => {
  show.value = true;
  formDataPro(row);
  dialogVisible.value = true;
};

const handleHistory = (index: number, row: any) => {
  dialogTableVisible.value = true;
  hosity.value = [];
  getHistoy(row.Containerid).then((res: any) => {
    const a = JSON.parse(res.Data);
    hosity.value = a.list || [];
  });
};

const handleDelete = (index: number, row: any) => {
  ElMessageBox.confirm(
    t("wmsInMain.containerManage.deleteConfirm"),
    t("publicText.confirmOperation"),
    {
      confirmButtonText: t("publicText.confirm"),
      cancelButtonText: t("publicText.cancel"),
      type: "warning",
    },
  )
    .then(() => {
      deleteContainer({ Containerid: row.Containerid }).then(() => {
        if (tableData.value.length == 1 && getlistText.pageIndex >= 0) {
          getlistText.pageIndex--;
        }
        getData();
        ElMessage.success(t("wmsInMain.containerManage.deleteSuccess"));
      });
    })
    .catch(() => {
      ElMessage.info(t("wmsInMain.containerManage.deleteCancelled"));
    });
};

const inputValue = (value: string) => {
  const isExit = tableData.value.find((item) => item.Containerid == value);
  if (value && isExit != undefined) {
    formDataPro(isExit);
  } else {
    const emptyForm = {
      containerid: "",
      containerName: "",
      spec: "",
      pn: "",
      qty: 0,
      cellNo: "",
      capacity: "",
      stts: 0,
      produceType: "",
      maxuseNum: "",
      usedNum: 0,
      updateTime: "",
      updateUser: "",
      createTime: "",
      createUser: "",
      exFactoryDate: "",
    };
    formDataPro(emptyForm as any);
    form.containerid = value;
  }
};

const formDataPro = (row: any) => {
  Object.assign(form, {
    containerid: row.Containerid,
    containerName: row.ContainerName,
    spec: row.Spec,
    pn: row.Pn,
    qty: row.Qty,
    cellNo: row.CellNo,
    capacity: row.Capacity,
    stts: row.Stts,
    produceType: row.ProduceType,
    maxuseNum: row.MaxuseNum,
    usedNum: row.UsedNum,
    updateTime: row.UpdateTime,
    updateUser: row.UpdateUser,
    createTime: row.CreateTime,
    createUser: row.CreateUser,
    exFactoryDate: row.ExFactoryDate,
  });
};

const getSearchData = () => {
  getlistText.pageIndex = 0;
  getData();
};

const handleSizeChange = (value: number) => {
  getlistText.pageSize = value;
  getData();
};

const handleCurrentChange = (value: number) => {
  currentPage.value = value;
  getlistText.pageIndex = value - 1;
  getData();
};

const hosityhandleCurrentChange = (currentPage: number) => {
  hositycurrentPage.value = currentPage;
};

const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 190;
  });
};

onBeforeMount(() => {
  getScreenHeight();
});

onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  getData();
});

onUnmounted(() => {
  window.removeEventListener("resize", getScreenHeight);
});
</script>

<style lang="scss" scoped>
.el-pagination {
  justify-content: center;
}
</style>
