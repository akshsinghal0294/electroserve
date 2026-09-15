import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2563eb",
      dark: "#1d4ed8",
      light: "#eff6ff",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#64748b",
    },
    success: { main: "#22c55e" },
    error: { main: "#ef4444" },
    warning: { main: "#f59e0b" },
    grey: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      600: "#4b5563",
      800: "#1f2937",
      900: "#111827",
    },
    header: {
      main: "#111827",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f9fafb",
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"Inter","Segoe UI",sans-serif',
  },
  shadows: [
    "none",
    "0 1px 2px rgba(0,0,0,0.05)",
    "0 4px 6px -1px rgba(0,0,0,0.1)",
    "0 10px 15px -3px rgba(0,0,0,0.1)",
    ...Array(21).fill("0 10px 15px -3px rgba(0,0,0,0.1)"),
  ],
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#111827",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;
