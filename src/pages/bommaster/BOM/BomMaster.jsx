import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Stack,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  History as HistoryIcon,
  AttachMoney as MoneyIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { hasPermission, ACTIONS, MODULES, PAGES, getAllowedActions } from '../../../utils/modulePermissions';
import BomList from './bom/BomList';
import BomRevisionMaster from './bomrevisionmaster/BomRevisionMaster';
import BomCosting from './bomcosting/BomCosting';
import { COLORS, BOM_TABS } from './constants';

// Import all BOM action modals
import AddBom from './bom/AddBom';
import ViewBom from './bom/ViewBom';
import EditBom from './bom/EditBom';
import CopyBom from './bom/CopyBom';
import ValidateBom from './bom/ValidateBom';
import ApproveBom from './bom/ApproveBom';
import SetDefaultBom from './bom/SetDefaultBom';
import BomExplosion from './bom/BomExplosion';
import DeleteBom from './bom/DeleteBom';

const TabPanel = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index} style={{ paddingTop: 0 }}>
    {value === index && children}
  </div>
);

const LoadingState = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
    <CircularProgress size={40} sx={{ color: COLORS.primary }} />
  </Box>
);

const AccessDenied = () => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <Typography variant="h6" color="error">Access Denied</Typography>
    <Typography variant="body2" color="text.secondary">You don't have permission to view this page.</Typography>
  </Box>
);

