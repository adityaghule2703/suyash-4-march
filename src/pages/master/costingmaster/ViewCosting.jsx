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
  Percent as PercentIcon,
  Inventory as InventoryIcon,
  CalendarToday,
  CheckCircle,
  Cancel,
  Receipt
} from '@mui/icons-material';

const ViewCosting = ({ open, onClose, costing, onEdit }) => {
  if (!costing) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPartInitials = (partNo) => {
    if (!partNo) return 'PN';
    return partNo.substring(0, 2).toUpperCase();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Calculate cost breakdown percentages
  const calculateBreakdown = () => {
    const total = costing.FinalRate;
    return {
      rmPercentage: ((costing.RMCost / total) * 100).toFixed(1),
      processPercentage: ((costing.ProcessCost / total) * 100).toFixed(1),
      finishingPercentage: ((costing.FinishingCost / total) * 100).toFixed(1),
      packingPercentage: ((costing.PackingCost / total) * 100).toFixed(1),
      overheadPercentage: ((costing.OverheadCost / total) * 100).toFixed(1),
      marginPercentage: ((costing.MarginCost / total) * 100).toFixed(1)
    };
  };

  const breakdown = calculateBreakdown();

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
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
          Costing Details
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
                {getPartInitials(costing.PartNo)}
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight={600} color="#101010">
                  {costing.PartNo}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
                  {costing.ItemID && (
                    <Chip
                      label={costing.ItemID.PartName}
                      size="small"
                      sx={{ 
                        fontWeight: 500,
                        bgcolor: '#E3F2FD',
                        color: '#1976D2',
                        border: 'none'
                      }}
                    />
                  )}
                  {costing.IsActive ? (
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
                </Stack>
              </Box>
            </Stack>
          </div>
          
          <Divider />
          
          {/* Final Rate - Simplified like other components */}
          <Box>
            <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
              FINAL RATE
            </Typography>
            <Typography variant="h3" fontWeight={700} color="#059669" sx={{ mt: 0.5 }}>
              {formatCurrency(costing.FinalRate)}
            </Typography>
            <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.5 }}>
              Selling Price per {costing.ItemID?.Unit || 'Unit'}
            </Typography>
          </Box>
          
          <Divider />
          
          {/* Cost Breakdown */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Typography variant="subtitle1" fontWeight={600} color="#101010">
                  <MoneyIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Cost Components
                </Typography>
                
                <Box sx={{ 
                  border: '1px solid #E0E0E0',
                  borderRadius: 2,
                  p: 2,
                  backgroundColor: '#F8FAFC'
                }}>
                  <Stack spacing={2}>
                    <Box>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                        <Typography variant="body2" color="textSecondary">
                          Raw Material Cost
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {formatCurrency(costing.RMCost)} ({breakdown.rmPercentage}%)
                        </Typography>
                      </Stack>
                      <Box sx={{ 
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: '#FEE2E2',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <Box sx={{ 
                          width: `${breakdown.rmPercentage}%`,
                          height: '100%',
                          backgroundColor: '#EF4444',
                          borderRadius: 3
                        }} />
                      </Box>
                    </Box>
                    
                    <Box>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                        <Typography variant="body2" color="textSecondary">
                          Process Cost
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {formatCurrency(costing.ProcessCost)} ({breakdown.processPercentage}%)
                        </Typography>
                      </Stack>
                      <Box sx={{ 
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: '#FEF3C7',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <Box sx={{ 
                          width: `${breakdown.processPercentage}%`,
                          height: '100%',
                          backgroundColor: '#D97706',
                          borderRadius: 3
                        }} />
                      </Box>
                    </Box>
                    
                    <Box>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                        <Typography variant="body2" color="textSecondary">
                          Finishing Cost
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {formatCurrency(costing.FinishingCost)} ({breakdown.finishingPercentage}%)
                        </Typography>
                      </Stack>
                      <Box sx={{ 
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: '#DBEAFE',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <Box sx={{ 
                          width: `${breakdown.finishingPercentage}%`,
                          height: '100%',
                          backgroundColor: '#3B82F6',
                          borderRadius: 3
                        }} />
                      </Box>
                    </Box>
                    
                    <Box>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                        <Typography variant="body2" color="textSecondary">
                          Packing Cost
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {formatCurrency(costing.PackingCost)} ({breakdown.packingPercentage}%)
                        </Typography>
                      </Stack>
                      <Box sx={{ 
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: '#E0E7FF',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <Box sx={{ 
                          width: `${breakdown.packingPercentage}%`,
                          height: '100%',
                          backgroundColor: '#8B5CF6',
                          borderRadius: 3
                        }} />
                      </Box>
                    </Box>
                  </Stack>
                </Box>
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Typography variant="subtitle1" fontWeight={600} color="#101010">
                  <PercentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Margin & Overhead
                </Typography>
                
                <Box sx={{ 
                  border: '1px solid #E0E0E0',
                  borderRadius: 2,
                  p: 2,
                  backgroundColor: '#F8FAFC'
                }}>
                  <Stack spacing={2}>
                    <Box>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" color="textSecondary">
                          Sub Total (Direct Costs)
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {formatCurrency(costing.SubCost)}
                        </Typography>
                      </Stack>
                    </Box>
                    
                    <Box>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                        <Typography variant="body2" color="textSecondary">
                          Overhead ({costing.OverheadPercentage}%)
                        </Typography>
                        <Typography variant="body2" fontWeight={600} color="#7C3AED">
                          + {formatCurrency(costing.OverheadCost)} ({breakdown.overheadPercentage}%)
                        </Typography>
                      </Stack>
                      <Box sx={{ 
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: '#F3E8FF',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <Box sx={{ 
                          width: `${breakdown.overheadPercentage}%`,
                          height: '100%',
                          backgroundColor: '#7C3AED',
                          borderRadius: 3
                        }} />
                      </Box>
                    </Box>
                    
                    <Box>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                        <Typography variant="body2" color="textSecondary">
                          Margin ({costing.MarginPercentage}%)
                        </Typography>
                        <Typography variant="body2" fontWeight={600} color="#059669">
                          + {formatCurrency(costing.MarginCost)} ({breakdown.marginPercentage}%)
                        </Typography>
                      </Stack>
                      <Box sx={{ 
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: '#DCFCE7',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <Box sx={{ 
                          width: `${breakdown.marginPercentage}%`,
                          height: '100%',
                          backgroundColor: '#059669',
                          borderRadius: 3
                        }} />
                      </Box>
                    </Box>
                    
                    <Box sx={{ 
                      pt: 2, 
                      borderTop: '2px solid #E5E7EB',
                      mt: 1
                    }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body1" fontWeight={700} color="#101010">
                          Final Rate
                        </Typography>
                        <Typography variant="h5" fontWeight={800} color="#059669">
                          {formatCurrency(costing.FinalRate)}
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                </Box>
              </Stack>
            </Grid>
          </Grid>
          
          {/* Item Information */}
          {costing.ItemID && (
            <>
              <Divider />
              
              <Stack spacing={2}>
                <Typography variant="subtitle1" fontWeight={600} color="#101010">
                  <InventoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Item Information
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                        Part Details
                      </Typography>
                      <Typography variant="body1" fontWeight={500} sx={{ mt: 0.5 }}>
                        {costing.ItemID.PartName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                        Unit: {costing.ItemID.Unit}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  {costing.ItemID.MaterialID && (
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                          Material Information
                        </Typography>
                        <Typography variant="body1" fontWeight={500} sx={{ mt: 0.5 }}>
                          {costing.ItemID.MaterialID.MaterialName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                          Code: {costing.ItemID.MaterialID.MaterialCode} • Density: {costing.ItemID.MaterialID.Density} g/cm³
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Stack>
            </>
          )}
          
          <Divider />
          
          {/* Additional Information */}
          <Stack spacing={2}>
            <Typography variant="subtitle1" fontWeight={600} color="#101010">
              <Receipt sx={{ mr: 1, verticalAlign: 'middle' }} />
              Additional Information
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                    Costing ID
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {costing._id || 'Not available'}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                    Version
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {costing.Version || '1.0'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Stack>
          
          <Divider />
          
          {/* System Information */}
          <Stack spacing={2}>
            <Typography variant="subtitle1" fontWeight={600} color="#101010">
              <CalendarToday sx={{ mr: 1, verticalAlign: 'middle' }} />
              System Information
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                    Created At
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {formatDate(costing.CreatedAt)}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                    Last Updated
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {formatDate(costing.UpdatedAt)}
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
          Edit Costing
        </Button> */}
      </DialogActions>
    </Dialog>
  );
};

export default ViewCosting;