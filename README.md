# 情侣专属小程序（二开版）（做任务，攒积分，换商品）
## 简介
功能很简单，自己新建任务️->完成任务️->对方审核任务️->获取积分️->购买对方的商品。

基于原版（[UxxHans/Rainbow-Cats-Personal-WeChat-MiniProgram](https://github.com/UxxHans/Rainbow-Cats-Personal-WeChat-MiniProgram)）二次开发。

**新增**

- 恋爱天数
- 每日一句小情话

**修改**

- 积分价格/积分奖励选择控件
- UI配色及字体
- 底部Tab栏图标
- 任务和商品预设
- 增加任务和商品按钮

**删除**

- 非主页的轮播图
- 主页欢迎文字

## 效果图
>![Image](https://note.youdao.com/yws/res/a/WEBRESOURCEd4ba4ffdc57931027cbd8c21e59e832a)
>![Image](https://note.youdao.com/yws/res/b/WEBRESOURCE07e3451a01b7792b78f993e28ef7dfab)
![Image](https://note.youdao.com/yws/res/d/WEBRESOURCE6e3f3ae4ecaf29b3a8a844f8b5de846d)

## 部署方式

- 在这里注册小程序开发者: https://mp.weixin.qq.com/cgi-bin/wx
- 在这里登录开发者账号: https://mp.weixin.qq.com/
>![Image](Pics/Link.jpg)
- 登录之后先在`主页`完成小程序`信息`和`类目`
- 然后可以在`管理`中的`版本管理`与`成员管理`中发布小程序体验版并邀请对象使用
>![Image](Pics/Account.jpg)
- 随后可以在`开发`中的`开发工具`里下载**微信开发者工具**
- 打开微信开发工具->登录->导入我的DailyMissions文件夹-进入工具
- 在左上角五个选项中选择`云开发`->按照提示开通云开发(这里可以选择免费的，不过限量，我开发用的多，6块够用了)
>![Image](Pics/DatabaseOption.jpg)
- 进入后点击数据库->在集合名称添加四个集合：`MarketList`, `MissionList`, `StorageList`, `UserList`
- 之前使用过上一个版本的，需要清空所有数据，因为字段结构不一样
>![Image](Pics/Database.jpg)
- 在`UserList`中添加两个默认记录, 在两个记录中分别添加两个字段:
```
字段 = _openid | 类型 = string | 值 = 先不填
字段 = credit | 类型 = number | 值 = 0
```
- 打开云开发的控制台的`概览`选项->复制环境ID
- 打开 `miniprogram/envList.js` 将内容全部替换成如下，注意替换环境ID
```js
module.exports = {
  envList: [{
    envId:'上述步骤中你获得的环境ID (保留单引号)'
  }]
}
```
- 右键点击 `cloudfunctions` 中的每个文件夹并选择云函数云端安装依赖上传 (有点麻烦但是这是一定要做的)
>![Image](Pics/CloudFunction.jpg)
- 如果云开发里面的云函数页面是这样的就是成功了
>![Image](Pics/CloudFunctionList.jpg)
- 没有安装npm或者NodeJs, 需要先在这里安装: https://nodejs.org/dist/v16.15.1/node-v16.15.1-x64.msi
- 安装好的，就直接运行`cloudfunctions/Install-WX-Server-SDK.bat` 
- 不成功的话可以在命令行输入 `npm install --save wx-server-sdk@latest`
- 然后创建体验版小程序->通过开发者账号分享到男/女朋友手机上(要先登录小程序开发者账号)
- 在两个手机上运行小程序->分别在两个手机上的小程序里新建任务
- 然后回到云开发控制台的`missionlist`数据库集合->找自己和男/女朋友的`_openid`变量并记录
- 把这两个记录下来的`_openid`拷贝到云开发控制台`UserList`数据集合里刚刚没填的`_openid`变量中
- 把这两个记录下来的`_openid`拷贝到`miniprogram/app.js`里的`_openidA`和`_openidB`的值里(A是小明，B是小红)
- 在`miniprogram/app.js`里把`userA`和`userB`改成自己和男/女朋友的名字
- 在`miniprogram/app.js`里把`date`改成自己和男/女朋友的恋爱纪念日
- 然后再试试看是不是成功了! (别忘了任务和物品**左滑**可以完成和购买)
- 别忘了最后点击右上角上传->然后在开发者账号上设置小程序为**体验版**->不用去发布去审核
>![Image](Pics/UploadOption.jpg)
- 最后如果有兴趣可以继续深入开发, 开发文档: https://developers.weixin.qq.com/miniprogram/dev/component/
## 声明
- 小程序内部分图片来自网络，此项目非商用，侵删。
- 若想使用此项目为商用，请先告知我，谢谢。
