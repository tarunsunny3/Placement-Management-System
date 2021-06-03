import React, {useState} from 'react'
import axios from 'axios';
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
})
);
const ViewJobs =  (props) => {
  const classes = useStyles();
  const [jobs, setJobs] = useState([]);
  const [currPage, setCurrPage] = useState(1);
  const [jobsPerPage, setJobsPerPage] = useState(3);
  const [open, setOpen] = useState(true);
  // let { data } = useFetch("/job/getJobs");
  // console.log(data);
  // React.useEffect(() => {
  //   async function fetchJobs() {
  //     const res = await axios.get('/job/getJobs');
  //     const data = res.data;
  //     setJobs(data.jobs);
  //     console.log(data.jobs);
  //   }
  //   fetchJobs();
  // }, [jobs])
  //Get current Jobs to be displayed on that particular page
  // const indexOfLastJob = currPage * jobsPerPage;
  // const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  // let currJobs=[];
  // let jobs = [];
  // if(!isLoading){
  //   jobs = data.jobs;
  //   currJobs = data.jobs.slice(indexOfFirstJob, indexOfLastJob);
  // }




  React.useEffect(() => {
    axios.get('/job/getJobs').then((response)=>{
      let jobs = response.data.jobs;
      if(props.user != null){
        if(props.type==="default"){
          setJobs(jobs.filter((job)=>!job.users.includes(props.user.id)));
        }else{
          console.log(props);
          setJobs(jobs.filter(job=>job.users.includes(props.user.id)));
        }
      }

    });
  }, [props, currPage])




    const indexOfLastJob = currPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;

    //Get current Jobs to be displayed on that particular page

    const currJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);


    return (
      currJobs.length === 0?
      <Backdrop  open={open} onClick={()=>setOpen(false)}>
        <p style={{fontSize: 50}}>Loading</p> <CircularProgress style={{marginLeft: "2%"}} color="inherit" />
      </Backdrop>
      :
      <div>

         <div className={classes.gridList}>

        {

          currJobs.map((job, key)=>{
            return (
              <Job job={job} key={key} setCurrPage={setCurrPage} currPage={currPage}{...props}/>
            )
        })
      }
      </div>
      {
        Math.ceil(jobs.length/jobsPerPage) > 1 &&
      <div className={classes.pagination}>
      <Pagination  showFirstButton showLastButton color="primary" count={Math.ceil(jobs.length/jobsPerPage)} page={currPage} onChange={(event: React.ChangeEvent<unknown>, value: number)=>setCurrPage(value)} />
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
