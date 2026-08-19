<template>
    <div class="p-2 flex gap-[10px]">
        <el-card shadow="always" :body-style="{ padding: '8px' }" class="w-[300px] h-[calc(100vh-97px)] flex flex-col">
            <template #header>
                <div class="card-header">
                    <div class="flex justify-between items-center mb-[6px]">
                        <div class="flex items-center gap-[5px]">
                            <el-icon color="#006487"><Collection /></el-icon>
                            <span class="font-bold">{{ t('dirtManage.dictType') }}</span>
                        </div>
                        <div class="flex items-center gap-[5px]">
                            <el-tooltip :content="t('publicText.add')" placement="right">
                                <el-icon size="20" color="#006487" style="cursor: pointer" @click="openAddRoot">
                                    <Plus />
                                </el-icon>
                            </el-tooltip>
                            <el-tooltip :content="t('publicText.refresh')" placement="right">
                                <el-icon size="20" color="#006487" style="cursor: pointer" @click="getTreeData">
                                    <RefreshRight />
                                </el-icon>
                            </el-tooltip>
                        </div>
                    </div>
                    <el-input v-model="treeFilterText" size="small" clearable
                        :placeholder="t('dirtManage.filterPlaceholder')"
                        @input="handleTreeFilter" @clear="handleTreeFilter">
                        <template #append>
                            <el-button icon="Search" />
                        </template>
                    </el-input>
                </div>
            </template>
            <el-scrollbar class="flex-1">
                <el-tree ref="treeRef" :data="treeData" node-key="ID" highlight-current
                    :expand-on-click-node="false" :default-expand-all="true"
                    :props="{ children: 'Children', label: 'Name' }"
                    :filter-node-method="filterTreeNode"
                    @node-click="handleNodeClick">
                    <template #default="{ node, data }">
                        <div class="flex items-center justify-between w-full group">
                            <span class="truncate">{{ data.Name }}</span>
                            <span class="flex items-center gap-[2px] opacity-0 group-hover:opacity-100 transition-opacity">
                                <el-tooltip :content="t('dirtManage.addChild')" placement="top">
                                    <el-icon size="16" color="#409EFF" style="cursor: pointer"
                                        @click.stop="openAddChild(data)">
                                        <Plus />
                                    </el-icon>
                                </el-tooltip>
                                <el-tooltip :content="t('publicText.edit')" placement="top">
                                    <el-icon size="16" color="#E6A23C" style="cursor: pointer"
                                        @click.stop="openEditNode(data)">
                                        <Edit />
                                    </el-icon>
                                </el-tooltip>
                                <el-tooltip :content="t('publicText.delete')" placement="top">
                                    <el-icon size="16" color="#F56C6C" style="cursor: pointer"
                                        @click.stop="handleDeleteNode(data)">
                                        <Delete />
                                    </el-icon>
                                </el-tooltip>
                            </span>
                        </div>
                    </template>
                </el-tree>
            </el-scrollbar>
        </el-card>

        <el-card shadow="always" :body-style="{ padding: '8px 8px 0 8px' }" class="flex-1 flex flex-col">
            <div class="mb-2 flex justify-between items-center">
                <div class="flex items-center gap-[10px]">
                    <el-icon color="#006487"><Document /></el-icon>
                    <span class="font-bold">{{ currentNodeName || t('dirtManage.selectNode') }}</span>
                </div>
                <div class="flex items-center gap-[10px]">
                    <el-button type="primary" size="small" @click="openAddData" :disabled="!currentNode">
                        {{ t('publicText.add') }}
                    </el-button>
                    <el-button type="danger" size="small" :disabled="!selectedDataIds.length" @click="handleBatchDelete">
                        {{ t('publicText.batchDelete') }}
                    </el-button>
                </div>
            </div>

            <el-table :data="dictDataList" ref="tableRef" border :height="tableHeight" stripe size="small"
                highlight-current-row  :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="40" align="center" />
                <el-table-column type="index" align="center" :label="t('publicText.index')" width="50" />
                <el-table-column prop="Name" :label="t('dirtManage.name')"
                    :min-width="getColumnWidth('Name')" show-overflow-tooltip />
                <el-table-column prop="Value" :label="t('dirtManage.value')"
                    :min-width="getColumnWidth('Value')" show-overflow-tooltip />
                <el-table-column prop="Remark" :label="t('dirtManage.remark')"
                    :min-width="getColumnWidth('Remark')" show-overflow-tooltip />
                <el-table-column prop="Seq" :label="t('dirtManage.seq')"
                    :min-width="getColumnWidth('Seq')" align="center" />
                <el-table-column prop="Editor" :label="t('dirtManage.editor')"
                    :min-width="getColumnWidth('Editor')" />
                <el-table-column prop="LastUpdated" :label="t('dirtManage.lastUpdated')"
                    :min-width="getColumnWidth('LastUpdated')">
                    <template #default="{ row }">
                        {{ formatDate(row.LastUpdated) }}
                    </template>
                </el-table-column>
                <el-table-column :label="t('publicText.operation')" fixed="right" width="130" align="center">
                    <template #default="{ row }">
                        <el-tooltip :content="t('publicText.edit')" placement="top">
                            <el-button size="small" type="primary" @click="openEditData(row)" icon="Edit" />
                        </el-tooltip>
                        <el-tooltip :content="t('publicText.delete')" placement="top">
                            <el-button size="small" type="danger" @click="handleDeleteData(row)" icon="Delete" />
                        </el-tooltip>
                    </template>
                </el-table-column>
                <template #empty>
                    <div class="flex items-center justify-center h-100%">
                        <el-empty :description="t('dirtManage.selectNode')" />
                    </div>
                </template>
            </el-table>

            <div class="block" style="margin-top: 8px" v-if="currentNode">
                <el-pagination background align="center" @size-change="handleSizeChange" :size="'small'"
                    @current-change="handleCurrentChange" :page-sizes="[10, 20, 50, 100]"
                    :current-page="getForm.pageIndex" :page-size="getForm.pageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="getForm.Total" />
            </div>
        </el-card>

        <!-- 字典类型 新增/编辑弹窗 -->
        <el-dialog :title="typeDialogTitle" v-model="typeDialogVisible" width="500px" :close-on-click-modal="false"
            @closed="handleTypeDialogClosed">
            <el-form ref="typeFormRef" :model="typeForm" :rules="typeFormRules" label-width="100px">
                <el-form-item :label="t('dirtManage.parentNode')">
                    <el-checkbox v-model="isRootNode" @change="handleRootNodeChange">
                        {{ t('dirtManage.isRootNode') }}
                    </el-checkbox>
                </el-form-item>
                <el-form-item v-if="!isRootNode" :label="t('dirtManage.parentSelect')" prop="PID">
                    <el-select v-model="typeForm.PID" filterable clearable
                        :placeholder="t('dirtManage.selectParent')">
                        <el-option v-for="item in parentOptions" :key="item.ID"
                            :label="item.Name" :value="item.ID" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="t('dirtManage.name')" prop="Name">
                    <el-input v-model="typeForm.Name" :placeholder="t('dirtManage.inputName')" clearable />
                </el-form-item>
                <el-form-item :label="t('dirtManage.code')" prop="Code">
                    <el-input v-model="typeForm.Code" :placeholder="t('dirtManage.inputCode')" clearable />
                </el-form-item>
                <el-form-item :label="t('dirtManage.seq')" prop="Seq">
                    <el-input v-model="typeForm.Seq" :placeholder="t('dirtManage.inputSeq')" clearable />
                </el-form-item>
                <el-form-item :label="t('dirtManage.remark')" prop="Remark">
                    <el-input v-model="typeForm.Remark" type="textarea" :rows="3"
                        :placeholder="t('dirtManage.inputRemark')" clearable />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="typeDialogVisible = false">{{ t("publicText.cancel") }}</el-button>
                    <el-button type="primary" @click="submitTypeForm" :loading="submitLoading">
                        {{ t("publicText.confirm") }}
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <!-- 字典数据 新增/编辑弹窗 -->
        <el-dialog :title="dataDialogTitle" v-model="dataDialogVisible" width="500px" :close-on-click-modal="false"
            @closed="handleDataDialogClosed">
            <el-form ref="dataFormRef" :model="dataForm" :rules="dataFormRules" label-width="100px">
                <el-form-item :label="t('dirtManage.name')" prop="Name">
                    <el-input v-model="dataForm.Name" :placeholder="t('dirtManage.inputName')" clearable />
                </el-form-item>
                <el-form-item :label="t('dirtManage.value')" prop="Value">
                    <el-input v-model="dataForm.Value" :placeholder="t('dirtManage.inputValue')" clearable />
                </el-form-item>
                <el-form-item :label="t('dirtManage.seq')" prop="Seq">
                    <el-input v-model="dataForm.Seq" :placeholder="t('dirtManage.inputSeq')" clearable />
                </el-form-item>
                <el-form-item :label="t('dirtManage.remark')" prop="Remark">
                    <el-input v-model="dataForm.Remark" type="textarea" :rows="3"
                        :placeholder="t('dirtManage.inputRemark')" clearable />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dataDialogVisible = false">{{ t("publicText.cancel") }}</el-button>
                    <el-button type="primary" @click="submitDataForm" :loading="submitLoading">
                        {{ t("publicText.confirm") }}
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { QueryDictTypeTree, AddDictType, UpdateDictType, DeleteDictType, QueryDictDataList, AddDictData, UpdateDictData, DeleteDictData } from "@/api/dict";
import { ref, reactive, computed, nextTick, onMounted, onBeforeMount, onBeforeUnmount } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { useTableColumnWidth } from '@/hooks/useTableColumnWidth';
import dayjs from 'dayjs';
import { useI18n } from "vue-i18n";

