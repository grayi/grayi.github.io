/*
* Author: JIANGXIAO_SEO
* Date  : 2018/1/13 - 12:30
* Description: 
*/

$(function () {


    function registerMain() {
        this.init = function () {
            this.Ver();
        };

        this.Ver = function () {

            var _this = this;

            //协议不选择不能提交；
            $("#checkbox1").change(function () {
                var submitBtn = $("#Submit");
                if ($(this).prop("checked")) {
                    submitBtn.addClass("reg-submit");
                } else {
                    submitBtn.removeClass("reg-submit");
                }
            });

            $.formValidator.initConfig({
                formID: "register", theme: "ArrowSolidBox", debug: false, submitOnce: true, onSuccess: function (data) {
                    _this.postData();
                },
                submitAfterAjaxPrompt: '有数据正在异步验证，请稍等...'
            });

            // 邮箱验证 -- 用户名
            $("#eail").formValidator({
                onShow: "用户名可用于登录、密码找回",
                onFocus: "用户名可用于登录、激活账号、密码找回",
                onCorrect: "填写正确"
            }).regexValidator({
                regExp: "^([a-zA-Z0-9_\\.\\-])+\\@(([a-zA-Z0-9\\-])+\\.)+([a-zA-Z0-9]{2,4})+$",
                onError: "你输入的邮箱不正确"
            });

            //密码验证 -- 密码
            $("#pass").formValidator({
                onShow: "密码由8-31个英文字母及数字组成",
                onFocus: "密码由8-31个英文字母及数字组成",
                onCorrect: "密码格式填写正确"
            }).inputValidator({min: 8, max: 31, onError: "密码格式填写错误"}).regexValidator({
                regExp: "[A-Za-z].*[0-9]|[0-9].*[A-Za-z]",
                onError: "你输入的密码格式不正确"
            });
            // 密码确认
            $("#password").formValidator({onShow: "请再次输入密码", onFocus: "请再次输入密码", onCorrect: "填写正确"}).inputValidator({
                min: 1,
                onError: "请再次输入密码"
            }).compareValidator({desID: "pass", operateor: "=", onError: "两次输入的密码不一致"});

            // 验证码验证
            // 略

        };

        //发送数据
        this.postData = function () {
            var isTF = true;
            var username = $("#eail").val();
            var passwordNew = $("#pass").val();
            var verify = $('#vertify').val();

            var ck = $("#checkbox1").is(':checked');

            if (!ck) {
                NY.feedback.warn('请先阅读协议',2);
                isTF = false;
            }
            if (!verify) {
                NY.feedback.warn('验证码不能为空',2);
                isTF = false;
            }

            if (isTF) {
                $("#Submit").html('正在注册...');
                xjax(xHRouter.register._,{
                    data:{
                        username:username,
                        password:passwordNew,
                        verify:verify
                    },
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
                            $("#Submit").html('注册');
                            NY.error(responseDataInfo,2);
                        }
                    }
                })
            }
        };
    }

    var register = new registerMain();

    register.init();
});