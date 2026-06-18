import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function ManageOrders() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);

      const response =
        await axios.get(
          "/api/orders/all"
        );

      setOrders(
        response.data || []
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus =
    async (id, status) => {
      try {
        await axios.put(
          `/api/orders/${id}/status`,
          null,
          {
            params: {
              status,
            },
          }
        );

        await loadOrders();

        alert(
          "Order status updated successfully"
        );
      } catch (error) {
        console.error(error);
        alert(
          "Failed to update order status"
        );
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
      <div
        style={{
          textAlign:
            "center",
          padding: "50px",
        }}
      >
        <h2>
          Loading Orders...
        </h2>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "30px",
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
          Manage Orders
        </h1>

        <button
          onClick={() =>
            navigate(
              "/admin/dashboard"
            )
          }
        >
          Back To Dashboard
        </button>
      </div>

      <div
        style={{
          background:
            "white",
          borderRadius:
            "10px",
          padding:
            "20px",
          overflowX:
            "auto",
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
              <th>Order ID</th>
              <th>Customer</th>
              <th>
                Total Amount
              </th>
              <th>
                Payment
                Status
              </th>
              <th>
                Order
                Status
              </th>
              <th>Date</th>
              <th>
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.map(
              (order) => (
                <tr
                  key={
                    order.id
                  }
                  style={{
                    borderBottom:
                      "1px solid #eee",
                  }}
                >
                  <td>
                    <button
                      onClick={() =>
                        setSelectedOrder(
                          order
                        )
                      }
                      style={{
                        border:
                          "none",
                        background:
                          "transparent",
                        color:
                          "#2563eb",
                        cursor:
                          "pointer",
                      }}
                    >
                      #
                      {
                        order.id
                      }
                    </button>
                  </td>

                  <td>
                    {order
                      .user
                      ?.name ||
                      "N/A"}
                  </td>

                  <td>
                    ₹
                    {
                      order.totalAmount
                    }
                  </td>

                  <td>
                    {
                      order.paymentStatus
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
                          "5px 10px",
                        borderRadius:
                          "15px",
                        fontSize:
                          "12px",
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

                  <td>
                    <select
                      defaultValue={
                        order.status
                      }
                      onChange={(
                        e
                      ) =>
                        updateOrderStatus(
                          order.id,
                          e.target
                            .value
                        )
                      }
                    >
                      <option>
                        PENDING
                      </option>

                      <option>
                        CONFIRMED
                      </option>

                      <option>
                        SHIPPED
                      </option>

                      <option>
                        DELIVERED
                      </option>

                      <option>
                        CANCELLED
                      </option>
                    </select>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div
          style={{
            position:
              "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "rgba(0,0,0,0.5)",
            display:
              "flex",
            justifyContent:
              "center",
            alignItems:
              "center",
          }}
        >
          <div
            style={{
              background:
                "white",
              width: "700px",
              maxWidth:
                "90%",
              borderRadius:
                "10px",
              padding:
                "25px",
              maxHeight:
                "80vh",
              overflowY:
                "auto",
            }}
          >
            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "space-between",
              }}
            >
              <h2>
                Order #
                {
                  selectedOrder.id
                }
              </h2>

              <button
                onClick={() =>
                  setSelectedOrder(
                    null
                  )
                }
              >
                X
              </button>
            </div>

            <hr />

            <h3>
              Customer
              Details
            </h3>

            <p>
              <strong>
                Name:
              </strong>{" "}
              {selectedOrder
                .user
                ?.name ||
                "N/A"}
            </p>

            <p>
              <strong>
                Email:
              </strong>{" "}
              {selectedOrder
                .user
                ?.email ||
                "N/A"}
            </p>

            <p>
              <strong>
                Phone:
              </strong>{" "}
              {selectedOrder
                .user
                ?.phone ||
                "N/A"}
            </p>

            <hr />

            <h3>
              Delivery
              Address
            </h3>

            <p>
              {
                selectedOrder.address
              }
            </p>

            <hr />

            <h3>
              Order Items
            </h3>

            {selectedOrder.items &&
            selectedOrder.items
              .length >
              0 ? (
              selectedOrder.items.map(
                (
                  item
                ) => (
                  <div
                    key={
                      item.id
                    }
                    style={{
                      padding:
                        "10px 0",
                      borderBottom:
                        "1px solid #eee",
                    }}
                  >
                    <p>
                      <strong>
                        {
                          item
                            .product
                            ?.name
                        }
                      </strong>
                    </p>

                    <p>
                      Qty:{" "}
                      {
                        item.quantity
                      }
                    </p>

                    <p>
                      Price:
                      ₹
                      {
                        item.price
                      }
                    </p>
                  </div>
                )
              )
            ) : (
              <p>
                No item
                details
                available
              </p>
            )}

            <hr />

            <h3>
              Total
              Amount:
              ₹
              {
                selectedOrder.totalAmount
              }
            </h3>
          </div>
        </div>
      )}
    </div>
  );
}