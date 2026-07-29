<template>
  <div class="assemblePicke">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div class="table_container">
        <el-table
          ref="tableRef"
          :data="tableData"
          :height="tableHeight"
          border
          size="small"
          stripe
          @row-click="handle"
          style="width: 100%"
        >
          <el-table-column prop="Sht" :label="t('assemble.assemblePicke.pickId')" align="center" :min-width="getColumnWidth('Sht')">
          </el-table-column>
          <el-table-column prop="WO" :label="t('assemble.assemblePicke.workOrder')" align="center" :min-width="getColumnWidth('WO')">
          </el-table-column>
          <el-table-column prop="Line" :label="t('assemble.assemblePicke.line')" align="center" :min-width="getColumnWidth('Line')">
            <template #default="scope">
              <span>{{ scope.row.erp_wo_info?.Line }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="PD_dsc" :label="t('assemble.assemblePicke.productDesc')" align="center" :min-width="getColumnWidth('PD_dsc')">
          </el-table-column>
          <el-table-column prop="ChkoutShtId" :label="t('assemble.assemblePicke.planQty')" align="center" :min-width="getColumnWidth('ChkoutShtId')">
            <template #default="scope">
              <span>{{ scope.row.erp_wo_info?.Plan_qty }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="chkout_cnt" :label="t('assemble.assemblePicke.chkoutCnt')" align="center" :min-width="getColumnWidth('chkout_cnt')">
          </el-table-column>
          <el-table-column prop="chkout_pct" :label="t('assemble.assemblePicke.chkoutPct')" align="center" :min-width="getColumnWidth('chkout_pct')">
          </el-table-column>
          <el-table-column prop="rechk_cnt" :label="t('assemble.assemblePicke.rechkCnt')" align="center" :min-width="getColumnWidth('rechk_cnt')">
          </el-table-column>
          <el-table-column prop="rechk_pct" :label="t('assemble.assemblePicke.rechkPct')" align="center" :min-width="getColumnWidth('rechk_pct')">
          </el-table-column>
          <el-table-column prop="Stts" :label="t('assemble.assemblePicke.status')" align="center" :min-width="getColumnWidth('Stts')">
            <template #default="scope">
              <el-tag size="small" :color="statusColor(scope.row.Stts)" :type="statusStyle(scope.row.Stts)">
                {{ statusText(scope.row.Stts) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="Dsc" :label="t('assemble.assemblePicke.remark')" :min-width="getColumnWidth('Dsc')"> </el-table-column>
          <el-table-column prop="Crt_usr" :label="t('assemble.assemblePicke.lastOperator')" :min-width="getColumnWidth('Crt_usr')"> </el-table-column>
          <el-table-column prop="Crt_dt" :label="t('assemble.assemblePicke.lastTime')" :min-width="getColumnWidth('Crt_dt')"> </el-table-column>
          <el-table-column prop="return_msg" :label="t('assemble.assemblePicke.returnMsg')" :min-width="getColumnWidth('return_msg')">
          </el-table-column>
          <el-table-column fixed="right" :label="t('publicText.operation')" align="center" width="180">
            <template #default="scope">
              <el-tooltip effect="dark" :content="t('assemble.assemblePicke.lock')" placement="top-start">
                <el-button plain type="primary" size="small" icon="Lock" @click.stop="handleCreate(scope.$index, scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" :content="t('assemble.assemblePicke.void')" placement="top-start">
                <el-button plain type="info" size="small" icon="DocumentDelete" @click.stop="handleCreate(scope.$index, scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" :content="t('assemble.assemblePicke.complete')" placement="top-start">
                <el-button plain type="success" size="small" icon="CircleCheck" @click.stop="handleCreate(scope.$index, scope.row)"></el-button>
              </el-tooltip>
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
        <el-tabs v-model="activeName">
          <el-tab-pane :label="t('assemble.assemblePicke.pickStatus')" name="first">
            <el-table
              :data="tableData1"
              :height="tableHeight1"
              border
              stripe
              size="small"
              style="width: 100%"
            >
              <el-table-column prop="PN" :label="t('assemble.assemblePicke.pn')"> </el-table-column>
              <el-table-column prop="Group_id" :label="t('assemble.assemblePicke.groupId')"> </el-table-column>
              <el-table-column prop="Pn" :label="t('assemble.assemblePicke.spec')">
                <template #default="scope">
                  <span>{{ scope.row.PnInfo?.pn_spec }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="Dsc" :label="t('assemble.assemblePicke.level')">
                <template #default="scope">
                  <span>{{ scope.row.PnInfo?.Lv }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="Plan_qty" :label="t('assemble.assemblePicke.planQty')">
              </el-table-column>
              <el-table-column prop="Act_qty" :label="t('assemble.assemblePicke.actQty')"> </el-table-column>
              <el-table-column prop="Extra_qty" :label="t('assemble.assemblePicke.extraQty')">
              </el-table-column>
              <el-table-column prop="Dsc" :label="t('assemble.assemblePicke.remark')"> </el-table-column>
              <el-table-column prop="Stts" :label="t('assemble.assemblePicke.status')"> </el-table-column>
              <el-table-column prop="Qty" :label="t('assemble.assemblePicke.pendingQty')"> </el-table-column>
              <el-table-column prop="www" :label="t('assemble.assemblePicke.issueQty')"> </el-table-column>
              <el-table-column prop="www" :label="t('assemble.assemblePicke.pendingSplitQty')"> </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane :label="t('assemble.assemblePicke.issueDetail')" name="second">
            <el-table
              :data="tableData2"
              :height="tableHeight1"
              border
              stripe
              size="small"
              style="width: 100%"
            >
              <el-table-column prop="Sht" :label="t('assemble.assemblePicke.pickId')"> </el-table-column>
              <el-table-column prop="Material" :label="t('assemble.assemblePicke.materialId')"> </el-table-column>
              <el-table-column prop="PN" :label="t('assemble.assemblePicke.pn')"> </el-table-column>
              <el-table-column prop="Group_id" :label="t('assemble.assemblePicke.groupId')"> </el-table-column>
              <el-table-column prop="" :label="t('assemble.assemblePicke.spec')">
                <template #default="scope">
                  <span>{{ scope.row.PnInfo?.pn_spec }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="Dsc" :label="t('assemble.assemblePicke.desc')">
                <template #default="scope">
                  <span>{{ scope.row.PnInfo?.pn_dsc }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="Qty" :label="t('assemble.assemblePicke.qty')"> </el-table-column>
              <el-table-column prop="Crt_dt" :label="t('assemble.assemblePicke.productionDate')">
                <template #default="scope">
                  <span>{{ scope.row.MaterInfo?.DateCode }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="" :label="t('assemble.assemblePicke.batch')">
                <template #default="scope">
                  <span>{{ scope.row.MaterInfo?.Batch }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="Cell_id" :label="t('assemble.assemblePicke.cellId')"> </el-table-column>
              <el-table-column prop="vendor" :label="t('assemble.assemblePicke.vendor')">
                <template #default="scope">
                  <span>{{ scope.row.MaterInfo?.Vendor }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="Stts" :label="t('assemble.assemblePicke.reviewStatus')">
                <template #default="scope">
                  <span>{{ scope.row.Stts == 1 ? t('assemble.assemblePicke.pending') : t('assemble.assemblePicke.reviewed') }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="Ud_dt" :label="t('assemble.assemblePicke.updateTime')">
              </el-table-column>
              <el-table-column prop="Ud_usr" :label="t('assemble.assemblePicke.updateUser')"> </el-table-column>
              <el-table-column prop="" :label="t('assemble.assemblePicke.remark')"> </el-table-column>
              <el-table-column prop="Crt_dt" :label="t('assemble.assemblePicke.pickTime')"> </el-table-column>
              <el-table-column prop="" :label="t('assemble.assemblePicke.reviewTime')"> </el-table-column>
              <el-table-column prop="return_msg" :label="t('assemble.assemblePicke.returnMsg')">
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { getChkOutShtPage, getChkOutShtItemDetail, getChkOutShtListDetail, batching } from "@/api/assemble/assemblePicke";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
import { ref, reactive, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useRoute } from "vue-router";
import dayjs from "dayjs";

const { t } = useI18n();
const userStore = useUserStoreWithOut();
const route = useRoute();

const tableRef = ref();
const tableData = ref<any[]>([]);
const currentPage = ref(1);
const total = ref(0);
const tableHeight = ref(0);
const tableHeight1 = ref(0);
const tableData1 = ref<any[]>([]);
const tableData2 = ref<any[]>([]);
const innerHeight = ref(window.innerHeight);
const activeName = ref("first");

const getText = reactive({
  pageIndex: 0,
  pageSize: 10,
  searchText: "",
});

const { getColumnWidth } = useTableColumnWidth(tableRef, tableData, {
  excludeLabels: [t("publicText.operation")],
});

const getData = () => {
  getChkOutShtPage(getText).then((res: any) => {
    if (res.Success) {
      let data = res.Data;
      total.value = data.Total;
      tableData.value = data.list;
    } else {
      ElMessage.error(res.Msg);
    }
  });
};

const handleCreate = (index: number, row: any) => {
  let text = {
    Sht: row.Sht,
    WO: row.WO,
    Ud_usr: userStore.getUserInfo || "",
    Ud_dt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  };
  batching(text).then((res: any) => {
    if (res.Success) {
      ElMessage.success(t("publicText.success"));
      getData();
      handle(row);
    } else {
      ElMessage.error(res.Msg);
    }
  });
};

const handleSizeChange = (value: number) => {
  getText.pageSize = value;
  getData();
};

const handleCurrentChange = (value: number) => {
  getText.pageIndex = value - 1;
  getData();
};

const statusText = (status: number) => {
  switch (status) {
    case 0:
      return t("assemble.assemblePicke.statusCalc");
    case 1:
      return t("assemble.assemblePicke.statusLocked");
    case 2:
      return t("assemble.assemblePicke.statusPicking");
    case 3:
      return t("assemble.assemblePicke.statusPendingReview");
    case 4:
      return t("assemble.assemblePicke.statusDone");
    case 99:
      return t("assemble.assemblePicke.statusComplete");
    default:
      return "";
  }
};

const statusStyle = (status: number) => {
  switch (status) {
    case 0:
      return "info";
    case 1:
      return "";
    case 2:
      return "warning";
    case 3:
      return "danger";
    case 4:
      return "";
    case 99:
      return "success";
    default:
      return "";
  }
};

const statusColor = (status: number) => {
  switch (status) {
    case 4:
      return "#FE5E08";
    default:
      return "";
  }
};

const handle = (row: any) => {
  getChkOutShtItemDetail(row).then((res: any) => {
    if (res.Success) {
      tableData1.value = res.Data;
    } else {
      ElMessage.error(res.Msg);
    }
  });
  getChkOutShtListDetail(row).then((res: any) => {
    if (res.Success) {
      tableData2.value = res.Data;
    } else {
      ElMessage.error(res.Msg);
    }
  });
};

const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = (window.innerHeight - 210) * 0.6;
    tableHeight1.value = (window.innerHeight - 210) * 0.4;
  });
};

onMounted(() => {
  getText.searchText = (route.params.id as string) || "";
  getData();
  getScreenHeight();
  window.addEventListener("resize", () => {
    innerHeight.value = window.innerHeight;
    getScreenHeight();
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", () => {
    innerHeight.value = window.innerHeight;
    getScreenHeight();
  });
});
</script>

<style lang="scss" scoped>
.assemblePicke {
  padding: 8px;

  .box {
    margin-top: 8px;
  }
}
</style>
