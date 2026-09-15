import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import api from "../services/api";

import ProductCard from "../components/ProductCard";
import SearchIcon from "@mui/icons-material/Search";
import {
  IconButton,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Pagination,
} from "@mui/material";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";

const PAGE_SIZE = 12;

export default function Products() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category");

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { notify } = useNotification();

  useEffect(() => {
    setPage(0);
  }, [categoryId, activeSearch]);

  useEffect(() => {
    loadProducts(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, categoryId, activeSearch]);

  const loadProducts = async (pageToLoad) => {
    try {
      setLoading(true);

      let url = `/api/products?page=${pageToLoad}&size=${PAGE_SIZE}`;
      if (categoryId) {
        url = `/api/products/category/${categoryId}?page=${pageToLoad}&size=${PAGE_SIZE}`;
      } else if (activeSearch) {
        url = `/api/products/search?keyword=${encodeURIComponent(
          activeSearch
        )}&page=${pageToLoad}&size=${PAGE_SIZE}`;
      }

      const response = await api.get(url);

      setProducts(response.data.content || []);
      setTotalPages(response.data.totalPages ?? 0);
    } catch (error) {
      console.error(error);
      notify("Failed to load products.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setActiveSearch(searchKeyword.trim());
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
      {/* Hero / Search */}
      <Box
        component="section"
        sx={{ bgcolor: "grey.100", py: { xs: 3, sm: 4 }, px: 2, textAlign: "center" }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Products
        </Typography>

        <Box
          sx={{
            maxWidth: 700,
            mx: "auto",
            mt: 2,
            display: "flex",
            alignItems: "center",
            bgcolor: "white",
            borderRadius: 1,
            overflow: "hidden",
            boxShadow: 2,
          }}
        >
          <TextField
            fullWidth
            placeholder="Search products..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            variant="standard"
            slotProps={{ input: { disableUnderline: true } }}
            sx={{ px: 2 }}
          />

          <IconButton onClick={handleSearch} sx={{ borderRadius: 0, px: 2 }}>
            <SearchIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Products Grid */}
      <Box component="section" sx={{ px: { xs: 2, sm: 4 }, py: 5 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : products.length === 0 ? (
          <Typography align="center" color="text.secondary" py={6}>
            No products found.
          </Typography>
        ) : (
          <>
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

            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page + 1}
                  onChange={(e, value) => setPage(value - 1)}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
