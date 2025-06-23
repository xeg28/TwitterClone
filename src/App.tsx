import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail/VerifyEmail';
import Login from './pages/Login/Login';
import Home from './pages/Home';
import AccountRecovery from './pages/AccountRecovery';
import ProtectedRoutes from './utils/ProtectedRoutes';
import PublicRouteProps from './utils/PublicRouteProps';
import ResetPassword from './pages/ChangePassword';


function App() {

  return (
    <Router>
      <Routes>
        <Route element={<ProtectedRoutes redirect="/login" />}>
          <Route path="/" element={<Home/>} />
        </Route>

        <Route element={<PublicRouteProps redirect="/" />}>
          <Route path="/login"  element={<Login />}/>
          <Route path="/register" element={<Register />} />
        </Route>

        <Route path="/verify-email" element={<VerifyEmail/>}/>
        <Route path="/account-recovery" element={<AccountRecovery />}/>
        <Route path="reset-password" element={<ResetPassword/>} />
      </Routes>
    </Router>
  );
}

export default App;
