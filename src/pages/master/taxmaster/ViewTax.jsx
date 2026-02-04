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
  Grid,
  Box
} from '@mui/material';
import { Edit as EditIcon, CheckCircle as CheckCircleIcon, Cancel as CancelIcon, Percent as PercentIcon } from '@mui/icons-material';

const ViewTax = ({ open, onClose, tax, onEdit }) => {
  if (!tax) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate CGST and SGST if not provided
  const calculateTaxPercentages = (gstPercentage) => {
    const half = gstPercentage / 2;
    return {
      cgst: half,
      sgst: half,
      igst: gstPercentage
    };
  };

  const taxPercentages = calculateTaxPercentages(tax.GSTPercentage);

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
        backgroundColor: '#F8FAFC',
        pt: 3,
        px: 3
      }}>
        <div style={{ 
          fontSize: '20px', 
          fontWeight: '600', 
          color: '#101010'
        }}>
          Tax Details
        </div>
      </DialogTitle>
      
      <DialogContent sx={{ 
        pt: 4,
        px: 3,
        pb: 2
      }}>
        <Stack spacing={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                  HSN Code
                </Typography>
                <Typography variant="body1" fontWeight={600} sx={{ fontSize: '1rem' }}>
                  {tax.HSNCode}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                  Status
                </Typography>
                {tax.IsActive ? (
                  <Chip
                    icon={<CheckCircleIcon />}
                    label="Active"
                    size="small"
                    sx={{
                      bgcolor: '#dcfce7',
                      color: '#166534',
                      border: '1px solid #86efac',
                      fontWeight: 500,
                      width: 'fit-content',
                      '& .MuiChip-icon': {
                        color: '#166534',
                        fontSize: 14
                      }
                    }}
                  />
                ) : (
                  <Chip
                    icon={<CancelIcon />}
                    label="Inactive"
                    size="small"
                    sx={{
                      bgcolor: '#fee2e2',
                      color: '#991b1b',
                      border: '1px solid #fca5a5',
                      fontWeight: 500,
                      width: 'fit-content',
                      '& .MuiChip-icon': {
                        color: '#991b1b',
                        fontSize: 14
                      }
                    }}
                  />
                )}
              </Stack>
            </Grid>
          </Grid>

          <Divider />

          <Stack spacing={2}>
            <Stack spacing={1}>
              <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                Description
              </Typography>
              <Typography variant="body1" color="textPrimary" sx={{ 
                fontSize: '0.875rem',
                backgroundColor: '#F8FAFC',
                p: 2,
                borderRadius: 1,
                minHeight: '80px'
              }}>
                {tax.Description || 'No description provided'}
              </Typography>
            </Stack>
          </Stack>

          <Divider />

          <Stack spacing={2}>
            <Typography variant="subtitle2" fontWeight={600} color="textPrimary">
              GST Tax Rates
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Stack spacing={1}>
                  <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                    GST Percentage
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      icon={<PercentIcon />}
                      label={`${tax.GSTPercentage}%`}
                      size="small"
                      color="primary"
                      sx={{
                        fontWeight: 600,
                        '& .MuiChip-icon': {
                          fontSize: 12
                        }
                      }}
                    />
                    <Typography variant="body1" color="textPrimary" sx={{ fontSize: '0.875rem' }}>
                      Total GST
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Stack spacing={1}>
                  <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                    CGST Percentage
                  </Typography>
                  <Typography variant="body1" color="textPrimary" sx={{ fontSize: '0.875rem' }}>
                    {tax.CGSTPercentage || taxPercentages.cgst}%
                  </Typography>
                </Stack>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Stack spacing={1}>
                  <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                    SGST Percentage
                  </Typography>
                  <Typography variant="body1" color="textPrimary" sx={{ fontSize: '0.875rem' }}>
                    {tax.SGSTPercentage || taxPercentages.sgst}%
                  </Typography>
                </Stack>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Stack spacing={1}>
                  <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                    IGST Percentage
                  </Typography>
                  <Typography variant="body1" color="textPrimary" sx={{ fontSize: '0.875rem' }}>
                    {tax.IGSTPercentage || taxPercentages.igst}%
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Stack>

          <Divider />

          <Stack spacing={2}>
            <Typography variant="subtitle2" fontWeight={600} color="textPrimary">
              System Information
            </Typography>
            
            <Stack spacing={1}>
              <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                Created At
              </Typography>
              <Typography variant="body2" color="textPrimary" sx={{ fontSize: '0.875rem' }}>
                {formatDate(tax.CreatedAt)}
              </Typography>
            </Stack>
            
            <Stack spacing={1}>
              <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                Last Updated
              </Typography>
              <Typography variant="body2" color="textPrimary" sx={{ fontSize: '0.875rem' }}>
                {formatDate(tax.UpdatedAt)}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>
      
      <DialogActions sx={{ 
        px: 3, 
        pb: 3, 
        pt: 2,
        borderTop: '1px solid #E0E0E0',
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
          Edit Tax
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewTax;