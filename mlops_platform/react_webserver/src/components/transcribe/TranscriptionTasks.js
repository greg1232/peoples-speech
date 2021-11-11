
import React from 'react';
import { Table, TableBody, TableHead, TableRow, TableCell, Paper, TableContainer, Box, Button } from '@material-ui/core';

export default class TranscriptionTasks extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            tasks: []
        }
        this.handleTaskUpdate = this.handleTaskUpdate.bind(this);
    }

    handleTaskUpdate(tasks) {
        console.log("updated tasks: " + tasks);
        this.setState({tasks: tasks["tasks"]});
    }

    refresh() {
        fetch(process.env.REACT_APP_API_URL + '/peoples_speech/get_transcription_tasks',
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
            this.handleTaskUpdate(data);
        })
        .catch(console.log)
    }

    componentDidMount() {
        this.refresh();
    }

    render() {

        return <div>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Task Name</TableCell>
                                <TableCell align="right">% Complete</TableCell>
                                <TableCell align="right">Start Time</TableCell>
                                <TableCell align="right">End Time</TableCell>
                                <TableCell align="right">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.tasks.map((row) => (
                              <TableRow
                                key={row.uid}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <TableCell component="th" scope="row"> {row.uid} </TableCell>
                                <TableCell align="right">{row.completion_percent}</TableCell>
                                <TableCell align="right">{timestampToString(row.start_time)}</TableCell>
                                <TableCell align="right">{timestampToString(row.end_time)}</TableCell>
                                <TableCell align="right">
                                    <Box m={1}>
                                        <Button id="transcribe" variant="contained" onClick={() =>
                                            {
                                                console.log("Updated transcription task uid to: " + row.uid);
                                                this.props.setUid(row.uid);
                                                this.props.switchToTool();
                                            }}>
                                            Transcribe
                                        </Button>
                                    </Box>

                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>;
    }
}

function timestampToString(timestamp) {
    if (isNaN(timestamp)) {
        return timestamp;
    }
    var date = new Date(timestamp);
    return date.toLocaleTimeString("en-US");
}

