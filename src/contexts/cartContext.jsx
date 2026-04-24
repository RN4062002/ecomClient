// import React, { createContext, useContext, useState } from 'react';

// const CartContext = createContext();

// export const useCart = () => useContext(CartContext);

// export const CartContextProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState([]);

//   const addToCart = (product) => {
//     setCartItems((prevItems) => {
//       const existingItem = prevItems.find((item) => item.id === product.id);
//       if (existingItem) {
//         return prevItems.map((item) =>
//           item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
//         );
//       } else {
//         return [...prevItems, { ...product, quantity: 1 }];
//       }
//     });
//   };

//   const removeFromCart = (productId) => {
//     setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
//   };

//   const decreaseCartItem = (productId) => {
//     setCartItems((prevItems) => {
//       const existingItem = prevItems.find((item) => item.id === productId);
//       if (existingItem.quantity === 1) {
//         return prevItems.filter((item) => item.id !== productId);
//       } else {
//         return prevItems.map((item) =>
//           item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
//         );
//       }
//     });
//   };

//   const clearCart = () => {
//     setCartItems([]);
//   };

//   const value = {
//     cartItems,
//     addToCart,
//     removeFromCart,
//     decreaseCartItem,
//     clearCart,
//   };

//   return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
// };
import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';
import { useAuth } from './authContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();

  // ✅ Load cart on start
  useEffect(() => {
    if (user) {
      mergeCart();
      loadCartFromAPI();
    } else {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    }
  }, [user]);

  // ✅ Save local cart
  useEffect(() => {
    if (!user) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  // 🔥 Load cart from backend
  const loadCartFromAPI = async () => {
    try {
      const res = await axiosInstance.get("Cart");
      if (res.data && res.data.cartItems) {
        const mappedItems = res.data.cartItems.map(ci => ({
          id: ci.productId,
          cartItemId: ci.cartItemId,
          name: ci.product.productName,
          price: `$${ci.product.productPrice}`,
          image: ci.product.productImages?.[0]?.imageUrl 
                 ? `https://localhost:7059${ci.product.productImages[0].imageUrl}` 
                 : "https://via.placeholder.com/150",
          quantity: ci.quantity
        }));
        setCartItems(mappedItems);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error("Failed to load cart", err);
    }
  };

  // 🔥 Add to cart
  const addToCart = async (product) => {
    if (!user) {
      // Local cart
      setCartItems((prevItems) => {
        const existingItem = prevItems.find((item) => item.id === (product.id || product.productId));
        if (existingItem) {
          return prevItems.map((item) =>
            item.id === (product.id || product.productId)
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prevItems, { ...product, id: product.id || product.productId, quantity: 1 }];
        }
      });
    } else {
      // API cart
      try {
        await axiosInstance.post("Cart/add", {
          ProductId: product.id || product.productId,
          Quantity: 1,
        });
        await loadCartFromAPI();
      } catch (err) {
        console.error("Failed to add to cart", err);
      }
    }
  };

  // 🔥 Remove item
  const removeFromCart = async (productId) => {
    if (!user) {
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== productId)
      );
    } else {
      // Find the cartItemId for this productId
      const itemToRemove = cartItems.find(item => item.id === productId);
      if (itemToRemove && itemToRemove.cartItemId) {
        try {
          await axiosInstance.delete(`Cart/remove/${itemToRemove.cartItemId}`);
          await loadCartFromAPI();
        } catch (err) {
          console.error("Failed to remove from cart", err);
        }
      }
    }
  };

  // 🔥 Decrease qty
  const decreaseCartItem = async (productId) => {
    const existingItem = cartItems.find((item) => item.id === productId);
    if (!existingItem) return;

    if (!user) {
      if (existingItem.quantity === 1) {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
      } else {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id === productId
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
        );
      }
    } else {
      if (existingItem.quantity === 1) {
        await removeFromCart(productId);
      } else {
        try {
          await axiosInstance.put(`Cart/update?cartItemId=${existingItem.cartItemId}&quantity=${existingItem.quantity - 1}`);
          await loadCartFromAPI();
        } catch (err) {
          console.error("Failed to update cart quantity", err);
        }
      }
    }
  };

  // 🔥 Clear cart
  const clearCart = async () => {
    setCartItems([]);
    if (!user) {
      localStorage.removeItem("cart");
    }
  };

  // 🔥 Merge cart after login (Mocked for now as backend endpoint is missing)
  const mergeCart = async () => {
    const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (localCart.length > 0 && user) {
      // Logic for actual merging could go here if endpoint is added
      localStorage.removeItem("cart");
      await loadCartFromAPI();
    }
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    decreaseCartItem,
    clearCart,
    mergeCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};