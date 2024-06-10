import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import './styles/App.css';  // Import the global CSS file
import Login from './pages/Login';
import Register from './pages/Register';
import NavigationBar from './components/NavegationBar'; 
import Profile from './pages/Profile';
import Home from './pages/Home';
import News from './pages/News';

function App() {
  return (
    <BrowserRouter>
      <NavigationBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/news" element={<News />} />
          <Route path="/" element={<Home />} />
        </Routes>
    
    </BrowserRouter>
  );
}

export default App;
