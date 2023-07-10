const parser = require('./parser');
const sender = require('./sender');

//функция, запускающая парсер и отправляющая данные
async function scrapAndSend(pool, cron_time, post_url) {
    console.log(cron_time);
    let data = await parser.getData(pool);
    if (data != 'empty') {
        console.log(data);
        sender.postData(data, post_url);
    }
    else {
        console.log("Recived empty array!");
    }

}

module.exports = { scrapAndSend };