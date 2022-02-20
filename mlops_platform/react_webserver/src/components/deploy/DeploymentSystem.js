import React from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import DeploymentDevices from './DeploymentDevices.js'
import DeploymentMetrics from './DeploymentMetrics.js'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: 2,
    },
    title: {
        flexGrow: 1,
    }
}));

export default function DeploymentSystem() {
  const classes = useStyles();

    return (
        <div className={classes.root}>
            <Grid container spacing={2} columns={12} sx={{ minWidth: 700, maxWidth: 800 }}>
                <Grid item xs={6}>
                    <DeploymentDevices />
                </Grid>
                <Grid item xs={6}>
                    <DeploymentMetrics />
                </Grid>
            </Grid>
        </div>
    );
}

