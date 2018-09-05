var service_personnel = ['客服035','客服029','客服038','客服013','客服019','客服036','客服024','客服030','客服027','客服016','客服034'];
var service_personnel_key = Math.floor(Math.random() * 10);
var event = function() {
    var data = [];
    var ret = function(func) {
        if (typeof func === "function") {
            data.push(func);
            func.ret = {
                remove: function() {
                    data.splice(data.indexOf(func), 1);
                },
                isOnly: false,
                only: function() {
                    if (isOnly) this.remove();
                }

            };
            return func.ret;
        }

        for (var i in data) {
            data[i].apply(this, arguments);
        }
    };
    ret.remove = function(event) {　　
        if (event) {
            var i = data.indexOf(event);
            i > -1 && data.splice(i, 1);
        } else {
            data = [];　　　　
        }
    };
    return ret;
};

var cookie = {
    set: function(b, c, d) {
        var e = [],
            f, g, h = $.extend({
                expire: null,
                path: "/",
                domain: null,
                secure: null,
                encode: !0
            }, d);
        h.encode == !0 && (c = escape(c));
        e.push(b + "=" + c);
        h.path != null && e.push("path=" + h.path);
        h.domain != null && e.push("domain=" + h.domain);
        h.secure != null && e.push(h.secure);
        if (h.expire != null) {
            f = new Date;
            g = f.getTime() + h.expire * 36e5;
            f.setTime(g);
            e.push("expires=" + f.toGMTString())
        }
        document.cookie = e.join(";")
    },
    get: function(a) {
        a = a.replace(/([\.\[\]\$])/g, "\\$1");
        var b = new RegExp(a + "=([^;]*)?;", "i"),
            c = document.cookie + ";",
            d = c.match(b);
        return d ? d[1] || "" : ""
    },
    remove: function(a, c) {
        c = c || {};
        c.expire = -10;
        b.set(a, "", c)
    }
};


var getCurrentTime = function () {
    //获取当前时间
    var today = new Date();
    var hour = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();
    hour = hour < 10 ? "0" + hour : hour;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    return hour + ":" + minutes + ":" + seconds;
};

(function(window, socket) {
    window.socket = new socket();
})(window, function() {
    //用户数据
    this.use = {
        // userName: md5(user_ip + window.navigator.userAgent),
        userName: user_ip,
        password: "0",
        serverAddress: "203.78.143.67",
        port: "8080",
        to: "admin",
        type:0
    };

    this.into = function() {

        var use = this.use;
        var self = this;
        //创建websocket实例
        var ws = this._Socket = new WebSocket("ws://" + use.serverAddress + ":" + use.port + "/CloudIMServer/chat?user=" + use.userName + "&pass=" + use.password + '&type=' + use.type);

        if (ws.readyState == 0) {
            $('.sys_status').html('系统正在为您呼叫客服 ，请稍后...').addClass('admin_online').removeClass('admin_outline');
        }
        ws.onopen = function(event) {
            $('.mask-chat').hide();
            //发送用户信息
            self.onOpen(event);
            if (this.readyState == 1) {

                if (!cookie.get('isIN')){
                    ws.send('{"from":"' + use.userName + '","to":"' + use.to + '","msg":"@@#seo#@@"}');
                    // 聊天接入一次，不重复
                    cookie.set('isIN',1);
                };
                
                $('.kefu_id').html(service_personnel[service_personnel_key]);
                $('.sys_status').html(service_personnel[service_personnel_key]+' 为您服务').addClass('admin_online').removeClass('admin_outline');
            }
        };

        ws.onmessage = function(event) {
            isKFOnline(event);
            self.message(event);
            self.onMessage(event);
        };

        ws.onclose = function(event) {
            self.onClose(event);

            cookie.remove('isIN');

            if (this.readyState == 3) {
                $('.sys_status').html('网络异常波动，请刷新重新尝试...').addClass('admin_outline').removeClass('admin_online');
            }
        };

        ws.onerror = function(event) {
            $('.mask-chat').html('网络异常波动，请刷新重新尝试...');
            self.onError(event);
            $('.sys_status').html('网络异常波动，请刷新重新尝试...').addClass('admin_outline').removeClass('admin_online');
        };

    };

    //获取socket
    this.getSocket = function() { return this._Socket; };

    //是否登录成功
    this.isLink = function() { return this.getSocket().readyState == 1; };

    //发送数据
    this.setData = function(param) {

        if (!this.isLink()) return;

        this.getSocket().send(param);

    };

    this.send = function(msg) {

        var from = this.use.userName;
        var to = this.use.to;

        this.setData('{"from":"' + from + '","to":"' + to + '","msg":"' + msg + '"}');
    };

    this.onOpen = new event();

    this.onMessage = new event();

    this.onClose = new event();

    this.onError = new event();

    this.message = function(event) {

        web_chat.getMsg(event);

    }

});


