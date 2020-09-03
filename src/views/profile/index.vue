<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="动态" name="activity">
                <activity />
              </el-tab-pane>
              <el-tab-pane label="时间线" name="timeline">
                <timeline />
              </el-tab-pane>
              <el-tab-pane label="我的信息" name="account">
                <account :user="user" />
              </el-tab-pane>
              <el-tab-pane label="修改密码" name="password">
                <password />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Activity from './components/Activity'
import Timeline from './components/Timeline'
import Account from './components/Account'
import Password from './components/Password'

export default {
  name: 'Profile',
  components: { UserCard, Activity, Timeline, Account, Password },
  data() {
    return {
      user: {},
      activeTab: 'activity'
    }
  },
  computed: {
    ...mapGetters([
      'username',
      'avatar',
      'role',
      'email'
    ])
  },
  created() {
    const username = this.$store.state.user.username
    const avatar = this.$store.state.user.avatar
    const role = this.$store.state.user.role
    const email = this.$store.state.user.email
    if (!username || !avatar || !role || !email) {
      const userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
      this.$store.commit('user/SET_USERNAME', userInfo.username)
      this.$store.commit('user/SET_AVATAR', userInfo.avatar)
      this.$store.commit('user/SET_ROLE', userInfo.role)
      this.$store.commit('user/SET_EMAIL', userInfo.email)
    }
    this.getUser()
  },
  methods: {
    getUser() {
      this.user = {
        username: this.username,
        role: this.role,
        email: this.email,
        avatar: this.avatar
      }
    }
  }
}
</script>
