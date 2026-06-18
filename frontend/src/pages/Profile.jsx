import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);

      const [ordersRes, bookingsRes] =
        await Promise.all([
          axios.get(
            `/api/orders/user/${user.id}`
          ),
          axios.get(
            `/api/services/user/${user.id}`
          ),
        ]);

      setOrders(ordersRes.data || []);
      setBookings(bookingsRes.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "#facc15";

      case "CONFIRMED":
        return "#3b82f6";

      case "DELIVERED":
        return "#16a34a";

      case "CANCELLED":
        return "#dc2626";

      case "SHIPPED":
        return "#9333ea";

      case "IN_PROGRESS":
        return "#2563eb";

      case "COMPLETED":
        return "#16a34a";

      default:
        return "#6b7280";
    }
  };

  const totalSpent = orders.reduce(
    (sum, order) =>
      sum + (order.totalAmount || 0),
    0
  );

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )
    .slice(0, 3);

  const recentBookings = [...bookings]
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )
    .slice(0, 3);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "50px",
        }}
      >
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "30px",
      }}
    >
      <h1>My Profile</h1>

      {/* Profile Card */}

      <div
        style={{
          background: "#ffffff",
          padding: "25px",
          borderRadius: "12px",
          boxShadow:
            "0 2px 10px rgba(0,0,0,0.1)",
          marginBottom: "25px",
        }}
      >
        <h2>{user?.name}</h2>

        <p>
          <strong>Email:</strong>{" "}
          {user?.email}
        </p>

        <p>
          <strong>Phone:</strong>{" "}
          {user?.phone || "N/A"}
        </p>

        <span
          style={{
            background:
              user?.role === "ADMIN"
                ? "#dc2626"
                : "#2563eb",
            color: "white",
            padding: "6px 12px",
            borderRadius: "20px",
            fontSize: "14px",
          }}
        >
          {user?.role}
        </span>
      </div>

      {/* Stats */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow:
              "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Total Orders</h3>
          <h2>{orders.length}</h2>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow:
              "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Total Bookings</h3>
          <h2>{bookings.length}</h2>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow:
              "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Total Spent</h3>
          <h2>₹{totalSpent}</h2>
        </div>
      </div>

      {/* Recent Orders */}

      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow:
            "0 2px 10px rgba(0,0,0,0.1)",
          marginBottom: "25px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
          }}
        >
          <h2>Recent Orders</h2>

          <button
            onClick={() =>
              navigate("/orders")
            }
          >
            View All Orders
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          recentOrders.map((order) => (
            <div
              key={order.id}
              style={{
                borderBottom:
                  "1px solid #eee",
                padding: "12px 0",
              }}
            >
              <p>
                <strong>
                  Order #
                  {order.id}
                </strong>
              </p>

              <p>
                Amount: ₹
                {order.totalAmount}
              </p>

              <span
                style={{
                  background:
                    getStatusColor(
                      order.status
                    ),
                  color: "white",
                  padding:
                    "4px 10px",
                  borderRadius:
                    "15px",
                  fontSize:
                    "12px",
                }}
              >
                {order.status}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Recent Bookings */}

      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow:
            "0 2px 10px rgba(0,0,0,0.1)",
          marginBottom: "25px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
          }}
        >
          <h2>
            Recent Service Bookings
          </h2>

          <button
            onClick={() =>
              navigate("/services")
            }
          >
            View All
          </button>
        </div>

        {recentBookings.length ===
        0 ? (
          <p>
            No service bookings
            found.
          </p>
        ) : (
          recentBookings.map(
            (booking) => (
              <div
                key={
                  booking.id
                }
                style={{
                  borderBottom:
                    "1px solid #eee",
                  padding:
                    "12px 0",
                }}
              >
                <p>
                  <strong>
                    {
                      booking.serviceType
                    }
                  </strong>
                </p>

                <p>
                  {
                    booking.appointmentDate
                  }
                </p>

                <span
                  style={{
                    background:
                      getStatusColor(
                        booking.status
                      ),
                    color:
                      "white",
                    padding:
                      "4px 10px",
                    borderRadius:
                      "15px",
                    fontSize:
                      "12px",
                  }}
                >
                  {
                    booking.status
                  }
                </span>
              </div>
            )
          )
        )}
      </div>

      <button
        onClick={handleLogout}
        style={{
          background: "#dc2626",
          color: "white",
          border: "none",
          padding: "12px 20px",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}