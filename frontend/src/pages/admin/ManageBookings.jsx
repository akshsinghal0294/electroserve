import { useEffect, useState } from "react";
import axios from "../../services/api";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import BuildIcon from "@mui/icons-material/Build";
import InventoryIcon from "@mui/icons-material/Inventory";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { useNavigate, Link } from "react-router-dom";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { IconButton, Tooltip } from "@mui/material";


import {
  Box,
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

// ─── Constants ───────────────────────────────────────────────────────────────

const STATUSES = ["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
const FILTERS  = ["ALL", ...STATUSES];

const STATUS_COLOR = {
  PENDING:     "warning",
  CONFIRMED:   "info",
  IN_PROGRESS: "secondary",
  COMPLETED:   "success",
  CANCELLED:   "error",
};

const TABLE_HEADERS = [
  "Booking ID",
  "Service Type",
  "Appliance Type",
  "Problem Description",
  "Appointment Date",
  "Time Slot",
  "Address",
  
  "Status",
  "Update Status",
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function ManageBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [snackbar, setSnackbar]           = useState({ open: false, message: "", severity: "success" });

  useEffect(() => { loadBookings(); }, []);

  // ── Data ──────────────────────────────────────────────────────────────────

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/services/all");
      setBookings(response.data || []);
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to load bookings.", "error");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (bookingId, status) => {
    try {
      await axios.put(`/api/services/${bookingId}/status`, null, { params: { status } });
      await loadBookings();
      showSnackbar("Booking status updated successfully.", "success");
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to update booking status.", "error");
    }
  };

  // ── Derived state (no separate filteredBookings state needed) ─────────────

  const filteredBookings =
    selectedFilter === "ALL"
      ? bookings
      : bookings.filter((b) => b.status === selectedFilter);

  const completedRevenue = bookings
    .filter((b) => b.status === "COMPLETED")
    .reduce((sum, b) => sum + (b.amount || 0), 0);

  // ── Helpers ───────────────────────────────────────────────────────────────

  const showSnackbar = (message, severity = "success") =>
    setSnackbar({ open: true, message, severity });

  const closeSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  // ── Loading state ─────────────────────────────────────────────────────────

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh" gap={2}>
        <CircularProgress />
        <Typography variant="h6" color="text.secondary">Loading Bookings…</Typography>
      </Box>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f3f4f6"     , m:2}}>

      {/* Header */}
       {/* ====== HEADER ====== */}
       <Paper
        elevation={4}
        square
        sx={{
          bgcolor: "#111827",
          color: "white",
          px: 4,
          py: 2.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Manage Booking
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5, color: "#9ca3af" }}>
            Welcome
          </Typography>
        </Box>

        <Button
          component={Link}
          to="/admin/products/add"
          variant="outlined"
          sx={{
            color: "white",
            borderColor: "white",
            "&:hover": { borderColor: "#9ca3af", bgcolor: "transparent" },
          }}
        >
          Back To Dashboard
        </Button>
      </Paper>
     
     

      {/* Summary Cards */}
      <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 3,
            mb: 4,
            mt: 4 ,
            ml: 2,
         

          }}
        >
          {[
           
            {
              label: "Total Bookings",
              value: bookings.length,
              icon: <BuildIcon />,
              color: "#8b5cf6",
            },
           
            {
              label: "Revenue from Completed",
              value:`₹${completedRevenue.toFixed(2)}`,

              icon: <CurrencyRupeeIcon />,
              color: "#f59e0b",
            },
          ].map((stat) => (
            <Paper key={stat.label} elevation={2} sx={{ p: 3, borderRadius: 3 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  bgcolor: stat.color + "22",
                  color: stat.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                {stat.icon}
              </Box>
              <Typography variant="body2" color="text.secondary">
                {stat.label}
              </Typography>
              <Typography variant="h5" fontWeight="bold" mt={0.5}>
                {stat.value}
              </Typography>
            </Paper>
          ))}
        </Box>

      {/* Table */}
      <TableContainer
        component={Paper}
        elevation={2}
        sx={{
          borderRadius: 2,
          overflowX: "auto",          // ← horizontal scroll when content overflows
        //  width: "100%",
          maxWidth: "100%",
         m: 2,
          width: "calc(100% - 16px)"
        //  margin:"5px",
        }}
      >
        <Table stickyHeader size="small" sx={{ minWidth: 1100 }}> {/* ← keeps columns from squishing */}
          <TableHead>
            <TableRow>
              {TABLE_HEADERS.map((h) => (
                <TableCell
                  key={h}
                  sx={{ fontWeight: 700, bgcolor: "grey.50", whiteSpace: "nowrap" }}
                >
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={TABLE_HEADERS.length} align="center" sx={{ py: 6, color: "text.secondary" }}>
                  No bookings found for this filter.
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.map((booking) => (
                <TableRow key={booking.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>#{booking.id}</TableCell>
                  <TableCell>{booking.serviceType}</TableCell>
                  <TableCell>{booking.applianceType}</TableCell>
                  <TableCell sx={{ maxWidth: 220 }}>
                    <Typography variant="body2" noWrap title={booking.problemDescription}>
                      {booking.problemDescription}
                    </Typography>
                  </TableCell>
                  <TableCell>{booking.appointmentDate}</TableCell>
                  <TableCell>{booking.timeSlot}</TableCell>
                  <TableCell sx={{ maxWidth: 200 }}>
                  <Tooltip title={booking.address}>
                 
                    <Typography variant="body2" noWrap title={booking.address}>
                      {booking.address}
                    </Typography>
                    </Tooltip>
                  </TableCell>
                 
                  <TableCell>
                    <Chip
                      label={booking.status.replace("_", " ")}
                      color={STATUS_COLOR[booking.status] || "default"}
                      size="small"
                      sx={{ fontWeight: 600, minWidth: 90 }}
                    />
                  </TableCell>
                  <TableCell>
                    {/* ✅ Fix: controlled value (not defaultValue) + explicit option values */}
                    <Select
                      value={booking.status}
                      onChange={(e) => updateStatus(booking.id, e.target.value)}
                      size="small"
                      sx={{ minWidth: 140 }}
                    >
                      {STATUSES.map((s) => (
                        <MenuItem key={s} value={s}>
                          {s.replace("_", " ")}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>


      {/* Snackbar feedback (replaces alert()) */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

// ─── Summary Card ─────────────────────────────────────────────────────────────

function SummaryCard({ icon, label, value }) {
  return (
    <Paper
      elevation={2}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        px: 3,
        py: 2.5,
        borderRadius: 2,
        minWidth: 220,
      }}
    >
      {icon}
      <Box>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
        <Typography variant="h5" fontWeight={700}>{value}</Typography>
      </Box>
    </Paper>
  );
}
