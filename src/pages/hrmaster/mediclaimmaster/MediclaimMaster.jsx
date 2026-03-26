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

// import React, { useState } from "react";
// import {
//   Box,
//   Tabs,
//   Tab,
//   Typography,
//   Paper,
// } from "@mui/material";

// import {
//   Policy as PolicyIcon,
//   Group as EnrollmentIcon,
//   LocalHospital as ClaimIcon,
// } from "@mui/icons-material";

// import PolicyMaster from "./policy/PolicyMaster";
// import EnrollmentMaster from "./enrollment/EnrollmentMaster";
// import ClaimMaster from "./claim/ClaimMaster";


// // Color constants
// const HEADER_GRADIENT = "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)";
// const STRIPE_COLOR_ODD = '#FFFFFF';
// const STRIPE_COLOR_EVEN = '#f8fafc';
// const HOVER_COLOR = '#f1f5f9';
// const PRIMARY_BLUE = "#00B4D8";
// const TEXT_COLOR_HEADER = '#FFFFFF';
// const TEXT_COLOR_MAIN = "#0f172a";

// const MediclaimMaster = () => {
//   const [tabValue, setTabValue] = useState(0);

//   const handleChange = (event, newValue) => {
//     setTabValue(newValue);
//   };

//   // Get dynamic header based on selected tab
//   const getHeaderText = () => {
//     switch(tabValue) {
//       case 0:
//         return "Policy Master";
//       case 1:
//         return "Enrollment Master";
//       case 2:
//         return "Claim Master";
//       default:
//         return "Mediclaim Master";
//     }
//   };

//   // Get dynamic description based on selected tab
//   const getDescriptionText = () => {
//     switch(tabValue) {
//       case 0:
//         return "Manage and track mediclaim policies across the organization";
//       case 1:
//         return "Manage employee enrollments and track enrollment status";
//       case 2:
//         return "Track and process insurance claims";
//       default:
//         return "Manage policies, enrollments and claim processes";
//     }
//   };

//   return (
//     <Box sx={{ p: 3, bgcolor: '#f8fafc', minHeight: '100vh' }}>
//       {/* ===== PAGE HEADER ===== */}

//       <Box sx={{ mb: 3 }}>
//               <Typography
//                 variant="h5"
//                 component="h1"
//                 fontWeight="600"
//                 sx={{
//                   background: HEADER_GRADIENT,
//                   WebkitBackgroundClip: "text",
//                   WebkitTextFillColor: "transparent",
//                   display: 'inline-block'
//                 }}
//               >
//                 {getHeaderText()}
//               </Typography>
//               <Typography variant="body2" color="#64748B" sx={{ mt: 0.5 }}>
//                 {getDescriptionText()}
//               </Typography>
//             </Box>
      

//       {/* ===== TABS ===== */}
//       {/* <Box sx={{ 
//         borderBottom: 1, 
//         borderColor: '#e2e8f0',
//         mb: 0
//       }}> */}
//       <Paper
//        sx={{ 
//         borderRadius: 2,
//         bgcolor: '#FFFFFF',
//         boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
//         border: '1px solid #e2e8f0',
//         borderBottomLeftRadius: 0,
//         borderBottomRightRadius: 0,
//         borderBottom: 'none',
//         overflow: 'hidden'
//       }}>
//         <Tabs 
//           value={tabValue} 
//           onChange={handleChange}
//           sx={{
//             '& .MuiTab-root': {
//               textTransform: 'none',
//               fontWeight: 500,
//               fontSize: '0.875rem',
//               minHeight: 48,
//               color: '#64748B',
//               px: 3
//             },
//             '& .Mui-selected': {
//               color: '#0284c7',
//               fontWeight: 600
//             },
//             '& .MuiTabs-indicator': {
//               backgroundColor: '#0284c7',
//               height: 2
//             }
//           }}
//         >
//           <Tab 
//             label="Policy" 
//           />
//           <Tab 
//             label="Enrollment" 
//           />
//           <Tab 
//             label="Claim" 
//           />
//         </Tabs>
//         </Paper>
//       {/* </Box> */}

