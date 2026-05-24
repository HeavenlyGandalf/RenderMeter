import mongoose from 'mongoose';

// Mongoose Schema — хранение результатов сравнения
const schema = new mongoose.Schema(
  {
    engines: [String],
    scenarios: [String],
    runs: Number,
    // results хранится как гибкий объект — структура фиксируется на уровне сервиса
    results: [
      {
        scenario: String,
        engines: { type: mongoose.Schema.Types.Mixed },
        _id: false,
      },
    ],
  },
  { timestamps: true }
);

export const BenchmarkRunModel = mongoose.model('BenchmarkRun', schema);
