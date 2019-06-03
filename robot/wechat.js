const { Wechaty } = require('wechaty')
const qrcodeTerminal = require('qrcode-terminal')

class WeChatRobot {
    constructor(name) {
        this.name = name;
        this.robot = Wechaty.instance();
        this.robot.on('scan', this.scan);
        this.robot.on('login', this.login);
        this.robot.on('message', this.message)
    };
    scan(qrcode, status) {
        console.log(`Scan QR Code to login: ${status}\nhttps://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrcode)}`);
        qrcodeTerminal.generate(`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrcode)}`)
    }
    login(user) {
        console.log(`User ${user.name()} logined`)
    }
    message() {

    }
    start() {
        this.robot.start()
    }

}


module.exports = WeChatRobot