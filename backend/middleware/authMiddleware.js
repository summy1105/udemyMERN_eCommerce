import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const protect = asyncHandler(async (req, res, next) => {

  const auth = req.headers.authorization

  if (!auth || !auth.startsWith('Bearer ')) {
    res.status(401);
    throw new Error("Not authorized, no token");
  } else {
    try {
      const token = auth.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = await User.findById(decoded.id).select("-password");
    } catch (err) {
      console.error(err);
      res.status(401);
      throw new Error("Not authorized, invalid token");
    }
    next();
  }
})

export const admin = (req, res, next) => {
  if(req.user && req.user.isAdmin){
    next();
  }else{
    res.status(401);
    throw new Error("Not authorized as an admin");
  }
}