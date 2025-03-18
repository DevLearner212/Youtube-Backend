import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/users.models.js"
import uploadOnCloudinary from "../utils/Cloudinary.js"
import {ApiResolve} from "../utils/ApiResolve.js"
import { Video } from "../models/video.models.js"
import { UploadVideo } from "../models/UploadVideos.models.js"
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
     let coverLocalPath;


     if(req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length > 0)
     {
       coverLocalPath =  req.files.coverimage[0].path
     }

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


const loginUser = asyncHandler(async(req,res)=>{
    // first username or email get from the frontend
    // check both are exist or not
    // if both are exist return the username or email and also generate the access token as well as 


 

    const {email,password,username} = req.body

    if(!(email || username))
    {
        throw new ApiError(404,"Username and password is required")
    }
    const user = await User.findOne({
        $or:[{email},{username}]
    })




    if(!user)
    {
        console.log("Complete")
        throw new ApiError(404,"User does not exist..")
    }
    const passwordCheck = await user.isPasswordCorrect(password)
    if(!passwordCheck)
    {
        console.log("Complete")
        throw new ApiError(404,"Password is incorrect")
    }

    // now its time to generate the Token 

    const token = await user.generateAccessToken();
    const createuser = await User.findById(user?._id).select("-password -watchHistroy")
    let options={
        httpOnly:true,
        secure:true,
    }
 
    res.status(200).cookie("token",token,options).json(new ApiResolve(200,
        {userData:createuser,token},"User logged in Successfully"
    ))


   
})

const logOut = asyncHandler(async(req,res)=>{
    // first clear the cookies
    const options={
        httpOnly:true,
        secure:true,
    }
    return res.status(200).clearCookie("token",options).json(new ApiResolve(200,{},"User Log out."))
})



const  changeCurrentPassword=asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword} = req.body
// const {oldPassword,newPassword,confirmPassword} = req.body


// if(newPassword !=confirmPassword)
// {
//     throw new ApiError(400,"New password and confirm password are not matched")
// }

const user = await User.findById(req.user?._id)


    if(!user)
    {
        throw new ApiError(400,"User not logged in")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if(!isPasswordCorrect)
    {
        throw new ApiError(400,"Invalid Password")
    }

    user.password = newPassword
    // validationBeforesave is used when you dont want to change any other validation
    await user.save({validateBeforeSave:false});

    return res.status(200).json(new ApiResolve(200,{},"User password changed"))


})



const getUser = asyncHandler(async(req,res)=>{

    const user = await User.findById(req.user?._id)
    if(!user)
    {
        throw new ApiError(400,"User not logged in")
    }

    res.status(200).json(new ApiResolve(200,user,));

})


const updateAccountDetails = asyncHandler(async(req,res)=>{

    const {fullname,email} = req.body
    if(!(fullname || email))
    {
        throw new ApiError(400,"Fields are required")
    }

    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set:{
                fullname,email
            }
        },
        {new :true}).select("-password")

        return res.status(200).json(new ApiResolve(200,user,"Account details update successfully"))
})



const updateAvtarFile = asyncHandler(async(req,res)=>{

    const avatarLocalPath = req.file?.path
    if(!avatar)
    {
        throw new ApiError(400,"Avatar are missing")
    }
   const uploadAvatar =  await uploadOnCloudinary(avatarLocalPath)
   if(!uploadAvatar)
    {
        throw new ApiError(400,"Error while uploading avatar image")
    }
    const user = await User.findByIdAndUpdate(req.user?._id,{$set:{avatar:avatarLocalPath?.url}},{new:true}).select("-password")

return res.status(200).json(new ApiResolve(200,{},"Avatar Image are updated"))

})

const updateCoverImage = asyncHandler(async(req,res)=>{

    const coverLocalPath = req.file?.path
    if(!coverLocalPath)
    {
        throw new ApiError(400,"Cover image are missing")
    }
   const uploadCoverImage =  await uploadOnCloudinary(coverLocalPath)
   if(!uploadCoverImage)
    {
        throw new ApiError(400,"Error while uploading cover image")
    }
    const user = await User.findByIdAndUpdate(req.user?._id,{$set:{coverimage:coverLocalPath?.url}},{new:true}).select("-password")

return res.status(200).json(new ApiResolve(200,{},"Cover Image are updated.."))

})


const getUserChannelProfile = asyncHandler(async(req,res)=>{
   try {
     const {username} = req.params
 
     if(!username?.trim())
     {
         throw new ApiError(400,"Username is missing ")
     }
 
     const userChannel = await User.aggregate([
         {
             $match:username?.toLowerCase()
         },
         {
             $lookup:{
                 from:"subscriptions",
                 localField:"_id",
                 foreignField:"channel",
                 as:"subscribers"
             }
         },
         {
             $lookup:{
                 from:"subscriptions",
                 localField:"_id",
                 foreignField:"subscriber",
                 as:"subscribedTo"
             }
         },
 
         {
             $addFields:{
                 subscriberCount:{
                     $size:"$subscribers",
                 },
                 channelCount:{
                     $size:"$subscribedTo",
                 },
                 isSubscribed:{
                     $cond:{
                         if:{$in:[req.user?._id,"$subscribers.subscriber"]},
                         then:true,
                         else:false,
                     }
                 }
             },
           
         },
         {
             $project:{
                 fullname:1,
                 username:1,
                 subscriberCount:1,
                 channelCount:1,
                 isSubscribed:1,
                 avatar:1,
                 coverimage:1,
                 email:1,
             }
         }
         
     ])
 
     if(!userChannel.length)
     {
         throw new ApiError(404,"Channel doest not exists")
     }
 
     return res.status(200).josn(new ApiResolve(200,userChannel[0],"User channel feteced successfully"))
  
 
 
 
 
   } catch (error) {
    res.status(500).json({ message: 'Server error' });
   }

})



