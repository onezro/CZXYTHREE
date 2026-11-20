import { ElMessage } from "element-plus";

/**
 * File 转 Base64（去除 data URL 前缀）
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const result = (e.target?.result as string) || "";
      resolve(result.replace(/^data:.*?;base64,/, ""));
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const base64ToBlob = (base64: string) => {
  const content = base64.replace(/^data:.*?;base64,/, "");
  const binary = window.atob(content);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
};

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * 保存模板下载接口返回内容
 * 兼容后端返回 Excel 文件流或 { Success, Data: Base64 } 两种格式
 */
export const saveTemplateFile = async (res: any, fileName: string, failMsg: string) => {
  if (res instanceof Blob) {
    if (res.type && res.type.includes("json")) {
      const json = JSON.parse(await res.text());
      if (json.Data) {
        downloadBlob(base64ToBlob(json.Data), fileName);
      } else {
        ElMessage.error(json.Msg || json.Message || failMsg);
      }
      return;
    }
    downloadBlob(res, fileName);
    return;
  }
  if (res && res.Data) {
    downloadBlob(base64ToBlob(res.Data), fileName);
    return;
  }
  ElMessage.error(res?.Msg || res?.Message || failMsg);
};
