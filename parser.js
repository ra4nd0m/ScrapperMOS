const puppeteer = require('puppeteer');

//функция для извлечения данных с сайта
async function getData(sites){
    //запуск браузера и подготовка массива объектов для данных
    const browser = await puppeteer.launch({headless: false});
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
        //парсим все в JSON и пихаем в объект для дальнейшего возвращения
            console.log(JSON.stringify({"material_name":result[0],"price":result[1],"material_source":url}));
            obj.push({"material_name":result[0],"price":result[1],"material_source":url});
    }

    //закрываем браузер и возвращаем данные
    await browser.close();
    return obj;
};

module.exports = {getData};

