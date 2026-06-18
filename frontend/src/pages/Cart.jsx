import { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
} from "react-router-dom";

import api from "../services/api";
import StarRating from "../components/StarRating";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function ProductDetail() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { user, isAuthenticated } =
    useAuth();

  const [product, setProduct] =
    useState(null);

  const [reviews, setReviews] =
    useState([]);

  const [quantity, setQuantity] =
    useState(1);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadProduct();
    loadReviews();
  }, [id]);

  const loadProduct = async () => {
    try {
      const response = await api.get(
        `/api/products/${id}`
      );

      setProduct(response.data);
    } catch (err) {
      setError(
        "Failed to load product"
      );
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const response = await api.get(
        `/api/reviews/product/${id}`
      );

      setReviews(response.data);
    } catch (err) {
      setReviews([]);
    }
  };

  const handleAddToCart =
    async () => {
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }

      await addToCart(
        user.id,
        product.id,
        quantity
      );

      alert(
        "Added to cart successfully"
      );
    };

  if (loading)
    return <h2>Loading...</h2>;

  if (error)
    return <h2>{error}</h2>;

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <button
        onClick={() =>
          navigate("/products")
        }
      >
        ← Back
      </button>

      <div
        style={{
          display: "flex",
          gap: "40px",
          marginTop: "20px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{
              width: "400px",
              maxWidth: "100%",
              borderRadius: "10px",
            }}
          />
        </div>

        <div
          style={{
            flex: 1,
          }}
        >
          <h1>{product.name}</h1>

          <h3>{product.brand}</h3>

          <h2>
            ₹{product.price}
          </h2>

          <p>
            Stock Available:{" "}
            {
              product.stockQuantity
            }
          </p>

          <p>
            {
              product.description
            }
          </p>

          <StarRating
            rating={4}
          />

          <div
            style={{
              marginTop: "20px",
            }}
          >
            <button
              onClick={() =>
                setQuantity(
                  Math.max(
                    1,
                    quantity - 1
                  )
                )
              }
            >
              -
            </button>

            <span
              style={{
                margin:
                  "0 15px",
              }}
            >
              {quantity}
            </span>

            <button
              onClick={() =>
                setQuantity(
                  quantity + 1
                )
              }
            >
              +
            </button>
          </div>

          <button
            onClick={
              handleAddToCart
            }
            style={{
              marginTop:
                "20px",
              padding:
                "12px 20px",
            }}
          >
            Add To Cart
          </button>
        </div>
      </div>

      <div
        style={{
          marginTop: "50px",
        }}
      >
        <h2>Reviews</h2>

        {reviews.length ===
        0 ? (
          <p>
            No reviews
            available
          </p>
        ) : (
          reviews.map(
            (review) => (
              <div
                key={
                  review.id
                }
                style={{
                  border:
                    "1px solid #ddd",
                  padding:
                    "15px",
                  marginBottom:
                    "10px",
                }}
              >
                <StarRating
                  rating={
                    review.rating
                  }
                />

                <p>
                  {
                    review.comment
                  }
                </p>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}