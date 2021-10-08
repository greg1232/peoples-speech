

import React from 'react';
import { Grid, Button, FormControl, InputLabel, Select, Box, MenuItem } from '@material-ui/core';
import { Table, TableBody, TableHead, TableRow, TableCell, Paper, TableContainer } from '@material-ui/core';

export default class ModelIteration extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            datasets : [],
            model : {},
            jobs: []
        }
        this.handleDatasetsUpdate = this.handleDatasetsUpdate.bind(this);
        this.handleJobUpdate = this.handleJobUpdate.bind(this);
    }

    handleDatasetsUpdate(datasets) {
        console.log("updated path: " + datasets);
        this.setState({datasets: datasets["datasets"]});
    }

    handleJobUpdate(jobs) {
        console.log("updated jobs: " + jobs);
        this.setState({jobs: jobs["jobs"]});
    }

    render() {
        return <div>
                <Grid container justifyContent = "center">
                    <Button id="refresh" variant="contained" onClick={ () =>
                        {
                            fetch('http://localhost:5000/peoples_speech/get_training_jobs',
                                {
                                    method: 'GET', // *GET, POST, PUT, DELETE, etc.
                                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                                    headers: {
                                      'Content-Type': 'application/json'
                                    }
                                }
                            )
                            .then(res => res.json())
                            .then((data) => {
                                console.log("Got response: ", data);
                                this.handleJobUpdate(data);
                            })
                            .catch(console.log)
                            fetch('http://localhost:5000/peoples_speech/get_exported_datasets',
                                {
                                    method: 'GET', // *GET, POST, PUT, DELETE, etc.
                                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                                    headers: {
                                      'Content-Type': 'application/json'
                                    }
                                }
                            )
                            .then(res => res.json())
                            .then((data) => {
                                console.log("Got response: ", data);
                                this.handleDatasetsUpdate(data);
                            })
                            .catch(console.log)
                        }}>
                        Refresh
                    </Button>
                </Grid>
                <Grid container justifyContent = "center">
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                            <InputLabel id="dataset">Dataset</InputLabel>
                                <Select
                                  labelId="dataset"
                                  id="dataset"
                                  value={this.state.dataset_path}
                                  label="dataset"
                                  onChange={this.handleDatasetUpdate}
                                >
                            {this.state.datasets.map((dataset) => (
                              <MenuItem value={dataset.id}>{dataset.id}</MenuItem>
                            ))}

                                </Select>
                        </FormControl>
                    </Box>
                </Grid>
                <Grid container justifyContent = "center">
                    <Button id="train" variant="contained" onClick={ () =>
                        {
                            fetch('http://localhost:5000/peoples_speech/train',
                                {
                                    method: 'POST', // *GET, POST, PUT, DELETE, etc.
                                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                                    headers: {
                                      'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ model : this.state.model }) // body data type must match "Content-Type" header
                                }
                            )
                            .then(res => res.json())
                            .then((data) => {
                                console.log("Got response: ", data);
                            })
                            .catch(console.log)
                        }}>
                        Train
                    </Button>
                </Grid>

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Model Name</TableCell>
                                <TableCell align="right">Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.jobs.map((row) => (
                              <TableRow
                                key={row.train_config_path}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <TableCell component="th" scope="row">
                                  {row.train_config_path}
                                </TableCell>
                                <TableCell align="right">{row.status}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>;
    }
}

