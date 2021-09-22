import React from 'react';
import {Link} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';

import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { Collapse } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    maxWidth: 645,
    background: 'rgba(0,0,0,0.5)',
    margin: '20px',
    transition: "0.4s  ease-in",
    '&:hover':{
      transform: "perspective(200px) translateZ(10px)",
    }
  },
  media: {
    height: 300,
    backgroundSize: "cover",
    cursor: "pointer"
  },
  title: {
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    fontSize: '2rem',
    color: '#fff',
  },
  desc: {
    fontFamily: 'Padauk',
    fontSize: '1.2rem',
    color: '#ddd',
  },
});

export default function ImageCard({ content, checked }) {
  const classes = useStyles();
  const onMouseOver = (e)=>{
    let originalBg  = e.target.style["background-image"];
    e.target.style["background-image"] = `linear-gradient(rgba(0, 0, 0, 0.527),rgba(0, 0, 0, 0.5)), ${originalBg}`;
  }
  const onMouseLeave = (e, image)=>{
    e.target.style["background-image"] = `url(${image})`;
  }
  return (
    <Collapse in={checked} {...(checked ? { timeout: 1000 } : {})}>
      <Card className={classes.root}>
        <CardMedia
          component={Link}
          to={content.goTo}
          onMouseOver={(e)=>onMouseOver(e)}
          onMouseLeave={(e)=>onMouseLeave(e, content.imageUrl)}
          className={classes.media}
          image={content.imageUrl}
        />
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="h1"
            className={classes.title}
          >
            {content.title}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            component="p"
            className={classes.desc}
          >
            {content.description}
          </Typography>
        </CardContent>
      </Card>
    </Collapse>
  );
}