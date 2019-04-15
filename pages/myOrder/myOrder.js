// pages/orders/orders.js
var md5 = require('../../utils/md5.js');

var app = getApp();
Page({
  data: {
    userAddr: "",
    goodsInf: "",
    goods_total: "",
    goods_lessen: "",
    userMsg: "",
    addr_flag: '',
    warnInf: '',
    count_flag: true,
    minusStatus: false,
    total: {
      count: 0,
      money: 0
    },
    timeid: "",
    peice: null,
    seleteItem: {}
  },
  bindMinus: function (event) {
    var that = this;
    var peice = app.globalData['peice'] || null
    if (peice) {
      that.setData({
        peice: peice
      })
      start()
    } else {
      app.getWxInfo(session_id, 'peice', function (seting) {
        that.setData({
          peice: peice
        })
        start()
      })
    }
    function start() {
      if (that.data.count_flag) {
        that.setData({
          count_flag: false
        })
        setTimeout(function () {
          that.setData({
            count_flag: true
          })
        }, 1000)
        wx.showToast({
          title: '计算总额中...',
          icon: 'loading',
          duration: 1000
        })
        let data = event.currentTarget.dataset
        let goods_total = 0
        let goodsInf = that.data.goodsInf
        let menu = goodsInf.find(function (v) {
          return v._id == data.id
        })
        if (menu.count <= 0)
          return
        menu.count -= 1;
        for (var i = 0; i < goodsInf.length; i++) {
          goods_total += (goodsInf[i]['count'] || 0) * (goodsInf[i]['payout'] || 0)
        }
        var lessen = 0
        var lessenzitem = null
        for (var i = 0; i <= (peice.length - 1); i++) {
          if (peice[i]['max'] <= parseFloat(goods_total)) {
            if (!lessenzitem) lessenzitem = peice[i]
            if (lessenzitem['max'] < peice[i]['max']) {
              lessenzitem = peice[i]
            }
            lessen = lessenzitem['lessen'] || 0
          }
        }
       var goods_amount = parseFloat(goods_total) - parseFloat(lessen || 0)

        that.setData({
          'goodsInf': goodsInf,
          goods_amount: goods_amount.toFixed(2),
          goods_total: goods_total.toFixed(2),
          goods_lessen: lessen.toFixed(2)
        })
        wx.hideToast();
      } else {
        that.myToast("您点击的太快了，休息一下再试！");
      }
    }
  },
  bindPlus: function (event) {
    var that = this;
    var peice = app.globalData['peice'] || null
    if (peice) {
      that.setData({
        peice: peice
      })
      start()
    } else {
      app.getWxInfo(session_id, 'peice', function (seting) {
        that.setData({
          peice: peice
        })
        start()
      })
    }
    function start() {

      if (that.data.count_flag) {
        that.setData({
          count_flag: false
        })
        setTimeout(function () {
          that.setData({
            count_flag: true
          })
        }, 1000)
        wx.showToast({
          title: '计算总额中...',
          icon: 'loading',
          duration: 1000
        })
        let data = event.currentTarget.dataset
        var seleteItem = that.data.seleteItem;
        let goods_total = 0
        let goodsInf = that.data.goodsInf
        let menu = goodsInf.find(function (v) {
          return v._id == data.id
        })
        menu.count += 1;
        for (var i = 0; i < goodsInf.length; i++) {
          goods_total += (goodsInf[i]['count'] || 1) * (goodsInf[i]['payout'] || 0)
        }
        var lessen = 0
        var lessenzitem = null
        for (var i = 0; i <= (peice.length - 1); i++) {
          if (peice[i]['max'] <= parseFloat(goods_total)) {
            if (!lessenzitem) lessenzitem = peice[i]
            if (lessenzitem['max'] < peice[i]['max']) {
              lessenzitem = peice[i]
            }
            lessen = lessenzitem['lessen'] || 0
          }
        }
       var goods_amount = parseFloat(goods_total) - parseFloat(lessen)
        that.setData({
          'goodsInf': goodsInf,
          goods_amount: goods_amount.toFixed(2),
          goods_total: goods_total.toFixed(2),
          goods_lessen: lessen.toFixed(2)
        })
        wx.hideToast();
      } else {
        that.myToast("您点击的太快了，休息一下再试！");
      }
    }
  },
  bingInputForUserMag: function (e) {
    this.setData({
      userMsg: e.detail.value
    })
  },
  myToast: function (inf) {
    var that = this;
    if (inf) {
      that.setData({
        warnInf: inf
      });
      setTimeout(function () {
        that.setData({
          warnInf: '',
        });
      }, 2000);
    }
  },
  toWXPay: function (e) {
    var self = this;
    let goodsInf = self.data.goodsInf
    var foodNum = 0
    for (let i = 0; i < goodsInf.length; i++) {
      foodNum += goodsInf[i].count;
    }
    if (foodNum > 0) {
      wx.getStorage({
        key: "session_id",
        success: function (res) {
          var session_id = res.data.session_id;
          var url = app.globalData.url + '/client/to_order';
          wx.request({
            url: url,
            data: {
              food_info: JSON.stringify(goodsInf),
              session_id: session_id,
              user_msg: self.data.userMsg,
              timeid: self.data.timeid
            },
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res, data) {
              var order_id = res.data.order_id
              if (res.statusCode == 200) {
                wx.redirectTo({
                  url: '../orderDetails/orderDetails?order_id=' + order_id
                })
              } else if (res.data.result_code == 'FAIL') {
                app.toPoint('提交订单失败！ ')
              }
            },
            fail: function (res) {
              console.log("fail /client/wxpay")
              app.toPoint('失败 请稍后再试')
            }
          })
        },
        fail: function (res) {
          console.log("用户登录未登录，获取地址失败!")
        }
      })
    } else {
      app.toPoint('你还没有选择任何食品，请先选择')
    }
  },
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: "我的订单"
    })
    wx.showLoading({
      title: '加载中...',
    })


    console.log('9999999999999')

    app.checkSessionId(this, function (have_session, session_id) {
      console.log('888888888888888')
      console.log(have_session)
      if (!have_session) {
        wx.hideLoading()
        wx.redirectTo({
          url: '../../pages/index/index'
        })
      } else {
        var peice = app.globalData['peice'] || null
        console.log('4444444444444444')
        console.log(peice)
        if (peice) {
          that.setData({
            peice: peice
          })
          start()
        } else {
          app.getWxInfo(session_id, 'peice', function (seting) {
            that.setData({
              peice: peice
            })
            start()
          })
        }

        function start() {
          if (!options['timeid'] || options['timeid'] == "") {
            wx.hideLoading()
            wx.switchTab({
              url: '../../pages/main/main?err=true'
            })
          } else {
            that.setData({
              timeid: options['timeid'] || 0
            })
            that.setData({
              order_id: options.order_id || 0
            })
            wx.getStorage({
              key: "selete_item",
              success: function (res) {
                wx.hideLoading()
                var seleteItem = res.data.seleteItem;
                that.setData({
                  seleteItem: seleteItem
                })
                var goods_total =  0
                for (var i = 0; i < seleteItem.length; i++) {
                  goods_total += (seleteItem[i]['count'] || 1) * (seleteItem[i]['payout'] || 0)
                }
                var lessen = 0
                var lessenzitem = null
                for (var i = 0; i <= (peice.length - 1); i++) {
                  console.log('4444444444444')
                  console.log(peice[i])
                  if (peice[i]['max'] <= parseFloat(goods_total)) {
                    if (!lessenzitem) lessenzitem = peice[i]
                    if (lessenzitem['max'] < peice[i]['max']) {
                      lessenzitem = peice[i]
                    }
                    lessen = lessenzitem['lessen'] || 0
                  }
                }
                var goods_amount = parseFloat(goods_total) - parseFloat(lessen)
                if (seleteItem && seleteItem.length > 1) {
                  that.setData({
                    goodsInf: seleteItem,
                    minusStatus: true,
                    goods_count: seleteItem.length,
                    goods_amount: goods_amount.toFixed(2),
                    goods_total: goods_total.toFixed(2),
                    goods_lessen: lessen.toFixed(2)
                  })
                } else {
                  that.setData({
                    goodsInf: seleteItem,
                    goods_count: seleteItem.length,
                    goods_amount: goods_amount.toFixed(2),
                    goods_total: goods_amount.toFixed(2),
                    goods_lessen: lessen.toFixed(2)
                  })
                }
              },
              error: function (er) {
                wx.hideLoading()
                console.log('err  selete_item')
                app.toPoint('获取订单失败 请稍后再试！ ')
              }
            })
          }
        }
      }
    })
  }
})