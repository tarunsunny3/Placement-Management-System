import React, {useState, useEffect} from 'react';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import bgImage from './images/bgImage.jpg';
import './HomePage.css';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import { Link as Scroll } from 'react-scroll';
import HomePageContent from './HomePageContent';
const useStyles = makeStyles((theme) => ({
  bg:{
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.527),rgba(0, 0, 0, 0.5)) , url(${bgImage})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  },
  header:{
    // height: "90vh",
  },
  title:{
      textAlign: "center", 
      fontSize: "4rem",
      fontFamily: "MontSerrat, sans-serif",
      color: "#FFE3E3",
      marginTop: "15%",
      [theme.breakpoints.down('md')]:{
        marginTop: "25%",
        fontSize: '2.5rem'
      }
  },
  container:{
    textAlign: "center",
    marginBottom: "10%",
  },
  goDownIcon: {
    color: "white",
    fontSize: "3rem"
  }
}));
const HomePage = () => {
  const classes = useStyles();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(true);
  }, []);
  return (
    <div className={classes.bg}>
  <div>
  
  {/* <img src={bgImage} style={{width: "100%", height: "100vh", objectFit: "cover"}} alt="background"/> */}

  <div id ="header" className={classes.header}>
  {/* <Collapse in={checked} {...(checked ? {timeout: 1000}: {})}> */}
    <div className={classes.container}>
    <Collapse in={checked} {...(checked ? {timeout: 1000}: {})}>
      <h1 className={classes.title}>
        Welcome to <br/>
        Placement Management System
      </h1>
      </Collapse>
      <Scroll to="place-to-visit" smooth={true}>
      <IconButton>
          <ExpandMoreIcon className={classes.goDownIcon} />
        </IconButton>
       </Scroll>
      </div>
    {/* </Collapse> */}
    </div>
  <HomePageContent />
  <footer id="footer" className="footer">
        <div className="footer-content">
            <div className="footer-section about">
                <h1>Contact Me</h1>
                <div className="contact">
                    <span><i className="fas fa-phone">&nbsp; +918886555591</i></span>
                    <span><i className="fas fa-envelope">&nbsp; tarunsunny3@gmail.com</i></span>
                </div>
                <div className="social-media">
                    <a href="https://www.facebook.com/tarunsunny111"><i className="fab fa-facebook"></i></a>
                    <a href="https://www.instagram.com/tarunsunny115/">&nbsp;<i className="fab fa-instagram"></i></a>
                    <a href="https://github.com/tarunsunny3/">&nbsp;<i className="fab fa-github"></i></a>
                </div>
            </div>
            <div className="footer-bottom">&copy;Tarun apps.com</div>
        </div>

      </footer>
    </div>
    </div>
  )
}

export default HomePage
