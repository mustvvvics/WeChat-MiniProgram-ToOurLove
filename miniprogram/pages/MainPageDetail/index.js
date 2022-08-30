Page({
  // 保存商品的 _id 和详细信息
  data: {
    _id: '',

    userA: '',
    userB: '',
    lunar: '',
    birthdayA: getApp().globalData.birthdayA,
    birthdayB: getApp().globalData.birthdayB,
    birthdayA_next: getApp().globalData.birthdayA_next,
    birthdayB_next: getApp().globalData.birthdayB_next,

    daysTotal: 0,   // 当前年总共多少天


    days: 0,hours: 0,minutes: 0,seconds: 0,
    daysA: 0,hoursA: 0,minutesA: 0,secondsA: 0,
    daysB: 0,hoursB: 0,minutesB: 0,secondsB: 0,
    daysA_: 0,daysB_: 0,
    date: getApp().globalData.date,
  },

  onLoad(options) {
    // 保存上一页传来的 _id 字段，用于查询商品
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

  countTime(begin) {
    var date_dif = new Date().getTime() - new Date(begin).getTime();   //时间差的毫秒数
    return{
      count_days: Math.floor(date_dif/(24*3600*1000)),
      count_hours: Math.floor(date_dif/(3600*1000) % 24),
      count_minutes: Math.floor(date_dif/(60*1000) % 60),
      count_seconds: Math.floor(date_dif/1000 % 60),

      // count_month: new Date(begin).getMonth()+1,             // 生日月份
      // count_day: new Date(begin).getDate(),                  // 生日到现在已经多少天

    }
  },

  async onShow() {
    
    var obj = this.countTime(this.data.date)
    var objA = this.countTime(this.data.birthdayA)
    var objB = this.countTime(this.data.birthdayB)
    var objA_next = this.countTime(this.data.birthdayA_next)
    var objB_next = this.countTime(this.data.birthdayB_next)
 
    
    this.setData({
      userA: getApp().globalData.userA,
      userB: getApp().globalData.userB,
      //计算出相差天数
      days: obj.count_days,
      hours: obj.count_hours,
      minutes: obj.count_minutes,
      seconds: obj.count_seconds,

      daysA: objA.count_days,
      hoursA: objA.count_hours,
      minutesA: objA.count_minutes,
      secondsA: objA.count_seconds,

      daysB: objB.count_days,
      hoursB: objB.count_hours,
      minutesB: objB.count_minutes,
      secondsB: objB.count_seconds,

      daysA_: -objA_next.count_days,
      daysB_: -objB_next.count_days,
    })
  
  },
})