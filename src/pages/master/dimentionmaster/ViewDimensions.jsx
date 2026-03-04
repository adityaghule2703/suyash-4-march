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
  Height as HeightIcon,
  WidthWide as WidthIcon,
  Straighten as StraightenIcon,
  Scale as ScaleIcon,
  CalendarToday,
  Inventory,
  Category,
  ViewModule as PitchIcon,
  GridView as CavityIcon,
  SpaceDashboard as StripIcon
} from '@mui/icons-material';

const ViewDimensions = ({ open, onClose, dimension, onEdit }) => {
  if (!dimension) return null;

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

  const calculateVolume = () => {
    const thicknessM = dimension.Thickness / 1000;
    const widthM = dimension.Width / 1000;
    const lengthM = dimension.Length / 1000;
    return thicknessM * widthM * lengthM;
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
          Dimension Weight Details
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
                {getPartInitials(dimension.PartNo)}
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight={600} color="#101010">
                  {dimension.PartNo}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1, flexWrap: 'wrap', gap: 1 }}>
                  {dimension.Item && (
                    <Chip
                      label={dimension.Item.PartName}
                      size="small"
                      sx={{ 
                        fontWeight: 500,
                        bgcolor: '#E3F2FD',
                        color: '#1976D2',
                        border: 'none'
                      }}
                    />
                  )}
                  <Chip
                    label={`Weight: ${dimension.WeightInKG} kg`}
                    size="small"
                    sx={{ 
                      fontWeight: 500,
                      bgcolor: '#E8F5E9',
                      color: '#2E7D32',
                      border: 'none'
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
                  <StraightenIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Dimensions
                </Typography>
                
                <Box sx={{ 
                  border: '1px solid #E0E0E0',
                  borderRadius: 2,
                  p: 2,
                  backgroundColor: '#F8FAFC'
                }}>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                        Thickness
                      </Typography>
                      <Typography variant="h6" color="#4F46E5" fontWeight={600} sx={{ mt: 0.5 }}>
                        {dimension.Thickness} mm
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                        Width
                      </Typography>
                      <Typography variant="h6" color="#10B981" fontWeight={600} sx={{ mt: 0.5 }}>
                        {dimension.Width} mm
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                        Length
                      </Typography>
                      <Typography variant="h6" color="#F59E0B" fontWeight={600} sx={{ mt: 0.5 }}>
                        {dimension.Length} mm
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Typography variant="subtitle1" fontWeight={600} color="#101010">
                  <ScaleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Material & Weight
                </Typography>
                
                <Box sx={{ 
                  border: '1px solid #E0E0E0',
                  borderRadius: 2,
                  p: 2,
                  backgroundColor: '#F8FAFC'
                }}>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                        Density
                      </Typography>
                      <Typography variant="h5" color="#2E7D32" fontWeight={700} sx={{ mt: 0.5 }}>
                        {dimension.Density} g/cm³
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                        Calculated Weight
                      </Typography>
                      <Typography variant="h4" color="#101010" fontWeight={800} sx={{ mt: 0.5 }}>
                        {dimension.WeightInKG} kg
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                        Volume
                      </Typography>
                      <Typography variant="body2" color="textPrimary" sx={{ mt: 0.5 }}>
                        {calculateVolume().toFixed(8)} m³
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Stack>
            </Grid>
          </Grid>
          
          {/* New Section: Manufacturing Details */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} color="#101010" sx={{ mb: 2 }}>
              <Category sx={{ mr: 1, verticalAlign: 'middle' }} />
              Manufacturing Details
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ 
                  border: '1px solid #E0E0E0',
                  borderRadius: 2,
                  p: 2,
                  backgroundColor: '#F8FAFC'
                }}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <PitchIcon sx={{ color: '#8B5CF6' }} />
                    <Typography variant="body2" fontWeight={600} color="#8B5CF6">
                      Pitch
                    </Typography>
                  </Stack>
                  <Typography variant="h5" fontWeight={700} color="#101010">
                    {dimension.Pitch || '—'}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Box sx={{ 
                  border: '1px solid #E0E0E0',
                  borderRadius: 2,
                  p: 2,
                  backgroundColor: '#F8FAFC'
                }}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <CavityIcon sx={{ color: '#EC4899' }} />
                    <Typography variant="body2" fontWeight={600} color="#EC4899">
                      No. of Cavities
                    </Typography>
                  </Stack>
                  <Typography variant="h5" fontWeight={700} color="#101010">
                    {dimension.NoOfCavity || '—'}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Box sx={{ 
                  border: '1px solid #E0E0E0',
                  borderRadius: 2,
                  p: 2,
                  backgroundColor: '#F8FAFC'
                }}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <StripIcon sx={{ color: '#6366F1' }} />
                    <Typography variant="body2" fontWeight={600} color="#6366F1">
                      Strip Size
                    </Typography>
                  </Stack>
                  <Typography variant="h5" fontWeight={700} color="#101010">
                    {dimension.StripSize || '—'} mm
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
          
          {dimension.Item && (
            <>
              <Divider />
              
              <Stack spacing={2}>
                <Typography variant="subtitle1" fontWeight={600} color="#101010">
                  <Inventory sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Item Information
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                        Part Name
                      </Typography>
                      <Typography variant="body1" fontWeight={500} sx={{ mt: 0.5 }}>
                        {dimension.Item.PartName}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                        Description
                      </Typography>
                      <Typography variant="body2" color="textPrimary" sx={{ mt: 0.5 }}>
                        {dimension.Item.Description || 'No description'}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  {dimension.Item.MaterialID && (
                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="subtitle2" fontWeight={600} color="#101010" sx={{ mb: 2 }}>
                        <Category sx={{ mr: 1, verticalAlign: 'middle', fontSize: 20 }} />
                        Material Information
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <Box>
                            <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                              Material Code
                            </Typography>
                            <Typography variant="body2" fontWeight={500} sx={{ mt: 0.5 }}>
                              {dimension.Item.MaterialID.MaterialCode}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Box>
                            <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                              Material Name
                            </Typography>
                            <Typography variant="body2" fontWeight={500} sx={{ mt: 0.5 }}>
                              {dimension.Item.MaterialID.MaterialName}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Box>
                            <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                              Material Density
                            </Typography>
                            <Typography variant="body2" fontWeight={500} sx={{ mt: 0.5 }}>
                              {dimension.Item.MaterialID.Density} g/cm³
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
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
              <Category sx={{ mr: 1, verticalAlign: 'middle' }} />
              Additional Information
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                    Dimension ID
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {dimension._id || 'Not available'}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                    Part Number
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {dimension.PartNo}
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
                    {formatDate(dimension.CreatedAt)}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                    Last Updated
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {formatDate(dimension.UpdatedAt)}
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
      </DialogActions>
    </Dialog>
  );
};

export default ViewDimensions;