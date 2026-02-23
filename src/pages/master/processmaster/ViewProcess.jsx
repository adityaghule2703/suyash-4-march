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
  Box,
  Avatar,
  Grid
} from '@mui/material';
import { 
  Edit as EditIcon, 
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  Factory as FactoryIcon,
  Business as BusinessIcon,
  CalendarToday,
  CheckCircle,
  Cancel,
  Description as DescriptionIcon,
  Category
} from '@mui/icons-material';

const ViewProcess = ({ open, onClose, process, onEdit }) => {
  if (!process) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProcessInitials = (processName) => {
    if (!processName) return 'P';
    
    const words = processName.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    
    return processName.substring(0, 2).toUpperCase();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
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
          Process Details
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
                bgcolor: '#4F46E5',
                fontSize: '1.5rem'
              }}>
                {getProcessInitials(process.ProcessName)}
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight={600} color="#101010">
                  {process.ProcessName}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
                  {process.IsActive ? (
                    <Chip
                      icon={<CheckCircle />}
                      label="Active"
                      size="small"
                      sx={{
                        bgcolor: '#E8F5E9',
                        color: '#2E7D32',
                        border: 'none',
                        fontWeight: 500,
                        '& .MuiChip-icon': {
                          color: '#2E7D32',
                          fontSize: 16
                        }
                      }}
                    />
                  ) : (
                    <Chip
                      icon={<Cancel />}
                      label="Inactive"
                      size="small"
                      sx={{
                        bgcolor: '#FEE2E2',
                        color: '#991B1B',
                        border: 'none',
                        fontWeight: 500,
                        '& .MuiChip-icon': {
                          color: '#991B1B',
                          fontSize: 16
                        }
                      }}
                    />
                  )}
                  <Chip
                    label={process.VendorOrInhouse}
                    icon={process.VendorOrInhouse === 'Vendor' ? <BusinessIcon /> : <FactoryIcon />}
                    size="small"
                    sx={{ 
                      fontWeight: 500,
                      bgcolor: process.VendorOrInhouse === 'Vendor' ? '#FEF3C7' : '#DBEAFE',
                      color: process.VendorOrInhouse === 'Vendor' ? '#92400E' : '#1E40AF',
                      border: 'none',
                      '& .MuiChip-icon': {
                        color: process.VendorOrInhouse === 'Vendor' ? '#92400E' : '#1E40AF',
                        fontSize: 16
                      }
                    }}
                  />
                </Stack>
              </Box>
            </Stack>
          </div>
          
          <Divider />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Typography variant="subtitle1" fontWeight={600} color="#101010">
                  <MoneyIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Rate Information
                </Typography>
                
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Rate Type
                    </Typography>
                    <Typography variant="body1" fontWeight={500} sx={{ mt: 0.5 }}>
                      {process.RateType}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Process Rate
                    </Typography>
                    <Typography variant="h4" fontWeight={700} color="#1976D2" sx={{ mt: 0.5 }}>
                      {formatCurrency(process.Rate)}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.5 }}>
                      per {process.RateType.toLowerCase().replace('per ', '')}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Process Type
                    </Typography>
                    <Typography variant="body1" fontWeight={500} sx={{ mt: 0.5 }}>
                      {process.VendorOrInhouse === 'Vendor' ? 'External Vendor Process' : 'In-house Manufacturing'}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Typography variant="subtitle1" fontWeight={600} color="#101010">
                  <DescriptionIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Description
                </Typography>
                
                <Box sx={{ 
                  backgroundColor: '#F8FAFC',
                  p: 2,
                  borderRadius: 1,
                  minHeight: '120px'
                }}>
                  <Typography variant="body2" color="textPrimary">
                    {process.Description || 'No description available for this process.'}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
          
          <Divider />
          
          <Stack spacing={2}>
            <Typography variant="subtitle1" fontWeight={600} color="#101010">
              <Category sx={{ mr: 1, verticalAlign: 'middle' }} />
              Additional Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Process ID
                  </Typography>
                  <Typography variant="body2">
                    {process._id || 'Not available'}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Last Modified By
                  </Typography>
                  <Typography variant="body2">
                    {process.UpdatedBy || 'System'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Stack>
          
          <Divider />
          
          <Stack spacing={2}>
            <Typography variant="subtitle1" fontWeight={600} color="#101010">
              <CalendarToday sx={{ mr: 1, verticalAlign: 'middle' }} />
              System Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Created At
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(process.CreatedAt)}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(process.UpdatedAt)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
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
          Edit Process
        </Button> */}
      </DialogActions>
    </Dialog>
  );
};

export default ViewProcess;