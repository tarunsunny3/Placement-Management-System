/*jshint esversion: 8 */
const express = require('express');
const router = express.Router();
const AdmZip = require('adm-zip');
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
  });
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

  let workbook = new excel.Workbook(); //creating workbook
 //creating worksheet
let worksheet = workbook.addWorksheet('User Details of '+populatedJob.companyName, {headerFooter:{firstHeader: "Hello Exceljs", firstFooter: "Hello World"}});
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
      }, (fileSizeInBytes/2));
    }
  });
});
router.post('/report/', async (req, res)=>{
  const {jobId, firstName, lastName, branchName, email, phone, resume, offerletter, ugPercentage, pgPercentage, tenthCgpa, twelfthCgpa, gender} = req.body;
  const populatedJob = await Job.findOne({_id: jobId}).populate({
    path: "users",
    select: "details"
  });
  let userDetails = [];
  let excelColumnLabels = [];
  if(firstName !== undefined && firstName != ""){
    excelColumnLabels.push({header: "First Name", key: firstName, width: 40});
  }
  if(lastName !== undefined && lastName != ""){
    excelColumnLabels.push({header: "Last Name", key: lastName, width: 40});
  }
  if(branchName !== undefined && branchName != ""){
    excelColumnLabels.push({header: "Branch Name", key: branchName, width: 40});
  }
  if(gender !== undefined && gender != ""){
    excelColumnLabels.push({header: "Gender", key: gender, width: 20});
  }
  if(email !== undefined && email != ""){
    excelColumnLabels.push({header: "Email", key: email, width: 30});
  }
  if(phone !== undefined && phone != ""){
    excelColumnLabels.push({header: "Phone", key: phone, width: 20});
  }

  if(tenthCgpa !== undefined && tenthCgpa != ""){
    excelColumnLabels.push({header: "Tenth Percentage", key: tenthCgpa, width: 20});
  }
  if(twelfthCgpa !== undefined && twelfthCgpa != ""){
    excelColumnLabels.push({header: "Twelfth Percentage", key: twelfthCgpa, width: 20});
  }
  if(ugPercentage !== undefined && ugPercentage != ""){
    excelColumnLabels.push({header: "UG Percentage", key: ugPercentage, width: 20});
  }
  if(pgPercentage !== undefined && pgPercentage != ""){
    excelColumnLabels.push({header: "PG Percentage", key: pgPercentage, width: 20});
  }
  if(resume !== undefined && resume != ""){
    excelColumnLabels.push({header: "Resume", key: resume, width: 40});
  }
  if(offerletter !== undefined && offerletter != ""){
    excelColumnLabels.push({header: "Offer Letter", key: offerletter, width: 40});
  }
  populatedJob.users.map((user, key)=>{
    const details = user.details;
    let values = {};
    if(firstName !== ""){
      values[firstName] = details.firstName;
    }
    if(lastName !== ""){
      values[lastName] = details.lastName;
    }
    if(email !== ""){
      values[email] = details.email;
    }
    if(phone !== ""){
      values[phone] = details.phone;
    }
    if(resume !== ""){
      if(details.resumeLink === undefined){
        values[resume] = "";
      }else{
          values[resume] = {text: "resumeLink", hyperlink: details.resumeLink};
      }
    }
    if(offerletter !== ""){
      const links = details.offerLettersLinks;
      let flag = false;
      for(let i = 0; i< links.length; i++){
        if(links[i].jobID == jobId){
          values[offerletter] = {text: "offerLetterLink", hyperlink: links[i].link};
          flag = true;
          break;
        }
      }
      if(!flag){
        values[offerletter] = "";
      }
    }
    if(gender !== ""){
      values[gender] = details.gender;
    }
    if(branchName !== ""){
      values[branchName] = details.branchName;
    }
    if(ugPercentage !== ""){
      values[ugPercentage] = details.ugPercentage;
    }
    if(pgPercentage !== ""){
      values[pgPercentage] = details.pgPercentage;
    }
    if(tenthCgpa !== ""){
      values[tenthCgpa] = details.tenthCgpa;
    }
    if(twelfthCgpa !== ""){
      values[twelfthCgpa] = details.twelfthCgpa;
    }
    userDetails.push(values);
  });

  let workbook = new excel.Workbook(); //creating workbook
	 //creating worksheet
   	let worksheet = workbook.addWorksheet('User Details of '+populatedJob.companyName);
	//  WorkSheet Header
	worksheet.columns = excelColumnLabels;

	// Add Array Rows
	worksheet.addRows(userDetails);
  const fileName = `${populatedJob.companyName}_${populatedJob.year}.xlsx`;
	// Write to File
	try{
    await workbook.xlsx.writeFile(`./reports/${fileName}`);
    // console.log(userDetails);
    res.send({success: true, fileName});
  }catch(e){
    res.json({success: false});
  }

});
router.get('/download/:fileName', (req, res)=>{
  let  fileName= req.params.fileName;
  res.download(path.resolve(`./reports/${fileName}`), (err)=>{
    if(err){
      console.log("Errrrror is ", err);
    }else{
      fileSystem.unlinkSync(path.resolve(`./reports/${fileName}`));
    }
  });
});

