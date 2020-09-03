import { login, logout, getInfo, register } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    username: '',
    account: '',
    email: '',
    role: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_ACCOUNT: (state, account) => {
    state.account = account
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_ROLE: (state, role) => {
    state.role = role
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { account, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ account: account.trim(), password: password }).then(response => {
        // 解构赋值，直接提取response中的data
        const { data } = response

        window.localStorage.setItem('userInfo', JSON.stringify(data.userInfo))

        commit('SET_NAME', data.userInfo.name)
        commit('SET_USERNAME', data.userInfo.username)
        commit('SET_ACCOUNT', data.userInfo.account)
        commit('SET_AVATAR', data.userInfo.avatar)
        commit('SET_TOKEN', response.code)
        setToken(response.code)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  register({ commit }, userInfo) {
    const { account, phone, code, password, passwordAgain } = userInfo
    return new Promise((resolve, reject) => {
      register({ account: account.trim(), phone: phone, code: code, password: password, passwordAgain: passwordAgain }).then(response => {
        // 解构赋值，直接提取response中的data
        const { data } = response

        window.localStorage.setItem('userInfo', JSON.stringify(data.userInfo))

        commit('SET_NAME', data.userInfo.name)
        commit('SET_USERNAME', data.userInfo.username)
        commit('SET_ACCOUNT', data.userInfo.account)
        commit('SET_AVATAR', data.userInfo.avatar)
        commit('SET_TOKEN', response.code)
        setToken(response.code)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

