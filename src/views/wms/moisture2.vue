<template>
  <div class="p-2">
    <el-card :body-style="{ padding: '4px' }">
         <div class="m-2">
      <el-input :placeholder="t('wms.moisture2.pn')" v-model="getForm.SearchModel.PN" class="input-with-select"
        style="width: 300px; margin-right: 20px">
        <template #append>
          <el-button icon="Search" @click="getData"></el-button>
        </template>
      </el-input>
    </div>
    <el-table ref="tableRef" :data="tableData"
      :height="tableHeight" border style="width: 100%" size="small">
      <el-table-column :label="t('wms.moisture2.index')" width="55" fixed>
        <template #default="scope">
          <span>{{ scope.$index + 1 + (getForm.PageIndex - 1) * getForm.PageSize }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="Realid" :label="t('wms.moisture2.id')" fixed :min-width="getColumnWidth('Realid')"> </el-table-column>
      <el-table-column prop="Pn" :label="t('wms.moisture2.pn')" fixed :min-width="getColumnWidth('Pn')"> </el-table-column>
      <el-table-column prop="InStore" :label="t('wms.moisture2.inStore')"  :min-width="getColumnWidth('InStore')"> </el-table-column>
      <el-table-column prop="OutStore" :label="t('wms.moisture2.outStore')" :min-width="getColumnWidth('OutStore')"> </el-table-column>
      <el-table-column prop="Golive" :label="t('wms.moisture2.golive')" :min-width="getColumnWidth('Golive')"> </el-table-column>
      <el-table-column prop="Gooffline" :label="t('wms.moisture2.gooffline')" :min-width="getColumnWidth('Gooffline')"> </el-table-column>
      <el-table-column prop="StartTime" :label="t('wms.moisture2.startTime')" :min-width="getColumnWidth('StartTime')"> </el-table-column>
      <el-table-column prop="EndTime" :label="t('wms.moisture2.endTime')"  :min-width="getColumnWidth('EndTime')"> </el-table-column>
      <el-table-column prop="RemainingTimeLong" :label="t('wms.moisture2.remainingTime')" :min-width="getColumnWidth('RemainingTimeLong')">
      </el-table-column>
    </el-table>
    <div class="block" style="margin-top: 8px">
      <el-pagination align="center" :size="'small'" background @size-change="handleSizeChange"
        @current-change="handleCurrentChange" :current-page="getForm.PageIndex" :page-size="getForm.PageSize"
        :page-sizes="[5, 10, 20, 50, 100]" layout="total,sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    </el-card>
   
  </div>
</template>

<script setup lang="ts">
import { QueryProductMSDData } from "@/api/MSD/moisture";
import { useI18n } from "vue-i18n";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import { ref, reactive, onMounted, onBeforeMount, onUnmounted, nextTick } from "vue";

const { t } = useI18n();

const heardStyle = ref({
  background: "rgb(102, 146, 217)",
  color: "#ffffff",
});

const tableRef = ref();

const getForm = reactive({
  PageIndex: 1,
  PageSize: 50,
  SearchText: "",
  SearchModel: {
    PN: "",
  },
  StartTime: "",
  EndTime: "",
});

const tableData = ref<any[]>([]);
const total = ref(0);
const tableHeight = ref(0);

const { getColumnWidth } = useTableColumnWidth(tableRef, tableData, {
  excludeLabels: [t("wms.moisture2.index")],
});

const getData = () => {
  QueryProductMSDData(getForm).then((res: any) => {
    console.log(res);
    
    if (res.Success) {
      tableData.value = res.Data.list || [];
      total.value = res.Data.Total || 0;
    } else {
      tableData.value = [];
      total.value = 0;
    }
  });
};

const searchData = () => {
  getForm.PageIndex = 1;
  getData();
};

const handleSizeChange = (val: number) => {
  getForm.PageSize = val;
  getData();
};

const handleCurrentChange = (val: number) => {
  getForm.PageIndex = val;
  getData();
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

<style scoped>
.el-pagination {
  justify-content: center;
}

</style>