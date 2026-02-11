import { Navigate } from "react-router-dom";
// import { getAuth } from "../utils/auth";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { auth } = useAuth();
  return auth ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
