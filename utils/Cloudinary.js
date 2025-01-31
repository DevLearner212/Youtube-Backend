import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


cloudinary.config({ 
    cloud_name: 'devsaini', 
    api_key: process.env.CLOUDINARY_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET_KEY // Click 'View API Keys' above to copy your API secret
});


const uploadOnCloudinary = async (localFilePath)=>{
    try {
        if (!localFilePath)
        {
            return null;
        }
       const response =  await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        // this unlink is used when file are upload on cloudinary then also file will delete
         fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null;
    }
}


export default uploadOnCloudinary
