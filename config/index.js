// 配置文件
module.exports = {
  CITY: 'jiangsu',//收信者所在城市
  LOCATION: 'changzhou',//收信者所在区 （可以访问墨迹天气网站后，查询区的英文拼写）
  SENDDATE: '0 0 8 * * *',//定时发送时间 每天8点0分0秒发送，规则见 /schedule/index.js
  ONE: 'http://wufazhuce.com/',////ONE的web版网站
  MOJI_HOST: 'https://tianqi.moji.com/weather/china/', //中国墨迹天气url


  //高级功能配置项（非必填项）
  AUTOADDFRIEND: true,//自动加好友功能  默认关闭
  AUTOADDROOM: false,//自动拉群功能 默认关闭
  AUTOREPLY: false,//自动聊天功能 默认关闭
  AIBOTAPI: 'http://www.tuling123.com/openapi/api',//图灵机器人API 注册地址http://www.turingapi.com/
  APIKEY: 'aba94fd9a1eb4d9c8437dad31f6c0c74',//图灵机器人apikey
  ROOMNAME: '洋蛮河超级奶爸指导小组', //群名(请只修改中文，不要删除符号，这是正则)
  ADDFRIENDWORD: '',//自动加好友触发的关键词(请只修改中文，不要删除符号，这是正则)

}
