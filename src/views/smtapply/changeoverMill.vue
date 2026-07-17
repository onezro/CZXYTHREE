<template>
    <div class="changeover-container">
        <!-- 主内容区 -->
        <div class="main-content">
            <!-- 左侧信息面板 -->
            <div class="info-panel">
                <div class="panel-header">
                    <h2 class="panel-title">
                        <el-icon>
                            <Document />
                        </el-icon>
                        工单信息
                    </h2>
                </div>

                <div class="panel-body">
                    <el-form ref="formRef" :model="form" label-width="100px" class="info-form inboundChange"
                        label-position="left" size="large">
                        <el-form-item label="工单号">
                            <el-select v-model="form.Order" @change="changeOrder" filterable placeholder="请选择工单"
                                class="full-width">
                                <el-option v-for="item in workOrderList" :key="item.WorkOrder" :label="item.WorkOrder"
                                    :value="item.WorkOrder">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="当前线体">
                            <div class="line-info">
                                <span class="line-name">{{ form.LineName || "未选择" }}</span>
                                <el-button type="primary" link @click="lineChangeVisible = true" class="line-set-btn">
                                    <el-icon>
                                        <Setting />
                                    </el-icon>
                                    设置
                                </el-button>
                            </div>
                        </el-form-item>

                        <div class="info-item">
                            <label>产品名称</label>
                            <div class="info-value">{{ form.Product || "--" }}</div>
                        </div>

                        <div class="info-grid">
                            <div class="info-item">
                                <label>BOM版本</label>
                                <div class="info-value">{{ form.BomVer || "--" }}</div>
                            </div>
                            <div class="info-item">
                                <label>软件版本</label>
                                <div class="info-value">{{ form.ProductVer || "--" }}</div>
                            </div>
                        </div>
                    </el-form>

                    <!-- 二维码区域 -->
                    <div v-if="form.Code != ''" class="qrcode-section">
                        <div class="qrcode-header">
                            <h3>
                                <el-icon>
                                    <Camera />
                                </el-icon>
                                工单二维码
                            </h3>
                        </div>
                        <div class="qrcode-wrapper">
                            <vue-qr :text="form.Code" :margin="5" colorDark="#006487" colorLight="#ffffff"
                                :logoScale="0.25" :size="200">
                            </vue-qr>
                            <div class="qrcode-hint">扫描二维码获取工单</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 右侧设备状态区 -->
            <div class="status-panel">
                <div class="panel-header">
                    <h2 class="panel-title">
                        <el-icon>
                            <Monitor />
                        </el-icon>
                        设备状态监控
                    </h2>
                    <div class="refresh-area">
                        <el-button type="primary" link @click="getStatus" class="refresh-btn">
                            <el-icon>
                                <Refresh />
                            </el-icon>
                            刷新状态
                        </el-button>
                    </div>
                </div>

                <div class="panel-body">
                    <!-- 设备状态卡片 -->
                    <div class="device-grid">
                        <div v-for="(item, index) in filteredDevices" :key="item.Equipid" class="device-card" :class="{
                            selected: isDeviceSelected(item),
                            disabled: !showDevice(item, index),
                            'status-success': getDeviceStatus(item) === 'success',
                            'status-warning': getDeviceStatus(item) === 'warning',
                            'status-failure': getDeviceStatus(item) === 'failure',
                            'status-pending': getDeviceStatus(item) === 'pending',
                        }" @click="toggleDeviceSelection(item)">
                            <div class="device-content">
                                <!-- 自定义选中标记 -->
                                <div class="custom-checkbox" :class="{ checked: isDeviceSelected(item) }">
                                    <el-icon v-if="isDeviceSelected(item)">
                                        <Check />
                                    </el-icon>
                                </div>

                                <div class="device-header">
                                    <div class="device-name">
                                        <span class="device-icon">
                                            <el-icon>
                                                <Cpu />
                                            </el-icon>
                                        </span>
                                        {{ item.EquipName }}
                                    </div>
                                </div>
                                <div class="device-details">
                                    <div class="detail-item">
                                        <span class="detail-label">设备</span>
                                        <div class="detail-value">
                                            <span class="status-indicator"
                                                :class="getStatusClass(item.McIdStatus)"></span>
                                            <span :class="getTextColorClass(item.McIdStatus)">
                                                {{ getStatusText(item.McIdStatus) }}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="detail-item" v-for="(status, idx) in item.conveyorStatusList"
                                        :key="idx">
                                        <span class="detail-label">轨道{{ Number(idx) + 1 }}</span>
                                        <div class="detail-value">
                                            <span class="status-indicator" :class="getStatusClass(status)"></span>
                                            <span :class="getTextColorClass(status)">{{
                                                getStatusText(status)
                                                }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="device-actions flex justify-between items-center">
                                    <el-button type="primary" link size="small" @click.stop="showDeviceGuide(item)"
                                        class="guide-btn">
                                        <el-icon>
                                            <Guide />
                                        </el-icon>
                                        操作指南
                                    </el-button>
                                    <div>
                                        <el-tag size="large" :type="getDeviceStatusTextType(item)" effect="light" round>
                                            <span class="text-lg font-black">{{
                                                getDeviceStatusText(item)
                                                }}</span>
                                        </el-tag>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 操作按钮 -->
                    <div class="action-section">
                        <div class="selected-info" v-if="checkedDevices.length > 0">
                            已选择 {{ checkedDevices.length }} 个设备
                        </div>
                        <el-button type="primary" @click="changeOver" :disabled="!isFormValid" :loading="isLoading"
                            class="changeover-btn">
                            <el-icon>
                                <SwitchButton />
                            </el-icon>
                            {{ isLoading ? "换线中..." : "一键换线" }}
                        </el-button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 线体设置对话框 -->
        <el-dialog v-model="lineChangeVisible" title="线体设置" width="400px" custom-class="line-dialog"     :close-on-click-modal="false" :close-on-press-escape="false">
            <div class="dialog-content">
                <el-select v-model="lineName" placeholder="请选择线体" class="full-width" filterable>
                    <el-option v-for="item in lineList" :key="item.line" :label="item.line" :value="item.line">
                    </el-option>
                </el-select>
            </div>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="lineChangeVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleLineSetting">确定</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 操作指南对话框 -->
        <el-dialog v-model="guideVisible" :title="`${currentDevice?.name || ''} 操作指南`" width="800px"
            custom-class="guide-dialog">
            <el-carousel ref="guideCarouselRef" indicator-position="outside" height="500px" :autoplay="false">
                <el-carousel-item v-for="(item, index) in guideImages" :key="index">
                    <div class="guide-slide">
                        <div class="slide-number">步骤 {{ index + 1 }}</div>
                        <img :src="item.img || item" :alt="`步骤${index + 1}`" />
                    </div>
                </el-carousel-item>
            </el-carousel>
        </el-dialog>

        <!-- 确认对话框 -->
        <el-dialog v-model="confirmVisible" title="换线确认" width="500px" custom-class="confirm-dialog">
            <div class="confirm-content">
                <div class="confirm-icon">
                    <el-icon>
                        <Warning />
                    </el-icon>
                </div>
                <div class="confirm-text">
                    <h3>确认执行换线操作？</h3>
                    <p>将为您选中的 {{ checkedDevices.length }} 个设备执行换线操作</p>
                    <div class="device-list" v-if="checkedDevices.length > 0">
                        <div v-for="device in checkedDevices" :key="device.Equipid" class="device-item">
                            <el-icon>
                                <Cpu />
                            </el-icon>
                            {{ device.EquipName }}
                        </div>
                    </div>
                </div>
            </div>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="confirmVisible = false">取消</el-button>
                    <el-button type="primary" @click="confirmChangeOver">确认换线</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 警告对话框 -->
        <el-dialog v-model="warningVisible" title="警告" width="600px" custom-class="warning-dialog">
            <div class="warning-content">
                <el-icon class="warning-icon">
                    <Warning />
                </el-icon>
                <div class="warning-text" v-html="warningText"></div>
            </div>

            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="warningVisible = false">确定</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 错误信息弹窗 -->
        <el-dialog v-model="errorDialogVisible" title="换线错误信息" width="700px" custom-class="error-dialog"
            :close-on-click-modal="false" :close-on-press-escape="false" align-center>
            <div class="error-content">
                <div class="error-summary">
                    <el-icon class="summary-icon">
                        <Warning />
                    </el-icon>
                    <span>本次换线共出现 <strong>{{ currentErrors.length }}</strong> 个错误</span>
                </div>
              <el-scrollbar height="400px">
                 <div v-for="(error, index) in currentErrors" :key="index" class="error-item">
                        <div class="error-index">{{ index + 1 }}</div>
                        <div class="error-info">
                            <div class="error-header">
                                <span class="device-name">{{ error.deviceName }}</span>
                                <span class="error-time">{{ error.timestamp }}</span>
                            </div>
                            <div class="error-details">
                                <span class="detail-item">工单: {{ error.order }}</span>
                                <span class="detail-item">线体: {{ error.line }}</span>
                            </div>
                            <div class="error-message">
                                <el-icon>
                                    <CloseCircle />
                                </el-icon>
                                {{ error.errorMsg }}
                            </div>
                        </div>
                    </div>
              </el-scrollbar>
                   
            </div>

            <template #footer>
                <span class="dialog-footer">
                    <el-button type="danger" @click="errorDialogVisible = false">关闭</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 悬浮错误按钮 -->
        <el-backtop v-if="currentErrors.length > 0" :bottom="150" :right="30" @click.native.prevent="errorDialogVisible = true">
            <el-badge :value="currentErrors.length" :max="99" class="backtop-badge">
                <el-icon class="backtop-error-icon">
                    <Warning />
                </el-icon>
            </el-badge>
        </el-backtop>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";

import {
   GetMillingValorLine,
   GetMillingValorChangeLineWoList,
   GetMillingValorChangeLineWoNew,
   GetMillingValorLineEquipMent,
   MillingChangeOverByOneKey,
   GetMillingChangeLineWoEquipStatus,
} from "@/api/smtApply/changeoverMill";
import { useUserStoreWithOut } from "@/stores/modules/user";
const userStore = useUserStoreWithOut();
import vueQr from "vue-qr/src/packages/vue-qr.vue";
import { ElMessage, ElNotification } from "element-plus";
import dayjs from "dayjs";

const formRef = ref(null);
const guideCarouselRef = ref(null);

const form = ref({
    Order: "",
    LineName: "",
    Product: "",
    Program: "",
    BomVer: "",
    ProductVer: "",
    Code: "",
});

const lineList = ref<any[]>([]);
const workOrderList = ref<any[]>([]);

const lineData = ref<any[]>([
    {
        Equipid: 1,
        EquipName: "Laser",
        McIdStatus: 1,
        ConveryNum: 1,
        conveyorStatusList: [],
    },
    {
        Equipid: 2,
        EquipName: "Printer",
        McIdStatus: 1,
        ConveryNum: 1,
        conveyorStatusList: [],
    },
    {
        Equipid: 3,
        EquipName: "SPI",
        McIdStatus: 1,
        ConveryNum: 1,
        conveyorStatusList: [],
    },
    {
        Equipid: 4,
        EquipName: "Mounter",
        McIdStatus: 1,
        ConveryNum: 1,
        conveyorStatusList: [],
    },
    {
        Equipid: 5,
        EquipName: "M-AOI",
        McIdStatus: 1,
        ConveryNum: 1,
        conveyorStatusList: [],
    },
]);

const checkedDevices = ref<any[]>([]);
const guideImages = ref<any[]>([]);
const guideVisible = ref(false);
const confirmVisible = ref(false);
const warningVisible = ref(false);
const lineChangeVisible = ref(false);
const isLoading = ref(false);
const currentDevice = ref<any>(null);
const lineName = ref("");
const warningText = ref("");
const checkBoxVal = ref();

interface ChangeoverError {
    timestamp: string;
    order: string;
    line: string;
    deviceName: string;
    errorMsg: string;
}

const currentErrors = ref<ChangeoverError[]>([]);
const errorHistory = ref<ChangeoverError[][]>([]);
const errorDialogVisible = ref(false);

const filteredDevices = computed(() => {
    return lineData.value.filter((device, index) => showDevice(device, index));
});

const isFormValid = computed(() => {
    return (
        form.value.Order &&
        form.value.LineName &&
        checkedDevices.value.length > 0
    );
});

onMounted(() => {
    const savedLineName = localStorage.getItem("millLineName");
    if (savedLineName) {
        lineName.value = savedLineName;
        form.value.LineName = savedLineName;
    }
    getSMTValorLineEquipMentData();
    getOrderList();
    getLineList();
});

const getSMTValorLineEquipMentData = () => {
    GetMillingValorLineEquipMent({
        line: lineName.value,
        EquipType: "",
    }).then((res: any) => {
        if (res.Data) {
            lineData.value = res.Data.map((item: any) => {
                const conveyorStatusList = [];
                for (let i = 0; i < item.ConveryNum; i++) {
                    conveyorStatusList.push("2");
                }
                return {
                    Equipid: item.Equipid,
                    EquipName: item.EquipName,
                    ConveryNum: item.ConveryNum,
                    McIdStatus: "2",
                    conveyorStatusList,
                };
            });
        }
        getStatus();
    });
};

const toggleDeviceSelection = (device: any) => {
    if (!showDevice(device, device.Equipid)) {
        return;
    }

    const index = checkedDevices.value.findIndex(
        (d: any) => d.Equipid === device.Equipid,
    );
    if (index > -1) {
        checkedDevices.value.splice(index, 1);
    } else {
        checkedDevices.value.push(device);
    }
};

const getStatusType = (device: any) => {
    if (device.equipment === "1" && device.orbit === "1") return "success";
    if (device.equipment === "0" || device.orbit === "0") return "danger";
    return "warning";
};

const getStatusText = (val: any) => {
    if (val == 0) return "失败";
    else if (val == 1 || val == -1) return "成功";
    else return "待换线";
};

const getStatusClass = (val: any) => {
    if (val == 1 || val == -1) return "online";
    if (val == 0) return "offline";
    return "pending";
};

const getTextColorClass = (val: any) => {
    if (val == 1 || val == -1) return "online-text";
    if (val == 0) return "offline-text";
    return "pending-text";
};

const isDeviceSelected = (device: any) => {
    return checkedDevices.value.some((d: any) => d.Equipid === device.Equipid);
};

const showDeviceGuide = (device: any) => {
    currentDevice.value = device;
    guideImages.value = [];
    guideVisible.value = true;
};

const getOrderList = async () => {
    GetMillingValorChangeLineWoList({}).then((res: any) => {
        workOrderList.value = res.Data;
    });
};

const getLineList = async () => {
    GetMillingValorLine({}).then((res: any) => {
        lineList.value = res.Data;
    });
};

const changeOrder = (order: any) => {
    clearAll();
    form.value.LineName = lineName.value;
    GetMillingValorChangeLineWoNew({ workOrder: form.value.Order }).then((res: any) => {
        form.value.Product = res.Data.Product;
        form.value.Program = res.Data.Soft;
        form.value.BomVer = res.Data.BomVer;
        form.value.ProductVer = res.Data.SoftVer;
        form.value.Code = res.Data.Side == "1" ? form.value.Order : "";
        getStatus();
    });
};

const getStatus = async () => {
    if (!form.value.Order || !form.value.LineName) {
        initializeStatus();
        return;
    }
    let data = {
        line: form.value.LineName,
        order: form.value.Order,
        side: "",
    };
    GetMillingChangeLineWoEquipStatus(data).then((res: any) => {
        updateDeviceStatus(res.Data);
    });
};

const updateDeviceStatus = (statusData: any) => {
    lineData.value = lineData.value.map((device) => {
        const status = statusData.find((s: any) => s.McId == device.Equipid);
        if (status) {
            const conveyorStatusList = [];
            for (let i = 1; i <= device.ConveryNum; i++) {
                const fieldName =
                    i === 1 ? "ConverConveyorStatus" : `ConverConveyorStatus${i}`;
                conveyorStatusList.push(status[fieldName] || "2");
            }
            return {
                ...device,
                McIdStatus: status.McIdStatus || "2",
                conveyorStatusList,
            };
        }
        return device;
    });
};

const initializeStatus = () => {
    lineData.value = lineData.value.map((device) => {
        const conveyorStatusList = new Array(device.ConveryNum).fill("2");
        return {
            ...device,
            McIdStatus: "2",
            conveyorStatusList,
        };
    });
};

const changeOver = () => {
    if (!isFormValid.value) {
        ElMessage.warning("请先完成工单、线体的选择，并选择要换线的设备");
        return;
    }

    currentErrors.value = [];
    confirmVisible.value = true;
};

const confirmChangeOver = async () => {
    confirmVisible.value = false;
    isLoading.value = true;
    const data = prepareChangeOverData();
    MillingChangeOverByOneKey({ ...data, OperatorUser: userStore.getUserInfo })
        .then((res: any) => {
            handleChangeOverResponse(res);
        })
        .finally(() => {
            isLoading.value = false;
        });
};

const prepareChangeOverData = () => {
    const devices = checkedDevices.value
        .sort((a: any, b: any) => a.id - b.id)
        .map((item: any) => ({
            McId: item.Equipid,
            McName: item.EquipName,
            Action: "Q",
        }));

    return {
        ...form.value,
        Side: "",
        McIDList: devices,
    };
};

const handleChangeOverResponse = (res: any) => {
    const timestamp = dayjs().format("YYYY-MM-DD HH:mm:ss");
    const errors: ChangeoverError[] = [];

    if (!res.Success) {
        errors.push({
            timestamp,
            order: form.value.Order,
            line: form.value.LineName,
            deviceName: "全局",
            errorMsg: res.Message,
        });
    }

    if (res.Data && Array.isArray(res.Data)) {
        res.Data.forEach((v: any) => {
            if (!v.success && v.Msg) {
                const device = lineData.value.find((d: any) => String(d.Equipid) === String(v.Mcid));
                errors.push({
                    timestamp,
                    order: form.value.Order,
                    line: form.value.LineName,
                    deviceName: device?.EquipName || `设备(${v.Mcid})`,
                    errorMsg: v.Msg,
                });
            }
        });
    }

    if (errors.length > 0) {
        currentErrors.value = errors;
        errorHistory.value.unshift(errors);
        if (errorHistory.value.length > 10) {
            errorHistory.value.pop();
        }
        errorDialogVisible.value = true;
    }

    if (res.Success) {
        checkedDevices.value = [];
    }

    lineData.value = lineData.value.map((device) => {
        const mainStatusItem = res.Data.find((s: any) => s.Mcid === device.Equipid);
        
        const mcIdStatus = mainStatusItem
            ? (mainStatusItem.success ? "1" : "0")
            : device.McIdStatus;

        const conveyorStatusList = [];
        for (let i = 1; i <= device.ConveryNum; i++) {
            const trackMcid = `${device.Equipid}-${i}`;
            const trackItem = res.Data.find((s: any) => s.Mcid === trackMcid);
            
            const originalStatus = device.conveyorStatusList?.[i - 1] ?? "2";
            const status = trackItem
                ? (trackItem.success ? "1" : "0")
                : originalStatus;
            conveyorStatusList.push(status);
        }

        return {
            ...device,
            McIdStatus: mcIdStatus,
            conveyorStatusList,
        };
    });
};

const handleChangeOverError = (error: any) => {
    console.error("换线请求失败:", error);
    ElNotification.error({
        title: "请求失败",
        message: "换线操作请求失败，请检查网络连接",
        duration: 3000,
    });
};

const handleLineSetting = async () => {
    clearAll();
    form.value.LineName = lineName.value;
    localStorage.setItem("millLineName", lineName.value);
    lineChangeVisible.value = false;
    getSMTValorLineEquipMentData();
};

const clearAll = () => {
    checkedDevices.value = [];
    initializeStatus();
};

const showDevice = (device: any, index: any) => {
    const lineName = form.value.LineName;
    if (!lineName) return true;
    return true;
};

const getDeviceStatusTextType = (device: any) => {
    const status = getDeviceStatus(device);
    if (status === "success") return "success";
    if (status === "warning") return "warning";
    if (status === "failure") return "danger";
    return "info";
};

const getDeviceStatusText = (device: any) => {
    const status = getDeviceStatus(device);
    if (status === "success") return "成功";
    if (status === "warning") return "换线中";
    if (status === "failure") return "失败";
    return "待换线";
};

const getDeviceStatus = (device: any) => {
    if (device.McIdStatus === "0") return "failure";
    if (device.conveyorStatusList.some((status: any) => status === "0"))
        return "failure";

    if (device.McIdStatus === "4") return "warning";
    if (device.conveyorStatusList.some((status: any) => status === "4"))
        return "warning";

    if (device.McIdStatus === "2") return "pending";

    const allConveyorSuccess = device.conveyorStatusList.every(
        (status: any) => status === "1" || status === "-1",
    );
 
    if (
        device.McIdStatus === "1" ||
        (device.McIdStatus === "-1" && allConveyorSuccess)
    )
        return "success";

    return "pending";
};
</script>

<style lang="scss" scoped>
.changeover-container {
    min-height: calc(100vh - 91px);
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
    background: linear-gradient(135deg, #f5f8fa 0%, #eef4f8 100%);
    padding: 20px;
    font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
}

.page-header {
    margin-bottom: 30px;
    text-align: center;

    .page-title {
        font-size: 2.5rem;
        font-weight: 600;
        color: #2c3e50;
        margin-bottom: 8px;
        background: linear-gradient(135deg, #006487 0%, #0097a7 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .page-subtitle {
        font-size: 1.1rem;
        color: #7f8c8d;
        font-weight: 400;
    }
}

.main-content {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 24px;
    margin: 0 auto;
    width: 100%;

    @media (max-width: 1200px) {
        grid-template-columns: 1fr;
    }
}

.info-panel,
.status-panel {
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0, 100, 135, 0.08);
    overflow: hidden;
    transition:
        transform 0.3s ease,
        box-shadow 0.3s ease;
    border: 1px solid rgba(0, 100, 135, 0.08);

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 15px 50px rgba(0, 100, 135, 0.12);
    }
}

.panel-header {
    padding: 10px 20px;
    background: linear-gradient(135deg, #006487 0%, #0088a3 100%);
    color: white;

    .panel-title {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 1.2rem;
        font-weight: 600;
        margin: 0;
        color: #ffffff;

        .el-icon {
            font-size: 1.8rem;
        }
    }
}

.status-panel .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .refresh-btn {
        color: white;
        font-size: 0.95rem;

        &:hover {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 6px;
        }
    }
}

.panel-body {
    padding: 32px;
}

.info-form {
    .full-width {
        width: 100%;
    }

    .line-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;

        .line-name {
            font-size: 1.2rem;
            font-weight: bold;
            color: #2c3e50;
        }

        .line-set-btn {
            color: #006487;
            font-size: 1.1rem;
            font-weight: 500;

            &:hover {
                color: #0088a3;
            }
        }
    }
}

.info-item {
    label {
        display: block;
        color: #7f8c8d;
        font-size: 1rem;
        margin-bottom: 6px;
        font-weight: 500;
    }

    .info-value {
        font-size: 1.2rem;
        font-weight: bold;
        color: #2c3e50;
        padding: 10px 15px;
        background: #f8f9fa;
        border-radius: 8px;
        border-left: 4px solid #006487;
    }
}

.info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 30px;
}

.qrcode-section {
    margin-top: 40px;
    padding-top: 30px;
    border-top: 1px solid #eef1f6;

    .qrcode-header {
        margin-bottom: 20px;

        h3 {
            display: flex;
            align-items: center;
            gap: 10px;
            color: #2c3e50;
            font-size: 1.3rem;
            margin: 0;
        }
    }

    .qrcode-wrapper {
        text-align: center;
        padding: 25px;
        background: #f8f9fa;
        border-radius: 12px;
        border: 2px dashed rgba(0, 100, 135, 0.2);

        .qrcode-hint {
            margin-top: 15px;
            color: #7f8c8d;
            font-size: 1rem;
        }
    }
}

.device-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
}

.device-card {
    background: white;
    border: 2px solid #eef1f6;
    border-radius: 12px;
    padding: 20px;
    transition: all 0.3s ease;
    position: relative;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    min-height: 220px;

    &:hover {
        border-color: #006487;
        box-shadow: 0 8px 25px rgba(76, 175, 80, 0.15);
        transform: translateY(-2px);
    }

    &.status-success {
        border-color: #4caf50 !important;

        .device-header {
            .device-name {
                .device-icon {
                    background: linear-gradient(135deg, #4caf50 0%, #81c784 100%);
                }
            }
        }

        .device-details {
            border: 2px solid #4caf50;
        }
    }

    &.status-warning {
        border-color: #e6a23c !important;

        .device-header {
            .device-name {
                .device-icon {
                    background: linear-gradient(135deg, #e6a23c 0%, #f5c78c 100%);
                }
            }
        }

        .device-details {
            border: 2px solid #e6a23c;
        }
    }

    &.status-failure {
        border-color: #f44336 !important;

        .device-header {
            .device-name {
                .device-icon {
                    background: linear-gradient(135deg, #f44336 0%, #ff8a80 100%);
                }
            }
        }

        .device-details {
            border: 2px solid #f44336;
        }
    }

    &.status-pending {
        border-color: #eef1f6;
    }

    &.selected {
        border-color: #006487;
        background: linear-gradient(135deg,
                rgba(0, 100, 135, 0.05) 0%,
                rgba(0, 100, 135, 0.02) 100%);

        .custom-checkbox {
            background-color: #006487;
            border-color: #006487;

            .el-icon {
                opacity: 1;
                transform: scale(1);
            }
        }

        .device-details {
            border: 2px solid #006487;
        }
    }

    &.disabled {
        opacity: 0.6;
        cursor: not-allowed;

        &:hover {
            transform: none;
            border-color: #eef1f6;
            box-shadow: none;
        }
    }
}

.custom-checkbox {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 1.8rem;
    height: 1.8rem;
    border: 2px solid #dcdfe6;
    border-radius: 4px;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    z-index: 10;

    .el-icon {
        color: white;
        font-size: 1.2rem;
        opacity: 0;
        transform: scale(0);
        transition: all 0.2s ease;
    }

    &.checked {
        background-color: #4caf50;
        border-color: #4caf50;

        .el-icon {
            opacity: 1;
            transform: scale(1);
        }
    }
}

.device-content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    .device-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 15px;
        padding-right: 30px;

        .device-name {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 1.5rem;
            font-weight: 600;
            color: #2c3e50;

            .device-icon {
                width: 2.7rem;
                height: 2.7rem;
                background: linear-gradient(135deg, #006487 0%, #0088a3 100%);
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;

                .el-icon {
                    color: white;
                    font-size: 1.5rem;
                }
            }
        }
    }

    .device-details {
        background: #f8f9fa;
        border: 2px solid #eef1f6;
        border-radius: 8px;
        padding: 15px;
        margin: 15px 0;
        flex-grow: 1;

        .detail-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;

            &:last-child {
                margin-bottom: 0;
            }

            .detail-label {
                color: #596263;
                font-size: 1.1rem;
            }

            .detail-value {
                display: flex;
                align-items: center;
                gap: 8px;
                font-weight: 500;

                .status-indicator {
                    flex-shrink: 0;
                }

                .online-text,
                .offline-text,
                .pending-text {
                    font-size: 1.1rem;
                }

                .status-indicator {
                    width: 1.1rem;
                    height: 1.1rem;
                    border-radius: 999px;

                    &.online {
                        background: #4caf50;
                    }

                    &.offline {
                        background: #f44336;
                    }

                    &.pending {
                        background: #d0d0d0;
                    }
                }

                .online-text {
                    color: #4caf50;
                }

                .offline-text {
                    color: #f44336;
                }

                .pending-text {
                    color: #000000;
                }
            }
        }
    }

    .device-actions {
        margin-top: auto;
        text-align: right;

        .guide-btn {
            color: #006487;
            font-size: 0.98rem;

            &:hover {
                color: #0088a3;
            }
        }
    }
}

.device-card {
    &.selected {
        animation: pulse-selected 0.5s ease;
    }
}

@keyframes pulse-selected {
    0% {
        box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4);
    }

    70% {
        box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
    }

    100% {
        box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
    }
}

