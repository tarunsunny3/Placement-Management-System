import React from 'react';
import axios from 'axios';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import NavBar from './components/NavBar';
import UploadJob from './components/coordinator/UploadJob';
import MainForm from './components/student/register/MainForm.jsx';
import ViewJobs from './components/ViewJobs';
import UploadImage from './components/Profile.jsx';
import UpdateProfile from './components/UpdateProfile';
import { ThemeProvider } from "@material-ui/core";
import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import Brightness3Icon from "@material-ui/icons/Brightness3";
import Brightness7Icon from "@material-ui/icons/Brightness7";

function App() {
  const [theme, setTheme] = React.useState(true);
  const [user, setUser] = React.useState(null);
  const icon = !theme ? <Brightness7Icon /> : <Brightness3Icon />;
  const appliedTheme = createMuiTheme(theme ? light : dark);

  React.useEffect(()=>{
    async function fetchUser() {
       const res = await axios.get('/api/decodedUser');
       const data = res.data;
       setUser(data.user);
     }
     fetchUser();
  }, []);
  return (
    <>
    <NavBar user={user}/>
    <Router>
      <Switch>
        <Route exact path="/register" component={Register}/>
        <Route exact path="/login" component={Login} />
        <Route exact path="/studentReg" component={MainForm} />
        <Route exact path="/updateProfile" component={UpdateProfile} />
        <Route exact path="/profile" render={(props) => <UploadImage type="pdf" {...props} />} />
        <Route exact path="/job" component={UploadJob} />
      <Route exact path="/viewJobs" render={(props) => <ViewJobs user={user} type="default" {...props} />} />
      </Switch>
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
