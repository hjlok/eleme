<template>
	<div class="cartcontrol">
		<transition name="roll">
			<div class="dec" v-show="food.count>0">
				<span class="icon icon-remove_circle_outline" @click.stop.prevent="decCount"></span>
			</div>
		</transition>
		<div class="count" v-show="food.count>0">{{food.count}}</div>
		<div class="add icon-add_circle" @click.stop.prevent="addCount"></div>
	</div>
</template>
<script type="text/javascript">
import Vue from 'vue'
export default{
	props:{
		food:{
			type:Object
		}
	},
	created:function() {
	},
	methods:{
		addCount:function(eve){
			if (!eve._constructed) {
  				return;
  			}
			if (!this.food.count) {
				Vue.set(this.food,'count',1);//在请求数组里设置一个count属性。
			}else{
				this.food.count++;
			};
			this.$emit('increment',eve.target);//在父组件中执行方法
		},
		decCount:function(eve){
			if (!eve._constructed) {
	  			return;
	  		};
	  		if (this.food.count) {
				this.food.count--;
			}
		}
	}
}
</script>
<style type="text/css">
.cartcontrol{
	font-size: 0;
}

.roll-enter-active, .roll-leave-active {
   transition:all 0.4s linear;
}
.roll-enter-active .icon, .roll-leave-active .icon{
	transition: all 0.4s linear;
}
.roll-enter, .roll-leave-to {
   opacity: 0;
   transform:translate3d(24px,0,0);
}
.roll-enter .icon, .roll-leave-to .icon{
	transform: rotate(180deg);
}
.cartcontrol .dec{
	display: inline-block;
	vertical-align: top;
	line-height: 24px;
	font-size: 24px;
	color: #03a9f4;
}
.cartcontrol .dec .icon{
	display: inline-block;
}

.cartcontrol .count{
	display: inline-block;
	width: 24px;
	font-size: 10px;
	line-height: 24px;
	text-align: center; 
	color: rgb(147,153,159);
}
.cartcontrol .add{
	display: inline-block;
	line-height: 24px;
	font-size: 24px;
	color: #03a9f4;
	vertical-align: top;
}
</style>