.action-section {
    margin-top: 40px;
    text-align: center;
    padding-top: 30px;
    border-top: 1px solid #eef1f6;

    .selected-info {
        margin-bottom: 20px;
        color: #006487;
        font-weight: 500;
        font-size: 1.1rem;
    }

    .changeover-btn {
        padding: 18px 48px;
        font-size: 1.2rem;
        font-weight: 600;
        background: linear-gradient(135deg, #006487 0%, #0088a3 100%);
        border: none;
        border-radius: 12px;
        transition: all 0.3s ease;
        min-width: 200px;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(0, 100, 135, 0.3);
        }

        &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }
    }
}

:deep(.line-dialog),
:deep(.confirm-dialog),
:deep(.warning-dialog),
:deep(.guide-dialog) {
    border-radius: 16px;

    .el-dialog__header {
        padding: 24px 32px;
        background: linear-gradient(135deg, #006487 0%, #0088a3 100%);
        border-radius: 16px 16px 0 0;

        .el-dialog__title {
            color: white;
            font-size: 1.4rem;
            font-weight: 600;
        }

        .el-dialog__headerbtn {
            .el-dialog__close {
                color: white;
                font-size: 1.2rem;
            }
        }
    }

    .el-dialog__body {
        padding: 32px;
    }

    .el-dialog__footer {
        padding: 20px 32px;
        border-top: 1px solid #eef1f6;
    }
}

.confirm-content {
    display: flex;
    align-items: flex-start;
    gap: 24px;

    .confirm-icon {
        .el-icon {
            font-size: 3rem;
            color: #ff9800;
        }
    }

    .confirm-text {
        flex: 1;

        h3 {
            margin: 0 0 12px 0;
            color: #2c3e50;
            font-size: 1.3rem;
        }

        p {
            color: #7f8c8d;
            margin-bottom: 20px;
        }

        .device-list {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 15px;
            max-height: 200px;
            overflow-y: auto;
            font-size: 18px;

            .device-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 8px;
                border-bottom: 1px solid #eef1f6;

                &:last-child {
                    border-bottom: none;
                }

                .el-icon {
                    font-size: 25px;
                    color: #006487;
                }
            }
        }
    }
}

