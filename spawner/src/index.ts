import  { Builder, Browser, By, Key, until, WebDriver } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';

async function openMeet(driver: WebDriver) {
    
    try {
        await driver.get('https://meet.google.com/rhw-fqtg-jgt')
        
        const gotit = await driver.wait(driver.findElement(By.xpath('/html/body/div[1]/div[3]/span/div[2]/div/div/div[2]/div/button')), 100000)
        await gotit.click()
        const inputbtn = await driver.wait(driver.findElement(By.xpath('/html/body/div[1]/c-wiz/div/div/div[38]/div[4]/div/div[2]/div[4]/div/div/div[2]/div[1]/div[1]/div[3]/div[1]/span[2]/input')),60000)
        await inputbtn.click()
        await inputbtn.sendKeys("Phantom Bot")
        
        const askToJoin = await driver.wait(driver.findElement(By.xpath('/html/body/div[1]/c-wiz/div/div/div[38]/div[4]/div/div[2]/div[4]/div/div/div[2]/div[1]/div[2]/div[1]/div/div/div/button')),2000);
        await askToJoin.click();
        await driver.sleep(600000)

    }catch(error:any){
        console.log(error)
    }
}

async function getDriver(){
    const options = new  Options({})
    options.addArguments("--disable-blink-features=AutomationControlled")
    options.addArguments("--use-fake-ui-for-media-stream")
    options.addArguments("--enable-user-media-screen-capture")
    let driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build()
    return driver
}

function screenRecorderScript(){
    function wait(delayInMS:number) {
        return new Promise((resolve) => setTimeout(resolve, delayInMS));
    }
    function startRecording(stream:any, lengthInMS:number) {
        let recorder = new MediaRecorder(stream);
        let data:any = [];
      
        recorder.ondataavailable = (event) => data.push(event.data);
        recorder.start();
        console.log(`${recorder.state} for ${lengthInMS / 1000} seconds…`);
      
        let stopped = new Promise((resolve, reject) => {
          recorder.onstop = resolve;
          recorder.onerror = (event) => reject(event);
        });
      
        let recorded = wait(lengthInMS).then(() => {
          if (recorder.state === "recording") {
            recorder.stop();
          }
        });
      
        return Promise.all([stopped, recorded]).then(() => data);
    }
    function StartRecording(){

        const recording=document.createElement('video');
        const downloadButton = document.createElement('a');

        window.navigator.mediaDevices.getDisplayMedia().then((stream) => startRecording(stream, 10000))
            .then((recordedChunks) => {
              let recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
              recording.src = URL.createObjectURL(recordedBlob);
              downloadButton.href = recording.src;
              downloadButton.download = "RecordedVideo.webm";
              downloadButton.click()
            })
    }
    
      
      
}

async function startScreenShare(driver:WebDriver){
    console.log("Started Screen Recording");
    driver.executeScript(`

        
        
        )
        `)
}

async function main(){
    const driver = await getDriver();
    await openMeet(driver)

    await startScreenShare(driver)
}