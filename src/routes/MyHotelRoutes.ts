import express from "express"
import multer from "multer";
import MyHotelController from "../controllers/MyHotelController";
import verifyToken from "../middleware/auth";
import { validateHotel } from "../middleware/validation";


const storage = multer.memoryStorage()
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5* 1024 * 1024
    }
})


const router = express.Router();
router.post("/",upload.array("imageFiles",6),verifyToken, validateHotel, MyHotelController.createMyHotel)

export default router