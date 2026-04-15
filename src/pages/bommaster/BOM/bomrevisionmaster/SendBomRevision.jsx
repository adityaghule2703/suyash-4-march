// SendBomRevision.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Stack,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  Send as SendIcon,
  Email as EmailIcon,
  Attachment as AttachmentIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';

const SendBomRevision = ({ open, onClose, bomId, revisionNo, bomCode, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    // cc: '',
    // bcc: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        email: '',
        // cc: '',
        // bcc: '',
        subject: `BOM Revision ${revisionNo} - ${bomCode || ''}`,
        message: `Dear Team,\n\nPlease find attached BOM revision ${revisionNo} for your reference.\n\nBest regards,\nProduction Team`
      });
      setError('');
      setSuccess('');
    }
  }, [open, revisionNo, bomCode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    // Validate email
    if (!formData.email) {
      setError('Please enter at least one email address');
      return;
    }

    // Validate email format (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emails = formData.email.split(',').map(e => e.trim());
    const invalidEmails = emails.filter(email => !emailRegex.test(email));
    
    if (invalidEmails.length > 0) {
      setError(`Invalid email format: ${invalidEmails.join(', ')}`);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      
      // Prepare request body
      const requestBody = {
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      };

      // Add optional fields if provided
      if (formData.cc) requestBody.cc = formData.cc;
      if (formData.bcc) requestBody.bcc = formData.bcc;

      const response = await axios.post(
        `${BASE_URL}/api/boms/${bomId}/revisions/${revisionNo}/send`,
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setSuccess(response.data.message || 'BOM revision sent successfully!');
        if (onSuccess) {
          onSuccess(response.data);
        }
        // Close dialog after 2 seconds on success
        setTimeout(() => {
          onClose();
          setFormData({
            email: '',
            cc: '',
            bcc: '',
            subject: '',
            message: ''
          });
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to send BOM revision');
      }
    } catch (err) {
      console.error('Error sending BOM revision:', err);
      if (err.response) {
        setError(err.response.data?.message || `Server error: ${err.response.status}`);
      } else if (err.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
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
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: '1px solid #E5E7EB',
        bgcolor: '#F9FAFB',
        py: 2,
        px: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SendIcon sx={{ color: '#1976D2' }} />
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
            Send BOM Revision
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* BOM Info Banner */}
        <Box sx={{ 
          mb: 3, 
          p: 2, 
          bgcolor: '#F0F7FF', 
          borderRadius: 2,
          border: '1px solid #BBDEFB'
        }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <AttachmentIcon sx={{ color: '#1976D2' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                BOM Code: <strong>{bomCode || 'N/A'}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Revision: <strong>{revisionNo}</strong>
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Success Alert */}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {/* Form Fields */}
        <Stack spacing={2.5}>
          <TextField
            required
            fullWidth
            label="To Email Addresses"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="user@example.com, another@example.com"
            // helperText="Separate multiple email addresses with commas"
            disabled={loading}
            size="small"
          />

          {/* <TextField
            fullWidth
            label="CC Email Addresses (Optional)"
            name="cc"
            value={formData.cc}
            onChange={handleChange}
            placeholder="cc@example.com"
            helperText="Separate multiple email addresses with commas"
            disabled={loading}
            size="small"
          /> */}

          {/* <TextField
            fullWidth
            label="BCC Email Addresses (Optional)"
            name="bcc"
            value={formData.bcc}
            onChange={handleChange}
            placeholder="bcc@example.com"
            helperText="Separate multiple email addresses with commas"
            disabled={loading}
            size="small"
          /> */}

          <TextField
            fullWidth
            label="Subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            disabled={loading}
            size="small"
          />

          <TextField
            fullWidth
            label="Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            multiline
            rows={6}
            disabled={loading}
            placeholder="Enter your message here..."
            size="small"
          />
        </Stack>

        {/* PDF Info Note */}
        <Box sx={{ mt: 2, p: 1.5, bgcolor: '#FFF3E0', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            <strong>Note:</strong> The BOM PDF will be automatically generated and attached to the email.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ 
        borderTop: '1px solid #E5E7EB',
        p: 2,
        gap: 1
      }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
          sx={{ textTransform: 'none' }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !formData.email}
          startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
          sx={{
            textTransform: 'none',
            bgcolor: '#1976D2',
            '&:hover': { bgcolor: '#1565C0' }
          }}
        >
          {loading ? 'Sending...' : 'Send Email'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SendBomRevision;