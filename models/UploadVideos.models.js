import mongoose, { Schema } from "mongoose";

const videoUploadSchema = new Schema({

    duration:{type:String,required:true},
    videoUrl: {
        type: String,
        required: true,
    },

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    format: { type: String },
    updateAt: {
        type: Date,
        default: Date.now,
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true })


videoUploadSchema.pre('save', function (next) {
    this.updatedAt = Date.now();  // Automatically update the timestamp when saving
    next();
});


export const UploadVideo = mongoose.model("UploadVideo", videoUploadSchema);

