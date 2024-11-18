import { useState } from "react";
import axios from "axios";

export default function AddAnnouncement() {
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementDescription, setAnnouncementDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [announcementAdded, setAnnouncementAdded] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFiles([...selectedFiles, ...event.target.files]);
  };

  const handleDeleteFile = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent form's default behavior

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", announcementTitle);
      formData.append("description", announcementDescription);
      formData.append("date", new Date().toLocaleDateString("en-GB"));
      selectedClasses.forEach((classYear) =>
        formData.append("classes[]", classYear)
      );
      selectedFiles.forEach((file) => formData.append("files", file));


      const response = await axios.post(
        "http://localhost:5000/api/add-announcement",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 201) {
        // Check for successful response
        setAnnouncementAdded("Announcement Added Successfully.");
        // Clear the form fields after successful submission
        setAnnouncementTitle("");
        setAnnouncementDescription("");
        setSelectedFiles([]);
        setSelectedClasses([]);
      } else {
        setErrorMessage("Failed to add the announcement.");
      }
    } catch (error) {
      console.error("Error submitting announcement:", error);
      setErrorMessage(
        "An error occurred while adding the announcement. Please try again."
      );
    } finally {
      setLoading(false);
      setTimeout(() => setErrorMessage(""), 5000);
      setTimeout(() => setAnnouncementAdded(""), 5000); // Reset success message after 5 seconds
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 p-4">
      <div className="bg-gray-800 shadow-lg rounded-md p-6 w-full max-w-lg text-white">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Add Announcement
        </h2>

        {errorMessage && (
          <div className="error-box mb-4 p-2 bg-red-500 text-white rounded-md">
            {errorMessage}
          </div>
        )}
        {announcementAdded && (
          <div className="error-box mb-4 p-2 bg-green-500 text-white rounded-md">
            {announcementAdded}
          </div>
        )}

        <label className="block mb-2 font-medium text-gray-200">
          Announcement Title:
        </label>
        <input
          type="text"
          value={announcementTitle}
          onChange={(e) => setAnnouncementTitle(e.target.value)}
          className="w-full px-4 py-2 mb-4 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-[#80d83d] text-white"
        />

        <label className="block mb-2 font-medium text-gray-200">
          Announcement Description:
        </label>
        <textarea
          value={announcementDescription}
          onChange={(e) => setAnnouncementDescription(e.target.value)}
          className="w-full px-4 py-2 mb-4 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-[#80d83d] text-white"
        />

        <label className="block mb-2 font-medium text-gray-200">
          Attach Files:
        </label>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="mb-4 block w-full text-gray-400"
        />

        {selectedFiles.length > 0 && (
          <div className="mb-4">
            <p className="text-gray-200 font-medium">Selected Files:</p>
            <ul className="list-disc pl-5">
              {selectedFiles.map((file, index) => (
                <li key={index} className="flex items-center">
                  <span className="mr-2 text-gray-200">{file.name}</span>
                  <button
                    onClick={() => handleDeleteFile(index)}
                    className="text-red-400 hover:text-red-600 text-sm"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <label className="block mb-2 font-medium text-gray-200">
          Select Class Year(s):
        </label>
        <div className="mb-4 flex flex-wrap">
          <label className="inline-flex items-center mr-4 mb-2 text-gray-200">
            <input
              type="checkbox"
              value="1st Yr"
              checked={selectedClasses.includes("Class1")}
              onChange={(e) => {
                const checked = e.target.checked;
                setSelectedClasses((prev) =>
                  checked
                    ? [...prev, "Class1"]
                    : prev.filter((c) => c !== "Class1")
                );
              }}
            />
            <span>1st Yr</span>
          </label>
          <label className="inline-flex items-center mr-4 mb-2 text-gray-200">
            <input
              type="checkbox"
              value="2nd Yr"
              checked={selectedClasses.includes("Class2")}
              onChange={(e) => {
                const checked = e.target.checked;
                setSelectedClasses((prev) =>
                  checked
                    ? [...prev, "Class2"]
                    : prev.filter((c) => c !== "Class2")
                );
              }}
            />
            <span>2nd Yr</span>
          </label>
          <label className="inline-flex items-center mr-4 mb-2 text-gray-200">
            <input
              type="checkbox"
              value="3rd Yr"
              checked={selectedClasses.includes("Class3")}
              onChange={(e) => {
                const checked = e.target.checked;
                setSelectedClasses((prev) =>
                  checked
                    ? [...prev, "Class3"]
                    : prev.filter((c) => c !== "Class3")
                );
              }}
            />
            <span>3rd Yr</span>
          </label>
          <label className="inline-flex items-center mr-4 mb-2 text-gray-200">
            <input
              type="checkbox"
              value="4th Yr"
              checked={selectedClasses.includes("Class4")}
              onChange={(e) => {
                const checked = e.target.checked;
                setSelectedClasses((prev) =>
                  checked
                    ? [...prev, "Class4"]
                    : prev.filter((c) => c !== "Class4")
                );
              }}
            />
            <span>4th Yr</span>
          </label>
        </div>

        <button
          type="submit" // Ensure the button triggers form submission
          onClick={handleSubmit}
          className="bg-[#80d83d] py-3 px-5 w-full rounded-full text-gray-900 font-bold"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Announcement"}
        </button>
      </div>
    </div>
  );
}
