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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield User_1.default.findOne({
            email: req.body.email,
        });
        if (user) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        user = new User_1.default(req.body);
        yield user.save();
        setAuthToken(res, user.id);
        res.status(201).json({ message: "User registered successfully" });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "something went wrong" });
    }
});
const authUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.default.findOne({ email: email });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const isPasswordMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordMatch) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        setAuthToken(res, user.id);
        res.status(200).json({ userId: user._id });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "something went wrong" });
        return;
    }
});
const logOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie("auth_token", "", {
        expires: new Date(0),
        // Set it to 0 to expire the cookie immediately
    });
    res.send();
});
exports.default = { registerUser, authUser, logOut };
const setAuthToken = (res, userId) => {
    const token = jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
    res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000, // 1 day in milliseconds
    });
    return token;
};
