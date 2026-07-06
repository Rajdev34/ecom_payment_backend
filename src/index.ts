import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import applicationRouter from './routes/applications.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for the public marketing site
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-bypass-rls']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mounting routes
app.use('/api/applications', applicationRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Helix Pay API Server is running.');
});

// Start Server (UNCOMMENT THIS BLOCK FOR LOCAL RUNNING)
// app.listen(PORT, () => {
//   console.log(`🚀 Helix Pay Express Server running on http://localhost:${PORT}`);
// });

// Export for Vercel deployment
export default app;

