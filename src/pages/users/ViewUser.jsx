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
  Divider,
  Avatar,
  Box,
  Paper
} from '@mui/material';
import { Edit as EditIcon, Email, Person, Work, AccessTime, Security, Business } from '@mui/icons-material';

const ViewUser = ({ open, onClose, user, onEdit }) => {
  if (!user) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    if (status === 'active') return 'success';
    if (status === 'inactive') return 'default';
    if (status === 'suspended') return 'warning';
    if (status === 'locked') return 'error';
    return 'default';
  };

  const getStatusText = (status) => {
    if (status === 'active') return 'Active';
    if (status === 'inactive') return 'Inactive';
    if (status === 'suspended') return 'Suspended';
    if (status === 'locked') return 'Locked';
    return status || 'Unknown';
  };

  const getRoleColor = (roleName) => {
    if (roleName === 'SuperAdmin') return 'error';
    if (roleName === 'HR') return 'warning';
    if (roleName === 'Employee') return 'info';
    return 'default';
  };

  const getAvatarInitials = () => {
    if (user.EmployeeID?.FirstName && user.EmployeeID?.LastName) {
      return `${user.EmployeeID.FirstName.charAt(0)}${user.EmployeeID.LastName.charAt(0)}`.toUpperCase();
    }
    return user.Username ? user.Username.charAt(0).toUpperCase() : 'U';
  };

  const getAvatarColor = () => {
    const colors = ['#164e63', '#0e7490', '#0891b2', '#0c4a6e', '#1d4ed8', '#7c3aed'];
    const charCode = user.Username?.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  const DetailRow = ({ icon, label, value }) => (
    <Stack direction="row" spacing={2} alignItems="flex-start">
      <Box sx={{ color: 'text.secondary', mt: 0.5 }}>{icon}</Box>
      <Box flex={1}>
        <Typography variant="caption" color="textSecondary">
          {label}
        </Typography>
        <Typography variant="body2" fontWeight={500}>
          {value || '-'}
        </Typography>
      </Box>
    </Stack>
  );

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: '1px solid #E0E0E0', 
        pb: 2,
        backgroundColor: '#F8FAFC'
      }}>
        <div style={{ 
          fontSize: '20px', 
          fontWeight: '600', 
          color: '#101010',
          paddingTop: '8px'
        }}>
          User Details
        </div>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={3}>
          {/* User Header */}
          <div style={{ marginTop: '16px' }}>
            <Stack direction="row" spacing={3} alignItems="center">
              <Avatar sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: getAvatarColor(),
                fontSize: '1.75rem',
                fontWeight: 600
              }}>
                {getAvatarInitials()}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={600} color="#101010">
                  {user.Username}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
                  <Chip
                    label={getStatusText(user.Status)}
                    size="small"
                    color={getStatusColor(user.Status)}
                    sx={{ 
                      fontWeight: 500,
                      '&.MuiChip-colorSuccess': {
                        bgcolor: '#E8F5E9',
                        color: '#2E7D32'
                      },
                      '&.MuiChip-colorWarning': {
                        bgcolor: '#FFF3E0',
                        color: '#F57C00'
                      },
                      '&.MuiChip-colorError': {
                        bgcolor: '#FFEBEE',
                        color: '#D32F2F'
                      }
                    }}
                  />
                  <Chip
                    label={user.RoleID?.RoleName || 'No Role'}
                    size="small"
                    color={getRoleColor(user.RoleID?.RoleName)}
                    sx={{ 
                      fontWeight: 500,
                      '&.MuiChip-colorError': {
                        bgcolor: '#FFEBEE',
                        color: '#D32F2F'
                      },
                      '&.MuiChip-colorWarning': {
                        bgcolor: '#FFF3E0',
                        color: '#F57C00'
                      },
                      '&.MuiChip-colorInfo': {
                        bgcolor: '#E3F2FD',
                        color: '#1976D2'
                      }
                    }}
                  />
                </Stack>
              </Box>
            </Stack>
          </div>
          
          <Divider />
          
          {/* User Information */}
          <Stack spacing={2}>
            <Typography variant="subtitle1" fontWeight={600} color="#101010">
              User Information
            </Typography>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, bgcolor: '#F8FAFC' }}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                <Stack spacing={2} flex={1}>
                  <DetailRow 
                    icon={<Person fontSize="small" />}
                    label="Username"
                    value={user.Username}
                  />
                  <DetailRow 
                    icon={<Email fontSize="small" />}
                    label="Email Address"
                    value={user.Email}
                  />
                  <DetailRow 
                    icon={<Work fontSize="small" />}
                    label="Role"
                    value={
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {user.RoleID?.RoleName || '-'}
                        </Typography>
                        {user.RoleID?.Description && (
                          <Typography variant="caption" color="textSecondary">
                            {user.RoleID.Description}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </Stack>
                <Stack spacing={2} flex={1}>
                  <DetailRow 
                    icon={<Security fontSize="small" />}
                    label="Login Attempts"
                    value={user.LoginAttempts || 0}
                  />
                  <DetailRow 
                    icon={<AccessTime fontSize="small" />}
                    label="Last Login"
                    value={formatDate(user.LastLogin)}
                  />
                  <DetailRow 
                    icon={<AccessTime fontSize="small" />}
                    label="Account Created"
                    value={formatDate(user.CreatedAt)}
                  />
                </Stack>
              </Stack>
            </Paper>
          </Stack>
          
          {/* Employee Information (if linked) */}
          {user.EmployeeID && (
            <>
              <Divider />
              <Stack spacing={2}>
                <Typography variant="subtitle1" fontWeight={600} color="#101010">
                  Linked Employee Information
                </Typography>
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, bgcolor: '#F8FAFC' }}>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                    <Stack spacing={2} flex={1}>
                      <DetailRow 
                        icon={<Person fontSize="small" />}
                        label="Employee Name"
                        value={`${user.EmployeeID.FirstName || ''} ${user.EmployeeID.LastName || ''}`.trim() || '-'}
                      />
                      <DetailRow 
                        icon={<Business fontSize="small" />}
                        label="Employee ID"
                        value={user.EmployeeID.EmployeeID || '-'}
                      />
                    </Stack>
                    <Stack spacing={2} flex={1}>
                      <DetailRow 
                        icon={<Email fontSize="small" />}
                        label="Employee Email"
                        value={user.EmployeeID.Email || '-'}
                      />
                      <DetailRow 
                        icon={<Work fontSize="small" />}
                        label="Department"
                        value={user.EmployeeID.DepartmentID?.DepartmentName || '-'}
                      />
                    </Stack>
                  </Stack>
                </Paper>
              </Stack>
            </>
          )}
          
          {/* System Information */}
          <Divider />
          <Stack spacing={2}>
            <Typography variant="subtitle1" fontWeight={600} color="#101010">
              System Information
            </Typography>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, bgcolor: '#F8FAFC' }}>
              <Stack direction="row" spacing={4}>
                <DetailRow 
                  icon={<AccessTime fontSize="small" />}
                  label="Updated At"
                  value={formatDate(user.UpdatedAt)}
                />
                <DetailRow 
                  icon={<AccessTime fontSize="small" />}
                  label="User ID"
                  value={user._id}
                />
              </Stack>
            </Paper>
          </Stack>
        </Stack>
      </DialogContent>
      
      <DialogActions sx={{ 
        px: 3, 
        pb: 3, 
        borderTop: '1px solid #E0E0E0', 
        pt: 2,
        backgroundColor: '#F8FAFC'
      }}>
        <Button 
          onClick={onClose}
          sx={{
            borderRadius: 1,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 500
          }}
        >
          Close
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            onClose();
            onEdit();
          }}
          startIcon={<EditIcon />}
          sx={{
            borderRadius: 1,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 500,
            background: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
            '&:hover': {
              opacity: 0.9,
              background: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
            }
          }}
        >
          Edit User
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewUser;