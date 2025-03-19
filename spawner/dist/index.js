"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const child_process_1 = require("child_process");
const QUEUE_NAME = "BotQueue";
const connection = { host: "localhost", port: 6379 };
const worker = new bullmq_1.Worker(QUEUE_NAME, async (job) => {
    console.log(`🚀 Processing job: ${job.id} | Data:`, job.data);
    const { userId, meetLink } = job.data;
    if (!userId || !meetLink) {
        console.error("❌ Invalid job data");
        throw new Error("Invalid job data");
    }
    console.log(`🔧 Spawning bot.js for user ${userId} with meet link: ${meetLink}`);
    const botProcess = (0, child_process_1.spawn)("node", ["dist/bot.js", meetLink, userId]);
    botProcess.stdout.on("data", (data) => console.log(`📝 Bot Output: ${data}`));
    botProcess.stderr.on("data", (data) => console.error(`⚠️ Bot Error: ${data}`));
    botProcess.on("close", (code) => console.log(`✅ Bot process exited with code ${code}`));
}, {
    connection,
});
worker.on("failed", (job, err) => console.error(`🔥 Job ${job === null || job === void 0 ? void 0 : job.id} failed: ${err.message}`));
console.log(`👷 Worker listening on queue "${QUEUE_NAME}"...`);
