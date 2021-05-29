const express = require('express');
const router = express.Router();
const Job =  require('../db/jobSchema');
const Course = require('../db/coursesSchema');

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
  courses
} = req.body;
const job = new Job({
  companyName: company,
  location,
  jobDesc,
  jobPosition,
  jobType,
  minCgpa,
  gateScore,
  courses
})
job.save();
res.json({
  success: true,
  data: job
})
});

module.exports = router;
