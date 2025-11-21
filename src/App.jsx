import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext'; 
import { AuthProvider } from './context/AuthContext.jsx';
import HeaderComponent from './components/HeaderComponent';
import HomePages from './pages/HomePages';  
import ProductsPages from './pages/ProductsPages';
import ProductDetailPage from './pages/ProductDetailPage';
import RegisterPages from './pages/RegisterPages';
import LoginPages from './pages/LoginPages';
import PurchasePages from './pages/PurchasePages';
import AdminPages from './pages/AdminPages.jsx';
import InventoryManagementPages from './pages/InventoryManagementPages.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Footer from './components/Footer';
import CategoriesPages from "./pages/CategoriesPages";
import PerfilPages from "./pages/ProfilePages";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PurchaseResult from './pages/PurchaseResult.jsx';




export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <HeaderComponent />
        <main className="App">
          <Routes>
            <Route path='/' element={<HomePages />} />
            <Route path='/categorias' element={<CategoriesPages />} />
            <Route path='/productos' element={<ProductsPages />} />
            <Route path='/productos/:id' element={<ProductDetailPage />} />
            <Route path='/registro' element={<RegisterPages />} />
            <Route path='/login' element={<LoginPages />} />
            <Route path='/pago' element={<PurchasePages />} />
            <Route path='/compra/:id' element={<PurchaseResult />} />
            <Route path='/perfil' element={<ProtectedRoute><PerfilPages /></ProtectedRoute>} />
            <Route path='/admin' element={<ProtectedRoute><AdminPages /></ProtectedRoute>} />
            <Route path='/admin/inventario' element={<ProtectedRoute><InventoryManagementPages /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
      </CartProvider>
    </AuthProvider>
  );
}
