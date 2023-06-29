const puppeteer = require('puppeteer');

async function getData(sites){
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    let obj=[];
    for (let site of sites){
        let url = site.site_url;
        const selector = site.selector;
        const title_selector=site.title_selector;
        await page.goto(url);
        await page.waitForTimeout(5000);
        const result = await page.evaluate((selector,title_selector)=>{
            let price = document.querySelector(selector).innerHTML;
            let title = document.querySelector(title_selector).innerHTML;
            let returnValue=title+"\n"+price;
            return returnValue.split("\n");
        },selector,title_selector);
            console.log(JSON.stringify({"material_name":result[0],"price":result[1],"material_source":url}));
            obj.push({"material_name":result[0],"price":result[1],"material_source":url});
    }


    await browser.close();
    return obj;
};

module.exports = {getData};

