<template>
  <div class="puzzles p-2">
    <el-card :body-style="{ padding: '8px' }">
      <div class="mb-2 flex justify-between">
        <div>
          <el-button type="primary" size="small" @click="openAdd">{{ t('baseData.barcodeVerification.add') }}</el-button>
          <el-button type="primary" size="small" @click="openHistory">{{ t('baseData.barcodeVerification.verificationQuery') }}</el-button>
        </div>
        <div>
          <el-input
            v-model="getForm.SearchModel.checkpro_no"
            :placeholder="t('baseData.barcodeVerification.inputPlaceholder')"
            style="width: 350px"
            @keyup.enter="getData()"
            clearable
            @clear="clearData"
          >
            <template #append>
              <el-button icon="Search" @click="getData()"></el-button>
            </template>
          </el-input>
        </div>
      </div>
      <el-table
        :data="tableData"
        border
        :height="tableHeight"
        size="small"
        style="width: 100%"
      >
        <el-table-column :label="t('baseData.barcodeVerification.index')" width="55" align="center">
          <template #default="scope">
            <span>{{ scope.$index + 1 + (getForm.PageIndex - 1) * getForm.PageSize }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="checkpro_no" :label="t('baseData.barcodeVerification.checkproNo')" min-width="180">
        </el-table-column>
        <el-table-column prop="checkpro_sepc" :label="t('baseData.barcodeVerification.checkproSepc')" min-width="200"> </el-table-column>
        <el-table-column prop="checkpro_date" :label="t('baseData.barcodeVerification.checkproDate')" width="180"> </el-table-column>
        <el-table-column prop="checkpro_user" :label="t('baseData.barcodeVerification.checkproUser')" width="145">
        </el-table-column>
        <el-table-column fixed="right" :label="t('baseData.barcodeVerification.operation')" width="130" align="center">
          <template #default="scope">
            <el-tooltip :content="t('baseData.barcodeVerification.edit')" placement="top">
              <el-button type="primary" size="small" icon="Edit" @click="handleEdit(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip :content="t('baseData.barcodeVerification.delete')" placement="top">
              <el-button type="danger" size="small" icon="Delete" @click="handleDelete(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <div class="block" style="margin-top: 8px">
        <el-pagination
          align="center"
          size="small"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="getForm.PageIndex"
          :page-size="getForm.PageSize"
          :page-sizes="[10, 20, 50, 100, 150]"
          layout="total,sizes, prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>

    <!-- 添加弹窗 -->
    <el-dialog :title="t('baseData.barcodeVerification.addTitle')" v-model="dialogVisible" width="400px" @close="addCancel()">
      <el-form :model="addForm" ref="formRef" label-width="auto">
        <el-form-item :label="t('baseData.barcodeVerification.checkproNo')" prop="checkpro_no">
          <el-input v-model="addForm.checkpro_no" />
        </el-form-item>
        <el-form-item :label="t('baseData.barcodeVerification.checkproSepc')" prop="checkpro_sepc">
          <el-input v-model="addForm.checkpro_sepc" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addCancel()">{{ t('baseData.barcodeVerification.cancel') }}</el-button>
          <el-button type="primary" @click="addData()">{{ t('baseData.barcodeVerification.confirm') }}</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 修改弹窗 -->
    <el-dialog :title="t('baseData.barcodeVerification.editTitle')" v-model="editVisible" width="400px" @close="editCancel()">
      <el-form :model="editForm" ref="editFormRef" label-width="auto">
        <el-form-item :label="t('baseData.barcodeVerification.checkproNo')" prop="checkpro_no">
          <el-input v-model="editForm.checkpro_no" disabled />
        </el-form-item>
        <el-form-item :label="t('baseData.barcodeVerification.checkproSepc')" prop="checkpro_sepc">
          <el-input v-model="editForm.checkpro_sepc" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">{{ t('baseData.barcodeVerification.cancel') }}</el-button>
          <el-button type="primary" @click="editData()">{{ t('baseData.barcodeVerification.confirm') }}</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 校验查询弹窗 -->
    <el-dialog :title="t('baseData.barcodeVerification.verificationQuery')" v-model="historyVisible" width="1200px" @close="historyClose">
      <div class="mb-2">
        <el-input
          v-model.trim="historyForm.SearchModel.checkpro_no"
          :placeholder="t('baseData.barcodeVerification.historySearchPlaceholder')"
          style="width: 350px"
          @keyup.enter="getHistoy"
          clearable
          @clear="getHistoy"
        >
          <template #append>
            <el-button icon="Search" @click="getHistoy"></el-button>
          </template>
        </el-input>
      </div>
      <el-table :height="500" :data="historyData" border size="small">
        <el-table-column prop="factorybar" :label="t('baseData.barcodeVerification.factoryBar')" min-width="150"> </el-table-column>
        <el-table-column prop="xybar" :label="t('baseData.barcodeVerification.xyBar')" width="300"> </el-table-column>
        <el-table-column prop="checkstatus" :label="t('baseData.barcodeVerification.checkStatus')" width="100"> </el-table-column>
        <el-table-column prop="checkresult" :label="t('baseData.barcodeVerification.checkResult')" min-width="150"> </el-table-column>
        <el-table-column prop="checkdate" :label="t('baseData.barcodeVerification.checkDate')" width="180"> </el-table-column>
        <el-table-column prop="checkuser" :label="t('baseData.barcodeVerification.checkUser')" width="120"> </el-table-column>
      </el-table>

      <div class="block" style="margin-top: 8px">
        <el-pagination
          align="center"
          background
          @size-change="handleHistorySizeChange"
          @current-change="handleHistoryCurrentChange"
          :current-page="historyForm.PageIndex"
          :page-size="historyForm.PageSize"
          :page-sizes="[10, 20, 50, 100, 150]"
          layout="total,sizes, prev, pager, next"
          :total="totalHistory"
        >
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  QueryChecProductFoundation,
  InsertChecProductFoundation,
  UpdateChecProductFoundation,
  DeleteChecProductFoundation,
  QueryChecProductLog,
} from "@/api/baseData/barcodeVerification";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
import { useI18n } from "vue-i18n";
import { ref, reactive, onMounted, onBeforeMount, onBeforeUnmount, nextTick } from "vue";
import dayjs from "dayjs";

