var app = getApp();
Page({
  data: {
    name: "",
    mobile: "",
    address: "",
    customers: "",
    session_id: ""
  },
  onLoad(options) {
    var self = this;
    app.checkSessionId(this, function (have_session, session_id) {
      if (!have_session) {
        wx.hideLoading()
        wx.redirectTo({
          url: '../../pages/index/index'
        })
      } else {
        self.setData({
          session_id: session_id,
        })
        wx.request({
          url: app.globalData.url + '/client/get_clients?id=' + session_id,
          method: "GET",
          data: {},
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log('555555555555555555555555');
            console.log(res);
            self.setData({
              name: res.data['name'],
              mobile: res.data['mobile'],
              address: res.data['address'],
              customers: res.data['cid'],
            })
          },
          fail: function (err) {
            app.toPoint('服务器繁忙 请稍后再试')
          }
        })
      }
    })
    wx.request({
      url: app.globalData.url + '/client/get_customers',
      method: "GET",
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log('444444444444444');
        console.log(res);
        self.setData({
          customers_type: res.data,
        })
      },
      fail: function (err) {
        app.toPoint('服务器繁忙 请稍后再试')
      }
    })
  },
  listenerReciverInput(e) {
    this.data.name = e.detail.value;
  },
  listenerPhoneInput(e) {
    this.data.mobile = e.detail.value;
  },
  listenerAddressInput(e) {
    this.data.address = e.detail.value;
  },
  bindStartMultiPickerChange: function (e) {
    var date = this.data.customers_type[e.detail.value]
    this.setData({
      customers: date['_id'],
    })
  },
  submitBtn() {
    const that = this;
    console.log(that.data)
    if (!that.data.session_id) {
      wx.redirectTo({
        url: '../../pages/index/index'
      })
    } else {
      if (!this.data.name) {
        app.toPoint('收货人不能为空');
        return;
      }
      if (this.data.name.length < 2) {
        app.toPoint('收货人姓名限制为2~15个字符');
        return;
      }
      if (!this.data.mobile) {
        app.toPoint('手机号不能为空');
        return;
      }
      if (!/^1[3|4|5|7|8]\d{9}$/.test(this.data.mobile)) {
        app.toPoint('手机格式有误，请重新输入');
        return;
      }
      if (!this.data.customers) {
        app.toPoint('区域不能为空');
        return;
      }
      if (!this.data.address) {
        app.toPoint('区域地址不能为空');
        return;
      }
      wx.request({
        url: app.globalData.url + '/client/update_user_wx',
        method: "POST",
        data: {
          user_id: that.data.session_id,
          name: this.data.name,
          address: this.data.address,
          mobile: this.data.mobile,
          cid: this.data.customers,
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log('success  /client/update_user_wx')
          console.log(res.data)
          app.globalData['user'] = res.data
          wx.navigateBack({
            delta: 1
          })
        },
        fail: function (err) {
          console.log('err  /client/user_wx')
          app.toPoint('服务器繁忙 请稍后再试！ ')
          app.toPoint(err)
        }
      })
    }
  },
  bindPickerChange(e) {
    this.setData({
      index: e.detail.value
    });
  }
});