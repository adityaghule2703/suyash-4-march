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
  Box
} from '@mui/material';
import { Edit as EditIcon, CalendarToday, Info, CheckCircle, Cancel } from '@mui/icons-material';

const ViewLeaveTypes = ({ open, onClose, leaveType, onEdit }) => {
  if (!leaveType) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
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
          Leave Type Details
        </div>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={3}>
          {/* Add padding from top for the first field */}
          <div style={{ marginTop: '16px' }}>
            <Stack spacing={1}>
              <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                Leave Type Name
              </Typography>
              <Typography variant="h6" fontWeight={600} color="#101010">
                {leaveType.Name}
              </Typography>
            </Stack>
          </div>
          
          <Divider />
          
          <Stack spacing={2}>
            <Stack direction="row" spacing={4}>
              <Stack spacing={1} flex={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CalendarToday sx={{ color: 'text.secondary', fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Maximum Days Per Year
                    </Typography>
                    <Typography variant="h5" fontWeight={600} color="primary">
                      {leaveType.MaxDaysPerYear} days
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
              
              <Stack spacing={1} flex={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  {leaveType.IsActive ? (
                    <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
                  ) : (
                    <Cancel sx={{ color: 'error.main', fontSize: 20 }} />
                  )}
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Status
                    </Typography>
                    <Chip
                      label={leaveType.IsActive ? 'Active' : 'Inactive'}
                      size="small"
                      color={leaveType.IsActive ? 'success' : 'default'}
                      sx={{ 
                        fontWeight: 500,
                        '&.MuiChip-colorSuccess': {
                          bgcolor: '#E8F5E9',
                          color: '#2E7D32'
                        },
                        '&.MuiChip-colorDefault': {
                          bgcolor: '#F5F5F5',
                          color: '#616161'
                        }
                      }}
                    />
                  </Box>
                </Stack>
              </Stack>
            </Stack>
            
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <Info sx={{ color: 'text.secondary', fontSize: 20, mt: 0.5 }} />
                <Box flex={1}>
                  <Typography variant="caption" color="textSecondary">
                    Description
                  </Typography>
                  <Typography variant="body1" color="textPrimary" sx={{ 
                    backgroundColor: '#F8FAFC',
                    p: 2,
                    borderRadius: 1,
                    minHeight: '80px',
                    mt: 0.5
                  }}>
                    {leaveType.Description || 'No description provided'}
                  </Typography>
                </Box>
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
                  <Typography variant="body2" color="textPrimary">
                    {formatDate(leaveType.CreatedAt)}
                  </Typography>
                </Box>
              </Stack>
              
              <Stack spacing={1} flex={1}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body2" color="textPrimary">
                    {formatDate(leaveType.UpdatedAt)}
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
        {/* <Button
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
          Edit Leave Type
        </Button> */}
      </DialogActions>
    </Dialog>
  );
};

export default ViewLeaveTypes;