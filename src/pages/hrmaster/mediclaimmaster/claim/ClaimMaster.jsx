import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  TablePagination,
  TextField,
  InputAdornment,
  Stack,
  Chip,
  IconButton,
  CircularProgress,
  Menu,
  MenuItem,
  Button,
  Checkbox,
  Snackbar,   // ✅ ADD THIS
  Alert 
} from "@mui/material";

import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

import axios from "axios";
import BASE_URL from "../../../../config/Config";
import AddClaim from "./AddClaim";
import ViewClaim from "./ViewClaim";
import EditClaim from "./EditClaim";

const HEADER_GRADIENT = "linear-gradient(90deg, #0f4c5c 0%, #00B4D8 100%)";

const ClaimMaster = () => {
  const [claims, setClaims] = useState([]);
  const [filteredClaims, setFilteredClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [selectedRows, setSelectedRows] = useState([]);

  const [selectedClaim, setSelectedClaim] = useState(null);
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(`${BASE_URL}/api/mediclaim/claims`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setClaims(res.data.data);
        setFilteredClaims(res.data.data);
      }
    } catch (err) {
      console.error("Fetch failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);

    const filtered = claims.filter(
      (claim) =>
        claim.claimId?.toLowerCase().includes(value) ||
        claim.patientDetails?.name?.toLowerCase().includes(value) ||
        claim.hospitalName?.toLowerCase().includes(value),
    );

    setFilteredClaims(filtered);
    setPage(0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      case "under_review":
        return "warning";
      default:
        return "default";
    }
  };

  const showNotification = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  /* ---------- CHECKBOX ---------- */

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = paginatedClaims.map((c) => c._id);
      setSelectedRows(newSelected);
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((i) => i !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedRows.length) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${BASE_URL}/api/mediclaim/claims/bulk-delete`, {
        data: { ids: selectedRows },
        headers: { Authorization: `Bearer ${token}` },
      });

      setSelectedRows([]);
      fetchClaims();

      showNotification("Claims deleted successfully", "success");
    } catch (error) {
      showNotification("Failed to delete claims", "error");
    }
  };
  const paginatedClaims = filteredClaims.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

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
              Claim Master
            </Typography>

      {/* SEARCH + ACTION BAR */}
      <Paper
        elevation={2}
        sx={{
          p: 1,
          mb: 2,
          borderRadius: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        {/* LEFT SIDE SEARCH */}
        <TextField
          placeholder="Search Claim ID..."
          value={search}
          onChange={handleSearch}
          size="medium"
          sx={{
            flex: 1,
            maxWidth: 300,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {/* RIGHT SIDE BUTTONS */}
        <Stack direction="row" spacing={2}>
          {selectedRows.length > 0 && (
            <Button
              variant="contained"
              startIcon={<DeleteIcon />}
              onClick={handleBulkDelete}
              sx={{
                backgroundColor: "#d32f2f",
                px: 3,
                py: 1.2,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                "&:hover": {
                  backgroundColor: "#b71c1c",
                },
              }}
            >
              DELETE ({selectedRows.length})
            </Button>
          )}

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenAdd(true)}
            sx={{
              background: "linear-gradient(135deg, #0f4c5c, #00B4D8)",
              px: 3,
              py: 1.2,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              "&:hover": {
                opacity: 0.9,
              },
            }}
          >
            Add Claim
          </Button>
        </Stack>
      </Paper>

      {/* TABLE */}
      <Paper sx={{ borderRadius: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: HEADER_GRADIENT }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={
                      paginatedClaims.length > 0 &&
                      selectedRows.length === paginatedClaims.length
                    }
                    onChange={handleSelectAll}
                    sx={{ color: "#fff" }}
                  />
                </TableCell>
                <TableCell sx={{ color: "#fff" }}>Claim ID</TableCell>
                <TableCell sx={{ color: "#fff" }}>Patient</TableCell>
                <TableCell sx={{ color: "#fff" }}>Hospital</TableCell>
                <TableCell sx={{ color: "#fff" }}>Claimed</TableCell>
                <TableCell sx={{ color: "#fff" }}>Approved</TableCell>
                <TableCell sx={{ color: "#fff" }}>Status</TableCell>
                <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                paginatedClaims.map((claim) => (
                  <TableRow key={claim._id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedRows.includes(claim._id)}
                        onChange={() => handleSelectRow(claim._id)}
                      />
                    </TableCell>
                    <TableCell>{claim.claimId}</TableCell>
                    <TableCell>{claim.patientDetails?.name}</TableCell>
                    <TableCell>{claim.hospitalName}</TableCell>
                    <TableCell>₹{claim.claimedAmount}</TableCell>
                    <TableCell>₹{claim.approvedAmount || 0}</TableCell>
                    <TableCell>
                      <Chip
                        label={claim.status}
                        color={getStatusColor(claim.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(e) => {
                          setSelectedClaim(claim);
                          setAnchorEl(e.currentTarget);
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredClaims.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* ACTION MENU */}
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem
          onClick={() => {
            setOpenView(true);
            setAnchorEl(null);
          }}
        >
          <ViewIcon fontSize="small" sx={{ mr: 1 }} />
          View
        </MenuItem>
        <MenuItem
          onClick={() => {
            setOpenEdit(true);
            setAnchorEl(null);
          }}
        >
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Update Status
        </MenuItem>
      </Menu>

      {/* MODALS */}
      <AddClaim
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSuccess={() => {
          fetchClaims();
          showNotification("Claim added successfully", "success");
        }}
      />
      {selectedClaim && (
        <>
          <ViewClaim
            open={openView}
            onClose={() => setOpenView(false)}
            claimId={selectedClaim._id}
          />
          <EditClaim
            open={openEdit}
            onClose={() => setOpenEdit(false)}
            claimData={selectedClaim}
            onSuccess={() => {
              fetchClaims();
              showNotification("Claim updated successfully", "success");
            }}
          />
        </>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ClaimMaster;
