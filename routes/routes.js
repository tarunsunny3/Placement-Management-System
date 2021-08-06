const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const  bcrypt = require('bcrypt');
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
router.get('/logout', requireAuth, (req, res)=>{
  try{
  res.cookie("token", "", { maxAge: -1})
    res.sendStatus(200);
  }catch(e){
    console.log("Logout error is ", e);
    res.sendStatus(404);
  }
});

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
  const match = bcrypt.compareSync(password, user.password);
  if(!match) {
    res.json({success: false, message: "Incorrect password"});
  }else{

      let reg=false;
      const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
      if(user.details === undefined){
        reg = true;
      }
      res.cookie('token',token, {maxAge: 10 * 24 * 60 * 60 * 60 , httpOnly: false, sameSite: "none", secure: true});
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

//Basic Details basic_registration

router.post('/register_details', requireAuth, async (req, res)=>{
  const {firstName, lastName, gender, branchName, courseName, semesters, phone, email, semGrades, pg, ug, gateScore,twelfthCgpa, tenthCgpa, profilePictureLink, resumeLink} = req.body;
  try{
    const username = await req.decoded.username;
    const user = await User.findOne({username});
    user.details = {
      firstName, lastName, courseName, semesters, phone,email,semesterWisePercentage: semGrades, branchName,
       gateScore, ugPercentage: ug, pgPercentage:pg,
       tenthCgpa, twelfthCgpa, profilePictureLink, resumeLink, gender
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
});
router.post("/updateUserDetails", requireAuth,  async (req, res)=>{
  const userID = req.decoded.id;
  const {jobID, updateData} = req.body;
  try{
      const user = await User.findOneAndUpdate({_id: userID}, updateData, {new: true});
      console.log(user);
      res.json({
        success: true
      })
  }catch(e){
    res.json({
      success: false,
      message: "could not update the user details"
    })
  }
})

//Forgot password, change the password
//Nodemailer example
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tarunsunny3@gmail.com',
    pass: '9603877546'
  }
});
router.post("/sendEmail", (req, res)=>{
  const toEmail = req.body.email;
  const otp = Math.floor(1000 + Math.random()*9000);
  console.log(otp);
  var mailOptions = {
    from: 'tarunsunny3@gmail.com',
    to: toEmail,
    subject: 'PLMS App Forgot Password',
    text: 'Here is your OTP for verification!',
    html: `<h2 style="font-size: 40px;">${otp}</h2>`
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  res.json({success: true, otp});
})

router.post("/changePassword", async (req, res)=>{
  let {username, newPassword} = req.body;
  if(username === undefined || newPassword === undefined){
    console.log(username, newPassword);
      res.json({success: false, message: "Couldnt process the request now!"});
      return;
  }
  const user = await User.findOne({username});
  if(user === null){
    res.json({success: false, message: "User with that email doesn't exist"});
  }else{
    user.password = newPassword;
    await user.save();
    res.json({success: true});
  }

})

module.exports = router;
