<template>
	<div class="star">
		<span v-for="a in itemClasses" :class="a" class="star-item" :style="itemStyle"></span>
	</div>
</template>
<script type="text/javascript">
const ON='on'
const HALF='half'
const OFF='off'

export default{
	props:{
		score:{
			type:Number
		},
		margin:{
			type:Number
		},
		size:{
			type:Number
		}
	},
	data:function(){
		return {
			itemStyle:{
				height:this.size+'px',
				width:this.size+'px',
				marginRight:this.margin+'px',
				marginLeft:this.margin+'px'
			}
		}
	},
	created:function(){
	},
	computed:{
		itemClasses:function() {
			let result = [];
			let score = Math.floor(this.score*2)/2;
			let dot = (score%1== 0)? false:true;
			let integer = Math.floor(score);
			for (let i = 0; i < integer; i++) {
				result.push(ON);
			};
			if (dot) {
				result.push(HALF);
			};
			while (result.length<5){
				result.push(OFF);
			};
			return result;
		}
	}
}
</script>
<style type="text/css">
.star{}
.star .star-item{display: inline-block;background-size: 100% 100%;}
.star .on{background-image: url(star_on.png);}
.star .half{background-image: url(star_half.png)}
.star .off{background-image: url(star_off.png);}
</style>