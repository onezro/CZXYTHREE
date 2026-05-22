<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <el-form ref="formRef" :inline="true" size="small" label-width="auto" @submit.native.prevent>
                <!-- <el-form-item :label="t('Scheduling.assist.productOrder')" prop="productOrder" class="mb-2">
                    <el-input v-model="getForm.Wo" placeholder="" clearable @clear="getData"
                        @keyup.enter.native="getData" style="width: 200px" />
                </el-form-item> -->
                <el-form-item :label="t('Scheduling.ProductSched.MesOrder')" prop="Wo" class="mb-2">
                    <el-input v-model="getForm.Wo" placeholder="" clearable @clear="searchData"
                        @keyup.enter.native="searchData" style="width: 200px" />
                </el-form-item>

                <el-form-item :label="t('Scheduling.ProductSched.TBSide')" prop="TBSide" class="mb-2">
                    <el-input v-model="getForm.OrderName" placeholder="" clearable @clear="searchData"
                        @keyup.enter.native="searchData" style="width: 200px" />
                </el-form-item>
                  <el-form-item :label="$t('Scheduling.ProductSched.PlanDate')" class="mb-2"><el-date-picker
                        :shortcuts="shortcuts" v-model="searchDate" value-format="YYYY-MM-DD" type="daterange"
                        range-separator="-" size="small" style="width: 200px" :clearable="false" />
                </el-form-item>

                
                <el-form-item class="mb-2">
                    <el-button :type="'primary'" @click="searchData">{{ t('publicText.query') }}</el-button>
                    <el-button :type="'warning'" @click="handleScheduling"
                        :disabled="seletedRows.length == 0">排程</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="tableData
                " size="small" :style="{ width: '100%' }" :height="tableHeight" :tooltip-effect="'dark'" border fit
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{
                            scope.$index + getForm.PageSize * (getForm.PageIndex - 1) + 1
                        }}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column :label="t('Scheduling.ProductSched.ProductOrder')" fixed prop=""
                    :min-width="getColumnWidth1('ProductOrder')" /> -->
                <el-table-column :label="t('Scheduling.ProductSched.MesOrder')" fixed prop="wo"
                    :min-width="getColumnWidth1('wo')" />
                <el-table-column :label="t('Scheduling.ProductSched.TBSide')" prop="orderName"
                    :min-width="getColumnWidth1('orderName')" />
                <el-table-column :label="t('Scheduling.ProductSched.ProductCode')" prop="PN"
                    :min-width="getColumnWidth1('PN')" />
                <!-- <el-table-column :label="t('Scheduling.ProductSched.ProductName')" prop="ProductName"
                    :min-width="getColumnWidth1('ProductName')" /> -->
                <el-table-column :label="t('Scheduling.ProductSched.Specification')" prop="Spec"
                    :min-width="getColumnWidth1('Spec')" />
                <el-table-column :label="t('Scheduling.ProductSched.bomVersion')" prop="BomVer"
                    :min-width="getColumnWidth1('BomVer')" />
                <el-table-column :label="t('Scheduling.ProductSched.ProductNum')" prop="planQty"
                    :min-width="getColumnWidth1('planQty')" />
                <!-- <el-table-column :label="t('Scheduling.ProductSched.RemainQty')" prop="RemainQty"
                    :min-width="getColumnWidth1('RemainQty')" /> -->
                <el-table-column :label="t('Scheduling.ProductSched.PlanStartDate')" prop="planStartTime" width="150" />
                <el-table-column :label="t('Scheduling.ProductSched.PlanEndDate')" prop="planEndTime" width="150" />

                <el-table-column :label="t('Scheduling.ProductSched.Status')" prop="Stts"
                    :min-width="getColumnWidth1('Stts')" />
                <!-- 
                <el-table-column :label="t('Scheduling.ERPDocument.Creator')" prop="Creator"
                    :min-width="getColumnWidth1('Creator')" /> -->
                <el-table-column :label="t('Scheduling.ERPDocument.Creatime')" prop="createdOn" width="150" />
                <template #empty>
                    <div class="flex items-center justify-center h-100%">
                        <el-empty />
                    </div>
                </template>
            </el-table>
            <div class="mt-2">
                <el-pagination :size="'small'" background @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :pager-count="5" :current-page="getForm.PageIndex"
                    :page-size="getForm.PageSize" :page-sizes="[30, 50, 100, 200, 300]"
                    layout="total,sizes, prev, pager, next" :total="total">
                </el-pagination>
            </div>
        </el-card>
        <el-dialog :title="$t('Scheduling.ProductSched.Sched')" align-center v-model="addVisible" width="85%"
            @close="addCancel">
            <el-form :model="addForm" ref="addFormRef" :inline="true">
                <el-form-item :label="t('Scheduling.ProductSched.Line')" prop="LineName" class="mb-2">
                    <el-select v-model="addForm.LineName" placeholder="选择产线" style="width: 200px" filterable>
                        <el-option v-for="item in lineList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="t('Scheduling.ProductSched.PlanStartDate')" prop="PlanStartTime" class="mb-2">
                    <el-date-picker v-model="addForm.PlanStartTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
                        placeholder="选择日期" style="width: 200px" />
                </el-form-item>
                <el-form-item :label="t('Scheduling.ProductSched.PlanEndDate')" prop="PlanEndTime" class="mb-2">
                    <el-date-picker v-model="addForm.PlanEndTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
                        placeholder="选择日期" style="width: 200px" />
                </el-form-item>
            </el-form>
            <el-table :data="seletedRows" size="small" :style="{ width: '100%' }" :height="400" :tooltip-effect="'dark'"
                border fit stripe>
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50" />
                <!-- <el-table-column :label="t('Scheduling.ProductSched.ProductOrder')" fixed prop=""
                    :min-width="getColumnWidth1('ProductOrder')" /> -->
                <el-table-column :label="t('Scheduling.ProductSched.MesOrder')" fixed prop="wo"
                    :min-width="getColumnWidth1('wo')" />
                <el-table-column :label="t('Scheduling.ProductSched.TBSide')" prop="orderName"
                    :min-width="getColumnWidth1('orderName')" />
                <el-table-column :label="t('Scheduling.ProductSched.ProductCode')" prop="PN"
                    :min-width="getColumnWidth1('PN')" />
                <!-- <el-table-column :label="t('Scheduling.ProductSched.ProductName')" prop="ProductName"
                    :min-width="getColumnWidth1('ProductName')" /> -->
                <el-table-column :label="t('Scheduling.ProductSched.Specification')" prop="Spec"
                    :min-width="getColumnWidth1('Spec')" />
                <el-table-column :label="t('Scheduling.ProductSched.bomVersion')" prop="BomVer"
                    :min-width="getColumnWidth1('BomVer')" />
                <el-table-column :label="t('Scheduling.ProductSched.ProductNum')" prop="planQty"
                    :min-width="getColumnWidth1('planQty')" />
                <!-- <el-table-column :label="t('Scheduling.ProductSched.RemainQty')" prop="RemainQty"
                    :min-width="getColumnWidth1('RemainQty')" /> -->
                <el-table-column :label="t('Scheduling.ProductSched.PlanStartDate')" prop="planStartTime" width="150" />
                <el-table-column :label="t('Scheduling.ProductSched.PlanEndDate')" prop="planEndTime" width="150" />

                <el-table-column :label="t('Scheduling.ProductSched.Status')" prop="Stts"
                    :min-width="getColumnWidth1('Stts')" />
                <!-- 
                <el-table-column :label="t('Scheduling.ERPDocument.Creator')" prop="Creator"
                    :min-width="getColumnWidth1('Creator')" /> -->
                <el-table-column :label="t('Scheduling.ERPDocument.Creatime')" prop="createdOn" width="150" />
                <template #empty>
                    <div class="flex items-center justify-center h-100%">
                        <el-empty />
                    </div>
                </template>
            </el-table>

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
import { getapsline, wotoaps, apsschedule, queryapsschedule } from "@/api/Scheduling/index"
import {
    shortcuts
} from "@/utils/dataMenu";
import { calculateColumnsWidth } from "@/utils/tableminWidth";
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
const searchDate = ref([]);
const tableHeight = ref(0);
const tableData = ref([
]);
const total = ref(0)
const getForm = ref({
    "PlanStartTime": "",
    "PlanEndTime": "",
    "LineName": "",
    "OrderName": "",
    "Wo": "",
    "LXStatus": "",
    "LXGroup": "",
    "PageIndex": 1,
    "PageSize": 50
})
const addVisible = ref(false)
const editVisible = ref(false)
const addForm = ref<any>({
    LineName: '',
    PlanStartTime: '',
    PlanEndTime: '',
    OrderList: []
})
const editForm = ref({
})
const seletedRows = ref([])
const lineList = ref<any>([

])

