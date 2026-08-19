import request from '@/request/permiss/TaskSettings'
// 查询任务列表
export const getTaskList = (data: any) => {
  return request({
    url: '/api/quartz/config/job/query',
    method: 'post',
    data,
  })
}

// 新增任务
export const addTask = (data: any) => {
  return request({
    url: '/api/quartz/config/job/insert',
    method: 'post',
    data,
  })
}

// 更新任务
export const updateTask = (data: any) => {
  return request({
    url: '/api/quartz/config/job/update',
    method: 'post',
    data,
  })
}

// 删除任务
export const deleteTask = (data: any) => {
  return request({
    url: '/api/quartz/config/job/delete',
    method: 'post',
    data,
  })
}

// 开启关闭任务状态
export const taskStatus = (data: any) => {
  return request({
    url: '/api/quartz/config/job/status',
    method: 'post',
    data,
  })
}
