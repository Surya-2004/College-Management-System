const AnnouncementCard = ({ announcement }) => {
  const { title, description, date, files } = announcement;

  // Check if there are any image files
  const imageFiles = files.filter(file => file.filename.match(/\.(jpg|jpeg|png|gif)$/i));

  return (
    <div className="flex flex-col md:flex-row bg-white p-4 rounded-lg shadow-md mb-4">
      {/* Left Side: Title, Description, Date, and Files */}
      <div className="md:w-2/3 flex flex-col justify-between">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray-600 mt-2">{description}</p>
        <p className="text-gray-500 text-sm mt-2">{date}</p>
        
        {/* Display files to download */}
        <div className="mt-4">
          <h4 className="font-semibold">Files:</h4>
          <ul className="list-disc pl-5">
            {files.map((file, index) => (
              <li key={index}>
                <a
                  href={`data:application/octet-stream;base64,${file.content.toString("base64")}`}
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

      {/* Right Side: Image */}
      {imageFiles.length > 0 && (
        <div className="md:w-1/3 flex justify-center items-center mt-4 md:mt-0">
          <img
            src={`data:image/jpeg;base64,${imageFiles[0].content.toString("base64")}`}
            alt={imageFiles[0].filename}
            className="max-w-full max-h-48 object-cover rounded-lg shadow-md"
          />
        </div>
      )}
    </div>
  );
};

export default AnnouncementCard;
