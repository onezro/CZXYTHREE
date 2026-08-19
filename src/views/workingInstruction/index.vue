<template>
  <div class="puzzles p-2">
    <el-card :body-style="{ padding: '8px' }">
      <el-form :inline="true" class="flex justify-between" size="small" @submit.prevent>
        <el-form-item>
          <el-button type="primary" @click="openAdd">{{ t('publicText.add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-input v-model="getForm.SearchModel.ProductName" clearable :placeholder="t('publicText.pleaseInput')"
            @keyup.enter="getData" style="width: 350px">
            <template #append>
              <el-button type="primary" icon="Search" @click="getData"></el-button>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" ref="tableRef" border :height="tableHeight" size="small" style="width: 100%" :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }">
        <el-table-column :label="t('publicText.index')" width="55" fixed align="center">
          <template #default="scope">
            <span>{{
              scope.$index + 1 + (getForm.PageIndex - 1) * getForm.PageSize
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="prosop_product" :label="t('workingInstruction.productCode')"
          :min-width="getColumnWidth('prosop_product')"> </el-table-column>
        <el-table-column prop="prosop_name" :label="t('workingInstruction.workInstruction')"
          :min-width="getColumnWidth('prosop_name')">
          <template #default="scope">
            <div style="text-decoration: underline; cursor: pointer;"
              @click="getPdfSrc(scope.row.prosop_guid, scope.row.prosop_name)">
              {{ scope.row.prosop_name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="prosop_name2" :label="t('workingInstruction.productionCondition')"
          :min-width="getColumnWidth('prosop_name2')">
          <template #default="scope">
            <div style="text-decoration: underline; cursor: pointer;"
              @click="getPdfSrc(scope.row.prosop_guid2, scope.row.prosop_name2)">
              {{ scope.row.prosop_name2 }}
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" :label="t('publicText.operation')" width="120" align="center">
          <template #default="scope">
            <el-button type="primary" size="small" icon="Edit" @click="handleEdit(scope.row)"></el-button>
            <el-button type="danger" size="small" icon="Delete" @click="handleDelete(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="block" style="margin-top: 8px">
        <el-pagination size="small" background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="getForm.PageIndex" :page-size="getForm.PageSize" :page-sizes="[10, 20, 50, 100, 150]"
          layout="total,sizes, prev, pager, next" :total="total">
        </el-pagination>
      </div>
    </el-card>
    <el-dialog :title="t('publicText.add')" v-model="dialogVisible" width="800px" @close="resetUpload">
      <el-form ref="formRef" :inline="true" label-position="left" label-width="auto">
        <div class="pdf-upload-container">
          <el-card class="upload-card">
            <template #header>
              <span>{{ t('workingInstruction.pdfUpload') }}</span>
            </template>

            <el-form :inline="true" @submit.prevent label-width="auto">
              <el-form-item :label="t('workingInstruction.productCode')" class="mb-3">
                <el-input :placeholder="t('workingInstruction.inputProductCode')" clearable v-model="productName">
                </el-input>
              </el-form-item>
              <el-row :gutter="20" class="mb-3">
                <el-col :span="18" :offset="0">
                  <el-form-item class="file1" :label="t('workingInstruction.workInstruction')">
                    <el-input v-model="customNames[0]" clearable style="width: 400px">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" :offset="0"><el-upload action="#" multiple :limit="1" :file-list="fileListUp1"
                    :auto-upload="false" :on-change="file1UpChange" :on-remove="file1UpRemove"
                    :before-upload="beforeUpload" accept=".pdf" ref="upload1Ref" class="upload-area">
                    <el-button size="small" type="primary">{{ t('workingInstruction.uploadWorkInstruction')
                      }}</el-button>
                  </el-upload>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="18" :offset="0">
                  <el-form-item class="file2" :label="t('workingInstruction.productionCondition')">
                    <el-input v-model="customNames[1]" clearable style="width: 400px">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" :offset="0">
                  <el-upload action="#" multiple :limit="1" :file-list="fileListUp2" :auto-upload="false"
                    :on-change="file2UpChange" :on-remove="file2UpRemove" :before-upload="beforeUpload" accept=".pdf"
                    ref="upload2Ref" class="upload-area">
                    <el-button size="small" type="primary">{{ t('workingInstruction.uploadProductionCondition')
                      }}</el-button>
                  </el-upload>
                </el-col>
              </el-row>
            </el-form>
          </el-card>
        </div>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ t('publicText.cancel') }}</el-button>
        <el-button type="primary" @click="upLoad" :disabled="(fileListUp1.length === 0 && fileListUp2.length === 0) ||
          productName === ''
          ">{{ t('publicText.confirm') }}</el-button>
      </template>
    </el-dialog>
    <el-dialog :title="t('publicText.edit')" v-model="editVisible" width="800px" @close="resetEdit">
      <el-form ref="editFormRef" :model="editForm" label-position="left" label-width="auto">
        <div class="pdf-upload-container">
          <el-card class="upload-card">
            <template #header>
              <span>{{ t('workingInstruction.pdfUpload') }}</span>
            </template>
            <el-form>
              <el-form-item :label="t('workingInstruction.productCode')">
                <el-input placeholder="" disabled v-model="editForm.ProductName"></el-input>
              </el-form-item>
              <el-form-item :label="t('workingInstruction.onlyModifyWorkInstructionName')">
                <el-checkbox v-model="editForm.upfilename1"></el-checkbox>
              </el-form-item>
              <el-form-item :label="t('workingInstruction.onlyModifyConditionName')">
                <el-checkbox v-model="editForm.upfilename2"></el-checkbox>
              </el-form-item>
            </el-form>

            <el-form :inline="true" @submit.prevent label-width="auto">
              <el-row :gutter="20" class="mb-3">
                <el-col :span="18" :offset="0">
                  <el-form-item class="file1" :label="t('workingInstruction.workInstruction')">
                    <el-input v-model="editForm.filename1" clearable style="width: 400px">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" :offset="0">
                  <el-upload action="#" multiple :limit="1" :file-list="fileListEdit1" :auto-upload="false"
                    :on-change="file1EditChange" :on-remove="file1EditRemove" :before-upload="beforeUpload"
                    accept=".pdf" ref="uploadEdit1Ref" class="upload-area" v-if="!editForm.upfilename1">
                    <el-button size="small" type="primary">{{ t('workingInstruction.selectWorkInstruction')
                      }}</el-button>
                  </el-upload>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="18" :offset="0">
                  <el-form-item class="file2" :label="t('workingInstruction.productionCondition')">
                    <el-input v-model="editForm.filename2" clearable style="width: 400px">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" :offset="0">
                  <el-upload action="#" multiple :limit="1" :file-list="fileListEdit2" :auto-upload="false"
                    :on-change="file2EditChange" :on-remove="file2EditRemove" :before-upload="beforeUpload"
                    accept=".pdf" ref="uploadEdit2Ref" class="upload-area" v-if="!editForm.upfilename2">
                    <el-button size="small" type="primary">{{ t('workingInstruction.selectProductionCondition')
                      }}</el-button>
                  </el-upload>
                </el-col>
              </el-row>
            </el-form>
          </el-card>
        </div>
      </el-form>
      <template #footer>
        <el-button @click="editVisible = false">{{ t('publicText.cancel') }}</el-button>
        <el-button type="primary" @click="edit">{{ t('publicText.confirm') }}</el-button>
      </template>
    </el-dialog>
    <el-dialog :title="t('workingInstruction.browse')" v-model="browseVisible" width="1000px">
      <template #header>
        <div class="dialog-header">
          <el-button type="primary" size="small" class="ml-5" @click="downLoadPdf">{{ t('publicText.dawnload')
            }}</el-button>
          <el-button type="primary" size="small" class="ml-5" @click="srcFull">{{ t('workingInstruction.fullScreen')
            }}</el-button>
        </div>
      </template>

      <div style="width: 100%; height: 600px" id="src">
        <div class="full" ref="myElementRef">
          <el-form :inline="true" size="small" @submit.prevent>
            <el-form-item>
              <el-button type="primary" size="small" class="ml-5" @click="srcFull">{{ t('workingInstruction.fullScreen')
                }}</el-button>
            </el-form-item>
          </el-form>
        </div>
        <iframe :src="pdfsrc || ''" style="width: 100%; height: 100%"></iframe>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import screenfull from "screenfull";
import {
  InsertXYLProductSOPNew,
  QueryXYLProductSOP,
  DeleteXYLProductSOP,
  UpdateXYLProductSOPNew,
} from "@/api/workingInstruction/index";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { useI18n } from "vue-i18n";
import { ElMessage, ElMessageBox, ElNotification, ElLoading } from "element-plus";
import { ref, reactive, watch, onBeforeMount, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";

const { t } = useI18n();
const userStore = useUserStoreWithOut();

const tableRef = ref();
const tableData = ref<any[]>([]);
const total = ref(0);
const tableHeight = ref(0);
const getForm = reactive({
  PageIndex: 1,
  PageSize: 20,
  SearchModel: {
    ProductName: "",
  },
});
const dialogVisible = ref(false);
const editVisible = ref(false);
const browseVisible = ref(false);
const pdfsrc = ref<string | null>(null);
const pdfName = ref("");
const formRef = ref();
const editFormRef = ref();
const upload1Ref = ref<any>(null);
const upload2Ref = ref<any>(null);
const uploadEdit1Ref = ref<any>(null);
const uploadEdit2Ref = ref<any>(null);
const myElementRef = ref<HTMLElement | null>(null);

const editForm = reactive({
  ProductName: "",
  upfilename1: true,
  filename1: "",
  base64String1: "",
  upfilename2: true,
  filename2: "",
  base64String2: "",
  UserNo: "",
});

const fileListUp1 = ref<any[]>([]);
const fileListUp2 = ref<any[]>([]);
const fileListEdit1 = ref<any[]>([]);
const fileListEdit2 = ref<any[]>([]);
const customNames = ref(["", ""]);
const customNamesEdit = ref(["", ""]);
const productName = ref("");
const isFullscreen = ref(true);
const isFull = ref(false);
let loadingInstance: any = null;

const { getColumnWidth } = useTableColumnWidth(tableRef, tableData, {
  excludeLabels: [t("publicText.index"), t("publicText.operation")],
});

const getData = () => {
  QueryXYLProductSOP(getForm).then((res: any) => {
    if (res.Success) {
      tableData.value = res.Data.list;
      total.value = res.Data.Total;
    } else {
      tableData.value = [];
      total.value = 0;
    }
  });
};

const getPdfSrc = (guid: string, name: string) => {
  pdfsrc.value = `http://172.20.99.21:5998/SOPAddress/${guid}.pdf`;
  pdfName.value = name;
  browseVisible.value = true;
};

const downLoadPdf = async () => {
  const response = await fetch(pdfsrc.value || "");
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = pdfName.value;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
};

const openAdd = () => {
  dialogVisible.value = true;
};

const handleDelete = (row: any) => {
  ElMessageBox.confirm(t("workingInstruction.confirmDelete"), t("message.tipTitle"), {
    type: "warning",
  })
    .then(() => {
      DeleteXYLProductSOP({
        ProductName: row.prosop_product,
        UserNo: userStore.getToken(),
      }).then((res: any) => {
        if (res.Success) {
          ElMessage({
            message: res.Msg,
            type: "success",
          });
          getData();
        } else {
          ElMessage.warning(res.Msg);
        }
      });
    })
    .catch(() => {
      ElNotification({
        type: "info",
        title: t("message.tipTitle"),
        message: t("workingInstruction.cancelledDelete"),
      });
    });
};

const handleEdit = (row: any) => {
  editVisible.value = true;
  editForm.ProductName = row.prosop_product;
  editForm.filename1 = row.prosop_name;
  editForm.filename2 = row.prosop_name2;
  customNamesEdit.value = [row.prosop_name, row.prosop_name2];
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

const handleKeyDown = () => {
  if (document.fullscreenElement) {
    isFullscreen.value = true;
    if (myElementRef.value) {
      myElementRef.value.style.opacity = "1";
      myElementRef.value.style.height = "auto";
    }
  } else {
    isFullscreen.value = false;
    if (myElementRef.value) {
      myElementRef.value.style.opacity = "0";
      myElementRef.value.style.height = "0";
    }
  }
};

const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 190;
  });
};

const srcFull = () => {
  let full = document.fullscreenElement;
  if (!full) {
    isFullscreen.value = true;
    isFull.value = false;
    if (myElementRef.value) {
      myElementRef.value.style.opacity = "1";
      myElementRef.value.style.height = "auto";
    }
  } else {
    isFullscreen.value = false;
    isFull.value = true;
    if (myElementRef.value) {
      myElementRef.value.style.opacity = "0";
      myElementRef.value.style.height = "0";
    }
  }

  let fullDiv = document.getElementById("src");
  if (fullDiv) {
    screenfull.toggle(fullDiv);
    isFullscreen.value = false;
  } else {
    if (!screenfull.isEnabled) {
      // do nothing
    }
    screenfull.toggle();
  }
};

const resetUpload = () => {
  productName.value = "";
  upload1Ref.value?.clearFiles();
  upload2Ref.value?.clearFiles();
  fileListUp1.value = [];
  fileListUp2.value = [];
  customNames.value = ["", ""];
};

const resetEdit = () => {
  editForm.ProductName = "";
  editForm.upfilename1 = true;
  editForm.filename1 = "";
  editForm.base64String1 = "";
  editForm.upfilename2 = true;
  editForm.filename2 = "";
  editForm.base64String2 = "";
  editForm.UserNo = "";
  fileListEdit1.value = [];
  fileListEdit2.value = [];
};

const beforeUpload = (file: File) => {
  const isPDF = file.type === "application/pdf";
  const isLt5M = file.size / 1024 / 1024 < 5;

  if (!isPDF) {
    ElMessage.error(t("workingInstruction.onlyPdf"));
    return false;
  }
  if (!isLt5M) {
    ElMessage.error(t("workingInstruction.fileSizeLimit"));
    return false;
  }
  return true;
};

const file1UpChange = (file: any, fileList: any[]) => {
  if (fileList.length > 1) {
    fileList.splice(1, fileList.length - 1);
    ElMessage.warning(t("workingInstruction.maxOneFile"));
  }
  fileListUp1.value = fileList;
  customNames.value[0] = file.name;
};

const file1UpRemove = (file: any, fileList: any[]) => {
  fileListUp1.value = fileList;
  customNames.value[0] = "";
};

const file2UpChange = (file: any, fileList: any[]) => {
  if (fileList.length > 1) {
    fileList.splice(1, fileList.length - 1);
    ElMessage.warning(t("workingInstruction.maxOneFile"));
  }
  fileListUp2.value = fileList;
  customNames.value[1] = file.name;
};

const file2UpRemove = (file: any, fileList: any[]) => {
  fileListUp2.value = fileList;
  customNames.value[1] = "";
};

const upLoad = () => {
  if (fileListUp1.value.length === 0 && fileListUp2.value.length === 0) {
    ElMessage.warning(t("workingInstruction.selectFileFirst"));
    return;
  }

  const formData = new FormData();
  if (fileListUp1.value.length !== 0) {
    formData.append("filename1", customNames.value[0]);
    formData.append("base64String1", fileListUp1.value[0].raw, customNames.value[0]);
  }
  if (fileListUp2.value.length !== 0) {
    formData.append("filename2", customNames.value[1]);
    formData.append("base64String2", fileListUp2.value[0].raw, customNames.value[1]);
  }
  formData.append("ProductName", productName.value);
  formData.append("UserNo", userStore.getToken());
  InsertXYLProductSOPNew(formData).then((res: any) => {
    if (res.Code == 200) {
      ElMessage({
        message: res.Msg,
        type: "success",
      });
      dialogVisible.value = false;
      getData();
    } else {
      ElMessage.error(res.Msg);
    }

  });
};

const file1EditChange = (file: any, fileList: any[]) => {
  if (fileList.length > 1) {
    fileList.splice(1, fileList.length - 1);
    ElMessage.warning(t("workingInstruction.maxOneFile"));
  }
  fileListEdit1.value = fileList;
  editForm.filename1 = file.name;
};

const file1EditRemove = (file: any, fileList: any[]) => {
  fileListEdit1.value = fileList;
  editForm.filename1 = "";
};

const file2EditChange = (file: any, fileList: any[]) => {
  if (fileList.length > 1) {
    fileList.splice(1, fileList.length - 1);
    ElMessage.warning(t("workingInstruction.maxOneFile"));
  }
  fileListEdit2.value = fileList;
  editForm.filename2 = file.name;
};

const file2EditRemove = (file: any, fileList: any[]) => {
  fileListEdit2.value = fileList;
  editForm.filename2 = "";
};

const edit = () => {
  if (fileListEdit1.value.length === 0 && !editForm.upfilename1) {
    ElMessage.warning(t("workingInstruction.selectFileFirst"));
    return;
  }
  if (fileListEdit2.value.length === 0 && !editForm.upfilename2) {
    ElMessage.warning(t("workingInstruction.selectFileFirst"));
    return;
  }
  if (editForm.filename1 == "") {
    ElMessage.warning(t("workingInstruction.fileNameEmpty"));
    return;
  }
  if (editForm.filename2 == "") {
    ElMessage.warning(t("workingInstruction.fileNameEmpty"));
    return;
  }

  const formData = new FormData();
  formData.append("filename1", editForm.filename1);
  if (fileListEdit1.value.length !== 0) {
    formData.append("file1", fileListEdit1.value[0].raw, editForm.filename1);
  }
  formData.append("filename2", editForm.filename2);
  if (fileListEdit2.value.length !== 0) {
    formData.append("file2", fileListEdit2.value[0].raw, editForm.filename2);
  }
  formData.append("ProductName", editForm.ProductName);
  formData.append("upfilename1", String(editForm.upfilename1));
  formData.append("upfilename2", String(editForm.upfilename2));
  formData.append("UserNo", userStore.getToken());

  UpdateXYLProductSOPNew(formData).then((res: any) => {
    if (res.Code == 200) {
      ElMessage({
        message: res.Msg,
        type: "success",
      });
      editVisible.value = false;
      getData();
    } else {
      ElMessage.error(res.Msg);
    }
   
  });
};



watch(() => editForm.upfilename1, (val) => {
  if (val) {
    editForm.filename1 = customNamesEdit.value[0];
  } else {
    editForm.filename1 = "";
    fileListEdit1.value = [];
  }
});

watch(() => editForm.upfilename2, (val) => {
  if (val) {
    editForm.filename2 = customNamesEdit.value[1];
  } else {
    editForm.filename2 = "";
    fileListEdit2.value = [];
  }
});

onBeforeMount(() => {
  getScreenHeight();
  getData();
});

onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  window.addEventListener("fullscreenchange", handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", getScreenHeight);
  window.removeEventListener("fullscreenchange", handleKeyDown);
});
</script>

<style lang="scss" scoped>
.puzzles {
  padding: 8px;

  .table_header {
    margin-bottom: 8px;
  }
}

.form-section {

  // margin-bottom: 20px;
  .section-title {
    color: #409eff;
    font-size: 16px;
    margin: 0 0 16px 0;
    padding-bottom: 8px;
    border-bottom: 1px solid #eee;
  }

  .sub-title {
    font-size: 12px;
    color: #409eff;
    margin-bottom: 6px;
    padding-left: 4px;
  }

  .vertical-divider {
    position: absolute;
    left: 50%;
    top: 40px;
    bottom: 20px;
    width: 1px;
    background: #eee;
  }
}

:deep(.el-dialog) {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
}

:deep(.el-dialog .el-dialog__body) {
  flex: 1;
  overflow: auto;
}

.action-buttons {
  margin-top: 10px;
}

.file-item {
  width: 620px;
}

:deep(.el-form-item) {
  margin-bottom: 10px;
}

/* 自定义头部样式 */
.dialog-header {
  display: flex;
  //justify-content: space-between;
  align-items: center;
  width: 100%;
}

/* 固定按钮在顶部右侧 */
.top-button {
  position: absolute;
  right: 20px;
  top: 12px;
}

.upload {
  display: flex;
  justify-content: space-between;

  .file1 {
    width: 50%;
  }

  .file2 {
    width: 50%;
  }
}

.upload-name {
  display: flex;
  justify-content: space-between;

  .file1 {
    width: 50%;
  }

  .file2 {
    width: 50%;
  }
}

.full {
  width: 100%;
  height: 0;
  background-color: #4a4a4acf;
  overflow: hidden;
  opacity: 0;

  .el-form-item {
    margin-bottom: 0;
  }
}
</style>
