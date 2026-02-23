import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  Avatar,
  Stack,
  Box,
  Chip,
  Divider
} from '@mui/material';
import { 
  Delete as DeleteIcon,
  Warning as WarningIcon,
  Business,
  Work,
  Email,
  Phone,
  Badge
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Color constants - matching the EmployeeMaster
const HEADER_GRADIENT = 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)';
const PRIMARY_BLUE = '#00B4D8';

const DeleteEmployees = ({ open, onClose, employee, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!employee) return null;

  const getAvatarInitials = (firstName, lastName) => {
    const first = firstName ? firstName.charAt(0) : '';
    const last = lastName ? lastName.charAt(0) : '';
    return `${first}${last}`.toUpperCase() || 'U';
  };

  // Get avatar color based on name
  const getAvatarColor = (firstName) => {
    if (!firstName) return PRIMARY_BLUE;
    
    const colors = [
      '#164e63', // cyan-900
      '#0e7490', // cyan-700
      '#0891b2', // cyan-600
      '#0c4a6e', // blue-900
      '#1d4ed8', // blue-700
      '#7c3aed', // violet-600
      '#7e22ce', // purple-700
      '#be185d', // pink-700
      '#c2410c', // orange-700
      '#059669'  // emerald-600
    ];
    
    const charCode = firstName.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  // Get employment type text
  const getEmploymentTypeText = (type) => {
    switch(type) {
      case 'Monthly': return 'Monthly Salary';
      case 'Hourly': return 'Hourly Wage';
      case 'PieceRate': return 'Piece Rate';
      default: return type;
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch(status) {
      case 'active': return 'Active';
      case 'resigned': return 'Resigned';
      case 'terminated': return 'Terminated';
      case 'retired': return 'Retired';
      default: return status;
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'success';
      case 'resigned': return 'default';
      case 'terminated': return 'error';
      case 'retired': return 'warning';
      default: return 'default';
    }
  };

  const handleDelete = async () => {
    if (!employee?._id) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${BASE_URL}/api/employees/${employee._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        onDelete(employee._id);
        onClose();
      } else {
        setError(response.data.message || 'Failed to delete employee');
      }
    } catch (err) {
      console.error('Error deleting employee:', err);
      setError(err.response?.data?.message || 'Failed to delete employee. Please try again.');
    } finally {
      setLoading(false);
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
          borderRadius: 2,
          overflow: 'hidden'
        }
      }}
    >
      {/* Header with gradient background */}
      <DialogTitle sx={{
        background: HEADER_GRADIENT,
        py: 2.5,
        px: 3
      }}>
        <div style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <DeleteIcon sx={{ color: '#FFFFFF' }} />
          Confirm Delete
        </div>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, px: 3 }}>
        <div>
          {/* Employee Info Card */}
          <Stack 
            direction="row" 
            spacing={2} 
            alignItems="center" 
            sx={{ 
              mb: 3,
              p: 2,
              bgcolor: '#F8FAFC',
              borderRadius: 2,
              border: '1px solid #E0E0E0'
            }}
          >
            <Avatar
              sx={{
                width: 70,
                height: 70,
                bgcolor: getAvatarColor(employee?.FirstName),
                fontSize: '1.5rem',
                fontWeight: 600
              }}
            >
              {getAvatarInitials(employee?.FirstName, employee?.LastName)}
            </Avatar>
            <Box flex={1}>
              <Typography variant="h6" fontWeight={600} color="#101010">
                {employee?.FirstName} {employee?.LastName}
              </Typography>
              
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                <Badge fontSize="small" sx={{ color: '#64748B' }} />
                <Typography variant="body2" color="textSecondary">
                  ID: {employee?.EmployeeID || 'N/A'}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                <Chip
                  label={getEmploymentTypeText(employee?.EmploymentType)}
                  size="small"
                  sx={{ 
                    fontWeight: 500,
                    backgroundColor: '#dbeafe',
                    color: '#1e40af',
                    border: '1px solid #bfdbfe'
                  }}
                />
                <Chip
                  label={getStatusText(employee?.EmploymentStatus)}
                  size="small"
                  color={getStatusColor(employee?.EmploymentStatus)}
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
              </Stack>
            </Box>
          </Stack>

          {/* Department and Designation Info */}
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <Box sx={{ flex: 1, p: 1.5, bgcolor: '#F1F5F9', borderRadius: 1.5 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Business sx={{ fontSize: 18, color: '#64748B' }} />
                <Typography variant="body2" color="textSecondary">Department:</Typography>
              </Stack>
              <Typography variant="body2" fontWeight={600} sx={{ mt: 0.5, ml: 3.5 }}>
                {employee?.DepartmentID?.DepartmentName || 'N/A'}
              </Typography>
            </Box>
            <Box sx={{ flex: 1, p: 1.5, bgcolor: '#F1F5F9', borderRadius: 1.5 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Work sx={{ fontSize: 18, color: '#64748B' }} />
                <Typography variant="body2" color="textSecondary">Designation:</Typography>
              </Stack>
              <Typography variant="body2" fontWeight={600} sx={{ mt: 0.5, ml: 3.5 }}>
                {employee?.DesignationID?.DesignationName || 'N/A'}
                {employee?.DesignationID?.Level && ` (Level ${employee.DesignationID.Level})`}
              </Typography>
            </Box>
          </Stack>

          {/* Contact Info - Optional, only if available */}
          {(employee?.Email || employee?.Phone) && (
            <Box sx={{ mb: 3, p: 1.5, bgcolor: '#F1F5F9', borderRadius: 1.5 }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: '#1976D2' }}>
                Contact Information
              </Typography>
              <Stack direction="row" spacing={3}>
                {employee?.Email && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Email sx={{ fontSize: 16, color: '#64748B' }} />
                    <Typography variant="body2">{employee.Email}</Typography>
                  </Stack>
                )}
                {employee?.Phone && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Phone sx={{ fontSize: 16, color: '#64748B' }} />
                    <Typography variant="body2">{employee.Phone}</Typography>
                  </Stack>
                )}
              </Stack>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Warning Messages */}
          <Stack spacing={2}>
            <Typography variant="body1" sx={{ fontSize: '1rem', fontWeight: 500 }}>
              Are you sure you want to delete this employee?
            </Typography>
            
            <Alert 
              severity="warning" 
              icon={<WarningIcon />}
              sx={{ 
                borderRadius: 1.5,
                backgroundColor: '#FFF3E0',
                border: '1px solid #FFE0B2'
              }}
            >
              <Typography variant="body2" fontWeight={600} color="#F57C00">
                ⚠️ This action cannot be undone!
              </Typography>
              <Typography variant="body2" color="#F57C00" sx={{ mt: 0.5 }}>
                All employee records, including personal information, employment history, 
                bank details, and emergency contacts will be permanently deleted from the system.
              </Typography>
            </Alert>

            <Alert 
              severity="info"
              sx={{ 
                borderRadius: 1.5,
                backgroundColor: '#E3F2FD',
                border: '1px solid #BBDEFB'
              }}
            >
              <Typography variant="body2" color="#1976D2">
                ℹ️ Consider marking the employee as 'Resigned' or 'Terminated' instead of deleting,
                to maintain historical records.
              </Typography>
            </Alert>
          </Stack>

          {error && (
            <Alert
              severity="error"
              sx={{
                mt: 3,
                borderRadius: 1.5,
                '& .MuiAlert-icon': {
                  alignItems: 'center'
                }
              }}
            >
              {error}
            </Alert>
          )}
        </div>
      </DialogContent>

      <DialogActions sx={{
        px: 3,
        pb: 3,
        pt: 2,
        backgroundColor: '#F8FAFC',
        borderTop: '1px solid #E0E0E0'
      }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            borderRadius: 1.5,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 500,
            border: '1px solid #E0E0E0',
            color: '#64748B',
            '&:hover': {
              backgroundColor: '#F1F5F9'
            }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          disabled={loading}
          startIcon={loading ? null : <DeleteIcon />}
          sx={{
            borderRadius: 1.5,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 500,
            backgroundColor: '#D32F2F',
            '&:hover': {
              backgroundColor: '#C62828'
            },
            '&.Mui-disabled': {
              backgroundColor: '#FFCDD2'
            }
          }}
        >
          {loading ? 'Deleting...' : 'Permanently Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteEmployees;