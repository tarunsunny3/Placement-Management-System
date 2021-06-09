import React, {useState} from 'react'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles, withStyles } from '@material-ui/core/styles';
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
const ThirdRegPage = (props) => {
  const {values } = props;
  const classes = useStyles();
  const [numbFields, setNumbFields] = useState("");
  return (
    <div style={{marginTop: "3%"}}>
      
      <Button onClick={(e)=>props.handleSubmit(e)} variant="contained" color="primary">Submit</Button>
    </div>
  )
}

export default ThirdRegPage
