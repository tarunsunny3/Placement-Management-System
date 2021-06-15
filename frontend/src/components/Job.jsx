import React, {useState} from 'react'
import axios from 'axios';
import {withRouter, useHistory} from 'react-router-dom';
import AppContext from './AppContext';
import { makeStyles, withStyles } from '@material-ui/core/styles';
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
import EditIcon from '@material-ui/icons/Edit';
import ObjectId from 'bson-objectid';
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
  cardBackgroundNormal:{
    backgroundColor: "#f4eee8"
  },
  cardBackgroundUpdated:{
    backgroundColor: "#DDFFBC"
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
    flexWrap: 'wrap',
    direction: 'row',
    width: "30vw",
    [theme.breakpoints.down("sm")]:{
      width: "100%"
    },
    justifyContent: "space-around",
    // alignItems: "center"
  },
  chipItem:{
    // marginTop: "100%",
    marginLeft: "20%",
    // marginRight: "50%"
  },
  wrapper:{
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    // alignItems: "center"
  }
})
);
function Alert(props: AlertProps) {
  return <MuiAlert variant="filled" {...props} />;
}
const StyledInput = withStyles({
  root: {
    '& fieldset': {
        borderColor: '#03256c',
      },
      textTransform: 'capitalize',
      '& input:valid:focus + fieldset': {
        borderLeftWidth: 7,
        padding: '4px !important', // override inline-style
    },
  },

})(TextField);
const Job = (props) => {
  const mainHistory = useHistory();
  const state = props.location.state;
  const jobRef = React.useRef(null);
  const {job, type, currPage, setCurrPage, location, history} = props;
  const urlToServer = encodeURI(`/job/file/${job._id}`);
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
  const [message, setMessage] = useState(null);
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = new Date(job.dateOfExpiry).toLocaleDateString('en-US', dateOptions);

  React.useEffect(()=>{
    let mounted = true;
    if(state && state.alert !== undefined){
      if(mounted){
        setCurrPage(state.currPage);
        setMessage({message: "Job updated successfully", id: state.id});
        if(job._id === state.id){
            jobRef.current.focus();
            jobRef.current.removeAttribute("tabIndex");
        }
        setTimeout(()=>{

          state.alert = undefined;
          setMessage(null);
        }, 3000);
      }
    }
    return function cleanup() {
            mounted = false
    }
  }, []);
  const handleApplyClick = (event)=>{
    setDialogOpen(true);
  }
  const applyJob = async (jobId)=>{

    setDialogOpen(false);
    setAlert({open: true, type: "success", message: "Successfully applied to the job"});
    setApplied(true);
    const res =  await axios.post('/job/addUserToJob', {jobId}, {withCredentials: true});

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
  const res = await axios.post('/job/updateJob', data, {withCredentials: true})
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
  const res = await axios.post('/job/updateJob', data, {withCredentials: true})
  setClosed(true);
}


// const downloadExcelFile = async ()=>{
//   const res = await axios.get("/job/file", {withCredentials: true});
//   console.log(res);
// }
  return (




    <div  className={classes.gridItem} key={job._id}>
      <p>{message !== null && message.id === job._id && message.message}</p>
      { !closed &&
      <div>
      <Card  ref={jobRef} tabIndex="-1" className={message===null || message.id !== job._id ? `${classes.root} ${classes.cardBackgroundNormal}`: `${classes.root} ${classes.cardBackgroundUpdated}`}>
        <CardActionArea>
          {
            (user && user.role!=="Student") &&
              jobNotExpired && job.isOpen === true
              &&
              <>
              <Tooltip title="Close/Delete this Job?" placement="right">
                <CloseIcon style={{float: "right", padding: "5%"}} onClick={()=>deleteJob(job._id)}/>
              </Tooltip>

              <Tooltip title="Update this Job?" placement="right">
                <EditIcon style={{float: "left", padding: "5%"}} onClick={()=>{
                  mainHistory.push("/job", {id: job._id, type: "update", currPage})
                }}/>
            </Tooltip>
            </>
              // :
              // <Tooltip title="Re-open this Job?" placement="right">
              //   <CloseIcon style={{float: "right", padding: "5%"}} onClick={()=>deleteJob(job._id)}/>
              // </Tooltip>
          }
          <CardContent >


            <Typography  style={{textAlign: "center", margin: "auto"}} variant="h5" component="h2">
            {job.companyName}
            </Typography>
            <div className={classes.chips}>
              <div>
                <p>Location</p>
                <div className={classes.wrapper}>
                  <i className="fas fa-map-marker-alt fa-3x"></i>
                <Chip style={{marginLeft: "4%", marginTop: "5%"}} label={job.location} color="secondary" variant="default"></Chip>
                </div>
              </div>

              <div>
                <p>Salary Package</p>
                <div className={classes.wrapper}>
                  <i className="fas fa-rupee-sign fa-3x"></i>
                <Chip style={{marginLeft: "4%", marginTop: "5%"}} label={new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR'}).format(Number(job.salaryPackage))} color="primary" variant="default"></Chip>
                </div>
              </div>
              <div>
                <p>Job Position</p>
                <div className={classes.wrapper}>
                  <i className="fas fa-user fa-3x"></i>
                  <Chip style={{marginLeft: "4%", marginTop: "5%"}} label={job.jobPosition} color="secondary" variant="default"></Chip>
                </div>
              </div>
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
              <div>
                <p tabIndex="0" ref={jobRef} className={classes.wrapper} ><b>Apply by</b></p>
              <div className={classes.wrapper}>

                <i className="fas fa-hourglass-half fa-3x"></i>
                <Chip style={{marginLeft: "4%", marginTop: "1%"}} label={formattedDate} color="primary" variant="default"></Chip>
              </div>
               {/*<Chip label={"Date of Expiry: " + formattedDate} className={`${classes.chip} ${classes.chips}`} color="primary" variant="default"></Chip>*/}
            </div>
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
    <StyledInput
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
