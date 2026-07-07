import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import applicationRouter from './routes/applications.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-bypass-rls']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/applications', applicationRouter);

app.get('/', (req, res) => {
  res.send('Ecom payments API Server is running.');
});

app.listen(PORT, () => {
  console.log(`🚀 Ecom payments Express Server running on http://localhost:${PORT}`);
});

// export default app;

