/*!
 * JavaScript library
 * Date: 2018_1_5
 * Author: Guan_Ning  
 * Copyright: Personal
 * Version: 1.2.2
 * E-mail: GuanNing@yeah.net
 */

var Point = function(args){
    return new Selector(args);
};

// 创建数组 保存获取的节点和节点数组
function Selector(args){
	this.elements = [];
	if(typeof args == 'string'){
		// 模拟Css选择器用法
		if(args.indexOf(' ') != -1){
			// 拆分节点保存到数组
			var elements = args.split(' ');
			// 存放临时节点对象数组
			var childElements = [];
			var node = [];
			for(var i = 0; i < elements.length; i++){
				// 如果查找不到父节点直接默认全局
				if(node.length == 0)node.push(document);
				switch(elements[i].charAt(0)){
				case '?':
					// 清理临时节点 
					childElements = [];
					childElements.push(this.GetId(elements[i].substring(1)));
					// 保存父节点
					node = childElements;
					break;
				case '.':
					childElements = [];
					for(var j = 0; j < node.length; j++)
					 	var temps = this.GetClass(elements[i].substring(1),node[j]);
					 	for(var k = 0; k < temps.length; k++)
					 		childElements.push(temps[k]);
					node = childElements;
					break;
				default :
					childElements = [];
					for(var j = 0; j < node.length; j++)
						var temps = this.GetTag(elements[i],node[j]);
						for(var k = 0; k < temps.length; k++)
							childElements.push(temps[k]);
					node = childElements;
				}
			}
			this.elements = childElements;
		}else{
			switch(args.charAt(0)){
				case '?':
					this.elements.push(this.GetId(args.substring(1)));
					break;
				case '.':
					this.elements = this.GetClass(args.substring(1));
					break;
				default :
					this.elements = this.GetTag(args);
			}
		}
	}else if(typeof args == 'object'){
		if(args != 'undefined')
			this.elements[0] = args;
	}
};

Selector.prototype.GetId = function(id){
	return document.getElementById(id);
};
 
Selector.prototype.GetClass = function(className, parentNode){
	var node = null;
	var temps = [];
	if(parentNode != undefined){
		node = parentNode;
	}else{
		node = document;
	}
	var all = node.getElementsByTagName('*');
	for(var i = 0; i < all.length; i++){
		if(all[i].className == className){
			temps.push(all[i]);
		}
	}
	return temps;
};

Selector.prototype.GetTag = function(tag, parentNode){
	var node = null;
	var temps = [];
	if(parentNode != undefined){
		node = parentNode;
	}else{
		node = document;
	}
	var tags = node.getElementsByTagName(tag);
	for(var i = 0; i < tags.length; i++){
		temps.push(tags[i]);
	}
	return temps;
};

Selector.prototype.GetName = function(name){
	this.elements.push(document.getElementsByName(name));
};

Selector.prototype.GetElement = function(nub){
	return this.elements[nub];
};

// 选择指定节点用法与eq()相同
Selector.prototype.Clude = function(nub){
	var ele = this.elements[nub];
	this.elements = [];
	this.elements[0] = ele;
	return this;
};

// 封装CSS选择器获取子节点
Selector.prototype.Child = function(str){
	var childElements = [];
	for(var i = 0; i < this.elements.length; i++){
		switch(str.charAt(0)){
			case '?':
				childElements.push(this.GetId(str.substring(1)));
				break;
			case '.':
				var temps = this.GetClass(str.substring(1),this.elements[i]);
				for(var j = 0; j < temps.length; j++){
					childElements.push(temps[j])
				}
				break;
			default :
				var temps = this.GetTag(str,this.elements[i]);
				for(var j = 0; j < temps.length; j++){
					childElements.push(temps[j]);
				}
		}
	}
	this.elements = childElements;
	return this;
}

