import { useState, useEffect } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';

function ChartComponent({ url }) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(''); // Error state to hold error messages

  useEffect(() => {
    const spreadsheetId = url.match(/\/d\/(.+?)\//)[1]; // Extract only the Spreadsheet ID
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
        const rows = data.valueRanges[0].values;
        const chartData = rows.map((row, index) => ({
          x: row[0],
          y: row[1]
        }));
        setData(chartData);
        setError(''); // Clear any previous errors when data is successfully fetched
      })
      .catch(error => {
        setError(error.message); // Set the error message if fetching fails
      });
  }, [url]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Chart</h1>
      
      {/* Error message */}
      {error && <p className="text-red-500 mb-4">{error}</p>} 

      {/* Show chart if data exists, otherwise show loading message */}
      {data.length > 0 ? (
        <div className="w-full max-w-md mx-auto">
          <LineChart width={400} height={200} data={data}>
            <Line type="monotone" dataKey="y" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="x" />
            <YAxis />
          </LineChart>
        </div>
      ) : !error ? (
        <p className="text-gray-500">Loading data...</p> 
      ) : null}
    </div>
  );
}

export default ChartComponent;
