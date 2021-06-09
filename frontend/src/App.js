import React, {useState} from 'react';
import axios from 'axios';
import AppContext from './components/AppContext';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import NavBar from './components/NavBar';
import UploadJob from './components/coordinator/UploadJob';
import MainForm from './components/student/register/MainForm.jsx';
import ViewJobs from './components/ViewJobs';
import ViewAllJobs from './components/ViewAllJobs';
import UploadImage from './components/Profile.jsx';
import UpdateProfile from './components/UpdateProfile';
import { ThemeProvider } from "@material-ui/core";
import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import Brightness3Icon from "@material-ui/icons/Brightness3";
import Brightness7Icon from "@material-ui/icons/Brightness7";
function App() {
  const [theme, setTheme] = useState(true);
  const [user, setUser] =useState(null);
  //After logout to be able to get the user again in Login we need to use
  //this variable to hit the backend again
  const [getUserAgain, setGetUserAgain] = useState(false);
  const icon = !theme ? <Brightness7Icon /> : <Brightness3Icon />;
  const appliedTheme = createMuiTheme(theme ? light : dark);

  React.useEffect(()=>{
    async function fetchUser() {
       const res = await axios.get('/api/decodedUser');
       const data = res.data;
       setUser(data.user);
     }
     fetchUser();
  }, [getUserAgain]);
  const userDetails = {
    user,
    setUser,
    getUserAgain,
    setGetUserAgain
  }
  return (
    <>
    <Router>
<AppContext.Provider value={userDetails}>
      <NavBar/>
      <Switch>
        <Route exact path="/register" component={Register}/>
        <Route exact path="/login" component={Login} />
        <Route exact path="/studentReg" component={MainForm} />
        <Route exact path="/updateProfile" component={UpdateProfile} />
        <Route exact path="/profile" render={(props) => <UploadImage type="pdf" {...props} />} />
        <Route exact path="/job" component={UploadJob} />
        <Route exact path="/view" component={ViewAllJobs} />
        <Route exact path="/viewJobs" render={(props) => <ViewJobs type="applied" {...props} />} />
      </Switch>
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
