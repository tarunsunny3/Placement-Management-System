import React, {useState} from 'react'
import BasicReg from './BasicReg';
import SecondRegPage from './SecondRegPage';
import axios from 'axios';
const MainForm = () => {
  const [details, setDetails] = useState({firstName: "", lastName:"", courseName: "", semesters: "", twelfthCgpa: "", tenthCgpa: ""});
  const [currPage, setCurrPage] = useState(1);

  const nextStep = ()=>{
    setCurrPage(currPage+1);
  }
const prevStep = () =>{
  setCurrPage(currPage-1);
}

const handleChange = (input, e)=>{
  setDetails({...details, [input]: e.target.value});
}
const handleCourse = async (event, newValue) => {
      if(newValue === null){
        setDetails({...details, courseName: ""});
        console.log("Object empty");
        return;
      }
      if (typeof newValue === 'string') {
        setDetails({...details, courseName: newValue});
        const res = await axios.post("/job/addCourse", {"courseName": newValue}, {withCredentials: true});
        console.log(res.data);
      } else if(newValue && newValue.inputValue) {
        // Create a new value from the user input
        setDetails({...details, courseName: newValue.inputValue});
        const res = await axios.post("/job/addCourse", {"courseName": newValue.inputValue}, {withCredentials: true});
        console.log(res.data);
      } else {
        setDetails({...details, courseName: newValue.courseName});
      }
}
switch(currPage){
  case 1:
    return (
      <BasicReg values={details} nextStep={nextStep} handleChange={handleChange} handleCourse={handleCourse}/>
    );
    case 2:
    return (
      <SecondRegPage values={details} nextStep={nextStep} prevStep={prevStep} handleChange={handleChange}/>);
    default:
    return(
      <div>Default Page </div>
    )
}
}

export default MainForm;
