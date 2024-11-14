import React from 'react';

function ControlPanel({ setShowChart, setShowTable, url, handleUrlInput }) {
  return (
    <div className="flex justify-center p-7 gap-3">
      <input
        type="text"
        value={url}
        name="url"
        id="url"
        placeholder="Enter the url"
        onChange={handleUrlInput}
        className="px-10 py-3 my-3 rounded-full h-12 text-gray-800"
      />
      <button
        className="bg-[#80d83d] py-3 px-5 m-2 rounded-full text-gray-800 font-bold"
        onClick={() => setShowChart(true)}
      >
        Show Chart
      </button>
      <button
        className="bg-[#80d83d] py-3 px-5 m-2 rounded-full text-gray-800 font-bold"
        onClick={() => setShowChart(false)}
      >
        Clear Chart
      </button>
      <button
        className="bg-[#80d83d] py-3 px-5 m-2 rounded-full text-gray-800 font-bold"
        onClick={() => setShowTable(true)}
      >
        Show Table
      </button>
      <button
        className="bg-[#80d83d] py-3 px-5 m-2 rounded-full text-gray-800 font-bold"
        onClick={() => setShowTable(false)}
      >
        Clear Table
      </button>
    </div>
  );
}

export default ControlPanel;
