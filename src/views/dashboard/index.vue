<template>
  <div
    v-loading="loading"
    element-loading-text="拼命获取定位中，如果长时间未响应请刷新重试..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div class="flex">
      <div style="text-align: center;">
        <clock size="300px" color="#FFFFFF" bg="#4AB7BD" /><br>
        <p>
          <el-button type="primary" style="margin-top: inherit;" @click="handlePunchClockUp">上班打卡</el-button>
          <el-button type="primary" style="margin-top: inherit;" @click="handlePunchClockLower">下班打卡</el-button>
        </p>
      </div>

      <div>
        <div>
          <el-tooltip class="item" effect="dark" content="刷新" placement="top">
            <el-button icon="el-icon-refresh-right" circle style="display: inline-block;float: left;" @click="changeEvents" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="返回今天" placement="top">
            <el-button icon="el-icon-aim" circle style="display: inline-block;float: right;" @click="$refs.calendar.setToday()" />
          </el-tooltip>
        </div>

        <calendar
          ref="calendar"
          :events="calendar.events"
          :lunar="calendar.lunar"
          :value="calendar.value"
          :begin="calendar.begin"
          :end="calendar.end"
          :weeks="calendar.weeks"
          :months="calendar.months"
          @select="calendar.select"
          @selectMonth="calendar.selectMonth"
          @selectYear="calendar.selectYear"
        />
      </div>
      <el-calendar>
        <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
        <template slot="dateCell" slot-scope="{date, data}">
          <div style="position: relative; text-align: center;" @click="getCalendarDayData(data)">
            {{ data.day.split('-')[2] > 9 ? data.day.split('-')[2] : data.day.split('-')[2] * 1 }}
            <div v-for="item in calendarData" :key="item.id">
              <div v-if="data.day.split('-')[0] == item.year && data.day.split('-')[1] == item.month && data.day.split('-')[2] == item.day">
                <br>

                <div v-if="item.status == 0">
                  <el-button type="success" circle />
                </div>
                <div v-if="item.status == 1">
                  <el-button type="danger" circle />
                </div>
                <div v-if="item.status == 2">
                  <el-button type="warning" circle />
                </div>
                <div v-if="item.status == 3">
                  <el-button type="info" circle />
                </div>
                <div v-if="item.status == 4">
                  <el-button type="primary" circle />
                </div>

              </div>
            </div>
          </div></template>
      </el-calendar>
    </div>
    <el-dialog
      title="每日打卡信息"
      :visible.sync="dialogVisible"
      width="25%"
    >
      <el-form :label-position="labelPosition" label-width="80px" :model="calendarDayData">
        <el-form-item label="工作时长:">
          <div><span>{{ calendarDayData.hours }} 小时</span></div>
        </el-form-item>
        <el-form-item label="上班状态:">
          <div><span>{{ calendarDayData.status }}</span></div>
        </el-form-item>
        <el-form-item label="上班时间:">
          <div><span>{{ calendarDayData.start }}</span></div>
        </el-form-item>
        <el-form-item label="下班时间:">
          <div><span>{{ calendarDayData.end }}</span></div>
        </el-form-item>
        <el-form-item label="打卡地点:">
          <div><span>{{ calendarDayData.addressStart }}</span></div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <div class="map-content">
      <baidu-map class="map" center="上海">
        <bm-geolocation
          anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
          :show-address-bar="true"
          :auto-location="true"
        />
      </baidu-map>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Calendar from '@/components/Calendar'
import Clock from 'vue-clock2'
import { punchClockUp, punchClockLower, listCalendarData, getCalendarDataByDay } from '@/api/user'
import { Message } from 'element-ui'

