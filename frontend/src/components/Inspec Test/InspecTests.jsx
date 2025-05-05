import React, { useState, useEffect } from 'react';

const testData = [
  { name: 'Check Firewall', status: 'Passed' },
  { name: 'Verify Ports', status: 'Failed' },
  { name: 'User Access Control', status: 'Passed' },
  { name: 'Disk Encryption', status: 'Pending' },
];

const InspecTests = ({ onData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  
  useEffect(() => {
    const filtered = testData
      .filter(row => row.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        return sortAsc
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      });
    setFilteredData(filtered);
    onData && onData(filtered); // send to Dashboard
  }, [searchTerm, sortAsc]);

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
      <h2 className="text-xl font-bold mb-4">Inspec Test Results</h2>

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

export default InspecTests;
