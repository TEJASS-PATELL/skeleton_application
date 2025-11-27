import jwt from "jsonwebtoken"
import prisma from "../config/prisma.js";

const authMiddleware = async (req, res, next) => {
    try{
    const {token} = req.cookies;

    if(!token){
        return res.status(401).json({message: "Not authorized. Login again"});
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({where : {id: decode.id}})

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = { userId: user.id };  

    next();
}catch(error){
    console.log(error);
    res.status(401).json({message: "Token invalid or expired"})
}}

export default authMiddleware;