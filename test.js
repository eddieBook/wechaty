const readline = require('readline')


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (input) => {
    console.log(`接收到：${input}`);
});
setInterval(() => {
    console.log(1010101010);

}, 1000);