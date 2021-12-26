import React, {useEffect} from 'react';

import {Button, Menu, MenuItem} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

export default function EditMenu(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [url, setUrl] = React.useState("");
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        fetch(process.env.REACT_APP_API_URL + '/peoples_speech/get_srt_url',
            {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                headers: {
                  'Content-Type': 'application/json'
                  // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify({ uid : props.uid }) // body data type must match "Content-Type" header
            }
        )
        .then(res => res.json())
        .then((data) => {
            console.log("Got response: ", data);

            setUrl(data["url"]);
        })

    }, [props.uid]);

    return (
        <div>
            <Button
                id="basic-button"
                aria-controls="basic-menu"
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <EditIcon />
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
            >
                <MenuItem onClick={handleClose}><a href={url}> Download Captions (.srt)</a></MenuItem>
                <MenuItem onClick={handleClose}>View Details</MenuItem>
            </Menu>
        </div>
    );
}

