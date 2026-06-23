import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import api from "../services/api";

import InputAdornment from "@mui/material/InputAdornment";

import ProductCard from "../components/ProductCard";
import SearchIcon from "@mui/icons-material/Search";
import {  IconButton } from "@mui/material";


import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  TextField,
  Button,
  Box,
  autocompleteClasses,
} from "@mui/material";


export default function Products() {
  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const categoryId =
    searchParams.get("category");

  const [products, setProducts] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [selectedCategory,
    setSelectedCategory] =
    useState(categoryId || "");

  const [searchKeyword,
    setSearchKeyword] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const { addToCart } = useCart();

  const { user, isAuthenticated } =
    useAuth();

  useEffect(() => {
    loadCategories();

    if (categoryId) {
      filterCategory(categoryId);
    } else {
      loadProducts();
    }
  }, []);

  const loadProducts =
    async () => {
      try {
        setLoading(true);

        const response =
          await api.get(
            "/api/products"
          );

        setProducts(
          response.data
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  const loadCategories =
    async () => {
      try {
        const response =
          await api.get(
            "/api/categories"
          );

        setCategories(
          response.data
        );
      } catch (error) {
        console.error(error);
      }
    };

  const searchProducts =
    async () => {
      try {
        setLoading(true);

        const response =
          await api.get(
            `/api/products/search?keyword=${searchKeyword}`
          );

        setProducts(
          response.data
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  const filterCategory =
    async (id) => {
      try {
        setSelectedCategory(id);
        setLoading(true);

        const response =
          await api.get(
            `/api/products/category/${id}`
          );

        setProducts(
          response.data
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  const handleAddToCart =
    async (product) => {
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }

      await addToCart(
        user.id,
        product.id,
        1
      );

      alert(
        "Added to cart"
      );
    };

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: "#f3f4f6",
          padding: " 20px",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
        >
          Products
        </Typography>
          <Box
  sx={{
    maxWidth: "900px",
    mx: "auto",
    mt: 2,
    display: "flex",
    alignItems: "center",
    bgcolor: "white",
    borderRadius: "4px",
    overflow: "hidden",
    boxShadow: 2,
  }}
>
  <TextField
    fullWidth
    placeholder="Search products..."
    value={searchKeyword}
    onChange={(e) => setSearchKeyword(e.target.value)}
    onKeyDown={(e) =>
      e.key === "Enter" && searchProducts()
    }
    variant="standard"
    InputProps={{
      disableUnderline: true,
    }}
    sx={{
      px: 2,
    }}
  />

  <IconButton
    onClick={searchProducts}
    sx={{
      bgcolor: "white - dark",
      borderRadius: 0,
      height: 60,
      width: 70,
      "&:hover": {
        bgcolor: "#e6952f",
      },
    }}
  >
    <SearchIcon sx={{ fontSize: 35, color: "grey" }} />
  </IconButton>
</Box>

        
       
      </section>

      {/* Services Grid */}
      <section style={{ padding: "40px 20px" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {products.map((product) => (
            <Card
              key={product.name}
              // onClick={() =>
              //   navigate(
              //     `/book-service?service=${encodeURIComponent(product.name)}`
              //   )
              // }
              sx={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardMedia
                component="img"
                height="180"
                image={product.imageUrl}
                alt={product.name}
                sx={{ objectFit: "cover" }}
              />

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
              </CardContent>

              <CardActions sx={{ px: 2, pb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    ₹{product.price}
                  </Typography>
                  
                </Box>
              </CardActions>
            </Card>
          ))}
        </Box>
      </section>
    </div>


  );
}