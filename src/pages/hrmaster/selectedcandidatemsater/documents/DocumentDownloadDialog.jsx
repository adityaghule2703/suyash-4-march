import React, { useState, useEffect } from 'react';
import {
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Stack,
  Paper
} from '@mui/material';
import {
  Download as DownloadIcon,
  Close as CloseIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  Description as DescriptionIcon,
  InsertDriveFile as FileIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';

// Hook for downloading documents
const useDocumentDownload = () => {
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [error, setError] = useState('');

  const downloadDocument = async (documentId, filename = 'document') => {
    if (!documentId) {
      setError('Document ID is required');
      return { success: false, error: 'Document ID is required' };
    }

    setDownloading(true);
    setError('');
    setDownloadProgress(0);

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      console.log(`Downloading document: ${documentId}`);
      
      const response = await axios.get(
        `${BASE_URL}/api/documents/${documentId}/download`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          responseType: 'blob',
          onDownloadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setDownloadProgress(percent);
            }
          }
        }
      );

      if (response.data instanceof Blob) {
        // Check if the blob is actually an error message (JSON)
        if (response.data.type === 'application/json') {
          const errorText = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsText(response.data);
          });
          
          try {
            const errorJson = JSON.parse(errorText);
            throw new Error(errorJson.message || 'Download failed');
          } catch {
            throw new Error('Download failed: Server returned unexpected response');
          }
        }

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        
        const contentDisposition = response.headers['content-disposition'];
        let serverFilename = filename;
        
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
          if (filenameMatch && filenameMatch[1]) {
            serverFilename = filenameMatch[1].replace(/['"]/g, '');
          }
        }
        
        if (!serverFilename.includes('.')) {
          const contentType = response.headers['content-type'];
          if (contentType?.includes('pdf')) serverFilename += '.pdf';
          else if (contentType?.includes('image/jpeg')) serverFilename += '.jpg';
          else if (contentType?.includes('image/png')) serverFilename += '.png';
          else if (contentType?.includes('image/jpg')) serverFilename += '.jpg';
          else if (contentType?.includes('text/plain')) serverFilename += '.txt';
        }
        
        link.setAttribute('download', serverFilename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
        return { success: true, filename: serverFilename };
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error downloading document:', err);
      
      let errorMessage = 'Failed to download document';
      
      if (err.response?.data instanceof Blob) {
        try {
          const errorText = await new Response(err.response.data).text();
          try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.message || errorMessage;
          } catch {
            errorMessage = errorText || errorMessage;
          }
        } catch {
          errorMessage = err.response?.data?.message || errorMessage;
        }
      } else if (err.response?.data) {
        errorMessage = err.response.data.message || errorMessage;
      } else {
        errorMessage = err.message || errorMessage;
      }
      
      setError(errorMessage);
      
      return { success: false, error: errorMessage };
    } finally {
      setDownloading(false);
      setDownloadProgress(0);
    }
  };

  return {
    downloadDocument,
    downloading,
    downloadProgress,
    error,
    setError
  };
};

