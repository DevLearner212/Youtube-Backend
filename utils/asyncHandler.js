// const asyncHandler=(fn)=> async (req,res,next,err)=>{
//     try {
//     await fn(req,res,next); 
//     } catch (error) {
//         res.status(500).json({success:false,message:error.message})
//     }
// }

// Production level code
const asyncHandler =(requestHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
    }
}
export {asyncHandler}

