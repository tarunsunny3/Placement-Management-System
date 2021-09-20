import React, {useState} from 'react';
import {withRouter} from 'react-router-dom';
import axios from 'axios';
import uoh_logo from './images/assets/uoh_logo.png';
import AppContext from './AppContext';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditTwoToneIcon from '@material-ui/icons/EditTwoTone';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useTheme } from '@material-ui/core/styles';
import AssessmentIcon from '@material-ui/icons/Assessment';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import SortIcon from '@material-ui/icons/Sort';
import { useMediaQuery } from '@material-ui/core';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "white"
  },
  appbar:{
    background: 'white',
  },
  title: {
    marginTop: "1%",
    marginLeft: "-1%",
    flexGrow: 1,
  },
  headerItems:{
    display: "flex",
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: 'center'
  },
  headerButton:{
    '&:hover':{
      backgroundColor: "#FFDAB9"
    },
    color: "black",
    cursor: "pointer",
  },
  currentHeaderItem: {
    cursor: "pointer",
    backgroundColor: "#BCFFB9",
    color: "black",
    padding: "5px 10px",
    borderRadius: "10px",
    fontSize:  "initial"
  },
  headerItem: {
    '&:hover':{
      backgroundColor: "pink",
      padding: "10px 10px  5px 10px",
      color: "black",
    },
    cursor: "pointer",
    color: "black",
    fontSize:  "1rem"
  },
  iconText: {
    marginLeft: "10px"
  },
  sectionDesktop: {
     display: 'none',
     [theme.breakpoints.up('md')]: {
       width: "35vw",
       display: 'flex',
       alignItems: "center",
       justifyContent: "space-around"
     },
   },
   sectionMobile: {
     display: 'flex',
     [theme.breakpoints.up('md')]: {
       display: 'none',
     },
   },
   currMenuItem:{
     color: 'green'
   }
}));


const  NavBar = (props)=> {
  const {history} = props;
  const {user, setUser, setLoggedIn} = React.useContext(AppContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  // const user = userDetails.user;
  const isMenuOpen = Boolean(anchorEl);
  // console.log("User is ", user);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    handleMobileMenuClose();
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClick = (e, pageURL) => {
    e.preventDefault();
    setAnchorEl(null);
    history.push(pageURL);
  };

  const onButtonClick = (event, pageURL) => {
    event.preventDefault();
    history.push(pageURL);
  }
  const Logout = async  ()=>{
    const d = await axios.get('/api/logout');
    setUser({id: null, role: null, username: null});
    console.log(d);
    setLoggedIn(false);
    history.push('/login');

  }
  
  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (

    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {
      (user===undefined || user===null || user.id === null) &&
      <div>
        <MenuItem onClick={(e)=>{handleMenuClick(e, "/register"); handleMobileMenuClose();}}><span><i style={{color: 'blue'}} className="fas fa-user-plus"></i></span><span className={classes.iconText}>Register</span></MenuItem>
        <MenuItem onClick={(e)=>{handleMenuClick(e, "/login"); handleMobileMenuClose();}}><span><i style={{color: 'blue', fontSize: "1.1rem"}} className="fas fa-sign-in-alt"></i></span><span className={classes.iconText}>Login</span></MenuItem>
      </div>
      }
      {user !== undefined && user.role === "Coordinator"
              &&
              <div>
                <MenuItem onClick={(e) => { handleMenuClick(e, "/job"); handleMobileMenuClose(); } }><CloudUploadIcon /><span className={classes.iconText}>Upload Job</span></MenuItem>
                <MenuItem onClick={(e) => { handleMenuClick(e, "/viewReports"); handleMobileMenuClose(); } }><AssessmentIcon /><span className={classes.iconText}>View Reports</span></MenuItem>
              </div>
      }
      {
        user !== undefined && user.role !== null &&
        <div>
          <MenuItem onClick={(e) => { handleMenuClick(e, "/view"); handleMobileMenuClose(); } }><VisibilityIcon /><span className={classes.iconText}>View Jobs</span></MenuItem><MenuItem onClick={handleProfileMenuOpen}>
              <AccountCircle />
              <span className={classes.iconText}>Profile</span>
          </MenuItem>
        </div>
    }
    </Menu>
  );
  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );
  return (
    <div id="navbar" className={classes.root}>
      <AppBar className={classes.appbar} position="static" elevation={0}>
        <Toolbar>
        <Typography variant="h6" className={classes.title}>
        <img onClick={()=>window.location.href = "/"}  style={{ cursor: "pointer", height: window.innerHeight/11}} src={uoh_logo}/>
          </Typography>
         
           
            
            <div>
            <div className={classes.sectionMobile}>
              <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
              >
                <SortIcon />
              </IconButton>
          </div>

         
                <div className={classes.sectionDesktop}>
                  { (user === undefined || user === null || user.role === null) &&
                    <div className={classes.headerItems}>
                      <p className={history.location.pathname !== '/login' ? classes.headerItem : classes.currentHeaderItem} style={{marginRight: "10%"}} variant="contained" onClick = {(event)=>onButtonClick(event, "/login")}>Login</p>
                      <p className={history.location.pathname !== '/register' ? classes.headerItem : classes.currentHeaderItem} variant="contained" onClick = {(e)=>onButtonClick(e, "/register")}> Register</p>
                    </div>
                  }
                  {
                    user.role !== null &&
                  
                    <div>
                      <p className={history.location.pathname !== '/view' ? classes.headerItem : classes.currentHeaderItem} onClick = {(event)=>onButtonClick(event, "/view")}>View Jobs</p>
                     
                    </div>
                }
              {
                user.role === "Coordinator" && 
                <>
            
              <div>
               
                <p className={history.location.pathname !== '/job' ? classes.headerItem: classes.currentHeaderItem} onClick = {(event)=>onButtonClick(event, "/job")}>Upload Jobs</p>
                </div>
                <div>
                <p  className={history.location.pathname !== '/viewReports' ? classes.headerItem: classes.currentHeaderItem} onClick={(e)=>onButtonClick(e, "/viewReports")}>View Reports</p>
             
              </div>
              </>
        }
        { user.role !== null &&
        <>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
              >
              <AccountCircle/>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={()=>setAnchorEl(null)}
              >

              {
                user.role === "Student" &&
              <div>
              <MenuItem onClick={(e)=>handleMenuClick(e, "/profile")}><VisibilityIcon /><span className={history.location.pathname !== '/profile' ? classes.iconText : `${classes.iconText} ${classes.currMenuItem}`}>View Profile</span></MenuItem>
              <MenuItem onClick={(e)=>handleMenuClick(e, "/studentReg/update")}><EditTwoToneIcon /><span className={history.location.pathname !== '/studentReg/update' ? classes.iconText : `${classes.iconText} ${classes.currMenuItem}`}>Edit Profile</span></MenuItem>
              </div>
              }
              <MenuItem onClick={()=>{setAnchorEl(null);Logout();}} color="inherit"><ExitToAppIcon className={classes.menuIcons}/><span className={classes.iconText}>Logout</span></MenuItem>
                </Menu>
                </>
}
            {renderMobileMenu}
            </div>
          </div>

      

        </Toolbar>
      </AppBar>
    </div>
  );
}
export default withRouter(NavBar);
