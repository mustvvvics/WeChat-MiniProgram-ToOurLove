App({
  async onLaunch() {
    this.initcloud()

    this.globalData = {
      //记录使用者的openid
      _openidA: '',
      _openidB: '',

      //记录使用者的名字
      userA: '男孩',
      userB: '女孩',

      date: '2022/05/22 00:00:00',
      birthdayA: '2000/01/01 00:00:00',
      birthdayB: '2000/01/01 00:00:00',       // 新历出生
      birthdayA_next: '2023/01/01 00:00:00',  
      birthdayB_next: '2023/01/01 00:00:00',  // 每年生日

      //用于存储待办记录的集合名称
      collectionMissionList: 'MissionList',
      collectionMarketList: 'MarketList',
      collectionStorageList: 'StorageList',
      collectionUserList: 'UserList',
      collectionNoteList: 'NoteList',

      //最多单次交易积分
      maxCredit: 500,
      // 每日一句
      sentences: [    // 一共10句， 0~9
        '你是晚夏遗留在深海里的星星，想把我所有的温柔碾碎了撒给你。',
        '大概是晚秋了，这橘子也是有些苦涩，但记起昨夜梦里的你，总归还是甜了一些。',
        '分享欲是最高级的浪漫主义。我们彼此回应，就是加倍浪漫。',
        '就像小王子的星球因玫瑰的降落而重获光彩，我们也应彼此相遇而不孤单。',
        '草在结它的种子，风在摇它的叶子，我们站着，不说话，就十分美好。',
        '我喜欢林间山野的鹿，山野平川的向日葵，青瓦屋顶的白鸽，还有你。',
        '你若齐眉举案，给我嘘寒问暖，我便重惜轻怜，护你一世长安。',
        '人们从诗人的字句里，选取自己心爱的意义，但诗句的最终意义是指向你。',
        '我大约真的没什么才华，只是有幸遇到了你，于是这颗庸常的心中才凭空生出好些浪漫。',   // 接近最大长度
        '在我的这颗小星球里面，你就是温柔跟璀璨，即使旁的宇宙再浪漫，我也终生不换。',
    ],
    }
  },

  flag: false,

  /**
   * 初始化云开发环境
   */
  async initcloud() {
    const normalinfo = require('./envList.js').envList || [] // 读取 envlist 文件
    if (normalinfo.length != 0 && normalinfo[0].envId != null) { // 如果文件中 envlist 存在
      wx.cloud.init({ // 初始化云开发环境
        traceUser: true,
        env: normalinfo[0].envId
      })
      // 装载云函数操作对象返回方法
      this.cloud = () => {
        return wx.cloud // 直接返回 wx.cloud
      }
    } else { // 如果文件中 envlist 不存在，提示要配置环境
      this.cloud = () => {
        wx.showModal({
          content: '无云开发环境', 
          showCancel: false
        })
        throw new Error('无云开发环境')
      }
    }
  },

  // 获取云数据库实例
  async database() {
    return (await this.cloud()).database()
  },
})
