// pages/orderDetails/orderDetails.js
var md5 = require('../../utils/md5.js');
var app = getApp();
Page({
  data:{
    goods_total:'',
    shipping_fee:0,
    order_id:''
  },
  getfid:function(e){
    this.setData({
      fid:e.detail.formId
    })
  },
  wxpay:function(){
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
               order_id: that.data.order_id,
              session_id: session_id
               },
            method: 'POST',
            header: {'content-type': 'application/x-www-form-urlencoded'},
            success: function(res){
              console.log('/client/wxpay success')
              console.log(res)
              if (res.data.order_id){
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
              }else{
                console.log("服务器故障，请稍后重试！");
              }
            }
          })
        },
        fail: function(res) {
          console.log("用户登录未登录，获取地址失败!")
        }
      })
  },
  buyAgain:function(e){
    wx.navigateTo({
      url:'../details/details?id='+e.currentTarget.dataset.oid
    })
  },
  onLoad:function(options){
    wx.setNavigationBarTitle({
      title: "订单详情"
    })
    var that = this; //get_order_by_id
    var order_id = (options.order_id || "5c96360094eef1087c325128")
    var _url = app.globalData.url + '/client/get_order_by_id?order_id=' + order_id
    wx.getStorage({
      key:"session_id",
      success: function(res){
        console.log(res)
        var session=res.data.session_id;
        var url = _url + '&session_id=' + session;
        console.log(url)
        wx.request({
          url: url,
          data:{},
          method: 'POST',
          header: {'content-type': 'application/x-www-form-urlencoded'},
          success: function (res) {
            console.log('get_order_by_id ')
            console.log(res.data[0])
            that.setData({
              orderInf:res.data[0],
              order_id:res.data[0]._id,
              goods_total: res.data[0].total_fee.toFixed(2),
              shipping_fee:0
            })
          }
        })
      },
      fail: function(res) {
        console.log("用户登录未登录!")
      }
    })
  }
})