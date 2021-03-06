import React, { useState } from "react";
import axios from "axios";
import { withRouter, useHistory } from "react-router-dom";
import AppContext from "./AppContext";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import { styled } from "@material-ui/styles";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";
import Chip from "@material-ui/core/Chip";
import Tooltip from "@material-ui/core/Tooltip";
import EditIcon from "@material-ui/icons/Edit";
import Modal from "@material-ui/core/Modal";
import UploadFile from "./UploadFile";
import Badge from "@material-ui/core/Badge";
import CheckIcon from "@material-ui/icons/Check";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Collapse from "@material-ui/core/Collapse";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    // maxWidth: "40%",
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      // width: '100%',
    },
    boxShadow: "13px 13px rgba(0, 0, 0, 0.2)",
    [theme.breakpoints.up('md')]:{
      transition: "0.3s  ease-in-out",
      '&:hover':{
        transform: "perspective(200px) translateZ(10px)",
      }
    }
    
  },
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    margin: theme.spacing(3),
    padding: theme.spacing(4),
  },
  heading: {
    textAlign: "center",
    color: "teal",
    marginTop: "5%",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    marginTop: "2%",
  },
  cardBackgroundNormal: {
    backgroundColor: "#f4eee8",
    backgroundColor: "#F8EDED",
  },
  cardBackgroundUpdated: {
    backgroundColor: "#DDFFBC",
  },
  // gridList:{
  //   display: 'flex',
  //   flexWrap: 'wrap',
  //   direction: 'row',
  //   justifyContent: 'space-evenly',
  // },
  // gridItem:{
  //   margin: '2%',
  //   width: "100vw",
  //   flexBasis: "100%",
  //   [theme.breakpoints.up("sm")]:{
  //     flexBasis:'10vw',
  //   },
  // },
  chip: {
    backgroundColor: "orange",
  },
  // chips: {
  //   margin: "3% auto 5% auto",
  //   display: "flex",
  //   flexWrap: 'wrap',
  //   direction: 'row',
  //   flexBasis: "100%",
  //   justifyContent: "space-evenly",
  // },
  // chipItem:{

  //   marginLeft: "20%",
  //   [theme.breakpoints.down("sm")]:{
  //    marginTop: "100%",
  //   },
  //   // marginRight: "50%"
  // },
  wrapper: {
    display: "flex",
    // flexDirection: "row",
    // flexWrap: "wrap",
    alignItems: "center",
  },
  badgeContent: {
    marginLeft: "3%",
  },
  jobPosition: {
    // '& .MuiChip-label':{
    //   whiteSpace: "break-lines"
    // }
    width: "calc(20%)",
  },
}));
function Alert(props: AlertProps) {
  return <MuiAlert variant="filled" {...props} />;
}
const StyledInput = withStyles({
  root: {
    "& fieldset": {
      borderColor: "#03256c",
    },
    textTransform: "capitalize",
    "& input:valid:focus + fieldset": {
      borderLeftWidth: 7,
      padding: "4px !important", // override inline-style
    },
  },
})(TextField);
const Job = (props) => {
  const mainHistory = useHistory();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const state = props.location.state;
  const jobRef = React.useRef(null);
  const { job, type, currPage, setCurrPage, location, history } = props;
  const jobNotExpired =
    job.dateOfExpiry !== undefined && new Date(job.dateOfExpiry) > new Date();
  const { user } = React.useContext(AppContext);
  const classes = useStyles();
  //To diable the Apply button correspondingly
  const [applied, setApplied] = useState(false);
  //To only show initial job desc upto 70 characters or less
  const [jobDesc, setJobDesc] = useState(job.jobDesc.substr(0, 70));
  //To store the number of students got placed value
  const [studentsPlaced, setStudentsPlaced] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteJobDialog, setDeleteDialog] = useState(false);
  const [alert, setAlert] = useState({ open: false, type: "", message: "" });
  const [disabled, setDisabled] = useState(false);
  const [closed, setClosed] = useState(false);
  const [message, setMessage] = useState(null);
  const [modal, setModal] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [collapseChecked, setCollapseChecked] = useState(false);
  const [studentsPlacedError, setStudentsPlacedError] = useState({error: false, message: ""});
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = new Date(job.dateOfExpiry).toLocaleDateString(
    "en-US",
    dateOptions
  );
  React.useEffect(()=>{
    setCollapseChecked(true);
  }, [])

  React.useEffect(() => {
    let mounted = true;
    if (state && state.alert !== undefined) {
      if (mounted) {
        setCurrPage(state.currPage);
        setMessage({ message: "Job updated successfully", id: state.id });
        if (job._id === state.id) {
          jobRef.current.focus();
          jobRef.current.removeAttribute("tabIndex");
        }
        setTimeout(() => {
          state.alert = undefined;
          setMessage(null);
        }, 3000);
      }
    }
    return function cleanup() {
      mounted = false;
    };
  }, []);
  const handleApplyClick = (event) => {
    setDialogOpen(true);
  };
  const applyJob = async (jobId) => {
    setDialogOpen(false);

    const res = await axios.post(
      "/job/addUserToJob",
      { jobId },
      { withCredentials: true }
    );
    if (res.data.success) {
      setAlert({
        open: true,
        type: "success",
        message: "Successfully applied to the job",
      });
      setApplied(true);
    } else {
      setAlert({
        open: true,
        type: "error",
        message: "Couldn't apply for the job",
      });
      setApplied(false);
    }
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
  };
  const onClickMore = (event, originalString) => {
    event.preventDefault();
    setJobDesc(originalString);
  };
  const closeJob = async (jobId) => {
    const data = {
      _id: jobId,
      updateData: {
        noOfStudentsPlaced: studentsPlaced,
        isOpen: false,
      },
    };
    const res = await axios.post("/job/updateJob", data, {
      withCredentials: true,
    });
    setAlert({
      open: true,
      type: "success",
      message: "Closed the Job successfully",
    });
    // props.setRefresh(true);

    setDisabled(true);
    setStudentsPlaced("");
  };
  const deleteJob = async (jobId) => {
    const data = {
      _id: jobId,
      updateData: {
        isOpen: false,
      },
    };
    setDeleteDialog(false);
    setAlert({
      open: true,
      type: "success",
      message: "Deleted the Job successfully",
    });
    const res = await axios.post("/job/updateJob", data, {
      withCredentials: true,
    });
    setClosed(true);
  };

  const handleOfferLetter = async (offerLetterLink) => {
    let updateData = {};

    if (user !== undefined && user.details !== undefined) {
      const userDetails = user.details;
      userDetails.offerLettersLinks = [
        ...userDetails.offerLettersLinks,
        { jobID: job._id, link: offerLetterLink },
      ];
      updateData = {
        details: userDetails,
      };
    } else {
      const userDetails = user.details;
      userDetails.offerLettersLinks = [
        { jobID: job._id, link: offerLetterLink },
      ];
      updateData = {
        details: userDetails,
      };
    }

    const res = await axios.post("/api/updateUserDetails", { updateData });
    console.log(res.data);
    setModal(false);
  };

  return (
    <Collapse in={collapseChecked} {...(collapseChecked ? {timeout: 1000}: {})}>
    <div key={job._id}>
      <p>{message !== null && message.id === job._id && message.message}</p>
      {!closed && (
        <div>
          <Card
            ref={jobRef}
            tabIndex="-1"
            className={
              message === null || message.id !== job._id
                ? `${classes.root} ${classes.cardBackgroundNormal}`
                : `${classes.root} ${classes.cardBackgroundUpdated}`
            }
          >
            <div
              style={{
                width: "100%",
                padding: "2% 0",
                backgroundColor: "#907FA4",
                color: "white",
              }}
            >
              {
                user &&
                  user.role !== "Student" &&
                  jobNotExpired &&
                  job.isOpen === true && (
                    <>
                      <Tooltip title="Close/Delete this Job?" placement="top">
                        <CloseIcon
                          style={{
                            float: "right",
                            paddingRight: "5%",
                            marginTop: "1%",
                          }}
                          onClick={() => setDeleteDialog(true)}
                        />
                      </Tooltip>

                      <Tooltip title="Update this Job?" placement="right">
                        <EditIcon
                          style={{
                            float: "left",
                            paddingLeft: "5%",
                            marginTop: "1%",
                          }}
                          onClick={() => {
                            mainHistory.push("/job", {
                              id: job._id,
                              type: "update",
                              currPage,
                            });
                          }}
                        />
                      </Tooltip>
                    </>
                  )
                // :
                // <Tooltip title="Re-open this Job?" placement="right">
                //   <CloseIcon style={{float: "right", padding: "5%"}} onClick={()=>deleteJob(job._id)}/>
                // </Tooltip>
              }

              <Typography
                style={{ textAlign: "center", margin: "auto" }}
                variant="h5"
                component="h2"
              >
                {job.companyName}
                {!isMobile && (
                  <div style={{ float: "right", paddingRight: "10%" }}>
                    <Tooltip title="Number of applicants" placement="right">
                      <Badge
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        badgeContent={job.users.length}
                        showZero
                        color="primary"
                      >
                        <CheckIcon />
                      </Badge>
                    </Tooltip>
                  </div>
                )}
              </Typography>
            </div>
            <CardActionArea>
              <CardContent>
                {/* <div className={classes.chips}>
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
            </div> */}
                <Grid
                  container
                  spacing={1}
                  display="flex"
                  flexwrap="wrap"
                  justifyContent="space-around"
                  alignItems="center"
                >
                  <Grid item xs={12} sm={6}>
                    <div>
                      <p>Location</p>
                      <div className={classes.wrapper}>
                        <i className="fas fa-map-marker-alt fa-3x"></i>
                        <Chip
                          className={classes.badgeContent}
                          label={job.location}
                          color="secondary"
                          variant="default"
                        ></Chip>
                      </div>
                    </div>
                    {/* </Grid> */}
                    {/* <Grid item xs={12} sm= {6}> */}
                    <div>
                      <p>Salary Package</p>
                      <div className={classes.wrapper}>
                        <i className="fas fa-rupee-sign fa-3x"></i>
                        <Chip
                          className={classes.badgeContent}
                          label={new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                          }).format(Number(job.salaryPackage))}
                          color="primary"
                          variant="default"
                        ></Chip>
                      </div>
                    </div>
                    {/* </Grid> */}
                    {/* <Grid item xs={12} sm = {6}> */}
                    {/* <div>
                      <p>Job Position</p>
                      <div className={classes.wrapper}>
                        <i className="fas fa-user fa-3x"></i>
                        <Chip

                          className={`${classes.badgeContent} ${classes.jobPosition}`}
                          label={job.jobPosition}
                          color="secondary"
                          variant="default"
                        ></Chip>
                      </div>
                    </div> */}
                    {/* </Grid> */}
                    {/* <Grid item xs={12} sm = {6}> */}
                    {job.dateOfExpiry !== undefined && (
                      <div>
                        <p
                          tabIndex="0"
                          ref={jobRef}
                          className={classes.wrapper}
                        >
                          <b>Apply by</b>
                        </p>
                        <div className={classes.wrapper}>
                          <i className="fas fa-hourglass-half fa-3x"></i>
                          <Chip
                            className={classes.badgeContent}
                            label={formattedDate}
                            color="primary"
                            variant="default"
                          ></Chip>
                        </div>
                        {/*<Chip label={"Date of Expiry: " + formattedDate} className={`${classes.chip} ${classes.chips}`} color="primary" variant="default"></Chip>*/}
                      </div>
                    )}
                  </Grid>
                </Grid>
              
                
              </CardContent>
            </CardActionArea>
            <CardContent>
            <p>Job Position: {job.jobPosition}</p>
            <IconButton
                  style={{ float: "right" }}
                  onClick={handleExpandClick}
                  aria-expanded={expanded}
                  aria-label="show more"
                >
                  {
                    expanded ? <ExpandLessIcon /> :  <ExpandMoreIcon />
                  }
            </IconButton>
            </CardContent>

            <Collapse in={expanded} timeout="auto">
              <CardContent>
                <Typography
                  style={{ marginTop: "4%" }}
                  variant="body2"
                  component="p"
                >
                  {job.jobDesc}
                  {/* {job.jobDesc.length > 70 ? jobDesc + "..." : jobDesc}
                  {job.jobDesc.length > 70 &&
                    (jobDesc.length <= 70 ? (
                      <a
                        href="!#"
                        onClick={(event) => onClickMore(event, job.jobDesc)}
                      >
                        more
                      </a>
                    ) : (
                      <a
                        href="!#"
                        onClick={(event) =>
                          onClickMore(event, job.jobDesc.substr(0, 70))
                        }
                      >
                        less
                      </a>
                    ))} */}
                </Typography>
                {/* </Collapse> */}
                {isMobile && (
                  <p>
                    Number of Applicants: {job.users.length}
                    <br />
                  </p>
                )}
                {type === "default" && (
                  <Button
                    style={{marginTop: "2%"}}
                    disabled={applied}
                    onClick={(event) => handleApplyClick()}
                    variant="contained"
                    color="primary"
                  >
                    Apply
                  </Button>
                )}
                
                {type === "applied" && (
                  <div>
                    {user &&
                      user.details &&
                      user.details.offerLettersLinks &&
                      user.details.offerLettersLinks.length > 0 && (
                        <p>
                          You have uploaded{" "}
                          <b>
                            {
                              user.details.offerLettersLinks.filter(
                                (link) => link.jobID === job._id
                              ).length
                            }{" "}
                          </b>{" "}
                          offerletters so far.{" "}
                        </p>
                      )}
                    <Button
                      variant="contained"
                      onClick={() => setModal(true)}
                      color="secondary"
                    >
                      Upload Offer Letter{" "}
                    </Button>
                  </div>
                )}
               
                {user != null &&
                  user.role === "Coordinator" &&
                  !disabled &&
                  (job.isOpen === false || !jobNotExpired) && (
                    <p>
                      No. of students got placed:{" "}
                      {job.noOfStudentsPlaced !== undefined ? (
                        job.noOfStudentsPlaced
                      ) : (
                        <span style={{ color: "#e1701a", fontWeight: "bold" }}>
                          Data Not Available
                        </span>
                      )}
                    </p>
                  )}
                {user != null &&
                  user.role === "Coordinator" &&
                  ((!disabled && job.isOpen === true && jobNotExpired) ||
                    ((job.isOpen === false || !jobNotExpired) &&
                      job.noOfStudentsPlaced === undefined)) && (
                      <StyledInput
                        fullWidth
                        type="number"
                        style={{marginTop: "3%"}}
                        label="Number of students placed"
                        variant="outlined"
                        color="primary"
                        value={studentsPlaced}
                        error={studentsPlacedError.error}
                        helperText={studentsPlacedError.error ? studentsPlacedError.message : ""}
                        onChange={(event) =>{
                          if(event.target.value.length > 0 && Number(event.target.value) < 0){
                            setStudentsPlacedError({error: true, message: "Please enter a positive value only"})
                          }else{
                            setStudentsPlacedError({error: false, message: ""});
                            setStudentsPlaced(event.target.value);
                          }
                          
                          }
                        }
                      />
                  )}
                {studentsPlaced.length !== 0 && (
                  <div style={{display: "flex", alignItems: "center"}}>

                 
                  <Button
                    style={{marginRight: "5%" }}
                    onClick={() => closeJob(job._id)}
                    variant="contained"
                    color="secondary"
                  >
                    Close Job?
                  </Button>
                  </div> 
                )}
                {/* {user != null &&
                  user.role === "Coordinator" &&
                  job.isOpen === true &&
                  jobNotExpired && (
                    <Tooltip
                      arrow
                      title={
                        <>
                          <p style={{ fontSize: "12px" }}>
                            Download all the details of students who applied for
                            this job
                          </p>
                        </>
                      }
                      placement="right-end"
                    >
                      {/* <Button variant="contained" color="primary" href={urlToServer}>
          Download
          </Button> */}
                      {/* <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          history.push("/viewReports", { jobID: job._id })
                        }
                      >
                        Download
                      </Button>
                    </Tooltip>
                  )} */} 
              </CardContent>
            </Collapse>
          </Card>
        </div>
      )}
      <Dialog
        open={deleteJobDialog}
        onClose={() => handleDialogClose()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Do you really want to close/delete this job?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            No users can see this job if it's deleted/closed
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)} color="primary">
            No
          </Button>
          <Button onClick={() => deleteJob(job._id)} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={dialogOpen}
        onClose={() => handleDialogClose()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Do you want to apply for this job?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            If yes, your data will be taken and stored in the database since you
            have applied for this job
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose()} color="primary">
            Disagree
          </Button>
          <Button onClick={() => applyJob(job._id)} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      {alert.open && (
        <Snackbar
          open={alert.open}
          autoHideDuration={6000}
          onClose={() => (setAlert = { ...alert, open: false })}
        >
          <Alert
            onClose={() => setAlert({ ...alert, open: false })}
            severity={alert.type}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      )}

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {
          <>
            <div
              style={{
                left: "0",
                right: "0",
                top: "0",
                marginLeft: "auto",
                marginRight: "auto",
              }}
              className={classes.paper}
            >
              <p>Select the offer letter</p>
              <UploadFile
                handleOfferLetter={handleOfferLetter}
                type="doc"
                name="offerLetter"
                saveFolder="offerLetters"
              />
            </div>
          </>
        }
      </Modal>
    </div>
    </Collapse>
  );
};

export default withRouter(Job);
