import React from 'react'
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    // height: "100vh",
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
const SecondRegPage = (props) => {
  const classes = useStyles();
  const {handleChange} = props;
  const goNext = (e)=>{
    e.preventDefault();
    props.nextStep();
  }
  const goBack = (e)=>{
    e.preventDefault();
    props.prevStep();
  }
  return (
    <Grid container direction="column" justify="flex-start" alignItems="center">
    <div>
      <Typography variant="h4" className={classes.heading}>
          Academic Details
        </Typography>
    <form className={classes.form} noValidate autoComplete="off">
      <Grid container spacing={8}>
        <Grid item xs={12} sm={6}>
    <StyledInput
      required
      label="10th Standard CGPA"
      value={props.values.tenthCgpa}
      onChange={(event)=> handleChange("tenthCgpa", event)}
      variant="outlined"
      fullWidth
    />
    </Grid>
    <Grid item xs={12} sm={6}>
<StyledInput
  required
  label="12th CGPA"
  value={props.values.twelfthCgpa}
  onChange={(event)=> handleChange("twelfthCgpa", event)}
  variant="outlined"
  fullWidth
/>
</Grid>
<Button variant="contained" fullWidth color="primary"onClick={(e)=>goNext(e)}>Next</Button>
<Button style={{marginTop: "2%"}}variant="contained" fullWidth color="secondary"onClick={(e)=>goBack(e)}>Back</Button>
    </Grid>
    </form>

    </div>



    </Grid>
  )
}

export default SecondRegPage
