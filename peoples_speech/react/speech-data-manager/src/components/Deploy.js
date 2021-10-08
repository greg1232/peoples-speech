
import React from 'react';
import { makeStyles } from '@material-ui/styles';

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

export default function Deploy() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
        Coming soon.
    </div>
  );
}
