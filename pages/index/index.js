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
        // session_key 已经失效，需要重新执行登录流程
        wx.switchTab({
          url: '../../pages/main/main'
        })
      },
      fail: function () {
        // wx.clearStorage()
        wx.request({
          url: app.globalData.url + '/client/get_customers',
          method: "GET",
          data: {},
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            console.log(res);
            self.setData({
              customers_type: res.data,
            })
          },
          error: function (err) {
            console.log(err)
          }
        })
        wx.getStorage({
          key: "session_id",
          success: function (session, ) {
            console.log('mysession')
            console.log(session.data.session_id)
            console.log("授权成功");
            console.log(userinfo);
            wx.switchTab({
              url: '../../pages/main/main'
            })

            if (session.data && session.data.session_id) {
              wx.switchTab({
                url: '../../pages/main/main'
              })
            }
          }
        })
      }
    })
    // 页面初始化 options为页面跳转所带来的参数
  },
  //   const ImgLoader = require('../../template/img-loader/img-loader.js');
  //   this.imgLoader = new ImgLoader(this);
  //   this.imgLoader.load(imgUrlOriginal, (err, data) => {
  //     console.log('图片加载完成', err, data.src, data.width, data.height)
  // });
  bindStartMultiPickerChange: function (e) {
    console.log(e.detail.value)
    var date = this.data.customers_type[e.detail.value]
    this.setData({
      customers: date['_id'],
    })
    console.log(date)
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
    wx.redirectTo({
      url: '../main/main'
    });
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
        console.log("我点击了");
        if (res.detail.userInfo) {
          console.log("点击了同意授权");
          wx.login({
            success: function (res) {
              console.log("res.code:" + res.code);
              if (res.code) {
                console.log('111111111111111')
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
                    var userinfo = {};
                    console.log(res);
                    userinfo['id'] = res.data._id;
                    userinfo['nickName'] = info.detail.userInfo.nickName;
                    userinfo['avatarUrl'] = info.detail.userInfo.avatarUrl;
                    console.log(userinfo)
                    console.log(that.globalData)
                    wx.setStorage({
                      key: "session_id",
                      data: {
                        session_id: userinfo['id']
                      }
                    })
                    console.log("授权成功");
                    console.log(userinfo);
                    wx.switchTab({
                      url: '../../pages/main/main'
                    })
                  },
                  error: function (err) {
                    console.log(err)
                  }
                })
              } else {
                console.log("授权失败");
              }
            }
          })
        } else {
          console.log("点击了拒绝授权");
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
})