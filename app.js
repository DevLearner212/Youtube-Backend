import express from "express"
import cors from 'cors'
import cookieParser from "cookie-parser";
const app = express();

//middleware
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}))
app.use(express.json({limit:"16kb",}))
app.use(express.urlencoded({limit:"20kb",extended:true}))
app.use(express.static("public"))
app.use(cookieParser())


app.get("/",(req,res)=>{
    res.send("Hi i am localhost Server:::")
})


export {app}