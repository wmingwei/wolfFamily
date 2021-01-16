// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}

exports.main = async(event, context) =>{
  await db.collection('rooms').where({
    roomId: event.roomId
  }).update({
    data: event.data,
    success: res => {
    },
    fail: err => {
    } 
  })
  
  // updateItem = event.updateItem
  // if (updateItem === "seatTaken"){
  // await db.collection('rooms').where({
  //         roomId: event.roomId
  //       }).update({
  //         data: {
  //           seatTaken: event.seatTaken
  //         },
  //         success: res => {
  //         },
  //         fail: err => {
  //         }
          
  //       })
  //     }
  // else if (updateItem === "roleOrder"){
  //   await db.collection('rooms').where({
  //     roomId: event.roomId
  //   }).update({
  //     data: {
  //       roleOrder: event.roleOrder
  //     },
  //     success: res => {
  //     },
  //     fail: err => {
  //     }
      
  //   })
  // }   
  // else if (updateItem === "dead"){
  //   await db.collection('rooms').where({
  //     roomId: event.roomId
  //   }).update({
  //     data: {
  //       dead: event.dead
  //     },
  //     success: res => {
  //     },
  //     fail: err => {
  //     }
      
  //   })
  // } 
  // else if (updateItem === "whosTerm"){
  //   await db.collection('rooms').where({
  //     roomId: event.roomId
  //   }).update({
  //     data: {
  //       whosTerm: event.whosTerm,
  //       done: event.done
  //     },
  //     success: res => {
  //     },
  //     fail: err => {
  //     }
      
  //   })
  // } 
  // else if (updateItem === "done"){
  //   await db.collection('rooms').where({
  //     roomId: event.roomId
  //   }).update({
  //     data: {
  //       done: event.done
  //     },
  //     success: res => {
  //     },
  //     fail: err => {
  //     }
      
  //   })
  // } 
  // else if (updateItem === "test"){
  //   await db.collection('rooms').where({
  //     roomId: event.roomId
  //   }).update({
  //     data: event.data,
  //     success: res => {
  //     },
  //     fail: err => {
  //     }
      
  //   })
  // } 
}