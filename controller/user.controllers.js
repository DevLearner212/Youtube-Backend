import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/users.models.js"
import uploadOnCloudinary from "../utils/Cloudinary.js"
import {ApiResolve} from "../utils/ApiResolve.js"
import { Video } from "../models/video.models.js"
import { UploadVideo } from "../models/UploadVideos.models.js"
import { Comment } from "../models/Comment.models.js"
import { WatchLater } from "../models/WatchLater.models.js"
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
        if (!req.file) {
            throw new ApiError(400, "No video file uploaded");
        }

        const videoFile = req.file.path;
        const uploaded = await uploadOnCloudinary(videoFile);
        if (!uploaded) throw new ApiError(500, "Failed to upload video");

        const newVideo = await Video.create({
            duration: uploaded.duration,
            format: uploaded.format,
            videoUrl: uploaded.secure_url,
            owner: req.user._id
        });

        res.status(201).json(new ApiResolve(201, "Video uploaded successfully", newVideo));

    } catch (error) {
        console.error(error.message);
        res.status(500).json(new ApiError(500, "Server error", error.message));
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


const getTrendingVideos = asyncHandler(async(req,res)=>{
    try {
        
        const video = await Video.find().sort({views:-1,likes:-1,createdAt:-1}).limit(10);;
        res.send(video)
    } catch (error) {
        res.send(error.message)
    }
})

const addView = asyncHandler(async(req,res)=>{
    try {
            const {id} = req.params;
        const video = await Video.findByIdAndUpdate(
            id,{$set:{views:1}},{new:true}
        );

        res.send(video)
    } catch (error) {
        res.send(error.message)
    }
})



const addComment = asyncHandler(async(req,res)=>{
    try {
        // user id
        // video id
        // comment message
        
        const {id} = req.params;
        const userId = req.user?._id;
        const {message,username} = req.body;
        const comment = await Comment.create({videoId:id,userId:userId,text:message,username})
        if(!comment)
        {
            throw new ApiError(400,"Something went wrong while comment on video");
        }
        res.send(comment)
    } catch (error) {
        res.send(error.message)
    }
})



const replycomment=asyncHandler(async(req,res)=>{

    const { text, username, commentId } = req.body;    // Extract reply data from request body
    const userId = req.user._id;                       // Extract user ID from auth middleware

    try {
        // Use `findByIdAndUpdate` with proper query syntax
        const comment = await Comment.findByIdAndUpdate(
            commentId, 
            {
                $push: { 
                    replies: { 
                        userId, 
                        username, 
                        text, 
                        createdAt: new Date() 
                    } 
                }
            },
            { new: true, runValidators: true }    // Return the updated document
        );

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        res.status(200).json({ message: 'Reply added successfully', comment });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add reply', error: error.message });
    }
    
})








const getAllComments=asyncHandler(async(req,res)=>{
 
 
    try {
        const comments = await Comment.find()
        res.send(comments);
    } catch (error) {
        res.send(error.message);
        
    }
    
})




const editComment=asyncHandler(async(req,res)=>{
 
    const { commentId, text } = req.body;
    const userId = req.user._id;

    try {
        const comment = await Comment.findOneAndUpdate(
            { _id: commentId, user: userId },
            { text, updatedAt: new Date() },
            { new: true, runValidators: true }
        );

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found or unauthorized' });
        }

        res.status(200).json({ message: 'Comment updated successfully', comment });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update comment', error: error.message });
    }
    
})




const deleteComment=asyncHandler(async(req,res)=>{
 
    const { commentId } = req.params;
    const userId = req.user._id;

    try {
        const comment = await Comment.findOneAndDelete({ _id: commentId, user: userId });

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found or unauthorized' });
        }

        res.status(200).json({ message: 'Comment deleted successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete comment', error: error.message });
    }
    
})



