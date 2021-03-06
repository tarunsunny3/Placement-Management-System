import React, {useState} from 'react'
import axios from 'axios';
import AppContext from './AppContext';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import Job from './Job';
import Grid from '@material-ui/core/Grid';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link } from 'react-router-dom';
import { MenuItem, Select, FormControl, InputLabel, FormHelperText } from '@material-ui/core';
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      // width: '100%',
    },
  },
  form: {
    // width: '100%', // Fix IE 11 issue.
    margin: theme.spacing(3),
    padding: theme.spacing(4)
  },
  heading:{
    textAlign: 'center',
    color: 'teal',
    marginTop: '5%'
  },
  pagination:{
    display: 'flex',
    justifyContent: 'center',
    marginTop: '2%'
  },
  gridList:{
    display: 'flex',
    flexWrap: 'wrap',
    direction: 'row',
    justifyContent: 'space-evenly',
  },
  gridItem:{
    margin: '2%',
    flexBasis:'25%'
  },
  noJobs:{
    textAlign: "center",
    color: "red",
    fontSize: "50px",
    fontWeight: "400"
  }
})
);
const ViewJobs =  (props) => {
  const {user} = React.useContext(AppContext);
  const classes = useStyles();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currPage, setCurrPage] = useState(1);
  const [jobsPerPage, setJobsPerPage] = useState(5);
  const [open, setOpen] = useState(true);
  const [option, setOption] = useState("");
const filterCompany = (Jobs, companyName)=>{
    if(companyName !== null){
       Jobs = Jobs.filter((job)=>job.companyName.toLowerCase()===companyName.toLowerCase());
    }
   return Jobs;
}