const { t } = useI18n();
const userStore = useUserStoreWithOut();

const tableData = ref<any[]>([]);
const total = ref(0);
const tableHeight = ref(0);
const dialogVisible = ref(false);
const editVisible = ref(false);
const historyVisible = ref(false);
const historyData = ref<any[]>([]);
const totalHistory = ref(0);
const formRef = ref();
const editFormRef = ref();

const getForm = reactive({
  PageIndex: 1,
  PageSize: 50,
  SearchModel: {
    checkpro_no: "",
  },
});

const addForm = reactive({
  checkpro_no: "",
  checkpro_sepc: "",
  UserNo: userStore.getUserInfo || "",
  checkpro_date: "",
});

const editForm = reactive({
  checkpro_no: "",
  checkpro_id: 0,
  checkpro_sepc: "",
  checkpro_date: "",
  UserNo: userStore.getUserInfo || "",
});

const historyForm = reactive({
  PageIndex: 1,
  PageSize: 10,
  SearchModel: {
    checkpro_no: "",
  },
});

onBeforeMount(() => {
  getScreenHeight();
  getData();
});

onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", getScreenHeight);
});

const getData = () => {
  QueryChecProductFoundation(getForm).then((res: any) => {
    if (res.Success) {
      tableData.value = res.Data.list || [];
      total.value = res.Data.Total || 0;
    } else {
      tableData.value = [];
      total.value = 0;
    }
  });
};