// 封装 JavaScript 实现连缀功能
Selector.prototype.Style = function(attr,value){
	for(var i = 0; i < this.elements.length; i++){
		if(arguments.length == 1){
			if(typeof window.getComputedStyle != 'undefined'){
				return GetStyle(this.elements[i],[attr]);
			}
		}
		this.elements[i].style[attr] = value;
	}
	return this;
}

Selector.prototype.Html = function(str){
	for(var i = 0; i < this.elements.length; i++){
		if(arguments.length == 0){
			return this.elements[i].innerHTML;
		}
		this.elements[i].innerHTML = str;
	}
	return this;
}

Selector.prototype.Click = function(clk){
	for(var i = 0; i < this.elements.length; i++){
		this.elements[i].onclick = clk;
	}
	return this;
}

// 封装 JavaScript 添加或移除元素Class
Selector.prototype.EventClass = function(className){
	for(var i = 0; i < this.elements.length; i++){
		if(!this.elements[i].className.match(new RegExp('(\\s|^)' +className+ '(\\s|$)'))){
			this.elements[i].className += " " + className;
		}
	}
	return this;
}

Selector.prototype.RemoveClass = function(className){
	for(var i = 0; i < this.elements.length; i++){
		if(this.elements[i].className.match(new RegExp('(\\s|^)' +className+ '(\\s|$)'))){
			this.elements[i].className = this.elements[i].className.replace(new RegExp('(\\s|^)' +className+ '(\\s|$)')," ");
		}
	}
	return this;
}

// 封装 JavaScript 鼠标移入移出事件
Selector.prototype.Move = function(over,out){
	for(var i = 0; i < this.elements.length; i++){
		addEvent(this.elements[i],'mouseover',over);
		addEvent(this.elements[i],'mouseout',out);
	}
	return this;
}

// 封装 JavaScript 显示与隐藏
Selector.prototype.Display = function(){
	for(var i = 0; i < this.elements.length; i++){
		this.elements[i].style.display = "block";
	}
	return this;
}

Selector.prototype.Disappear = function(){
	for(var i = 0; i < this.elements.length; i++){
		this.elements[i].style.display = "none";
	}
	return this;
}

// 获取Event对象
function getEvent(event){
	return event || window.event;
}

/*
 *	阻止浏览器默认行为,并把IE常用的Event对象匹配到W3C中
 *	调用方法 e.preventDefault();
 *	兼容IE阻止浏览器冒泡行为 
 *	调用发放 e.stopPropagation();
 */

addEvent.fixEvent = function(event){
	event.preventDefault = addEvent.fixEvent.preventDefault;
	event.stopPropagation = addEvent.fixEvent.stopPropagation;
	event.target = event.srcElement;
	return event;
}

addEvent.fixEvent.preventDefault = function(){
	this.returnValue = false;
}

addEvent.fixEvent.stopPropagation = function(){
	this.cancelBubble = ture;
}

/*
 *	跨浏览器为元素添加事件绑定
 *  调用方法 addEvent(input,'click',key);
 *  跨浏览器删除事件绑定
 *  调用方法 removeEvent(input,'click',key);
 */

function addEvent(obj, type, key){
	if(typeof obj.addEventListener != 'undefined'){
		obj.addEventListener(type,key,false);
	}else{
		if(!obj.events)obj.events = {};
		if(!obj.events[type]){
			obj.events[type] = [];
			if(obj['on' + type])obj.events[type][0] = key;
		}else{
			if(addEvent.equal(obj.events[type],key)){
				return false;
			}
		}
		obj.events[type][addEvent.ID++] = key; 
		obj['on' + type] = addEvent.exec;
	}
}
// 为每个事件添加计数器实现事件索引累加
addEvent.ID = 1;

addEvent.exec = function(event){
	var e = event || addEvent.fixEvent(window.event);
	var G_eq = obj.events[e.type];
	for(var i in G_eq){
		G_eq[i].call(this,e);
	}
}

