import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Tooltip,
  Typography,
  Snackbar,
  TablePagination,
  Checkbox,
  Stack,
  alpha,
  Alert,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  ToggleButton,
  ToggleButtonGroup
} from "@mui/material";

import {
  Search as SearchIcon,
  Download as DownloadIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowUpward as ArrowUpwardIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon
} from "@mui/icons-material";

import axios from "axios";
import BASE_URL from "../../../config/Config";

/* COMPONENTS */
import AddLeaveTypes from "./AddLeaveTypes";
import EditLeaveTypes from "./EditLeaveTypes";
import ViewLeaveTypes from "./ViewLeaveTypes";
import DeleteLeaveTypes from "./DeleteLeaveTypes";

import AddHoliday from "./AddHoliday";
import EditHoliday from "./EditHoliday";
import ViewHoliday from "./ViewHoliday";
import DeleteHoliday from "./DeleteHoliday";

// Color constants
const HEADER_GRADIENT = "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)";
const STRIPE_COLOR_ODD = '#FFFFFF';
const STRIPE_COLOR_EVEN = '#f8fafc';
const HOVER_COLOR = '#f1f5f9';
const PRIMARY_BLUE = '#00B4D8';
const TEXT_COLOR_HEADER = '#FFFFFF';
const TEXT_COLOR_MAIN = '#0f172a';

// Action Menu Component
const ActionMenu = ({ item, onView, onEdit, onDelete, anchorEl, onClose, onOpen }) => {
  return (
    <>
      <Tooltip title="Actions">
        <IconButton
          size="small"
          onClick={onOpen}
          sx={{
            color: '#64748b',
            '&:hover': {
              bgcolor: alpha(PRIMARY_BLUE, 0.1)
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
            minWidth: 180,
            borderRadius: 2,
            border: '1px solid #e2e8f0'
          }
        }}
      >
        <MenuItem 
          onClick={() => {
            onView(item);
            onClose();
          }}
          sx={{ py: 1 }}
        >
          <ListItemIcon sx={{ color: PRIMARY_BLUE, minWidth: 36 }}>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500}>View Details</Typography>
          </ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => {
            onEdit(item);
            onClose();
          }}
          sx={{ py: 1 }}
        >
          <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500}>Edit</Typography>
          </ListItemText>
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem 
          onClick={() => {
            onDelete(item);
            onClose();
          }}
          sx={{ py: 1 }}
        >
          <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} color="#EF4444">
              Delete
            </Typography>
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

