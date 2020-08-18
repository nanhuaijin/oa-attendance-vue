<template>
  <div class="dashboard-container">
    <div class="flex">

        <div style="text-align: center;">
            <clock size="300px" color="#FFFFFF" bg="#4AB7BD"></clock><br>
            <p >
                <el-button type="primary" style="margin-top: inherit;" @click="punchClock">点击打卡</el-button>
            </p>
        </div>

        <div>
            <div >
                <el-tooltip class="item" effect="dark" content="刷新" placement="top">
                    <el-button icon="el-icon-refresh-right" circle @click="changeEvents" style="display: inline-block"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="正常" placement="top">
                    <el-button type="success" style="display: inline-block"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="迟到" placement="top">
                    <el-button type="danger" style="display: inline-block"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="事假" placement="top">
                    <el-button type="warning" style="display: inline-block"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="病假" placement="top">
                    <el-button type="info" style="display: inline-block"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="休假" placement="top">
                    <el-button type="primary" style="display: inline-block"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="返回今天" placement="top">
                    <el-button icon="el-icon-aim" circle @click="$refs.calendar.setToday()" style="display: inline-block"></el-button>
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
                @selectYear="calendar.selectYear">
            </calendar>
        </div>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Calendar from '@/components/Calendar'
import Clock from 'vue-clock2';

export default {
  name: 'Dashboard',
  components: {
        Calendar,
        Clock
    },
  data() {
    return {
      value: new Date(),
      time: '10:40:00',
      calendar:{
                value: [], //默认日期
                lunar:true, //显示农历
                weeks:['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                months:['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                events:{
                    '2017-7-7':'$408',
                    '2017-7-20':'$408',
                    '2017-7-21':'$460',
                    '2017-7-22':'$500',
                },
                select(value){
                    console.log(value.toString());
                },
                selectMonth(month,year){
                    console.log(year,month)
                },
                selectYear(year){
                    console.log(year)
                },
                timestamp:Date.now()
            }
    }
  },
  methods:{
        changeEvents(){
            this.calendar.events={
                '2017-7-20':'$'+(Math.random()*1000>>0),
                '2017-7-21':'$'+(Math.random()*1000>>0),
                '2017-7-22':'$'+(Math.random()*1000>>0),
            }
        },
        punchClock() {
            
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
// .calendar-assembly {
//   height: 400px;
//   width: 500px;
//   position: absolute;
//   right: 0;
  
// }

</style>
// <style lang="scss">
//   .calendar-assembly .el-calendar .el-calendar-table .el-calendar-day {
//     height: 50px !important;
//   }
// </style>