import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Stack,
} from "@mui/material";

import {
  Dashboard as DashboardIcon,
  Policy as PolicyIcon,
  Group as EnrollmentIcon,
  LocalHospital as ClaimIcon,
} from "@mui/icons-material";

import PolicyMaster from "./policy/PolicyMaster";
import EnrollmentMaster from "./enrollment/EnrollmentMaster";
import ClaimMaster from "./claim/ClaimMaster";

const MediclaimMaster = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>

      {/* ===== PAGE HEADER ===== */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight={600}>
          Mediclaim Master
        </Typography>
        <Typography variant="body2" color="#64748B">
          Manage policies, enrollments and claim processes
        </Typography>
      </Box>

      {/* ===== TOP NAVIGATION TABS (LIKE YOUR IMAGE) ===== */}
      <Box
        sx={{
          borderBottom: "1px solid #e2e8f0",
          mb: 3,
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleChange}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
              minHeight: 48,
            },
            "& .MuiTabs-indicator": {
              height: 3,
            },
          }}
        >
          {/* <Tab
            icon={<DashboardIcon fontSize="small" />}
            iconPosition="start"
            label="Overview"
          /> */}
          <Tab
            icon={<PolicyIcon fontSize="small" />}
            iconPosition="start"
            label="Policy"
          />
          <Tab
            icon={<EnrollmentIcon fontSize="small" />}
            iconPosition="start"
            label="Enrollment"
          />
          <Tab
            icon={<ClaimIcon fontSize="small" />}
            iconPosition="start"
            label="Claim"
          />
        </Tabs>
      </Box>

      {/* ===== TAB CONTENT ===== */}
      <Box>
        {/* {tabValue === 0 && (
          <Typography variant="body1">
            Mediclaim dashboard overview coming soon...
          </Typography>
        )} */}

        {tabValue === 0 && <PolicyMaster />}
        {tabValue === 1 && <EnrollmentMaster />}
        {tabValue === 2 && <ClaimMaster />}
      </Box>
    </Box>
  );
};

export default MediclaimMaster;