const userStore = useUserStoreWithOut();
const { t } = useI18n();

const loading = ref(false);
const submitLoading = ref(false);
const tableHeight = ref(0);
const tableRef = ref();
const treeRef = ref();

const treeData = ref<any[]>([]);
const currentNode = ref<any>(null);
const treeFilterText = ref("");
const isRootNode = ref(false);
const parentOptions = ref<any[]>([]);

const dictDataList = ref<any[]>([]);
const selectedDataIds = ref<string[]>([]);

const getForm = reactive({
    DictType_ID: "",
    pageIndex: 1,
    pageSize: 50,
    Total: 0,
});

// --- DictType dialog ---
const typeDialogVisible = ref(false);
const typeDialogType = ref<'add-root' | 'add-child' | 'edit'>('add-root');
const typeFormRef = ref();

const defaultTypeForm = () => ({
    ID: "",
    Name: "",
    Code: "",
    Remark: "",
    Seq: "",
    PID: "-1",
    Editor: userStore.getUserInfo || "",
    UserNo: userStore.getUserInfo || "",
});

const typeForm = reactive(defaultTypeForm());

const typeDialogTitle = computed(() => {
    if (typeDialogType.value === 'add-root') return t('dirtManage.addRoot');
    if (typeDialogType.value === 'add-child') return t('dirtManage.addChild');
    return t('publicText.edit');
});

