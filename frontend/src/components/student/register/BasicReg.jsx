import React from 'react'
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/AutoComplete';
import {createFilterOptions} from '@material-ui/lab';
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
    margin: theme.spacing(3),
    padding: theme.spacing(4)
  },
  heading:{
    textAlign: 'center',
    color: 'teal',
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
  const classes = useStyles();
  const [availableCourses, setAvailableCourses] = React.useState([]);
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
  const {handleChange, handleCourse} = props;
  const goNext = (e)=>{
    e.preventDefault();
    props.nextStep();
  }
  return (

<Grid container className={classes.root} direction="column" justify="space-around" alignItems="center">
    <div>  <Typography variant="h4" className={classes.heading}>
        Basic Details
      </Typography>
    <form className={classes.form} noValidate autoComplete="off">
<Grid container direction="row"
  justify="space-around"
  alignItems="center"
    spacing={6}>
<Grid item xs={12} sm={6}>
    <StyledInput
      required
      label="First Name"
      value={props.values.firstName}
      onChange={(event)=> handleChange("firstName", event)}
      variant="outlined"
    />
    </Grid>
    <Grid item xs={12} sm={6}>
<StyledInput
  required
  label="Last Name"
  value={props.values.lastName}
  onChange={(event)=> handleChange("lastName", event)}
  variant="outlined"
/>
</Grid>
<Grid item xs={12} sm={6}>
  <Autocomplete
    id="course"
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
        if(params.inputValue !== ''){
          filtered.push({
            inputValue: params.inputValue,
            courseName: `Add "${params.inputValue}"?`,
          });
        }

      }
      return filtered;
    }}
  selectOnFocus
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
      value={props.values.courseName}
      required
    />
)}
/>
</Grid>
<Grid item xs={12} sm={6}>
    <StyledInput
      required
      label="Number of semesters"
      value={props.values.semesters}
      onChange={(event)=> handleChange("semesters", event)}
      variant="outlined"
    />
    </Grid>
<Button color="primary" fullWidth variant="contained" onClick={(e)=>goNext(e)}>Next</Button>

</Grid>


    </form>

    </div>
</Grid>
  )
}

export default BasicReg;
