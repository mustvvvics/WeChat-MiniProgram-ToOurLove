Page({
  data: {
    screenWidth: 1000,
    screenHeight: 1000,
    
    search: "",
    allMissions: [],          // 所有任务
    unfinishedMissions: [],   // 未完成任务
    finishedMissions: [],     // 已完成任务
    missionPattern: 1,

    _openidA : getApp().globalData._openidA,
    _openidB : getApp().globalData._openidB,

    slideButtons: [
      {extClass: 'markBtn', text: '标记', src: "Images/icon_mark.svg"},
      {extClass: 'starBtn', text: '星标', src: "Images/icon_star.svg"},
      {extClass: 'removeBtn', text: '删除', src: 'Images/icon_del.svg'}
    ],
  },
  // 校准时间
  getDate(dateStr){
    const milliseconds = Date.parse(dateStr)
    const date = new Date()
    date.setTime(milliseconds)
    return date
  },
  //页面加载时运行
  async onShow(){
    // 这是获得所有的
    await wx.cloud.callFunction({name: 'getList', data: {list: getApp().globalData.collectionMissionList}}).then(data => {
      for(let i in data.result.data){
        data.result.data[i].date = this.getDate(data.result.data[i].date).toDateString();
      }
      // console.log(data.result.data)
      this.setData({
        allMissions: data.result.data,
      })
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

  //转到任务详情
  async toDetailPage(element, isUpper) {
    const missionIndex = element.currentTarget.dataset.index
    const mission = isUpper ? this.data.unfinishedMissions[missionIndex] : this.data.finishedMissions[missionIndex]
    wx.navigateTo({url: '../MissionDetail/index?id=' + mission._id})
  },
  //转到任务详情[上]
  async toDetailPageUpper(element) {
    this.toDetailPage(element, true)
  },  
  //转到任务详情[下]
  async toDetailPageLower(element) {
    this.toDetailPage(element, false)
  },
  //转到添加任务
  async toAddPage() {
    wx.navigateTo({url: '../MissionAdd/index'})
  },

  //设置搜索
  onSearch(element){
    this.setData({
      search: element.detail.value
    })
    this.filterMission()
  },
  //将任务划分为：完成，未完成
  filterMission(){
    let missionList = []
    if(this.data.search != ""){ // 如果有搜索
      for(let i in this.data.allMissions){
        if(this.data.allMissions[i].title.match(this.data.search) != null){
          missionList.push(this.data.allMissions[i])
        }
      }
    }else{
      missionList = this.data.allMissions
    }
    this.setData({
      unfinishedMissions: missionList.filter(item => item.available === true),  // 用item 来表示原先查询到的missionList
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

    //根据序号获得任务
    const missionIndex = element.currentTarget.dataset.index
    const mission = isUpper === true ? this.data.unfinishedMissions[missionIndex] : this.data.finishedMissions[missionIndex]

    await wx.cloud.callFunction({name: 'getOpenId'}).then(async openid => {

        //处理完成点击事件
        if (index === 0) {
            if(isUpper) {
                this.finishMission(element)
            }else{
                wx.showToast({
                    title: '任务已经完成',
                    icon: 'error',
                    duration: 2000
                })
            }

        }else if(mission._openid === openid.result){
            //处理星标按钮点击事件
            if (index === 1) {
                wx.cloud.callFunction({name: 'editStar', data: {_id: mission._id, list: getApp().globalData.collectionMissionList, value: !mission.star}})
                //更新本地数据
                mission.star = !mission.star
            }
            
            //处理删除按钮点击事件
            else if (index === 2) {
                wx.cloud.callFunction({name: 'deleteElement', data: {_id: mission._id, list: getApp().globalData.collectionMissionList}})
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

        //如果编辑的不是自己的任务，显示提醒
        }else{
            wx.showToast({
            title: '只能编辑自己的任务',
            icon: 'error',
            duration: 2000
            })
        }
    })
  },

  //完成任务
  async finishMission(element) {
    //根据序号获得触发切换事件的待办
    const missionIndex = element.currentTarget.dataset.index
    const mission = this.data.unfinishedMissions[missionIndex]

    await wx.cloud.callFunction({name: 'getOpenId'}).then(async openid => {  // 从云端获得 _opneid 保存到res
      // 从云端获取missionPattern 保存在 data.result.data[0].missionPattern
      await wx.cloud.callFunction({name: 'getMissionPattern', data: {_id: mission._id, list: getApp().globalData.collectionMissionList}}).then(async data => {  
        // 如果任务是 对方创建的 且 模式是 “给自己的任务”
        if(mission._openid != openid.result && data.result.data[0].missionPattern == 1){ 
          // eg:女朋友发布任务mission._openid，男朋友openid.result确认女朋友完成了任务，积分加到女朋友账号mission._openid
          wx.cloud.callFunction({name: 'editAvailable', data: {_id: mission._id, value: false, list: getApp().globalData.collectionMissionList}})
          wx.cloud.callFunction({name: 'editCredit', data: {_openid: mission._openid, value: mission.credit, list: getApp().globalData.collectionUserList}})

          //触发显示更新
          mission.available = false
          this.filterMission()

          //显示提示
          wx.showToast({
              title: '任务完成',
              icon: 'success',
              duration: 2000
          })

        }
        // 如果任务是 自己创建的 且 模式是 “给对方的任务”
        else if(mission._openid == openid.result && data.result.data[0].missionPattern == 2){
          // eg:女朋友发布任务mission._openid，女朋友openid.result确认男朋友完成了任务，积分加到男朋友账号
          wx.cloud.callFunction({name: 'editAvailable', data: {_id: mission._id, value: false, list: getApp().globalData.collectionMissionList}})
            if (openid.result == this.data._openidB) {  // 打开页面的是女生，则加到男朋友账号
              wx.cloud.callFunction({name: 'editCredit', data: {_openid: this.data._openidA, value: mission.credit, list: getApp().globalData.collectionUserList}})
            }
            else if (openid.result == this.data._openidA) { // 打开页面的是男生，则加到女朋友账号
              wx.cloud.callFunction({name: 'editCredit', data: {_openid: this.data._openidB, value: mission.credit, list: getApp().globalData.collectionUserList}})
            }
            else {
              wx.showToast({
                title: '发生错误',
                icon: 'error',
                duration: 2000
              })
            }
            //触发显示更新
            mission.available = false
            this.filterMission()

            //显示提示
            wx.showToast({
                title: '任务完成',
                icon: 'success',
                duration: 2000
            })
        }
        else{
          wx.showToast({
            title: '不能确认此任务',
            icon: 'error',
            duration: 2000
          })
        }

      })
    })
  },
})