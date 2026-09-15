import {
  Box,
  IconButton,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";

export default function CartItem({ item, onRemove, onUpdateQuantity }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: 2,
        alignItems: { xs: "stretch", sm: "center" },
        p: 2,
        mb: 2,
        borderRadius: 2,
      }}
    >
      <Box
        component="img"
        src={item.product.imageUrl}
        alt={item.product.name}
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
        sx={{
          width: { xs: "100%", sm: 100 },
          height: 100,
          objectFit: "cover",
          borderRadius: 1,
          bgcolor: "grey.100",
        }}
      />

      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          {item.product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ₹{item.product.price}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center" mt={1}>
          <IconButton
            size="small"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <RemoveIcon fontSize="small" />
          </IconButton>
          <Typography>{item.quantity}</Typography>
          <IconButton
            size="small"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>

      <Stack
        direction={{ xs: "row", sm: "column" }}
        justifyContent="space-between"
        alignItems={{ xs: "center", sm: "flex-end" }}
        spacing={1}
      >
        <Typography variant="h6" fontWeight={700}>
          ₹{(item.product.price * item.quantity).toFixed(2)}
        </Typography>
        <IconButton color="error" onClick={() => onRemove(item.id)}>
          <DeleteOutlineIcon />
        </IconButton>
      </Stack>
    </Paper>
  );
}
