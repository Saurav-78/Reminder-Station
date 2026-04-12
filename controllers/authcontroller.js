const User = require ("../Models/user");
const bcrypt = require('bcriptjs');
const JWT = require("jsonwebtoken");
exports.signup = async(req,res)=>{
    try{
        const {name, email, password} = req.body;
        const existing = await User.findOne({email});
        if(existing){
            return res.status(400).json("User already exists")
        }
        const hashed = await bcrypt.hash(password,10);
        const user = new User ({name, email, password:hashed});
        await user.save();
        res.json("Singup succsesfull");
    }
    catch(error){
        res.status(500).json(error);

    }
};
exports.login = async(req,res)=>{
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json("User not found. :(");
            
        }
        const match = await bcrypt.compare(password, user.password);
        if(!match){
            return res.status(400).json("Wrong password. :(");

        }
        const token = JWT.sign(
            {id:user._id}, process.env.JWT_SECRET,{expiresIn:"7d"}
        );
        res.json({token,userId:user._id, name: user.name});
    }
    catch(error){
        res.status(500).json(error);
    }
}