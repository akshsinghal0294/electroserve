import {
    useEffect,
    useState,
  } from "react";
  
  import { useNavigate } from "react-router-dom";
  
  import api from "../services/api";
  
  import { useAuth } from "../context/AuthContext";
  
  export default function Orders() {
    const navigate = useNavigate();
  
    const { user } = useAuth();
  
    const [orders, setOrders] =
      useState([]);
  
    const [loading, setLoading] =
      useState(true);
  
    useEffect(() => {
      if (user?.id) {
        loadOrders();
      }
    }, [user]);
  
    const loadOrders =
      async () => {
        try {
          const response =
            await api.get(
              `/api/orders/user/${user.id}`
            );
  
          const sorted =
            response.data.sort(
              (a, b) =>
                new Date(
                  b.createdAt
                ) -
                new Date(
                  a.createdAt
                )
            );
  
          setOrders(sorted);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
  
    const getStatusColor = (
      status
    ) => {
      switch (status) {
        case "PENDING":
          return "#facc15";
  
        case "CONFIRMED":
          return "#3b82f6";
  
        case "SHIPPED":
          return "#9333ea";
  
        case "DELIVERED":
          return "#16a34a";
  
        case "CANCELLED":
          return "#dc2626";
  
        default:
          return "#6b7280";
      }
    };
  
    if (loading) {
      return (
        <h2
          style={{
            textAlign:
              "center",
          }}
        >
          Loading...
        </h2>
      );
    }
  
    if (
      orders.length === 0
    ) {
      return (
        <div
          style={{
            textAlign:
              "center",
            padding: "50px",
          }}
        >
          <h1>My Orders</h1>
  
          <p>
            No orders found
          </p>
  
          <button
            onClick={() =>
              navigate(
                "/products"
              )
            }
          >
            Shop Now
          </button>
        </div>
      );
    }
  
    return (
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "30px",
        }}
      >
        <h1>My Orders</h1>
  
        {orders.map(
          (order) => (
            <div
              key={order.id}
              style={{
                border:
                  "1px solid #ddd",
                borderRadius:
                  "10px",
                padding:
                  "20px",
                marginBottom:
                  "20px",
                boxShadow:
                  "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <h3>
                Order #
                {order.id}
              </h3>
  
              <p>
                Date:{" "}
                {new Date(
                  order.createdAt
                ).toLocaleString()}
              </p>
  
              <p>
                Amount: ₹
                {
                  order.totalAmount
                }
              </p>
  
              <span
                style={{
                  background:
                    getStatusColor(
                      order.status
                    ),
                  color:
                    "white",
                  padding:
                    "5px 10px",
                  borderRadius:
                    "5px",
                  marginRight:
                    "10px",
                }}
              >
                {
                  order.status
                }
              </span>
  
              <span
                style={{
                  background:
                    "#374151",
                  color:
                    "white",
                  padding:
                    "5px 10px",
                  borderRadius:
                    "5px",
                }}
              >
                {
                  order.paymentStatus
                }
              </span>
  
              {order.items &&
                order.items
                  .length >
                  0 && (
                  <div
                    style={{
                      marginTop:
                        "15px",
                    }}
                  >
                    <h4>
                      Items
                    </h4>
  
                    {order.items.map(
                      (
                        item
                      ) => (
                        <p
                          key={
                            item.id
                          }
                        >
                          {
                            item
                              .product
                              .name
                          }{" "}
                          ×{" "}
                          {
                            item.quantity
                          }
                        </p>
                      )
                    )}
                  </div>
                )}
            </div>
          )
        )}
      </div>
    );
  }