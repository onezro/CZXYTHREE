import request from "@/request/baseDataRequst";

//人员资质
export function savePersonQualification(data: any) {
  return request({
    url: "/api/Person/SavePersonQualification",
    method: "post",
    data
  });
}

export function deletePersonQualification(data: any) {
  return request({
    url: "/api/Person/DeletePersonQualification",
    method: "post",
    data
  });
}

//

export function getPagePersonQualification(data: any) {
  return request({
    url: "/api/Person/GetPagePersonQualification",
    method: "post",
    data
  });
}