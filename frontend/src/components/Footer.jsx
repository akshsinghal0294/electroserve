import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  Link,
  Divider,
  Stack,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#111827",
        color: "white",
       // pt: 4,
        pb: 2,
        mt: 4,
      }}
    >
      <Box
        sx={{
          maxWidth: "1200px",
          margin: "0 auto",
          px: 3,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 4,
        }}
      >
        {/* Company Info */}
        <Box>
          <Typography variant="h5" fontWeight="bold" color="white" gutterBottom>
            🔧 DK Refrigerator
          </Typography>
          <Typography variant="body2" sx={{ color: "#9ca3af", lineHeight: 1.8 }}>
            Repair services and genuine spare parts
            for refrigerators, ACs, TVs, washing
            machines, microwaves and more.
          </Typography>
        </Box>

        {/* Quick Links */}
        <Box>
          <Typography variant="h6" fontWeight="bold" color="white" gutterBottom>
            Quick Links
          </Typography>
          <Stack spacing={1}>
            {[
              { label: "Home", to: "/" },
              { label: "Products", to: "/products" },
              { label: "Services", to: "/services" },
     
            ].map((item) => (
              <Link
                key={item.label}
                component={RouterLink}
                to={item.to}
                underline="hover"
                sx={{
                  color: "#9ca3af",
                  fontSize: "0.9rem",
                  "&:hover": { color: "white" },
                  transition: "color 0.2s",
                }}
              >
                › {item.label}
              </Link>
            ))}
          </Stack>
        </Box>

        {/* Contact Info */}
        <Box>
          <Typography variant="h6" fontWeight="bold" color="white" gutterBottom>
            Contact Us
          </Typography>
          <Stack spacing={2}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PhoneIcon sx={{ color: "#3b82f6", fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: "#9ca3af" }}>
                +91 98765 43210
              </Typography>
            </Box>

           

            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              <LocationOnIcon sx={{ color: "#3b82f6", fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: "#9ca3af" }}>
                123, Repair Street, 
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AccessTimeIcon sx={{ color: "#3b82f6", fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: "#9ca3af" }}>
                Mon - Sat: 9:00 AM - 6:00 PM
              </Typography>
            </Box>

          </Stack>
        </Box>
      </Box>

      {/* Divider */}
      <Divider sx={{ borderColor: "#374151", my: 4, mx: 3 }} />

      {/* Bottom Bar */}
      <Box
        sx={{
          textAlign: "center",
          px: 3,
        }}
      >
        <Typography variant="body2" sx={{ color: "#6b7280" }}>
          © {new Date().getFullYear()} DK Refrigerator. All Rights Reserved.
        </Typography>
      </Box>
    </Box>
  );
}