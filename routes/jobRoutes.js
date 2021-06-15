const express = require('express');
const router = express.Router();
var mongoXlsx = require('mongo-xlsx');
const Job =  require('../db/jobSchema');
const Course = require('../db/coursesSchema');
const User = require('../db/userSchema');
const {requireAuth} = require('../middleware/authToken');
const fileSystem = require('fs');
const path = require("path");
const excel = require('exceljs');
router.get('/file/:jobId', async (req, res)=>{
  const jobId = req.params.jobId;
  const populatedJob = await Job.findOne({_id: jobId}).populate({
    path: "users",
    select: "details"
  })
  // console.log(populatedJob);
  let userDetails = [];
  populatedJob.users.map((user, key)=>{
    const {phone, email} = user.details;
    let data = {};
    data["phone"] = phone,
    data["id"] = user._id;
    data["email"] = email;
    userDetails.push(data);
  })
  console.log(userDetails);
  // let newJobs = [];
  // jobs.map((job, key)=>{
  //
  // })
  let workbook = new excel.Workbook(); //creating workbook
	let worksheet = workbook.addWorksheet('User Details of '+populatedJob.companyName); //creating worksheet

	//  WorkSheet Header
	worksheet.columns = [
		{ header: 'Id', key: 'id', width: 40 },
		{ header: 'Phone number', key: 'phone', width: 30 },
		{ header: 'EMAIL', key: 'email', width: 30},
	];

	// Add Array Rows
	worksheet.addRows(userDetails);
  const fileName = "students_applied_" + populatedJob.companyName + ".xlsx" ;
	// Write to File
	await workbook.xlsx.writeFile(fileName);


  // var filePath = path.join(__dirname, 'jobs.xlsx');
  res.download(path.resolve(fileName), (err)=>{
    if(err){
      console.log("Errrrror is ", err);
    }else{
      console.log("Success");
      const stats = fileSystem.statSync(path.resolve(fileName));
      const fileSizeInBytes = stats.size;
      //Delete the file just downloaded from the server after some time
      setTimeout(()=>{
        fileSystem.unlinkSync(path.resolve(fileName));
      }, (fileSizeInBytes/2))
    }
  });
})
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

//Get Job by ID

router.get("/job/:id", async (req, res)=>{
  const id = req.params.id;
  const job = await Job.findOne({_id: id});
  if(job){
    res.json({success: true, job});
  }else{
    res.json({success: false});
  }
})

//Upload a JOB
router.post('/uploadJob', async (req, res)=>{
  const {company,
  location,
  jobDesc,
  jobPos,
  jobType,
  minCgpa,
  gateScore,
  courses,
  year,
  salaryPackage,
  dateOfExpiry
} = req.body;
const job = new Job({
  companyName: company,
  location,
  jobDesc,
  jobPosition: jobPos,
  jobType,
  minCgpa,
  gateScore,
  salaryPackage,
  courses,
  year,
  dateOfExpiry
})
try{
  await job.save();
  res.json({
    success: true,
    data: job
  })
}catch(e){
  console.log(e);
  res.json({
    success: false
  })
}

});

router.post('/updateJob', requireAuth, async (req, res)=>{
  const { _id, updateData} = req.body;
  console.log("Updated Data is ", updateData);
  try{
    const job = await Job.findOneAndUpdate({_id}, updateData, {
    new: true
    });
    console.log("New job is ", job);
    res.json({
      success: true
    });
  }catch(e){
    console.log(e);
    res.json({
      success: false
    })
  }
})
router.post('/addUserToJob', requireAuth, async (req, res)=>{
  const {jobId} = req.body;
  const userID = req.decoded.id;
  console.log(userID);
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
