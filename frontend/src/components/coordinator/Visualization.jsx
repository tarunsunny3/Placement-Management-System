import React, {useState, useEffect} from 'react'; 
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import Autocomplete , { createFilterOptions } from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import { Bar, Line } from 'react-chartjs-2';
import CssBaseline from '@material-ui/core/CssBaseline';
import useMediaQuery from '@material-ui/core/useMediaQuery';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    [theme.breakpoints.up("md")]:{
      maxWidth: "100%",
    },

    [theme.breakpoints.down("md")]:{
      minWidth: "85%",
    },
    marginTop: theme.spacing(8),
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: 'center',
    // borderRadius: '20px',
    // backgroundColor: "#f4eee8"
  },
  form: {
    width: '80%', // Fix IE 11 issue.
    margin: theme.spacing(3),
    padding: theme.spacing(4)
  },
}));
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
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
const Visualization = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const classes = useStyles();
    const [availableCompanies, setAvailableCompanies] = useState([]);
    const [selectedCompanies, setSelectedCompanies] = useState([]);
    const [error, setError] = useState("");
    const [chartData, setChartData] = useState({type: ""});
    useEffect(() => {
        async function fetchCompanyNames() {
          let response = await axios.get('/job/getCompanyNames');
          setAvailableCompanies(response.data.companyNames);
        }
        fetchCompanyNames();
      }, [])

      const showChart = async ()=>{
          let res = await axios.post('/job/getFilteredJobs', {companies: selectedCompanies});
         
          if(res.data.success){
            const jobs = res.data.jobs;
            console.log(jobs);
            if(selectedCompanies.length >= 2){
            let map = new Map();
           
            jobs.map((job)=>{
                if(map.get(job.companyName) === undefined){ 
                    map.set(job.companyName, job.noOfStudentsPlaced || 5);
                }else{
                    map.set(job.companyName, map.get(job.companyName) + (job.noOfStudentsPlaced || 0));
                }
            })

            const labels = [], values=[];
           for(const [key, val] of map){
               labels.push(key);
               values.push(val);
           }
            const data = {
              labels: labels,
              datasets: [{
                label: 'Companies Visualization',
                data: values,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                  'rgba(255, 205, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                  'rgb(255, 99, 132)',
                  'rgb(255, 159, 64)',
                  'rgb(255, 205, 86)',
                  'rgb(75, 192, 192)',
                  'rgb(54, 162, 235)',
                  'rgb(153, 102, 255)',
                  'rgb(201, 203, 207)'
                ],
                borderWidth: 1,
                barPercentage: 0.3
              }]
            };
            setChartData({type: "Bar", data});
          }else{
            //Display A Visualization of it in every year

            //Show the data of the last 10 years
            let years = [], values=[];
            const currYear = new Date().getFullYear();
            for(let gap = 3; gap >= 0 ; gap--){
              years.push(currYear-gap);
            }
            jobs.map(job=>{
              if(job.companyName === selectedCompanies[0]){
                values.push(job.noOfStudentsPlaced || 5);
              }
            });
            
            console.log(values);
            const data = {
              labels: years,
              datasets: [{
                label: 'Year-wise company data',
                data: values,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
              }]
            }
            setChartData({type: "Line", data});
          }
           
            document.getElementById("myChartDiv").style.display = "block";
          }else{
              setError("Couldn't get the jobs data");
          }
      }
    return (
        <div className={classes.root}>
          <CssBaseline />
                {
                    error.length > 0 && <p>{error}</p>
                }

<div style={{color: "green", fontWeight: "600", marginLeft: "2%"}}>
        <p>Selecting one company will display a line chart of year-wise number of students placed</p>
        <p>Selecting multiple companies gives the BAR chart</p>
        </div>
  <Grid container direction="column" justify="center" alignItems="center">
      
<form className={classes.form} noValidate>
<Grid container  alignItems="center" spacing={8}>
  <Grid item xs={12} sm={6}>
              <Autocomplete
                multiple
                disableCloseOnSelect
                id="free-solo-demo"
                freeSolo
                options={availableCompanies.map((option) => option)}
                onChange={(event, values)=>setSelectedCompanies(values)}
                renderOption={(option, { selected }) => (
                    <React.Fragment>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option}
                    </React.Fragment>
                  )}
                renderInput={(params) => (
                  // <StyledInput {...params} label="freeSolo" margin="normal" variant="outlined" />
                  <StyledInput
                    {...params}
                    label="Company name"
                    // value={company}
                    // onChange={(e)=>setCompany(e.target.value)}
                    // error={(errors["company"]) ? true : false}
                    // helperText={errors["company"]}
                    variant="outlined"
                    fullWidth
                    required
                    />
                )}
              />
              </Grid>
  <Grid item xs={12} sm={3}>
            <Button fullWidth variant="contained" color="primary" onClick={()=>showChart()}> Show Chart</Button>
            </Grid>
</Grid>

</form>
          
          </Grid>
            {
              isMobile ? 
              <div id="myChartDiv" style={{display: 'none'}}>
              <div style={{marginLeft: "5%", width: "80vw", height: "70vh"}}>
                <b style={{color: "crimson"}}>Best Viewed in Desktop</b>
                
                  {
                    chartData.type.length > 0 &&
                    chartData.type === "Bar" ?   <Bar data={chartData.data}/> : <Line data={chartData.data} options={{spanGaps: true}}/>
                  }
        
                </div>
              </div>
                :
                <div id="myChartDiv" style={{display: 'none'}}>
                <div style={{marginLeft: "5%", width: "80vw", height: "100vh"}}>
                {
                  chartData.type.length > 0 &&
                  chartData.type === "Bar" ?   <Bar data={chartData.data}/> : <Line data={chartData.data} options={{spanGaps: true}}/>
                }
       
      </div>
            
            </div>
            }
            
              

      
        </div>
    )
}

export default Visualization
