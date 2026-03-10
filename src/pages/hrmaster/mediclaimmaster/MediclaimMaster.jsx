// import React, { useState } from "react";
// import {
//   Box,
//   Tabs,
//   Tab,
//   Typography,
//   Stack,
// } from "@mui/material";

// import {
//   Dashboard as DashboardIcon,
//   Policy as PolicyIcon,
//   Group as EnrollmentIcon,
//   LocalHospital as ClaimIcon,
// } from "@mui/icons-material";

// import PolicyMaster from "./policy/PolicyMaster";
// import EnrollmentMaster from "./enrollment/EnrollmentMaster";
// import ClaimMaster from "./claim/ClaimMaster";

// const MediclaimMaster = () => {
//   const [tabValue, setTabValue] = useState(0);

//   const handleChange = (event, newValue) => {
//     setTabValue(newValue);
//   };

//   return (
//     <Box sx={{ p: 3 }}>

//       {/* ===== PAGE HEADER ===== */}
//       <Box sx={{ mb: 2 }}>
//         <Typography variant="h5" fontWeight={600}>
//           Mediclaim Master
//         </Typography>
//         <Typography variant="body2" color="#64748B">
//           Manage policies, enrollments and claim processes
//         </Typography>
//       </Box>

//       {/* ===== TOP NAVIGATION TABS (LIKE YOUR IMAGE) ===== */}
//       <Box
//         sx={{
//           borderBottom: "1px solid #e2e8f0",
//           mb: 3,
//         }}
//       >
//         <Tabs
//           value={tabValue}
//           onChange={handleChange}
//           textColor="primary"
//           indicatorColor="primary"
//           sx={{
//             "& .MuiTab-root": {
//               textTransform: "none",
//               fontWeight: 500,
//               minHeight: 48,
//             },
//             "& .MuiTabs-indicator": {
//               height: 3,
//             },
//           }}
//         >
//           {/* <Tab
//             icon={<DashboardIcon fontSize="small" />}
//             iconPosition="start"
//             label="Overview"
//           /> */}
//           <Tab
//             icon={<PolicyIcon fontSize="small" />}
//             iconPosition="start"
//             label="Policy"
//           />
//           <Tab
//             icon={<EnrollmentIcon fontSize="small" />}
//             iconPosition="start"
//             label="Enrollment"
//           />
//           <Tab
//             icon={<ClaimIcon fontSize="small" />}
//             iconPosition="start"
//             label="Claim"
//           />
//         </Tabs>
//       </Box>

//       {/* ===== TAB CONTENT ===== */}
//       <Box>
//         {/* {tabValue === 0 && (
//           <Typography variant="body1">
//             Mediclaim dashboard overview coming soon...
//           </Typography>
//         )} */}

//         {tabValue === 0 && <PolicyMaster />}
//         {tabValue === 1 && <EnrollmentMaster />}
//         {tabValue === 2 && <ClaimMaster />}
//       </Box>
//     </Box>
//   );
// };

// export default MediclaimMaster;

import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
} from "@mui/material";

import {
  Policy as PolicyIcon,
  Group as EnrollmentIcon,
  LocalHospital as ClaimIcon,
} from "@mui/icons-material";

import PolicyMaster from "./policy/PolicyMaster";
import EnrollmentMaster from "./enrollment/EnrollmentMaster";
import ClaimMaster from "./claim/ClaimMaster";


// Color constants
const HEADER_GRADIENT = "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)";
const STRIPE_COLOR_ODD = '#FFFFFF';
const STRIPE_COLOR_EVEN = '#f8fafc';
const HOVER_COLOR = '#f1f5f9';
const PRIMARY_BLUE = "#00B4D8";
const TEXT_COLOR_HEADER = '#FFFFFF';
const TEXT_COLOR_MAIN = "#0f172a";

const MediclaimMaster = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Get dynamic header based on selected tab
  const getHeaderText = () => {
    switch(tabValue) {
      case 0:
        return "Policy Master";
      case 1:
        return "Enrollment Master";
      case 2:
        return "Claim Master";
      default:
        return "Mediclaim Master";
    }
  };

  // Get dynamic description based on selected tab
  const getDescriptionText = () => {
    switch(tabValue) {
      case 0:
        return "Manage and track mediclaim policies across the organization";
      case 1:
        return "Manage employee enrollments and track enrollment status";
      case 2:
        return "Track and process insurance claims";
      default:
        return "Manage policies, enrollments and claim processes";
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      {/* ===== PAGE HEADER ===== */}

      <Box sx={{ mb: 3 }}>
              <Typography
                variant="h5"
                component="h1"
                fontWeight="600"
                sx={{
                  background: HEADER_GRADIENT,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  display: 'inline-block'
                }}
              >
                {getHeaderText()}
              </Typography>
              <Typography variant="body2" color="#64748B" sx={{ mt: 0.5 }}>
                {getDescriptionText()}
              </Typography>
            </Box>
      

      {/* ===== TABS ===== */}
      {/* <Box sx={{ 
        borderBottom: 1, 
        borderColor: '#e2e8f0',
        mb: 0
      }}> */}
      <Paper
       sx={{ 
        borderRadius: 2,
        bgcolor: '#FFFFFF',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderBottom: 'none',
        overflow: 'hidden'
      }}>
        <Tabs 
          value={tabValue} 
          onChange={handleChange}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.875rem',
              minHeight: 48,
              color: '#64748B',
              px: 3
            },
            '& .Mui-selected': {
              color: '#0284c7',
              fontWeight: 600
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#0284c7',
              height: 2
            }
          }}
        >
          <Tab 
            label="Policy" 
          />
          <Tab 
            label="Enrollment" 
          />
          <Tab 
            label="Claim" 
          />
        </Tabs>
        </Paper>
      {/* </Box> */}

      {/* ===== TAB CONTENT ===== */}
      <Box>
        {tabValue === 0 && <PolicyMaster />}
        {tabValue === 1 && <EnrollmentMaster />}
        {tabValue === 2 && <ClaimMaster />}
      </Box>
    </Box>
  );
};

export default MediclaimMaster;