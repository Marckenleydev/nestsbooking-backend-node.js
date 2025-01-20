import express from "express"
import HotelController from "../controllers/HotelController";
import { param } from "express-validator";
import verifyToken from "../middleware/auth";

const router = express.Router();
router.get("/search", HotelController.searchHotel)
router.post("/:hotelId/bookings",verifyToken, HotelController.createBooking)
router.post("/:hotelId/bookings/payment-intent", verifyToken, HotelController.createCheckoutSession )
router.get("/", HotelController.getHotels)
router.get("/:id",[param("id").notEmpty().withMessage("Hotel Id is required")],  HotelController.getHotel)
export default router