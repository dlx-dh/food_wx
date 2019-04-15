// pages/orderDetails/orderDetails.js
var md5 = require('../../utils/md5.js');
var app = getApp();
Page({
  data: {
    goods_total: '',
    shipping_fee: 0,
    order_id: ''
  },
  getfid: function (e) {
    this.setData({
      fid: e.detail.formId
    })
  },
  wxpay: function () {
    var that = this;
    app.checkSessionId(this, function (have_session, session_id) {
      console.log(have_session)
      if (!have_session) {
        wx.redirectTo({
          url: '../../pages/index/index'
        })
      } else {
        var url = app.globalData.url + '/client/wxpay';
        wx.request({
          url: url,
          data: {
            order_id: that.data.order_id,
            session_id: session_id
          },
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: function (res) {
            console.log('success  /client/wxpay')
            console.log(res)
            if (res.data.order_id) {
              // 发起支付
              var pkg = 'prepay_id=' + res.data.package;
              var nonceStr = res.data.nonceStr;
              var xcxsign = res.data.signType;
              var paySign = res.data.paySign
              var order_id = res.data.order_id
              var appId = res.data.appId
              var timeStamp = res.data.timeStamp
              wx.requestPayment({
                'timeStamp': timeStamp,
                'nonceStr': nonceStr,
                'package': pkg,
                'signType': 'MD5',
                'paySign': paySign,
                'success': function (res) {
                  console.log('success requestPayment')
                  console.log(res)
                  wx.request({
                    url: app.globalData.url + '/client/update_order_type',
                    data: {
                      order_id: order_id,
                      session_id: session_id,
                      payout: true
                    },
                    method: 'POST',
                    header: { 'content-type': 'application/x-www-form-urlencoded' },
                    success: function (res) {
                      console.log('success /client/update_order_type/')
                      wx.redirectTo({
                        url: '../orderDetails/orderDetails?order_id=' + order_id
                      })
                    },
                    fail: function (res) {
                      console.log("fail /client/wxpay")
                      app.toPoint('失败 请稍后再试')
                    }
                  })
                },
                'fail': function (res) {
                  console.log('fail requestPayment ')
                  console.log(res)
                  wx.request({
                    url: app.globalData.url + '/client/update_order_type',
                    data: {
                      order_id: order_id,
                      session_id: session_id,
                      payout: false
                    },
                    method: 'POST',
                    header: { 'content-type': 'application/x-www-form-urlencoded' },
                    success: function (res) {
                      app.toPoint('支付失败!');
                    },
                    fail: function (res) {
                      console.log("fail /client/wxpay")
                      app.toPoint('失败 请稍后再试')
                    }
                  })
                }
              });
            } else {
              console.log("服务器故障，请稍后重试！");
            }
          },
          fail: function (res) {
            console.log("fail /client/wxpay ")
            app.toPoint('支付失败 请稍后再试')
          }
        })
      }
    })
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "订单详情"
    })
    wx.showLoading({
      title: '加载中...',
    })
    var order_id = (options.order_id)
    console.log("order_id：" + order_id)
    if (!order_id) {
      wx.hideLoading()
      wx.redirectTo({
        url: '../../pages/selectFood/index'
      })
    } else {
      var that = this;
      app.checkSessionId(this, function (have_session, session_id) {
        console.log(have_session)
        if (!have_session) {
          wx.hideLoading()
          wx.redirectTo({
            url: '../../pages/index/index'
          })
        } else {
          var url = app.globalData.url + '/client/get_order_by_id?order_id=' + order_id + '&session_id=' + session_id;
          console.log("repuest url:" + url)
          wx.request({
            url: url,
            data: {},
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
              wx.hideLoading()
              console.log('get_order_by_id ')
              console.log(res.data[0])
              that.setData({
                orderInf: res.data[0],
                order_id: res.data[0]._id,
                goods_total: res.data[0].total_fee.toFixed(2),
                shipping_fee: 0
              })
            },
            fail: function (res) {
              wx.hideLoading()
              console.log("fail client/get_order_by_id ")
              app.toPoint('服务器繁忙 请稍后再试')
            }
          })
        }
      })
    }
  }
})