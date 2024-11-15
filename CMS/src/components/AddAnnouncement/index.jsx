import { useState } from "react";
import axios from "axios";

export default function AddAnnouncement() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [classYears, setClassYears] = useState([]); // Array to hold selected class years
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Get current date in DD/MM/YYYY format
    const currentDate = new Date().toLocaleDateString("en-GB");

    // Create form data to send the request
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("date", currentDate);

    // Append selected class years
    formData.append("classYears", JSON.stringify(classYears)); // Send as JSON string

    // Append files to formData
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      // Make POST request to backend to add the announcement
      const response = await axios.post("/api/add-announcement", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Make sure to send form data as multipart
        },
      });

      // Handle success response
      if (response.status === 200) {
        setSuccess("Announcement added successfully!");
        setTitle("");
        setDescription("");
        setClassYears([]);
        setFiles([]);
      }
    } catch (error) {
      setError("Failed to add announcement. Please try again.");
    }
  };

  // Handle class year checkbox changes
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setClassYears((prevClassYears) => [...prevClassYears, value]); // Add the class year if checked
    } else {
      setClassYears((prevClassYears) =>
        prevClassYears.filter((classYear) => classYear !== value) // Remove the class year if unchecked
      );
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
      <div className="p-6 bg-gray-800 rounded-md w-96">
        <h2 className="text-xl mb-4">Add Announcement</h2>

        {error && (
          <div className="error-box mb-4 p-2 bg-red-500 text-white rounded-md">
            {error}
          </div>
        )}
        {success && (
          <div className="success-box mb-4 p-2 bg-green-500 text-white rounded-md">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-4">
            <label htmlFor="title" className="block text-sm">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-4 py-2 w-full rounded-md text-black"
              required
            />
          </div>

          <div className="form-group mb-4">
            <label htmlFor="description" className="block text-sm">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="px-4 py-2 w-full rounded-md text-black"
              required
            />
          </div>

          <div className="form-group mb-4">
            <label className="block text-sm">Class Year(s)</label>
            <div>
              <label className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  value="1st Year"
                  checked={classYears.includes("1st Year")}
                  onChange={handleCheckboxChange}
                  className="form-checkbox"
                />
                <span className="ml-2">1st Year</span>
              </label>
              <label className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  value="2nd Year"
                  checked={classYears.includes("2nd Year")}
                  onChange={handleCheckboxChange}
                  className="form-checkbox"
                />
                <span className="ml-2">2nd Year</span>
              </label>
              <label className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  value="3rd Year"
                  checked={classYears.includes("3rd Year")}
                  onChange={handleCheckboxChange}
                  className="form-checkbox"
                />
                <span className="ml-2">3rd Year</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  value="4th Year"
                  checked={classYears.includes("4th Year")}
                  onChange={handleCheckboxChange}
                  className="form-checkbox"
                />
                <span className="ml-2">4th Year</span>
              </label>
            </div>
          </div>

          <div className="form-group mb-4">
            <label htmlFor="files" className="block text-sm">Attach Files</label>
            <input
              type="file"
              id="files"
              multiple
              onChange={(e) => setFiles(e.target.files)}
              className="px-4 py-2 w-full rounded-md text-black"
            />
          </div>

          <button
            type="submit"
            className="bg-[#80d83d] py-3 px-5 w-full rounded-full text-gray-800 font-bold"
          >
            Add Announcement
          </button>
        </form>
      </div>
    </div>
  );
}
