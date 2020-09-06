import request from '@/utils/request'

// 获取打卡日历的打卡数据
export function listCalendarData(account) {
  return request({
    url: '/attendance/list/calendar/data',
    method: 'get',
    params: { account }
  })
}

// 获取某天的打卡信息
export function getCalendarDataByDay(account, year, month, day) {
  return request({
    url: '/attendance/get/calendar/data/day',
    method: 'get',
    params: { account, year, month, day }
  })
}

// 上班打卡
export function punchClockUp(account, address) {
  return request({
    url: '/attendance/punchClock/up',
    method: 'get',
    params: { account, address }
  })
}

// 下班打卡
export function punchClockLower(account, address, type) {
  return request({
    url: '/attendance/punchClock/lower',
    method: 'get',
    params: { account, address, type }
  })
}

// 获取打卡百分率
export function getPercentages(account) {
  return request({
    url: '/attendance/get/percentages',
    method: 'get',
    params: { account }
  })
}
