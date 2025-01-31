import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const userSchema =  new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true,
    },
    fullname:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,
        required:true,
    },
    coverimage:{
        type:String,

    },
    watchHistroy:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type:String,
        required:[true,'Password is required'],
    }

},{timestamps:true})


// It is a middleware that's why we are using next as a parameters
userSchema.pre("save",async function(next){
    if(!this.isModified("password"))
    {
       return next();
    }
    this.password = await bcrypt.hash(this.password,20)
    next();
})

userSchema.methods.isPasswordCorrect = async function(password)
{
   return await bcrypt.compare(password,this.password)
}


userSchema.methods.generateAccessToken=function()
{
    jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
    },
        process.env.ACCESS_TOKEN_SECRET,
        
        {expiresIn:process.env.ACCESS_TOKEN_EXPIRY}
        )
}


export const User = mongoose.model("User",userSchema)