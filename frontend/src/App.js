import React, {useState, useEffect} from 'react';
import axios from 'axios';
import AppContext from './components/AppContext';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Register from './components/Register';
import NavBar from './components/NavBar';
import UploadJob from './components/coordinator/UploadJob';
import MainForm from './components/student/register/MainForm';
import ViewJobs from './components/ViewJobs';
import ViewAllJobs from './components/ViewAllJobs';
import UploadFile from './components/UploadFile';
import ForgotPassword from './components/ForgotPassword';
import ViewReports from './components/coordinator/ViewReports';
import ViewProfile from './components/student/ViewProfile';
import Unauthorized from './components/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';
import { makeStyles } from "@material-ui/core/styles";
import { createTheme } from '@material-ui/core';
import Brightness3Icon from "@material-ui/icons/Brightness3";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import Visualization from './components/coordinator/Visualization';
import Footer from './components/footer/Footer';
import Scroll from './components/Scroll';



function App() {
  const [theme, setTheme] = useState(true);
  const [user, setUser] = useState({});
  //After logout to be able to get the user again in Login we need to use
  //this variable to hit the backend again
  const [loggedIn, setLoggedIn] = useState(false);
  const icon = !theme ? <Brightness7Icon /> : <Brightness3Icon />;
  const appliedTheme = createTheme(theme ? light : dark);

 
  useEffect(()=>{
    
    async function fetchUser() {
       const res = await axios.get('/api/decodedUser');
       const data = res.data;
       console.log("Data is ", data);
       setUser(data.user);
     }
     fetchUser();
  }, [loggedIn]);
  const userDetails = {
    user,
    setUser,
    loggedIn,
    setLoggedIn
  }
  return (
    <>
    <Router>
<AppContext.Provider value={userDetails}>
      <NavBar/>
      <Scroll showBelow={500} />
      <Switch>
        <Route exact path="/" component={HomePage}/>
        <Route exact path="/register" component={Register}/>
        <Route exact path="/login" component={Login} />
        <Route exact path="/forgotPass" component={ForgotPassword} />
        <Route exact path="/visualize" component={Visualization}/>
        <ProtectedRoute role="Student" exact path="/studentReg/:type" component={MainForm} />
        <ProtectedRoute role="both" exact path="/profile" component={ViewProfile} />
        <Route exact path="/file" render={(props) => <UploadFile type="doc" {...props} />} />
        <ProtectedRoute exact path="/job" role="Coordinator" component={UploadJob} />
        <ProtectedRoute exact path="/view" role="both" component={ViewAllJobs} />
        <ProtectedRoute path="/viewReports" role="Coordinator" component={ViewReports} />
        <ProtectedRoute exact path="/viewJobs" render={(props) => <ViewJobs type="applied" {...props} />} />
        <Route exact path="/unauthorized" component={Unauthorized}/>
      </Switch>
      <Footer/>
</AppContext.Provider>
    </Router>
    </>
  );
}
export const light = {
  palette: {
    type: "light"
  }
};
export const dark = {
  palette: {
    type: "dark"
  }
};
export default App;
