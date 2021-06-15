import React, {useState, useEffect} from 'react'
import axios from 'axios';
import AppContext from './AppContext';
import ViewJobs from './ViewJobs';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import Autocomplete  from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Checkbox from '@material-ui/core/Checkbox';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: "100vh"
  },
  enabled:{
    backgroundColor: "green",
    color: "white"
  },
  disabled:{
    backgroundColor: "#A9A9A9",
    color: "black"
  },
  company:{
    marginTop: "5%",
    marginLeft: "5%",
    marginBottom: "5%"
  },
  form: {
    width: '80%', // Fix IE 11 issue.
    margin: theme.spacing(3),
    padding: theme.spacing(4)
  },
  paper:{
    background: '#EAE2B6',
    color: 'black'
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
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const ViewAllJobs = () => {
  const classes = useStyles();
  const enabled = classes.enabled, disabled = classes.disabled;
  const {user} = React.useContext(AppContext);
  const [type, setType] = useState(undefined);
  const [class1, setClass1] = useState(enabled);
  const [class2, setClass2] = useState(disabled);
  const [availableCompanies, setCompanies] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [company, setCompany] = useState("");
  const [courses, setCourses] = useState([]);
  const [dumCourses, setDumcourse] = useState([]);
  const [filter, setFilter] = useState({});
  const [open, setOpen] = useState(false);
  const [days, setDays] = useState("1");
  useEffect(() => {
    async function fetchCompanyNames() {
      let response = await axios.get('/job/getCompanyNames');
      setCompanies(response.data.companyNames);
    }
    fetchCompanyNames();
  }, [])
  useEffect(() => {
    async function fetchCourses() {
      const res = await axios.get('/job/getCourses');
      const data = res.data;
      setAvailableCourses(data.courses);
    }
    fetchCourses();
  }, [])

  const handleClick = (type)=>{
    setType(type);
    if(type==="default" || type==="open"){
      setClass1(enabled);
      setClass2(disabled);
    }
    if(type==="closed" || type==="applied"){
      setClass1(disabled);
      setClass2(enabled);
    }
  }
  const handleCompany=(value)=>{
    setCompany(value);
  }
  const handleCourses = (newValue)=>{
    let courses = [];
    if(newValue.length > 0){
      newValue.map((val)=>courses.push(val.courseName));
    }
    setDumcourse(newValue);
    setCourses(courses);
  }
  const handleDaysFilter = (e)=>{
    setDays(e.target.value);
  }
  const handleFilterForm = (e)=>{
    e.preventDefault();
    setOpen(!open);
    setFilter({"courses": courses, "company": company});
  }
  return (

    <div className={classes.root}>
        <Button onClick={()=>setOpen(!open)}>Show Filter Options</Button>
      <Drawer variant="temporary" classes={{paper: classes.paper}} anchor='left' open={open} onClose={()=>setOpen(false)}>
        <h1 style={{textAlign: "center"}}>Filter Options</h1>

      <Grid container direction="column" justify="flex-start" alignItems="center">

          <CssBaseline />
      <form onSubmit={(e)=>handleFilterForm(e)} noValidate className={classes.form}>

      <Grid container spacing={8}>
        <Grid item xs={12} sm={12}>
          <Autocomplete
            id="free-solo-demo"
            freeSolo
            options={availableCompanies.map((option) => option)}
            value={company}
            onChange={(event, value)=>handleCompany(value)}
            style={{width: "100%"}}
            renderInput={(params) => (
              // <StyledInput {...params} label="freeSolo" margin="normal" variant="outlined" />
              <StyledInput
                style={{width: "100%"}}
                {...params}
                label="Company name"
                variant="outlined"
                fullWidth
                required
                />
            )}
          />
        </Grid>
        {
          user != null && user.role !== "Student"
          &&
        <Grid item xs={12} sm={12}>
          <Autocomplete
            multiple
            id="checkboxes-tags-demo"
            options={availableCourses}
            freeSolo
            value={dumCourses}
            getOptionSelected={(option, value) => value.courseName === option.courseName}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          disableCloseOnSelect
          getOptionLabel={(option) => {
             return option.courseName;
            }
          }
          onChange={(event, newValue) => handleCourses(newValue)}
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
              />
          )}
        />
      </Grid>
    }
      </Grid>
      <FormControl style={{marginTop: "10%"}}component="fieldset">
  <FormLabel component="legend">Filter by days</FormLabel>
  <RadioGroup name="gender1" value={days} onChange={(e)=>handleDaysFilter(e)}>
    <FormControlLabel value="1" control={<Radio />} label="Last 1 day" />
    <FormControlLabel value="week" control={<Radio />} label="Last Week" />
    <FormControlLabel value="month" control={<Radio />} label="Last month" />
    <FormControlLabel value="year"  control={<Radio />} label="Last Year" />
  </RadioGroup>
</FormControl>

      <Button style={{width: "50%",marginLeft: "20%", marginTop: "5%"}}  variant="contained" color="primary" type="submit">Filter</Button>
        </form>
</Grid>
  </Drawer>
      {
        user != null && user.role === "Student"
        ?
        <ButtonGroup fullWidth={true} variant="contained" aria-label="contained primary button group">
          <Button variant="contained" className={class1} onClick={()=>handleClick("default")} >Unapplied Jobs</Button>
        <Button variant="contained" className={class2} onClick={()=>handleClick("applied")} >Applied Jobs</Button>
        </ButtonGroup>
        :
        <ButtonGroup fullWidth={true} variant="contained" aria-label="contained primary button group">
          <Button variant="contained" className={class1} onClick={()=>handleClick("open")} >Open Jobs</Button>
        <Button variant="contained" className={class2} onClick={()=>handleClick("closed")} >Closed Jobs</Button>
        </ButtonGroup>
      }

      {
        user != null && user.role === "Student"
        ?
        (
          type==="default" || type===undefined
            ?
            <ViewJobs key={1} type="default" filter={filter}/>
            :
            <ViewJobs key={2} type="applied" filter={filter}/>
        )
        :
        (
          type==="open" || type === undefined
            ?
              <ViewJobs key={3} type="open" filter={filter}/>
            :
              <ViewJobs key={4} type="close" filter={filter}/>
        )

      }

    </div>
  )
}

export default ViewAllJobs
