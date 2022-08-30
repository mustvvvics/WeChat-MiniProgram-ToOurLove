Page({
  //保存正在编辑的笔记
  data: {
    title: '',
    desc: '',
    credit: 0,
    chapterNum: '',    // 集数/章节
    maxChapterNum: '', // 最大
    presetIndex: 0,
    presets: [{
      name:"暂无预设",
      title:"",
      desc:"",
    },{
      name:"默认预设",
      title:"默认预设",
      desc:"这里可以填写一些备注信息。",
      chapterNum: 10,
      maxChapterNum: 211,
    },{
      name:"斗破苍穹年番",
      title:"斗破苍穹年番",
      desc:"三十年河东，三十年河西，莫欺少年穷！",
      chapterNum: 6,
      maxChapterNum: 52,
    },{
      name:"民国大侦探",
      title:"民国大侦探",
      desc:"《民国大侦探》是由张伟克执导，胡一天、张云龙、张馨予领衔主演，宣言、沈羽洁等主演的民国单元推理探案剧",
      chapterNum: 20,
      maxChapterNum: 24,
    },{
      name:"斗破苍穹小说",
      title:"斗破苍穹小说",
      desc:"这里是属于斗气的世界，没有花俏艳丽的魔法，有的，仅仅是繁衍到巅峰的斗气！",
      chapterNum: 520,
      maxChapterNum: 1623,
    },{
      name:"长篇小说",
      title:"长篇小说",
      desc:"长篇小说，小说的一种样式。是篇幅长，容量大，情节复杂，人物众多，结构宏伟的一类小说。",
      chapterNum: 520,
      maxChapterNum: 3459,
    }],
    list: getApp().globalData.collectionNoteList,
  },

  //数据输入填写表单
  onTitleInput(e) {
    this.setData({
      title: e.detail.value
    })
  },
  onDescInput(e) {      // 内容
    this.setData({
      desc: e.detail.value
    })
  },
  onInputMaxChapterNum(e) {      // 设置最大值
    this.setData({
      maxChapterNum: e.detail.value,
    })
  },
  onCreditInput(e) {    // 滑动输入初始章节
    this.setData({
      chapterNum: e.detail.value
    });
  },
  onPresetChange(e){
    this.setData({
      presetIndex: e.detail.value,
      title: this.data.presets[e.detail.value].title,
      desc: this.data.presets[e.detail.value].desc,
      chapterNum: this.data.presets[e.detail.value].chapterNum,
      maxChapterNum: this.data.presets[e.detail.value].maxChapterNum,
    })
  },

  //保存笔记
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
    if (this.data.maxChapterNum === '') {
      wx.showToast({
        title: '最大值未填写',
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
    if (this.data.desc.length > 1000) {
      wx.showToast({
        title: '描述过长',
        icon: 'error',
        duration: 2000
      })
      return
    }
    if (this.data.chapterNum === '') {
      wx.showToast({
        title: '当前完成未填写',
        icon: 'error',
        duration: 2000
      })
      return
    }else{  // 添加成功------------------ 调用云函数 addElement 进行添加
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
      chapterNum: 0,
      presetIndex: 0,
      list: getApp().globalData.collectionNoteList,
    })
  }
})