import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Alert,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  Paper,
  IconButton
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { 
  COLORS, 
  LEAD_SOURCE_OPTIONS, 
  PRIORITY_OPTIONS, 
  INDUSTRY_OPTIONS, 
  UNIT_OPTIONS 
} from './constants';

const AddLead = ({ open, onClose, onAdd }) => {
  const [leadType, setLeadType] = useState('exhibition');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [enquiredItems, setEnquiredItems] = useState([{
    description: '',
    quantity: '',
    unit: 'Nos',
    target_price: '',
    material_grade: '',
    part_no: ''
  }]);

  const [exhibitionFormData, setExhibitionFormData] = useState({
    lead_source: 'Exhibition',
    lead_source_detail: '',
    subject: '',
    company_name: '',
    contact_name: '',
    contact_email: '',
    contact_mobile: '',
    designation: '',
    industry: '',
    priority: 'Medium',
    estimated_value: '',
    tags: []
  });

  const [minimalFormData, setMinimalFormData] = useState({
    lead_source: 'Phone',
    subject: '',
    company_name: '',
    contact_name: ''
  });

  const [tagInput, setTagInput] = useState('');

  const handleLeadTypeChange = (type) => {
    setLeadType(type);
    setError('');
  };

  const handleExhibitionChange = (e) => {
    const { name, value } = e.target;
    setExhibitionFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMinimalChange = (e) => {
    const { name, value } = e.target;
    setMinimalFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEnquiredItemChange = (index, field, value) => {
    const updatedItems = [...enquiredItems];
    updatedItems[index][field] = value;
    setEnquiredItems(updatedItems);
  };

  const addEnquiredItem = () => {
    setEnquiredItems([...enquiredItems, {
      description: '',
      quantity: '',
      unit: 'Nos',
      target_price: '',
      material_grade: '',
      part_no: ''
    }]);
  };

  const removeEnquiredItem = (index) => {
    if (enquiredItems.length > 1) {
      const updatedItems = enquiredItems.filter((_, i) => i !== index);
      setEnquiredItems(updatedItems);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !exhibitionFormData.tags.includes(tagInput.trim())) {
      setExhibitionFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setExhibitionFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      let requestData;

      if (leadType === 'exhibition') {
        if (!exhibitionFormData.lead_source_detail.trim()) {
          setError('Lead source detail is required');
          setLoading(false);
          return;
        }
        if (!exhibitionFormData.subject.trim()) {
          setError('Subject is required');
          setLoading(false);
          return;
        }
        if (!exhibitionFormData.company_name.trim()) {
          setError('Company name is required');
          setLoading(false);
          return;
        }
        if (!exhibitionFormData.contact_name.trim()) {
          setError('Contact name is required');
          setLoading(false);
          return;
        }

        for (let i = 0; i < enquiredItems.length; i++) {
          if (!enquiredItems[i].description.trim()) {
            setError(`Item ${i + 1}: Description is required`);
            setLoading(false);
            return;
          }
          if (!enquiredItems[i].quantity) {
            setError(`Item ${i + 1}: Quantity is required`);
            setLoading(false);
            return;
          }
        }

        requestData = {
          ...exhibitionFormData,
          estimated_value: exhibitionFormData.estimated_value ? Number(exhibitionFormData.estimated_value) : undefined,
          enquired_items: enquiredItems.map(item => ({
            ...item,
            quantity: Number(item.quantity),
            target_price: item.target_price ? Number(item.target_price) : undefined
          }))
        };
      } else {
        if (!minimalFormData.subject.trim()) {
          setError('Subject is required');
          setLoading(false);
          return;
        }
        if (!minimalFormData.company_name.trim()) {
          setError('Company name is required');
          setLoading(false);
          return;
        }
        if (!minimalFormData.contact_name.trim()) {
          setError('Contact name is required');
          setLoading(false);
          return;
        }

        requestData = minimalFormData;
      }

      const response = await axios.post(`${BASE_URL}/api/leads`, requestData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        onAdd(response.data.data);
        resetForm();
        onClose();
      } else {
        setError(response.data.message || 'Failed to add lead');
      }
    } catch (err) {
      console.error('Error adding lead:', err);
      setError(err.response?.data?.message || 'Failed to add lead. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setLeadType('exhibition');
    setEnquiredItems([{
      description: '',
      quantity: '',
      unit: 'Nos',
      target_price: '',
      material_grade: '',
      part_no: ''
    }]);
    setExhibitionFormData({
      lead_source: 'Exhibition',
      lead_source_detail: '',
      subject: '',
      company_name: '',
      contact_name: '',
      contact_email: '',
      contact_mobile: '',
      designation: '',
      industry: '',
      priority: 'Medium',
      estimated_value: '',
      tags: []
    });
    setMinimalFormData({
      lead_source: 'Phone',
      subject: '',
      company_name: '',
      contact_name: ''
    });
    setTagInput('');
    setError('');
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
          overflow: 'hidden',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        bgcolor: COLORS.background.white
      }}>
        <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
          Add New Lead
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        {/* Lead Type Selection */}
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
            LEAD TYPE
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant={leadType === 'exhibition' ? 'contained' : 'outlined'}
              onClick={() => handleLeadTypeChange('exhibition')}
              sx={{
                borderRadius: 1.5,
                textTransform: 'none',
                fontSize: '0.75rem',
                fontWeight: 500,
                bgcolor: leadType === 'exhibition' ? COLORS.primary : 'transparent',
                borderColor: COLORS.border,
                color: leadType === 'exhibition' ? COLORS.text.light : COLORS.text.secondary,
                '&:hover': {
                  bgcolor: leadType === 'exhibition' ? COLORS.primaryDark : COLORS.primaryLight
                }
              }}
            >
              Exhibition Lead (With Enquired Items)
            </Button>
            <Button
              variant={leadType === 'minimal' ? 'contained' : 'outlined'}
              onClick={() => handleLeadTypeChange('minimal')}
              sx={{
                borderRadius: 1.5,
                textTransform: 'none',
                fontSize: '0.75rem',
                fontWeight: 500,
                bgcolor: leadType === 'minimal' ? COLORS.primary : 'transparent',
                borderColor: COLORS.border,
                color: leadType === 'minimal' ? COLORS.text.light : COLORS.text.secondary,
                '&:hover': {
                  bgcolor: leadType === 'minimal' ? COLORS.primaryDark : COLORS.primaryLight
                }
              }}
            >
              Minimal Lead (Required Fields Only)
            </Button>
          </Stack>
        </Box>

        {leadType === 'exhibition' ? (
          <Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  name="lead_source_detail"
                  label="Lead Source Detail"
                  value={exhibitionFormData.lead_source_detail}
                  onChange={handleExhibitionChange}
                  size="small"
                  placeholder="e.g., ELECRAMA 2025"
                  sx={{ '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  name="subject"
                  label="Subject"
                  value={exhibitionFormData.subject}
                  onChange={handleExhibitionChange}
                  size="small"
                  placeholder="e.g., Copper Busbar Enquiry"
                  sx={{ '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  name="company_name"
                  label="Company Name"
                  value={exhibitionFormData.company_name}
                  onChange={handleExhibitionChange}
                  size="small"
                  sx={{ '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ fontSize: '0.75rem' }}>Industry</InputLabel>
                  <Select
                    name="industry"
                    value={exhibitionFormData.industry}
                    onChange={handleExhibitionChange}
                    label="Industry"
                    sx={{ fontSize: '0.75rem' }}
                  >
                    {INDUSTRY_OPTIONS.map(option => (
                      <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  name="contact_name"
                  label="Contact Name"
                  value={exhibitionFormData.contact_name}
                  onChange={handleExhibitionChange}
                  size="small"
                  sx={{ '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  name="designation"
                  label="Designation"
                  value={exhibitionFormData.designation}
                  onChange={handleExhibitionChange}
                  size="small"
                  sx={{ '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  name="contact_email"
                  label="Email"
                  type="email"
                  value={exhibitionFormData.contact_email}
                  onChange={handleExhibitionChange}
                  size="small"
                  sx={{ '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  name="contact_mobile"
                  label="Mobile"
                  value={exhibitionFormData.contact_mobile}
                  onChange={handleExhibitionChange}
                  size="small"
                  sx={{ '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ fontSize: '0.75rem' }}>Priority</InputLabel>
                  <Select
                    name="priority"
                    value={exhibitionFormData.priority}
                    onChange={handleExhibitionChange}
                    label="Priority"
                    sx={{ fontSize: '0.75rem' }}
                  >
                    {PRIORITY_OPTIONS.map(option => (
                      <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  name="estimated_value"
                  label="Estimated Value"
                  type="number"
                  value={exhibitionFormData.estimated_value}
                  onChange={handleExhibitionChange}
                  size="small"
                  sx={{ '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                    TAGS
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <TextField
                      size="small"
                      placeholder="Add tag..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      sx={{ flex: 1, '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
                    />
                    <Button
                      variant="outlined"
                      onClick={addTag}
                      sx={{ height: 32, fontSize: '0.7rem', textTransform: 'none' }}
                    >
                      Add
                    </Button>
                  </Stack>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                    {exhibitionFormData.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        onDelete={() => removeTag(tag)}
                        sx={{ fontSize: '0.7rem', height: 24 }}
                      />
                    ))}
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {/* Enquired Items Section */}
            <Box sx={{ mt: 3 }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary, mb: 1.5 }}>
                Enquired Items
              </Typography>
              {enquiredItems.map((item, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Item {index + 1}
                    </Typography>
                    {enquiredItems.length > 1 && (
                      <IconButton size="small" onClick={() => removeEnquiredItem(index)} sx={{ color: '#EF4444' }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Stack>
                  <Grid container spacing={1.5}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Description"
                        size="small"
                        value={item.description}
                        onChange={(e) => handleEnquiredItemChange(index, 'description', e.target.value)}
                        sx={{ '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <TextField
                        fullWidth
                        label="Quantity"
                        type="number"
                        size="small"
                        value={item.quantity}
                        onChange={(e) => handleEnquiredItemChange(index, 'quantity', e.target.value)}
                        sx={{ '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <FormControl fullWidth size="small">
                        <InputLabel sx={{ fontSize: '0.75rem' }}>Unit</InputLabel>
                        <Select
                          value={item.unit}
                          onChange={(e) => handleEnquiredItemChange(index, 'unit', e.target.value)}
                          label="Unit"
                          sx={{ fontSize: '0.75rem' }}
                        >
                          {UNIT_OPTIONS.map(option => (
                            <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        fullWidth
                        label="Target Price"
                        type="number"
                        size="small"
                        value={item.target_price}
                        onChange={(e) => handleEnquiredItemChange(index, 'target_price', e.target.value)}
                        sx={{ '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        fullWidth
                        label="Material Grade"
                        size="small"
                        value={item.material_grade}
                        onChange={(e) => handleEnquiredItemChange(index, 'material_grade', e.target.value)}
                        sx={{ '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        fullWidth
                        label="Part No"
                        size="small"
                        value={item.part_no}
                        onChange={(e) => handleEnquiredItemChange(index, 'part_no', e.target.value)}
                        sx={{ '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              ))}
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addEnquiredItem}
                sx={{ fontSize: '0.7rem', textTransform: 'none' }}
              >
                Add Item
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ fontSize: '0.75rem' }}>Lead Source</InputLabel>
                  <Select
                    name="lead_source"
                    value={minimalFormData.lead_source}
                    onChange={handleMinimalChange}
                    label="Lead Source"
                    sx={{ fontSize: '0.75rem' }}
                  >
                    {LEAD_SOURCE_OPTIONS.map(option => (
                      <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  name="subject"
                  label="Subject"
                  value={minimalFormData.subject}
                  onChange={handleMinimalChange}
                  size="small"
                  placeholder="e.g., AL Busbar enquiry"
                  sx={{ '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  name="company_name"
                  label="Company Name"
                  value={minimalFormData.company_name}
                  onChange={handleMinimalChange}
                  size="small"
                  sx={{ '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  name="contact_name"
                  label="Contact Name"
                  value={minimalFormData.contact_name}
                  onChange={handleMinimalChange}
                  size="small"
                  sx={{ '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
                />
              </Grid>
            </Grid>
          </Box>
        )}

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
        bgcolor: COLORS.background.white
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
            textTransform: 'none'
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            bgcolor: COLORS.primary,
            fontSize: '0.7rem',
            textTransform: 'none',
            '&:hover': { bgcolor: COLORS.primaryDark }
          }}
        >
          {loading ? 'Adding...' : 'Add Lead'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddLead;