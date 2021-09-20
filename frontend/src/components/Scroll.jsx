import React, { useState, useEffect } from 'react';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import {Link as Scroller} from 'react-scroll';
const useStyles = makeStyles((theme)=>({
    toUp:{
        zIndex: 2,
        position: 'fixed',
        bottom: '2vh',
        backgroundColor: "#6ECB63",
        color: "white",
        right: "5%",
        '&:hover, &.Mui-focusVisible':{
            transition: '0.3s',
            color: "white",
            backgroundColor: "green"
        }

    }
}));
const Scroll = ({ showBelow }) => {
    const classes = useStyles();
    const [show, setShow] = useState(showBelow ? false : true);

    useEffect(()=>{
        if(showBelow){
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }
    })
    const handleScroll = ()=>{
        if(window.pageYOffset > showBelow){
            if(!show) setShow(true);
        }else{
            if(show) setShow(false);
        }
    }

    return (
        <div>
            {show &&
                <Scroller to="navbar" smooth>
                <IconButton  className={classes.toUp}>
                    <ExpandLessIcon />
                </IconButton>
                </Scroller>
            }
        </div>
    )
}

export default Scroll
