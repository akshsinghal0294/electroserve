export default function StarRating({
    rating = 0,
    onRate,
  }) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
        }}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() =>
              onRate && onRate(star)
            }
            style={{
              cursor: onRate
                ? "pointer"
                : "default",
              color:
                star <= rating
                  ? "gold"
                  : "#ccc",
              fontSize: "24px",
            }}
          >
            ★
          </span>
        ))}
  
        <span>({rating})</span>
      </div>
    );
  }