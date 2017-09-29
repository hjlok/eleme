<template>
	<div class="ratingselect">
		<div class="rating-type">
			<span class="block positive" @click="select(2,$event)" :class="{'activeP':myselectType===2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
			<span class="block positive" @click="select(0,$event)" :class="{'activeP':myselectType===0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
			<span class="block negative" @click="select(1,$event)" :class="{'activeN':myselectType===1}">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
		</div>
		<div class="switch" @click="toggle">
			<span class="icon-check_circle" :class="{'on':myonlyContent}"></span>
			<span class="text">只看内容评价</span>
		</div>
	</div>
</template>
<script type="text/javascript">
const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;	
export default{
	props:{
		ratings:{
			type:Array,
			default:function(){
				return [];
			}
		},
		selectType:{
			type : Number,
			default : ALL
		},
		onlyContent:{
			type : Boolean,
			default : false
		},
		desc:{
			type : Object,
			default:function(){
				return {
					all:'全部',
					positive:'满意',
					negative:'不满意'
				}
			}
		}
	},
	data:function(){
		return{
			myselectType:this.selectType, //props里的数据为单向传递，不能改变，用data属性转换一下
			myonlyContent:this.onlyContent
		}
	},
	computed:{
		positives:function(){
			return this.ratings.filter(function(rating){//数据过滤，rateType为请求数据里的
				return rating.rateType === POSITIVE;
			})
		},
		negatives:function(){
			return this.ratings.filter(function(rating){//数据过滤，rateType为请求数据里的
				return rating.rateType === NEGATIVE;
			})
		},
	},
	methods:{
		select:function(type,event){
			if (!event._constructed) {
				return;
			}
			this.myselectType=type;
			this.$emit('select',this.myselectType);
		},
		toggle:function(){
			this.myonlyContent=!this.myonlyContent;
			this.$emit('toggle',this.myonlyContent);
		}
	}
}
</script>
<style type="text/css">
.ratingselect{}
.ratingselect .rating-type{
	padding: 18px 0;
	margin: 0 18px;
	border-bottom: 1px solid rgba(7,17,27,0.2);
	font-size: 0;
}
.ratingselect .rating-type .block{
	display: inline-block;
	padding: 8px 12px;
	border-radius: 2px;
	margin-right: 8px;
	color: rgb(77,85,93);
	font-size: 12px;
	line-height: 16px;
}
.ratingselect .rating-type .block .count{
	font-size: 8px;
	margin-left: 2px;
}
.ratingselect .rating-type .positive{
	background: rgba(0,160,220,0.2);
}
.ratingselect .rating-type .activeP{
	background: rgb(0,160,220);
	color: #fff;
}
.ratingselect .rating-type .negative{
	background: rgba(77,85,93,0.2);
}
.ratingselect .rating-type .activeN{
	background: rgb(77,85,93);
	color: #fff;
}
.ratingselect .switch{
	line-height: 14px;
	padding: 12px 18px;
	border-bottom: 1px solid rgba(7,17,27,0.2);
	color: rgb(147,153,159);
	font-size: 0;
}
.ratingselect .on{
	color: green;
}
.ratingselect .switch .icon-check_circle{
	display: inline-block;
	vertical-align: top;
	margin-right: 4px;
	font-size: 24px;
}
.ratingselect .switch .text{
	display: inline-block;
	font-size: 12px;
	line-height: 24px;
}
</style>