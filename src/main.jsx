import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import { StoreProvider } from "./context/StoreContext";
import ShopLayout from "./layouts/ShopLayout";
import {
  Home,
  Shop,
  Product,
  Category,
  SearchPage,
  Checkout,
} from "./pages/ShopPages";
import { Account, Auth } from "./pages/AuthAdmin";
import { AdminHome, AdminLayout } from "./layouts/AdminLayout";
import { AdminCategories, AdminProductForm, AdminProducts } from "./pages/AdminPages";
import { Addresses, CartPage, Orders, ResetPassword, WishlistPage } from "./pages/CustomerPages";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<ShopLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="category/:id" element={<Category />} />
            <Route path="product/:id" element={<Product />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="login" element={<Auth />} />
            <Route path="signup" element={<Auth mode="signup" />} />
            <Route path="forgot-password" element={<ResetPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="account" element={<Account />} />
            <Route path="account/orders" element={<Orders />} />
            <Route path="account/addresses" element={<Addresses />} />
          </Route>
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminHome />} />
            <Route path="items" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="items/new" element={<AdminProductForm />} />
            <Route path="items/:id/edit" element={<AdminProductForm />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  </StrictMode>,
);
