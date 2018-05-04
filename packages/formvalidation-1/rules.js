//true 为验证失败

export default {
    require(val){
        if(val==null||val==undefined){
            return true
        }
        val = val.toString();
        val = val.replace(/\ +/g, "");
        val = val.replace(/[ ]/g, "");
        val = val.replace(/[\r\n]/g, "");
        if(val==""){
            return true
        }else{
            return false
        }
    },
    telphone(val){
        if(!/^1[0-9]{10}$/.test(val)){
            return true
        }else{
            return false
        }
    }
}