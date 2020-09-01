import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

// 发送手机验证码
export function sendSms(phone) {
  return request({
    url: '/user/sms',
    method: 'get',
    params: { phone }
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
