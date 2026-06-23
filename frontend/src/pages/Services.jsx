import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  Box,
} from "@mui/material";

export default function Services() {
  const navigate = useNavigate();

  const services = [
    {
      title: "Refrigerator Repair",
      description: "Expert fridge repair and maintenance service",
      price: 299,
      image: "/images/refri.jpg",
    },
    {
      title: "AC Service",
      description: "Complete AC servicing and repair",
      price: 399,
      image: "/images/ac.jpg",
    },
    {
      title: "TV Repair",
      description: "All brands TV repair service",
      price: 199,
      image: "/images/tv.jpg",
    },
    {
      title: "Washing Machine Repair",
      description: "Washing machine repair and maintenance",
      price: 299,
      image: "/images/wm.jpg",
    },
    {
      title: "Microwave Repair",
      description: "Microwave oven repair and service",
      price: 199,
      image: "/images/microwave.jpg",
    },
    {
      title: "Other Appliances",
      description: "Any other appliance repair service",
      price: 149,
      image: "/images/otherAppliances.jpg",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: "#f3f4f6",
          padding: "5px 20px",
          textAlign: "center",
        }}
      >
       

        <Typography
          variant="h4"
          align="center"
          color="text.primary"
        >
          Expert Repair Services
        </Typography>

        <Typography
        sx={{
          mt: 2,
        }}
          align="center"
          color="text.secondry"
        >
        Quick and reliable repair for all your appliances
        </Typography>

     
      </section>

      {/* Services Grid */}
      <section style={{ padding: "40px 20px" }}>
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
            <Card
              key={service.title}
              onClick={() =>
                navigate(
                  `/book-service?service=${encodeURIComponent(service.title)}`
                )
              }
              sx={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardMedia
                component="img"
                height="180"
                image={service.image}
                alt={service.title}
                sx={{ objectFit: "cover" }}
              />

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {service.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {service.description}
                </Typography>
              </CardContent>

              <CardActions sx={{ px: 2, pb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    ₹{service.price}
                  </Typography>
                  <Button variant="contained" size="small">
                    Book Now
                  </Button>
                </Box>
              </CardActions>
            </Card>
          ))}
        </Box>
      </section>
    </div>
  );
}