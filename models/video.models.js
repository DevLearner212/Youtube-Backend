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
        trim:true,
    },
    videoUrl:{
        type:String,
        required:true,
    },
    duration: {
        type: Number,    // Store duration in seconds (e.g., 300 = 5 mins)
    },
    thumbnailUrl: { type: String },  // 🟡 New field for thumbnail
    owner:{
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
        type: [mongoose.Schema.Types.ObjectId],  // ✅ Ensure array of ObjectIds
        ref: "User",
        default: []
    },
    dislikes: {
        type: [mongoose.Schema.Types.ObjectId],  // ✅ Ensure array of ObjectIds
        ref: "User",
        default: []
    },
    views: {
        type: Number,
        default: 0
    },
    isPublic: {
        type: Boolean,
        default: true  // Video privacy, true = public, false = private
    },
    format:{type:String},
    updateAt:{
        type:Date,
        default:Date.now,
    },
    category: { type: String },
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

