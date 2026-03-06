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
  AttachMoney as MoneyIcon,
  Factory as FactoryIcon,
  CheckCircle,
  Cancel,
  Description as DescriptionIcon,
  Category,
  Label as LabelIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

// Color constants
const HEADER_GRADIENT = 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)';
const PRIMARY_BLUE = '#00B4D8';

const ViewProcess = ({ open, onClose, process, onEdit }) => {
  if (!process) return null;

  const getProcessInitials = (processName) => {
    if (!processName) return 'P';
    
    const words = processName.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    
    return processName.substring(0, 2).toUpperCase();
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

  // Get category chip
  const renderCategoryChip = (category) => {
    const colors = {
      'Core': { bg: '#E0F2FE', color: '#0369A1', border: '#7DD3FC' },
      'Finishing': { bg: '#FCE7F3', color: '#9D174D', border: '#F9A8D4' },
      'Packing': { bg: '#D1FAE5', color: '#065F46', border: '#6EE7B7' },
      'Other': { bg: '#F5F5F5', color: '#616161', border: '#E0E0E0' }
    };
    
    const color = colors[category] || colors['Other'];
    
    return (
      <Chip
        label={category}
        size="small"
        sx={{
          bgcolor: color.bg,
          color: color.color,
          border: `1px solid ${color.border}`,
          fontWeight: 600,
          fontSize: '11px',
          height: '22px',
        }}
      />
    );
  };

  // Get rate type chip
  const renderRateTypeChip = (rateType) => {
    const colors = {
      'Per Nos': { bg: '#F3E8FF', color: '#7C3AED', border: '#D8B4FE' },
      'Per Kg': { bg: '#DCFCE7', color: '#059669', border: '#86EFAC' },
      'Per Hour': { bg: '#F0F9FF', color: '#0C4A6E', border: '#BAE6FD' },
      'Fixed': { bg: '#FEF3C7', color: '#92400E', border: '#FCD34D' }
    };
    
    const color = colors[rateType] || { bg: '#F5F5F5', color: '#616161', border: '#E0E0E0' };
    
    return (
      <Chip
        label={rateType}
        size="small"
        sx={{
          bgcolor: color.bg,
          color: color.color,
          border: `1px solid ${color.border}`,
          fontWeight: 600,
          fontSize: '11px',
          height: '22px',
        }}
      />
    );
  };

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
          maxHeight: '500px'
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
            <FactoryIcon sx={{ color: '#FFFFFF', fontSize: 20 }} />
            <Typography variant="subtitle1" sx={{ 
              fontWeight: 600, 
              color: '#FFFFFF',
              fontSize: '1rem'
            }}>
              Process Details
            </Typography>
          </Stack>
          <Chip
            label={`ID: ${process.process_id || '-'}`}
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
          {/* Process Profile */}
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
                {getProcessInitials(process.process_name)}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={600} color="#101010" sx={{ fontSize: '1.1rem' }}>
                  {process.process_name}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1, flexWrap: 'wrap', gap: 1 }}>
                  <Chip
                    icon={process.is_active ? <CheckCircle sx={{ fontSize: 14 }} /> : <Cancel sx={{ fontSize: 14 }} />}
                    label={process.is_active ? 'Active' : 'Inactive'}
                    size="small"
                    sx={{
                      bgcolor: process.is_active ? '#dcfce7' : '#fee2e2',
                      color: process.is_active ? '#166534' : '#991b1b',
                      border: process.is_active ? '1px solid #86efac' : '1px solid #fca5a5',
                      fontWeight: 600,
                      fontSize: '11px',
                      height: '22px',
                      '& .MuiChip-icon': { fontSize: 14 }
                    }}
                  />
                  {renderCategoryChip(process.category)}
                  {renderRateTypeChip(process.rate_type)}
                </Stack>
              </Box>
            </Stack>

            <Typography variant="subtitle2" sx={{ color: PRIMARY_BLUE, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
              Basic Information
            </Typography>
            
            <Grid container spacing={1}>
              <Grid size={{ xs: 12, sm: 6 }}>
                {renderField(
                  <LabelIcon sx={{ fontSize: 16 }} />, 
                  'Process ID', 
                  process.process_id
                )}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                {renderField(
                  <Category sx={{ fontSize: 16 }} />, 
                  'Category', 
                  process.category
                )}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                {renderField(
                  <MoneyIcon sx={{ fontSize: 16 }} />, 
                  'Rate Type', 
                  process.rate_type
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
                {process.description || 'No description available for this process.'}
              </Typography>
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
            Edit Process
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default ViewProcess;