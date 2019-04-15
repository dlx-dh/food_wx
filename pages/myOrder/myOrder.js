// pages/orders/orders.js
var md5 = require('../../utils/md5.js');

var app = getApp();
Page({
  data: {
    userAddr: "",
    goodsInf: "",
    goods_total: "",
    userMsg: "",
    addr_flag: '',
    warnInf: '',
    count_flag: true,
    minusStatus: false,
    total: {
      count: 0,
      money: 0
    },
    timeid: ""
  },
  bindMinus: function (event) {
    var that = this;
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
      console.log(event)
      let data = event.currentTarget.dataset

      let goods_amount = parseFloat(this.data.goods_amount || 0)
      let goods_total = this.data.goods_total || 0
      let goodsInf = this.data.goodsInf
      let menu = goodsInf.find(function (v) {
        return v._id == data.id
      })
      if (menu.count <= 0)
        return
      menu.count -= 1;
      goods_amount -= parseFloat((menu.payout || 0).toFixed(2))
      goods_amount = parseFloat(goods_amount.toFixed(2))
      console.log(menu)
      console.log(goodsInf)
      this.setData({
        'goodsInf': goodsInf,
        'goods_amount': goods_amount,
        goods_total: goods_amount
      })
      wx.hideToast();
    } else {
      that.myToast("您点击的太快了，休息一下再试！");
    }
  },
  bindPlus: function (event) {
    var that = this;
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
      console.log(event)
      let data = event.currentTarget.dataset

      let goods_amount = parseFloat(this.data.goods_amount || 0)
      let goods_total = this.data.goods_total || 0
      let goodsInf = this.data.goodsInf
      let menu = goodsInf.find(function (v) {
        return v._id == data.id
      })
      menu.count += 1;

      console.log(goods_amount)
      console.log(menu.payout)
      goods_amount += parseFloat((menu.payout || 0).toFixed(2))
      console.log(goods_amount)
      goods_amount = parseFloat(goods_amount.toFixed(2))
      console.log('33333333333333333')
      console.log(menu)
      console.log(goodsInf)
      console.log(goods_amount)
      
      this.setData({
        'goodsInf': goodsInf,
        'goods_amount': goods_amount,
        goods_total: goods_amount
      })
      wx.hideToast();
    } else {
      that.myToast("您点击的太快了，休息一下再试！");
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
    //test 
    // wx.redirectTo({
    //   url: '../orderDetails/orderDetails?order_id=5c9635b194eef1087c325111'
    // })
    // console.log(e)
    var self = this;
    let goodsInf = self.data.goodsInf
    console.log('goodsInf')
    console.log(goodsInf)
    console.log(goodsInf.length)
    var foodNum=0
    for (let i = 0; i < goodsInf.length; i++) {
      foodNum += goodsInf[i].count;
    }
    if (foodNum>0) {
    wx.getStorage({
      key: "session_id",
      success: function (res) {
        console.log("session_id:")
        console.log(res.data)
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
            console.log('success /client/to_order')
            console.log(res)
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
    }else{
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
    app.checkSessionId(this, function (have_session, session_id) {
      console.log(have_session)
      if (!have_session) {
        wx.hideLoading()
        wx.redirectTo({
          url: '../../pages/index/index'
        })
      } else {
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
              var goods_amount = that.data.goods_amount || 0
              for (var i = 0; i < seleteItem.length; i++) {
                goods_amount += (seleteItem[i]['count'] || 1) * (seleteItem[i]['payout'] || 0)
              }
              if (seleteItem && seleteItem.length > 1) {
                that.setData({
                  goodsInf: seleteItem,
                  minusStatus: true,
                  goods_count: seleteItem.length,
                  goods_amount: goods_amount.toFixed(2),
                  goods_total: goods_amount.toFixed(2)
                })
              } else {
                that.setData({
                  goodsInf: seleteItem,
                  goods_count: seleteItem.length,
                  goods_amount: goods_amount.toFixed(2),
                  goods_total: goods_amount.toFixed(2)
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
    })

  }
})