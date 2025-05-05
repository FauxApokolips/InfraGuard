import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../src/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../src/components/ui/tabs.jsx";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import InspecTests from "../src/components/Inspec Test/InspecTests";
import TerraTestResults from "../src/components/TerraTest Result/TerraTestResults.jsx";
import DeploymentLogs from "../src/components/Logs/DeploymentLogs";
import { downloadAllResultsPDF } from "../src/components/Doc/Doc.jsx";
import './styles.css';
import axios from "axios";



export default function InfraTestingDashboard() {
  const [activeTab, setActiveTab] = useState("infrastructure");
  const [infraStatus, setInfraStatus] = useState([]);
  const [inspecResults, setInspecResults] = useState([]);
  const [terraTestResults, setTerraTestResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deploymentLogs, setDeploymentLogs] = useState([]);

const [sortAsc, setSortAsc] = useState(true);
const filteredInspecResults = [...inspecResults]
  .filter(test =>
    test.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => {
    if (sortAsc) return a.status.localeCompare(b.status);
    else return b.status.localeCompare(a.status);
  });

  const [resource, setResource] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get("http://localhost:5000/api/infrastructure").then((res) => setInfraStatus(res.data));
    axios.get("http://localhost:5000/api/inspec").then((res) => setInspecResults(res.data));
    axios.get("http://localhost:5000/api/terratest").then((res) => setTerraTestResults(res.data));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/infrastructure", { name: resource, status });
      setResource("");
      setStatus("");
      fetchData(); // Refresh table
    } catch (err) {
      alert("Failed to add resource.");
      console.error(err);
    }
  };

  

  return (
    <div className="p-6">
      <Tabs defaultValue="infrastructure" onValueChange={setActiveTab}>
        <TabsList className="flex space-x-4 bg-gray-200 p-2 rounded-lg">
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
          <TabsTrigger value="inspec">Inspec Tests</TabsTrigger>
          <TabsTrigger value="terratest">TerraTest Results</TabsTrigger>
          <TabsTrigger value="logs">Deployment Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="infrastructure">
          <h2 className="text-xl font-bold mb-4">Cloud Infrastructure Status</h2>

          <form onSubmit={handleSubmit} className="mb-4 flex gap-4 flex-wrap">
            <input
              type="text"
              placeholder="Resource Name"
              value={resource}
              onChange={(e) => setResource(e.target.value)}
              className="p-2 border rounded w-64"
              required
            />
            <input
              type="text"
              placeholder="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="p-2 border rounded w-64"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Add Resource
            </button>
          </form>
        </TabsContent>

        <TabsContent value="inspec">
  <InspecTests data={inspecResults} />
</TabsContent>

<TabsContent value="terratest">
  <TerraTestResults data={terraTestResults} />
</TabsContent>

<TabsContent value="logs">
  <DeploymentLogs data={deploymentLogs} />
</TabsContent>

      </Tabs>

      <Card className="mt-4">
        <CardContent>
          {activeTab === "infrastructure" && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Resource</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {infraStatus.map((resource, index) => (
                  <TableRow key={index}>
                    <TableCell>{resource.name}</TableCell>
                    <TableCell>{resource.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      

      <button
  onClick={() => {
    console.log("INSPEC", inspecResults);
    console.log("TERRATEST", terraTestResults);
    console.log("DEPLOYMENT", deploymentLogs);
    downloadAllResultsPDF(inspecResults, terraTestResults, deploymentLogs);
  }}
>
  Download Report
</button>


    </div>
  );
  
}
