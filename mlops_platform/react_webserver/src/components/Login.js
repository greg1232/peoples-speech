
import React from 'react';

import { Grid, TextField } from '@material-ui/core';

import logo from "./logos/say-data.jpeg";

import GoogleSingleSignOn from "./login/GoogleSingleSignOn"

export default class Login extends React.Component {
    render() {
        return (
            <div>
                <Grid container style={{ minHeight: "100vh" }}>
                    <Grid item xs={12} sm={6} >
                        <img src={logo} style={{width: "100%", height: "100%", objectFit: "cover"}} alt="SayData" />
                    </Grid>

                    <Grid
                        container
                        item
                        xs={12}
                        sm={6}
                        alignItems="center"
                        direction="column"
                        justify="space-between"
                        style={{ padding: 10 }}
                    >
                        <div />
                        <div>
                            <GoogleSingleSignOn setToken={this.props.setToken} />
                        </div>
                        <div />
                    </Grid>
                </Grid>
            </div>
        );
    }

}

