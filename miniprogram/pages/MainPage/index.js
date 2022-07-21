/* Main page of the app */
Page({
    data: {
        creditA: 0,
        creditB: 0,

        userA: '',
        userB: '',
        date: '',

        days: 0,
        sentences: ["你在哪里，家就在哪里","牵了手就不能松开了，这是我们的约定","我最喜欢的一个词，叫“我们”","世界从来不会辜负可爱的人，而我们如此可爱","我能做的不多，但你需要的时候，我总是在的","自从我们相遇的那一刻，你是我白天黑夜不落的星","愿未来所有好时光都有你相伴","只希望，我们都不要收敛对彼此的爱意"],
        lenOfSentences: 0,
    },

    async onShow(){
        this.setData({
            userA: getApp().globalData.userA,
            userB: getApp().globalData.userB,
            lenOfSentences: this.data.sentences.length,
            date: getApp().globalData.date,     
        })
        this.getCreditA()
        this.getCreditB()
        this.getDays()
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
        //计算出相差天数
        this.setData({
            days: Math.floor(date3/(24*3600*1000))
        })
    },
})