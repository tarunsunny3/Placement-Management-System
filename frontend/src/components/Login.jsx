import React, {useState} from 'react';
import url from '../apiUrl.js';
import {Redirect} from 'react-router-dom'
import welcomeImage from './welcome.png';
import axios from 'axios';
import {withRouter} from 'react-router-dom';
import AppContext from './AppContext';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import clsx from 'clsx';
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="/">
      Tarun
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    // backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundImage: `url(${welcomeImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'contain',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  textField: {
    width: '100%',
    marginTop: theme.spacing(2)
  },
}));

const  Login = (props) => {
  const {history} = props;
  const {setLoggedIn} = React.useContext(AppContext);
  const classes = useStyles();
  const [username, setUsername] = useState("18mcme14");
  const [password, setPassword] = useState("9603877545");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(false);
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({message: "", type: ""});
  const handleClickShowPassword = () => {
   setShowPassword(!showPassword);
 };

 const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
   event.preventDefault();
 };

 const handleSubmit = async (event)=>{
   event.preventDefault();
   let tempErrors = {};
   if(username.length === 0){
     tempErrors["username"] = "Please enter the username";
   }
   if(password.length === 0){
     tempErrors["password"] = "Please enter the password";
   }
   setErrors(tempErrors);
   if(Object.keys(tempErrors).length===0){
     const data = {
       username, password
     }
     const res = await axios.post(`${url}/api/sign_in`,data, {withCredentials: true});
     const d = res.data;
     console.log(d);

     if(d.success){
       setLoggedIn(true);
       if(d.result.role==="Student"){
         if(d.reg){
           history.push('/studentReg');
         }else{
            history.push('/view');
         }
       }else if(d.result.role==="Coordinator"){
         history.push('/view');
        }
     }else{
       setAlert(true);
       setOpen(true);
       setMessage({"message": d.message, "type": "error"});
       // console.log(d.message);
     }
   }
 }
 const showAlert = ()=>{
   if(alert){

   return(
     <Collapse className={classes.alert} in={open}>
     <Alert
       severity={message.type}
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
         {message.message}
       </Alert>
     </Collapse>)}

}
  return (


  loading ?

  <Backdrop  open={loading} onClick={()=>setLoading(false)}>
    <p style={{fontSize: 50}}>Logging in</p> <CircularProgress style={{marginLeft: "2%"}} color="inherit" />
</Backdrop>
:
  // user==null || user.id == null
  // ?
  <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>

          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            {showAlert()}
            <TextField
              autoComplete="username"
              margin="normal"
              name="username"
              variant="outlined"
              required
              fullWidth
              id="username"
              label="Username"
              autoFocus
              value={username}
              error={(errors["username"]) ? true : false}
              helperText={errors["username"]}
              onChange={(event)=>{setErrors({...errors, username:""});setUsername(event.target.value)}}
            />

            <FormControl  className={clsx(classes.textField)}  variant="outlined">
          <InputLabel   error={errors["password"]?true:false} required htmlFor="outlined-adornment-password" >Password</InputLabel>
        <OutlinedInput
              variant="outlined"
              id="standard-adornment-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              error={errors["password"]?true:false}
              onChange={(event)=>{setErrors({...errors, password:""});setPassword(event.target.value)}}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>

              }
                labelWidth={85}
            />
          <FormHelperText style={{color: 'red'}}>{errors["password"]}</FormHelperText>
              </FormControl>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link style={{cursor: "pointer"}} onClick={()=>history.push("/register")} variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
    // :
    // (
    //   user.role==="Student"
    //   ?
    //   <Redirect to="/studentReg"/>
    //   :
    //   <Redirect to="/view"/>
    // )
  );
}
export default withRouter(Login);
