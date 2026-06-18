import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Checkout() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const {
    cartItems,
    cartTotal,
    clearCart,
  } = useCart();

  const [address, setAddress] =
    useState("");

  const [city, setCity] =
    useState("");

  const [stateName, setStateName] =
    useState("");

  const [pincode, setPincode] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const deliveryCharge = 50;

  const grandTotal =
    cartTotal + deliveryCharge;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const fullAddress = `
${address},
${city},
${stateName},
${pincode},
Phone: ${phone}
      `;

      await api.post(
        "/api/orders/place",
        null,
        {
          params: {
            userId: user.id,
            address:
              fullAddress,
          },
        }
      );

      await clearCart(user.id);

      alert(
        "Order placed successfully"
      );

      navigate("/orders");
    } catch (err) {
      setError(
        "Failed to place order"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "30px",
      }}
    >
      <h1>Checkout</h1>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "2fr 1fr",
          gap: "30px",
        }}
      >
        <form
          onSubmit={
            handleSubmit
          }
        >
          <h2>
            Delivery Address
          </h2>

          <textarea
            rows="4"
            placeholder="Full Address"
            value={address}
            onChange={(e) =>
              setAddress(
                e.target.value
              )
            }
            required
            style={{
              width: "100%",
              marginBottom:
                "10px",
            }}
          />

          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) =>
              setCity(
                e.target.value
              )
            }
            required
            style={{
              width: "100%",
              marginBottom:
                "10px",
            }}
          />

          <input
            type="text"
            placeholder="State"
            value={stateName}
            onChange={(e) =>
              setStateName(
                e.target.value
              )
            }
            required
            style={{
              width: "100%",
              marginBottom:
                "10px",
            }}
          />

          <input
            type="text"
            placeholder="Pincode"
            value={pincode}
            onChange={(e) =>
              setPincode(
                e.target.value
              )
            }
            required
            style={{
              width: "100%",
              marginBottom:
                "10px",
            }}
          />

          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) =>
              setPhone(
                e.target.value
              )
            }
            required
            style={{
              width: "100%",
              marginBottom:
                "20px",
            }}
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Placing Order..."
              : "Place Order"}
          </button>
        </form>

        <div
          style={{
            border:
              "1px solid #ddd",
            padding: "20px",
            borderRadius:
              "10px",
          }}
        >
          <h2>
            Order Summary
          </h2>

          {cartItems.map(
            (item) => (
              <div
                key={item.id}
                style={{
                  marginBottom:
                    "10px",
                }}
              >
                <p>
                  {
                    item.product
                      .name
                  }{" "}
                  ×{" "}
                  {
                    item.quantity
                  }
                </p>

                <p>
                  ₹
                  {item.product
                    .price *
                    item.quantity}
                </p>
              </div>
            )
          )}

          <hr />

          <p>
            Subtotal: ₹
            {cartTotal}
          </p>

          <p>
            Delivery: ₹
            {
              deliveryCharge
            }
          </p>

          <h3>
            Grand Total: ₹
            {grandTotal}
          </h3>
        </div>
      </div>
    </div>
  );
}