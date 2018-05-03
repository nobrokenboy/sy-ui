
export default {
    getDiffTimes(t1,t2) {
        var diffTimes=t2-t1;
        var timesObj={};
        var d=0;//天数
        var h=0;//时
        var m=0;//分
        var s=0;//秒
        if(diffTimes>=0){
            d=Math.floor(diffTimes/1000/60/60/24);
            h=Math.floor(diffTimes/1000/60/60%24);
            m=Math.floor(diffTimes/1000/60%60);
            s=Math.floor(diffTimes/1000%60);
        }

        h = h>9 ? h : "0"+h; //如果小时小于10,则在前面加0补充为两位数字
        m = m>9 ? m : "0"+m; //如果分钟小于10,则在前面加0补充为两位数字
        s = s>9 ? s : "0"+s; //如果秒数小于10,则在前面加0补充为两位数字

        timesObj={
            h:h,
            m:m,
            s:s
        };
        return timesObj;

    },
    getDefalutDate(){
        const date=new Date();
        const nowYear=date.getFullYear();
        const nowMonth=date.getMonth()+1>9?date.getMonth()+1:"0"+(date.getMonth()+1);
        const nowDate=date.getDate()>9?date.getDate():"0"+date.getDate();
        return `${nowYear}-${nowMonth}-${nowDate}`;
    },
    getSpiltDate(val,type){
        //val传入格式为2018-01-10,type=1代表忽略“01”中的0,type默认是0
        type=0||type;
        const _date=val;
        let year=_date.split("-")[0];
        let month=_date.split("-")[1];
        let date=_date.split("-")[2];
        if(type==1){
            if(month.indexOf("0")==0){
                month=month.substring(1);
            }
            if(date.indexOf("0")==0){
                date=date.substring(1);
            }
        }
        return {
            year:parseInt(year),
            month:parseInt(month),
            date:parseInt(date)
        }
    }
}
