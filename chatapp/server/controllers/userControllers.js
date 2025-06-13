import Users from "../models/Users.js";
import {generateToken} from "../lib/utlis.js";
import bcrypt from "bcryptjs";
import cloudinary from '../lib/cloudinary.js';



//signup a new user
export const signup = async (req,res)=>{
    const {fullName , email , password , bio } = req.body;
    try{
        if(!fullName || !email || !password || !bio){
            return res.json({success:  false, message: "Missing Details"})
        }
        const user = await Users.findOne({email});
        if(user){
            return res.json({success: false, message:"Account already exists"})
        }
        const salt = await bcrypt.genSalt(10);
        const hashesPassword = await bcrypt.hash(password,salt);

        const newUser = await Users.create({
            fullName,email,password :hashesPassword, bio 
        });
        const token = generateToken(newUser._id);
        res.json({success: true , userData: newUser, token, message :"Account created successfully"})
    }catch(error){
        console.log(error.message);
        res.json({success: false , message : error.message})
    }
}
//controller to login a user 
export const login = async (req, res)=>{
    try{
        const {email , password } =req.body;
        const userData =  await Users.findOne({email})

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);
        if(!isPasswordCorrect){
            return res.json({success:false, message:"Invalid Crudentials"});

        }
        const token = generateToken(userData._id)
        res.json({success: true , userData , token, message :"Login Successful"})

    }catch(error){
        console.log(error.message);
        res.json({success: false , message : error.message})
    }
}
// controller to check if user is authenticated
 export const checkAuth = (req, res)=>{
    res.json({success: true , user: req.user});
 }

 // controllers/userController.js or controllers/authController.js



// ✅ Make sure req.user is populated by verifyJWT middleware
export const updateProfile = async (req, res) => {
    try {
        const { profilePic, bio, fullName } = req.body;
        const userId = req.user._id;

        let updatedUser;

        if (!profilePic) {
            updatedUser = await Users.findByIdAndUpdate(
                userId,
                { bio, fullName },
                { new: true }
            );
        } else {
            const upload = await cloudinary.uploader.upload(profilePic);
            updatedUser = await Users.findByIdAndUpdate(
                userId,
                { profilePic: upload.secure_url, bio, fullName },
                { new: true }
            );
        }

        res.json({ success: true, user: updatedUser });

    } catch (error) {
        console.error("Error in updateProfile:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};
