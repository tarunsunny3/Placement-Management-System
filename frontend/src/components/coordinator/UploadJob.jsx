import React, {useState, useEffect} from 'react'
import {withRouter, useHistory} from 'react-router-dom';
import { CssBaseline,Typography, Grid,Button, FormControl, FormControlLabel, FormLabel, Radio,RadioGroup} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {cities} from "./cities";
import Autocomplete , { createFilterOptions } from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Checkbox from '@material-ui/core/Checkbox';
import axios from 'axios';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider,KeyboardDatePicker} from '@material-ui/pickers';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const filter = createFilterOptions();
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: "100vh",
   
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
   
  },
  paper: {
    [theme.breakpoints.up("md")]:{
      maxWidth: "70%",
    },

    [theme.breakpoints.down("md")]:{
      maxWidth: "85%",
    },
    marginTop: theme.spacing(8),
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
    marginBottom: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: '20px',
    border: "15px groove",
    borderColor: "pink",
    backgroundColor: "white"
  },

  form: {
    width: '100%', // Fix IE 11 issue.
    margin: theme.spacing(3),
    padding: theme.spacing(4)
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  textField:{
    width: "100%",
    marginTop: "8%",
    marginBottom: "8%"
  },

  cssOutlinedInput: {
    '&$cssFocused $notchedOutline': {
      borderColor: `${theme.palette.primary.main} !important`,
    }
  },

  cssFocused: {},

  notchedOutline: {
    borderWidth: '1.9px',
    borderColor: '#5aa897 !important'
  },
  heading:{
    paddingTop: theme.spacing(2)
  },
  container:{
    display: 'flex',
    justifyContent: 'center'
  },
  alert:{
    marginTop: '20px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  }
}));
const StyledInput = withStyles({
  root: {
    '& fieldset': {
        borderColor: '#005792',
      },
      textTransform: 'capitalize',
      '& input:valid:focus + fieldset': {
        borderLeftWidth: 7,
        padding: '4px !important', // override inline-style
    },
  },

})(TextField);
console.log(process.env.PUBLIC_URL);
const UploadJob = (props) => {
  const classes = useStyles();
  const state = props.location.state;
  const history = useHistory();
  const [availableCompanies, setCompanies] = useState([]);
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [gpa, setGpa] = useState("");
  const [salaryPackage, setPackage] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobPos, setJobPos] = useState("");
  const [jobType, setJobType] = useState("full");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [gateScore, setGateScore] = useState(null);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(false);
  const [open, setOpen] = useState(true);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [dumCourses, setDumcourse] = useState([]);
  const [dateOfExpiry, setDate] = useState(new Date().setMonth((new Date().getMonth())+3));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [salary, setSalary] = useState("");
  //Interface to store courses
  interface CourseType {
    inputValue?: string;
    courseName: string;
  }
  React.useEffect(() => {
    if(state && state.alert!==undefined){
      setAlert(true);
      setOpen(true);
      setMessage(state.message);
    }
    async function fetchCourses() {
      setLoading(true);
      const res = await axios.get('/job/getCourses');
      const data = res.data;
      setAvailableCourses(data.courses);
      if(state && state.type==="update"){
        const res1 = await axios.get(`/job/job/${state.id}`);
        const d = res1.data;
        if(d.success){
          const {companyName, location, dateOfExpiry, jobPosition,jobType, jobDesc, minCgpa, salaryPackage, courses, gateScore} = d.job;
          setCompany(companyName);
          setLocation(location);
          setJobPos(jobPosition);
          setJobDesc(jobDesc);
          setGpa(minCgpa)
          setSelectedCourses(courses);
          setPackage(salaryPackage);
          setGateScore(gateScore);
          setJobType(jobType)
          setDate(dateOfExpiry);
          let dup = [];
          courses.map((val)=>{
            dup.push({courseName: val, inputValue: ""});
          })
          setDumcourse(dup);
        }
      }
      setLoading(false);
    }
    fetchCourses();

  }, [])

