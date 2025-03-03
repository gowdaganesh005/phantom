"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const phantom_c58f1_firebase_adminsdk_fbsvc_3481399cbe_json_1 = __importDefault(require("../../secrets/phantom-c58f1-firebase-adminsdk-fbsvc-3481399cbe.json"));
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(phantom_c58f1_firebase_adminsdk_fbsvc_3481399cbe_json_1.default)
});
exports.default = firebase_admin_1.default;
