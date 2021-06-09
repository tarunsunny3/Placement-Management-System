import React, {useState} from 'react'
import AppContext from './AppContext';
import ViewJobs from './ViewJobs';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import {makeStyles} from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
  enabled:{
    backgroundColor: "green",
    color: "white"
  },
  disabled:{
    backgroundColor: "#A9A9A9",
    color: "black"
  }
}));
const ViewAllJobs = () => {
  const classes = useStyles();
  const enabled = classes.enabled, disabled = classes.disabled;
  const {user} = React.useContext(AppContext);
  // console.log(user.details);
  const [type, setType] = useState("default");
  // const [disable2, setDisable2] = useState(false);
  // const [color1, setColor1] = useState("black");
  // const [color2, setColor2] = useState("white");
  const [class1, setClass1] = useState(enabled);
  console.log(class1);
  const [class2, setClass2] = useState(disabled);
  // let disable1 = false, disable2 = false;
  const handleClick = (type)=>{
    setType(type);
    if(type==="default"){
      setClass1(enabled);
      setClass2(disabled);
    }else{
      setClass1(disabled);
      setClass2(enabled);
    }

  }
  return (
    <div>
      {
        user != null && user.role === "Student"
        ?
        <ButtonGroup fullWidth={true} variant="contained" aria-label="contained primary button group">
          <Button variant="contained" className={class1} onClick={()=>handleClick("default")} >Unapplied Jobs</Button>
        <Button variant="contained" className={class2} onClick={()=>handleClick("applied")} >Applied Jobs</Button>
        </ButtonGroup>
        :
        <ButtonGroup fullWidth={true} variant="contained" aria-label="contained primary button group">
          <Button variant="contained" className={class1} onClick={()=>handleClick("default")} >Open Jobs</Button>
        <Button variant="contained" className={class2} onClick={()=>handleClick("applied")} >Closed Jobs</Button>
        </ButtonGroup>
      }

      {
        user != null && user.role === "Student"
        ?
        (
          type==="default"
            ?
              <ViewJobs key={1} type="default"/>
            :
            <ViewJobs key={2} type="applied"/>
        )
        :
        (
          type==="default"
            ?
              <ViewJobs key={3} type="open"/>
            :
              <ViewJobs key={4} type="close"/>
        )

      }

    </div>
  )
}

export default ViewAllJobs
