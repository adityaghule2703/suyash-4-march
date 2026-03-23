// import React from "react";
// import { Dialog, DialogTitle, DialogContent, Typography, Stack } from "@mui/material";

// export default function ViewLeave({ open, onClose, leave }) {
//   if (!leave) return null;

//   return (
//     <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
//       <DialogTitle>Leave Details</DialogTitle>
//       <DialogContent>
//         <Stack spacing={2} mt={1}>
//           <Typography><b>Employee:</b> {leave.EmployeeName}</Typography>
//           <Typography><b>Leave Type:</b> {leave.LeaveTypeName}</Typography>
//           <Typography><b>From:</b> {new Date(leave.StartDate).toDateString()}</Typography>
//           <Typography><b>To:</b> {new Date(leave.EndDate).toDateString()}</Typography>
//           <Typography><b>Status:</b> {leave.Status}</Typography>
//           <Typography><b>Reason:</b> {leave.Reason}</Typography>
//         </Stack>
//       </DialogContent>
//     </Dialog>
//   );
// }


import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Box,
  Chip,
  Divider
} from "@mui/material";
import {
  Close as CloseIcon,
  Person as PersonIcon,
  EventNote as EventNoteIcon,
  EventBusy as EventBusyIcon,
  Description as DescriptionIcon,
  Info as InfoIcon,
  CalendarToday as CalendarIcon,
  Badge as BadgeIcon
} from "@mui/icons-material";

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
    info: '#E0F2FE',
    pending: '#FEF3C7',
    approved: '#9FE2BF',
    rejected: '#FEE2E2'
  },
  chips: {
    active: '#9FE2BF',
    inactive: '#F1F5F9',
    suspended: '#FEF3C7',
    locked: '#FEE2E2'
  }
};

