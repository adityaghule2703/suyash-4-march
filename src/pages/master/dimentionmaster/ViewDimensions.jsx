import React from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  Paper,
  Grid,
  Avatar,
  styled,
} from '@mui/material';
import {
  Edit as EditIcon,
  Height as HeightIcon,
  WidthWide as WidthIcon,
  Straighten as StraightenIcon,
  Scale as ScaleIcon,
  CalendarToday,
  Inventory,
  Close as CloseIcon,
} from '@mui/icons-material';

// Color constants
const HEADER_GRADIENT = 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)';
const PRIMARY_BLUE = '#00B4D8';

const ViewDimensions = ({ open, onClose, dimension, onEdit }) => {
  if (!dimension) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
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

  // Helper function to render field with icon
  const renderField = (icon, label, value, color = '#0f172a') => (
    <Stack direction="row" spacing={1} alignItems="flex-start">
      <Box sx={{ color: PRIMARY_BLUE, mt: 0.3, minWidth: 20 }}>
        {icon}
      </Box>
      <Box>
        <Typography 
          variant="caption" 
          sx={{ 
            color: '#64748B', 
            display: 'block', 
            fontSize: '10px',
            fontWeight: 500,
            lineHeight: 1.2,
            mb: 0.2
          }}
        >
          {label}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 600, 
            fontSize: '13px',
            color: color,
            wordBreak: 'break-word'
          }}
        >
          {value || '-'}
        </Typography>
      </Box>
    </Stack>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 1.5,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          height: 'auto',
          maxHeight: '520px'
        }
      }}
    >
      {/* Header with Gradient */}
      <Box sx={{ 
        background: HEADER_GRADIENT,
        py: 1.5,
        px: 2
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" alignItems="center" spacing={1}>
            <StraightenIcon sx={{ color: '#FFFFFF', fontSize: 20 }} />
            <Typography variant="subtitle1" sx={{ 
              fontWeight: 600, 
              color: '#FFFFFF',
              fontSize: '1rem'
            }}>
              Dimension Weight Details
            </Typography>
          </Stack>
          <Chip
            label={`Part: ${dimension.PartNo || '-'}`}
            size="small"
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: '#FFFFFF',
              fontWeight: 500,
              fontSize: '10px',
              height: '20px',
              backdropFilter: 'blur(4px)',
              '& .MuiChip-label': { px: 1 }
            }}
          />
        </Stack>
      </Box>

      <DialogContent sx={{ 
        p: 2,
        '&:last-child': {
          pb: 2
        }
      }}>
        <Stack spacing={2}>
          {/* Part Profile */}
          <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
            <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 2 }}>
              <Avatar 
                sx={{ 
                  width: 70, 
                  height: 70, 
                  bgcolor: PRIMARY_BLUE,
                  fontSize: '1.8rem',
                  fontWeight: 600,
                  border: '2px solid #E0E0E0'
                }}
              >
                {getPartInitials(dimension.PartNo)}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={600} color="#101010" sx={{ fontSize: '1.1rem' }}>
                  {dimension.PartNo}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1, flexWrap: 'wrap', gap: 1 }}>
                  <Chip
                    label={dimension.WeightFormatted || `${dimension.WeightInKG} kg`}
                    size="small"
                    sx={{
                      bgcolor: '#E8F5E9',
                      color: '#2E7D32',
                      border: '1px solid #A5D6A7',
                      fontWeight: 600,
                      fontSize: '11px',
                      height: '22px',
                    }}
                  />
                  {dimension.DimensionsFormatted && (
                    <Chip
                      label={dimension.DimensionsFormatted}
                      size="small"
                      sx={{
                        bgcolor: '#E3F2FD',
                        color: '#1976D2',
                        border: '1px solid #90CAF9',
                        fontWeight: 600,
                        fontSize: '11px',
                        height: '22px',
                      }}
                    />
                  )}
                </Stack>
              </Box>
            </Stack>
          </Paper>

          {/* Dimensions Section */}
          <Paper sx={{ p: 1.5, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
            <Typography variant="subtitle2" sx={{ color: PRIMARY_BLUE, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
              <StraightenIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Dimensions
            </Typography>
            
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 4 }}>
                {renderField(
                  <HeightIcon sx={{ fontSize: 16 }} />, 
                  'Thickness', 
                  `${dimension.Thickness} mm`,
                  '#4F46E5'
                )}
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                {renderField(
                  <WidthIcon sx={{ fontSize: 16 }} />, 
                  'Width', 
                  `${dimension.Width} mm`,
                  '#10B981'
                )}
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                {renderField(
                  <StraightenIcon sx={{ fontSize: 16 }} />, 
                  'Length', 
                  `${dimension.Length} mm`,
                  '#F59E0B'
                )}
              </Grid>
            </Grid>
          </Paper>

          {/* Material & Weight Section */}
          <Paper sx={{ p: 1.5, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
            <Typography variant="subtitle2" sx={{ color: PRIMARY_BLUE, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
              <ScaleIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Material & Weight
            </Typography>
            
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 4 }}>
                {renderField(
                  <ScaleIcon sx={{ fontSize: 16 }} />, 
                  'Density', 
                  `${dimension.Density} g/cm³`,
                  '#2E7D32'
                )}
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                {renderField(
                  <ScaleIcon sx={{ fontSize: 16 }} />, 
                  'Weight', 
                  `${dimension.WeightInKG} kg`,
                  '#101010'
                )}
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                {renderField(
                  <Inventory sx={{ fontSize: 16 }} />, 
                  'Volume', 
                  dimension.VolumeMM3 ? `${dimension.VolumeMM3.toLocaleString()} mm³` : '-'
                )}
              </Grid>
            </Grid>
          </Paper>

          {/* Dimensions Formatted Section */}
          {dimension.DimensionsFormatted && (
            <Paper sx={{ p: 1.5, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: PRIMARY_BLUE, mb: 1, fontWeight: 600, fontSize: '0.8rem' }}>
                <StraightenIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Formatted Dimensions
              </Typography>
              
              <Box sx={{ 
                backgroundColor: '#F8FAFC', 
                p: 1.5, 
                borderRadius: 1,
                border: '1px solid #E0E0E0',
                textAlign: 'center'
              }}>
                <Typography variant="body2" fontWeight={600} sx={{ fontSize: '14px', color: '#4F46E5', fontFamily: 'monospace' }}>
                  {dimension.DimensionsFormatted}
                </Typography>
              </Box>
            </Paper>
          )}
        </Stack>
      </DialogContent>

      {/* Footer Actions */}
      <Box sx={{
        px: 2,
        py: 1.5,
        borderTop: '1px solid #E0E0E0',
        backgroundColor: '#F8FAFC'
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Button
            onClick={onClose}
            startIcon={<CloseIcon />}
            size="small"
            sx={{ color: '#666', fontSize: '0.8rem' }}
          >
            Close
          </Button>

          {onEdit && (
            <Button
              variant="contained"
              onClick={() => {
                onClose();
                onEdit();
              }}
              startIcon={<EditIcon />}
              size="small"
              sx={{
                backgroundColor: PRIMARY_BLUE,
                fontSize: '0.8rem',
                '&:hover': { backgroundColor: '#0e7490' }
              }}
            >
              Edit Dimensions
            </Button>
          )}
        </Stack>
      </Box>
    </Dialog>
  );
};

export default ViewDimensions;