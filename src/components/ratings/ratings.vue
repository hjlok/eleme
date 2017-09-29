<template>
	<div class="ratings" ref="ratings">
		<div>
			<div class="ratings-content">
				<div class="overview">
					<div class="overview-left">
						<h1 class="score">{{seller.score}}</h1>
						<div class="title">综合评价</div>
						<div class="rank">高于周边商家{{seller.rankRate}}%</div>
					</div>
					<div class="overview-right">
						<div class="score-wrapper">
							<span class="title">服务态度</span>
							<star :size="18" :margin="3" :score="seller.serviceScore"></star>
							<span class="score">{{seller.serviceScore}}</span>
						</div>
						<div class="score-wrapper">
							<span class="title">服务态度</span>
							<star :size="18" :margin="3" :score="seller.foodScore"></star>
							<span class="score">{{seller.foodScore}}</span>
						</div>
						<div class="delivery-wrapper">
							<span class="title">送达时间</span>
							<span class="delivery">{{seller.deliveryTime}}分钟</span>
						</div>
					</div>
				</div>
			</div>
			<split></split>
			<ratingselect :selectType="selectType" :onlyContent="onlyContent" :ratings="ratings"  @select="selectRating" @toggle="toggleContent"></ratingselect>
			<div class="rating-wrapper">
				<ul>
					<li v-for="rating in ratings" class="rating-item"  v-show="needShow(rating.rateType,rating.text)">
						<div class="avatar">
							<img :src="rating.avatar" height="28px" width="28px">
						</div>
						<div class="content">
							<h1 class="name">{{rating.username}}</h1>
							<div class="star-wrapper">
								<star :size="12" :margin="2" :score="rating.score"></star>
								<span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
							</div>
							<p class="text">{{rating.text}}</p>
							<div class="recommend" v-show="rating.recommend&&rating.recommend.length>0">
								<span class="icon-thumb_up"></span>
								<span v-for="item in rating.recommend">{{item}}</span>
							</div>
							<div class="time">{{rating.rateTime | formatDate}}</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
