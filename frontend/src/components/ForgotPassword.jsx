import React, {useState} from 'react'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import clsx from 'clsx';

import axios from 'axios';
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
  paper: {
    marginTop: theme.spacing(8),
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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  margin: {
      margin: theme.spacing(1),
    },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: '100%',
    marginTop: theme.spacing(2)
  },
}));

export default function ForgotPassword() {
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [errors, setErrors] = useState({});


 const handleSubmit = async (event)=>{
   event.preventDefault();
   let tempErrors = {};
   if(username.length === 0){
     tempErrors["username"] = "Please enter the  username";
   }
   if(password.length === 0){
     tempErrors["password"] = "Please enter the password";
   }
   if(confPassword.length === 0){
     tempErrors["confPassword"] = "Please enter the confirm password";
   }
   if(password!== "" && confPassword !== "" && password !== confPassword){
     tempErrors["passErr"] = "Both the passwords should be same";
   }
   setErrors(tempErrors);
   console.log(tempErrors);
   if(Object.keys(tempErrors).length===0){
     const data = {
       username, password
     }
     const res = await axios.post('/api/sign_up',data, {withCredentials: true});
     const d = res.data;
     console.log(d);
     if(d.success){
       window.location.replace('/login');
     }
   }
 }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Forgot Password
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
              <TextField
                autoComplete="username"
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


        <TextField
              fullWidth
              margin="normal"
              label="Password"
              variant="outlined"
              value={password}
              error={errors["password"]?true:false}
              helperText={errors["password"]}
              onChange={(event)=>{setErrors({...errors, password:""});setPassword(event.target.value)}}
        />
<TextField
      label = "Confirm Password"
      fullWidth
      margin="normal"
      variant="outlined"
      value={confPassword}
      error={errors["confPassword"] || errors["passErr"]?true:false}
      helperText={errors["confPassword"] ||  errors["passErr"] }
      onChange={(event)=>{setErrors({...errors, confPassword:""});setConfPassword(event.target.value)}}
/>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Sign in?
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}
