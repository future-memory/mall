//app.js
App({
  onLaunch: function () {
    var that = this;
    //  获取商城名称
    var mallName = wx.getStorageSync('mallName');
    if(!mallName){
      wx.request({
        url: that.globalData.domain + 'index.php?mod=site&action=info&domain='+ that.globalData.subDomain,
        data: {
          key: 'mallName'
        },
        success: function(res) {
          var code = res.data.code;
          var data = res.data.data;
          if (code == 200) {
            wx.setStorageSync('mallName', data.name);
            that.globalData.shareProfile = data.intro;
          }
        }
      });
    }
    var token = this.getToken();
    if(!token){
      this.login();
    }
  },
  getToken: function(){
    var data = wx.getStorageSync('authTokenInfo');
    var timestamp = Date.parse(new Date()) / 1000; 

    if (data && data.token && data.expireAt>timestamp){
      return data.token;
    }
  },
  login : function () {
    var that = this;
    wx.login({
      success: function (res) {
        var code = res.code;
        wx.request({
          url: that.globalData.domain + 'index.php?mod=oauth&action=weapp_login&domain='+ that.globalData.subDomain,
          data: {code: code},
          success: function(res) {
            if (res.data.code == 200) {
              //注册或更新用户名等信息
              that.register(code);
              return;
            }           
          }
        })
      }
    })
  },
  register: function (code) {
    var that = this;
      wx.getUserInfo({
        success: function (res) {
          var iv = res.iv;
          var encryptedData = res.encryptedData;
          // 下面开始调用注册接口
          wx.request({
            url: that.globalData.domain + 'index.php?mod=oauth&action=weapp_reg&domain' + that.globalData.subDomain,
            data: {code:code, encryptedData:encryptedData, iv:iv}, // 设置请求的 参数
            success: function(res){
              console.log(res);
              console.log(res.data.code);
              if(res.data.code==200){
                that.globalData.token = res.data.data.token;
                var a = wx.setStorageSync('authTokenInfo', res.data.data);
                console.log(res.data.data);
                console.log(a);
              }
              wx.hideLoading();
            }
          })
        }
      })
  },
  globalData:{
    userInfo: null,
    subDomain: "mall",
    version: "0.0.1",
    domain: "https://www.qingchuzhang.com/",
    shareProfile: null // 首页转发的时候话术
  }
  // 根据自己需要修改下单时候的模板消息内容设置，可增加关闭订单、收货时候模板消息提醒
})
