<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div class="mb-2">
        <el-button type="primary" @click="openAdd" size="small">添加</el-button>
      </div>
      <div class="w-full">
        <el-table size="small" :data="tableData" stripe border fit :height="tableHeight" row-key="ID"
          :tree-props="{ children: 'childMenu' }">

          <el-table-column prop="title" label="标题"> </el-table-column>
          <el-table-column prop="icon" label="图标" align="center" width="60">
            <template #default="scope">
              <el-icon :size="20" v-if="scope.row.icon">
                <component :is="scope.row.icon" />
              </el-icon>
            </template>
          </el-table-column>
          <el-table-column prop="path" label="路径"> </el-table-column>
          <el-table-column prop="MenuName" label="name"> </el-table-column>
          <el-table-column prop="component" label="vue文件路径"> </el-table-column>
          
          <el-table-column prop="sortId" label="排序" width="60" align="center">
            <!-- <template #default="scope">
              <el-input-number :min="0" size="small" style="width: 100px;" controls-position="right"
            v-model="scope.row.sortId" @change="changeSortd" />
              </template> -->
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="180" align="center">
            <template #default="scope">
              <el-tooltip content="复制" placement="top" v-if="
                scope.row.MenuName !== 'Portal' &&
                scope.row.MenuName !== 'PDA' &&
                scope.row.MenuName !== 'OPUI'
              ">
                <el-button type="warning" icon="CopyDocument" size="small"
                  @click.prevent="handleCopy(scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip content="编辑" placement="top" v-if="
                scope.row.MenuName !== 'Portal' &&
                scope.row.MenuName !== 'PDA' &&
                scope.row.MenuName !== 'OPUI'
              ">
                <el-button type="primary" icon="EditPen" size="small"
                  @click.prevent="handleEdit(scope.row)"></el-button>
              </el-tooltip>

              <el-tooltip content="删除" placement="top" v-if="
                scope.row.MenuName !== 'Portal' &&
                scope.row.MenuName !== 'PDA' &&
                scope.row.MenuName !== 'OPUI'
              ">
                <el-button type="danger" icon="Delete" size="small"
                  @click.prevent="handleDelete(scope.row)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
     
      </div>
    </el-card>
    <el-dialog :append-to-body="true" :close-on-click-modal="false" v-model="addVisible" align-center title="新增"
      width="40%" @close="addCancel">
      <el-form ref="formRef" :model="form" label-position="left" label-width="auto">
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="tabPosition" aria-label="label position">
            <el-radio-button value="目录">目录</el-radio-button>
            <el-radio-button value="菜单">菜单</el-radio-button>
          </el-radio-group></el-form-item>
        <el-form-item label="父级菜单" prop="chooseName">
          <el-select ref="selectUpResId" v-model="chooseName" placeholder="请选择" clearable>
            <el-option :value="chooseName" disabled style="overflow: auto; height: 100%">
              <el-tree style="min-height: 150px; max-height: 300px" :props="defaultProps" :data="tableData"
                node-key="id" :expand-on-click-node="false" :check-on-click-node="true" @node-click="handleNodeClick">
              </el-tree></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="MenuType">
          <el-select v-model="form.MenuType" placeholder="选择类型" style="width: 240px">
            <el-option v-for="item in list" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <!-- <el-input v-model="form.MenuType" placeholder="类型"></el-input> -->
        </el-form-item>
        <el-form-item label="菜单名称" prop="title"><el-input v-model="form.title" placeholder="请输入" /></el-form-item>
        <el-form-item label="图标" prop="icon"><el-input v-model="form.icon" placeholder="请输入图标" /></el-form-item>
        <el-form-item label="路径" prop="path"><el-input v-model="form.path" placeholder="请输入PATH路径" /></el-form-item>
        <el-form-item label="name" prop="MenuName"><el-input v-model="form.MenuName"
            placeholder="请输入路由名称name" /></el-form-item>
        <el-form-item label="重定向" prop="redirect"><el-input v-model="form.redirect"
            placeholder="请输入重定向" /></el-form-item>
        <el-form-item label="vue文件路径" prop="component"><el-input :disabled="fmeun" v-model="form.component"
            placeholder="请输入vue文件路径" /></el-form-item>
        <el-form-item label="排序" prop="sortId"><el-input-number :min="0" controls-position="right" v-model="form.sortId"
            placeholder="请输入" /></el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addCancel()">取消</el-button>
          <el-button type="primary" @click="onSubmit"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="修改" :append-to-body="true" :close-on-click-modal="false" @close="editCancel()"
      v-model="editVisible" width="50%">
      <el-form :model="editForm" label-width="auto">
        <el-form-item label="父级菜单">
          <el-select ref="selectUpResId" v-model="editPName" placeholder="请选择" clearable>
            <el-option :value="editPName" disabled style="overflow: auto; height: 100%">
              <el-tree style="min-height: 150px; max-height: 300px" :props="defaultProps" :data="tableData"
                node-key="id" :expand-on-click-node="false" :check-on-click-node="true" @node-click="handleENodeClick">
              </el-tree></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="MenuType">
          <!-- <el-input v-model="editForm.MenuType" placeholder="类型"></el-input> -->
          <el-select v-model="editForm.MenuType" placeholder="选择类型" style="width: 240px">
            <el-option v-for="item in list" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="PATH路径" prop="path">
          <el-input v-model="editForm.path" placeholder="路径"></el-input>
        </el-form-item>
        <el-form-item label="菜单标题" prop="title">
          <el-input v-model="editForm.title" placeholder="菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="vue文件路径" prop="component">
          <el-input :disabled="fmeun" v-model="editForm.component" placeholder="组件"></el-input>
        </el-form-item>
        <el-form-item label="name" prop="MenuName">
          <el-input v-model="editForm.MenuName" placeholder="name"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="editForm.icon" placeholder="图标"></el-input>
        </el-form-item>
        <el-form-item label="重定向" prop="redirect"><el-input v-model="editForm.redirect"
            placeholder="请输入" /></el-form-item>
        <el-form-item label="排序" prop="sortId"><el-input-number :min="0" controls-position="right"
            v-model="editForm.sortId" placeholder="请输入" /></el-form-item>
      </el-form>
      <template #footer>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="editSubmit()">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="复制" :append-to-body="true" :close-on-click-modal="false" @close="copyCancel()"
      v-model="copyVisible" width="50%">
      <el-form :model="copyform" label-width="auto" ref="copyRef">
        <el-form-item label="父级菜单">
          <el-select ref="selectUpResId" v-model="editPName" placeholder="请选择" clearable>
            <el-option :value="editPName" disabled style="overflow: auto; height: 100%">
              <el-tree style="min-height: 150px; max-height: 300px" :props="defaultProps" :data="tableData"
                node-key="id" :expand-on-click-node="false" :check-on-click-node="true" @node-click="handleCNodeClick">
              </el-tree></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="MenuType">
          <!-- <el-input v-model="editForm.MenuType" placeholder="类型"></el-input> -->
          <el-select v-model="copyform.MenuType" placeholder="选择类型" style="width: 240px">
            <el-option v-for="item in list" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="PATH路径" prop="path">
          <el-input v-model="copyform.path" placeholder="路径"></el-input>
        </el-form-item>
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="copyform.title" placeholder="菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="组件" prop="component">
          <el-input :disabled="fmeun" v-model="copyform.component" placeholder="组件"></el-input>
        </el-form-item>
        <el-form-item label="组件名称" prop="MenuName">
          <el-input v-model="copyform.MenuName" placeholder="组件名称"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="copyform.icon" placeholder="图标"></el-input>
        </el-form-item>
        <el-form-item label="重定向" prop="redirect"><el-input v-model="copyform.redirect"
            placeholder="请输入" /></el-form-item>
        <el-form-item label="排序" prop="sortId"><el-input-number :min="0" controls-position="right"
            v-model="copyform.sortId" placeholder="请输入" /></el-form-item>
      </el-form>
      <template #footer>
        <span slot="footer" class="dialog-footer">
          <el-button @click="copyCancel()">取消</el-button>
          <el-button type="primary" @click="copySubmit()">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox, ElTree } from "element-plus";

