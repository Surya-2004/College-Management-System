import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../UserContext";
import axios from "axios";

function LoginPage({ onLogin }) {
  const { role, setRole, username, setUsername } = useUser();
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (username && password && role !== "Select your role") {
      try {
        const response = await axios.post("/api/login", {
          username,
          password,
          role,
        });

        if (response.data.success) {
          onLogin();
        } else {
          setErrorMessage("Invalid credentials. Please try again.");
        }
      } catch (error) {
        console.error("Login error:", error);
        setErrorMessage("Something went wrong. Please try again.");
      }
    } else {
      setErrorMessage("Please fill in all fields and select a role!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
      <div className="p-6 bg-gray-800 rounded-md">
        <h2 className="text-xl mb-4">Login</h2>

        {errorMessage && (
          <div className="error-box mb-4 p-2 bg-red-500 text-white rounded-md">
            {errorMessage}
          </div>
        )}

        <label>Enter your Role:</label>
        <select
          name="role"
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="px-4 py-2 mb-4 w-full rounded-md text-black"
        >
          <option value="Select your role">Select your role</option>
          <option value="Student">Student</option>
          <option value="Staff">Staff</option>
        </select>

        <label>Enter your Registered Number:</label>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="px-4 py-2 mb-4 w-full rounded-md text-black"
          required
        />

        <label>Enter your Password:</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-2 mb-4 w-full rounded-md text-black"
          required
        />

        <button
          className="bg-[#80d83d] py-3 px-5 w-full rounded-full text-gray-800 font-bold"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
