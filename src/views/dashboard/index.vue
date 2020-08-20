<template>
  <div
    v-loading="loading"
    class="dashboard-container"
    element-loading-text="拼命加载定位中，请等待..."
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
            <el-button icon="el-icon-refresh-right" circle style="display: inline-block" @click="changeEvents" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="正常" placement="top">
            <el-button type="success" style="display: inline-block" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="迟到" placement="top">
            <el-button type="danger" style="display: inline-block" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="事假" placement="top">
            <el-button type="warning" style="display: inline-block" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="病假" placement="top">
            <el-button type="info" style="display: inline-block" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="休假" placement="top">
            <el-button type="primary" style="display: inline-block" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="返回今天" placement="top">
            <el-button icon="el-icon-aim" circle style="display: inline-block" @click="$refs.calendar.setToday()" />
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
    </div>
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
import { punchClockUp, punchClockLower } from '@/api/user'
import { Message } from 'element-ui'

export default {
  name: 'Dashboard',
  components: {
    Calendar,
    Clock
  },
  data() {
    return {
      value: new Date(),
      address: '',
      type: 0,
      loading: true,
      punchClockStatus: '',
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
  mounted() {
    const that = this
    that.$nextTick(() => {
      var geolocation = new BMap.Geolocation()
      geolocation.getCurrentPosition(function(r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
          var myGeo = new BMap.Geocoder({ extensions_town: true })
          myGeo.getLocation(new BMap.Point(r.point.lng, r.point.lat), function(result) {
            if (result) {
              that.address = result.address
              that.loading = false
              console.log(that.address)
            }
          })
        } else {
          alert('加载定位失败，请重新登录：' + this.getStatus())
        }
      })
    })
  },
  methods: {
    // location(event) {
    //   console.log(event)
    //   const lat = event.point.lat
    //   const lng = event.point.lng
    //   var myGeo = new BMap.Geocoder({ extensions_town: true })
    //   myGeo.getLocation(new BMap.Point(lng, lat), function(result) {
    //     if (result) {
    //       this.address = result.address
    //     }
    //   })
    // },
    changeEvents() {
      this.calendar.events = {
        '2017-7-20': '$' + (Math.random() * 1000 >> 0),
        '2017-7-21': '$' + (Math.random() * 1000 >> 0),
        '2017-7-22': '$' + (Math.random() * 1000 >> 0)
      }
    },
    handlePunchClockUp() {
      const userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
      const account = userInfo.account
      punchClockUp(account, this.address).then(response => {
        const { data } = response
        const time = data.attendance.upTime
        const status = data.attendance.status

        switch (status) {
          case 0: this.punchClockStatus = '正常 ' + time; break
          case 1: this.punchClockStatus = '迟到 ' + time; break
          case 2: this.punchClockStatus = '事假'; break
          case 3: this.punchClockStatus = '病假'; break
          case 4: this.punchClockStatus = '休假'; break
        }
        Message({
          message: '打卡成功 状态：' + this.punchClockStatus,
          type: 'success',
          duration: 5 * 1000
        })
      }).catch(msg => {
        console.log(msg)
      })
    },
    handlePunchClockLower() {
      const userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
      const account = userInfo.account
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
            })
          })
        } else {
          Message({
            message: '打卡成功，祝你生活愉快',
            type: 'success',
            duration: 5 * 1000
          })
        }
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
    // .map-content .map {
    //     width: 100%;
    //     height: 400px;
    // }
</style>