const typeFormRules = reactive({
    Name: [
        { required: true, message: t('message.pleaseInput') + t('dirtManage.name'), trigger: 'blur' },
    ],
});

// --- DictData dialog ---
const dataDialogVisible = ref(false);
const dataDialogType = ref<'add' | 'edit'>('add');
const dataFormRef = ref();

const defaultDataForm = () => ({
    ID: "",
    DictType_ID: "",
    Name: "",
    Value: "",
    Remark: "",
    Seq: "",
    Editor: userStore.getUserInfo || "",
    UserNo: userStore.getUserInfo || "",
});

const dataForm = reactive(defaultDataForm());

const dataDialogTitle = computed(() => {
    return dataDialogType.value === 'add' ? t('publicText.add') : t('publicText.edit');
});

const dataFormRules = reactive({
    Name: [
        { required: true, message: t('message.pleaseInput') + t('dirtManage.name'), trigger: 'blur' },
    ],
    Value: [
        { required: true, message: t('message.pleaseInput') + t('dirtManage.value'), trigger: 'blur' },
    ],
});

const { getColumnWidth } = useTableColumnWidth(tableRef, dictDataList, {
    excludeLabels: [t('publicText.index'), t('publicText.operation'), t('publicText.select')]
});

const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === "1900-01-01T00:00:00") return "-";
    return dayjs(dateStr).format("YYYY-MM-DD HH:mm:ss");
};

const currentNodeName = computed(() => {
    return currentNode.value?.Name || '';
});

// --- Tree operations ---
const getTreeData = () => {
    loading.value = true;
    QueryDictTypeTree({}).then((res: any) => {
        if (res.Success) {
            treeData.value = res.Data || [];
            if (!currentNode.value && treeData.value.length > 0) {
                currentNode.value = treeData.value[0];
                getDictDataList();
            }
        } else {
            ElMessage.warning(res.Msg || t("message.queryFailure"));
        }
    }).catch(() => {
        treeData.value = [];
    }).finally(() => {
        loading.value = false;
    });
};

const handleNodeClick = (data: any) => {
    currentNode.value = data;
    getForm.pageIndex = 1;
    getDictDataList();
};