//       {/* ===== TAB CONTENT ===== */}
//       <Box>
//         {tabValue === 0 && <PolicyMaster />}
//         {tabValue === 1 && <EnrollmentMaster />}
//         {tabValue === 2 && <ClaimMaster />}
//       </Box>
//     </Box>
//   );
// };

// export default MediclaimMaster;


import React, { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  Stack,
  Chip,
  CircularProgress,
  Alert
} from "@mui/material";

import {
  Policy as PolicyIcon,
  Group as EnrollmentIcon,
  LocalHospital as ClaimIcon,
  HealthAndSafety as HealthIcon
} from "@mui/icons-material";

import axios from "axios";
import BASE_URL from "../../../config/Config";
import { hasPermission, ACTIONS, MODULES, PAGES } from '../../../utils/modulePermissions';

import PolicyMaster from "./policy/PolicyMaster";
import EnrollmentMaster from "./enrollment/EnrollmentMaster";
import ClaimMaster from "./claim/ClaimMaster";

// Color constants matching other components
const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8',
    light: '#FFFFFF',
    lightMuted: 'rgba(255, 255, 255, 0.9)'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC',
    hover: '#F0FDF9',
    tableHeader: '#063C3F'
  },
  border: '#E3E8EF',
  status: {
    success: '#9FE2BF',
    warning: '#FEF3C7',
    error: '#FEE2E2',
    info: '#E0F2FE'
  },
  chips: {
    active: '#9FE2BF',
    inactive: '#F1F5F9',
    suspended: '#FEF3C7',
    locked: '#FEE2E2'
  }
};

// Loading state component
const LoadingState = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
    <CircularProgress size={40} sx={{ color: COLORS.primary }} />
  </Box>
);

// Access Denied component
const AccessDenied = () => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <Typography variant="h6" color="error" sx={{ mb: 2, fontSize: '1rem' }}>
      Access Denied
    </Typography>
    <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
      You don't have permission to view this page. Please contact your administrator.
    </Typography>
  </Box>
);

