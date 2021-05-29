import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import NavBar from './components/NavBar';
import UploadJob from './components/coordinator/UploadJob';
import MainForm from './components/student/register/MainForm.jsx';
import ViewJobs from './components/ViewJobs';
function App() {
  return (
    <div>
    <NavBar />
    <Router>
      <Switch>
        <Route exact path="/register" component={Register}/>
        <Route exact path="/login" component={Login} />
        <Route exact path="/studentReg" component={MainForm} />
        <Route exact path="/job" component={UploadJob} />
      <Route exact path="/viewJobs" component={ViewJobs} />
      </Switch>
    </Router>
    </div>
  );
}

export default App;
