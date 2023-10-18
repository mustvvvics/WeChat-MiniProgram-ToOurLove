/* Main page of the app */
Page({
    data: {
        screenWidth: 1000,  // 匹配打卡按钮的位置
        screenHeight: 1000,

        creditA: 0,
        creditB: 0,

        userA: '',
        userB: '',
        date: '',
        missYouA: 0,     // 想对方几天
        missYouB: 0,

        day: 0,
        dayA: 0,
        dayB: 0,
        days: 0,
        sentences: getApp().globalData.sentences,
        lenOfSentences: 0,
        missYouBtnDisable: false,
    },
    async onShow(){
        this.setData({
            userA: getApp().globalData.userA,
            userB: getApp().globalData.userB,
            lenOfSentences: this.data.sentences.length, // 原本根据进行随机，现修改成了 days % 10
            date: getApp().globalData.date,             // 设定的相恋日
        })
        this.getScreenSize()
        this.getDays()
        this.getMissYouA()
        this.getMissYouB()
        this.getCreditA()
        this.getCreditB()
        this.getDayA()
        this.getDayB()
    },
    // 获取页面大小，当移动想你按钮，下次加载到该页面才能切换回原位置
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
    // 获取之前打卡的日期
    getDayA(){
        wx.cloud.callFunction({name: 'getElementByOpenId', data: {list: getApp().globalData.collectionUserList, _openid: getApp().globalData._openidA}})
        .then(res => {
          this.setData({dayA: res.result.data[0].day})
        })
    },
    
    getDayB(){
        wx.cloud.callFunction({name: 'getElementByOpenId', data: {list: getApp().globalData.collectionUserList, _openid: getApp().globalData._openidB}})
        .then(res => {
            this.setData({dayB: res.result.data[0].day})
        })
    },
    // 从获取积分
    getMissYouA(){
        wx.cloud.callFunction({name: 'getElementByOpenId', data: {list: getApp().globalData.collectionUserList, _openid: getApp().globalData._openidA}})
        .then(res => {
            this.setData({
                missYouA: res.result.data[0].missYou,
                creditA: res.result.data[0].credit
            })
        })
    },
    
    getMissYouB(){
        wx.cloud.callFunction({name: 'getElementByOpenId', data: {list: getApp().globalData.collectionUserList, _openid: getApp().globalData._openidB}})
        .then(res => {
            this.setData({
                missYouB: res.result.data[0].missYou,
                creditB: res.result.data[0].credit
            })
        })
    },
    // 改collectionUserList的 missYou
    changeMissYou(result) {
        // 数据推送云端，完成增加
        wx.cloud.callFunction({name: 'editMissYou', data: {_openid: result, value: 1, list: getApp().globalData.collectionUserList}}).then(
            () => {
                // 把云端day数据刷新
                wx.cloud.callFunction({name: 'editMissYouDay', data: {_openid: result, value: this.data.day, list: getApp().globalData.collectionUserList}})
                // 每日想你的奖励
                wx.cloud.callFunction({name: 'editCredit', data: {_openid: result, value: 1, list: getApp().globalData.collectionUserList}})
                //  需要更新本地数据
                this.getMissYouA()
                this.getMissYouB()
                wx.showToast({
                    title: '我也想你呀宝贝',
                    icon: 'success',
                    duration: 2000
                }).then(()=>{this.setData({missYouBtnDisable: false})})
            }
        )
    },
    // 每天想你 async异步特性
    async toMissYou() { // 28 != 29 可以点击
        this.setData({missYouBtnDisable: true})
        wx.showToast({
            title: '正在加载..',
            icon: 'loading',
            mask: true,
            duration: 2000
          });   
        // 返回当前用户的身份信息  结果用 openid.result 表示
        wx.cloud.callFunction({name: 'getOpenId'}).then(async openid => {
            // 对_openidA 数据进行更改
            if (openid.result == getApp().globalData._openidA) {
                if (this.data.day > 0 && this.data.day != this.data.dayA) {
                    this.setData({dayA: this.data.day})
                    this.changeMissYou(openid.result)
                }
                else {  // 29 = 29
                    wx.showToast({
                        title: '已经完成啦',
                        icon: 'error',
                        duration: 1000
                    }).then(()=>{this.setData({missYouBtnDisable: false})})
                }                
            }
            // 对_openidB 数据进行更改
            else if (openid.result == getApp().globalData._openidB) {
                if (this.data.day > 0 && this.data.day != this.data.dayB) {
                    this.setData({dayB: this.data.day})
                    this.changeMissYou(openid.result)
                }
                else {  // 29 = 29
                    wx.showToast({
                        title: '已经完成啦',
                        icon: 'error',
                        duration: 1000
                    }).then(()=>{this.setData({missYouBtnDisable: false})})
                }
            }
        })
    },

    // 点击进行纪念日跳转
    async toMainPageCheckDetail() {
        wx.navigateTo({url: '../MainPageDetail/index'})
    },

    getCreditA(){
        wx.cloud.callFunction({name: 'getElementByOpenId', data: {list: getApp().globalData.collectionUserList, _openid: getApp().globalData._openidA}})
        .then(res => {
          this.setData({creditA: res.result.data[0].credit})
        })
    },
    
    getCreditB(){
        wx.cloud.callFunction({name: 'getElementByOpenId', data: {list: getApp().globalData.collectionUserList, _openid: getApp().globalData._openidB}})
        .then(res => {
            this.setData({creditB: res.result.data[0].credit})
        })
    },
    getDays(){
        var date1= this.data.date;  //开始时间
        var date2 = new Date();    //结束时间
        var date3 = date2.getTime() - new Date(date1).getTime();   //时间差的毫秒数  
        var date4 = date2.getHours();//获得当日的小时
        var date5 = date2.getDate();    // 当月的第几天
        this.setData({
            //计算出相差天数
            days: Math.floor(date3/(24*3600*1000)),
            day: date5,
        })
        // 判断不同时间段
        if(date4 >= 6 && date4 < 11){           // 06 - 10
            this.setData({time_quantum: '早上好呀'})
        }else if(date4 >= 11 && date4 < 14){    // 11 - 13
            this.setData({time_quantum: '中午好呀'})
        }else if(date4 >= 14 && date4 < 19){    // 14 - 18
            this.setData({time_quantum: '下午好呀'})
        }else if(date4 >=19 && date4 <= 24){    // 19 - 24
            this.setData({time_quantum: '晚上好呀'})
        }else{
            this.setData({time_quantum: '不许熬夜咯'})
        }
    },
})