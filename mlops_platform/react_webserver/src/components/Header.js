import React from 'react';
import { makeStyles } from '@material-ui/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Logout from './login/Logout'
import SmallWave from './logos/wave-small.png'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: 2,
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Header(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <img src={SmallWave} height="60" alt="wave" />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            DataWav
          </Typography>
          <Logout setToken={props.setToken} />
        </Toolbar>
      </AppBar>
    </div>
  );
}


