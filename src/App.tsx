import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail/VerifyEmail';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail/>}/>
      </Routes>
    </Router>
  );
}

export default App;
