<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between">
                <el-form ref="formRef" :model="getForm" label-width="auto" :inline="true" :size="'small'"
                    @submit.native.prevent>
                    <el-form-item :label="t('Scheduling.planCategoryOne.SelectType')" prop="SelectType" class="mb-2">
                        <el-input v-model="getForm.SelectType" clearable @clear="getData" @keyup.enter.native="getData"
                            style="width: 200px" />
                    </el-form-item>
                     <el-form-item :label="t('Scheduling.planCategoryOne.SelectType2')" prop="SelectType2" class="mb-2">
                        <el-input v-model="getForm.SelectType2" clearable @clear="getData" @keyup.enter.native="getData"
                            style="width: 200px" />
                    </el-form-item>
                    <el-form-item class="mb-2">
                        <el-button :type="'primary'" @click="getData">{{
                            t("publicText.query")
                        }}</el-button>
                    </el-form-item>
                </el-form>
                <div>
                    <el-button type="warning" size="small" @click="openAdd">{{
                        t("publicText.add")
                    }}</el-button>
                </div>
            </div>
            <el-table :data="tableData.slice(
                (pageObj.currentPage - 1) * pageObj.pageSize,
                pageObj.currentPage * pageObj.pageSize,
            )
                " size="small" ref="eltableRef" :style="{ width: '100%' }" :height="tableHeight"
                :tooltip-effect="'dark'" border fit highlight-current-row>
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{
                            scope.$index + pageObj.pageSize * (pageObj.currentPage - 1) + 1
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="SelectType" fixed :label="$t('Scheduling.planCategoryOne.SelectType')"
                    :min-width="getColumnWidth1('SelectType')" />
                 <el-table-column prop="SelectType2" fixed :label="$t('Scheduling.planCategoryOne.SelectType2')"
                    :min-width="getColumnWidth1('SelectType2')" />
                <el-table-column :label="$t('publicText.operation')" :fixed="'right'" width="120">
                    <template #default="{ row }">
                        <el-button size="small" type="primary" @click="openEdit(row)">
                            {{ $t("publicText.edit") }}
                        </el-button>
                        <el-button size="small" type="danger" @click="handleDelete(row)">
                            {{ $t("publicText.delete") }}
                        </el-button>
                    </template>
                </el-table-column>
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
        <!-- 新增对话框 -->
        <el-dialog :title="t('publicText.add')" v-model="addVisible" width="500px" :close-on-click-modal="false"
            @closed="handleAddDialogClosed">
            <el-form ref="addFormRef" :model="addForm" :rules="formRules" label-width="auto">

                <el-form-item :label="t('Scheduling.planCategoryOne.SelectType')" prop="SelectType">
                   <el-select v-model="addForm.SelectType" clearable filterable :placeholder="t('message.pleaseInput') +
                        t('Scheduling.planCategoryOne.SelectType')">
                        <el-option v-for="item in SelectTypeList" :key="item.Guid" :label="item.SelectType"
                            :value="item.SelectType" />
                    </el-select>
                </el-form-item>
                  <el-form-item :label="t('Scheduling.planCategoryOne.SelectType2')" prop="SelectType2">
                    <el-input v-model="addForm.SelectType2" :placeholder="t('message.pleaseInput') +
                        t('Scheduling.planCategoryOne.SelectType')
                        " clearable />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="addVisible = false">{{
                        t("publicText.cancel")
                    }}</el-button>
                    <el-button type="primary" @click="submitAdd">{{
                        t("publicText.confirm")
                    }}</el-button>
                </div>
            </template>
        </el-dialog>
        <!-- 编辑对话框 -->
        <el-dialog :title="t('publicText.edit')" v-model="editVisible" width="500px" :close-on-click-modal="false"
            @closed="handleEditDialogClosed">
            <el-form ref="editFormRef" :model="editForm" :rules="formRules" label-width="auto" :size="'small'">
                <el-form-item :label="t('Scheduling.planCategoryOne.SelectType')" prop="SelectType">
                    <el-input v-model="editForm.SelectType" :placeholder="t('message.pleaseInput') +
                        t('Scheduling.planCategoryOne.SelectType')
                        " clearable />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="editVisible = false" size="small">{{
                        t("publicText.cancel")
                    }}</el-button>
                    <el-button type="primary" @click="submitEdit" size="small">{{
                        t("publicText.confirm")
                    }}</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import {
    GetWorkLineCalendarSelectTypeLevelOne,
    GetWorkLineCalendarSelectTypeLevelTwo,
    AddWorkLineCalendarSelectTypeLevelTwo,
    UpdateWorkLineCalendarSelectTypeLevelTwo,
    DeleteWorkLineCalendarSelectTypeLevelTwo,
} from "@/api/Scheduling/lineCalendar";
import { calculateColumnsWidth } from "@/utils/tableminWidth";
import {
    ref,
    reactive,
    computed,
    nextTick,
    onMounted,
    onBeforeMount,
    onBeforeUnmount,
} from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { useI18n } from "vue-i18n";

