import React, { useState, useEffect } from 'react';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';

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

    const handleClick = ()=>{
        window['scrollTo']({ top: 0, behavior: 'smooth'});
    }
    return (
        <div>
            {show &&

                <IconButton onClick={handleClick} className={classes.toUp}>
                    <ExpandLessIcon />
                </IconButton>
            }
        </div>
    )
}

export default Scroll
