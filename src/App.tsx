import React, { useState, useMemo} from "react";

import { fetchLastLocation } from "./backend/fetchLastLocations";
import './App.css';

// Define the Result interface
interface Result {
  timestamp: number;
  address: {
    street: string;
    city: string;
  };
  executionTime: number;
}

// This is an example results data structure
const initialResults: Result[] = [
  {
    timestamp: Date.now(),
    address: {
      street: "5th Ave",
      city: "Random City"
    },
    executionTime: 900
  },
  {
    timestamp: Date.now() + 2000,
    address: {
      street: "Main Road",
      city: "New Town"
    },
    executionTime: 400
  }
];

function App() {
  const [results, setResults] = useState<Result[]>(initialResults);
  const [isLoading, setLoading] = useState<boolean>(false);

  const handleOnClick = async () => {
    try {
      setLoading(true);
      const timestamp = Date.now();

      const res = await fetchLastLocation();
      const executionTime = Date.now() - timestamp;

      const newResult = {
        timestamp,
        address: res.address,
        executionTime
      };

      setResults([...results, newResult]);
    } catch (error) {
      console.error("Failed to fetch last location:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = useMemo(() => {
    if (results.length === 0) return { fastest: 0, slowest: 0, average: 0 };

    const times = results.map(result => result.executionTime);
    const fastest = Math.min(...times);
    const slowest = Math.max(...times);
    const average = times.reduce((a, b) => a + b, 0) / times.length;

    return { fastest, slowest, average };
  }, [results]);

  const { fastest, slowest, average } = calculateStats;

  return (
    <div className="m-10 font-sans">
      <button 
        className="btn" 
        disabled={isLoading}
        onClick={() => handleOnClick()}>
          Get Last Location
      </button>
      
      <table className="w-full border-collapse border border-black">
        <thead>
          <tr>
            <th className="cell header">Timestamp</th>
            <th className="cell header">Street</th>
            <th className="cell header">City</th>
            <th className="cell header">Execution Time (ms)</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index}>
              <td className="cell">{result.timestamp}</td>
              <td className="cell">{result.address.street}</td>
              <td className="cell">{result.address.city}</td>
              <td className="cell">{result.executionTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <div>Fastest: {fastest} ms </div>
        <div>Slowest: {slowest} ms </div>
        <div>Average: {average} ms </div>
      </div>
    </div>
  );
}

export default App;
