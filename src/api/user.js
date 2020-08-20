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

export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

export function punchClockUp(account, address) {
  return request({
    url: '/user/punchClock/up',
    method: 'get',
    params: { account, address }
  })
}

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

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
