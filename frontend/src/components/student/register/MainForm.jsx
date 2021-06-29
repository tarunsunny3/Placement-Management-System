import React, {useState} from 'react'
import AppContext from '../../AppContext';
import {useParams} from 'react-router-dom';
import BasicReg from './BasicReg';
import SecondRegPage from './SecondRegPage';
import ThirdRegPage from './ThirdRegPage';
import axios from 'axios';
const MainForm = (props) => {
  const {type} = useParams();
  const {user} = React.useContext(AppContext);
  const [details, setDetails] = useState({firstName: "", lastName:"", email: "", phone: "", gender: "", branchName: "",courseName: "", semesters: "", twelfthCgpa: "", tenthCgpa: "", semGrades: [], ug: "", pg: "", gateScore: "", profilePictureLink: "", yearOfGrad: new Date(), resumeLink: ""});
  const [currPage, setCurrPage] = useState(1);
  const [gradesInputArray, setGradesInputArray] = useState([]);
  const [semestersError, setSemError] = useState({isTrue: true, message: ""})
  React.useEffect(()=>{
    if(type && type==="update"){
      console.log("Type is ", type);
      const details = user.details;
      if(details===undefined){
        props.history.replace('register');
      }else{
        setDetails(details);
        let tempArray = [];
        details.semesterWisePercentage.map(val=>{
          tempArray.push({grade: val});
        })
        setGradesInputArray(tempArray);
      }
    }
  }, []);
  const handleProfilePicture = (url)=>{
    setDetails({...details, profilePictureLink: url})
  }
  const handleResume = (url)=>{
    setDetails({...details, resumeLink: url})
  }
  const handleAddField = (key)=>{
    console.log("Key is ", key, " sems is ", details.semesters);
    // if(key < Number(details.semesters)-1){
      let values = [...gradesInputArray];
      values.push({"grade": ""});
      setGradesInputArray(values);
    // }

  }

  const handleRemoveField = (index)=>{
    let values = [...gradesInputArray];
    values.splice(index, 1);
    let grades = [];
    values.map((val, key)=>{
      grades.push(Number(val.grade));
    });
    setDetails({...details, semGrades: grades});
    setGradesInputArray(values);
  }
  const handleSemGrade = (event, index)=>{
    let values = [...gradesInputArray];
    values[index][event.target.name] = event.target.value;
    let grades = [];
    values.map((val, key)=>{
      grades.push(Number(val.grade));
    });
    setDetails({...details, semGrades: grades});
    setGradesInputArray(values);
  }

const handleSubmit = async (e)=>{
    e.preventDefault();
    console.log("Details are ", details);
    const res = await axios.post('/api/register_details', details, {withCredentials: true});
    console.log(res.data);
}
const nextStep = ()=>{
  setCurrPage(currPage+1);
}
const prevStep = () =>{
  setCurrPage(currPage-1);
}

const handleChange = (input, e)=>{
  if(input === "yearOfGrad"){
    setDetails({...details, [input]: e });
  }else{
    if(input === "semesters"){
      const sems = Number(e.target.value);
      if(sems <= 0){
        setSemError({isTrue: false, message: "Please enter a valid number >= 0"});
      }else{
        setSemError({isTrue: true, message:  ""});
      }
    }
    setDetails({...details, [input]: e.target.value});
  }
}
const handleCourse = async (event, newValue) => {
      if(newValue === null){
        setDetails({...details, courseName: ""});
        console.log("Object empty");
        return;
      }
      if (typeof newValue === 'string') {
        setDetails({...details, courseName: newValue});
        const res = await axios.post('/job/addCourse', {"courseName": newValue}, {withCredentials: true});
        console.log(res.data);
      } else if(newValue && newValue.inputValue) {
        // Create a new value from the user input
        setDetails({...details, courseName: newValue.inputValue});
        const res = await axios.post('/job/addCourse', {"courseName": newValue.inputValue}, {withCredentials: true});
        console.log(res.data);
      } else {
        setDetails({...details, courseName: newValue.courseName});
      }
}
const propsToPass = {
  values: details,
  nextStep,
  handleChange,
  handleCourse,
  handleAddField,
  handleRemoveField,
  handleSemGrade,
  gradesInputArray,
  semestersError
}
switch(currPage){
  case 1:
    return (
      <BasicReg props={propsToPass} />
    );
    case 2:
    return (
      <SecondRegPage handleSubmit={handleSubmit} values={details}  prevStep={prevStep} handleChange={handleChange} handleProfilePicture={handleProfilePicture} handleResume={handleResume}/>);
    case 3:
      return (
        <ThirdRegPage handleSubmit={handleSubmit}/>
        )
    default:
    return(
      <div>Default Page </div>
    )
}
}

export default MainForm;
