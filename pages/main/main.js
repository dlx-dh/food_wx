// pages/main/main.js
var util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
    imgUrls: [
      'a12230326c89a046db9d868d629e9814.jpg',
      'be92d850b6ea4a8160a85e99f67bb563.jpg',
      '97bfb78527fc925a5fb7edb9822b5733.jpg'
    ],
    navs: [{ icon: "../../images/icon-new-list1.png", name: "午餐", typeId: 0 },
    { icon: "../../images/icon-new-list2.png", name: "晚餐", typeId: 1 },
    { icon: "../../images/icon-new-list3.png", name: "训练打卡", typeId: 2 },
    { icon: "../../images/icon-new-list3.png", name: "身体指标", typeId: 3 }],
    xlnavs: {},
    indicatorDots: true,
    multiIndex: 0,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    disabled: false,
    mag: ""//由于公司内部调整，暂时停止网上订餐服务器，详情请咨询 店内老板：17596564965
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var self = this;
    wx.showLoading({
      title: '加载中...',
    })
    app.checkSessionId(this, function (have_session, session_id) {
      if (!have_session) {

        wx.hideLoading()
        wx.redirectTo({
          url: '../../pages/index/index'
        })
      } else {
        app.getWxInfo(session_id, 'seting', function (seting) {
          console.log("main info")
          console.log(seting)
          if (seting && seting['meg'] && seting['meg'] != "") {
            wx.showToast({
              title: seting['meg'],
              icon: "none",
              duration: 1000,
              mask: true
            });
          } else {
            app.checkSessionId(this, function (have_session) {
              console.log('aaaaa')
              wx.hideLoading()
              console.log(have_session)
              if (!have_session) {
                wx.redirectTo({
                  url: '../../pages/index/index'
                })
              }
            })
          }
        })
      }
    })
    wx.request({
      url: app.globalData.url + '/client/show_list',
      method: "GET",
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        self.setData({
          xlnavs: res.data
        })
        
      },
      fail: function (err) {
      }
    })

      
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  imageError: function (event) {
    console.log(event.detail.errMsg);
  },
  catchTapCategory: function (e) {
    var self = this
    var typeid = e.currentTarget.dataset.typeid;
    console.log('goodsId:' + typeid);
    var time = new Date();
    var hour = time.getHours()
    // if ((typeid == 0 && (hour > 8 && hour < 10)) || (typeid == 1&&(hour > 14 && hour < 18))) {
    // if (((typeid == 0) || (typeid == 1)) && (hour >= 10 && hour <= 20)) {
      if (((typeid == 0) || (typeid == 1))) {
        wx.navigateTo({
        url: '../../pages/selectFood/index?timeid=' + typeid + "&meg=" + self.data.mag,
        success: function (res) {
          console.log('onBtnClick success() res:')
        },
        fail: function (err) {
          wx.showToast({
            title: '跳转失败！请稍后再试',
            icon: "none",
            duration: 2000,
            mask: true
          });
        },
        complete: function () {
          console.log('onBtnClick complete() !!!');
        }
      })
    } else {
      if (typeid == 2 || typeid == 3) {
        wx.navigateTo({
          url: '../../pages/developed/developed'
        })
      } else {
        wx.showToast({
          title: '点餐已结束 时间为:10:30-20:00',
          icon: "none",
          duration: 5000,
          mask: true
        });
      }
    }

  }
})