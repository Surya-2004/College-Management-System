const AnnouncementCard = ({ announcement }) => {
  const { title, description, date, files } = announcement;

  // Check if there are any image files
  const imageFiles = files.filter(file =>
    file.filename.match(/\.(jpg|jpeg|png|gif)$/i)
  );

  return (
    <div className="flex flex-col md:flex-row bg-slate-800 p-4 rounded-lg shadow-md mb-4">
      {/* Left Side: Title, Description, Date, and Files */}
      <div className="md:w-2/3 flex flex-col justify-between">
        <h3 className="text-xl font-semibold text-gray-200">{title}</h3>
        <p className="text-gray-400 mt-2">{description}</p>
        <p className="text-gray-500 text-sm mt-2">{date}</p>
        
        {/* Display files to download */}
        <div className="mt-4">
          <h4 className="font-semibold">Files:</h4>
          <ul className="list-disc pl-5">
            {files.map((file, index) => (
              <li key={index}>
                <a
                  href={`data:application/octet-stream;base64,${file.filedata.toString("base64")}`}
                  download={file.filename}
                  className="text-blue-500 hover:underline"
                >
                  {file.filename}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Side: Images */}
      {imageFiles.length > 0 && (
        <div className="md:w-1/3 flex justify-center items-center mt-4 md:mt-0">
          <div className="flex flex-wrap gap-4">
            {imageFiles.map((file, index) => (
              <img
                key={index}
                src={`data:image/jpeg;base64,${file.filedata.toString("base64")}`}
                alt={file.filename}
                className="max-w-full max-h-48 object-cover rounded-lg shadow-md"
                onError={(e) => e.target.style.display = 'none'} // Hide image if it fails to load
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementCard;
