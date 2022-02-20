
import React from 'react';
import PropTypes from 'prop-types';

import { Box, Tab, Tabs } from '@material-ui/core';

import DeploymentSystem from './deploy/DeploymentSystem.js'
import InferenceOnUpload from './deploy/InferenceOnUpload.js'

export default function Deploy(props) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex' }}>
      <Tabs orientation="vertical" value={value} onChange={handleChange} aria-label="deployment-tabs" sx={{ borderRight: 1, borderColor: 'divider' }} >
        <Tab label="System" {...a11yProps(0)} />
        <Tab label="Uploads" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}> <DeploymentSystem /> </TabPanel>
      <TabPanel value={value} index={1}> <InferenceOnUpload /> </TabPanel>
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
      overflow="auto"
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



