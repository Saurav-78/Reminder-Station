const JWT = require("jsonwebtoken");
const auth = (req,res, next)=>{
    try{
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json("No token. :(");

    }
    const token = authHeader.split(" ")[1];
    if(!token){return res.status(401).json("Token missing. :(");}
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
    }
    catch(error){
        res.status(401).json("Invalid token. :(");

    }
}
module.exports = auth;