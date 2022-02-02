import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';


// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Pulic
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({email});
  
  if(user && (await user.matchPassword(password))){
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    });
  }else{
    res.status(401);
    throw new Error("Invalid email or password");
  }
})


// @desc    Auth user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  
  if(user){
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    });
  }else{
    res.status(401);
    throw new Error("Invalid email or password");
  }
})


// @desc    Register a new user
// @route   POST /api/users
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({email});
  
  if(userExists){
    res.status(400);
    throw new Error("User already exists");
  }
  
  const user = await User.create({
    name,
    email,
    password,
  })

  if(user){
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    });
  }else{
    res.status(404);
    throw new Error("User not found");
  }
})