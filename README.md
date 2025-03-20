# YouTube Backend Clone 🎥  

A scalable backend for a YouTube-like video streaming platform, built with **Node.js, Express.js, MongoDB, and JWT authentication**. Supports user authentication, video uploads, likes, comments, and real-time notifications.  

---

## 🚀 Features  

✅ User authentication (JWT-based login & signup)  
✅ Video upload & streaming with **Cloudinary** integration  
✅ Like, comment, and subscription functionality  
✅ **Centralized API error handling** using a custom `errorHandling.js` utility  
✅ RESTful APIs with proper authentication

---

## 🛠️ Tech Stack  

- **Backend:** Node.js, Express.js, MongoDB  
- **Authentication:** JWT (JSON Web Token)  
- **File Uploads:** Multer (for video uploads), Cloudinary (for storage)    
- **Error Handling:** Centralized API error handling  

---

## 📂 Folder Structure  

```
/youtube-backend-clone
│── /controllers       # Business logic & API controllers
│── /db            # database connection  files (DB)
│── /models           # Mongoose models (User, Video, Comment)
│── /routes           # API routes (User, Video, Comment)
│── /middlewares      # Authentication & error-handling middlewares
│── /utils            # Utility functions (API error handling, helpers,Cloudinary setup,Multer setups)
│── app.js         # Main entry point
│── .env.example      # Sample environment variables
│── package.json      # Dependencies
│── README.md         # Project documentation
```

---

## 🛠️ Installation & Setup  

1⃣ **Clone the repository**  
```sh
git clone https://github.com/your-username/youtube-backend-clone.git
cd youtube-backend-clone
```

2⃣ **Install dependencies**  
```sh
npm install
```

3⃣ **Set up environment variables**  
Create a `.env` file in the root directory and add:  

```sh
PORT= 8000
MONGODB_URI= 

CORS_ORIGIN=*

ACCESS_TOKEN_SECRET= 

ACCESS_TOKEN_EXPIRY= 

CLOUDINARY_KEY= 
CLOUDINARY_SECRET_KEY= 
```

4⃣ **Run the server**  
```sh
npm start
```
Server will start at **http://localhost:8000**  

---
 ## 📺 API Endpoints  

## 🚀 Auth Routes  
- **POST** `/api/v1/users/register` → Register a new user with avatar and cover image upload  
- **POST** `/api/v1/users/login` → Login user  
- **POST** `/api/v1/users/logout` → Logout user (auth required)  
- **POST** `/api/v1/users/Passwordchange` → Change current password (auth required)  
- **POST** `/api/v1/users/updateUser` → Update account details (auth required)  
- **POST** `/api/v1/users/updateAvatar` → Update avatar file (auth required)  
- **POST** `/api/v1/users/updateCoverImage` → Update cover image (auth required)  
- **GET** `/api/v1/users/getuser` → Get user profile (auth required)  

---

## 🎥 Video Routes  
- **POST** `/api/videos/uploadVideo` → Upload a new video (auth required)  
- **POST** `/api/videos/createVideo` → Create video with thumbnail (auth required)  
- **GET** `/api/videos` → Get all videos (auth required)  
- **GET** `/api/videos/:id` → Get a single video by ID (auth required)  
- **POST** `/api/videos/:id/like` → Like a video (auth required)  
- **GET** `/api/videos/trending` → Get trending videos  
- **GET** `/api/videos/recent` → Get recent videos  
- **GET** `/api/videos/recommended/:id` → Get recommended videos by ID  

---

## 💬 Comment Routes  
- **POST** `/api/video/:id/comment` → Add a comment to a video (auth required)  
- **POST** `/api/video/:id/replycomment` → Reply to a comment (auth required)  
- **GET** `/api/video/:id/comments` → Get all comments for a video  
- **PUT** `/api/comment/:id` → Edit a comment (auth required)  
- **DELETE** `/api/comment/:id` → Delete a comment (auth required)  

---

## 🔥 History & Watch Later Routes  
- **POST** `/api/history/add` → Add video to history (auth required)  
- **GET** `/api/history` → Get watch history (auth required)  
- **POST** `/api/watchlater/add` → Add video to Watch Later (auth required)  
- **GET** `/api/watchlater` → Get Watch Later videos (auth required)  
- **DELETE** `/api/watchlater/:id` → Remove video from Watch Later (auth required)  

---

## 📊 Views & Analytics Routes  
- **POST** `/api/video/:id/view` → Add view count when a video is played (auth required)  
- **GET** `/api/video/:id/views` → Get video views count  
- **GET** `/api/analytics` → Get channel analytics (views, likes, comments) (auth required)  


---

## 🤝 Contributing  
Feel free to contribute! Fork the repo, create a new branch, and submit a PR.  


