// pages/orders/orders.js
var md5 = require('../../utils/md5.js');

var app = getApp();
Page({
  data: {
    userAddr: "",
    goodsInf: "",
    goods_total: "",
    userMsg: "",
    addr_flag: '',
    warnInf: '',
    count_flag: true,
    minusStatus: false,
    total: {
      count: 0,
      money: 0
    },
    timeid: ""
  },
  bindMinus: function (event) {
    var that = this;
    if (that.data.count_flag) {
      that.setData({
        count_flag: false
      })
      setTimeout(function () {
        that.setData({
          count_flag: true
        })
      }, 1000)
      wx.showToast({
        title: '计算总额中...',
        icon: 'loading',
        duration: 1000
      })
      console.log(event)
      let data = event.currentTarget.dataset

      let goods_amount = this.data.goods_amount || 0
      let goods_total = this.data.goods_total || 0
      let goodsInf = this.data.goodsInf
      let menu = goodsInf.find(function (v) {
        return v._id == data.id
      })
      if (menu.count <= 0)
        return
      menu.count -= 1;
      goods_amount -= menu.payout||0
      console.log(menu)
      console.log(goodsInf)
      this.setData({
        'goodsInf': goodsInf,
        'goods_amount': goods_amount.toFixed(2),
        goods_total: goods_amount.toFixed(2)
      })
      wx.hideToast();
    } else {
      that.myToast("您点击的太快了，休息一下再试！");
    }
  },
  bindPlus: function (event) {
    var that = this;
    if (that.data.count_flag) {
      that.setData({
        count_flag: false
      })
      setTimeout(function () {
        that.setData({
          count_flag: true
        })
      }, 1000)
      wx.showToast({
        title: '计算总额中...',
        icon: 'loading',
        duration: 1000
      })
      console.log(event)
      let data = event.currentTarget.dataset

      let goods_amount = this.data.goods_amount || 0
      let goods_total = this.data.goods_total || 0
      let goodsInf = this.data.goodsInf
      let menu = goodsInf.find(function (v) {
        return v._id == data.id
      })
      if (menu.count <= 0)
        return
      menu.count += 1;
      goods_amount += (menu.count||1)*(menu.payout||0)
      console.log('33333333333333333')
      console.log(menu)
      console.log(goodsInf)
      this.setData({
        'goodsInf': goodsInf,
        'goods_amount': goods_amount.toFixed(2),
        goods_total: goods_amount.toFixed(2)
      })
      wx.hideToast();
    } else {
      that.myToast("您点击的太快了，休息一下再试！");
    }
  },
  bingInputForUserMag: function (e) {
    this.setData({
      userMsg: e.detail.value
    })
  },
  myToast: function (inf) {
    var that = this;
    if (inf) {
      that.setData({
        warnInf: inf
      });
      setTimeout(function () {
        that.setData({
          warnInf: '',
        });
      }, 2000);
    }
  },
  toWXPay: function (e) {
    //test 
    // wx.redirectTo({
    //   url: '../orderDetails/orderDetails?order_id=5c9635b194eef1087c325111'
    // })
    // console.log(e)
    var self = this;
    let goodsInf = self.data.goodsInf
    // if (that.data.addr_flag) {
    wx.getStorage({
      key: "session_id",
      success: function (res) {
        console.log("session_id:")
        console.log(res.data)
        var session_id = res.data.session_id;
        var url = app.globalData.url + '/client/to_order';
        wx.request({
          url: url,
          data: {
            food_info: JSON.stringify(goodsInf),
            session_id: session_id,
            user_msg: self.data.userMsg,
            timeid: self.data.timeid
          },
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: function (res, data) {
            console.log(res)
            console.log(data)
            var order_id = res.data.order_id
            if (res.statusCode == 200) {
              wx.redirectTo({
                url: '../orderDetails/orderDetails?order_id=' + order_id
              })
            } else if (res.data.result_code == 'FAIL') {
              self.myToast('提交订单失败!');
            }
          }
        })
      },
      fail: function (res) {
        console.log("用户登录未登录，获取地址失败!")
      }
    })


    // } else {
    //   that.myToast("请添加收货人地址！");
    //   setTimeout(function () {
    //     wx.navigateTo({
    //       url: '../manageAddrList/manageAddrList'
    //     })
    //   }, 2000);
    // }
  },
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: "session_id",
      success: function (res) {
        console.log("session_id:")
        console.log(res.data)
        var session_id = res.data.session_id;


        if (!options['timeid'] || options['timeid'] == "") {
          console.log('1')
          wx.switchTab({
            url: '../../pages/main/main?err=true'
          })
        } else {
          console.log('2')
          that.setData({
            timeid: options['timeid'] || 0
          })
          var userInfo = app.globalData.userInfo
          wx.getStorage({
            key: "session_id",
            success: function (err, session, ) {
              console.log('mysession')
              console.log(err)
              console.log(session)
            }
          })
          var aaa = wx.getStorageSync('userinfo');
          console.log('555555555555555555')
          console.log(aaa)
          console.log(userInfo)
          wx.setNavigationBarTitle({
            title: "我的订单"
          })
          that.setData({
            order_id: options.order_id || 0
          })
          wx.getStorage({
            key: "selete_item",
            success: function (res) {
              console.log('333333333333')
              var seleteItem = res.data.seleteItem;
              console.log(seleteItem)
              var goods_amount = that.data.goods_amount || 0
              for (var i = 0; i < seleteItem.length; i++) {
                goods_amount += (seleteItem[i]['count'] || 1) * (seleteItem[i]['payout'] || 0)
              }
              if (seleteItem && seleteItem.length > 1) {
                that.setData({
                  goodsInf: seleteItem,
                  minusStatus: true,
                  goods_count: seleteItem.length,
                  goods_amount: goods_amount.toFixed(2),
                  goods_total: goods_amount.toFixed(2)
                })
              } else {
                that.setData({
                  goodsInf: seleteItem,
                  goods_count: seleteItem.length,
                  goods_amount: goods_amount.toFixed(2),
                  goods_total: goods_amount.toFixed(2)
                })
              }
            },
            error: function (er) {
              console.log('222222222222')
              console.log(er)
            }
          })
        }
      },
      fail: function () {
        wx.navigateTo({
          url: "../index/index"
        })
      }
    })
  },
  onShow: function () {
    var that = this;
    //获取session
    wx.getStorage({
      key: "session",
      success: function (res) {
        var session = res.data.session;
        var url = 'https://shop.llzg.cn/weapp/showaddr.php?act=order&' + "session_id=" + session;
        wx.request({
          url: url,
          data: {},
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: function (res) {
            if (res.data.address == '') {
              that.setData({
                addr_flag: false
              });
            } else if (res.data.consignee) {
              that.setData({
                userAddr: res.data,
                addr_flag: true
              });
            } else {
              console.log("服务器故障!!")
            }
          }
        })
      },
      fail: function (res) {
        console.log("用户登录未登录，获取地址失败!")
      }
    })
  }
})