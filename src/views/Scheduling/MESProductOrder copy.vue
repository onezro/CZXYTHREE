<template>
    <div class="p-2">
         <el-card shadow="always" :body-style="{ padding: '8px' }">
             <el-table :data="tableData.slice(
                (pageObj.currentPage - 1) * pageObj.pageSize,
                pageObj.currentPage * pageObj.pageSize
            )
                " size="small" :style="{ width: '100%' }" :height="tableHeight" :tooltip-effect="'dark'" border fit
               >
                 <template #empty>
                    <div class="flex items-center justify-center h-100%">
                        <el-empty />
                    </div>
                </template>
            </el-table>
            <div class="mt-2">
                <el-pagination :size="'small'" background @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :pager-count="5" :current-page="pageObj.currentPage"
                    :page-size="pageObj.pageSize" :page-sizes="[30, 50, 100, 200, 300]"
                    layout="total,sizes, prev, pager, next" :total="tableData.length">
                </el-pagination>
            </div>
         </el-card>
          <el-dialog :title="$t('publicText.add')" v-model="addVisible" width="80%" @close="addCancel">
             <el-form :model="addForm" ref="addFormRef" label-width="auto" :inline="false"></el-form>
               <template #footer>
                <el-button @click="addCancel">{{ $t("publicText.cancel") }}</el-button>
                <el-button type="primary" @click="addSubmit">{{
                    $t("publicText.confirm")
                }}</el-button>
            </template>
          </el-dialog>
              <el-dialog :title="$t('publicText.edit')" v-model="editVisible" width="80%" @close="editCancel">
                 <el-form :model="editForm" ref="editFormRef" label-width="auto" :inline="false"></el-form>
                <template #footer>
                 <el-button @click="editCancel">{{ $t("publicText.cancel") }}</el-button>
                 <el-button type="primary" @click="editSubmit">{{
                      $t("publicText.confirm")
                 }}</el-button>
                </template>
              </el-dialog>
    </div>
</template>

<script setup lang="ts">
import {
    ref,
    reactive,
    watch,
    computed,
    nextTick,
    onMounted,
    onBeforeMount,
    onBeforeUnmount,
} from "vue";
import { ElNotification, ElMessage, ElMessageBox } from "element-plus";
import { useUserStoreWithOut } from "@/stores/modules/user";
const userStore = useUserStoreWithOut();
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const tableHeight = ref(0);
const tableData = ref([]);

const pageObj = reactive({
    currentPage: 1,
    pageSize: 50,
});
const getForm=ref({
})
const addVisible=ref(false)
const editVisible=ref(false)
const addForm=ref({
})
const editForm=ref({
})
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
const getData=()=>{

}
const addCancel=()=>{
    addVisible.value=false
}
const addSubmit=()=>{

}
const editCancel=()=>{
    editVisible.value=false
}
const editSubmit=()=>{

}
const handleSizeChange = (val: any) => {
    pageObj.pageSize = val;
};
const handleCurrentChange = (val: any) => {
    pageObj.currentPage = val;
};
const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 180;
    });
};
</script>
<style scoped>
.el-pagination {
    justify-content: center;
}
</style>
<style lang="scss" scoped>

</style>