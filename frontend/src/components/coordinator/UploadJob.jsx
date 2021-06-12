import React, {useState, useEffect} from 'react'
import url from '../../apiUrl.js';
import { CssBaseline,Typography, Grid,Button, FormControl, FormControlLabel, FormLabel, Radio,RadioGroup} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
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
import InputAdornment from '@material-ui/core/InputAdornment';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
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
    maxWidth: "70%",
    marginTop: theme.spacing(8),
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: '20px',
    // justifyContent: 'center',
    // justifyItems: 'center',
    backgroundColor: "#f4eee8"
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

const UploadJob = (props) => {
  const classes = useStyles();
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
  const [dateOfExpiry, setDate] = useState(new Date().setMonth((new Date().getMonth())+3));
  //Interface to store courses
  interface CourseType {
    inputValue?: string;
    courseName: string;
  }
  React.useEffect(() => {
    async function fetchCourses() {
      const res = await axios.get(`${url}/job/getCourses`);
      const data = res.data;
      setAvailableCourses(data.courses);
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
        company, location, jobPos,salaryPackage, jobType,jobDesc, courses: selectedCourses, minCgpa: gpa, year: new Date().getFullYear(), dateOfExpiry
      }
      if(gateScore !== null){
        data["gateScore"] = gateScore;
       }
      const res = await axios.post(`${url}/job/uploadJob`,data, {withCredentials: true});
      const d = res.data;
      console.log(d);
      setAlert(true);
      setOpen(true);
      window.scrollTo(0, 0)
    }
  }

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  useEffect(() => {
    async function fetchCompanyNames() {

      let response = await axios.get(`${url}/job/getCompanyNames`);
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
    if(values){
      setErrors({...errors, "company" : ""});
      setCompany(values);
    }else{
      setErrors({...errors, "company" : "Please select/enter the company name"});
    }
  }
  const handlePackage = (event)=>{
    if(event.target.value.length > 0){
      setErrors({...errors, "salaryPackage" : ""});
    }else{
      setErrors({...errors, "salaryPackage" : "Please enter the salary salaryPackage"});
    }
    setPackage(event.target.value);
  }
  const handleLocation1 = (event, values)=>{
    if(values){
      setErrors({...errors, "location" : ""});
      setLocation(values);
    }else{
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
      setErrors({...errors, "gpa" : ""});
    }else{
      setErrors({...errors, "gpa" : "Please enter a value in the range (0-100)"});
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
const handleCourses = async (event, newValue)=>{
  // console.log("Newvalue is ", newValue);
    if(newValue.length === 0){
      setSelectedCourses([]);
      setErrors({...errors, "courses" : "Please select atleast one course"});
      return;
    }

    if(typeof newValue[newValue.length-1]==="string"){
      const data = {
        "courseName": newValue[newValue.length-1]
      }
      setErrors({...errors, "courses" : ""});
      // newValue[newValue.length-1] = {"courseName":  newValue[newValue.length-1]};
      setSelectedCourses([...selectedCourses,  newValue[newValue.length-1]]);
      const res = await axios.post(`${url}/job/addCourse`, data, {withCredentials: true});
      console.log(res.data);
    }
    if(newValue.length>0 && newValue[newValue.length-1].inputValue) {

    // Create a new value from the user input
      const data = {
        "courseName": newValue[newValue.length-1].inputValue
      }
      setErrors({...errors, "courses" : ""});
      setSelectedCourses([...selectedCourses,  newValue[newValue.length-1].inputValue]);

      const res = await axios.post(`${url}/job/addCourse`, data, {withCredentials: true});
      console.log(res.data);
    } else {
      setErrors({...errors, "courses" : ""});
      let courses = [];
      newValue.map((val, key) => {
        courses.push(val.courseName);
      })
      setSelectedCourses(courses);
    }
}
const handleDate = (date: Date | null) => {
    setDate(date);
  };
  return (
<MuiPickersUtilsProvider utils={DateFnsUtils}>
    <Grid container direction="column" justify="flex-start" alignItems="center">
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
            Job Posted successfully!
          </Alert>
        </Collapse>}
        <Typography variant="h3" className={classes.heading}>
          Post Job
        </Typography>
        <form onSubmit={(e)=>handleSubmit(e)}className={classes.form} noValidate autoComplete="off">
          <Grid container spacing={8}>
            <Grid item xs={12} sm={6}>
              {/* {console.log((errors["company"] && errors["company"].length !== 0))} */}
              <Autocomplete
                id="free-solo-demo"
                freeSolo
                options={availableCompanies.map((option) => option)}
                onChange={(event, values)=>handleCompany1(event, values)}
                renderInput={(params) => (
                  // <TextField {...params} label="freeSolo" margin="normal" variant="outlined" />
                  <TextField
                    {...params}
                    label="Company name"
                    value={company}
                    error={(errors["company"]) ? true : false}
                    onChange={(event)=>{
                      handleCompany(event)}}
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
                onChange={(event, values)=>handleLocation1(event, values)}
                renderInput={(params) => (
                  // <TextField {...params} label="freeSolo" margin="normal" variant="outlined" />
                  <TextField
                    {...params}
                    label="Location"
                    value={location}
                    error={(errors["location"]) ? true : false}
                    onChange={(event)=> handleLocation(event)}
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
              <TextField
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
              <TextField
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
                // getOptionLabel={(option) => option}
                getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === 'string') {
          return option;
        }
        // // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.courseName;
      }}
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
                  <TextField {...params} variant="outlined" label="Courses" placeholder="Select courses"
                    error={(errors['courses']?true:false)}
                    value={selectedCourses}
                    helperText={errors["courses"]}
                    required
                    style={{width: "100%"}}
                  />
              )}
            />
            {
              // selectedCourses.map((val, key)=>{
              //   // console.log(val.toLowerCase().includes("Mtech".toLowerCase()));
              //   if(val.courseName.toLowerCase().includes("Mtech".toLowerCase())){
              //     console.log("YES");
              //     return(
              //       <Grid key={key} item xs={12} sm={6} style={{marginTop: "20px"}}>
              //         <TextField
              //           label="Gate Score"
              //           value={gateScore}
              //           onChange={(event)=>setGateScore(event.target.value)}
              //           variant="outlined"
              //           fullWidth
              //         />
              //       </Grid>
              //     )
              //   }
              // })
            }
          </Grid>
          <Grid item xs={12} sm={6}>
          <TextField
            label="Salary Package"
            // className={classes.textField}
            value={salaryPackage}
            error={(errors["salaryPackage"]) ? true : false}
            onChange={(event)=>{
              handlePackage(event)}}
              helperText={errors["salaryPackage"]}
              variant="outlined"
              startadornment={<InputAdornment position="start">$</InputAdornment>}
              fullWidth
              required
            />
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
  <TextField
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
            disableToolbar
            variant="inline"
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
      Post Job
    </Button>
  </form>
</div>
</Grid>
</MuiPickersUtilsProvider>
)
}

export default UploadJob
