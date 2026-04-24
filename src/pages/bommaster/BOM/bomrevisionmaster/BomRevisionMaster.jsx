import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
  Grid,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  TextField,
  InputAdornment,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Collapse,
  Divider
} from '@mui/material';
import {
  History as HistoryIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  CompareArrows as CompareIcon,
  Download as DownloadIcon,
  Send as SendIcon,
  Refresh as RefreshIcon,
  PictureAsPdf as PdfIcon,
  Email as EmailIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';
import { COLORS, STATUS_COLORS } from '../constants';
import RevisionHistory from './RevisionHistory';
import CreateRevision from './CreateRevision';
import ViewRevision from './ViewRevision';
import CompareBomRevisions from './CompareBomRevisions';
import SendBomRevision from './SendBomRevision';
import DownloadPdf from './DownloadPdf';
import { hasPermission, ACTIONS, MODULES, PAGES } from '../../../../utils/modulePermissions';

// Add AccessDenied component at the top (after imports)
const AccessDenied = () => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <Typography variant="h6" color="error">Access Denied</Typography>
    <Typography variant="body2" color="text.secondary">You don't have permission to view this page.</Typography>
  </Box>
);


// Action Menu Component for BOM
const BomActionMenu = ({ item, anchorEl, onOpen, onClose, onRevisionHistory, onCreateRevision, onViewRevision, onCompareRevisions, onDownloadPdf, onSendEmail, permissions }) => {
    const canView = permissions?.view;
  const canCreate = permissions?.create;
  const canUpdate = permissions?.update;
  const canExport = permissions?.export;
  
  return (
    <>
      <Tooltip title="Revision Actions">
        <IconButton
          size="small"
          onClick={onOpen}
          sx={{
            color: COLORS.text.secondary,
            '&:hover': {
              bgcolor: `${COLORS.primary}20`
            }
          }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1,
            minWidth: 220,
            borderRadius: 2,
            border: `1px solid ${COLORS.border}`,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
            {canView && (
        <MenuItem onClick={() => { onRevisionHistory(item); onClose(); }} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ color: '#06B6D4', minWidth: 36 }}>
            <HistoryIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
              Revision History
            </Typography>
          </ListItemText>
        </MenuItem>
            )}
        
          {canCreate && (
        <MenuItem onClick={() => { onCreateRevision(item); onClose(); }} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ color: '#F59E0B', minWidth: 36 }}>
            <AddIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} sx={{ color: '#F59E0B', fontSize: '0.75rem' }}>
              Create New Revision
            </Typography>
          </ListItemText>
        </MenuItem>
          )}
          {canView && (
        <MenuItem onClick={() => { onViewRevision(item); onClose(); }} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
              View Specific Revision
            </Typography>
          </ListItemText>
        </MenuItem>
          )}
           {canView && (
        <MenuItem onClick={() => { onCompareRevisions(item); onClose(); }} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ color: '#8B5CF6', minWidth: 36 }}>
            <CompareIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} sx={{ color: '#8B5CF6', fontSize: '0.75rem' }}>
              Compare Revisions
            </Typography>
          </ListItemText>
        </MenuItem>
           )}
        <Divider sx={{ my: 0.5 }} />
        {canExport && (
        <MenuItem onClick={() => { onDownloadPdf(item); onClose(); }} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} sx={{ color: '#EF4444', fontSize: '0.75rem' }}>
              Download PDF
            </Typography>
          </ListItemText>
        </MenuItem>
        )}
        {canExport && (
        <MenuItem onClick={() => { onSendEmail(item); onClose(); }} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
            <SendIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} sx={{ color: '#10B981', fontSize: '0.75rem' }}>
              Send Revision Email
            </Typography>
          </ListItemText>
        </MenuItem>
        )}
      </Menu>
    </>
  );
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

