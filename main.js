const fs=require('fs');
const parser = require('./parser');
const sender = require('./sender');
const cron =require('node-cron');
require('dotenv').config();

//константы для определения времени и различные пулы для заполнения
const every_minute='*/1 * * * *';
let urls_every_minute =[];
const every_two_minutes='*/2 * * * *';
let urls_every_two_minutes=[];

//получение ссылок из файла и разбиение по пулам
let urls = JSON.parse(fs.readFileSync(process.env.POOL_PATH,'utf-8'));
for(const url of urls){
    switch(url.time_to_parse){
        case every_minute:
            urls_every_minute.push(url);
            break;
        case every_two_minutes:
            urls_every_two_minutes.push(url);
            break;
    }
}

//задачи по скраппингу по расписаню на основе cron
cron.schedule(every_minute,async()=>{
    console.log(every_minute);
    const post_url = process.env.POST_URL;
    let data = await parser.getData(urls_every_minute);
    console.log(data);
    //sender.postData(data,post_url);
});

cron.schedule(every_two_minutes,async()=>{
    console.log(every_two_minutes);
    const post_url = process.env.POST_URL;
    let data = await parser.getData(urls_every_two_minutes);
    console.log(data);
})