watch(
    () => searchDate.value,
    (newVal: any, oldVal: any) => {
        if (newVal === null) {
            getForm.value.PlanStartTime = "";
            getForm.value.PlanEndTime = "";
            getForm.value.PageIndex = 1

            return;
        }
        if (newVal !== oldVal) {
            getForm.value.PlanStartTime = newVal[0] + ' 00:00:00';
            getForm.value.PlanEndTime = newVal[1] + ' 23:59:59';
             getForm.value.PageIndex = 1
        }
    }
);
const getData = () => {
    // getForm.value.PageIndex=1
    queryapsschedule(getForm.value).then((res: any) => {
        // console.log(res);
        total.value = res.Data.total
        tableData.value = res.Data.rows
    })
}
const getLineData = () => {
    getapsline({}).then((res: any) => {
        // console.log(res);
        lineList.value = res.Data.map((item: any) => {
            return {
                label: item,
                value: item
            }
        })
    })
}
const searchData = () => {
    getForm.value.PageIndex = 1
    getData();
}
const handleSelectionChange = (val: any) => {
    seletedRows.value = val
    console.log(val)
}
const handleScheduling = () => {
    addVisible.value = true
}
const addCancel = () => {
    addVisible.value = false
}
const addSubmit = () => {
    // console.log(seletedRows.value);

    addForm.value.OrderList = seletedRows.value.map((item: any) => {
        return {
            OrderName: item.orderName,
            // Status:'已排产',
        }
    })
    apsschedule(addForm.value).then((res: any) => {
        if (res.Success) {
            ElMessage.success(res.Message)
            addVisible.value = false
            getData()
        } else {
            ElMessage.error(res.Message)
        }
    })
    // console.log(addForm.value);

}
const editCancel = () => {
    editVisible.value = false
}
const editSubmit = () => {

}
const handleSizeChange = (val: any) => {
    getForm.value.PageSize = val
    getData();
};
const handleCurrentChange = (val: any) => {
    getForm.value.PageIndex = val;
    getData();

};
const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 180;
    });
};
const columnWidths1 = computed(() => {
    const columns = [
        { label: t('Scheduling.ProductSched.MesOrder'), prop: 'wo' },
        { label: t('Scheduling.ProductSched.TBSide'), prop: 'orderName' },
        { label: t('Scheduling.ProductSched.ProductCode'), prop: 'PN' },
        { label: t('Scheduling.ProductSched.Specification'), prop: 'Spec' },
        { label: t('Scheduling.ProductSched.bomVersion'), prop: 'BomVer' },
        { label: t('Scheduling.ProductSched.ProductNum'), prop: 'planQty' },
        { label: t('Scheduling.ProductSched.Status'), prop: 'Stts' },
    ];

    // 批量计算列宽
    return calculateColumnsWidth(columns, tableData.value, {
        padding: 25,
        fontSize: 13,
    });
});

// 在模板中使用
const getColumnWidth1 = (prop: string) => {
    return columnWidths1.value[prop] || "auto";
};
onBeforeMount(() => {
    getScreenHeight();

});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    getData();
    getLineData()
});
onBeforeUnmount(() => {
    window.addEventListener("resize", getScreenHeight);
});
</script>
<style scoped>
.el-pagination {
    justify-content: center;
}
</style>
<style lang="scss" scoped></style>