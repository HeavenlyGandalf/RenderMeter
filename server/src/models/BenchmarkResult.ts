import mongoose from 'mongoose';

export interface IBenchmarkResult {
  templateEngine: string;
  executionTimeMs: number;
  templateSize: number;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new mongoose.Schema<IBenchmarkResult>(
  {
    templateEngine: { type: String, required: true },
    executionTimeMs: { type: Number, required: true },
    templateSize: { type: Number, required: true },
  },
  { timestamps: true }
);

export const BenchmarkResult = mongoose.model<IBenchmarkResult>(
  'BenchmarkResult',
  schema
);
