
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

export default function Home() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
        A data centric platform for speech.

        <ul>
            <li><b>Data Management</b>.  Upload and manage your audio data.</li>
            <li><b>Model Iteration</b>.  Iteratively train, augment, and refine your speech models using error analysis.</li>
            <li><b>Deploy</b>.  Deploy your speech models to the edge.</li>
        </ul>
    </div>
  );
}
