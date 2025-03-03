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
const express_1 = require("express");
const db_1 = require("../utils/db");
const router = (0, express_1.Router)();
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, name, email } = req.body;
    if (userId && name && email) {
        const response = yield db_1.prisma.user.upsert({
            where: {
                userId: userId,
                email: email
            },
            update: {
                name: name,
            },
            create: {
                userId: userId,
                name: name,
                email: email
            }
        });
        if (response) {
            return res.json(200).json({
                message: "Login Successfull"
            });
        }
        else {
            return res.status(400).json({
                message: "Error creating user"
            });
        }
    }
    else {
        return res.status(400).json({
            message: "Failed Login"
        });
    }
}));
exports.default = router;
