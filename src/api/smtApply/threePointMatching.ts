import request from "@/request/smtApplyRequest";
import { getToken } from "@/utils/auth";

const BASE = "/smtApplyApi/api/ThreePointMatching";

export function QuerySummaryPage(data: any) {
  return request({
    url: "/api/ThreePointMatching/QuerySummaryPage",
    method: "post",
    data,
  });
}

export function QueryDetailList(data: any) {
  return request({
    url: "/api/ThreePointMatching/QueryDetailList",
    method: "post",
    data,
  });
}

export function SaveCauseAnalysis(data: any) {
  return request({
    url: "/api/ThreePointMatching/SaveCauseAnalysis",
    method: "post",
    data,
  });
}

const buildFetchOptions = (): RequestInit => {
  const token = getToken() || "";
  return {
    method: "GET",
    headers: token ? { authorization: token } : {},
  };
};

// 下载高清原图（返回图片二进制 Blob）
export function DownloadOriginalImage(recordGuid: string): Promise<Blob> {
  return fetch(`${BASE}/DownloadOriginalImage?recordGuid=${encodeURIComponent(recordGuid)}`, buildFetchOptions()).then(
    (response) => {
      if (!response.ok) throw new Error(`下载失败: ${response.status}`);
      return response.blob();
    }
  );
}

// 下载 PCBID 的 TXT 文件（返回文本 Blob）
export function DownloadTxt(container: string): Promise<Blob> {
  return fetch(`${BASE}/DownloadTxt?container=${encodeURIComponent(container)}`, buildFetchOptions()).then(
    (response) => {
      if (!response.ok) throw new Error(`下载失败: ${response.status}`);
      return response.blob();
    }
  );
}

// 预览 PCBID 的 TXT 内容（返回文本）
export function GetTxtContent(container: string): Promise<string> {
  return fetch(`${BASE}/DownloadTxt?container=${encodeURIComponent(container)}`, buildFetchOptions()).then(
    (response) => {
      if (!response.ok) throw new Error(`加载失败: ${response.status}`);
      return response.text();
    }
  );
}
