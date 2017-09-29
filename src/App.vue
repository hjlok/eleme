<template>
  <div class="main">
    <v-header v-bind:seller="seller"></v-header>
    <div class="tab">
      <div class="tab-item">
        <router-link to="/goods" class="alink">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings" class="alink">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/sellers" class="alink">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view v-bind:seller="seller"></router-view>
    </keep-alive>
    <!-- keep-alive组件切换页面保留状态 -->
  </div>
</template>

<script>
import './common/css/index.css'
import header from './components/header/header.vue'
import {urlParse} from './common/js/util.js'
export default {
  name: 'app',
  data: function(){
    return {
      seller: {
        id: (() => {
          let queryParam = urlParse();
          console.log("商家信息",queryParam);
          return queryParam.id;
        })()
      }
    };
  },
  created: function(){
      this.$http.get('/api/seller').then(
            function (response) {
              // 处理成功的结果
              var res=response.body;
              if(res.state===0){
                  // this.seller=res.data;
                  this.seller=Object.assign({},this.seller,res.data);
                  //用Object.assgin扩展一个id属性
                  console.log("这是app.vue页面请求的：",this.seller);
              };
            },function(response){
                //处理失败的结果
            }
        );
  },
  components: {
    'v-header': header
  }
}
</script>

<style>
.main {}
.main .tab{
  display: flex;
  width:100%;
  height:40px;
  line-height:40px;
  border-bottom: 1px solid rgba(7,17,27,0.1);
}
.main .tab .tab-item{
  flex: 1;
  text-align: center;
}
.main .tab .tab-item a{
  display: block;
  font-size: 14px;
  color: rgb(77,85,53);
}
.main .tab .tab-item a.active{
  color: red;
}
</style>
