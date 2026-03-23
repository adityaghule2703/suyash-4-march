// import React from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Stack,
//   Typography,
//   Chip,
//   Divider,
//   Box
// } from '@mui/material';
// import {
//   Edit as EditIcon,
//   CalendarToday,
//   Info,
//   CheckCircle,
//   Cancel,
//   Repeat,
//   CloseSharp
// } from '@mui/icons-material';

// const ViewHoliday = ({ open, onClose, holiday, onEdit }) => {
//   if (!holiday) return null;

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   const formatDateTime = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleString();
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//       <DialogTitle
//         sx={{
//           borderBottom: '1px solid #E0E0E0',
//           backgroundColor: '#F8FAFC',
//           fontSize: '20px',
//           fontWeight: 600
//         }}
//       >
//         Holiday Details
//       </DialogTitle>

//       <DialogContent sx={{ pt: 3 }}>
//         <Stack spacing={3} mt={1}>
//           {/* Holiday Name */}
//           <Stack spacing={1}>
//             <Typography variant="caption" color="text.secondary">
//               Holiday Name
//             </Typography>
//             <Typography variant="h6" fontWeight={600}>
//               {holiday.Name}
//             </Typography>
//           </Stack>

//           <Divider />

//           {/* Basic Info */}
//           <Stack spacing={2}>
//             <Stack direction="row" spacing={3}>
//               {/* Date */}
//               <Stack spacing={1} flex={1}>
//                 <Stack direction="row" spacing={1} alignItems="center">
//                   <CalendarToday fontSize="small" />
//                   <Stack>
//                     <Typography variant="caption" color="text.secondary">
//                       Date
//                     </Typography>
//                     <Typography variant="body1">
//                       {formatDate(holiday.Date)}
//                     </Typography>
//                  </Stack>
//                 </Stack>
//               </Stack>

//               {/* Type */}
//               <Stack spacing={1} flex={1}>
//                 <Typography variant="caption" color="text.secondary">
//                   Type
//                 </Typography>
//                 <Chip
//                   label={holiday.Type || 'N/A'}
//                   size="small"
//                   color="primary"
//                   variant="outlined"
//                 />
//               </Stack>
//             </Stack>

//             {/* Year */}
//             <Stack spacing={2}>
//               <Stack direction="row" spacing={24}>
//               <Stack direction="row" spacing={3}>
//                 <Typography variant="caption" color="text.secondary" marginLeft="10px">
//                   Year
//                 </Typography>
//                 <Typography variant="body1">
//                   {holiday.Year || 'N/A'}
//                 </Typography>
//               </Stack>

//               {/* Recurring */}
//               <Stack direction="row" spacing={1} alignItems="center">
//                 <Repeat fontSize="small" />
//                 <Typography variant="caption" color="text.secondary">
//                   Recurring
//                 </Typography>
//                 <Chip
//                   label={holiday.IsRecurring ? 'Yes' : 'No'}
//                   size="small"
//                   color={holiday.IsRecurring ? 'success' : 'default'}
//                 />
//               </Stack>
//               </Stack>
//             </Stack>

//             {/* Status */}
//             {/* <Stack direction="row" spacing={1} alignItems="center">
//               {holiday.IsActive ? (
//                 <CheckCircle color="success" fontSize="small" />
//               ) : (
//                 <Cancel color="error" fontSize="small" />
//               )}
//               <Typography variant="caption" color="text.secondary">
//                 Status
//               </Typography>
//               <Chip
//                 label={holiday.IsActive ? 'Active' : 'Inactive'}
//                 size="small"
//                 color={holiday.IsActive ? 'success' : 'default'}
//               />
//             </Stack> */}

//             {/* Description */}
//             <Stack spacing={1}>
//               <Stack direction="row" spacing={1} alignItems="flex-start">
//                 <Info fontSize="small" />
//                 <Box flex={1}>
//                   <Typography variant="caption" color="text.secondary">
//                     Description
//                   </Typography>
//                   <Typography
//                     variant="body2"
//                     sx={{
//                       backgroundColor: '#F8FAFC',
//                       p: 1,
//                       borderRadius: 1,
//                       // mt: 0.5
//                     }}
//                   >
//                     {holiday.Description || 'No description provided'}
//                   </Typography>
//                 </Box>
//               </Stack>
//             </Stack>
//           </Stack>

//           <Divider />

//           {/* System Info */}
//           <Stack spacing={1}  >
//             <Typography variant="subtitle2" fontWeight={600}>
//               System Information
//             </Typography>

// <Stack direction="row" spacing={20}>
//   <Stack>
//             <Typography variant="caption" color="text.secondary">
//               Created At
//             </Typography>
//             <Typography variant="body2">
//               {formatDateTime(holiday.CreatedAt || holiday.createdAt)}
//             </Typography>
//             </Stack>

