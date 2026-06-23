import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "../../services/api";
import {
  Box, Typography, Button, Paper,
  TextField, Select, MenuItem,
  FormControl, InputLabel,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";


export default function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

 
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "", brand: "", price: "",
    stockQuantity: "", imageUrl: "",
    description: "", categoryId: "",
  });

  useEffect(() => {
    loadCategories();
    if (isEdit) loadProduct();
  }, []);

  const loadCategories = async () => {
    const res = await axios.get("/api/categories");
    setCategories(res.data || []);
  };

  const loadProduct = async () => {
    const res = await axios.get(`/api/products/${id}`);
    const p = res.data;
    setFormData({
      name: p.name,
      brand: p.brand,
      price: p.price,
      stockQuantity: p.stockQuantity,
      imageUrl: p.imageUrl,
      description: p.description,
      categoryId: p.category?.id,
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEdit) {
      await axios.put(`/api/products/${id}`, formData);
    } else {
      await axios.post("/api/products", formData);
    }
    navigate("/admin/products");
  };

 
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
            {isEdit ? "Edit Product" : "Add New Product"}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5, color: "#9ca3af" }}>
            {isEdit ? "Update product details" : "Fill in the product details"}
          </Typography>
        </Box>

        <Button
          component={Link}
          to="/admin/products"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{
            color: "white",
            borderColor: "white",
            "&:hover": { borderColor: "#9ca3af", bgcolor: "transparent" },
          }}
        >
          Back To List
        </Button>
      </Paper>

      {/* ====== FORM ====== */}
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, m: 3 }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          {/* Product Name */}
          <TextField
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            fullWidth
          />

          {/* Brand */}
          <TextField
            label="Brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            
            fullWidth
          />

          {/* Price */}
          <TextField
            label="Price (₹)"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            required
            fullWidth
          />

          {/* Stock */}
          <TextField
            label="Stock Quantity"
            name="stockQuantity"
            type="number"
            value={formData.stockQuantity}
            onChange={handleChange}
            
            fullWidth
          />

          {/* Image URL with search icon button inside */}
          <TextField
            label="Image URL"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            
            fullWidth
            placeholder="Paste URL or click 🔍 to search"
           
          />

          {/* Category */}
          <FormControl fullWidth required>
            <InputLabel>Category</InputLabel>
            <Select
              name="categoryId"
              value={formData.categoryId}
              label="Category"
              onChange={handleChange}
            >
              <MenuItem value=""><em>Select Category</em></MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
              ))}
            </Select>
            </FormControl>
         

          {/* Description — full width */}
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            
            fullWidth
            multiline
            rows={3}
            sx={{ gridColumn: { sm: "1 / -1" } }}
          />

          {/* Action Buttons */}
          <Box sx={{ gridColumn: { sm: "1 / -1" }, display: "flex", gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="success"
              startIcon={<SaveIcon />}
              sx={{ px: 4 }}
            >
              {isEdit ? "Update Product" : "Save Product"}
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => navigate("/admin/products")}
            >
              Cancel
            </Button>
          </Box>

        </Box>
      </Paper>

     

         
        
         

    </Box>
  );
}