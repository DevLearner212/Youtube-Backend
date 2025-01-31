import { Router } from "express";
import { loginUser, registerUser,logOut } from "../controller/user.controllers.js";
import { upload } from "../middlewares/multer.middlwares.js";
import authMiddleware from "../middlewares/auth.middlewares.js"


const router = Router();


router.route('/register').post(
    upload.fields([
        {name:"avatar",maxCount:1},{name:"coverimage",maxCount:1}
    ]),
    registerUser)

router.route("/login").post(loginUser)
router.route("/logout").post(authMiddleware,logOut)



export default router