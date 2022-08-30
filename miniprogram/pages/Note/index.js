Page({
  data: {
    screenWidth: 1000,
    screenHeight: 1000,

    search: "",

    allMissions: [],          // 所有笔记
    unfinishedMissions: [],   // 未完成笔记
    finishedMissions: [],     // 已完成笔记
    userA: getApp().globalData.userA,
    userB: getApp().globalData.userB,
    
    _openidA : getApp().globalData._openidA,
    _openidB : getApp().globalData._openidB,
    // ToOurLoves\miniprogram\miniprogram_npm\weui-miniprogram\slideview\Images 里修改
    // json 里写了 "mp-slideview": "../../miniprogram_npm/weui-miniprogram/slideview/slideview"
    slideButtons: [
      {extClass: 'marketBtn', text: '完成', src: "Images/icon_love.svg"},       // index === 0
      {extClass: 'beforeBtn', text: '减少', src: "Images/icon_before.svg"},     // index === 1
      {extClass: 'nextttBtn', text: '增加', src: "Images/icon_next.svg"},
      {extClass: 'removeBtn', text: '删除', src: 'Images/icon_del.svg'}
    ],
  },

  //页面加载时运行
  async onShow(){
    // 首先查看云端List中的笔记，据此显示内容
    await wx.cloud.callFunction({name: 'getList', data: {list: getApp().globalData.collectionNoteList}}).then(data => {
      this.setData({allMissions: data.result.data})   // 刷新allMissions的数目
      this.filterMission()
      this.getScreenSize()
    })
  },

  //获取页面大小
  async getScreenSize(){
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          screenWidth: res.windowWidth,
          screenHeight: res.windowHeight
        })
      }
    })
  },

  //转到笔记详情
  async toDetailPage(element, isUpper) {
    const missionIndex = element.currentTarget.dataset.index
    const mission = isUpper ? this.data.unfinishedMissions[missionIndex] : this.data.finishedMissions[missionIndex]
    wx.navigateTo({url: '../NoteDetail/index?id=' + mission._id})
  },
  //转到笔记详情[上]
  async toDetailPageUpper(element) {
    this.toDetailPage(element, true)
  },  
  //转到笔记详情[下]
  async toDetailPageLower(element) {
    this.toDetailPage(element, false)
  },
  //转到添加笔记
  async toAddPage() {
    wx.navigateTo({url: '../NoteAdd/index'})
  },

  //设置搜索
  onSearch(element){
    this.setData({
      search: element.detail.value
    })

    this.filterMission()
  },

  //将笔记划分为：完成，未完成
  filterMission(){
    let missionList = []
    if(this.data.search != ""){
      for(let i in this.data.allMissions){
        if(this.data.allMissions[i].title.match(this.data.search) != null){
          missionList.push(this.data.allMissions[i])
        }
      }
    }else{
      missionList = this.data.allMissions
    }

    this.setData({
      unfinishedMissions: missionList.filter(item => item.available === true),
      finishedMissions: missionList.filter(item => item.available === false),
    })
  },

  //响应左划按钮事件[上]
  async slideButtonTapUpper(element) {
    this.slideButtonTap(element, true)
  },

  //响应左划按钮事件[下]
  async slideButtonTapLower(element) {
    this.slideButtonTap(element, false)
  },

  //响应左划按钮事件逻辑
  async slideButtonTap(element, isUpper){
    //得到UI序号
    const {index} = element.detail

    //根据序号获得笔记
    const missionIndex = element.currentTarget.dataset.index
    const mission = isUpper === true ? this.data.unfinishedMissions[missionIndex] : this.data.finishedMissions[missionIndex]

    await wx.cloud.callFunction({name: 'getOpenId'}).then(async openid => {
        //根据点击的按钮 处理不同的按键事件 ---------------------------------------------------------------------
        //处理完成点击事件
        if (index === 0) {
            if(isUpper) {
                this.finishMission(element)
            }else{
                wx.showToast({
                    title: '笔记已经完成',
                    icon: 'error',
                    duration: 2000
                })
            }

        }else if(mission._openid === openid.result){
            //处理星标按钮点击事件
            if (index === 1) {
                wx.cloud.callFunction({name: 'editChapterNum', data: {_id: mission._id, value: -1, list: getApp().globalData.collectionNoteList}});
                // 需要更新本地数据
                mission.chapterNum = mission.chapterNum - 1;
            }
            else if (index === 2) {
                // 更改指定笔记_id的章节数据, 注意这里是将章节数据写入到 collectionNoteList, 点一次增加1
                wx.cloud.callFunction({name: 'editChapterNum', data: {_id: mission._id, value: 1, list: getApp().globalData.collectionNoteList}});
                // 需要更新本地数据
                mission.chapterNum = mission.chapterNum + 1;
            }
            
            //处理删除按钮点击事件
            else if (index === 3) {
                wx.cloud.callFunction({name: 'deleteElement', data: {_id: mission._id, list: getApp().globalData.collectionNoteList}})
                //更新本地数据
                if(isUpper) this.data.unfinishedMissions.splice(missionIndex, 1) 
                else this.data.finishedMissions.splice(missionIndex, 1) 
                //如果删除完所有事项，刷新数据，让页面显示无事项图片
                if (this.data.unfinishedMissions.length === 0 && this.data.finishedMissions.length === 0) {
                    this.setData({
                    allMissions: [],
                    unfinishedMissions: [],
                    finishedMissions: []
                    })
                }
            }

            //触发显示更新
            this.setData({finishedMissions: this.data.finishedMissions, unfinishedMissions: this.data.unfinishedMissions})

        //如果编辑的不是自己的笔记，显示提醒。除第0个外的其他按键下触发。
        }else{
            wx.showToast({
            title: '乖乖呀，我们只能对自己的笔记进行操作哦~',
            icon: 'none',
            duration: 2000
            })
        }
    })
  },

  //完成笔记
  async finishMission(element) {
    //根据序号获得触发切换事件的待办
    const missionIndex = element.currentTarget.dataset.index
    const mission = this.data.unfinishedMissions[missionIndex]

    await wx.cloud.callFunction({name: 'getOpenId'}).then(async openid => {
      if(mission._openid == openid.result){ // 确认是自己点击自己发布的
        // 完成自己的笔记
        // -- 完成对方笔记，奖金打入对方账号 -- 
        wx.cloud.callFunction({name: 'editAvailable', data: {_id: mission._id, value: false, list: getApp().globalData.collectionNoteList}})
        // 调用云函数更改积分
        // wx.cloud.callFunction({name: 'editCredit', data: {_openid: mission._openid, value: mission.chapterNum, list: getApp().globalData.collectionUserList}})

        //触发显示更新
        mission.available = false
        this.filterMission()      // //将笔记划分为：完成，未完成

        //显示提示
        wx.showToast({
            title: '真棒！笔记完成啦',
            icon: 'success',
            duration: 2000
        })

      }else{
        wx.showToast({
          title: '乖乖呀，我们只能完成自己的笔记哦~',  
          icon: 'none',  // error等限制七个汉字，none不限制
          duration: 2000
        })
      }
    })
  },
})