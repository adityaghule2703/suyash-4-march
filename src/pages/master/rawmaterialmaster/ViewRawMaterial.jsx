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
  Inventory, 
  AttachMoney,
  TrendingUp,
  LocalShipping,
  CalendarToday,
  CheckCircle,
  Cancel
} from '@mui/icons-material';

const ViewRawMaterial = ({ open, onClose, material, onEdit }) => {
  if (!material) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getMaterialInitials = (materialName) => {
    if (!materialName) return 'M';
    
    const words = materialName.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    
    return materialName.substring(0, 2).toUpperCase();
  };

  const calculateEffectiveRate = () => {
    return material.RatePerKG + 
           (material.RatePerKG * material.ScrapPercentage / 100) + 
           (material.RatePerKG * material.TransportLossPercentage / 100);
  };

  const effectiveRate = calculateEffectiveRate();

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
          Raw Material Details
        </div>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={3}>
          <Stack direction="row" spacing={3} alignItems="center">
            <Avatar sx={{ 
              width: 80, 
              height: 80, 
              bgcolor: '#388E3C',
              fontSize: '1.5rem'
            }}>
              {getMaterialInitials(material.MaterialName)}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={600} color="#101010">
                {material.MaterialName}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
                <Chip
                  label={`Grade: ${material.Grade}`}
                  size="small"
                  sx={{ 
                    fontWeight: 500,
                    bgcolor: '#E3F2FD',
                    color: '#1976D2'
                  }}
                />
                <Chip
                  label={material.IsActive ? 'Active' : 'Inactive'}
                  size="small"
                  color={material.IsActive ? 'success' : 'default'}
                  icon={material.IsActive ? <CheckCircle /> : <Cancel />}
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
              </Stack>
            </Box>
          </Stack>
          
          <Divider />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Typography variant="subtitle1" fontWeight={600} color="#101010">
                  <Inventory sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Material Information
                </Typography>
                
                <Stack spacing={1.5}>
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Material ID
                    </Typography>
                    <Typography variant="body2" fontFamily="monospace">
                      {material._id}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Material Name
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {material.MaterialName}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Grade
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {material.Grade}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Typography variant="subtitle1" fontWeight={600} color="#101010">
                  <CalendarToday sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Validity & Status
                </Typography>
                
                <Stack spacing={1.5}>
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Date Effective
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(material.DateEffective)}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Status
                    </Typography>
                    <Typography variant="body2">
                      {material.IsActive ? (
                        <span style={{ color: '#2E7D32', fontWeight: 500 }}>
                          ● Active
                        </span>
                      ) : (
                        <span style={{ color: '#D32F2F', fontWeight: 500 }}>
                          ● Inactive
                        </span>
                      )}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
          
          <Divider />
          
          <Stack spacing={2}>
            <Typography variant="subtitle1" fontWeight={600} color="#101010">
              <AttachMoney sx={{ mr: 1, verticalAlign: 'middle' }} />
              Rate Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: '#F5F5F5', 
                  borderRadius: 1,
                  height: '100%'
                }}>
                  <Typography variant="caption" color="textSecondary">
                    Base Rate
                  </Typography>
                  <Typography variant="h6" color="#101010" fontWeight={600}>
                    {formatCurrency(material.RatePerKG)}/kg
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: '#E8F5E9', 
                  borderRadius: 1,
                  height: '100%'
                }}>
                  <Typography variant="caption" color="textSecondary">
                    Effective Rate
                  </Typography>
                  <Typography variant="h6" color="#2E7D32" fontWeight={700}>
                    {formatCurrency(effectiveRate)}/kg
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Stack>
          
          <Divider />
          
          <Stack spacing={2}>
            <Typography variant="subtitle1" fontWeight={600} color="#101010">
              <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
              Cost Factors
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: '#FFF3E0', 
                  borderRadius: 1,
                  border: '1px solid #FFE0B2'
                }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Inventory sx={{ color: '#FF9800' }} />
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Scrap Percentage
                      </Typography>
                      <Typography variant="h6" color="#FF9800" fontWeight={600}>
                        {material.ScrapPercentage}%
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Additional Cost: {formatCurrency(material.RatePerKG * material.ScrapPercentage / 100)}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: '#E8EAF6', 
                  borderRadius: 1,
                  border: '1px solid #C5CAE9'
                }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <LocalShipping sx={{ color: '#5C6BC0' }} />
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Transport Loss Percentage
                      </Typography>
                      <Typography variant="h6" color="#5C6BC0" fontWeight={600}>
                        {material.TransportLossPercentage}%
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Additional Cost: {formatCurrency(material.RatePerKG * material.TransportLossPercentage / 100)}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
            
            <Box sx={{ 
              p: 2, 
              bgcolor: '#F5F5F5', 
              borderRadius: 1,
              mt: 1
            }}>
              <Typography variant="subtitle2" fontWeight={600} color="#101010" gutterBottom>
                Total Additional Cost
              </Typography>
              <Typography variant="h5" color="#D32F2F" fontWeight={700}>
                {material.ScrapPercentage + material.TransportLossPercentage}%
                <Typography variant="body2" component="span" color="textSecondary" sx={{ ml: 1 }}>
                  ({formatCurrency(material.RatePerKG * (material.ScrapPercentage + material.TransportLossPercentage) / 100)})
                </Typography>
              </Typography>
            </Box>
          </Stack>
          
          <Divider />
          
          <Stack spacing={2}>
            <Typography variant="subtitle1" fontWeight={600} color="#101010">
              System Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Created At
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(material.CreatedAt)}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(material.UpdatedAt)}
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
          Edit Material
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewRawMaterial;