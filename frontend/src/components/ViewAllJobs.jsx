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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import Chip from '@material-ui/core/Chip';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider,KeyboardDatePicker} from '@material-ui/pickers';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    // height: "100vh",
    // backgroundImage: `url(${bg})`,
    // backgroundRepeat: "no-repeat",
    // backgroundSize: "cover"
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  searchBar:{
    
    [theme.breakpoints.down("xs")]:{
      marginLeft: "2%",
      marginTop: "2%",
      width: "85%",
    },
    [theme.breakpoints.up("md")]:{
      marginLeft: "5%",
      marginTop: "2%",
      width: "70%"
    },
  },
  filterButton:{
    marginLeft: "2%",
    marginTop: "2%"
  },
  enabled:{
    '&':{
      backgroundColor: "green",
      color: "white"
    },
    '&:focus':{
      backgroundColor: "green",
      color: "white"
    }

  },
  disabled:{
    '&':{
      backgroundColor: "#A9A9A9",
      color: "black"
    }

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
    color: 'black',
    [theme.breakpoints.down('md')]:{
        width: "90vw"
    }
  },
  course:{
    '& .MuiChip-root':{
      backgroundColor: '#FFC074'
    }
  },
  chip: {
    margin: theme.spacing(0.5),
  },
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
  const [jobType, setJobType] = useState("");
  const [fullTime, setFulltime] = useState(false);
  const [intern, setIntern] = useState(false);
  const [dumCourses, setDumcourse] = useState([]);
  const [filter, setFilter] = useState({});
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [search, setSearch] = useState("");
  const [showChips, setShowChips] = useState(false);
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
  useEffect(() => {
    if(startDate === null && endDate===null && intern === false && fullTime===false){
      setShowChips(false);
    }
  }, [startDate, endDate, intern, fullTime]);
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
  const handleJobType = (e)=>{
    setJobType(e.target.value);
  }
  const handleDate = (type, date)=>{
    if(type==="start"){
      setStartDate(date);
    }else if(type==="end"){
      setEndDate(date);
    }
  }
  const handleFilterForm = (e)=>{
    e.preventDefault();
    setOpen(!open);
    setFilter({courses, company, fullTime, intern, startDate, endDate, searchKeyword: search});
  }
  const getSearchResults = (searchParam)=>{
    if(searchParam === undefined){
      setFilter({searchKeyword: search});
    }else{
      setFilter({searchKeyword: ""});
    }
  }
  const handleClearall= (event)=>{
    setShowChips(false);
    setOpen(!open)
    setFulltime(false);
    setIntern(false);
    setStartDate(null);
    setEndDate(null);
    setCourses([]);
    setDumcourse([]);
    setFilter(setFilter({courses: [], company: "", fullTime: false, intern: false, startDate: null, endDate: null, searchKeyword: ""}));
  }
  return (

    <div className={classes.root}>
       
      <Drawer variant="temporary" classes={{paper: classes.paper}} anchor='left' open={open} onClose={()=>setOpen(false)}>
        <h1 style={{textAlign: "center"}}>Filter Options <span style={{float: "right", paddingRight: "10%"}} onClick={()=>setOpen(false)}><CloseIcon/></span></h1>

      <Grid container direction="column" justify="flex-start" alignItems="center">

          <CssBaseline />
      <form onSubmit={(e)=>handleFilterForm(e)} noValidate className={classes.form}>

      <Grid container spacing={8}>
        {/* <Grid item xs={12} sm={12}>
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
        </Grid> */}
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
            className={classes.course}
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
                style={{width: "100%"}}
              />
          )}
        />
      </Grid>
    }
      </Grid>

<MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justify="space-around">
        <KeyboardDatePicker
          format="dd/MM/yyyy"
          margin="normal"
          id="start"
          label="Start Date"
          placeholder="Select start date"
          value={startDate}
          onChange={(date)=>handleDate("start", date)}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
    </Grid>
    <Grid container justify="space-around">
      <KeyboardDatePicker
        format="dd/MM/yyyy"
        margin="normal"
        id="end"
        label="End Date"
        value={endDate}
        onChange={(date)=>handleDate("end", date)}
        KeyboardButtonProps={{
          'aria-label': 'change date',
        }}
      />
  </Grid>

  </MuiPickersUtilsProvider>
  <FormGroup row>
      <FormControlLabel
        control={
          <Switch
            checked={fullTime}
            onChange={(event)=>setFulltime(event.target.checked)}
            color="primary"
            name="fulltime"
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
        }
        label="Full-Time"
/>
<FormControlLabel
        control={
          <Switch
            checked={intern}
            onChange={(event)=>setIntern(event.target.checked)}
            color="primary"
            name="intern"
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
        }
        label="Internship"
/>
</FormGroup>
{/* <FormControl style={{marginTop: "10%"}}component="fieldset">
<FormLabel component="legend">Job Type</FormLabel>
<RadioGroup name="gender1" value={jobType} onChange={(e)=>handleJobType(e)}>
<FormControlLabel value="full" control={<Radio />} label="Full Time" />
<FormControlLabel value="intern"  control={<Radio />} label="Internship" />
</RadioGroup>
</FormControl> */}

<Grid style={{marginTop: "3%"}} container spacing={2}>
  <Grid item xs={12} sm={6}>
    <Button  variant="contained" fullWidth color="primary" onClick={()=>setShowChips(true)} type="submit">Apply</Button>
    {/* style={{width: "40%", marginTop: "5%", marginRight: "10%"}}  */}
  </Grid>
  <Grid item xs={12} sm={6}>
  <Button variant="contained" fullWidth color="secondary" onClick={(event)=>handleClearall(event)}>Clear all</Button>
  </Grid>
</Grid>


</form>

</Grid>
  </Drawer>
  
      {
        
        user != null && user.role === "Student"
        ?
        <>

        <ButtonGroup fullWidth={true} variant="contained" aria-label="contained primary button group">
          <Button variant="contained" className={class1} onClick={()=>handleClick("default")} >Unapplied Jobs</Button>
          <Button variant="contained" className={class2} onClick={()=>handleClick("applied")} >Applied Jobs</Button>

        </ButtonGroup>
        </>
        :
        <>
        <ButtonGroup fullWidth={true} variant="contained" aria-label="contained primary button group">
          <Button variant="contained" className={class1} onClick={()=>handleClick("open")} >Open Jobs</Button>
          <Button variant="contained" className={class2} onClick={()=>handleClick("closed")} >Closed Jobs</Button>
        </ButtonGroup>
        </>
      }
      
      <Button className={classes.filterButton} variant="contained" color="secondary" onClick={()=>setOpen(!open)}><span><i className="fas fa-filter fa-2x"></i></span></Button>
  
      
        <StyledInput 
        className={classes.searchBar}
        color="primary"
        placeholder="Search for company name, position, description, location, etc"
        onChange={(event)=>{
          if(event.target.value.length === 0){
            getSearchResults("");
          }
          setSearch(event.target.value);
        }
        }
        value={search}
        inputProps={{ 'aria-label': 'search' }}
        onKeyPress={(key)=>{
          if(key.code==='Enter'){
            getSearchResults();
          }
        }}>
          
        </StyledInput>
        <IconButton onClick={()=>getSearchResults()} type="submit" style={{marginTop: "2%"}} aria-label="search">
        <SearchIcon />
      </IconButton>
      <div style={{textAlign: "center", marginTop: "2%"}}>
      {
    showChips &&
    <>
  {
    fullTime && <Chip className={classes.chip} label="Full-time" onDelete={()=>{setFulltime(false);setFilter({...filter, fullTime: false})}} color="primary" />
  }
   {
    intern && <Chip className={classes.chip} label="Internship" onDelete={()=>{setIntern(false);setFilter({...filter, intern: false})}} color="primary" />
  }
  {
    startDate !== null && <Chip  className={classes.chip} label={`start-date: ${new Date(startDate).getDate()} - ${new Date(startDate).getMonth()} - ${new Date(startDate).getFullYear()}`} onDelete={()=>{setStartDate(null);setFilter({...filter, startDate: null})}} color="primary" />
}
{
    endDate !== null && <Chip  className={classes.chip} label={`end-date: ${new Date(endDate).getDate()} - ${new Date(endDate).getMonth()} - ${new Date(endDate).getFullYear()}`} onDelete={()=>{setEndDate(null);;setFilter({...filter, endDate: null})}} color="primary" />
  }
  </>
  }
    </div>    
      {
        user != null && user.role === "Student"
        ?
        (
          type==="default" || type===undefined
            ?
            <>
              <ViewJobs key={1} type="default" filter={filter}/>
            </>
            :
            <>
              <ViewJobs key={2} type="applied" filter={filter}/>
            </>
        )
        :
        (
          type==="open" || type === undefined
            ?
            <>
              <ViewJobs key={3} type="open" filter={filter}/>
            </>
            :
            <>
              <ViewJobs key={4} type="close" filter={filter}/>
            </>
        )

      }
    </div>
  )
}

export default ViewAllJobs
