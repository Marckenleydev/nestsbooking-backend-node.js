import express from "express"
import HotelController from "../controllers/HotelController";
import { param } from "express-validator";

const router = express.Router();
router.get("/search", HotelController.searchHotel)
router.get("/:id",[param("id").notEmpty().withMessage("Hotel Id is required")],  HotelController.getHotel)
export default router