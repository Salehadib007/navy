import { Navigate } from "react-router-dom";
import { getAuth } from "../utils/auth";

const PrivateRoute = ({ children }) => {
  const auth = getAuth();
  return auth ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
