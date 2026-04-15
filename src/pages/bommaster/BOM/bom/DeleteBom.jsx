import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Alert,
  Box,
  IconButton,
  Chip,
  Paper,
  Stack,
  Divider,
  Avatar
} from '@mui/material';
import {
  Close as CloseIcon,
  Warning as WarningIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';
import { COLORS, STATUS_COLORS } from '../constants';

const DeleteBom = ({ open, onClose, bom, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please login again.');
        setLoading(false);
        return;
      }

      const response = await axios.delete(`${BASE_URL}/api/boms/${bom._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        if (onDelete) {
          onDelete(response.data.data);
        }
        onClose();
      } else {
        setError(response.data.message || 'Failed to delete BOM');
      }
    } catch (err) {
      console.error('Error deleting BOM:', err);
      setError(err.response?.data?.message || 'Failed to delete BOM. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getBomInitials = () => {
    if (!bom?.bom_id) return 'BM';
    return bom.bom_id.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = () => {
    if (!bom?.bom_id) return COLORS.primary;
    const colors = [COLORS.primary, COLORS.primaryDark, '#074346', '#0D696C', '#128C7E'];
    const charCode = bom.bom_id.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  const getStatusColor = (status) => {
    return STATUS_COLORS[status] || { bg: '#F1F5F9', color: '#475569' };
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <CheckCircleIcon sx={{ fontSize: '0.7rem' }} />;
      case 'Pending':
        return <PendingIcon sx={{ fontSize: '0.7rem' }} />;
      default:
        return <PendingIcon sx={{ fontSize: '0.7rem' }} />;
    }
  };

  const totalComponents = bom?.components?.length || 0;
  const statusColors = getStatusColor(bom?.status);
  const parentItem = bom?.parent_item_id || {};

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        bgcolor: COLORS.background.white
      }}>
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#EF4444' }}>
          Delete BOM
        </Typography>
        <IconButton onClick={onClose} size="small" disabled={loading}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <WarningIcon sx={{ fontSize: 48, color: '#EF4444', mb: 2 }} />
          <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: COLORS.text.primary, mb: 1 }}>
            Are you sure you want to delete this BOM?
          </Typography>
          
          {/* BOM Information Card - Matching BomList style */}
          <Paper sx={{ 
            p: 2, 
            mt: 2, 
            mb: 1, 
            bgcolor: COLORS.background.light, 
            borderRadius: 1.5,
            textAlign: 'left'
          }}>
            <Stack spacing={1.5}>
              {/* BOM ID with Avatar - Same as table row */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: getAvatarColor(), fontSize: '0.7rem' }}>
                  {getBomInitials()}
                </Avatar>
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{bom?.bom_id}</Typography>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                    {parentItem.part_no || bom?.parent_part_no}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ borderColor: COLORS.border }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                    Version
                  </Typography>
                  <Chip
                    label={bom?.bom_version}
                    size="small"
                    sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primary, fontSize: '0.65rem', height: 24 }}
                  />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                    Type
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    {bom?.bom_type || 'Standard'}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                    Status
                  </Typography>
                  <Chip
                    icon={getStatusIcon(bom?.status)}
                    label={bom?.status || 'Pending'}
                    size="small"
                    sx={{
                      bgcolor: statusColors.bg,
                      color: statusColors.color,
                      fontSize: '0.65rem',
                      height: 24,
                      '& .MuiChip-icon': { fontSize: '0.7rem' }
                    }}
                  />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                    Components
                  </Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: COLORS.primary }}>
                    {totalComponents}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ borderColor: COLORS.border }} />
              
              <Box>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                  Effective From
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                  {bom?.effective_from ? new Date(bom.effective_from).toLocaleDateString() : '-'}
                </Typography>
              </Box>
              
              <Box>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                  Created At
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                  {bom?.created_at ? new Date(bom.created_at).toLocaleDateString() : '-'}
                </Typography>
              </Box>
            </Stack>
          </Paper>
          
          <Typography sx={{ fontSize: '0.7rem', color: '#EF4444', mt: 2 }}>
            This action cannot be undone. The BOM will be deactivated.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.75rem' }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        gap: 1
      }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none'
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleDelete}
          disabled={loading}
          startIcon={loading ? null : <DeleteIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            bgcolor: '#EF4444',
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': { bgcolor: '#DC2626' }
          }}
        >
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteBom;