import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Collapse,  // ✅ for smooth show/hide of form
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DashboardIcon from "@mui/icons-material/Dashboard";

export default function ManageProducts() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const [products, setProducts] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [showForm, setShowForm] =
    useState(false);

  const [editProduct, setEditProduct] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [formData, setFormData] =
    useState({
      name: "",
      description: "",
      price: "",
      stockQuantity: "",
      imageUrl: "",
      brand: "",
      categoryId: "",
    });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        productsRes,
        categoriesRes,
      ] = await Promise.all([
        axios.get("/api/products"),
        axios.get("/api/categories"),
      ]);

      setProducts(
        productsRes.data || []
      );

      setCategories(
        categoriesRes.data || []
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      stockQuantity: "",
      imageUrl: "",
      brand: "",
      categoryId: "",
    });

    setEditProduct(null);
    setShowForm(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: formData.name,
        description:
          formData.description,
        price:
          Number(formData.price),
        stockQuantity: Number(
          formData.stockQuantity
        ),
        imageUrl:
          formData.imageUrl,
        brand: formData.brand,
        category: {
          id: Number(
            formData.categoryId
          ),
        },
      };

      if (editProduct) {
        await axios.put(
          `/api/products/${editProduct.id}`,
          payload
        );
      } else {
        await axios.post(
          "/api/products",
          payload
        );
      }

      await loadData();
      resetForm();
    } catch (error) {
      console.error(error);
      alert(
        "Failed to save product"
      );
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);

    setFormData({
      name: product.name || "",
      description:
        product.description || "",
      price:
        product.price || "",
      stockQuantity:
        product.stockQuantity ||
        "",
      imageUrl:
        product.imageUrl || "",
      brand:
        product.brand || "",
      categoryId:
        product.category?.id || "",
    });

    setShowForm(true);
  };

  const handleDelete =
    async (id) => {
      const confirmed =
        window.confirm(
          "Are you sure you want to delete this product?"
        );

      if (!confirmed) return;

      try {
        await axios.delete(
          `/api/products/${id}`
        );

        await loadData();
      } catch (error) {
        console.error(error);
        alert(
          "Failed to delete product"
        );
      }
    };

  if (loading) {
    return (
      <div
        style={{
          padding: "30px",
          textAlign:
            "center",
        }}
      >
        <h2>Loading...</h2>
      </div>
    );
  }

  return ( <Box sx={{minHeight: "100vh", bgcolor: "#f3f4f6", m: "2"}}>

    {/* ============================
        HEADER ROW
        ✅ display flex + space-between = title on left, buttons on right
        ============================ */}
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
      }}
    >
      <Typography variant="h4" fontWeight="bold">
        Manage Products
      </Typography>

      <Box sx={{ display: "flex", gap: 1 }}>
        {/* ✅ variant="outlined" = border only button */}
        <Button
          variant="outlined"
          startIcon={<DashboardIcon />}
          onClick={() => navigate("/admin/dashboard")}
        >
          Dashboard
        </Button>

        {/* ✅ variant="contained" = filled blue button */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          Add Product
        </Button>
      </Box>
    </Box>

    {/* ============================
        ADD / EDIT FORM
        ✅ Collapse = smooth expand/collapse animation
           instead of just {showForm && <div>}
        ✅ Paper = white card with shadow
        ============================ */}
    <Collapse in={showForm}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 3 }}>

        <Typography variant="h6" fontWeight="bold" mb={2}>
          {editProduct ? "Edit Product" : "Add New Product"}
        </Typography>

        {/* ✅ Box component="form" = MUI way to use a form
            display grid = 2 columns side by side on desktop */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          {/* ✅ TextField replaces <input type="text">
              - label = floating label above input
              - name + value + onChange = same as before
              - required = same as HTML required */}
          <TextField
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            fullWidth
          />

          <TextField
            label="Brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
            fullWidth
          />

          <TextField
            label="Price (₹)"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            required
            fullWidth
          />

          <TextField
            label="Stock Quantity"
            name="stockQuantity"
            type="number"
            value={formData.stockQuantity}
            onChange={handleChange}
            required
            fullWidth
          />

          <TextField
            label="Image URL"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            required
            fullWidth
          />

          {/* ✅ FormControl + InputLabel + Select = MUI dropdown
              replaces <select> + <option> */}
          <FormControl fullWidth required>
            <InputLabel>Category</InputLabel>
            <Select
              name="categoryId"
              value={formData.categoryId}
              label="Category"
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>Select Category</em>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* ✅ multiline + rows = replaces <textarea rows="4"> 
              gridColumn span = makes description full width */}
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            fullWidth
            multiline
            rows={3}
            sx={{ gridColumn: { sm: "1 / -1" } }}  
          />

          {/* ✅ Action buttons row — also full width */}
          <Box
            sx={{
              gridColumn: { sm: "1 / -1" },
              display: "flex",
              gap: 2,
            }}
          >
            <Button
              type="submit"
              variant="contained"
              color="success"
              sx={{ px: 4 }}
            >
              {editProduct ? "Update" : "Save"}
            </Button>

            <Button
              type="button"
              variant="outlined"
              color="error"
              onClick={resetForm}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Collapse>

    {/* ============================
        PRODUCTS TABLE
        ✅ Paper wraps the table for white card look
        ✅ TableContainer handles horizontal scroll
        ============================ */}
    <Paper elevation={2} sx={{ borderRadius: 3 }}>
      <TableContainer>
        <Table>

          {/* ✅ TableHead = <thead> with grey background */}
          <TableHead sx={{ bgcolor: "#f9fafb" }}>
            <TableRow>
              {["Image", "Name", "Brand", "Price", "Stock", "Category", "Actions"].map((col) => (
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
            {products.length === 0 ? (
              // ✅ Empty state row
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 5, color: "text.secondary" }}>
                  No products found. Click "Add Product" to get started.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow
                  key={product.id}
                  sx={{ "&:hover": { bgcolor: "#f9fafb" } }} // {/* ✅ hover highlight */}
                >

                  {/* ✅ Avatar with src = circular image
                      variant="rounded" = slightly rounded square
                      replaces <img width=60 height=60> */}
                  <TableCell>
                    <Avatar
                      src={product.imageUrl}
                      alt={product.name}
                      variant="rounded"
                      sx={{ width: 56, height: 56 }}
                    />
                  </TableCell>

                  <TableCell>
                    <Typography fontWeight="bold">{product.name}</Typography>
                  </TableCell>

                  <TableCell>{product.brand}</TableCell>

                  <TableCell>
                    <Typography color="success.main" fontWeight="bold">
                      ₹{product.price}
                    </Typography>
                  </TableCell>

                  {/* ✅ Color stock quantity based on level */}
                  <TableCell>
                    <Typography
                      fontWeight="bold"
                      color={product.stockQuantity < 5 ? "error.main" : "text.primary"}
                    >
                      {product.stockQuantity}
                      {product.stockQuantity < 5 && " ⚠️"}
                    </Typography>
                  </TableCell>

                  <TableCell>{product.category?.name}</TableCell>

                  {/* ✅ Action buttons with icons */}
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleEdit(product)}
                        sx={{ borderRadius: 2 }}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(product.id)}
                        sx={{ borderRadius: 2 }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </TableCell>

                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>

  </Box>
  );
}

