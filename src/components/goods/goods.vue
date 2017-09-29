<template>
	<!--
	better-scroll插件使用时，ref的父级需要设置高度，定位为position，设置overflow为hidden,同时ref的内需要一层包裹div,然后才能写内容。
		举个例子：
		<div class=main> //设置定位、高度、超出隐藏
			<div ref=""> //ref标签使用的地方
				<div>  //包裹内容层，不能省略，否则滚动无效
					<div class="nav" v-for="item in items"></div>  //内容
				</div>
			</div>
		<div>
		-->
	<div class="goods">
		<div class="menu" ref="menu">
			<div>
				<div class="item" v-for="(a,index) in goods" v-on:click="menuIndex(index,$event)"
				 v-bind:class="{'active':activeIndex===index}">
					<span class="text">
					<span v-show="a.type>=0" class="icon" v-bind:class="supType[a.type]"></span>{{a.name}}
					</span>
				</div>
			</div>
		</div>
		<div class="foods" ref="foods">
			<div>
				<div v-for="b in goods" class="channel channel-hook">
					<div class="channelName">{{b.name}}</div>
					<div v-for="c in b.foods" class="items" @click="selectFood(c,$event)">
						<div class="left">
							<img v-bind:src="c.icon">
						</div>
						<div class="right">
							<div class="name">{{c.name}}</div>
							<div class="intro" v-show="c.description">{{c.description}}</div>
							<div class="intro">
								<span>月售{{c.sellCount}}份</span>
								<span class="goodRatings">好评率{{c.rating}}%</span>
							</div>
							<div class="price">
								<span class="now">￥{{c.price}}</span>
								<span class="old" v-show="c.oldPrice">￥{{c.oldPrice}}</span>
							</div>
							<div class="control">
								<cartcontrol v-bind:food="c" v-on:increment="incrementTotal"></cartcontrol>
								<!--此处c为b.foods,b就是从后台请求的goods,即c为goods.foods对象-->
							</div>
						</div>	
					</div>
				</div>
			</div>
		</div>
		<shopcart v-bind:selectFoods="selectFoods" v-bind:deliveryPrice="seller.deliveryPrice"
		 v-bind:minPrice="seller.minPrice" ref="shopcart"></shopcart>
		<food :food="selectedFood" ref="food" @increment="incrementTotal"></food>
	</div>
</template>
<script type="text/javascript">
    import Bscroll from 'better-scroll'
    import shopcart from '../shopcart/shopcart.vue'
    import cartcontrol from '../cartcontrol/cartcontrol.vue'
    import food from '../food/food.vue'
	export default {
		props:{
			seller:{
				type : Object
			}
		},
		data:function(){
			return {
				goods:[],
				supType: ['type0','type1','type2','type3','type4'],
				channelH:[],
				scrollY:0,
				selectedFood:{}
			}
		},
		components:{
			shopcart : shopcart,
			cartcontrol : cartcontrol,
			food:food
		},
		computed:{
			activeIndex:function(){
				for (let i = 0; i < this.channelH.length; i++) {
					let h1=this.channelH[i];
					let h2=this.channelH[i+1];
					if (!h2||(this.scrollY>=h1&&this.scrollY<h2)) {
						return i;
					}
				}
				return 0;
			},
			selectFoods:function(){
				let Foods=[];
				this.goods.forEach(function(b){//循环栏目
					b.foods.forEach(function(c){//循环每项食物
						if (c.count) {//如果点击数存在
							Foods.push(c);//添加到新数组
						};
					});
				});
				return Foods;
			}/*cartcontrol组件在数据里设置了count属性，通过遍历数据，找到有count属性的数据，重新
			生成一个数组，并传给shopcart组件*/
		},
		created: function(){
	      this.$http.get('/api/goods').then(
	            function (response) {
	              // 处理成功的结果
	              	var res=response.body;
	              	if(res.state===0){
	              		this.goods=res.data;
	                  	console.log("这是goods.vue页面请求的：",this.goods);
	                  	this.$nextTick(function() {
		                  	this._initScroll();
		                  	this._active();
		                  })
	              };
	            },function(response){
	                //处理失败的结果
	            }
	        );
	  	},
	  	methods:{
	  		incrementTotal:function(target){
	  			this.$nextTick(function() {
  					this.$refs.shopcart.drop(target);
	  			})
	  		},
	  		_initScroll:function(){
	  			this.menuScroll=new Bscroll(this.$refs.menu,{click:true});
	  			this.foodsScroll=new Bscroll(this.$refs.foods,{probeType:3,click:true});
	  			this.foodsScroll.on('scroll',(pos) =>{
	  				this.scrollY =Math.abs(Math.round(pos.y));
	  			})
	  		},
	  		_active:function(){
  				let foodList=this.$refs.foods.getElementsByClassName('channel-hook');
  				let height= 0;
  				this.channelH.push(height);
  				for (let i = 0; i < foodList.length; i++) {
  					height += foodList[i].clientHeight;
  					this.channelH.push(height);
  				};
	  		},
	  		menuIndex:function(msg,eve){
	  			if (!eve._constructed) {
	  				return;
	  			}
	  			let foodList=this.$refs.foods.getElementsByClassName('channel-hook');
	  			let el = foodList[msg];
	  			this.foodsScroll.scrollToElement(el,300);
	  		},
	  		selectFood:function(food,event){
	  			if (!event._constructed) {
	  				return;
	  			}
	  			this.selectedFood = food;
	  			this.$refs.food.show();
	  		}
	  	}
	}
