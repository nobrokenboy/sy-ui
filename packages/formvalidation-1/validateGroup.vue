<style src="./formValidation.less" lang="less"></style>


<template lang="pug">
    div
        slot
</template>

<script>
    import rules from "./rules.js";

    export default {
        name: "validateGroup",
        props:{
            value:{},
            labelWidth:{
                type:[String,Number],
                require:true
            },
            extRules:{
                type:Object
            }
        },
        data(){
            return {
                name:"validateGroup",
            }
        },
        computed:{
            rules(){
                return _.deepExtend(this.extRules,rules)
            }
        },
        methods:{
            TestfiyField(){
                var flag = false;
                _.forEach(this.$children,(c,i)=>{
                    if(c.name=="validateField"){
                        if(c.status!=2){
                            flag = true;
                        }
                    }
                })
                this.$emit("input",flag)
                return flag;
            },
            ValiWholeField(){
                var blocks = [];
                _.forEach(this.$children,(c,i)=>{
                    if(c.name=="validateField"){
                        if(c.Validate()){
                            blocks.push(c)
                        }
                    }
                })
                if(blocks.length>0){
                    var pos = window.pageYOffset;
                    var interval = setInterval(()=>{
                        pos = pos-6;
                        if(pos<=blocks[0].$el.offsetTop){
                            clearInterval(interval)
                            if(!_.hasClass(blocks[0].$el,"shake")){
                                _.addClass(blocks[0].$el,"shake")
                                setTimeout(()=>{
                                    _.removeClass(blocks[0].$el,"shake")
                                },1100)
                            }

                        }
                        window.scrollTo(0,pos)
                    },1)
                    return true;
                }
                return false;
            }
        }
    }
</script>