import { Box, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

export default function StarRating({ rating = 0, onRate }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      {[1, 2, 3, 4, 5].map((star) =>
        star <= rating ? (
          <StarIcon
            key={star}
            onClick={() => onRate && onRate(star)}
            sx={{
              cursor: onRate ? "pointer" : "default",
              color: "warning.main",
              fontSize: 22,
            }}
          />
        ) : (
          <StarBorderIcon
            key={star}
            onClick={() => onRate && onRate(star)}
            sx={{
              cursor: onRate ? "pointer" : "default",
              color: "grey.400",
              fontSize: 22,
            }}
          />
        )
      )}

      <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
        ({rating})
      </Typography>
    </Box>
  );
}
