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
require("dotenv/config");
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const UserRoutes_1 = __importDefault(require("./routes/UserRoutes"));
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use((0, morgan_1.default)(":method :url :status :response-time ms"));
app.get("/test", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ message: "Hello World" });
}));
app.use("/api/users", UserRoutes_1.default);
app.get("/health", (req, res) => {
    res.status(200).send("OK");
});
app.listen(process.env.PORT || 7070, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
mongoose_1.default.connect(process.env.MONGO_URI).then(() => {
    console.log("Connected to MongoDB");
}).catch(error => console.error(error));
