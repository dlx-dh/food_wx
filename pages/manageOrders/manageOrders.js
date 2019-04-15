// pages/manageOrders/manageOrders.js
var md5 = require('../../utils/md5.js'); 
var util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
    goodsInf: "",
    orderInfList: {},
    waitpay: false,
    waitship: false,
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
    wx.getStorage({
      key: "session_id",
      success: function (res) {
        console.log("session_id:")
        console.log(res.data)
        var session_id = res.data.session_id;
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
            console.log('/client/wxpay success')
            console.log(res)
            if (res.data.order_id) {
              // 发起支付
              var timeStamp = (Date.parse(new Date()) / 1000).toString();
              var pkg = 'prepay_id=' + res.data.package;
              var nonceStr = res.data.nonceStr;
              var xcxsign = res.data.signType;
              var paySign = res.data.paySign
              var order_id = res.data.order_id
              var appId = res.data.appId
              console.log('11111111111111')
              console.log(paySign)
              console.log('appId=' + appId + '&nonceStr=' + nonceStr + '&package=' + pkg + '&signType=MD5&timeStamp=' + timeStamp + "&key=dinglixingdinghaodinglixingdingh")
              var paySign = md5.hex_md5('appId=' + appId + '&nonceStr=' + nonceStr + '&package=' + pkg + '&signType=MD5&timeStamp=' + timeStamp + "&key=dinglixingdinghaodinglixingdingh").toUpperCase();
              console.log(paySign)
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
                      console.log('/client/update_order_type/ success')
                      wx.redirectTo({
                        url: '../orderDetails/orderDetails?order_id=' + order_id
                      })
                    }
                  })
                },
                'fail': function (res) {
                  console.log('requestPayment fail')
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
                      self.myToast('支付失败!');
                    }
                  })
                }
              });
            } else {
              console.log("服务器故障，请稍后重试！");
            }
          }
        })
      },
      fail: function (res) {
        console.log("用户登录未登录，获取地址失败!")
      }
    })
  },
  buyAgain: function (e) {
    wx.navigateTo({
      url: '../details/details?id=' + e.currentTarget.dataset.gid
    })
  },
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: "session_id",
      success: function (res) {
        console.log("session_id:")
        console.log(res.data)
        var session_id = res.data.session_id;


        wx.setNavigationBarTitle({
          title: "订单管理"
        })
        wx.getStorage({
          key: "session_id",
          success: function (res) {
            console.log("session_id:")
            console.log(res.data)
            var session_id = res.data.session_id;
            var _url = app.globalData.url + '/client/get_order?user_id=' + session_id;
            if (options.orderType == 'waitpay') {
              _url += '&act=waitpay';
              that.setData({
                waitpay: true
              })
            } else if (options.orderType == 'waitship') {
              _url += '&act=waitship';
              that.setData({
                waitship: true
              })
            } else {
              _url += '&act=all';
              that.setData({
                all: true
              })
            }
            wx.getStorage({
              key: "session_id",
              success: function (res) {
                console.log("/client/get_order session_id:")
                console.log(res.data)
                var session_id = res.data.session_id;
                var url = _url + '&session_id=' + session_id;
                console.log(url)
                wx.request({
                  url: url,
                  data: {},
                  method: 'GET',
                  header: { 'content-type': 'application/x-www-form-urlencoded' },
                  success: function (res) {
                    console.log('success')
                    console.log(res.data)
                    // for (var i = 0; i <= res.data.length;i++){
                    //   if (res.data[i] && res.data[i]['_at']) {
                    //     res.data[i]['_at'] = util.formatDate(res.data[i]['_at'])
                    //     console.log(res.data[i]['_at'])
                    //   }
                    // }
                    
                    that.setData({
                      orderInfList: res.data
                    })
                  }
                })
              },
              fail: function (res) {
                console.log("用户登录未登录，获取地址失败!")
              }
            })
          }
        })
      },
      fail: function () {
        // session_key 已经失效，需要重新执行登录流程
        wx.navigateTo({
          url: "../index/index"
        })
      }
    })
  }
})