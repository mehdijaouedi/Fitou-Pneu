import './index.css'
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import HomeSection from './components/home'
import HomePage from './components/HomePage';
import PneusPage from './components/PneusPage';
import JentesPage from './components/JentesPage';
import ContactPage from './components/ContactPage';
import Footer from './components/footer';
import CartPage from './components/CartPage'; // adjust path if needed
import ProductDetails from './components/ProductDetails';
import LoginPage from './components/LoginPage'; // Added
import RegisterPage from './components/RegisterPage'; // Added
import { AuthProvider } from './context/AuthContext'; // Added
import LoginModal from './components/LoginModal'; // Added
import OrderHistory from './components/OrderHistory'; // Added


function App() {
  return (
    <AuthProvider> 
      <Router>
        <Navbar />
        <LoginModal /> {/* Add LoginModal here so it can be triggered from anywhere */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pneus" element={<PneusPage />} />
          <Route path="/jentes" element={<JentesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/:productCategory/details/:productId" element={<ProductDetails />} />
          <Route path="/cart" element={<CartPage />} />
          {/* <Route path="/login" element={<LoginPage />} /> */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/ClientHistorique" element={<OrderHistory />} />
        </Routes>
        <Footer />

      </Router>
    </AuthProvider>
  );
}

export default App;
