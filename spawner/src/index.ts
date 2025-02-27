import { Builder, Browser, By, Key, until, WebDriver } from 'selenium-webdriver';
// import chrome,{ Options } from 'selenium-webdriver/chrome';
import firefox  from 'selenium-webdriver/firefox'
import { spawn } from "child_process"



async function checkMeetingStatus(driver:WebDriver){
    try{
        await driver.sleep(20*1000)
        const NumOfMemebers =await driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/c-wiz/div/div/div[36]/div[4]/div[10]/div/div/div[3]/nav/div[2]/div/div/div')),10*1000)
        let text = await NumOfMemebers.getText();
        let intValue = parseInt(text.trim(),10);
        console.log(intValue.toString())
        if(intValue==1){
            await new Promise(resolve => setTimeout(resolve,10*1000))
            const NumOfMemebers2 =await driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/c-wiz/div/div/div[36]/div[4]/div[10]/div/div/div[3]/nav/div[2]/div/div/div')),10*1000)
            let text2 = await NumOfMemebers2.getText();
            let intValue2 = parseInt(text2.trim(),10);
            if(intValue2==1) return false
        }
        else return true;
    }
    catch(error){
        console.log("not located no of members")
    }
        

    
}

async function watchMeeting(driver:WebDriver){
    while(true){
        const isStillMeeting = await checkMeetingStatus(driver)
        if(!isStillMeeting){
            
            await new Promise(resolve => setTimeout(resolve,5*1000))
            const isStillMeetingagain = await checkMeetingStatus(driver)
            if(!isStillMeetingagain){
                console.log("Meeting has ended");
                await new Promise(resolve => setTimeout(resolve,5*1000))
                return 
            }
             
        }
        await new Promise(resolve => setTimeout(resolve,5*1000))
    }

}

async function openMeet(driver: WebDriver) {
    try {
        await driver.get('https://meet.google.com/fet-hgam-qrd');
        await driver.sleep(5000);  // Allow page to fully load

        // try {
        //     const continueBtn = await driver.wait(
        //         until.elementLocated(By.xpath('/html/body/div[2]/div[3]/div[2]/div/div/div/div/div[2]/div/div[2]/button')),
        //         10000
        //     )
        //     await continueBtn.click()
        // } catch (error) {
        //     console.log(error)
        // }

        // const micButton = await driver.wait(
        //     until.elementLocated(By.xpath('/html/body/div[1]/c-wiz/div/div/div[38]/div[4]/div/div[2]/div[4]/div/div/div[1]/div[1]/div/div[6]/div[1]')),
        //     40000
        // )
        // await micButton.click()
        // await driver.sleep(2000+100*Math.random())

        // const videoButton = await driver.wait(
        //     until.elementLocated(By.xpath('/html/body/div[1]/c-wiz/div/div/div[38]/div[4]/div/div[2]/div[4]/div/div/div[1]/div[1]/div/div[6]/div[2]')),
        //     40000
        // )
        // await videoButton.click()
        // await driver.sleep(1000+100*Math.random())

        
        // const gotit = await driver.wait(
        //     until.elementLocated(By.xpath('/html/body/div[1]/div[3]/span/div[2]/div/div/div[2]/div/button')), 
        //     30000
        // );
        // await gotit.click();
        // await driver.sleep(1500+100*Math.random())
        
        // const inputbtn = await driver.wait(
        //     until.elementLocated(By.xpath('/html/body/div[1]/c-wiz/div/div/div[38]/div[4]/div/div[2]/div[4]/div/div/div[2]/div[1]/div[1]/div[3]/div[1]/span[2]/input')),
        //     30000
        // );
        // await inputbtn.click();
        // await inputbtn.sendKeys("Phantom Bot");
        await driver.sleep(2500+100*Math.random())
        
        const askToJoin = await driver.wait(
            until.elementLocated(By.xpath('/html/body/div[1]/c-wiz/div/div/div[38]/div[4]/div/div[2]/div[4]/div/div/div[2]/div[1]/div[2]/div[1]/div/div/div/button')),
            300000
        );
        await askToJoin.click();

        // try {
        //     const gotit2 = await driver.wait(
        //         until.elementLocated(By.xpath('/html/body/div[1]/div[3]/span/div[2]/div/div/div[2]/div[2]/button')),
        //         1*60*1000
        //     )
        //     gotit2.click()
        // } catch (error) {
        //     console.log("Error in the finding Got It button ",error)
        // }
        await driver.sleep(2500+100*Math.random())

        await driver.executeScript(`
            document.querySelector('button').click();
        `);

        
    } catch (error: any) {
        console.log('Error in openMeet:', error);
        throw error;
    }
}

