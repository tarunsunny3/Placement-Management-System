import React, {useState} from 'react'
import axios from 'axios';
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
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
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
    flexBasis:'25%'
  }
})
);
function Alert(props: AlertProps) {
  return <MuiAlert variant="filled" {...props} />;
}
const Job = ({job, user, type, currPage, setCurrPage}) => {
  const classes = useStyles();
  const [applied, setApplied] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const handleApplyClick = (event)=>{
    setDialogOpen(true);
  }
  const applyJob =  async (jobId)=>{
    setDialogOpen(false);
      setAlertOpen(true);
    const res = await  axios.post('/job/addUserToJob', {jobId}, {withCredentials: true});

    window.location.replace(window.location.href);
  }
const handleDialogClose = () => {;
  setDialogOpen(false);
};
  return (
    <div className={classes.gridItem} key={job._id}>
      <div>
      <Card className={classes.root}>
        <CardActionArea>
          {
            (user && user.role!=="Student") &&
            <CloseIcon />
          }
          <CardContent>
            <Typography  variant="h5" component="h2">
            {job.companyName}
            </Typography>
            <Typography gutterBottom variant="h5" component="h2">
            {job.jobPosition}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {job.jobDesc}
            </Typography>
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
  alertOpen && (
    <Snackbar open={alertOpen} autoHideDuration={6000} onClose={()=>setAlertOpen(false)}>
        <Alert onClose={()=>setAlertOpen(false)} severity="success">
          Successfully applied to {job.companyName}
        </Alert>
      </Snackbar>
  )
}
    <Button size="small" color="primary">
      Share
    </Button>
    <Button size="small" color="primary">
      Learn More
    </Button>
  </CardActions>
</Card>
</div>
</div>

  )
}

export default Job
