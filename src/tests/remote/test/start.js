describe('example', function () {
    
    it('thing mcthing', async () => {
        const puppeteer = require('puppeteer'),
            browser = await puppeteer.launch()
            page = await browser.newPage()

        await page.goto('https://example.com')
        await browser.close()
        
    })
})


