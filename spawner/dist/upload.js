"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = upload;
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
async function upload(path, meetLink) {
    // Configuration
    cloudinary_1.v2.config({
        cloud_name: 'dyfvlemxt',
        api_key: '275675791861467',
        api_secret: '9jwUHj9vq2I9LyTxdZ5AxObw5a4'
    });
    // Upload a WebM video and convert to MP4
    const uploadResult = await cloudinary_1.v2.uploader
        .upload(path, // Replace with your WebM video path or URL
    {
        resource_type: "video",
        public_id: meetLink,
        format: "mp4" // Convert to MP4 during upload
    })
        .catch((error) => {
        console.log(error);
        return { mp4Url: null, thumbnailUrl: null };
    });
    console.log(uploadResult);
    // Get the URL of the converted MP4 video
    const mp4Url = cloudinary_1.v2.url(meetLink, {
        resource_type: "video",
        format: "mp4"
    });
    console.log("MP4 Video URL:", mp4Url);
    // Optional: Create a thumbnail from the video
    const thumbnailUrl = cloudinary_1.v2.url(meetLink, {
        resource_type: "video",
        format: "jpg",
        transformation: [
            { width: 320, crop: "scale" },
            { start_offset: "0", flags: "truncate_ts" }
        ]
    });
    const audioUrl = cloudinary_1.v2.url(meetLink, {
        resource_type: "video",
        format: "mp3",
        transformation: [
            { audio_codec: "mp3" } // Extract audio as MP3
        ]
    });
    console.log("audio url:", audioUrl);
    console.log("Thumbnail URL:", thumbnailUrl);
    fs_1.default.unlink(path, () => {
        console.log("Deleted File from storage.");
    });
    return {
        mp4Url,
        thumbnailUrl,
        audioUrl
    };
}
