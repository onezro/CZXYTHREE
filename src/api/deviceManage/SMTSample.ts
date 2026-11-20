import request from '@/request/deviceRequest'

// 添加SMT样本
export const AddSMTSample = (data: any) => {
  return request({
    url: '/api/SMTSample/AddSMTSample',
    method: 'post',
    data
  })
}

// 更新SMT样本
export const UpdateSMTSample = (data: any) => {
  return request({
    url: '/api/SMTSample/UpdateSMTSample',
    method: 'post',
    data
  })
}

// 删除SMT样本
export const DeleteSMTSample = (data: any) => {
  return request({
    url: '/api/SMTSample/DeleteSMTSample',
    method: 'post',
    data
  })
}

// 查询SMT样本列表
export const QuerySMTSampleList = (data: any) => {
  return request({
    url: '/api/SMTSample/QuerySMTSampleList',
    method: 'post',
    data
  })
}
// 查询SMT样本列表
export const QuerySMTSampleByFinishedCodeVersion = (data: any) => {
  return request({
    url: '/api/SMTSample/QuerySMTSampleByFinishedCodeVersion',
    method: 'post',
    data
  })
}

// 导入SMT样本
export const ImportSMTSample = (data: any) => {
  return request({
    url: '/api/SMTSample/ImportSMTSample',
    method: 'post',
    data
  })
}

// 下载SMT样本导入模板
export const DownloadSMTSampleTemplate = (data: any) => {
  return request({
    url: '/api/SMTSample/Template',
    method: 'post',
    data,
    responseType: 'blob'
  })
}
