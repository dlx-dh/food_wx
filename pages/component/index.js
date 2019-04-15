
var app = getApp();
Page({
  data: {
    text: "Page main",
    background: [
      {
        color: 'green',
        sort: 1
      },
      {
        color: 'red',
        sort: 2
      },
      {
        color: 'yellow',
        sort: 3
      }
    ],
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
    console.log('22222222222222')
    console.log(data)
    console.log(menus.find)
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
    total.money = (parseFloat(total.money)+parseFloat((dish.payout || 0))).toFixed(2)

    console.log('22222222222222')
    console.log(parseFloat((dish.payout || 0) ))
    console.log(parseFloat((dish.payout || 0)))
    console.log((dish.payout || 0).toFixed(2))
    console.log(total)
    console.log(dish.payout)
    this.setData({
      'menus': menus,
      'total': total
    })
    console.log(this.data.menus)
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
    total.money -= parseInt((dish.payout||0).toFixed(2))
    this.setData({
      'menus': menus,
      'total': total
    })
  },
  onLoad: function (options) {
    var self = this
    console.log('compoemt onload')
    console.log(options)
    if (!options['timeid'] || options['timeid'] == "") {
      console.log('1')
      wx.switchTab({
        url: '../../pages/main/main?err=true'
      })
    } else {
      console.log('2')
      self.setData({
        timeid: options['timeid'] || 0
      })
      wx.getStorage({
        key: "session_is",
        success: function (err, session, ) {
          console.log('mysession')
          console.log(err)
          console.log(session)
        }
      })
      wx.request({
        url: app.globalData.url + '/client/product_list',
        method: "GET",
        data: {},
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log('44444444444444');
          console.log(res);
          self.setData({
            menus: res.data
          });
        },
        error: function (err) {
          console.log(err)
        }
      })
    }
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    console.log('222222222')
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
    //

var self=this
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
          console.log(item)
        }
      }
    }
    wx.setStorage({
      key: "selete_item",
      data: {
        seleteItem: seleteItem
      },
      success: function () {
        console.log('写入缓存成功！');
        wx.navigateTo({
          url: '../myOrder/myOrder?timeid=' + self.data.timeid
        })
      },
      fail: function () {
        console.log('写入缓存失败！');
      }
    });
  }
})