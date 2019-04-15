const app = getApp();

Page({
  data: {
    userInfo: {},
    order: {
      icon: 'images/order.png',
      text: '我的订单',
      tip: '',
      url: '../manageOrders/manageOrders?t=all'
    },
    // 收货数量
    orderBadge: {
      unpaid: 0,
      undelivered: 0,
      unreceived: 0
    },
    orderCell: [
      {
        icon: 'images/to-be-paid.png',
        text: '待付款',
        url: '../manageOrders/manageOrders?t=unpaid',
        class: 'order-cell-icon-small'
      }, {
        icon: 'images/to-be-delivered.png',
        text: '已付款',
        url: '../../manageOrders/manageOrders?t=paid',
        class: 'order-cell-icon-small',
      }, {
        icon: 'images/to-be-received.png',
        text: '全部订单',
        url: '../../manageOrders/manageOrders?t=all',
        class: 'order-cell-icon-big'
      }
    ],
    list: [
      {
        icon: 'images/address.png',
        text: '地址管理',
        tip: '',
        cut: true,
        url: '../address-edit/address-edit'
      }, {
        icon: 'images/tel.png',
        text: '客服电话',
        tip: '17596564965',
      }
      // , {
      //   icon: 'images/feedback.png',
      //   text: '意见反馈',
      //   tip: '',
      //   cut: true,
      //   url: '../feedback/feedback'
      // }
      // , {
      //   icon: 'images/about.png',
      //   text: '关于商城',
      //   tip: '',
      //   url: '../about/about'
      // }
    ],
    session_id:"",
    address:{}
  },
  countOrder(orderList) {
    /* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
    // this.orderBadge = { unpaid: 0, undelivered: 0, unreceived: 0 };
    // for (let i = orderList.length - 1; i >= 0; i--) {
    //   switch (orderList[i].order_status) {
    //   case '待支付': this.orderBadge.unpaid += 1; break;
    //   case '待发货': this.orderBadge.undelivered += 1; break;
    //   case '待收货': this.orderBadge.unreceived += 1; break;
    //   default: break;
    //   }
    // }
    // this.data.orderCell[0].count = this.orderBadge.unpaid;
    // this.data.orderCell[1].count = this.orderBadge.undelivered;
    // this.data.orderCell[2].count = this.orderBadge.unreceived;
    // this.setData({
    //   orderBadge: this.orderBadge,
    //   orderCell:this.data.orderCell
    // });
  },
  //点击触发
  onShow(){
    // this.countOrder(orderList);
    // resource.fetchOrderList().then((res) => {
    //   const orderList = res.data;
    //   this.countOrder(orderList);
    // });
     this.setData({
      userInfo: app.globalData.userInfo
    });
  },
  onLoad() {
    var that = this;
    app.checkSessionId(this, function (have_session, session_id) {
      if (!have_session) {
        wx.hideLoading()
        wx.redirectTo({
          url: '../../pages/index/index'
        })
      } else {
        that.setData({
          session_id: session_id,
        })
        app.getWxInfo(session_id,'usr_info', function (userInfo) {
          if (userInfo && userInfo['name'] && userInfo['mobile'] && userInfo['address'] && userInfo['cid']) {
            self.setData({
              usr_info: userInfo
            })
          }
        })
      }
    })
    app.UserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      });
    })
  },
  navigateTo(e) {
    const url = e.currentTarget.dataset.url;
    console.log(e.currentTarget.dataset.urlType)
    console.log(url)
    if (e.currentTarget.dataset.urlType) {
      
    } else {
      if (url === undefined) {
        wx.makePhoneCall({
          phoneNumber: e.currentTarget.dataset.tip
        });
      } else {
        // wx.switchTab({
        //   url: url
        // })
        wx.navigateTo({
          url: url,
          success:function(err,data){
            console.log('success')
            console.log(err)
            console.log(data)
          },
          fail: function (err, data) {
            console.log('fail')
            console.log(err)
            console.log(data)
          },
          complete: function (err, data) {
            console.log('complete')
            console.log(err)
            console.log(data)
          }
        });
      }
    }
  }
});
