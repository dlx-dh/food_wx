// pages/main/main.js
var util = require('../../utils/util.js');
Page({
  data:{
    imgUrls: [
      'zc/DSC_3501.jpg',
      '744d90f13096c06e7bc97d4e1a97ff4b.jpg',
      '2612dfc6af5b8976fb73a04df9c212d3.jpg'
    ],
    navs: [{ icon: "../../images/icon-new-list1.png", name: "午餐",  typeId: 0 },
      { icon: "../../images/icon-new-list2.png", name: "晚餐", typeId: 1 },
      { icon: "../../images/icon-new-list3.png", name: "训练打卡", typeId: 2 },
      { icon: "../../images/icon-new-list3.png", name: "身体指标", typeId: 3 }],
    xlnavs: [{ img: "a12230326c89a046db9d868d629e9814.jpg", name: "合理搭配" },
      { img: "b59f22ddaeda5d2de5f295a6d23e68d2.jpg", name: "补充能量" },
      { img: "97bfb78527fc925a5fb7edb9822b5733.jpg", name: "修身养性"},
      { img: "266b99d027f909037bd01ccb9e7e9403.jpg", name: "营养健康"}],
    indicatorDots: true,
    multiIndex: 0,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    disabled:false
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    
    console.log('main onload')
    console.log(options)
    if (options['err']){
      that.myToast("操作失败！请重新再试！");
    }
    wx.getStorage({
      key:"session_id",
      success:function(err,session,){
        console.log('session')
        console.log(err)
        console.log(session)
      }
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  goIndexPage: function() {
    wx.navigateTo({
      url: '../index/index'
    });
  },
  imageError: function(event) {
    console.log(event.detail.errMsg);
  },
  catchTapCategory: function (e) {
    var self=this
    console.log('2222222222222222222')
    var typeid = e.currentTarget.dataset.typeid;
    console.log('goodsId:' + typeid);
    var time = new Date();
    var hour = time.getHours() 
    if ((typeid == 0 || typeid == 1)) {//&& ((hour > 8&&hour< 10 )||(hour > 14 && hour < 18))
      wx.navigateTo({
        url: '../../pages/component/index?timeid=' + typeid,
             success: function (res) {
                 console.log('onBtnClick success() res:')
             },
             fail: function (err) {
               console.log(err)
                 console.log('onBtnClick fail() !!!');
             },
             complete: function () {
                 console.log('onBtnClick complete() !!!');
                 // complete
             }
         })
    }else{
      if (typeid == 2 || typeid == 3) {
        console.log('555555555')
        wx.navigateTo({
          url: '../../pages/developed/developed'
        })
      } else{
        wx.showToast({
          title:'点餐已结束 时间为:中餐：8：00-10:00 晚餐：14:00-18:00',
          icon:"none",
          duration:5000,
          mask:true
          });
      }
    }
    
  },
  bindStartMultiPickerChange:function(e){
    var date = this.data.multiArray[0][e.detail.value[0]]
    var hours = this.data.multiArray[1][e.detail.value[1]]
    var minute = this.data.multiArray[2][e.detail.value[2]]
    wx.showModal({
      title: '提示',
      content: '确认在 '+date + ' ' + hours + '时' + minute+'分 给你送餐？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
    // wx.showToast({
    //   title: e.detail.value+"",
    //   icon: 'loading',
    //   duration: 10000
    // })
  },
  itemrTap:function(e){
    console.log('333333333333333333333')

    console.log(e)
  }
})