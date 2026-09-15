import { Typography, Box } from "@mui/material";
import ServiceCard from "../components/ServiceCard";
import { services } from "../data/services";

export default function Services() {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        component="section"
        sx={{
          background: "grey.100",
          py: { xs: 4, sm: 6 },
          px: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="h4" fontWeight={700} color="text.primary">
          Expert Repair Services
        </Typography>

        <Typography sx={{ mt: 2 }} color="text.secondary">
          Quick and reliable repair for all your appliances
        </Typography>
      </Box>

      {/* Services Grid */}
      <Box component="section" sx={{ px: { xs: 2, sm: 4 }, py: 5 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {services.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
