import React, {useState, useContext} from 'react'
import AppContext from '../../AppContext';
import {Redirect} from 'react-router-dom';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/AutoComplete';
import {createFilterOptions} from '@material-ui/lab';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';
import RemoveCircleOutlineTwoToneIcon from '@material-ui/icons/RemoveCircleOutlineTwoTone';
import AddCircleOutlineTwoToneIcon from '@material-ui/icons/AddCircleOutlineTwoTone';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '100%',
    },
  },
  form: {
    // width: '100%', // Fix IE 11 issue.
    // backgroundColor: theme.palette.secondary.main,
    margin: theme.spacing(3),
    padding: theme.spacing(4)
  },
  heading:{
    textAlign: 'center',
    color:
      theme.palette.type === 'light' ? theme.palette.grey[900] : theme.palette.grey[50],
    marginTop: '5%'
  },
  newTextField:{
  'div .inputBase-root':{
    borderColor: 'blue'
  }

  }
})
);
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
const filter = createFilterOptions();

const BasicReg = (props) => {
  const { user }= useContext(AppContext);
  // console.log("USERRRRR", user);
  const classes = useStyles();
  const [availableCourses, setAvailableCourses] = useState([]);


  interface CourseType {
    inputValue?: string;
    courseName: string;
  }
  React.useEffect(() => {
    async function fetchCourses() {
      const res = await axios.get('/job/getCourses');
      const data = res.data;
      setAvailableCourses(data.courses);
    }
    fetchCourses();

  }, [])

let courses1: CourseType[]= availableCourses;
const {gradesInputArray, handleChange, handleCourse, values, handleAddField, handleRemoveField, handleSemGrade, nextStep} = props.props;
const goNext = (e)=>{
  e.preventDefault();
  nextStep();
}


  return (
    //The user is logged in for the first time
    (user === null)
    ?
    (<p>Loading..</p>)
    :
    (user.details === undefined)
    ?
<Grid container className={classes.root} direction="column" justify="space-around" alignItems="center">
  <CssBaseline />
    <div>
      <Typography variant="h4" className={classes.heading}>
        Basic Details
      </Typography>
    <form className={classes.form} noValidate autoComplete="off">
<Grid container direction="row"
  justify="space-around"
  alignItems="center"
    spacing={6}>
<Grid item xs={12} sm={6}>
    <StyledInput
      autoFocus
      required
      label="First Name"
      value={values.firstName}
      onChange={(event)=> handleChange("firstName", event)}
      variant="outlined"
    />
    </Grid>
    <Grid item xs={12} sm={6}>
<StyledInput
  required
  label="Last Name"
  value={values.lastName}
  onChange={(event)=> handleChange("lastName", event)}
  variant="outlined"
/>
</Grid>
<Grid item xs={12} sm={6}>
    <StyledInput
      required
      label="Branch Name"
      value={values.branchName}
      onChange={(event)=> handleChange("branchName", event)}
      variant="outlined"
    />
    </Grid>
    <Grid item xs={12} sm={6}>
    <FormControl component="fieldset">
         <FormLabel component="legend">Gender</FormLabel>
         <RadioGroup aria-label="gender" name="gender1" value={values.gender} onChange={(event)=>handleChange("gender", event)}>
           <FormControlLabel value="female" control={<Radio />} label="Female" />
           <FormControlLabel value="male" control={<Radio />} label="Male" />
           <FormControlLabel value="other" control={<Radio />} label="Other" />
         </RadioGroup>
       </FormControl>
     </Grid>
<Grid item xs={12} sm={6}>
  <Autocomplete
    id="course"
    options={courses1}
    value={values.courseName}
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
        if(params.inputValue !== ''){
          filtered.push({
            inputValue: params.inputValue,
            courseName: `Add "${params.inputValue}"?`,
          });
        }

      }
      return filtered;
    }}

  clearOnBlur
  handleHomeEndKeys
  getOptionLabel={(option) => {
    // Value selected with enter, right from the input
    if (typeof option === 'string') {
      return option;
    }
    // Add "xxx" option created dynamically
    if (option.inputValue) {
      return option.inputValue;
    }
    // Regular option
    return option.courseName;
  }}
  onChange={(event, newValue) => {
      handleCourse(event, newValue);
  }}
  renderOption={(option) => option.courseName}

  renderInput={(params) => (
    <StyledInput {...params} variant="outlined" label="Course" placeholder="Select your course"
      value={values.courseName}
      required
    />
)}
/>
</Grid>
<Grid item xs={12} sm={6}>
    <StyledInput
      required
      type="number"
      label="Number of semesters"
      value={values.semesters}
      onChange={(event)=> handleChange("semesters", event)}
      variant="outlined"
    />
    </Grid>

    <Grid item xs={12} sm={6}>
        <StyledInput
          required
          type="email"
          label="Enter your email"
          placeholder="EMAIL"
          value={values.email}
          onChange={(event)=> handleChange("email", event)}
          variant="outlined"
        />
        </Grid>

        <Grid item xs={12} sm={6}>
            <StyledInput
              required
              type="phone"
              label="Enter your phone number"
              value={values.phone}
              onChange={(event)=> handleChange("phone", event)}
              variant="outlined"
            />
            </Grid>
{
  gradesInputArray.length === 0 &&
  <div>

    <Typography variant="h6">Add field to enter grades for each sem? <span><IconButton onClick={()=>handleAddField()}><AddCircleOutlineTwoToneIcon /></IconButton></span></Typography>
  </div>
}
{
  gradesInputArray.map((val, key)=>{
      return (
        <div key={key}>

        <StyledInput
          name="grade"
          required
          value={val.grade}
          type="number"
          label={"Enter Grade for SEM " + (key+1)}
          variant="outlined"
          onChange= {(event)=>handleSemGrade(event, key)}
        />
      <IconButton onClick={()=>handleAddField()}><AddCircleOutlineTwoToneIcon /></IconButton>
      <IconButton onClick={(event)=>handleRemoveField(key)}><RemoveCircleOutlineTwoToneIcon/></IconButton>

      </div>
      )
    })
}
<Button color="primary" fullWidth variant="contained" onClick={(e)=>goNext(e)}>Next</Button>

</Grid>

    </form>

    </div>
</Grid>
:
<Redirect to="/view"/>
)
}

export default BasicReg;