.warning-content {
    display: flex;
    align-items: flex-start;
    gap: 24px;

    .warning-icon {
        font-size: 3rem;
        color: #f44336;
        flex-shrink: 0;
    }

    .warning-text {
        flex: 1;
        font-size: 1.1rem;
        line-height: 1.6;
        color: #666;
    }
}

.guide-slide {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .slide-number {
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(0, 100, 135, 0.9);
        color: white;
        padding: 6px 16px;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 500;
    }
}

@media (max-width: 768px) {
    .changeover-container {
        padding: 15px;
    }

    .page-title {
        font-size: 2rem;
    }

    .panel-body {
        padding: 20px;
    }

    .device-grid {
        gap: 15px;
    }

    .changeover-btn {
        padding: 14px 36px;
        font-size: 1.1rem;
        min-width: 180px;
    }
}

@media (max-width: 480px) {
    .page-title {
        font-size: 1.8rem;
    }

    .info-grid {
        grid-template-columns: 1fr;
    }

    .device-card {
        padding: 15px;
    }
}

.error-content {
    .error-summary {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 20px;
        background: rgba(244, 67, 54, 0.1);
        border-radius: 8px;
        margin-bottom: 20px;
        font-size: 1.1rem;
        color: #f44336;

        .summary-icon {
            font-size: 1.5rem;
        }

        strong {
            color: #f44336;
            font-size: 1.3rem;
        }
    }

    .error-list {
        max-height: 400px;
        overflow-y: auto;
    }

    .error-item {
        display: flex;
        gap: 16px;
        padding: 16px;
        background: #f8f9fa;
        border-radius: 8px;
        margin-bottom: 12px;
        border-left: 4px solid #f44336;

        &:last-child {
            margin-bottom: 0;
        }

        .error-index {
            width: 32px;
            height: 32px;
            background: #f44336;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            flex-shrink: 0;
        }

        .error-info {
            flex: 1;

            .error-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;

                .device-name {
                    font-weight: 600;
                    font-size: 1.1rem;
                    color: #2c3e50;
                }

                .error-time {
                    font-size: 0.9rem;
                    color: #7f8c8d;
                }
            }

            .error-details {
                display: flex;
                gap: 20px;
                margin-bottom: 10px;

                .detail-item {
                    font-size: 0.95rem;
                    color: #596263;
                    background: white;
                    padding: 4px 10px;
                    border-radius: 4px;
                }
            }

            .error-message {
                display: flex;
                align-items: flex-start;
                gap: 8px;
                font-size: 1rem;
                color: #f44336;
                line-height: 1.5;

                .el-icon {
                    margin-top: 2px;
                    flex-shrink: 0;
                }
            }
        }
    }
}

