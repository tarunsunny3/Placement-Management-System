const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require('../db/userSchema');
const { requireAuth } = require('../middleware/authToken.js');

router.get('/', (req, res)=>{
    res.send("Hi, it works");
})
router.get('/decodedUser', requireAuth, async (req, res)=>{
  const user = req.decoded;
  if(user.id === null){
    res.json({user: req.decoded});
  }else{
    const userDetails = await User.findOne({_id: user.id});
    res.json({user: userDetails});
  }

})

//Logout
router.get('/logout', requireAuth,(req, res)=>{
  res.clearCookie('token');
  res.sendStatus(200);
})

router.post('/sign_up', async (req, res)=>{
  const {username, password} = req.body;
  let userDetails = await User.findOne({username}).exec();
  if(!userDetails){
    const newUser = new User({
      username,  password
    });
    try{
      const doc = await newUser.save();
      console.log(doc);
      // console.log(doc.details);
      res.json({
        success: true
      })
    }catch(e){
      console.log("Error is ",e);
      res.json({
        success: false,
        error: "Couldn't save the doc"
      })
    }
  }else{
    res.json({
      success: false,
      message: "User already exists!"
    })
  }
})
router.post('/sign_in', async (req, res)=>{
  const {username, password} = req.body;
  const user = await User.findOne({username});
  if(!user){
    //User is not registered
    res.json({
      success: false,
      message: "Username is not registered"
    })
    return;
  }
  user.comparePassword(password, (error, match)=>{
    if(error) throw error;
    if(!match) {
      res.json({success: false, message: "Incorrect password"});
    }else{
        let reg=false;
        const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
        if(user.details === undefined){
          reg = true;
        }
        res.cookie('token',token, {maxAge: 10 * 24 * 60 * 60 , httpOnly: false, sameSite: "none", secure: true});
        console.log("ROUTES cookie is ", req.cookies);
        res.status(200).json({
            success: true,
            reg,
            result: {
                username: user.username,
                role: user.role,
            }
        })
      }
  })
})

//Basic Details basic_registration

router.post('/register_details', requireAuth, async (req, res)=>{
  const {firstName, lastName, branchName, courseName, semesters, phone, email, semGrades, pg, ug, gateScore,twelfthCgpa, tenthCgpa, profilePictureLink, resumeLink} = req.body;
  try{
    const username = await req.decoded.username;
    const user = await User.findOne({username});
    user.details = {
      firstName, lastName, courseName, semesters, phone,email,semesterWisePercentage: semGrades, branchName,
       gateScore, ugPercentage: ug, pgPercentage:pg,
       tenthCgpa, twelfthCgpa, profilePictureLink, resumeLink
    }
    try{
      const updated = await user.save();
      console.log(updated);
      res.json({
        success: true
      })
    }catch(e){
      console.log(e);
      res.json({
        success: false
      })

  }
}catch(e){
  console.log(e);
  res.json({
    success: false
  })
}
})
module.exports = router;
