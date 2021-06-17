import React, {useState, useEffect} from 'react'
import axios from 'axios';
import url from '../../apiUrl';
import {withRouter} from 'react-router-dom';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
const ViewReports = (props) => {
  const [jobId, setJobId]= useState("");
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    firstname:  {checked: false, value: ""},
    lastname: {checked: false, value: ""},
    branchname: {checked: false, value: ""},
    email: {checked: false, value: ""},
    phone: {checked: false, value: ""},
    resume: {checked: false, value: ""},
    offerletter: {checked: false, value: ""}
  });

  useEffect(()=>{
    const id = props.location.state.jobID;
    if(id !== undefined){
      setJobId(id);
    }
  }, [props.location.state.jobID])
  const handleChange = (e)=>{
    setState({...state, [e.target.name]: {checked: e.target.checked, value: e.target.value}});
  }
const handleSubmit = async ()=>{
  const data = {
    jobId,
    firstName: state.firstname.value,
    lastName: state.lastname.value,
    email: state.email.value,
    phone: state.phone.value,
  }
  setLoading(true);
  const res = await axios.post('/job/report/', data);
  if(res.data.success){
    window.open(`${url}/job/download/${res.data.fileName}`);
  }
  setLoading(false);
}
  return (
    <div>
      <form noValidate>
      <FormGroup row>
      <FormControlLabel
        control={<Checkbox value="firstName" checked={state.firstname.checked} onChange={(e)=>handleChange(e)} name="firstname" />}
        label="First name"
      />
      <FormControlLabel
        control={<Checkbox value="lastName" checked={state.lastname.checked} onChange={(e)=>handleChange(e)} name="lastname" />}
        label="Last Name"
      />
      <FormControlLabel
        control={<Checkbox value="branchName" checked={state.branchname.checked} onChange={(e)=>handleChange(e)} name="branchname" />}
        label="Branch Name"
      />
      <FormControlLabel
        control={<Checkbox value="email" checked={state.email.checked} onChange={(e)=>handleChange(e)} name="email" />}
        label="Email"
      />
      <FormControlLabel
        control={<Checkbox value="phone" checked={state.phone.checked} onChange={(e)=>handleChange(e)} name="phone" />}
        label="Phone"
      />
      <FormControlLabel
        control={<Checkbox value="resume" checked={state.resume.checked} onChange={(e)=>handleChange(e)} name="resume" />}
        label="Resume"
      />
      <FormControlLabel
        control={<Checkbox value="offerLetter" checked={state.offerletter.checked} onChange={(e)=>handleChange(e)} name="offerletter" />}
        label="Offer Letter"
      />
      </FormGroup>
      {
        loading &&
        <p>Downloading..please wait!!</p>
      }
      <Button onClick={()=>handleSubmit()} variant="contained" color="primary" >Download</Button>
      </form>
    </div>
  )
}

export default withRouter(ViewReports);
