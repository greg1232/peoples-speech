
import React from 'react';

import { Grid } from '@material-ui/core';

import logo from "./logos/wave.jpeg";
import logoName from "./logos/datawav.png";

import GoogleSingleSignOn from "./login/GoogleSingleSignOn"

export default class Login extends React.Component {
    render() {
        return (
            <div>
                <Grid container style={{ minHeight: "100vh" }}>
                    <Grid item xs={12} sm={6} >
                        <img src={logo} style={{width: "100%", height: "100%", objectFit: "cover"}} alt="DataWave" />
                    </Grid>

                    <Grid
                        container
                        item
                        xs={12}
                        sm={6}
                        alignItems="center"
                        direction="column"
                        justifyContent="center"
                        style={{ padding: 10 }}
                    >
                        <div />
                        <div>
                            <div>
                                <img src={logoName} style={{height: "100"}} alt="DataWave" />
                            </div>
                            <div>
                                <GoogleSingleSignOn setToken={this.props.setToken} />
                            </div>
                        </div>
                        <div />
                    </Grid>
                </Grid>
            </div>
        );
    }

}

