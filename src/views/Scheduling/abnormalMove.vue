<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <el-form :inline="true" :model="queryForm" label-width="auto" @submit.prevent size="small">
        <el-form-item :label="t('Scheduling.abnormalMove.lineName')" class="mb-2">
          <el-select v-model="queryForm.LineName" placeholder="" clearable style="width:160px">
            <el-option v-for="item in lineList" :key="item.MfgLineName" :label="item.Description" :value="item.MfgLineName" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('Scheduling.abnormalMove.pn')" class="mb-2">
          <el-input v-model="queryForm.Pn" placeholder="" clearable @keyup.enter.native="handleSearch" style="width:160px" />
        </el-form-item>
        <el-form-item :label="t('Scheduling.abnormalMove.width')" class="mb-2">
          <el-input v-model="queryForm.Width" placeholder="" clearable @keyup.enter.native="handleSearch" style="width:160px" />
        </el-form-item>
        <el-form-item class="mb-2">
          <el-button type="primary" @click="handleSearch">{{ t('publicText.query') }}</el-button>
          <el-button @click="handleReset">{{ t('publicText.reset') }}</el-button>
          <el-button type="success" @click="openAddDialog">{{ t('publicText.add') }}</el-button>
          <el-button type="warning" @click="openCopyDialog">复制</el-button>
          <el-button type="info" @click="openImportDialog">{{ t('publicText.import') }}</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" ref="tableRef" border :height="tableHeight" stripe size="small" v-loading="loading">
        <el-table-column type="index" :label="t('publicText.index')" width="55" align="center" />
        <el-table-column prop="Line" :label="t('Scheduling.abnormalMove.lineName')" :min-width="getColumnWidth('Line')" />
        <el-table-column prop="Pn" :label="t('Scheduling.abnormalMove.pn')" :min-width="getColumnWidth('Pn')" />
        <el-table-column prop="Width" :label="t('Scheduling.abnormalMove.width')+('(mm)')" :min-width="getColumnWidth('Width')" align="center" />
        <el-table-column prop="feedernum" :label="t('Scheduling.abnormalMove.feedernum')" :min-width="getColumnWidth('feedernum')" align="center" />
        <el-table-column :label="t('publicText.operation')" width="120" align="center">
          <template #default="{ row }">
             <el-tooltip class="item" :content="t('publicText.edit')" placement="top">
               <el-button type="primary" size="small" @click="openEditDialog(row)" icon="Edit"></el-button>
             </el-tooltip>
             <el-tooltip class="item" :content="t('publicText.delete')" placement="top">
               <el-button type="danger" size="small" @click="handleDelete(row)" icon="Delete"></el-button>
             </el-tooltip>
          </template>
        </el-table-column>
        <template #empty><el-empty /></template>
      </el-table>

      <el-pagination class="mt-2" align="center" background size="small" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryForm.PageIndex" :page-size="queryForm.PageSize" :page-sizes="[10, 20, 50, 100]" layout="total,sizes, prev, pager, next" :total="total" />
    </el-card>

    <el-dialog :title="t('Scheduling.abnormalMove.addTitle')" v-model="addDialogVisible" width="60%" @close="handleAddDialogClose" :append-to-body="true" align-center :close-on-click-modal="false">
      <el-form :model="addForm" ref="addFormRef" label-width="auto">
        <el-form-item :label="t('Scheduling.abnormalMove.lineName')" prop="LineName" :rules="[{ required: true, message: t('Scheduling.abnormalMove.selectLine') }]">
          <el-select v-model="addForm.LineName" placeholder="" style="width:100%">
            <el-option v-for="item in lineList" :key="item.MfgLineName" :label="item.Description" :value="item.MfgLineName" />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="mb-2 flex items-center justify-between">
        <div>{{ t('Scheduling.abnormalMove.addInfo') }}</div>
        <el-button type="primary" size="small" @click="handleAddRow">
          <el-icon><Plus /></el-icon>{{ t('publicText.add') }}
        </el-button>
      </div>
      <el-table :data="addForm.infolist" border stripe size="small" height="450">
        <el-table-column type="index" :label="t('publicText.index')" width="60" align="center" />
        <el-table-column :label="t('Scheduling.abnormalMove.pn')" prop="Pn">
          <template #default="{ row, $index }">
            <el-input v-model="row.Pn" :placeholder="t('Scheduling.abnormalMove.inputPn')" />
          </template>
        </el-table-column>
        <el-table-column :label="t('Scheduling.abnormalMove.width')" prop="Width" width="150">
          <template #default="{ row }">
            <el-input-number v-model="row.Width" :min="1" controls-position="right" style="width:100%" />
          </template>
        </el-table-column>
        <el-table-column :label="t('Scheduling.abnormalMove.feedernum')" prop="feedernum" width="150">
          <template #default="{ row }">
            <el-input-number v-model="row.feedernum" :min="1" controls-position="right" style="width:100%" />
          </template>
        </el-table-column>
        <el-table-column :label="t('publicText.operation')" width="80" align="center">
          <template #default="{ $index }">
            <el-button type="danger" size="small" @click="handleRemoveRow($index)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="handleAddDialogClose">{{ t('publicText.cancel') }}</el-button>
        <el-button type="primary" @click="handleAdd">{{ t('publicText.confirm') }}</el-button>
      </template>
    </el-dialog>

    <el-dialog :title="t('Scheduling.abnormalMove.editTitle')" v-model="editDialogVisible" width="40%" @close="handleEditDialogClose" :append-to-body="true" align-center :close-on-click-modal="false">
      <el-form :model="editForm" ref="editFormRef" label-width="100px">
        <el-form-item :label="t('Scheduling.abnormalMove.lineName')" prop="LineName" :rules="[{ required: true, message: t('Scheduling.abnormalMove.selectLine') }]">
          <el-select v-model="editForm.LineName" placeholder="" style="width:100%">
            <el-option v-for="item in lineList" :key="item.MfgLineName" :label="item.Description" :value="item.MfgLineName" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('Scheduling.abnormalMove.pn')" prop="Pn" :rules="[{ required: true, message: t('Scheduling.abnormalMove.inputPn') }]">
          <el-input v-model="editForm.Pn" placeholder="" />
        </el-form-item>
        <el-form-item :label="t('Scheduling.abnormalMove.width')" prop="Width" :rules="[{ required: true, message: t('Scheduling.abnormalMove.inputWidth') }]">
          <el-input v-model="editForm.Width" placeholder="" type="number" />
        </el-form-item>
        <el-form-item :label="t('Scheduling.abnormalMove.feedernum')" prop="feedernum" :rules="[{ required: true, message: t('Scheduling.abnormalMove.inputFeederNum') }]">
          <el-input v-model="editForm.feedernum" placeholder="" type="number" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleEditDialogClose">{{ t('publicText.cancel') }}</el-button>
        <el-button type="primary" @click="handleEdit">{{ t('publicText.confirm') }}</el-button>
      </template>
    </el-dialog>

    <el-dialog :title="t('Scheduling.abnormalMove.copyTitle')" v-model="copyDialogVisible" width="40%" @close="copyDialogVisible = false" :append-to-body="true" align-center :close-on-click-modal="false">
      <el-form :model="copyForm" label-width="100px">
        <el-form-item :label="t('Scheduling.abnormalMove.fromLine')">
          <el-select v-model="copyForm.FromLineName" placeholder="" style="width:100%">
            <el-option v-for="item in lineList" :key="item.MfgLineName" :label="item.Description" :value="item.MfgLineName" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('Scheduling.abnormalMove.toLine')">
          <el-select v-model="copyForm.ToLineName" placeholder="" style="width:100%" multiple>
            <el-option v-for="item in lineList" :key="item.MfgLineName" :label="item.Description" :value="item.MfgLineName" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="copyDialogVisible = false">{{ t('publicText.cancel') }}</el-button>
        <el-button type="primary" @click="handleCopy">{{ t('publicText.confirm') }}</el-button>
      </template>
    </el-dialog>

    <el-dialog :title="t('Scheduling.abnormalMove.importTitle')" v-model="importDialogVisible" width="40%" @close="handleImportDialogClose" :append-to-body="true"  :close-on-click-modal="false">
      <el-form :model="importForm" ref="importFormRef" label-width="100px">
        <el-form-item :label="t('publicText.import')" prop="file">
          <el-upload
            class="upload-demo"
            ref="uploadRef"
            style="width:100%"
            v-model:file-list="fileList"
            :auto-upload="false"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
            :on-exceed="handleExceed"
            accept=".xlsx,.xls"
            :limit="1"
            drag
          >
            <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
            <div class="el-upload__text">{{ t('Scheduling.abnormalMove.selectFile') }}</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleImportDialogClose">{{ t('publicText.cancel') }}</el-button>
        <el-button type="primary" @click="handleUpload">{{ t('Scheduling.abnormalMove.uploadFile') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { useUserStoreWithOut } from '@/stores/modules/user';
const userStore = useUserStoreWithOut();
import {
  GetLineFeederWidthNum,
  IULineFeederWidthNum,
  DeleteLineFeederWidthNum,
  CopyLineFeederWidthNum,
  UploadLineFeederWidthNum,
} from "@/api/Scheduling/apsBaseApi";
import { GetMESWorkLineNews } from "@/api/Scheduling/lineCalendar";
import { useTableColumnWidth } from '@/hooks/useTableColumnWidth';

const { t } = useI18n();

const lineList = ref<any[]>([]);
const tableData = ref<any[]>([]);
const total = ref(0);
const loading = ref(false);
const tableRef = ref();
const addFormRef = ref();
const editFormRef = ref();
const importFormRef = ref();
const uploadRef = ref();

const tableHeight = ref(0);
const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 180;
  });
};

const queryForm = reactive({
  LineName: '',
  Pn: '',
  Width: '',
  PageIndex: 1,
  PageSize: 50,
});

const addDialogVisible = ref(false);
const editDialogVisible = ref(false);
const copyDialogVisible = ref(false);
const importDialogVisible = ref(false);

interface InfoItem {
  Pn: string;
  Width: number;
  feedernum: number;
}

const addForm = reactive({
  LineName: '',
  infolist: [] as InfoItem[],
});

const editForm = reactive({
  LineName: '',
  Pn: '',
  Width: '',
  feedernum: 0,
});

const copyForm = reactive({
  FromLineName: '',
  ToLineName: [] as string[],
});

const importForm = reactive({});

const fileList = ref<any[]>([]);

const excludeLabels = [t("publicText.index"), t("publicText.operation")];
const { getColumnWidth } = useTableColumnWidth(tableRef, tableData, {
  padding: 25,
  fontSize: 13,
  excludeLabels
});

const loadLineList = async () => {
  try {
    const res: any = await GetMESWorkLineNews({ WorkLineName: '' });
    if (res.Success) {
      lineList.value = res.Data || [];
    }
  } catch (error) {
    console.error('加载产线列表失败:', error);
  }
};

const getData = async () => {
  loading.value = true;
  try {
    const res: any = await GetLineFeederWidthNum(queryForm);
    if (res.Success) {
      tableData.value = res.Data.rows || [];
      total.value = res.Data.total || 0;
    } else {
      ElMessage.error(res.Message || t('message.queryFailure'));
    }
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  queryForm.PageIndex = 1;
  getData();
};

const handleReset = () => {
  queryForm.LineName = '';
  queryForm.Pn = '';
  queryForm.Width = '';
  queryForm.PageIndex = 1;
  getData();
};

const handleSizeChange = (val: number) => {
  queryForm.PageSize = val;
  queryForm.PageIndex = 1;
  getData();
};

const handleCurrentChange = (val: number) => {
  queryForm.PageIndex = val;
  getData();
};

const openAddDialog = () => {
  addForm.LineName = '';
  addForm.infolist = [{ Pn: '', Width: 0, feedernum: 0 }];
  addDialogVisible.value = true;
};

const handleAddRow = () => {
  addForm.infolist.push({ Pn: '', Width: 0, feedernum: 0 });
};

const handleRemoveRow = (index: number) => {
  addForm.infolist.splice(index, 1);
};

const handleAddDialogClose = () => {
  addDialogVisible.value = false;
  addFormRef.value?.resetFields();
};

const handleAdd = async () => {
  if (!addFormRef.value) return;
  try {
    await addFormRef.value.validate();
    if (addForm.infolist.length === 0) {
      ElMessage.warning(t('message.addFailure'));
      return;
    }
    const data = {
      LineName: addForm.LineName,
      infolist: addForm.infolist,
    };
    const res: any = await IULineFeederWidthNum(data);
    if (res.Success) {
      ElMessage.success(t('message.addSuccess'));
      addDialogVisible.value = false;
      getData();
    } else {
      ElMessage.error(res.Message || t('message.addFailure'));
    }
  } catch (error) {
    console.error('表单验证失败:', error);
  }
};

const openEditDialog = (row: any) => {
  editForm.LineName = row.Line || '';
  editForm.Pn = row.Pn || '';
  editForm.Width = row.Width || '';
  editForm.feedernum = row.feedernum || 0;
  editDialogVisible.value = true;
};

const handleEditDialogClose = () => {
  editDialogVisible.value = false;
  editFormRef.value?.resetFields();
};

const handleEdit = async () => {
  if (!editFormRef.value) return;
  try {
    await editFormRef.value.validate();
    const data = {
      LineName: editForm.LineName,
      infolist: [{
        Pn: editForm.Pn,
        Width: editForm.Width,
        feedernum: editForm.feedernum,
      }],
    };
    const res: any = await IULineFeederWidthNum(data);
    if (res.Success) {
      ElMessage.success(t('message.editSuccess'));
      editDialogVisible.value = false;
      getData();
    } else {
      ElMessage.error(res.Message || t('message.queryFailure'));
    }
  } catch (error) {
    console.error('表单验证失败:', error);
  }
};

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(t('Scheduling.abnormalMove.deleteConfirm'), t('message.tipTitle'), {
      confirmButtonText: t('publicText.confirm'),
      cancelButtonText: t('publicText.cancel'),
      type: 'warning',
    });
    const data = {
      LineName: row.Line,
      Pn: row.Pn,
      Width: row.Width,
    };
    const res: any = await DeleteLineFeederWidthNum(data);
    if (res.Success) {
      ElMessage.success(t('message.deleteSuccess'));
      getData();
    } else {
      ElMessage.error(res.Message || t('message.deleteFailure'));
    }
  } catch {
    // 用户取消删除
  }
};

