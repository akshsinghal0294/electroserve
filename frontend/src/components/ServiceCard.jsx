import { useNavigate } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
} from "@mui/material";

export default function ServiceCard({ service }) {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() =>
        navigate(`/book-service?service=${encodeURIComponent(service.title)}`)
      }
      sx={{
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
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
  );
}
