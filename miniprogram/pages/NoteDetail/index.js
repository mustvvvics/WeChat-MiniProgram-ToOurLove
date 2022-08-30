Page({
  // 保存笔记的 _id 和详细信息
  data: {
    _id: '',
    mission: null,    
    dateStr: '',
    timeStr: '',
    creditPercent: 0,
    desc: '',
    from: '',
    to: '',
    chapterNum_: 0,  // 中转值
    Chapter_one: [0,1,2,3,4,5,6,7,8,9],
    Chapter_ten: [0,1,2,3,4,5,6,7,8,9],
    Chapter_hundred: [0,1,2,3,4,5,6,7,8,9],
    Chapter_thousand: [0,1,2,3,4,5,6,7,8,9],
    list: getApp().globalData.collectionNoteList,
  },

  onLoad(options) { // onLoad:页面加载时触发。一个页面只会调用一次
    // 保存上一页传来的 _id 字段，用于查询笔记
    if (options.id !== undefined) {
      this.setData({
        _id: options.id   // 返回的是笔记的id
      })
    }
  },
  getDate(dateStr){
    const milliseconds = Date.parse(dateStr)
    const date = new Date()
    date.setTime(milliseconds)
    return date
  },
  
  // 根据 _id 值向云端进行查询并显示笔记
  // this.data.mission._openid 是表示创建这个笔记的所属者的id
  async onShow() { // // 页面载入后触发onShow方法，显示页面。
    if (this.data._id.length > 0) {
      // 根据 _id 拿到整个笔记
      await wx.cloud.callFunction({name: 'getElementById', data: this.data}).then(data => {
        // 将笔记保存到本地，更新显示
        this.setData({
          mission: data.result.data[0], // 一个组合,里面包含了chapterNum
          dateStr: this.getDate(data.result.data[0].date).toDateString(),
          timeStr: this.getDate(data.result.data[0].date).toTimeString(),
          creditPercent: (data.result.data[0].chapterNum / data.result.data[0].maxChapterNum) * 100,
        })
        //确定笔记关系并保存到本地
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
  // https://developers.weixin.qq.com/miniprogram/dev/component/picker-view.html
  async onChapterNumInput(e) {    // 滑动设置章节
    // 查询此刻点开的openid是谁的
    await wx.cloud.callFunction({name: 'getOpenId'}).then(async openid => {
      // 如果openid与笔记归属的一致则可编辑
      if (openid.result === this.data.mission._openid) {
        const val = e.detail.value; // 滑动的值
        this.setData({  
          chapterNum_: this.data.Chapter_thousand[val[0]]*1000 + this.data.Chapter_hundred[val[1]]*100 + this.data.Chapter_ten[val[2]]*10 + this.data.Chapter_one[val[3]]   
        });
        if (this.data.chapterNum_ >= 0 && this.data.chapterNum_ < this.data.mission.maxChapterNum) {
          wx.cloud.callFunction({name: 'setChapterNum', data: {_id: this.data._id, value: this.data.chapterNum_, list: getApp().globalData.collectionNoteList}});
        }
        else {
          wx.showToast({
            title: '已超出最大进度',
            icon: 'error',
            duration: 1000
          })
          // 还原初始
          this.setData({
            chapterNum_: 0,
          })
          return
        }
      }
      else {
        wx.showToast({
          title: '乖乖呀，我们只能对自己的笔记进行操作哦~',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
})