
import React from 'react';
import { Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { styled } from '@material-ui/core';

import DeploymentDevices from './deploy/DeploymentDevices.js'
import DeploymentMetrics from './deploy/DeploymentMetrics.js'

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

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function Deploy() {
  const classes = useStyles();

  return (
      <div className={classes.root}>
          <Grid container spacing={2} columns={16}>
              <Grid item xs={8}>
                      <DeploymentDevices />
              </Grid>
              <Grid item xs={8}>
                      <DeploymentMetrics />
              </Grid>
          </Grid>
      </div>
  );
}
