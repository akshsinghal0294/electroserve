import {
    useEffect,
    useState,
  } from "react";
  
  import {
    useNavigate,
    useLocation,
  } from "react-router-dom";
  
  import api from "../services/api";
  
  import { useAuth } from "../context/AuthContext";
  
  export default function BookService() {
    const navigate = useNavigate();
  
    const location = useLocation();
  
    const { user } = useAuth();
  
    const params =
      new URLSearchParams(
        location.search
      );
  
    const [serviceType,
      setServiceType] =
      useState(
        params.get("service") ||
          "Refrigerator"
      );
  
    const [applianceType,
      setApplianceType] =
      useState("");
  
    const [
      problemDescription,
      setProblemDescription,
    ] = useState("");
  
    const [
      appointmentDate,
      setAppointmentDate,
    ] = useState("");
  
    const [timeSlot,
      setTimeSlot] =
      useState("");
  
    const [address,
      setAddress] =
      useState("");
  
    const [
      availableSlots,
      setAvailableSlots,
    ] = useState([]);
  
    const [loading,
      setLoading] =
      useState(false);
  
    const [success,
      setSuccess] =
      useState(false);
  
    useEffect(() => {
      if (appointmentDate) {
        fetchSlots();
      }
    }, [appointmentDate]);
  
    const fetchSlots =
      async () => {
        try {
          const response =
            await api.get(
              `/api/services/slots?date=${appointmentDate}`
            );
  
          setAvailableSlots(
            response.data
          );
        } catch (error) {
          console.error(error);
        }
      };
  
    const handleSubmit =
      async (e) => {
        e.preventDefault();
  
        try {
          setLoading(true);
  
          const booking = {
            serviceType,
            applianceType,
            problemDescription,
            appointmentDate,
            timeSlot,
            address,
          };

console.log("User Object:", user);
console.log("User ID:", user?.id);
console.log("Token:", localStorage.getItem("token"));
  
          await api.post(
            "/api/services/book",
            booking,
            {
              params: {
                userId:
                  user.id,
              },
            }
          );
  
          setSuccess(true);
  
          setTimeout(() => {
            navigate(
              "/profile"
            );
          }, 2000);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
  
    const today =
      new Date()
        .toISOString()
        .split("T")[0];
  
    return (
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "30px",
        }}
      >
        <h1>Book a Service</h1>
  
        {success && (
          <div
            style={{
              background:
                "#dcfce7",
              color:
                "#166534",
              padding:
                "15px",
              marginBottom:
                "20px",
              borderRadius:
                "8px",
            }}
          >
            Service booked
            successfully!
          </div>
        )}
  
        <form
          onSubmit={
            handleSubmit
          }
        >
          <div
            style={{
              marginBottom:
                "15px",
            }}
          >
            <label>
              Service Type
            </label>
  
            <select
              value={
                serviceType
              }
              onChange={(
                e
              ) =>
                setServiceType(
                  e.target
                    .value
                )
              }
              style={{
                width:
                  "100%",
                padding:
                  "10px",
              }}
            >
              <option>
                Refrigerator
              </option>
  
              <option>
                AC
              </option>
  
              <option>
                TV
              </option>
  
              <option>
                Washing Machine
              </option>
  
              <option>
                Microwave
              </option>
  
              <option>
                Other
              </option>
            </select>
          </div>
  
          <div
            style={{
              marginBottom:
                "15px",
            }}
          >
            <label>
              Appliance Type
            </label>
  
            <input
              type="text"
              value={
                applianceType
              }
              onChange={(
                e
              ) =>
                setApplianceType(
                  e.target
                    .value
                )
              }
              required
              style={{
                width:
                  "100%",
                padding:
                  "10px",
              }}
            />
          </div>
  
          <div
            style={{
              marginBottom:
                "15px",
            }}
          >
            <label>
              Problem
              Description
            </label>
  
            <textarea
              rows="4"
              value={
                problemDescription
              }
              onChange={(
                e
              ) =>
                setProblemDescription(
                  e.target
                    .value
                )
              }
              required
              style={{
                width:
                  "100%",
                padding:
                  "10px",
              }}
            />
          </div>
  
          <div
            style={{
              marginBottom:
                "15px",
            }}
          >
            <label>
              Appointment
              Date
            </label>
  
            <input
              type="date"
              min={today}
              value={
                appointmentDate
              }
              onChange={(
                e
              ) =>
                setAppointmentDate(
                  e.target
                    .value
                )
              }
              required
              style={{
                width:
                  "100%",
                padding:
                  "10px",
              }}
            />
          </div>
  
          <div
            style={{
              marginBottom:
                "15px",
            }}
          >
            <label>
              Time Slot
            </label>
  
            <select
              value={
                timeSlot
              }
              onChange={(
                e
              ) =>
                setTimeSlot(
                  e.target
                    .value
                )
              }
              required
              style={{
                width:
                  "100%",
                padding:
                  "10px",
              }}
            >
              <option value="">
                Select Slot
              </option>
  
              {availableSlots.map(
                (
                  slot
                ) => (
                  <option
                    key={
                      slot
                    }
                    value={
                      slot
                    }
                  >
                    {slot}
                  </option>
                )
              )}
            </select>
          </div>
  
          <div
            style={{
              marginBottom:
                "15px",
            }}
          >
            <label>
              Address
            </label>
  
            <textarea
              rows="4"
              value={address}
              onChange={(
                e
              ) =>
                setAddress(
                  e.target
                    .value
                )
              }
              required
              style={{
                width:
                  "100%",
                padding:
                  "10px",
              }}
            />
          </div>
  
          <button
            type="submit"
            disabled={loading}
            style={{
              width:
                "100%",
              padding:
                "12px",
            }}
          >
            {loading
              ? "Booking..."
              : "Book Service"}
          </button>
        </form>
      </div>
    );
  }