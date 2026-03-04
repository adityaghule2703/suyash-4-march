import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  Typography,
  Tooltip,
  CircularProgress,
  Alert,
  Button,
  Avatar,
  Stack
} from '@mui/material';
import {
  Download as DownloadIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Verified as VerifiedIcon,
  VerifiedUser as VerifiedUserIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Person as PersonIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';
import { DocumentDownloadDialog } from './DocumentDownloadDialog';
import VerifyDocument from './VerifyDocument';
import UploadDocument from './UploadDocument';

const DocumentManagement = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State for download dialog
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  
  // State for verify dialog
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [selectedVerifyDocument, setSelectedVerifyDocument] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  
  // State for upload dialog
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // Fetch documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/documents`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        console.log('Fetched documents:', response.data.data); // Debug log
        setDocuments(response.data.data);
      } else {
        setError('Failed to fetch documents');
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  // Handle download button click
  const handleDownloadClick = (document) => {
    console.log('Selected document for download:', document);
    setSelectedDocument(document);
    setDownloadDialogOpen(true);
  };

  // Handle verify button click
  const handleVerifyClick = (document) => {
    console.log('Selected document for verification:', document);
    
    // Check if token exists
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      alert('You are not logged in. Please log in again.');
      return;
    }
    
    setSelectedVerifyDocument(document);
    
    // Extract candidate info from document (candidateId is an object)
    const candidateData = document.candidateId || {};
    
    setSelectedCandidate({
      name: candidateData.fullName || `${candidateData.firstName || ''} ${candidateData.lastName || ''}`.trim() || 'Unknown',
      email: candidateData.email || '',
      position: document.position || 'N/A',
      id: candidateData._id || candidateData.id
    });
    
    setVerifyDialogOpen(true);
  };

  // Handle upload button click
  const handleUploadClick = () => {
    setUploadDialogOpen(true);
  };

  // Handle upload complete
  const handleUploadComplete = (uploadedDoc) => {
    console.log('Upload completed:', uploadedDoc);
    // Refresh the document list after successful upload
    fetchDocuments();
  };

  // Handle download complete
  const handleDownloadComplete = (result) => {
    console.log('Download completed:', result);
  };

  // Handle verify complete
  const handleVerifyComplete = (updatedData) => {
    console.log('Verification completed:', updatedData);
    
    // Update the document in the list with new status
    setDocuments(prevDocuments =>
      prevDocuments.map(doc => {
        if (doc._id === updatedData.id || doc.documentId === updatedData.documentId) {
          return {
            ...doc,
            status: updatedData.status === 'verified' ? 'verified' : 'rejected',
            verificationStatus: updatedData.status,
            verificationDetails: {
              ...doc.verificationDetails,
              verifiedBy: updatedData.verifiedBy,
              verifiedAt: updatedData.verifiedDate,
              comments: updatedData.comments
            }
          };
        }
        return doc;
      })
    );
    
    // Close the verify dialog
    setVerifyDialogOpen(false);
    setSelectedVerifyDocument(null);
    setSelectedCandidate(null);
  };

  // Status color mapping
  const getStatusColor = (status) => {
    const colors = {
      'pending': 'warning',
      'sent': 'info',
      'generated': 'success',
      'verified': 'success',
      'rejected': 'error',
      'expired': 'default',
      'uploaded': 'info'
    };
    return colors[status?.toLowerCase()] || 'default';
  };

  // Get status icon
  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase();
    switch(statusLower) {
      case 'verified': return <CheckCircleIcon fontSize="small" />;
      case 'rejected': return <ErrorIcon fontSize="small" />;
      case 'pending': return <VerifiedUserIcon fontSize="small" />;
      default: return null;
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return 'Unknown';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  // Get candidate name from the candidateId object
  const getCandidateName = (doc) => {
    if (!doc.candidateId) return 'Unknown';
    
    // If candidateId is an object with fullName
    if (doc.candidateId.fullName) return doc.candidateId.fullName;
    
    // If candidateId has firstName and lastName
    if (doc.candidateId.firstName || doc.candidateId.lastName) {
      return `${doc.candidateId.firstName || ''} ${doc.candidateId.lastName || ''}`.trim();
    }
    
    return 'Unknown';
  };

  // Get candidate email from the candidateId object
  const getCandidateEmail = (doc) => {
    return doc.candidateId?.email || '';
  };

  // Get candidate initials for avatar
  const getInitials = (name) => {
    if (!name || name === 'Unknown') return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (

    
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight="600" gutterBottom>
            Document Management
          </Typography>
          <Typography variant="body2" color="textSecondary">
            View and manage all uploaded documents
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            onClick={handleUploadClick}
            sx={{
              backgroundColor: '#1976D2',
              '&:hover': { backgroundColor: '#1565C0' }
            }}
          >
            Upload Document
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchDocuments}
          >
            Refresh
          </Button>
        </Stack>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>Document ID</strong></TableCell>
              <TableCell><strong>Candidate</strong></TableCell>
              <TableCell><strong>Type</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Size</strong></TableCell>
              <TableCell><strong>Uploaded</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <Typography color="textSecondary">No documents found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              documents.map((doc) => {
                const status = doc.status || 'pending';
                const isPending = status.toLowerCase() === 'pending';
                const candidateName = getCandidateName(doc);
                const candidateEmail = getCandidateEmail(doc);
                
                return (
                  <TableRow key={doc._id || doc.documentId} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="500">
                        {doc.documentId || doc._id?.substring(0, 8) || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                          {getInitials(candidateName)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="500">
                            {candidateName}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {candidateEmail}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={doc.type?.replace(/_/g, ' ') || 'Document'} 
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={status}
                        color={getStatusColor(status)}
                        size="small"
                        icon={getStatusIcon(status)}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatFileSize(doc.fileSize)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        }) : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        {/* Download Button */}
                        {/* <Tooltip title="Download Document">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleDownloadClick(doc)}
                          >
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip> */}

                        {/* Verify Button - Show for Pending documents */}
                        {isPending && (
                          <Tooltip title="Verify Document">
                            <IconButton 
                              size="small" 
                              color="success"
                              onClick={() => handleVerifyClick(doc)}
                            >
                              <VerifiedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        {/* Edit Button - Only for Generated status */}
                        {/* {status === 'generated' && (
                          <Tooltip title="Edit Document">
                            <IconButton size="small" color="secondary">
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )} */}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Download Dialog */}
      <DocumentDownloadDialog
        open={downloadDialogOpen}
        onClose={() => {
          setDownloadDialogOpen(false);
          setSelectedDocument(null);
        }}
        document={selectedDocument}
        onDownloadComplete={handleDownloadComplete}
      />

      {/* Verify Dialog */}
      <VerifyDocument
        open={verifyDialogOpen}
        onClose={() => {
          setVerifyDialogOpen(false);
          setSelectedVerifyDocument(null);
          setSelectedCandidate(null);
        }}
        document={selectedVerifyDocument}
        candidate={selectedCandidate}
        onComplete={handleVerifyComplete}
      />

      {/* Upload Dialog */}
      <UploadDocument
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onSubmit={handleUploadComplete}
      />
    </Box>
  );
};

export default DocumentManagement;