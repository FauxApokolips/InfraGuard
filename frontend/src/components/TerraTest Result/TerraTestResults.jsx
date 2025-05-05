import React, { useState, useEffect } from 'react';
import axios from 'axios';

const staticTestData = [
  { name: 'Validate VPC Setup', status: 'Passed' },
  { name: 'Check Load Balancer', status: 'Failed' },
  { name: 'Verify Subnets', status: 'Pending' },
  { name: 'Ensure IAM Roles', status: 'Passed' },
];

const TerraTestResults = ({ onData }) => {
  const [apiResults, setApiResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    const fetchTerraTestResults = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/terratest-results");
        setApiResults(res.data);
      } catch (err) {
        console.error("Failed to fetch TerraTest results", err);
      }
    };

    fetchTerraTestResults();
  }, []);

  const combinedResults = [...staticTestData, ...apiResults];

  useEffect(() => {
    if (onData) {
      onData(combinedResults);
    }
  }, [apiResults]); // Update when new API results are fetched

  const statusOrder = { Passed: 1, Pending: 2, Failed: 3 };

  const filteredData = combinedResults
    .filter(test => test.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortAsc) return statusOrder[a.status] - statusOrder[b.status];
      else return statusOrder[b.status] - statusOrder[a.status];
    });

  const getBadgeColor = (status) => {
    switch (status) {
      case 'Passed': return 'bg-green-200 text-green-800';
      case 'Failed': return 'bg-red-200 text-red-800';
      case 'Pending': return 'bg-yellow-200 text-yellow-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className="p-2">
      <h2 className="text-xl font-bold mb-4">TerraTest Results</h2>

      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Filter by test name..."
          className="p-2 border border-gray-300 rounded w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={() => setSortAsc(!sortAsc)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Sort by Status {sortAsc ? '↑' : '↓'}
        </button>
      </div>

      <table className="min-w-full bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2">Test Name</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((test, idx) => (
            <tr key={idx} className="border-t">
              <td className="px-4 py-2">{test.name}</td>
              <td className="px-4 py-2">
                <span className={`px-2 py-1 rounded text-sm font-medium ${getBadgeColor(test.status)}`}>
                  {test.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TerraTestResults;
