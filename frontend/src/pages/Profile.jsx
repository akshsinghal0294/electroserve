import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  Divider,
  CircularProgress,
  Avatar,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import BuildIcon from "@mui/icons-material/Build";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
 console.log("user", user)
  useEffect(() => {
    if (user?.id) loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersRes, bookingsRes] = await Promise.all([
        axios.get(`/api/orders/user/${user.id}`),
        axios.get(`/api/services/user/${user.id}`),
      ]);
      setOrders(ordersRes.data || []);
      setBookings(bookingsRes.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ MUI uses "color" prop in Chip, but for custom colors we use sx
  // So we return an sx-compatible color string
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING": return "#facc15";
      case "CONFIRMED": return "#3b82f6";
      case "DELIVERED": return "#16a34a";
      case "CANCELLED": return "#dc2626";
      case "SHIPPED": return "#9333ea";
      case "IN_PROGRESS": return "#2563eb";
      case "COMPLETED": return "#16a34a";
      default: return "#6b7280";
    }
  };

  const totalSpent = orders.reduce(
    (sum, order) => sum + (order.totalAmount || 0), 0
  );

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ✅ CircularProgress = MUI loading spinner
  // replaces: <h2>Loading...</h2>
  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <CircularProgress size={50} />
        <Typography mt={2} color="text.secondary">
          Loading your profile...
        </Typography>
      </Box>
    );
  }

  return (
    // ✅ Box = MUI's <div> — supports sx prop for styling
    <Box sx={{ maxWidth: "1100px", margin: "0 auto", padding: "30px 20px" }}>

      <Typography variant="h4" fontWeight="bold" mb={3}>
        My Profile
      </Typography>

      {/* ============================
          PROFILE CARD
          ✅ Paper = MUI card with shadow (elevation prop controls shadow depth)
          ============================ */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>

          {/* ✅ Avatar = circular icon/image component */}
          <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
            <PersonIcon fontSize="large" />
          </Avatar>

          <Box>
            <Typography variant="h5" fontWeight="bold">
              {user?.name}
            </Typography>

            {/* ✅ Chip = small badge/tag component
                - label = text inside
                - sx = custom styles */}
            <Chip
              label={user?.role}
              size="small"
              sx={{
                mt: 0.5,
                backgroundColor: user?.role === "ADMIN" ? "#dc2626" : "#2563eb",
                color: "white",
                fontWeight: "bold",
              }}
            />
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* ✅ Stack of contact info rows with icons */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <EmailIcon fontSize="small" color="action" />
            <Typography variant="body1">
              <strong>Email:</strong> {user?.email}
            </Typography>
          </Box>
          

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PhoneIcon fontSize="small" color="action" />
            <Typography variant="body1">
              <strong>Phone:</strong> {user?.phone || "N/A"}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* ============================
          STATS CARDS
          ✅ display: "grid" with gridTemplateColumns for responsive layout
          - xs: 1 column on mobile
          - sm: 3 columns on tablet+
          ============================ */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          gap: 2,
          mb: 3,
        }}
      >
        {/* Stat Card 1 */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3, textAlign: "center" }}>
          <ShoppingBagIcon color="primary" fontSize="large" />
          <Typography variant="h6" color="text.secondary" mt={1}>
            Total Orders
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {orders.length}
          </Typography>
        </Paper>

        {/* Stat Card 2 */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3, textAlign: "center" }}>
          <BuildIcon color="primary" fontSize="large" />
          <Typography variant="h6" color="text.secondary" mt={1}>
            Total Bookings
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {bookings.length}
          </Typography>
        </Paper>

        {/* Stat Card 3 */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3, textAlign: "center" }}>
          <AttachMoneyIcon color="primary" fontSize="large" />
          <Typography variant="h6" color="text.secondary" mt={1}>
            Total Spent
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            ₹{totalSpent}
          </Typography>
        </Paper>
      </Box>

      {/* ============================
          RECENT ORDERS
          ============================ */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 3 }}>

        {/* Header row with title + button */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            Recent Orders
          </Typography>
          {/* ✅ Button variant="outlined" = border button (no fill) */}

        </Box>

        <Divider sx={{ mb: 2 }} />

        {recentOrders.length === 0 ? (
          <Typography color="text.secondary">No orders found.</Typography>
        ) : (
          recentOrders.map((order, index) => (
            <Box key={order.id}>
              <Box sx={{ py: 1.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography fontWeight="bold">
                    Order #{order.id}
                  </Typography>
                  {/* ✅ Chip with custom backgroundColor from getStatusColor() */}
                  <Chip
                    label={order.status}
                    size="small"
                    sx={{
                      backgroundColor: getStatusColor(order.status),
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "11px",
                    }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                  Amount: ₹{order.totalAmount}
                </Typography>
              </Box>
              {/* Don't show divider after last item */}
              {index < recentOrders.length - 1 && <Divider />}
            </Box>
          ))
        )}
      </Paper>

      {/* ============================
          RECENT BOOKINGS
          ============================ */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 3 }}>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            Recent Service Bookings
          </Typography>

        </Box>

        <Divider sx={{ mb: 2 }} />

        {recentBookings.length === 0 ? (
          <Typography color="text.secondary">No service bookings found.</Typography>
        ) : (
          recentBookings.map((booking, index) => (
            <Box key={booking.id}>
              <Box sx={{ py: 1.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography fontWeight="bold">
                    {booking.serviceType}
                  </Typography>
                  <Chip
                    label={booking.status}
                    size="small"
                    sx={{
                      backgroundColor: getStatusColor(booking.status),
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "11px",
                    }}
                  />
                </Box>
             
              </Box>
              {index < recentBookings.length - 1 && <Divider />}
            </Box>
          ))
        )}
      </Paper>

      {/* ============================
          LOGOUT BUTTON
          ✅ variant="contained" = filled button
          ✅ color="error" = red (MUI theme color)
          ✅ startIcon = icon before text
          ============================ */}
      <Button
        variant="contained"
        color="error"
        size="large"
        startIcon={<LogoutIcon />}
        onClick={handleLogout}
        sx={{ borderRadius: 2, px: 4 }}
      >
        Logout
      </Button>

    </Box>
  );
}