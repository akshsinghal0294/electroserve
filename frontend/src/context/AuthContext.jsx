import {
    createContext,
    useContext,
    useEffect,
    useState,
  } from "react";
  
  import api from "../services/api";
  
  const AuthContext = createContext();
  
  export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");
  
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
  
      setLoading(false);
    }, []);
  
    const login = async (email, password) => {
      try {
        const response = await api.post("/api/auth/login", {
          email,
          password,
        });
  
        const data = response.data;
  
        localStorage.setItem("token", data.token);
  
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.id,
            email: data.email,
            name: data.name,
            role: data.role,
          })
        );
  
        setToken(data.token);
  
        setUser({
          id:data.id,
          email: data.email,
          name: data.name,
          role: data.role,
        });
  
        return data;
      } catch (error) {
        throw error;
      }
    };
  
    const register = async (
      name,
      email,
      password,
      phone
    ) => {
      try {
        await api.post("/api/auth/register", {
          name,
          email,
          password,
          phone,
        });
  
        await login(email, password);
      } catch (error) {
        throw error;
      }
    };
  
    const logout = () => {
      localStorage.clear();
  
      setUser(null);
      setToken(null);
  
      window.location.href = "/login";
    };
  
    const isAuthenticated = !!token;
  
    const isAdmin =
      user?.role?.toUpperCase() === "ADMIN";
  
    return (
      <AuthContext.Provider
        value={{
          user,
          token,
          loading,
          login,
          register,
          logout,
          isAuthenticated,
          isAdmin,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  };
  
  export const useAuth = () => {
    return useContext(AuthContext);
  };