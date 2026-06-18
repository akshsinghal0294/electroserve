import { useEffect, useState } from "react";
import {
  useNavigate,
  Link,
} from "react-router-dom";

import axios from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const [orders, setOrders] =
    useState([]);

  const [bookings, setBookings] =
    useState([]);

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData =
    async () => {
      try {
        setLoading(true);

        const [
          ordersRes,
          bookingsRes,
          productsRes,
        ] = await Promise.all([
          axios.get(
            "/api/orders/all"
          ),
          axios.get(
            "/api/services/all"
          ),
          axios.get(
            "/api/products"
          ),
        ]);

        setOrders(
          ordersRes.data || []
        );

        setBookings(
          bookingsRes.data || []
        );

        setProducts(
          productsRes.data || []
        );
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

      case "IN_PROGRESS":
        return "#2563eb";

      case "COMPLETED":
        return "#16a34a";

      default:
        return "#6b7280";
    }
  };

  const totalRevenue =
    orders.reduce(
      (sum, order) =>
        sum +
        (order.totalAmount ||
          0),
      0
    );

  const recentOrders =
    [...orders]
      .sort(
        (a, b) =>
          new Date(
            b.createdAt
          ) -
          new Date(
            a.createdAt
          )
      )
      .slice(0, 5);

  const recentBookings =
    [...bookings]
      .sort(
        (a, b) =>
          new Date(
            b.createdAt
          ) -
          new Date(
            a.createdAt
          )
      )
      .slice(0, 5);

  if (loading) {
    return (
      <div
        style={{
          textAlign:
            "center",
          padding: "50px",
        }}
      >
        <h2>
          Loading Dashboard...
        </h2>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "#f3f4f6",
      }}
    >
      {/* Header */}

      <div
        style={{
          background:
            "#111827",
          color: "white",
          padding:
            "20px 30px",
          display: "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
            }}
          >
            Admin Dashboard
          </h1>

          <p
            style={{
              margin:
                "5px 0 0 0",
            }}
          >
            Welcome,{" "}
            {
              user?.name
            }
          </p>
        </div>

        <Link
          to="/"
          style={{
            color:
              "white",
          }}
        >
          Back To Home
        </Link>
      </div>

      <div
        style={{
          padding: "30px",
        }}
      >
        {/* Stats Cards */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
            gap: "20px",
            marginBottom:
              "30px",
          }}
        >
          <div
            style={{
              background:
                "white",
              padding:
                "20px",
              borderRadius:
                "10px",
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h3>
              Total Orders
            </h3>
            <h2>
              {
                orders.length
              }
            </h2>
          </div>

          <div
            style={{
              background:
                "white",
              padding:
                "20px",
              borderRadius:
                "10px",
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h3>
              Total
              Bookings
            </h3>
            <h2>
              {
                bookings.length
              }
            </h2>
          </div>

          <div
            style={{
              background:
                "white",
              padding:
                "20px",
              borderRadius:
                "10px",
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h3>
              Total
              Products
            </h3>
            <h2>
              {
                products.length
              }
            </h2>
          </div>

          <div
            style={{
              background:
                "white",
              padding:
                "20px",
              borderRadius:
                "10px",
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h3>
              Total
              Revenue
            </h3>
            <h2>
              ₹
              {totalRevenue.toFixed(
                2
              )}
            </h2>
          </div>
        </div>

        {/* Quick Actions */}

        <div
          style={{
            display: "flex",
            gap: "15px",
            flexWrap:
              "wrap",
            marginBottom:
              "30px",
          }}
        >
          <button
            onClick={() =>
              navigate(
                "/admin/products"
              )
            }
          >
            Manage
            Products
          </button>

          <button
            onClick={() =>
              navigate(
                "/admin/orders"
              )
            }
          >
            Manage
            Orders
          </button>

          <button
            onClick={() =>
              navigate(
                "/admin/bookings"
              )
            }
          >
            Manage
            Bookings
          </button>
        </div>

        {/* Recent Orders */}

        <div
          style={{
            background:
              "white",
            padding:
              "20px",
            borderRadius:
              "10px",
            marginBottom:
              "30px",
            overflowX:
              "auto",
          }}
        >
          <h2>
            Recent Orders
          </h2>

          <table
            style={{
              width:
                "100%",
              borderCollapse:
                "collapse",
            }}
          >
            <thead>
              <tr>
                <th>
                  Order
                  ID
                </th>
                <th>
                  Amount
                </th>
                <th>
                  Status
                </th>
                <th>
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.map(
                (
                  order
                ) => (
                  <tr
                    key={
                      order.id
                    }
                  >
                    <td>
                      #
                      {
                        order.id
                      }
                    </td>

                    <td>
                      ₹
                      {
                        order.totalAmount
                      }
                    </td>

                    <td>
                      <span
                        style={{
                          background:
                            getStatusColor(
                              order.status
                            ),
                          color:
                            "white",
                          padding:
                            "4px 10px",
                          borderRadius:
                            "15px",
                        }}
                      >
                        {
                          order.status
                        }
                      </span>
                    </td>

                    <td>
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Recent Bookings */}

        <div
          style={{
            background:
              "white",
            padding:
              "20px",
            borderRadius:
              "10px",
            overflowX:
              "auto",
          }}
        >
          <h2>
            Recent
            Bookings
          </h2>

          <table
            style={{
              width:
                "100%",
              borderCollapse:
                "collapse",
            }}
          >
            <thead>
              <tr>
                <th>
                  Booking
                  ID
                </th>
                <th>
                  Service
                </th>
                <th>
                  Date
                </th>
                <th>
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {recentBookings.map(
                (
                  booking
                ) => (
                  <tr
                    key={
                      booking.id
                    }
                  >
                    <td>
                      #
                      {
                        booking.id
                      }
                    </td>

                    <td>
                      {
                        booking.serviceType
                      }
                    </td>

                    <td>
                      {
                        booking.appointmentDate
                      }
                    </td>

                    <td>
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
                        }}
                      >
                        {
                          booking.status
                        }
                      </span>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}