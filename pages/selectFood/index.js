
var app = getApp();
Page({
  data: {
    text: "Page main",
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 3000,
    duration: 1200,
    toView: 'blue',
    'menus': {},
    selectedMenuId: 1,
    total: {
      count: 0,
      money: 0
    },
    "timeid": "0"
  },
  selectMenu: function (event) {
    let data = event.currentTarget.dataset
    console.log('selectMenu')
    console.log(data)
    this.setData({
      toView: data.tag,
      selectedMenuId: data.id
    })
    this.data.toView = 'red'
  },
  addCount: function (event) {
    let data = event.currentTarget.dataset
    let total = this.data.total
    let menus = this.data.menus
    console.log('menus')
    console.log(menus)
    let menu = menus.find(function (v) {
      console.log(v)
      return v._id == data.cid
    })
    let dish = menu.dishs.find(function (v) {
      return v._id == data.id
    })
    dish.count += 1;
    total.count += 1
    total.money = (parseFloat(total.money) + parseFloat((dish.payout || 0))).toFixed(2)
    console.log('total')
    console.log(total)
    this.setData({
      'menus': menus,
      'total': total
    })
  },
  minusCount: function (event) {
    let data = event.currentTarget.dataset
    let total = this.data.total
    let menus = this.data.menus
    let menu = menus.find(function (v) {
      return v._id == data.cid
    })
    let dish = menu.dishs.find(function (v) {
      return v._id == data.id
    })
    if (dish.count <= 0)
      return
    dish.count -= 1;
    total.count -= 1
    total.money = (parseFloat(total.money) - parseFloat((dish.payout || 0))).toFixed(2)
    this.setData({
      'menus': menus,
      'total': total
    })
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "订餐页面"
    })
    wx.showLoading({
      title: '加载中...',
    })
    var self = this
    console.log('compoemt onload')
    console.log(options)
    if (!options['timeid'] || options['timeid'] == "") {
      console.log('1')

      wx.hideLoading()
      wx.switchTab({
        url: '../../pages/main/main?err=true'
      })
    } else {
      console.log('2')
      self.setData({
        timeid: options['timeid'] || 0
      })

      app.checkSessionId(this, function (have_session) {
        if (!have_session) {

          wx.hideLoading()
          wx.redirectTo({
            url: '../../pages/index/index'
          })
        } else {
          wx.request({
            url: app.globalData.url + '/client/product_list',
            method: "GET",
            data: {},
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {

              wx.hideLoading()
              console.log('success /client/product_list')
              self.setData({
                menus: res.data
              });
            },
            fail: function (err) {
              wx.hideLoading()
              console.log('error /client/product_list')
              wx.showToast({
                title: '数据加载失败 请稍后再试！',
                icon: "none",
                duration: 5000,
                mask: true
              });
              wx.switchTab({
                url: '../../pages/main/main'
              })
            }
          })
        }
      })
    }
    // 页面初始化 options为页面跳转所带来的参数
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
  onScroll: function (e) {
    console.log(e)
  },
  goPag: function (event) {
    var self = this
    var seleteItem = []
    let menus = this.data.menus
    for (var i = 0; i < menus.length; i++) {
      var menu = menus[i]
      console.log(menu)
      if (menu.dishs && menu.dishs.length >= 1) {
        var dishs = menu.dishs
        for (var j = 0; j < dishs.length; j++) {
          var item = dishs[j]
          if (item.count >= 1) {
            seleteItem.push(item)
          }
        }
      }
    }
    console.log('seleteItem info')
    console.log(seleteItem)
    if (seleteItem.length > 0) {
      wx.setStorage({
        key: "selete_item",
        data: {
          seleteItem: seleteItem
        },
        success: function () {
          wx.navigateTo({
            url: '../myOrder/myOrder?timeid=' + self.data.timeid
          })
        },
        fail: function () {
          app.toPoint('跳转失败！请稍后再试')
        }
      });
    } else {
      app.toPoint('你还没有选择任何食品，请先选择')
    }
  }
})