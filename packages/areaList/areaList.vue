<template>
    <transition name="slide">
        <div class="area-select_drop_lists" v-show="status" @click.self="undoEvent">
            <div class="area-select-lists animation" >
                <!--header-->
                <div class="select-list area-header">
                    <div v-on:click="undoEvent()">取消</div>
                    <div class="title">选择地区</div>
                    <div v-on:click="comfirmEvent()">确定</div>
                </div>
                <!--content-->
                <div class="select-list area-content clearfix">
                    <!--省-->
                    <div class="swiper-container-1" id="provinces">
                        <ul class="area-lists">
                            <li v-for="r in regions" :class="{'active':r.region_name==activeProvince}"  :data-value="r.region_name">{{r.region_name}}</li>
                        </ul>
                        <div class="active-area"></div>
                    </div>
                    <!--市-->
                    <div class="swiper-container-2" id="citys">
                        <ul class="area-lists">
                            <li v-for="c in citys" :class="{'active':c.region_name==activeCity}" :data-value="c.region_name">{{c.region_name}}</li>
                        </ul>
                        <div class="active-area"></div>
                    </div>
                    <!--区-->
                    <div class="swiper-container-3" id="areas">
                        <ul class="area-lists">
                            <li v-for="a in areas" :class="{'active':a.region_name==activeRegion}" :data-value="a.region_name">{{a.region_name}}</li>
                        </ul>
                        <div class="active-area"></div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
    import './selector';
    export default {
        name:"syAreaList",
        props:["status","regions","selectProvince","selectCity","selectRegion"],
        data(){
            return {
                citys:[],
                areas:[],
                activeProvince:"",
                activeCity:"",
                activeRegion:""
            }
        },
        watch:{
            status(nVal,oVal){
                this.preventBodyScroll(nVal);
                console.log(nVal);
                // if(nVal){
                //     this.newSelect();
                //     // console.log("省:"+this.selectProvince);
                //     // console.log("市:"+this.selectCity);
                //     // console.log("区"+this.selectRegion);
                // }else{
                //     provinces.destroy();
                //
                // }
            }
        },
        created(){
            //默认选择“请选择省市区”
            /*this.regions.unshift({
                region_name:"请选择省",
                citys:[
                    {
                        region_name:"请选择市",
                        areas:[
                            {
                                region_name:"请选择区",
                            }
                        ]
                    },
                ]
            });*/
            const self=this;
            self.activeProvince=self.selectProvince;
            self.activeCity=self.selectCity;
            self.activeRegion=self.selectRegion;
            //初始化将后台获取的城市赋值给下拉列表
            if(self.activeProvince==""){
                // self.selectCity=self.activeArea;
                for(var i=0;i<self.regions.length;i++){
                    for(var j=0;j<self.regions[i].citys.length;j++){
                        if(self.regions[i].citys[j].region_name == self.activeCity){
                            self.activeProvince = self.regions[i].region_name;
                            return;
                        }
                    }
                }
            }
        },
        mounted(){
            this.preventBodyScroll(this.status);
            const self=this;
            this.newSelect();
        },
        methods:{
            newSelect(){
                const  self=this;
                provinces = new selector({
                    el: '#provinces',
                    onInit: function () {
                        self.activeProvince = this.activeItem.itemName;
                        for (var i = 0; i < self.regions.length; i++) {
                            if (self.regions[i].region_name == this.activeItem.itemName) {
                                self.citys = self.regions[i].citys;
                                self.$nextTick(function () {
                                    citys = new selector({
                                        el: "#citys",
                                        onInit: function () {
                                            self.activeCity = this.activeItem.itemName;
                                            for (var i = 0; i < self.citys.length; i++) {
                                                if (self.citys[i].region_name == this.activeItem.itemName) {
                                                    self.areas = self.citys[i].areas;
                                                    self.$nextTick(function () {
                                                        areas = new selector({
                                                            el: "#areas",
                                                            onInit: function () {
                                                                self.activeRegion = this.activeItem.itemName;
                                                            },
                                                            onMoveEnd: function () {
                                                                self.activeRegion = this.activeItem.itemName;
                                                            }
                                                        })
                                                    })
                                                }
                                            }
                                        },
                                        onMoveEnd: function () {
                                            self.activeCity = this.activeItem.itemName;
                                            for (var i = 0; i < self.citys.length; i++) {
                                                if (self.citys[i].region_name == this.activeItem.itemName) {
                                                    self.areas = self.citys[i].areas;
                                                    self.$nextTick(function () {
                                                        areas.destroy();
                                                        areas = new selector({
                                                            el: "#areas",
                                                            onInit: function () {
                                                                self.activeRegion = this.activeItem.itemName;
                                                            },
                                                            onMoveEnd: function () {
                                                                self.activeRegion = this.activeItem.itemName;
                                                            }
                                                        })
                                                    })
                                                }
                                            }
                                        }

                                    })
                                })
                            }
                        }
                    },
                    onMoveEnd: function () {
                        self.activeProvince = this.activeItem.itemName;
                        for (var i = 0; i < self.regions.length; i++) {
                            if (self.regions[i].region_name == this.activeItem.itemName) {
                                self.citys = self.regions[i].citys;
                                self.$nextTick(function () {
                                    citys.destroy();
                                    citys = new selector({
                                        el: "#citys",
                                        onInit: function () {
                                            self.activeCity = this.activeItem.itemName;
                                            for (var i = 0; i < self.citys.length; i++) {
                                                if (self.citys[i].region_name == this.activeItem.itemName) {
                                                    self.areas = self.citys[i].areas;
                                                    self.$nextTick(function () {
                                                        areas.destroy();
                                                        areas = new selector({
                                                            el: "#areas",
                                                            onInit: function () {
                                                                self.activeRegion = this.activeItem.itemName;
                                                            },
                                                            onMoveEnd: function () {
                                                                self.activeRegion = this.activeItem.itemName;
                                                            }
                                                        })
                                                    })
                                                }
                                            }
                                        },
                                        onMoveEnd: function () {
                                            self.activeCity = this.activeItem.itemName;
                                            for (var i = 0; i < self.citys.length; i++) {
                                                if (self.citys[i].region_name == this.activeItem.itemName) {
                                                    self.areas = self.citys[i].areas;
                                                    self.$nextTick(function () {
                                                        areas.destroy();
                                                        areas = new selector({
                                                            el: "#areas",
                                                            onInit: function () {
                                                                self.activeRegion = this.activeItem.itemName;
                                                            },
                                                            onMoveEnd: function () {
                                                                self.activeRegion = this.activeItem.itemName;
                                                            }
                                                        })
                                                    })
                                                }
                                            }
                                        }
                                    })
                                })
                            }
                        }
                    }
                });
            },
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
            undoEvent(){//取消
                this.$emit('close');
            },
            comfirmEvent(){//确定
                this.$emit('send',{
                    activeProvince:this.activeProvince,
                    activeCity:this.activeCity,
                    activeRegion:this.activeRegion,
                });

            }
        }
    }
</script>

<style lang="scss" scoped>
    .area-select_drop_lists{
        position: fixed;
        z-index: 999;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: rgba(1,1,1,.5);
        .area-select-lists{
            /*    visibility:hidden;*/
            position:absolute;
            bottom:0;
            left:0;
            width:100%;
            height:200px;
            overflow:hidden;
            background-color:#fff;
            border:1px solid #ccc;
            border-radius:3px;
            color:#C3C3C3;
            font-size:16px;
        }
        .area-select-lists .select-list{
            height:100%;
        }
        .area-select-lists .select-list>div{
            position:relative;
            float:left;
            width:32%;
            height:100%;
            line-height:40px;
            text-align:center;
        }
        .active-area{
            position:absolute;
            left:2px;
            top:40%;
            bottom:35%;
            z-index:10;
            width:99%;
            height:40px;
            line-height:40px;
            border-top:1px solid #ccc;
            border-bottom:1px solid #ccc;

        }
        .area-select-lists .select-list>div~div{
            margin-left:2%;
        }
        .area-select-lists .title{
            color:#000;
        }
        .area-select-lists .area-header{
            position:absolute;
            top:0;
            left:0;
            z-index:2;
            width:100%;
            height:40px;
            line-height:40px;
            background-color:#fff;
            border-bottom:1px solid #C4C3C3;
        }
        .area-select-lists .area-header>div{
            height:40px;
        }
        .area-select-lists .select-area{
            position:absolute;
            left:0;
            bottom:40px;
            z-index:2;
            width:100%;
            height:40px;
            line-height:40px;

        }
        .area-select-lists .select-area>div{
            border-top:1px solid #ccc;
            border-bottom:1px solid #ccc;
        }
        .area-select-lists .area-lists{
            position:relative;
            width:100%;
        }
        .area-select-lists .area-lists>li{
            list-style:none;
            height:40px;
            font-size:12px;
            -webkit-transition:all .2s ease-in;
            transition:all .2s ease-in;
        }
        .area-select-lists .area-lists>li.active{
            color:#000000;
            font-size:16px;
        }
    }

    .slide-enter-active {
        animation: slide-up .5s;
    }
    .slide-leave-active {
        animation: slide-up .5s reverse;
    }

    @keyframes slide-up {
        0%{
            transform:translateY(0);
        }
        0%{
            transform:translateY(100%);
        }
    }

    //*{ touch-action: none; }
</style>