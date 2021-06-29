import React, {useState} from 'react';
import { useHistory} from 'react-router-dom';
import axios from 'axios';
import AppContext from '../AppContext';
import IconButton from '@material-ui/core/IconButton';
import RemoveCircleOutlineTwoToneIcon from '@material-ui/icons/RemoveCircleOutlineTwoTone';
import AddCircleOutlineTwoToneIcon from '@material-ui/icons/AddCircleOutlineTwoTone';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
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
      <p>Username: {user.username}</p>
      <p>Role: {user.role}</p>
      {
        user.role === "Student" &&
          <>
          <p>Email: {user.details.email}</p>
          <p>Phone: {user.details.phone}</p>
          <p>Gender: {user.details.gender}</p>
        {
          user.details.semesterWisePercentage.map((grade, key)=>{
            return <p key={key}>Semester {key+1} is {grade} </p>
          })
        }
        {
          user.details.semesters > user.details.semesterWisePercentage.length &&
          <>
            <p>You have to enter <b>{user.details.semesters - user.details.semesterWisePercentage.length} </b>more semesters Grades</p>
          {
            gradesInputArray.length === 0 &&
            <h3>Add field to enter grades for each sem? <span><IconButton onClick={()=>handleAddField()}><AddCircleOutlineTwoToneIcon /></IconButton></span></h3>
          }
            <form onSubmit={(e)=>handleSubmit(e)}>
          {

            gradesInputArray.map((val, key)=>{
              const len = user.details.semesterWisePercentage.length;
              key += len;
              const autoFocus = (key-len) === gradesInputArray.length-1;
                return (
          <Grid item xs={12} sm={3} key={key}>

                  <StyledInput
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
          {
            gradesInputArray.length >  0 &&
            <Button type="submit" variant="contained" color="primary" >Submit</Button>
          }
          </form>

          </>
        }
          </>
      }

    </div>
  )
}

export default ViewProfile
