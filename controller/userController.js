const puppeteer = require('puppeteer')
const path = require('path')
const generateReport = async(req, res) =>{
    debugger
    const id = req.params.id;
try {

   const browser = await puppeteer.launch({headless:true, args: ['--no-sandbox']});
   const page = await browser.newPage();
   await page.goto(`${req.protocol}://${req.get('host')}/adminMDPopuppdf/${id}`,{
        waitUntil: 'networkidle2',
   })
//   await page.setViewport({width:1680, height:1000});

  const date = new Date();

  const pdfn = await page.pdf({
    path:`${path.join(__dirname, '../public/files', date.getTime()+".pdf")}`,
    format:'A2'
  })
  await browser.close();

 const pdfURL = path.join(__dirname, '../public/files', date.getTime()+".pdf")
  res.set({
    "Content-Type": "application/pdf",
    "Content-Length":pdfn.length
  })
  res.sendFile(pdfURL)

} catch (error) {
    
    console.log(error)
}
}

module.exports = {
    generateReport
}