const ViewLeave = ({ open, onClose, leave }) => {
  if (!leave) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const formatDateShort = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return 'Invalid Date';
    }
  };

  const calculateDays = () => {
    if (leave.StartDate && leave.EndDate) {
      const from = new Date(leave.StartDate);
      const to = new Date(leave.EndDate);
      const diffTime = Math.abs(to - from);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return null;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return COLORS.status.approved;
      case 'rejected':
        return COLORS.status.rejected;
      case 'pending':
        return COLORS.status.pending;
      default:
        return COLORS.chips.inactive;
    }
  };

  const getStatusTextColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return COLORS.primaryDark;
      case 'rejected':
        return '#991B1B';
      case 'pending':
        return '#92400E';
      default:
        return COLORS.text.secondary;
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
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        mb: 1.5,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EventNoteIcon sx={{ color: COLORS.primary, fontSize: '1.2rem' }} />
          <Typography
            sx={{
              fontSize: '1.2rem',
              fontWeight: 700,
              color: COLORS.text.primary
            }}
          >
            Leave Details
          </Typography>
        </Box>
        <Box
          onClick={onClose}
          sx={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 28,
            borderRadius: 1,
            '&:hover': {
              bgcolor: COLORS.background.hover
            }
          }}
        >
          <CloseIcon sx={{ fontSize: '1rem', color: COLORS.text.secondary }} />
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2.5}>
          {/* Employee Information Section */}
          <Box sx={{ 
            p: 2, 
            bgcolor: COLORS.primaryLight, 
            borderRadius: 1.5,
            border: `1px solid ${COLORS.primary}`
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <PersonIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
              <Typography 
                sx={{ 
                  fontSize: '0.7rem', 
                  fontWeight: 600, 
                  color: COLORS.primaryDark,
                  letterSpacing: '0.5px'
                }}
              >
                EMPLOYEE INFORMATION
              </Typography>
            </Box>
            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                  Employee Name:
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                  {leave.EmployeeName || leave.employeeName || 'N/A'}
                </Typography>
              </Stack>
              {leave.EmployeeCode && (
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    Employee Code:
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {leave.EmployeeCode}
                  </Typography>
                </Stack>
              )}
              {leave.Department && (
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    Department:
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {leave.Department}
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Box>

          {/* Leave Details Section */}
          <Box sx={{ 
            p: 2, 
            bgcolor: COLORS.background.light, 
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <InfoIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
              <Typography 
                sx={{ 
                  fontSize: '0.7rem', 
                  fontWeight: 600, 
                  color: COLORS.text.secondary,
                  letterSpacing: '0.5px'
                }}
              >
                LEAVE INFORMATION
              </Typography>
            </Box>
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                  Leave Type:
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                  {leave.LeaveTypeName || leave.leaveTypeName || leave.LeaveType || 'N/A'}
                </Typography>
              </Stack>
              
              <Divider sx={{ borderColor: COLORS.border }} />
              
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                  From Date:
                </Typography>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {formatDate(leave.StartDate || leave.startDate)}
                  </Typography>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                    {formatDateShort(leave.StartDate || leave.startDate)}
                  </Typography>
                </Box>
              </Stack>
              
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                  To Date:
                </Typography>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {formatDate(leave.EndDate || leave.endDate)}
                  </Typography>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                    {formatDateShort(leave.EndDate || leave.endDate)}
                  </Typography>
                </Box>
              </Stack>
              
              <Divider sx={{ borderColor: COLORS.border }} />
              
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                  Total Days:
                </Typography>
                <Chip 
                  label={`${calculateDays()} day(s)`}
                  size="small"
                  sx={{ 
                    bgcolor: COLORS.primaryLight,
                    color: COLORS.primaryDark,
                    fontSize: '0.65rem',
                    height: 24,
                    fontWeight: 500,
                    '& .MuiChip-label': {
                      px: 1.5,
                      fontSize: '0.65rem'
                    }
                  }}
                />
              </Stack>
              
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                  Status:
                </Typography>
                <Chip 
                  label={leave.Status || leave.status || 'Pending'}
                  size="small"
                  sx={{ 
                    bgcolor: getStatusColor(leave.Status || leave.status),
                    color: getStatusTextColor(leave.Status || leave.status),
                    fontSize: '0.65rem',
                    height: 24,
                    fontWeight: 600,
                    '& .MuiChip-label': {
                      px: 1.5,
                      fontSize: '0.65rem'
                    }
                  }}
                />
              </Stack>
            </Stack>
          </Box>

          {/* Reason Section */}
          {(leave.Reason || leave.reason) && (
            <Box sx={{ 
              p: 2, 
              bgcolor: COLORS.background.light, 
              borderRadius: 1.5,
              border: `1px solid ${COLORS.border}`
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <DescriptionIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography 
                  sx={{ 
                    fontSize: '0.7rem', 
                    fontWeight: 600, 
                    color: COLORS.text.secondary,
                    letterSpacing: '0.5px'
                  }}
                >
                  REASON FOR LEAVE
                </Typography>
              </Box>
              <Typography 
                sx={{ 
                  fontSize: '0.75rem', 
                  color: COLORS.text.primary,
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}
              >
                {leave.Reason || leave.reason}
              </Typography>
            </Box>
          )}

          {/* Contact Information Section */}
          {(leave.ContactNumber || leave.contactNumber || leave.AddressDuringLeave || leave.addressDuringLeave) && (
            <Box sx={{ 
              p: 2, 
              bgcolor: COLORS.background.light, 
              borderRadius: 1.5,
              border: `1px solid ${COLORS.border}`
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <BadgeIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography 
                  sx={{ 
                    fontSize: '0.7rem', 
                    fontWeight: 600, 
                    color: COLORS.text.secondary,
                    letterSpacing: '0.5px'
                  }}
                >
                  CONTACT INFORMATION
                </Typography>
              </Box>
              <Stack spacing={1}>
                {(leave.ContactNumber || leave.contactNumber) && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                      Contact Number:
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {leave.ContactNumber || leave.contactNumber}
                    </Typography>
                  </Stack>
                )}
                {(leave.AddressDuringLeave || leave.addressDuringLeave) && (
                  <Stack direction="column" spacing={0.5}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                      Address During Leave:
                    </Typography>
                    <Typography 
                      sx={{ 
                        fontSize: '0.75rem', 
                        fontWeight: 500, 
                        color: COLORS.text.primary,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word'
                      }}
                    >
                      {leave.AddressDuringLeave || leave.addressDuringLeave}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Box>
          )}

          {/* Applied Date Section */}
          {(leave.CreatedAt || leave.createdAt || leave.AppliedDate) && (
            <Box sx={{ 
              p: 2, 
              bgcolor: COLORS.background.light, 
              borderRadius: 1.5,
              border: `1px solid ${COLORS.border}`
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <CalendarIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography 
                  sx={{ 
                    fontSize: '0.7rem', 
                    fontWeight: 600, 
                    color: COLORS.text.secondary,
                    letterSpacing: '0.5px'
                  }}
                >
                  APPLICATION DETAILS
                </Typography>
              </Box>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                  Applied On:
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                  {formatDate(leave.CreatedAt || leave.createdAt || leave.AppliedDate)}
                </Typography>
              </Stack>
            </Box>
          )}
        </Stack>
      </DialogContent>

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

export default ViewLeave;