async function getDriver() {
    const xvfbProcess = spawn('Xvfb', [':99', '-screen', '0', '1920x1080x24', '-ac']);
    process.env.DISPLAY=':99'
    await new Promise(resolve => setTimeout(resolve, 1000));

    const options = new firefox.Options();
    options.addArguments('-headless');
  
  // Optional: Set window size
    options.addArguments('--width=1920');
    options.addArguments('--height=1080');
    
    // Essential options from your original script
    options.addArguments("--disable-blink-features=AutomationControlled");
    options.addArguments("--use-fake-ui-for-media-stream");
    options.addArguments("--enable-user-media-screen-capture");
    // options.addArguments("--user-data-dir=C:/Users/Ganesh/AppData/Local/Google/Chrome/User Data");
    // options.addArguments("--profile-directory=Default");
    
    // Stealth mode configurations
    // options.addArguments("--headless=chrome");  // Using older headless mode
    options.addArguments("--disable-gpu");  // Required for some Windows setups
    options.addArguments("--no-sandbox");
    options.addArguments("--window-size=1920,1080");
    options.addArguments("--start-maximized");
    
    // Additional stealth options
    // options.addArguments("--disable-web-security");
    // options.addArguments("--allow-running-insecure-content");
    
    // Mask automation
    options.addArguments("--disable-blink-features");
    options.addArguments("--disable-blink-features=AutomationControlled");
    
    ///most important lines that works for headless modes
    // Set convincing user agent
    // options.addArguments("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36");
    
    // Disable automation flags
    // options.excludeSwitches('enable-automation');
    // options.excludeSwitches('enable-logging');
    
    // Set CDP preferences to mask automation
    // options.setUserPreferences({
    //     'credentials_enable_service': false,
    //     'profile.password_manager_enabled': false,
    //     'profile.default_content_setting_values.notifications': 1,
    //     'profile.default_content_setting_values.media_stream_mic': 1,
    //     'profile.default_content_setting_values.media_stream_camera': 1,
    //     'profile.default_content_setting_values.geolocation': 1,
    //     'profile.default_content_setting_values.cookies': 1
    // });

    options.setProfile("C:/Users/Ganesh/Documents/Phantom")

    options.addArguments("--disable-blink-features=AutomationControlled");
    options.addArguments("--use-fake-ui-for-media-stream");
    options.addArguments("--enable-user-media-screen-capture");
    
    // Firefox preferences for media handling
    options.setPreference("dom.webdriver.enabled", false);
    options.setPreference("useAutomationExtension", false);
    options.setPreference("media.navigator.streams.fake", true);
    options.setPreference("media.navigator.permission.disabled", true);
    options.setPreference("permissions.default.microphone", 1); // 0=ask, 1=allow, 2=deny
    options.setPreference("permissions.default.camera", 1);
    options.setPreference("permissions.default.screen", 1);
    options.setPreference("media.getusermedia.screensharing.enabled", true);
    options.setPreference("media.getusermedia.screensharing.allowed_domains", "*");
    options.setPreference("media.autoplay.default", 0); // 0=allowed, 1=blocked, 2=prompt
    options.setPreference("media.autoplay.blocking_policy", 0);
    options.setPreference("media.navigator.video.enabled", true);
    
    options.setPreference("general.useragent.override","Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36")

    const chromedriverPath = 'C:/Users/Ganesh/AppData/Roaming/undetected_chromedriver/undetected_chromedriver.exe'


    const driver = await new Builder()
        .forBrowser(Browser.FIREFOX)
        .setFirefoxOptions(options).build();
        // .setChromeService(new chrome.ServiceBuilder(chromedriverPath))
        

    // Set properties to mask webdriver
    // await driver.executeScript(`
    //     Object.defineProperty(navigator, 'webdriver', {
    //         get: () => undefined
    //     });
    // `);

    return driver;
}


