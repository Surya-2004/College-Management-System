import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import LoginPage from "./components/LoginPage";

function App() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/dashboard"); 
  };

  return (
    <div className="bg-gray-900 min-h-[100vh] h-auto text-white">
      <Routes>
        {/* Login Route */}
        <Route path="/" element={<LoginPage onLogin={handleLogin} />} />

        {/* Dashboard Route */}
        <Route path="/dashboard" element={<DashBoard/>} />
      </Routes>
    </div>
  );
}

export default App;
