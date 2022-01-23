

import React from 'react';
import { Grid, Button, FormControl, InputLabel, Select, Box, MenuItem, Menu } from '@material-ui/core';
import { Table, TableBody, TableHead, TableRow, TableCell, Paper, TableContainer, Container } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import ErrorAnalysisDialog from './model_iteration/ErrorAnalysisDialog.js'
import MetricsDialog from './model_iteration/MetricsDialog.js'

export default class ModelIteration extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            datasets : [],
            dataset: {},
            model : {},
            thresholds : {},
            jobs: []
        }
        this.handleDatasetsUpdate = this.handleDatasetsUpdate.bind(this);
        this.handleDatasetUpdate = this.handleDatasetUpdate.bind(this);
        this.handleJobUpdate = this.handleJobUpdate.bind(this);
        this.setThreshold = this.setThreshold.bind(this);
        this.getThreshold = this.getThreshold.bind(this);
    }

    handleDatasetsUpdate(datasets) {
        console.log("updated datasets: " + datasets);
        this.setState({datasets: datasets["datasets"]});
        if (datasets.length > 0) {
            this.setState({dataset: datasets[0]});
        }
    }

    handleDatasetUpdate(dataset) {
        console.log("updated dataset: " + dataset.target.value);
        this.setState({dataset: dataset.target.value});
    }

    handleJobUpdate(jobs) {
        console.log("updated jobs: " + jobs);
        this.setState({jobs: jobs["jobs"]});
    }

    setThreshold(uid, threshold) {
        let thresholds = {...this.state.thresholds};

        thresholds[uid] = threshold;

        this.setState({thresholds : thresholds});
    }

    getThreshold(uid) {
        if (!(uid in this.state.thresholds)) {
            return 0.3;
        }
        return this.state.thresholds[uid];
    }

    componentDidMount() {
        this.refresh();
    }

    refresh() {
        fetch(process.env.REACT_APP_API_URL + '/peoples_speech/get_training_jobs',
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
        fetch(process.env.REACT_APP_API_URL + '/peoples_speech/get_exported_datasets',
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
    }

    render() {
        return <div>
                <Grid container justifyContent = "center">
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                            <InputLabel id="dataset">Dataset</InputLabel>
                                <Select
                                  labelId="dataset"
                                  id="dataset"
                                  value={this.state.dataset}
                                  label="dataset"
                                  onChange={this.handleDatasetUpdate}
                                >
                                    {this.state.datasets.map((dataset) => (
                                      <MenuItem key={dataset.id} id={dataset.id} value={dataset}>{dataset.name}</MenuItem>
                                    ))}

                                </Select>
                        </FormControl>
                    </Box>
                </Grid>
                <Grid container justifyContent = "center">
                    <Box m={1}>
                        <Button id="train" variant="contained" onClick={ () =>
                            {
                                fetch(process.env.REACT_APP_API_URL + '/peoples_speech/train',
                                    {
                                        method: 'POST', // *GET, POST, PUT, DELETE, etc.
                                        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                                        headers: {
                                          'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({ model : this.state.model, dataset: this.state.dataset }) // body data type must match "Content-Type" header
                                    }
                                )
                                .then(res => res.json())
                                .then((data) => {
                                    console.log("Got response: ", data);
                                    this.refresh();
                                })
                                .catch(console.log)
                            }}>
                            Train
                        </Button>
                    </Box>
                    <Box m={1}>
                        <Button id="refresh" variant="contained" onClick={ () =>
                            {
                                this.refresh();
                            }}>
                            Refresh
                        </Button>
                    </Box>
                </Grid>

                <Container maxWidth="lg">
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 600 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Model Name</TableCell>
                                    <TableCell align="right">Accuracy</TableCell>
                                    <TableCell align="right">Start Time</TableCell>
                                    <TableCell align="right">End Time</TableCell>
                                    <TableCell align="right">Status</TableCell>
                                    <TableCell align="right">Metrics</TableCell>
                                    <TableCell align="right">Analysis</TableCell>
                                    <TableCell align="right">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.jobs.map((row) => (
                                  <TableRow
                                    key={row.train_config_path}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                  >
                                    <TableCell component="th" scope="row">
                                      {row.name}
                                    </TableCell>
                                    <TableCell align="right">{accuracyToFixed(row.accuracy)}</TableCell>
                                    <TableCell align="right">{timestampToString(row.start_time)}</TableCell>
                                    <TableCell align="right">{timestampToString(row.end_time)}</TableCell>
                                    <TableCell align="right">{row.status}</TableCell>
                                    <TableCell align="right">
                                        <MetricsDialog
                                            uid={row.uid}
                                            getThreshold={this.getThreshold}
                                            setThreshold={this.setThreshold} />
                                    </TableCell>
                                    <TableCell align="right">
                                        <ErrorAnalysisDialog
                                            uid={row.uid}
                                            getThreshold={this.getThreshold}/>
                                    </TableCell>
                                    <TableCell align="right"><ActionMenu save_path={row.save_path} /></TableCell>

                                  </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Container>
            </div>;
    }
}

function accuracyToFixed(accuracy) {
    if (isNaN(accuracy)) {
        return accuracy;
    }
    return accuracy.toFixed(2);
}

function timestampToString(timestamp) {
    if (isNaN(timestamp)) {
        return timestamp;
    }
    var date = new Date(timestamp * 1000.0);
    return date.toLocaleTimeString("en-US");
}

function ActionMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeploy = () => {
    fetch(process.env.REACT_APP_DEPLOY_API_URL + '/peoples_speech/register_model',
        {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ path : props.save_path })
        }
    )
    .then(res => res.json())
    .then((data) => {
        console.log("Got response: ", data);
    })
    .catch(console.log)

    handleClose();
  };

  return (
    <div>
      <Button
        id="action-button"
        aria-controls="basic-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MenuIcon />
      </Button>
      <Menu
        id="action-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'action-button',
        }}
      >
        <MenuItem onClick={handleDeploy}>Deploy</MenuItem>
      </Menu>
    </div>
  );
}

