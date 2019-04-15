//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    wx.getNetworkType({
      success: function (res) {
        console.log(res.networkType);
        if (res.networkType == 'none') {
          wx.showModal({
            title: '警告⚠️',
            content: '请您连接网络后再使用本程序！',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定。');
              } else {
                console.log('用户点击取消。');
              }
            }
          });
        }
      }
    });
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  checkSessionId: function (self, cb) {
    console.log('checkSessionId')
    wx.getStorage({
      key: "session_id",
      success: function (res) {
        console.log("session_id:")
        console.log(res.data)
        var session_id = res.data.session_id;
        if (session_id && session_id != "") {
          cb(true, session_id)
        } else {
          cb(false, session_id)
        }
      },
      fail: function () {
        cb(false, null)
      }
    })
  },

  getWxInfo: function (user_id,type,cb) {
    var that = this
    console.log('getWxInfo  getWxInfo： ' + user_id)
    var wxInfo = that.globalData[type];
    console.log('555555555555555555555555555555555555')
    console.log(wxInfo)
    if (wxInfo) {
      wx.request({
        url: that.globalData.url + '/client/wx_info?user_id=' + user_id,
        method: "GET",
        data: {},
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log('1333333333333333333333333333333')
          console.log(res.data)
          that.globalData['peice'] = res.data['peice']
          that.globalData['seting'] = res.data['seting']
          that.globalData['user'] = res.data['user']
        },
      })
      cb(wxInfo)
    } else {
      wx.request({
        url: that.globalData.url + '/client/wx_info?user_id=' + user_id,
        method: "GET",
        data: {},
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log('2333333333333333333333333333333')
          console.log(res.data)
          that.globalData['peice'] = res.data['peice']
          that.globalData['seting'] = res.data['seting']
          that.globalData['user'] = res.data['user']
          cb(that.globalData[type])
        },
        fail: function (err) {
          cb({})
        }
      })
    }
  },
  UserInfo: function (cb) {
    var that = this
    console.log(this.globalData)
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        success: function (res) {
          console.log(res)
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },
  toPoint: function (meg) {
    console.log(meg)
    wx.showToast({
      title: meg,
      icon: "none",
      duration: 2000,
      mask: true
    });
  },
  globalData: {
    userInfo: null,
    url: 'https://www.chunjianshidai.top'
  }
})

// url: 'https://www.chunjianshidai.top'
// url: 'http://localhost:6073'