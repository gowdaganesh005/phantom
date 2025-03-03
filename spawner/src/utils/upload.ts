import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

export async function upload(path: string, meetLink: string) {
    // Configuration
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_KEY,
        api_secret: process.env.CLOUDINARY_SECRET
    });
    
    // Upload a WebM video and convert to MP4
    const uploadResult = await cloudinary.uploader
        .upload(
            path, // Replace with your WebM video path or URL
            {
                resource_type: "video",
                public_id: meetLink,
                format: "mp4", // Convert to MP4 during upload
                eager: [
                    { width: 720, height: 480, crop: "pad" }, // Example transformation
                    { audio_codec: "mp3", format: "mp3" } // Explicitly request audio extraction
                ],
                eager_async: true
            }
        )
        .catch((error) => {
            console.log(error);
            return null;
        });
    
    if (!uploadResult) {
        return { mp4Url: null, thumbnailUrl: null, audioUrl: null };
    }
    
    console.log(uploadResult);
    
    // Get the URL of the converted MP4 video
    const mp4Url = cloudinary.url(meetLink, {
        resource_type: "video",
        format: "mp4"
    });
    
    console.log("MP4 Video URL:", mp4Url);
    
    // Create a thumbnail from the video
    const thumbnailUrl = cloudinary.url(meetLink, {
        resource_type: "video",
        format: "jpg",
        transformation: [
            {width: 320, crop: "scale"},
            {start_offset: "0", flags: "truncate_ts"}
        ]
    });
    
    // Get the audio URL
    const audioUrl = cloudinary.url(meetLink, {
        resource_type: "video",
        format: "mp3",
        transformation: [
            { audio_codec: "mp3" } // Extract audio as MP3
        ]
    });
    
    console.log("Audio URL:", audioUrl);
    console.log("Thumbnail URL:", thumbnailUrl);
    
    // Wait for the audio to be ready with proper polling
    let retry = 0;
    const maxRetries = 20;
    const waitTime = 10000; // 10 seconds
    
    while (retry <= maxRetries) {
        try {
            console.log(`Checking if audio is ready (attempt ${retry+1}/${maxRetries+1})...`);
            // Use HEAD request instead of GET to avoid downloading the whole file
            const response = await fetch(audioUrl, { method: 'HEAD' });
            
            if (response.ok) {
                console.log("Audio is ready!");
                break;
            } else {
                console.log(`Audio not ready yet, status: ${response.status}`);
                retry++;
                if (retry > maxRetries) {
                    console.log("Max retries reached, proceeding anyway");
                    break;
                }
                // Actually wait between retries (this was missing in your code)
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }
        } catch (error) {
            console.log(`Error checking audio: ${error}`);
            retry++;
            if (retry > maxRetries) break;
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }
    
    // Clean up the local file
    fs.unlink(path, () => {
        console.log("Deleted File from storage.");
    });
    
    return {
        mp4Url,
        thumbnailUrl,
        audioUrl
    };
}