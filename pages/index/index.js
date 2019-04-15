// pages/index/index.js
const types = ['default', 'primary', 'warn']
var app = getApp();
Page({
  data: {
    user: "",
    mobile: "",
    address: "",
    customers: "",
    customers_type: []
  },
  onLoad: function (options) {
    var self = this;
    // wx.clearStorage()
    wx.getStorage({
      key: "session_id",
      success: function (res) {
        console.log("session_id:")
        console.log(res.data)
        var session_id = res.data.session_id;
        if (session_id && session_id!=""){
        wx.switchTab({
          url: '../../pages/main/main'
        })
        }
      },
      fail: function () {
        wx.request({
          url: app.globalData.url + '/client/get_customers',
          method: "GET",
          data: {},
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res);
            self.setData({
              customers_type: res.data,
            })
          },
          fail: function (err) {
            app.toPoint('服务器繁忙 请稍后再试')
          }
        })
      }
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  goMainPage: function () {
    // wx.redirectTo({
    //   url: '../main/main'
    // });
  },
  userBlur: function (e) {
    this.setData({
      user: e.detail.value,
    })
  },
  mobileBlur: function (e) {
    this.setData({
      mobile: e.detail.value,
    })
  },
  bindStartMultiPickerChange: function (e) {
    var date = this.data.customers_type[e.detail.value]
    this.setData({
      customers: date['_id'],
    })
  },
  addrBlur: function (e) { 
    this.setData({
      address: e.detail.value,
    })
  },
  bindGetUserInfo: function (res) {
    var userinfo = {};
    var that = this
    var userName = that.data.user;
    var userMobile = that.data.mobile;
    var userAddress = that.data.address;
    var userCustomers = that.data.customers;
    if (userName == "" || userMobile == "" || userAddress == "" || userCustomers == "") {
      wx.showToast({
        title: '请完成以上信息！',
        icon: "none",
        duration: 1500,
        mask: true
      });
    } else {
      try {
        var info = res
        if (res.detail.userInfo) {
          app.globalData.userInfo = res.detail.userInfo
          wx.login({
            success: function (res) {
              console.log("res.code:" + res.code);
              if (res.code) {
                wx.request({
                  url: app.globalData.url + '/client/user_wx',
                  method: "POST",
                  data: {
                    code: res.code,
                    nickName: info.detail.userInfo.nickName,
                    city: info.detail.userInfo.city,
                    province: info.detail.userInfo.province,
                    avatarUrl: info.detail.userInfo.avatarUrl,
                    name: userName,
                    address: userAddress,
                    mobile: userMobile,
                    cid: userCustomers,
                  },
                  header: {
                    'content-type': 'application/json' // 默认值
                  },
                  success: function (res) {
                    console.log('success  /client/user_wx')
                    var userinfo = {};
                    userinfo['id'] = res.data._id;
                    userinfo['nickName'] = info.detail.userInfo.nickName;
                    userinfo['avatarUrl'] = info.detail.userInfo.avatarUrl;
                    wx.setStorage({
                      key: "session_id",
                      data: {
                        session_id: userinfo['id']
                      }
                    })
                    wx.switchTab({
                      url: '../../pages/main/main'
                    })
                  },
                  fail: function (err) {
                    console.log('err  /client/user_wx')
                    // app.toPoint('服务器繁忙 请稍后再试！ ')
                    app.toPoint(err)
                  }
                })
              } else {
                app.toPoint('授权失败')
              }
            },
            fail:function(err){
              app.toPoint('登录失败！')
              app.toPoint(err)
            }
          })
        } else {
          app.toPoint('授权失败 原因：你点击了拒绝授权')
        }
      } catch (e) {
        app.toPoint(e)
      }
    }
  }
})