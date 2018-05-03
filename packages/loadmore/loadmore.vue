<template>
    <div class="ui-drop-box">
        <div class="tc">
            <p></p>
            <i class="icon-loading" :class="{'hide':showIcon}"></i>
            <p v-show="showText">释放刷新</p>
        </div>
        <div class="drop-panel"><slot></slot></div>
        <div class="loading-spinner" v-show="!rollFlag">
            <div class="spinner">
                <div class="bounce1"></div>
                <div class="bounce2"></div>
                <div class="bounce3"></div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        name:'syLoadmore',
        props:["rollFlag"],
        data(){
            return {
                showText:false,
                showIcon:true,
            }
        },
        mounted(){
            var panel = $(this.$el).find(".drop-panel");
            var load = $(this.$el).find(".icon-loading");
            var _window = $(window);
            var _body = $("body");
            var flag = false,touchY=0,currentY=0,moveTime=0;
            panel.bind("touchstart",e=>{
                this.showIcon = false;
                if((document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop)==0){
                    flag = true;
                }
                touchY = e.touches[0].screenY;
            })
            panel.bind("touchmove",e=>{
                if(flag){
                    if(moveTime==0&&e.touches[0].screenY-touchY<0){
                        return
                    }
                    e.preventDefault()
                    currentY = currentY + e.touches[0].screenY-touchY;
                    if(currentY<=0){
                        moveTime--;
                        return
                    }
                    moveTime++;
                    load.css("transform","rotate("+currentY+"deg)");
                    load.css("webkitTransform","rotate("+currentY+"deg)");
                    panel.css("transform","translateY("+currentY+"px)");
                    panel.css("webkitTransform","translateY("+currentY+"px)");
                    touchY = e.touches[0].screenY;
                    if(currentY>=150){
                        this.showText = true;
                    }else {
                        this.showText = false;
                    }
                }


            })
            panel.bind("touchend",e=>{
                if(flag){
                    flag = false;
                    if(this.showText){
                        this.$emit("pull")
                    }
                    currentY = 0;
                    moveTime = 0;
                    this.showText = false;
                    panel.addClass("reset")
                    load.css("transform","rotate("+currentY+"deg)");
                    load.css("webkitTransform","rotate("+currentY+"deg)");
                    panel.css("transform","translateY("+currentY+"px)");
                    panel.css("webkitTransform","translateY("+currentY+"px)");
                    setTimeout(e=>{
                        this.showIcon = true;
                        panel.removeClass("reset")
                    },300)
                }
                //判断是否在最底部，加载更多
                if((_body.get(0).scrollHeight - _window.height() - _window.scrollTop())<=10 && !this.rollFlag) {
                    this.$emit("roll")
                }


            })



        }
    }
</script>

<style lang="scss" scoped>
    .ui-drop-box{
        .icon-loading{
            background-image: url("data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZmlsbD0iI2ZmODAwMCIgZD0iTTkwMC41NTY4IDY1OS44NjU2Yy0xNS44NzItNi4yOTc2LTQ1LjQxNDQgNC4xNDcyLTUxLjQwNDggMTkuMzAyNC01Mi40Mjg4IDEzMS43Mzc2LTE3Ny43NjY0IDIxNi44ODMyLTMxOS4yODMyIDIxNi44ODMyLTE4OS40NCAwLTM0My41NTItMTU0LjQ3MDQtMzQzLjU1Mi0zNDQuMzcxMiAwLTE4OS45MDA4IDE1NC4xMTItMzQ0LjMyIDM0My41NTItMzQ0LjMyIDY0LjM1ODQgMCAxMjcuMDI3MiAxNy45MiAxODEuMzUwNCA1MS44MTQ0IDEuMDI0IDAuNjE0NCAyLjA5OTIgMS4wNzUyIDMuMTc0NCAxLjUzNmwtOTAuMTEyIDMyLjU2MzJjLTE1LjI1NzYgNS41Mjk2LTI1LjQ0NjQgMzEuMzM0NC0xOS45MTY4IDQ2LjU5MiA0LjM1MiAxMi4wMzIgMjIuMzIzMiAyMy45NjE2IDM0LjM1NTIgMjMuOTYxNiAzLjMyOCAwIDExLjE2MTYtMC41NjMyIDE0LjQzODQtMS43NDA4bDE2NS4yMjI0LTczLjAxMTJjNy43MzEyLTIuODE2IDE0LjAyODgtOC41NTA0IDE3LjUxMDQtMTUuOTc0NCAzLjQ4MTYtNy40MjQgMy44OTEyLTE1Ljk3NDQgMS4xMjY0LTIzLjcwNTZMNzc4LjI0IDg1Ljg2MjRjLTUuNzg1Ni0xNi4xMjgtMjAuMTcyOC0zNy44MzY4LTQ0LjA4MzItMzQuMjUyOC0xNi44OTYgMi41Ni0yOC44NzY4IDI1LjgwNDgtMjMuMDkxMiA0MS45MzI4bDMyLjU2MzIgOTAuNTcyOGMtNjUuNTg3Mi0zOS40NzUyLTE0MC42NDY0LTYwLjQ2NzItMjE3LjY1MTItNjAuNDY3MkMyOTIuNDAzMiAxMjMuNjQ4IDEwMi40IDMxNC4xMTIgMTAyLjQgNTQ4LjE5ODQgMTAyLjQgNzgyLjMzNiAyOTIuNDAzMiA5NzIuOCA1MjUuOTc3NiA5NzIuOGMxNzQuNDg5NiAwIDMyOS4wMTEyLTEwNC45NiAzOTMuNjI1Ni0yNjcuMzY2NEM5MjUuOTUyIDY4OS41MTA0IDkxNi40Mjg4IDY2Ni4yMTQ0IDkwMC41NTY4IDY1OS44NjU2TDkwMC41NTY4IDY1OS44NjU2ek05MDAuNTU2OCA2NTkuODY1NiI+PC9wYXRoPjwvc3ZnPg==");
            height: 24px;
            width: 24px;
            background-repeat: no-repeat;
            display: inline-block;
            transition: transform .3s ease;
            &.hide{
                opacity: 0;
            }
        }
        .drop-panel{
            width: 100%;
            position: relative;
            margin-top: -32px;
            &.reset{
                transition: transform .3s ease;
            }
        }
        .loading-spinner{
            height: 30px;
            text-align: center;
        }
    }
</style>