const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const protect = asyncHandler(async (req, res, next) => {
  const cookies = req.headers.cookie;
  console.log("in login middleware");
  // if(!cookies)
  // {
  //   console.log("Login Please");
  //   res.status(404).json({ message: "Login Please" });
  // }
  const token = cookies.split("=")[1];
  if (!token) {
    console.log("no token found");
    res.status(404).json({ message: "No token found" });
  }
  jwt.verify(String(token), process.env.ACCESS_TOKEN_PRIVATE_KEY, (err, user) => {
    if (err) {
      console.log("invalid token");
      return res.status(400).json({ message: "Invalid Token" });
    }
    console.log(user.id);
    console.log(user);
    req.id = user.id;
  });
  console.log("to next middleware ,if it is present?")
  next();
})

module.exports = { protect }