import { useUserStoreWithOut } from '@/stores/modules/user'
import { getFirstMeun, addMeun, deleteMeun, updateMeun } from "@/api/permiss";
import {
  ref,
  unref,
  nextTick,
  reactive,
  onBeforeMount,
  watch,
  onMounted,
  onBeforeUnmount,
} from "vue";
const userStore = useUserStoreWithOut()
const tableData = ref([]);
const pageSize = ref(10);
const currentPage = ref(1);
const tableHeight = ref(0);
const addVisible = ref(false);
const editVisible = ref(false);
const copyVisible = ref(false)
const copyRef = ref()
const tabPosition = ref("菜单");
const chooseName = ref("");
const fmeun = ref(false);
const selectUpResId = ref<any>(null);
const defaultProps = reactive({ label: "title", children: "childMenu" });
const form = ref({
  title: "",
  icon: "",
  path: "",
  MenuName: "",
  component: "",
  MenuLevel: 0,
  MenuType: '',
  MenuFID: "",
  redirect: "",
  sonNum: 0,
  sortId: 0,
  IsDelete: "",
  CreateBy: userStore.getUserInfo,
  CreateDate: "",
  UpdateBy: "",
  UpdateDate: "",
});
const copyform = ref({
  title: "",
  icon: "",
  path: "",
  MenuName: "",
  component: "",
  MenuLevel: 0,
  MenuType: '',
  MenuFID: "",
  redirect: "",
  sonNum: 0,
  sortId: 0,
  IsDelete: "",
  CreateBy: userStore.getUserInfo,
  CreateDate: "",
  UpdateBy: "",
  UpdateDate: "",
});
const editForm = reactive({
  path: "",
  title: "",
  component: "",
  MenuName: "",
  icon: "",
  MenuFID: "",
  MenuLevel: "",
  MenuType: '',
  redirect: "",
  id: "",
  sortId: 0,
  IsDelete: "",
  CreateBy: "",
  CreateDate: "",
  UpdateBy: userStore.getUserInfo,
  UpdateDate: "",
});
const editPName = ref("");
const editid = ref();
const formRef = ref()
const arrID = ref([] as any[]);
const list = reactive([{
  value: 'Portal',
  label: 'Portal'
}, {
  value: 'PDA',
  label: 'PDA'
}, {
  value: 'OPUI',
  label: 'OPUI'
}])
onBeforeMount(() => {
  getScreenHeight();
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  getData();
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

watch(
  () => tabPosition.value,
  (newValue) => {
    if (newValue == "目录") {
      fmeun.value = false;
      form.value.MenuLevel = 0;
      // form.component = "Layout";
    } else {
      fmeun.value = false;
      form.value.component = "";
    }
  }
);

const getData = () => {
  getFirstMeun().then((data: any) => {
    // console.log(JSON.parse(data.content));
    tableData.value = data.content
  });
};
const openAdd = () => {
  addVisible.value = true;
};
const addCancel = () => {
  addVisible.value = false
  chooseName.value = ''
  formRef.value.resetFields();
}
const handleNodeClick = (data: any) => {
  chooseName.value = data.title;
  form.value.MenuFID = data.ID;
  form.value.MenuLevel = data.MenuLevel + 1;
  selectUpResId.value.blur();
};
const onSubmit = () => {
  // console.log(form);
  addMeun(form.value).then((res) => {
    // console.log(res.data);
    getData();
    addVisible.value = false;
  });
};
const handleCopy = (row: any) => {
  // console.log(row);
  copyform.value = { ...row }
  if (row.MenuFID != null) {
    findNameById(row.MenuFID, tableData.value);
  }
  // console.log(copyform.value);
  // form.value = { ...row }
  copyVisible.value = true;
}
const copyCancel = () => {
  copyVisible.value = false
  copyRef.value.resetFields();
}
const copySubmit = () => {
  // console.log(copyform.value);
  addMeun(copyform.value).then((res) => {
    // console.log(res.data);
    getData();
    copyVisible.value = false;
  });
}

const handleCNodeClick = (data:any) => {
  editPName.value = data.title;
  copyform.value.MenuFID = data.ID;
  copyform.value.MenuLevel = data.MenuLevel;
  selectUpResId.value.blur();
}
const handleEdit = async (row: any) => {
  editForm.MenuFID = row.MenuFID;
  editForm.MenuLevel = row.MenuLevel;
  editForm.MenuName = row.MenuName;
  editForm.component = row.component;
  editForm.icon = row.icon;
  editForm.path = row.path;
  editForm.title = row.title;
  editForm.redirect = row.redirect;
  editForm.id = row.ID;
  editForm.sortId = row.sortId;
  editForm.MenuType = row.MenuType
  editVisible.value = true;
  if (row.MenuFID != null) {
    findNameById(row.MenuFID, tableData.value);
  }
};
const handleENodeClick = (data: any) => {
  // console.log(data)
  editPName.value = data.title;
  editForm.MenuFID = data.ID;
  editForm.MenuLevel = data.MenuLevel;
  selectUpResId.value.blur();
};
const handleDelete = (row: any) => {
  ElMessageBox.confirm("确定删除", "确认操作", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      // console.log(row.id)
      arrID.value.unshift(row.ID);
      // row.sonNum!=null? dataDispose(row):false
      // console.log(arrID.value);
      arrID.value.forEach((item) => {
        deleteMeun(item).then(({ data }) => {
          // console.log(data);
          arrID.value = arrID.value.filter((ID) => ID != item);
          // console.log(this.arrID);
          if (arrID.value.length == 0) {
            getData();
          }
        });
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消操作",
      });
    });
};
const editCancel = () => {
  editVisible.value = false;
};
const editSubmit = () => {
  updateMeun(editForm).then((res) => {
    // console.log(res);
    editVisible.value = false;
    getData();
  });
};
const changeSortd=(row:any)=>{
  console.log(row);
  
  // editForm.MenuFID = row.MenuFID;
  // editForm.MenuLevel = row.MenuLevel;
  // editForm.MenuName = row.MenuName;
  // editForm.component = row.component;
  // editForm.icon = row.icon;
  // editForm.path = row.path;
  // editForm.title = row.title;
  // editForm.redirect = row.redirect;
  // editForm.id = row.id;
  // editForm.sortId = row.sortId;
  // editForm.MenuType = row.MenuType
  // if (row.MenuFID != null) {
  //   findNameById(row.MenuFID, tableData.value);
  // }
  // updateMeun(editForm).then((res) => {
  //   // console.log(res);
  //   editVisible.value = false;
  //   getData();
  // });
}
const findNameById = (id: any, data: any) => {
  data.forEach((x: any, i: any) => {
    if (data[i].ID == id) {
      editPName.value = data[i].title
      return //名称
    } else if (data[i].childMenu) {
      const resultData = void findNameById(id, data[i].childMenu);
      if (resultData) {
        editPName.value = resultData
        return
      }
    }
  });
};
const dataDispose = (row: any) => {
  // console.log(row.sonNum)
  if (row.sonNum != null) {
    row.childMenu.forEach((item: any) => {
      arrID.value.unshift(row.id);
      if (item.sonNum != 0) {
        return dataDispose(item);
      }
    });
  } else {
    return;
  }
};
const handleSizeChange = (val: any) => {
  currentPage.value = 1;
  pageSize.value = val;
};
const handleCurrentChange = (val: any) => {
  currentPage.value = val;
};
const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 154;
    //后面的50：根据需求空出的高度，自行调整
  });
};
</script>

<style lang="scss" scoped></style>
<style scoped>
.el-pagination {
  justify-content: center;
}
</style>
