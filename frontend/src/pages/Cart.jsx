import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Stack,
} from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";

export default function Cart() {
  const { user } = useAuth();
  const { cartItems, cartTotal, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const handleUpdateQuantity = (cartId, quantity) => {
    if (quantity < 1) return;
    updateQuantity(cartId, quantity, user.id);
  };

  const handleRemove = (cartId) => {
    removeFromCart(cartId, user.id);
  };

  if (cartItems.length === 0) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          px: 2,
          textAlign: "center",
        }}
      >
        <ShoppingCartOutlinedIcon sx={{ fontSize: 64, color: "text.disabled" }} />
        <Typography variant="h5" fontWeight={600}>
          Your cart is empty
        </Typography>
        <Typography color="text.secondary">
          Browse our products and add something you like.
        </Typography>
        <Button component={Link} to="/products" variant="contained">
          Shop Products
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", px: { xs: 2, sm: 3 }, py: 4 }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Your Cart
      </Typography>

      <Box>
        {cartItems.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onRemove={handleRemove}
            onUpdateQuantity={handleUpdateQuantity}
          />
        ))}
      </Box>

      <Paper
        variant="outlined"
        sx={{ p: 3, mt: 2, borderRadius: 2 }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">Total</Typography>
          <Typography variant="h5" fontWeight={700} color="primary">
            ₹{cartTotal.toFixed(2)}
          </Typography>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        <Button
          fullWidth
          size="large"
          variant="contained"
          onClick={() => navigate("/checkout")}
        >
          Proceed to Checkout
        </Button>
      </Paper>
    </Box>
  );
}
