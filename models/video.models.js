import mongoose,{Schema} from "mongoose";

const VideoSchema = new Schema({
    title:{
        type:String,
        required:true,
        trim:true,
        maxlength:100
    },
    description:{
        type:String,
        required:true,
        trim:true,
        minlength:100
    },
    videoUrl:{
        type:String,
        required:true,
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    tags: [{  // Tags for categorizing videos
        type: String,
        trim: true
    }],
    comments:[{
     type:Schema.Types.ObjectId,
     ref:"Comment"   
    }],
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    isPublic: {
        type: Boolean,
        default: true  // Video privacy, true = public, false = private
    },
    updateAt:{
        type:Date,
        default:Date.now,
    },
    createAt:{
        type:Date,
        default:Date.now,
    },
},{timestamps:true})


VideoSchema.pre('save', function(next) {
    this.updatedAt = Date.now();  // Automatically update the timestamp when saving
    next();
});


export const Video = mongoose.model("Video",VideoSchema);

