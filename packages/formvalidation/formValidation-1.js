const validateGroup = {
    template: `<div>
        <slot></slot>
        <a @click="testify">
            <slot name="submit"></slot>
        </a>
    </div>`,
    props:["value","sheight"],
    data(){
        return {
            name:"validate-group",
            maxLabel:0,
            vailFlag:false,
        }
    },
    mounted(){
        _.forEach(this.$children,o=>{
            if(o.name=="validate-field"){
                $(o.$el).on('animationend webkitAnimationEnd oAnimationEnd', e=>{
                    _.removeClass(o.$el,"shake")
                });
            }
        })
        // _.forEach(this.$children,o=>{
        //     if(o.name=="validate-field"){
        //         if(o.labelWidth>this.maxLabel){
        //             this.maxLabel = o.labelWidth;
        //         }
        //     }
        // })
        // this.setChildWidth();
        // $(window).on("resize",e=>{
        //     this.setChildWidth();
        // })
    },
    methods:{
        testify(){
            var losers = [];
            _.forEach(this.$children,o=> {
                if (o.name == "validate-field") {
                    o.verifyRules(o.valiValue,()=>{
                        if(o.valiResult){
                            losers.push(o)
                        }
                    });

                }
            });
            console.log('错误的表单');
            console.log(losers);
            //一次提示第一个
            /*if(losers.length>0){
                losers[0].valiBlock();
                _.addClass(losers[0].$el,"shake")
            }*/
            //全部一次性提示
            if(losers.length>0){
                _.forEach(losers,(o,index)=>{
                    o.valiBlock();
                   _.addClass(o.$el,"shake")
                });
            }else if(losers.length==0){
                this.$emit("input",false);
            }

        },
        setChildWidth(){
            _.forEach(this.$children,o=> {
                if (o.name == "validate-field") {
                    o.setLabelWidth(this.maxLabel)
                }
            })
        },
        vailAllForm(){
            this.vailFlag = false;
            _.forEach(this.$children,o=> {
                if (o.name == "validate-field") {
                    // console.log(o.valiResult)
                    if(o.valiResult){
                        this.vailFlag = true;
                    }
                }
            })

            // console.log(this.vailFlag)
            this.$emit("input",this.vailFlag)
        }
    }
}

const validateField = {
    template: `<div class="ui-validate-field" @click="focusField">
    <div class="clearfix field">
        <div class="label">{{uiLabel}}</div>
        <slot name="text"></slot>
        <slot name="unit"></slot>
    </div>
    <slot name="area"></slot>
    <div class="error-panel"><slot name="error"></slot></div>
</div>`,
    props:["uiLabel","valiValue","valiRegex"],
    data(){
        return {
            name:"validate-field",
            labelWidth:0,
            field:{},
            label:{},
            slot:{},
            errorPanel:{},
            valiError:false,
            valiResult:true,
        }
    },
    computed:{
        inputField(){
            var input = $(this.$el).find("input");
            if(input.length>0){
                return input
            }else {
                input =  $(this.$el).find("textarea")
                if(input.length>0){
                    return input
                }else {
                    return false;
                }
            }
        }
    },
    watch:{
        valiValue(n){
            this.verifyRules(n,()=>{
                this.$parent.vailAllForm();
            });
        }
    },
    mounted(){
        if(this.valiRegex){
            this.valiResult = true;
        }else{
            this.valiResult = false;
        }
        this.field = $(this.$el).find(".field");
        this.label = $(this.$el).find(".label");
        this.slot = $(this.$el).find(".slot");
        this.errorPanel = $(this.$el).find(".error-panel");
        this.labelWidth = this.label.width();

    },
    methods:{
        verifyRules(n,callback){//验证规则
            switch (this.valiRegex){
                case "require":
                    if(_.isEmpty(n)){
                        this.valiBlock()
                    }else{
                        this.valiPass()
                    }
                    break;
                case "tel":
                    if(!/^1[0-9]{10}$/.test(n)){
                        this.valiBlock()
                    }else{
                        this.valiPass()
                    }
                    break;
                case "date":
                    var time = n.split("-")
                    //判断是否数字
                    if (isNaN(time[0])) {
                        this.valiBlock();
                        break;
                    }
                    //判断年份是否在区间里面
                    if(time[0]<=1900||time[0]>=2099){
                        this.valiBlock();
                        break;
                    }
                    //判断是否时间戳
                    time = Date.parse(n);
                    if (isNaN(time)) {
                        this.valiBlock()
                    }else{
                        this.valiPass()
                    }
                    break;
                case "alipay":
                    if(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(n) ||
                        /^1[0-9]{10}$/.test(n)){
                        this.valiPass()
                    }else{
                        this.valiBlock()
                    }
                    break;
            }
            if(typeof callback==="function"){
                callback();
            }

        },
        focusField(){
            if(this.inputField){
                this.inputField.focus()
            }
        },
        setLabelWidth(w){
            this.label.width(w)
            this.slot.width(this.field.width()-w)
        },
        valiPass(){//验证通过
            if(this.valiResult||this.valiError){
                this.errorPanel.animate({
                    "height": 0
                })
            }
            this.valiError = false;
            this.valiResult = false;
        },
        valiBlock(){//验证不通过
            if(!this.valiResult||!this.valiError){
                if(this.$parent.sheight==true){
                    var height =  this.errorPanel.css("height","auto").height();
                }else{
                    var height =  this.errorPanel.css("height","auto").height()*1.5;
                }

                this.errorPanel.height(0)
                this.errorPanel.animate({
                    "height": height+"px"
                })
            }
            this.valiError = true;
            this.valiResult = true;
        },
    }

}





module.exports = {
    validateGroup,
    validateField
}