let courses1: CourseType[]= availableCourses;


  const handleSubmit = async (event)=>{
    event.preventDefault();
    let tempErrors = {};
    if(company.length === 0){
      tempErrors["company"] = "Please select/enter the company name";
    }
    if(location.length === 0){
      tempErrors["location"] = "Please select/enter the location name";
    }
    if(jobDesc.length === 0){
      tempErrors["jobDesc"] = "Please enter atleast few words of description";
    }
    if(selectedCourses.length === 0){
      tempErrors["courses"] =  "Please select atleast one course";
    }
    if(Number(gpa)<0 || Number(gpa)>100){
      tempErrors["gpa"] =  "Please enter a value in the range (0-100)";
    }
    if(salaryPackage.length === 0){
      tempErrors['salaryPackage'] = "Please enter the salary package";
    }
    if(salaryPackage.length > 0 && (Number(salaryPackage)<0 || isNaN(Number(salaryPackage)))){
      tempErrors['salaryPackage'] = "Please a valid value in numbers only!";
    }
    setErrors(tempErrors);
  if(Object.keys(tempErrors).length===0){

      let data = {
        company, location, jobPosition: jobPos, salaryPackage, jobType, jobDesc, courses: selectedCourses, minCgpa: gpa, year: new Date().getFullYear(), dateOfExpiry
      }
      if(gateScore !== null){
        data["gateScore"] = gateScore;
       }
       if(state && state.type==="update"){
         const res = await axios.post('/job/updateJob',{_id: state.id, updateData: data}, {withCredentials: true});
         const d = res.data;
         console.log(d);
         if(d.success){
          const res = axios.post('/api/sendJobUpdateEmail', {message: `${company} - ${jobPos}`, courses: selectedCourses});
           history.push("/view", {alert: true, id: state.id, currPage: state.currPage});
           
         }else{
           setAlert(true);
           setOpen(true);
           setMessage("Couldn't update the job");
         }
       }else{

         const res = await axios.post('/job/uploadJob', data, {withCredentials: true});
         const d = res.data;
         if(d.success){
           history.go(0);
           const res = axios.post('/sendJobUpdateEmail', {message: `${company} - ${jobPos}`, courses: selectedCourses});
           history.push("/job", {alert: true, message: "Job posted successfully!!"});
           
         }else{
           setAlert(true);
           setOpen(true);
           setMessage("Couldn't post the job");
         }
       }
    }
  }

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  useEffect(() => {
    async function fetchCompanyNames() {

      let response = await axios.get('/job/getCompanyNames');
      // setCompanies(respons)
      setCompanies(response.data.companyNames);

    }
    fetchCompanyNames();
  }, [])

  const handleCompany = (event)=>{
    if(event.target.value.length > 0){
      setErrors({...errors, "company" : ""});
    }else{
      setErrors({...errors, "company" : "Please select/enter the company name"});
    }
    setCompany(event.target.value);
  }
  const handleCompany1 = (event, values)=>{
    console.log(values);
    if(values!==null){
      setErrors({...errors, "company" : ""});
      setCompany(values);
    }else{
      setCompany("");
      setErrors({...errors, "company" : "Please select/enter the company name"});
    }
  }
  const handlePackage = (event)=>{
      if((Number(event.target.value)<0 || isNaN(Number(event.target.value)) || event.target.value.length === 0)){
          setErrors({...errors, "salaryPackage" : "Please enter a valid value"});
          setPackage("");
      }else{
        setErrors({...errors, "salaryPackage" : ""});
        setPackage(event.target.value);
        console.log(event.target.value);
        setSalary(new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR'}).format(event.target.value));
      }
    }

  const handleLocation1 = (event, values)=>{
    if(values){
      setErrors({...errors, "location" : ""});
      setLocation(values);
    }else{
      setLocation("");
      setErrors({...errors, "location" : "Please select/enter the location name"});
    }
  }

  const handleLocation = (event)=>{
    if(event.target.value.length > 0){
      setErrors({...errors, "location" : ""});
    }else{
      setErrors({...errors, "location" : "Please select/enter the location name"});
    }
    setLocation(event.target.value);
  }
  const handleGpa = (event)=>{
    if(event.target.value.length > 0){
      let gpa = event.target.value;
      if(Number(gpa) < 0 || Number(gpa) > 100){
        setErrors({...errors, "gpa" : "Please enter a value in the range (0-100)"});
      }else{
        setErrors({...errors, "gpa" : ""});
      }
      
    }
    setGpa(event.target.value);
  }
  const handleJobDesc = (event)=>{
    if(event.target.value.length > 0){
      setErrors({...errors, "jobDesc" : ""});
    }else{
      setErrors({...errors, "jobDesc" : "Please enter atleast few words of description"});
    }
    setJobDesc(event.target.value);
  }
  // const handleSelectedCourses1 = (event, values)=>{
  //   console.log("Values is ", values);
  //   if(values.length > 0){
  //     setErrors({...errors, "courses" : ""});
  //   }else{
  //     setErrors({...errors, "courses" : "Please select atleast one course"});
  //   }
  //   setSelectedCourses(values);
  // }

  // const handleSelectedCourses = (event)=>{
  //   if(event.target.value.length > 0){
  //     setErrors({...errors, "courses" : ""});
  //   }else{
  //     setErrors({...errors, "courses" : "Please select atleast one course"});
  //   }
  //   setSelectedCourses([...selectedCourses, event.target.value]);
  // }
// const handleCourses = async (event, newValue)=>{
//   console.log("Newvalue is ", newValue);
//     if(newValue.length === 0){
//       setSelectedCourses(newValue);
//       setErrors({...errors, "courses" : "Please select atleast one course"});
//       return;
//     }
//
//     if(typeof newValue[newValue.length-1]==="string"){
//       const data = {
//         "courseName": newValue[newValue.length-1]
//       }
//       setErrors({...errors, "courses" : ""});
//       newValue[newValue.length-1] = {"courseName":  newValue[newValue.length-1]};
//       setSelectedCourses(newValue);
//       const res = await axios.post("http://localhost:8080/job/addCourse", data, {withCredentials: true});
//       console.log(res.data);
//     }
//     if(newValue.length>0 && newValue[newValue.length-1].inputValue) {
//     // Create a new value from the user input
//       const data = {
//         "courseName": newValue[newValue.length-1].inputValue
//       }
//       setErrors({...errors, "courses" : ""});
//       setSelectedCourses([...selectedCourses, {"courseName":  newValue[newValue.length-1].inputValue}]);
//
//       const res = await axios.post("http://localhost:8080/job/addCourse", data, {withCredentials: true});
//       console.log(res.data);
//     } else {
//       setErrors({...errors, "courses" : ""});
//       // console.log(newValue);
//       setSelectedCourses(newValue);
//     }
// }
// const handleCourses = async (event, newValue)=>{
//   console.log("Newvalue is ", newValue);
//     if(newValue.length === 0){
//       setSelectedCourses([]);
//       setErrors({...errors, "courses" : "Please select atleast one course"});
//       return;
//     }
//
//     if(typeof newValue[newValue.length-1]==="string"){
//       const data = {
//         "courseName": newValue[newValue.length-1]
//       }
//       setErrors({...errors, "courses" : ""});
//       // newValue[newValue.length-1] = {"courseName":  newValue[newValue.length-1]};
//       setSelectedCourses([...selectedCourses,  newValue[newValue.length-1]]);
//       const res = await axios.post(`${url}/job/addCourse`, data, {withCredentials: true});
//       console.log(res.data);
//     }
//     if(newValue.length>0 && newValue[newValue.length-1].inputValue) {
//
//     // Create a new value from the user input
//       const data = {
//         "courseName": newValue[newValue.length-1].inputValue
//       }
//       setErrors({...errors, "courses" : ""});
//       setSelectedCourses([...selectedCourses,  newValue[newValue.length-1].inputValue]);
//
//       const res = await axios.post(`${url}/job/addCourse`, data, {withCredentials: true});
//       console.log(res.data);
//     } else {
//       setErrors({...errors, "courses" : ""});
//       let courses = [];
//       newValue.map((val, key) => {
//         courses.push(val.courseName);
//       })
//       setSelectedCourses(courses);
//     }
// }
const handleCourses = async (event, newValue)=>{
  console.log("Newvalue is ", newValue);
    if(newValue.length === 0){
      setSelectedCourses([]);
      setDumcourse([]);
      setErrors({...errors, "courses" : "Please select atleast one course"});
      return;
    }
    setErrors({...errors, "courses": ""});
    setDumcourse(newValue);
    let courses = [];
    newValue.map((val)=>{
      if(typeof val === "string"){
        courses.push(val);
      }else if(val.inputValue !== undefined && val.inputValue !== ""){
        courses.push(val.inputValue);
      }else{
        courses.push(val.courseName);
      }
    })
    setSelectedCourses(courses);
}
const handleDate = (date: Date | null) => {
    setDate(date);
  };

  return (
    loading?
    <Backdrop  open={open} onClick={()=>setOpen(false)}>
      <p style={{fontSize: 50}}>Loading</p> <CircularProgress style={{marginLeft: "2%"}} color="inherit" />
    </Backdrop>
    :
<MuiPickersUtilsProvider utils={DateFnsUtils}>

    <Grid  container direction="column" justify="flex-start" alignItems="center">
      <CssBaseline />

    <div  className={classes.paper}>
      {alert && <Collapse className={classes.alert} in={open}>
        <Alert
          variant="filled"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
              >
                <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          >
          {message}
          </Alert>
        </Collapse>}
        <Typography variant="h3" className={classes.heading}>
          {state===undefined || state.type===undefined ? "Post Job" : "Update Job"}
        </Typography>
        <form onSubmit={(e)=>handleSubmit(e)}className={classes.form} noValidate autoComplete="off">
          <Grid container spacing={8}>
            <Grid item xs={12} sm={6}>
              {/* {console.log((errors["company"] && errors["company"].length !== 0))} */}
              {  /*onChange={(event)=>{
                  handleCompany(event)}}*/}
              <Autocomplete
                id="free-solo-demo"
                freeSolo
                options={availableCompanies.map((option) => option)}
                value={company}
                onChange={(event, values)=>handleCompany1(event, values)}
                renderInput={(params) => (
                  // <StyledInput {...params} label="freeSolo" margin="normal" variant="outlined" />
                  <StyledInput
                    {...params}
                    label="Company name"
                    value={company}
                    onChange={(e)=>setCompany(e.target.value)}
                    error={(errors["company"]) ? true : false}
                    helperText={errors["company"]}
                    variant="outlined"
                    fullWidth
                    required
                    />
                )}
              />

            </Grid>

            <Grid item xs={12} sm={6}>
              <Autocomplete
                id="free-solo-demo"
                freeSolo
                options={cities.map((option) => option.city)}
                value={location}
                onChange={(event, values)=>handleLocation1(event, values)}
                renderInput={(params) => (
                  // <StyledInput {...params} label="freeSolo" margin="normal" variant="outlined" />
                  <StyledInput
                    {...params}
                    label="Location"
                    error={(errors["location"]) ? true : false}
                    helperText={errors["location"]}
                    variant="outlined"
                    fullWidth
                    required
                  />
              )}
            />


          </Grid>
        </Grid>

          <Grid container spacing={8}>
            <Grid item xs={12} sm={6}>
              <StyledInput
                label="Minimum CGPA"
                value={gpa}
                error={(errors["gpa"]) ? true : false}
                onChange={(event)=>handleGpa(event)}
                variant="outlined"
                helperText="Enter a value in the range 0-100"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledInput
                label="Job Position"
                value={jobPos}
                onChange={(event)=>setJobPos(event.target.value)}
                variant="outlined"
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container  spacing={8}>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                multiple
                id="checkboxes-tags-demo"
                options={courses1}
                freeSolo
                value={dumCourses}
                getOptionSelected={(option, value) => value.courseName === option.courseName}
                filterOptions={(options, params) => {
                const filtered = filter(options, params);

                // Suggest the creation of a new value
                let bool = false;
                options.map((val, key)=>{
                  if(val.courseName===params.inputValue){
                    bool = true;
                  }
                  return bool;
                })
                if (!bool){
                  filtered.push({
                    inputValue: params.inputValue,
                    courseName: `Add "${params.inputValue}"?`,
                  });
                }
                return filtered;
              }}

              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              disableCloseOnSelect
              getOptionLabel={(option) => {
                // Value selected with enter, right from the input
                if (typeof option === 'string') {
                  return option;
                }
                // Add "xxx" option created dynamically
                if (option !== undefined){
                  if(option.inputValue) {
                   return option.inputValue;
                 }
                 // Regular option
                 return option.courseName;
                }

                }
              }
              onChange={(event, newValue) => handleCourses(event, newValue)}
              renderOption={(option, { selected }) => (
                  <React.Fragment>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                  {option.courseName}
                  </React.Fragment>
                )}
                style={{width: "100%"}}
                renderInput={(params) => (
                  <StyledInput {...params} variant="outlined" label="Courses" placeholder="Select courses"
                    required

                    style={{width: "100%"}}
                    error={(errors['courses']?true:false)}
                    helperText={errors["courses"]}
                  />
              )}
            />
          </Grid>
            {

              selectedCourses.map((val, key)=>{
                // console.log(val.toLowerCase().includes("Mtech".toLowerCase()));
                if(val.toLowerCase().includes("Mtech".toLowerCase())){
                  return(
                    <Grid key={key} item xs={12} sm={6} style={{marginTop: "20px"}}>
                      <StyledInput
                        label="Gate Score"
                        value={gateScore || ""}
                        onChange={(event)=>setGateScore(event.target.value)}
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>
                  )
                }
              })
            }

          <Grid item xs={12} sm={6}>
            <StyledInput
               label="Salary Package"
               // className={classes.textField}
               value={salaryPackage}
               error={(errors["salaryPackage"]) ? true : false}
               onChange={(event)=>{
                 handlePackage(event)
               }
               }
               placeholder="Enter salary"
               type="number"
               helperText={errors["salaryPackage"]==="" ? "Enter salary like 1000 for thousand in numbers": errors["salaryPackage"]}
               variant="outlined"
               fullWidth
               required
               />
             {
             salaryPackage.length > 0
             &&
             <p>{salary}</p>
             }
        </Grid>
        </Grid>
        <Grid container spacing={8}>
          <Grid item xs={12} sm={6}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Job Type</FormLabel>
            <RadioGroup aria-label="jobType" name="jobType" value={jobType} onChange={(e)=>setJobType(e.target.value)}>
              <FormControlLabel value="full" control={<Radio />} name="jobType" label="Full-Time" />
              <FormControlLabel value="intern" control={<Radio />} name="jobType" label="Internship" />
        </RadioGroup>
      </FormControl>
    </Grid>


  </Grid>
  <StyledInput
    id="job"
    required
    label="Job Description"
    multiline
    rows={8}
    value={jobDesc}
    error={(errors["jobDesc"]) ? true : false}
    onChange={(event)=> handleJobDesc(event)}
    helperText={errors["jobDesc"]}
    variant="outlined"
    fullWidth
    autoFocus={(errors["jobDesc"]) ? true : false}
  />

        <Grid container justify="space-around">
          <KeyboardDatePicker
            format="dd/MM/yyyy"
            margin="normal"
            id="date-of-expiry"
            label="Date of Expiry"
            value={dateOfExpiry}
            onChange={handleDate}
            helperText="Defaults to 3 months from now"
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
      </Grid>


  <Button
    type="submit"
    fullWidth
    variant="contained"
    color="primary"
    className={classes.submit}
    >
    {state===undefined || state.alert!==undefined ? "Post job" : "Update Job"}
    </Button>
  </form>
</div>
</Grid>
</MuiPickersUtilsProvider>
)
}

export default withRouter(UploadJob)
