import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Alert,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { COLORS, PRIORITY_OPTIONS, STATUS_OPTIONS, FEASIBILITY_STATUS_OPTIONS } from './constants';

const EditLead = ({ open, onClose, lead, onUpdate }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (lead) {
      setFormData({
        priority: lead.priority || 'Medium',
        estimated_value: lead.estimated_value || '',
        next_follow_up_date: lead.next_follow_up_date ? lead.next_follow_up_date.split('T')[0] : '',
        status: lead.status || '',
        feasibility_status: lead.feasibility_status || '',
        feasibility_notes: lead.feasibility_notes || ''
      });
    }
  }, [lead]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const updateData = {};
      
      if (formData.priority) updateData.priority = formData.priority;
      if (formData.estimated_value) updateData.estimated_value = Number(formData.estimated_value);
      if (formData.next_follow_up_date) updateData.next_follow_up_date = new Date(formData.next_follow_up_date).toISOString();
      if (formData.status) updateData.status = formData.status;
      if (formData.feasibility_status) updateData.feasibility_status = formData.feasibility_status;
      if (formData.feasibility_notes) updateData.feasibility_notes = formData.feasibility_notes;

      const response = await axios.put(`${BASE_URL}/api/leads/${lead._id}`, updateData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        onUpdate(response.data.data);
        onClose();
      } else {
        setError(response.data.message || 'Failed to update lead');
      }
    } catch (err) {
      console.error('Error updating lead:', err);
      setError(err.response?.data?.message || 'Failed to update lead');
    } finally {
      setLoading(false);
    }
  };

  if (!lead) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ borderBottom: `1px solid ${COLORS.border}`, py: 1.5 }}>
        <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
          Edit Lead
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {lead.lead_id} - {lead.subject}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ p: 2.5 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Priority</InputLabel>
              <Select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                label="Priority"
              >
                {PRIORITY_OPTIONS.map(option => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="estimated_value"
              label="Estimated Value"
              type="number"
              value={formData.estimated_value}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="next_follow_up_date"
              label="Next Follow-up Date"
              type="date"
              value={formData.next_follow_up_date}
              onChange={handleChange}
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                label="Status"
              >
                {STATUS_OPTIONS.map(option => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Feasibility Status</InputLabel>
              <Select
                name="feasibility_status"
                value={formData.feasibility_status}
                onChange={handleChange}
                label="Feasibility Status"
              >
                {FEASIBILITY_STATUS_OPTIONS.map(option => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="feasibility_notes"
              label="Feasibility Notes"
              multiline
              rows={3}
              value={formData.feasibility_notes}
              onChange={handleChange}
              size="small"
            />
          </Grid>
        </Grid>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </DialogContent>
      <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.border}` }}>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit} 
          disabled={loading}
          sx={{ bgcolor: COLORS.primary, '&:hover': { bgcolor: COLORS.primaryDark } }}
        >
          {loading ? 'Updating...' : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditLead;