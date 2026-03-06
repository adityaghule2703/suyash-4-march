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
  Inventory,
  AttachMoney,
  TrendingUp,
  LocalShipping,
  CalendarToday,
  CheckCircle,
  Cancel,
  Close as CloseIcon,
  Badge as BadgeIcon,
  Scale as ScaleIcon,
  Category as CategoryIcon
} from '@mui/icons-material';

// Color constants
const HEADER_GRADIENT = 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)';
const PRIMARY_BLUE = '#00B4D8';

const ViewRawMaterial = ({ open, onClose, material, onEdit }) => {
  if (!material) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
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
          maxHeight: '620px'
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
            <Inventory sx={{ color: '#FFFFFF', fontSize: 20 }} />
            <Typography variant="subtitle1" sx={{ 
              fontWeight: 600, 
              color: '#FFFFFF',
              fontSize: '1rem'
            }}>
              Raw Material Details
            </Typography>
          </Stack>
          <Chip
            label={`Grade: ${material.Grade || '-'}`}
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
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1, flexWrap: 'wrap', gap: 1 }}>
                  <Chip
                    label={`Grade: ${material.Grade}`}
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
                  <Chip
                    icon={material.IsActive ? <CheckCircle sx={{ fontSize: 14 }} /> : <Cancel sx={{ fontSize: 14 }} />}
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
              <Grid size={{ xs: 12, sm: 4 }}>
                {renderField(
                  <BadgeIcon sx={{ fontSize: 16 }} />, 
                  'Material ID', 
                  material._id
                )}
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                {renderField(
                  <CategoryIcon sx={{ fontSize: 16 }} />, 
                  'Material Name', 
                  material.MaterialName,
                  PRIMARY_BLUE
                )}
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                {renderField(
                  <ScaleIcon sx={{ fontSize: 16 }} />, 
                  'Grade', 
                  material.Grade
                )}
              </Grid>
            </Grid>
          </Paper>

          {/* Validity Information */}
          <Paper sx={{ p: 1.5, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
            <Typography variant="subtitle2" sx={{ color: PRIMARY_BLUE, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
              <CalendarToday sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Validity Information
            </Typography>
            
            <Grid container spacing={1}>
              <Grid size={{ xs: 12, sm: 6 }}>
                {renderField(
                  <CalendarToday sx={{ fontSize: 16 }} />, 
                  'Date Effective', 
                  formatDate(material.DateEffective)
                )}
              </Grid>
            </Grid>
          </Paper>

          {/* Rate Information */}
          <Paper sx={{ p: 1.5, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
            <Typography variant="subtitle2" sx={{ color: PRIMARY_BLUE, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
              <AttachMoney sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Rate Information
            </Typography>
            
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ 
                  p: 1.5, 
                  bgcolor: '#F5F5F5', 
                  borderRadius: 1,
                  border: '1px solid #E0E0E0'
                }}>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '10px', fontWeight: 500, mb: 0.5 }}>
                    Base Rate
                  </Typography>
                  <Typography variant="body1" fontWeight={700} sx={{ fontSize: '1rem', color: '#101010' }}>
                    {formatCurrency(material.RatePerKG)}/kg
                  </Typography>
                </Box>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ 
                  p: 1.5, 
                  bgcolor: '#E8F5E9', 
                  borderRadius: 1,
                  border: '1px solid #A5D6A7'
                }}>
                  <Typography variant="caption" sx={{ color: '#2E7D32', display: 'block', fontSize: '10px', fontWeight: 500, mb: 0.5 }}>
                    Effective Rate
                  </Typography>
                  <Typography variant="body1" fontWeight={700} sx={{ fontSize: '1rem', color: '#2E7D32' }}>
                    {formatCurrency(effectiveRate)}/kg
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Cost Factors */}
          <Paper sx={{ p: 1.5, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
            <Typography variant="subtitle2" sx={{ color: PRIMARY_BLUE, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
              <TrendingUp sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} /> Cost Factors
            </Typography>
            
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ 
                  p: 1.5, 
                  bgcolor: '#FFF3E0', 
                  borderRadius: 1,
                  border: '1px solid #FFE0B2'
                }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Inventory sx={{ color: '#FF9800', fontSize: 20 }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: '#FF9800', display: 'block', fontSize: '10px', fontWeight: 500 }}>
                        Scrap Percentage
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#FF9800', fontWeight: 700, fontSize: '1.1rem' }}>
                        {material.ScrapPercentage}%
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748B', fontSize: '10px' }}>
                        Add: {formatCurrency(material.RatePerKG * material.ScrapPercentage / 100)}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ 
                  p: 1.5, 
                  bgcolor: '#E8EAF6', 
                  borderRadius: 1,
                  border: '1px solid #C5CAE9'
                }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <LocalShipping sx={{ color: '#5C6BC0', fontSize: 20 }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: '#5C6BC0', display: 'block', fontSize: '10px', fontWeight: 500 }}>
                        Transport Loss %
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#5C6BC0', fontWeight: 700, fontSize: '1.1rem' }}>
                        {material.TransportLossPercentage}%
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748B', fontSize: '10px' }}>
                        Add: {formatCurrency(material.RatePerKG * material.TransportLossPercentage / 100)}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
            
            <Box sx={{ 
              p: 1.5, 
              bgcolor: '#F5F5F5', 
              borderRadius: 1,
              border: '1px solid #E0E0E0',
              mt: 1.5
            }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500, fontSize: '11px' }}>
                  Total Additional Cost
                </Typography>
                <Typography variant="body1" fontWeight={700} sx={{ color: '#D32F2F', fontSize: '1rem' }}>
                  {material.ScrapPercentage + material.TransportLossPercentage}%
                  <Typography variant="caption" component="span" sx={{ color: '#64748B', ml: 1, fontSize: '11px' }}>
                    ({formatCurrency(material.RatePerKG * (material.ScrapPercentage + material.TransportLossPercentage) / 100)})
                  </Typography>
                </Typography>
              </Stack>
            </Box>
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

export default ViewRawMaterial;