import React, {useState} from 'react'
import axios from 'axios';
import url from '../apiUrl.js';
import {withRouter} from 'react-router-dom';
import AppContext from './AppContext';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Pagination from '@material-ui/lab/Pagination';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
const useStyles = makeStyles((theme) => ({
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
    [theme.breakpoints.up("sm")]:{
      flexBasis:'30%',
    },
    [theme.breakpoints.down("sm")]:{
      width: "90vw"
    }

  },
  chip:{
    backgroundColor: 'orange'
  },
  chips: {
    margin: "3% auto 3% auto",
    display: "flex",
    justifyContent: "space-between",
    flex: 1
  }
})
);
function Alert(props: AlertProps) {
  return <MuiAlert variant="filled" {...props} />;
}
const Job = (props) => {
  const {job, type, currPage, setCurrPage, location, history} = props;
  const urlToServer = encodeURI(`${url}/job/file/${job._id}`);
  const jobNotExpired = (job.dateOfExpiry !== undefined && (new Date(job.dateOfExpiry) > (new Date())));
  const {user} = React.useContext(AppContext);
  const classes = useStyles();
  //To diable the Apply button correspondingly
  const [applied, setApplied] = useState(false);
  //To only show initial job desc upto 70 characters or less
  const [jobDesc, setJobDesc] = useState(job.jobDesc.substr(0, 70));
  //To store the number of students got placed value
  const [studentsPlaced, setStudentsPlaced] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alert, setAlert] = useState({open: false, type: "", message: ""});
  const [disabled, setDisabled] = useState(false);
  const [closed, setClosed] = useState(false);
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = new Date(job.dateOfExpiry).toLocaleDateString('en-US', dateOptions);
  const handleApplyClick = (event)=>{
    setDialogOpen(true);
  }
  const applyJob = async (jobId)=>{

    setDialogOpen(false);
    setAlert({open: true, type: "success", message: "Successfully applied to the job"});
    setApplied(true);
    const res =  await axios.post(`${url}/job/addUserToJob`, {jobId}, {withCredentials: true});

  }
const handleDialogClose = () => {;
  setDialogOpen(false);
};
const onClickMore = (event, originalString)=>{
  event.preventDefault();
  setJobDesc(originalString);
}
const closeJob = async (jobId)=>{
  const data = {
    _id: jobId,
    updateData:{
      noOfStudentsPlaced: studentsPlaced,
      isOpen: false
    }
  }
  const res = await axios.post(`${url}/job/updateJob`, data, {withCredentials: true})
  setAlert({open: true, type: "success", message: "Closed the Job successfully"});
  // props.setRefresh(true);
  setDisabled(true);
  setStudentsPlaced("");
}
const deleteJob = async (jobId)=>{
  const data = {
    _id: jobId,
    updateData:{
      isOpen: false
    }
  }
  setAlert({open: true, type: "success", message: "Deleted the Job successfully"});
  const res = await axios.post(`${url}/job/updateJob`, data, {withCredentials: true})
  setClosed(true);
}
// const downloadExcelFile = async ()=>{
//   const res = await axios.get("/job/file", {withCredentials: true});
//   console.log(res);
// }
  return (
    <div className={classes.gridItem} key={job._id}>
      { !closed &&
      <div>
      <Card style={{backgroundColor: "#fff5eb"}} className={classes.root}>
        <CardActionArea>
          {
            (user && user.role!=="Student") &&
            <Tooltip title="Close/Delete this Job?" placement="right">
              <CloseIcon style={{float: "right", padding: "5%"}} onClick={()=>deleteJob(job._id)}/>
            </Tooltip>
          }
          <CardContent >
            <Typography  variant="h5" component="h2">
            {job.companyName}
            </Typography>
            <div className={classes.chips}>
            <Chip label={job.jobPosition} color="secondary" variant="default"></Chip>
            <Chip label={job.salaryPackage} color="primary" variant="default"></Chip>
            <Chip label={job.location} color="secondary" variant="default"></Chip>
            </div>
            <Typography variant="body2"  component="p">
              {jobDesc+"..."}
              {
                job.jobDesc.length > 70 &&
                (jobDesc.length <= 70
                ?
                <a href="!#" onClick={(event)=>onClickMore(event, job.jobDesc)}>more</a>
                :
                <a href="!#" onClick={(event)=>onClickMore(event, job.jobDesc.substr(0, 70))}>less</a>
                )
              }
            </Typography>
            {

              job.dateOfExpiry !== undefined
              &&
              <>

               <Chip label={"Date of Expiry: " + formattedDate} className={`${classes.chip} ${classes.chips}`} color="primary" variant="default"></Chip>
            </>
            }

          </CardContent>
        </CardActionArea>
        <CardActions>
        {
          type === "default" &&  <Button
             disabled={applied}
             onClick={(event)=>handleApplyClick()}
             variant="contained"
             color="primary"
           >Apply
         </Button>
        }
        </CardActions>
        <CardActions>
{
  user != null && user.role==="Coordinator" && !disabled && (job.isOpen===false || !jobNotExpired)
  &&
  (
    <p>No. of students got placed: {job.noOfStudentsPlaced !== undefined ? job.noOfStudentsPlaced : <span style={{color: "#e1701a", fontWeight: "bold"}}>Data Not Available</span>}</p>
  )
}

{
  (user != null && user.role==="Coordinator" && !disabled && job.isOpen===true && jobNotExpired
  )
  &&
  (
    <TextField
      label="Number of students placed"
      fullWidth
      variant="outlined"
      color="primary"
      value ={studentsPlaced}
      onChange= {(event)=>setStudentsPlaced(event.target.value)}
    />
  )
}
{
  studentsPlaced.length !== 0
  && job.isOpen===true
  && jobNotExpired
  &&
  (
    <Button style={{width: "60%"}} onClick={()=>closeJob(job._id)} variant="contained" color="secondary">Close Job?</Button>
  )
}
  </CardActions>
  <CardActions>
    {
      user != null && user.role==="Coordinator" && job.isOpen===true
      && jobNotExpired
      &&
      (
        <Tooltip arrow title={
            <>
            <p style={{fontSize: "12px"}}>Download all the details of students who applied for this job</p>
            </>
          }
        placement="right-end">
          <Button variant="contained" color="primary" href={urlToServer}>
          Download
          </Button>
      </Tooltip>
        )
    }
  </CardActions>
</Card>
</div>
}

   <Dialog
          open={dialogOpen}
          onClose={()=>handleDialogClose()}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Do you want to apply for this job?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
            If yes, your data will be taken and stored in the database since you have applied for this job
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={()=>handleDialogClose()} color="primary">
              Disagree
            </Button>
            <Button onClick={()=>applyJob(job._id)} color="primary" autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
{
  alert.open  && (
    <Snackbar open={alert.open} autoHideDuration={6000} onClose={()=>setAlert=({...alert, open: false})}>
        <Alert onClose={()=>setAlert({...alert, open: false})} severity={alert.type}>
          {alert.message}
        </Alert>
    </Snackbar>
  )
}
</div>

  )
}

export default withRouter(Job)
