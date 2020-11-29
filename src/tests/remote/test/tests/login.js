describe('remote/login', function () {
    
    it('remote/login::happy:logs user in', async () => {
        const puppeteer = require('puppeteer'),
            settings = require(_$+'helpers/settings'),
            browser = await puppeteer.launch(),
            page = await browser.newPage()

        await page.goto(settings.siteUrl)

        await page.waitForSelector('.login')
        await page.$eval('.login-username', (el, settings) => el.value = settings.masterUsername, settings)
        await page.$eval('.login-password', (el, settings) => el.value = settings.masterDefaultPassword, settings)
        await page.$eval('.login-login', el => el.click())

        // if home appears, login has passed
        await page.waitForSelector('.home')
        await browser.close()
        
    })
})


