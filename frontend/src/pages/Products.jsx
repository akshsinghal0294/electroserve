import {
    useEffect,
    useState,
  } from "react";
  
  import {
    useNavigate,
    useSearchParams,
  } from "react-router-dom";
  
  import api from "../services/api";
  
  import ProductCard from "../components/ProductCard";
  
  import { useCart } from "../context/CartContext";
  import { useAuth } from "../context/AuthContext";
  
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
      <div
        style={{
          padding: "20px",
        }}
      >
        <h1>Products</h1>
  
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <input
            type="text"
            placeholder="Search products..."
            value={searchKeyword}
            onChange={(e) =>
              setSearchKeyword(
                e.target.value
              )
            }
            style={{
              flex: 1,
              padding: "10px",
            }}
          />
  
          <button
            onClick={
              searchProducts
            }
          >
            Search
          </button>
        </div>
  
        <div
          style={{
            marginBottom: "20px",
          }}
        >
          <button
            onClick={
              loadProducts
            }
          >
            All
          </button>
  
          {categories.map(
            (category) => (
              <button
                key={category.id}
                onClick={() =>
                  filterCategory(
                    category.id
                  )
                }
                style={{
                  marginLeft:
                    "10px",
                }}
              >
                {category.name}
              </button>
            )
          )}
        </div>
  
        {loading ? (
          <h3>
            Loading...
          </h3>
        ) : products.length ===
          0 ? (
          <h3>
            No Products Found
          </h3>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill,minmax(250px,1fr))",
              gap: "20px",
            }}
          >
            {products.map(
              (product) => (
                <ProductCard
                  key={
                    product.id
                  }
                  product={
                    product
                  }
                  onAddToCart={
                    handleAddToCart
                  }
                />
              )
            )}
          </div>
        )}
      </div>
    );
  }