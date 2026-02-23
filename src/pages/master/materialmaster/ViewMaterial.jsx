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
import { Edit as EditIcon, CheckCircle as CheckCircleIcon, Cancel as CancelIcon } from '@mui/icons-material';

const ViewMaterial = ({ open, onClose, material, onEdit }) => {
  if (!material) return null;

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
          Material Details
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
                  Material Code
                </Typography>
                <Typography variant="body1" fontWeight={600} sx={{ fontSize: '1rem' }}>
                  {material.MaterialCode}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                  Status
                </Typography>
                {material.IsActive ? (
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
                Material Name
              </Typography>
              <Typography variant="body1" fontWeight={500} sx={{ fontSize: '1rem' }}>
                {material.MaterialName}
              </Typography>
            </Stack>

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
                {material.Description || 'No description provided'}
              </Typography>
            </Stack>
          </Stack>

          <Divider />

          <Stack spacing={2}>
            <Typography variant="subtitle2" fontWeight={600} color="textPrimary">
              Physical Properties
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                    Density
                  </Typography>
                  <Typography variant="body1" color="textPrimary" sx={{ fontSize: '0.875rem' }}>
                    {material.Density} {material.Unit || ''}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                    Color
                  </Typography>
                  {material.Color ? (
                    <Chip
                      label={material.Color}
                      size="small"
                      sx={{
                        bgcolor: '#f8fafc',
                        color: '#475569',
                        border: '1px solid #e2e8f0',
                        fontWeight: 500,
                        maxWidth: 120
                      }}
                    />
                  ) : (
                    <Typography variant="body1" color="textPrimary" sx={{ fontSize: '0.875rem' }}>
                      Not specified
                    </Typography>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </Stack>

          <Divider />

          <Stack spacing={2}>
            <Typography variant="subtitle2" fontWeight={600} color="textPrimary">
              Specifications
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                    Standard
                  </Typography>
                  <Typography variant="body1" color="textPrimary" sx={{ fontSize: '0.875rem' }}>
                    {material.Standard || 'Not specified'}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                    Grade
                  </Typography>
                  <Typography variant="body1" color="textPrimary" sx={{ fontSize: '0.875rem' }}>
                    {material.Grade || 'Not specified'}
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
                {formatDate(material.createdAt)}
              </Typography>
            </Stack>
            
            <Stack spacing={1}>
              <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                Last Updated
              </Typography>
              <Typography variant="body2" color="textPrimary" sx={{ fontSize: '0.875rem' }}>
                {formatDate(material.updatedAt)}
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
          Edit Material
        </Button> */}
      </DialogActions>
    </Dialog>
  );
};

export default ViewMaterial;