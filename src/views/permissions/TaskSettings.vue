<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <!-- 搜索栏 -->
            <el-form ref="formRef" :inline="true" size="small" label-width="auto" @submit.prevent>
                <el-form-item :label="t('TaskSettings.jobName')" prop="job_name" class="mb-2">
                    <el-input v-model="searchForm.job_name" clearable :placeholder="t('publicText.input')"
                        style="width: 160px" @keyup.enter="handleSearch" />
                </el-form-item>
                <el-form-item :label="t('TaskSettings.jobGroup')" prop="job_group" class="mb-2">
                    <el-input v-model="searchForm.job_group" clearable :placeholder="t('publicText.input')"
                        style="width: 160px" @keyup.enter="handleSearch" />
                </el-form-item>
                <el-form-item :label="t('TaskSettings.status')" prop="status" class="mb-2">
                    <el-select v-model="searchForm.status" clearable :placeholder="t('publicText.pleaseSelect')"
                        style="width: 120px" @change="handleSearch">
                        <el-option :label="t('TaskSettings.statusEnable')" value="0" />
                        <el-option :label="t('TaskSettings.statusPause')" value="1" />
                    </el-select>
                </el-form-item>
                <el-form-item class="mb-2">
                    <el-button type="primary" @click="handleSearch">{{ t('publicText.query') }}</el-button>
                    <el-button @click="handleReset">{{ t('publicText.reset') }}</el-button>
                    <el-button type="success" @click="openAdd">{{ t('publicText.add') }}</el-button>
                </el-form-item>
            </el-form>

            <!-- 任务列表 -->
            <el-table ref="eltableRef" :data="tableData" size="small" :style="{ width: '100%' }" :height="tableHeight"
                :tooltip-effect="'dark'" border fit  highlight-current-row>
                <el-table-column type="index" align="center" fixed :label="t('publicText.index')" width="55">
                    <template #default="scope">
                        <span>{{ scope.$index + (pageObj.pageIndex - 1) * pageObj.pageSize + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="job_id" :label="t('TaskSettings.jobId')" :min-width="getColumnWidth('job_id')"
                    align="center" />
                <el-table-column prop="job_name" :label="t('TaskSettings.jobName')"
                    :min-width="getColumnWidth('job_name')" show-overflow-tooltip />
                <el-table-column prop="job_group" :label="t('TaskSettings.jobGroup')"
                    :min-width="getColumnWidth('job_group')" show-overflow-tooltip />
                <el-table-column prop="invoke_target" :label="t('TaskSettings.invokeTarget')"
                    :min-width="getColumnWidth('invoke_target')" show-overflow-tooltip />
                <el-table-column prop="cron_expression" :label="t('TaskSettings.cronExpression')"
                    :min-width="getColumnWidth('cron_expression')" show-overflow-tooltip />
                <el-table-column :label="t('TaskSettings.status')" width="100" align="center" fixed="right">
                    <template #default="scope">
                        <el-switch v-model="scope.row.status" :active-value="'0'" :inactive-value="'1'"
                            :active-text="t('TaskSettings.statusEnable')" :inactive-text="t('TaskSettings.statusPause')"
                            inline-prompt @change="(val: any) => handleStatusChange(scope.row, val)" />
                    </template>
                </el-table-column>
                <el-table-column :label="t('publicText.operation')" width="120" align="center" fixed="right">
                    <template #default="scope">
                        <el-tooltip :content="t('publicText.edit')" placement="top">
                            <el-button type="primary" size="small" icon="Edit" @click="openEdit(scope.row)" />
                        </el-tooltip>
                        <el-tooltip :content="t('publicText.delete')" placement="top">
                            <el-button type="danger" size="small" icon="Delete" @click="handleDelete(scope.row)" />
                        </el-tooltip>
                    </template>
                </el-table-column>
                <template #empty>
                    <div class="flex items-center justify-center h-100%">
                        <el-empty />
                    </div>
                </template>
            </el-table>

            <!-- 分页 -->
            <div class="mt-2">
                <el-pagination size="small" background @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :pager-count="5" :current-page="pageObj.pageIndex"
                    :page-size="pageObj.pageSize" :page-sizes="[10, 20, 30, 50, 100]"
                    layout="total, sizes, prev, pager, next" :total="total" />
            </div>
        </el-card>

        <!-- 新增/修改弹窗 -->
        <el-dialog :title="dialogTitle" v-model="dialogVisible" width="640px" :close-on-click-modal="false"
            @closed="handleDialogClosed">
            <el-form ref="formRef" :model="form" :rules="formRules" label-width="130px" size="small">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('TaskSettings.jobName')" prop="job_name">
                            <el-input v-model="form.job_name" :placeholder="t('publicText.input')" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('TaskSettings.jobGroup')" prop="job_group">
                            <el-input v-model="form.job_group" :placeholder="t('publicText.input')" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item :label="t('TaskSettings.invokeTarget')" prop="invoke_target">
                    <el-input v-model="form.invoke_target" :placeholder="t('publicText.input')" clearable />
                </el-form-item>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('TaskSettings.cronExpression')" prop="cron_expression">
                            <el-input v-model="form.cron_expression" :placeholder="t('publicText.input')" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('TaskSettings.jobType')" prop="job_type">
                            <el-select v-model="form.job_type" :placeholder="t('publicText.pleaseSelect')" clearable
                                style="width: 100%">
                                <el-option :label="t('TaskSettings.jobTypeJava')" value="java" />
                                <el-option :label="t('TaskSettings.jobTypeHttp')" value="http" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('TaskSettings.misfirePolicy')" prop="misfire_policy">
                            <el-select v-model="form.misfire_policy" :placeholder="t('publicText.pleaseSelect')" clearable
                                style="width: 100%">
                                <el-option :label="t('TaskSettings.misfireDefault')" value="1" />
                                <el-option :label="t('TaskSettings.misfireRunOnce')" value="2" />
                                <el-option :label="t('TaskSettings.misfireDoNothing')" value="3" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('TaskSettings.concurrent')" prop="concurrent">
                            <el-select v-model="form.concurrent" :placeholder="t('publicText.pleaseSelect')" clearable
                                style="width: 100%">
                                <el-option :label="t('TaskSettings.concurrentAllow')" value="0" />
                                <el-option :label="t('TaskSettings.concurrentForbid')" value="1" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('TaskSettings.status')" prop="status">
                            <el-select v-model="form.status" :placeholder="t('publicText.pleaseSelect')" clearable
                                style="width: 100%">
                                <el-option :label="t('TaskSettings.statusEnable')" value="0" />
                                <el-option :label="t('TaskSettings.statusPause')" value="1" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <template v-if="form.job_type === 'http'">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item :label="t('TaskSettings.jobIp')" prop="job_ip">
                                <el-input v-model="form.job_ip" :placeholder="t('publicText.input')" clearable />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item :label="t('TaskSettings.jobAddress')" prop="job_address">
                                <el-input v-model="form.job_address" :placeholder="t('publicText.input')" clearable />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </template>
                <el-form-item :label="t('TaskSettings.jobPara')" prop="job_para">
                    <el-input v-model="form.job_para" type="textarea" :rows="3" :placeholder="t('publicText.input')" />
                </el-form-item>
                <el-form-item :label="t('TaskSettings.remark')" prop="remark">
                    <el-input v-model="form.remark" type="textarea" :rows="2" :placeholder="t('publicText.input')" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">{{ t('publicText.cancel') }}</el-button>
                <el-button type="primary" @click="submitForm" :loading="submitLoading">
                    {{ t('publicText.confirm') }}
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { getTaskList, addTask, updateTask, deleteTask, taskStatus } from "@/api/permiss/TaskSettings";
import { ref, reactive, nextTick, onMounted, onBeforeUnmount } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import dayjs from "dayjs";
import { useI18n } from "vue-i18n";

const userStore = useUserStoreWithOut();
const { t } = useI18n();

const loading = ref(false);
const submitLoading = ref(false);
const tableHeight = ref(0);
const eltableRef = ref();
const tableData = ref<any[]>([]);
const total = ref(0);
const dialogVisible = ref(false);
const dialogTitle = ref("");
const isEdit = ref(false);
const formRef = ref();

const searchForm = reactive({
    job_id: 0,
    job_name: "",
    job_group: "",
    status: "",
    job_type: "",
});

const pageObj = reactive({
    pageIndex: 1,
    pageSize: 50,
});

const defaultForm = () => ({
    job_name: "",
    job_group: "",
    job_id: 0,
    invoke_target: "",
    cron_expression: "",
    misfire_policy: "",
    concurrent: "",
    status: "",
    create_by: "",
    create_time: "",
    update_by: "",
    update_time: "",
    remark: "",
    job_ip: "",
    job_address: "",
    job_para: "",
    job_type: "",
});

const form = reactive(defaultForm());

const formRules = reactive({
    job_name: [{ required: true, message: t('publicText.input') + t('TaskSettings.jobName'), trigger: "blur" }],
    job_group: [{ required: true, message: t('publicText.input') + t('TaskSettings.jobGroup'), trigger: "blur" }],
    invoke_target: [{ required: true, message: t('publicText.input') + t('TaskSettings.invokeTarget'), trigger: "blur" }],
    cron_expression: [{ required: true, message: t('publicText.input') + t('TaskSettings.cronExpression'), trigger: "blur" }],
});

const { getColumnWidth } = useTableColumnWidth(eltableRef, tableData, {
    excludeLabels: [t('publicText.index'), t('publicText.operation')],
});

const getData = () => {
    loading.value = true;
    getTaskList({
        job_id: searchForm.job_id,
        job_name: searchForm.job_name,
        job_group: searchForm.job_group,
        status: searchForm.status,
        job_type: searchForm.job_type,
    })
        .then((res: any) => {
            if (res.Success && res.Data) {
                tableData.value = res.Data.rows || res.Data || [];
                total.value = res.Data.total ?? (res.Data.rows ? res.Data.rows.length : 0);
            } else {
                tableData.value = [];
                total.value = 0;
            }
        })
        .catch(() => {
            tableData.value = [];
            total.value = 0;
        })
        .finally(() => {
            loading.value = false;
        });
};

const handleSearch = () => {
    pageObj.pageIndex = 1;
    getData();
};

const handleReset = () => {
    searchForm.job_name = "";
    searchForm.job_group = "";
    searchForm.status = "";
    searchForm.job_type = "";
    pageObj.pageIndex = 1;
    getData();
};

const handleSizeChange = (val: number) => {
    pageObj.pageSize = val;
    pageObj.pageIndex = 1;
    getData();
};

const handleCurrentChange = (val: number) => {
    pageObj.pageIndex = val;
    getData();
};

const openAdd = () => {
    isEdit.value = false;
    dialogTitle.value = t('publicText.add');
    Object.assign(form, defaultForm());
    dialogVisible.value = true;
};

const openEdit = (row: any) => {
    isEdit.value = true;
    dialogTitle.value = t('publicText.edit');
    Object.assign(form, defaultForm(), row);
    dialogVisible.value = true;
};

const handleDialogClosed = () => {
    Object.assign(form, defaultForm());
    formRef.value?.resetFields();
};

const submitForm = () => {
    formRef.value.validate((valid: boolean) => {
        if (!valid) return;
        submitLoading.value = true;
        const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
        const payload: any = { ...form };
        if (isEdit.value) {
            payload.update_by = userStore.getUserInfo;
            payload.update_time = now;
            updateTask(payload)
                .then((res: any) => {
                    ElMessage.success(res.Message || t('publicText.success'));
                    dialogVisible.value = false;
                    getData();
                })
                .finally(() => {
                    submitLoading.value = false;
                });
        } else {
            payload.create_by = userStore.getUserInfo;
            payload.create_time = now;
            addTask(payload)
                .then((res: any) => {
                    ElMessage.success(res.Message || t('publicText.success'));
                    dialogVisible.value = false;
                    getData();
                })
                .finally(() => {
                    submitLoading.value = false;
                });
        }
    });
};

const handleDelete = (row: any) => {
    ElMessageBox.confirm(t('TaskSettings.deleteConfirm'), t('publicText.tipTitle'), {
        confirmButtonText: t('publicText.confirm'),
        cancelButtonText: t('publicText.cancel'),
        type: "warning",
    })
        .then(() => {
            deleteTask({ job_id: row.job_id, job_name: row.job_name, job_group: row.job_group }).then((res: any) => {
                ElMessage.success(res.Message || t('publicText.success'));
                getData();
            });
        })
        .catch(() => {});
};

const handleStatusChange = (row: any, val: any) => {
    taskStatus({ job_id: row.job_id, status: val })
        .then((res: any) => {
            ElMessage.success(res.Message || t('publicText.success'));
        })
        .catch(() => {
            // 失败时回滚状态
            row.status = val === "0" ? "1" : "0";
        });
};

const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 220;
    });
};

onMounted(() => {
    getScreenHeight();
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
