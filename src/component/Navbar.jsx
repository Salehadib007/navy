import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

// Icons
import { FiSettings } from "react-icons/fi";
import { HiHome, HiOutlineDocumentReport } from "react-icons/hi";
import { MdOutlineBuild, MdSupervisorAccount } from "react-icons/md";
import { RiAdminLine } from "react-icons/ri";
import { getAuth } from "../../utils/auth";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobileSub, setMobileSub] = useState(null);

  // const auth = JSON.parse(localStorage.getItem("auth"));
  const { auth, logout } = useAuth();
  // console.log(auth?.user?.username);

  const access = auth?.user?.access || [];
  const logitout = () => {
    logout();
    // localStorage.removeItem("auth");
    navigate("/login");
  };

  const menuItems = [
    {
      name: "HOME",
      icon: <HiHome />,
      path: "/",
    },
    {
      name: "SETUP",
      icon: <FiSettings />,
      sub: [
        { access: "Setup.Branch", label: "Branch", path: "/branch" },
        { access: "Setup.Rank", label: "Rank", path: "/rank" },
        {
          access: "Setup.VehicleBrand",
          label: "Vehicle Brand",
          path: "/vehicle-brand",
        },
        {
          access: "Setup.UserCategory",
          label: "User Category",
          path: "/user-category",
        },
        {
          access: "Setup.JobLocation",
          label: "Job Location",
          path: "/job-location",
        },
        {
          access: "Setup.BRTALocation",
          label: "BRTA Location",
          path: "/brta-location",
        },
        { access: "Setup.BRTADigit", label: "BRTA Digit", path: "/brta-digit" },
        {
          access: "Setup.BloodGroup",
          label: "Blood Group",
          path: "/blood-group",
        },
        {
          access: "Setup.VehicleModel",
          label: "Vehicle Type",
          path: "/vehicle-model",
        },
        { access: "Setup.Employee", label: "Employee", path: "/employee" },
        {
          access: "Setup.Department",
          label: "Department",
          path: "/department",
        },
        {
          access: "Setup.Designation",
          label: "Designation",
          path: "/designation",
        },
        {
          access: "Enrollment",
          label: "Add Registration",
          path: "/add-registration",
        },
      ],
    },
    {
      name: "OPERATION",
      icon: <MdOutlineBuild />,
      sub: [{ access: "Enrollment", label: "Enrollment", path: "/enrollment" }],
    },
    {
      name: "REPORT",
      icon: <HiOutlineDocumentReport />,
      sub: [
        // { access: "CreateUser", label: "Create User", path: "/create-user" },
        {
          access: "Setup.Branch",
          label: "Enrollment List",
          path: "/enrollment-list",
        },
      ],
    },
    {
      name: "ADMIN",
      icon: <RiAdminLine />,
      sub: [
        { access: "CreateUser", label: "Create User", path: "/register" },
        {
          access: "MenuDistribution",
          label: "Menu Distribution",
          path: "/menu-distribution",
        },
      ],
    },
    {
      name: `${auth?.user?.username ? "Logout" : "login"}`,
      icon: <MdSupervisorAccount />,
      sub: auth?.user?.username && [{ label: "Logout", path: "/login" }],
    },
  ];

  return (
    <nav className="bg-emerald-600 text-white px-4 py-1 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="w-20 h-10 flex items-center">
          <img src={logo} alt="logo" />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-1 font-semibold text-sm">
          {menuItems.map((item, index) => (
            <li key={index} className="relative group">
              {item.path ? (
                <Link
                  to={item.path}
                  className="px-4 py-2 inline-flex items-center gap-2
                  rounded-md hover:bg-emerald-500 hover:text-yellow-300 transition-all"
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              ) : (
                <span
                  className="px-4 py-2 inline-flex items-center gap-2
                  cursor-pointer rounded-md hover:bg-emerald-500 hover:text-yellow-300"
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.name}
                </span>
              )}

              {/* Desktop Submenu */}
              {item.sub && (
                <ul
                  className="absolute left-0 top-full mt-1 w-48                  bg-white text-gray-700 rounded-md shadow-lg
                  opacity-0 invisible group-hover:opacity-100
                  group-hover:visible transition-all duration-300"
                >
                  {item.sub.map((sub, i) => (
                    <li key={i}>
                      {(access.includes(sub.access) ||
                        sub.label === "Logout") && (
                        <Link
                          to={sub.path}
                          className="block px-4 py-2
                        hover:bg-emerald-100 hover:text-emerald-600"
                          onClick={sub.label === "Logout" ? logitout : ""}
                        >
                          {sub.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        {/* Mobile Button */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-2xl">
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <ul className="md:hidden mt-3 bg-emerald-600 rounded-lg overflow-hidden">
          {menuItems.map((item, index) => (
            <li key={index} className="border-b border-emerald-500">
              <div
                onClick={() =>
                  item.sub
                    ? setMobileSub(mobileSub === index ? null : index)
                    : setOpen(false)
                }
                className="py-3 px-4 cursor-pointer hover:bg-emerald-500
                flex justify-between items-center"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{item.icon}</span>
                  {item.path ? (
                    <Link to={item.path}>{item.name}</Link>
                  ) : (
                    item.name
                  )}
                </div>
                {item.sub && <span>▾</span>}
              </div>

              {/* Mobile Submenu */}
              {item.sub && mobileSub === index && (
                <ul className="bg-emerald-700">
                  {item.sub.map((sub, i) => (
                    <li key={i}>
                      <Link
                        to={sub.path}
                        onClick={() => setOpen(false)}
                        className="block py-2 px-6 text-sm
                        hover:bg-emerald-800"
                      >
                        {sub.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