// Tab configurations with icons and colors
const TABS = [
  { 
    value: 'policy', 
    label: 'Policy Master', 
    icon: <PolicyIcon />, 
    color: '#1976D2',
    moduleKey: MODULES.MEDICLAIM_MASTER,
    page: PAGES.MEDICLAIM_MASTER
  },
  { 
    value: 'enrollment', 
    label: 'Enrollment Master', 
    icon: <EnrollmentIcon />, 
    color: '#7B1FA2',
    moduleKey: MODULES.MEDICLAIM_MASTER,
    page: PAGES.MEDICLAIM_MASTER
  },
  { 
    value: 'claim', 
    label: 'Claim Master', 
    icon: <ClaimIcon />, 
    color: '#E65100',
    moduleKey: MODULES.MEDICLAIM_MASTER,
    page: PAGES.MEDICLAIM_MASTER
  }
];

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`mediclaim-tabpanel-${index}`}
      aria-labelledby={`mediclaim-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2.5 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const MediclaimMaster = () => {
  const [tabValue, setTabValue] = useState(0);

  // User permissions state
  const [userPermissions, setUserPermissions] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);
  const [accessibleTabs, setAccessibleTabs] = useState([]);

  // Fetch user permissions from /api/auth/me
  useEffect(() => {
    const fetchUserPermissions = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          setPermissionsLoaded(true);
          return;
        }

        const response = await axios.get(`${BASE_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          const userData = response.data.data;
          setIsSuperAdmin(userData.isSuperAdmin || false);
          
          // Set permissions array
          if (userData.permissions && Array.isArray(userData.permissions)) {
            setUserPermissions(userData.permissions);
          } else {
            setUserPermissions([]);
          }
        } else {
          setUserPermissions([]);
        }
      } catch (err) {
        console.error('Error fetching user permissions:', err);
        setUserPermissions([]);
      } finally {
        setPermissionsLoaded(true);
      }
    };
    
    fetchUserPermissions();
  }, []);

  // Check permission helper
  const checkPermission = (moduleKey, page, action) => {
    // Super admin has all permissions
    if (isSuperAdmin) return true;
    
    return hasPermission(
      userPermissions,
      moduleKey,
      page,
      action
    );
  };

  // Determine which tabs are accessible based on permissions
  useEffect(() => {
    if (permissionsLoaded) {
      // Super admin has access to all tabs
      if (isSuperAdmin) {
        setAccessibleTabs(TABS);
        return;
      }
      
      // Filter tabs based on VIEW permission for each tab's content
      // Since all tabs are under the same module, we check if user has VIEW permission
      // for the MEDICLAIM_MASTER module
      const hasAnyPermission = TABS.some(tab => 
        checkPermission(tab.moduleKey, tab.page, ACTIONS.VIEW)
      );
      
      if (hasAnyPermission) {
        setAccessibleTabs(TABS);
      } else {
        setAccessibleTabs([]);
      }
    }
  }, [permissionsLoaded, isSuperAdmin, userPermissions]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getHeaderText = () => {
    return accessibleTabs[tabValue]?.label || "Mediclaim Master";
  };

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

  // Check if user has permission for specific tab content
  const canViewPolicyTab = () => {
    return isSuperAdmin || checkPermission(MODULES.MEDICLAIM_MASTER, PAGES.MEDICLAIM_MASTER, ACTIONS.VIEW);
  };

  const canViewEnrollmentTab = () => {
    return isSuperAdmin || checkPermission(MODULES.MEDICLAIM_MASTER, PAGES.MEDICLAIM_MASTER, ACTIONS.VIEW);
  };

  const canViewClaimTab = () => {
    return isSuperAdmin || checkPermission(MODULES.MEDICLAIM_MASTER, PAGES.MEDICLAIM_MASTER, ACTIONS.VIEW);
  };

  // Show loading state while permissions are being fetched
  if (!permissionsLoaded) {
    return <LoadingState />;
  }

  // If no accessible tabs, show access denied
  if (accessibleTabs.length === 0) {
    return <AccessDenied />;
  }

  return (
    <Box sx={{ p: 2.5, bgcolor: COLORS.background.light, minHeight: '100vh' }}>
      {/* Page Header */}
      <Box sx={{ mb: 2.5 }}>
        <Typography 
          variant="h5" 
          component="h1" 
          sx={{ 
            fontSize: '1.25rem',
            fontWeight: 700,
            color: COLORS.text.primary,
            mb: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <HealthIcon sx={{ fontSize: '1.2rem', color: COLORS.primary }} />
          {getHeaderText()}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          {getDescriptionText()}
        </Typography>
      </Box>

      {/* Tabs - Only show if user has permission to view at least one tab */}
      {accessibleTabs.length > 0 && (
        <Paper sx={{ 
          borderRadius: 2,
          bgcolor: COLORS.background.white,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden'
        }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.75rem',
                minHeight: 48,
                color: COLORS.text.secondary,
                '&.Mui-selected': {
                  color: COLORS.primary,
                  fontWeight: 600
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: COLORS.primary,
                height: 2
              }
            }}
          >
            {accessibleTabs.map((tab, index) => (
              <Tab 
                key={tab.value}
                icon={tab.icon}
                iconPosition="start"
                label={tab.label}
                sx={{
                  '& .MuiSvgIcon-root': {
                    fontSize: '1rem',
                    color: tab.color || 'inherit'
                  }
                }}
              />
            ))}
          </Tabs>
        </Paper>
      )}

      {/* Tab Panels - Only render content if user has permission for that specific tab */}
      <TabPanel value={tabValue} index={0}>
        {canViewPolicyTab() ? (
          <PolicyMaster />
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
              You don't have permission to view Policy Master.
            </Typography>
          </Paper>
        )}
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        {canViewEnrollmentTab() ? (
          <EnrollmentMaster />
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
              You don't have permission to view Enrollment Master.
            </Typography>
          </Paper>
        )}
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        {canViewClaimTab() ? (
          <ClaimMaster />
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
              You don't have permission to view Claim Master.
            </Typography>
          </Paper>
        )}
      </TabPanel>
    </Box>
  );
};

export default MediclaimMaster;