const filterCourse = (Jobs, courses)=>{
  if(courses !== null && courses.length > 0){
    Jobs = Jobs.filter((job)=>courses.some((course)=>job.courses.includes(course)));
  }
  return Jobs;

}
const filterJobType = (Jobs, fullTime, intern)=>{
  if(fullTime && intern){
    Jobs = Jobs.filter((job)=>job.jobType==="full" || job.jobType === "intern");
  }else if(fullTime){
    Jobs = Jobs.filter((job)=>job.jobType==="full");
  }else if(intern){
    Jobs = Jobs.filter((job)=>job.jobType === "intern");
  }
  return Jobs;
}
const filterDate = (Jobs, startDate, endDate)=>{
  if(startDate === null && endDate === null){
    return Jobs;
  }
  if(endDate==null && startDate !== null){
    Jobs = Jobs.filter((job)=> new Date(job.createdAt) >= startDate &&  new Date(job.createdAt) <= new Date());
    return Jobs;
  }
  Jobs = Jobs.filter((job)=> new Date(job.createdAt) >= startDate &&  new Date(job.createdAt) <= endDate);
  return Jobs;
}
const filterSearch = (Jobs, searchKeyword)=>{
  searchKeyword = searchKeyword.toLowerCase();
  Jobs = Jobs.filter((job)=>{
    return (
      job.companyName.toLowerCase().includes(searchKeyword) || job.jobPosition.toLowerCase().includes(searchKeyword)
      || job.jobDesc.toLowerCase().includes(searchKeyword) || job.location.toLowerCase().includes(searchKeyword)
    )
  })
  return Jobs;
}
const showJobsIfEligible = (job, status, user)=>{
  let res = false;
  let cumGPA = -1;
  if(job.minCgpa != null){
    if(user.details !== undefined && user.details.semesterWisePercentage !== undefined){
      let semesters = user.details.semesterWisePercentage;
      let sum = 0;
      if(semesters.length > 0){
        const reducer = (sum, currentValue) => sum + currentValue;
        sum = semesters.reduce(reducer);
        cumGPA = sum / semesters.length;
      }
    }
  }
    if(status === "unapplied"){
      res = !job.users.includes(user.id) && (job.isOpen===true && (job.dateOfExpiry !== undefined && (new Date(job.dateOfExpiry)) > (new Date())));
      if(job.minCgpa !== null){
        res = res && cumGPA >= job.minCgpa;
      }
    }else if(status === "applied"){
      res = job.users.includes(user.id);
    }
    res = res && job.courses.includes(user.details.courseName);
    return res;
}
  React.useEffect(() => {
    let mounted  = true;
    setLoading(true);
    axios.get('/job/getJobs').then((response)=>{
      let Jobs = response.data.jobs;
      if(user != null){
        // if(mounted){
          if(user.role !== "Student"){

            //It is a Coordinator
            if(props.type==="open"){
              //Set the option for which current page is displaying
              setOption("open");

              Jobs = Jobs.filter((job)=>(job.isOpen===true && (job.dateOfExpiry !== undefined && (new Date(job.dateOfExpiry)) > (new Date()))));
            }else{
              //Closed jobs are those whose isOpen value is false
              //and Date of expiry is crossed
              setOption("closed");
              // Jobs = Jobs.filter((job)=>showJobsIfEligible(job, "closed", user));
              Jobs = Jobs.filter((job)=>job.isOpen===false || (job.dateOfExpiry !== undefined && new Date(job.dateOfExpiry) < (new Date())));
            }
          }else{
            if(user.details !== undefined){
              if(props.type==="default"){
                setOption("applied");
                // Unapplied jobs
                Jobs = Jobs.filter((job)=>showJobsIfEligible(job, "unapplied", user));
                
                // Jobs = Jobs.filter((job)=>!job.users.includes(user.id) && (job.isOpen===true && (job.dateOfExpiry !== undefined && (new Date(job.dateOfExpiry)) > (new Date()))));
              }else{
                setOption("unapplied");
                //Applied Jobs
                Jobs = Jobs.filter((job)=>showJobsIfEligible(job, "applied", user));
                // Jobs = Jobs.filter(job=>job.users.includes(user.id) && (job.isOpen===true && (job.dateOfExpiry !== undefined && (new Date(job.dateOfExpiry)) > (new Date()))));
              }
            }else{
              Jobs = [];
              setOption("notRegistered");
            }
          }
          if(props.filter !== undefined && Object.keys(props.filter).length >0){
            let jobs = Jobs;
            const {company, courses, fullTime, intern, startDate, endDate, searchKeyword} = props.filter;
            console.log("props.filter", props.filter);
            if(company !== undefined && company !== ''){
              jobs = filterCompany(jobs, company);
            }
            if(courses !== undefined && courses.length > 0){
              jobs = filterCourse(jobs, courses)
            }
            if(fullTime !== undefined && intern != undefined){
              jobs = filterJobType(jobs, fullTime, intern);
            }
            if(startDate !== undefined && endDate !== undefined){
              jobs = filterDate(jobs, startDate, endDate);
            }
            if(searchKeyword !== undefined && searchKeyword !== ""){
              console.log("Search is ", searchKeyword);
              jobs = filterSearch(jobs, searchKeyword);
            }
            
            Jobs = jobs;
          }
          setJobs(Jobs);
          setLoading(false);
        }
      // }
    });
    return function cleanup() {
            mounted = false
    }
  }, [props.type, props.filter, currPage]);
    const indexOfLastJob = currPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    let currJobs = [];
    //Get current Jobs to be displayed on that particular page
    if(indexOfFirstJob >= jobs.length){
      currJobs = jobs;
    }else{
      currJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
    }


    const noJobsMessage = ()=>{
        switch(option){
          case "open":
            return <p className={classes.noJobs}>No Jobs are available<span style={{display: "block"}}><i className="far fa-frown"></i></span></p>
          case "closed":
            return <p className={classes.noJobs}>No closed/out dated jobs are available<span style={{display: "block"}}><i className="far fa-frown"></i></span></p>
          case "applied":
            return <p className={classes.noJobs}>No Jobs available to apply<span style={{display: "block"}}><i className="far fa-frown"></i></span></p>
          case "unapplied":
            return <p className={classes.noJobs}>You have applied for no jobs in the past<span style={{display: "block"}}><i className="far fa-frown"></i></span></p>
          case "notRegistered":
            return <p className={classes.noJobs}>Please complete the <Link to="/studentReg/register">registration</Link> first and come back</p>
          default:
            return <p></p>
      }
    }
    return (
      loading?
      <Backdrop style={{zIndex: "1"}} open={open} onClick={()=>setOpen(false)}>
        <p style={{fontSize: 50, color: "white"}}>Loading</p> <CircularProgress style={{marginLeft: "2%"}} color="primary" />
      </Backdrop>
      :
        (currJobs.length===0)
        ?
        noJobsMessage()
      :
      <div style={{marginLeft: "5%", marginRight: "5%", marginBottom: "10%"}}>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-helper-label">Jobs</InputLabel>
        <Select  defaultValue={5} onChange={(e)=>setJobsPerPage(e.target.value)}>
        <MenuItem value={5}>5</MenuItem>
        <MenuItem value={10}>10</MenuItem>
        <MenuItem value={20}>20</MenuItem>
        </Select>
         <FormHelperText>No. of Jobs per page</FormHelperText>
      </FormControl>
        
        
        <Grid container display="flex" direction="row" justifyContent="space-evenly"  spacing={6}>

        {

          currJobs.map((job, key)=>{
            return (
              <Grid key={job._id} item xs={12} sm={8} md={6}>
                <Job job={job} setCurrPage={setCurrPage} currPage={currPage} {...props}/>
              </Grid>
            )
        })
      }
    
    </Grid>
      {
        Math.ceil(jobs.length/jobsPerPage) > 1 &&
      <div className={classes.pagination}>
      <Pagination style={{marginTop: "5%", marginBottom: "5%"}} showFirstButton showLastButton color="primary" count={Math.ceil(jobs.length/jobsPerPage)} page={currPage} onChange={(event: React.ChangeEvent<unknown>, value: number)=>setCurrPage(value)} />
      </div>
    }
      </div>
     
    )

 
}

export default ViewJobs
