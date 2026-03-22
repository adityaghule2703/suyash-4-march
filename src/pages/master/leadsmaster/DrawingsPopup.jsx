import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Stack,
  Paper,
  Alert,
  IconButton,
  Grid,
  CircularProgress,
  Chip
} from '@mui/material';
import { 
  Close as CloseIcon, 
  CloudUpload as CloudUploadIcon,
  InsertDriveFile as FileIcon,
  Delete as DeleteIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  Description as DwgIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { COLORS } from './constants';

const DrawingsPopup = ({ open, onClose, lead, onDrawingUpload }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [drawingFile, setDrawingFile] = useState(null);
  const [formData, setFormData] = useState({
    drawing_no: '',
    revision_no: '',
    remarks: ''
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'application/dwg', 'image/vnd.dwg'];
      const allowedExtensions = ['.pdf', '.png', '.jpg', '.jpeg', '.dwg', '.dxf'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      
      if (!allowedExtensions.includes(fileExtension)) {
        setError('Please upload a valid file (PDF, PNG, JPG, JPEG, DWG, DXF)');
        return;
      }
      
      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        setError('File size should be less than 10MB');
        return;
      }
      
      setDrawingFile(file);
      setError('');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!drawingFile) {
      setError('Please select a drawing file');
      return false;
    }
    if (!formData.drawing_no.trim()) {
      setError('Drawing number is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('drawing', drawingFile);
      formDataToSend.append('drawing_no', formData.drawing_no);
      if (formData.revision_no) {
        formDataToSend.append('revision_no', formData.revision_no);
      }
      if (formData.remarks) {
        formDataToSend.append('remarks', formData.remarks);
      }

      const response = await axios.post(
        `${BASE_URL}/api/leads/${lead._id}/drawing`,
        formDataToSend,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          } 
        }
      );
      
      if (response.data.success) {
        onDrawingUpload(response.data.data);
        handleClose();
      } else {
        setError(response.data.message || 'Failed to upload drawing');
      }
    } catch (err) {
      console.error('Error uploading drawing:', err);
      setError(err.response?.data?.message || 'Failed to upload drawing');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setDrawingFile(null);
    setFormData({
      drawing_no: '',
      revision_no: '',
      remarks: ''
    });
    setError('');
    onClose();
  };

  const getFileIcon = () => {
    if (!drawingFile) return <CloudUploadIcon sx={{ fontSize: 48, color: COLORS.text.tertiary }} />;
    
    const fileExtension = drawingFile.name.substring(drawingFile.name.lastIndexOf('.')).toLowerCase();
    
    if (fileExtension === '.pdf') {
      return <PdfIcon sx={{ fontSize: 48, color: '#EF4444' }} />;
    } else if (['.png', '.jpg', '.jpeg'].includes(fileExtension)) {
      return <ImageIcon sx={{ fontSize: 48, color: '#10B981' }} />;
    } else if (['.dwg', '.dxf'].includes(fileExtension)) {
      return <DwgIcon sx={{ fontSize: 48, color: '#3B82F6' }} />;
    }
    return <FileIcon sx={{ fontSize: 48, color: COLORS.text.tertiary }} />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!lead) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 5,
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
        mb: 2,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
          Upload Drawing
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2.5}>
          {/* Lead Information */}
          {/* <Paper sx={{ 
            p: 1.5, 
            bgcolor: COLORS.background.light, 
            borderRadius: 1.5, 
            border: `1px solid ${COLORS.border}`,
            boxShadow: 'none'
          }}>
            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Lead ID:</Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                  {lead.lead_id}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Company:</Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                  {lead.company_name}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Subject:</Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                  {lead.subject}
                </Typography>
              </Stack>
            </Stack>
          </Paper> */}

          {/* File Upload Section */}
          <Box>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1, letterSpacing: '0.5px' }}>
              DRAWING FILE <span style={{ color: '#EF4444' }}>*</span>
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                textAlign: 'center',
                border: `2px dashed ${drawingFile ? COLORS.primary : COLORS.border}`,
                borderRadius: 2,
                bgcolor: drawingFile ? COLORS.primaryLight : COLORS.background.white,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: COLORS.primary,
                  bgcolor: COLORS.primaryLight
                }
              }}
              onClick={() => document.getElementById('drawing-upload').click()}
            >
              <input
                id="drawing-upload"
                type="file"
                hidden
                accept=".pdf,.png,.jpg,.jpeg,.dwg,.dxf"
                onChange={handleFileChange}
                disabled={loading}
              />
              <Stack spacing={1.5} alignItems="center">
                {getFileIcon()}
                {drawingFile ? (
                  <>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                      {drawingFile.name}
                    </Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                      {formatFileSize(drawingFile.size)}
                    </Typography>
                    <Chip
                      label="Click to change"
                      size="small"
                      sx={{ fontSize: '0.65rem', height: 24 }}
                    />
                  </>
                ) : (
                  <>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: COLORS.text.primary }}>
                      Click or drag to upload
                    </Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                      Supported formats: PDF, PNG, JPG, JPEG, DWG, DXF (Max 10MB)
                    </Typography>
                  </>
                )}
              </Stack>
            </Paper>
          </Box>

          {/* Drawing Details */}
          <Box>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              Drawing Details
            </Typography>
            
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                    DRAWING NUMBER <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="drawing_no"
                    value={formData.drawing_no}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="e.g., DWG-CUST-001"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        '&:hover fieldset': { borderColor: COLORS.primary },
                        '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                      },
                      '& .MuiInputBase-input': {
                        py: 1,
                        px: 1.5,
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.25 }}>
                    Unique identifier for the drawing
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                    REVISION NUMBER
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="revision_no"
                    value={formData.revision_no}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="e.g., B"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        '&:hover fieldset': { borderColor: COLORS.primary },
                        '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                      },
                      '& .MuiInputBase-input': {
                        py: 1,
                        px: 1.5,
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                    REMARKS
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="e.g., Updated hole diameter to D3.5"
                    multiline
                    rows={2}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        '&:hover fieldset': { borderColor: COLORS.primary },
                        '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                      },
                      '& .MuiInputBase-input': {
                        py: 1,
                        px: 1.5,
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Preview of Drawing Info */}
          {(formData.drawing_no || drawingFile) && (
            <Box sx={{ 
              p: 1.5, 
              bgcolor: COLORS.primaryLight, 
              borderRadius: 1.5,
              border: `1px solid ${COLORS.primary}`
            }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primaryDark, mb: 1 }}>
                Drawing Information Summary
              </Typography>
              <Stack spacing={0.5}>
                {drawingFile && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>File:</Typography>
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {drawingFile.name}
                    </Typography>
                  </Stack>
                )}
                {formData.drawing_no && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Drawing No:</Typography>
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {formData.drawing_no}
                    </Typography>
                  </Stack>
                )}
                {formData.revision_no && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Revision:</Typography>
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {formData.revision_no}
                    </Typography>
                  </Stack>
                )}
                {formData.remarks && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Remarks:</Typography>
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 500, color: COLORS.text.primary, maxWidth: '60%', textAlign: 'right' }}>
                      {formData.remarks}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Box>
          )}

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: 1.5,
                '& .MuiAlert-icon': { fontSize: '1.25rem', alignItems: 'center' },
                fontSize: '0.75rem',
                py: 0.5
              }}
            >
              {error}
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 1
      }}>
        <Button
          onClick={handleClose}
          disabled={loading}
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
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !drawingFile || !formData.drawing_no}
          startIcon={loading ? <CircularProgress size={16} sx={{ color: COLORS.text.light }} /> : <CloudUploadIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            bgcolor: COLORS.primary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': {
              bgcolor: COLORS.primaryDark,
            }
          }}
        >
          {loading ? 'Uploading...' : 'Upload Drawing'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DrawingsPopup;