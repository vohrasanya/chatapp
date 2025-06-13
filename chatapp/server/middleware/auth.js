import jwt from "jsonwebtoken";
import Users from "../models/Users.js";
//middleware to protect routes 
export const protectRoute = async (req, res, next)=>{
    try{
        const token = req.headers.token;

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        const user = await Users.findById(decoded.userId).select("-password");
        if(!user) return res.json({success : false, message: "User not found"});
        req.user = user;
        next();
    }catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}