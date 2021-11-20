
import puppeteer from 'puppeteer'

test('Launch Browser',async () => {
     const browser = await puppeteer.launch({
          headless: false
     });
     const page = await browser.newPage();
},50000)

describe('Setting up express server',() =>{
     test('server is running',() => {

     })
})
