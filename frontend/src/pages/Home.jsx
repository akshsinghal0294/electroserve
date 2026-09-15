import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Typography,
  CircularProgress,
} from "@mui/material";
import BuildIcon from "@mui/icons-material/Build";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

import api from "../services/api";
import ProductCard from "../components/ProductCard";
import ServiceCard from "../components/ServiceCard";
import { services } from "../data/services";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";

export default function Home() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { notify } = useNotification();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const productsResponse = await api.get("/api/products");
      const categoriesResponse = await api.get("/api/categories");

      const productList = Array.isArray(productsResponse.data)
        ? productsResponse.data
        : productsResponse.data.content || [];

      setProducts(productList.slice(0, 8));
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error(error);
      notify("Failed to load homepage data.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    await addToCart(user.id, product.id, 1);
  };

  return (
    <Box>
      {/* Hero */}
      <Box
        component="section"
        sx={{
          bgcolor: "header.main",
          color: "header.contrastText",
          py: { xs: 6, sm: 10 },
          px: 2,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h2"
          fontWeight={800}
          sx={{ fontSize: { xs: "2rem", sm: "3rem" }, mb: 2 }}
        >
          Your One-Stop Electronics Shop
        </Typography>

        <Typography
          variant="h6"
          sx={{ color: "grey.400", mb: 4, fontSize: { xs: "1rem", sm: "1.25rem" } }}
        >
          Genuine spare parts, gadgets &amp; expert repair services
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<ShoppingBagIcon />}
            onClick={() => navigate("/products")}
          >
            Shop Now
          </Button>

          <Button
            variant="outlined"
            size="large"
            startIcon={<BuildIcon />}
            onClick={() => navigate("/services")}
            sx={{
              color: "white",
              borderColor: "white",
              "&:hover": { borderColor: "grey.400", bgcolor: "rgba(255,255,255,0.08)" },
            }}
          >
            Book Service
          </Button>
        </Box>
      </Box>

      {/* Categories */}
      {categories.length > 0 && (
        <Container maxWidth="lg" component="section" sx={{ py: { xs: 4, sm: 6 } }}>
          <Typography variant="h4" fontWeight={700} mb={3}>
            Shop by Category
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(3, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 2,
            }}
          >
            {categories.map((category) => (
              <Box
                key={category.id}
                onClick={() => navigate(`/products?category=${category.id}`)}
                sx={{
                  border: "1px solid",
                  borderColor: "grey.200",
                  borderRadius: 2,
                  p: 3,
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "box-shadow 0.2s, transform 0.2s",
                  "&:hover": { boxShadow: 3, transform: "translateY(-2px)" },
                }}
              >
                <Typography variant="subtitle1" fontWeight={600}>
                  {category.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      )}

      {/* Featured Products */}
      <Container maxWidth="lg" component="section" sx={{ py: { xs: 4, sm: 6 } }}>
        <Typography variant="h4" fontWeight={700} mb={3}>
          Featured Products
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr 1fr",
                sm: "repeat(3, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 3,
            }}
          >
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </Box>
        )}
      </Container>

      {/* Repair Services */}
      <Container maxWidth="lg" component="section" sx={{ py: { xs: 4, sm: 6 } }}>
        <Typography variant="h4" fontWeight={700} mb={3}>
          Repair Services
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 3,
          }}
        >
          {services.slice(0, 4).map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </Box>
      </Container>
    </Box>
  );
}
