<template>
    <div class="data-loading-panel" v-show="status">
        <div class="panel">
            <div class="bg"></div>
            <div class="content">
                <!-- <a v-show="btnClose!='hide'" class="close" @click="close"></a>-->
                <div class="spinner">
                    <div class="dot1"></div>
                    <div class="dot2"></div>
                </div>
                <slot name="text"></slot>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        name:'syLoading',
        props:["status","btnClose"],
        watch:{
            status(nVal,oVal){
                this.preventBodyScroll(nVal);
            }
        },
        mounted(){
            this.preventBodyScroll(this.status);
        },
        methods:{
            bodyEvent(e){
                e.preventDefault();
            },
            preventBodyScroll(nVal){//防止点击穿透
                if(nVal==true){
                    document.body.style.overflow="hidden";
                    document.body.style.width="100%";
                    document.body.style.height="100%";
                    document.body.addEventListener('touchmove',this.bodyEvent);

                }else{
                    document.body.style.overflow="auto";
                    document.body.style.width="auto";
                    document.body.style.height="auto";
                    document.body.removeEventListener('touchmove',this.bodyEvent);
                }
            },
            close(){
                this.$emit("close")
            }
        }
    }
</script>

<style lang="scss" scoped>
    .data-loading-panel{
        position: fixed;
        z-index: 999;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: rgba(1,1,1,.5);
        .panel{
            position:absolute;
            left:50%;
            top:30%;
            margin-left:-120px;
            margin-top:-80px;
            width:240px;
            height:160px;
            z-index:999;
        }
        .bg{
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: #000;
            opacity: .7;
            border-radius: 5px;
        }
        .content{
            user-select: none;
            position: absolute;
            color: #ffffff;
            padding: 20px;
            width: 100%;
            .close{
                position: absolute;
                right: 10px;top: 10px;
                font-family: iconfont;
                &:after{
                    content: "\e64e";
                    color: #ffffff;
                    font-size: 16px;
                }
            }
        }
        .spinner {
            margin: auto;
            width: 90px;
            height: 90px;
            position: relative;
            text-align: center;
            -webkit-animation: rotate 2.0s infinite linear;
            animation: rotate 2.0s infinite linear;
        }

        .dot1, .dot2 {
            width: 60%;
            height: 60%;
            display: inline-block;
            position: absolute;
            top: 0;
            background-color: #ffffff;
            border-radius: 100%;

            -webkit-animation: bounce 2.0s infinite ease-in-out;
            animation: bounce 2.0s infinite ease-in-out;
        }

        .dot2 {
            top: auto;
            bottom: 0px;
            -webkit-animation-delay: -1.0s;
            animation-delay: -1.0s;
        }

        @-webkit-keyframes rotate { 100% { -webkit-transform: rotate(360deg) }}
        @keyframes rotate { 100% { transform: rotate(360deg); -webkit-transform: rotate(360deg) }}

        @-webkit-keyframes bounce {
            0%, 100% { -webkit-transform: scale(0.0) }
            50% { -webkit-transform: scale(1.0) }
        }

        @keyframes bounce {
            0%, 100% {
                transform: scale(0.0);
                -webkit-transform: scale(0.0);
            } 50% {
                  transform: scale(1.0);
                  -webkit-transform: scale(1.0);
              }
        }
    }
</style>