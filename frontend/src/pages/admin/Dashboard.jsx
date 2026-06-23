import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import BuildIcon from "@mui/icons-material/Build";
import InventoryIcon from "@mui/icons-material/Inventory";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
  
      const ordersRes =
        await axios.get("/api/orders/all");
  
      const bookingsRes =
        await axios.get("/api/services/all");
  
      const productsRes =
        await axios.get("/api/products");
  
      setOrders(ordersRes.data);
      setBookings(bookingsRes.data);
      setProducts(productsRes.data);
  
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":   return "#facc15";
      case "CONFIRMED":   return "#3b82f6";
      case "SHIPPED":     return "#9333ea";
      case "DELIVERED":   return "#16a34a";
      case "CANCELLED":   return "#dc2626";
      case "IN_PROGRESS": return "#2563eb";
      case "COMPLETED":   return "#16a34a";
      default:            return "#6b7280";
    }
  };

  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.totalAmount || 0), 0
  );

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // ✅ Loading state with MUI spinner
  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <CircularProgress size={50} />
        <Typography mt={2} color="text.secondary">
          Loading Dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f3f4f6" }}>

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
            Admin Dashboard
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5, color: "#9ca3af" }}>
            Welcome, {user?.name}
          </Typography>
        </Box>

        <Button
          component={Link}
          to="/"
          variant="outlined"
          sx={{
            color: "white",
            borderColor: "white",
            "&:hover": { borderColor: "#9ca3af", bgcolor: "transparent" },
          }}
        >
          Back To Home
        </Button>
      </Paper>

      <Box sx={{ p: 4 }}>

        {/* ====== STATS CARDS ====== */}
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
          }}
        >
          {[
            {
              label: "Total Orders",
              value: orders.length,
              icon: <ShoppingBagIcon />,
              color: "#3b82f6",
            },
            {
              label: "Total Bookings",
              value: bookings.length,
              icon: <BuildIcon />,
              color: "#8b5cf6",
            },
            {
              label: "Total Products",
              value: products.length,
              icon: <InventoryIcon />,
              color: "#10b981",
            },
            {
              label: "Total Revenue",
              value: `₹${totalRevenue.toFixed(2)}`,
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
                  mb: 1.5,
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

        {/* ====== QUICK ACTION BUTTONS ====== */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 4 }}>
          <Button
            variant="contained"
            startIcon={<InventoryIcon />}
            onClick={() => navigate("/admin/products")}
            sx={{ borderRadius: 2 }}
          >
            Manage Products
          </Button>

          {/* <Button
            variant="contained"
            color="secondary"
            startIcon={<ShoppingBagIcon />}
            onClick={() => navigate("/admin/orders")}
            sx={{ borderRadius: 2 }}
          >
            Manage Orders
          </Button> */}

          <Button
            variant="contained"
            color="success"
            startIcon={<BuildIcon />}
            onClick={() => navigate("/admin/bookings")}
            sx={{ borderRadius: 2 }}
          >
            Manage Bookings
          </Button>
        </Box>

        {/* ====== RECENT ORDERS TABLE ====== */}
        {/* <Paper elevation={2} sx={{ borderRadius: 3, mb: 4 }}>
          <Box sx={{ p: 3, pb: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              Recent Orders
            </Typography>
          </Box>

          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: "#f9fafb" }}>
                <TableRow>
                  {["Order ID", "Amount", "Status", "Date"].map((col) => (
                    <TableCell
                      key={col}
                      sx={{ fontWeight: "bold", color: "#374151" }}
                    >
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {recentOrders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      align="center"
                      sx={{ py: 4, color: "text.secondary" }}
                    >
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  recentOrders.map((order) => (
                    <TableRow
                      key={order.id}
                      sx={{ "&:hover": { bgcolor: "#f3f4f6" } }}
                    >
                      <TableCell>
                        <Typography fontWeight="bold">#{order.id}</Typography>
                      </TableCell>

                      <TableCell>₹{order.totalAmount}</TableCell>

                      <TableCell>
                        <Chip
                          label={order.status}
                          size="small"
                          sx={{
                            bgcolor: getStatusColor(order.status),
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "11px",
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper> */}

        {/* ====== RECENT BOOKINGS TABLE ====== */}
        <Paper elevation={2} sx={{ borderRadius: 3 }}>
          <Box sx={{ p: 3, pb: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              Recent Bookings
            </Typography>
          </Box>

          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: "#f9fafb" }}>
                <TableRow>
                  {["Booking ID", "Service", "Date", "Status"].map((col) => (
                    <TableCell
                      key={col}
                      sx={{ fontWeight: "bold", color: "#374151" }}
                    >
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {recentBookings.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      align="center"
                      sx={{ py: 4, color: "text.secondary" }}
                    >
                      No bookings found
                    </TableCell>
                  </TableRow>
                ) : (
                  recentBookings.map((booking) => (
                    <TableRow
                      key={booking.id}
                      sx={{ "&:hover": { bgcolor: "#f3f4f6" } }}
                    >
                      <TableCell>
                        <Typography fontWeight="bold">#{booking.id}</Typography>
                      </TableCell>

                      <TableCell>{booking.serviceType}</TableCell>

                      <TableCell>{booking.appointmentDate}</TableCell>

                      <TableCell>
                        <Chip
                          label={booking.status}
                          size="small"
                          sx={{
                            bgcolor: getStatusColor(booking.status),
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "11px",
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

      </Box>
    </Box>
  );
}