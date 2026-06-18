import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#111827",
        color: "white",
        padding: "30px 20px",
        marginTop: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "30px",
        }}
      >
        <div>
          <h3>ElectroServe</h3>
          <p>
            Your trusted destination for electronics
            and repair services.
          </p>
        </div>

        <div>
          <h4>Quick Links</h4>

          <p>
            <Link
              to="/"
              style={{
                color: "white",
                textDecoration: "none",
              }}
            >
              Home
            </Link>
          </p>

          <p>
            <Link
              to="/products"
              style={{
                color: "white",
                textDecoration: "none",
              }}
            >
              Products
            </Link>
          </p>

          <p>
            <Link
              to="/services"
              style={{
                color: "white",
                textDecoration: "none",
              }}
            >
              Services
            </Link>
          </p>
        </div>

        <div>
          <h4>Contact Us</h4>

          <p>
            Email:
            <br />
            support@electroserve.com
          </p>

          <p>
            Phone:
            <br />
            +91 98765 43210
          </p>
        </div>
      </div>

      <hr
        style={{
          margin: "20px 0",
          borderColor: "#374151",
        }}
      />

      <div
        style={{
          textAlign: "center",
        }}
      >
        © 2024 ElectroServe. All Rights Reserved.
      </div>
    </footer>
  );
}