const BomRevisionMaster = ({ permissions, onActionComplete, showNotification }) => {
  const [boms, setBoms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState('');
  const [revisionCounts, setRevisionCounts] = useState({});
  
  // Modal states
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openCompareModal, setOpenCompareModal] = useState(false);
  const [openSendModal, setOpenSendModal] = useState(false);
  const [openPdfModal, setOpenPdfModal] = useState(false);
  const [selectedBom, setSelectedBom] = useState(null);
  const [selectedRevision, setSelectedRevision] = useState(null);
  const [compareRevisions, setCompareRevisions] = useState({ rev1: null, rev2: null });
  const [revisionsList, setRevisionsList] = useState([]);
  
  // Action menu states
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedBomForAction, setSelectedBomForAction] = useState(null);

// User permissions
const [userPermissions, setUserPermissions] = useState([]);
const [isSuperAdmin, setIsSuperAdmin] = useState(false);
const [permissionsLoaded, setPermissionsLoaded] = useState(false);
const [revisionPermissions, setRevisionPermissions] = useState({ 
  view: false, 
  create: false, 
  update: false, 
  delete: false,
  export: false,
  print: false
});

// Fetch user permissions
useEffect(() => {
  const fetchUserPermissions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data.success) {
        const userData = response.data.data;
        setIsSuperAdmin(userData.isSuperAdmin || false);
        setUserPermissions(userData.permissions || []);
      }
    } catch (err) {
      console.error('Error fetching user permissions:', err);
    } finally {
      setPermissionsLoaded(true);
    }
  };
  fetchUserPermissions();
}, []);

