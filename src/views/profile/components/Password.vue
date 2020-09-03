<template>
  <div style="width: 50%;">
    <el-form ref="userForm" :model="userForm" :rules="updateRules" auto-complete="off" label-width="80px">
      <el-form-item label="账号">
        <el-input v-model.trim="userForm.account" disabled="disabled" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model.trim="userForm.password" name="password" type="password" />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model.trim="userForm.newPassword" name="newPassword" type="password" />
      </el-form-item>
      <el-form-item label="重复密码" prop="passwordAgain">
        <el-input v-model.trim="userForm.passwordAgain" name="passwordAgain" type="password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">更改密码</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
import { updatePasswordByAccount } from '@/api/user'
import { Message } from 'element-ui'

export default {
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码长度要大于5个字符'))
      } else {
        callback()
      }
    }
    const validatePasswordAgain = (rule, value, callback) => {
      if (value.length <= 0 || value !== this.userForm.newPassword) {
        callback(new Error('密码不一致'))
      } else {
        callback()
      }
    }
    return {
      checkPassword: false,
      mark: false,
      userForm: {
        account: '',
        password: '',
        newPassword: '',
        passwordAgain: '',
        updateToken: ''
      },
      updateRules: {
        password: [{ required: true, trigger: 'blur', message: '密码不能为空' }],
        newPassword: [{ required: true, trigger: 'blur', validator: validatePassword }],
        passwordAgain: [{ required: true, trigger: 'blur', validator: validatePasswordAgain }]
      }
    }
  },
  created() {
    this.fillAccount()
  },
  methods: {
    // 从localStorage获取账号
    fillAccount() {
      const userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
      this.userForm.account = userInfo.account
    },
    // 更新密码
    submit() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          updatePasswordByAccount(this.userForm).then(response => {
            Message({
              message: response.message,
              type: 'success',
              duration: 2 * 1000
            })
          }).catch(() => {
            // 密码置空
            this.userForm.password = ''
          })
        }
      })
    }
  }
}

</script>

<style lang="scss" scoped>

  .check-account {
    position: absolute;
    left: 62%;
    top: 7px;
    font-size: 16px;
    cursor: pointer;
    user-select: none;
  }
</style>

