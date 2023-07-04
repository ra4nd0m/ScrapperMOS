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
        var url = site.site_url;
        const selector = site.selector;
        const title_selector=site.title_selector;

        try{
        //открываем страницу и ждем
        await page.goto(url);
        await page.waitForTimeout(5000);
        //вытаскиваем данные по селектору
        const result = await page.evaluate((selector,title_selector)=>{
            try{
            var price = document.querySelector(selector).innerHTML;
            var title = document.querySelector(title_selector).innerHTML;
            }catch(error){
                var price='0';
                var title = 'Error!';
                console.log("Error reading from the site: ",url);
                console.error(error);
            }
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
    }catch(error){
        console.log("error resolving the site: ",url);
        console.error(error);
    }
    }

    //закрываем браузер и возвращаем данные
    await browser.close();
    return obj;
};

module.exports = {getData};

