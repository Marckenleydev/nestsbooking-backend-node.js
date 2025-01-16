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
exports.validateMyUserAuth = exports.validateMyUserRegister = void 0;
const express_validator_1 = require("express-validator");
const handleValidationErrors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
});
exports.validateMyUserRegister = [
    (0, express_validator_1.body)("email").isString().notEmpty().isEmail().withMessage("Email is required"),
    (0, express_validator_1.body)("password")
        .isString()
        .notEmpty()
        .isLength({ min: 6 })
        .withMessage("password is required"),
    (0, express_validator_1.body)("firstName").isString().notEmpty().withMessage("First name is required"),
    (0, express_validator_1.body)("lastName")
        .isString()
        .notEmpty()
        .withMessage("Last name is required"),
    handleValidationErrors,
];
exports.validateMyUserAuth = [
    (0, express_validator_1.body)("email").isString().notEmpty().isEmail().withMessage("Email is required"),
    (0, express_validator_1.body)("password")
        .isString()
        .notEmpty()
        .isLength({ min: 6 })
        .withMessage("password is required"),
    handleValidationErrors,
];
