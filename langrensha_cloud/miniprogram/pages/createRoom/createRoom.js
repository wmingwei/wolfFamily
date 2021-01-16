//index.js
//获取应用实例
const app = getApp()

Page({
	data: {
		// input默认是1
    roomId: 0,
    
    goodParty: ["yuYanJia", "nvWu", "shouWei", "baiChi", "qianXingZhe", "moShuShi", "qiShi","sheMengRen","huLi", "wuYa", "xiong", "jinYanZhangLao", "jiuWeiYaoHu", "tongLingShi", "shouMuRen", "lieRen", "pingMin"],

    wolfParty: ["langQiang", "yinLang", "eMo", "langMeiRen", "eLingQiShi", "shiXiangGui", "heiBianFu", "huXian", "jiXieLang", "lang"],

    thirdParty: ["qiuBiTe", "daoZei", "yeHaiZi"],
    //好人阵营
    role: {
      yuYanJia: false,
      nvWu: false,
      shouWei: false,
      baiChi: false,
      qianXingZhe: false,
      moShuShi:false,
      qiShi: false,
      sheMengRen: false,
      huLi: false,
      wuYa: false,
      xiong: false,
      jinYanZhangLao:false,
      jiuWeiYaoHu: false,
      tongLingshi: false,
      shouMuRen: false,

      lieRen: 0,
      pingMin: 0,

      langQiang: false,
      yinLang: false,
      eMo: false,
      langMeiRen: false,
      eLingQiShi: false,
      shiXiangGui: false,
      heiBianFu: false,
      huXian: false,
      jiXieLang: false,

      lang: 0,

      qiuBiTe: false,
      daoZei: false,
      yeHaiZi: false,
      couple: false,
    },

    lieRen: 0,
    //狼人阵营
    wolfNum: 0,
    wolfKingNum: 0,
    darkKnightNum: 0,
    
		// 使用data数据对象设置样式名
    minusStatus: 'disabled',

    button: {
      yuYanJia: 'button_off',
      nvWu: 'button_off',
      shouWei: 'button_off',
      baiChi: 'button_off',
      qianXingZhe: 'button_off',
      moShuShi: 'button_off',
      qiShi: 'button_off',
      sheMengRen: 'button_off',
      huLi: 'button_off',
      wuYa: 'button_off',
      xiong: 'button_off',
      jinYanZhangLao: 'button_off',
      jiuWeiYaoHu: 'button_off',
      tongLingShi: 'button_off',
      shouMuRen: 'button_off',
      huXian: 'button_off',
      
      lieRen: 'disabled',
      pingMin: 'disabled',

      langQiang: 'button_off',
      yinLang: 'button_off',
      eMo: 'button_off',
      langMeiRen: 'button_off',
      eLingQiShi: 'button_off',
      shiXiangGui: 'button_off',
      heiBianFu: 'button_off',
      huXian: 'button_off',
      jiXieLang: 'button_off',

      lang: 'disabled',

      qiuBiTe: 'button_off',
      daoZei: 'button_off',
      yeHaiZi: 'button_off',
    },
	},
	/* 点击减号 */
	bindMinus: function(event) {
    var roleName = event.currentTarget.id;
    var role = this.data.role;
    var button = this.data.button;
		var num = this.data.role[roleName];
		// 如果大于1时，才可以减
		if (num > 0) {
			num --;
    }
    role[roleName] = num
		// 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num <= 0 ? 'disabled' : 'normal';
    button[roleName] = minusStatus;
		// 将数值与状态写回
		this.setData({
			role: role,
			button: button
		});
	},
	/* 点击加号 */
	bindPlus: function(event) {
    var roleName = event.currentTarget.id;
    var role = this.data.role;
    var button = this.data.button;
		var num = this.data.role[roleName];
		// 不作过多考虑自增1
		num ++;
    role[roleName] = num
		// 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num <= 0 ? 'disabled' : 'normal';
    button[roleName] = minusStatus;
		// 将数值与状态写回
		this.setData({
			role: role,
			button: button
		});
	},
	/* 输入框事件 */
	bindManual: function(e) {
    var num = e.detail.value;
    var roleName = e.currentTarget.id;
    var role = this.data.role;
    var button = this.data.button;

    role[roleName] = num
		// 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num <= 0 ? 'disabled' : 'normal';
    button[roleName] = minusStatus;

		// 将数值与状态写回
		this.setData({
			role: role,
			button: button
		});
  },
  
  changeRoleStatus: function(event){
    var roleName = event.currentTarget.id;
    var role = this.data.role;
    var button = this.data.button;
    var roleStatus = role[roleName];
    if (roleStatus){
      role[roleName] = false;
      button[roleName] = 'button_off';
      this.setData({
        role: role,
        button: button
      });
    }
    else{
      role[roleName] = true;
      button[roleName] = 'button_on';
      this.setData({
        role: role,
        button: button
      });
    }
  },
  async createEmptyRoom(db, numPlayer, roleOrder){
    const roomId = Math.floor(Math.random() * 9000)+1000
    const { data } = await db.collection('rooms')
      .where({roomId:roomId})
        .get()
    if (data.length){
      await this.createEmptyRoom(db, numPlayer, roleOrder)
      return
    }

    let room = {
      roomId: roomId,
      role: this.data.role,
      numPlayer: numPlayer,
      roleOrder: roleOrder,
      seatTaken: new Array(20),
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
      currentOpenOrder: null,
      done: false,
      roomOwner: app.globalData.userInfo.nickName,
      gameStarted: false
    }
    db.collection('rooms').add({
      data: room,
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        // this.setData({
        //   counterId: res._id,
        // })
        wx.showToast({
          title: '新建房间成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        this.data.roomId = roomId
        wx.redirectTo({
          url: '/pages/room/room?roomid='+roomId,
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新建房间失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },
  createRoom: function () {
    var numPlayer = 0;
    var roleOrder = [];

    wx.showLoading({
      title: '房间创建中',
    })
    for (var roleName in this.data.role){
      numPlayer = numPlayer + Number(this.data.role[roleName])
      for (var numCurrentRole=0; numCurrentRole<Number(this.data.role[roleName]);numCurrentRole++){
        var partyShownToYuYanJia = ""
        console.log(roleName)
        if (this.data.goodParty.includes(roleName) || this.data.thirdParty.includes(roleName) || roleName === "yinLang"){
          partyShownToYuYanJia = "good"
        } 
        else{
          partyShownToYuYanJia = "bad"
        }
        var roleDetails = {
          "roleName": roleName,
          "partyShownToYuYanJia": partyShownToYuYanJia,
          "roleNameToTongLingShi": roleName
        }
        roleOrder.push(roleDetails);
      }
      if (roleName === "daoZei" && this.data.role[roleName] == true){
        numPlayer = numPlayer - 2
      }
    }
    if (this.data.role["qiuBiTe"]){
      this.data.role["couple"] = true
    }
    roleOrder = shuffle(roleOrder)
    while (this.data.role["daoZei"] && isDaoZeiIllegal(roleOrder)){
      roleOrder = shuffle(roleOrder)
    }
    const db = wx.cloud.database()
    this.createEmptyRoom(db, numPlayer, roleOrder)
  },
})

function isDaoZeiIllegal(roleOrder) {
  remainingCards = roleOrder.slice(-2)
  if (remainingCards[0]["roleName"] === "lang" && (remainingCards[1]["roleName"] === "lang" || remainingCards[1]["roleName"] === "daoZei")) {
    return true
  }
  if (remainingCards[0]["roleName"] === "daoZei" && remainingCards[1]["roleName"] === "lang") {
    return true
  }
  return false
}

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
