import React, {useState} from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import AppContext from '../AppContext';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import RemoveCircleOutlineTwoToneIcon from '@material-ui/icons/RemoveCircleOutlineTwoTone';
import AddCircleOutlineTwoToneIcon from '@material-ui/icons/AddCircleOutlineTwoTone';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import './ViewProfile.css';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
const ViewProfile = () => {
  const history  = useHistory();
  const {user} = React.useContext(AppContext);
  const [grades, setGrades] = useState([]);
  const [gradesInputArray, setGradesInputArray] = useState([]);


  const handleAddField = (key)=>{
      let values = [...gradesInputArray];
      values.push({"grade": ""});
      setGradesInputArray(values);
  }

  const handleRemoveField = (index)=>{
    let values = [...gradesInputArray];
    values.splice(index, 1);
    let gradesArray = [];
    values.map((val, key)=>{
      return gradesArray.push(Number(val.grade));
    });
    setGrades(gradesArray);
    setGradesInputArray(values);
  }
  const handleSemGrade = (event, index)=>{
    let values = [...gradesInputArray];
    values[index][event.target.name] = event.target.value;
    let gradesArray = [];
    values.map((val, key)=>{
      return gradesArray.push(Number(val.grade));
    });
    setGrades(gradesArray);
    setGradesInputArray(values);
  }
  const handleSubmit = async  (e)=>{
    e.preventDefault();
    let updateData = {};

    if(user !== undefined && user.details !== undefined){
      const userDetails = user.details;
      for(let i = 0;i<grades.length;i++){
        userDetails.semesterWisePercentage.push(grades[i]);
      }
      updateData = {
        details: userDetails
      }
    }else{
      const userDetails = user.details;
      userDetails.semesterWisePercentage = grades;
      updateData = {
        details: userDetails
      }
    }
    const res = await axios.post("/api/updateUserDetails", {updateData});
    console.log(res.data);
    if(res.data.success){
      history.go(0);
    }
  }
  return (
    <div>
<Grid container spacing={4}>

      {/* <div style={{margin: "auto", textAlign: "center"}}> */}
        {
          user.details === undefined ?  
          <>
            <p>Please finish the <Link to="/studentReg/register">registration</Link> first!!</p>
          </>
          :
          <>
          <Grid item xs={12} sm={6}>
          {
            user.details.profilePictureLink !== undefined &&
            // <Avatar style={{marginLeft: "20%", maxWidth: "100%", height: "auto", objectFit: "contain"}} src={user.details.profilePictureLink}></Avatar>
           
              <img className="profileImage" src={user.details.profilePictureLink} alt="user profile"/>
           
          }
          </Grid>
       <Grid item xs={12} sm={6}>
        <div>

          
        <table className="table">
          <tbody>
          <tr>
            <td>
              ID number
            </td>
            <td>
              {user.username}
            </td>
          </tr>
          <tr>
            <td>
              Name
            </td>
            <td>
              {user.details.firstName + " " + user.details.lastName}
            </td>
          </tr>
          {
            user.role==="Student" &&
            <>
          <tr>
            <td>
              Email
            </td>
            <td>
              {user.details.email}
            </td>
          </tr>

        <tr>
          <td>
            Phone Number
          </td>
          <td>
            {user.details.phone}
          </td>
        </tr>
        <tr>
          <td>
            Gender
          </td>
          <td>
            {user.details.gender}
          </td>
        </tr>
        
        {
          user.details.semesterWisePercentage.map((grade, key)=>{
            return (
              <tr key={key}>
                <td>
                  Semester {key+1}
                </td>
                <td>
                  {grade}
                </td>
              </tr>
          )
        })
      }
        
</>

    }
  </tbody>
    </table>
          </div>
        {
          user.details !== undefined && user.details.semesters !== undefined  && user.details.semesters > user.details.semesterWisePercentage.length &&
          <>
            <p>You have to enter <b>{user.details.semesters - user.details.semesterWisePercentage.length} </b>more semesters Grades</p>
          {
            gradesInputArray.length === 0 &&
            <h3>Add field to enter grades for each sem? <span><IconButton onClick={()=>handleAddField()}><AddCircleOutlineTwoToneIcon /></IconButton></span></h3>
          }
            <form onSubmit={(e)=>handleSubmit(e)}>
              <Grid container direction="column" justify="space-around" alignItems="center">
          {

            gradesInputArray.map((val, key)=>{
              const len = user.details.semesterWisePercentage.length;
              key += len;
              const autoFocus = (key-len) === gradesInputArray.length-1;
                return (
                  <Grid item xs={12} sm={2} key={key}>

                  <StyledInput
                    margin="normal"
                    autoFocus={autoFocus}
                    name="grade"
                    required
                    value={val.grade}
                    type="number"
                    label={"Enter Grade for SEM " + (key+1)}
                    variant="outlined"
                    onChange= {(event)=>handleSemGrade(event, key-len)}
                  />
                {
                  key === gradesInputArray.length + len -1 && key < Number(user.details.semesters)-1 &&   <IconButton onClick={(key)=>handleAddField(key)}><AddCircleOutlineTwoToneIcon /></IconButton>
                }

                <IconButton onClick={(event)=>handleRemoveField(key-len)}><RemoveCircleOutlineTwoToneIcon/></IconButton>
          </Grid>
                )
              })

          }
          </Grid>
          {
            gradesInputArray.length >  0 &&
            <Button type="submit" variant="contained" color="primary" >Submit</Button>
          }
          </form>

          </>
        }
    </Grid>
      </>
        }

</Grid>
    </div>

  )
}

export default ViewProfile
