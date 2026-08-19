<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <el-form ref="form" :inline="true" label-width="auto" @submit.prevent size="small">
        <el-form-item class="mb-2">
          <el-date-picker v-model="dateValue" type="datetimerange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" value-format="YYYY-MM-DD HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']" :clearable="false">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="mb-2">
          <el-autocomplete ref="autocompleteInput" v-model="getDataText.CompID" :fetch-suggestions="remoteMethod"
            :placeholder="t('report.soldeRpasteRecord.inputSolderPasteId')" @select="change1" style="width: 265px;" @clear="handleClear" clearable
            :key="autocompleteKey">
          </el-autocomplete>
        </el-form-item>
        <el-form-item class="mb-2">
          <el-button type="primary" @click="getData(getDataText.CompID)">{{ t('publicText.query') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table ref="tableRef" :data="pagedTableData"
        :height="tableHeight" border stripe size="small">
        <el-table-column type="index" :label="t('publicText.index')" width="60" align="center">
          <template #default="scope">
            <div>{{ scope.$index + 1 + (currentPage - 1) * pageSize }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="CompID" :label="t('report.soldeRpasteRecord.solderPasteId')" :min-width="getColumnWidth('CompID')"></el-table-column>
        <el-table-column prop="OperationID" :label="t('report.soldeRpasteRecord.solderPastePn')" :min-width="getColumnWidth('OperationID')">
          <template #default="scope">
            <div>{{ scope.row.CompID.slice(0, 13) }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="DescriptionName" :label="t('report.soldeRpasteRecord.operationType')" :min-width="getColumnWidth('DescriptionName')">
        </el-table-column>
        <el-table-column prop="McID" :label="t('report.soldeRpasteRecord.deviceId')" width="100" :min-width="getColumnWidth('McID')">
        </el-table-column>
        <el-table-column prop="OperatorID" :label="t('report.soldeRpasteRecord.operator')" width="100" :min-width="getColumnWidth('OperatorID')"> </el-table-column>
        <el-table-column prop="Timestamp" :label="t('report.soldeRpasteRecord.time')" width="150" :min-width="getColumnWidth('Timestamp')">
        </el-table-column>

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
import { ElNotification } from "element-plus";
import { useI18n } from "vue-i18n";
import { GetCompId, QueryOperator } from "@/api/report/index";
import { setTodayDate } from "@/utils/dataMenu";
import dayjs from "dayjs";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";

const { t } = useI18n();

const tableRef = ref();
const autocompleteInput = ref();
const tableData = ref<any[]>([]);
const tableHeight = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const dateValue = ref<any[]>([]);
const autocompleteKey = ref(0);

const getDataText = reactive({
  CompID: "",
  InitialDate1: "",
  InitialDate2: "",
});

const { getColumnWidth } = useTableColumnWidth(tableRef, tableData, {
  excludeLabels: [t("publicText.index")],
});

const pagedTableData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return tableData.value.slice(start, end);
});

watch(dateValue, (value) => {
  if (value == null) {
    getDataText.InitialDate1 = "";
    getDataText.InitialDate2 = "";
  } else {
    getDataText.InitialDate1 = value[0];
    getDataText.InitialDate2 = value[1];
  }
});

const getData = (query: string) => {
  getDataText.CompID = query;
  QueryOperator({ CompID: getDataText.CompID }).then((res: any) => {
    if (res.Success) {
      tableData.value = res.Data;
      if (res.Code == 300) {
        tableData.value = [];
        ElNotification({
          title: t("publicText.tipTitle"),
          message: t("report.soldeRpasteRecord.selectSolderPasteId"),
          type: "error",
        });
      }
    } else {
      ElNotification({
        title: t("publicText.tipTitle"),
        message: res.Msg,
        type: "error",
      });
    }
  });
};

const remoteMethod = (query: string, cb: any) => {
  if (query.trim() === '') {
    cb([]); // 返回空数组，确保下拉框关闭
    return;
  }

  GetCompId({ ...getDataText, CompID: query }).then((res: any) => {
    if (res.Success) {
      if (res.Code == 300) {
        cb([]);
        return;
      }
      const searchData = res.Data.map((item: any) => {
        return {
          value: item.CompID
        };
      });

      cb(searchData);
    }
  });
};

const change1 = (val: any) => {
  getDataText.CompID = val.value;
  getData(val.value);
};

const handleClear = () => {
  autocompleteKey.value += 1;
  // 强制重新渲染
  nextTick(() => {
    autocompleteInput.value?.focus();
  });
};

const handleSizeChange = (val: number) => {
  currentPage.value = 1;
  pageSize.value = val;
};

//当前页改变时触发 跳转其他页
const handleCurrentChange = (val: number) => {
  currentPage.value = val;
};

onMounted(() => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 190;
  });
  // 默认日期：7天前到现在
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0); // 今天的开始时间
  dateValue.value = [
    dayjs(todayStart).subtract(7, "day").format("YYYY-MM-DD HH:mm:ss"),
    setTodayDate(true),
  ];
});
</script>

<style lang="scss" scoped>
.smtinstpro {
  padding: 20px;
  // .form{
  //    display: flex;
  //     justify-content: flex-end;
  // }
}
</style>
