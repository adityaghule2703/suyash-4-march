import React, { useEffect, useState, useMemo } from "react";
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
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Snackbar,
  Alert,
  TextField,
  TablePagination,
  Grid,
  Checkbox,
  Stack,
} from "@mui/material";
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  CheckCircle as ApproveIcon,
} from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../config/Config";

import AddRegularization from "./AddRegularization";
import ViewRegularization from "./ViewRegularization";
import ApproveRegularization from "./ApproveRegularization";
import DeleteRegularization from "./DeleteRegularization";

const HEADER_GRADIENT =
  "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)";

const RegularizationMaster = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [selected, setSelected] = useState([]);

  const [openAdd, setOpenAdd] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openApprove, setOpenApprove] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${BASE_URL}/api/regularization`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setRecords(response.data.data || []);
      }
    } catch {
      showNotification("Failed to load requests", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  /* ================= FILTER ================= */
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      const employeeName = rec.EmployeeID
        ? `${rec.EmployeeID.FirstName} ${rec.EmployeeID.LastName}`
        : "";

      const matchesSearch =
        rec.RequestType?.toLowerCase().includes(search.toLowerCase()) ||
        employeeName.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter ? rec.Status === statusFilter : true;

      return matchesSearch && matchesStatus;
    });
  }, [records, search, statusFilter]);

  /* ================= CHECKBOX ================= */
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(filteredRecords.map((r) => r._id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const isSelected = (id) => selected.includes(id);

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
        Regularization Requests
      </Typography>

      {/* FILTER BAR */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" spacing={2}>
            <TextField
              size="small"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ width: 300 }}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1 }} />,
              }}
            />

            <TextField
              select
              size="small"
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ width: 150 }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </TextField>
          </Stack>

          <Stack direction="row" spacing={2}>
            {selected.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => {
                  if (selected.length === 1) {
                    const record = records.find((r) => r._id === selected[0]);
                    setSelectedRecord(record);
                    setOpenDelete(true);
                  }
                }}
              >
                Delete ({selected.length})
              </Button>
            )}

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenAdd(true)}
              sx={{
                background: "linear-gradient(135deg, #164e63, #00B4D8)",
                px: 4,
              }}
            >
              Add Request
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* TABLE */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: HEADER_GRADIENT }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    sx={{ color: "#fff" }}
                    checked={
                      filteredRecords.length > 0 &&
                      selected.length === filteredRecords.length
                    }
                    indeterminate={
                      selected.length > 0 &&
                      selected.length < filteredRecords.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell sx={{ color: "#fff" }}>Employee</TableCell>
                <TableCell sx={{ color: "#fff" }}>Date</TableCell>
                <TableCell sx={{ color: "#fff" }}>Request Type</TableCell>
                <TableCell sx={{ color: "#fff" }}>Status</TableCell>
                <TableCell sx={{ color: "#fff" }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No requests found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecords
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((record) => (
                    <TableRow key={record._id} hover>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected(record._id)}
                          onChange={() => handleSelectOne(record._id)}
                        />
                      </TableCell>

                      <TableCell>
                        {record.EmployeeID?.FirstName
                          ? `${record.EmployeeID.FirstName} ${record.EmployeeID.LastName}`
                          : "—"}
                      </TableCell>

                      <TableCell>
                        {new Date(record.Date).toLocaleDateString()}
                      </TableCell>

                      <TableCell>{record.RequestType}</TableCell>

                      <TableCell>
                        <Chip
                          label={record.Status}
                          color={
                            record.Status === "Approved"
                              ? "success"
                              : record.Status === "Rejected"
                                ? "error"
                                : "warning"
                          }
                          size="small"
                        />
                      </TableCell>

                      <TableCell align="center">
                        <IconButton
                          onClick={(e) => {
                            setAnchorEl(e.currentTarget);
                            setSelectedRecord(record);
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
          count={filteredRecords.length}
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
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem
          onClick={() => {
            setOpenView(true);
            setAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View</ListItemText>
        </MenuItem>

        {selectedRecord?.Status === "Pending" && (
          <MenuItem
            onClick={() => {
              setOpenApprove(true);
              setAnchorEl(null);
            }}
          >
            <ListItemIcon>
              <ApproveIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Approve / Reject</ListItemText>
          </MenuItem>
        )}

        <MenuItem
          onClick={() => {
            setOpenDelete(true);
            setAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* MODALS */}
      <AddRegularization
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onAdd={(newRecord) => {
          fetchRecords(); // auto refresh data
          showNotification("Request Submitted", "success");
        }}
      />

      {selectedRecord && (
        <>
          <ViewRegularization
            open={openView}
            onClose={() => setOpenView(false)}
            record={selectedRecord}
          />

          <ApproveRegularization
            open={openApprove}
            onClose={() => setOpenApprove(false)}
            record={selectedRecord}
            onUpdate={(updatedRecord) => {
              setRecords((prev) =>
                prev.map((r) =>
                  r._id === updatedRecord._id ? updatedRecord : r,
                ),
              );
              showNotification(
                updatedRecord.Status === "Approved"
                  ? "Request Approved"
                  : "Request Rejected",
                "success",
              );
            }}
          />

          <DeleteRegularization
            open={openDelete}
            onClose={() => setOpenDelete(false)}
            record={selectedRecord}
            onDelete={(id) => {
              setRecords((prev) => prev.filter((r) => r._id !== id));
              setSelected([]);
              showNotification("Request Deleted", "success");
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
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RegularizationMaster;
