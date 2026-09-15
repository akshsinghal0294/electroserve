import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Badge,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Typography,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const navLinks = [
  { label: "Products", to: "/products" },
  { label: "Services", to: "/services" },
];

const navLinkSx = {
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    left: "50%",
    bottom: 4,
    width: 0,
    height: 2,
    bgcolor: "warning.main",
    transition: "all 0.2s ease",
    transform: "translateX(-50%)",
  },
  "&:hover::after": {
    width: "60%",
  },
};

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:900px)");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDrawerOpen(false);
    navigate("/login");
  };

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "linear-gradient(90deg, #0f172a 0%, #111827 60%, #1e293b 100%)",
          borderBottom: "3px solid",
          borderColor: "primary.main",
        }}
      >
        <Toolbar sx={{ gap: { xs: 0.5, sm: 2 }, py: 1, px: { xs: 1.5, sm: 3 } }}>
          <Typography
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: "inherit",
              textDecoration: "none",
              fontWeight: 800,
              letterSpacing: 0.3,
              fontSize: { xs: "1.05rem", sm: "1.4rem" },
              flexGrow: 1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <ElectricBoltIcon sx={{ color: "warning.main", filter: "drop-shadow(0 0 4px rgba(245,158,11,0.6))" }} />
            DK Refrigerator
          </Typography>

          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {navLinks.map((link) => (
                <Button
                  key={link.to}
                  component={Link}
                  to={link.to}
                  color="inherit"
                  sx={navLinkSx}
                >
                  {link.label}
                </Button>
              ))}

              {!isAuthenticated ? (
                <>
                  <Button component={Link} to="/login" color="inherit" sx={navLinkSx}>
                    Login
                  </Button>
                  <Button
                    component={Link}
                    to="/register"
                    variant="contained"
                    color="primary"
                    sx={{ boxShadow: "0 2px 10px rgba(37,99,235,0.5)" }}
                  >
                    Register
                  </Button>
                </>
              ) : (
                <>
                  <IconButton
                    component={Link}
                    to="/cart"
                    color="inherit"
                    aria-label="cart"
                  >
                    <Badge badgeContent={cartCount} color="error">
                      <ShoppingCartIcon />
                    </Badge>
                  </IconButton>

                  <Button component={Link} to="/profile" color="inherit" sx={navLinkSx}>
                    Profile
                  </Button>

                  {isAdmin && (
                    <Button
                      component={Link}
                      to="/admin/dashboard"
                      color="inherit"
                      sx={navLinkSx}
                    >
                      Admin
                    </Button>
                  )}

                  <Typography variant="body2" sx={{ mx: 1 }}>
                    Hi, {user?.name}
                  </Typography>

                  <Button
                    onClick={handleLogout}
                    variant="contained"
                    color="error"
                  >
                    Logout
                  </Button>
                </>
              )}
            </Box>
          )}

          {isMobile && (
            <>
              <IconButton
                component={Link}
                to="/cart"
                color="inherit"
                aria-label="cart"
                sx={{ display: isAuthenticated ? "inline-flex" : "none" }}
              >
                <Badge badgeContent={cartCount} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>

              <IconButton
                color="inherit"
                aria-label="open menu"
                onClick={() => setDrawerOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={closeDrawer}
        slotProps={{
          paper: {
            sx: {
              bgcolor: "#111827",
              color: "white",
            },
          },
        }}
      >
        <Box
          sx={{
            width: 260,
            "& .MuiListItemText-primary": { color: "white" },
            "& .MuiListItemButton-root:hover": {
              bgcolor: "rgba(255,255,255,0.08)",
            },
          }}
          role="presentation"
        >
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              fontWeight: 800,
              px: 2,
              py: 2,
            }}
          >
            <ElectricBoltIcon sx={{ color: "warning.main" }} />
            DK Refrigerator
          </Typography>
          <Divider sx={{ borderColor: "grey.800" }} />
          <List>
            {navLinks.map((link) => (
              <ListItemButton
                key={link.to}
                component={Link}
                to={link.to}
                onClick={closeDrawer}
              >
                <ListItemText primary={link.label} />
              </ListItemButton>
            ))}
          </List>

          <Divider sx={{ borderColor: "grey.800" }} />

          <List>
            {!isAuthenticated ? (
              <>
                <ListItemButton component={Link} to="/login" onClick={closeDrawer}>
                  <ListItemText primary="Login" />
                </ListItemButton>
                <ListItemButton component={Link} to="/register" onClick={closeDrawer}>
                  <ListItemText primary="Register" />
                </ListItemButton>
              </>
            ) : (
              <>
                <ListItemButton component={Link} to="/profile" onClick={closeDrawer}>
                  <ListItemText primary="Profile" />
                </ListItemButton>
                {isAdmin && (
                  <ListItemButton
                    component={Link}
                    to="/admin/dashboard"
                    onClick={closeDrawer}
                  >
                    <ListItemText primary="Admin Dashboard" />
                  </ListItemButton>
                )}
                <ListItemButton onClick={handleLogout}>
                  <ListItemText primary={`Logout (${user?.name || ""})`} />
                </ListItemButton>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
