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
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
  Scale as ScaleIcon,
  ColorLens as ColorIcon,
  Science as ScienceIcon,
  Badge as BadgeIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

// Color constants
const HEADER_GRADIENT = 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)';
const PRIMARY_BLUE = '#00B4D8';

const ViewMaterial = ({ open, onClose, material, onEdit }) => {
  if (!material) return null;

  const getMaterialInitials = (materialName) => {
    if (!materialName) return 'M';
    
    const words = materialName.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    
    return materialName.substring(0, 2).toUpperCase();
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
            <CategoryIcon sx={{ color: '#FFFFFF', fontSize: 20 }} />
            <Typography variant="subtitle1" sx={{ 
              fontWeight: 600, 
              color: '#FFFFFF',
              fontSize: '1rem'
            }}>
              Material Details
            </Typography>
          </Stack>
          <Chip
            label={`Code: ${material.MaterialCode || '-'}`}
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
          {/* Material Profile */}
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
                {getMaterialInitials(material.MaterialName)}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={600} color="#101010" sx={{ fontSize: '1.1rem' }}>
                  {material.MaterialName}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                  <Chip
                    icon={material.IsActive ? <CheckCircleIcon sx={{ fontSize: 14 }} /> : <CancelIcon sx={{ fontSize: 14 }} />}
                    label={material.IsActive ? 'Active' : 'Inactive'}
                    size="small"
                    sx={{
                      bgcolor: material.IsActive ? '#dcfce7' : '#fee2e2',
                      color: material.IsActive ? '#166534' : '#991b1b',
                      border: material.IsActive ? '1px solid #86efac' : '1px solid #fca5a5',
                      fontWeight: 600,
                      fontSize: '11px',
                      height: '22px',
                      '& .MuiChip-icon': { fontSize: 14 }
                    }}
                  />
                </Stack>
              </Box>
            </Stack>

            <Typography variant="subtitle2" sx={{ color: PRIMARY_BLUE, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
              Basic Information
            </Typography>
            
            <Grid container spacing={1}>
              <Grid size={{ xs: 12, sm: 6 }}>
                {renderField(
                  <BadgeIcon sx={{ fontSize: 16 }} />, 
                  'Material Code', 
                  material.MaterialCode
                )}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                {renderField(
                  <CategoryIcon sx={{ fontSize: 16 }} />, 
                  'Material Name', 
                  material.MaterialName,
                  PRIMARY_BLUE
                )}
              </Grid>
            </Grid>
          </Paper>

          {/* Description */}
          <Paper sx={{ p: 1.5, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
            <Typography variant="subtitle2" sx={{ color: PRIMARY_BLUE, mb: 1, fontWeight: 600, fontSize: '0.8rem' }}>
              <DescriptionIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Description
            </Typography>
            
            <Box sx={{ 
              backgroundColor: '#F8FAFC', 
              p: 1.5, 
              borderRadius: 1,
              border: '1px solid #E0E0E0'
            }}>
              <Typography variant="body2" sx={{ fontSize: '13px', color: '#0f172a' }}>
                {material.Description || 'No description provided'}
              </Typography>
            </Box>
          </Paper>

          {/* Physical Properties */}
          <Paper sx={{ p: 1.5, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
            <Typography variant="subtitle2" sx={{ color: PRIMARY_BLUE, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
              <ScaleIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Physical Properties
            </Typography>
            
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                {renderField(
                  <ScaleIcon sx={{ fontSize: 16 }} />, 
                  'Density', 
                  material.Density ? `${material.Density} ${material.Unit || ''}` : '-',
                  '#2E7D32'
                )}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                {material.Color ? (
                  <Stack direction="row" spacing={1} alignItems="flex-start">
                    <Box sx={{ color: PRIMARY_BLUE, mt: 0.3, minWidth: 20 }}>
                      <ColorIcon sx={{ fontSize: 16 }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '10px', fontWeight: 500, mb: 0.2 }}>
                        Color
                      </Typography>
                      <Chip
                        label={material.Color}
                        size="small"
                        sx={{
                          bgcolor: '#f8fafc',
                          color: '#475569',
                          border: '1px solid #e2e8f0',
                          fontWeight: 600,
                          fontSize: '11px',
                          height: '22px',
                        }}
                      />
                    </Box>
                  </Stack>
                ) : (
                  renderField(
                    <ColorIcon sx={{ fontSize: 16 }} />, 
                    'Color', 
                    'Not specified'
                  )
                )}
              </Grid>
            </Grid>
          </Paper>

          {/* Specifications */}
          <Paper sx={{ p: 1.5, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
            <Typography variant="subtitle2" sx={{ color: PRIMARY_BLUE, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
              <ScienceIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Specifications
            </Typography>
            
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                {renderField(
                  <ScienceIcon sx={{ fontSize: 16 }} />, 
                  'Standard', 
                  material.Standard
                )}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                {renderField(
                  <ScienceIcon sx={{ fontSize: 16 }} />, 
                  'Grade', 
                  material.Grade
                )}
              </Grid>
            </Grid>
          </Paper>
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
              Edit Material
            </Button>
          )}
        </Stack>
      </Box>
    </Dialog>
  );
};

export default ViewMaterial;