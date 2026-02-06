import { Outlet } from "react-router-dom";
import Navbar from "./component/Navbar";
import Navy from "./component/Navy";

const App = () => {
  return (
    <>
      <Navbar />
      
      <Outlet />
    </>
  );
};

export default App;