const uploadVideo = asyncHandler(async(req,res)=>{

    try {
        // Check if file exists
        if (!req.file) {
            return res.status(400).json({ message: 'No video file uploaded' });
        }
        const videoFile = req.file?.path;
        const videoupload = await uploadOnCloudinary(videoFile)
        if(!videoupload)
        {
            throw new ApiError(400,"Something Went wrong while uploading the Video ....")
        }
        // Create a new video document
        const newVideo = new UploadVideo({
            duration:videoupload?.duration,
            format:videoupload?.format,
            videoUrl: videoupload?.secure_url,
            owner: req.user._id // Assuming user is attached to req by authMiddleware
        });

        await newVideo.save();

        res.status(201).json({ message: 'Video uploaded successfully', video: newVideo });
    } catch (error) {
        console.error('Error uploading video:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
})





const createVideo = asyncHandler(async(req,res)=>{

    try {
        // Check if file exists
        const {title,description,isPublic,tags,} = req.body;

        const thumbnailUrl = req.file?.path;
        const uploadThumbnail = await uploadOnCloudinary(thumbnailUrl);
            
        if(!uploadThumbnail)
        {
            throw new ApiError(400,"Something Went wrong while uploading the Video ....")
        }
        const uploadVideo = await UploadVideo.find({ owner: req.user?._id });
        
        
        if(!uploadVideo)
        {
            throw new ApiError(400,"Uploaded Videos not found..");
        }

        // Create a new video document
        const newVideo = new Video({
            title:title,
            description:description || "",
            isPublic:isPublic || false,
            tags:tags || "",
            duration:uploadVideo?.duration,
            format:uploadVideo?.format,
            thumbnailUrl:uploadThumbnail?.secure_url,
            videoUrl: uploadVideo[0]?.videoUrl,
            owner: req.user._id // Assuming user is attached to req by authMiddleware
        });
        if(!newVideo)
        {
            throw new ApiError(401,"Video is not created...");
        }

        await newVideo.save();
        

        res.status(201).json({ message: 'Video uploaded successfully', video: newVideo });
    } catch (error) {
        console.error('Error uploading video:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
})

const getAllVideos = asyncHandler(async(req,res)=>{


    try {
        const videos = await Video.aggregate([
            {
                $match:{isPublic:true}
            },
            {
                $project:{
                    title:1,
                    title: 1,
                    description: 1,
                    thumbnailUrl: 1,
                    duration: 1,
                    views: 1,
                    likes: 1,
                    createdAt: 1,
                    uploadedBy: 1,
                    tags:1
                }
            }
        ])
        
        res.status(200).json(new ApiResolve(200,{},videos))
    } catch (error) {
        res.status(400).json(new ApiResolve(400,"Something went wrong",error.message))
        
    }
})












const getSingleVideo = asyncHandler(async(req,res)=>{


    try {
        const {id} = req.params
        if(!id)
        {
            throw new ApiError(400,"Can't find the Id of the video")
        }
        const videos = await Video.findById(id)
        res.status(200).json(new ApiResolve(200,{},videos))
    } catch (error) {
        res.status(400).json(new ApiResolve(400,"Something went wrong",error.message))
        
    }
})




const likeVideo = asyncHandler(async(req,res)=>{


    try {
       const {id} = req.params;
       const userId = req.user?._id;
       const { action } = req.body; // like or dislike
       const video  = await Video.findById(id)
       if(!video)
       {
        throw new ApiError(400,"Video not found");
       }

       if (!Array.isArray(video.likes)) {
        video.likes = [];
    }
    if (!Array.isArray(video.dislikes)) {
        video.dislikes = [];
    }

       const isLiked = video.likes.includes(userId)
       const isDislike = video.dislikes.includes(userId)


       if (action === "like") {
        if (isLiked) {
            await Video.findByIdAndUpdate(id, { $pull: { likes: userId } });
            res.status(200).json({ message: "Like removed" });
        } else {
            await Video.findByIdAndUpdate(id, {
                $addToSet: { likes: userId },
                $pull: { dislikes: userId }
            });
            res.status(200).json({ message: "Video liked" });
        }
    }

    if (action === "dislike") {
        if (isDislike) {
            await Video.findByIdAndUpdate(id, { $pull: { dislikes: userId } });
            res.status(200).json({ message: "Dislike removed" });
        } else {
            await Video.findByIdAndUpdate(id, {
                $addToSet: { dislikes: userId },
                $pull: { likes: userId }
            });
            res.status(200).json({ message: "Video disliked" });
        }
    }
     
       
    } catch (error) {
        res.status(400).json(new ApiResolve(400,"Something went wrong",error.message))
        
    }
})





export {registerUser,loginUser,logOut,changeCurrentPassword,getUser,uploadVideo,createVideo,getAllVideos,updateAccountDetails,updateAvtarFile,updateCoverImage,getUserChannelProfile,getSingleVideo,likeVideo}