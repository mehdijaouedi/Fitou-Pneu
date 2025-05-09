import './index.css'
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import HomeSection from './components/home'
import Footer from './components/footer';
import CartPage from './components/CartPage'; // adjust path if needed
import ProductDetails from './components/ProductDetails';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
      <Route path="/:productCategory?" element={<HomeSection />} />
      <Route path="/:productCategory?/details/:productId" element={<ProductDetails />} />
      <Route path="/cart" element={<CartPage />} />




      </Routes>
      <Footer />

    </Router>
  );
}

export default App;
