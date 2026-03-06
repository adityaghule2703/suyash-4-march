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
  Stack,
  alpha,
  TextField,
  InputAdornment,
  Checkbox,
  TablePagination
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
  CloudUpload as CloudUploadIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
  ArrowUpward as ArrowUpwardIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';
import { DocumentDownloadDialog } from './DocumentDownloadDialog';
import VerifyDocument from './VerifyDocument';
import UploadDocument from './UploadDocument';

// Color constants from ref code
const HEADER_GRADIENT = 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)';
const STRIPE_COLOR_ODD = '#FFFFFF';
const STRIPE_COLOR_EVEN = '#f8fafc';
const HOVER_COLOR = '#f1f5f9';
const PRIMARY_BLUE = '#00B4D8';
const TEXT_COLOR_HEADER = '#FFFFFF';
const TEXT_COLOR_MAIN = '#0f172a';

const DocumentManagement = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

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

  // Filter documents based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredDocuments(documents);
    } else {
      const filtered = documents.filter(doc => 
        (doc.documentId && doc.documentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (doc._id && doc._id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (doc.type && doc.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (doc.candidateId?.fullName && doc.candidateId.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (doc.candidateId?.firstName && doc.candidateId.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (doc.candidateId?.lastName && doc.candidateId.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (doc.candidateId?.email && doc.candidateId.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (doc.status && doc.status.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredDocuments(filtered);
    }
    setPage(0);
  }, [searchTerm, documents]);

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
        console.log('Fetched documents:', response.data.data);
        setDocuments(response.data.data);
        setFilteredDocuments(response.data.data);
        setTotalCount(response.data.total || response.data.data.length);
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

  // Handle search
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle select all
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(paginatedDocuments.map(doc => doc._id || doc.documentId));
    } else {
      setSelected([]);
    }
  };

  // Handle single selection
  const handleSelect = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else {
      newSelected = selected.filter(item => item !== id);
    }
    
    setSelected(newSelected);
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selected.length === 0) return;
    // Add your bulk delete API call here
    console.log('Bulk delete for:', selected);
    // Show notification or alert
    alert(`Bulk delete for ${selected.length} items - API coming soon`);
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

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      alert('You are not logged in. Please log in again.');
      return;
    }

    setSelectedVerifyDocument(document);
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
    fetchDocuments();
  };

  // Handle download complete
  const handleDownloadComplete = (result) => {
    console.log('Download completed:', result);
  };

  // Handle verify complete
  const handleVerifyComplete = (updatedData) => {
    console.log('Verification completed:', updatedData);

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
    switch (statusLower) {
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
    if (doc.candidateId.fullName) return doc.candidateId.fullName;
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

  // Paginated documents
  const paginatedDocuments = filteredDocuments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Check if any documents are selected
  const hasSelected = selected.length > 0;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, mt: -8 }}>
      {/* Header - Styled exactly like reference code */}
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="h5" 
          component="h1" 
          fontWeight="600" 
          sx={{ 
            color: TEXT_COLOR_MAIN,
            background: HEADER_GRADIENT,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            display: 'inline-block'
          }}
        >
          Document Management
        </Typography>
        <Typography variant="body2" color="#64748B" sx={{ mt: 0.5 }}>
          View and manage all uploaded documents
        </Typography>
      </Box>

      {/* Action Bar - Styled like reference code */}
      <Paper sx={{ 
        p: 2, 
        mb: 3, 
        borderRadius: 2,
        bgcolor: '#FFFFFF',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
          {/* Search Bar */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
            <TextField
              placeholder="Search by ID, Candidate, Type, Status..."
              size="small"
              value={searchTerm}
              onChange={handleSearch}
              sx={{ 
                width: { xs: '100%', sm: 400 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  '&:hover fieldset': {
                    borderColor: PRIMARY_BLUE,
                  },
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#64748B' }} />
                  </InputAdornment>
                ),
                sx: { 
                  height: 40,
                  bgcolor: '#f8fafc',
                  '& input': {
                    padding: '8px 12px',
                    fontSize: '0.875rem'
                  }
                }
              }}
            />
            {/* <Tooltip title="Refresh">
              <IconButton 
                onClick={fetchDocuments}
                sx={{ 
                  color: '#64748B',
                  '&:hover': {
                    bgcolor: alpha(PRIMARY_BLUE, 0.1),
                    color: PRIMARY_BLUE
                  }
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip> */}
          </Stack>

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} alignItems="center">
            {hasSelected && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleBulkDelete}
                sx={{ 
                  height: 40,
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
              >
                Delete ({selected.length})
              </Button>
            )}
            <Button
              variant="contained"
              startIcon={<CloudUploadIcon />}
              onClick={handleUploadClick}
              sx={{
                height: 40,
                borderRadius: 1.5,
                background: HEADER_GRADIENT,
                fontSize: '0.875rem',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': {
                  opacity: 0.9,
                  background: HEADER_GRADIENT,
                }
              }}
            >
              Upload Document
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Table - Styled like reference code */}
      <Paper sx={{ 
        width: '100%', 
        borderRadius: 2, 
        overflow: 'hidden',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ 
                background: HEADER_GRADIENT,
                '& .MuiTableCell-root': {
                  borderBottom: 'none',
                  color: TEXT_COLOR_HEADER
                }
              }}>
                <TableCell padding="checkbox" sx={{ width: 60 }}>
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < paginatedDocuments.length}
                    checked={paginatedDocuments.length > 0 && selected.length === paginatedDocuments.length}
                    onChange={handleSelectAll}
                    sx={{
                      color: TEXT_COLOR_HEADER,
                      '&.Mui-checked': {
                        color: TEXT_COLOR_HEADER,
                      },
                      '&.MuiCheckbox-indeterminate': {
                        color: TEXT_COLOR_HEADER,
                      }
                    }}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    Document ID
                    <ArrowUpwardIcon sx={{ fontSize: 14, color: TEXT_COLOR_HEADER, opacity: 0.9 }} />
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    Candidate
                    <ArrowUpwardIcon sx={{ fontSize: 14, color: TEXT_COLOR_HEADER, opacity: 0.9 }} />
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    Type
                    <ArrowUpwardIcon sx={{ fontSize: 14, color: TEXT_COLOR_HEADER, opacity: 0.9 }} />
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    Status
                    <ArrowUpwardIcon sx={{ fontSize: 14, color: TEXT_COLOR_HEADER, opacity: 0.9 }} />
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    Size
                    <ArrowUpwardIcon sx={{ fontSize: 14, color: TEXT_COLOR_HEADER, opacity: 0.9 }} />
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    Uploaded
                    <ArrowUpwardIcon sx={{ fontSize: 14, color: TEXT_COLOR_HEADER, opacity: 0.9 }} />
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', py: 2, width: 120 }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedDocuments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <CloudUploadIcon sx={{ fontSize: 48, color: '#94A3B8', mb: 2 }} />
                      <Typography variant="body1" color="#64748B" fontWeight={500}>
                        {searchTerm ? 'No documents found matching your search' : 'No documents found'}
                      </Typography>
                      <Typography variant="body2" color="#94A3B8" sx={{ mt: 1 }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'Click "Upload Document" to add new documents'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedDocuments.map((doc, index) => {
                  const status = doc.status || 'pending';
                  const isPending = status.toLowerCase() === 'pending';
                  const candidateName = getCandidateName(doc);
                  const candidateEmail = getCandidateEmail(doc);
                  const isOddRow = index % 2 === 0;
                  const isSelected = selected.includes(doc._id || doc.documentId);
                  const docId = doc._id || doc.documentId;

                  return (
                    <TableRow
                      key={docId}
                      hover
                      selected={isSelected}
                      sx={{ 
                        bgcolor: isOddRow ? STRIPE_COLOR_ODD : STRIPE_COLOR_EVEN,
                        '&:hover': {
                          bgcolor: HOVER_COLOR
                        },
                        '&.Mui-selected': {
                          bgcolor: alpha(PRIMARY_BLUE, 0.08),
                          '&:hover': {
                            bgcolor: alpha(PRIMARY_BLUE, 0.12)
                          }
                        }
                      }}
                    >
                      <TableCell padding="checkbox" sx={{ width: 60 }}>
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleSelect(docId)}
                          sx={{
                            color: PRIMARY_BLUE,
                            '&.Mui-checked': {
                              color: PRIMARY_BLUE,
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600} color={TEXT_COLOR_MAIN}>
                          {doc.documentId || docId?.substring(0, 8) || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar 
                            sx={{ 
                              width: 32, 
                              height: 32, 
                              bgcolor: PRIMARY_BLUE,
                              fontSize: '0.875rem'
                            }}
                          >
                            {getInitials(candidateName)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {candidateName}
                            </Typography>
                            <Typography variant="caption" color="#64748B">
                              {candidateEmail}
                            </Typography>
                          </Box>
                        </Stack>
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
                        <Stack direction="row" spacing={0.5} justifyContent="center">
                          <Tooltip title="Download Document">
                            <IconButton 
                              size="small" 
                              onClick={() => handleDownloadClick(doc)}
                              sx={{ 
                                color: '#64748B',
                                '&:hover': {
                                  bgcolor: alpha(PRIMARY_BLUE, 0.1),
                                  color: PRIMARY_BLUE
                                }
                              }}
                            >
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          {isPending && (
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => handleVerifyClick(doc)}
                              sx={{
                                backgroundColor: '#10B981',
                                color: 'white',
                                fontSize: '0.75rem',
                                py: 0.5,
                                px: 1,
                                minWidth: 60,
                                '&:hover': {
                                  backgroundColor: '#059669'
                                }
                              }}
                            >
                              Verify
                            </Button>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredDocuments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: '1px solid #e2e8f0',
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontSize: '0.875rem',
              color: '#64748B'
            },
            '& .MuiTablePagination-actions button': {
              color: PRIMARY_BLUE,
            }
          }}
        />
      </Paper>

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