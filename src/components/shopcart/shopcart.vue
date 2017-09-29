<template>
	<div class="shopcart">
		<div class="content" @click="toggleList">
			<div class="left">
				<div class="logo">
					<div class="icon" v-bind:class="{'iconActive':totalCount>0}">
						<i class="icon-shopping_cart"></i>
					</div>
					<div class="num" v-show="totalCount>0">{{totalCount}}</div>
				</div>
				<div class="price" v-bind:class="{'priceActive':totalPrice>0}">￥{{totalPrice}}</div>
				<div class="else">另需配送费{{deliveryPrice}}元</div>
			</div>
			<div class="right" v-bind:class="{'rightActive':payGo}" @click.stop.prevent="pay">{{payDsc}}</div>
		</div>

		<div class="ball-container">
			<div v-for="ball in balls">
				<transition name="drop" @before-enter="beforeEnter" @enter="entering" @after-enter="afterEnter">
					<div v-show="ball.show" class="ball">
						<div class="inner inner-hook"></div>
					</div>
				</transition>
			</div>
		</div>

		<transition name="fold">
			<div class="shopcart-list" v-show="listShow">
				<div class="list-header">
					<h1 class="title">购物车</h1>
					<span class="empty" @click="empty">清空</span>
				</div>
				<div class="list-content" ref="listContent">
					<ul>
						<li class="food" v-for="food in selectFoods">
							<span class="name">{{food.name}}</span>
							<div class="price">
								<span>￥{{food.price*food.count}}</span>
							</div>
							<div class="cartcontrol-wrapper">
								<cartcontrol v-bind:food="food"></cartcontrol>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</transition>
		<transition name="bg">
			<div class="list-mask" v-show="listShow" @click="hideList"></div>
		</transition>
	</div>	
</template>
<script type="text/javascript">
import Bscroll from 'better-scroll'
import cartcontrol from '../cartcontrol/cartcontrol.vue'
export default{
	props:{
		selectFoods:{
			type: Array,
			default() {
				return [];
			}
		},
		deliveryPrice:{
			type : Number,
			default : 0
		},
		minPrice:{
			type : Number,
			default : 0
		}
	},
	data:function(){
		return {
			payGo:false,
			balls:[
				{
					show : false
				},
				{
					show : false
				},
				{
					show : false
				},
				{
					show : false
				},
				{
					show : false
				}
			],
			dropBalls: [],//已经下落的小球
			fold : true
		}
	},
	computed:{
		totalPrice:function(){
			let tprice=0;
			this.selectFoods.forEach(function(food){
				tprice+=food.count*food.price;
			})
			return tprice;
		},
		totalCount:function(){
			let tcount=0;
			this.selectFoods.forEach(function(food){
				tcount=tcount+food.count;
			});
			return tcount;
		},
		payDsc:function(){//结算差价
			if (this.totalPrice===0) {
				this.payGo=false;
				return "￥"+this.minPrice+"起送";
			}else if (this.totalPrice>0&&this.totalPrice<this.minPrice) {
				this.payGo=false;
				let xxx=this.minPrice-this.totalPrice;
				return "还差"+xxx+"元起送";
			}else{
				this.payGo=true;
				return "去结算";
			}
		},
		listShow:function(){
			if (!this.totalCount) {
				this.fold = true;
				return false;//如果总点击数为0，不显示
			}else{
				let show= !this.fold;
				if(show){
					this.$nextTick(function(){
						if (!this.scroll) {//是否新建过
							this.scroll=new Bscroll(this.$refs.listContent,{click:true});
						}else{
							this.scroll.refresh();
						}
					})
				}
				return show;//如果不为0，通过fold参数设置显示，默认为不展示，再通过toggleList方法改变fold值，来控制展示
			}
		}
	},
	methods:{
		drop:function(el){
			for (let i = 0; i < this.balls.length; i++) {
		        let ball = this.balls[i];
		        if (!ball.show) {
		            ball.show = true;
		            ball.el = el;
		            this.dropBalls.push(ball);//完成之后添加到已完成数组
		            return;
		        }
	        };
		},
		beforeEnter:function(el){
			let cou = this.balls.length;
			while(cou--){
				let ball = this.balls[cou];
				if (ball.show) {
					let rect = ball.el.getBoundingClientRect();
		            let x = rect.left - 32;//x方向偏移量
		            let y = -(window.innerHeight - rect.top - 22);//y方向偏移量
		            el.style.display = '';
		            el.style.webkitTransform = 'translate3d(0,'+y+'px,0)';
		            el.style.transform = 'translate3d(0,'+y+'px,0)';
		            let inner = el.getElementsByClassName('inner-hook')[0];
		            inner.style.webkitTransform = 'translate3d('+x+'px,0,0)';
		            inner.style.transform = 'translate3d('+x+'px,0,0)';
				}
			}
		},
		entering:function(el){
			let rf = el.offestHeight;
	        this.$nextTick(function(){//异步执行
	          el.style.webkitTransform = 'translate3d(0,0,0)';    //重置回来
	          el.style.transform = 'translate3d(0,0,0)';
	          let inner = el.getElementsByClassName('inner-hook')[0];
	          inner.style.webkitTransform = 'translate3d(0,0,0)';
	          inner.style.transform = 'translate3d(0,0,0)';
	        });
		},
		afterEnter:function(el){
			let ball = this.dropBalls.shift();  //取到做完动画的球，再置为false，即重置，它还可以接着被利用
	        if (ball) {
	          ball.show = false;
	          el.style.display = 'none';
	        }
		},
		toggleList:function(){
			if (this.totalCount) {
				this.fold = !this.fold;
			}
		},
		empty:function(){
			this.selectFoods.forEach(function(food){
				food.count = 0;
			})
		},
		hideList:function(){
			this.fold=true;
		},
		pay:function(){
			if (this.totalPrice<this.minPrice) {
				return;
			}else{
				alert("需要支付"+this.totalPrice+"元");
			}
		}
	},
	created:function(){
		console.log("购物车");
	},

	components:{
		cartcontrol:cartcontrol
	}
}
</script>
<style type="text/css">
.shopcart{
	position: fixed;
	height: 48px;
	width: 100%;
	z-index: 10;
	bottom: 0;
	left: 0;
}
.shopcart .content{
	display: flex;
	background: #141d27;
	height: 48px;
}
.shopcart .content .left{
	flex: 1;
}
.shopcart .content .left .logo{
	display: inline-block;
	margin-left: 12px;
	border-radius: 50%;
	height: 56px;
	width: 56px;
	background: #141d27;
	position: relative;
	top: -10px;
	vertical-align: top;
}
.shopcart .content .left .logo .icon{
	position: absolute;
	margin: 6px;
	height: 44px;
	width: 44px;
	background: #2b343c;
	border-radius: 50%;
	font-size: 24px;
	text-align: center;
	line-height: 44px;
	color: rgba(255,255,255,0.3);
}
.shopcart .content .left .logo .iconActive{
	background: rgb(0,160,220);
	color: #fff;
}
.shopcart .content .left .logo .num{
	width: 24px;
	height: 16px;
	line-height: 16px;
	background: rgb(240,20,20); 
	border-radius: 6px;
	color: #fff;
	text-align: center;
	position: absolute;
	z-index: 11;
	font-size: 10px;
	right: 0;
}
.shopcart .content .left .price{
	display: inline-block;
	height: 24px;
	margin: 12px 0;
	padding: 0 12px 0 18px;
	text-align: center;
	line-height: 24px;
	color: rgba(255,255,255,0.4);
	font-size: 16px;
	font-weight: bold;
	border-right: 1px solid rgba(255,255,255,0.3); 
}
.shopcart .content .left .priceActive{
	color: #fff;
}
.shopcart .content .left .else{
	display: inline-block;
	height: 24px;
	margin: 12px 0;
	padding-left: 10px;
	font-size: 12px;
	line-height: 24px;
	color: rgba(255,255,255,0.4);
}
.shopcart .content .right{
	flex: 0 0 89px;
	background: #2b343c;
	text-align: center;
	font-size: 14px;
	line-height: 24px;
	padding: 12px 8px;
	color: rgba(255,255,255,0.4);
	font-weight: bold;
}
.shopcart .content .rightActive{
	background: #00b43c;
	color: #fff;
}
.shopcart .ball-container{

}
.shopcart .ball-container .ball{
	position: fixed;
	left: 32px;
	bottom: 22px;
	z-index: 200;
	transition: all 0.4s;
	transition-timing-function: cubic-bezier(0.49, -0.29, 0.75, 0.41);
}
.shopcart .ball-container .ball .inner{
	width: 16px;
	height: 16px;
	border-radius: 50%;
	background: #03a9f4;
	transition: all 0.4s linear;
}

