import React, { useState, useEffect } from "react";


const mockLogs = [
  {
    timestamp: "2025-04-08T21:30:00Z",
    action: "Terraform Apply",
    status: "Success",
    message: "All infrastructure created successfully."
  },
  {
    timestamp: "2025-04-08T20:00:00Z",
    action: "Terraform Plan",
    status: "Info",
    message: "No changes. Infrastructure up-to-date."
  },
  {
    timestamp: "2025-04-07T19:45:00Z",
    action: "Terraform Destroy",
    status: "Failed",
    message: "Error destroying resources: dependency conflict."
  }
];

const getBadgeColor = (status) => {
  switch (status) {
    case "Success":
      return "bg-green-200 text-green-800";
    case "Failed":
      return "bg-red-200 text-red-800";
    case "Info":
    default:
      return "bg-blue-200 text-blue-800";
  }
};

export default function DeploymentLogs({ onData }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Simulate fetch
    setLogs(mockLogs);
  }, []);

  useEffect(() => {
    if (onData) {
      onData(logs);
    }
  }, [logs]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Deployment Logs</h2>
      <div className="overflow-x-auto bg-white shadow-md rounded">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2">Time</th>
              <th className="text-left px-4 py-2">Action</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="text-left px-4 py-2">Message</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="px-4 py-2">{log.action}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-sm font-medium ${getBadgeColor(log.status)}`}>
                    {log.status}
                  </span>
                </td>
                <td className="px-4 py-2">{log.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
