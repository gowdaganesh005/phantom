"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const selenium_webdriver_1 = require("selenium-webdriver");
const chrome_1 = require("selenium-webdriver/chrome");
function openMeet(driver) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield driver.get('https://meet.google.com/zqc-uuft-wkm');
            yield driver.sleep(5000); // Allow page to fully load
            const gotit = yield driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.xpath('/html/body/div[1]/div[3]/span/div[2]/div/div/div[2]/div/button')), 30000);
            yield gotit.click();
            const inputbtn = yield driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.xpath('/html/body/div[1]/c-wiz/div/div/div[38]/div[4]/div/div[2]/div[4]/div/div/div[2]/div[1]/div[1]/div[3]/div[1]/span[2]/input')), 30000);
            yield inputbtn.click();
            yield inputbtn.sendKeys("Phantom Bot");
            const askToJoin = yield driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.xpath('/html/body/div[1]/c-wiz/div/div/div[38]/div[4]/div/div[2]/div[4]/div/div/div[2]/div[1]/div[2]/div[1]/div/div/div/button')), 30000);
            yield askToJoin.click();
        }
        catch (error) {
            console.log('Error in openMeet:', error);
            throw error;
        }
    });
}
function getDriver() {
    return __awaiter(this, void 0, void 0, function* () {
        const options = new chrome_1.Options();
        // Essential options from your original script
        options.addArguments("--disable-blink-features=AutomationControlled");
        options.addArguments("--use-fake-ui-for-media-stream");
        options.addArguments("--enable-user-media-screen-capture");
        // Stealth mode configurations
        options.addArguments("--headless=chrome"); // Using older headless mode
        options.addArguments("--disable-gpu"); // Required for some Windows setups
        options.addArguments("--no-sandbox");
        options.addArguments("--window-size=1920,1080");
        options.addArguments("--start-maximized");
        // Additional stealth options
        options.addArguments("--disable-web-security");
        options.addArguments("--allow-running-insecure-content");
        // Mask automation
        options.addArguments("--disable-blink-features");
        options.addArguments("--disable-blink-features=AutomationControlled");
        // Set convincing user agent
        options.addArguments('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
        // Disable automation flags
        // options.excludeSwitches('enable-automation');
        // options.excludeSwitches('enable-logging');
        // Set CDP preferences to mask automation
        options.setUserPreferences({
            'credentials_enable_service': false,
            'profile.password_manager_enabled': false,
            'profile.default_content_setting_values.notifications': 1,
            'profile.default_content_setting_values.media_stream_mic': 1,
            'profile.default_content_setting_values.media_stream_camera': 1,
            'profile.default_content_setting_values.geolocation': 1,
            'profile.default_content_setting_values.cookies': 1
        });
        const driver = yield new selenium_webdriver_1.Builder()
            .forBrowser(selenium_webdriver_1.Browser.CHROME)
            .setChromeOptions(options)
            .build();
        // Set properties to mask webdriver
        // await driver.executeScript(`
        //     Object.defineProperty(navigator, 'webdriver', {
        //         get: () => undefined
        //     });
        // `);
        return driver;
    });
}
function startScreenShare(driver) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Started Screen Recording");
            console.log(yield driver.executeScript(screenRecorderScript));
        }
        catch (error) {
            console.log('Error in startScreenShare:', error);
            throw error;
        }
    });
}
function screenRecorderScript() {
    function wait(delayInMS) {
        return new Promise((resolve) => setTimeout(resolve, delayInMS));
    }
    function startRecording(stream, lengthInMS) {
        let recorder = new MediaRecorder(stream);
        let data = [];
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
    function StartRecording() {
        const recording = document.createElement('video');
        const downloadButton = document.createElement('a');
        window.navigator.mediaDevices.getDisplayMedia({
            audio: true,
            video: {
                displaySurface: 'browser'
            }
        }).then((stream) => startRecording(stream, 60000))
            .then((recordedChunks) => {
            let recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
            recording.src = URL.createObjectURL(recordedBlob);
            downloadButton.href = recording.src;
            downloadButton.download = "RecordedVideo.webm";
            downloadButton.click();
        });
    }
    StartRecording();
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let driver = null;
        try {
            driver = yield getDriver();
            yield openMeet(driver);
            yield startScreenShare(driver);
            // Keep session alive
            yield new Promise(resolve => setTimeout(resolve, 70000));
        }
        catch (error) {
            console.error('Main error:', error);
        }
        finally {
            if (driver) {
                yield driver.quit();
            }
        }
    });
}
main();