// Document Download Button Component
const DocumentDownloadButton = ({ 
  documentId, 
  filename, 
  variant = 'icon', 
  size = 'medium',
  onDownloadStart,
  onDownloadComplete,
  onDownloadError,
  disabled = false
}) => {
  const { downloadDocument, downloading, downloadProgress, error } = useDocumentDownload();

  // Show error tooltip if there's an error
  useEffect(() => {
    if (error && onDownloadError) {
      onDownloadError(error);
    }
  }, [error, onDownloadError]);

  const handleDownload = async (e) => {
    e.stopPropagation();
    
    if (!documentId) {
      if (onDownloadError) onDownloadError('Document ID is missing');
      return;
    }
    
    if (onDownloadStart) onDownloadStart();
    
    const result = await downloadDocument(documentId, filename);
    
    if (result.success && onDownloadComplete) {
      onDownloadComplete(result);
    }
  };

  if (variant === 'icon') {
    return (
      <Tooltip title={!documentId ? 'Document ID missing' : (downloading ? `Downloading... ${downloadProgress}%` : 'Download Document')}>
        <span>
          <IconButton
            onClick={handleDownload}
            disabled={disabled || downloading || !documentId}
            size={size}
            color="primary"
          >
            {downloading ? (
              <CircularProgress size={24} />
            ) : (
              <DownloadIcon />
            )}
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  return (
    <Button
      variant="contained"
      startIcon={downloading ? <CircularProgress size={20} /> : <DownloadIcon />}
      onClick={handleDownload}
      disabled={disabled || downloading || !documentId}
      size={size}
    >
      {downloading ? `Downloading... ${downloadProgress}%` : 'Download Document'}
    </Button>
  );
};

// Document Download Dialog Component
const DocumentDownloadDialog = ({ 
  open, 
  onClose, 
  document,
  onDownloadComplete 
}) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { downloadDocument } = useDocumentDownload();

  // Debug: Log document prop to see what's being passed
  useEffect(() => {
    if (open) {
      console.log('DocumentDownloadDialog received document:', document);
      console.log('Document ID:', document?._id || document?.id || document?.documentId);
    }
  }, [open, document]);

  const handleDownload = async () => {
    // Get document ID from various possible locations
    const documentId = document?._id || document?.id || document?.documentId;
    
    if (!documentId) {
      setError('Document ID not found');
      console.error('Document ID missing. Document object:', document);
      return;
    }

    setDownloading(true);
    setError('');
    setDownloadProgress(0);

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      console.log(`Downloading document ID: ${documentId}`);
      
      const response = await axios.get(
        `${BASE_URL}/api/documents/${documentId}/download`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          responseType: 'blob',
          onDownloadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setDownloadProgress(percent);
            }
          }
        }
      );

      if (response.data instanceof Blob) {
        // Check if the blob is actually an error message (JSON)
        if (response.data.type === 'application/json') {
          const errorText = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsText(response.data);
          });
          
          try {
            const errorJson = JSON.parse(errorText);
            throw new Error(errorJson.message || 'Download failed');
          } catch {
            throw new Error('Download failed: Server returned unexpected response');
          }
        }

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        
        // Get filename from multiple sources
        let filename = document?.filename || document?.originalName || 'document';
        
        const contentDisposition = response.headers['content-disposition'];
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1].replace(/['"]/g, '');
          }
        }
        
        // Add extension if missing
        if (!filename.includes('.')) {
          const contentType = response.headers['content-type'];
          if (contentType?.includes('pdf')) filename += '.pdf';
          else if (contentType?.includes('jpeg')) filename += '.jpg';
          else if (contentType?.includes('png')) filename += '.png';
          else if (contentType?.includes('gif')) filename += '.gif';
          else if (contentType?.includes('text')) filename += '.txt';
        }
        
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
        setSuccess(true);
        
        if (onDownloadComplete) {
          onDownloadComplete({ success: true, filename });
        }
        
        setTimeout(() => {
          onClose();
          setSuccess(false);
        }, 1500);
      }
    } catch (err) {
      console.error('Error downloading document:', err);
      
      let errorMessage = 'Failed to download document';
      
      if (err.response?.data instanceof Blob) {
        try {
          const errorText = await new Response(err.response.data).text();
          try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.message || errorMessage;
          } catch {
            errorMessage = errorText || errorMessage;
          }
        } catch {
          errorMessage = err.message || errorMessage;
        }
      } else {
        errorMessage = err.message || errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      setDownloading(false);
      setDownloadProgress(0);
    }
  };

  const getFileIcon = (doc) => {
    if (!doc) return <FileIcon sx={{ fontSize: 40, color: '#757575' }} />;
    
    const filename = doc?.filename || doc?.originalName || '';
    const fileType = doc?.fileType || '';
    
    if (fileType === 'application/pdf' || filename?.toLowerCase().endsWith('.pdf')) {
      return <PdfIcon sx={{ fontSize: 40, color: '#F40F02' }} />;
    } else if (fileType?.startsWith('image/') || /\.(jpg|jpeg|png|gif)$/i.test(filename)) {
      return <ImageIcon sx={{ fontSize: 40, color: '#2196F3' }} />;
    } else if (fileType?.includes('document') || filename?.endsWith('.doc') || filename?.endsWith('.docx')) {
      return <DescriptionIcon sx={{ fontSize: 40, color: '#2E7D32' }} />;
    }
    return <FileIcon sx={{ fontSize: 40, color: '#757575' }} />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return 'Unknown size';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  // Get document ID for debugging
  const documentId = document?._id || document?.id || document?.documentId;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ 
        borderBottom: 1, 
        borderColor: '#E0E0E0', 
        bgcolor: '#F8FAFC',
        px: 3,
        py: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6" fontWeight={600}>Download Document</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            onClose={() => setError('')}
            icon={<ErrorIcon />}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert 
            severity="success" 
            icon={<CheckCircleIcon />}
            sx={{ mb: 3 }}
          >
            Document downloaded successfully!
          </Alert>
        )}

        {!document && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            No document data provided
          </Alert>
        )}

        {document && (
          <Paper sx={{ p: 3, bgcolor: '#F8FAFC', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              {getFileIcon(document)}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight={600} noWrap>
                  {document.filename || document.originalName || 'Unnamed Document'}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {document.documentId || document._id || 'No ID'} • {formatFileSize(document.fileSize)}
                </Typography>
              </Box>
            </Box>

            <Stack spacing={2}>
              {document.type && (
                <Box>
                  <Typography variant="caption" color="textSecondary">Document Type</Typography>
                  <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                    {document.type.replace(/_/g, ' ')}
                  </Typography>
                </Box>
              )}

              {document.description && (
                <Box>
                  <Typography variant="caption" color="textSecondary">Description</Typography>
                  <Typography variant="body2">{document.description}</Typography>
                </Box>
              )}

              {document.uploadedAt && (
                <Box>
                  <Typography variant="caption" color="textSecondary">Uploaded On</Typography>
                  <Typography variant="body2">
                    {new Date(document.uploadedAt).toLocaleDateString()}
                  </Typography>
                </Box>
              )}

              {downloading && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Downloading... {downloadProgress}%
                  </Typography>
                  <Box sx={{ 
                    width: '100%', 
                    bgcolor: '#E0E0E0', 
                    borderRadius: 3,
                    height: 8,
                    overflow: 'hidden'
                  }}>
                    <Box
                      sx={{
                        width: `${downloadProgress}%`,
                        height: '100%',
                        bgcolor: '#1976D2',
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </Box>
                </Box>
              )}

              {/* Debug info - remove in production */}
              {process.env.NODE_ENV === 'development' && (
                <Box sx={{ mt: 2, p: 1, bgcolor: '#F0F0F0', borderRadius: 1 }}>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Debug Info:
                  </Typography>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Document ID: {documentId || 'Not found'}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Has _id: {document._id ? 'Yes' : 'No'}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Has id: {document.id ? 'Yes' : 'No'}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Has documentId: {document.documentId ? 'Yes' : 'No'}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Paper>
        )}
      </DialogContent>

      <DialogActions sx={{ 
        px: 3, 
        py: 2, 
        borderTop: 1, 
        borderColor: '#E0E0E0',
        bgcolor: '#F8FAFC',
        justifyContent: 'space-between'
      }}>
        <Button onClick={onClose} disabled={downloading} variant="outlined">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleDownload}
          disabled={downloading || !documentId}
          startIcon={downloading ? <CircularProgress size={20} /> : <DownloadIcon />}
          color="primary"
        >
          {downloading ? `Downloading... ${downloadProgress}%` : 'Download Document'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Export all components
export {
  useDocumentDownload,
  DocumentDownloadButton,
  DocumentDownloadDialog
};

// Default export DocumentDownloadDialog
export default DocumentDownloadDialog;