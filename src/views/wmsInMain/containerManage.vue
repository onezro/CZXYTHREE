<template>
  <div class="p-2">
    <el-card class="box-card" :body-style="{ padding: '8px' }">
      <el-form :inline="true" :model="getlistText" class="mb-2" @submit.prevent>
        <el-form-item :label="t('wmsInMain.containerManage.pn')">
          <el-input v-model="getlistText.Pn" :placeholder="t('wmsInMain.containerManage.pn')" clearable
            style="width: 160px" size="small" @keyup.enter="handleSearch" @clear="handleSearch" />
        </el-form-item>
        <el-form-item :label="t('wmsInMain.containerManage.wo')">
          <el-input v-model="getlistText.Wo" :placeholder="t('wmsInMain.containerManage.wo')" clearable
            style="width: 160px" size="small" @keyup.enter="handleSearch" @clear="handleSearch" />
        </el-form-item>
        <el-form-item :label="t('wmsInMain.containerManage.searchPlaceholder')">
          <el-input v-model="getlistText.SearchText" :placeholder="t('wmsInMain.containerManage.searchPlaceholder')"
            clearable style="width: 160px" size="small" @keyup.enter="handleSearch" @clear="handleSearch" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="handleSearch">{{ t("publicText.query") }}</el-button>
          <el-button size="small" @click="resetSearch">{{ t("publicText.reset") }}</el-button>
          <el-button type="warning" size="small" @click="openAdd">{{ t("wmsInMain.containerManage.add") }}</el-button>
        </el-form-item>
      </el-form>
      <div class="table_container">
        <el-table ref="tableRef" :data="tableData" :height="tableHeight" border stripe style="width: 100%" size="small"
          highlight-current-row
          :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }">
          <el-table-column :label="t('publicText.index')" width="55" align="center" fixed="left">
            <template #default="scope">
              <span>{{
                scope.$index + 1 + (getlistText.PageIndex - 1) * getlistText.PageSize
                }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="containerid" :label="t('wmsInMain.containerManage.containerId')"
            :min-width="getColumnWidth('containerid')" show-overflow-tooltip fixed="left">
           
          </el-table-column>
          <el-table-column prop="containername" :label="t('wmsInMain.containerManage.containerName')"
            :min-width="getColumnWidth('containername')" show-overflow-tooltip fixed="left">
            
          </el-table-column>
          <el-table-column prop="spec" :label="t('wmsInMain.containerManage.spec')"
            :min-width="getColumnWidth('spec')" show-overflow-tooltip>
          
          </el-table-column>
          <el-table-column prop="pn" :label="t('wmsInMain.containerManage.pn')"
            :min-width="getColumnWidth('pn')" show-overflow-tooltip>
            
          </el-table-column>
          <el-table-column prop="qty" :label="t('wmsInMain.containerManage.qty')" align="center"
            :min-width="getColumnWidth('qty')">
           
          </el-table-column>
          <el-table-column prop="cellno" :label="t('wmsInMain.containerManage.cellNo')"
            :min-width="getColumnWidth('cellno')" show-overflow-tooltip>
          
          </el-table-column>
          <el-table-column prop="remarks" :label="t('wmsInMain.containerManage.remarks')"
            :min-width="getColumnWidth('remarks')" show-overflow-tooltip>
          
          </el-table-column>
          <el-table-column prop="capacity" :label="t('wmsInMain.containerManage.maxCapacity')"
            :min-width="getColumnWidth('capacity')" align="center">
           
          </el-table-column>
          <el-table-column prop="stts" :label="t('wmsInMain.containerManage.status')" align="center"
            :min-width="getColumnWidth('stts')">
            <template #default="{ row }">
              <el-tag v-if="row.stts === -1" type="danger" size="small">
                {{ t('wmsInMain.containerManage.invalid') }}
              </el-tag>
              <el-tag v-else-if="row.stts === 0" type="info" size="small">
                {{ t('wmsInMain.containerManage.unused') }}
              </el-tag>
              <el-tag v-else-if="row.stts === 1" type="success" size="small">
                {{ t('wmsInMain.containerManage.inUse') }}
              </el-tag>
              <span v-else>{{ row.stts ?? "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="Wo" :label="t('wmsInMain.containerManage.wo')"
            :min-width="getColumnWidth('Wo')" show-overflow-tooltip>
           
          </el-table-column>
          <el-table-column prop="Side" :label="t('wmsInMain.containerManage.side')" align="center"
            :min-width="getColumnWidth('Side')">
           
          </el-table-column>
          <el-table-column prop="Lock_no" :label="t('wmsInMain.containerManage.lockNo')"
            :min-width="getColumnWidth('Lock_no')" show-overflow-tooltip>
           
          </el-table-column>
          <el-table-column prop="producetype" :label="t('wmsInMain.containerManage.produceType')" align="center"
            :min-width="getColumnWidth('producetype')">
           
          </el-table-column>
          <el-table-column prop="maxusenum" :label="t('wmsInMain.containerManage.maxUseNum')" align="center"
            :min-width="getColumnWidth('maxusenum')">
            
          </el-table-column>
          <el-table-column prop="usednum" :label="t('wmsInMain.containerManage.usedNum')" align="center"
            :min-width="getColumnWidth('usednum')">
           
          </el-table-column>
          <el-table-column prop="exfactorydate" :label="t('wmsInMain.containerManage.exFactoryDate')"
            :min-width="getColumnWidth('exfactorydate')">
            <template #default="{ row }">
              {{ formatDate(row.exfactorydate) }}
            </template>
          </el-table-column>
          <el-table-column prop="checkresult" :label="t('wmsInMain.containerManage.checkResult')"
            :min-width="getColumnWidth('checkresult')" show-overflow-tooltip>
           
          </el-table-column>
          <el-table-column prop="pointno" :label="t('wmsInMain.containerManage.pointNo')"
            :min-width="getColumnWidth('pointno')" show-overflow-tooltip>
          
          </el-table-column>
          <el-table-column prop="updatetime" :label="t('wmsInMain.containerManage.updateTime')"
            :min-width="getColumnWidth('updatetime')">
            <template #default="{ row }">
              {{ formatDate(row.updatetime) }}
            </template>
          </el-table-column>
          <el-table-column prop="updateuser" :label="t('wmsInMain.containerManage.updateUser')"
            :min-width="getColumnWidth('updateuser')" show-overflow-tooltip>
          
          </el-table-column>
          <el-table-column fixed="right" :label="t('publicText.operation')" width="160" align="center">
            <template #default="{ row }">
              <el-button type="primary" icon="Edit" size="small"
                @click="handleEdit(row)"></el-button>
              <el-button type="warning" icon="Clock" size="small"
                @click="handleHistory(row)"></el-button>
              <el-button type="danger" icon="Delete" size="small"
                @click="handleDelete(row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="margin-top: 8px">
          <el-pagination size="small" background align="center" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" :current-page="getlistText.PageIndex" :page-size="getlistText.PageSize"
            :page-sizes="[5, 10, 20, 50, 100]" layout="total, sizes, prev, pager, next" :total="total">
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
const tableHeight = ref(0);
const hosity = ref<any[]>([]);

const getlistText = reactive({
  PageIndex: 1,
  PageSize: 50,
  SearchText: "",
  Pn: "",
  Wo: "",
});

const rules = {
  containerid: [
    {
      required: true,
      message: t("wmsInMain.containerManage.containerIdRequired"),
      trigger: "blur",
    },
  ],
  containername: [
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
  producetype: [
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

const formatDate = (dateStr: string) => {
  if (!dateStr || dateStr === "1900-01-01T00:00:00") return "-";
  const d = dayjs(dateStr);
  return d.isValid() ? d.format("YYYY-MM-DD HH:mm:ss") : (dateStr ?? "-");
};

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
      if (res.Success) {
        total.value = res.Data?.Total || 0;
        tableData.value = res.Data?.list || [];
      } else {
        ElMessage.error(res.Msg || t("message.queryFailure"));
        tableData.value = [];
        total.value = 0;
      }
    })
    .catch(() => {
      tableData.value = [];
      total.value = 0;
    });
};

const openAdd = () => {
  Object.assign(form, {
    containerid: "",
    containername: "",
    spec: "",
    pn: "",
    qty: "",
    cellno: "",
    capacity: "",
    stts: "",
    producetype: "",
    maxusenum: "",
    usednum: "",
    updatetime: "",
    updateuser: "",
    createtime: "",
    createuser: "",
    exfactorydate: "",
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

const handleEdit = (row: any) => {
  show.value = true;
  formDataPro(row);
  dialogVisible.value = true;
};

const handleHistory = (row: any) => {
  dialogTableVisible.value = true;
  hosity.value = [];
  getHistoy(row.containerid).then((res: any) => {
    const a = JSON.parse(res.Data);
    hosity.value = a.list || [];
  });
};

const handleDelete = (row: any) => {
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
      deleteContainer({ containerid: row.containerid }).then(() => {
        if (tableData.value.length == 1 && getlistText.PageIndex > 1) {
          getlistText.PageIndex--;
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
  const isExit = tableData.value.find((item) => item.containerid == value);
  if (value && isExit != undefined) {
    formDataPro(isExit);
  } else {
    const emptyForm = {
      containerid: "",
      containername: "",
      spec: "",
      pn: "",
      qty: 0,
      cellno: "",
      capacity: "",
      stts: 0,
      producetype: "",
      maxusenum: "",
      usednum: 0,
      updatetime: "",
      updateuser: "",
      createtime: "",
      createuser: "",
      exfactorydate: "",
    };
    formDataPro(emptyForm as any);
    form.containerid = value;
  }
};

const formDataPro = (row: any) => {
  Object.assign(form, {
    containerid: row.containerid,
    containername: row.containername,
    spec: row.spec,
    pn: row.pn,
    qty: row.qty,
    cellno: row.cellno,
    capacity: row.capacity,
    stts: row.stts,
    producetype: row.producetype,
    maxusenum: row.maxusenum,
    usednum: row.usednum,
    updatetime: row.updatetime,
    updateuser: row.updateuser,
    createtime: row.createtime,
    createuser: row.createuser,
    exfactorydate: row.exfactorydate,
  });
};

const handleSearch = () => {
  getlistText.PageIndex = 1;
  getData();
};

const resetSearch = () => {
  getlistText.Pn = "";
  getlistText.Wo = "";
  getlistText.SearchText = "";
  getlistText.PageIndex = 1;
  getData();
};

const handleSizeChange = (value: number) => {
  getlistText.PageSize = value;
  getlistText.PageIndex = 1;
  getData();
};

const handleCurrentChange = (value: number) => {
  getlistText.PageIndex = value;
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
