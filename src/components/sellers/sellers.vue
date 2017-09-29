<template>
	<div class="seller" ref="seller">
		<div class="seller-content">
			<div class="overview">
				<h1 class="title">{{seller.name}}</h1>
				<div class="desc">
					<star :size="18" :margin="3" :score="seller.score"></star>
					<span class="text">({{seller.ratingCount}})</span>
					<span class="text">月售{{seller.sellCount}}单</span>
				</div>
				<ul class="remark">
					<li class="block">
						<h2>起送价</h2>
						<div class="content">
							<span class="stress">{{seller.minPrice}}</span>元
						</div>
					</li>
					<li class="block">
						<h2>商家配送</h2>
						<div class="content">
							<span class="stress">{{seller.deliveryPrice}}</span>元
						</div>
					</li>
					<li class="block">
						<h2>平均配送时间</h2>
						<div class="content">
							<span class="stress">{{seller.deliveryTime}}</span>分钟
						</div>
					</li>
				</ul>
				<div class="favorite" @click="toggleFavorite">
					<span class="icon-favorite" :class="{'active':favorite}"></span>
					<span class="text">{{favoriteText}}</span>
				</div>
			</div>
			<split></split>
			<div class="bulletin">
				<h1 class="title">公告与活动</h1>
				<div class="content-wrapper">
					<p class="content">{{seller.bulletin}}</p>
				</div>
				<ul v-if="seller.supports" class="supports">
					<li class="item" v-for="c in seller.supports" >
						<span v-bind:class="supType[c.type]" class="icon"></span>
						<span class="text">{{c.description}}</span>
					</li>
				</ul>
			</div>
			<split></split>
			<div class="pics">
				<h1 class="title">商家实景</h1>
				<div class="pic-wrapper" ref="picWrapper">
					<ul class="pic-list" ref="picList">
						<li class="pic-item" v-for="pic in seller.pics">
							<img :src="pic" width="120" height="90">
						</li>
					</ul>
				</div>
			</div>
			<split></split>
			<div class="info">
				<h1 class="title">商家信息</h1>
				<ul>
					<li class="info-item" v-for="info in seller.infos">
						{{info}}
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
import star from '../star/star.vue'
import split from '../split/split.vue'
import BScroll from 'better-scroll'
import {saveToLocal, loadFormLocal} from '../../common/js/util.js';
export default {
	props:{
		seller:{
			type:Object
		}
	},
	data:function () {
		return {
			supType: ['type0','type1','type2','type3','type4'],
			favorite: (()=> {
				return loadFormLocal(this.seller.id, 'favorite', false);
			})()
		}
	},
	mounted:function(){
		console.log(this.seller,"商家页");//首次进入渲染时，此时seller还没有获取到，走watch去观察
		this._initScroll();
		this._initPics();
	},
	watch:{
		'seller':function(){//点击切换时，seller一直存在没变化，这时需要用mounted来观察
			this.$nextTick(function(){
				this._initScroll();
				this._initPics();
			})
		}
	},
	methods:{
		_initScroll:function(){
			if (!this.scroll) {
				this.scroll = new BScroll(this.$refs.seller,{click:true})
			}else {
				this.scroll.refresh();
			}
		},
		_initPics:function(){
			if (this.seller.pics) {
				let picWidth = 120;
				let margin = 6;
				let width = (picWidth+margin)*this.seller.pics.length-margin;
				this.$refs.picList.style.width = width+'px';
				if (!this.picScroll) {
					this.picScroll = new BScroll(this.$refs.picWrapper,{
						scrollX: true,
						eventPassthrough: 'vertical'
					})
				}else{
					this.picScroll.refresh();
				}
			}
		},
		toggleFavorite:function(){
			if (!event._constructed) {
				return;
			}
			this.favorite=!this.favorite;
			saveToLocal(this.seller.id, 'favorite', this.favorite);
		}
	},
	computed:{
		favoriteText:function(){
			return this.favorite? '已收藏':'收藏'
		}
	},
	components:{
		star:star,
		split:split
	}
}
</script>
<style type="text/css">
.seller{
	position: absolute;
	top: 174px;
	bottom: 0;
	left: 0;
	width: 100%;
	overflow: hidden;
}
.seller .overview{
	position: relative;
	padding:18px;
}
.seller .overview .title{
	margin-bottom: 8px;
	line-height: 14px;
	color: rgb(7,17,27);
	font-size: 14px;
}
.seller .overview .desc{
	padding-bottom: 18px;
	border-bottom: rgba(7,17,27,0.1);
	font-size: 0;
	margin-top: 8px;
}
.seller .overview .desc .star{
	display: inline-block;
	vertical-align: top;
	margin-left: -3px;
	margin-right: 8px;
}
.seller .overview .desc .text{
	margin-right: 12px;
	display: inline-block;
	vertical-align: top;
	font-size: 10px;
	line-height: 18px;
	color: rgb(77,85,93);
}
.seller .overview .remark{
	display: flex;
	padding-top: 18px;
}
.seller .overview .remark .block{
	flex: 1;
	text-align: center;
	border-right: 1px solid rgba(7,17,27,0.1);
}
.seller .overview .remark .block:last-child{
	border: none;
}
.seller .overview .remark .block h2{
	margin-bottom: 4px;
	line-height: 10px;
	font-size: 10px;
	color: rgb(147,153,159);
}
.seller .overview .remark .block .content{
	line-height: 24px;
	font-size: 10px;
	color: rgb(7,17,27);
}
.seller .overview .remark .block .content .stress{
	font-size: 24px;
}
.seller .overview .favorite{
	position: absolute;
	right: 11px;
	top: 12px;
	width: 50px;
	text-align: center;
}
.seller .overview .favorite .icon-favorite{
	display: block;
	line-height: 24px;
	font-size: 24px;
	color: #d4d6d9;
}
.seller .overview .favorite .active{
	color: rgb(240,20,20);
}
.seller .overview .favorite .text{
	line-height: 10px;
	font-size: 10px;
	color: rgb(77,85,93);
}