function isKFOnline(data) {
    var json = JSON.parse(data.data);
    if (json.msg && json.msg == '当前客服不在线^_^') {
        $('.mask-chat').html('当前客服不在线').show();
    }
}


function chat() {

    this.browserNotificationOne = null;

    this.init = function() {

        socket.into();
        this.set();
        // 对话处理
        this.autoTextarea($('#editor_area')[0]);
        this.sendMsg();
        // this.emojiSelect();
        this.addFavorite2();
        this.browserNotificationOne = this.browserNotification()();
        //聊天记录对话框内显示
        this.getOneChatRecord();
        this.showAllChatRecord();
    };

    /**
     * [sendMsg 发送消息]
     * @return {[null]} 
     */
    this.sendMsg = function() {
        var _this = this;
        //点击发送消息
        document.querySelector('#send').addEventListener('click', function() {
            var msg = $('#editor_area').val();

            if (!msg) {NY.feedback.info('消息不能为空', 2);return;}

            if (msg.length > 1000 ) {
                NY.feedback.info('字符数字过长，请分条发送', 2);
                return;
            }
            // 添加消息到自己的内容区
            socket.send(msg);
        });

        // enter发送
        NY.event.enterPress($("#editor_area"), function (e) {
            e.preventDefault();
            if (_this.cookie().get("enter_press") === "ctrl") {

                if (!this.value) {NY.feedback.info('消息不能为空', 2);return}
                if (this.value.length > 1000) {NY.feedback.info('字符数字过长，请分条发送', 2);return}
                // enter
                socket.send(this.value);
            }else{
                return false;
            }
        });

        // 绑定Ctrl+Enter事件（仅按回车键并不会触发事件，需要同时按住Ctrl+Enter才能触发事件）
        NY.event.enterPress($("#editor_area"), function (e) {
            e.preventDefault();
            if (_this.cookie().get("enter_press") === "enterctrl") {
                if (!this.value) {NY.feedback.info('消息不能为空', 2);return;};

                if (this.value.length > 1000 ) {
                    NY.feedback.info('字符数字过长，请分条发送', 2);
                    return;
                }
                // ctrl + enter
                socket.send(this.value);
            }else{
                return false;
            }

        }, {isCtrlKey: true});
    };

    this.getMsg = function(data) {

        //分析json,如果没有to则是用户列表，否则为普通消息
        var json = JSON.parse(data.data);
        var currentTimeHTML = '';
        //获取当前时间
        var today = getCurrentTime();

        if (json.msg && json.msg != '当前客服不在线^_^') {
            $('.mask-chat').hide();
            if (json.msg == '@@#seo#@@') {
                var today = getCurrentTime();
                var comeIn = $('<li class="message_info_r"><p class="time admin-span"><span>'+ today +'</span></p><div class="main"><img class="avatar img_head" src="/static/home/default/img/chat/12.png"><div class="text">很高兴为您服务，有什么需要帮助的吗？</div></div></li>');
                if (!$('.message_info_r').length) {
                    comeIn.appendTo('.chat_conatiner');
                    return;
                }
            }
        }

        if ((typeof json.to) !== 'undefined') {
            if (json.from == socket.use.userName && json.to !== socket.use.userName) {

                //消息区清空
                $('#editor_area').val('');

                //甲方聊天气泡
                currentTimeHTML += '<li><p class="time self-span"><span>' + today + '</span></p>\
                <div class="main self">\
                <img class="avatar img_head" src="/static/home/default/img/chat/11.png">\
                <div class="text">' + json.msg + '</div>\
                </div>\
                </li>';

            } else {

                if (json.msg == '当前客服不在线^_^') {
                    $('.sys_status').html('很遗憾当前客服不在线，请使用其它联系方式').addClass('admin_outline').removeClass('admin_online');
                    $('#system_sound')[0].play();
                } else {
                    $('.sys_status').html('您好 '+service_personnel[service_personnel_key]+' 很高兴为您服务...').addClass('admin_online').removeClass('admin_outline');
                    // 铃声提醒
                    $('#ding')[0].play();
                    // 桌面通知
                    this.browserNotificationOne.show('有新消息', {
                        body: json.msg
                    });

                    //乙方聊天气泡
                    currentTimeHTML += '<li><p class="time admin-span"><span>' + today + '</span></p>\
                    <div class="main">\
                    <img class="avatar img_head" src="/static/home/default/img/chat/12.png">\
                    <div class="text">' + json.msg + '</div>\
                    </div>\
                    </li>';

                }
            }
        }

        $(currentTimeHTML).appendTo('.chat_conatiner');
        // 设置内容区的滚动条到底部
        if (currentTimeHTML != "") {
            $('.m-message_c').optiscroll('scrollTo', document.getElementById('chat_conatiner').scrollHeight, 'bottom', 'auto');
        }
    };

    /**
     * [browserNotification 桌面通知]
     * @return {[Function]} [桌面通知请求及显示]
     */
    this.browserNotification = function() {
        var _this = this;

        return function () {
            var b = null,
                c = {},
                d = +(new Date) * Math.random(),
                e = d,
                f = [],
                g = !1,
                h = "Notification" in window || "mozNotification" in window || "webkitNotification" in window;

            var i = {
                checkNotification: function() {
                    if (!h) {
                        return false;
                    }
                    b = window.Notification || window.mozNotification || window.webkitNotification || null;
                    b.permission === "granted" || b.requestPermission();
                    return true;
                },
                checkCookie: function() {
                    var b = _this.cookie().get("cloudNotfication"),
                        c = b ? JSON.parse(b) : null;
                    if (b && c != d)
                        return false;
                    _this.cookie().set("cloudNotfication", JSON.stringify(e), {
                        expire: .02,
                        encode: !1
                    });
                    return true
                },
                bindEvt: function(a) {
                    var b = function() {
                            setTimeout(function() {
                                a.close()
                            }, 3e3)
                        },
                        c = function() {
                            window.focus();
                            a.close()
                        },
                        d = function() {
                            //console.log("notification encounters an error")
                        },
                        e = function() {
                            //console.log("notification is closed")
                        };
                    a.onshow = b
                },
                showAllN: function(c, d) {

                    if (h && !b.permission !== "granted") {
                        var e = {
                            dir: "auto",
                            lang: "zh-CN",
                            body: "您有新消息",
                            icon: "/static/home/default/img/chat/13.png"
                        };
                        var f = new b(c, _this.parseParam()(e, d));
                        i.bindEvt(f);
                        return f
                    } else {
                        //console.log('桌面通知为禁止状态')
                    }
                },
                wakeUp: function() {
                    if (f.length > 0) {
                        var a = f.shift(),
                            c = new b(a[0], a[1]);
                        c.onshow = function() {
                            setTimeout(function() {
                                c.close()
                            }, 3e3)
                        };
                        c.onclose = function() {
                            i.wakeUp()
                        };
                        c.onclick = function() {
                            c.close()
                        }
                    } else
                        g = !1
                },
                pushOneN: function(c, d, e) {
                    if (h && !b.permission !== "granted") {
                        var j = {
                            dir: "auto",
                            lang: "zh-CN",
                            body: "您有新消息",
                            icon: "/static/home/default/img/chat/13.png"
                        };
                        if (!i.checkCookie()) { return null; }
                        f.push([c, _this.parseParam()(j, d), e]);
                        if (!g) {
                            g = !0;
                            i.wakeUp()
                        }
                    }
                },
                init: function() {
                    var a = i.checkNotification();
                    if (a) {
                        c.show = i.showAllN;
                        c.showOne = i.pushOneN
                    } else {
                        c.show = function() {}
                    }
                }
            };
            i.init();
            c.destroy = function() {
                b = null;
                h = null;
                i = null
            };
            return c
        }
    };
    /**
     * [parseParam 合并对象]
     * @param  {[type]} a [被合并对象及合并对象]
     * @return {[Object]}   [合并后的对象]
     */
    this.parseParam = function(a) {
        return function(a, b, c) {
            var d, e = {};
            b = b || {};
            for (d in a) {
                e[d] = a[d];
                b[d] != null && (c ? a.hasOwnProperty(d) && (e[d] = b[d]) : e[d] = b[d])
            }
            return e;
        }
    };
    /**
     * [cookie 存取cookie]
     * @param  {[String]} a [存取键值]
     * @return {[Object]}   [操作方法]
     */
    this.cookie = function(a) {
        var _this = this;
        var b = {
            set: function(b, c, d) {
                var e = [],
                    f,
                    g,
                    h = _this.parseParam()({
                        expire: null,
                        path: "/",
                        domain: null,
                        secure: null,
                        encode: !0
                    }, d);
                h.encode == !0 && (c = escape(c));
                e.push(b + "=" + c);
                h.path != null && e.push("path=" + h.path);
                h.domain != null && e.push("domain=" + h.domain);
                h.secure != null && e.push(h.secure);
                if (h.expire != null) {
                    f = new Date;
                    g = f.getTime() + h.expire * 36e5;
                    f.setTime(g);
                    e.push("expires=" + f.toGMTString())
                }
                document.cookie = e.join(";")
            },
            get: function(a) {
                a = a.replace(/([\.\[\]\$])/g, "\\$1");
                var b = new RegExp("(^| )" + a + "=([^;]*)?;", "i"),
                    c = document.cookie + ";",
                    d = c.match(b);
                return d ? d[2] || "" : ""
            },
            remove: function(a, c) {
                c = c || {};
                c.expire = -10;
                b.set(a, "", c)
            }
        };
        return b
    };
    /**
     * [emojiSelect 表情选中]
     * @return {[null]}
     */
    this.emojiSelect = function() {
        $(document).on('click', '.emoji', function() {
            $('#emoji').css('display', 'block');
        });

        $('body').click(function() {
            $('#emoji').css('display', 'none');
        });

        $('#emoji span').click(function() {

            var emoji = $(this).text();

            var prevcontent = $('#editor_area').val();

            $('#editor_area').val(prevcontent + emoji);
            $('#editor_area').focus();


            $('#emoji').css('display', 'none');
        });
    };

    /**
     * 文本框根据输入内容自适应高度
     * {HTMLElement}   输入框元素
     * {Number}        设置光标与输入框保持的距离(默认0)
     * {Number}        设置最大高度(可选)
     */
    this.autoTextarea = function(elem, extra, maxHeight) {
        extra = extra || 0;
        var isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window,
            isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera'),
            addEvent = function(type, callback) {
                elem.addEventListener ?
                    elem.addEventListener(type, callback, false) :
                    elem.attachEvent('on' + type, callback);
            },
            getStyle = elem.currentStyle ?
            function(name) {
                var val = elem.currentStyle[name];
                if (name === 'height' && val.search(/px/i) !== 1) {
                    var rect = elem.getBoundingClientRect();
                    return rect.bottom - rect.top -
                        parseFloat(getStyle('paddingTop')) -
                        parseFloat(getStyle('paddingBottom')) + 'px';
                }
                return val;
            } : function(name) {
                return getComputedStyle(elem, null)[name];
            },
            minHeight = parseFloat(getStyle('height'));
        elem.style.resize = 'none'; //如果不希望使用者可以自由的伸展textarea的高宽可以设置其他值

        var change = function() {
            var scrollTop, height,
                padding = 0,
                style = elem.style;

            if (elem._length === elem.value.length) return;
            elem._length = elem.value.length;

            if (!isFirefox && !isOpera) {
                padding = parseInt(getStyle('paddingTop')) + parseInt(getStyle('paddingBottom'));
            }
            scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

            elem.style.height = minHeight + 'px';
            if (elem.scrollHeight > minHeight) {
                if (maxHeight && elem.scrollHeight > maxHeight) {
                    height = maxHeight - padding;
                    style.overflowY = 'auto';
                } else {
                    height = elem.scrollHeight - padding;
                    style.overflowY = 'hidden';
                }
                style.height = height + extra + 'px';
                scrollTop += parseInt(style.height) - elem.currHeight;
                // document.body.scrollTop = scrollTop;
                // document.documentElement.scrollTop = scrollTop;
                elem.currHeight = parseInt(style.height);
            }
        };

        addEvent('propertychange', change);
        addEvent('input', change);
        addEvent('focus', change);
        change();
    };
    /**
     * [addFavorite2 添加至收藏]
     */
    this.addFavorite2 = function() {

        $('.collection').click(function() {
            var url = window.location;
            var title = document.title;
            var ua = navigator.userAgent.toLowerCase();

            if (ua.indexOf("360se") > -1) {
                alert("由于360浏览器功能限制，请按 Ctrl+D 手动收藏！");
            } else if (ua.indexOf("msie 8") > -1) {
                window.external.AddToFavoritesBar(url, title); //IE8
            } else if (document.all) {
                try {
                    window.external.addFavorite(url, title);
                } catch (e) {
                    alert('您的浏览器不支持,请按 Ctrl+D 手动收藏!');
                }
            } else if (window.sidebar) {
                window.sidebar.addPanel(title, url, "");
            } else {
                alert('您的浏览器不支持,请按 Ctrl+D 手动收藏!');
            }
        });
    };
    /**
     * [set 设置]
     */
    this.set = function () {
        var _this = this;
        var menu_flag = true;
        var isCtrlEnter = _this.isCtrlEnter;

        // 默认为enter发送
        _this.cookie().set("enter_press", "ctrl", {
            expire: .02,
            encode: !1
        });
        // 设置菜单下拉
        $('.mes_cons_ser').click(function() {
            var _this = $(this);
            var _submenu = $('.submnu');

            if (menu_flag) {
                _submenu.animate({ height: 'show' }, { queue: false, duration: 500, easing: 'easeOutBounce' });
                menu_flag = false;
            } else {
                _submenu.hide();
                menu_flag = true;
            }
        });
        // 发送快捷键设置分 enter & ctrl + enter
        $('#select_enter_msg').change(function () {
            if ($(this).val() == 1) {
                _this.cookie().set("enter_press", "ctrl", {
                    expire: .02,
                    encode: !1
                });
            }else{
                _this.cookie().set("enter_press", "enterctrl", {
                    expire: .02,
                    encode: !1
                });
            }
        });
    };
    
    this.getChatRecord = function (page,callbackFn,errFn) {
        var _this = this;
        var urlChatRecord = 'http://'+ socket.use.serverAddress + ":" + socket.use.port +'/CloudIMServer/servlet/GetbasicServlet';
        $.ajax({
            url:urlChatRecord,
            dataType: "jsonp",
            jsonp:'callback',
            async:false,
            jsonpCallback:"callback",
            data:{
                condition: 'callback',
                customerService:socket.use.to,
                customer:socket.use.userName,
                page:page
            },
            beforeSend:function () {
                $('.m-text').addClass('diswrite');
            },
            success:function (data) {
                $('.m-text').removeClass('diswrite');
                callbackFn(data);
            },
            error:function (data) {
                errFn();
                console.log('聊天记录获取失败！' , data);
            }
        });
    };
    /**
     * [获取对话框内默认显示的聊天记录]
     */
    this.getOneChatRecord = function () {
        var _this = this;
        this.getChatRecord(0,function(data){
            _this.showChatRecordCustomer(data);
        },function () {
            _this.getChatRecord(0,function(data){_this.showChatRecordCustomer(data);});
        });
    };
    /**
     * [显示对话框内默认显示的聊天记录]
     */
    this.showChatRecordCustomer = function (data) {
        var _this = this;
        var cr = data.record;
        var currentTimeHTML = '';

        if (cr) {
            for(var i= cr.length - 1;i>= 0;i--){

                var dTime = _this.formatTimestamp(cr[i].time * 1000);

                if (cr[i].info != '@@#seo#@@') {
                    if (cr[i].type == 1) {

                        //甲方聊天气泡
                        currentTimeHTML += '<li><p class="time self-span"><span>' + dTime + '</span></p><div class="main self"><img class="avatar img_head" src="/static/home/default/img/chat/11.png"><div class="text">' + cr[i].info + '</div></div></li>';

                    }else if (cr[i].type == 0) {

                        //乙方聊天气泡
                        currentTimeHTML += '<li><p class="time admin-span"><span>' + dTime + '</span></p><div class="main"><img class="avatar img_head" src="/static/home/default/img/chat/12.png"><div class="text">' + cr[i].info + '</div></div></li>';
                    }
                }

            }

            currentTimeHTML += '<li class="systemInfo showmore"><span>查看更多聊天记录</span></li>';
            $(currentTimeHTML).appendTo('.chat_conatiner');
            
        }

        if (currentTimeHTML) {
            $('.m-message_c').optiscroll('scrollTo', document.getElementById('chat_conatiner').scrollHeight, 'bottom', 'auto');
        }
    };
    /**
     * [格式化时间]
     */
    this.formatTimestamp = function ( timestamp ) {
        var dateObj = new Date( timestamp );
        var year = dateObj.getFullYear();
        var month = dateObj.getMonth() + 1;
        var theDate = dateObj.getDate();
        var hour = dateObj.getHours();
        var minute = dateObj.getMinutes();
        var second = dateObj.getSeconds();
        return year +"-"+ month +"-" + theDate + " "+ hour +":"+ minute +":"+ second;
    };
    /**
     * [获取所有的聊天记录]
     */
    this.showChatRecordCustomerAll = function (data) {
        var _this = this;
        var crs = data.record;
        $('.chatrecordContainer').html('');
        var currentTimeHTML = '';

        var cr = [];
        for( var i = 0 ;i < crs.length;i++){
            if (crs[i]['info'] != '@@#seo#@@') {cr.push(crs[i]);}
        }
        if (!cr) {
            currentTimeHTML = '<li class="noChatRecord">暂无聊天记录</li>';
        }else{
            for(var i=0;i<cr.length;i++){
                var dTime = _this.formatTimestamp(cr[i].time * 1000);

                if (cr[i].info != '@@#seo#@@') {
                    if (cr[i].type == 1) {
                        currentTimeHTML += '<li><div class="chatrecordUser">【我】<span>'+ dTime +'</span></div><p>' + cr[i].info + '</p></li>';
                    }else if (cr[i].type == 0) {
                        currentTimeHTML += '<li><div class="chatrecordUser">【客服】<span>'+ dTime +'</span></div><p>' + cr[i].info + '</p></li>';
                    }
                }
            }
        }
        $(currentTimeHTML).appendTo('.chatrecordContainer');
    };

    this.showAllChatRecord = function () {
        var _this = this;
        var page = 0;
        var pageNumMax = 0;

        $('.message_alert').click(function () {
            art.dialog({
                title:'聊天记录',
                content:document.getElementById('chatDialog'),
                init:function () {
                    _this.getChatRecord(0,function(data){
                        pageNumMax = data.pagecount;
                        if (pageNumMax == 0) {
                            $('.nexPage').addClass('disabled').removeClass('enable');
                        }
                        _this.showChatRecordCustomerAll(data);
                    });
                }
            });
        });

        $('.chat_conatiner').on('click','.showmore span', function () {
            art.dialog({
                title:'聊天记录',
                content:document.getElementById('chatDialog'),
                init:function () {
                    _this.getChatRecord(0,function(data){
                        pageNumMax = data.pagecount;
                        _this.showChatRecordCustomerAll(data);
                    });
                }
            });
        });

        $('.chatDialog').on('click','.nexPage.enable', function () {
            page++;
            if (page >= pageNumMax) {
                $('.nexPage').addClass('disabled').removeClass('enable');
                $('.prePage').removeClass('disabled').addClass('enable');
                page = pageNumMax;
            }

            _this.getChatRecord(page,function(data){
                _this.showChatRecordCustomerAll(data);
            });
        });

        $('.chatDialog').on('click','.prePage.enable', function () {
            page--;
            if (page <= 0) {
                $('.prePage').addClass('disabled').removeClass('enable');
                $('.nexPage').removeClass('disabled').addClass('enable');
                page = 0;
            }

            _this.getChatRecord(page,function(data){
                _this.showChatRecordCustomerAll(data);
            });
        });

    };

}


var web_chat = new chat();
web_chat.init();