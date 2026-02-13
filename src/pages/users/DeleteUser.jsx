import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  Avatar,
  Stack,
  Box
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../config/Config';

const DeleteUser = ({ open, onClose, user, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) return null;

  const getAvatarInitials = () => {
    if (user.EmployeeID?.FirstName && user.EmployeeID?.LastName) {
      return `${user.EmployeeID.FirstName.charAt(0)}${user.EmployeeID.LastName.charAt(0)}`.toUpperCase();
    }
    return user.Username ? user.Username.charAt(0).toUpperCase() : 'U';
  };

  const getAvatarColor = () => {
    const colors = ['#164e63', '#0e7490', '#0891b2', '#0c4a6e', '#1d4ed8', '#7c3aed'];
    const charCode = user.Username?.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  const handleDelete = async () => {
    if (!user?._id) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${BASE_URL}/api/users/${user._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        onDelete(user._id);
        onClose();
      } else {
        setError(response.data.message || 'Failed to delete user');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err.response?.data?.message || 'Failed to delete user. Please try again.');
    } finally {
      setLoading(false);
    }
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
          Confirm Delete
        </div>
      </DialogTitle>
     
      <DialogContent sx={{ pt: 3 }}>
        <div style={{ marginTop: '16px' }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Avatar sx={{
              width: 60,
              height: 60,
              bgcolor: getAvatarColor(),
              fontSize: '1.25rem',
              fontWeight: 600
            }}>
              {getAvatarInitials()}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {user.Username}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {user.Email}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Role: {user.RoleID?.RoleName || 'No Role'}
              </Typography>
            </Box>
          </Stack>
         
          <Typography variant="body1" sx={{ mb: 2, fontSize: '0.875rem' }}>
            Are you sure you want to delete this user?
          </Typography>
          <Typography variant="body2" color="error" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
            ⚠️ This action cannot be undone. All user data will be permanently deleted.
          </Typography>
         
          {error && (
            <Alert
              severity="error"
              sx={{
                mt: 3,
                borderRadius: 1,
                '& .MuiAlert-icon': {
                  alignItems: 'center'
                }
              }}
            >
              {error}
            </Alert>
          )}
        </div>
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
          disabled={loading}
          sx={{
            borderRadius: 1,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 500
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          disabled={loading}
          startIcon={loading ? null : <DeleteIcon />}
          sx={{
            borderRadius: 1,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 500,
            backgroundColor: '#D32F2F',
            '&:hover': {
              backgroundColor: '#C62828'
            }
          }}
        >
          {loading ? 'Deleting...' : 'Delete User'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteUser;