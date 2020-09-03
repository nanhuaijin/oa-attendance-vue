<template>
  <div style="width: 50%;">
    <el-form ref="userForm" :model="userForm" :rules="updateRules" auto-complete="off" label-width="80px">
      <el-form-item label="真实姓名" prop="name">
        <el-input
          ref="name"
          v-model="userForm.name"
          name="name"
          type="text"
          tabindex="1"
        />
      </el-form-item>
      <el-form-item label="昵称" prop="username">
        <el-input
          ref="username"
          v-model="userForm.username"
          name="username"
          type="text"
          tabindex="2"
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          ref="email"
          v-model="userForm.email"
          name="email"
          type="text"
          tabindex="3"
        />
      </el-form-item>
      <el-form-item label="生日" prop="birthday">
        <el-date-picker
          ref="birthday"
          v-model="userForm.birthday"
          name="birthday"
          type="date"
          placeholder="选择日期"
          tabindex="4"
        />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group
          ref="sex"
          v-model="userForm.sex"
          tabindex="5"
        >
          <el-radio label="男" />
          <el-radio label="女" />
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="handleSubmit">更新</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getInfo, updateUserByAccount } from '@/api/user'
import { Message } from 'element-ui'

export default {
  // props: {
  //   user: {
  //     type: Object,
  //     default: () => {
  //       return {
  //         username: '',
  //         email: ''

  //       }
  //     }
  //   }
  // },
  data() {
    const validateName = (rule, value, callback) => {
      if (value.length < 1 || value.length > 10) {
        callback(new Error('真实姓名不合法'))
      } else {
        callback()
      }
    }
    const validateUsername = (rule, value, callback) => {
      if (value.length < 1 || value.length > 10) {
        callback(new Error('昵称不合法'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      const emailRegex = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/
      if (!emailRegex.test(value)) {
        callback(new Error('邮箱格式不正确'))
      } else {
        callback()
      }
    }
    return {
      userForm: {},
      updateRules: {
        name: [{ required: true, trigger: 'blur', validator: validateName }],
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        email: [{ required: true, trigger: 'blur', validator: validateEmail }]
      },
      loading: false
    }
  },
  // 页面创建的时候，调用后端接口查询当前人的信息
  created() {
    this.getUserInfo()
  },
  methods: {
    // 根据账号或者手机号获取当前用户信息
    getUserInfo() {
      const userInfo = JSON.parse(window.localStorage.getItem('userInfo'))

      getInfo(userInfo.account).then(response => {
        const { data } = response
        this.userForm = data.user
        if (this.userForm.sex) {
          this.userForm.sex = '女'
        } else {
          this.userForm.sex = '男'
        }
      })
    },
    // 更新用户信息
    handleSubmit() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          this.loading = true

          if (this.userForm.sex === '男') {
            this.userForm.sex = false
          } else {
            this.userForm.sex = true
          }

          var date = new Date(this.userForm.birthday)
          var year = date.getFullYear() + '-'
          var month = date.getMonth() + 1
          var day = date.getDate()
          var monthStr
          var dayStr
          if (month < 10) {
            monthStr = '0' + month + '-'
          }
          if (day < 10) {
            dayStr = '0' + day
          }
          const birthday = year + monthStr + dayStr

          this.userForm.birthday = birthday
          updateUserByAccount(this.userForm).then(response => {
            Message({
              message: '更新用户信息成功',
              type: 'success',
              duration: 2 * 1000
            })
            if (this.userForm.sex) {
              this.userForm.sex = '女'
            } else {
              this.userForm.sex = '男'
            }
            // 更新成功删除token
            this.userForm.updateToken = ''
          })
          this.loading = false
        }
      })
    }
  }
}
</script>
