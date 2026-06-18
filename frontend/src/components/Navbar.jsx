import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } =
    useAuth();

  const { cartCount } = useCart();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 30px",
        backgroundColor: "#1f2937",
        color: "white",
        flexWrap: "wrap",
      }}
    >
      <Link
        to="/"
        style={{
          color: "white",
          textDecoration: "none",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        ElectroServe
      </Link>

      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Link
          to="/products"
          style={{
            color: "white",
            textDecoration: "none",
          }}
        >
          Products
        </Link>

        <Link
          to="/services"
          style={{
            color: "white",
            textDecoration: "none",
          }}
        >
          Services
        </Link>

        {!isAuthenticated ? (
          <>
            <Link
              to="/login"
              style={{
                color: "white",
                textDecoration: "none",
              }}
            >
              Login
            </Link>

            <Link
              to="/register"
              style={{
                color: "white",
                textDecoration: "none",
              }}
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/cart"
              style={{
                color: "white",
                textDecoration: "none",
                position: "relative",
              }}
            >
              🛒 Cart

              {cartCount > 0 && (
                <span
                  style={{
                    background: "red",
                    color: "white",
                    borderRadius: "50%",
                    padding: "2px 8px",
                    fontSize: "12px",
                    marginLeft: "5px",
                  }}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              to="/profile"
              style={{
                color: "white",
                textDecoration: "none",
              }}
            >
              Profile
            </Link>

            {isAdmin && (
              <Link
                to="/admin/dashboard"
                style={{
                  color: "white",
                  textDecoration: "none",
                }}
              >
                Admin Dashboard
              </Link>
            )}

            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                padding: "8px 14px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>

            <span
              style={{
                fontSize: "14px",
              }}
            >
              Hi, {user?.name}
            </span>
          </>
        )}
      </div>
    </nav>
  );
}