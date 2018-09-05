/*!
 * JavaScript Home
 * Date: 2018_1_20
 * Author: Guan_Ning  
 * Copyright: Personal
 * Version: 1.2.2
 * E-mail: GuanNing@yeah.net
 */

function addLoadEvent(parameter) {
    Execution_Function = window.onload;
    if( typeof window.onload != 'function' ){
        window.onload = parameter;
    }else{
        window.onload = function(){
            Execution_Function();
            parameter();
        }
    }
}

function GetByClass(parent, cls){
	var res = [];
	var reg = new RegExp('\\b' + cls + '\\b', 'i');
	var ele = parent.getElementsByTagName('*');
	for(var i = 0; i < ele.length; i++){
	    if(reg.test(ele[i].className)){
		    res.push(ele[i]);
	    }
	}
	return res;
}

var iBase = {
	SetOpacity: function(ev, v){
		ev.filters ? ev.style.filter = 'alpha(opacity=' + v + ')' : ev.style.opacity = v / 100;
	}
}

function fadeIn(elem, speed, opacity){
	speed = speed || 20;
	opacity = opacity || 100;
	elem.style.display = 'block';
	iBase.SetOpacity(elem, 0);
	var val = 0;
	(function(){
		iBase.SetOpacity(elem, val);
		val += 5;
		if (val <= opacity) {
			setTimeout(arguments.callee, speed)
		}
	})();
}

function fadeOut(elem, speed, opacity){
	speed = speed || 20;
	opacity = opacity || 0;
	var val = 100;
	(function(){
		iBase.SetOpacity(elem, val);
		val -= 5;
		if (val >= opacity) {
			setTimeout(arguments.callee, speed);
		}else if (val < 0) {
			elem.style.display = 'none';
		}
	})();
}

function GetMapEvent(){	
	var Array = ['加拿大','美国','南美','英国','俄罗斯','香港','新加坡','澳大利亚','菲律宾','日本','韩国','南非'];
	var Obj = document.getElementById('map');
	Html = '';
	for(var i = 0; i < Array.length; i++){
		var Div = document.createElement('div');
		Div.className = 'Spot Coordinate' + i;
		Obj.appendChild(Div);

		var Halo = document.createElement('div');
		Halo.className = 'Halo gn' + i;
		Div.appendChild(Halo);

		var Chide = document.createElement('span');
		Halo.appendChild(Chide);
		Chide.innerHTML = Array[i];

		var Prompt = document.createElement('div');
		Prompt.className = 'Mapt Prompt' + i;
		Div.appendChild(Prompt);
		i + 1;
		var c = document.createElement('span');
		c.className = 'titles';
		Prompt.appendChild(c)
		var b = document.createElement('p');
		b.className = 'lists';
		Prompt.appendChild(b)
	}
	var Jingwei = [
		[['渥太华 ( 待开通 )'],['东经:75.77 - 北纬:43.45']],
		[['华盛顿 ( 已开通 )'],['西经:77.02 - 北纬:38.54']],
		[['南美洲 ( 待开通 )'],['西经:81.35']],
		[['伦敦 ( 已开通 )'],['北纬:51.5 - 西经:0.1']],
		[['莫斯科 ( 已开通 )'],['北纬:55.56 - 东经:37.38']],
		[['香港 ( 已开通 )'],['北纬:22.37 - 东经:113.52']],
		[['新加坡 ( 待开通 )'],['东经:103.38 - 北纬:1.09']],
		[['堪培拉 ( 待开通 )'],['南纬:35.17 - 东经:149.07']],
		[['马尼拉 ( 待开通 )'],['北纬:14.34 - 东经:120.58']],
		[['东京 ( 已开通 )'],['北纬:35.68 - 东经:139.69']],
		[['首尔 ( 待开通 )'],['北纬:37.33 - 东经:126.58']],
		[['南非 ( 待开通 )'],['北纬:37.33 - 东经:126.58']],
	];
	var arr = [];
	for(var i = 0; i < Jingwei.length; i++){
		arr.push(Jingwei[i][0][0]);
	}
	var d = document.querySelectorAll(".Mapt span");
	var p = document.querySelectorAll(".Mapt p");
	Jingwei.forEach(function(v, i){
		d[i].innerHTML = v[0];
		p[i].innerHTML = v[1];
	});
	$(".Spot").mouseover(function(){
		$(this).find('.Mapt').show();
	});
	$(".Spot").mouseleave(function(){
		$(this).find('.Mapt').hide();
	});
}addLoadEvent(GetMapEvent);

