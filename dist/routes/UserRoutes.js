"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = __importDefault(require("../controllers/UserController"));
const validation_1 = require("../middleware/validation");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
router.post("/register", validation_1.validateMyUserRegister, UserController_1.default.registerUser);
router.post("/login", validation_1.validateMyUserAuth, UserController_1.default.authUser);
router.post("/logout", UserController_1.default.logOut);
router.post("/validate-token", auth_1.default, (req, res) => {
    res.status(200).send({ userId: req.userId });
});
exports.default = router;