const addData = () => {
  addForm.checkpro_date = dayjs().format("YYYY-MM-DD HH:mm:ss");
  addForm.UserNo = userStore.getUserInfo || "";
  InsertChecProductFoundation(addForm).then((res: any) => {
    if (res.Success) {
      dialogVisible.value = false;
      getData();
      ElMessage.success(t("baseData.barcodeVerification.addSuccess"));
    } else {
      ElMessage.error(res.Msg || t("baseData.barcodeVerification.addFailed"));
    }
  });
};

const editData = () => {
  editForm.checkpro_date = dayjs().format("YYYY-MM-DD HH:mm:ss");
  editForm.UserNo = userStore.getUserInfo || "";
  UpdateChecProductFoundation(editForm).then((res: any) => {
    if (res.Success) {
      editVisible.value = false;
      getData();
      ElMessage.success(t("baseData.barcodeVerification.editSuccess"));
    } else {
      ElMessage.error(res.Msg || t("baseData.barcodeVerification.editFailed"));
    }
  });
};

const getHistoy = () => {
  QueryChecProductLog(historyForm).then((res: any) => {
    if (res.Success) {
      historyData.value = res.Data.list || [];
      totalHistory.value = res.Data.Total || 0;
    } else {
      historyData.value = [];
      totalHistory.value = 0;
    }
  });
};

const historyClose = () => {
  historyForm.SearchModel.checkpro_no = "";
  historyForm.PageIndex = 1;
  historyData.value = [];
  totalHistory.value = 0;
};

const clearData = () => {
  getForm.PageIndex = 1;
  getData();
};

const openAdd = () => {
  addForm.checkpro_no = "";
  addForm.checkpro_sepc = "";
  dialogVisible.value = true;
};

const openHistory = () => {
  historyForm.SearchModel.checkpro_no = "";
  historyForm.PageIndex = 1;
  historyVisible.value = true;
};

const handleDelete = (row: any) => {
  ElMessageBox.confirm(t("baseData.barcodeVerification.deleteConfirm"), t("publicText.tipTitle"), {
    type: "warning",
  })
    .then(() => {
      DeleteChecProductFoundation({
        checkpro_id: row.checkpro_id,
        UserNo: userStore.getUserInfo || "",
      }).then((res: any) => {
        if (res.Success) {
          getData();
          ElMessage.success(t("baseData.barcodeVerification.deleteSuccess"));
        } else {
          ElMessage.error(res.Msg || t("baseData.barcodeVerification.deleteFailed"));
        }
      });
    })
    .catch(() => {
      ElNotification({
        type: "info",
        title: t("publicText.tipTitle"),
        message: t("baseData.barcodeVerification.deleteCancel"),
      });
    });
};

const addCancel = () => {
  dialogVisible.value = false;
  formRef.value?.resetFields();
  addForm.checkpro_no = "";
  addForm.checkpro_sepc = "";
};

const handleEdit = (row: any) => {
  editForm.checkpro_id = row.checkpro_id;
  editForm.checkpro_no = row.checkpro_no;
  editForm.checkpro_sepc = row.checkpro_sepc;
  editVisible.value = true;
};

const editCancel = () => {
  editForm.checkpro_no = "";
  editForm.checkpro_id = 0;
  editForm.checkpro_sepc = "";
};

const handleSizeChange = (value: number) => {
  getForm.PageSize = value;
  getForm.PageIndex = 1;
  getData();
};

const handleCurrentChange = (val: number) => {
  getForm.PageIndex = val;
  getData();
};

const handleHistorySizeChange = (value: number) => {
  historyForm.PageSize = value;
  historyForm.PageIndex = 1;
  getHistoy();
};

const handleHistoryCurrentChange = (val: number) => {
  historyForm.PageIndex = val;
  getHistoy();
};

const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 190;
  });
};
</script>

<style scoped>
.el-pagination {
  justify-content: center;
}

</style>