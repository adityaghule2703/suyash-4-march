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
  Typography,
  TextField,
  InputAdornment,
  CircularProgress,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert,
  Stack,
  Avatar,
  Button,
  Checkbox,
} from "@mui/material";

import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
} from "@mui/icons-material";

import axios from "axios";
import BASE_URL from "../../../../config/Config";

import ViewEnrollment from "./ViewEnrollment";
import EditEnrollment from "./EditEnrollment";
import DeleteEnrollment from "./DeleteEnrollment";
import AddEnrollment from "./AddEnrollment";

const HEADER_GRADIENT =
  "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)";

const EnrollmentMaster = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);

  const [modalType, setModalType] = useState(null); // view | edit | delete
  const [openAdd, setOpenAdd] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${BASE_URL}/api/mediclaim/enrollments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setEnrollments(res.data.data);
      }
    } catch (err) {
      showNotification("Failed to load enrollments", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const filteredEnrollments = enrollments.filter((e) =>
    e.enrollmentId?.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= CHECKBOX ================= */

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(filteredEnrollments.map((e) => e._id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${BASE_URL}/api/mediclaim/enrollments/bulk-delete`,
        {
          data: { ids: selected },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      showNotification("Selected enrollments cancelled successfully", "success");
      setSelected([]);
      fetchEnrollments();
    } catch (err) {
      showNotification("Bulk delete failed", "error");
    }
  };

  /* ================= MENU ================= */

  const handleMenuOpen = (event, enrollment) => {
    setAnchorEl(event.currentTarget);
    setSelectedEnrollment(enrollment);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return { bg: "#dcfce7", color: "#166534" };
      case "cancelled":
        return { bg: "#fee2e2", color: "#991b1b" };
      default:
        return { bg: "#e2e8f0", color: "#334155" };
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h5"
        fontWeight={600}
        sx={{
          background: HEADER_GRADIENT,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 3,
        }}
      >
        Enrollment Master
      </Typography>

      {/* SEARCH + ACTION */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Stack direction="row" justifyContent="space-between">
          <TextField
            size="small"
            placeholder="Search Enrollment ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <Stack direction="row" spacing={2}>
            {selected.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleBulkDelete}
              >
                Delete ({selected.length})
              </Button>
            )}

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenAdd(true)}
              sx={{
                background: HEADER_GRADIENT,
                "&:hover": { opacity: 0.9 },
              }}
            >
              Add Enrollment
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* TABLE */}
      <Paper sx={{ borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  background: HEADER_GRADIENT,
                  "& .MuiTableCell-root": {
                    color: "#fff",
                    fontWeight: 600,
                  },
                }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    sx={{ color: "#fff", "&.Mui-checked": { color: "#fff" } }}
                    checked={
                      filteredEnrollments.length > 0 &&
                      selected.length === filteredEnrollments.length
                    }
                    indeterminate={
                      selected.length > 0 &&
                      selected.length < filteredEnrollments.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>

                <TableCell>Enrollment ID</TableCell>
                <TableCell>Employee</TableCell>
                <TableCell>Policy</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                filteredEnrollments.map((e) => {
                  const statusColor = getStatusColor(e.status);

                  return (
                    <TableRow key={e._id} hover>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selected.includes(e._id)}
                          onChange={() => handleSelectOne(e._id)}
                        />
                      </TableCell>

                      <TableCell>{e.enrollmentId}</TableCell>
                      <TableCell>{e.employeeId}</TableCell>
                      <TableCell>{e.policyId?.policyName}</TableCell>
                      <TableCell>
                        <Chip
                          label={e.status}
                          size="small"
                          sx={{
                            backgroundColor: statusColor.bg,
                            color: statusColor.color,
                          }}
                        />
                      </TableCell>

                      <TableCell align="center">
                        <IconButton onClick={(ev) => handleMenuOpen(ev, e)}>
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* ACTION MENU */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            setModalType("view");
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => {
            setModalType("edit");
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => {
            setModalType("delete");
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Cancel</ListItemText>
        </MenuItem>
      </Menu>

      {/* MODALS */}
      <AddEnrollment
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSuccess={() => {
          fetchEnrollments();
          showNotification("Enrollment added successfully", "success");
        }}
      />

      {selectedEnrollment && modalType === "view" && (
        <ViewEnrollment
          open
          onClose={() => setModalType(null)}
          enrollmentId={selectedEnrollment._id}
        />
      )}

      {selectedEnrollment && modalType === "edit" && (
        <EditEnrollment
          open
          onClose={() => setModalType(null)}
          enrollmentId={selectedEnrollment._id}
          onSuccess={() => {
            fetchEnrollments();
            showNotification("Enrollment updated successfully", "success");
          }}
        />
      )}

      {selectedEnrollment && modalType === "delete" && (
        <DeleteEnrollment
          open
          onClose={() => setModalType(null)}
          enrollment={selectedEnrollment}
          onSuccess={() => {
            fetchEnrollments();
            showNotification("Enrollment cancelled successfully", "success");
          }}
        />
      )}

      {/* SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        onClose={() =>
          setSnackbar({ ...snackbar, open: false })
        }
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EnrollmentMaster;