import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

const handleValidationErrors = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    next();
};

export const validateMyUserRegister = [
    body("email").isString().notEmpty().isEmail().withMessage("Email is required"),
    body("password")
        .isString()
        .notEmpty()
        .isLength({min: 6})
        .withMessage("password is required"),
    body("firstName").isString().notEmpty().withMessage("First name is required"),
    body("lastName")
        .isString()
        .notEmpty()
        .withMessage("Last name is required"),
    handleValidationErrors,
];

export const validateMyUserAuth = [
  body("email").isString().notEmpty().isEmail().withMessage("Email is required"),
  body("password")
      .isString()
      .notEmpty()
      .isLength({min: 6})
      .withMessage("password is required"),
  handleValidationErrors,
];