import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Box,
  TextField,
  Button,
  Typography,
} from "@mui/material";

import Link from "@mui/material/Link";

export default function Register() {
  const { register } = useAuth();

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] =
    useState("");
  const [password, setPassword] =
    useState("");
  const [phone, setPhone] =
    useState("");

  const [error, setError] =
    useState("");
  const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await register(
        name,
        email,
        password,
        phone
      );

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (


    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: 450,
          p: 4,
          border: "1px solid #ddd",
          borderRadius: 2,
          BoxShadow: 3,
          bgcolor: "#fff",
        }}
       
      >

      <Typography
        variant="h3"
        align="center"
        color="text.primary"
      >
        Dk Refrigerator !!
      </Typography>

      <Typography
        variant="h5"
        align="center"
        color="text.secondary"
      >
        Register
      </Typography>

      {error && (
        <p
          style={{
            color: "red",
            textAlign: "center",
          }}
        >
          {error}
        </p>
      )}

      <TextField
        fullWidth
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Email"
        type="email"
        autoComplete="off"
        value={email}

        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Password"
        type="password"
        required
        autoComplete="off"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
      />

      <TextField
        fullWidth
        label="Phone"
        type="tel"
        value={phone}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, "");

          if (value.length <= 10) {
            setPhone(value);
          }
          if (value.length > 0 && value.length < 10) {
            setPhoneError("Phone number must be 10 digits");
          } else {
            setPhoneError("");
          }
        }}
        error={!!phoneError}
        helperText={phoneError}
        inputProps={{
          maxLength: 10,
          inputMode: "numeric",
        }}
        margin="normal"
      />

      <Button
        type="submit"
        variant="contained"
        color="success"
        fullWidth
        disabled={loading}
        sx={{
          mt: 2,
          py: 1.5,
          textTransform: "none",
        }}
      >
        {loading
          ? "Creating Account..."
          : "Register"}
      </Button>

      <Typography
        align="center"
        sx={{
          mt: 2,
        }}
      >
        Already have an account?{" "}
        <Link
          component={RouterLink}
          to="/login"
          underline="hover"
        >
          Login
        </Link>
      </Typography>
    </Box>
    </Box >
  );
}