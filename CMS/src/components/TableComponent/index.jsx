import { useState, useEffect } from 'react';

function TableComponent({ url }) {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [error, setError] = useState(''); // State to handle error messages

  useEffect(() => {
    const spreadsheetId = url.match(/\/d\/(.+?)\//)[1]; // Extract the Spreadsheet ID
    const apiKey = 'AIzaSyASytyxga-k5UrGbnCRZvkN_uLbSVxiyqQ';
    const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchGet?ranges=A1:Z1000&key=${apiKey}`;

    fetch(apiUrl)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      })
      .then(data => {
        const rows = data.valueRanges[0].values; // Retrieve the rows from the response
        if (rows.length > 0) {
          setHeaders(rows[0]); // Set the first row as the headers
          setData(rows.slice(1)); // Set the rest of the rows as the data
        }
        setError(''); // Clear previous errors
      })
      .catch(error => {
        setError(error.message); // Set the error message if fetching fails
      });
  }, [url]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Table</h1>

      {/* Display error message if any */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Display table or loading message */}
      {data.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-600">
                {headers.map((header, index) => (
                  <th key={index} className="px-4 py-2 border border-gray-300 text-left">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-2 border border-gray-300">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : !error ? (
        <p className="text-gray-500">Loading data...</p> 
      ) : null}
    </div>
  );
}

export default TableComponent;
