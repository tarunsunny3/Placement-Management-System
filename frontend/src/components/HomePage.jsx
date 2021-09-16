import React, {useState, useEffect} from 'react';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import bgImage from './images/bgImage.jpg';
import bgImage from './images/assets/placement_bg.jpeg';
import car4 from './images/assets/car4.jpg';
import car11 from './images/assets/car11.jpg';
import carousel3 from './images/assets/carousel2-min.jpg';
import './HomePage.css';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import { Link as Scroll } from 'react-scroll';
import HomePageContent from './HomePageContent';
import Carousel from 'react-material-ui-carousel'
import { Paper, Button } from '@material-ui/core'

function MyCarousel(props)
{
    var items = [
      {
        name: "Random Name #3",
        description: "Awesome campus placements!",
        image: carousel3
      },
        {
            name: "Random Name #1",
            description: "Very Good Research works",
            image: car4
        },
        {
            name: "Random Name #2",
            description: "Serene, green campus",
            image: car11
        },
        
    ]

    return (
        <Carousel
        interval={4000}
        fullHeightHover={true} 
        navButtonsAlwaysVisible={true}    // We want the nav buttons wrapper to only be as big as the button element is
        navButtonsProps={{          // Change the colors and radius of the actual buttons. THIS STYLES BOTH BUTTONS
            style: {
                backgroundColor: 'white',
                borderRadius: 10,
                color: "black"
            }
        }} 
        navButtonsWrapperProps={{   // Move the buttons to the bottom. Unsetting top here to override default style.
            style: {
                bottom: '0',
                top: 'unset'
            }
        }}
        >
            {
                items.map( (item, i) => <Item key={i} item={item} /> )
            }
        </Carousel>
    )
}

function Item({item})
{
    return (
        <Paper className={"container"}>
            {/* <h2>{item.name}</h2>
           */}
           
            <p className="centeredText">{item.description}</p>
            <img style={{objectFit: "cover"}} className="img" width="100%" height="500rem" src={item.image} alt={item.name}/>
        </Paper>
    )
}
const useStyles = makeStyles((theme) => ({
  bg:{
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.527),rgba(0, 0, 0, 0.5)) , url(${bgImage})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    // backgroundPosition: "right",
    [theme.breakpoints.down('md')]:{
      backgroundSize: "cover",
      backgroundPosition: "center",
    }
    

  },
  header:{
    // height: "90vh",
  },
  title:{
      textAlign: "center", 
      fontSize: "4rem",
      fontFamily: "MontSerrat, sans-serif",
      color: "white",
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
    <div>
  <div>
  
  {/* <img src={bgImage} style={{width: "100%", height: "100vh", objectFit: "cover"}} alt="background"/> */}

  <div id ="header" className={classes.header}>
  {/* <Collapse in={checked} {...(checked ? {timeout: 1000}: {})}> */}
  
    
    <div className={`${classes.container} ${classes.bg}`}>
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
      <MyCarousel />
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
                    <a href="https://www.instagram.com/tarunsunny115/"><i className="fab fa-instagram"></i></a>
                    <a href="https://github.com/tarunsunny3/"><i className="fab fa-github"></i></a>
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
