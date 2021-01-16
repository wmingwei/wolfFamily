//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    roomId: null,
    role: null,
    roleOrder: null,
    numPlayer: null,

    hiddenmodalput:false,
    inputValue: null,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad: function() { 
  },

  onQuery(roomId){
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('rooms').where({
      roomId: Number(roomId)
    }).get({
      success: res => {
        
        if (res.data.length>0){
          wx.redirectTo({
            url: '/pages/room/room?roomid='+roomId,
          })
          console.log('房间进入')
        }
        else{
          wx.showToast({
            icon: 'none',
            title: '没有此房间'
          })
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '房间进入失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  modalinput:function(event){
    this.setData({
    // hiddenmodalput: !this.data.hiddenmodalput,
    inputValue: event.detail.value
    })
    },
  cancel: function(){
      wx.navigateBack()
    },
  confirm: function(){
    this.onQuery(this.data.inputValue)
  }
})
