import express from "express"
import cors from 'cors'
import cookieParser from "cookie-parser";
const app = express();

//middleware
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}))
// this middleware are used to access the json 
app.use(express.json({limit:"16kb",}))
// this middleware are used  to access the url data by limit of 20kb
app.use(express.urlencoded({limit:"20kb",extended:true}))
// this middleware are used to access the images txt etc from public folder
app.use(express.static("public"))
//cookieparser is used when we want to save something on browser cookie but that kind of cookies are only access by server

app.use(cookieParser())

import router from "./routers/user.routers.js";

 app.use("/api/v1/users",router)


export {app}