const BomMaster = () => {
  const [boms, setBoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [selected, setSelected] = useState([]);
  const [selectedBom, setSelectedBom] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [tabValue, setTabValue] = useState(0);

  // Modal states
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openCopyModal, setOpenCopyModal] = useState(false);
  const [openValidateModal, setOpenValidateModal] = useState(false);
  const [openApproveModal, setOpenApproveModal] = useState(false);
  const [openSetDefaultModal, setOpenSetDefaultModal] = useState(false);
  const [openExplosionModal, setOpenExplosionModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openWhereUsedModal, setOpenWhereUsedModal] = useState(false);

  const [whereUsedData, setWhereUsedData] = useState(null);
  const [whereUsedLoading, setWhereUsedLoading] = useState(false);
  const [explosionData, setExplosionData] = useState(null);
  const [explosionLoading, setExplosionLoading] = useState(false);

  // User permissions
  const [userPermissions, setUserPermissions] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);
  const [pagePermissions, setPagePermissions] = useState({ view: false, create: false, update: false, delete: false, approve: false });

  const AccessDenied = () => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <Typography variant="h6" color="error">Access Denied</Typography>
    <Typography variant="body2" color="text.secondary">You don't have permission to view this page.</Typography>
  </Box>
);

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

  // Set page permissions
  useEffect(() => {
    if (permissionsLoaded) {
      setPagePermissions({
        view: isSuperAdmin || hasPermission(userPermissions, MODULES.BOM_MASTER, PAGES.BOM_MASTER, ACTIONS.VIEW),
        create: isSuperAdmin || hasPermission(userPermissions, MODULES.BOM_MASTER, PAGES.BOM_MASTER, ACTIONS.CREATE),
        update: isSuperAdmin || hasPermission(userPermissions, MODULES.BOM_MASTER, PAGES.BOM_MASTER, ACTIONS.UPDATE),
        delete: isSuperAdmin || hasPermission(userPermissions, MODULES.BOM_MASTER, PAGES.BOM_MASTER, ACTIONS.DELETE)
      });
    }
  }, [permissionsLoaded, userPermissions, isSuperAdmin]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => { setSearchTerm(searchInput); setPage(0); }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch BOMs
  useEffect(() => {
    if (permissionsLoaded && pagePermissions.view) {
      fetchBoms();
    }
  }, [permissionsLoaded, pagePermissions.view, page, rowsPerPage, searchTerm]);

  const fetchBoms = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({ page: page + 1, limit: rowsPerPage });
      if (searchTerm) params.append('search', searchTerm);
      const response = await axios.get(`${BASE_URL}/api/boms?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data.success) {
        setBoms(response.data.data || []);
        setTotalItems(response.data.pagination?.total || 0);
      }
    } catch (err) {
      console.error('Error fetching BOMs:', err);
      showNotification('Failed to load BOMs', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm]);

  const handleSelectAll = (event) => {
    if (event.target.checked) setSelected(boms.map(bom => bom._id));
    else setSelected([]);
  };

  const handleSelect = (id) => {
    const selectedIndex = selected.indexOf(id);
    if (selectedIndex === -1) setSelected([...selected, id]);
    else setSelected(selected.filter(item => item !== id));
  };

  const handleChangePage = (event, newPage) => { setPage(newPage); setSelected([]); };
  const handleChangeRowsPerPage = (event) => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0); setSelected([]); };

  const handleTabChange = (event, newValue) => { setTabValue(newValue); };

  const showNotification = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const refreshBomList = () => {
    fetchBoms();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved': return <CheckCircleIcon sx={{ fontSize: '0.8rem', color: '#059669' }} />;
      case 'Pending': return <PendingIcon sx={{ fontSize: '0.8rem', color: '#D97706' }} />;
      default: return <PendingIcon sx={{ fontSize: '0.8rem', color: '#4F46E5' }} />;
    }
  };

  const getBomInitials = (bom) => {
    if (!bom?.bom_id) return 'BM';
    return bom.bom_id.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (bom) => {
    if (!bom?.bom_id) return COLORS.primary;
    const colors = [COLORS.primary, COLORS.primaryDark, '#074346', '#0D696C', '#128C7E'];
    const charCode = bom.bom_id.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  // BOM Action handlers
  const handleAddBom = () => setOpenAddModal(true);
  const handleAddSuccess = () => { refreshBomList(); showNotification('BOM added successfully!', 'success'); };

  const handleViewBom = (bom) => { setSelectedBom(bom); setOpenViewModal(true); };
  const handleEditBom = (bom) => { setSelectedBom(bom); setOpenEditModal(true); };
  const handleEditSuccess = () => { refreshBomList(); showNotification('BOM updated successfully!', 'success'); };

  const handleDeleteBom = (bom) => { setSelectedBom(bom); setOpenDeleteModal(true); };
  const handleDeleteSuccess = () => { refreshBomList(); setSelected([]); showNotification('BOM deleted successfully!', 'success'); };

  const handleCopyBom = (bom) => { setSelectedBom(bom); setOpenCopyModal(true); };
  const handleCopySuccess = () => { refreshBomList(); showNotification('BOM copied successfully!', 'success'); };

  const handleValidateBom = (bom) => { setSelectedBom(bom); setOpenValidateModal(true); };
  const handleApproveBom = (bom) => { setSelectedBom(bom); setOpenApproveModal(true); };
  const handleApproveSuccess = () => { refreshBomList(); showNotification('BOM approved successfully!', 'success'); };

  const handleSetDefaultBom = (bom) => { setSelectedBom(bom); setOpenSetDefaultModal(true); };
  const handleSetDefaultSuccess = () => { refreshBomList(); showNotification('BOM set as default!', 'success'); };

  // Where Used Handler
  const handleWhereUsed = async (bom) => {
    if (!pagePermissions.view) return;
    setSelectedBom(bom);
    setOpenWhereUsedModal(true);
    setWhereUsedLoading(true);
    try {
      const token = localStorage.getItem('token');
      const componentId = bom.components?.[0]?.component_item_id?._id ||
        bom.components?.[0]?.component_item_id;
      if (componentId) {
        const response = await axios.get(`${BASE_URL}/api/boms/where-used/${componentId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.data.success) {
          setWhereUsedData(response.data.data);
        } else {
          showNotification('Failed to load where-used data', 'error');
        }
      } else {
        setWhereUsedData(null);
        showNotification('No components found in this BOM', 'info');
      }
    } catch (err) {
      console.error('Error fetching where-used data:', err);
      showNotification('Failed to load where-used data', 'error');
    } finally {
      setWhereUsedLoading(false);
    }
  };

  // BOM Explosion Handler
  const handleExplosionBom = async (bom) => {
    if (!pagePermissions.view) return;
    setSelectedBom(bom);
    setOpenExplosionModal(true);
    setExplosionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const quantity = 1;
      const effectiveDate = new Date().toISOString().split('T')[0];
      const response = await axios.get(`${BASE_URL}/api/boms/${bom._id}/explosion?quantity=${quantity}&effective_date=${effectiveDate}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data.success) {
        setExplosionData(response.data.data);
      } else {
        showNotification('Failed to load BOM explosion', 'error');
      }
    } catch (err) {
      console.error('Error fetching BOM explosion:', err);
      showNotification('Failed to load BOM explosion', 'error');
    } finally {
      setExplosionLoading(false);
    }
  };

  // Define actions object for BomList
  const actions = {
    onView: handleViewBom,
    onEdit: pagePermissions.update ? handleEditBom : null,
    onDelete: pagePermissions.delete ? handleDeleteBom : null,
    onWhereUsed: handleWhereUsed,
    onExplosion: handleExplosionBom,
    onValidate: handleValidateBom,
    onCopy: pagePermissions.create ? handleCopyBom : null,
    onApprove: pagePermissions.approve ? handleApproveBom : null,
    onSetDefault: pagePermissions.update ? handleSetDefaultBom : null
  };

  if (!permissionsLoaded) return <LoadingState />;
  if (!pagePermissions.view) return <AccessDenied />;

  const currentTab = BOM_TABS[tabValue];

  // Where Used Modal Component
  const WhereUsedModal = ({ open, onClose, component, usedInBoms, loading }) => {
    const formatDate = (dateString) => {
      if (!dateString) return '-';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ borderBottom: `1px solid ${COLORS.border}`, py: 1.5, px: 2.5 }}>
          <Typography sx={{ fontWeight: 600 }}>Where Used</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 2.5 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={32} />
            </Box>
          ) : (
            <>
              <Paper sx={{ p: 2, mb: 2, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                <Typography variant="caption" color="text.secondary">Component</Typography>
                <Typography sx={{ fontWeight: 600 }}>{component?.part_no || '-'}</Typography>
                <Typography variant="body2" color="text.secondary">{component?.part_description || '-'}</Typography>
              </Paper>
              <Typography sx={{ fontWeight: 600, mb: 1.5 }}>Used in {usedInBoms?.length || 0} BOM(s)</Typography>
              {usedInBoms?.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center', bgcolor: COLORS.background.light }}>
                  <Typography>This component is not used in any BOM</Typography>
                </Paper>
              ) : (
                <Stack spacing={1.5}>
                  {usedInBoms.map((bom, idx) => (
                    <Paper key={idx} sx={{ p: 2, border: `1px solid ${COLORS.border}`, borderRadius: 1.5 }}>
                      <Typography><strong>BOM ID:</strong> {bom.bom_id}</Typography>
                      <Typography><strong>Parent Part:</strong> {bom.parent_part_no}</Typography>
                      <Typography><strong>Parent Description:</strong> {bom.parent_description}</Typography>
                      <Typography><strong>Status:</strong> {bom.status}</Typography>
                      <Typography><strong>Version:</strong> {bom.bom_version}</Typography>
                    </Paper>
                  ))}
                </Stack>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: `1px solid ${COLORS.border}` }}>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  };

  // BOM Explosion Modal Component
  const ExplosionModal = ({ open, onClose, explosionData, loading }) => {
    const formatNumber = (num) => {
      return parseFloat(num).toFixed(4);
    };

    return (
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ borderBottom: `1px solid ${COLORS.border}`, py: 1.5, px: 2.5 }}>
          <Typography sx={{ fontWeight: 600 }}>BOM Explosion</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 2.5 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={32} />
            </Box>
          ) : explosionData ? (
            <>
              <Paper sx={{ p: 2, mb: 2.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary">BOM ID</Typography>
                    <Typography sx={{ fontWeight: 600 }}>{explosionData.bom_id}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary">Requested Quantity</Typography>
                    <Typography sx={{ fontWeight: 600 }}>{explosionData.requested_quantity}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="caption" color="text.secondary">Parent Item</Typography>
                    <Typography sx={{ fontWeight: 600 }}>{explosionData.parent_item?.part_no}</Typography>
                    <Typography variant="body2" color="text.secondary">{explosionData.parent_item?.description}</Typography>
                  </Grid>
                </Grid>
              </Paper>
              <Typography sx={{ fontWeight: 600, mb: 1.5 }}>Component Requirements</Typography>
              <TableContainer component={Paper} sx={{ borderRadius: 1.5 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: COLORS.background.tableHeader }}>
                      <TableCell sx={{ color: COLORS.text.light, fontWeight: 600 }}>Level</TableCell>
                      <TableCell sx={{ color: COLORS.text.light, fontWeight: 600 }}>Part No</TableCell>
                      <TableCell sx={{ color: COLORS.text.light, fontWeight: 600 }}>Description</TableCell>
                      <TableCell sx={{ color: COLORS.text.light, fontWeight: 600 }}>Quantity</TableCell>
                      <TableCell sx={{ color: COLORS.text.light, fontWeight: 600 }}>Unit</TableCell>
                      <TableCell sx={{ color: COLORS.text.light, fontWeight: 600 }}>Scrap %</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {explosionData.explosion?.map((item, idx) => (
                      <TableRow key={idx} hover>
                        <TableCell>{item.level}</TableCell>
                        <TableCell>{item.part_no}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{formatNumber(item.quantity)}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>{item.scrap_percent}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: `1px solid ${COLORS.border}` }}>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box sx={{ p: 2.5 }}>
      {/* Page Header */}
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h5" sx={{ fontSize: '1.25rem', fontWeight: 700, color: COLORS.text.primary, mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          {currentTab?.icon === 'Inventory' && <InventoryIcon sx={{ color: COLORS.primary }} />}
          {currentTab?.icon === 'History' && <HistoryIcon sx={{ color: COLORS.primary }} />}
          {currentTab?.icon === 'AttachMoney' && <MoneyIcon sx={{ color: COLORS.primary }} />}
          {currentTab?.label || 'BOM Master'}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage Bill of Materials, track revisions, and analyze costs
        </Typography>
      </Box>

      {/* Tabs */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden', border: `1px solid ${COLORS.border}` }}>
        <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" sx={{ borderBottom: `1px solid ${COLORS.border}`, bgcolor: COLORS.background.white }}>
          {BOM_TABS.map((tab, index) => (
            <Tab key={tab.value} label={tab.label} sx={{ textTransform: 'none', fontSize: '0.75rem', fontWeight: 500 }} />
          ))}
        </Tabs>

        {/* BOM Tab */}
        <TabPanel value={tabValue} index={0}>
     
          <BomList
            boms={boms}
            loading={loading}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            page={page}
            rowsPerPage={rowsPerPage}
            totalItems={totalItems}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            selected={selected}
            handleSelectAll={handleSelectAll}
            handleSelect={handleSelect}
            permissions={pagePermissions}
            onAddBom={pagePermissions.create ? handleAddBom : null}
            actions={actions}
            formatDate={formatDate}
            getStatusIcon={getStatusIcon}
            getBomInitials={getBomInitials}
            getAvatarColor={getAvatarColor}
          />
        </TabPanel>

        {/* BOM Revisions Tab */}
        <TabPanel value={tabValue} index={1}>
          <BomRevisionMaster
            permissions={pagePermissions}
            onActionComplete={refreshBomList}
            showNotification={showNotification}
          />
        </TabPanel>

        {/* BOM Costing Tab */}
        <TabPanel value={tabValue} index={2}>
          <BomCosting
            permissions={pagePermissions}
            onActionComplete={refreshBomList}
            showNotification={showNotification}
          />
        </TabPanel>
      </Paper>

      {/* Modals */}
      {pagePermissions.create && (
        <AddBom open={openAddModal} onClose={() => setOpenAddModal(false)} onAdd={handleAddSuccess} />
        )}

   // Replace the modals section (around line 480)
{/* Modals - Only show if user has permissions */}
{pagePermissions.create && (
  <AddBom open={openAddModal} onClose={() => setOpenAddModal(false)} onAdd={handleAddSuccess} />
)}

{selectedBom && pagePermissions.view && (
  <ViewBom open={openViewModal} onClose={() => { setOpenViewModal(false); setSelectedBom(null); }} bom={selectedBom} />
)}

{selectedBom && pagePermissions.update && (
  <EditBom open={openEditModal} onClose={() => { setOpenEditModal(false); setSelectedBom(null); }} bom={selectedBom} onUpdate={handleEditSuccess} />
)}

{selectedBom && pagePermissions.delete && (
  <DeleteBom open={openDeleteModal} onClose={() => { setOpenDeleteModal(false); setSelectedBom(null); }} bom={selectedBom} onDelete={handleDeleteSuccess} />
)}

{selectedBom && pagePermissions.create && (
  <CopyBom open={openCopyModal} onClose={() => { setOpenCopyModal(false); setSelectedBom(null); }} bomId={selectedBom._id} bomData={selectedBom} onCopyComplete={handleCopySuccess} />
)}

{selectedBom && pagePermissions.view && (
  <>
    <ValidateBom open={openValidateModal} onClose={() => { setOpenValidateModal(false); setSelectedBom(null); }} bomId={selectedBom._id} bomData={selectedBom} onValidationComplete={() => {}} />
    <BomExplosion open={openExplosionModal} onClose={() => { setOpenExplosionModal(false); setSelectedBom(null); }} bomId={selectedBom._id} bomData={selectedBom} />
  </>
)}

{selectedBom && pagePermissions.approve && (
  <ApproveBom open={openApproveModal} onClose={() => { setOpenApproveModal(false); setSelectedBom(null); }} bomId={selectedBom._id} onSuccess={handleApproveSuccess} />
)}

{selectedBom && pagePermissions.update && (
  <SetDefaultBom open={openSetDefaultModal} onClose={() => { setOpenSetDefaultModal(false); setSelectedBom(null); }} bomId={selectedBom._id} onSuccess={handleSetDefaultSuccess} />
)}

      {/* Where Used Modal */}
      {pagePermissions.view && (
        <WhereUsedModal
        open={openWhereUsedModal}
        onClose={() => {
          setOpenWhereUsedModal(false);
          setWhereUsedData(null);
        }}
        component={whereUsedData?.component}
        usedInBoms={whereUsedData?.used_in_boms || []}
        loading={whereUsedLoading}
      />
      )}

      {/* BOM Explosion Modal */}
      {pagePermissions.view && ( 
        <ExplosionModal
        open={openExplosionModal}
        onClose={() => {
          setOpenExplosionModal(false);
          setExplosionData(null);
          setExplosionLoading(false);
        }}
        explosionData={explosionData}
        loading={explosionLoading}
      />
      )}

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default BomMaster;