const getVideoViews = asyncHandler(async (req, res) => {
    const { id } = req.params;   // Video ID from URL params

    try {
        const video = await Video.findById(id);

        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        res.status(200).json({ views: video.views });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch video views', error: error.message });
    }
});


const getChannelAnalytics = asyncHandler(async (req, res) => {
    const userId = req.user._id;   // Authenticated user's ID

    try {
        // Fetch total views, likes, and comments for the user's channel
        const videos = await Video.find({ user: userId });

        if (!videos.length) {
            return res.status(404).json({ message: 'No videos found for this channel' });
        }

        // Aggregate analytics
        const totalViews = videos.reduce((acc, video) => acc + video.views, 0);
        const totalLikes = videos.reduce((acc, video) => acc + video.likes.length, 0);

        // Fetch total comments for all videos
        const videoIds = videos.map((video) => video._id);
        const totalComments = await Comment.countDocuments({ videoId: { $in: videoIds } });

        res.status(200).json({
            totalViews,
            totalLikes,
            totalComments,
            videoCount: videos.length
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch channel analytics', error: error.message });
    }
});





















const addToHistory = asyncHandler(async (req, res) => {
    const { videoId } = req.body;         // Extract video ID from request body
    const userId = req.user._id;           // Get authenticated user ID

    try {
        // Check if the video exists
        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        // Add video to history or update timestamp if already exists
        const history = await History.findOneAndUpdate(
            { user: userId, video: videoId },
            { $set: { watchedAt: new Date() } },
            { upsert: true, new: true }
        );

        res.status(200).json({ message: 'Video added to history', history });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add video to history', error: error.message });
    }
});

// ➤ Get Watch History
const getWatchHistory = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    try {
        const history = await History.find({ user: userId })
            .populate('video')
            .sort({ watchedAt: -1 });   // Sort by most recently watched

        res.status(200).json(history);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch watch history', error: error.message });
    }
});






const addToWatchLater = asyncHandler(async (req, res) => {
    const { videoId } = req.body;    // Extract video ID from request body
    const userId = req.user._id;     // Get authenticated user ID

    try {
        // ✅ Check if the video exists
        const video = await Video.findById(videoId);
        if (!video) {
            const error = new ApiError(404, 'Video not found');
            return res.status(error.statusCode).json({
                success: error.success,
                statusCode: error.statusCode,
                message: error.message,
                errors: error.errors
            });
        }

        // ✅ Check if the video is already in Watch Later
        const existing = await WatchLater.findOne({ user: userId, video: videoId });

        if (existing) {
            const error = new ApiError(409, 'Video already in Watch Later');
            return res.status(error.statusCode).json({
                success: error.success,
                statusCode: error.statusCode,
                message: error.message,
                errors: error.errors
            });
        }

        // ✅ Add the video to Watch Later
        const watchLater = await WatchLater.create({ user: userId, video: videoId });

        // ✅ Success response
        const response = new ApiResolve(201, 'Added to Watch Later', watchLater);
        res.status(response.statuscode).json({
            success: response.success,
            statusCode: response.statuscode,
            message: response.message,
            data: response.data
        });

    } catch (error) {
        console.error(error);

        // ✅ Handle unexpected server errors
        const apiError = new ApiError(500, 'Failed to add video to Watch Later', [error.message]);
        res.status(apiError.statusCode).json({
            success: apiError.success,
            statusCode: apiError.statusCode,
            message: apiError.message,
            errors: apiError.errors
        });
    }
});