.seller .bulletin{
	padding: 18px 18px 0 18px;
}
.seller .bulletin .title{
	margin-bottom: 8px;
	line-height: 14px;
	color: rgb(7,17,27);
	font-size: 14px;
}
.seller .bulletin .content-wrapper{
	padding: 0 12px 16px 12px;
	border-bottom: 1px solid rgba(7,17,27,0.1);
}
.seller .bulletin .content-wrapper .content{
	line-height: 24px;
	font-size: 12px;
	color: rgb(240,20,20);
}

.seller .bulletin .supports .item{
	padding: 16px 12px;
	border-bottom: 1px solid rgba(7,17,27,0.1);
	font-size: 0;
}
.seller .bulletin .supports .item:last-child{
	border-bottom: none;
}
.seller .bulletin .supports .item .icon{
	height:16px;
	width:16px;
	background-size: 100% 100%;
	display:inline-block;
	vertical-align:top;
}
.seller .bulletin .type0{
	background-image: url(decrease.png);
}
.seller .bulletin .type1{
	background-image: url(discount.png);
}
.seller .bulletin .type2{
	background-image: url(special.png);
}
.seller .bulletin .type3{
	background-image: url(invoice.png);
}
.seller .bulletin .type4{
	background-image: url(guarantee.png);
}
.seller .bulletin .supports .item .text{
	font-size: 12px;
	line-height: 16px;
	margin-left: 6px;
	display: inline-block;
}
.seller .pics{
	padding: 18px;
}
.seller .pics .title{
	margin-bottom: 8px;
	line-height: 14px;
	color: rgb(7,17,27);
	font-size: 14px;
}
.seller .pics .pic-wrapper{
	width: 100%;
	overflow: hidden;
	white-space: nowrap;
}
.seller .pics .pic-wrapper .pic-list{
	font-size: 0;
}
.seller .pics .pic-wrapper .pic-list .pic-item{
	display: inline-block;
	margin-right: 6px;
	width: 120px;
	height: 90px;
}
.seller .pics .pic-wrapper .pic-list .pic-item:last-child{
	margin-right: 0;
}
.seller .info{
	padding: 18px 18px 0 18px;
}
.seller .info .title{
	padding-bottom: 8px;
	line-height: 14px;
	color: rgb(7,17,27);
	font-size: 14px;
	border-bottom: 1px solid rgba(7,17,27,0.1);
}
.seller .info .info-item{
	padding: 16px 12px;
	line-height: 16px;
	border-bottom: 1px solid rgba(7,17,27,0.1);
	font-size: 12px;
}
.seller .info .info-item:last-child{
	border: none;
}
</style>