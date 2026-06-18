import { useNavigate } from "react-router-dom";

export default function ServiceCard({
  service,
}) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "20px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          fontSize: "50px",
          textAlign: "center",
        }}
      >
        {service.icon}
      </div>

      <h3>{service.title}</h3>

      <p>{service.description}</p>

      <h4>Starting ₹{service.price}</h4>

      <button
        onClick={() =>
          navigate("/book-service")
        }
        style={{
          width: "100%",
          padding: "10px",
          border: "none",
          borderRadius: "5px",
          background: "#2563eb",
          color: "white",
        }}
      >
        Book Now
      </button>
    </div>
  );
}