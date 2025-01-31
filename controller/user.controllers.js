import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/users.models.js"
import uploadOnCloudinary from "../utils/Cloudinary.js"
import {ApiResolve} from "../utils/ApiResolve.js"
const registerUser = asyncHandler(async(req,res)=>{
    //get user detail from frontend;
    //validation - not emtpy
    //check if user already exist or not 
    //check image or cover image exist or not
    //upload them to the cloudinary
    //create user object - create entry in db

    const {fullname,email,password,username} = req.body

     if([fullname,email,password,username].some((field)=>field?.trim() ==""))
     {
        throw new ApiError(404,"All Field are required")
     }

     const existedUser = await User.findOne({
        $or:[{email},{username}]
     })
     if(existedUser)
     {
        throw new ApiError(409,"Username and email are already exist")
     }

     const avatarLocalPath  = req.files?.avatar[0]?.path
     const coverLocalPath = req.files?.coverimage[0]?.path

     if(!avatarLocalPath)
     {
        throw new ApiError(404,"Avatar file required")
     }
    const avatar =  await uploadOnCloudinary(avatarLocalPath);
    const coverImage =  await uploadOnCloudinary(coverLocalPath);

    if(!avatar)
    {
        throw new ApiError(404,"Avatar is required");
    }

  const user  = await  User.create({
        fullname,
        avatar:avatar.url,
        coverimage:coverImage?.url || "",
        username:username.toLowerCase(),
        email,
        password

    })

    let createuser = await User.findById(user?._id).select("-password")
    if(!createuser)
    {
        throw new ApiError(404,"User does not exist");
    }

    res.status(200).json({
        message:"User register successfully",
        createuser,
        success:true,
    })

})


export {registerUser}