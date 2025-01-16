import express,{Request,Response}  from "express"

import UserController from "../controllers/UserController"
import { validateMyUserAuth, validateMyUserRegister } from "../middleware/validation";
import verifyToken from "../middleware/auth";

const router = express.Router();

router.post("/register",validateMyUserRegister, UserController.registerUser)
router.post("/login",validateMyUserAuth, UserController.authUser)
router.post("/logout", UserController.logOut)
router.post("/validate-token", verifyToken, (req: Request, res: Response)=>{
    res.status(200).send({userId: req.userId})

})

export default router;