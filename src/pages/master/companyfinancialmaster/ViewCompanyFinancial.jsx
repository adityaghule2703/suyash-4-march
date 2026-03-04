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
  Grid,
  Paper
} from '@mui/material';
import { 
  Edit as EditIcon,
  Business as BusinessIcon,
  AccountBalance as AccountBalanceIcon,
  Percent as PercentIcon,
  Inventory as InventoryIcon,
  CreditCard as CreditCardIcon,
  CalendarToday,
  Recycling as RecyclingIcon
} from '@mui/icons-material';

const ViewCompanyFinancial = ({ open, onClose, financial, onEdit }) => {
  if (!financial) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDays = (days) => {
    if (days < 0) {
      return `${Math.abs(days)} days (Advance Payment)`;
    }
    return `${days} days`;
  };

  const formatPercentage = (value) => {
    return `${value}%`;
  };

  const formatDecimalAsPercentage = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getCompanyInitials = (companyName) => {
    if (!companyName) return 'C';
    
    const words = companyName.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    
    return companyName.substring(0, 2).toUpperCase();
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
          Company Financial Details
        </div>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={3}>
          {/* Header with Company Info */}
          <div style={{ marginTop: '16px' }}>
            <Stack direction="row" spacing={3} alignItems="center">
              <Avatar sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: '#4F46E5',
                fontSize: '1.5rem'
              }}>
                {getCompanyInitials(financial.CompanyID?.CompanyName)}
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight={600} color="#101010">
                  {financial.CompanyID?.CompanyName || 'N/A'}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }} flexWrap="wrap" gap={1}>
                  <Chip
                    icon={<BusinessIcon />}
                    label={`GST: ${financial.CompanyID?.GSTIN || 'N/A'}`}
                    size="small"
                    sx={{ bgcolor: '#F0F9FF', color: '#0369A1' }}
                  />
                  <Chip
                    label={`State: ${financial.CompanyID?.State || 'N/A'}`}
                    size="small"
                    sx={{ bgcolor: '#F0F9FF', color: '#0369A1' }}
                  />
                </Stack>
              </Box>
            </Stack>
          </div>
          
          <Divider />
          
          {/* Credit Terms Section */}
          <Paper variant="outlined" sx={{ p: 2, bgcolor: '#F8FAFC' }}>
            <Typography variant="subtitle1" fontWeight={600} color="#101010" gutterBottom>
              <CreditCardIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Credit Terms
            </Typography>
            
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'white', borderRadius: 1 }}>
                  <Typography variant="caption" color="textSecondary">
                    Credit on Input Material
                  </Typography>
                  <Typography variant="h6" fontWeight={600} color={financial.CreditOnInputMaterialDays < 0 ? '#B45309' : '#1976D2'}>
                    {formatDays(financial.CreditOnInputMaterialDays)}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'white', borderRadius: 1 }}>
                  <Typography variant="caption" color="textSecondary">
                    WIP/FG Inventory Days
                  </Typography>
                  <Typography variant="h6" fontWeight={600} color="#1976D2">
                    {formatDays(financial.WIPFGInventoryDays)}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'white', borderRadius: 1 }}>
                  <Typography variant="caption" color="textSecondary">
                    Credit Given to Customer
                  </Typography>
                  <Typography variant="h6" fontWeight={600} color="#1976D2">
                    {formatDays(financial.CreditGivenToCustomerDays)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Cost Parameters Section */}
          <Paper variant="outlined" sx={{ p: 2, bgcolor: '#F8FAFC' }}>
            <Typography variant="subtitle1" fontWeight={600} color="#101010" gutterBottom>
              <PercentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Cost Parameters
            </Typography>
            
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={4}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Cost of Capital
                  </Typography>
                  <Typography variant="h5" fontWeight={600} color="#1976D2">
                    {formatDecimalAsPercentage(financial.CostOfCapital)}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    OHP Percentage
                  </Typography>
                  <Typography variant="h5" fontWeight={600} color="#1976D2">
                    {formatPercentage(financial.OHPPercentage)}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Profit Percentage
                  </Typography>
                  <Typography variant="h5" fontWeight={600} color="#1976D2">
                    {formatPercentage(financial.ProfitPercentage)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Scrap Recovery Section */}
          <Paper variant="outlined" sx={{ p: 2, bgcolor: '#F8FAFC' }}>
            <Typography variant="subtitle1" fontWeight={600} color="#101010" gutterBottom>
              <RecyclingIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Scrap Recovery Parameters
            </Typography>
            
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Scrap Recovery Percentage
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="#059669">
                    {formatPercentage(financial.ScrapRecoveryPercentage)}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Effective Scrap Rate Multiplier
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="#059669">
                    {financial.EffectiveScrapRateMultiplier}x
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
          
          <Divider />
          
          {/* System Information */}
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
                    {formatDate(financial.createdAt || financial.CreatedAt)}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" display="block">
                    By: {financial.CreatedBy?.Username || 'System'}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(financial.updatedAt || financial.UpdatedAt)}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" display="block">
                    By: {financial.UpdatedBy?.Username || 'System'}
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
          Edit Financial Parameters
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewCompanyFinancial;