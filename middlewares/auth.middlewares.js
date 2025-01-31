import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/users.models.js";

const authMiddleware = asyncHandler(async(req,res,next)=>{
 try {
     const token = req.cookies?.token || req.headers("Authorization")?.replace("Bearer","")
     if(!token)
     {
       throw new ApiError(401,"Unauthorized request")
   
     }
     const decodetoken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
   
      const user =  await User.findById(decodetoken?._id).select("-password")
      if(!user)
      {
       throw new ApiError(401,"Invalid Access Token")
      }
   
      req.user = user;
      next();
 } catch (error) {
    throw new ApiError(401,error?.message || "Invalid Access Token")
 }

})

export default authMiddleware