import star from '../star/star.vue'
import split from '../split/split.vue'
import ratingselect from '../ratingselect/ratingselect.vue'
import {formatDate} from '../../common/js/date.js'
import BScroll from 'better-scroll'
const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;
export default {
	props:{
		seller:{
			type: Object
		}
	},
	data:function () {
		return {
			ratings:[],
			selectType: ALL,
			onlyContent: true
		}
	},
	created:function(){
		this.$http.get('/api/ratings').then(function(response){
			response = response.body;
			if (response.state==0) {
				this.ratings = response.data;
				console.log("评论页",this.ratings);
				this.$nextTick(() => {
					this.scroll=new BScroll(this.$refs.ratings,{click:true});
				})
			}
		})
	},
	components:{
		star:star,
		split:split,
		ratingselect:ratingselect
	},
	filters:{
		formatDate:function(time){
			let date = new Date(time);
			// console.log('时间戳',date);
			return formatDate(date,'yyyy-MM-dd hh:mm');
		}
	},
	methods:{
		needShow:function(type,text){
			if (this.onlyContent&&!text) {//只查看有内容的，并且内容为空
				return false;
			}
			if (this.selectType === ALL) {//查看全部
				return true;
			}else{
				return type === this.selectType;//此项数据是否和选中类型相同
			}
		},
		selectRating:function(type){
			this.selectType=type;
		},
		toggleContent:function(type){
			this.onlyContent=type;
			this.$nextTick(() => {
	          this.scroll.refresh();
	        });
		}
	}
}
</script>
<style type="text/css">
.ratings{
	position: absolute;
	top: 174px;
	bottom: 0;
	width: 100%;
	left: 0;
	overflow: hidden;
}
.ratings .ratings-content .overview{
	display: flex;
	padding: 18px 0;
}
.ratings .ratings-content .overview .overview-left{
	flex: 0 0 125px;
	width: 125px;
	border-right: 1px solid rgba(7,17,27,0.1);
	text-align: center;
	padding: 6px 0;
}	
.ratings .ratings-content .overview .overview-left .score{
	line-height: 28px;
	font-size: 24px;
	color: rgb(255,153,0);
	margin-bottom: 6px;
}
.ratings .ratings-content .overview .overview-left .title{
	line-height: 12px;
	font-size: 12px;
	color: rgb(7,17,27);
	margin-bottom: 8px;
}
.ratings .ratings-content .overview .overview-left .rank{
	line-height: 10px;
	font-size: 10px;
	color: rgb(147,153,159);
}
.ratings .ratings-content .overview .overview-right{
	flex: 1;
	padding-left: 18px;
	padding-top: 4px;
}	
.ratings .ratings-content .overview .overview-right .score-wrapper{
	margin-bottom: 7px;
	font-size: 0;
}
.ratings .ratings-content .overview .overview-right .score-wrapper .title{
	font-size: 12px;
	color: rgb(7,17,27);
	line-height: 15px;
	display: inline-block;
	vertical-align: top;
	padding-top: 3px;
}
.ratings .ratings-content .overview .overview-right .score-wrapper .star{
	display: inline-block;
	vertical-align: top;
	margin: 0 10px;
}
.ratings .ratings-content .overview .overview-right .score-wrapper .score{
	display: inline-block;
	vertical-align: top;
	font-size: 12px;
	color: rgb(255,153,0);
	line-height: 15px;
	padding-top: 3px;
}
.ratings .ratings-content .overview .overview-right .delivery-wrapper{
	font-size: 0;
	padding-top: 3px;
}
.ratings .ratings-content .overview .overview-right .delivery-wrapper .title{
	font-size: 12px;
	color: rgb(7,17,27);
	line-height: 15px;
	padding-top: 3px;
}
.ratings .ratings-content .overview .overview-right .delivery-wrapper .delivery{
	color: rgb(147,153,159);
	font-size: 12px;
	margin-left: 12px;
}
.ratings .rating-wrapper{
	padding: 0 18px;
}
.ratings .rating-wrapper .rating-item{
	display: flex;
	padding: 18px 0;
	border-bottom: 1px solid rgba(7,17,27,0.1);
}
.ratings .rating-wrapper .rating-item .avatar{
	flex: 0 0 28px;
	width: 28px;
	margin-right: 12px;
}
.ratings .rating-wrapper .rating-item .avatar img{
	border-radius: 50%;
}
.ratings .rating-wrapper .rating-item .content{
	position: relative;
	flex: 1;
}
.ratings .rating-wrapper .rating-item .content .name{
	line-height: 12px;
	font-size: 10px;
	color: rgb(7,17,27);
	margin-bottom: 4px;
}
.ratings .rating-wrapper .rating-item .content .star-wrapper{
	margin-bottom: 6px;
	font-size: 0;
}
.ratings .rating-wrapper .rating-item .content .star-wrapper .star{
	display: inline-block;
	vertical-align: top;
	margin-right: 6px;
}
.ratings .rating-wrapper .rating-item .content .star-wrapper .delivery{
	display: inline-block;
	vertical-align: top;
	line-height: 12px;
	font-size: 10px;
	color: rgb(147,153,159);
}
.ratings .rating-wrapper .rating-item .content .text{
	line-height: 18px;
	color: rgb(7,17,27);
	font-size: 12px;
	margin-bottom: 8px;
}
.ratings .rating-wrapper .rating-item .content .recommend{
	line-height: 16px;
	font-size: 0;
}
.ratings .rating-wrapper .rating-item .content .recommend span{
	font-size: 9px;
	display: inline-block;
	margin: 0 8px 4px 0;
	color: rgb(147,153,159);
	border: 1px solid rgba(7,17,27,0.1);
	border-radius: 2px;
	padding: 0 6px;
}
.ratings .rating-wrapper .rating-item .content .recommend .icon-thumb_up{
	color: rgb(0,160,220);
	border: none;
	padding: 0;
}
.ratings .rating-wrapper .rating-item .content .time{
	position: absolute;
	top: 0;
	right: 0;
	line-height: 12px;
	font-size: 10px;
	color: rgb(147,153,159);
}
</style>