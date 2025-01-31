import {asyncHandler} from "../utils/asyncHandler.js"
const registerUser = asyncHandler(async(req,res)=>{
    //get user detail from frontend;
    //validation - not emtpy
    //check if user already exist or not 
    //check image or cover image exist or not
    //upload them to the cloudinary
    //create user object - create entry in db

    const {fullname,email,password,username} = req.body

   return res.json({
        fullname,email,password,username
    })
})


export {registerUser}