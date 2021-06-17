import React, {useState} from 'react'
import axios from 'axios';
import AppContext from './AppContext';
import useFetch from "react-fetch-hook";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Pagination from '@material-ui/lab/Pagination';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import Job from './Job';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
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
  const [jobsPerPage, setJobsPerPage] = useState(2);
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
const filterJobType = (Jobs, jobType)=>{
  Jobs = Jobs.filter((job)=>job.jobType===jobType);
  return Jobs;
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
              Jobs = Jobs.filter((job)=>job.isOpen===false || (job.dateOfExpiry !== undefined && new Date(job.dateOfExpiry) < (new Date())));
            }
          }else{
            if(props.type==="default"){
              setOption("applied");
              Jobs = Jobs.filter((job)=>!job.users.includes(user.id) && (job.isOpen===true && (job.dateOfExpiry !== undefined && (new Date(job.dateOfExpiry)) > (new Date()))));
            }else{
              setOption("unapplied");
              Jobs = Jobs.filter(job=>job.users.includes(user.id) && (job.isOpen===true && (job.dateOfExpiry !== undefined && (new Date(job.dateOfExpiry)) > (new Date()))));
            }
          }
          if(props.filter !== undefined && Object.keys(props.filter).length >0){
            let jobs = Jobs;
            const {company, courses, date, jobType} = props.filter;
            // console.log(jobs);
            if(company !== undefined && company !== ''){
              jobs = filterCompany(jobs, company);
            }
            if(courses !== undefined && courses.length > 0){
              jobs = filterCourse(jobs, courses)
            }
            if(jobType !== undefined){
              jobs = filterJobType(jobs, jobType);
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
          default:
            return <p></p>
      }
    }
    return (
      loading?
      <Backdrop  open={open} onClick={()=>setOpen(false)}>
        <p style={{fontSize: 50}}>Loading</p> <CircularProgress style={{marginLeft: "2%"}} color="inherit" />
      </Backdrop>
      :
        (currJobs.length===0)
        ?
        noJobsMessage()
      :
      <div>
         <div className={classes.gridList}>

        {

          currJobs.map((job, key)=>{
            return (
              <Job job={job} key={Math.random() * currPage} setCurrPage={setCurrPage} currPage={currPage}{...props}/>
            )
        })
      }
      </div>
      {
        Math.ceil(jobs.length/jobsPerPage) > 1 &&
      <div className={classes.pagination}>
      <Pagination style={{marginBottom: "5%"}} showFirstButton showLastButton color="primary" count={Math.ceil(jobs.length/jobsPerPage)} page={currPage} onChange={(event: React.ChangeEvent<unknown>, value: number)=>setCurrPage(value)} />
      </div>
    }
      </div>
    )

  // return (
  //   <div>
  //
  //      <div className={classes.gridList}>
  //        {
  //       currJobs.map((job, key)=>{
  //         return (
  //           <Job job={job} key={key}/>
  //         )
  //       })
  //     }
  //   </div>
  //   <div className={classes.pagination} >
  //   <Pagination  showFirstButton showLastButton color="primary" count={Math.ceil(jobs.length/jobsPerPage)} page={currPage} onChange={(event: React.ChangeEvent<unknown>, value: number)=>setCurrPage(value)} />
  //   </div>
  //   </div>
  // )
}

export default ViewJobs
