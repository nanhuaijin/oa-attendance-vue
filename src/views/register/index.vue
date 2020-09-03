<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="registerRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">CCloud考勤管理系统注册</h3>
      </div>

      <el-form-item prop="account">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="account"
          v-model="loginForm.account"
          placeholder="请输出账号"
          name="account"
          type="text"
          tabindex="1"
          auto-complete="off"
          @blur="handleCheckAccount"
        />
        <span v-if="checkAccountFlag && mark" class="check-account">
          <i class="el-icon-circle-check" style="color:green;" />
        </span>
        <span v-if="checkAccountFlag && !mark" class="check-account">
          <i class="el-icon-circle-close" style="color:red;" />
        </span>

      </el-form-item>

      <el-form-item prop="phone">
        <span class="svg-container">
          <i class="el-icon-phone" style="font-size: large;" />
        </span>
        <el-input
          ref="phone"
          v-model="loginForm.phone"
          placeholder="请输入手机号码"
          name="phone"
          type="text"
          tabindex="2"
          auto-complete="off"
        />
      </el-form-item>

      <el-form-item prop="code">
        <span class="svg-container">
          <i class="el-icon-info" style="font-size: large;" />
        </span>
        <el-input
          ref="code"
          v-model="loginForm.code"
          placeholder="请输入验证码"
          name="code"
          type="text"
          tabindex="3"
          auto-complete="off"
        />
      </el-form-item>
      <el-button type="info" plain @click="handleSendMessage">发送验证码</el-button>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="4"
          auto-complete="off"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-form-item prop="passwordAgain">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordTypeAgain"
          ref="passwordAgain"
          v-model="loginForm.passwordAgain"
          :type="passwordTypeAgain"
          placeholder="请确认密码"
          name="passwordAgain"
          tabindex="5"
          auto-complete="off"
          @keyup.enter.native="handleRegister"
        />
        <span class="show-pwd" @click="showPwdAgain">
          <svg-icon :icon-class="passwordTypeAgain === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <div class="index-function-menu">
        <el-button :loading="loading" type="primary" style="width:30%;margin-bottom:30px;" @click.native.prevent="handleBack">返回</el-button>
        <el-button :loading="loading" type="primary" style="width:30%;margin-bottom:30px;margin-left:177px;" @click.native.prevent="handleRegister">注册</el-button>
      </div>

    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { checkAccountExist, sendSms } from '@/api/user'
import { Message } from 'element-ui'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入用户名'))
      } else if (value.length < 5 || value.length > 15) {
        callback(new Error('用户名要大于等于5个字符，小于等于15字符'))
      } else {
        callback()
      }
    }

    const validatePhone = (rule, value, callback) => {
      const regex = /^1[0-9]{10}$/
      if (value.length <= 0 || !regex.test(value)) {
        callback(new Error('手机号码格式不正确'))
      } else {
        callback()
      }
    }

    const validatePassword = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码长度要大于5个字符'))
      } else {
        callback()
      }
    }
    const validatePasswordAgain = (rule, value, callback) => {
      if (value.length <= 0 || value !== this.loginForm.password) {
        callback(new Error('密码不一致'))
      } else {
        callback()
      }
    }

    return {
      checkAccountFlag: false,
      mark: false,
      loginForm: {
        account: '',
        phone: '',
        code: '',
        password: '',
        passwordAgain: ''
      },
      registerRules: {
        account: [{ required: true, trigger: 'blur', validator: validateUsername }],
        phone: [{ required: true, trigger: 'blur', validator: validatePhone }],
        code: [{ required: true, trigger: 'blur', message: '请输入验证码' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        passwordAgain: [{ required: true, trigger: 'blur', validator: validatePasswordAgain }]
      },
      loading: false,
      passwordType: 'password',
      passwordTypeAgain: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    showPwdAgain() {
      if (this.passwordTypeAgain === 'password') {
        this.passwordTypeAgain = ''
      } else {
        this.passwordTypeAgain = 'password'
      }
      this.$nextTick(() => {
        this.$refs.passwordAgain.focus()
      })
    },
    // 校验账号是否可用
    handleCheckAccount() {
      checkAccountExist(this.loginForm.account).then(response => {
        this.checkAccountFlag = true
        this.mark = true
      }).catch(msg => {
        this.checkAccountFlag = true
        this.mark = false
      })
    },
    // 发送验证码
    handleSendMessage() {
      const type = 0
      sendSms(this.loginForm.phone, type).then(response => {
        Message({
          message: '验证码发送成功',
          type: 'success',
          duration: 2 * 1000
        })
      })
    },
    // 注册
    handleRegister() {
      this.$refs.loginForm.validate(valid => {
        if (valid && this.mark) {
          this.loading = true
          this.$store.dispatch('user/register', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          Message({
            message: '必填项未通过校验',
            type: 'error',
            duration: 5 * 1000
          })
        }
      })
    },
    handleBack() {
      this.$router.push({ path: '/login' })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .check-account {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    cursor: pointer;
    user-select: none;
  }
}
</style>
