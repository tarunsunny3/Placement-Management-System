import React, {useState, useEffect} from 'react'
import axios from 'axios';
import url from '../../apiUrl';
import LinearProgressWithLabel from '../LinearProgressWithLabel';
import {withRouter, Link} from 'react-router-dom';
import { DataGrid } from '@material-ui/data-grid';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import Autocomplete  from '@material-ui/lab/Autocomplete';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import { DatePicker } from "@material-ui/pickers";
import ReactExport from "react-data-export";
import Tooltip from '@material-ui/core/Tooltip';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: "100vh"
  },
  enabled:{
    '&':{
      backgroundColor: "green",
      color: "white"
    }

  },
  disabled:{
    '&':{
      backgroundColor: "#A9A9A9",
      color: "black"
    }

  },
  company:{
    marginTop: "5%",
    marginLeft: "5%",
    marginBottom: "5%"
  },
  form: {
    width: '80%', // Fix IE 11 issue.
    margin: theme.spacing(3),
    padding: theme.spacing(4)
  },
  paper:{
    background: '#EAE2B6',
    color: 'black',
    [theme.breakpoints.down('md')]:{
        width: "90vw"
    }
  },
  course:{
    '& .MuiChip-root':{
      backgroundColor: '#FFC074'
    }
  },
  options:{
    display: "flex",
    // justifyItems: "center  ",
    alignItems: "center",
    justifyContent: "space-around"
  },
}));
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
const ViewReports = (props) => {

  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    firstName:  {checked: false, value: ""},
    lastName: {checked: false, value: ""},
    branchName: {checked: false, value: ""},
    gender: {checked: false, value: ""},
    email: {checked: false, value: ""},
    phone: {checked: false, value: ""},
    resume: {checked: false, value: ""},
    offerLetter: {checked: false, value: ""},
    ugPercentage: {checked: false, value: ""},
    pgPercentage: {checked: false, value: ""},
    tenthCgpa: {checked: false, value: ""},
    twelfthCgpa: {checked: false, value: ""}
  });
  const [downloadEnable, setDownloadEnable] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [availableCompanies, setCompanies] = useState([]);
  const [company, setCompany] = useState("");
  const [availableCourses, setAvailableCourses] = useState([]);
  const [course, setCourse] = useState("");
  const [resultJobs, setJobs] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [year, setYear] = useState(new Date());
  const [downloadCount, setDownloadCount] = useState(0);
  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'open', headerName: 'Status', type: 'boolean', width: 200 },
    { field: 'companyName', headerName: 'Company Name', width: 200 },
    { field: 'location', headerName: 'Location', width: 200 },
    { field: 'salaryPackage', headerName: 'Salary Package', width: 200, type: 'number' },
    { field: 'jobType', headerName: 'Job Type', width: 200 },

  ];
  const DataSet = [
    {
      columns:[
        {title: "Company Name", style: {font: { sz: "18", bold: true}}, width: {wpx: 180}},
        {title: "Students Placed", style: {font: { sz: "18", bold: true}}, width: {wpx: 180}},
        {title: "Salary Package", style: {font: { sz: "18", bold: true}}, width: {wpx: 180}},
      ],
      data: resultJobs.filter((job, key)=>selectionModel.includes(key+1)).map(job=>
        [
          {value: job.companyName, style: { font: {sz: "14"}}},
          {value: job.noOfStudentsPlaced || "N/A", style: { font: {sz: "14"}}},
          {value: job.salaryPackage, style: {font : {sz: "14"}}}
        ]
      )
    }
  ]
  useEffect(()=>{
    let download = false;
    for (const [, value] of Object.entries(state)) {
      download |= value.checked;
    }
    setDownloadEnable(download);
  }, [state])
  useEffect(() => {
    async function fetchCompanyNames() {
      let response = await axios.get('/job/getCompanyNames');
      setCompanies(response.data.companyNames);
    }
    fetchCompanyNames();
  }, [])
  useEffect(() => {
    async function fetchCourses() {
      const res = await axios.get('/job/getCourses');
      const data = res.data;
      setAvailableCourses(data.courses);
    }
    fetchCourses();
  }, []);
  useEffect(()=>{
      console.log(course, company, year);
      getJobs(course, company, year);
  }, [course, company, year])
  const handleCompany = async (value)=>{
    setCompany(value);

  }
  const handleCourses = async (value)=>{
    setCourse(value);
  }
  const onCheckAll = (e)=>{
    const checkValue = e.target.checked;
    setDownloadEnable(!downloadEnable);
    setCheckAll(checkValue);
    for (const [key, value] of Object.entries(state)) {
      if(checkValue){
        value.value = key;
      }else{
        value.value = "";
      }
      value.checked = !value.checked;
    }
  }

const getJobs = async(course, company, year)=>{
      setLoading(true);
      let res="";
      if(course === ""){
        course = null;
      }
      if(company === ""){
        company = null;
      }
      const newyear = year===null ? "": year.getFullYear();
      res = await axios.get(encodeURI(`/job/getjobs/${course}/${company}/${newyear}`));

      if(res !== ""){
        console.log(res);
        const jobs = res.data.jobs;
        let resJobs = [];
        jobs.map((job, key)=>{
          const jobNotExpired = (job.dateOfExpiry !== undefined && (new Date(job.dateOfExpiry) > (new Date())));
          const {companyName, location, salaryPackage, _id, isOpen, jobType, noOfStudentsPlaced} = job;
          resJobs.push({companyName, location, salaryPackage: Number(salaryPackage), "id": key+1, _id, open: isOpen && jobNotExpired, jobType, noOfStudentsPlaced});
        })
        setJobs(resJobs);
      }else{
        setJobs([]);
      }
      setLoading(false);
}
  const handleChange = (e)=>{
    setState({...state, [e.target.name]: {checked: e.target.checked, value: e.target.value}});
  }
const downloadReport = async (jobId)=>{
  const data = {
    jobId,
    firstName: state.firstName.value,
    lastName: state.lastName.value,
    branchName: state.branchName.value,
    email: state.email.value,
    phone: state.phone.value,
    resume: state.resume.value,
    offerletter: state.offerLetter.value,
    ugPercentage: state.ugPercentage.value,
    pgPercentage: state.pgPercentage.value,
    tenthCgpa: state.tenthCgpa.value,
    twelfthCgpa: state.twelfthCgpa.value,
    gender: state.gender.value
  }
  const res = await axios.post('/job/report/', data);
  return res.data.fileName;
}

const handleSubmit = async ()=>{
    setLoading(true);
    let fileName = "", count = 0;
    for(let i = 0;i<selectionModel.length;i++){
      for(let j = 0; j < resultJobs.length; j++){
        if(selectionModel[i]===(j+1)){
            count++;
            fileName = await downloadReport(resultJobs[j]._id);
            setDownloadCount(count);
        }
      }
    }
    if(count === 1){
        window.location.assign(encodeURI(`${url}/job/download/${fileName}`));
        // window.open(encodeURI(`${url}/job/download/${encodeURIComponent(fileName)}`));
    }else{
      window.location.assign(encodeURI(`${url}/job/downloadZip`));
    }
    setLoading(false);
    setDownloadCount(0);
}
const labels = resultJobs.filter((job, key)=>selectionModel.includes(key+1)).map(job=>
  job.companyName
)
const data1 = resultJobs.filter((job, key)=>selectionModel.includes(key+1)).map(job=>
  job.noOfStudentsPlaced || 10
)
const data = {
  labels: labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: data1,
      backgroundColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      // backgroundColor: Object.values(Utils.CHART_COLORS),
    }
  ]
};

  return (
    <div>
          <CssBaseline />

         
   
            <Button style={{marginTop: "2%", marginLeft: "1%"}} component={Link} to={'/visualize'} variant="contained" color="primary">
              Show Charts
            </Button>
       
          
  <Grid container direction="column" justify="flex-start" alignItems="center">

      <form className={classes.form} noValidate>
      <Grid container spacing={8}>
        <Grid item xs={12} sm={4}>
          <Autocomplete
            id="free-solo-demo"
            freeSolo
            options={availableCompanies.map((option) => option)}
            value={company}
            onChange={(event, value)=>handleCompany(value)}
            style={{width: "100%"}}
            renderInput={(params) => (
              <StyledInput
                style={{width: "100%"}}
                {...params}
                label="Company name"
                variant="outlined"
                fullWidth
                required
                />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Autocomplete
            options={availableCourses.map((option)=>option.courseName)}
            freeSolo
            value={course}
            onChange={(event, newValue) => handleCourses(newValue)}
            style={{width: "100%"}}
            renderInput={(params) => (
              <StyledInput {...params} variant="outlined" label="Courses" placeholder="Select courses"
                required
                fullWidth
                style={{width: "100%"}}
              />
          )}
        />
      </Grid>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid item xs={12} sm={2}>
              <DatePicker
                style={{width: "100%"}}
                maxDate={Date(2022)}
                views={["year"]}
                label="Select Year"
                value={year}
                onChange={setYear}
              />
          </Grid>
        </MuiPickersUtilsProvider>
{
  selectionModel.length >= 1 &&
        <Grid item xs={12} sm={2}>
          <ExcelFile
            filename="job-data"
            element={
              <Tooltip title="Download placed students count?" placement="top">
              <Button fullWidth variant="contained" color="primary">Download</Button>
              </Tooltip>
            }
          >
          <ExcelSheet dataSet={DataSet} name="Job Data"/>
          </ExcelFile>
        </Grid>
      }
    </Grid>

    {
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={resultJobs} columns={columns} loading={loading} onSelectionModelChange={(newSelection) => {
        setSelectionModel(newSelection.selectionModel);
      }}
      selectionModel={selectionModel}
      checkboxSelection />
    </div>
  }
  {
    selectionModel.length > 0 &&
    <>
    <Grid item xs={12} sm={3}>

      <FormControlLabel
        control={<Checkbox value="all" checked={checkAll} onChange={(e)=>onCheckAll(e)} name="all" />}
        label="Select All"
      />
      </Grid>
    <FormGroup style={{marginTop: "3%"}} column="true">
      <Grid container spacing={8}>
      <Grid item xs={12} sm={3}>

        <FormControlLabel
          control={<Checkbox value="firstName" checked={state.firstName.checked} onChange={(e)=>handleChange(e)} name="firstName" />}
          label="First name"
        />
        </Grid>
  <Grid item xs={12} sm={3}>
    <FormControlLabel
      control={<Checkbox value="lastName" checked={state.lastName.checked} onChange={(e)=>handleChange(e)} name="lastName" />}
      label="Last Name"
    />
</Grid>
      <Grid item xs={12} sm={3}>
    <FormControlLabel
      control={<Checkbox value="branchName" checked={state.branchName.checked} onChange={(e)=>handleChange(e)} name="branchName" />}
      label="Branch Name"
    />
</Grid>
<Grid item xs={12} sm={3}>
  <FormControlLabel
    control={<Checkbox value="email" checked={state.email.checked} onChange={(e)=>handleChange(e)} name="email" />}
    label="Email"
  />
</Grid>

</Grid>
  <Grid container spacing={8}>

  <Grid item xs={12} sm={3}>
    <FormControlLabel
      control={<Checkbox id="Phone" value="phone" checked={state.phone.checked} onChange={(e)=>handleChange(e)} name="phone" />}
      label="Phone"
    />
</Grid>
  <Grid item xs={12} sm={3}>
    <FormControlLabel
      control={<Checkbox value="resume" checked={state.resume.checked} onChange={(e)=>handleChange(e)} name="resume" />}
      label="Resume"
    />
</Grid>
<Grid item xs={12} sm={3}>
  <FormControlLabel
    control={<Checkbox value="gender" checked={state.gender.checked} onChange={(e)=>handleChange(e)} name="gender" />}
    label="Gender"
  />
</Grid>
<Grid item xs={12} sm={3}>
  <FormControlLabel
    control={<Checkbox value="tenthCgpa" checked={state.tenthCgpa.checked} onChange={(e)=>handleChange(e)} name="tenthCgpa" />}
    label="Tenth Percentage"
  />
</Grid>
</Grid>


  <Grid container spacing={8}>



  <Grid item xs={12} sm={3}>
    <FormControlLabel
      control={<Checkbox value="twelfthCgpa" checked={state.twelfthCgpa.checked} onChange={(e)=>handleChange(e)} name="twelfthCgpa" />}
      label="Twelfth Percentage"
    />
</Grid>
<Grid item xs={12} sm={3}>
  <FormControlLabel
    control={<Checkbox value="ugPercentage" checked={state.ugPercentage.checked} onChange={(e)=>handleChange(e)} name="ugPercentage" />}
    label="UG Percentage"
  />
</Grid>
<Grid item xs={12} sm={3}>
  <FormControlLabel
    control={<Checkbox value="pgPercentage" checked={state.pgPercentage.checked} onChange={(e)=>handleChange(e)} name="pgPercentage" />}
    label="PG Percentage"
  />
</Grid>

  </Grid>
  <Grid container spacing={8}>


  <Grid item xs={12} sm={3}>
    <FormControlLabel
      control={<Checkbox value="offerLetter" checked={state.offerLetter.checked} onChange={(e)=>handleChange(e)} name="offerLetter" />}
      label="Offer Letter"
    />
  </Grid>

    </Grid>
    </FormGroup>
      <Button disabled={!downloadEnable} onClick={()=>handleSubmit()} variant="contained" color="primary" >Download</Button>
        {
          loading
          &&
          <>
          <div style={{display: "inline", fontSize: "600",  width: "80vw"}}>
            <LinearProgressWithLabel value={Math.round(downloadCount*(100/selectionModel.length))}  uploadState="uploading"/>
          </div>
          </>
        }
      </>
  }


    </form>
    </Grid>

    </div>
  )
}

export default withRouter(ViewReports);