const openCopyDialog = () => {
  copyForm.FromLineName = '';
  copyForm.ToLineName = [];
  copyDialogVisible.value = true;
};

const handleCopy = async () => {
  if (!copyForm.FromLineName) {
    ElMessage.warning(t('Scheduling.abnormalMove.selectFromLine'));
    return;
  }
  if (!copyForm.ToLineName || copyForm.ToLineName.length === 0) {
    ElMessage.warning(t('Scheduling.abnormalMove.selectToLine'));
    return;
  }
  const data = {
    FromLineName: copyForm.FromLineName,
    ToLineName: copyForm.ToLineName,
  };
  const res: any = await CopyLineFeederWidthNum(data);
  if (res.Success) {
    ElMessage.success(t('Scheduling.abnormalMove.copySuccess'));
    copyDialogVisible.value = false;
    getData();
  } else {
    ElMessage.error(res.Message || t('message.queryFailure'));
  }
};

const openImportDialog = () => {
  fileList.value = [];
  importDialogVisible.value = true;
};

const handleImportDialogClose = () => {
  importDialogVisible.value = false;
  importFormRef.value?.resetFields();
  fileList.value = [];
};

const handleFileChange = (uploadFile: any) => {
  // 文件选择后自动触发
};

const handleFileRemove = () => {
  fileList.value = [];
};

const handleExceed = () => {
  ElMessage.warning(t('message.fileLimitWarning'));
};

const handleUpload = async () => {
  if (fileList.value.length === 0) {
    ElMessage.warning(t('Scheduling.abnormalMove.selectFile'));
    return;
  }

  const file = fileList.value[0].raw;
  const reader = new FileReader();
  reader.onload = async (e) => {
    const base64Content = e.target?.result as string;
    const data = {
      FileName: file.name,
      FileConent: base64Content.split(',')[1],
      UserNo: userStore.getUserInfo,
    };
    console.log(data);
    const res: any = await UploadLineFeederWidthNum(data);
    if (res.Success) {
      ElMessage.success(t('Scheduling.abnormalMove.importSuccess'));
      handleImportDialogClose();
      getData();
    } else {
      ElMessage.error(res.Message || t('message.queryFailure'));
    }
  };
  reader.readAsDataURL(file);
};

onMounted(() => {
  getScreenHeight();
  window.addEventListener('resize', getScreenHeight);
  loadLineList();
  getData();
});
</script>

<style lang="scss" scoped>
.el-pagination {
    justify-content: center;
}
</style>
