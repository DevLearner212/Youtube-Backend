import { Router } from "express";
import { loginUser, registerUser,logOut,changeCurrentPassword,getUser,updateAccountDetails,updateAvtarFile,updateCoverImage} from "../controller/user.controllers.js";
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

router.route("/Passwordchange").post(authMiddleware,changeCurrentPassword)
router.route("/updateUser").post(authMiddleware,updateAccountDetails)
router.route("/updateAvatar").post(authMiddleware,updateAvtarFile)
router.route("/updateCoverImage").post(authMiddleware,updateCoverImage)

router.route("/getuser").get(authMiddleware,getUser)


export default router