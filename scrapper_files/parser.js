const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

//функция для извлечения данных с сайта
async function getData(sites){
    //запуск браузера и подготовка массива объектов для данных
    const browser = await puppeteer.launch({headless: "new"});
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    let obj=[];
    //пробежка по сайтам
    for (let site of sites){
        //получаем информацию о сайте
        let url = site.site_url;
        const selector = site.selector;
        const title_selector=site.title_selector;
        //открываем страницу и ждем
        await page.goto(url);
        await page.waitForTimeout(5000);
        //вытаскиваем данные по селектору
        const result = await page.evaluate((selector,title_selector)=>{
            let price = document.querySelector(selector).innerHTML;
            let title = document.querySelector(title_selector).innerHTML;
            let returnValue=title+"\n"+price;
            return returnValue.split("\n");
        },selector,title_selector);
        //Получаем дату получения данных
        let date = new Date();
        //если парсим раз в день, то округляем до нуля часов
        if(site.time_to_parse=='* */1 * * *'){
            date.setHours(date.getHours()+Math.round(date.getMinutes()/60));
            date.setMinutes(0,0,0);
        }
        //парсим все в JSON и пихаем в объект для дальнейшего возвращения
        console.log(JSON.stringify({"material_name":result[0],"price":result[1],"material_source":url,"created_on":date}));
        obj.push({"material_name":result[0],"price":result[1],"material_source":url,"created_on":date});
    }

    //закрываем браузер и возвращаем данные
    await browser.close();
    return obj;
};

module.exports = {getData};

