<template lang="pug">
    .u-validate-field(:class="{'error':isError}")
        .vali-left(:style="styles.valiLeft")
            span {{label}}
        .vali-right(:style="styles.valiRight")
            div
                slot
        .vali-error(:style="styles.errorPanel")
            slot(name="error")

        
</template>

<script>
    export default {
        name: "validateField",
        props:{
            label:{
                type:String,
                default:"",
            },
            prop:{
                type:null
            },
            regex:{
                type:null
            },
            align:{
                type:String,
                default:"center"
            }
        },
        data(){
            return {
                valiParent:{},
                name:"validateField",
                styles:{
                    valiLeft:{
                        width:"100px",
                        height:"inherit"
                    },
                    valiRight:{
                        width:"100px"             
                    },
                    errorPanel:{
                        paddingLeft:"100px"
                    }
                },
                errorPanel:void 0,
                isError:false,
                //0:untouch,1:invalid,2:success
                status:0,
            }
        },
        watch:{
            prop(n){
                this.Validate(n)
                this.valiParent.TestfiyField()
            }
        },
        created(){
            var parent = this.$parent;
            while(parent.name!="validateGroup"){
                parent = parent.$parent;
                if(!parent){
                    break;
                }
            }
            this.valiParent = parent;
        },
        mounted(){
            //get errorPanel
            this.errorPanel = this.$el.querySelector(".vali-error");

            this.WidthSetter();
            _.addEvent(window,"resize",this.WidthSetter);
            if(this.valiParent.labelWidth!=0){
                if(this.align != "top"){
                    this.styles.valiLeft.height = this.$el.offsetHeight + "px";
                }
            }
        },
        methods:{
            WidthSetter(){
                let label_w = parseInt(this.valiParent.labelWidth);
                let field_w = this.$el.offsetWidth;

                label_w = label_w/field_w*100

                field_w = 100 - label_w

                this.styles.valiRight.width = field_w + "%";
                this.styles.valiLeft.width = label_w + "%";
                this.styles.errorPanel.paddingLeft = label_w + "%";
            },
            Validate(val=this.prop){
                if(!this.regex){
                    return false
                }
                this.$root["$validate"] = this.valiParent.rules[this.regex]
                //验证不通过
                if(this.$root.$validate(val)){
                    //如果已经是不通过状态就跳过
                    this.status = 1;
                    if(!this.isError){
                        this.errorPanel.style.height = "auto";
                        var sourceH = this.errorPanel.offsetHeight;
                        this.errorPanel.style.height = 0;
                        this.isError = true;
                        setTimeout(()=>{
                            this.errorPanel.style.height = sourceH + "px";
                        },1)
                    }
                    return true;
                }else{
                    this.status = 2
                    if(this.isError){
                        this.errorPanel.style.height = 0;
                        setTimeout(()=>{
                            this.isError = false;
                        },300)
                    }
                    return false;
                }
            },
            //单个组件校验，不改变任何状态返回false通过，true不通过
            Testfiy(val=this.prop){
                this.$root["$validate"] = this.valiParent.rules[this.regex];
                return this.$root.$validate(val)
            },
        }
    }
</script>