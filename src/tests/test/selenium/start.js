describe('example', function () {
    
    it('thing mcthing', async () => {
        const puppeteer = require('puppeteer'),
            browser = await puppeteer.launch()
            page = await browser.newPage()

        await page.goto('https://example.com')
        await page.screenshot({path: 'example.png'})
        await browser.close()
        
    })
})


