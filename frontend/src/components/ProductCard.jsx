import { useNavigate } from "react-router-dom";

export default function ProductCard({
  product,
  onAddToCart,
}) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() =>
        navigate(`/products/${product.id}`)
      }
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "15px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        cursor: "pointer",
        background: "#fff",
      }}
    >
      <img
        src={product.imageUrl}
        alt={product.name}
        style={{
          width: "100%",
          height: "200px",
          objectFit: "cover",
          borderRadius: "8px",
        }}
      />

      <h3>{product.name}</h3>

      <p>{product.brand}</p>

      <h4>₹{product.price}</h4>

      <p
        style={{
          color:
            product.stockQuantity > 0
              ? "green"
              : "red",
        }}
      >
        {product.stockQuantity > 0
          ? "In Stock"
          : "Out Of Stock"}
      </p>

      <button
        disabled={product.stockQuantity <= 0}
        onClick={(e) => {
          e.stopPropagation();
          onAddToCart(product);
        }}
        style={{
          width: "100%",
          padding: "10px",
          border: "none",
          borderRadius: "5px",
          background:
            product.stockQuantity > 0
              ? "#2563eb"
              : "#9ca3af",
          color: "white",
          cursor: "pointer",
        }}
      >
        Add To Cart
      </button>
    </div>
  );
}