const LeaveTypeMaster = () => {
  const [mode, setMode] = useState("leave");
  const [dataList, setDataList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);

  // Menu state for action buttons
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedItemForAction, setSelectedItemForAction] = useState(null);

  // Modal state
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // Selected item
  const [selectedItem, setSelectedItem] = useState(null);

  // Notification state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  useEffect(() => {
    fetchData();
  }, [mode]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const endpoint =
        mode === "leave"
          ? `${BASE_URL}/api/leavetypes`
          : `${BASE_URL}/api/holidays`;

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setDataList(response.data.data || []);
        setFilteredList(response.data.data || []);
        setSelected([]);
      }
    } catch (err) {
      showNotification("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  /* SEARCH */
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = dataList.filter((item) =>
      mode === "leave"
        ? item.Name?.toLowerCase().includes(value)
        : (item.Title || item.Name)?.toLowerCase().includes(value)
    );

    setFilteredList(filtered);
    setPage(0);
    setSelected([]);
  };

  /* RESET FILTER */
  const handleResetFilter = () => {
    setFilteredList(dataList);
    setSearchTerm("");
    setPage(0);
    setSelected([]);
  };

  /* SELECTION HANDLERS */
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(paginated.map(item => item._id));
    } else {
      setSelected([]);
    }
  };

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

  /* BULK DELETE */
  const handleBulkDelete = () => {
    if (selected.length === 0) return;
    showNotification(`Bulk delete for ${selected.length} items requires API implementation`, 'warning');
  };

  /* PAGINATION */
  const paginated = filteredList.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  /* ACTION MENU */
  const handleActionMenuOpen = (e, item) => {
    setActionMenuAnchor(e.currentTarget);
    setSelectedItemForAction(item);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedItemForAction(null);
  };

  /* MODAL HANDLERS */
  const openEditModal = (item) => {
    setSelectedItem(item);
    setOpenEdit(true);
    handleActionMenuClose();
  };

  const openViewModal = (item) => {
    setSelectedItem(item);
    setOpenView(true);
    handleActionMenuClose();
  };

  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setOpenDelete(true);
    handleActionMenuClose();
  };

  /* CLOSE HANDLERS WITH SNACKBAR */
  const handleAddClose = (success) => {
    setOpenAdd(false);
    if (success) {
      fetchData();
      showNotification(
        `${mode === "leave" ? "Leave Type" : "Holiday"} added successfully`
      );
    }
  };

  const handleEditClose = (success) => {
    setOpenEdit(false);
    setSelectedItem(null);
    if (success) {
      fetchData();
      showNotification(
        `${mode === "leave" ? "Leave Type" : "Holiday"} updated successfully`
      );
    }
  };

  const handleDeleteClose = (success) => {
    setOpenDelete(false);
    setSelectedItem(null);
    if (success) {
      fetchData();
      showNotification(
        `${mode === "leave" ? "Leave Type" : "Holiday"} deleted successfully`,
        "success"
      );
    }
  };

  const handleViewClose = () => {
    setOpenView(false);
    setSelectedItem(null);
  };

  /* FORMAT DATE */
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Toggle only */}
      <Box sx={{ mb: 3 }}>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(e, val) => val && setMode(val)}
        >
          <ToggleButton value="leave">Leave Types</ToggleButton>
          <ToggleButton value="holiday">Holidays</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* ACTION BAR */}
      <Paper sx={{ 
        p: 2, 
        mb: 3, 
        borderRadius: 2,
        bgcolor: '#FFFFFF',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
          {/* Search only */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
            <TextField
              placeholder={`Search ${mode === "leave" ? "leave types" : "holidays"}...`}
              size="small"
              value={searchTerm}
              onChange={handleSearch}
              sx={{ 
                width: { xs: '100%', sm: 320 },
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
              disabled={loading}
            />

            {searchTerm && (
              <Button
                variant="text"
                onClick={handleResetFilter}
                sx={{ 
                  height: 40,
                  borderRadius: 1.5,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  color: '#64748B'
                }}
              >
                Clear
              </Button>
            )}
          </Stack>

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} alignItems="center">
            {selected.length > 0 && (
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
                disabled={loading}
              >
                Delete ({selected.length})
              </Button>
            )}
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              sx={{ 
                height: 40,
                borderRadius: 1.5,
                borderColor: '#cbd5e1',
                color: '#475569',
                fontSize: '0.875rem',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': {
                  borderColor: PRIMARY_BLUE,
                  bgcolor: alpha(PRIMARY_BLUE, 0.04)
                }
              }}
              disabled={loading}
            >
              Export
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenAdd(true)}
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
              disabled={loading}
            >
              Add {mode === "leave" ? "Leave Type" : "Holiday"}
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* TABLE */}
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
                    indeterminate={selected.length > 0 && selected.length < paginated.length}
                    checked={paginated.length > 0 && selected.length === paginated.length}
                    onChange={handleSelectAll}
                    sx={{
                      color: TEXT_COLOR_HEADER,
                      '&.Mui-checked': {
                        color: TEXT_COLOR_HEADER,
                      },
                      '&.MuiCheckbox-indeterminate': {
                        color: TEXT_COLOR_HEADER,
                      },
                      '& .MuiSvgIcon-root': {
                        fontSize: 20
                      }
                    }}
                    disabled={loading || paginated.length === 0}
                  />
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 700, 
                  fontSize: '0.875rem',
                  py: 2,
                  color: TEXT_COLOR_HEADER
                }}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    {mode === "leave" ? "Leave Name" : "Holiday Title"}
                    <ArrowUpwardIcon sx={{ fontSize: 14, color: TEXT_COLOR_HEADER, opacity: 0.9 }} />
                  </Stack>
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 700, 
                  fontSize: '0.875rem',
                  py: 2,
                  color: TEXT_COLOR_HEADER
                }}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    {mode === "leave" ? "Max Days" : "Date"}
                    <ArrowUpwardIcon sx={{ fontSize: 14, color: TEXT_COLOR_HEADER, opacity: 0.9 }} />
                  </Stack>
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 700, 
                  fontSize: '0.875rem',
                  py: 2,
                  width: 100,
                  color: TEXT_COLOR_HEADER
                }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                    <Typography color="textSecondary" sx={{ fontStyle: 'italic' }}>
                      Loading {mode === "leave" ? "leave types" : "holidays"}...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body1" color="#64748B" fontWeight={500}>
                        {searchTerm 
                          ? `No ${mode === "leave" ? "leave types" : "holidays"} found` 
                          : `No ${mode === "leave" ? "leave types" : "holidays"} available`}
                      </Typography>
                      <Typography variant="body2" color="#94A3B8" sx={{ mt: 1 }}>
                        {searchTerm 
                          ? 'Try adjusting your search terms' 
                          : `Click "Add ${mode === "leave" ? "Leave Type" : "Holiday"}" to create one`}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((item, index) => {
                  const isSelected = selected.includes(item._id);
                  const isOddRow = index % 2 === 0;
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && 
                    selectedItemForAction?._id === item._id;

                  return (
                    <TableRow
                      key={item._id}
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
                          onChange={() => handleSelect(item._id)}
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
                          {mode === "leave" ? item.Name : (item.Title || item.Name)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="#475569">
                          {mode === "leave"
                            ? item.MaxDaysPerYear
                            : formatDate(item.Date)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ width: 100 }}>
                        <ActionMenu 
                          item={item}
                          onView={openViewModal}
                          onEdit={openEditModal}
                          onDelete={openDeleteModal}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onClose={handleActionMenuClose}
                          onOpen={(e) => handleActionMenuOpen(e, item)}
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
          count={filteredList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) =>
            setRowsPerPage(parseInt(e.target.value, 10))
          }
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

      {/* MODALS */}
      {mode === "leave" && (
        <>
          <AddLeaveTypes open={openAdd} onClose={handleAddClose} />
          <EditLeaveTypes open={openEdit} leaveType={selectedItem} onClose={handleEditClose} />
          <ViewLeaveTypes open={openView} leaveType={selectedItem} onClose={handleViewClose} />
          <DeleteLeaveTypes open={openDelete} leaveType={selectedItem} onClose={handleDeleteClose} />
        </>
      )}

      {mode === "holiday" && (
        <>
          <AddHoliday open={openAdd} onClose={handleAddClose} />
          <EditHoliday open={openEdit} holiday={selectedItem} onClose={handleEditClose} />
          <ViewHoliday open={openView} holiday={selectedItem} onClose={handleViewClose} />
          <DeleteHoliday open={openDelete} holiday={selectedItem} onClose={handleDeleteClose} />
        </>
      )}

      {/* SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ 
            width: '100%',
            borderRadius: 1.5,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LeaveTypeMaster;