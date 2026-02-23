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
  Business, 
  LocationOn, 
  Email, 
  Phone, 
  AccountBalance,
  Receipt,
  AccountBalanceWallet
} from '@mui/icons-material';

const ViewCompanies = ({ open, onClose, company, onEdit }) => {
  if (!company) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          Company Details
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
                {getCompanyInitials(company.CompanyName)}
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight={600} color="#101010">
                  {company.CompanyName}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
                  <Chip
                    label={company.IsActive ? 'Active' : 'Inactive'}
                    size="small"
                    color={company.IsActive ? 'success' : 'default'}
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
                  <Typography variant="body2" color="textSecondary">
                    {company.State} (Code: {company.StateCode})
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </div>
          
          <Divider />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Typography variant="subtitle1" fontWeight={600} color="#101010">
                  <Business sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Company Information
                </Typography>
                
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} alignItems="flex-start">
                    <LocationOn sx={{ color: 'text.secondary', fontSize: 20, mt: 0.5 }} />
                    <Box flex={1}>
                      <Typography variant="caption" color="textSecondary">
                        Address
                      </Typography>
                      <Typography variant="body2">
                        {company.Address}
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
                        {company.Email}
                      </Typography>
                    </Box>
                  </Stack>
                  
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Phone sx={{ color: 'text.secondary', fontSize: 20 }} />
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Phone
                      </Typography>
                      <Typography variant="body2">
                        {company.Phone || '-'}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Typography variant="subtitle1" fontWeight={600} color="#101010">
                  <Receipt sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Tax Information
                </Typography>
                
                <Stack spacing={1}>
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      GSTIN
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {company.GSTIN}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      PAN
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {company.PAN}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
          
          <Divider />
          
          <Stack spacing={2}>
            <Typography variant="subtitle1" fontWeight={600} color="#101010">
              <AccountBalance sx={{ mr: 1, verticalAlign: 'middle' }} />
              Bank Details
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Bank Name
                  </Typography>
                  <Typography variant="body2">
                    {company.BankName || '-'}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Account Number
                  </Typography>
                  <Typography variant="body2">
                    {company.AccountNo || '-'}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    IFSC Code
                  </Typography>
                  <Typography variant="body2">
                    {company.IFSC || '-'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Stack>
          
          <Divider />
          
          <Stack spacing={2}>
            <Typography variant="subtitle1" fontWeight={600} color="#101010">
              <AccountBalanceWallet sx={{ mr: 1, verticalAlign: 'middle' }} />
              System Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Created At
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(company.CreatedAt)}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(company.UpdatedAt)}
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
          Edit Company
        </Button> */}
      </DialogActions>
    </Dialog>
  );
};

export default ViewCompanies;