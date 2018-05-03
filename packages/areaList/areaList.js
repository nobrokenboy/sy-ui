/**

 * Created by Vinse on 2016/12/12.

 */
var selector=function (args) {
    var $hasClass = function(el, className) {
        if (!className) return false;
        if (el.classList) {
            return el.classList.contains(className);
        } else {
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
        }
    };
    var $addClass = function(el, className) {
        if (!className) return;
        if (el.classList) {
            el.classList.add(className);
        } else {
            el.className += ' ' + className;
        }
    };
    var $removeClass = function(el, className) {
        if (!className) return;
        if (el.classList) {
            el.classList.remove(className);
        } else {
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    };
    var $addEvent = function ( el, type, listener ) {
        if (el.addEventListener) {
            el.addEventListener(type, listener, false);
        } else if (el.attachEvent) {
            el.attachEvent("on" + type, listener);
        } else {
            el["on" + type] = listener;
        }
    };
    var $removeEvent = function ( el, type,listener ) {
        if (el.removeEventListener)
            el.removeEventListener(type, listener);
        else if (el.detachEvent)
            el.detachEvent("on" + type, listener);
        else el["on" + type] = null;
    };
    var $isType = function(type, obj) {
        var _class = Object.prototype.toString.call(obj).slice(8, -1);
        return obj !== undefined && obj !== null && _class === type;
    };
    var $deepExtend = function(out) {
        out = out || {};
        for (var i = 1; i < arguments.length; i++) {
            var obj = arguments[i];
            if (!obj)
                continue;
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if ($isType('Object', obj[key]) && obj[key] !== null)
                        $deepExtend(out[key], obj[key]);
                    else
                        out[key] = obj[key];
                }
            }
        }
        return out;
    };
    var self = this;
    self.attr = {
        el: '',
        activeIndex:3,
        showNum:5,
        onInit:function () {},
        onTouch:function () {},
        onMoveEnd:function () {},
    }
    if(typeof args === 'object') {
        $deepExtend(self.attr, args);
    };
    /*console.log('ontouchstart' in window);*/
    var mouseEvents = ( 'ontouchstart' in window) ?
        {
            down: 'touchstart',
            move: 'touchmove',
            up: 'touchend',
        } :
        {
            down: 'mousedown',
            move: 'mousemove',
            up: 'mouseup',
        };
    //activeIndex可不能从1开始所以要减掉1

    self.attr.activeIndex--;
    //获取传入的dom

    var selector = document.querySelector(self.attr.el);
    //生成它下面的ul和li

    var wrap = selector.querySelector('ul');
    var item = wrap.querySelectorAll('li');
    if(!item.length){
        var li = document.createElement('li');
        li.setAttribute('data-value',' ');
        li.innerText = '';
        $addClass(li,'active');
        wrap.appendChild(li);
        item = wrap.querySelectorAll('li');
    }

    //var itemHeight = item[0].offsetHeight;
    //获取不到暂时写死
    var itemHeight = 40;
    // 初始高度和歪轴为零

    var initLoaction = self.attr.activeIndex*itemHeight+itemHeight;
    var _y = 0;
    //设置现在的歪轴

    var curentY = 0;
    wrap.style.transform = "translateY(" + curentY + "px)";
    self.activeItem = false;
    //这个要记下所有li的歪轴

    var items = [];
    //根据显示数来设置高度整个的高度
    selector.style.height = self.attr.showNum*itemHeight +"px";
    //循环获取高度并逐个设置li的高度

    for(var i=0;i<item.length;i++){
        initLoaction = initLoaction- itemHeight;
        var objItem = {
            itemIndex:i,
            itemLocation:initLoaction,
            active:false,
            dom:item[i],
        };
        //三元表达式判断value是不是空的，空的就用text

        objItem.itemName=(item[i].getAttribute('data-value')==null)?item[i].innerText:item[i].getAttribute('data-value');
        if(i==0){
            objItem.active = true;
            curentY = initLoaction;
            self.activeItem = objItem;
            $addClass(item[0],"active");
        }
        //判断是不是有默认active

        if($hasClass(item[i],'active')){
            $removeClass(item[0],"active");
            $addClass(item[i],"active");
            objItem.active = true;
            curentY = initLoaction;
            self.activeItem = objItem;
        }
        item[i].removeAttribute('data-value');
        items.push(objItem);
    };
    //给一个interval让他动的

    var interval = {};
    var max = {
        top:items[0].itemLocation,
        bottom:items[item.length-1].itemLocation,
        _top:items[0].itemLocation+(itemHeight*2),
        _bottom:items[item.length-1].itemLocation-(itemHeight*2)
    };
    //初始化完毕，搞点小动画吧

    wrap.style.transform = "translateY(" + curentY + "px)";
    wrap.style.webkitTransform = "translateY(" + curentY + "px)";
    // console.log(self.activeItem.itemLocation)

    self.attr.onInit.apply(self);
    //增加开始触摸事件，设置歪轴为当前点击页面的歪轴,还有不可以用匿名函数

    var drag = false;
    var start = function(e) {

        drag = true;
        e = e.changedTouches ? e.changedTouches[0] : e;
        _y = e.pageY;
        clearInterval(interval);
        self.attr.onTouch.apply(self);
    }
    $addEvent(selector, "mousedown", start);
    $addEvent(selector, "touchstart", start);
    //触摸移动的时候要注意取消默认事件

    //当前触摸的歪轴减去刚刚触摸那一下的歪轴就勀得到现在wrap的歪轴

    var move = function (e) {
/*        console.log("哗啦哗啦");*/
        e.preventDefault();
        if(drag){
            e = e.changedTouches ? e.changedTouches[0] : e;
            curentY = curentY + (e.pageY - _y);
            if(curentY<=max._bottom){
                curentY = max._bottom;
            }
            if(curentY>=max._top){
                curentY = max._top;
            }
            wrap.style.webkitTransform = "translateY(" + (curentY).toString() + "px)";
            wrap.style.transform = "translateY(" + (curentY).toString() + "px)";
            wrap.style.mozTransform = "translateY(" + (curentY).toString() + "px)";
            _y = e.pageY;
        }
    }
    $addEvent(selector, "touchmove", move );
    $addEvent(selector, "mousemove", move );
    var end = function () {
        var currentItem = items.sort(function(a, b) {
            return Math.abs(a.itemLocation - curentY) - Math.abs(b.itemLocation - curentY);
        })[0];
        if(currentItem!=self.activeItem){
            for(var i=0;i<item.length;i++){
                $removeClass(item[i],'active');
            }
            $addClass(currentItem.dom,'active');
        }
        self.activeItem = currentItem;

        var _loca = parseInt(curentY);
        //防止双击时获取相同的位置

        if(_loca != currentItem.itemLocation){
            if(self.activeItem.itemLocation-curentY>0){
                interval = setInterval(function () {
                    //往下恢复

                    _loca++;
                    if(_loca>=max.top){
                        clearInterval(interval);
                    }
                    wrap.style.transform = "translateY(" + _loca + "px)";
                    wrap.style.webkitTransform = "translateY(" + _loca + "px)";
                    if(_loca==self.activeItem.itemLocation){
                        clearInterval(interval);
                        curentY = _loca;
                    }
                },1);
            }else{

                interval = setInterval(function () {
                    //往上恢复

                    _loca--;
                    if(_loca<=max.bottom){
                        clearInterval(interval);
                        curentY = _loca;
                    }
                    if(_loca==self.activeItem.itemLocation){
                        clearInterval(interval);
                        curentY = _loca;
                    };
                    wrap.style.transform = "translateY(" + _loca + "px)";
                    wrap.style.webkitTransform = "translateY(" + _loca + "px)";
                },1);
            }
        }
        drag = false;
        self.attr.onMoveEnd.apply(self);
    }
    $addEvent(selector, "touchend", end );
    $addEvent(selector, "mouseup", end );
    self.destroy=function () {
        for(var i=0;i<item.length;i++){
            $removeClass(item[i],'active');
        }
        if(li){
            wrap.removeChild(li);
        }
        $removeEvent(selector,mouseEvents.down,start);
        $removeEvent(selector,mouseEvents.move,move);
        $removeEvent(selector,mouseEvents.up,end);
        // wrap.style.transform = "translateY(0px)";

        $hasClass = null;
        $addClass = null;
        $removeClass =null;
        $addEvent = null;
        $isType = null;
        $deepExtend = null;
        $removeEvent = null;
        selector = null;
        wrap =null;
        item =null;
        initLoaction= null;
        curentY= null;
        items = null;
        clearInterval(interval);
        interval = null;
        max= null;
        self = null;
        itemHeight = null;
    }

}

let provinces = {};
let citys = {};
let areas = {};
module.exports = {
    template: `<transition name="slide">
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
</transition>`,
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
            //
        }
    },

};