// Set revision permissions
useEffect(() => {
  if (permissionsLoaded) {
    setRevisionPermissions({
      view: isSuperAdmin || hasPermission(userPermissions, MODULES.BOM_MASTER, PAGES.BOM_REVISIONS, ACTIONS.VIEW),
      create: isSuperAdmin || hasPermission(userPermissions, MODULES.BOM_MASTER, PAGES.BOM_REVISIONS, ACTIONS.CREATE),
      update: isSuperAdmin || hasPermission(userPermissions, MODULES.BOM_MASTER, PAGES.BOM_REVISIONS, ACTIONS.UPDATE),
      delete: isSuperAdmin || hasPermission(userPermissions, MODULES.BOM_MASTER, PAGES.BOM_REVISIONS, ACTIONS.DELETE),
      export: isSuperAdmin || hasPermission(userPermissions, MODULES.BOM_MASTER, PAGES.BOM_REVISIONS, ACTIONS.EXPORT),
      print: isSuperAdmin || hasPermission(userPermissions, MODULES.BOM_MASTER, PAGES.BOM_REVISIONS, ACTIONS.PRINT)
    });
  }
}, [permissionsLoaded, userPermissions, isSuperAdmin]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch BOMs
// Update fetchBoms function
const fetchBoms = useCallback(async () => {
  if (!revisionPermissions.view) return;
  
  setLoading(true);
  setError('');
  try {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams({
      page: page + 1,
      limit: rowsPerPage
    });
    if (searchTerm) {
      params.append('search', searchTerm);
    }
    
    const response = await axios.get(`${BASE_URL}/api/boms?${params.toString()}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (response.data.success) {
      const bomData = response.data.data || [];
      setBoms(bomData);
      setTotalItems(response.data.pagination?.total || bomData.length);
      
      // Fetch revision counts for each BOM
      await fetchAllRevisionCounts(bomData);
    } else {
      setError(response.data.message || 'Failed to load BOMs');
    }
  } catch (err) {
    console.error('Error fetching BOMs:', err);
    setError(err.response?.data?.message || 'Failed to load BOMs');
  } finally {
    setLoading(false);
  }
}, [page, rowsPerPage, searchTerm, revisionPermissions.view]);

  // Fetch revision counts for all BOMs
  const fetchAllRevisionCounts = async (bomsList) => {
    const counts = {};
    const token = localStorage.getItem('token');
    
    // Fetch revisions for each BOM in parallel
    const promises = bomsList.map(async (bom) => {
      try {
        const response = await axios.get(`${BASE_URL}/api/boms/${bom._id}/revisions`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.data.success) {
          counts[bom._id] = response.data.data?.total_revisions || 0;
        } else {
          counts[bom._id] = 0;
        }
      } catch (err) {
        console.error(`Error fetching revisions for BOM ${bom._id}:`, err);
        counts[bom._id] = 0;
      }
    });
    
    await Promise.all(promises);
    setRevisionCounts(counts);
  };

useEffect(() => {
  if (permissionsLoaded && revisionPermissions.view) {
    fetchBoms();
  }
}, [fetchBoms, permissionsLoaded, revisionPermissions.view]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleActionMenuOpen = (event, bom) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedBomForAction(bom);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedBomForAction(null);
  };

  // Fetch revisions for a single BOM
  const fetchBomRevisions = async (bomId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/boms/${bomId}/revisions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data.success) {
        setRevisionsList(response.data.data?.revisions || []);
        return response.data.data;
      }
      return null;
    } catch (err) {
      console.error('Error fetching revisions:', err);
      return null;
    }
  };

  const handleRevisionHistory = async (bom) => {
    setSelectedBom(bom);
    await fetchBomRevisions(bom._id);
    setOpenHistoryModal(true);
    handleActionMenuClose();
  };

  const handleCreateRevision = (bom) => {
    setSelectedBom(bom);
    setOpenCreateModal(true);
    handleActionMenuClose();
  };

  const handleViewRevision = async (bom) => {
    setSelectedBom(bom);
    const revisionsData = await fetchBomRevisions(bom._id);
    if (revisionsData && revisionsData.revisions?.length > 0) {
      setSelectedRevision(revisionsData.revisions[0]);
    }
    setOpenViewModal(true);
    handleActionMenuClose();
  };

  const handleCompareRevisions = async (bom) => {
    setSelectedBom(bom);
    const revisionsData = await fetchBomRevisions(bom._id);
    if (revisionsData && revisionsData.revisions?.length >= 2) {
      setCompareRevisions({
        rev1: revisionsData.revisions[0]?.revision_no,
        rev2: revisionsData.revisions[1]?.revision_no
      });
    }
    setOpenCompareModal(true);
    handleActionMenuClose();
  };

  const handleDownloadPdf = (bom) => {
    setSelectedBom(bom);
    setOpenPdfModal(true);
    handleActionMenuClose();
  };

  const handleSendEmail = (bom) => {
    setSelectedBom(bom);
    setOpenSendModal(true);
    handleActionMenuClose();
  };

  const handleCreateSuccess = () => {
    fetchBoms();
    if (showNotification) showNotification('New revision created successfully!', 'success');
    if (onActionComplete) onActionComplete();
  };

  const handleSendSuccess = () => {
    if (showNotification) showNotification('Revision sent successfully!', 'success');
  };

  const getBomInitials = (bom) => {
    if (!bom.bom_id) return 'BM';
    return bom.bom_id.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (bom) => {
    if (!bom.bom_id) return COLORS.primary;
    const colors = [COLORS.primary, COLORS.primaryDark, '#074346', '#0D696C', '#128C7E'];
    const charCode = bom.bom_id.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  const getStatusColor = (status) => {
    return STATUS_COLORS[status] || { bg: '#F1F5F9', color: '#475569' };
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved': return <CheckCircleIcon sx={{ fontSize: '0.7rem' }} />;
      case 'Pending': return <PendingIcon sx={{ fontSize: '0.7rem' }} />;
      default: return <PendingIcon sx={{ fontSize: '0.7rem' }} />;
    }
  };

  // Format revision numbers for display
  const formatRevisionNumbers = (bomId) => {
    const count = revisionCounts[bomId] || 0;
    if (count === 0) return '0';
    if (count === 1) return '1';
    // For multiple revisions, show range like "1, 2, 3" or just the count
    return count;
  };

  
if (!permissionsLoaded) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
      <CircularProgress size={40} sx={{ color: COLORS.primary }} />
    </Box>
  );
}

if (!revisionPermissions.view) {
  return <AccessDenied />;
}


  return (
    <Box>
      {/* Search Bar */}
      <Paper sx={{ 
        borderRadius: 2, 
        overflow: 'hidden', 
        border: `1px solid ${COLORS.border}`,
        mb: 2.5
      }}>
        <Box sx={{ p: 1.5, display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
            <TextField
              placeholder="Search BOMs by ID, name, or parent part..."
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              sx={{
                width: { xs: '100%', sm: 360 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                  '&:hover fieldset': {
                    borderColor: COLORS.primary,
                  },
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                  </InputAdornment>
                ),
                sx: {
                  height: 36,
                  bgcolor: COLORS.background.light,
                  '& input': {
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                    color: COLORS.text.primary,
                    '&::placeholder': {
                      color: COLORS.text.tertiary,
                      fontSize: '0.75rem'
                    }
                  }
                }
              }}
              disabled={loading}
            />
          </Stack>
          
          <Tooltip title="Refresh">
            <IconButton onClick={fetchBoms} sx={{ height: 36, width: 36 }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* BOMs Table */}
      <Paper sx={{ 
        width: '100%', 
        borderRadius: 2, 
        overflow: 'hidden',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        border: `1px solid ${COLORS.border}`
      }}>
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table size="small" sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow sx={{ 
                bgcolor: COLORS.background.tableHeader,
                '& .MuiTableCell-root': {
                  borderBottom: 'none',
                  color: COLORS.text.light,
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  whiteSpace: 'nowrap'
                }
              }}>
                <TableCell sx={{ minWidth: 100 }}>BOM ID / Parent Item</TableCell>
                <TableCell sx={{ width: 100 }}>Version</TableCell>
                <TableCell sx={{ width: 100 }}>Type</TableCell>
                <TableCell sx={{ width: 110 }}>Status</TableCell>
                <TableCell sx={{ width: 100 }} align="center">Revisions</TableCell>
                <TableCell sx={{ width: 80 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading BOMs...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : boms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <InventoryIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm ? 'No BOMs found' : 'No BOMs available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'Create a BOM to get started'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                boms.map((bom) => {
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && selectedBomForAction?._id === bom._id;
                  const parentItem = bom.parent_item_id || {};
                  const statusColors = getStatusColor(bom.status);
                  const revisionsCount = revisionCounts[bom._id] || 0;
                  
                  return (
                    <TableRow
                      key={bom._id}
                      hover
                      sx={{ 
                        bgcolor: COLORS.background.white,
                        '&:hover': { bgcolor: COLORS.background.hover },
                        '& .MuiTableCell-root': { py: 1.5, fontSize: '0.75rem', borderColor: COLORS.border }
                      }}
                    >
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: getAvatarColor(bom), fontSize: '0.7rem', flexShrink: 0 }}>
                            {getBomInitials(bom)}
                          </Avatar>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography sx={{ fontWeight: 600,fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{bom.bom_id}</Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, whiteSpace: 'nowrap' }}>
                              {parentItem.part_no || bom.parent_part_no}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      
                      <TableCell>
                        <Chip 
                          label={bom.bom_version} 
                          size="small" 
                          sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primary, fontWeight: 500, fontSize: '0.7rem' }} 
                        />
                      </TableCell>
                      
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{bom.bom_type}</Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(bom.status)}
                          label={bom.status || 'Pending'}
                          size="small"
                          sx={{
                            bgcolor: statusColors.bg,
                            color: statusColors.color,
                            fontWeight: 500,
                            fontSize: '0.7rem',
                            '& .MuiChip-icon': { fontSize: '0.8rem' }
                          }}
                        />
                      </TableCell>
                      
                      <TableCell align="center">
                        <Tooltip title={`${revisionsCount} revision(s) available`}>
                          <Chip
                            label={revisionsCount === 0 ? '0' : revisionsCount}
                            size="small"
                            sx={{ 
                              bgcolor: revisionsCount > 0 ? COLORS.primaryLight : COLORS.background.light, 
                              color: revisionsCount > 0 ? COLORS.primary : COLORS.text.secondary,
                              fontSize: '0.65rem',
                              fontWeight: revisionsCount > 0 ? 600 : 400,
                              minWidth: 40
                            }}
                          />
                        </Tooltip>
                      </TableCell>
                      
                      <TableCell align="center" sx={{ width: 80 }}>
                        <BomActionMenu
                          item={bom}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onOpen={(e) => handleActionMenuOpen(e, bom)}
                          onClose={handleActionMenuClose}
                          onRevisionHistory={handleRevisionHistory}
                          onCreateRevision={handleCreateRevision}
                          onViewRevision={handleViewRevision}
                          onCompareRevisions={handleCompareRevisions}
                          onDownloadPdf={handleDownloadPdf}
                          onSendEmail={handleSendEmail}
                          permissions={revisionPermissions}
                        />
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
          count={totalItems}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: `1px solid ${COLORS.border}`,
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontSize: '0.7rem',
              color: COLORS.text.secondary
            },
            '& .MuiTablePagination-select': { fontSize: '0.7rem' },
            '& .MuiTablePagination-actions button': { color: COLORS.primary }
          }}
        />
      </Paper>

      {/* Modals */}
      {revisionPermissions.view && (
      <RevisionHistory 
        open={openHistoryModal} 
        onClose={() => {
          setOpenHistoryModal(false);
          setSelectedBom(null);
        }} 
        bomId={selectedBom?._id} 
        bomCode={selectedBom?.bom_id} 
        parentPartNo={selectedBom?.parent_part_no} 
        onCompareRevisions={(r1, r2) => { 
          setCompareRevisions({ rev1: r1, rev2: r2 }); 
          setOpenCompareModal(true); 
        }} 
        onSendRevision={(rev) => { 
          setSelectedRevision({ revision_no: rev }); 
          setOpenSendModal(true); 
        }} 
        onDownloadPdf={(rev) => { 
          setSelectedRevision({ revision_no: rev }); 
          setOpenPdfModal(true); 
        }} 
      />
      )}
      {revisionPermissions.create && (
      <CreateRevision 
        open={openCreateModal} 
        onClose={() => {
          setOpenCreateModal(false);
          setSelectedBom(null);
        }} 
        bomId={selectedBom?._id} 
        onSuccess={handleCreateSuccess} 
      />
      )}
      {revisionPermissions.view && (
      <ViewRevision 
        open={openViewModal} 
        onClose={() => {
          setOpenViewModal(false);
          setSelectedBom(null);
        }} 
        bomId={selectedBom?._id} 
        revisionNo={selectedRevision?.revision_no} 
      />
      )}
      {revisionPermissions.view && (
      <CompareBomRevisions 
        open={openCompareModal} 
        onClose={() => {
          setOpenCompareModal(false);
          setSelectedBom(null);
        }} 
        bomId={selectedBom?._id} 
        bomCode={selectedBom?.bom_id} 
        revisions={revisionsList} 
        defaultRev1={compareRevisions.rev1} 
        defaultRev2={compareRevisions.rev2} 
      />
      )}
      {revisionPermissions.export && (
      <SendBomRevision 
        open={openSendModal} 
        onClose={() => {
          setOpenSendModal(false);
          setSelectedBom(null);
        }} 
        bomId={selectedBom?._id} 
        revisionNo={selectedRevision?.revision_no || 0} 
        bomCode={selectedBom?.bom_id} 
        onSuccess={handleSendSuccess} 
      />
      )}
      {revisionPermissions.export && (
      <DownloadPdf 
        open={openPdfModal} 
        onClose={() => {
          setOpenPdfModal(false);
          setSelectedBom(null);
        }} 
        bomId={selectedBom?._id} 
        revisionNo={selectedRevision?.revision_no || 0} 
        bomCode={selectedBom?.bom_id} 
      />
      )}

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.75rem' }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default BomRevisionMaster;