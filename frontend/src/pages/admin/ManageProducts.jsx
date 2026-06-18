import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "../../services/api";
import { useAuth } from "../../context/AuthContext";

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

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
          marginBottom:
            "20px",
        }}
      >
        <h1>
          Manage Products
        </h1>

        <div>
          <button
            onClick={() =>
              navigate(
                "/admin/dashboard"
              )
            }
            style={{
              marginRight:
                "10px",
            }}
          >
            Dashboard
          </button>

          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            Add Product
          </button>
        </div>
      </div>

      {showForm && (
        <div
          style={{
            background:
              "#fff",
            padding:
              "20px",
            borderRadius:
              "10px",
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.1)",
            marginBottom:
              "25px",
          }}
        >
          <h2>
            {editProduct
              ? "Edit Product"
              : "Add Product"}
          </h2>

          <form
            onSubmit={
              handleSubmit
            }
          >
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={
                formData.name
              }
              onChange={
                handleChange
              }
              required
              style={{
                width:
                  "100%",
                padding:
                  "10px",
                marginBottom:
                  "10px",
              }}
            />

            <textarea
              name="description"
              placeholder="Description"
              value={
                formData.description
              }
              onChange={
                handleChange
              }
              rows="4"
              required
              style={{
                width:
                  "100%",
                padding:
                  "10px",
                marginBottom:
                  "10px",
              }}
            />

            <input
              type="number"
              name="price"
              placeholder="Price"
              value={
                formData.price
              }
              onChange={
                handleChange
              }
              required
              style={{
                width:
                  "100%",
                padding:
                  "10px",
                marginBottom:
                  "10px",
              }}
            />

            <input
              type="number"
              name="stockQuantity"
              placeholder="Stock Quantity"
              value={
                formData.stockQuantity
              }
              onChange={
                handleChange
              }
              required
              style={{
                width:
                  "100%",
                padding:
                  "10px",
                marginBottom:
                  "10px",
              }}
            />

            <input
              type="text"
              name="brand"
              placeholder="Brand"
              value={
                formData.brand
              }
              onChange={
                handleChange
              }
              required
              style={{
                width:
                  "100%",
                padding:
                  "10px",
                marginBottom:
                  "10px",
              }}
            />

            <input
              type="text"
              name="imageUrl"
              placeholder="Image URL"
              value={
                formData.imageUrl
              }
              onChange={
                handleChange
              }
              required
              style={{
                width:
                  "100%",
                padding:
                  "10px",
                marginBottom:
                  "10px",
              }}
            />

            <select
              name="categoryId"
              value={
                formData.categoryId
              }
              onChange={
                handleChange
              }
              required
              style={{
                width:
                  "100%",
                padding:
                  "10px",
                marginBottom:
                  "15px",
              }}
            >
              <option value="">
                Select Category
              </option>

              {categories.map(
                (
                  category
                ) => (
                  <option
                    key={
                      category.id
                    }
                    value={
                      category.id
                    }
                  >
                    {
                      category.name
                    }
                  </option>
                )
              )}
            </select>

            <button
              type="submit"
              style={{
                marginRight:
                  "10px",
              }}
            >
              Save
            </button>

            <button
              type="button"
              onClick={
                resetForm
              }
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      <div
        style={{
          overflowX:
            "auto",
          background:
            "white",
          borderRadius:
            "10px",
          padding:
            "20px",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse:
              "collapse",
          }}
        >
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map(
              (product) => (
                <tr
                  key={
                    product.id
                  }
                >
                  <td>
                    <img
                      src={
                        product.imageUrl
                      }
                      alt={
                        product.name
                      }
                      width="60"
                      height="60"
                      style={{
                        objectFit:
                          "cover",
                      }}
                    />
                  </td>

                  <td>
                    {
                      product.name
                    }
                  </td>

                  <td>
                    {
                      product.brand
                    }
                  </td>

                  <td>
                    ₹
                    {
                      product.price
                    }
                  </td>

                  <td>
                    {
                      product.stockQuantity
                    }
                  </td>

                  <td>
                    {
                      product
                        .category
                        ?.name
                    }
                  </td>

                  <td>
                    <button
                      onClick={() =>
                        handleEdit(
                          product
                        )
                      }
                      style={{
                        background:
                          "#2563eb",
                        color:
                          "white",
                        border:
                          "none",
                        padding:
                          "6px 12px",
                        marginRight:
                          "5px",
                      }}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          product.id
                        )
                      }
                      style={{
                        background:
                          "#dc2626",
                        color:
                          "white",
                        border:
                          "none",
                        padding:
                          "6px 12px",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}