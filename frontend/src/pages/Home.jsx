
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import ProductCard from "../components/ProductCard";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] =
    useState([]);
  const [loading, setLoading] =
    useState(true);

  const { addToCart } = useCart();
  const { user, isAuthenticated } =
    useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const productsResponse =
        await api.get("/api/products");

      const categoriesResponse =
        await api.get("/api/categories");

      setProducts(
        productsResponse.data.slice(0, 8)
      );

      setCategories(
        categoriesResponse.data
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (
    product
  ) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    await addToCart(
      user.id,
      product.id,
      1
    );

    alert("Added to cart");
  };

  return (
    <div>

      {/* Hero */}

      <section
        style={{
          padding: "10px 10px",
          textAlign: "center",
          background: "#f3f4f6",
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            marginBottom: "20px",
          }}
        >
          Your One Stop Electronics Shop
        </h1>

        <p
          style={{
            fontSize: "20px",
            marginBottom: "30px",
          }}
        >
          Buy Parts & Book Repair Services
        </p>

        <button
          onClick={() =>
            navigate("/products")
          }
          style={{
            padding: "12px 25px",
            marginRight: "10px",
          }}
        >
          Shop Now
        </button>

        <button
          onClick={() =>
            navigate("/services")
          }
          style={{
            padding: "12px 25px",
          }}
        >
          Book Service
        </button>
      </section>

      {/* Categories */}

      <section
        style={{
          padding: "40px 20px",
        }}
      >
        <h2>Categories</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill,minmax(200px,1fr))",
            gap: "20px",
          }}
        >
          {categories.map(
            (category) => (
              <div
                key={category.id}
                onClick={() =>
                  navigate(
                    `/products?category=${category.id}`
                  )
                }
                style={{
                  border: "1px solid #ddd",
                  padding: "20px",
                  cursor: "pointer",
                  borderRadius: "10px",
                }}
              >
                <h3>
                  {category.name}
                </h3>

                <p>
                  {
                    category.description
                  }
                </p>
              </div>
            )
          )}
        </div>
      </section>

      {/* Products */}

      <section
        style={{
          padding: "40px 20px",
        }}
      >
        <h2>
          Featured Products
        </h2>

        {loading ? (
          <p>Loading...</p>
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
                  key={product.id}
                  product={product}
                  onAddToCart={
                    handleAddToCart
                  }
                />
              )
            )}
          </div>
        )}
      </section>

      {/* Services */}

      <section
        style={{
          padding: "40px 20px",
        }}
      >
        <h2>
          Repair Services
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill,minmax(250px,1fr))",
            gap: "20px",
          }}
        >
          {[
            "Refrigerator Repair",
            "AC Service",
            "TV Repair",
            "Washing Machine Repair",
          ].map((service) => (
            <div
              key={service}
              style={{
                border:
                  "1px solid #ddd",
                padding: "20px",
                borderRadius:
                  "10px",
              }}
            >
              <h3>{service}</h3>

              <button
                onClick={() =>
                  navigate(
                    "/book-service"
                  )
                }
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

