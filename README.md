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
│── /config            # Configuration files (DB, Cloudinary, etc.)
│── /controllers       # Business logic & API controllers
│── /models           # Mongoose models (User, Video, Comment)
│── /routes           # API routes (User, Video, Comment)
│── /middlewares      # Authentication & error-handling middlewares
│── /utils            # Utility functions (API error handling, helpers)
│── server.js         # Main entry point
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
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4⃣ **Run the server**  
```sh
npm start
```
Server will start at **http://localhost:5000**  

---

## 📺 API Endpoints  

### **Auth Routes**  
- `POST /api/auth/register` → Register a new user  
- `POST /api/auth/login` → Login user  

### **Video Routes**  
- `POST /api/videos/upload` → Upload a new video  
- `GET /api/videos/:id` → Get video details  
- `PUT /api/videos/:id` → Update video details  
- `DELETE /api/videos/:id` → Delete a video  

### **User Routes**  
- `GET /api/users/:id` → Get user profile  
- `PUT /api/users/:id` → Update user details  
- `DELETE /api/users/:id` → Delete user account  

### **Like & Comment Routes**  
- `POST /api/videos/:id/like` → Like a video  
- `POST /api/videos/:id/comment` → Comment on a video  

---

## 🤝 Contributing  
Feel free to contribute! Fork the repo, create a new branch, and submit a PR.  