// 扁平化树数据，获取所有节点作为父节点选项
const flattenTreeData = (data: any[]): any[] => {
    const result: any[] = [];
    const flatten = (nodes: any[]) => {
        nodes.forEach(node => {
            result.push({ ID: node.ID, Name: node.Name, PID: node.PID });
            if (node.Children && node.Children.length > 0) {
                flatten(node.Children);
            }
        });
    };
    flatten(data);
    return result;
};

// 树筛选
const handleTreeFilter = () => {
    treeRef.value?.filter(treeFilterText.value);
};

// 树节点过滤方法
const filterTreeNode = (value: string, data: any) => {
    if (!value) return true;
    return data.Name?.toLowerCase().includes(value.toLowerCase());
};

// 根节点勾选变化
const handleRootNodeChange = (val: any) => {
    if (val) {
        typeForm.PID = "-1";
    } else {
        typeForm.PID = currentNode.value?.ID || "-1";
    }
};

const resetTypeForm = () => {
    Object.assign(typeForm, defaultTypeForm());
    isRootNode.value = false;
};

const openAddRoot = () => {
    typeDialogType.value = 'add-root';
    parentOptions.value = flattenTreeData(treeData.value);
    resetTypeForm();
    isRootNode.value = true;
    typeForm.PID = "-1";
    typeDialogVisible.value = true;
};

const openAddChild = (node: any) => {
    if (!node) {
        ElMessage.warning(t('dirtManage.selectParent'));
        return;
    }
    typeDialogType.value = 'add-child';
    parentOptions.value = flattenTreeData(treeData.value).filter(item => item.ID !== node.ID);
    resetTypeForm();
    isRootNode.value = false;
    typeForm.PID = node.ID;
    typeDialogVisible.value = true;
};

const openEditNode = (node: any) => {
    typeDialogType.value = 'edit';
    parentOptions.value = flattenTreeData(treeData.value).filter(item => item.ID !== node.ID);
    const isRoot = !node.PID || node.PID === "-1";
    Object.assign(typeForm, {
        ID: node.ID || "",
        Name: node.Name || "",
        Code: node.Code || "",
        Remark: node.Remark || "",
        Seq: node.Seq || "",
        PID: node.PID || "-1",
        Editor: userStore.getUserInfo || "",
        UserNo: userStore.getUserInfo || "",
    });
    isRootNode.value = isRoot;
    typeDialogVisible.value = true;
};

const handleTypeDialogClosed = () => {
    typeFormRef.value?.resetFields();
    resetTypeForm();
};

const submitTypeForm = () => {
    typeFormRef.value.validate((valid: boolean) => {
        if (valid) {
            submitLoading.value = true;
            const apiCall = typeDialogType.value === 'edit'
                ? UpdateDictType(typeForm)
                : AddDictType(typeForm);
            apiCall.then((res: any) => {
                if (res.Success) {
                    ElMessage.success(typeDialogType.value === 'edit'
                        ? t("message.editSuccess")
                        : t("message.addSuccess"));
                    typeDialogVisible.value = false;
                    getTreeData();
                } else {
                    ElMessage.error(res.Msg || t("message.operationFailure"));
                }
            }).finally(() => {
                submitLoading.value = false;
            });
        }
    });
};

const handleDeleteNode = (node: any) => {
    if (!node) return;
    const hasChildren = node.Children && node.Children.length > 0;
    const tip = hasChildren
        ? t('dirtManage.deleteWithChildren')
        : t('dirtManage.confirmDelete');
    ElMessageBox.confirm(
        `${tip}【${node.Name}】?`,
        t("publicText.tip"),
        {
            confirmButtonText: t("publicText.confirm"),
            cancelButtonText: t("publicText.cancel"),
            type: "warning",
        }
    ).then(() => {
        loading.value = true;
        DeleteDictType({
            ID: node.ID,
            UserNo: userStore.getUserInfo || "",
        }).then((res: any) => {
            if (res.Success) {
                ElMessage.success(t("message.deleteSuccess"));
                if (currentNode.value && currentNode.value.ID === node.ID) {
                    currentNode.value = null;
                    dictDataList.value = [];
                    getForm.Total = 0;
                }
                getTreeData();
            } else {
                ElMessage.error(res.Msg || t("message.deleteFailure"));
            }
        }).finally(() => {
            loading.value = false;
        });
    }).catch(() => {
        ElMessage.info(t("publicText.cancel"));
    });
};

