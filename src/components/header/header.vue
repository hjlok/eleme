<template>
	<div class="header">
		<div class="top">
			<div class="headlogo">
				<img v-bind:src='seller.avatar' style="height:64px;width:64px;">
			</div>
			<div class="content">
				<div class="title">
					<span class="icon"></span>
					<span class="name">{{seller.name}}</span>
				</div>
				<div class="send">
					<span>{{seller.description}}</span>/<span>{{seller.deliveryTime}}</span>分钟送达
				</div>
				<div v-if="seller.supports" class="supports">
					<span class="icon" v-bind:class="supType[seller.supports[0].type]"></span>
					<span class="description">{{seller.supports[0].description}}</span>
				</div>
			</div>
			<div v-if="seller.supports" class="right-num" v-on:click="showDetail">
				<div class="count">{{seller.supports.length}}个</div>
				<i class="icon-keyboard_arrow_right"></i>
			</div>
		</div>
		<div class="bottom"  v-on:click="showDetail">
			<span class="icon"></span>
			<span class="title">{{seller.bulletin}}</span>
			<i class="icon-keyboard_arrow_right"></i>
		</div>
		<div class="background">
			<img v-bind:src="seller.avatar" style="height:100%;width:100%;">
		</div>

		<transition name="fade">
			<div v-show="detailShow" class="detail">
				<div class="detailBox">
					<div class="content">
						<div class="name">{{seller.name}}</div>
						<star :score="seller.score" :size="24" :margin="10"></star>
						<div class="title">
							<div class="line"></div>
							<div class="text">优惠信息</div>
							<div class="line"></div>
						</div>
						<div v-if="seller.supports" class="supports">
							<div class="item" v-for="c in seller.supports" >
								<span v-bind:class="supType[c.type]" class="icon"></span>
								<span class="text">{{c.description}}</span>
							</div>
						</div>
						<div class="title">
							<div class="line"></div>
							<div class="text">商家公告</div>
							<div class="line"></div>
						</div>
						<div class="bulletin">{{seller.bulletin}}</div>
					</div>
				</div>
				<div class="detailClose" v-on:click="closeDetail">
					<i class="icon-close"></i>
				</div>
			</div>
		</transition>

	</div>
</template>
<script type="text/javascript">
import  star from '../star/star.vue'
export default{
	props: {
		seller: {
			type: Object
		}
	},
	data:function(){
		return {
			detailShow: false,
			supType: ['type0','type1','type2','type3','type4']
		}
	},
	created: function(){
		// this.supType=['type0','type1','type2','type3','type4']
	},
	methods:{
		showDetail: function(){
			this.detailShow=true
		},
		closeDetail: function(){
			this.detailShow=false
		}
	},
	components: {
    	'star': star
  	}
}	
</script>
<style type="text/css">
.header{
	background:rgba(7,17,27,0.4);
	color: #fff;
	position: relative;
	overflow: hidden;
}
.header .top{
	padding: 24px 12px 18px 24px;
	font-size:0;
	position: relative;
}
.header .top .headlogo{
	display: inline-block;
	vertical-align:top;
}
.header .top .content{
	display: inline-block;
	padding:0;
	font-size:14px;
	margin-left:16px;
	height:60px;
	padding:2px 0;
}
.header .top .content .title{
	height:18px;
}
.header .top .content .title .icon{
	width:30px;
	height: 18px;
	display: inline-block;
	background-image: url(brand.png);
	background-size: 100% 100%;
	vertical-align: top;
}
.header .top .content .title .name{
	margin-left:6px;
	font-size:16px;
	line-height:18px;
	font-weight: bold;
}
.header .top .content .send{
	padding:8px 0 10px 0;
	font-size: 12px;
	line-height: 12px;
}
.header .top .content .supports{
	font-size: 0;
}
.header .top .content .supports .icon{
	height:12px;
	width:12px;
	background-size: 100% 100%;
	display:inline-block;
	vertical-align:top;
}
.header .type0{
	background-image: url(decrease2.png);
}
.header .type1{
	background-image: url(discount2.png);
}
.header .type2{
	background-image: url(special2.png);
}
.header .type3{
	background-image: url(invoice2.png);
}
.header .type4{
	background-image: url(guarantee2.png);
}
.header .top .content .supports .description{
	font-size: 11px;
	line-height:12px;
	height:12px;
	margin-left: 4px;
	display: inline-block;
}
.header .top .right-num{
	position: absolute;
	bottom:18px;
	right: 12px;
	height:24px;
	padding:0px 8px;
	background:rgba(0,0,0,0.2);
	font-size:12px;
	line-height: 24px;
	border-radius: 7px;
	display: flex;
	justify-content: center;
}
.header .top .right-num i{
	line-height: 24px;
	margin-left:2px;
}

