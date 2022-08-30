Page({
  //保存正在编辑的任务
  data: {
    title: '',
    desc: '',
    rangeArray: [0,10,20,30,40,50,60,70,80,90,100],
    credit: 0,        // 积分
    chapterNum: 0,    // 集数/章节 这里不使用
    maxChapterNum: 0, // 这里不使用
    maxCredit: getApp().globalData.maxCredit,
    presetIndex: 0,
    presets: [{
      name:"暂无预设",
      title:"",
      desc:"",
    },{
      name:"早睡早起",
      title:"早睡早起",
      desc:"今天也要早睡早起呀！",
    },{
      name:"打扫房间",
      title:"打扫房间",
      desc:"有一段时间没有打扫房间了，一屋不扫，何以扫天下？",
    },{
      name:"运动健身",
      title:"运动健身",
      desc:"去健身房，完成规定的腹肌撕裂者、大重量器械以及跑步。",
    },{
      name:"我来做饭",
      title:"我来做饭",
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