// <Stack>
//             <Typography variant="caption" color="text.secondary" >
//               Last Updated
//             </Typography>
//             <Typography variant="body2">
//               {formatDateTime(holiday.UpdatedAt || holiday.updatedAt)}
//             </Typography>
//           </Stack>
//           </Stack>
//         </Stack>
//         </Stack>
//       </DialogContent>

//       <DialogActions
//         sx={{
//           px: 3,
//           pb: 3,
//           borderTop: '1px solid #E0E0E0',
//           backgroundColor: '#F8FAFC'
//         }}
//       >
//          <Button 
//           variant="contained"
//           onClick={onClose}
//           startIcon={<CloseSharp />}
//           sx={{
//             borderRadius: 1,
//             px: 3,
//             py: 1,
//             textTransform: 'none',
//             fontWeight: 500,
//             backgroundColor: '#1976D2',
//             '&:hover': {
//               backgroundColor: '#1565C0'
//             }
//           }}
//         >
//           Close
//         </Button>

        
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default ViewHoliday;


import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Chip,
  Box,
  Paper,
  Divider
} from '@mui/material';
import {
  Event as EventIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  Repeat as RepeatIcon,
  Category as CategoryIcon,
  CalendarToday as CalendarIcon,
  Tag as TagIcon
} from '@mui/icons-material';

// Color constants matching ViewLeaveTypes component
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
    tableHeader: '#063C3F',
    card: '#F9FAFB'
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
    national: '#E0F2FE',
    festival: '#FEF3C7',
    company: '#E8F0F1',
    optional: '#F1F5F9'
  }
};

