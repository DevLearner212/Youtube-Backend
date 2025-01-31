import dotenv from 'dotenv'
import connectDB from './db/index.js'
import { app } from './app.js'
dotenv.config({
    path:"./env"
})


connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000)
    console.log(" ⚙️  Server is responding on 8000 Port")
}).catch((error)=>{
    console.log("Connection Error so server will not listen:",error);
    throw error;
})