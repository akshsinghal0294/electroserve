import {
    createContext,
    useContext,
    useState,
    useEffect,
  } from "react";
  
  import api from "../services/api";
  
  const CartContext = createContext();
  
  export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [cartTotal, setCartTotal] = useState(0);
  
    const calculateTotals = (items) => {
      const count = items.reduce(
        (total, item) => total + item.quantity,
        0
      );
  
      const total = items.reduce(
        (sum, item) =>
          sum + item.product.price * item.quantity,
        0
      );
  
      setCartCount(count);
      setCartTotal(total);
    };
  
    const fetchCart = async (userId) => {
      try {
        const response = await api.get(
          `/api/cart/${userId}`
        );
  
        setCartItems(response.data);
        calculateTotals(response.data);
      } catch (error) {
        console.error(error);
      }
    };
  
    const addToCart = async (
      userId,
      productId,
      quantity
    ) => {
      try {
        await api.post("/api/cart/add", null, {
          params: {
            userId,
            productId,
            quantity,
          },
        });
  
        await fetchCart(userId);
      } catch (error) {
        console.error(error);
      }
    };
  
    const removeFromCart = async (
      cartId,
      userId
    ) => {
      try {
        await api.delete(`/api/cart/${cartId}`);
  
        await fetchCart(userId);
      } catch (error) {
        console.error(error);
      }
    };
  
    const updateQuantity = async (
      cartId,
      quantity,
      userId
    ) => {
      try {
        await api.put(
          `/api/cart/${cartId}`,
          null,
          {
            params: { quantity },
          }
        );
  
        await fetchCart(userId);
      } catch (error) {
        console.error(error);
      }
    };
  
    const clearCart = async (userId) => {
      try {
        await api.delete(
          `/api/cart/clear/${userId}`
        );
  
        await fetchCart(userId);
      } catch (error) {
        console.error(error);
      }
    };
  
    return (
      <CartContext.Provider
        value={{
          cartItems,
          cartCount,
          cartTotal,
          fetchCart,
          addToCart,
          removeFromCart,
          updateQuantity,
          clearCart,
        }}
      >
        {children}
      </CartContext.Provider>
    );
  };
  
  export const useCart = () =>
    useContext(CartContext);