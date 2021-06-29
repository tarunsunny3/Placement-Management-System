import React from 'react';
import LinearProgress, { LinearProgressProps } from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

function LinearProgressWithLabel(props: LinearProgressProps & { value: number, uploadState: string }) {
  const {value, uploadState} = props;
  return (
    (uploadState==='uploading') && (
    <Box display="flex" alignItems="center" style={{marginTop :  "2%"}} >
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" value={value} />
      </Box>
      <Box style={{width: "20%"}}>
        <Typography variant="h4" color="textSecondary">{value}%</Typography>
      </Box>
    </Box>
  )
  );
}
export default LinearProgressWithLabel