router.get('/downloadZip', (req, res)=>{
  let tobeZipped = fileSystem.readdirSync(path.resolve('reports'));
  let zip = new AdmZip();
  for(let i =0; i< tobeZipped.length;i++){
    zip.addLocalFile('./reports/'+tobeZipped[i]);
  }
  zip.writeZip("./reports.zip");
  res.download(path.resolve("reports.zip"), (err)=>{
    if(err){
      console.log("Errrrror is ", err);
    }else{
      console.log("Success");
      fileSystem.unlinkSync(path.resolve("./reports.zip"));
      const dirPath = './reports';
      if (fileSystem.existsSync(dirPath)) {
        const files = fileSystem.readdirSync(dirPath);

        if (files.length > 0) {
          files.forEach(function(filename) {
            if (fileSystem.statSync(dirPath + "/" + filename).isDirectory()) {
              removeDir(dirPath + "/" + filename);
            } else {
              fileSystem.unlinkSync(dirPath + "/" + filename);
            }
          });
          fileSystem.rmdirSync(dirPath);
          } else {
            fileSystem.rmdirSync(dirPath);
          }
    } else {
      console.log("Directory path not found.");
    }
    fileSystem.mkdir("./reports",  (err) => {
      if (err) {
          return console.error(err);
      }
      console.log('Directory created successfully!');
    });
      // const stats = fileSystem.statSync(path.resolve(fileName));
      // const fileSizeInBytes = stats.size;
      // //Delete the file just downloaded from the server after some time
      // setTimeout(()=>{
      //     fileSystem.unlinkSync(path.resolve(fileName));
      // }, (fileSizeInBytes/2))
    }
  });
});
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

//Get Jobs by Course Name and Company Name
router.get("/getjobs/:courseName/:companyName/:year", (req, res)=>{
  const courseName = req.params.courseName;
  const companyName = req.params.companyName;
  const year = req.params.year;
  Job.find({}, (err, jobs)=>{
    if(err){
      throw err;
    }else{
      if(courseName !== 'null'  && courseName !== null && courseName !== undefined){
        jobs = jobs.filter((job)=>job.courses.includes(courseName));
      }
      if(companyName!== 'null'  && companyName !== null && companyName !== undefined){
        jobs = jobs.filter((job)=>job.companyName === companyName);
      }
      if(year !== 'null'  && year !== null && year !== undefined){
        jobs = jobs.filter((job)=>job.year===Number(year));
      }

      res.json({jobs});
    }
  }
  );
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
});

//Upload a JOB
router.post('/uploadJob', async (req, res)=>{
  const {company,
  location,
  jobDesc,
  jobPosition,
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
  jobPosition,
  jobType,
  minCgpa,
  gateScore,
  salaryPackage,
  courses,
  year,
  dateOfExpiry
});
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
    res.json({
      success: true
    })

  } catch (e) {
    console.log(e);
    res.json({
      success: false
    })

  }
})

module.exports = router;
