import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import OAuth2Success from './pages/OAuth2Success';
import Trips from './pages/Trips';
import CreateTrip from './pages/CreateTrip';
import TripDetail from './pages/TripDetail';
import Destinations from './pages/Destinations';
import Budget from "./pages/Budget";
import Expenses from "./pages/Expenses";
import Groups from "./pages/Groups";
import Notifications from "./pages/Notifications";
import Documents from "./pages/Documents";


const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  const token = localStorage.getItem('token');
  if (!user && !token) return <Navigate to="/login" replace />;
  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/oauth2/success" element={<OAuth2Success />} />
    <Route
      path="/trips/:tripId/budget"
      element={<Budget />}
    />

    <Route
      path="/trips/:tripId/expenses"
      element={<Expenses />}
    />
    <Route
      path="/trips/:tripId/documents"
      element={
        <PrivateRoute>
          <Documents />
        </PrivateRoute>
      }
    />
    <Route
      path="/groups"
      element={<Groups />}
    />
    <Route
      path="/notifications"
      element={<Notifications />}
    />



    <Route path="/dashboard" element={
      <PrivateRoute><Dashboard /></PrivateRoute>} />
    <Route path="/trips" element={
      <PrivateRoute><Trips /></PrivateRoute>} />
    <Route path="/trips/create" element={
      <PrivateRoute><CreateTrip /></PrivateRoute>} />
    <Route path="/trips/:id" element={
      <PrivateRoute><TripDetail /></PrivateRoute>} />
    <Route path="/destinations" element={
      <PrivateRoute><Destinations /></PrivateRoute>} />
  </Routes>

);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;