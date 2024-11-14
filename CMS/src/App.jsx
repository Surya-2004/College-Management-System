import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import LoginPage from "./components/LoginPage";
import ControlComponent from "./components/ControlComponent";
import ChartComponent from "./components/ChartComponent";
import TableComponent from "./components/TableComponent";

function App() {
  const [url, setUrl] = useState("");
  const [showChart, setShowChart] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const navigate = useNavigate();

  const handleUrlInput = (e) => {
    setUrl(e.target.value);
  };

  const handleLogin = () => {
    navigate("/dashboard"); // After successful login, redirect to the dashboard
  };

  return (
    <div className="bg-gray-900 min-h-[100vh] h-auto text-white">
      <Routes>
        {/* Login Route */}
        <Route path="/" element={<LoginPage onLogin={handleLogin} />} />

        {/* Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            <>
              <div className="flex justify-center p-7 gap-3">
                <button
                  className="bg-[#80d83d] py-3 px-5 m-2 rounded-full text-gray-800 font-bold"
                  onClick={() => {
                    setUrl("");
                    setShowChart(false);
                    setShowTable(false);
                    navigate("/"); // Navigate back to login
                  }}
                >
                  Logout
                </button>
              </div>

              <ControlComponent
                url={url}
                handleUrlInput={handleUrlInput}
                setShowChart={setShowChart}
                setShowTable={setShowTable}
              />

              {showChart && <ChartComponent url={url} />}
              {showTable && <TableComponent url={url} />}
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
