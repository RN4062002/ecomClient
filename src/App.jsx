import React from 'react'
import { useState } from 'react'
import './App.css'
import Navbar from './components/Home/Navbar'
import Home from './components/Home/Home'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Products from './components/products/Products'
import ProductList from './components/products/ProductList'
import Categories from './components/products/Categories'
import Checkout from './components/products/Checkout'
import OrderSuccess from './components/products/OrderSuccess'
import Invoice from './components/products/Invoice'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute'
import ProductOverView from './components/products/ProductOverView'

function App() {

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/ProductList" element={<ProductList />} />
      <Route
        path="/Admin/ProductList" element={

            <ProtectedRoute roles={["Admin"]}>
              <Products />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Admin/Categories" element={
            <ProtectedRoute roles={["Admin"]}>
              <Categories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Checkout" element={
            <ProtectedRoute roles={["Customer", "Admin"]}>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/OrderSuccess" element={
            <ProtectedRoute roles={["Customer", "Admin"]}>
              <OrderSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Invoice/:orderId" element={
            <ProtectedRoute roles={["Customer", "Admin"]}>
              <Invoice />
            </ProtectedRoute>
          }
        />
      <Route path="/ProductOverView" element={<ProductOverView />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
