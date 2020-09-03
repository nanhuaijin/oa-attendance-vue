<template>
  <!-- 如果hidden为true不展示绑定手机号页面 -->
  <div v-if="hidden" style="width: 50%;">
    <el-form ref="phoneForm" :model="phoneForm" :rules="updateRules" auto-complete="off" label-width="80px">
      <el-form-item label="手机号" prop="oldPhone">
        <el-input
          v-model.trim="phoneForm.oldPhone"
          placeholder="请输入手机号码"
        />
      </el-form-item>
      <el-form-item label="验证码" prop="oldCode">
        <el-input
          v-model.trim="phoneForm.oldCode"
          style="width: 50%;"
          placeholder="请输入验证码"
        />
        <el-button type="primary" class="code-button" @click="handleCode">获取验证码</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="binding">绑定手机号</el-button>
      </el-form-item>
    </el-form>
  </div>

  <div v-else-if="!hidden" style="width: 50%;">
    <el-form ref="phoneForm" :model="phoneForm" :rules="updateRules" auto-complete="off" label-width="80px">
      <el-form-item label="旧手机号">
        <el-input
          v-model.trim="phoneForm.oldPhone"
          disabled="disabled"
        />
      </el-form-item>
      <el-form-item label="验证码" prop="oldCode">
        <el-input
          v-model.trim="phoneForm.oldCode"
          style="width: 50%;"
          placeholder="请输入验证码"
        />
        <el-button type="primary" class="code-button" @click="handlePhoneCode">获取验证码</el-button>
      </el-form-item>
      <el-form-item label="新手机号" prop="newPhone">
        <el-input
          v-model.trim="phoneForm.newPhone"
          placeholder="请输入手机号码"
        />
      </el-form-item>
      <el-form-item label="新验证码" prop="newCode">
        <el-input
          v-model.trim="phoneForm.newCode"
          style="width: 50%;"
          placeholder="请输入验证码"
        />
        <el-button type="primary" class="code-button" @click="handleCode">获取验证码</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">更换手机号</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { updatePhoneByAccount, bingingPhoneByAccount, sendSms } from '@/api/user'
import { Message } from 'element-ui'

export default {
  data() {
    const validatePhone = (rule, value, callback) => {
      const regex = /^1[0-9]{10}$/
      if (value.length <= 0 || !regex.test(value)) {
        callback(new Error('手机号码格式不正确'))
      } else {
        callback()
      }
    }
    return {
      hidden: true,
      phoneForm: {
        account: '',
        oldPhone: '',
        oldCode: '',
        newPhone: '',
        newCode: ''
      },
      updateRules: {
        oldPhone: [{ required: true, trigger: 'blur', validator: validatePhone }],
        oldCode: [{ required: true, trigger: 'blur', message: '验证码不能为空' }],
        newPhone: [{ required: true, trigger: 'blur', validator: validatePhone }],
        newCode: [{ required: true, trigger: 'blur', message: '验证码不能为空' }]
      }
    }
  },
  created() {
    this.fillPhone()
  },
  methods: {
    // 从localStorage获取账号
    fillPhone() {
      const userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
      this.phoneForm.account = userInfo.account
      const phone = userInfo.phone
      if (phone) {
        this.hidden = false
        this.phoneForm.oldPhone = phone
      }
    },
    // 旧手机获取验证码
    handlePhoneCode() {
      const type = 1
      sendSms(this.phoneForm.oldPhone, type).then(response => {
        Message({
          message: '验证码发送成功',
          type: 'success',
          duration: 2 * 1000
        })
      })
    },
    // 新手机获取验证码
    handleCode() {
      const type = 0
      sendSms(this.phoneForm.newPhone, type).then(response => {
        Message({
          message: '验证码发送成功',
          type: 'success',
          duration: 2 * 1000
        })
      })
    },

    // 绑定手机号
    binding() {
      this.$refs.phoneForm.validate(valid => {
        if (valid) {
          bingingPhoneByAccount(this.phoneForm).then(response => {
            Message({
              message: response.message,
              type: 'success',
              duration: 2 * 1000
            })
          })
        }
      })
    },

    // 更换手机号
    submit() {
      this.$refs.phoneForm.validate(valid => {
        if (valid) {
          updatePhoneByAccount(this.phoneForm).then(response => {
            Message({
              message: response.message,
              type: 'success',
              duration: 2 * 1000
            })
          })
        }
      })
    }
  }
}

</script>

<style lang="scss" scoped>

  .code-button {
    position: absolute;
    right: 80px;
  }
</style>
