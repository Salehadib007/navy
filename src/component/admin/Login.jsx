import React, { useEffect, useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";
import { getAuth, setAuth } from "../../../utils/auth";
// import { setAuth } from "../../../utils/auth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const credentials = { username, password };
  const navigate = useNavigate();
  const { login } = useAuth();

  const connect = async (credentials) => {
    const res = await api.post(
      "/auth/login",
      // http://localhost:5000/api
      credentials,
    );

    // login(res.data);
    localStorage.setItem("auth", JSON.stringify(res.data));
    setAuth(res.data);

    setAuth(res.data);
    navigate("/");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/70"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-[#e9e8e2] rounded-md shadow-lg px-8 py-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 mb-3">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Anchor.svg/1200px-Anchor.svg.png"
              alt="NPM Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold">
            <span className="text-red-600">NP</span>
            <span className="text-blue-900">M</span>
          </h1>
          <p className="text-xs text-gray-600 text-center mt-1">
            NAVAL PROVOST MARSHAL - BN STATION
          </p>
        </div>

        <h2 className="text-center text-lg font-semibold mb-6 tracking-wide">
          LOGIN
        </h2>

        {/* Username */}
        <div className="mb-4 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <FaUser />
          </span>
          <input
            type="text"
            placeholder="Username"
            className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-gray-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-6 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <FaLock />
          </span>
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-gray-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Button */}
        <button
          onClick={() => connect(credentials)}
          className="w-full border border-gray-400 py-2 rounded-md font-medium hover:bg-gray-200 transition"
        >
          Log in
        </button>
      </div>
    </div>
  );
}
