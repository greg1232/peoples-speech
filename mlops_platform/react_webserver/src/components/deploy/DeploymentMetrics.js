
import React from 'react';
import { Table, TableBody, TableHead, TableRow, TableCell, Paper, TableContainer } from '@material-ui/core';

export default class DeploymentMetrics extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            metrics : []
        }

        this.handleMetricsUpdate = this.handleMetricsUpdate.bind(this);
    }

    handleMetricsUpdate(data) {
        this.setState({
            metrics : data["metrics"]
        });
    }

    refresh() {
        fetch(process.env.REACT_APP_DEPLOY_API_URL + '/peoples_speech/get_metrics',
            {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ uid : this.props.uid })
            }
        )
        .then(res => res.json())
        .then((data) => {
            console.log("Got get_metrics response: ", data);
            this.handleMetricsUpdate(data);
        })
        .catch(console.log)
    }

    componentDidMount() {
        this.refresh();
    }

    render() {
        return (
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right"> Value </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.metrics.map((row) => (
                          <TableRow
                              key={row.name}
                              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                              <TableCell component="th" scope="row"> {row.name} </TableCell>
                              <TableCell align="right">{row.value}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
}

