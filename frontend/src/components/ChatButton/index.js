import * as React from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import ThreePIcon from '@mui/icons-material/ThreeP';
import useStyles from './style';
// Reference:- https://mui.com/material-ui/react-floating-action-button/

export default function ChatActionButton(props) {
    const classes = useStyles();
    const handleClick = () => {
        props.displayChatBox()
    }
  return (
    <Box sx={{ '& > :not(style)': { m: 1 } }}>
      <Fab color="primary" aria-label="add" className={classes.chatPosition} onClick={handleClick}>
        <ThreePIcon />
      </Fab>
      
    </Box>
  );
}