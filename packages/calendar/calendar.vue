<template>
    <div class="crm-calendar">
        <table class="crm-calendar-table">
            <thead>
                <tr>
                    <th>日</th>
                    <th>一</th>
                    <th>二</th>
                    <th>三</th>
                    <th>四</th>
                    <th>五</th>
                    <th>六</th>
                </tr>
                <tr class="show-date-wrapper">
                    <th colspan="7">
                        <a class="btn-arrow btn-arrow-left" @click="getPrev()"></a>
                        <span class="show-date">{{k_currentYear}}年{{k_currentMonth}}日</span>
                        <a class="btn-arrow btn-arrow-right" @click="getNext"></a>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in calendarData">
                    <td v-for="value in item">
                        <div>
                            <a class="active" :data-text="value.events.tag" :class="{'has-schedule':value.hasSchedule}" v-if="value.year==nowYear&&value.month==nowMonth
                            &&value.date==nowDate" @click="changeDate(value,$event)">{{value.date}}</a>
                            <a :class="{'has-schedule':value.hasSchedule}"  :data-text="value.events.tag" v-else-if="value.year==activeYear&&value.month==activeMonth
                            &&value.date==activeDate" @click="changeDate(value,$event)" class="choose">{{value.date}}</a>
                            <a :class="{'has-schedule':value.hasSchedule}" :data-text="value.events.tag" v-else-if="value.month==k_currentMonth" @click="changeDate(value,$event)" >{{value.date}}</a>
                            <a :class="{'has-schedule':value.hasSchedule}" :data-text="value.events.tag"class="disabled" @click="changeDate(value,$event)" v-else>{{value.date}}</a>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script type="text/ecmascript-6">
    import d from './util/format';
    export default {
        name:"syCalendar",
        props:{
            lattRows:{//生成日历的行数
                type:Number,
                default:5
            },
            lattColumns:{//生成日历的行数
                type:Number,
                default:7
            },
            currentYear:{
                type:Number
            },
            currentMonth:{
              type:Number
            },
            currentDate:{
                type:Number
            },
            dateEvents:{
                type:Object,
                default:{}
            },
            scheduleTagText:{
                type:String,
                require:false
            }

        },
        data(){
            return {
                nowYear:"",
                nowMonth:"",
                nowDate:"",
                activeYear:"",//指选中的
                activeMonth:"",
                activeDate:"",
                activeStatus:"",//标记一些状态
                tempCalendarData:{},
                calendarData:{},
                k_currentYear:"",//指的是当前的月
                k_currentMonth:"",
                k_currentDate:"",
                scheduleDatas:[],//暂时作为辅助用的
                changeFlag:false//标记着是否有切换activeDate
            }
        },
        computed:{
            latticeNumber(){//格子数
                return this.lattRows*this.lattColumns;
            }
        },
        watch:{
            dateEvents(nVal){//状态监测
               this.scheduleDatas=nVal;
               this.tempCalendarData.forEach((value,index)=>{
                   const year=value.year;
                   const month=value.month>9?value.month:"0"+value.month;
                   const date=value.date>9?value.date:"0"+value.date;
                   var testDate=`${year}-${month}-${date}`;
                   if(nVal.hasOwnProperty(testDate)){//判断是否有该属性
                       value.hasSchedule=nVal[testDate];
                   }
               });
                //获取当前选中的年月日
                if(this.changeFlag==false){
                    this.activeStatus=this.tempCalendarData.find((value,index)=>{
                        return value.year==this.activeYear&&value.month==this.activeMonth&&value.date==this.activeDate;
                    }).hasSchedule;
                }
                this.emitParent(0)

            }
        },
        mounted(){
            //初始化
            let date=new Date();
            this.nowYear=date.getFullYear();
            this.nowMonth=date.getMonth()+1;
            this.nowDate=date.getDate();
            this.$nextTick(()=>{
               this.k_currentYear=this.activeYear=this.currentYear;
               this.k_currentMonth=this.activeMonth=this.currentMonth;
               this.k_currentDate=this.activeDate=this.currentDate;
               //初始化
               this.tempCalendarData=this.init();
               this.calendarDataLists=this.render(this.tempCalendarData);
               this.emitParent(1);
           });
        },
        methods:{
            init(){
                let next=this.fill(this.k_currentYear,this.k_currentMonth-1);
                return next;
            },
            fill: function (year,month) {
                //获取本月的第一天是星期几
                let firstDay=new Date(year,month,1).getDay();
                //获取本月的最后一天的日期
                let lastDate=new Date(year,month+1,0).getDate();
                //获取本月的最后一天是星期几
                let lastDay=new Date(year,month+1,0).getDay();
                //上个月要显示的天数
                let lastMonthDisplayNum=firstDay;
                //本月要显示的天数
                let thisMonthDisplayNum=lastDate;
                //下个月要显示的天数
                let nextMonthDisplayNum=this.latticeNumber-firstDay-lastDate;
                //上个月最后一天的日期
                let lastMonthLastDate=month==0?new Date(year-1,month,0).getDate():new Date(year,month,0).getDate();
                //添加然后显示
                let html="";
                //数组装格子的数字
                let lattNums=[];
                //添加上个月的
                for(var i=0;i<lastMonthDisplayNum;i++){
                    var num1=lastMonthLastDate-i;
                    lattNums.push({
                        year:month==0?year-1:year,
                        month:month==0?12:month,
                        date:num1,
                        hasSchedule:0,
                        events:{
                            tag:this.scheduleTagText
                        }
                    });

                }
                lattNums.reverse();
                //添加本月的
                for(var j=0;j<thisMonthDisplayNum;j++){
                    var num2=j+1;
                    lattNums.push({
                        year:year,
                        month:month+1,
                        date:num2,
                        hasSchedule:0,
                        events:{
                            tag:this.scheduleTagText
                        }
                    });
                }
                //添加下个月的
                for(var k=0;k<nextMonthDisplayNum;k++){
                    var num3=k+1;
                    lattNums.push({
                        year:month==11?year+1:year,
                        month:month==11?1:month+2,
                        date:num3,
                        hasSchedule:0,
                        events:{
                            tag:this.scheduleTagText
                        }
                    });
                }

                /*lattNums.forEach((value)=>{
                    const year=value.year;
                    const month=value.month>9?value.month:"0"+value.month;
                    const date=value.date>9?value.date:"0"+value.date;
                    var testDate=`${year}-${month}-${date}`;
                    //通过json对象获取
                    /!*value.hasSchedule=this.dateEvents[testDate];*!/
                });*/
                return lattNums;
            },
            render(data){//渲染成对应的行列
                //console.log(data);
                let tempArr=new Array();
                //按照表格行数以及列数进行处理:一维数组变为二维
                for(let q= 0;q<this.lattRows;q++){
                    tempArr[q]=new Array();
                    for(let s= 0;s<this.lattColumns;s++){
                        tempArr[q][s]=data[this.lattColumns*q+s];
                    }
                }
                this.calendarData=tempArr;

            },
            changeDate(item,e){
                var _self=$(e.currentTarget);
                _self.addClass("choose");
                $(".crm-calendar-table").find("a").not(_self).removeClass("choose");
                this.activeYear=item.year;
                this.activeMonth=item.month;
                this.activeDate=item.date;
//                this.activeStatus=item.hasSchedule;
                //选中日期的状态
                this.activeStatus=this.tempCalendarData.find((value,index)=>{
                    return value.year==this.activeYear&&value.month==this.activeMonth&&value.date==this.activeDate;
                }).hasSchedule;
                this.emitParent(0);
            },
            getPrev(){
                //上个月(普通情况和特殊情况的处理)
                if(this.k_currentMonth==1){
                    this.k_currentYear--;
                    this.k_currentMonth=12;
                }else{
                    this.k_currentMonth--;
                }

                this.tempCalendarData=this.fill(this.k_currentYear,this.k_currentMonth-1);
                this.calendarDataLists=this.render(this.tempCalendarData);
                this.changeFlag=true;
                this.emitParent(1);

            },
            getNext(){
                //下个月
                if(this.k_currentMonth==12){
                    this.k_currentYear++;
                    this.k_currentMonth=1;
                }else{
                    this.k_currentMonth++;
                }
                this.tempCalendarData=this.fill(this.k_currentYear,this.k_currentMonth-1);
                this.calendarDataLists=this.render(this.tempCalendarData);
                this.changeFlag=true;
                this.emitParent(1);
            },
            emitParent(type){//回调给父组件的
                this.$emit('send',{
                    type:type,
                    c_datas:this.tempCalendarData,
                    activeYear:this.activeYear,
                    activeMonth:this.activeMonth>9?this.activeMonth:"0"+this.activeMonth,
                    activeDate:this.activeDate>9?this.activeDate:"0"+this.activeDate,
                    activeStatus:this.activeStatus
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .crm-calendar{
        padding-bottom:20px;
        .crm-calendar-table{
            width:100%;
            border-collapse: collapse;
            thead{
                background:#fafafa;
                tr{
                    &.show-date-wrapper{
                        background:#fff;
                        font-weight:normal;
                    }
                    th{
                        position:relative;
                        padding-top:10px;
                        padding-bottom:10px;
                        text-align:center;
                        .btn-arrow{
                            width:18px;
                            height:18px;
                            background:url(/static/okr/image/icon/icon-btn-arrow.png) no-repeat center center;
                            background-size:100%;
                            position:absolute;
                        }
                        .btn-arrow-left{
                            left:16px;
                            transform: rotate(-180deg);
                        }
                        .btn-arrow-right{
                            right:16px;
                        }
                    }
                    &:nth-child(2){
                        th{
                            padding-top:20px;
                            padding-bottom:20px;
                        }

                    }

                }
            }
            tbody{
                background-color:#fff;
                tr{
                    &:nth-child(1){
                        border-top:1px solid #f7f7f7;
                    }
                    border-bottom:1px solid #f7f7f7;
                    td{
                        padding-top:15px;
                        padding-bottom:15px;
                        text-align:center;
                        a{
                            position:relative;
                            display:inline-block;
                            width:26px;
                            height:26px;
                            line-height:26px;
                            text-align:center;
                            &.choose{
                                background-color:#ff8000!important;
                                color:#fff !important;
                                border-radius:50%;
                            }
                            &.active{
                                background-color:#1FA1C9;
                                border-radius:50%;
                                box-shadow: 0 4px 8px rgba(31,161,201,.3);
                                color:#fff !important;
                            }
                            &.disabled{
                                color:#c4c3c3;
                            }
                            &.has-schedule{
                                &:after{
                                    position:absolute;
                                    content: "";
                                    top:-8px;
                                    right: 0;
                                    width:5px;
                                    height:5px;
                                    border-radius:50%;
                                    background-color:#1FA1C9;
                                }
                                &:before{
                                    position:absolute;
                                    left:50%;
                                    bottom:-18px;
                                    width:100%;
                                    content:attr(data-text);
                                    font-size:12px;
                                    transform:translateX(-50%) scale(0.8);
                                    color:#1FA1C9;
                                }

                            }
                        }
                    }
                }
            }
        }
    }
</style>