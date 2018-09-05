/*
* Author: JIANGXIAO_SEO
* Date  : 2018/1/13 - 11:37
* Description: 
*/

$(function () {

    var usernameSaveCheckBox = $(".styled");
    
    function loginMain() {
        this.init = function () {
            this.usernameSave();
            this.login();
            this.passEye();
        };
        //发送数据
        this.postData = function () {
            var username = $('#EailS').val();
            var password = $('#ly_password').val();

            //用户名cookie保存
            if (usernameSaveCheckBox.prop("checked")) {
                if (username) {
                    $.cookie("usernameSave", username, {expires: 30, path: '/'});
                }
            } else {
                $.removeCookie("usernameSave", {path: '/'});
            }

            xjax(xHRouter.login._,{
                data:{
                    username:username,
                    password:password
                }
            })
        };
        //登录
        this.login = function () {

            var _this = this;
            //点击登录
            var submit = $('#butt');
            submit.click(function () {
                _this.postData();
            });

            //回车登录
            //绑定普通回车事件
            NY.event.enterPress($(document), function (e) {
                _this.postData();
            });

        };
        //密码可视化切换
        this.passEye = function () {
            var btn = document.getElementById("ly_showpassword");
            var pass = document.getElementById("ly_password");
            btn.onmousedown = function() {
                pass.type = "text"
            };
            btn.onmouseup = btn.onmouseout = function() {
                pass.type = "password"
            }
        };
        // 初始化用户名
        this.usernameSave = function () {
            var usernameCookie = $.cookie("usernameSave");
            //根据cookie初始化用户名
            if (usernameCookie && (usernameCookie !== "0")) {
                usernameSaveCheckBox.prop("checked", true).change();
                $('#EailS').val(usernameCookie);
                $("#ly_password").trigger("focus");
            } else {
                usernameSaveCheckBox.prop("checked", false).change();
            }
        };
    }


    var login = new loginMain();
    login.init();
});