.header .bottom{
	height:28px;
	padding: 0 26px 0 12px;
	background: rgba(7,17,27,0.2);
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	position: relative;
}
.header .bottom .icon{
	width: 33px;
	height: 18px;
	background-image: url(bulletin.png);
	background-size: 100% 100%;
	margin:5px 0;
	display: inline-block;
	vertical-align:middle;
}
.header .bottom .title{
	line-height: 28px;
	font-size: 12px;
	margin:0 5px;
	vertical-align:middle;
}
.header .bottom i{
	line-height: 28px;
	position: absolute;
	right:10px;top: 0;
}

.header .background{
	position: absolute;
	top:0;
	left: 0;
	width:100%;
	height: 100%;
	z-index: -1;
	filter: blur(10px);
}

/*.fade-enter-active, .fade-leave-active {
  transition:all 1.5s
}
.fade-enter, .fade-leave-to {
  opacity: 0;
  height:0;
}*/


.fade-enter-active {
  animation: fade-in .6s;
}
.fade-leave-active {
  animation: fade-in .6s reverse;
}
@keyframes fade-in {
  0% {
    height: 0;
  }
  100% {
    height: 100%;
  }
}


.header .detail{
	position: fixed;
	top: 0;left: 0;
	width:100%;
	height: 100%;
	z-index: 100;
	background: rgba(7,17,27,0.8);
	overflow-y: scroll;
}
.header .detail .detailBox{
	min-height:100%;
}
.header .detail .detailBox .content{
	padding-top:64px;
	padding-bottom: 64px;
}
.header .detail .detailBox .content .name{
	font-size:16px;
	color:#fff;
	font-weight:700;
	line-height:16px;
	text-align: center;
}
.header .detail .detailBox .content .star{
	margin: 16px auto 28px auto;
	text-align: center;
}
.header .detail .detailBox .content .title{
	display: flex;
	width: 80%;
	margin:auto;
}
.header .detail .detailBox .content .title .line{
	border-bottom:1px solid rgba(255,255,255,0.2);
	flex: 1;
	position: relative;
	top:-6px;
}
.header .detail .detailBox .content .title .text{
	font-size:14px;
	color:#fff;
	line-height: 14px;
	padding: 0 12px;
}
.header .detail .detailBox .content .supports{
	margin:24px auto 28px auto;
	width:80%;
	margin-left: 10%;
}
.header .detail .detailBox .content .supports .item{
	margin-left: 12px;
	margin-top: 12px;
}
.header .detail .detailBox .content .supports .item:nth-child(1){
	margin-top: 0;
}
.header .detail .detailBox .content .supports .item .icon{
	height:16px;
	width:16px;
	background-size:100% 100%;
	display:inline-block;
	vertical-align: middle;
}
.header .detail .detailBox .content .supports .item .text{
	font-size: 12px;
	line-height: 12px;
	margin-left: 10px;
}
.header .detail .detailBox .content .bulletin{
	margin:0 10%;
	padding: 24px 12px;
	font-size: 12px;
	line-height: 24px;
}

.header .detail .detailClose{
	position: relative;
	height: 32px;
	width:32px;
	margin: -64px auto 0 auto;
	font-size: 32px;
}
</style>