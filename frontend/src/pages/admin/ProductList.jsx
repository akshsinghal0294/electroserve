import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../../services/api";
import {
  Box, Typography, Button, Paper,
  Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Avatar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DashboardIcon from "@mui/icons-material/Dashboard";

export default function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const res = await axios.get("/api/products");
    setProducts(res.data || []);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      await axios.delete(`/api/products/${id}`);
      loadProducts(); // refresh list
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f3f4f6" }}>


      {/* Header */}
      <Paper
        elevation={4}
        square
        sx={{
          bgcolor: "#111827",
          color: "white",
          px: 4,
          py: 2.5,
          m: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Manage Products
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5, color: "#9ca3af" }}>
            Welcome
          </Typography>
        </Box>

        <Box>
        <Button
          component={Link}
          to="/admin/dashboard"
          variant="outlined"
          sx={{
            color: "white",
            borderColor: "white",
            m:1,
            "&:hover": { borderColor: "#9ca3af", bgcolor: "transparent" },
          }}
        >
          Back To Dashboard
        </Button>
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
          Add Product
        </Button>
        </Box>
      </Paper>





      {/* Table */}
      <Paper elevation={2} sx={{ borderRadius: 3, m: 2, }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: "#f9fafb" }}>
              <TableRow>
                {["Image", "Name", "Brand", "Price", "Stock", "Category", "Actions"].map((col) => (
                  <TableCell key={col} sx={{ fontWeight: "bold" }}>{col}</TableCell>
                ))}
              </TableRow>
             
            </TableHead>

            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} sx={{ "&:hover": { bgcolor: "#f9fafb" } }}>
                  <TableCell>
                    <Avatar src={product.imageUrl} alt={product.name} variant="rounded" sx={{ width: 56, height: 56 }} />
                  </TableCell>
                  <TableCell><Typography fontWeight="bold">{product.name}</Typography></TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell>₹{product.price}</TableCell>
                  <TableCell>{product.stockQuantity}</TableCell>
                  <TableCell>{product.category?.name}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => navigate(`/admin/products/edit/${product.id}`)} // ✅ goes to edit page with id
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(product.id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}