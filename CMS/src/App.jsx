import {
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import LoginPage from "./components/LoginPage";
import DashBoard from "./components/DashBoard";

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
        <Route path="/dashboard/*" element={<DashBoard/>} />
        {/* <Route path="/dashboard" element={<DashBoard/>} /> */}
      </Routes>
    </div>
  );
}

export default App;
