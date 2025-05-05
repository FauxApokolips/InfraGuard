import express from 'express';
import cors from 'cors';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const app = express(); // ✅ Initialize app first!
const PORT = 5000;


// Setup DB
const adapter = new JSONFile('db.json');
const db = new Low(adapter, { infrastructure: [] }); // prevents "missing default data"

await db.read();
await db.write(); // ensures file exists and is initialized

// Middleware
app.use(cors());
app.use(express.json());

// Endpoints
app.get('/api/infrastructure', async (req, res) => {
  await db.read();
  res.json(db.data.infrastructure);
});

app.post('/api/infrastructure', async (req, res) => {
  try {
    const { name, status } = req.body;
    db.data.infrastructure.push({ name, status });
    await db.write();
    res.status(201).json({ message: 'Added' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add resource' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  const terratestResults = [
    { name: "Infrastructure Deployment", status: "Passed" },
    { name: "Resource Allocation", status: "Failed" },
    { name: "Load Balancer Check", status: "Passed" },
    { name: "DNS Resolution", status: "Pending" }
  ];
  
  // Endpoint to get TerraTest results
  app.get('/api/terratest-results', (req, res) => {
    res.json(terratestResults);
  });
});
