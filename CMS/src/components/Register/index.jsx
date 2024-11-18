import { useState } from "react";
import axios from "axios";

function RegisterPage() {
  const [userName, setUserName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("Select your role");
  const [year, setYear] = useState("");
  const [batch, setBatch] = useState("");
  const [imageBase64, setImageBase64] = useState(""); // State for storing the base64 encoded image
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      convertImageToBase64(file);
    }
  };

  const convertImageToBase64 = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result.split(",")[1]); // Save base64 data without the prefix (data:image/png;base64,)
    };
    reader.readAsDataURL(file);
  };

  const handleRegister = async () => {
    setLoading(true);
    if (userName && name && email && phone && role !== "Select your role") {
      try {
        const data = {
          userName,
          password,
          name,
          email,
          phone,
          role,
          image: imageBase64, // Base64 encoded image

          ...(role === "Student" && {
            year,
            batch,
          }),
        };

        console.log("Data before sending:", data); // Log the JSON data

        const response = await axios.post(
          "http://localhost:5000/api/register",
          data,
          {
            headers: {
              "Content-Type": "application/json", // Set content type as JSON
            },
          }
        );

        if (response.status===201) {
          setSuccessMessage("Registeration Successfull");
          setErrorMessage("");
          setName("");
          setEmail("");
          setBatch("");
          setPassword("");
          setImageBase64("");
          setYear("");
          setRole("");

        } else {
          setErrorMessage("Registration failed. Please try again.");
        }
      } catch (error) {
        console.error("Registration error:", error);
        setErrorMessage("Something went wrong. Please try again.");
      }
    } else {
      setErrorMessage("Please fill in all fields and select a role!");
    }
    setLoading(false);
    setTimeout(() => setErrorMessage(""), 5000);
    setTimeout(() => setSuccessMessage(""), 5000);
  };

  return (
    <div className="flex justify-center items-center h-auto bg-gray-900 text-white">
    <div className="flex justify-center items-center h-auto bg-gray-900 text-white">
      <div className="p-6 bg-gray-800 rounded-md w-full max-w-lg">
        <h2 className="text-xl mb-4">Register</h2>

        {errorMessage && (
          <div className="error-box mb-4 p-2 bg-red-500 text-white rounded-md">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="error-box mb-4 p-2 bg-green-500 text-white rounded-md">
            {successMessage}
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
          <option value="Admin">Admin</option>
          <option value="Student">Student</option>
          <option value="Staff">Staff</option>
        </select>

        <label>Enter your UserName:</label>
        <input
          type="text"
          placeholder="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="px-4 py-2 mb-4 w-full rounded-md text-black"
          required
        />

        <label>Enter your Password:</label>
        <input
          type="text"
          placeholder="Username"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-2 mb-4 w-full rounded-md text-black"
          required
        />

        <label>Enter your Name:</label>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-4 py-2 mb-4 w-full rounded-md text-black"
          required
        />

        <label>Enter your Email:</label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 mb-4 w-full rounded-md text-black"
          required
        />

        <label>Enter your Phone Number:</label>
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="px-4 py-2 mb-4 w-full rounded-md text-black"
          required
        />

        {role === "Student" && (
          <>
            <label>Enter your Year:</label>
            <input
              type="text"
              placeholder="Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="px-4 py-2 mb-4 w-full rounded-md text-black"
            />

            <label>Enter your Batch:</label>
            <input
              type="text"
              placeholder="Batch"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              className="px-4 py-2 mb-4 w-full rounded-md text-black"
            />
          </>
        )}

        <label>Upload your Profile Image:</label>
        <input
          type="file"
          onChange={handleImageChange}
          className="px-4 py-2 mb-4 w-full rounded-md text-black"
        />

        <button
          className="bg-[#80d83d] py-3 px-5 w-full rounded-full text-gray-800 font-bold"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </div>
    </div>
  );
}

export default RegisterPage;
