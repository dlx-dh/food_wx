// pages/my/my.js
var app = getApp();
Page({
  data: {
    userInfo: {},
    array: [{ icon: "../../images/icon-new-list1.png", name: "地址管理", typeId: 0 }]//{ icon: "../../images/icon-new-list1.png", name: "资产", typeId: 0 }
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    app.UserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      });
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    // this.onLoad();
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  goAllOrder: function () {
    wx.switchTab({
      url: '../manageOrders/manageOrders'
    })
  },
  goAddressManager: function () {

  }
})