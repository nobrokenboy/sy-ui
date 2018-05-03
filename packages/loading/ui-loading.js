module.exports = {
    template: `<div class="data-loading-panel" v-show="status">
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
      </div>`,
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
