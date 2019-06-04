/**
 * WechatBot
 *  - https://github.com/gengchen528/wechatBot
 */
const { Wechaty, Friendship } = require('wechaty')
const schedule = require('./schedule/index')
const config = require('./config/index')
const untils = require('./untils/index')
const superagent = require('./superagent/index')
const { FileBox } = require('file-box') //文件读取模块
//  二维码生成
function onScan(qrcode, status) {
	require('qrcode-terminal').generate(qrcode)  // 在console端显示二维码
	const qrcodeImageUrl = [
		'https://api.qrserver.com/v1/create-qr-code/?data=',
		encodeURIComponent(qrcode),
	].join('')
	console.log(qrcodeImageUrl)
}

// 登录
async function onLogin(user) {
	// 登陆后创建定时任务
	const room = await bot.Room.find({ topic: config.ROOMNAME })
	let one = await superagent.getOne()
	room.say(one)
	schedule.setSchedule(config.SENDDATE, () => {
		main(room)
	})
}

//登出
function onLogout(user) {
	console.log(`${user} 登出`)
}
// 监听对话 根据关键词自动加群
async function onMessage(msg) {
	const contact = msg.from() // 发消息人
	const content = msg.text() //消息内容
	const room = msg.room() //是否是群消息

	if (msg.self()) {
		return
	}
	if (room) { // 如果是群消息
		const topic = await room.topic() 
		if (Math.random > 0.7) { return }
		if (topic == config.ROOMNAME) { 
			let reply = await superagent.getReply(content)
			try {
				await room.say(reply)
			} catch (e) {
				console.error(e)
			}
		}
		// console.log(`群名: ${topic} 发消息人: ${contact.name()} 内容: ${content}`)
	} else { // 如果非群消息
		console.log(`发消息人: ${contact.name()} 消息内容: ${content}`)
		if (config.AUTOREPLY) { // 如果开启自动聊天
			let reply = await superagent.getReply(content)
			console.log('图灵机器人回复：', reply)
			try {
				await contact.say(reply)
			} catch (e) {
				console.error(e)
			}
		}
	}
}
// 自动加好友功能
async function onFriendShip(friendship) {
	let logMsg
	try {
		logMsg = '添加好友' + friendship.contact().name()
		console.log(logMsg)

		switch (friendship.type()) {
			/**
			 *
			 * 1. New Friend Request
			 *
			 * when request is set, we can get verify message from `request.hello`,
			 * and accept this request by `request.accept()`
			 */
			case Friendship.Type.Receive:
				let addFriendReg = eval(config.ADDFRIENDWORD)
				if (addFriendReg.test(friendship.hello()) && config.AUTOADDFRIEND) { //判断是否开启自动加好友功能
					logMsg = '自动添加好友'
					await friendship.accept()
				} else {
					logMsg = '没有通过验证 ' + friendship.hello()
				}
				break
			/**
			 *
			 * 2. Friend Ship Confirmed
			 *
			 */
			case Friendship.Type.Confirm:
				logMsg = 'friend ship confirmed with ' + friendship.contact().name()
				break
		}
	} catch (e) {
		logMsg = e.message
	}
	console.log(logMsg)
}
// 自动发消息功能
async function main(room) {
	let weather = await superagent.getWeather() //获取天气信息 
	let str = `早上好诸位:)\n美好的一天又开始了\n今天常州的天气呢\n是这样的:\n${weather.todayWeather},${weather.weatherTips}`
	try {
		// await room.say(one) // 发送消息
		await room.say(str)
	} catch (e) {
		console.log(e);
	}
}


const bot = new Wechaty({ name: 'WechatEveryDay' })


bot.on('scan', onScan)
bot.on('login', onLogin)
bot.on('logout', onLogout)
bot.on('message', onMessage)
bot.on('friendship', onFriendShip)

bot.start()
	.then(() => {
		console.log('bot start');
	})
	.catch(e => console.error(e))
