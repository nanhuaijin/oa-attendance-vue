<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>个人简介</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <pan-thumb :avatar="user.avatar" :height="'100px'" :width="'100px'" :hoverable="false">
          <div>day day up</div>
        </pan-thumb>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ user.username }}</div>
        <div class="user-role text-center text-muted">{{ user.role }}</div>
        <div class="user-role text-center text-muted">{{ user.email }}</div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="education" /><span>签名</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            世间情动，不过盛夏白瓷梅子汤
          </div>
        </div>
      </div>

      <div class="user-skills user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="skill" /><span>出勤率</span></div>
        <div class="user-bio-section-body">
          <div class="progress-item">
            <span>本周</span>
            <el-progress :percentage="percentages.currWeekPer" :color="currWeek" />
          </div>
          <div class="progress-item">
            <span>上周</span>
            <el-progress :percentage="percentages.preWeekPer" :color="preWeek" />
          </div>
          <div class="progress-item">
            <span>本月</span>
            <el-progress :percentage="percentages.currMonthPer" :color="currMonth" />
          </div>
          <div class="progress-item">
            <span>本年</span>
            <el-progress :percentage="percentages.currYearPer" :color="currYear" />
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import PanThumb from '@/components/PanThumb'
import { getPercentages } from '@/api/attendance'

export default {
  components: { PanThumb },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          username: '',
          email: '',
          avatar: '',
          role: ''
        }
      }
    }
  },
  data() {
    return {
      percentages: {
        currWeekPer: 10,
        preWeekPer: 20,
        currMonthPer: 30,
        currYearPer: 40
      },
      currWeek: '#87CEEB',
      preWeek: '#FFA500',
      currMonth: '#FFA07A',
      currYear: '#9370DB'
    }
  },
  created() {
    this.getPercentage()
  },
  methods: {
    getPercentage() {
      const userInfo = JSON.parse(window.localStorage.getItem('userInfo'))

      getPercentages(userInfo.account).then(response => {
        const { data } = response
        this.percentages = data.percentages
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-center {
  text-align-last: center;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>