.shopcart .shopcart-list{
	position: absolute;
	top: 0;
	left: 0;
	z-index: -1;
	width: 100%;
	transform: translate3d(0,-100%,0); 
}
.fold-enter-active{
	animation: fold-in .5s;
}
.fold-leave-active{
	animation: fold-in .5s reverse;
}
@keyframes fold-in{
	0% {transform: translate3d(0,0,0);}
	100% {transform: translate3d(0,-100%,0);}
}
.shopcart .shopcart-list .list-header{
	height: 40px;
	line-height: 40px;
	padding: 0 18px;
	border-bottom: 1px solid rgba(7,17,27,0.1);
	background: #f3f5f7;
	display: flex;
	display: -webkit-flex;
	justify-content: space-between;
	-webkit-justify-content:space-between;
}
.shopcart .shopcart-list .list-header .title{
	font-size: 14px;
	color: rgb(7,17,27);
}
.shopcart .shopcart-list .list-header .empty{
	font-size: 12px;
	color: rgb(0,160,221);
}
.shopcart .shopcart-list .list-content{
	padding: 0 18px;
	max-height: 217px;
	background: #fff;
	overflow: hidden;
}
.shopcart .shopcart-list .list-content .food{
	position: relative;
	padding: 12px 0;
	box-sizing: border-box;
	border-bottom: 1px solid rgba(7,17,27,0.1);
}
.shopcart .shopcart-list .list-content .food .name{
	line-height: 24px;
	font-size: 14px;
	color: rgb(7,17,27);
}
.shopcart .shopcart-list .list-content .food .price{
	position: absolute;
	right: 90px;
	bottom: 12px;
	line-height: 24px;
	font-size: 14px;
	font-weight: bold;
	color: rgb(240,20,20);
}
.shopcart .shopcart-list .list-content .food .cartcontrol-wrapper{
	position: absolute;
	right: 0;
	bottom: 10px;
}
.shopcart .list-mask{
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(7,17,27,0.5);
	z-index:-2;
}
.bg-enter-active, .bg-leave-active{
	transition: all 0.5s;
}
.bg-enter, .bg-leave-to{
	opacity: 0;
}
</style>