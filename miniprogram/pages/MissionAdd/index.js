Page({
  //保存正在编辑的任务
  data: {
    title: '',
    desc: '',
    rangeArray: [0,10,20,30,40,50,60,70,80,90,100],
    credit: 0,
    maxCredit: getApp().globalData.maxCredit,
    presetIndex: 0,
    presets: [{
      name:"无预设",
      title:"",
      desc:"",
    },{
      name:"早睡早起",
      title:"今晚早睡，明天早起",
      desc:"熬夜对身体很不好，还是要早点睡觉第二天才能有精神！",
    },{
      name:"打扫房间",
      title:"打扫房间，整理卫生",
      desc:"有一段时间没有打扫房间了，一屋不扫，何以扫天下？",
    },{
      name:"运动健身",
      title:"做些运动，强身健体",
      desc:"做一些健身运动吧，跳绳，跑步，训练动作什么的。",
    },{
      name:"戒烟戒酒",
      title:"烟酒不解真愁",
      desc:"维持一段时间不喝酒，不抽烟，保持健康生活！",
    },{
      name:"请客吃饭",
      title:"请客吃点好的",
      desc:"好吃的有很多，我可以让你尝到其中之一，好好享受吧！",
    },{
      name:"买小礼物",
      title:"整点小礼物",
      desc:"买点小礼物，像泡泡马特什么的。",
    },{
      name:"洗碗洗碟",
      title:"这碗碟我洗了",
      desc:"有我洗碗洗碟子，有你吃饭无它事。",
    },{
      name:"帮拿东西",
      title:"帮拿一天东西",
      desc:"有了我，你再也不需要移动了。拿外卖，拿零食，开空调，开电视，在所不辞。",
    },{
      name:"做饭",
      title:"这道美食由我完成",
      desc:"做点可口的饭菜，或者专门被指定的美食。我这个大厨，随便下，都好吃。",
    }],
    list: getApp().globalData.collectionMissionList,
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

  //保存任务
  async saveMission() {
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
        await wx.cloud.callFunction({name: 'addElement', data: this.data}).then(
            () => {
                wx.showToast({
                    title: '添加成功',
                    icon: 'success',
                    duration: 1000
                })
            }
        )
        setTimeout(function () {
            wx.navigateBack()
        }, 1000)
    }
  },

  // 重置所有表单项
  resetMission() {
    this.setData({
      title: '',
      desc: '',
      credit: 0,
      presetIndex: 0,
      list: getApp().globalData.collectionMissionList,
    })
  }
})