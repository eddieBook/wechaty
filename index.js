/**
 * WechatBot
 *  - https://github.com/gengchen528/wechatBot
 */
const { Wechaty, Friendship } = require('wechaty')
const readline = require('readline');
const schedule = require('./schedule/index')
const config = require('./config/index')
const superagent = require('./superagent/index');
//  二维码生成
function onScan(qrcode, status) {
	require('qrcode-terminal').generate(qrcode)  // 在console端显示二维码
}
//默认自动回复
let AUTOREPLY = false;
let GlobalConcat = null;

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});


rl.on('line', async (input) => {
	await GlobalConcat.say(input);
	console.log(`回复${GlobalConcat.name()}:${input}`);
});

// 登录

async function onLogin(user) {
	// 登陆后创建定时任务
	const room = await bot.Room.find({ topic: config.ROOMNAME })
	let one = await superagent.getOne()
	console.log('already login');
	// room.say(one)
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
		if (content == "auto") {
			AUTOREPLY = !AUTOREPLY
		}
		return
	}
	if (room) { // 如果是群消息
		const topic = await room.topic()
		if (topic == config.ROOMNAME) {
			GlobalConcat = room;
			console.log('当前聊天对象:' + room.topic());
			let reply = await superagent.getReply(content)
			try {
				await room.say(reply)
			} catch (e) {
				console.error(e)
			}
		}
		// console.log(`群名: ${topic} 发消息人: ${contact.name()} 内容: ${content}`)
	} else { // 如果非群消息
		console.log(`${contact.name()}: ${content}`)
		GlobalConcat = contact;
		console.log('当前聊天对象:' + contact.name());

		if (AUTOREPLY) { // 如果开启自动聊天
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

bot.start()
	.then(() => {
		console.log('bot start');
	})
	.catch(e => console.error(e))