// ➤ Get Watch Later Videos
const getWatchLaterVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    try {
        const watchLater = await WatchLater.find({ user: userId })
            .populate('video')
            .sort({ createdAt: -1 });

        // Handle case when no videos are found in Watch Later
        if (!watchLater || watchLater.length === 0) {
            const error = new ApiError(404, 'No videos found in Watch Later');
            return res.status(error.statusCode).json({
                success: error.success,
                statusCode: error.statusCode,
                message: error.message,
                errors: error.errors
            });
        }

        // Success response
        const response = new ApiResolve(200, 'Watch Later videos fetched successfully', watchLater);
        res.status(response.statuscode).json({
            success: response.success,
            statusCode: response.statuscode,
            message: response.message,
            data: response.data
        });

    } catch (error) {
        console.error(error);

        // Handle unexpected errors
        const apiError = new ApiError(500, 'Internal Server Error', [error.message]);
        res.status(apiError.statusCode).json({
            success: apiError.success,
            statusCode: apiError.statusCode,
            message: apiError.message,
            errors: apiError.errors
        });
    }
});

// ➤ Remove Video from Watch Later
const removeFromWatchLater = asyncHandler(async (req, res) => {
    const { id } = req.params;          // Watch Later entry ID (not video ID)
    const userId = req.user._id;         // Current user's ID

    try {
        const removed = await WatchLater.findOneAndDelete({ _id: id, user: userId });

        // Handle case when the video is not found in Watch Later
        if (!removed) {
            const error = new ApiError(404, 'Video not found in Watch Later');
            return res.status(error.statusCode).json({
                success: error.success,
                statusCode: error.statusCode,
                message: error.message,
                errors: error.errors
            });
        }

        // Success response
        const response = new ApiResolve(200, 'Video removed from Watch Later successfully');
        res.status(response.statuscode).json({
            success: response.success,
            statusCode: response.statuscode,
            message: response.message,
            data: response.data
        });

    } catch (error) {
        // Handle unexpected errors
        const apiError = new ApiError(500, 'Internal Server Error', [error.message]);
        res.status(apiError.statusCode).json({
            success: apiError.success,
            statusCode: apiError.statusCode,
            message: apiError.message,
            errors: apiError.errors
        });
    }
});



const getRecentVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;  // Pagination parameters
    const skip = (page - 1) * limit;

    try {
        const recentVideos = await Video.find({})
            .sort({ createdAt: -1 })      // Sort by most recent
            .skip(skip)
            .limit(parseInt(limit));

        const totalVideos = await Video.countDocuments();

        res.status(200).json({
            page: parseInt(page),
            limit: parseInt(limit),
            totalVideos,
            totalPages: Math.ceil(totalVideos / limit),
            videos: recentVideos
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch recent videos', error: error.message });
    }
});

const getRecommendedVideos = asyncHandler(async (req, res) => {
    const { id } = req.params;       // Video ID
    const { limit = 10 } = req.query; // Limit for recommendations

    try {
        const currentVideo = await Video.findById(id);

        if (!currentVideo) {
            throw new ApiError(404, 'Video not found');
        }

        const { category, tags } = currentVideo;

        // Find recommended videos by matching category or tags, excluding current video
        const recommendedVideos = await Video.find({
            _id: { $ne: id },
            $or: [
                { category: category },      // Match by category
                { tags: { $in: tags } }     // Match by tags
            ]
        })
        .limit(parseInt(limit))
        .sort({ views: -1 });  // Sort by most viewed

        if (recommendedVideos.length === 0) {
            throw new ApiError(404, 'No recommended videos found');
        }

        // Send success response
        const response = new ApiResolve(200, 'Recommended videos fetched successfully', recommendedVideos);
        res.status(response.statuscode).json(response);

    } catch (error) {
        return new ApiError(400,"Something went wrong",error.message)
    }
});



export {registerUser,loginUser,logOut,changeCurrentPassword,getUser,uploadVideo,createVideo,getAllVideos,updateAccountDetails,updateAvtarFile,updateCoverImage,getUserChannelProfile,getSingleVideo,likeVideo,getTrendingVideos,addView,addComment,replycomment,getAllComments,editComment,deleteComment,getVideoViews,getChannelAnalytics,addToHistory,getWatchHistory,addToWatchLater,getWatchLaterVideos,removeFromWatchLater,getRecentVideos,getRecommendedVideos

}