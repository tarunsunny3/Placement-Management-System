import React from 'react'
import AppContext from '../../AppContext';
import UploadImage from '../../Profile';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
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
    // padding: theme.spacing(4)
  },
  heading:{
    textAlign: 'center',
    color: 'teal',
    marginTop: '5%'
  },
  fileForm:{
    margin: theme.spacing(3),
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
const SecondRegPage = (props) => {
  const {user} = React.useContext(AppContext);
  const {values } = props;
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  let spacing;
  if(isMobile){
    spacing = 4;
  }else{
    spacing = 8;
  }
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
    <form className={classes.form} noValidate autoComplete="on">
      <Grid container spacing={spacing}>
        <Grid item xs={12} sm={6}>
    <StyledInput
      required
      value={props.values.tenthCgpa}
      onChange={(event)=> handleChange("tenthCgpa", event)}
      variant="outlined"
      label="10th Standard CGPA"
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
</Grid>
{
  values.courseName.toLowerCase().includes("Mtech".toLowerCase()) &&
(<div>
  <Grid container spacing={spacing}>
    <Grid item xs={12} sm={12}>
    <StyledInput
    required
    label="Gate Score"
    value={props.values.gateScore}
    onChange={(event)=> handleChange("gateScore", event)}
    variant="outlined"
    fullWidth
    />
</Grid>
</Grid>
</div>)
}

<Grid container spacing={spacing}>
  <Grid item xs={12} sm={6}>
    <StyledInput
    required
    label="UG Percentage"
    value={props.values.ug}
    onChange={(event)=> handleChange("ug", event)}
    variant="outlined"
    fullWidth
    />
</Grid>
<Grid item xs={12} sm={6}>
  <StyledInput
  required
  label="PG Percentage"
  value={props.values.pg}
  onChange={(event)=> handleChange("pg", event)}
  variant="outlined"
  fullWidth
  />
</Grid>
</Grid>
    </form>
    <div className={classes.form}>
    <Grid container spacing={spacing}>
      <Grid item xs={12} sm={6}>
<UploadImage {...props} type="image"/>
</Grid>
<Grid item xs={12} sm={6}>
<UploadImage {...props}  type="pdf"/>
</Grid>
</Grid>
<Button style={{marginTop: "4%"}}variant="contained" fullWidth color="primary"onClick={(e)=>goNext(e)}>Next</Button>
<Button style={{marginTop: "2%"}}variant="contained" fullWidth color="secondary"onClick={(e)=>goBack(e)}>Back</Button>
</div>

    </div>



    </Grid>
  )
}

export default SecondRegPage
