require("dotenv").config()
import { Builder, Browser, By, Key, until, WebDriver } from 'selenium-webdriver';
// import chrome,{ Options } from 'selenium-webdriver/chrome';
import firefox  from 'selenium-webdriver/firefox'

import { upload } from './utils/upload';

import { prisma } from './utils/db';
import { AssemblyAI } from 'assemblyai';
import { RequestForSummary } from './utils/gemini';
import { spawn } from "child_process"
import fs from 'fs'
import path from 'path'



async function checkMeetingStatus(driver:WebDriver){
    try{
        
        const NumOfMemebers =await driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/c-wiz/div/div/div[63]/div[3]/div/div[7]/div/div/div[3]/nav/div[2]/div/div/div')),10*1000)
        let text = await NumOfMemebers.getText();
        let intValue = parseInt(text.trim(),10);
        console.log(intValue.toString())
        if(intValue==1){
            await new Promise(resolve => setTimeout(resolve,10*1000))
            const NumOfMemebers2 =await driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/c-wiz/div/div/div[63]/div[3]/div/div[7]/div/div/div[3]/nav/div[2]/div/div/div')),10*1000)
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

async function watchMeeting(driver:WebDriver,meetLink:string){
    while(true){
        const isStillMeeting = await checkMeetingStatus(driver)
        if(!isStillMeeting){
            
            await new Promise(resolve => setTimeout(resolve,5*1000))
            const isStillMeetingagain = await checkMeetingStatus(driver)
            if(!isStillMeetingagain){
                console.log("Meeting has ended");
                await driver.executeScript(`
                    if (window.globalRecorder && window.globalRecorder.state === "recording") {
                        
                        window.globalRecorder.stop();
                    }`);
                await driver.sleep(3000);
                break 
            }
             
        }
        await new Promise(resolve => setTimeout(resolve,5*1000))
    }



}



async function openMeet(driver: WebDriver,meetLink:string) {
    try {
        await driver.get(meetLink);
        await driver.sleep(5000);  // Allow page to fully lgshoad

        
        await driver.sleep(2500+100*Math.random())
        
        const askToJoin = await driver.wait(
            until.elementLocated(By.xpath('/html/body/div[1]/c-wiz/div/div/div[65]/div[3]/div/div[2]/div[4]/div[1]/div/div[2]/div[1]/div[2]/div[1]/div/div/span/div[1]/button')),
            300000
        );
        await askToJoin.click();

        
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
    
    // const xvfbProcess = spawn('Xvfb', [':99', '-screen', '0', '1920x1080x24', '-ac']);
    // process.env.DISPLAY=':99'

    await new Promise(resolve => setTimeout(resolve, 1000));

    const options = new firefox.Options();

  
  // Optional: Set window size
    // options.setBinary("/home/ubuntu/firefox/firefox-bin");
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
    options.addArguments("--no-remote")
    
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

    options.setProfile("C:/Users/Ganesh/Desktop/VVIET/phantomV1/ffprofile")

    
   
    

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


async function startScreenShare(driver:WebDriver, meetLink:string) {
    meetLink = meetLink.slice(24)
    console.log(meetLink)
    try {
        await driver.executeAsyncScript(`
            (function() {                
                let globalRecorder = null;
                let recordedChunks = [];
                
                function startRecording(stream) {
                    
                    const recording = document.createElement('video');
                    const downloadButton = document.createElement('a');
                    let recorder = new MediaRecorder(stream);
                    
                    window.globalRecorder = recorder;
                    
                    recorder.ondataavailable = (event) => {
                        
                        recordedChunks.push(event.data);
                    };
                    recorder.start(1000);
                    
                    recorder.onstop = () => {
                        console.log("Recording stopped, processing data");
                        const recordedBlob = new Blob(recordedChunks, { type: "video/mp4" });
                        recording.src = URL.createObjectURL(recordedBlob);
                        downloadButton.href = recording.src;
                        downloadButton.download = '` + meetLink + `';  // Fix here
                        document.body.appendChild(downloadButton);
                        downloadButton.click();
                        
                        recordedChunks = [];
                        URL.revokeObjectURL(recording.src);
                    };
                }
                
                
                
                navigator.mediaDevices.getDisplayMedia({ video: true })
                .then(screenStream => {
                    
                    
                    const audioElements = document.querySelectorAll('audio');
                    
                    if (audioElements.length > 0 && audioElements[0].srcObject) {
                        const audioTracks = audioElements[0].srcObject.getAudioTracks();
                        
                        
                        const combinedStream = new MediaStream();
                        screenStream.getTracks().forEach(track => combinedStream.addTrack(track));
                        audioTracks.forEach(track => combinedStream.addTrack(track));
                        
                        
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
                });
            })();
        `);
        console.log("Screen recording script injected and executed");
    }
    catch (error) {
        console.log('Error in startScreenShare:', error);
    }
}


async function uploadToDB(meetLink: string, userId: string) {
    try {
        meetLink = meetLink.slice(24);
        const filePath = C:/Users/Ganesh/Downloads/${meetLink}.webm;
        const videoId = ${meetLink}-${Date.now()};
        
        console.log(Processing video: ${meetLink});
        console.log(File path: ${filePath});
        
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            console.error(File not found: ${filePath});
            return { success: false, error: "File not found" };
        }

        const mp4Url = await upload(filePath,videoId);
        

        
        // Save initial video data to database
        const uploadData = await prisma.videos.create({
            data: {
                userId: userId,
                videoId: videoId,
                videoLink: mp4Url || "",
                
            }
        });
        console.log("Video data saved:", uploadData.videoId);
        
        console.log("Setting up AssemblyAI client...");
        const assmClient = new AssemblyAI({
            apiKey: process.env.ASSEMBLY_KEY || ""
        });
        
        // Submit audio for transcription
        const data = { audio: mp4Url || "" };
        console.log("Submitting for transcription:", mp4Url);
        
        const transcript = await assmClient.transcripts.transcribe(data);
        
        if (!transcript || !transcript.text) {
            console.error("Transcription failed or returned empty");
            return { success: false, error: "Transcription failed" };
        }
        
        console.log("Transcription completed successfully");
        
        const contents = transcript.text
        
        // Get 
        console.log("Requesting summary...");
        const summary = await RequestForSummary(contents);
        console.log("Summary generated");
        
        // Update database with transcript and summary
        await prisma.videos.update({
            where: { videoId: videoId },
            data: {
                summary: summary,
                transcript: transcript.text
            }
        });
        
        console.log("Database updated with transcript and summary");
        return { success: true, videoId };
        
    } catch (error: any) {
        console.error("Error in uploadToDB:", error.message);
        return { success: false, error: error.message };
    }
}




async function main() {
    const args = process.argv.slice(2)
    const meetLink = args[0]
    const userId  = args[1]

    console.log(userId)
    console.log(meetLink)

    let driver: WebDriver | null = null;
    try {
        driver = await getDriver();
        await openMeet(driver,meetLink);
        await startScreenShare(driver,meetLink); 
        await watchMeeting(driver,meetLink);
        await uploadToDB(meetLink,userId)
        

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