addEvent.equal = function(G_eq, key){
	for(var i in G_eq){
		if(G_eq == key){
			return false;
		}
	}
	return false;
}

function removeEvent(obj, type, key){
	if(typeof obj.removeEventListener != 'undefined'){
		obj.removeEventListener(type,key,false);
	}else{
		if(obj.events){
			for(var i in obj.events[type]){
				if(obj.events[type][i] == key){
					delete obj.events[type][i];
				}
			}
		}
	}
}

//跨浏览器获取元素Style样式
function GetStyle(element,attr){
	var value;
	if(typeof window.getComputedStyle != 'undefined'){
		value = window.getComputedStyle(element,null)[attr];
	}else if(typeof element.currentStyle != 'undefined'){
		value = element.currentStyle[attr];
	}
	return value;
}

// 获取浏览器视口大小
function getInner(){
	if(typeof window.innerWidth != 'undefined'){
		return{
			width: window.innerWidth,
			height: window.innerHeight
		}
	}else{
		return{
			width: document.documentElement.clientWidth,
			height: document.documentElement.clientHeight
		}
	}
}

// 封装 JavaScript 弹窗或元素居中效果
Selector.prototype.Popup = function(width,height){
	var top = (getInner().height - 250)/2;
	var left = (getInner().width - 350)/2;
	for(var i = 0; i < this.elements.length; i++){
		this.elements[i].style.top = top + "px";
		this.elements[i].style.left = left + "px";
	}
	return this;
}

// 触发浏览器弹窗事件 在窗口大小改变时执行
Selector.prototype.ReSize = function(fn){
	for(var i = 0; i < this.elements.length; i++){
		var element = this.elements[i];
		addEvent(window,'resize',function(){
			fn();
			if(element.offsetLeft > getInner().width - element.offsetWidth){
				element.style.left = getInner().width - element.offsetWidth + 'px';
			}
			if(element.offsetTop > getInner().height - element.offsetHeight){
				element.style.top = getInner().height - element	.offsetHeight + 'px';
			}
		});
	}
	return this;
}

// 元素拖拽事件
Selector.prototype.Drag = function(){
	for(var i = 0; i < this.elements.length; i++){
			addEvent(this.elements[i],'mousedown',function(e){
			if(trim(this.innerHTML).length == 0)e.preventDefault();
			var _this = this;
			var diffX = e.clientX - _this.offsetLeft;
			var diffY = e.clientY - _this.offsetTop;
			if(e.target.className == 'drag'){
				addEvent(document,'mousemove',move);
				addEvent(document,'mouseup',up);
			}else{
				removeEvent(document,'mousemove',move);
				removeEvent(document,'mouseup',up);
			}
			if(typeof _this.setCapture != 'undefined'){
				_this.setCapture();
			}	
			function move(e){
				var left = e.clientX - diffX;
				var top = e.clientY - diffY;
				if(left < 0){
					left = 0;
				}else if(left > getInner().width - _this.offsetWidth){
					left = getInner().width - _this.offsetWidth;
				}
				if(top < 0){
					top = 0;
				}else if(top > getInner().height - _this.offsetHeight){
					top = getInner().height - _this.offsetHeight;
				}
				_this.style.left = left + "px";
				_this.style.top = top + "px";
			}
			function up(){
				removeEvent(document,'mousemove',move);
				removeEvent(document,'mouseup',up);
				if(typeof _this.releaseCapture != 'undefined'){
					_this.releaseCapture();
				}
			}
		})
	}
	return this;
}

// 删除元素左右空格
function trim(str){
	return str.replace(/(^\s*)(\s*$)/g,"");
}

