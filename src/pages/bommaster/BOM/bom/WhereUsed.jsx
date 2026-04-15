import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
  Stack,
  CircularProgress,
  Chip,
  IconButton,
  Grid
} from '@mui/material';
import {
  Close as CloseIcon,
  LocationSearching as WhereUsedIcon,
  Inventory as InventoryIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { COLORS } from '../constants';

const WhereUsed = ({ open, onClose, component, usedInBoms, loading }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
      case 'Active':
        return <CheckCircleIcon sx={{ fontSize: '0.7rem', color: '#059669' }} />;
      case 'Pending':
        return <PendingIcon sx={{ fontSize: '0.7rem', color: '#D97706' }} />;
      case 'Rejected':
      case 'Cancelled':
        return <CancelIcon sx={{ fontSize: '0.7rem', color: '#DC2626' }} />;
      default:
        return <PendingIcon sx={{ fontSize: '0.7rem', color: '#4F46E5' }} />;
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' },
      Approved: { bg: '#D1FAE5', color: '#059669', border: '#A7F3D0' },
      Rejected: { bg: '#FEE2E2', color: '#DC2626', border: '#FECACA' },
      Draft: { bg: '#E0E7FF', color: '#4F46E5', border: '#C7D2FE' },
      Active: { bg: '#D1FAE5', color: '#059669', border: '#A7F3D0' },
      Cancelled: { bg: '#FEE2E2', color: '#DC2626', border: '#FECACA' },
      Archived: { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' }
    };
    return colors[status] || { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' };
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WhereUsedIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Where Used
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8, flexDirection: 'column' }}>
            <CircularProgress size={40} sx={{ color: COLORS.primary }} />
            <Typography sx={{ mt: 2, color: COLORS.text.secondary, fontSize: '0.75rem' }}>
              Loading where-used data...
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2.5}>
            {/* Component Information */}
            <Paper sx={{
              p: 2,
              bgcolor: COLORS.background.light,
              borderRadius: 1.5,
              border: `1px solid ${COLORS.border}`
            }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                COMPONENT INFORMATION
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Part No</Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: COLORS.text.primary }}>
                    {component?.part_no || '-'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Part Description</Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.primary }}>
                    {component?.part_description || 'No description available'}
                  </Typography>
                </Grid>
                {component?.item_category && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Category</Typography>
                    <Chip
                      label={component.item_category}
                      size="small"
                      sx={{ fontSize: '0.65rem', height: 24, bgcolor: COLORS.primaryLight, color: COLORS.primary }}
                    />
                  </Grid>
                )}
                {component?.unit && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Unit</Typography>
                    <Chip
                      label={component.unit}
                      size="small"
                      sx={{ fontSize: '0.65rem', height: 24, bgcolor: COLORS.primaryLight, color: COLORS.primary }}
                    />
                  </Grid>
                )}
              </Grid>
            </Paper>

            {/* Usage Summary */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary }}>
                <InventoryIcon sx={{ fontSize: '0.9rem', mr: 0.5, verticalAlign: 'middle' }} />
                Used in {usedInBoms?.length || 0} BOM(s)
              </Typography>
              {usedInBoms?.length > 0 && (
                <Chip
                  label={`${usedInBoms.length} BOM${usedInBoms.length !== 1 ? 's' : ''}`}
                  size="small"
                  sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primary, fontSize: '0.65rem', height: 24 }}
                />
              )}
            </Box>

            {/* BOM List */}
            {usedInBoms?.length === 0 ? (
              <Paper sx={{
                p: 4,
                textAlign: 'center',
                bgcolor: COLORS.background.light,
                borderRadius: 1.5,
                border: `1px solid ${COLORS.border}`
              }}>
                <InventoryIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.secondary }}>
                  This component is not used in any BOM
                </Typography>
              </Paper>
            ) : (
              <Stack spacing={2}>
                {usedInBoms.map((bom, idx) => {
                  const statusColors = getStatusColor(bom.status);
                  return (
                    <Paper
                      key={idx}
                      sx={{
                        p: 2,
                        borderRadius: 1.5,
                        border: `1px solid ${COLORS.border}`,
                        bgcolor: COLORS.background.white,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: COLORS.background.hover,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                        }
                      }}
                    >
                      <Stack spacing={1.5}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1 }}>
                          <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                            {bom.bom_id}
                          </Typography>
                          <Chip
                            icon={getStatusIcon(bom.status)}
                            label={bom.status || 'Pending'}
                            size="small"
                            sx={{
                              fontSize: '0.65rem',
                              height: 24,
                              bgcolor: statusColors.bg,
                              color: statusColors.color,
                              border: `1px solid ${statusColors.border}`,
                              '& .MuiChip-icon': { fontSize: '0.7rem' }
                            }}
                          />
                        </Box>
                        
                        <Grid container spacing={1.5}>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Parent Part No</Typography>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{bom.parent_part_no || '-'}</Typography>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Parent Description</Typography>
                            <Typography sx={{ fontSize: '0.75rem' }}>{bom.parent_description || '-'}</Typography>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Version</Typography>
                            <Chip
                              label={bom.bom_version}
                              size="small"
                              sx={{ fontSize: '0.65rem', height: 22, bgcolor: COLORS.primaryLight, color: COLORS.primary }}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Effective From</Typography>
                            <Typography sx={{ fontSize: '0.7rem' }}>{formatDate(bom.effective_from)}</Typography>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Effective To</Typography>
                            <Typography sx={{ fontSize: '0.7rem' }}>{formatDate(bom.effective_to) || 'Present'}</Typography>
                          </Grid>
                        </Grid>

                        {bom.is_default && (
                          <Box>
                            <Chip
                              label="Default Version"
                              size="small"
                              sx={{ fontSize: '0.65rem', height: 22, bgcolor: '#FEF3C7', color: '#D97706' }}
                            />
                          </Box>
                        )}
                      </Stack>
                    </Paper>
                  );
                })}
              </Stack>
            )}
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        justifyContent: 'flex-end',
        gap: 1
      }}>
        <Button
          onClick={onClose}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': {
              borderColor: COLORS.primary,
              bgcolor: `${COLORS.primary}10`
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WhereUsed;