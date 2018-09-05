(function(window, xjax) {
    window.xjax = xjax;
})(window, function(url, options) {
// 基于jquery的ajax Promise模式封装，以便进行链式调用
    if (typeof url === "object") {
        options = url;
        url = undefined;
    }

    options = options || {};
    var defer = $.Deferred();

    // 默认ajax配置
    var settings = $.extend({
        url: url,
        type: "post",
        data:null,
        async: true, //true异步请求，false同步请求
        dataType: "json",
        beforeSend: function() {},
        success: function(callback) {
            var jsonCallback = JSON.parse(callback);
            // 缓存响应数据
            var responseDataInfo = jsonCallback.info;
            var responseDataUrl = jsonCallback.url;

            if (jsonCallback.status === 1) {
                NY.success(responseDataInfo,2,function () {
                    if (responseDataUrl) {window.location.href = responseDataUrl;}
                });
            }else{
               NY.error(responseDataInfo,2);
            }
            defer.resolve(jsonCallback);
        },
        error: function(err) {
             // 缓存响应数据
            NY.showBusy();
            defer.reject(err);
        },
        complete: function(jqXHR, textStatus) {
            NY.hideWaiting();
        }
        
    }, options);

    $.ajax(settings);

    return defer.promise();
});
