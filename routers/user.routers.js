import { Router } from "express";
import { loginUser, registerUser,logOut,changeCurrentPassword,getUser,createVideo,updateAccountDetails,uploadVideo,updateAvtarFile,updateCoverImage,getAllVideos,
    getSingleVideo,likeVideo,

} from "../controller/user.controllers.js";
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
router.route('/uploadVideo').post(authMiddleware, upload.single('video'), uploadVideo);
router.route('/createVideo').post(authMiddleware,upload.single('thumbnailUrl'), createVideo);

router.route("/videos").get(authMiddleware,getAllVideos);
router.route('/video/:id').get(authMiddleware,getSingleVideo);  
// router.route('/search').get(authMiddleware,searchVideos); 
router.route('/video/:id/like').post(authMiddleware, likeVideo);
// router.route('/trending').get(getTrendingVideos);
// router.route('/recent').get(getRecentVideos);
// router.route('/recommended/:id').get(getRecommendedVideos)






// ✅ 2. Comment Routes


// Add a comment
// router.route('/video/:id/comment').post(authMiddleware, addComment);

// // Get all comments for a video
// router.route('/video/:id/comments').get(getAllComments);

// // Edit a comment
// router.route('/comment/:id').put(authMiddleware, editComment);

// // Delete a comment
// router.route('/comment/:id').delete(authMiddleware, deleteComment);







// ✅ 3. Playlist Routes




// Create a playlist
// router.route('/playlist/create').post(authMiddleware, createPlaylist);

// // Add a video to a playlist
// router.route('/playlist/:id/addVideo').post(authMiddleware, addVideoToPlaylist);

// // Remove a video from a playlist
// router.route('/playlist/:id/removeVideo').delete(authMiddleware, removeVideoFromPlaylist);

// // Get all playlists by user
// router.route('/playlists').get(authMiddleware, getAllPlaylists);

// // Get a single playlist
// router.route('/playlist/:id').get(getSinglePlaylist);

// // Delete a playlist
// router.route('/playlist/:id').delete(authMiddleware, deletePlaylist);















// ✅ 5. History & Watch Later Routes




// // Add video to history
// router.route('/history/add').post(authMiddleware, addToHistory);

// // Get watch history
// router.route('/history').get(authMiddleware, getWatchHistory);

// // Add video to Watch Later
// router.route('/watchlater/add').post(authMiddleware, addToWatchLater);

// // Get Watch Later videos
// router.route('/watchlater').get(authMiddleware, getWatchLaterVideos);

// // Remove from Watch Later
// router.route('/watchlater/:id').delete(authMiddleware, removeFromWatchLater);











// ✅ 6. Views & Analytics Routes



// Add view count when a video is played
// router.route('/video/:id/view').post(addView);

// // Get video views count
// router.route('/video/:id/views').get(getVideoViews);

// // Get channel analytics (views, likes, comments)
// router.route('/analytics').get(authMiddleware, getChannelAnalytics);




export default router