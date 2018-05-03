<template>
    <transition>
        <div class="toast" :class="{'visible':isVisible}">
            <span>{{message}}</span>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
    export default {
        name:"sy-toast",
        props:{
            message:{
                type:String,
                default:"有错误"
            }
        },
        data(){
            return {
                isVisible:true
            }
        },
        mounted(){

        },
        methods:{

        }
    }
</script>

<style lang="less" scoped>
    .toast{
        position:fixed;
        left:50%;
        top:50%;
        transform:translate(-50%,-50%);
        z-index:9;
        min-width:8rem;
        min-height:3rem;
        padding:1rem;
        background:rgba(1,1,1,.6);
        border-radius:.2rem;
        opacity:1;
        transition:all ease-in .3s;
        font-size:.875rem;
        color:#fff;

    }
    .hidden{
        visibility: hidden;
        opacity:0;
    }
</style>