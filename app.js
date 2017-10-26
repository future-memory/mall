//app.js
App({
  onLaunch: function () {
    var that = this;
    //  获取商城名称
    wx.request({
      url: 'https://www.qingchuzhang.com/index.php?mod=site&action=info&domain='+ that.globalData.subDomain,
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
    })
    //this.login();
  },
  login : function () {
    var that = this;
    wx.login({
      success: function () {
        wx.request({
          url: 'https://www.qingchuzhang.com/index.php?mod=oauth&action=weapp_login&domain='+ that.globalData.subDomain,
          success: function(res) {
            if (res.data.code == 201) {
              // 去注册
              that.registerUser();
              return;
            }
            if (res.data.code != 200) {
              return;
            }
            //console.log(res.data.data.token)
            that.globalData.token = res.data.data.token;
          }
        })
      }
    })
  },
  register: function () {
    var that = this;
    wx.login({
      success: function (res) {
        var code = res.code; // 微信登录接口返回的 code 参数，下面注册接口需要用到
        wx.getUserInfo({
          success: function (res) {
            var iv = res.iv;
            var encryptedData = res.encryptedData;
            // 下面开始调用注册接口
            wx.request({
              url: 'https://api.it120.cc/' + that.globalData.subDomain +'/user/wxapp/register/complex',
              data: {code:code,encryptedData:encryptedData,iv:iv}, // 设置请求的 参数
              success: (res) =>{
                wx.hideLoading();
                that.login();
              }
            })
          }
        })
      }
    })
  },
  sendTempleMsg: function (orderId, trigger, template_id, form_id, page, postJsonString){
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + that.globalData.subDomain + '/template-msg/put',
      method:'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: that.globalData.token,
        type:0,
        module:'order',
        business_id: orderId,
        trigger: trigger,
        template_id: template_id,
        form_id: form_id,
        url:page,
        postJsonString: postJsonString
      },
      success: (res) => {
        //console.log('*********************');
        //console.log(res.data);
        //console.log('*********************');
      }
    })
  },
  globalData:{
    userInfo: null,
    subDomain: "mall",
    version: "0.0.1",
    shareProfile: null // 首页转发的时候话术
  }
  // 根据自己需要修改下单时候的模板消息内容设置，可增加关闭订单、收货时候模板消息提醒
})
