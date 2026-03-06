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
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowUpward as ArrowUpwardIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Sort as SortIcon,
} from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../config/Config";

// Import modal components
import AddDepartments from "./AddDepartments";
import EditDepartments from "./EditDepartments";
import ViewDepartments from "./ViewDepartments";
import DeleteDepartments from "./DeleteDepartments";

// Color constants - EXACT SAME as header gradient
const HEADER_GRADIENT =
  "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)";
const STRIPE_COLOR_ODD = "#FFFFFF";
const STRIPE_COLOR_EVEN = "#f8fafc"; // slate-50
const HOVER_COLOR = "#f1f5f9"; // slate-100
const PRIMARY_BLUE = "#00B4D8";
const TEXT_COLOR_HEADER = "#FFFFFF";
const TEXT_COLOR_MAIN = "#0f172a"; // slate-900

// Action Menu Component
const ActionMenu = ({
  department,
  onView,
  onEdit,
  onDelete,
  anchorEl,
  onClose,
  onOpen,
}) => {
  return (
    <>
      <Tooltip title="Actions">
        <IconButton
          size="small"
          onClick={onOpen}
          sx={{
            color: "#64748b", // slate-500
            "&:hover": {
              bgcolor: alpha(PRIMARY_BLUE, 0.1),
            },
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
            border: "1px solid #e2e8f0",
          },
        }}
      >
        <MenuItem
          onClick={() => {
            onView(department);
            onClose();
          }}
          sx={{ py: 1 }}
        >
          <ListItemIcon sx={{ color: PRIMARY_BLUE, minWidth: 36 }}>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500}>
              View Details
            </Typography>
          </ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            onEdit(department);
            onClose();
          }}
          sx={{ py: 1 }}
        >
          <ListItemIcon sx={{ color: "#10B981", minWidth: 36 }}>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500}>
              Edit
            </Typography>
          </ListItemText>
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={() => {
            onDelete(department);
            onClose();
          }}
          sx={{ py: 1 }}
        >
          <ListItemIcon sx={{ color: "#EF4444", minWidth: 36 }}>
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

