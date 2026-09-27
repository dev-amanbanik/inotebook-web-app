const express = require("express");
const router = require("express").Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "Harryisagoodb$oy";

//route 1 create a user using: POST "/api/auth/createuser". No login required
router.post( "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 5 characters").isLength({min: 5 }),
  ],

  async (req, res) => {
    let success=false;
    // If there are errors, return Bad request and the errors to the client
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    try 
    {
        // Check whether the user with this email exists already
      let user = await User.findOne({ email: req.body.email });

      if (user) {
        return res.status(400).json({success ,error: "Sorry a user with this email already exists" });
      }
      // create a new user
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
        const data = {
        user: {
            id: user.id
        }
        };
       const authtoken = jwt.sign(data, JWT_SECRET);
      
      // res.json(user);
      res.json({ success: true, authtoken});
    } 
    catch (error) 
    {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  },
);
// Route 2: Authenticate a user using: POST "/api/auth/login". No login required
router.post( "/login",
  [
   
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password can not be blank").exists(),
  ],
  async (req, res) => {
    let success=false;
    // If there are errors, return Bad request and the errors to the client
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

  
try {
const { email, password } = req.body ;
   
  let user = await User.findOne({ email });

  if (!user) {
    success=false;
    return res.status(400).json({success, error: "Please try to login with correct credentials" });
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    success=false;
    return res.status(400).json({success, error: "Please try to login with correct credentials" });
  }
  const data = {
    user: {
      id: user.id,
    }
  };
  const authtoken = jwt.sign(data, JWT_SECRET);
  success=true;
  res.json({ success,authtoken });

}catch (error) {
  console.error(error.message);
  res.status(500).send("Internal Server Error");
}

  });
  // Route 3: Get logged in user details using POST "/api/auth/getuser". login required
router.post( "/getuser", fetchuser, async (req, res) => {
try {
  userId=req.user.id;
  const user = await User.findById(userId).select("-password")
  res.send(user);
} catch (error) {
  console.error(error.message);
  res.status(500).send("Internal Server Error");
}
  })

module.exports = router;
