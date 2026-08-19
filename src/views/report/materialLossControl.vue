<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <el-form ref="form" :inline="true" label-width="auto" size="small">
        <el-form-item class="mb-2">
          <el-date-picker :clearable="false" v-model="getDataText.Date" type="date"
            :placeholder="t('publicText.pleaseSelect')" value-format="YYYY-MM-DD">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="mb-2">
          <el-select v-model="getDataText.Line" :placeholder="t('publicText.pleaseSelect')" filterable
            @change="getData(true)" clearable>
            <el-option v-for="item in lineList" :key="item.line" :label="item.line" :value="item.line">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="mb-2">
          <el-input :placeholder="t('report.materialLossControl.inputPnName')" clearable v-model="getDataText.PNName"
            @input="getData(false)">
          </el-input>
        </el-form-item>
        <el-form-item class="mb-2">
          <el-button type="primary" @click="getData(true)">{{ t('publicText.query') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table ref="tableRef" :data="pagedTableData" :height="tableHeight" border stripe size="small"
        style="width: 100%">
        <el-table-column type="index" align="center" fixed :label="t('publicText.index')" width="55">
          <template #default="scope">
            <span>{{ scope.$index + pageSize * (currentPage - 1) + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Line" :label="t('report.materialLossControl.line')" align="center"
          :min-width="getColumnWidth('Line')"></el-table-column>
        <el-table-column prop="CompName" :label="t('report.materialLossControl.compName')"
          :min-width="getColumnWidth('CompName')"></el-table-column>
        <el-table-column prop="PNName" :label="t('report.materialLossControl.pnName')"
          :min-width="getColumnWidth('PNName')"></el-table-column>
        <el-table-column prop="PNDesc" :label="t('report.materialLossControl.pnDesc')"
          :min-width="getColumnWidth('PNDesc')"></el-table-column>
        <el-table-column prop="TotalCount" sortable :label="t('report.materialLossControl.totalCount')"
          :min-width="getColumnWidth('TotalCount')"></el-table-column>
        <el-table-column prop="lossCount" sortable :label="t('report.materialLossControl.errorCount')"
          :min-width="getColumnWidth('lossCount')"></el-table-column>
        <el-table-column prop="lossRate" sortable :label="t('report.materialLossControl.errorRate')"
          :min-width="getColumnWidth('lossRate')"></el-table-column>
      </el-table>
      <div class="block" style="margin-top: 8px">
        <el-pagination size="small" background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="currentPage" :page-size="pageSize" :page-sizes="[5, 10, 20, 50, 100]"
          layout="total,sizes, prev, pager, next, jumper" :total="tableData.length">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from "vue";
import { ElMessage, ElNotification } from "element-plus";
import { useI18n } from "vue-i18n";
import { GetMaterialLossDetail } from "@/api/report/index";
import { GetSMTValorLine } from "@/api/smtApply/changeover";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";

const { t } = useI18n();

const tableRef = ref();
const tableData = ref<any[]>([]);
const lineList = ref<any[]>([]);

const getDataText = reactive({
  Line: "",
  Date: "",
  PNName: "",
});

const currentPage = ref(1);
const pageSize = ref(20);
const tableHeight = ref(0);

const excludeLabels = [t("publicText.index")];

const { getColumnWidth } = useTableColumnWidth(tableRef, tableData, {
  excludeLabels,
});

const pagedTableData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return tableData.value.slice(start, end);
});

const getLineList = () => {
  GetSMTValorLine({}).then((res: any) => {
    lineList.value = res.Data;
  });
};

const getData = (boolen: boolean) => {
  if (getDataText.Line == "" || getDataText.Date == "") {
    if (boolen) {
      ElMessage({
        message: t("report.materialLossControl.selectTimeAndLine"),
        type: "warning",
      });
    }
    return;
  }
  tableData.value = [];
  GetMaterialLossDetail(getDataText).then((res: any) => {
    if (res.Success) {
      tableData.value = res.Data;
      if (res.Code != 200) {
        tableData.value = [];
      }
    } else {
      ElNotification({
        title: t("message.tipTitle"),
        message: res.Msg,
        type: "error",
      });
    }
  });
};

const handleSizeChange = (val: number) => {
  currentPage.value = 1;
  pageSize.value = val;
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
};

onMounted(() => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  getDataText.Date = `${year}-${month}-${day}`;
  getLineList();
  nextTick(() => {
    tableHeight.value = window.innerHeight - 190;
  });
});
</script>

<style lang="scss" scoped>
.smtinstpro {
  padding: 20px;
}
</style>
