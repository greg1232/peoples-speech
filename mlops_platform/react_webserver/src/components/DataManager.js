
import React from 'react';
import PropTypes from 'prop-types';

import { Box, Tab, Tabs } from '@material-ui/core';

import DataBrowser from './data_manager/DataBrowser.js'
import TranscriptionTasks from './transcribe/TranscriptionTasks.js'
import TranscriptionTool from './transcribe/TranscriptionTool.js'

export default function DataManager(props) {
  const [value, setValue] = React.useState(0);
  const [uid, setUid] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const switchToTasks = () => {
    setValue(1);
  };

  const switchToTool = () => {
    setValue(2);
  };

  React.useEffect(() => {
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
        if(data["tasks"].length > 0) {
            setUid(data["tasks"][0].uid);
        }
    })
    .catch(console.log)
  });

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 700 }}>
      <Tabs orientation="vertical" value={value} onChange={handleChange} aria-label="data-manager-tabs" sx={{ borderRight: 1, borderColor: 'divider' }} >
        <Tab label="Dataset" {...a11yProps(0)} />
        <Tab label="Jobs" {...a11yProps(1)} />
        <Tab label="Transcribe" {...a11yProps(2)} />
      </Tabs>
      <TabPanel value={value} index={0}> <DataBrowser switchToTasks={switchToTasks} /> </TabPanel>
      <TabPanel value={value} index={1}> <TranscriptionTasks switchToTool={switchToTool} setUid={setUid} /> </TabPanel>
      <TabPanel value={value} index={2}> <TranscriptionTool uid={uid} /> </TabPanel>
    </Box>
  );
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};


