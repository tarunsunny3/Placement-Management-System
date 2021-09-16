import React , {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ImageCard from './ImageCard';
import content from './static/content';
import useWindowPosition from './hook/useWindowPosition';
import CountUp from 'react-countup';
import VisibilitySensor from "react-visibility-sensor";
import Grid from '@material-ui/core/Grid';
const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
  },
  paper:{
    textAlign: "center",
    width: "100%",
    height: "100%",
    // [theme.breakpoints.down('sm')]:{
    //   height: "60%"
    // },
    boxShadow:  "10px 10px rgba(0, 0, 0, 0.2)"
  },
  container:{
    margin: "auto 3%"
  },
  icon:{
    marginTop: theme.spacing(6),
    fontSize: "3rem",
    color: "#716F81"
  },
  iconText:{
    marginTop: theme.spacing(2),
    fontSize: "1.5rem"
  },
  number:{
    marginTop: theme.spacing(4),
    fontSize: "3rem",
    [theme.breakpoints.down('md')]:{
      marginTop: theme.spacing(6),
      fontSize: "4rem"
    }
  }
}));
export default function () {
  const classes = useStyles();
  const checked = useWindowPosition('header');
  return (
    <>
    <div className={classes.root} id="place-to-visit">
      {
        content.map((content, key)=>(
          <ImageCard key={key} content={content} checked={checked} />
        ))
      }
      
      {/* <ImageCard content={content[0]} checked={checked} /> */}
    </div>
    <div className={classes.container}>

   
    <Grid container display="flex" justifyContent="center" spacing={4}>
    
      <Grid item xs={12} sm={6} md={4}>
        <div className={classes.paper} style={{backgroundColor: "#B5EAEA"}}>
          <span><i  className= {`fas fa-user-graduate ${classes.icon}`}></i></span>
        <VisibilitySensor partialVisibility>
        {({ isVisible }) => (
         
           <p className={classes.iconText}> Students Placed <br/>
            <span  className={classes.number}>{isVisible ? <CountUp end={10000} duration={2}/> : null}+</span>
            </p>
        )}
        </VisibilitySensor>
        </div>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
       <div className={classes.paper} style={{backgroundColor: "#FFBCBC"}}>
       <span><i  className= {`fas fa-building ${classes.icon}`}></i></span>
        <VisibilitySensor partialVisibility>
        {({ isVisible }) => (
          <p className={classes.iconText}> Companies Arrived<br/>
          <span  className={classes.number}>{isVisible ? <CountUp end={1000} duration={2}/> : null}+</span>
          </p>
        )}
        </VisibilitySensor>
        </div>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <div className={classes.paper} style={{backgroundColor: "#BEAEE2"}}>
        <span><i  className= {`fas fa-book-open ${classes.icon}`}></i></span>
        <VisibilitySensor partialVisibility>
        {({ isVisible }) => (
          <p className={classes.iconText}>Courses Offered<br/>
          <span  className={classes.number}>{isVisible ? <CountUp end={60} duration={2}/> : null}+</span>
          </p>
        )}
        </VisibilitySensor>
        </div>
      </Grid>
      
    
    </Grid>
    </div>
    </>
  );
}