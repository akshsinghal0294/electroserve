import { useNavigate } from "react-router-dom";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Chip,
  Box,
} from "@mui/material";
import BrokenImageIcon from "@mui/icons-material/BrokenImage";
import { useState } from "react";

export default function ProductCard({ product, onAddToCart }) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const inStock = product.stockQuantity > 0;

  return (
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: "box-shadow 0.2s, transform 0.2s",
        "&:hover": { boxShadow: 4, transform: "translateY(-2px)" },
      }}
    >
      <CardActionArea onClick={() => navigate(`/products/${product.id}`)}>
        {imgError || !product.imageUrl ? (
          <Box
            sx={{
              height: 180,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "grey.100",
            }}
          >
            <BrokenImageIcon sx={{ fontSize: 40, color: "grey.400" }} />
          </Box>
        ) : (
          <CardMedia
            component="img"
            image={product.imageUrl}
            alt={product.name}
            onError={() => setImgError(true)}
            sx={{ height: 180, objectFit: "cover" }}
          />
        )}

        <CardContent>
          <Typography variant="subtitle1" fontWeight={600} noWrap>
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {product.brand}
          </Typography>
          <Typography variant="h6" color="primary" fontWeight={700} mt={0.5}>
            ₹{product.price}
          </Typography>
          <Chip
            label={inStock ? "In Stock" : "Out of Stock"}
            color={inStock ? "success" : "error"}
            size="small"
            variant="outlined"
            sx={{ mt: 1 }}
          />
        </CardContent>
      </CardActionArea>

      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          disabled={!inStock}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
        >
          Add to Cart
        </Button>
      </Box>
    </Card>
  );
}
