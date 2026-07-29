<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div class="table_container">
        <el-table ref="tableRef" :data="tableData" :height="tableHeight" border
          size="small" stripe @row-click="handle" style="width: 100%">
          <el-table-column prop="Issue_type" :label="t('assemble.assembleIssue.docType')"
            :min-width="getColumnWidth('Issue_type')"> </el-table-column>
          <el-table-column prop="Line" :label="t('assemble.assembleIssue.line')" :min-width="getColumnWidth('Line')">
          </el-table-column>
          <el-table-column prop="wo_group" :label="t('assemble.assembleIssue.woGroup')"
            :min-width="getColumnWidth('wo_group')"> </el-table-column>
          <el-table-column prop="PD_model" :label="t('assemble.assembleIssue.productModel')"
            :min-width="getColumnWidth('PD_model')"> </el-table-column>
          <el-table-column prop="WO" :label="t('assemble.assembleIssue.workOrder')" :min-width="getColumnWidth('WO')">
          </el-table-column>
          <el-table-column prop="Issue_id" :label="t('assemble.assembleIssue.issueId')"
            :min-width="getColumnWidth('Issue_id')"> </el-table-column>
          <el-table-column prop="Chkout_sht_id" :label="t('assemble.assembleIssue.chkoutId')"
            :min-width="getColumnWidth('Chkout_sht_id')"> </el-table-column>
          <el-table-column prop="Stts" :label="t('assemble.assembleIssue.status')" :min-width="getColumnWidth('Stts')">
            <template #default="scope">
              <el-tag size="small" :type="statusStyle(scope.row.Stts)">{{ statusText(scope.row.Stts) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="Plan_qty" :label="t('assemble.assembleIssue.planQty')"
            :min-width="getColumnWidth('Plan_qty')">
          </el-table-column>
          <el-table-column prop="Dsc" :label="t('assemble.assembleIssue.desc')" :min-width="getColumnWidth('Dsc')">
          </el-table-column>
          <el-table-column prop="blreason" :label="t('assemble.assembleIssue.blReason')"
            :min-width="getColumnWidth('blreason')">
          </el-table-column>
          <el-table-column prop="auditStatus" :label="t('assemble.assembleIssue.auditStatus')"
            :min-width="getColumnWidth('auditStatus')">
            <template #default="scope">
              <el-tag v-if="scope.row.auditStatus != null && scope.row.auditStatus != ''"
                style="border-color: transparent" size="small" effect="dark"
                :color="scope.row.auditStatus == 0 ? '#90a4ae' : '#00AC6A'">{{ scope.row.auditStatus == 0 ?
                  t('assemble.assembleIssue.pendingAudit') : t('assemble.assembleIssue.audited') }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="auditUser" :label="t('assemble.assembleIssue.auditUser')"
            :min-width="getColumnWidth('auditUser')"> </el-table-column>
          <el-table-column prop="auditDate" :label="t('assemble.assembleIssue.auditDate')"
            :min-width="getColumnWidth('auditDate')"> </el-table-column>
          <el-table-column fixed="right" :label="t('publicText.operation')" align="center" width="180">
            <template #default="scope">
              <el-button type="primary" size="small" icon="Plus" @click.stop="handleCreate(scope.$index, scope.row)">
                {{ t('assemble.assembleIssue.pick') }}
              </el-button>
              <el-button type="warning" size="small" icon="Plus" @click.stop="handleCreate(scope.$index, scope.row)">
                {{ t('assemble.assembleIssue.replenish') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="margin: 8px 0">
          <el-pagination background size="small" @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :page-sizes="[5, 10, 20, 50, 100]" :current-page="currentPage" :page-size="getText.pageSize"
            layout="total,sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
      <div class="box">
        <el-table :data="tableData1" :height="tableHeight1" border stripe
          size="small" style="width: 100%">
          <el-table-column prop="erp_wo" :label="t('assemble.assembleIssue.workOrder')"> </el-table-column>
          <el-table-column prop="issue_id" :label="t('assemble.assembleIssue.issueId')"> </el-table-column>
          <el-table-column prop="pn" :label="t('assemble.assembleIssue.pn')"> </el-table-column>
          <el-table-column prop="dsc" :label="t('assemble.assembleIssue.name')">
            <template #default="scope">
              <span>{{ scope.row.pninfo?.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="seq" :label="t('assemble.assembleIssue.spec')">
            <template #default="scope">
              <span>{{ scope.row.pninfo?.pn_spec }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="qty" :label="t('assemble.assembleIssue.qty')"> </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { getAssembleOrderPage, getAssembleOrderDetail, saveChkOutSht } from "@/api/assemble/assembleIssue";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
import { ref, reactive, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useRouter } from "vue-router";
import dayjs from "dayjs";

const { t } = useI18n();
const userStore = useUserStoreWithOut();
const router = useRouter();

const tableRef = ref();
const tableData = ref<any[]>([]);
const currentPage = ref(1);
const total = ref(0);
const tableHeight = ref(0);
const tableHeight1 = ref(0);
const tableData1 = ref<any[]>([]);
const innerHeight = ref(window.innerHeight);

const getText = reactive({
  pageIndex: 0,
  pageSize: 10,
  searchText: "",
});

const jumpForm = reactive({
  ChkoutShtInfo: {
    id: 0,
    Sht: "",
    Out_md: "",
    Group_id: "",
    Stts: 0,
    Is_del: "",
    Crt_usr: "",
    Crt_dt: "",
    Ud_usr: "",
    Ud_dt: "",
    Dsc: "",
    WO: "",
    Color: "",
    Face: "",
    pcb_pn: "",
    qitao_percent: "",
    q111: "",
    split_cnt: "",
    chkout_cnt: "",
    rechk_cnt: "",
    rechk_pct: "",
    chkout_pct: "",
    kevin: "",
    pn_cnt: "",
    ok_pn_cnt: "",
    return_msg: "",
    erp_wo_type: "",
  },
  ChkoutShtList: [],
  ChkoutShtItemsList: [],
});

const { getColumnWidth } = useTableColumnWidth(tableRef, tableData, {
  excludeLabels: [t("publicText.operation")],
});

const getData = () => {
  getAssembleOrderPage(getText).then((res: any) => {
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
  jumpForm.ChkoutShtInfo.id = 0;
  jumpForm.ChkoutShtInfo.Sht = row.Issue_id;
  jumpForm.ChkoutShtInfo.WO = row.WO;
  jumpForm.ChkoutShtInfo.Crt_usr = userStore.getUserInfo || "";
  jumpForm.ChkoutShtInfo.Crt_dt = dayjs().format("YYYY-MM-DD HH:mm:ss");
  saveChkOutSht(jumpForm).then((res: any) => {
    if (res.Success) {
      ElMessage.success(t("publicText.success"));
      router.push({
        name: "AssemblePicke",
        params: { id: row.IssueId },
      });
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
      return t("assemble.assembleIssue.statusPending");
    case 1:
      return t("assemble.assembleIssue.statusCreated");
    case 2:
      return t("assemble.assembleIssue.statusCompleted");
    case 99:
      return t("assemble.assembleIssue.statusVoid");
    default:
      return "";
  }
};

const statusStyle = (status: number) => {
  switch (status) {
    case 0:
      return "info";
    case 1:
      return "warning";
    case 2:
      return "success";
    case 99:
      return "danger";
    default:
      return "";
  }
};

const handle = (row: any) => {
  let text = {
    Wo: row.WO,
  };
  getAssembleOrderDetail(text).then((res: any) => {
    tableData1.value = [];
    if (res.Success) {
      tableData1.value = res.Data;
    } else {
      ElMessage.error(res.Msg);
    }
  });
};

const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = (window.innerHeight - 155 ) * 0.6;
    tableHeight1.value = (window.innerHeight - 155 ) * 0.4;
  });
};

onMounted(() => {
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
.assembleIssue {
  padding: 8px;

  .table_container {
    margin-bottom: 8px;
  }

  .box {
    margin-top: 8px;
  }
}
</style>
