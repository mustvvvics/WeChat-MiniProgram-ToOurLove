Page({
  //保存正在编辑的商品
  data: {
    title: '',
    desc: '',
    rangeArray: [0,10,20,30,40,50,60,70,80,90,100,200,300,400], // 积分数值
    credit: 0,        // 积分
    chapterNum: 0,    // 集数/章节 这里不使用
    maxChapterNum: 0, // 这里不使用
    missionPattern: 0, // 任务模式 这里不使用
    maxCredit: getApp().globalData.maxCredit,
    presetIndex: 0,
    presets: [{
        name:"暂无预设",
        title:"",
        desc:"",
    },{
        name:"零食券",
        title:"零食券",
        desc:"诱人的零食，看剧绝佳伴侣！凭此商品可以向对方索要零食。",
    },{
        name:"奶茶券",
        title:"奶茶券",
        desc:"凭此券可以向对方索要一杯奶茶。",
    },{
        name:"夜宵券",
        title:"夜宵券",
        desc:"凭此券可以让自己在夜里狂野干饭。",
    },{
        name:"外卖券",
        title:"外卖券",
        desc:"凭此券可以让对方为心爱的人点一次外卖！",
    },{
        name:"洗碗券",
        title:"洗碗券",
        desc:"凭此券可以让对方洗碗一次！若都有洗碗券则互相抵消。",
    },{
        name:"家务券",
        title:"家务券",
        desc:"凭此券可以让对方做一次轻型家务，比如扔垃圾，打扫一个的房间，领一天外卖什么的。",
    },{
        name:"早起券",
        title:"早起券",
        desc:"凭此券可以让对方早起床一次。熬夜对身体很不好，还是要早点睡觉第二天才能有精神！",
    },{
        name:"减肥券",
        title:"减肥券",
        desc:"凭此券可以逼迫对方做一次运动，以此来达到减肥维持健康的目的。",
    },{
        name:"礼物券",
        title:"礼物券",
        desc:"凭此券可以让对方买点小礼物，像泡泡马特什么的。",
    }],
    list: getApp().globalData.collectionMarketList,
  },

  //数据输入填写表单
  onTitleInput(e) {
    this.setData({
      title: e.detail.value
    })
  },
  onDescInput(e) {
    this.setData({
      desc: e.detail.value
    })
  },
  onCreditInput(e) {
    const val = e.detail.value;
    this.setData({
      credit: this.data.rangeArray[val[0]]
    });
  },
  onPresetChange(e){
    this.setData({
      presetIndex: e.detail.value,
      title: this.data.presets[e.detail.value].title,
      desc: this.data.presets[e.detail.value].desc,
    })
  },

  //保存商品
  async saveItem() {
    // 对输入框内容进行校验
    if (this.data.title === '') {
      wx.showToast({
        title: '标题未填写',
        icon: 'error',
        duration: 2000
      })
      return
    }
    if (this.data.title.length > 12) {
      wx.showToast({
        title: '标题过长',
        icon: 'error',
        duration: 2000
      })
      return
    }
    if (this.data.desc.length > 100) {
      wx.showToast({
        title: '描述过长',
        icon: 'error',
        duration: 2000
      })
      return
    }
    if (this.data.credit <= 0) {
      wx.showToast({
        title: '一定要有积分',
        icon: 'error',
        duration: 2000
      })
      return
    }else{
        wx.showToast({
          title: '正在保存..',
          icon: 'loading',
          mask: true,
          duration: 1000
        });
        await wx.cloud.callFunction({name: 'addElement', data: this.data}).then(
            () => {
                wx.showToast({
                    title: '添加成功',
                    icon: 'success',
                    duration: 500
                })
            }
        )
        setTimeout(function () {
            wx.navigateBack()
        }, 500)
    }
  },

  // 重置所有表单项
  resetItem() {
    this.setData({
      title: '',
      desc: '',
      credit: 0,
      presetIndex: 0,
      list: getApp().globalData.collectionMarketList,
    })
  },
})