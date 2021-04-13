import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import { MONGODB_URL, PORT } from './config.json'

import Controller from './controller'

const app = express();

app.use(cors());
app.use(express.json());

try {
  mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Database connected!');
} catch (error) {
  console.log(error);
  process.exit(1);
}

const controller = new Controller()
app.use('/api', controller.router);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));