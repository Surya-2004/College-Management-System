import { saveAs } from "file-saver";

export default function DownloadButton({ data, fileName, fileType }) {
  const handleDownload = () => {
    const blob = new Blob([data], { type: fileType });
    saveAs(blob, fileName);
  };

  return (
    <button
      onClick={handleDownload}
      className="bg-[#80d83d] hover:bg-green-700 text-gray-900 px-4 py-2 rounded-full font-semibold"
    >
      Download
    </button>
  );
}
