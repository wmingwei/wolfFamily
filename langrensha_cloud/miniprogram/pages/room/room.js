//index.js
//获取应用实例
const app = getApp()
const innerAudioContext = wx.createInnerAudioContext({});
Page({
  data: {
    motto: 'Hello World',
    userInfo: app.globalData.userInfo,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    roomId: null,
    role: null,
    roleOrder: null,
    numPlayer: null,

    hiddenmodalput_yuYanJia:true, 
    hiddenmodalput_lang:true, 
    hiddenmodalput_nvWu_save:true,
    hiddenmodalput_nvWu_kill:true,
    hiddenmodalput_shouWei:true,
    hiddenmodalput_huLi:true,
    hiddenmodalput_wuYa:true,
    hiddenmodalput_jinYanZhangLao:true,
    hiddenmodalput_tongLingShi:true,
    hiddenmodalput_eMo:true,
    hiddenmodalput_langMeiRen:true,
    hiddenmodalput_shiXiangGui:true,
    hiddenmodalput_heiBianFu:true,
    hiddenmodalput_huXian:true,
    hiddenmodalput_jiXieLang:true,
    hiddenmodalput_daoZei:true,
    hiddenmodalput_qiuBiTe:true,
    hiddenmodalput_couple:true,
    hiddenmodalput_yeHaiZi:true,
    hiddenmodalput_jiuWeiYaoHu:true,
    hiddenmodalput_jingZhang:true,
    hiddenmodalput_message:true,
    hiddenmodalput_moShuShi:true,

    inputValue: null,
    hidden: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],

    seatTaken: new Array(20),
    seated: false,
    seatNum: null,
    nameChinese:{"yuYanJia": "预言家",
      "nvWu": "女巫",
      "shouWei": "守卫",
      "baiChi": "白痴",
      "qianXingZhe": "潜行者",
      "qiShi": "骑士",
      "sheMengRen": "摄梦人",
      "huLi": "狐狸",
      "wuYa": "乌鸦",
      "xiong": "熊",
      "jinYanZhangLao":"禁言长老",
      "jiuWeiYaoHu": "九尾妖狐",
      "tongLingShi": "通灵师",
      "shouMuRen": "守墓人",
      "moShuShi": "魔术师",
      "lieRen": "猎人",
      "pingMin": "村民",

      "langQiang": "狼枪",
      "yinLang": "隐狼",
      "eMo": "恶魔",
      "langMeiRen": "狼美人",
      "eLingQiShi": "恶灵骑士",
      "shiXiangGui": "石像鬼",
      "heiBianFu": "黑蝙蝠",
      "huXian": "狐仙",
      "jiXieLang": "机械狼",

      "lang": "狼",

      "qiuBiTe": "丘比特",
      "daoZei": "盗贼",
      "yeHaiZi": "野孩子",
      "couple": "所有人"},

    whosTerm: null,
    skillAt: null,
    couple1:null,
    couple2:null,
    moShuShi1: null,
    moshuShi2: null,
    dead: null,
    openOrder: ["daoZei", "qiuBiTe", "couple", "yeHaiZi", "jiXieLang", "moShuShi", "huXian", "lang", "heiBianFu", "shiXiangGui", "langMeiRen", "eMo", "nvWu", "yuYanJia", "huLi", "tongLingShi", "shouWei", "wuYa", "jinYanZhangLao", "jiuWeiYaoHu"],
    openNum: 20,
    currentOpenOrder: null,
    done: false,
    watcher: null,
    gameStarted: false,
    tailsLeft: null,
    message: null,
    roomOwner: null,
    moShuShi_changeNum: null,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad: function(options) {  
    var that = this
    
    
    
    if (options.roomid){
      this.data.roomId = Number(options.roomid)
      this.onQuery(options.roomid)
    }

    const db = wx.cloud.database()
    db.collection('rooms').where({
      roomId: this.data.roomId
    }).watch({
      onChange: function (snapshot) {
        //监控数据发生变化时触发
        // console.log('docs\'s changed events', snapshot.docChanges)
        // console.log('query result snapshot after the event', snapshot.docs[0].numPlayer)
        console.log('is init data', snapshot.type === 'init')
        that.setData({
          numPlayer: snapshot.docs[0].numPlayer,
          seatTaken: snapshot.docs[0].seatTaken,
          roleOrder: snapshot.docs[0].roleOrder,
          dead: snapshot.docs[0].dead,
          whosTerm: snapshot.docs[0].whosTerm,
          gameStarted: snapshot.docs[0].gameStarted
        })
      },
      onError:(err) => {
        console.error(err)
      }
    })    
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  onShow: function(){
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
  },

  onQuery(roomId){
    var that = this
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('rooms').where({
      roomId: Number(roomId)
    }).get({
      success: res => {
        
        if (res.data.length>0){
          var seatNum = null
          var seated = false
          for (i in res.data[0].seatTaken){
            if (res.data[0].seatTaken[i] && app.globalData.userInfo.nickName == res.data[0].seatTaken[i].nickName){
              seated = true
              seatNum = Number(i)
              break
            }
          }
          this.setData({
            numPlayer: res.data[0].numPlayer,
            role: res.data[0].role,
            roleOrder: res.data[0].roleOrder,
            roomId: res.data[0].roomId,
            seated: seated,
            seatTaken: res.data[0].seatTaken,
            seatNum: seatNum,
            dead: res.data[0].dead,
            whosTerm: res.data[0].whosTerm,
            roomOwner: res.data[0].roomOwner,
            
          });
          var hidden = that.data.hidden
          for (var i = 0; i<res.data[0].numPlayer; i++){
            hidden[i] = false
          }
          that.setData({
            hidden: hidden
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

  async onQuerySeat(seatNum){
    var that = this
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('rooms').where({
      roomId: Number(that.data.roomId)
    }).get({
      success: res => {
        

        if (res.data.length>0){
          var seatTaken = res.data[0].seatTaken
          
          if (!Boolean(seatTaken[seatNum])){
            seatTaken[seatNum] = app.globalData.userInfo
            that.onUpdateSeat(seatTaken)
            that.data.seated = true
            that.data.seatNum = seatNum
          }
        }
        else{
          wx.showToast({
            icon: 'none',
            title: '出错了？'
          })
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '出错了？'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  onUpdateSeat(seatTaken){
    var that = this
    const db = wx.cloud.database() 
    this.updateStorage({
      seatTaken: seatTaken
    })
  },
  onTapSeat(event){
    if (!this.data.seated){
     this.onQuerySeat(Number(event.currentTarget.id))
    }
  },

  checkMyRole(){
    if (this.data.seatNum != null){
      wx.showToast({
        icon: 'none',
        title: this.data.nameChinese[this.data.roleOrder[this.data.seatNum]["roleName"]]
      })      
    }
  },

  onClickShuffleRole(){
    var that = this
    if (this.data.roomOwner != app.globalData.userInfo.nickName){
      wx.showToast({
        icon: 'none',
        title: "只有房主可以重新发牌"
      }) 
      return null
    }
    wx.showModal({
			title: '确定要重新发牌吗',
			content: '',
			success: function(res) {
				if (res.confirm) {
          that.shuffleRole()
				} else if (res.cancel) {
				}
			}
		})
  },
  shuffleRole(){

    var that = this
    var roleOrder = shuffle(this.data.roleOrder)
    while (this.data.role["daoZei"] && roleOrder[this.data.numPlayer]["roleName"]==="lang" && roleOrder[this.data.numPlayer+1]["roleName"]=="lang"){
      roleOrder = shuffle(roleOrder)
    }
    wx.cloud.callFunction({
      name: 'updateStorage',
      data: {
        roomId: that.data.roomId,
        data:{
          roleOrder: roleOrder,
          dead:{
            langKill: null,
            nvWuKill: null,
            nvWuSave: false,
            shouWei: null,
            yeHaiZi: null,
            couple: null,
            huXian: null,
            heiBianFu: null,
            langMeiRen: null,
            jinYanZhangLao: null,
            wuYa: null,
            yuYanJia: null,
            moShuShi: null,
          },
          whosTerm: null,
          done: false,
          gameStarted: false
        }
      },
      success: function(res){
        wx.showToast({
          icon: 'none',
          title: "重新发牌完毕"
        })
        that.data.gameStarted = false
      },
      fail: function(err){
        console.log(err)
      }
    })
  },

  useSkill(){
    if (this.data.seatNum === null){
      return 0
    }
    if (this.data.whosTerm === "yuYanJia" && this.data.roleOrder[this.data.seatNum]["roleName"] === "yuYanJia"){
      this.yuYanJiaSkill()
    }
    else if (this.data.whosTerm === "lang" && this.data.roleOrder[this.data.seatNum]["roleName"] === "lang"){
      this.langSkill()
    }
    else if (this.data.whosTerm === "nvWu" && this.data.roleOrder[this.data.seatNum]["roleName"] === "nvWu"){
      this.nvWuSkill()
    }
    else if (this.data.whosTerm === "shouWei" && this.data.roleOrder[this.data.seatNum]["roleName"] === "shouWei"){
      this.shouWeiSkill()
    }
    else if (this.data.whosTerm === "huLi" && this.data.roleOrder[this.data.seatNum]["roleName"] === "huLi"){
      this.huLiSkill()
    }
    else if (this.data.whosTerm === "wuYa" && this.data.roleOrder[this.data.seatNum]["roleName"] === "wuYa"){
      this.wuYaSkill()
    }
    else if (this.data.whosTerm === "jinYanZhangLao" && this.data.roleOrder[this.data.seatNum]["roleName"] === "jinYanZhangLao"){
      this.jinYanZhangLaoSkill()
    }
    else if (this.data.whosTerm === "tongLingShi" && this.data.roleOrder[this.data.seatNum]["roleName"] === "tongLingShi"){
      this.tongLingShiSkill()
    }
    else if (this.data.whosTerm === "eMo" && this.data.roleOrder[this.data.seatNum]["roleName"] === "eMo"){
      this.eMoSkill()
    }
    else if (this.data.whosTerm === "langMeiRen" && this.data.roleOrder[this.data.seatNum]["roleName"] === "langMeiRen"){
      this.langMeiRenSkill()
    }
    else if (this.data.whosTerm === "shiXiangGui" && this.data.roleOrder[this.data.seatNum]["roleName"] === "shiXiangGui"){
      this.shiXiangGuiSkill()
    }
    else if (this.data.whosTerm === "heiBianFu" && this.data.roleOrder[this.data.seatNum]["roleName"] === "heiBianFu"){
      this.heiBianFuSkill()
    }
    else if (this.data.whosTerm === "huXian" && this.data.roleOrder[this.data.seatNum]["roleName"] === "huXian"){
      this.huXianSkill()
    }
    else if (this.data.whosTerm === "jiXieLang" && this.data.roleOrder[this.data.seatNum]["roleName"] === "jiXieLang"){
      this.jiXieLangSkill()
    }
    else if (this.data.whosTerm === "daoZei" && this.data.roleOrder[this.data.seatNum]["roleName"] === "daoZei"){
      this.daoZeiSkill()
    }
    else if (this.data.whosTerm === "qiuBiTe" && this.data.roleOrder[this.data.seatNum]["roleName"] === "qiuBiTe"){
      this.qiuBiTeSkill()
    }
    else if (this.data.whosTerm === "couple" && this.data.dead.couple.includes(this.data.seatNum)){
      this.coupleSkill()
    }
    else if (this.data.whosTerm === "yeHaiZi" && this.data.roleOrder[this.data.seatNum]["roleName"] === "yeHaiZi"){
      this.yeHaiZiSkill()
    }
    else if (this.data.whosTerm === "jiuWeiYaoHu" && this.data.roleOrder[this.data.seatNum]["roleName"] === "jiuWeiYaoHu"){
      this.jiuWeiYaoHuSkill()
    }
    else if (this.data.whosTerm === "moShuShi" && this.data.roleOrder[this.data.seatNum]["roleName"] === "moShuShi"){
      this.moShuShiSkill()
    }
  },

  confirm_jingZhang: function (e) {
    console.log(111)
    var that = this
    // this.message = this.getMessage()
    this.setData({
      message: this.getMessage(),
      hiddenmodalput_jingZhang: true,
      hiddenmodalput_message: false,
   })
   },

   confirm_message: function (e) {
    var that = this
    this.setData({
      hiddenmodalput_message: true,
   })
   },

   moShuShiSkill(){
    this.setData({
      hiddenmodalput_moShuShi: false,
   })
},
confirm_moShuShi: function (e) {
  var that = this
  if (Number.isNaN(this.data.moShuShi1) || this.data.moShuShi1<-1 || !(this.data.moShuShi1<this.data.numPlayer) || Number.isNaN(this.data.moShuShi2) || this.data.moShuShi2<-1 || !(this.data.moShuShi2<this.data.numPlayer)){
    wx.showToast({
      icon: 'none',
      title: "无此玩家"
    })
    return null
  }
  this.data.dead["moShuShi"] = [Number(this.data.moShuShi1), Number(this.data.moShuShi2)]
  wx.cloud.callFunction({
    name: 'updateStorage',
    data: {
      roomId: that.data.roomId,
      data:{
        dead: that.data.dead
      }
    },
    success: function(res){
      wx.showToast({
        icon: 'none',
        title: "换人完毕"
      })  
      that.updateDone()
    },
    fail: function(err){
    }
  })

  this.setData({
    hiddenmodalput_moShuShi: true,
 })
 },

 cancel_moShuShi: function(){
  this.setData({
    hiddenmodalput_moShuShi: true,
 })    
 }, 

moShuShi1: function (e) {
  this.data.moShuShi1 = e.detail.value - 1
},

moShuShi2: function (e) {
 this.data.moShuShi2 = e.detail.value - 1
},


  jiuWeiYaoHuSkill(){
    this.setData({
      tailsLeft: this.getTail(),
      hiddenmodalput_jiuWeiYaoHu: false,
   })
},
confirm_jiuWeiYaoHu: function (e) {
  var that = this
  this.setData({
    hiddenmodalput_jiuWeiYaoHu: true,
 })
 that.updateDone()
 },

 cancel_jiuWeiYaoHu: function(){
  this.setData({
    hiddenmodalput_jiuWeiYaoHu: true,
 })    
 }, 

  yeHaiZiSkill(){
    this.setData({
      hiddenmodalput_yeHaiZi: false,
   })
},
confirm_yeHaiZi: function (e) {
  var that = this
  if (Number.isNaN(this.data.skillAt) || this.data.skillAt<0 || !(this.data.skillAt<this.data.numPlayer)){
    wx.showToast({
      icon: 'none',
      title: "无此玩家"
    })
    return null
  }
  this.data.dead["yeHaiZi"] = this.data.skillAt
  wx.cloud.callFunction({
    name: 'updateStorage',
    data: {
      roomId: that.data.roomId,
      data:{
        dead: that.data.dead
      }
    },
    success: function(res){
      wx.showToast({
        icon: 'none',
        title: "认爹完毕"
      })
      that.updateDone()
    },
    fail: function(err){
    }
  })

  this.setData({
    hiddenmodalput_yeHaiZi: true,
 })
 },

 cancel_yeHaiZi: function(){
  this.setData({
    hiddenmodalput_yeHaiZi: true,
 })    
 }, 


  coupleSkill(){
    this.setData({
      hiddenmodalput_couple: false,
   })
},  
confirm_couple: function (e) {
    this.setData({
      hiddenmodalput_couple: true,
   })
   
   
 },

 cancel_couple: function(){
  this.setData({
    hiddenmodalput_couple: true,
 })    
 },

  qiuBiTeSkill(){
    this.setData({
      hiddenmodalput_qiuBiTe: false,
   })
},
confirm_qiuBiTe: function (e) {
  var that = this
  this.data.dead["couple"] = [Number(this.data.couple1), Number(this.data.couple2)]
  wx.cloud.callFunction({
    name: 'updateStorage',
    data: {
      roomId: that.data.roomId,
      data:{
        dead: that.data.dead
      }
    },
    success: function(res){
      wx.showToast({
        icon: 'none',
        title: "情侣完毕"
      })  
      that.updateDone()
    },
    fail: function(err){
    }
  })

  this.setData({
    hiddenmodalput_qiuBiTe: true,
 })
 },

 cancel_qiuBiTe: function(){
  this.setData({
    hiddenmodalput_qiuBiTe: true,
 })    
 }, 

  daoZeiSkill(){
    this.setData({
      hiddenmodalput_daoZei: false,
   })
},
confirm_daoZei: function (e) {
  var that = this
  var m = this.data.roleOrder[this.data.seatNum]
  this.data.roleOrder[this.data.seatNum] = this.data.roleOrder[this.data.numPlayer]
  this.data.roleOrder[this.data.numPlayer] = m
  wx.cloud.callFunction({
    name: 'updateStorage',
    data: {
      roomId: that.data.roomId,
      data:{
        roleOrder: that.data.roleOrder
      }
    },
    success: function(res){
      wx.showModal({
        title: '你的新身份为',
        
        content: that.data.nameChinese[that.data.roleOrder[that.data.seatNum].roleName],
        success: function(res) {
          if (res.confirm) {
            that.updateDone()
          } else if (res.cancel) {
            that.updateDone()
          }
        },
        fail: err =>{
          console.log(err)
          wx.showToast({
            icon: 'none',
            title: "查无此人"
          })  
        }
      })
    },
    fail: function(err){
    }
  })

  this.setData({
    hiddenmodalput_daoZei: true,
 })
 },

 cancel_daoZei: function (e) {
  var that = this
  var m = this.data.roleOrder[this.data.seatNum]
  this.data.roleOrder[this.data.seatNum] = this.data.roleOrder[this.data.numPlayer+1]
  this.data.roleOrder[this.data.numPlayer+1] = m
  wx.cloud.callFunction({
    name: 'updateStorage',
    data: {
      roomId: that.data.roomId,
      data:{
        roleOrder: that.data.roleOrder
      }
    },
    success: function(res){
      wx.showModal({
        title: '你的新身份为',
        
        content: that.data.nameChinese[that.data.roleOrder[that.data.seatNum].roleName],
        success: function(res) {
          if (res.confirm) {
            that.updateDone()
          } else if (res.cancel) {
            that.updateDone()
          }
        },
        fail: err =>{
          console.log(err)
          wx.showToast({
            icon: 'none',
            title: "查无此人"
          })  
        }
      })
    },
    fail: function(err){
    }
  })

  this.setData({
    hiddenmodalput_daoZei: true,
 })
 },

  jiXieLangSkill(){
    this.setData({
      hiddenmodalput_jiXieLang: false,
   })
},
confirm_jiXieLang: function (e) {
  var that = this
  if (Number.isNaN(this.data.skillAt) || this.data.skillAt<-1 || !(this.data.skillAt<this.data.numPlayer)){
    wx.showToast({
      icon: 'none',
      title: "无此玩家"
    })
    return null
  }
  if (this.data.skillAt === -1){
    this.setData({
      hiddenmodalput_jiXieLang: true,
   })
   that.updateDone()
   return null
  }
  var learnedRole = this.data.roleOrder[this.data.skillAt]["roleName"]
  this.data.roleOrder[this.data.seatNum]["roleNameToTongLingShi"] = learnedRole
  wx.cloud.callFunction({
    name: 'updateStorage',
    data: {
      roomId: that.data.roomId,
      data:{
        roleOrder: this.data.roleOrder
      }
    },
    success: function(res){
      wx.showModal({
        title: '你学到的身份为',
        
        content: that.data.nameChinese[learnedRole],
        success: function(res) {
          if (res.confirm) {
            that.updateDone()
          } else if (res.cancel) {
            that.updateDone()
          }
        },
        fail: err =>{
          wx.showToast({
            icon: 'none',
            title: "查无此人"
          })  
        }
      })
    },
    fail: function(err){
    }
  })

  this.setData({
    hiddenmodalput_jiXieLang: true,
 })
 },

 cancel_jiXieLang: function(){
  this.setData({
    hiddenmodalput_jiXieLang: true,
 })    
 }, 

  huXianSkill(){
    this.setData({
      hiddenmodalput_huXian: false,
   })
},
confirm_huXian: function (e) {
  var that = this
  this.data.dead["huXian"] = this.data.skillAt
  wx.cloud.callFunction({
    name: 'updateStorage',
    data: {
      roomId: that.data.roomId,
      data:{
        dead: that.data.dead
      }
    },
    success: function(res){
      wx.showToast({
        icon: 'none',
        title: "标记完毕"
      }) 
      that.updateDone()
    },
    fail: function(err){
    }
  })

  this.setData({
    hiddenmodalput_huXian: true,
 })
 },

 cancel_huXian: function(){
  this.setData({
    hiddenmodalput_huXian: true,
 })    
 }, 

  heiBianFuSkill(){
    this.setData({
      hiddenmodalput_heiBianFu: false,
   })
},
confirm_heiBianFu: function (e) {
  var that = this
  if (Number.isNaN(this.data.skillAt) || this.data.skillAt<-1 || !(this.data.skillAt<this.data.numPlayer)){
    wx.showToast({
      icon: 'none',
      title: "无此玩家"
    })
    return null
  }
  this.data.dead["heiBianFu"] = this.data.skillAt
  wx.cloud.callFunction({
    name: 'updateStorage',
    data: {
      roomId: that.data.roomId,
      data:{
        dead: that.data.dead
      }
    },
    success: function(res){
      wx.showToast({
        icon: 'none',
        title: "庇护完毕"
      }) 
      that.updateDone()
    },
    fail: function(err){
    }
  })

  this.setData({
    hiddenmodalput_heiBianFu: true,
 })
 },

 cancel_heiBianFu: function(){
  this.setData({
    hiddenmodalput_heiBianFu: true,
 })    
 }, 

  shiXiangGuiSkill(){
    this.setData({
      hiddenmodalput_shiXiangGui: false,
   })
},
confirm_shiXiangGui: function (e) {
  var that = this
  if (Number.isNaN(this.data.skillAt) || this.data.skillAt<0 || !(this.data.skillAt<this.data.numPlayer)){
    wx.showToast({
      icon: 'none',
      title: "无此玩家"
    })
    return null
  }
  wx.showModal({
    title: '此人的身份为',
    
    content: this.data.nameChinese[this.data.roleOrder[this.data.skillAt]["roleNameToTongLingShi"]],
    success: function(res) {
      if (res.confirm) {
        that.updateDone()
      } else if (res.cancel) {
        that.updateDone()
      }
    },
    fail: err =>{
      wx.showToast({
        icon: 'none',
        title: "查无此人"
      })  
    }
  })
  this.setData({
    hiddenmodalput_shiXiangGui: true,
 })
 },

 cancel_shiXiangGui: function(){
  this.setData({
    hiddenmodalput_shiXiangGui: true,
 })    
 },

  langMeiRenSkill(){
    this.setData({
      hiddenmodalput_langMeiRen: false,
   })
},
confirm_langMeiRen: function (e) {
  var that = this
  if (Number.isNaN(this.data.skillAt) || this.data.skillAt<0 || !(this.data.skillAt<this.data.numPlayer)){
    wx.showToast({
      icon: 'none',
      title: "无此玩家"
    })
    return null
  }
  this.data.dead["langMeiRen"] = this.data.skillAt
  wx.cloud.callFunction({
    name: 'updateStorage',
    data: {
      roomId: that.data.roomId,
      data:{
        dead: that.data.dead
      }
    },
    success: function(res){
      wx.showToast({
        icon: 'none',
        title: "睡觉完毕"
      }) 
      that.updateDone()
    },
    fail: function(err){
    }
  })

  this.setData({
    hiddenmodalput_langMeiRen: true,
 })
 },

 cancel_langMeiRen: function(){
  this.setData({
    hiddenmodalput_langMeiRen: true,
 })    
 }, 

  eMoSkill(){
    this.setData({
      hiddenmodalput_eMo: false,
   })
},
confirm_eMo: function (e) {
  var that = this
  if (Number.isNaN(this.data.skillAt) || this.data.skillAt<0 || !(this.data.skillAt<this.data.numPlayer)){
    wx.showToast({
      icon: 'none',
      title: "无此玩家"
    })
    return null
  }
  var identity
  if (this.data.roleOrder[this.data.skillAt]["roleName"] === "pingMin"){
    identity = "平民"
  }
  else{
    identity = "神职"
  }
  wx.showModal({
    title: '此人的身份为',
    
    content: identity,
    success: function(res) {
      if (res.confirm) {
        that.updateDone()
      } else if (res.cancel) {
        that.updateDone()
      }
    },
    fail: err =>{
      wx.showToast({
        icon: 'none',
        title: "查无此人"
      })  
    }
  })
  this.setData({
    hiddenmodalput_eMo: true,
 })
 },

 cancel_eMo: function(){
  this.setData({
    hiddenmodalput_eMo: true,
 })    
 },


  tongLingShiSkill(){
    this.setData({
      hiddenmodalput_tongLingShi: false,
   })
},
confirm_tongLingShi: function (e) {
  var that = this
  if (Number.isNaN(this.data.skillAt) || this.data.skillAt<0 || !(this.data.skillAt<this.data.numPlayer)){
    wx.showToast({
      icon: 'none',
      title: "无此玩家"
    })
    return null
  }
  wx.showModal({
    title: '此人的身份为',
    
    content: this.data.nameChinese[this.data.roleOrder[this.data.skillAt]["roleNameToTongLingShi"]],
    success: function(res) {
      if (res.confirm) {
        that.updateDone()
      } else if (res.cancel) {
        that.updateDone()
      }
    },
    fail: err =>{
      wx.showToast({
        icon: 'none',
        title: "查无此人"
      })  
    }
  })
  this.setData({
    hiddenmodalput_tongLingShi: true,
 })
 },

 cancel_tongLingShi: function(){
  this.setData({
    hiddenmodalput_tongLingShi: true,
 })    
 },

  jinYanZhangLaoSkill(){
    this.setData({
      hiddenmodalput_jinYanZhangLao: false,
   })
},
confirm_jinYanZhangLao: function (e) {
  var that = this
  if (Number.isNaN(this.data.skillAt) || this.data.skillAt<-1 || !(this.data.skillAt<this.data.numPlayer)){
    wx.showToast({
      icon: 'none',
      title: "无此玩家"
    })
    return null
  }
  this.data.dead["jinYanZhangLao"] = this.data.skillAt
  wx.cloud.callFunction({
    name: 'updateStorage',
    data: {
      roomId: that.data.roomId,
      data:{
        dead: that.data.dead
      }
    },
    success: function(res){
      wx.showToast({
        icon: 'none',
        title: "禁言完毕"
      }) 
      that.updateDone()
    },
    fail: function(err){
    }
  })

  this.setData({
    hiddenmodalput_jinYanZhangLao: true,
 })
 },

 cancel_jinYanZhangLao: function(){
  this.setData({
    hiddenmodalput_jinYanZhangLao: true,
 })    
 }, 

  wuYaSkill(){
    this.setData({
      hiddenmodalput_wuYa: false,
   })
},
confirm_wuYa: function (e) {
  var that = this
  if (Number.isNaN(this.data.skillAt) || this.data.skillAt<-1 || !(this.data.skillAt<this.data.numPlayer)){
    wx.showToast({
      icon: 'none',
      title: "无此玩家"
    })
    return null
  }
  this.data.dead["wuYa"] = this.data.skillAt
  wx.cloud.callFunction({
    name: 'updateStorage',
    data: {
      roomId: that.data.roomId,
      data:{
        dead: that.data.dead
      }
    },
    success: function(res){
      wx.showToast({
        icon: 'none',
        title: "诽谤完毕"
      }) 
      that.updateDone()
    },
    fail: function(err){
    }
  })

  this.setData({
    hiddenmodalput_wuYa: true,
 })
 },

 cancel_wuYa: function(){
  this.setData({
    hiddenmodalput_wuYa: true,
 })    
 }, 

  huLiSkill(){
    this.setData({
      hiddenmodalput_huLi: false,
   })
},
confirm_huLi: function (e) {
  var that = this
  if (Number.isNaN(this.data.skillAt) || this.data.skillAt<0 || !(this.data.skillAt<this.data.numPlayer)){
    wx.showToast({
      icon: 'none',
      title: "无此玩家"
    })
    return null
  }
  var message = "没有狼人"
  var middle = this.data.skillAt
  if (this.data.skillAt-1<0){
    var left = this.data.numPlayer-1
  }
  else{
    var left = this.data.skillAt - 1
  }
  if (this.data.skillAt+1===this.data.numPlayer){
    var right = 0
  }
  else{
    var right = this.data.skillAt + 1
  }
  if (this.data.roleOrder[middle]["partyShownToYuYanJia"]==="bad" || this.data.roleOrder[left]["partyShownToYuYanJia"]==="bad" || this.data.roleOrder[right]["partyShownToYuYanJia"]==="bad"){
    message = "有狼人"
  }
  wx.showModal({
    title: '此人及其身边两人中',
    
    content: message,
    success: function(res) {
      if (res.confirm) {
        that.updateDone()
      } else if (res.cancel) {
        that.updateDone()
      }
    },
    fail: err =>{
      wx.showToast({
        icon: 'none',
        title: "查无此人"
      })  
    }
  })
  this.setData({
    hiddenmodalput_huLi: true,
 })
 },

 cancel_huLi: function(){
  this.setData({
    hiddenmodalput_huLi: true,
 })    
 },


  shouWeiSkill(){
    this.setData({
      hiddenmodalput_shouWei: false,
   })
},
confirm_shouWei: function (e) {
  var that = this
  if (Number.isNaN(this.data.skillAt) || this.data.skillAt<-1 || !(this.data.skillAt<this.data.numPlayer)){
    wx.showToast({
      icon: 'none',
      title: "无此玩家"
    })
    return null
  }
  this.data.dead["shouWei"] = this.data.skillAt
  wx.cloud.callFunction({
    name: 'updateStorage',
    data: {
      roomId: that.data.roomId,
      data:{
        dead: that.data.dead
      }
    },
    success: function(res){
      wx.showToast({
        icon: 'none',
        title: "守卫完毕"
      }) 
      that.updateDone()
    },
    fail: function(err){
    }
  })

  this.setData({
    hiddenmodalput_shouWei: true,
 })
 },

 cancel_shouWei: function(){
  this.setData({
    hiddenmodalput_shouWei: true,
 })    
 }, 


  nvWuSkill(){
    this.setData({
      hiddenmodalput_nvWu_save: false,
   })
},  
confirm_nvWu_save: function (e) {
  var that = this
  if (this.data.dead.langKill === Number(this.data.seatNum)){
    wx.showToast({
      icon: 'none',
      title: "不能自救"
    })
  }
  else{
    this.data.dead.nvWuSave = true
    wx.cloud.callFunction({
      name: 'updateStorage',
      data: {
        roomId: that.data.roomId,
        data:{
          dead: that.data.dead
        }
      },
      success: function(res){
        wx.showToast({
          icon: 'none',
          title: "救人完毕"
        })
        that.updateDone() 
      },
      fail: function(err){
      }
    })
    this.setData({
      hiddenmodalput_nvWu_save: true,
   })
  }
 },

 cancel_nvWu_save: function(){
  this.setData({
    hiddenmodalput_nvWu_save: true,
    hiddenmodalput_nvWu_kill: false,
 })    
 },
 confirm_nvWu_kill: function (e) {
  var that = this
  if (Number.isNaN(this.data.skillAt) || this.data.skillAt<-1 || !(this.data.skillAt<this.data.numPlayer)){
    wx.showToast({
      icon: 'none',
      title: "无此玩家"
    })
    return null
  }
  this.data.dead["nvWuKill"] = this.data.skillAt
  wx.cloud.callFunction({
    name: 'updateStorage',
    data: {
      roomId: that.data.roomId,
      data:{
        dead: that.data.dead
      }
    },
    success: function(res){
      wx.showToast({
        icon: 'none',
        title: "下药完毕"
      })
      that.updateDone()
    },
    fail: function(err){
    }
  })

  this.setData({
    hiddenmodalput_nvWu_kill: true,
 })
 },

 cancel_nvWu_kill: function(){
  this.setData({
    hiddenmodalput_nvWu_kill: true,
 })    
 }, 

  yuYanJiaSkill(){
      this.setData({
        hiddenmodalput_yuYanJia: false,
     })
  },
  confirm_yuYanJia: function (e) {
    var that = this
    var party = {"good": "好人阵营", "bad": "狼人阵营"}
    if (Number.isNaN(this.data.skillAt) || this.data.skillAt<0 || !(this.data.skillAt<this.data.numPlayer)){
      wx.showToast({
        icon: 'none',
        title: "无此玩家"
      })
      return null
    }
    var checkNum = this.data.skillAt
    if (that.data.role["moShuShi"] && that.data.dead["moShuShi"] && (that.data.dead["moShuShi"].includes(checkNum))){
      if (Number(that.data.dead["moShuShi"][0])===checkNum){
        checkNum = Number(that.data.dead["moShuShi"][1])
      }
      else{
        checkNum = Number(that.data.dead["moShuShi"][0])
      }
    }
    this.data.dead["yuYanJia"] = checkNum
    this.updateStorage({
      dead: this.data.dead
    })
    wx.showModal({
      title: '此人的阵营为',
      
			content: party[this.data.roleOrder[checkNum]["partyShownToYuYanJia"]],
			success: function(res) {
				if (res.confirm) {
          that.updateDone()
				} else if (res.cancel) {
          that.updateDone()
				}
      },
      fail: err =>{
        wx.showToast({
          icon: 'none',
          title: "查无此人"
        })  
      }
    })
    this.setData({
      hiddenmodalput_yuYanJia: true,
   })
   },

   cancel_yuYanJia: function(){
    this.setData({
      hiddenmodalput_yuYanJia: true,
   })    
   },

   langSkill(){
      this.setData({
        hiddenmodalput_lang: false,
     })
  },
  confirm_lang: function (e) {
    var that = this

    if (Number.isNaN(this.data.skillAt) || this.data.skillAt<-1 || !(this.data.skillAt<this.data.numPlayer)){
      wx.showToast({
        icon: 'none',
        title: "无此玩家"
      })
      return null
    }
    this.data.dead["langKill"] = this.data.skillAt
    wx.cloud.callFunction({
      name: 'updateStorage',
      data: {
        roomId: that.data.roomId,
        data:{
          dead: that.data.dead
        }
      },
      success: function(res){
        wx.showToast({
          icon: 'none',
          title: "杀人完毕"
        })
        that.updateDone()
      },
      fail: function(err){
      }
    })

    this.setData({
      hiddenmodalput_lang: true,
   })
   },

   cancel_lang: function(){
    this.setData({
      hiddenmodalput_lang: true,
   })    
   }, 
  
   numberSkillAt: function (e) {
     this.data.skillAt = Number(e.detail.value)-1
    // this.setData({
    //   skillAt: Number(e.detail.value)-1
    // })
 },

 couple1: function (e) {
   this.data.couple1 = e.detail.value - 1
},

couple2: function (e) {
  this.data.couple2 = e.detail.value - 1
},

play(src){
  innerAudioContext.src = src
  innerAudioContext.play()
},

gameStart:function(e){
  if (this.data.gameStarted){
    wx.showToast({
      icon: 'none',
      title: "游戏已经开始"
    })  
    return null
  }
  if (this.data.roomOwner != app.globalData.userInfo.nickName){
    wx.showToast({
      icon: 'none',
      title: "只有房主可以开始游戏"
    })  
    return null
  }
  var allSeated = true
  for (var i = 0; i<this.data.numPlayer; i++){
    if (!Boolean(this.data.seatTaken[Number(i)])){
      allSeated = false
      break
    }
  }
  if (!allSeated){
    wx.showToast({
      icon: 'none',
      title: "还有位置没有人坐"
    })
    return null
  }
  if (this.data.watcher){
    this.data.watcher.close()
  }
  var src = "/pages/room/soundtrack/天黑请闭眼.mp3"
  this.data.gameStarted = true
  this.data.currentOpenOrder = 0
  this.play(src)
  var currentRole = this.data.openOrder[this.data.currentOpenOrder]
  this.updateStorage({
    whosTerm: currentRole,
    done: false,   
    gameStarted: true
  })

  delay(5000).then(() => {
    this.currentTerm()
})
},


currentTerm(){
  const db = wx.cloud.database()
  var that = this
  that.data.watcher = db.collection('rooms').where({
    roomId: this.data.roomId
  }).watch({
    onChange: function (snapshot) {
      //监控数据发生变化时触发
      // console.log('docs\'s changed events', snapshot.docChanges)
      // console.log('query result snapshot after the event', snapshot.docs[0].numPlayer)
      // console.log('is init data', snapshot.type === 'init')
      // console.log(snapshot)
      if (snapshot.docs[0].done && "updatedFields" in snapshot.docChanges[0] && "done" in snapshot.docChanges[0]["updatedFields"]){
        that.setData({
          numPlayer: snapshot.docs[0].numPlayer,
          seatTaken: snapshot.docs[0].seatTaken,
          roleOrder: snapshot.docs[0].roleOrder,
          dead: snapshot.docs[0].dead,
          whosTerm: snapshot.docs[0].whosTerm,
        })
        var currentRole = that.data.openOrder[that.data.currentOpenOrder]
        var src = "/pages/room/soundtrack/" + that.data.nameChinese[currentRole] + "请闭眼.mp3"
        that.play(src)
        that.data.done = false
        delay(5000).then(() => {
          that.data.currentOpenOrder ++
          that.updateTerm() 
      })
      }
      else if (that.data.currentOpenOrder === 0 && snapshot.type === 'init'){
        that.updateTerm()
      }
    },
    onError:(err) => {
      console.error(err)
    }
  })
},

updateTerm(){
  console.log("loop")
  var that = this
  var currentRole = this.data.openOrder[this.data.currentOpenOrder]
  while ((this.data.currentOpenOrder != this.data.openNum) && !this.data.role[currentRole]){
    this.data.currentOpenOrder = this.data.currentOpenOrder + 1
    currentRole = this.data.openOrder[this.data.currentOpenOrder]
  }
  if (this.data.currentOpenOrder === this.data.openNum){
    // console.log(this.calculateDeath())
    var src = "/pages/room/soundtrack/天亮了.mp3"
    this.play(src)
    that.setData({
      hiddenmodalput_jingZhang: false
    })
    return 0
  }
  else{
    var src = "/pages/room/soundtrack/" + this.data.nameChinese[currentRole] + "请睁眼.mp3"
    that.data.whosTerm = currentRole
    this.updateStorage({
      whosTerm: this.data.whosTerm,
      done: false     
    })
    this.play(src)
    if ((that.data.role["daoZei"] && (that.data.roleOrder[this.data.numPlayer]["roleName"]===currentRole || that.data.roleOrder[this.data.numPlayer+1]["roleName"]===currentRole) && currentRole != "lang") || that.data.whosTerm === "couple"){
      src = "/pages/room/soundtrack/" + this.data.nameChinese[currentRole] + "请闭眼.mp3"
      delay(10000).then(() => {
        that.play(src)
        delay(3000).then(() => {
          this.data.currentOpenOrder++
          
          this.updateTerm()     
      })
    })
    }
  } 
},

updateDone(){
  this.updateStorage({
    done:true
  })  
},

updateStorage(data, f = {}){
  wx.cloud.callFunction({
    name: 'updateStorage',
    data: {
      roomId: this.data.roomId,
      data: data
    },
    success: function(res){
      f
    },
    fail: function(err){
    }
  })
},

checkRoleNum(role){
  for (var i=0; i < this.data.numPlayer; i++){
    if (this.data.roleOrder[i]["roleName"]===role){
      return i
    }
  }
  return null
},

getTail(){
  var dead = this.calculateDeath()
  var tails = 9
  for (var j in dead){
    var i = dead[j]-1
    if (this.data.roleOrder[i]["roleName"]==="pingMin" || this.data.roleOrder[i]["roleName"]==="qiuBiTe" || this.data.roleOrder[i]["roleName"]==="yeHaiZi"){
      tails -= 1
    }
    else if (this.data.roleOrder[i]["partyShownToYuYanJia"] === "good"){
      tails -= 2
    }
  }
  return tails
},
getMessage(){
  var message = []
  var dead = this.calculateDeath()
  if (dead.length){
    message.push("昨晚死亡的玩家是"+String(dead)+"号")
  }
  else{
    message.push("昨晚是平安夜")
  }
  if (this.data.role["wuYa"]){
    if (this.data.dead["wuYa"] != null && this.data.dead["wuYa"] != -1){
      message.push("昨晚被乌鸦诽谤的是"+String(this.data.dead["wuYa"]+1)+"号")
    }
    else{
      message.push("昨晚乌鸦没有诽谤")
    }
  }
  if (this.data.role["jinYanZhangLao"]){
    if (this.data.dead["jinYanZhangLao"] != null && this.data.dead["jinYanZhangLao"] != -1){
      message.push("昨晚被禁言的是"+String(this.data.dead["jinYanZhangLao"]+1)+"号")
    }
    else{
      message.push("昨晚没有人被禁言")
    }
  }
  if (this.data.role["xiong"]){
      var middle = this.checkRoleNum("xiong")
      if (middle-1<0){
        var left = this.data.numPlayer-1
      }
      else{
        var left = middle - 1
      }
      if (middle+1===this.data.numPlayer){
        var right = 0
      }
      else{
        var right = middle + 1
      }
      console.log(middle)
      console.log(left)
      console.log(right)
      if (this.data.roleOrder[middle]["partyShownToYuYanJia"]==="bad" || this.data.roleOrder[left]["partyShownToYuYanJia"]==="bad" || this.data.roleOrder[right]["partyShownToYuYanJia"]==="bad"){
        message.push("昨晚熊咆哮了")
      }
      else{
        message.push("昨晚熊咆哮")
      }
  }
  return message
},

calculateDeath(){
  var deadNum = []
  var that = this
  if (!this.data.role["eLingQiShi"] && !this.data.role["heiBianFu"]){
    //同守同救
    if (this.data.role["nvWu"] && this.data.role["shouWei"] && this.data.dead["nvWuSave"] &&  this.data.dead["langKill"]=== this.data.dead["shouWei"]){
      deadNum.push(this.data.dead["shouWei"])
    }
    //救或守
    if ((this.data.role["nvWu"] && this.data.dead["nvWuSave"]) || (this.data.role["shouWei"] && this.data.dead["shouWei"] === this.data.dead["langKill"])){
    }
    else if (!deadNum.includes(this.data.dead["langKill"]) && this.data.dead["langKill"] != null && this.data.dead["langKill"] != -1){
      var langKill = this.data.dead["langKill"]
      if (that.data.role["moShuShi"] && that.data.dead["moShuShi"] && (that.data.dead["moShuShi"].includes(langKill))){
        if (Number(that.data.dead["moShuShi"][0])===langKill){
          langKill = Number(that.data.dead["moShuShi"][1])
        }
        else{
          langKill = Number(that.data.dead["moShuShi"][0])
        }
      }
      deadNum.push(langKill)
    }
    //女巫开毒
    if (this.data.role["nvWu"] && typeof this.data.dead["nvWuKill"] === "number" && !deadNum.includes(this.data.dead["nvWuKill"]) && this.data.dead["nvWuKill"] != -1){
      deadNum.push(this.data.dead["nvWuKill"])
    }
  }
  //有恶灵骑士
  else if (this.data.role["eLingQiShi"] && !this.data.role["heiBianFu"]){
    var eLingQiShi_num = this.checkRoleNum("eLingQiShi")
    var yuYanJia_num = this.checkRoleNum("yuYanJia")
    var nvWu_num = this.checkRoleNum("nvWu")
    //同守同救
    if (this.data.role["nvWu"] && this.data.role["shouWei"] && this.data.dead["nvWuSave"] &&  this.data.dead["langKill"]=== this.data.dead["shouWei"]){
      deadNum.push(this.data.dead["shouWei"])
    }
    //预言家查恶灵骑士
    if (this.data.role["yuYanJia"] && Number(this.data.dead["yuYanJia"])===eLingQiShi_num){
      if (!deadNum.includes(yuYanJia_num)){
        deadNum.push(yuYanJia_num)
      }
    }
    //女巫毒恶灵骑士
    else if (this.data.role["nvWu"] && Number(this.data.dead["nvWuKill"])===eLingQiShi_num){
      if (!deadNum.includes(nvWu_num)){
        deadNum.push(nvWu_num)
      }     
    }
    if ((this.data.role["nvWu"] && this.data.dead["nvWuSave"]) || (this.data.role["shouWei"] && this.data.dead["shouWei"] === this.data.dead["langKill"])){
    }
    else if (!deadNum.includes(this.data.dead["langKill"]) && this.data.dead["langKill"] != null && this.data.dead["langKill"] != -1){
      deadNum.push(this.data.dead["langKill"])
    }
    //女巫开毒
    if (this.data.role["nvWu"] && typeof this.data.dead["nvWuKill"] === "number" && !deadNum.includes(this.data.dead["nvWuKill"]) && Number(this.data.dead["nvWuKill"])!=eLingQiShi_num && this.data.dead["nvWuKill"] != -1){
      deadNum.push(this.data.dead["nvWuKill"])
    }
  }
  //有黑蝙蝠
  else if (!this.data.role["eLingQiShi"] && this.data.role["heiBianFu"]){
    var biHu_num = this.data.dead["heiBianFu"]
    var shouWei_num = this.checkRoleNum("shouWei")
    var nvWu_num = this.checkRoleNum("nvWu")
    //同守同救
    if (this.data.role["nvWu"] && this.data.role["shouWei"] && this.data.dead["nvWuSave"] &&  this.data.dead["langKill"]=== this.data.dead["shouWei"]){
      deadNum.push(this.data.dead["shouWei"])
    }
    //守卫守护庇护
    if (this.data.role["shouWei"] && Number(this.data.dead["shouWei"])===biHu_num && biHu_num!= -1){
      if (!deadNum.includes(shouWei_num)){
        deadNum.push(shouWei_num)
      }
    }
    else if (this.data.role["nvWu"] && Number(this.data.dead["nvWuKill"])===biHu_num && biHu_num!= -1){
      if (!deadNum.includes(nvWu_num)){
        deadNum.push(nvWu_num)
      }     
    }
    if ((this.data.role["nvWu"] && this.data.dead["nvWuSave"]) || (this.data.role["shouWei"] && this.data.dead["shouWei"] === this.data.dead["langKill"])){
    }
    else if (!deadNum.includes(this.data.dead["langKill"]) && this.data.dead["langKill"] != null && this.data.dead["langKill"] != -1){
      deadNum.push(this.data.dead["langKill"])
    }
    //女巫开毒
    if (this.data.role["nvWu"] && typeof this.data.dead["nvWuKill"] === "number" && !deadNum.includes(this.data.dead["nvWuKill"]) && this.data.dead["nvWuKill"] != -1){
      deadNum.push(this.data.dead["nvWuKill"])
    } 
  }
  if (this.data.role.couple){
    if (deadNum.includes(this.data.dead["couple"][0]) && !deadNum.includes(this.data.dead["couple"][1])){
      dead.push(this.data.dead["couple"][1])
    }
    else if(deadNum.includes(this.data.dead["couple"][1]) && !deadNum.includes(this.data.dead["couple"][0])){
      dead.push(this.data.dead["couple"][0])
    }
  }
  // this.updateStorage({
  //   deadNum:deadNum
  // })
  deadNum.sort((a,b)=>a-b)
  var realDeadNum = []
  for (var i in deadNum){
    realDeadNum.push(deadNum[i] + 1)
  }
  this.updateStorage({
    realDeadNum:realDeadNum
  })
  return realDeadNum
}
})
function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
  }
  return a;
}

function delay(milSec) {
 
  return new Promise(resolve => {
 
    setTimeout(resolve, milSec)
 
  })
 
}