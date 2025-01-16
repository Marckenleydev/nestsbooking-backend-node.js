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



export const validateHotel = [

  body("name").isString().notEmpty().withMessage("Hotel name is required"),
  body("city").isString().notEmpty().withMessage("City is required"),
  body("country").isString().notEmpty().withMessage("Country is required"),
  body("description").isString().notEmpty().withMessage("Description is required"),
  body("type")
    .isString()
    .isIn([ "Budget",
      "Boutique",
      "Luxury",
      "Ski Resort",
      "Business",
      "Family",
      "Romantic",
      "Hiking Resort",
      "Cabin",
      "Beach Resort",
      "Golf Resort",
      "Motel",
      "All Inclusive",
      "Pet Friendly",
      "Self Catering"])
    .withMessage("Type must be a valid accommodation type"),
  body("adultCount")
    .isInt({ min: 1 })
    .withMessage("Adult count must be a number greater than 0"),
  body("childCount")
    .isInt({ min: 0 })
    .withMessage("Child count must be a number greater than or equal to 0"),
  body("facilities")
    .notEmpty()
    .isArray()
    .withMessage("Facilities must be an array"),
  body("pricePerNight")
    .isNumeric()
    .withMessage("Price per night must be a positive number"),
  body("starRating")
    .isInt({ min: 0, max: 5 })
    .withMessage("Star rating must be between 0 and 5"),
  body("lastUpdated")
    .optional()
    .isISO8601()
    .withMessage("Last updated must be a valid date"),
  body("bookings")
    .optional()
    .isArray()
    .withMessage("Bookings must be an array"),
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