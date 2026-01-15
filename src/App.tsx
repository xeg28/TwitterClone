import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail/VerifyEmail';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import AccountRecovery from './pages/AccountRecovery';
import ProtectedRoutes from './utils/ProtectedRoutes';
import PublicRouteProps from './utils/PublicRouteProps';
import ResetPassword from './pages/ChangePassword';
import { AlertProvider } from './components/AlertList/AlertContext';
import AlertList from './components/AlertList/AlertList';
import Profile from './components/Profile/Profile';
import HomeComponent from './components/Home/Home';
import Logout from './components/Logout/Logout';


function App() {
  return (
    <Router>
      <AlertProvider>
        <Routes>
          <Route element={<ProtectedRoutes redirect="/login" />}>
            <Route path="/" element={<Home />}>
              <Route index element={(
                <div><HomeComponent/></div>
                )}/>
              <Route path="/search" element={(<div>Search</div>)}/>
              <Route path="/notifications" element={(<div>Notifications</div>)}/>
              <Route path="/messages" element={(<div>Messages</div>)} />
              <Route path="/profile/:username/" element={<Profile/>} > 
                <Route index element={
                  <>
                <div>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maxime praesentium dicta assumenda illo! Suscipit, ipsa soluta ab quasi asperiores fugiat iusto officia laboriosam possimus tempora ducimus consequatur officiis quidem dolores?</div>
                <div>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maxime praesentium dicta assumenda illo! Suscipit, ipsa soluta ab quasi asperiores fugiat iusto officia laboriosam possimus tempora ducimus consequatur officiis quidem dolores?</div>
                <div>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maxime praesentium dicta assumenda illo! Suscipit, ipsa soluta ab quasi asperiores fugiat iusto officia laboriosam possimus tempora ducimus consequatur officiis quidem dolores?</div>
                <div>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maxime praesentium dicta assumenda illo! Suscipit, ipsa soluta ab quasi asperiores fugiat iusto officia laboriosam possimus tempora ducimus consequatur officiis quidem dolores?</div>
                <div>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maxime praesentium dicta assumenda illo! Suscipit, ipsa soluta ab quasi asperiores fugiat iusto officia laboriosam possimus tempora ducimus consequatur officiis quidem dolores?</div>
                </>
                } />
                <Route path="replies" element={(<div>Replies</div>)} />
              </Route>
            </Route>
            <Route path="/logout" element={<Logout />} />
          </Route>

          <Route element={<PublicRouteProps redirect="/" />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/account-recovery" element={<AccountRecovery />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Routes>

        <AlertList />
      </AlertProvider>
    </Router>
  );
}

export default App;
