import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Paper,
  Stack,
  IconButton,
  Box,
  Alert
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// SAME COLORS AS COMPANY UI
const COLORS = {
  primary: "#063C3F",
  primaryDark: "#05292B",
  text: {
    primary: "#151C26",
    secondary: "#4B5568",
    tertiary: "#94A3B8"
  },
  background: {
    white: "#FFFFFF",
    light: "#F8FFFC"
  },
  border: "#E3E8EF"
};

const ViewDepartments = ({ open, onClose, department }) => {
  if (!department) return null;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });

  const Field = ({ label, value }) => (
    <Box>
      <Typography
        sx={{
          fontSize: "0.7rem",
          fontWeight: 600,
          color: COLORS.text.secondary
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          fontSize: "0.8rem",
          color: COLORS.text.primary
        }}
      >
        {value || "-"}
      </Typography>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 5,
          border: `1px solid ${COLORS.border}`
        }
      }}
    >
      {/* HEADER */}
      <DialogTitle
        sx={{
          px: 2.5,
          py: 1.5,
          mb: 2,
          borderBottom: `1px solid ${COLORS.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: COLORS.background.white
        }}
      >
        <Typography
          sx={{
            fontSize: "1.1rem",
            fontWeight: 700,
            color: COLORS.text.primary
          }}
        >
          Department Details
        </Typography>

        <IconButton onClick={onClose} sx={{ p: 0.5 }}>
          <CloseIcon sx={{ fontSize: "1.2rem" }} />
        </IconButton>
      </DialogTitle>

      {/* CONTENT */}
      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Paper
            sx={{
              p: 2,
              borderRadius: 1.5,
              border: `1px solid ${COLORS.border}`,
              boxShadow: "none"
            }}
          >
            <Typography
              sx={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: COLORS.primary,
                mb: 1.5
              }}
            >
              Basic Information
            </Typography>

            <Stack spacing={1.5}>
              <Field
                label="DEPARTMENT NAME"
                value={department.DepartmentName}
              />

              <Field
                label="DESCRIPTION"
                value={department.Description || "No description"}
              />

              <Field
                label="CREATED AT"
                value={formatDate(department.CreatedAt)}
              />

              <Field
                label="LAST UPDATED"
                value={formatDate(department.UpdatedAt)}
              />
            </Stack>
          </Paper>
        </Stack>
      </DialogContent>

      {/* FOOTER */}
      <DialogActions
        sx={{
          px: 2.5,
          py: 1.5,
          borderTop: `1px solid ${COLORS.border}`,
          justifyContent: "flex-end",
          bgcolor: COLORS.background.white
        }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            bgcolor: COLORS.primary,
            textTransform: "none",
            fontSize: "0.75rem",
            borderRadius: 1.5,
            px: 2,
            "&:hover": {
              bgcolor: COLORS.primaryDark
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewDepartments;