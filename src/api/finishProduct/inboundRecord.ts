import request from "@/request/baseDataRequst";
export function getIntactJobBooking(data:any) {
  return request({
    url: "/api/IntactProduct/GetIntactJobBooking",
    method: "post",
    data
  });
}

///上传erP

export function uploadWareHousing(data:any) {
  return request({
    url: "/api/IntactProduct/UploadWareHousing",
    method: "post",
    data
  });
}

///Store/UploadWorkingHours
export function uploadWorkingHours(data:any) {
  return request({
    url: "/api/IntactProduct/UploadWorkingHours",
    method: "post",
    data
  });
}

export function getPackPage(data:any) {
  return request({
    url: "/api/Pack/GetPackPage",
    method: "post",
    data
  });
}
//成品绑定
export function getPackBind(data:any) {
  return request({
    url: "/api/Pack/GetPackBind",
    method: "post",
    data
  });
}