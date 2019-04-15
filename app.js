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
    console.log("page:" + self.route)
    wx.getStorage({
      key: "session_id",
      success: function (res) {
        console.log("session_id:")
        console.log(res.data)
        var session_id = res.data.session_id;

        if (session_id && session_id != "") {
          cb(true,session_id)
        } else {
          cb(false,session_id)
        }
      },
      fail: function () {
        cb(false,null)
      }
    })
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
  toPoint:function(meg){
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