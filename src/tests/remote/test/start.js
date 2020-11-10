describe('example', function () {
    
    it('thing mcthing', async () => {
        const puppeteer = require('puppeteer'),
            settings = require(_$+'helpers/settings'),
            browser = await puppeteer.launch(),
            page = await browser.newPage()

        await page.goto(settings.siteUrl)
        const text = await page.$eval('body', e => e.outerHTML)

        console.log('>>>', settings.siteUrl, text)

        await browser.close()
        
    })
})


