// pages/manageOrders/manageOrders.js
var md5 = require('../../utils/md5.js');
var util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
    goodsInf: "",
    orderInfList: {},
    unpaid: false,
    paid: false,
    all: true
  },
  getfid: function (e) {
    this.setData({
      fid: e.detail.formId
    })
  },
  wxpay: function (e) {
    var order_id = e.currentTarget.dataset.oid;
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
            order_id: order_id,
            session_id: session_id
          },
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: function (res) {
            console.log('success /client/wxpay')
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
                  console.log('requestPayment success')
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
                      console.log('success  /client/update_order_type/')
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
                  console.log('fail  requestPayment')
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
                      app.toPoint('支付失败 请稍后再试')
                    },
                    fail: function (res) {
                      console.log("fail /client/wxpay")
                      app.toPoint('支付失败 请稍后再试')
                    }
                  })
                }
              });
            } else {
              app.toPoint('服务器故障，请稍后重试！')
            }
          },
          fail: function (res) {
            console.log("fail /client/wxpay")
            app.toPoint('支付失败 请稍后再试')
          }
        })
      }
    })
  }, 
  onShow: function () {
    // 页面显示
    this.getDate({})
  },
  onLoad: function (options) {
    console.log('manageOrders onload')
    this.getDate(options)
  },
  getDate: function (options){
    var that = this;
    wx.setNavigationBarTitle({
      title: "订单管理"
    })

    wx.showLoading({
      title: '加载中...',
    })
    app.checkSessionId(this, function (have_session, session_id) {
      console.log(have_session)
      if (!have_session) {
        wx.hideLoading();
        wx.redirectTo({
          url: '../../pages/index/index'
        })
      } else {
        var _url = app.globalData.url + '/client/get_order?user_id=' + session_id;
        if (options.t == 'unpaid') {
          _url += '&act=unpaid';
          that.setData({
            unpaid: true
          })
        } else if (options.t == 'paid') {
          _url += '&act=paid';
          that.setData({
            paid: true
          })
        } else {
          _url += '&act=all';
          that.setData({
            all: true
          })
        }
        var url = _url + '&session_id=' + session_id;
        console.log(url)
        wx.request({
          url: url,
          data: {},
          method: 'GET',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: function (res) {
            console.log('success client/get_order')
            console.log(res.data)
            wx.hideLoading();
            that.setData({
              orderInfList: res.data
            })
          },
          fail: function (res) {
            console.log(res)
            wx.hideLoading();
            console.log("fail client/get_order")
            app.toPoint('获取信息失败 请稍后再试')
          }
        })
      }
    })
  }
})