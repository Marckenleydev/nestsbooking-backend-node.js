import express from "express"
import verifyToken from "../middleware/auth";
import BookingController from "../controllers/BookingController";


const router = express.Router();

router.get("/",verifyToken, BookingController.getMyBookings)

export default router