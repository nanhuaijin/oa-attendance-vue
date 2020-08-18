<template>
  <div class="dashboard-container">
    <div class="flex">
        <div>
            <!-- <el-row style="display: flex;justify-content: space-between;"> -->
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
                
            <!-- </el-row> -->
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
            
            <!-- <button @click="changeEvents">异步更新</button>
            <button @click="calendar.value=[2018,1,Math.floor(Math.random()*30+1)]">动态设置日期</button>
            <button @click="$refs.calendar.setToday()">返回今天</button> -->
            
        </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Calendar from '@/components/Calendar'

export default {
  name: 'Dashboard',
  components: {
        Calendar
    },
  data() {
    return {
      value: new Date(),
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
        closeByDialog(){
            this.calendar4.show=false;
        },
        changeEvents(){
            this.calendar.events={
                '2017-7-20':'$'+(Math.random()*1000>>0),
                '2017-7-21':'$'+(Math.random()*1000>>0),
                '2017-7-22':'$'+(Math.random()*1000>>0),
            }
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
    justify-content: flex-end;
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