const ViewHoliday = ({ open, onClose, holiday }) => {
  if (!holiday) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'National':
        return COLORS.chips.national;
      case 'Festival':
        return COLORS.chips.festival;
      case 'Company':
        return COLORS.chips.company;
      case 'Optional':
        return COLORS.chips.optional;
      default:
        return COLORS.chips.inactive;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 5,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden'
        }
      }}
    >
      {/* Header */}
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <EventIcon sx={{ fontSize: '1.2rem', color: COLORS.primary }} />
          <Typography
            sx={{
              fontSize: '1.2rem',
              fontWeight: 700,
              color: COLORS.text.primary
            }}
          >
            Holiday Details
          </Typography>
        </Stack>

        <Chip
          label={`ID: ${holiday._id ? holiday._id.substring(0, 8) + '...' : 'N/A'}`}
          size="small"
          sx={{
            bgcolor: COLORS.primaryLight,
            color: COLORS.primary,
            fontWeight: 500,
            fontSize: '0.65rem',
            height: 24,
            '& .MuiChip-label': {
              px: 1
            }
          }}
        />
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.light }}>
        <Stack spacing={2}>
          {/* Main Info Card */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              border: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.background.white
            }}
          >
            <Stack spacing={2}>
              {/* Holiday Name */}
              <Box>
                <Typography
                  sx={{
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    color: COLORS.text.tertiary,
                    letterSpacing: '0.3px',
                    mb: 0.5
                  }}
                >
                  HOLIDAY NAME
                </Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <TagIcon sx={{ fontSize: '0.8rem', color: COLORS.primary }} />
                  <Typography
                    sx={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: COLORS.text.primary
                    }}
                  >
                    {holiday.Name}
                  </Typography>
                </Stack>
              </Box>

              <Divider sx={{ borderColor: COLORS.border }} />

              {/* Date and Type in Grid */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                {/* Date */}
                <Box>
                  <Typography
                    sx={{
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      color: COLORS.text.tertiary,
                      letterSpacing: '0.3px',
                      mb: 0.5
                    }}
                  >
                    DATE
                  </Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <CalendarIcon sx={{ fontSize: '0.8rem', color: COLORS.primary }} />
                    <Typography
                      sx={{
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        color: COLORS.text.primary
                      }}
                    >
                      {formatDate(holiday.Date)}
                    </Typography>
                  </Stack>
                </Box>

                {/* Type */}
                <Box>
                  <Typography
                    sx={{
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      color: COLORS.text.tertiary,
                      letterSpacing: '0.3px',
                      mb: 0.5
                    }}
                  >
                    TYPE
                  </Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <CategoryIcon sx={{ fontSize: '0.8rem', color: COLORS.primary }} />
                    <Chip
                      label={holiday.Type || 'N/A'}
                      size="small"
                      sx={{
                        bgcolor: getTypeColor(holiday.Type),
                        color: COLORS.text.primary,
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        height: 24,
                        '& .MuiChip-label': {
                          px: 1.5
                        }
                      }}
                    />
                  </Stack>
                </Box>
              </Box>

              {/* Year and Recurring in Grid */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                {/* Year */}
                <Box>
                  <Typography
                    sx={{
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      color: COLORS.text.tertiary,
                      letterSpacing: '0.3px',
                      mb: 0.5
                    }}
                  >
                    YEAR
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      color: COLORS.text.primary
                    }}
                  >
                    {holiday.Year || 'N/A'}
                  </Typography>
                </Box>

                {/* Recurring */}
                <Box>
                  <Typography
                    sx={{
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      color: COLORS.text.tertiary,
                      letterSpacing: '0.3px',
                      mb: 0.5
                    }}
                  >
                    RECURRING
                  </Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <RepeatIcon sx={{ fontSize: '0.8rem', color: COLORS.primary }} />
                    <Chip
                      label={holiday.IsRecurring ? 'Yes' : 'No'}
                      size="small"
                      sx={{
                        bgcolor: holiday.IsRecurring ? COLORS.chips.active : COLORS.chips.inactive,
                        color: holiday.IsRecurring ? COLORS.primary : COLORS.text.secondary,
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        height: 24,
                        '& .MuiChip-label': {
                          px: 1.5
                        }
                      }}
                    />
                  </Stack>
                </Box>
              </Box>

              <Divider sx={{ borderColor: COLORS.border }} />

              {/* Description */}
              <Box>
                <Typography
                  sx={{
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    color: COLORS.text.tertiary,
                    letterSpacing: '0.3px',
                    mb: 0.5
                  }}
                >
                  DESCRIPTION
                </Typography>
                <Stack direction="row" spacing={0.5} alignItems="flex-start">
                  <InfoIcon sx={{ fontSize: '0.8rem', color: COLORS.primary, mt: 0.3 }} />
                  <Typography
                    sx={{
                      fontSize: '0.8rem',
                      color: COLORS.text.secondary,
                      lineHeight: 1.5,
                      p: 1,
                      bgcolor: COLORS.background.light,
                      borderRadius: 2,
                      width: '100%'
                    }}
                  >
                    {holiday.Description || 'No description provided'}
                  </Typography>
                </Stack>
              </Box>

              {/* Status */}
              <Box>
                <Typography
                  sx={{
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    color: COLORS.text.tertiary,
                    letterSpacing: '0.3px',
                    mb: 0.5
                  }}
                >
                  STATUS
                </Typography>
                <Chip
                  label={holiday.IsActive ? 'Active' : 'Inactive'}
                  size="small"
                  sx={{
                    bgcolor: holiday.IsActive ? COLORS.chips.active : COLORS.chips.inactive,
                    color: holiday.IsActive ? COLORS.primary : COLORS.text.secondary,
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    height: 24,
                    '& .MuiChip-label': {
                      px: 1.5
                    }
                  }}
                />
              </Box>
            </Stack>
          </Paper>

          {/* System Info Card */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              border: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.background.white
            }}
          >
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <InfoIcon sx={{ fontSize: '0.9rem', color: COLORS.primary }} />
                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: COLORS.text.secondary,
                    letterSpacing: '0.3px'
                  }}
                >
                  SYSTEM INFORMATION
                </Typography>
              </Stack>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                <Box>
                  <Typography
                    sx={{
                      fontSize: '0.6rem',
                      fontWeight: 600,
                      color: COLORS.text.tertiary,
                      letterSpacing: '0.3px',
                      mb: 0.25
                    }}
                  >
                    CREATED
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.7rem',
                      color: COLORS.text.primary,
                      fontWeight: 500
                    }}
                  >
                    {formatDateTime(holiday.CreatedAt || holiday.createdAt)}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: '0.6rem',
                      fontWeight: 600,
                      color: COLORS.text.tertiary,
                      letterSpacing: '0.3px',
                      mb: 0.25
                    }}
                  >
                    LAST UPDATED
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.7rem',
                      color: COLORS.text.primary,
                      fontWeight: 500
                    }}
                  >
                    {formatDateTime(holiday.UpdatedAt || holiday.updatedAt)}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Paper>

          {/* Additional Info Card */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              border: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.background.white
            }}
          >
            <Typography
              sx={{
                fontSize: '0.65rem',
                fontWeight: 600,
                color: COLORS.text.tertiary,
                letterSpacing: '0.3px',
                mb: 1
              }}
            >
              ADDITIONAL INFORMATION
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              <Box sx={{ p: 1, bgcolor: COLORS.background.light, borderRadius: 2 }}>
                <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>
                  Holiday ID
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                  {holiday._id || 'N/A'}
                </Typography>
              </Box>

              <Box sx={{ p: 1, bgcolor: COLORS.background.light, borderRadius: 2 }}>
                <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>
                  Record Status
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                  {holiday.IsActive ? 'Enabled' : 'Disabled'}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Stack>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 1
      }}>
        <Button
          onClick={onClose}
          startIcon={<CloseIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': {
              borderColor: COLORS.primary,
              bgcolor: `${COLORS.primary}10`
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewHoliday;