<template>
  <div class="p-2">
    <el-card :body-style="{ padding: '8px' }">
        <div class="mb-1">
      <el-input
        :placeholder="t('wms.moisture.id')"
        v-model="reelID"
        class="input-with-select"
        @click="searchData()"
        style="width: 300px; margin-right: 20px"
      >
        <template #append>
          <el-button icon="Search" @click="searchData()"></el-button>
        </template>
      </el-input>
    </div>
    <el-table
      ref="tableRef"
      :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
      :height="tableHeight"
      border
       :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }"
      style="width: 100%"
      size="small"
    >
      <el-table-column :label="t('wms.moisture.index')" width="55" align="center">
        <template #default="scope">
          <span>{{ scope.$index + 1 + (currentPage - 1) * pageSize }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ReelID" :label="t('wms.moisture.id')" :min-width="getColumnWidth('ReelID')"> </el-table-column>
      <el-table-column prop="CompName" :label="t('wms.moisture.pn')" :min-width="getColumnWidth('CompName')"> </el-table-column>
      <el-table-column prop="TimeLeft" :label="t('wms.moisture.timeLeft')" align="center" :min-width="getColumnWidth('TimeLeft')">
        <template #default="scope">
          <span>{{ minChangeH(scope.row.TimeLeft) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="CountLeft" :label="t('wms.moisture.countLeft')" align="center" :min-width="getColumnWidth('CountLeft')">
      </el-table-column>
      <el-table-column prop="MsdLevel" :label="t('wms.moisture.level')" align="center" :min-width="getColumnWidth('MsdLevel')">
      </el-table-column>
      <el-table-column prop="NumDryLeft" :label="t('wms.moisture.dryCount')" align="center" :min-width="getColumnWidth('NumDryLeft')">
      </el-table-column>
      <el-table-column prop="Cellid" :label="t('wms.moisture.cell')" :min-width="getColumnWidth('Cellid')"> </el-table-column>
      <el-table-column prop="Remark" :label="t('wms.moisture.remark')" :min-width="getColumnWidth('Remark')"> </el-table-column>
    </el-table>
    <div class="block" style="margin-top: 8px">
      <el-pagination
        align="center"
        size="small"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[5, 10, 20, 50, 100]"
        layout="total,sizes, prev, pager, next, jumper"
        :total="tableData.length"
      >
      </el-pagination>
    </div>
    </el-card>
    
  </div>
</template>

<script setup lang="ts">
import { dryComponentControl } from "@/api/MSD/moisture";
import { useI18n } from "vue-i18n";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import { ref, onMounted, onBeforeMount, onUnmounted, nextTick } from "vue";

const { t } = useI18n();

const heardStyle = ref({
  background: "rgb(102, 146, 217)",
  color: "#ffffff",
});
const tableRef = ref();
const tableData = ref<any[]>([]);
const tableHeight = ref(0);
const currentPage = ref(1);
const pageSize = ref(50);
const reelID = ref("");
let getTimer: ReturnType<typeof setInterval> | null = null;

const { getColumnWidth } = useTableColumnWidth(tableRef, tableData, {
  excludeLabels: [t("wms.moisture.index")],
});

const getData = () => {
  dryComponentControl({ reelID: "", mcId: 4, type: "inquiry" }).then((res: any) => {
    if (res.Status == "OK") {
      tableData.value = res.Details;
    } else {
      tableData.value = [];
    }
  });
};

const searchData = () => {
  dryComponentControl({
    reelID: reelID.value,
    mcId: 4,
    type: "inquiry",
  }).then((res: any) => {
    if (res.Success) {
      tableData.value = res.Data;
    } else {
      tableData.value = [];
    }
  });
};

const minChangeH = (data: number) => {
  return Math.floor(data / 60) + t("wms.moisture.hours") + (data % 60) + t("wms.moisture.minutes");
};

const handleSizeChange = (val: number) => {
  pageSize.value = val;
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
};

const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 200;
  });
};

onBeforeMount(() => {
  getScreenHeight();
});

onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  searchData();
  getTimer = setInterval(() => {
    searchData();
  }, 5000);
});

onUnmounted(() => {
  window.removeEventListener("resize", getScreenHeight);
  if (getTimer) {
    clearInterval(getTimer);
    getTimer = null;
  }
});
</script>

<style scoped>
.el-pagination {
  justify-content: center;
}

</style>