const userStore = useUserStoreWithOut();
const { t } = useI18n();
const tableHeight = ref(0);
const eltableRef = ref();
const tableData = ref([]);
const getForm = reactive({
    SelectType: "",
    SelectType2: "",
    UserNo: "",
});
const pageObj = reactive({
    currentPage: 1,
    pageSize: 50,
});
const addForm = ref({
    SelectType: "",
    SelectType2: "",
    UserNo: userStore.getUserInfo,
});
const editForm = ref({
    Guid: "",
    SelectType: "",
    UserNo: userStore.getUserInfo,
});
const addVisible = ref(false);
const editVisible = ref(false);
const addFormRef = ref();
const editFormRef = ref();
const formRules = reactive({
    SelectType: [
        {
            required: true,
            message:
                t("message.pleaseInput") + t("Scheduling.planCategoryOne.SelectType"),
            trigger: "blur",
        },
    ],
});
const SelectTypeList=ref<any[]>([])



const openAdd = () => {
    addForm.value.SelectType = "";
    addVisible.value = true;
};
const handleAddDialogClosed = () => {
    addForm.value.SelectType = "";
    addVisible.value = false;
};
const submitAdd = () => {
    addFormRef.value.validate((valid: any) => {
        if (valid) {
            AddWorkLineCalendarSelectTypeLevelTwo(addForm.value).then((res: any) => {
                if (res.Success) {
                    ElMessage.success(t("message.addSuccess"));
                    getData();
                    addVisible.value = false;
                } else {
                    ElMessage.error(res.Message || t("message.addFailure"));
                }
            });
        } else {
            // ElMessage.warning("");
            return;
        }
    });
};
const openEdit = (row: any) => {
    editForm.value.Guid = row.Guid;
    editForm.value.SelectType = row.SelectType;
    editVisible.value = true;
};
const handleEditDialogClosed = () => {
    editForm.value.Guid = "";
    editForm.value.SelectType = "";
    editVisible.value = false;
};
const submitEdit = () => {
    editFormRef.value.validate((valid: any) => {
        if (valid) {
            UpdateWorkLineCalendarSelectTypeLevelTwo(editForm.value).then(
                (res: any) => {
                    if (res.Success) {
                        ElMessage.success(t("message.editSuccess"));
                        getData();
                        editVisible.value = false;
                    } else {
                        ElMessage.error(res.Message || t("message.editFailure"));
                    }
                },
            );
        } else {
            // ElMessage.warning("");
            return;
        }
    });
};
const handleDelete = (row: any) => {
    ElMessageBox.confirm(
        `${t("publicText.confirm")}${t("publicText.delete")}【${row.SelectType}】?`,
        t("publicText.confirm"),
        {
            confirmButtonText: t("publicText.confirm"),
            cancelButtonText: t("publicText.cancel"),
            type: "warning",
        },
    )
        .then(() => {
            DeleteWorkLineCalendarSelectTypeLevelTwo({
                Guid: row.Guid,
                SelectType: row.SelectType,
                SelectType2: row.SelectType2,
                UserNo: userStore.getUserInfo,
            }).then((res: any) => {
                if (res.Success) {
                    ElMessage.success(t("message.deleteSuccess"));
                    getData();
                } else {
                    ElMessage.error(res.Message || t("message.deleteFailure"));
                }
            });
        })
        .catch(() => {
            ElMessage.info(t("publicText.cancel"));
        });
};
const getData = () => {
    GetWorkLineCalendarSelectTypeLevelTwo(getForm).then((res: any) => {
        if (res.Success) {
            tableData.value = res.Data || [];
        } else {
            tableData.value = [];
        }
    });
};
const getSelectTypeList=()=>{
    GetWorkLineCalendarSelectTypeLevelOne({ SelectType: "",
    UserNo: "",}).then((res:any)=>{
        if(res.Success){
            SelectTypeList.value=res.Data||[]
        }else{
            SelectTypeList.value=[]
        }
    })
}
const handleSizeChange = (val: any) => {
    pageObj.pageSize = val;
};
const handleCurrentChange = (val: any) => {
    pageObj.currentPage = val;
};
// ==================== 列宽自适应 ====================
const columnWidths1 = computed(() => {
    if (!eltableRef.value) return {};
    let columns: any = [];
    columns = eltableRef.value.columns
        .map((item: any) => {
            return {
                prop: item.property,
                label: item.label,
            };
        })
        .filter(
            (item: any) =>
                item.label !== t("publicText.index") &&
                item.label !== t("publicText.operation"),
        );
    return calculateColumnsWidth(columns, tableData.value, {
        padding: 25,
        fontSize: 13,
    });
});
const getColumnWidth1 = (prop: string) => columnWidths1.value[prop] || "auto";
// 高度自适应
const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 180;
    });
};

onBeforeMount(() => {
    getScreenHeight();
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    getData();
    getSelectTypeList();
});
onBeforeUnmount(() => {
    window.removeEventListener("resize", getScreenHeight);
});
</script>

<style lang="scss" scoped>
.el-pagination {
    justify-content: center;
}
</style>
