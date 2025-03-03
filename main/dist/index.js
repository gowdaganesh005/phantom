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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const bullmq_1 = require("bullmq");
const db_1 = require("./utils/db");
const authorization_1 = require("./middlewares/authorization");
const login_1 = __importDefault(require("./routes/login"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const queue = new bullmq_1.Queue("BotQueue");
app.use(login_1.default);
app.post('/create-bot', authorization_1.authorization, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { meetLink } = req.body;
    const userId = req.user.uid;
    if (!meetLink || meetLink == '') {
        return res.status(400).json({ message: "Invalid Meet Link" });
    }
    else {
        const job = yield queue.add("create-bot", { userId, meetLink });
        if (job) {
            return res.status(200).json({
                message: "Successfully added to the Queue.Undergoing Bot creation process...",
                job: job
            });
        }
        else {
            return res.status(500).json({ message: "Error Creating the Bot.Please Try again" });
        }
    }
}));
app.get("/getAll", authorization_1.authorization, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.uid;
    const response = yield db_1.prisma.videos.findMany({
        where: {
            userId: userId
        }, select: {
            videoId: true,
            thumbnailUrl: true,
            created_at: true
        }
    });
    if (response && response.length == 0) {
        return res.status(200).json({
            message: "No Videos "
        });
    }
    else if (response && response.length > 0) {
        return res.status(200).json({
            data: response
        });
    }
    else if (!response) {
        return res.status(500).json({
            message: "Error occured"
        });
    }
}));
app.post("/getVideo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { videoId } = req.body;
    console.log(videoId);
    if (videoId) {
        const data = yield db_1.prisma.videos.findUnique({
            where: {
                videoId: videoId
            }
        });
        if (data) {
            return res.status(200).json({
                data: data
            });
        }
        else {
            return res.status(404).json({
                message: "Cannot find information"
            });
        }
    }
    else {
        return res.status(400).json({
            message: "Bad Request No query params"
        });
    }
}));
app.listen(3000, () => {
    console.log("Starting the server...");
});