async function startScreenShare(driver: WebDriver) {
    try {
        // Inject and execute the screen recording script directly
        await driver.executeScript(`
            (function() {
                console.log("Initializing screen recording");
                
                let globalRecorder = null;
                let recordedChunks = [];
                
                function startRecording(stream) {
                    console.log("Recording started with stream", stream);
                    const recording = document.createElement('video');
                    const downloadButton = document.createElement('a');
                    let recorder = new MediaRecorder(stream);
                    
                    window.globalRecorder = recorder;
                    
                    recorder.ondataavailable = (event) => {
                        console.log("Data available", event);
                        recordedChunks.push(event.data);
                    };
                    recorder.start(1000);
                    
                    recorder.onstop = () => {
                        console.log("Recording stopped, processing data");
                        const recordedBlob = new Blob(recordedChunks, { type: "mp4" });
                        recording.src = URL.createObjectURL(recordedBlob);
                        downloadButton.href = recording.src;
                        downloadButton.download = "RecordedVideo.webm";
                        document.body.appendChild(downloadButton);
                        downloadButton.click();
                        
                        // Clear chunks after saving
                        recordedChunks = [];
                        
                        // Clean up resources
                        URL.revokeObjectURL(recording.src);
                    };
                }
                
                console.log("Requesting display media");
                
                navigator.mediaDevices.getDisplayMedia({
                    video: true
                })
                .then(screenStream => {
                    console.log("Got screen stream", screenStream);
                    
                    const audioElements = document.querySelectorAll('audio');
                    console.log("Audio elements:", audioElements);
                    
                    if (audioElements.length > 0 && audioElements[0].srcObject) {
                        const audioTracks = audioElements[0].srcObject.getAudioTracks();
                        console.log("Audio tracks:", audioTracks);
                        
                        // Create a new MediaStream with all tracks
                        const combinedStream = new MediaStream();
                        
                        // Add all screen tracks
                        screenStream.getTracks().forEach(track => {
                            combinedStream.addTrack(track);
                        });
                        
                        // Add all audio tracks
                        audioTracks.forEach(track => {
                            combinedStream.addTrack(track);
                        });
                        
                        console.log("Combined stream created", combinedStream);
                        startRecording(combinedStream);
                        
                        combinedStream.getTracks().forEach(track => {
                            track.onended = () => {
                                console.log("Track ended");
                                if (window.globalRecorder && window.globalRecorder.state === "recording") {
                                    window.globalRecorder.stop();
                                }
                            };
                        });
                    } else {
                        console.log("No audio elements found or no srcObject, recording screen only");
                        startRecording(screenStream);
                        
                        screenStream.getTracks().forEach(track => {
                            track.onended = () => {
                                console.log("Track ended");
                                if (window.globalRecorder && window.globalRecorder.state === "recording") {
                                    window.globalRecorder.stop();
                                }
                            };
                        });
                    }
                })
                .catch(error => {
                    console.error("Error getting display media:", error);
                });
            })();
        `);
        
        console.log("Screen recording script injected and executed");
        
    } catch (error) {
        console.log('Error in startScreenShare:', error);
    }
}




async function main() {
    let driver: WebDriver | null = null;
    try {
        driver = await getDriver();
        await openMeet(driver);
        await startScreenShare(driver);
        
        await watchMeeting(driver)
    } catch (error: any) {
        console.error('Main error:', error);
    } finally {
        if (driver) {
            try {
                await driver.executeScript(`
                    if (window.globalRecorder && window.globalRecorder.state === "recording") {
                        
                        window.globalRecorder.stop();
                    }`);
                await driver.sleep(3000);
            } catch (error) {
                console.log('Error stopping recodring :',error);
            }
            await driver.quit();
        }
    }
}

main();



