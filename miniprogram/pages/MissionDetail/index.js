Page({
  // 保存任务的 _id 和详细信息
  data: {
    _id: '',
    mission: null,
    dateStr: '',
    timeStr: '',
    creditPercent: 0,
    from: '',
    to: '',
    missionPattern: 0,
    maxCredit: getApp().globalData.maxCredit,
    list: getApp().globalData.collectionMissionList,
  },

  onLoad(options) { // onLoad:页面加载时触发。一个页面只会调用一次
    // 保存上一页传来的 _id 字段，用于查询任务
    if (options.id !== undefined) {
      this.setData({
        _id: options.id
      })
    }
  },
  
  getDate(dateStr){
    const milliseconds = Date.parse(dateStr)
    const date = new Date()
    date.setTime(milliseconds)
    return date
  },

  // 根据 _id 值查询并显示任务
  async onShow() {  // 页面载入后触发onShow方法，显示页面。
    if (this.data._id.length > 0) {
      // 根据 _id 拿到任务
      await wx.cloud.callFunction({name: 'getElementById', data: this.data}).then(data => {
        // 将任务保存到本地，更新显示
        this.setData({
          // 根据点开项目的id查询的 只有一个 即result.data[0]
          mission: data.result.data[0],
          dateStr: this.getDate(data.result.data[0].date).toDateString(),
          timeStr: this.getDate(data.result.data[0].date).toTimeString(),
          creditPercent: (data.result.data[0].credit / getApp().globalData.maxCredit) * 100,
          missionPattern: data.result.data[0].missionPattern,
        })

        //确定任务关系并保存到本地
        if(this.data.mission._openid === getApp().globalData._openidA){
          this.setData({
            from: getApp().globalData.userA,
            to: getApp().globalData.userB,
          })
        }else if(this.data.mission._openid === getApp().globalData._openidB){
          this.setData({
            from: getApp().globalData.userB,
            to: getApp().globalData.userA,
          })
        }
      })
    }
  },
})