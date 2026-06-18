import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function ManageBookings() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const [bookings, setBookings] =
    useState([]);

  const [filteredBookings,
    setFilteredBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedFilter,
    setSelectedFilter] =
    useState("ALL");

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    filterBookings(
      selectedFilter
    );
  }, [bookings, selectedFilter]);

  const loadBookings =
    async () => {
      try {
        setLoading(true);

        const response =
          await axios.get(
            "/api/services/all"
          );

        setBookings(
          response.data || []
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  const filterBookings =
    (status) => {
      if (status === "ALL") {
        setFilteredBookings(
          bookings
        );
        return;
      }

      setFilteredBookings(
        bookings.filter(
          (booking) =>
            booking.status ===
            status
        )
      );
    };

  const updateStatus =
    async (
      bookingId,
      status
    ) => {
      try {
        await axios.put(
          `/api/services/${bookingId}/status`,
          null,
          {
            params: {
              status,
            },
          }
        );

        await loadBookings();

        alert(
          "Booking status updated successfully"
        );
      } catch (error) {
        console.error(error);
        alert(
          "Failed to update booking status"
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

      case "IN_PROGRESS":
        return "#f97316";

      case "COMPLETED":
        return "#16a34a";

      case "CANCELLED":
        return "#dc2626";

      default:
        return "#6b7280";
    }
  };

  const completedRevenue =
    bookings
      .filter(
        (booking) =>
          booking.status ===
          "COMPLETED"
      )
      .reduce(
        (sum, booking) =>
          sum +
          (booking.amount ||
            0),
        0
      );

  const filters = [
    "ALL",
    "PENDING",
    "CONFIRMED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
  ];

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
          Loading Bookings...
        </h2>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "1600px",
        margin: "0 auto",
        padding: "30px",
      }}
    >
      {/* Header */}

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
          Manage Bookings
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

      {/* Summary Cards */}

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap:
            "wrap",
          marginBottom:
            "25px",
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
            Revenue From
            Completed
            Bookings
          </h3>
          <h2>
            ₹
            {completedRevenue.toFixed(
              2
            )}
          </h2>
        </div>
      </div>

      {/* Filters */}

      <div
        style={{
          marginBottom:
            "20px",
          display: "flex",
          gap: "10px",
          flexWrap:
            "wrap",
        }}
      >
        {filters.map(
          (filter) => (
            <button
              key={filter}
              onClick={() =>
                setSelectedFilter(
                  filter
                )
              }
              style={{
                background:
                  selectedFilter ===
                  filter
                    ? "#2563eb"
                    : "#e5e7eb",
                color:
                  selectedFilter ===
                  filter
                    ? "white"
                    : "black",
                border:
                  "none",
                padding:
                  "10px 15px",
                borderRadius:
                  "6px",
                cursor:
                  "pointer",
              }}
            >
              {filter}
            </button>
          )
        )}
      </div>

      {/* Table */}

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
              <th>
                Booking
                ID
              </th>
              <th>
                Service
                Type
              </th>
              <th>
                Appliance
                Type
              </th>
              <th>
                Problem
                Description
              </th>
              <th>
                Appointment
                Date
              </th>
              <th>
                Time
                Slot
              </th>
              <th>
                Address
              </th>
              <th>
                Amount
              </th>
              <th>
                Status
              </th>
              <th>
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredBookings.map(
              (
                booking
              ) => (
                <tr
                  key={
                    booking.id
                  }
                  style={{
                    borderBottom:
                      "1px solid #eee",
                  }}
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
                      booking.applianceType
                    }
                  </td>

                  <td>
                    <div
                      style={{
                        maxWidth:
                          "250px",
                      }}
                    >
                      {
                        booking.problemDescription
                      }
                    </div>
                  </td>

                  <td>
                    {
                      booking.appointmentDate
                    }
                  </td>

                  <td>
                    {
                      booking.timeSlot
                    }
                  </td>

                  <td>
                    <div
                      style={{
                        maxWidth:
                          "250px",
                      }}
                    >
                      {
                        booking.address
                      }
                    </div>
                  </td>

                  <td>
                    ₹
                    {
                      booking.amount
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
                          "5px 10px",
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
                  </td>

                  <td>
                    <select
                      defaultValue={
                        booking.status
                      }
                      onChange={(
                        e
                      ) =>
                        updateStatus(
                          booking.id,
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
                        IN_PROGRESS
                      </option>

                      <option>
                        COMPLETED
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
    </div>
  );
}