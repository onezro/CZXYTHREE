<template>
  <div class="inboundRecord">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div class="table_header">
        <div class="input_box">
          <el-input
            :placeholder="t('finishProduct.inboundRecord.searchPlaceholder')"
            clearable
            v-model="getText.searchText"
            class="input-with-select"
            @input="getSearchData"
            @change="getSearchData"
          >
            <template #append>
              <el-button size="small" icon="Search"></el-button>
            </template>
          </el-input>
        </div>
      </div>
      <div class="table_container">
        <el-table
          ref="tableRef"
          :data="tableData"
          :height="tableHeight"
          border
          stripe
          :size="innerHeight < 750 ? 'small' : 'default'"
          @row-click="handle"
          class="tableAuto"
          style="width: 100%"
        >
          <el-table-column prop="wo" :label="t('finishProduct.inboundRecord.workOrder')" :min-width="getColumnWidth('wo')">
          </el-table-column>
          <el-table-column prop="productid" :label="t('finishProduct.inboundRecord.productCode')" :min-width="getColumnWidth('productid')">
          </el-table-column>
          <el-table-column prop="wonum" :label="t('finishProduct.inboundRecord.workOrderQty')" :min-width="getColumnWidth('wonum')">
          </el-table-column>
          <el-table-column prop="goodnum" :label="t('finishProduct.inboundRecord.goodQty')" :min-width="getColumnWidth('goodnum')">
          </el-table-column>
          <el-table-column prop="brokennum" :label="t('finishProduct.inboundRecord.brokenQty')" :min-width="getColumnWidth('brokennum')">
          </el-table-column>
          <el-table-column prop="updateuser" :label="t('finishProduct.inboundRecord.updater')" :min-width="getColumnWidth('updateuser')">
          </el-table-column>
          <el-table-column prop="erpmsg" :label="t('finishProduct.inboundRecord.erpMsg')" :min-width="getColumnWidth('erpmsg')">
          </el-table-column>
          <el-table-column :label="t('publicText.operation')" align="center" width="250" fixed="right">
            <template #default="scope">
              <el-button type="warning" size="small" @click.stop="handleUpload(scope.$index, scope.row)">
                {{ t('finishProduct.inboundRecord.uploadHours') }}
              </el-button>
              <el-button type="primary" size="small" @click.stop="handleCreate(scope.$index, scope.row)">
                {{ t('finishProduct.inboundRecord.erpInbound') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="margin-top: 8px">
          <el-pagination
            background
            size="small"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[5, 10, 20, 50, 100]"
            :current-page="currentPage"
            :page-size="getText.pageSize"
            layout="total,sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
      <div class="box">
        <el-table
          ref="tableRef2"
          :data="tableData2"
          :height="tableHeight1"
          border
          stripe
          :size="innerHeight < 750 ? 'small' : 'default'"
          @row-click="handle1"
          class="tableAuto"
          style="width: 100%"
        >
          <el-table-column prop="Wo" :label="t('finishProduct.inboundRecord.workOrder')" :min-width="getColumnWidth2('Wo')">
          </el-table-column>
          <el-table-column prop="Pn" :label="t('finishProduct.inboundRecord.productCode')" :min-width="getColumnWidth2('Pn')">
          </el-table-column>
          <el-table-column prop="Name" :label="t('finishProduct.inboundRecord.productName')" :min-width="getColumnWidth2('Name')">
          </el-table-column>
          <el-table-column prop="Rid" :label="t('finishProduct.inboundRecord.containerId')" :min-width="getColumnWidth2('Rid')">
          </el-table-column>
          <el-table-column prop="Qty" :label="t('finishProduct.inboundRecord.fixedQty')" width="100">
          </el-table-column>
          <el-table-column prop="PackQty" :label="t('finishProduct.inboundRecord.actualQty')" width="100">
          </el-table-column>
          <el-table-column prop="BoxType" :label="t('finishProduct.inboundRecord.boxType')" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.BoxType == 1 ? 'info' : ''">
                {{ scope.row.BoxType == 1 ? t('finishProduct.inboundRecord.looseBox') : t('finishProduct.inboundRecord.fullBox') }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="Result" :label="t('finishProduct.inboundRecord.result')" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.Result == 'PASS' ? 'success' : 'danger'">
                {{ scope.row.Result == 'PASS' ? t('finishProduct.inboundRecord.good') : t('finishProduct.inboundRecord.bad') }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="PackUser" :label="t('finishProduct.inboundRecord.operator')" width="100">
          </el-table-column>
          <el-table-column prop="PackTime" :label="t('finishProduct.inboundRecord.packTime')" :min-width="getColumnWidth2('PackTime')">
          </el-table-column>
          <el-table-column prop="ErpgsTime" :label="t('finishProduct.inboundRecord.erpHoursUploadTime')" :min-width="getColumnWidth2('ErpgsTime')">
          </el-table-column>
          <el-table-column prop="Erpgs" :label="t('finishProduct.inboundRecord.erpHoursMsg')" :min-width="getColumnWidth2('Erpgs')">
            <template #default="scope">
              <div>{{ scope.row.Erpgs == '200' ? t('finishProduct.inboundRecord.success') : scope.row.Erpgs }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="Erprk" :label="t('finishProduct.inboundRecord.erpInboundMsg')" :min-width="getColumnWidth2('Erprk')">
            <template #default="scope">
              <div>{{ scope.row.Erprk == '200' ? t('finishProduct.inboundRecord.success') : scope.row.Erprk }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="ErprkTime" :label="t('finishProduct.inboundRecord.erpInboundUploadTime')" :min-width="getColumnWidth2('ErprkTime')">
          </el-table-column>
          <el-table-column prop="Erpuid" :label="t('finishProduct.inboundRecord.erpUploadUid')" :min-width="getColumnWidth2('Erpuid')">
          </el-table-column>
        </el-table>
      </div>
      <el-dialog
        :title="t('finishProduct.inboundRecord.dialogTitle')"
        v-model="dialogTableVisible"
        width="60%"
      >
        <el-table :data="tableData1" max-height="300" border stripe class="tableAuto" style="width: 100%">
          <el-table-column prop="Rid" :label="t('finishProduct.inboundRecord.containerId')"> </el-table-column>
          <el-table-column prop="PcbSn" :label="t('finishProduct.inboundRecord.pcbaCode')"> </el-table-column>
          <el-table-column prop="CreUser" :label="t('finishProduct.inboundRecord.operator')"> </el-table-column>
          <el-table-column prop="CreTime" sortable :label="t('finishProduct.inboundRecord.time')">
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import {
  getIntactJobBooking,
  getPackPage,
  getPackBind,
  uploadWareHousing,
  uploadWorkingHours,
} from "@/api/finishProduct/inboundRecord";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import { useI18n } from "vue-i18n";
import { ElMessage, ElMessageBox, ElLoading } from "element-plus";
import { ref, reactive, onMounted, onBeforeMount, onUnmounted, nextTick } from "vue";
import { useUserStoreWithOut } from "@/stores/modules/user";
import dayjs from "dayjs";

const { t } = useI18n();
const userStore = useUserStoreWithOut();
const tableRef = ref();
const tableRef2 = ref();

const getText = reactive({
  pageIndex: 0,
  pageSize: 10,
  searchText: "",
  SearchModel: {},
});

const getRecordText = reactive({
  PageIndex: 0,
  PageSize: 10,
  SearchText: "",
  SearchModel: "",
});

const tableData = ref<any[]>([]);
const tableData2 = ref<any[]>([]);
const tableData1 = ref<any[]>([]);
const currentPage = ref(1);
const currentPage2 = ref(1);
const total = ref(0);
const total2 = ref(0);
const tableHeight = ref(0);
const tableHeight1 = ref(0);
const innerHeight = ref(window.innerHeight);
const dialogTableVisible = ref(false);

const { getColumnWidth } = useTableColumnWidth(tableRef, tableData, {
  excludeLabels: [t("publicText.operation")],
});

const { getColumnWidth: getColumnWidth2 } = useTableColumnWidth(tableRef2, tableData2, {
  excludeLabels: [],
});

const getData = () => {
  getIntactJobBooking(getText).then((res: any) => {
    if (res.data.Code == 200) {
      const data = res.data.Data;
      total.value = data.Total;
      tableData.value = data.list.sort((a: any, b: any) => {
        const dateA:any = new Date(a.updatetime);
        const dateB:any = new Date(b.updatetime);
        return dateA - dateB;
      });
    } else {
      ElMessageBox.alert(res.data.Msg, t("message.error"), {
        confirmButtonText: t("publicText.confirm"),
      });
    }
  });
};

const getSearchData = () => {
  getText.pageIndex = 0;
  getData();
};

const handleSizeChange = (value: number) => {
  getText.pageSize = value;
  getData();
};

const handleCurrentChange = (value: number) => {
  getText.pageIndex = value - 1;
  getData();
};

const handleSizeChange1 = (value: number) => {
  getRecordText.PageSize = value;
  loadPackPage();
};

const handleCurrentChange1 = (value: number) => {
  getRecordText.PageIndex = value - 1;
  loadPackPage();
};

const loadPackPage = () => {
  getPackPage(getRecordText).then((res: any) => {
    if (res.data.Code == 200) {
      const data = JSON.parse(res.data.Data);
      total2.value = data.Total;
      tableData2.value = data.list;
    } else {
      ElMessageBox.alert(res.data.Msg, t("message.error"), {
        confirmButtonText: t("publicText.confirm"),
      });
    }
  });
};

const startLoading = () => {
  return ElLoading.service({
    lock: true,
    text: "Loading...",
    background: "rgba(0, 0, 0, 0.2)",
  });
};

const handleCreate = (_index: number, row: any) => {
  const loading = startLoading();
  uploadWareHousing({
    Wo: row.wo,
    UpdateUser:  userStore.getUserInfo,
    UpdateTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  }).then((res: any) => {
    if (res.data.Code == 200) {
      getData();
      tableData2.value = [];
      ElMessage.success(t("finishProduct.inboundRecord.uploadSuccess"));
    } else {
      ElMessageBox.alert(res.data.Msg, t("message.error"), {
        confirmButtonText: t("publicText.confirm"),
      });
    }
    loading.close();
  });
};

const handleUpload = (_index: number, row: any) => {
  const loading = startLoading();
  uploadWorkingHours({
    Wo: row.wo,
    UpdateUser:  userStore.getUserInfo,
    UpdateTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  }).then((res: any) => {
    if (res.data.Code == 200) {
      getData();
      tableData2.value = [];
      ElMessage.success(t("finishProduct.inboundRecord.uploadSuccess"));
    } else {
      ElMessageBox.alert(res.data.Msg, t("message.error"), {
        confirmButtonText: t("publicText.confirm"),
      });
    }
    loading.close();
  });
};

const handle = (row: any) => {
  getRecordText.SearchText = row.wo;
  loadPackPage();
};

const handle1 = (row: any) => {
  const text = {
    Wo: row.Wo,
    Rid: row.Rid,
    Pn: row.Pn,
    Reuslt: row.Reuslt,
  };
  getPackBind(text).then((res: any) => {
    if (res.data.Code == 200) {
      dialogTableVisible.value = true;
      const data = JSON.parse(res.data.Data);
      tableData1.value = data;
    } else {
      ElMessageBox.alert(res.data.Msg, t("message.error"), {
        confirmButtonText: t("publicText.confirm"),
      });
    }
  });
};

const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = (window.innerHeight - 140 - 55) * 0.6;
    tableHeight1.value = (window.innerHeight - 140 - 55) * 0.4;
    innerHeight.value = window.innerHeight;
  });
};

onBeforeMount(() => {
  getScreenHeight();
});

onMounted(() => {
  getData();
  window.addEventListener("resize", getScreenHeight);
});

onUnmounted(() => {
  window.removeEventListener("resize", getScreenHeight);
});
</script>

<style lang="scss" scoped>
.inboundRecord {
  padding: 8px;

  .table_header {
    padding-bottom: 8px;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .input_box {
      width: 400px;
    }
  }

  .box {
    margin-top: 8px;
  }
}
</style>
