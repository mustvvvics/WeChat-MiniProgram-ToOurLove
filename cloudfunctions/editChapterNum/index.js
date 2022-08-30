// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ // 初始化云开发环境
  env: cloud.DYNAMIC_CURRENT_ENV // 当前环境的常量
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (context) => {
  //更改章节数
  return await db.collection(context.list).where({
    _id: context._id    // 修改的是指定的笔记
  }).update({
    data: {
      chapterNum: db.command.inc(context.value) // 自增 value 这样的值
    }
  })
}