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
    try {
      const userDetails = await User.findOne({_id: user.id});
      res.json({user: userDetails, success:  true});
    } catch (error) {
      res.json({success: false});
    }
    
  }

})

//Logout
router.get('/logout', requireAuth, (req, res)=>{
  try{
  res.cookie("token", "", { maxAge: -1})
    res.sendStatus(200);
  }catch(e){
    res.sendStatus(400).json({success: false});
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
router.post("/sendJobUpdateEmail", async (req, res)=>{
  const message = req.body.message;
  const courses = req.body.courses;
 
  let users = await User.find({});
  // console.log("Old Length is ", users.length);
  // console.log("Boolean is ", user.details !== undefined && user.details.courseName && courses.includes(user.details.courseName));
  users = users.filter((user)=>
  {
    // console.log(user.details !== undefined && user.details.courseName !== undefined && courses.includes(user.details.courseName));
    return user.details !== undefined && user.details.courseName !== undefined && courses.includes(user.details.courseName)
  } 
  );
  // console.log("New Length is ", users.length);
  users.map((user)=>{
    if(user.details !== undefined && user.details.email !== undefined){
      const mailjet = require ('node-mailjet')
 .connect('bb0297262b66956cadcd4be5579ad049', '5d09a58eb25efc9c0f8eec727692f48d')
const request = mailjet
 .post("send", {'version': 'v3.1'})
 .request({
   "Messages":[
     {
       "From": {
         "Email": "tarunsunny2662@gmail.com",
         "Name": "UoH"
       },
       "To": [
         {
           "Email": user.details.email,
           "Name": "Tarun"
         }
       ],
       "TemplateID": 3104589,
       "TemplateLanguage": true,
       "Subject": "UoH PLMS New Job",
       "Variables": {
         message
       }
     }
   ]
 })
request
 .then((result) => {
  //  console.log(result.body)
 })
 .catch((err) => {
   console.log(err.statusCode)
 })

      //  var mailOptions = {
      //   from: 'tarunsunny3@gmail.com',
      //   to: user.details.email,
      //   subject: 'UoH New Job Update!!',
      //   html: `<p>A new job has been posted....do check it out!</p><h2 style="font-size: 40px;">${message}</h2>`
      // };
      // transporter.sendMail(mailOptions, function(error, info){
      //   if (error) {
      //     console.log(error);
      //   } else {
      //     console.log('Email sent: ' + info.response);
      //   }
      // });
    }
  });
  
  res.json({success: true});
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
});


const sendmail = ()=>{
/**
 *
 * This call sends a message to the given recipient with vars and custom vars.
 *
 */
 
//   const mailjet = require ('node-mailjet')
// .connect('bb0297262b66956cadcd4be5579ad049', '5d09a58eb25efc9c0f8eec727692f48d')
// const request = mailjet
// .post("send", {'version': 'v3.1'})
// .request({
//   "Messages":[
//     {
//       "From": {
//         "Email": "tarunsunny2662@gmail.com",
//         "Name": "Tarun"
//       },
//       "To": [
//         {
//           "Email": "tarunsunny2662@gmail.com",
//           "Name": "Tarun"
//         }
//       ],
//       "Subject": "Greetings from Mailjet.",
//       "TextPart": "My first Mailjet email",
//       "HTMLPart": "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
//       "CustomID": "AppGettingStartedTest"
//     }
//   ]
// })
// request
//   .then((result) => {
//     console.log(result.body)
//   })
//   .catch((err) => {
//     console.log(err.statusCode)
//   })

}
module.exports = router;
