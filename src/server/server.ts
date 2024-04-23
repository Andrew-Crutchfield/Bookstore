import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

// Import any additional middleware or routes if you have them
import tokenCheck from './middlewares/tokenCheck'; // Adjust path as necessary
import authRoutes from './routes/authRoutes'; // Adjust path as necessary

dotenv.config();

const app: Express = express();
const PORT: string | number = process.env.PORT || 3000;
const jsonDirectory = process.env.JSON_PATH || './data'; // Fallback to './data' if not specified

app.use(cors());
app.use(express.json());

// Serve static JSON files
app.use('/data', express.static(path.resolve(jsonDirectory)));

// Example of setting up additional routes and middleware
app.use('/api/auth', authRoutes);
app.use('/api/protected-route', tokenCheck);

app.get('/api/hello', (_, res: Response) => {
  res.json({ message: 'Hello World' });
});

if (process.env.NODE_ENV === 'production') {
  // Serve static files from the 'public' directory in production
  app.use(express.static(path.join(__dirname, 'public')));

  // Handle React routing, return all requests to React app in production
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});