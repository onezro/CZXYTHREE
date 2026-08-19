<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <el-form ref="form" :inline="true" label-width="auto">
        <el-form-item class="mb-2">
          <el-date-picker v-model="dateValue" type="datetimerange" range-separator="至"
            :start-placeholder="t('publicText.startDate')" :end-placeholder="t('publicText.endDate')" size="small"
            :shortcuts="shortcuts" value-format="YYYY-MM-DD HH:mm:ss"
            :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]" :clearable="false"
            @change="getData">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="mb-2">
          <el-select v-model="getDataText.Line" :placeholder="t('publicText.pleaseSelect')" size="small" filterable
            clearable @change="getData">
            <el-option v-for="item in lineList" :key="item.line" :label="item.line" :value="item.line">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="mb-2">
          <el-button type="primary" @click="getData()" size="small">{{ t('publicText.query') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table ref="tableRef" :data="pagedTableData" :height="tableHeight" border stripe size="small"
        style="width: 100%">
        <el-table-column type="index" align="center" fixed :label="t('publicText.index')" width="55">
          <template #default="scope">
            <span>{{ scope.$index + pageSize * (currentPage - 1) + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Line" :label="t('report.materialLoss.line')"
          :min-width="getColumnWidth('Line')"></el-table-column>
        <el-table-column prop="TotalCount" :label="t('report.materialLoss.lossCount')"
          :min-width="getColumnWidth('TotalCount')"></el-table-column>
        <el-table-column prop="PPM" :label="t('report.materialLoss.ppm')"
          :min-width="getColumnWidth('PPM')"></el-table-column>
        <el-table-column prop="LEDCount" :label="t('report.materialLoss.led')"
          :min-width="getColumnWidth('LEDCount')"></el-table-column>
        <el-table-column prop="ChipCount" :label="t('report.materialLoss.chip')"
          :min-width="getColumnWidth('ChipCount')"></el-table-column>
        <el-table-column prop="ConnectorCount" :label="t('report.materialLoss.connector')"
          :min-width="getColumnWidth('ConnectorCount')"></el-table-column>
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
import { ref, reactive, computed, watch, onMounted, nextTick } from "vue";
import { ElMessage, ElNotification } from "element-plus";
import { useI18n } from "vue-i18n";
import { GetMaterialLossData } from "@/api/report/index";
import { GetSMTValorLine } from "@/api/smtApply/changeover";
import { shortcuts } from "@/utils/dataMenu";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";

const { t } = useI18n();

const tableRef = ref();
const tableData = ref<any[]>([]);
const lineList = ref<any[]>([]);

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const getFormattedTimeRange = () => {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const start = new Date();
  start.setDate(start.getDate() - 6);
  start.setHours(0, 0, 0, 0);
  return {
    start: formatDate(start),
    end: formatDate(end),
  };
};

const dateValue = ref<any[]>([]);

const getDataText = reactive({
  Line: "",
  StartTime: "",
  EndTime: "",
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

watch(dateValue, (value) => {
  if (value == null) {
    getDataText.StartTime = "";
    getDataText.EndTime = "";
  } else {
    getDataText.StartTime = value[0];
    getDataText.EndTime = value[1];
  }
}, { immediate: true });

const getLineList = () => {
  GetSMTValorLine({}).then((res: any) => {
    lineList.value = res.Data;
  });
};


const getData = () => {
  GetMaterialLossData(getDataText).then((res: any) => {
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
  getLineList();
  const { start, end } = getFormattedTimeRange();
  getDataText.StartTime = start;
  getDataText.EndTime = end;
  dateValue.value = [start, end];
  nextTick(() => {
    tableHeight.value = window.innerHeight - 210;
  });
  getData();
});
</script>

<style lang="scss" scoped>
.smtinstpro {
  padding: 20px;
}
</style>
