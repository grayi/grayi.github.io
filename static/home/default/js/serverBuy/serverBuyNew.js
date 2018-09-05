// 节流函数
var delay = (function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();
$(function(argument) {
    // 原始数据

    // 数据初始化处理
    var buyData0 = xyData1;

    //创建实例
    new Vue({
        el: "#buyApp",
        data: {
            serverType: ['香港加速'],
            serverTypeCur: 0, //服务器类型当前选择版本
            isTabDisable: true, // 是否允许tab 版本切换
            buyData: buyData0, //当前版本所需数据
            loading: true, //加载动画
            cpuCur: 0, //当前cpu序号
            memoryCur: 0, //当前内存序号
            curSaleMonth: 0,
            diskVal: buyData0.diskMinMaxSize[0], //硬盘的值
            diskArrNew: [],
            diskNum: 3,
            diskNewValue: 0,
            isAddDiskChange:false,
            bandwidthVal: buyData0.bandWidthMinMaxSize[0], //带宽的值
            curSystem: null, //系统
            curSystemVersion: null, //系统版本
            uname: '', //用户名
            password: '', //密码
            systemID:null,
            isShowSystem: false, //系统类别选择下拉框显示控制
            isShowSystemSelect: false, //系统类别选中样式
            selectSystemVal: ["请选择系统类别", ""], //选中的class名存放区
            isShowVersion: false, //系统版本选择下拉框显示控制
            isShowVersionSelect: false, //系统版本选中样式
            selectVersionVal: ["请选择系统版本", ""],
            versionData: [], //版本数据临时存放区
            totalMoney: 0 //总价
        },
        created: function() {
            var _this = this;
            //数据处理完成去掉loading动画
            if (this.buyData) {
                this.loading = false;
            }
        },
        mounted: function() {
            var _this = this;

            /*
             * 获取url参数
             */
            var urlData = _this.getRequest(); //获取query参数对象
            //线路类型是否允许切换
            this.isTabDisable = !urlData.hasOwnProperty('type');
            //线路类型
            var serverTypeCur = urlData.hasOwnProperty('type') ? urlData['type'] : 0;
            _this.serverTypeCur = serverTypeCur == 0 ? 0 : 1;

            //初始化数据
            _this.dataInit();

            var cpu = urlData.hasOwnProperty('cpu') ? urlData['cpu'] : "",
                memory = urlData.hasOwnProperty('memory') ? urlData['memory'] : "",
                disk = urlData.hasOwnProperty('disk') ? urlData['disk'] : "",
                bandwidth = urlData.hasOwnProperty('bandwidth') ? urlData['bandwidth'] : "",
                time = urlData.hasOwnProperty('time') ? urlData['time'] : "";

            var in_cpu = _this.indexof(_this.buyData['cpu'], cpu);
            var in_mon = _this.deepindexof(_this.buyData['saleMonth'], time);

            //配置
            _this.cpuCur = in_cpu == -1 ? 0 : in_cpu;

            var in_memory = _this.indexof(_this.buyData['memory'][this.cpuCur], memory);

            _this.memoryCur = in_memory == -1 ? 0 : in_memory;
            _this.curSaleMonth = in_mon == -1 ? 0 : in_mon;

            _this.diskVal = disk == '' ? _this.buyData.diskMinMaxSize[0] : disk > _this.buyData.diskMinMaxSize[1] || disk < _this.buyData.diskMinMaxSize[0] ? _this.buyData.diskMinMaxSize[0] : disk;
            _this.bandwidthVal = bandwidth == '' ? _this.buyData.bandWidthMinMaxSize[0] : bandwidth > _this.buyData.bandWidthMinMaxSize[1] || bandwidth < _this.buyData.bandWidthMinMaxSize[0] ? _this.buyData.bandWidthMinMaxSize[0] : bandwidth;

            this.setValue(".slider_disk_l", this.diskVal);
            this.setValue(".slider_bandwidth_l", this.bandwidthVal);
            // this.rewrite();

        },
        computed: {
            // 根据选中cpu匹配memory
            memorySelect: function() {
                return this.buyData['memory'][this.cpuCur];
            },
            // 选中的memory值
            memoryValue: function() {
                return this.buyData['memory'][this.cpuCur][this.memoryCur];
            },
            // 选中的cpu值
            cpuValue: function() {
                return this.buyData['cpu'][this.cpuCur];
            },
            // 带宽免费40G
            actdis: function() {
                var _this = this;
                var newDiskValueTotal = 0;

                if(this.diskArrNew.length) {
                    _this.diskArrNew.forEach(function(val, index) {
                        newDiskValueTotal += parseInt(_this.diskArrNew[index]['diskValue']);
                    });
                }else{
                    newDiskValueTotal = 0;
                }
                return parseInt(this.diskVal) + newDiskValueTotal + 40;
            },
            //剩余硬盘个数
            disNumLeft: function() {
                return this.diskNum - this.diskArrNew.length;
            },
            diskArrData:function () {
                var _this = this;
                var arr = '';
                if (this.diskArrNew.length) {
                    _this.diskArrNew.forEach(function(val, index) {
                        arr += val.diskValue + ',';
                    });
                }else{
                    arr = '';
                }
                arr += _this.diskVal;
                return arr;

                // var arr = [];
                // if (this.diskArrNew.length) {
                //     _this.diskArrNew.forEach(function(val, index) {
                //         arr.push(val.diskValue);
                //     });
                // }else{
                //     arr = [];
                // }

                // arr.push(_this.diskVal);
                // return arr;
            }
        },
        methods: {
            // 数据切换
            dataInit: function() {
                // 初始化数据
                this.cpuCur = 0;
                this.memoryCur = 0;
                this.curSaleMonth = 0;

                // 新添硬盘初始化
                 this.diskArrNew = [];
                 this.diskNewValue = 0;
                 this.isAddDiskChange = false;

                // 系统初始化
                this.curSystem = null; //系统
                this.curSystemVersion = null; //系统版本
                this.uname = ''; //用户名
                this.password = ''; //密码
                this.systemID = null;
                this.isShowSystem = false; //系统类别选择下拉框显示控制
                this.isShowSystemSelect = false; //系统类别选中样式
                this.selectSystemVal = ["请选择系统类别", ""]; //选中的class名存放区
                this.isShowVersion = false; //系统版本选择下拉框显示控制
                this.isShowVersionSelect = false; //系统版本选中样式
                this.selectVersionVal = ["请选择系统版本", ""];

                // 切换数据
                // switch (this.serverTypeCur) {
                //     case 0:
                //         this.buyData = this.buyData0;
                //         this.initSlider();
                //         this.diskVal = this.buyData0.diskMinMaxSize[0];
                //         this.bandwidthVal = this.buyData0.bandWidthMinMaxSize[0];
                //         break;
                //     case 1:
                //         this.buyData = this.buyData1;
                //         this.initSlider();
                //         this.diskVal = this.buyData1.diskMinMaxSize[0];
                //         this.bandwidthVal = this.buyData1.bandWidthMinMaxSize[0];
                //         break;
                //     default:
                //         break;
                // }

                this.initSlider();
                this.diskVal = this.buyData.diskMinMaxSize[0];
                this.bandwidthVal = this.buyData.bandWidthMinMaxSize[0];
            },
            // 线路类型切换
            serverTypeToggle: function(value, index) {
                if (this.isTabDisable) {
                    this.serverTypeCur = index;
                    this.dataInit();

                    this.setValue(".slider_disk_l", this.diskVal);
                    this.setValue(".slider_bandwidth_l", this.bandwidthVal);
                    this.rewrite();

                } else {
                    return false;
                }
            },
            // cpu切换
            cpuToggle: function(value, index) {
                this.cpuCur = index;
                this.memoryCur = 0;
                this.rewrite();
            },
            // memory切换
            memoryToggle: function(value, index) {
                this.memoryCur = index;
                this.rewrite();
            },
            //time切换
            saleMonthToggle: function(v, i) {
                this.curSaleMonth = i;
                this.rewrite();
            },
            //系统下拉框
            systemToggle: function() {
                this.isShowSystem = !this.isShowSystem;
            },
            //系统选择
            selectSystem: function(i, v) {
                var _this = this;
                this.selectSystemVal.splice(0, 1, v.name);
                this.selectSystemVal.splice(1, 1, v.code);
                this.curSystem = v.name;

                this.isShowSystemSelect = true;

                // 清空版本信息
                this.versionData = [];
                this.selectVersionVal = ["请选择系统版本", ""];
                this.curSystemVersion = null;
                this.isShowVersionSelect = false;
                $.each(this.buyData.system, function(c, ii) {
                    if (ii.name == v.name) { _this.versionData = ii.sis; return false; }
                })
            },
            //版本下拉框
            versionToggle: function() {
                this.isShowVersion = !this.isShowVersion;
            },
            //版本选择
            selectVersion: function(v) {
                this.selectVersionVal.splice(0, 1, v.name);
                this.curSystemVersion = v.name;
                this.isShowVersionSelect = true;

                // 用户名登陆
                this.uname = v.loginName;
                this.systemID = v.systemsID;
            },
            //加
            _increase: function(type) {
                var _this = this;
                // 硬盘
                if (type == 'disk') {
                    this.diskVal = parseInt(_this.diskVal) + parseInt(_this.buyData.diskMinMaxSize[2]);
                    if (this.diskVal > _this.buyData.diskMinMaxSize[1]) {
                        this.diskVal = _this.buyData.diskMinMaxSize[1];
                        return false;
                    }
                    _this.setValue(".slider_disk_l", this.diskVal);
                    this.rewrite();
                }

                // 带宽
                if (type == 'bandwidth') {
                    this.bandwidthVal = parseInt(_this.bandwidthVal) + parseInt(_this.buyData.bandWidthMinMaxSize[2]);
                    if (this.bandwidthVal > _this.buyData.bandWidthMinMaxSize[1]) {
                        this.bandwidthVal = _this.buyData.bandWidthMinMaxSize[1];
                        return false;
                    }
                    _this.setValue(".slider_bandwidth_l", this.bandwidthVal);
                    this.rewrite();
                }
            },
            //减
            _decrease: function(type) {
                var _this = this;
                // 硬盘
                if (type == 'disk') {
                    this.diskVal = parseInt(_this.diskVal) - parseInt(_this.buyData.diskMinMaxSize[2]);
                    if (this.diskVal < _this.buyData.diskMinMaxSize[0]) {
                        this.diskVal = _this.buyData.diskMinMaxSize[0];
                        return false;
                    }
                    _this.setValue(".slider_disk_l", this.diskVal);
                    this.rewrite();
                }

                // 带宽
                if (type == 'bandwidth') {
                    this.bandwidthVal = parseInt(_this.bandwidthVal) - parseInt(_this.buyData.bandWidthMinMaxSize[2]);
                    if (this.bandwidthVal < _this.buyData.bandWidthMinMaxSize[0]) {
                        this.bandwidthVal = _this.buyData.bandWidthMinMaxSize[0];
                        return false;
                    }
                    _this.setValue(".slider_bandwidth_l", this.bandwidthVal);
                    this.rewrite();
                }
            },
            //设置滑块value
            setValue: function(el, val) {
                $(el).slider("value", val);
            },
            // 初始化 slider
            initSlider: function() {
                var _this = this;
                // 硬盘配置
                var diskOption = {
                    el: ".slider_disk_l",
                    min: 0,
                    max: _this.buyData.diskMinMaxSize[1],
                    step: _this.buyData.diskMinMaxSize[2],
                    val: 0,
                    pips: _this.buyData.diskMinMaxSize[1] / 5 / _this.buyData.diskMinMaxSize[2],
                    suffix: "G"
                };
                // 带宽配置
                var bandWidthOption = {
                    el: ".slider_bandwidth_l",
                    min: 0,
                    max: _this.buyData.bandWidthMinMaxSize[1],
                    step: _this.buyData.bandWidthMinMaxSize[2],
                    val: 0,
                    pips: _this.buyData.bandWidthMinMaxSize[1] / 5 / _this.buyData.bandWidthMinMaxSize[2],
                    suffix: "M"
                };
                // 硬盘
                this.sliderUI(diskOption, function(ui) {
                    var DiskMin = _this.buyData.diskMinMaxSize[0];
                    if (ui.value < DiskMin) {
                        _this.diskVal = DiskMin;
                    } else {
                        _this.diskVal = ui.value;
                        _this.rewrite();
                    }
                });

                $('.slider_disk_l .ui-slider-pip-first .ui-slider-label').html('10G');
                // 带宽
                this.sliderUI(bandWidthOption, function(ui) {
                    var bandwidthMin = _this.buyData.bandWidthMinMaxSize[0];
                    if (ui.value < bandwidthMin) {
                        _this.bandwidthVal = bandwidthMin;
                    } else {
                        _this.bandwidthVal = ui.value;
                        _this.rewrite();
                    }
                });

                $('.slider_bandwidth_l .ui-slider-pip-first .ui-slider-label').html('1M');
            },
            //获取价格
            rewrite: function() {
                var _this = this;

                // var flag = _this.serverTypeCur == 0 ? "Defence" : "Speed";
                var flag = "Speed";

                var init_data = {
                    flag:flag,
                    diskNewValue: _this.diskNewValue,
                    line: "香港",
                    cpu: _this.cpuValue,
                    memory: _this.memoryValue,
                    disk: _this.diskArrData,
                    bandwidth: _this.bandwidthVal,
                    days: _this.buyData.saleMonth[_this.curSaleMonth]['saleMonth']
                };
                this.getPrice("/serverGetPrice", init_data, function(data) { //初始化获取价格
                    if (JSON.parse(data).status == 1) {
                        _this.totalMoney = JSON.parse(data).data;
                    }else{
                        _this.totalMoney = '价格加载失败';
                    }
                    
                });
            },
            //sliderUI组
            sliderUI: function(option, slideCallback) {
                var _this = this;
                $(option.el)
                    .slider({
                        range: "min",
                        min: parseInt(option.min),
                        max: parseInt(option.max),
                        step: parseInt(option.step),
                        value: option.val,
                        change: function(event, ui) {},
                        stop: function(event, ui) {
                            slideCallback(ui);
                        }
                    })
                    .slider("pips", {
                        rest: "label",
                        step: option.pips,
                        suffix: option.suffix
                    })
            },
            //简单数组查找索引
            indexof: function(arr, el) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] == el) { return i; }
                }
                return -1;
            },
            //二位数组查找索引
            deepindexof: function(arr, el) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i]['saleMonth'] == el) { return i; }
                }
                return -1;
            },
            //异步请求
            getPrice: function(url, buy_data, callback) {
                var _this = this;
                var resultFunc = null;
                $.ajax({
                    type: 'get',
                    url: url,
                    beforeSend: function() {
                        _this.totalMoney = "正在计算..."
                    },
                    data: buy_data,
                    success: success
                });

                function success(data) {
                    resultFunc && resultFunc(-1);
                    callback && callback(data);
                }
                return function(cb) { resultFunc = cb; };
            },
            //获取url参数
            getRequest: function() {
                var url = location.search; //获取url中"?"符后的字串
                var theRequest = {};
                if (url.indexOf("?") != -1) {
                    var str = url.substr(1);
                    var strs = str.split("&");
                    for (var i = 0; i < strs.length; i++) {
                        theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
                    }
                }
                return theRequest; // 获取url中"?"符后的字串，并转成对象
            },
            buy: function() {
                var _this = this;
                var isCheck = true;

                if (_this.curSystem == null || _this.curSystemVersion == null) {
                    NY.feedback.info('请选择系统类别和系统版本', 2);
                    isCheck = false;
                    return false;
                }
                if (_this.password == '') {
                    NY.feedback.info('密码不能为空', 2);
                    isCheck = false;
                    return false;
                }

                // var flag = _this.serverTypeCur == 0 ? "Defence" : "Speed";
                var flag = "Speed";

                var buy_data = {
                    flag:flag,
                    line: "香港",
                    cpu: _this.cpuValue,
                    memory: _this.memoryValue,
                    disk: _this.diskArrData,
                    bandwidth: _this.bandwidthVal,
                    day: _this.buyData.saleMonth[_this.curSaleMonth]['saleMonth'],
                    uname: _this.uname,
                    passWord: _this.password,
                    systems: _this.curSystem + "," + _this.curSystemVersion,
                    systemsID:_this.systemID
                };

                xjax('/serverCreatOrder',{
                    data:buy_data,
                    beforeSend: function() {
                        NY.waiting('加载中，请稍后...', true);
                    }
                }).then(function (data) {
                    if (data.info == '请登录') {
                        setTimeout(function() {window.location.href="/login"},2000)
                    }
                    NY.hideWaiting();
                });
            },
            addDiskNew: function() {
                if (this.diskArrNew.length < this.diskNum) {
                    this.diskArrNew.push({
                        diskValue: this.buyData.diskMinMaxSize[0]
                    });
                } else {
                    return false;
                }
            },
            delDisk: function(item, i) {
                if (this.diskArrNew.length) {
                    this.diskArrNew.splice(i, 1);
                }
            },
            plusDisk: function(item, i) {
                var _this = this;

                item.diskValue = parseInt(item.diskValue) + parseInt(_this.buyData.diskMinMaxSize[2]);
                if (item.diskValue > _this.buyData.diskMinMaxSize[1]) {
                    item.diskValue = _this.buyData.diskMinMaxSize[1];
                    return false;
                }

            },
            subtDisk: function(item, i) {
                var _this = this;
                item.diskValue = parseInt(item.diskValue) - parseInt(_this.buyData.diskMinMaxSize[2]);
                if (item.diskValue < _this.buyData.diskMinMaxSize[0]) {
                    item.diskValue = _this.buyData.diskMinMaxSize[0];
                    return false;
                }
            },
            // 输入框输入限制（只能输入数字键以及基本操作）
            InputNumberLimit:function (e) {
                var keyCode = e.keyCode;
                // 不允许输入shift组合键 或 ctrl组合键
                if (e.shiftKey || e.ctrlKey) {
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }
                // 不允许输入小数点
                var isPointCode = ((keyCode == 110) || (keyCode == 190));
                // 条件：是否数字键
                var isNumberCode = (((keyCode >= 48) && (keyCode <= 57)) || ((keyCode >= 96) && (keyCode <= 105)));
                // 条件：是否输入 backspace or ↑ or → or ↓ or ← or end or home or delete
                var isOperateCode = ((keyCode == 8) || (keyCode == 37) || (keyCode == 38) || (keyCode == 39) || (keyCode == 40) || (keyCode == 35) || (keyCode == 36) || (keyCode == 46));

                // 不允许白名单以外的输入
                if (isPointCode && !isNumberCode && !isOperateCode) {
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }
            },
            isLegitimateDelay: function (type) {
                var _this = this;
                delay(function () {
                    _this.isLegitimate(type);
                }, 300);
            },
            isLegitimate:function (type) {

                var minDiskV = this.buyData.diskMinMaxSize[0];
                var maxDiskV = this.buyData.diskMinMaxSize[1];

                var minBandV = this.buyData.bandWidthMinMaxSize[0];
                var maxBandV = this.buyData.bandWidthMinMaxSize[1];

                if (type == 'disk') {
                    this.diskVal = this.diskVal == '' ? minDiskV : this.diskVal;
                    var diskValue = parseInt(this.diskVal);
                    //判断是否大于最大值
                    if (diskValue >= maxDiskV) {this.diskVal = maxDiskV;}
                    //判断是否小于最小值
                    if (diskValue <= minDiskV) {this.diskVal = minDiskV;}

                    this.setValue(".slider_disk_l", this.diskVal);
                    this.rewrite();
                }

                if (type == 'bandwidth') {
                    this.bandwidthVal = this.bandwidthVal == '' ? minBandV : this.bandwidthVal;
                    var bandVal = parseInt(this.bandwidthVal);
                    //判断是否大于最大值
                    if (bandVal >= maxBandV) {this.bandwidthVal = maxBandV;}
                    //判断是否小于最小值
                    if (bandVal <= minBandV) {this.bandwidthVal = minBandV;}

                    this.setValue(".slider_bandwidth_l", this.bandwidthVal);
                    this.rewrite();
                }

            }
        },
        updated: function() {
            var _this = this;
            // DOM 更新之后处理部分，主要于 滑动条插件必须现有容器
            if (_this.diskArrNew.length) {
                //新加磁盘总数
                var newDiskValueTotal = 0;
                // 硬盘配置
                _this.diskArrNew.forEach(function(val, index) {
                    var diskOption = {
                        el: ".slider_disk_new_" + index,
                        min: 0,
                        max: _this.buyData.diskMinMaxSize[1],
                        step: _this.buyData.diskMinMaxSize[2],
                        pips: _this.buyData.diskMinMaxSize[1] / 5 / _this.buyData.diskMinMaxSize[2],
                        val: _this.diskArrNew[index]['diskValue'],
                        suffix: "G"
                    };
                    _this.sliderUI(diskOption, function(ui) {
                        var DiskMin = _this.buyData.diskMinMaxSize[0];
                        if (ui.value < DiskMin) {
                            _this.diskArrNew[index]['diskValue'] = DiskMin;
                        } else {
                            _this.diskArrNew[index]['diskValue'] = ui.value;
                        }
                    });

                    newDiskValueTotal += parseInt(_this.diskArrNew[index]['diskValue']);
                });
                _this.diskNewValue = newDiskValueTotal;

            }else{
                _this.diskNewValue = 0;
            }

            if (_this.isAddDiskChange) {
                this.isAddDiskChange = false;
                _this.rewrite();
            }else{
                return false;
            }

        },
        watch: {
            diskArrNew:{
                handler:function(curVal,oldVal){
                    this.isAddDiskChange = true;
                },
                deep:true
            }
        }
    });

    $(window).on("scroll resize", function(e) {
        var t = $(".ly_footer_service"),
            a = $(this).scrollTop(),
            i = $("#buyFooter");
        a >= $("#buyFooterScrollY").offset().top - $(window).height() + i.height() ? (t.css("margin-top", 0),
            i.removeClass("buy-footer-fixed")) : (t.css("margin-top", t.height() + 100 + "px"),
            i.addClass("buy-footer-fixed"));


        // var ir = $("#buyFooter");

        // a >= $("#buyFooterScrollY").offset().top - $(window).height() + ir.height() ? (t.css("margin-top", 0),
        //     ir.removeClass("buy-footer-fixed")) : (t.css("margin-top", t.height() + 100 + "px"),
        //     ir.addClass("buy-footer-fixed"));
    });

});