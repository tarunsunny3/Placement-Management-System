const express = require('express');
const router = express.Router();
var mongoXlsx = require('mongo-xlsx');
const Job =  require('../db/jobSchema');
const Course = require('../db/coursesSchema');
const User = require('../db/userSchema');
const {requireAuth} = require('../middleware/authToken');
//Get all company companyNames
router.get('/getCompanyNames', (req, res)=>{
  Job.find({}, (err, jobs)=>{
    if(err){
      console.log(err);
    }else{
      let companyNames = []
      jobs.map((val, key)=>{
        companyNames.push(val.companyName);
      })
      res.json({companyNames});
    }
  })
})

//Get all available Courses
router.get('/getCourses', (req, res)=>{
  Course.find({}, (err, courses)=>{
    if(err){
      console.log(err);
    }else{
      // console.log(courses[0]);
      res.json({courses});
    }
  })
});
//Add a new Course
router.post('/addCourse',  (req, res)=>{
  const {courseName} =  req.body;
  // console.log(data);
  // console.log(courseName);
  const newCourse = new Course({courseName});
  newCourse.save();
  res.send({success: true});
})

router.get("/getJobs", (req, res)=>{

  Job.find({}, (err, jobs)=>{
    if(err){
      throw err;
    }else{
      // console.log(jobs);
      res.json({jobs});
    }
  }
)
});

//Upload a JOB
router.post('/uploadJob', (req, res)=>{
  const {company,
  location,
  jobDesc,
  jobPosition,
  jobType,
  minCgpa,
  gateScore,
  courses,
  year,
  dateOfExpiry
} = req.body;
const job = new Job({
  companyName: company,
  location,
  jobDesc,
  jobPosition,
  jobType,
  minCgpa,
  gateScore,
  courses,
  year,
  dateOfExpiry
})
job.save();
res.json({
  success: true,
  data: job
})
});

router.post('/addUserToJob', requireAuth, async (req, res)=>{
  const {jobId} = req.body;
  const userID = req.decoded.id;
  const job = await Job.findOne({_id: jobId});
  if(!job.users.includes(userID)){
    job.users.push(userID);
  }

  try {
    const doc = await job.save();
    const user = await User.findOne({_id: userID});
    user.appliedJobs.push(jobId);
    const updatedUser = await user.save();
    // const populatedJob = await Job.findOne({_id: jobId}).populate("users");
    // console.log(populatedJob);
    // console.log(updatedUser);
    console.log(doc);
    res.json({
      success: true
    })

  } catch (e) {
    console.log(e);
  }
})

module.exports = router;
