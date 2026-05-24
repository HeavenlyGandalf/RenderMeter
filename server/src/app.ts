import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import healthRoutes from './routes/health.routes';
import resultsRoutes from './routes/results.routes';
import renderRoutes from './routes/render.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/results', resultsRoutes);
app.use('/api/render', renderRoutes);

export default app;