// --- DictData operations ---
const getDictDataList = () => {
    if (!currentNode.value) return;
    loading.value = true;
    getForm.DictType_ID = currentNode.value.ID;
    QueryDictDataList({
        DictType_ID: getForm.DictType_ID,
        pageIndex: getForm.pageIndex,
        pageSize: getForm.pageSize,
        UserNo: userStore.getUserInfo || "",
    }).then((res: any) => {
        if (res.Success) {
            dictDataList.value = res.Data?.list || [];
            getForm.Total = res.Data?.Total || 0;
        } else {
            ElMessage.warning(res.Msg || t("message.queryFailure"));
            dictDataList.value = [];
            getForm.Total = 0;
        }
    }).catch(() => {
        dictDataList.value = [];
        getForm.Total = 0;
    }).finally(() => {
        loading.value = false;
    });
};

const handleSelectionChange = (selection: any[]) => {
    selectedDataIds.value = selection.map(item => item.ID);
};

const handleSizeChange = (val: number) => {
    getForm.pageSize = val;
    getForm.pageIndex = 1;
    getDictDataList();
};

const handleCurrentChange = (val: number) => {
    getForm.pageIndex = val;
    getDictDataList();
};

const resetDataForm = () => {
    Object.assign(dataForm, defaultDataForm());
};

const openAddData = () => {
    if (!currentNode.value) {
        ElMessage.warning(t('dirtManage.selectNode'));
        return;
    }
    dataDialogType.value = 'add';
    resetDataForm();
    dataForm.DictType_ID = currentNode.value.ID;
    dataDialogVisible.value = true;
};

const openEditData = (row: any) => {
    dataDialogType.value = 'edit';
    Object.assign(dataForm, {
        ID: row.ID || "",
        DictType_ID: row.DictType_ID || currentNode.value?.ID || "",
        Name: row.Name || "",
        Value: row.Value || "",
        Remark: row.Remark || "",
        Seq: row.Seq || "",
        Editor: userStore.getUserInfo || "",
        UserNo: userStore.getUserInfo || "",
    });
    dataDialogVisible.value = true;
};

const handleDataDialogClosed = () => {
    dataFormRef.value?.resetFields();
    resetDataForm();
};

const submitDataForm = () => {
    dataFormRef.value.validate((valid: boolean) => {
        if (valid) {
            submitLoading.value = true;
            const apiCall = dataDialogType.value === 'edit'
                ? UpdateDictData(dataForm)
                : AddDictData(dataForm);
            apiCall.then((res: any) => {
                if (res.Success) {
                    ElMessage.success(dataDialogType.value === 'edit'
                        ? t("message.editSuccess")
                        : t("message.addSuccess"));
                    dataDialogVisible.value = false;
                    getDictDataList();
                } else {
                    ElMessage.error(res.Msg || t("message.operationFailure"));
                }
            }).finally(() => {
                submitLoading.value = false;
            });
        }
    });
};

const handleDeleteData = (row: any) => {
    ElMessageBox.confirm(
        `${t('dirtManage.confirmDelete')}【${row.Name}】?`,
        t("publicText.tip"),
        {
            confirmButtonText: t("publicText.confirm"),
            cancelButtonText: t("publicText.cancel"),
            type: "warning",
        }
    ).then(() => {
        loading.value = true;
        DeleteDictData({
            ids: [row.ID],
            UserNo: userStore.getUserInfo || "",
        }).then((res: any) => {
            if (res.Success) {
                ElMessage.success(t("message.deleteSuccess"));
                getDictDataList();
            } else {
                ElMessage.error(res.Msg || t("message.deleteFailure"));
            }
        }).finally(() => {
            loading.value = false;
        });
    }).catch(() => {
        ElMessage.info(t("publicText.cancel"));
    });
};

const handleBatchDelete = () => {
    if (selectedDataIds.value.length === 0) {
        ElMessage.warning(t('dirtManage.selectData'));
        return;
    }
    ElMessageBox.confirm(
        `${t('dirtManage.confirmBatchDelete')}(${selectedDataIds.value.length})`,
        t("publicText.tip"),
        {
            confirmButtonText: t("publicText.confirm"),
            cancelButtonText: t("publicText.cancel"),
            type: "warning",
        }
    ).then(() => {
        loading.value = true;
        DeleteDictData({
            ids: selectedDataIds.value,
            UserNo: userStore.getUserInfo || "",
        }).then((res: any) => {
            if (res.Success) {
                ElMessage.success(t("message.deleteSuccess"));
                selectedDataIds.value = [];
                getDictDataList();
            } else {
                ElMessage.error(res.Msg || t("message.deleteFailure"));
            }
        }).finally(() => {
            loading.value = false;
        });
    }).catch(() => {
        ElMessage.info(t("publicText.cancel"));
    });
};

// --- Height ---
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
    getTreeData();
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
