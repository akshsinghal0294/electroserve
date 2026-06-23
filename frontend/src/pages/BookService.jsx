import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Alert,
  Paper,
  CircularProgress,
} from "@mui/material";
import BuildIcon from "@mui/icons-material/Build";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

export default function BookService() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported");
      return;
    }
  
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
  
        const mapLink =
          `https://maps.google.com/?q=${latitude},${longitude}`;
  
        setAddress(mapLink);
      },
      (error) => {
        console.error(error);
        alert("Unable to get location");
      }
    );
  };

  const params = new URLSearchParams(location.search);

  const [serviceType, setServiceType] = useState(
    params.get("service") || "Refrigerator"
  );
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [applianceType, setApplianceType] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [appointmentDate, setAppointmentDate] = useState(dayjs().add(1, "day"));
  const [timeSlot, setTimeSlot] = useState("");
  const [address, setAddress] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (appointmentDate) fetchSlots();
  }, [appointmentDate]);

  const fetchSlots = async () => {
    try {
      const response = await api.get(
        `/api/services/slots?date=${appointmentDate.format("YYYY-MM-DD")}`
      );
      setAvailableSlots(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
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

     

      await api.post("/api/services/book", booking, {
        params: { userId: user.id },
      });

      setSuccess(true);
      setTimeout(() => navigate("/profile"), 2000);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];
 
  return (
    <Box sx={{ margin: "0 auto", width: 600 }}>


      <Typography variant="h5" fontWeight="bold">
        Book a Service
      </Typography>


      {/* Success Alert */}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Service booked successfully! Redirecting to your profile...
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >

          {/* Service Type */}
          <FormControl fullWidth required>
            <InputLabel>Service Type</InputLabel>
            <Select
              value={serviceType}
              label="Service Type"
              onChange={(e) => setServiceType(e.target.value)}
            >
              {[
                "Refrigerator Repair",
                "AC Service",
                "TV Repair",
                "Washing Machine Repair",
                "Microwave Repair",
                "Other Appliances",
              ].map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Appliance Type */}
          <TextField
            label="Appliance Brand / Model"
            placeholder="e.g. Samsung Double Door, LG 1.5 Ton"
            value={applianceType}
            onChange={(e) => setApplianceType(e.target.value)}
            required
            fullWidth
          />

          {/* Problem Description */}
          <TextField
            label="Problem Description"
            placeholder="Describe the issue with your appliance..."
            value={problemDescription}
            onChange={(e) => setProblemDescription(e.target.value)}
            required
            fullWidth
            multiline
            rows={4}
          />

          {/* Appointment Date */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Appointment Date"
              value={appointmentDate}
              onChange={(e) =>
                setAppointmentDate(e.target.value)
              }
              disablePast
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                },
              }}
            />
          </LocalizationProvider>

          {/* Time Slot */}
          <FormControl fullWidth required>
            <InputLabel>Time Slot</InputLabel>
            <Select
              value={timeSlot}
              label="Time Slot"
              onChange={(e) => setTimeSlot(e.target.value)}
            //  disabled={!appointmentDate || availableSlots.length === 0}
            >
              <MenuItem value="">
                <em>
                  {!appointmentDate
                    ? "Select a date first"
                    : availableSlots.length === 0
                      ? "No slots available"
                      : "Select Slot"}
                </em>
              </MenuItem>
              {availableSlots.map((slot) => (
                <MenuItem key={slot} value={slot}>
                  {slot}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          { /*current location*/}

          <Button
            variant="outlined"
            onClick={getCurrentLocation}
          >
            Use Current Location
          </Button>



          {/* Address */}


          <TextField
            label="Service Address"
            placeholder="Enter your full address..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            fullWidth
            multiline
            rows={3}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            fullWidth
            sx={{ py: 1.5, fontSize: "1rem", borderRadius: 2 }}
          >
            {loading ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={20} color="inherit" />
                Booking...
              </Box>
            ) : (
              "Book Service"
            )}
          </Button>

        </Box>
      </Paper>
    </Box>
  );
}