import { useState } from "react";

export default function FileUpload({ onFilesChange }) {
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    onFilesChange([...files, ...selectedFiles]);
  };

  return (
    <div className="mb-4">
      <label className="text-white">Attach Files:</label>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="px-4 py-2 mb-2 w-full rounded-md bg-gray-800 text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-[#80d83d] file:text-gray-800 hover:file:bg-gray-300"
      />
      {files.length > 0 && (
        <ul className="mt-2 text-gray-400">
          {files.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
