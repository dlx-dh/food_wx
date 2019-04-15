// pages/main/main.js
var util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
    imgUrls: [
      'zc/DSC_3501.jpg',
      '744d90f13096c06e7bc97d4e1a97ff4b.jpg',
      '2612dfc6af5b8976fb73a04df9c212d3.jpg'
    ],
    navs: [{ icon: "../../images/icon-new-list1.png", name: "午餐", typeId: 0 },
    { icon: "../../images/icon-new-list2.png", name: "晚餐", typeId: 1 },
    { icon: "../../images/icon-new-list3.png", name: "训练打卡", typeId: 2 },
    { icon: "../../images/icon-new-list3.png", name: "身体指标", typeId: 3 }],
    xlnavs: [{ img: "a12230326c89a046db9d868d629e9814.jpg", name: "合理搭配" },
    { img: "b59f22ddaeda5d2de5f295a6d23e68d2.jpg", name: "补充能量" },
    { img: "97bfb78527fc925a5fb7edb9822b5733.jpg", name: "修身养性" },
    { img: "266b99d027f909037bd01ccb9e7e9403.jpg", name: "营养健康" }],
    indicatorDots: true,
    multiIndex: 0,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    disabled: false
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数

    wx.showLoading({
      title: '加载中...',
    })

    wx.clearStorage()
    app.checkSessionId(this, function (have_session) {
      console.log('aaaaa')
      wx.hideLoading()
      console.log(have_session)
      if (!have_session) {
        wx.redirectTo({
          url: '../../pages/index/index'
        })
      } else {

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
  imageError: function (event) {
    console.log(event.detail.errMsg);
  },
  catchTapCategory: function (e) {
    var self = this
    console.log('catchTapCategory')
    var typeid = e.currentTarget.dataset.typeid;
    console.log('goodsId:' + typeid);
    var time = new Date();
    var hour = time.getHours()
    // if ((typeid == 0 && (hour > 8 && hour < 10)) || (typeid == 1&&(hour > 14 && hour < 18))) {
    if ((typeid == 0) || (typeid == 1)) {
      wx.navigateTo({
        url: '../../pages/selectFood/index?timeid=' + typeid,
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
          title: '点餐已结束 时间为:中餐：8：00-10:00 晚餐：14:00-18:00',
          icon: "none",
          duration: 5000,
          mask: true
        });
      }
    }

  }
})