$(function(){
	$(".static *").fadeIn();
	var timeout = setTimeout(function(){
		$(".static_1 *").fadeIn();
	}, 200);
	var timeout = setTimeout(function(){
		$(".static_2 *").fadeIn();
	}, 400);
	var timeout = setTimeout(function(){
		$(".static_3 *").fadeIn();
	}, 600);

	var Banner = function(){
		Banner_list = $("#focus-banner-list li"),
		Banner_Tab = $("#focus-bubble"),
		Banner_Button = $("#prev-img"),		
		bannerLength = Banner_list.length,
		_index = 0,
		_timer = "";
		for(var i = 0; i < bannerLength; i++){
			Banner_list.eq(i).css("zIndex",bannerLength-i);
			Banner_Tab.append('<li><a>'+i+'</a><span></span></li>');
		}
		Banner_Tab.find("li").eq(0).addClass("current");
		var bubbleLength = Banner_Tab.find("li").length;
		Banner_Tab.on("click","li",function(){
			$(this).addClass("current").siblings().removeClass("current");
			_index=$(this).index();
			changeImg(_index);
		});
		Banner_Button.on("click",function(){
			_index++
			if(_index>bannerLength-1){
				_index = 0;
			}
			changeImg(_index);
		});
		function changeImg(_index){
			Banner_list.eq(_index).fadeIn(500);
			Banner_list.eq(_index).siblings().hide();
			Banner_Tab.find("li").removeClass("current");
			Banner_Tab.find("li").eq(_index).addClass("current");
			clearInterval(_timer);
			_timer = setInterval(function(){
				Banner_Button.click()
			},5000);
		}
		_timer = setInterval(function(){
			Banner_Button.click();
		},5000);
	}();
	$('.ly_solution_list li').hover(function(){
		$(this).find('.ly_solution_list_ico').stop().animate({
			'top':'19px',
			'right':'26px',
			'z-index':'0'
		})
		$(this).find('p').stop().animate({
			'top':'8px',
			'left':'20px',
			'z-index':'1'
		})
		$(this).find('p span').stop().fadeIn(1000);
		$(this).find('.ly_solution_list_ico').find('div').stop().fadeOut(900);
		$(this).find('.ly_solution_list_ico').find('span').stop().fadeOut(900);
	},function(){
		$(this).find('.ly_solution_list_ico').stop().animate({
			'top':'8px',
			'right':'56px',
			'z-index':'1'
		})
		$(this).find('p').stop().animate({
			'top':'18px',
			'left':'43px',
			'z-index':'0'	
		})
		$(this).find('p span').stop().fadeOut(500);
		$(this).find('.ly_solution_list_ico').find('div').stop().fadeIn(500);
		$(this).find('.ly_solution_list_ico').find('span').stop().fadeIn(500);
	})
})

function ClickingSwitch(){
	var Div = document.getElementById('EventTab');
	var li = Div.getElementsByTagName('li');
	Point('.ly_defense ul li').Click(function(){
		var Gid = GetByClass(document, 'Display');
		for(var i = 0; i < li.length; i++){
			li[i].index = i;
		}
		if(this.className == 'ly_defense_active' || this.className == ' ly_defense_active'){
			return false;
		}else{
			Point(this).EventClass('ly_defense_active');
			$(this).siblings().removeClass("ly_defense_active");
			if(this.index == 0){
				fadeIn(Gid[0],10);
				Point(Gid[1]).Disappear();
				Point(Gid[2]).Disappear();
				Point(Gid[3]).Disappear();
				Point(Gid[4]).Disappear();	
			}else if(this.index == 1){
				fadeIn(Gid[1],10);
				Point(Gid[0]).Disappear();
				Point(Gid[2]).Disappear();
				Point(Gid[3]).Disappear();
				Point(Gid[4]).Disappear();	
			}else if(this.index == 2){
				fadeIn(Gid[2],10);
				Point(Gid[0]).Disappear();
				Point(Gid[1]).Disappear();
				Point(Gid[3]).Disappear();
				Point(Gid[4]).Disappear();
			}else if(this.index == 3){
				fadeIn(Gid[3],10);
				Point(Gid[0]).Disappear();
				Point(Gid[1]).Disappear();
				Point(Gid[2]).Disappear();
				Point(Gid[4]).Disappear();
			}else if(this.index == 4){
				fadeIn(Gid[4],10);
				Point(Gid[0]).Disappear();
				Point(Gid[1]).Disappear();
				Point(Gid[2]).Disappear();
				Point(Gid[3]).Disappear();
			}else{
				return false;
			}
		}
	});
}addLoadEvent(ClickingSwitch);


























