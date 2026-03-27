import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail/VerifyEmail';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import AccountRecovery from './pages/AccountRecovery';
import ProtectedRoutes from './utils/ProtectedRoutes';
import PublicRouteProps from './utils/PublicRouteProps';
import ResetPassword from './pages/ChangePassword';
import { AlertProvider } from './components/Utilities/AlertList/AlertContext';
import { Route, Routes, useLocation } from 'react-router-dom';
import { MODAL_ROUTES } from './ModalRoutes';
import AlertList from './components/Utilities/AlertList/AlertList';
import HomeComponent from './components/PageSections/Home/Home';
import Profile from './components/PageSections/Profile/Profile';
import UserPosts from './components/PageSections/Profile/UserPosts';
import Logout from './components/FeatureModules/Logout/Logout';
import ProfilePhoto from './components/PageSections/Profile/ProfilePhoto';
import UserLikes from './components/PageSections/Profile/UserLikes';
import NotFound from './pages/Errors/NotFound';


const AppRoutes: React.FC = () => {

  const location = useLocation();
  const state = location.state;

  const modalMatch = MODAL_ROUTES.find(route =>
    route.match.test(location.pathname)
  );

  const backgroundLocation = state?.backgroundLocation;

  const baseLocation =
    backgroundLocation ||
    (modalMatch
      ? { pathname: modalMatch.getBackground(location.pathname) }
      : location);

  const isModalRoute = Boolean(modalMatch);
  return (
    <AlertProvider>
      <Routes location={baseLocation}>
        <Route element={<ProtectedRoutes redirect="/login" />}>
          <Route path="/" element={<Home />}>
            <Route index element={(
              <div><HomeComponent /></div>
            )} />
            <Route path="/search" element={(<div>Search</div>)} />
            <Route path="/notifications" element={(<div>Notifications</div>)} />
            <Route path="/messages" element={(<div>Messages</div>)} />
            <Route path="/bookmarks" element={<div>Bookmarks</div>} />
            <Route path="/settings" element={<div>Settings</div>} />
            <Route path="/profile/:username/" element={<Profile />} >
              <Route index element={<UserPosts/>} />
              <Route path="replies" element={(<div>Replies</div>)} />
              <Route path="likes" element={<UserLikes/>} />
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

        <Route path="*" element={<NotFound/>} />
      </Routes>

      {isModalRoute && (
        <Routes>
          <Route
            path="/profile/:username/photo"
            element={<ProfilePhoto type='photo' />}
          />
          <Route
            path="/profile/:username/header_photo"
            element={<ProfilePhoto type='header' />}
          />
        </Routes>
      )}

      <AlertList />
    </AlertProvider>
  )
}

export default AppRoutes;