:deep(.error-dialog) {
    border-radius: 16px;

    .el-dialog__header {
        padding: 24px 32px;
        background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
        border-radius: 16px 16px 0 0;

        .el-dialog__title {
            color: white;
            font-size: 1.4rem;
            font-weight: 600;
        }

        .el-dialog__headerbtn {
            .el-dialog__close {
                color: white;
                font-size: 1.2rem;
            }
        }
    }

    .el-dialog__body {
        padding: 32px;
    }

    .el-dialog__footer {
        padding: 20px 32px;
        border-top: 1px solid #eef1f6;
    }
}

:deep(.el-backtop) {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(244, 67, 54, 0.4);
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;

    &:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 30px rgba(244, 67, 54, 0.5);
        background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
    }

    .backtop-error-icon {
        font-size: 1.8rem;
        color: white;
    }

    .backtop-badge {
        .el-badge__content {
            background: #ffeb3b;
            color: #333;
            font-weight: bold;
            font-size: 0.85rem;
            border: 2px solid white;
        }
    }
}
</style>
<style lang="scss">
.inboundChange .el-form-item__label {
    font-size: 1.1rem;
}

.inboundChange .el-select__wrapper {
    font-size: 1.2rem;
    font-weight: bold;
}

.el-select-dropdown__item {
    font-size: 1rem;
}
</style>