import React, {useState} from 'react'
import AppContext from '../../AppContext';
import {useParams} from 'react-router-dom';
import BasicReg from './BasicReg';
import SecondRegPage from './SecondRegPage';
import ThirdRegPage from './ThirdRegPage';
import axios from 'axios';
const MainForm = (props) => {
  const {type} = useParams();
  const {user, setLoggedIn, loggedIn} = React.useContext(AppContext);
  const [details, setDetails] = useState({firstName: "", lastName:"", email: "", phone: "", gender: "", branchName: "",courseName: "", semesters: "", twelfthCgpa: "", tenthCgpa: "", semGrades: [], ug: "", pg: "", gateScore: "", profilePictureLink: "", yearOfGrad: new Date(), resumeLink: ""});
  const [currPage, setCurrPage] = useState(1);
  const [gradesInputArray, setGradesInputArray] = useState([]);
  const [semestersError, setSemError] = useState({isTrue: true, message: ""})
  const [errors, setErrors] = useState({});
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
    const { firstName, lastName, semesters, branchName, email, phone, courseName, tenthCgpa, twelfthCgpa, gender} = details;
    let tempErrors = {};
    if(firstName.length === 0){
      tempErrors['firstName'] = "Please enter the First Name";
    }
    if(lastName.length === 0){
      tempErrors['lastName'] = "Please enter the Last Name";
    }
    if(semesters.length === 0){
      tempErrors['semesters'] = "Please enter the number of semsters";
    }
    if(email.length === 0){
      tempErrors['email'] = "Please enter the Email address";
    }
    if(phone.length === 0){
      tempErrors['phone'] = "Please enter the Phone number";
    }
    if(branchName.length === 0){
      tempErrors['branchName'] = "Please enter the Branch Name";
    }
    if(courseName.length === 0){
      tempErrors['course'] = "Please enter/select the Course Name";
    }
    if(tenthCgpa.length === 0){
      tempErrors['tenthCgpa'] = "Please enter the 10th CGPA";
    }
    if(twelfthCgpa.length === 0){
      tempErrors['twelfthCgpa'] = "Please enter the 12th CGPA";
    }
    setErrors(tempErrors);
    if(Object.entries(tempErrors).length === 0){
      console.log("Details are ", details);
      const res = await axios.post('/api/register_details', details, {withCredentials: true});
      console.log(res.data);
      alert("Successfully updated the values");
      setLoggedIn(!loggedIn)
      props.history.push("/profile");
    }else{
      alert("Please remove all the errors and then proceed");
    }

}
const nextStep = ()=>{
  let formName = "";
  if(currPage===1){
    formName="basicDetails";
  }else if ( currPage === 2){
    formName = "academicDetails";
  }
  let tempErrors = errors;
  if(details.gender === ""){
    tempErrors = {...tempErrors, "gender": "Please choose the gender"};
  }
  let flag = 0;
  for (const [key, value] of Object.entries(tempErrors)) {
    if(value !== ""){
      flag = 1;
      if(document[formName][key] !== undefined){
        document[formName][key].focus();
        break;
      }
    }
  }
  setErrors(tempErrors);
  // if(flag === 0){
    setCurrPage(currPage+1);
  // }
}
const prevStep = () =>{
  setCurrPage(currPage-1);
}

const handleChange = (input, e, errorMessage)=>{
  //If it is a year fielf value coming
  //Then check directly with e value
  if(e.target && e.target.value === ""){
    setErrors({...errors, [input] : errorMessage});
    setDetails({...details, [input]: e.target.value});
    return;
  }else{
    setErrors({...errors, [input] : ""});
  }
  if(input === "yearOfGrad"){
    setDetails({...details, [input]: e });
  }else{
    if(input === "semesters"){
      const sems = Number(e.target.value);
      if(sems <= 0){
        setSemError({isTrue: false, message: "Please enter a valid number >= 0"});
        setDetails({...details, [input]: e.target.value});
        setGradesInputArray([]);
        return;
      }else if (sems > 30){
        return;
      }else{
        setSemError({isTrue: true, message:  ""});
      }
    }else if (input === "phone"){
      if(e.target.value.length > 11){
        return;
      }
      if(!(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/.test(e.target.value))){
        setErrors({...errors, [input] : "Please enter a valid mobile number"});
        return;
      }else{
          setErrors({...errors, [input] : ""});
      }
    }
    setDetails({...details, [input]: e.target.value});
  }
}
const handleCourse = async (event, newValue, errorMessage) => {
      if(newValue === null){
        setDetails({...details, courseName: ""});
        setErrors({...errors, "course": errorMessage});
        return;
      }else{
        setErrors({...errors, "course": ""});
      }
      if (typeof newValue === 'string') {
        setDetails({...details, courseName: newValue});
        const res0 = await axios.post('/job/addCourse', {"courseName": newValue}, {withCredentials: true});
        console.log(res0.data);

      } else if(newValue && newValue.inputValue) {
        // Create a new value from the user input
        setDetails({...details, courseName: newValue.inputValue});
        const res0 = await axios.post('/job/addCourse', {"courseName": newValue.inputValue}, {withCredentials: true});
        console.log(res0.data);
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
  semestersError,
  errors
}
switch(currPage){
  case 1:
    return (
      <BasicReg props={propsToPass} />
    );
    case 2:
    return (
      <SecondRegPage handleSubmit={handleSubmit} values={details} errors={errors}  prevStep={prevStep} handleChange={handleChange} handleProfilePicture={handleProfilePicture} handleResume={handleResume}/>);
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