/*
 *  封装JavaScript 元素动画效果
 *  调用键值参数方法 
 *  attr   设置属性 left top opacity width height
 *  start  设置起始值 透明度(透明度起始值需要跟Css相符)
 *  target 设置增加多少
 *  alter  设置元素动作大小 (注意：透明度最大值为100不支持小数)
 *  step   设置元素滑动步数
 *  tiem   设置在多少毫秒执行一次
 *  type   是否开启滑动缓冲效果 0开启 1关闭
 *  speed  设置滑动缓冲速度 
 *  ok:funciton(){
 *      代表动画执行完成后在执行
 *  }; 
 *  item:{
 *      代表可以进行多个属性动画同时加载
 *  }
 *  参数只能有left与top没有right与bottom 
 *  如果right和bottom参数值必须负数以此类推
 */

Selector.prototype.Action = function(obj){
	for(var i = 0; i < this.elements.length; i++){
		var element = this.elements[i];
		var attr = obj['attr'] == 'left' ? 'left' : obj['attr'] == 'top' ? 'top':
				   obj['attr'] == 'width' ? 'width' :obj['attr'] == 'height' ? 'height':
				   obj['attr'] == 'opacity' ? 'opacity' : obj['attr'] != undefined ? obj['attr'] :'left';
		var start = obj['start']!= undefined ? obj['start'] : 
					attr == 'opacity' ? parseFloat(GetStyle(element,attr)) * 100: 
					parseInt(GetStyle(element,attr));
		var tiem = obj['tiem'] != undefined ? obj['tiem'] : 0;
		var step = obj['step'] != undefined ? obj['step'] : 10;
		var target = obj['alter'] + start;
		var item = obj['item'];
		var speed = obj['speed'] != undefined ? obj['speed'] : 6;
		var type = obj['type'] == 0 ? 'constant' : obj['type'] == 1 ? 'buffer' : 'buffer';
		if(start > target)step = -step;
		if(attr == 'opacity'){
			element.style.opacity = parseInt(start) / 100;
			element.style.filter = 'alpha(opacity = '+ parseInt(start) +')';
		}else{
			element.style[attr] = start + 'px';
		}
		if(item == undefined){
			item = {};
			item[attr] = target;
		}
		clearInterval(element.timer);
		element.timer = setInterval(function(){
			for(var i in item){
				attr = i;
				target = item[i]
				if(type == 'buffer'){
					step = attr == 'opacity' ? (target - parseFloat(GetStyle(element,attr)) * 100) / speed :
					(target - parseInt(GetStyle(element,attr))) / speed;
					step = step > 0 ? Math.ceil(step) : Math.floor(step);
				}
				if(attr == 'opacity'){
					if(step == 0){
						setOpacity();
					}else if (step > 0 && Math.abs(parseFloat(GetStyle(element,attr)) * 100 - target) <= step){
						setOpacity();
					}else if(step < 0 && (parseFloat(GetStyle(element,attr)) * 100 - target) <=  Math.abs(step)){
						setOpacity(); 
					}else{
						var temp = parseFloat(GetStyle(element,attr)) * 100;
						element.style.opacity = parseInt(temp + step) / 100;
						element.style.filter = 'alpha(opacity = '+ parseInt(temp + step) +')';
					}
				}else{
					if(step == 0){
						setTarget();
					}else if (step > 0 && Math.abs(parseInt(GetStyle(element,attr)) - target) <= step){
						setTarget();
					}else if(step < 0 && (parseInt(GetStyle(element,attr)) - target) <=  Math.abs(step)){
						setTarget();
					}else{
						element.style[attr] = parseInt(GetStyle(element,attr)) + step +'px';
					}
				}
			}
		},tiem);
		function setTarget(){
			element.style[attr] = target + 'px';
			clearInterval(element.timer);
			if(obj.fn != undefined)obj.ok();
		}
		function setOpacity(){
			element.style.opacity = parseInt(target) / 100;
			element.style.filter = 'alpha(opacity = '+ parseInt(target) +')';
			clearInterval(element.timer);
			if(obj.fn != undefined)obj.ok();
		}
	}
	return this;
}











































