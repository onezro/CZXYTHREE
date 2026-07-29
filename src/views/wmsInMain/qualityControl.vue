<template>
  <div class="qualityControl">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column
        prop="remark"
        :label="t('wmsInMain.qualityControl.function')"
        width="180"
      >
      </el-table-column>
      <el-table-column prop="ISCheck" :label="t('wmsInMain.qualityControl.isEnabled')" width="180">
        <template #default="scope">
          <el-switch
            v-model="scope.row.ISCheck"
            :active-value="1"
            :inactive-value="0"
            @change="test(scope.row, scope)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="ud_dt" :label="t('wmsInMain.qualityControl.time')"> </el-table-column>
      <el-table-column prop="ud_user" :label="t('wmsInMain.qualityControl.updater')"> </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { GetICTOverStation, UPdateICTOverStation } from "@/api/wmsInMain/index";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { useI18n } from "vue-i18n";
import { ref, onMounted } from "vue";
import dayjs from "dayjs";

const { t } = useI18n();
const userStore = useUserStoreWithOut();

const tableData = ref<any[]>([]);


const getData = () => {
  GetICTOverStation({
    PageIndex: 1,
    PageSize: 20,
    SearchText: "string",
    SearchModel: "string",
    StartTime: "string",
    EndTime: "string",
  }).then((res:any) => {
    if (res.Success) {
      console.log(JSON.parse(res.Data));
      const data = JSON.parse(res.Data)
      tableData.value = data.list || [];
    }
  });
};

const test = (state: any, scope: any) => {
  UPdateICTOverStation({
    name: "ICTGZKK",
    ISCheck: state.ISCheck,
    ud_dt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    ud_user: userStore.getUserInfo || "",
  })
    .then(() => {
      tableData.value[scope.$index].ISCheck = state.ISCheck;
    })
    .catch(() => {
      tableData.value[scope.$index].ISCheck = state.ISCheck === 0 ? 1 : 0;
    });
};

onMounted(() => {
  getData();
});
</script>

<style lang="scss" scoped></style>