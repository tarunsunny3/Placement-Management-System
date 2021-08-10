import React, {useState} from 'react';
import {withRouter} from 'react-router-dom';
import uoh_logo from './images/uoh_logo.png';
import axios from 'axios';
import Darkmode from 'darkmode-js';
import AppContext from './AppContext';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditTwoToneIcon from '@material-ui/icons/EditTwoTone';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useTheme } from '@material-ui/core/styles';
import MoreIcon from '@material-ui/icons/MoreVert';
import Avatar from '@material-ui/core/Avatar';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    // marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  headerItems:{
    display: "flex",
    flex: 1,
    justifyContent: "space-evenly",
  },
  headerButton:{
    '&:hover':{
      backgroundColor: "#FFDAB9"
    },
    backgroundColor: "white",
    color: "black",
    cursor: "pointer",
  },
  currentHeaderItem: {
    cursor: "pointer",
    backgroundColor: "#BCFFB9",
    color: "black",
    padding: "5px 10px",
    borderRadius: "10px"
  },
  headerItem: {
    '&:hover':{
      backgroundColor: "pink",
      padding: "10px 10px  5px 10px",
      color: "black",
    },
    // width: "100%",
    // marginRight: "10%",
    
    cursor: "pointer"
  },
  iconText: {
    marginLeft: "10px"
  },
  sectionDesktop: {
     display: 'none',
     [theme.breakpoints.up('md')]: {
       width: "50vw",
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
}));


const  NavBar = (props)=> {
  const {history} = props;
  const {user, setUser, setLoggedIn} = React.useContext(AppContext);
  const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
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
    // setMobileMoreAnchorEl(null);
    history.push(pageURL);
  };

  const onButtonClick = (event, pageURL) => {
    event.preventDefault();
    // let items = document.querySelectorAll("#header-item");
    // for(let i = 0 ; i < items.length; i++){
    //   if(items[i].className.includes("currentHeader")){
    //     items[i].className = "";
    //     items[i].className = classes.headerItem;
    //   }
    // }
    // event.target.className = classes.currentHeaderItem;
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
        user !== undefined && user.role==="Coordinator"
        &&
        <MenuItem onClick={(e)=>{handleMenuClick(e, "/job"); handleMobileMenuClose();}}><CloudUploadIcon /><span className={classes.iconText}>Upload Job</span></MenuItem>
      }

      <MenuItem onClick={(e)=>{handleMenuClick(e, "/view"); handleMobileMenuClose();}}><VisibilityIcon /><span className={classes.iconText}>View Jobs</span></MenuItem>

      <MenuItem onClick={handleProfileMenuOpen}>
      <AccountCircle />
        <span className={classes.iconText}>Profile</span>
      </MenuItem>
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
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          
          <Avatar style={{cursor: "pointer"}} onClick={()=>window.location.href = "/"} alt="Uoh Logo" src={uoh_logo} />
          <Typography style={{cursor: "pointer"}} onClick={()=>window.location.href = "/"} variant="h6" className={classes.title}>
            &nbsp;UoH
          </Typography>
        
          {
            (user===undefined || user===null || user.id === null) ?

              (<>
              <div className={classes.headerItems}>
                <Button className={classes.headerButton} style={{marginRight: "10%"}} variant="contained" onClick = {(event)=>onButtonClick(event, "/login")}>Login</Button>
                <Button className={classes.headerButton} variant="contained" onClick = {(e)=>onButtonClick(e, "/register")}> Register</Button>
              {/*<MenuItem onClick={()=>{setAnchorEl(null);Logout();}} color="inherit"><ExitToAppIcon /><span>Logout</span></MenuItem>*/}
              </div>
              </>)
            :
            (

              <div>
            <div className={classes.sectionMobile}>
              <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
          </div>



            <div className={classes.sectionDesktop}>
              <div>
                {console.log(history.location.pathname)}
                <p className={history.location.pathname !== '/view' ? classes.headerItem: classes.currentHeaderItem} onClick = {(event)=>onButtonClick(event, "/view")}>View Jobs</p>
              </div>
              {
                user.role === "Coordinator" && <div>
                  <p className={history.location.pathname !== '/job' ? classes.headerItem: classes.currentHeaderItem} onClick = {(event)=>onButtonClick(event, "/job")}>Upload Jobs</p>

              </div>

              }
              {
                user.role==="Coordinator" &&
                  <p  className={history.location.pathname !== '/viewReports' ? classes.headerItem: classes.currentHeaderItem} onClick={(e)=>onButtonClick(e, "/viewReports")}>View Reports</p>
              }

                <div>
                {/* <p style={{fontWeight: "700"}}>{user.username}</p>
                <p>{user.role}</p> */}
              </div>
             
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
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


              <MenuItem onClick={(e)=>handleMenuClick(e, "/profile")}><VisibilityIcon /><span className={classes.iconText}>View Profile</span></MenuItem>
              <MenuItem onClick={(e)=>handleMenuClick(e, "/studentReg/update")}><EditTwoToneIcon /><span className={classes.iconText}>Edit Profile</span></MenuItem>
              <MenuItem onClick={()=>{setAnchorEl(null);Logout();}} color="inherit"><ExitToAppIcon className={classes.menuIcons}/><span className={classes.iconText}>Logout</span></MenuItem>
                </Menu>
                {/* {renderMenu} */}
            </div>

          </div>

        )
          }
        {renderMobileMenu}

        </Toolbar>
      </AppBar>
    </div>
  );
}
export default withRouter(NavBar);
