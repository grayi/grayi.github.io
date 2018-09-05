// 节流函数
var delay = (function() {
    var timer = 0;
    return function(callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();

// CDN buy新版

new Vue({
    el: "#buyApp",
    data: {
        loading: true,
        buyData: {
            bandwidth: [1, 15, 1],
            // saleMonth: xyData.list.data.saleMonth
            saleMonth: [
                {"month":1,"saleMonth":1,"sale":-1,"unit":"个月"},
                {"month":2,"saleMonth":2,"sale":-1,"unit":"个月"},
                {"month":3,"saleMonth":3,"sale":-1,"unit":"个月"},
                {"month":4,"saleMonth":4,"sale":-1,"unit":"个月"},
                {"month":5,"saleMonth":5,"sale":-1,"unit":"个月"},
                {"month":6,"saleMonth":6,"sale":-1,"unit":"个月"},
                {"month":7,"saleMonth":7,"sale":-1,"unit":"个月"},
                {"month":8,"saleMonth":8,"sale":-1,"unit":"个月"},
                {"month":9,"saleMonth":9,"sale":-1,"unit":"个月"},
                {"month":1,"saleMonth":12,"sale":-1,"unit":"年"},
                {"month":2,"saleMonth":24,"sale":-1,"unit":"年"},
                {"month":3,"saleMonth":36,"sale":-1,"unit":"年"}
            ]
        },
        bandwidthVal: 1,
        curSaleMonth: 0,
        limitSale:7,
        totalMoney: 0,
        comboIndex: 0,
        combo: [
            { name: 'VIP I', title: 'VIP I 套餐：带宽为1-5M，价格为 900港币/M' },
            { name: 'VIP II', title: 'VIP II 套餐：带宽为5-10M，价格为 850港币/M' },
            { name: 'VIP III', title: 'VIP III 套餐：带宽为10-15M，价格为 800港币/M' },
        ],
    },
    mounted: function() {
        this._initSlider();
        this.loading = false;
        $('body').addClass('loaded');
        $('#loadingWrapper').remove();
        this.rewrite();
    },
    methods: {
        //time切换
        saleMonthToggle: function(v, i) {
            if (i > this.limitSale) {
                return false;
            }
            this.curSaleMonth = i;
            this.rewrite();
        },
        changeCombo: function(i) {
            this.comboIndex = i;
            this.curSaleMonth = 0;
            switch (i) {
                case 0:
                    this.setValue(".slider_bandwidth", 1);
                    break;
                case 1:
                    this.setValue(".slider_bandwidth", 6);
                    break;
                case 2:
                    this.setValue(".slider_bandwidth", 11);
                    break;
            }
            this.rewrite();
        },
        rewrite: function() {
            var _this = this;

            var init_data = {
                ip: 1,
                bandwidth: _this.bandwidthVal,
                day: _this.buyData.saleMonth[_this.curSaleMonth]['saleMonth']
            };
            $.ajax({
                type: 'get',
                url: "/cdnGetPrice",
                beforeSend: function() {
                    _this.totalMoney = "正在计算..."
                },
                data: init_data,
                success: function(data) {
                    if (JSON.parse(data).status == 1) {
                        _this.totalMoney = JSON.parse(data).data;
                    } else {
                        _this.totalMoney = '价格加载失败';
                    }
                }
            });
        },
        _initSlider: function() {
            var _this = this;
            var bandWidthOption = {
                el: ".slider_bandwidth",
                min: parseInt(_this.buyData.bandwidth[0]),
                max: parseInt(_this.buyData.bandwidth[1]),
                step: parseInt(_this.buyData.bandwidth[2]),
                val: 0,
                pips: 1,
                suffix: "M"
            };

            // 带宽
            this.sliderUI(bandWidthOption, function(ui) {
                var bandwidthMin = _this.buyData.bandwidth[0];
                if (ui.value < bandwidthMin) {
                    _this.bandwidthVal = bandwidthMin;
                } else {
                    _this.bandwidthVal = ui.value;
                }
                _this.curSaleMonth = 0;
                _this.rewrite();
            });
        },
        //sliderUI组
        sliderUI: function(option, slideCallback) {
            var _this = this;
            $(option.el)
                .slider({
                    range: "min",
                    min: option.min,
                    max: option.max,
                    step: option.step,
                    value: option.val,
                    change: function(event, ui) {
                        _this.bandwidthVal = ui.value;
                        if (ui.value < 6) { _this.comboIndex = 0; }
                        if (ui.value < 11 && ui.value > 5) { _this.comboIndex = 1; }
                        if (ui.value > 10) { _this.comboIndex = 2; }
                    },
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
        //设置滑块value
        setValue: function(el, val) {
            $(el).slider("value", val);
        },
        //加
        _increase: function(type) {
            var _this = this;
            // 带宽
            if (type == 'bandwidth') {
                this.bandwidthVal = parseInt(_this.bandwidthVal) + parseInt(_this.buyData.bandwidth[2]);
                if (this.bandwidthVal > _this.buyData.bandwidth[1]) {
                    this.bandwidthVal = _this.buyData.bandwidth[1];
                    return false;
                }
                _this.setValue(".slider_bandwidth", this.bandwidthVal);
                this.rewrite();
            }
        },
        //减
        _decrease: function(type) {
            var _this = this;
            // 带宽
            if (type == 'bandwidth') {
                this.bandwidthVal = parseInt(_this.bandwidthVal) - parseInt(_this.buyData.bandwidth[2]);
                if (this.bandwidthVal < _this.buyData.bandwidth[0]) {
                    this.bandwidthVal = _this.buyData.bandwidth[0];
                    return false;
                }
                _this.setValue(".slider_bandwidth", this.bandwidthVal);
                this.rewrite();
            }
        },
        // 输入框输入限制（只能输入数字键以及基本操作）
        InputNumberLimit: function(e) {
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
            if (!isNumberCode && !isOperateCode) {
                e.stopPropagation();
                e.preventDefault();
                return false;
            }
        },
        isLegitimateDelay: function(type) {
            var _this = this;
            delay(function() {
                _this.isLegitimate(type);
            }, 300);
        },
        isLegitimate: function(type) {
            var minBandV = parseInt(this.buyData['bandwidth']['0']);
            var maxBandV = parseInt(this.buyData['bandwidth']['1']);
            if (type == 'bandwidth') {
                this.bandwidthVal = this.bandwidthVal == '' ? minBandV : this.bandwidthVal;
                var bandVal = parseInt(this.bandwidthVal);
                //判断是否大于最大值
                if (bandVal >= maxBandV) { this.bandwidthVal = maxBandV; }
                //判断是否小于最小值
                if (bandVal <= minBandV) { this.bandwidthVal = minBandV; }

                this.setValue(".slider_bandwidth", this.bandwidthVal);
                this.rewrite();
            }
        },
        // 获取URL参数
        getQuery: function(name) {
            var reg = new RegExp("(/?)" + name + "=([^&]*)(/?|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        buy: function() {
            var _this = this;
            var isCheck = true;

            $.ajax({
                url: '/loginType',
                beforeSend: function() {
                    NY.waiting('处理中，请稍后...', true);
                },
                complete: function(jqXHR, textStatus) {
                    NY.hideWaiting();
                },
                success: function(data) {
                    if (!data) {
                        NY.warn("您暂未登录,请先登录", 2, function() { window.location.href = '/login'; });
                    } else {

                        var domainId = _this.getQuery('id') || '';
                        var domain = _this.getQuery('domain') || '';

                        if (domainId) {
                            NY.tips.ask({
                                title: 'CDN服务购买',
                                content: "您确定要为 "+ domain +" 购买CDN服务吗",
                                ok: function() {
                                    var buy_data = {
                                        bandwidth: _this.bandwidthVal,
                                        day: _this.buyData.saleMonth[_this.curSaleMonth]['saleMonth'],
                                        bindType: 'domain',
                                        bindID: domainId,
                                        ip: 1
                                    };

                                    xjax('/cdnCdnBuy', {
                                        data: buy_data,
                                        beforeSend: function() {
                                            NY.waiting('购买中，请稍后...', true);
                                        },
                                    })
                                }
                            });
                        } else {
                            art.dialog.open('/selectDomain', {
                                id: 'KDf435',
                                title: '选择资源',
                                width: '1000px',
                                height: '80%',
                                lock: true,
                                background: '#000', // 背景色
                                fixed: true,
                                drag: false,
                                resize: false,
                                ok: function() {

                                    var iframe = this.iframe.contentWindow;
                                    var top = art.dialog.top; // 引用顶层页面window对象
                                    var $$ = $(iframe.document);

                                    if (!$$) { return false; };

                                    var bindType = '';
                                    var bindID = null;

                                    var domainIdSelect = $$.find('.domainIdSelect').val();
                                    var rdataIdSelect = $$.find('.rdataIdSelect').val();

                                    if (domainIdSelect == '' || rdataIdSelect == '') {
                                        NY.feedback.info('请先选择资源');
                                        return false;
                                    }

                                    bindType = rdataIdSelect == '0' ? 'domain' : 'rdata';
                                    bindID = rdataIdSelect == '0' ? domainIdSelect : rdataIdSelect;

                                    var buy_data = {
                                        bandwidth: _this.bandwidthVal,
                                        day: _this.buyData.saleMonth[_this.curSaleMonth]['saleMonth'],
                                        bindType: bindType,
                                        bindID: bindID,
                                        ip: 1
                                    };

                                    xjax('/cdnCdnBuy', {
                                        data: buy_data,
                                        beforeSend: function() {
                                            NY.waiting('购买中，请稍后...', true);
                                        },
                                        // reload:true
                                    }).then(function(data) {
                                        console.log(data);
                                    });

                                    return false;

                                }

                            });
                        }
                    }
                }
            })
        },
    },
    watch:{
        comboIndex:function (newVal,oldVal) {
            switch (this.comboIndex) {
                case 0:
                this.limitSale = 7;
                break;
                case 1:
                this.limitSale = 3;
                break;
                case 2:
                this.limitSale = 2;
                break;
            };
        }
    }
})