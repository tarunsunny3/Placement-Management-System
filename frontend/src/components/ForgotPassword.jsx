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

export default function ForgotPassword(props) {
  const classes = useStyles();
  const state = props.location.state;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [otp, setOTP] = useState("");
  const [enteredOTP, setEnteredOTP] = useState("");
  const [errors, setErrors] = useState({});
  //The initial render of this page will be enter email and then sending the mail
  const [type, setType] = useState("forgotPassword");
  React.useEffect(()=>{
    console.log("YES");
    if(state !== undefined && state.type !== undefined){
      if(state === "otp"){
        setType("otp");
      }
    }
  }, []);

 const handleSubmit = async (event)=>{
   event.preventDefault();
   let tempErrors = {};
   //If the type is fogotPassword then we are in the email verification phase
   if(type==="forgotPassword"){
     if(username.length === 0){
       tempErrors["username"] = "Please enter the  username";
     }
     if(email.length === 0){
       tempErrors["email"] = "Please enter the  email";
     }
     setErrors(tempErrors);
     console.log(tempErrors);
     if(Object.keys(tempErrors).length===0){
       const res = await axios.post("/api/sendEmail", {email});
       if(!res.data.success){
         alert("Couldn't process the request, Please try again later");
       }else{
         setOTP(res.data.otp);
         setType("otp");
         // window.location.replace("/forgotPass", {type: "otp"});
       }
     }
   }else{
     //Now We need to change the password
     if(otp !== Number(enteredOTP)){
       alert("Entered OTP is incorrect");
     }else{
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
         const res = await axios.post("/api/changePassword", {newPassword: password, username});
         if(!res.data.success){
           alert(res.data.message);
         }else{
           props.history.push("/login");
         }
       }
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
          {
            type==="forgotPassword" &&
            <>
            <TextField
              margin="normal"
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
              helperText={errors["username"] || ""}
              onChange={(event)=>{setErrors({...errors, username:""});
              setUsername(event.target.value)}}
            />
            <TextField
              margin="normal"
              autoComplete="email"
              name="email"
              variant="outlined"
              required
              fullWidth
              id="email"
              label="Email"
              autoFocus
              value={email}
              error={(errors["email"]) ? true : false}
              helperText={errors["email"]}
              onChange={(event)=>{setErrors({...errors, email:""});
              setEmail(event.target.value)}}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
            Send email
            </Button>
            </>
          }

            {


            type==="otp" &&
<>
<TextField
      fullWidth
      margin="normal"
      label="OTP"
      variant="outlined"
      value={enteredOTP}
      error={errors["otp"]?true:false}
      helperText={errors["otp"] || ""}
      onChange={(event)=>{setErrors({...errors, otp:""});
      setEnteredOTP(event.target.value)}}
/>
        <TextField
              fullWidth
              margin="normal"
              label="Password"
              variant="outlined"
              value={password}
              type="password"
              error={errors["password"]?true:false}
              helperText={errors["password"]}
              onChange={(event)=>{setErrors({...errors, password:""});
              setPassword(event.target.value)}}
        />
      <TextField
          label = "Confirm Password"
          fullWidth
          margin="normal"
          variant="outlined"
          type="password"
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
      Change Password
      </Button>
</>
}

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
