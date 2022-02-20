
import React from 'react';
import { Table, TableBody, TableHead, TableRow, TableCell, Paper, TableContainer } from '@material-ui/core';

export default class DeploymentDevices extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            devices : []
        }

        this.handleDevicesUpdate = this.handleDevicesUpdate.bind(this);
    }

    handleDevicesUpdate(data) {
        this.setState({
            devices : data["devices"]
        });
    }

    refresh() {
        fetch(process.env.REACT_APP_DEPLOY_API_URL + '/peoples_speech/get_devices',
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
            console.log("Got get_devices response: ", data);
            this.handleDevicesUpdate(data);
        })
        .catch(console.log)
    }

    componentDidMount() {
        this.refresh();
    }

    render() {
        return (
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 350 }} aria-label="deployment-devices-table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Device Name</TableCell>
                            <TableCell align="right"> System </TableCell>
                            <TableCell align="right"> Model </TableCell>
                            <TableCell align="right"> Status </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.devices.map((row) => (
                          <TableRow
                              key={row.uid}
                              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                              <TableCell component="th" scope="row"> {row.name} </TableCell>
                              <TableCell align="right">{row.system}</TableCell>
                              <TableCell align="right">{row.model_name}</TableCell>
                              <TableCell align="right">{row.status}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
}