const DepartmentMaster = () => {
  // State for data
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);

  // Menu state for action buttons
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedDepartmentForAction, setSelectedDepartmentForAction] =
    useState(null);

  // Modal state
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Selected department
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // Notification state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  // Fetch departments from API
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/departments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setDepartments(response.data.data || []);
        setFilteredDepartments(response.data.data || []);
      } else {
        showNotification("Failed to load departments", "error");
      }
    } catch (err) {
      console.error("Error fetching departments:", err);
      showNotification(
        "Failed to load departments. Please try again.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = departments.filter(
      (department) =>
        department.DepartmentName.toLowerCase().includes(value) ||
        (department.Description &&
          department.Description.toLowerCase().includes(value)),
    );

    setFilteredDepartments(filtered);
    setPage(0);
  };

  // Handle select all
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(filteredDepartments.map((department) => department._id));
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
      newSelected = selected.filter((item) => item !== id);
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

  // Handle add department
  const handleAddDepartment = (newDepartment) => {
    setDepartments([...departments, newDepartment]);
    setFilteredDepartments([...filteredDepartments, newDepartment]);
    showNotification("Department added successfully!", "success");
  };

  // Handle edit department
  const handleEditDepartment = (updatedDepartment) => {
    const updatedDepartments = departments.map((department) =>
      department._id === updatedDepartment._id ? updatedDepartment : department,
    );

    setDepartments(updatedDepartments);
    setFilteredDepartments(updatedDepartments);
    showNotification("Department updated successfully!", "success");
  };

  // Handle delete department
  const handleDeleteDepartment = (departmentId) => {
    const updatedDepartments = departments.filter(
      (department) => department._id !== departmentId,
    );
    setDepartments(updatedDepartments);
    setFilteredDepartments(updatedDepartments);
    setSelected(selected.filter((id) => id !== departmentId));
    showNotification("Department deleted successfully!", "success");
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    showNotification("Bulk delete requires API implementation", "warning");
  };

  // Action menu handlers
  const handleActionMenuOpen = (event, department) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedDepartmentForAction(department);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedDepartmentForAction(null);
  };

  // Open edit modal
  const openEditDepartmentModal = (department) => {
    setSelectedDepartment(department);
    setOpenEditModal(true);
    handleActionMenuClose();
  };

  // Open view modal
  const openViewDepartmentModal = (department) => {
    setSelectedDepartment(department);
    setOpenViewModal(true);
    handleActionMenuClose();
  };

  // Open delete confirmation
  const openDeleteDepartmentDialog = (department) => {
    setSelectedDepartment(department);
    setOpenDeleteDialog(true);
    handleActionMenuClose();
  };

  // Show notification
  const showNotification = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleSort = (key) => {
    let direction = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sortedData = [...filteredDepartments].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredDepartments(sortedData);
    setSortConfig({ key, direction });
  };

  // Paginated departments
  const paginatedDepartments = filteredDepartments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          component="h1"
          fontWeight="600"
          sx={{
            color: TEXT_COLOR_MAIN,
            background: HEADER_GRADIENT,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            display: "inline-block",
          }}
        >
          Department Master
        </Typography>
        <Typography variant="body2" color="#64748B" sx={{ mt: 0.5 }}>
          Manage and organize company departments
        </Typography>
      </Box>

      {/* Action Bar */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          bgcolor: "#FFFFFF",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
          border: "1px solid #e2e8f0",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          {/* Search and Filters */}
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ flex: 1 }}
          >
            <TextField
              placeholder="Search by name or description..."
              size="small"
              value={searchTerm}
              onChange={handleSearch}
              sx={{
                width: { xs: "100%", sm: 320 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                  "&:hover fieldset": {
                    borderColor: PRIMARY_BLUE,
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#64748B" }} />
                  </InputAdornment>
                ),
                sx: {
                  height: 40,
                  bgcolor: "#f8fafc",
                  "& input": {
                    padding: "8px 12px",
                    fontSize: "0.875rem",
                  },
                },
              }}
              disabled={loading}
            />
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
                  textTransform: "none",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
                disabled={loading}
              >
                Delete ({selected.length})
              </Button>
            )}

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenAddModal(true)}
              sx={{
                height: 40,
                borderRadius: 1.5,
                background: HEADER_GRADIENT,
                fontSize: "0.875rem",
                fontWeight: 500,
                textTransform: "none",
                "&:hover": {
                  opacity: 0.9,
                  background: HEADER_GRADIENT,
                },
              }}
              disabled={loading}
            >
              Add Department
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Departments Table */}
      <Paper
        sx={{
          width: "100%",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
          border: "1px solid #e2e8f0",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  background: HEADER_GRADIENT,
                  "& .MuiTableCell-root": {
                    borderBottom: "none",
                    color: TEXT_COLOR_HEADER,
                  },
                }}
              >
                <TableCell padding="checkbox" sx={{ width: 60 }}>
                  <Checkbox
                    indeterminate={
                      selected.length > 0 &&
                      selected.length < filteredDepartments.length
                    }
                    checked={
                      filteredDepartments.length > 0 &&
                      selected.length === filteredDepartments.length
                    }
                    onChange={handleSelectAll}
                    sx={{
                      color: TEXT_COLOR_HEADER,
                      "&.Mui-checked": {
                        color: TEXT_COLOR_HEADER,
                      },
                      "&.MuiCheckbox-indeterminate": {
                        color: TEXT_COLOR_HEADER,
                      },
                      "& .MuiSvgIcon-root": {
                        fontSize: 20,
                      },
                    }}
                    disabled={loading}
                  />
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    py: 2,
                    color: TEXT_COLOR_HEADER,
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.5}
                    onClick={() => handleSort("DepartmentName")}
                    sx={{ cursor: "pointer" }}
                  >
                    Department Name
                    <ArrowUpwardIcon sx={{ fontSize: 14 }} />
                  </Stack>
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    py: 2,
                    color: TEXT_COLOR_HEADER,
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.5}
                    onClick={() => handleSort("Description")}
                    sx={{ cursor: "pointer" }}
                  >
                    Description
                    <ArrowUpwardIcon sx={{ fontSize: 14 }} />
                  </Stack>
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    py: 2,
                    color: TEXT_COLOR_HEADER,
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.5}
                    onClick={() => handleSort("CreatedAt")}
                    sx={{ cursor: "pointer" }}
                  >
                    Created At
                    <ArrowUpwardIcon sx={{ fontSize: 14 }} />
                  </Stack>
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    py: 2,
                    color: TEXT_COLOR_HEADER,
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.5}
                    onClick={() => handleSort("UpdatedAt")}
                    sx={{ cursor: "pointer" }}
                  >
                    Last Update
                    <ArrowUpwardIcon sx={{ fontSize: 14 }} />
                  </Stack>
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    py: 2,
                    width: 100,
                    color: TEXT_COLOR_HEADER,
                  }}
                  align="center"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <Typography
                      color="textSecondary"
                      sx={{ fontStyle: "italic" }}
                    >
                      Loading departments...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedDepartments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        variant="body1"
                        color="#64748B"
                        fontWeight={500}
                      >
                        {searchTerm
                          ? "No departments found"
                          : "No departments available"}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="#94A3B8"
                        sx={{ mt: 1 }}
                      >
                        {searchTerm
                          ? "Try adjusting your search terms"
                          : "Add your first department to get started"}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedDepartments.map((department, index) => {
                  const isSelected = selected.includes(department._id);
                  const isOddRow = index % 2 === 0;
                  const isActionMenuOpen =
                    Boolean(actionMenuAnchor) &&
                    selectedDepartmentForAction?._id === department._id;

                  return (
                    <TableRow
                      key={department._id}
                      hover
                      selected={isSelected}
                      sx={{
                        bgcolor: isOddRow
                          ? STRIPE_COLOR_ODD
                          : STRIPE_COLOR_EVEN,
                        "&:hover": {
                          bgcolor: HOVER_COLOR,
                        },
                        "&.Mui-selected": {
                          bgcolor: alpha(PRIMARY_BLUE, 0.08),
                          "&:hover": {
                            bgcolor: alpha(PRIMARY_BLUE, 0.12),
                          },
                        },
                      }}
                    >
                      <TableCell padding="checkbox" sx={{ width: 60 }}>
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleSelect(department._id)}
                          sx={{
                            color: PRIMARY_BLUE,
                            "&.Mui-checked": {
                              color: PRIMARY_BLUE,
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color={TEXT_COLOR_MAIN}
                        >
                          {department.DepartmentName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          color="#475569"
                          sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            maxWidth: 300,
                          }}
                        >
                          {department.Description || "No description"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="#475569">
                          {formatDate(department.CreatedAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="#475569">
                          {formatDate(department.UpdatedAt)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ width: 100 }}>
                        <ActionMenu
                          department={department}
                          onView={openViewDepartmentModal}
                          onEdit={openEditDepartmentModal}
                          onDelete={openDeleteDepartmentDialog}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onClose={handleActionMenuClose}
                          onOpen={(e) => handleActionMenuOpen(e, department)}
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
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredDepartments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: "1px solid #e2e8f0",
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
              {
                fontSize: "0.875rem",
                color: "#64748B",
              },
            "& .MuiTablePagination-actions button": {
              color: PRIMARY_BLUE,
            },
          }}
        />
      </Paper>

      {/* Separate Modal Components */}
      <AddDepartments
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onAdd={handleAddDepartment}
      />

      {selectedDepartment && (
        <>
          <EditDepartments
            open={openEditModal}
            onClose={() => {
              setOpenEditModal(false);
              setSelectedDepartment(null);
            }}
            department={selectedDepartment}
            onUpdate={handleEditDepartment}
          />

          <ViewDepartments
            open={openViewModal}
            onClose={() => {
              setOpenViewModal(false);
              setSelectedDepartment(null);
            }}
            department={selectedDepartment}
            onEdit={() => {
              setOpenViewModal(false);
              setOpenEditModal(true);
            }}
          />

          <DeleteDepartments
            open={openDeleteDialog}
            onClose={() => {
              setOpenDeleteDialog(false);
              setSelectedDepartment(null);
            }}
            department={selectedDepartment}
            onDelete={handleDeleteDepartment}
          />
        </>
      )}

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: 1.5,
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DepartmentMaster;
