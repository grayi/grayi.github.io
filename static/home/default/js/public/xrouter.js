// ajax 请求地址

(function(window, router) {
    window.xHRouter = new router();
})(window, function() {
	// 定义HOME一级/根路径
	var routers = {};

	// 定义HOME二级根路径
	routers = {
		"login":{
			"_"                 :"do/login"
		},
        "register":{
            "_"                 :"do/reg"
        },
        adminLogin:{
        	"_"                 :"do/adminlogin"
        }
	}

	return routers;
});
