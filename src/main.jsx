import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthContextProvider } from './contexts/authContext.jsx'
import { CartContextProvider } from './contexts/cartContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <AuthContextProvider>
    <CartContextProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </CartContextProvider>
  </AuthContextProvider>
)
