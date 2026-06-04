<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between">
                <el-form ref="formRef" :model="getForm" label-width="auto" :inline="true" :size="'small'"
                    @submit.native.prevent>
                    <el-form-item :label="t('Scheduling.planCategoryOne.SelectType')" prop="materialCode" class="mb-2">
                        <el-input v-model="getForm.SelectType" clearable @clear="getData" @keyup.enter.native="getData"
                            style="width: 200px" />
                    </el-form-item>
                    <el-form-item class="mb-2">
                        <el-button :type="'primary'" @click="getData">{{
                            t("publicText.query")
                            }}</el-button>
                        <el-button type="warning" size="small" @click="openAdd">{{
                            t("publicText.add")
                            }}</el-button>
                    </el-form-item>
                </el-form>
                <!-- <div>
                    <el-button type="warning" size="small" @click="openAdd">{{
                        t("publicText.add")
                    }}</el-button>
                </div> -->
            </div>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-table :data="tableData.slice(
                        (pageObj.currentPage - 1) * pageObj.pageSize,
                        pageObj.currentPage * pageObj.pageSize,
                    )
                        " size="small" ref="eltableRef" :style="{ width: '100%' }" :height="tableHeight" :tooltip-effect="'dark'"
                        border fit highlight-current-row @row-click="handleLevelOneRowClick">
                        <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                            <template #default="scope">
                                <span>{{
                                    scope.$index +
                                    pageObj.pageSize * (pageObj.currentPage - 1) +
                                    1
                                    }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="CalendarSelectType_Name" fixed
                            :label="$t('Scheduling.planCategoryOne.SelectType')"
                            :min-width="getColumnWidth1('SelectType')" />

                        <el-table-column :label="$t('publicText.operation')" :fixed="'right'" width="130">
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
                </el-col>
                <el-col :span="16">
                    <div class="flex justify-between">
                        <el-form ref="formRef" :model="getTwoForm" label-width="auto" :inline="true" :size="'small'"
                            @submit.native.prevent>
                            <el-form-item :label="t('Scheduling.planCategoryOne.SelectType2')" prop="SelectType2"
                                class="mb-2">
                                <el-input v-model="getTwoForm.SelectType2" clearable @clear="getDataTwo"
                                    @keyup.enter.native="getDataTwo" style="width: 200px" />
                            </el-form-item>
                            <el-form-item class="mb-2">
                                <el-button :type="'primary'" @click="getDataTwo">{{
                                    t("publicText.query")
                                    }}</el-button>
                            </el-form-item>
                        </el-form>
                        <div>
                            <el-button type="warning" size="small" @click="openAddTwo">{{
                                t("publicText.add")
                                }}</el-button>
                        </div>
                    </div>
                    <el-table :data="levelTwoList" size="small" ref="eltableRef" :style="{ width: '100%' }"
                        :height="tableHeight" :tooltip-effect="'dark'" border fit highlight-current-row>
                        <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                            <template #default="scope">
                                <span>{{
                                    scope.$index +
                                    pageObj.pageSize * (pageObj.currentPage - 1) +
                                    1
                                    }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="CalendarSelectType_FatherName" fixed
                            :label="$t('Scheduling.planCategoryOne.SelectType')"
                            :min-width="getColumnWidth1('SelectType')" />
                        <el-table-column prop="CalendarSelectType_Name" fixed
                            :label="$t('Scheduling.planCategoryOne.SelectType2')"
                            :min-width="getColumnWidth1('SelectType2')" />
                        <el-table-column :label="$t('publicText.operation')" :fixed="'right'" width="130">
                            <template #default="{ row }">
                                <el-button size="small" type="primary" @click="openTwoEdit(row)">
                                    {{ $t("publicText.edit") }}
                                </el-button>
                                <el-button size="small" type="danger" @click="handleDeleteTwo(row)">
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
                </el-col>
            </el-row>
        </el-card>
        <!-- 新增对话框 -->
        <el-dialog :title="t('publicText.add')" v-model="addVisible" width="500px" :close-on-click-modal="false"
            @closed="handleAddDialogClosed">
            <el-form ref="addFormRef" :model="addForm" :rules="formRules" label-width="auto">
                <el-form-item :label="t('Scheduling.planCategoryOne.SelectType')" prop="SelectType">
                    <el-input v-model="addForm.SelectType" :placeholder="t('message.pleaseInput') +
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
            <el-form ref="editFormRef" :model="editForm" :rules="formRules" label-width="auto">
                <el-form-item :label="t('Scheduling.planCategoryOne.SelectType')" prop="SelectType">
                    <el-input v-model="editForm.SelectType" :placeholder="t('message.pleaseInput') +
                        t('Scheduling.planCategoryOne.SelectType')
                        " clearable />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="editVisible = false">{{
                        t("publicText.cancel")
                        }}</el-button>
                    <el-button type="primary" @click="submitEdit">{{
                        t("publicText.confirm")
                        }}</el-button>
                </div>
            </template>
        </el-dialog>
        <!-- 二级类别对话框 -->
        <el-dialog :title="t('publicText.add')" v-model="levelTwoVisible" width="500px" :close-on-click-modal="false"
            @closed="handleLevelTwoDialogClosed">
            <el-form ref="addTwoFormRef" :model="addTwoForm" :rules="levelTwoRules" label-width="auto">
                <el-form-item :label="t('Scheduling.planCategoryOne.SelectType')" prop="SelectType">
                    <el-select v-model="addTwoForm.SelectType" filterable clearable :placeholder="t('message.pleaseSelect') +
                        t('Scheduling.planCategoryOne.SelectType')
                        ">
                        <el-option v-for="item in tableData" :key="item.CalendarSelectType_Guid"
                            :label="item.CalendarSelectType_Name" :value="item.CalendarSelectType_Name" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="t('Scheduling.planCategoryOne.SelectType2')" prop="SelectType2">
                    <el-input v-model="addTwoForm.SelectType2" :placeholder="t('message.pleaseInput') +
                        t('Scheduling.planCategoryOne.SelectType2')
                        " clearable />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="levelTwoVisible = false">{{
                    t("publicText.cancel")
                    }}</el-button>
                <el-button type="primary" @click="submitLevelTwo">{{
                    t("publicText.confirm")
                    }}</el-button>
            </template>
        </el-dialog>
        <!-- 编辑对话框 -->
        <el-dialog :title="t('publicText.edit')" v-model="editTwoVisible" width="500px" :close-on-click-modal="false"
            @closed="handleEditTwoClosed">
            <el-form ref="editTwoFormRef" :model="editTwoForm" :rules="levelTwoRules" label-width="auto"
                >
                <el-form-item :label="t('Scheduling.planCategoryOne.SelectType')" prop="SelectType">
                    <el-input v-model="editTwoForm.SelectType" :placeholder="t('message.pleaseInput') +
                        t('Scheduling.planCategoryOne.SelectType')
                        " clearable />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="editTwoVisible = false" size="small">{{
                        t("publicText.cancel")
                        }}</el-button>
                    <el-button type="primary" @click="submitTwoEdit" size="small">{{
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
    AddWorkLineCalendarSelectTypeLevelOne,
    UpdateWorkLineCalendarSelectTypeLevelOne,
    DeleteWorkLineCalendarSelectTypeLevelOne,
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
const tableData = ref<any[]>([]);
const getForm = reactive({
    SelectType: "",
    UserNo: "",
});
const pageObj = reactive({
    currentPage: 1,
    pageSize: 50,
});
const addForm = ref({
    SelectType: "",
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
const levelTwoRules = {
    SelectType: [
        {
            required: true,
            message:
                t("message.pleaseSelect") + t("Scheduling.planCategoryOne.SelectType"),
            trigger: "change",
        },
    ],
    SelectType2: [
        {
            required: true,
            message:
                t("message.pleaseInput") + t("Scheduling.planCategoryOne.SelectType2"),
            trigger: "blur",
        },
    ],
};
const levelTwoList = ref([]);
const getTwoForm = ref({
    SelectType: "",
    SelectType2: "",
    UserNo: "",
});
const levelTwoVisible = ref(false);
const addTwoForm = ref({
    SelectType: "",
    SelectType2: "",
    UserNo: userStore.getUserInfo,
});
const addTwoFormRef = ref();
const editTwoForm = ref({
    Guid: "",
    SelectType: "",
    UserNo: "",
});
const editTwoVisible = ref(false);
const editTwoFormRef=ref()
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
            AddWorkLineCalendarSelectTypeLevelOne(addForm.value).then((res: any) => {
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
    editForm.value.Guid = row.CalendarSelectType_Guid;
    editForm.value.SelectType = row.CalendarSelectType_Name;
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
            UpdateWorkLineCalendarSelectTypeLevelOne(editForm.value).then(
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
        `${t("publicText.confirm")}${t("publicText.delete")}【${row.CalendarSelectType_Name}】?`,
        t("publicText.confirm"),
        {
            confirmButtonText: t("publicText.confirm"),
            cancelButtonText: t("publicText.cancel"),
            type: "warning",
        },
    )
        .then(() => {
            DeleteWorkLineCalendarSelectTypeLevelOne({
                Guid: row.CalendarSelectType_Guid,
                SelectType: row.CalendarSelectType_Name,
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
//----------获取二级
const handleLevelOneRowClick = (row: any) => {
    getTwoForm.value.SelectType = row.CalendarSelectType_Name;
    getDataTwo();
};
const getDataTwo = () => {
    GetWorkLineCalendarSelectTypeLevelTwo(getTwoForm.value).then((res: any) => {
        levelTwoList.value = res.Data;
    });
};
const openAddTwo = () => {
    addTwoForm.value.SelectType = getTwoForm.value.SelectType;
    console.log( addTwoForm.value.SelectType);
    
    levelTwoVisible.value = true;
};
const handleLevelTwoDialogClosed = () => {
    levelTwoVisible.value = false;
};
const submitLevelTwo = () => {
    addTwoFormRef.value.validate((valid: any) => {
        if (valid) {
            AddWorkLineCalendarSelectTypeLevelTwo(addTwoForm.value).then((res: any) => {
                if (res.Success) {
                    ElMessage.success(t("message.addSuccess"));
                    getData();
                    levelTwoVisible.value = false;
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
const handleEditTwoClosed = () => {
    editTwoVisible.value = false;
};
const openTwoEdit=(row:any)=>{
      editTwoForm.value.Guid = row.CalendarSelectType_Guid
    editTwoForm.value.SelectType = row.CalendarSelectType_Name;
     editTwoVisible.value = true
}
const submitTwoEdit=()=>{
     editTwoFormRef.value.validate((valid: any) => {
        if (valid) {
            UpdateWorkLineCalendarSelectTypeLevelTwo(editTwoForm.value).then(
                (res: any) => {
                    if (res.Success) {
                        ElMessage.success(t("message.editSuccess"));
                        getDataTwo();
                        editTwoVisible.value = false;
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
}
const handleDeleteTwo = (row: any) => {
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
                Guid: row.CalendarSelectType_Guid,
                SelectType: row.CalendarSelectType_FatherName,
                SelectType2: row.CalendarSelectType_Name,
                UserNo: userStore.getUserInfo,
            }).then((res: any) => {
                if (res.Success) {
                    ElMessage.success(t("message.deleteSuccess"));
                    getDataTwo();
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
    GetWorkLineCalendarSelectTypeLevelOne(getForm).then((res: any) => {
        if (res.Success) {
            tableData.value = res.Data || [];
        } else {
            tableData.value = [];
        }
    });
};
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
