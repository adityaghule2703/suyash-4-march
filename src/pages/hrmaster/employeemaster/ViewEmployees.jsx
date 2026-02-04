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
  Box
} from '@mui/material';
import { Edit as EditIcon, Email, Phone, Home, Cake, Work, Business, Person } from '@mui/icons-material';

const ViewEmployees = ({ open, onClose, employee, onEdit }) => {
  if (!employee) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    if (status === 'active') return 'success';
    if (status === 'inactive') return 'default';
    if (status === 'on_leave') return 'warning';
    if (status === 'terminated') return 'error';
    return 'default';
  };

  const getStatusText = (status) => {
    if (status === 'active') return 'Active';
    if (status === 'inactive') return 'Inactive';
    if (status === 'on_leave') return 'On Leave';
    if (status === 'terminated') return 'Terminated';
    return status;
  };

  const getGenderText = (gender) => {
    if (gender === 'M') return 'Male';
    if (gender === 'F') return 'Female';
    if (gender === 'O') return 'Other';
    return gender;
  };

  const getAvatarInitials = (firstName, lastName) => {
    const first = firstName ? firstName.charAt(0) : '';
    const last = lastName ? lastName.charAt(0) : '';
    return `${first}${last}`.toUpperCase() || 'U';
  };

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
          Employee Details
        </div>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={3}>
          {/* Add padding from top for the first field */}
          <div style={{ marginTop: '16px' }}>
            <Stack direction="row" spacing={3} alignItems="center">
              <Avatar sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: '#1976D2',
                fontSize: '1.5rem'
              }}>
                {getAvatarInitials(employee.FirstName, employee.LastName)}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={600} color="#101010">
                  {employee.FirstName} {employee.LastName}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Employee ID: {employee.EmployeeID}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                  <Chip
                    label={getStatusText(employee.EmploymentStatus)}
                    size="small"
                    color={getStatusColor(employee.EmploymentStatus)}
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
                      },
                      '&.MuiChip-colorDefault': {
                        bgcolor: '#F5F5F5',
                        color: '#616161'
                      }
                    }}
                  />
                  <Chip
                    label={getGenderText(employee.Gender)}
                    size="small"
                    variant="outlined"
                  />
                </Stack>
              </Box>
            </Stack>
          </div>
          
          <Divider />
          
          <Stack spacing={2}>
            <Typography variant="subtitle1" fontWeight={600} color="#101010">
              Personal Information
            </Typography>
            <Stack direction="row" spacing={4}>
              <Stack spacing={1} flex={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Cake sx={{ color: 'text.secondary', fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Date of Birth
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(employee.DateOfBirth)}
                    </Typography>
                  </Box>
                </Stack>
                
                <Stack direction="row" spacing={1} alignItems="center">
                  <Email sx={{ color: 'text.secondary', fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Email
                    </Typography>
                    <Typography variant="body2">
                      {employee.Email}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
              
              <Stack spacing={1} flex={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Phone sx={{ color: 'text.secondary', fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Phone
                    </Typography>
                    <Typography variant="body2">
                      {employee.Phone || '-'}
                    </Typography>
                  </Box>
                </Stack>
                
                <Stack direction="row" spacing={1} alignItems="flex-start">
                  <Home sx={{ color: 'text.secondary', fontSize: 20, mt: 0.5 }} />
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Address
                    </Typography>
                    <Typography variant="body2">
                      {employee.Address || '-'}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
          
          <Divider />
          
          <Stack spacing={2}>
            <Typography variant="subtitle1" fontWeight={600} color="#101010">
              Employment Information
            </Typography>
            <Stack direction="row" spacing={4}>
              <Stack spacing={1} flex={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Business sx={{ color: 'text.secondary', fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Department
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {employee.DepartmentID?.DepartmentName || '-'}
                    </Typography>
                  </Box>
                </Stack>
                
                <Stack direction="row" spacing={1} alignItems="center">
                  <Work sx={{ color: 'text.secondary', fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Designation
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {employee.DesignationID?.DesignationName || '-'}
                      {employee.DesignationID?.Level && (
                        <Typography variant="caption" color="textSecondary" display="block">
                          Level {employee.DesignationID.Level}
                        </Typography>
                      )}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
              
              <Stack spacing={1} flex={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Person sx={{ color: 'text.secondary', fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Date of Joining
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(employee.DateOfJoining)}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
          
          <Divider />
          
          <Stack spacing={2}>
            <Typography variant="subtitle1" fontWeight={600} color="#101010">
              System Information
            </Typography>
            <Stack direction="row" spacing={4}>
              <Stack spacing={1} flex={1}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Created At
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(employee.CreatedAt)}
                  </Typography>
                </Box>
              </Stack>
              
              <Stack spacing={1} flex={1}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(employee.UpdatedAt)}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
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
            backgroundColor: '#1976D2',
            '&:hover': {
              backgroundColor: '#1565C0'
            }
          }}
        >
          Edit Employee
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewEmployees;