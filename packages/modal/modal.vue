<template>
    <div class="ui-modalbox" >
        <transition name="fade"><div class="overlay" id="overlay" v-show="status" @click.self="status=false" ></div></transition>
        <div class="content" :class="{'active':status}">
            <div class="modal-header clearfix">
                <a class="close" @click="close">
                    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16"><path class="close-fill" d="M572.633359 511.999999 1009.831801 73.205942c15.956148-15.956148 15.956148-43.081598 0-60.633361s-43.081598-15.956148-60.633361 0L511.999999 451.366638 73.205942 14.168196c-15.956148-15.956148-43.081598-15.956148-60.633361 0s-15.956148 43.081598 0 60.633361L451.366638 511.999999 14.168196 950.794056c-15.956148 15.956148-15.956148 43.081598 0 60.633361s43.081598 15.956148 60.633361 0L511.999999 572.633359l438.794057 438.794057c15.956148 15.956148 43.081598 15.956148 60.633361 0s15.956148-43.081598 0-60.633361L572.633359 511.999999z"></path></svg>
                </a>
            </div>
            <div class="modal-body">
                <slot name="body"></slot>
            </div>
            <div class="modal-foot">
                <slot name="foot"></slot>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        name:'syModal',
        props:["status"],
        watch:{
            status(n,o){
                this.preventBodyScroll(n);
            }
        },
        mounted(){
            //初始化
            this.preventBodyScroll(this.status);
        },
        methods:{
            close(){
                this.$emit("close",!this.status)
            },
            preventBodyScroll(n){
                if(n==true){
                    document.body.style.overflow="hidden";
                    document.body.style.width="100%";
                    document.body.style.height="100%";
                    document.body.addEventListener("touchmove",this.bodyEvent);//防止body穿透点击

                }else{
                    document.body.removeAttribute("style");
                    document.body.style.width="auto";
                    document.body.style.height="auto";
                    document.body.removeEventListener("touchmove",this.bodyEvent);//备注要写成句柄
                }
            },
            bodyEvent(e){
                e.preventDefault();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .ui-modalbox{
        .overlay{
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: #000;
            opacity: .3;
            z-index: 10;
        }
        .content{
            z-index: 11;
            transition: transform .3s linear;
            transform:scaleY(0);
            position: fixed;
            top: 10%;
            left: 50%;
            margin-left: -40%;
            border-radius: 2px;
            width: 80%;
            min-height: 3rem;
            background-color: #ffffff;
            &.active{
                transform:scaleY(1);
            }
            .modal-header{
                padding: 1rem 1rem 0 1rem;
                .close{
                    float: right;
                }
                .close-fill{
                    fill: #000;
                }
            }
            .modal-body{
                padding: 0 1rem 1rem 1rem;
            }
        }


        .fade-enter-active, .fade-leave-active {
            transition: opacity .5s
        }
        .fade-enter, .fade-leave-active {
            opacity: 0
        }
    }

    .modal{
        .overlay{
            background-color: #000;
            opacity: .5;
            z-index: 10;
            animation: modalOverlayShow .5s ease-in-out;
            &.disappear{
                animation: modalOverlayHide .5s ease-in-out;
            }
            &.hidden{
                display: none;
            }
        }
        @keyframes modalOverlayShow {
            0%{
                opacity: 0;
            }
            100%{
                opacity: .5;
            }
        }
        @keyframes modalOverlayHide {
            0%{
                opacity: .5;
            }
            100%{
                opacity: 0;
            }
        }
        .content{
            position: fixed;
            z-index: 11;
            background-color: #ffffff;
            top: 0;
            width: 80%;
            left: 50%;
            margin-left: -40%;
            animation: modalContentShow .5s ease-in-out;
            &.disappear{
                animation: modalContentHide .5s ease-in-out;
            }
            &.hidden{
                display: none;
            }
        }
        &.active{
            .content{

            }
        }

        @keyframes modalContentShow {
            0%{
                transform:translateY(-150px);
                opacity: 0;
            }
            100%{
                transform:translateY(0);
                opacity: 1;
            }
        }
        @keyframes modalContentHide {
            0%{
                transform:translateY(0);
                opacity: 1;
            }
            100%{
                transform:translateY(-150px);
                opacity: 0;
            }
        }
    }
</style>