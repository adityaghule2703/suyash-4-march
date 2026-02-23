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
  Divider
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';

const ViewRoles = ({ open, onClose, role, onEdit }) => {
  if (!role) return null;

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
      maxWidth="sm" 
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
          Role Details
        </div>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={3}>
          {/* Add padding from top for the first field */}
          <div style={{ marginTop: '16px' }}>
            <Stack spacing={1}>
              <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                Role Name
              </Typography>
              <Typography variant="body1" fontWeight={500} sx={{ fontSize: '1rem' }}>
                {role.RoleName}
              </Typography>
            </Stack>
          </div>
          
          <Divider />
          
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
              {role.Description || 'No description provided'}
            </Typography>
          </Stack>
          
          <Stack direction="row" spacing={3}>
            <Stack spacing={1} flex={1}>
              <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                Status
              </Typography>
              <Chip
                label={role.IsActive ? 'Active' : 'Inactive'}
                color={role.IsActive ? 'success' : 'default'}
                size="small"
                sx={{ 
                  width: 'fit-content',
                  '&.MuiChip-colorSuccess': {
                    bgcolor: '#E8F5E9',
                    color: '#2E7D32',
                    fontWeight: 500
                  },
                  '&.MuiChip-colorDefault': {
                    bgcolor: '#F5F5F5',
                    color: '#616161',
                    fontWeight: 500
                  }
                }}
              />
            </Stack>
          </Stack>
          
          <Divider />
          
          <Stack spacing={2}>
            <Stack spacing={1}>
              <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                Created At
              </Typography>
              <Typography variant="body2" color="textPrimary" sx={{ fontSize: '0.875rem' }}>
                {formatDate(role.CreatedAt)}
              </Typography>
            </Stack>
            
            <Stack spacing={1}>
              <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                Last Updated
              </Typography>
              <Typography variant="body2" color="textPrimary" sx={{ fontSize: '0.875rem' }}>
                {formatDate(role.UpdatedAt)}
              </Typography>
            </Stack>
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
          Edit Role
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewRoles;