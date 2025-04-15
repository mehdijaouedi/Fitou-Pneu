import './index.css'
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import HomeSection from './components/home'
import Footer from './components/footer';
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
      <Route path="/" element={<HomeSection />} />




      </Routes>
      <Footer />

    </Router>
  );
}

export default App;
