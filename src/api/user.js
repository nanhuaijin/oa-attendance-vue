import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

// 校验用户名是否重复
export function checkAccountExist(account) {
  return request({
    url: '/user/check/account',
    method: 'get',
    params: { account }
  })
}

// 注册
export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

// 获取打卡日历的打卡数据
export function listCalendarData(account) {
  return request({
    url: '/user/list/calendar/data',
    method: 'get',
    params: { account }
  })
}

// 获取某天的打卡信息
export function getCalendarDataByDay(account, year, month, day) {
  return request({
    url: '/user/get/calendar/data/day',
    method: 'get',
    params: { account, year, month, day }
  })
}

// 上班打卡
export function punchClockUp(account, address) {
  return request({
    url: '/user/punchClock/up',
    method: 'get',
    params: { account, address }
  })
}

// 下班打卡
export function punchClockLower(account, address, type) {
  return request({
    url: '/user/punchClock/lower',
    method: 'get',
    params: { account, address, type }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

// 注销登录
export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