export default {
  name: 'Dashboard',
  components: {
    Calendar,
    Clock
  },
  inject: ['reload'],
  data() {
    return {
      value: new Date(),
      address: '',
      type: 0,
      loading: false,
      punchClockStatus: '',
      calendarData: [], // 填充打卡日历的打卡信息
      // 每日的打卡信息
      calendarDayData: {
        hours: 0,
        status: '',
        start: '',
        end: '',
        addressStart: ''
      },
      dialogVisible: false,
      labelPosition: 'right',
      calendar: {
        value: [], // 默认日期
        lunar: true, // 显示农历
        weeks: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        events: {
          '2017-7-7': '$408',
          '2017-7-20': '$408',
          '2017-7-21': '$460',
          '2017-7-22': '$500'
        },
        select(value) {
          console.log(value.toString())
        },
        selectMonth(month, year) {
          console.log(year, month)
        },
        selectYear(year) {
          console.log(year)
        },
        timestamp: Date.now()
      }
    }
  },
  created() {
    this.handleCalendarData()
  },
  methods: {
    // 获取打卡日历的打卡数据
    handleCalendarData() {
      const userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
      const account = userInfo.account
      listCalendarData(account).then(response => {
        const { data } = response
        this.calendarData = data.list
      })
    },
    // 获取具体某天的打卡信息
    getCalendarDayData(data) {
      const userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
      const account = userInfo.account
      const year = data.day.split('-')[0]
      const month = data.day.split('-')[1]
      const day = data.day.split('-')[2]
      getCalendarDataByDay(account, year, month, day).then(response => {
        const { data } = response
        this.calendarDayData = data.attendance
        const statusData = data.attendance.status
        switch (statusData) {
          case 0: this.calendarDayData.status = '正常'; break
          case 1: this.calendarDayData.status = '迟到'; break
          case 2: this.calendarDayData.status = '事假'; break
          case 3: this.calendarDayData.status = '病假'; break
          case 4: this.calendarDayData.status = '休假'; break
        }
        this.dialogVisible = true
      })
    },
    // 获取当前定位
    getAddress() {
      const that = this
      that.loading = true
      return new Promise((resolve, reject) => {
        var geolocation = new BMap.Geolocation()
        geolocation.getCurrentPosition(function(r) {
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            var myGeo = new BMap.Geocoder({ extensions_town: true })
            myGeo.getLocation(new BMap.Point(r.point.lng, r.point.lat), function(result) {
              if (result) {
                that.address = result.address
                that.loading = false
                console.log(that.address)
                resolve()
              }
            })
          } else {
            alert('加载定位失败，请重新登录：' + this.getStatus())
          }
        })
      })
    },
    changeEvents() {
      this.calendar.events = {
        '2017-7-20': '$' + (Math.random() * 1000 >> 0),
        '2017-7-21': '$' + (Math.random() * 1000 >> 0),
        '2017-7-22': '$' + (Math.random() * 1000 >> 0)
      }
    },
    // 上班打卡
    handlePunchClockUp() {
      const userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
      const account = userInfo.account
      this.getAddress().then(() => {
        punchClockUp(account, this.address).then(response => {
          const { data } = response
          const time = data.attendance.start
          const status = data.attendance.status

          switch (status) {
            case 0: this.punchClockStatus = '时间：' + time + ' 正常'; break
            case 1: this.punchClockStatus = '时间：' + time + ' 迟到'; break
            case 2: this.punchClockStatus = '事假'; break
            case 3: this.punchClockStatus = '病假'; break
            case 4: this.punchClockStatus = '休假'; break
          }
          Message({
            message: '打卡成功 状态：' + this.punchClockStatus,
            type: 'success',
            duration: 5 * 1000
          })
          this.reload()
        }).catch(msg => {
          console.log(msg)
        })
      })
    },
    // 下班打卡
    handlePunchClockLower() {
      const userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
      const account = userInfo.account
      this.getAddress().then(() => {
        punchClockLower(account, this.address, this.type).then(response => {
          const { data } = response
          // 返回结果中没有打卡对象信息，是为提前打卡
          if (!data) {
            this.$confirm('当前不是打卡时间，确定提前打卡?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.type = 1
              punchClockLower(account, this.address, this.type).then(response => {
                this.$message({
                  message: '打卡成功，祝你生活愉快',
                  type: 'success',
                  duration: 5 * 1000
                })
                this.type = 0
                this.reload()
              })
            })
          } else {
            Message({
              message: '打卡成功，祝你生活愉快',
              type: 'success',
              duration: 5 * 1000
            })
            this.reload()
          }
        })
      })
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
    // position: relative;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.flex{
    box-sizing: border-box;

    display: -webkit-box;
    -webkit-box-pack: start;
    -webkit-box-align: start;

    display: -webkit-flex;
    -webkit-justify-content: space-between;
    -webkit-align-items: top;

    display: flex;
    justify-content: space-around;
    align-items: top;
    flex-flow:row wrap
}
  .is-selected {
    color: #1989FA;
  }
    // .map-content .map {
    //     width: 100%;
    //     height: 400px;
    // }
</style>