</script>
<style type="text/css">
.goods{
	display: flex;
	position:absolute;
	top:175px;
	bottom: 48px;
	width: 100%;
	overflow: hidden;
}
.menu{
	flex: 0 0 80px;
	background: #f3f5f7;
}
.menu .item{
	display: table;
	height: 54px;
	width: 56px;
	margin: auto;
	line-height: 16px;
	border-bottom: 1px solid rgba(7,17,27,0.2);
}
.menu .active{
	position: relative;
	background: #fff;
	font-weight: 700;
	height: 57px;
	color: #03a9f4;
	border-bottom: none;
	z-index: 10;
	padding: 0 12px;
}
.menu .item .text{
	display: table-cell;
	font-size: 12px;
	vertical-align: middle;
}
.menu .item .text .icon{
	height:14px;
	width:14px;
	background-size: 14px 14px;
	display:inline-block;
	vertical-align:top;
}
.type0{
	background-image: url(../header/decrease2.png);
}
.type1{
	background-image: url(../header/discount2.png);
}
.type2{
	background-image: url(../header/special2.png);
}
.type3{
	background-image: url(../header/invoice2.png);
}
.type4{
	background-image: url(../header/guarantee2.png);
}


.foods{
	flex: 1;
}
.foods .channel{}
.foods .channel .channelName{
	height: 26px;
	line-height: 26px;
	font-size: 12px;
	color: rgb(147,153,159);
	background: #f3f5f7;
	border-left: 2px solid #d9dde1;
	padding: 0 14px;
}
.foods .channel .items{
	display: flex;
	padding: 18px 0;
	margin: 0 18px;
	border-bottom: 1px solid rgba(7,17,27,0.1);
}
.foods .channel .items:last-child{
	border-bottom: none;
}
.foods .channel .items .left{
	flex: 0 0 57px;
	margin-right: 10px;
}
.foods .channel .items .left img{
	height: 57px;
	width: 57px;
}
.foods .channel .items .right{
	flex: 1;
	position: relative;
}
.foods .channel .items .right .name{
	margin-top: 2px;
	font-size: 14px;
	line-height: 14px;
	color: rgb(7,17,27);
}
.foods .channel .items .right .intro{
	margin-top: 8px;
	font-size: 10px;
	line-height: 14px;
	color: rgb(147,153,159);
}
.foods .channel .items .right .intro .goodRatings{
	margin-left: 12px;
}
.foods .channel .items .right .price{
	margin-top:6px;
	height: 24px;
}
.foods .channel .items .right .price .now{
	font-size: 14px;
	color: red;
	font-weight: bold;
	line-height: 18px;
}
.foods .channel .items .right .price .old{
	font-size: 10px;
	line-height: 18px;
	margin-left:8px;
	font-weight: bold;
	color: rgb(147,153,159);
	text-decoration: line-through;
}
.foods .channel .items .right .control{
	position: absolute;
	right: 0;
	bottom: 2px;
}
</style>