/* eslint-disable no-undef */
import express from 'express';
import cors from 'cors';
import { init } from './socketServer';

const app = express();
app.use(express.json());
app.use(cors());
const port = 8880;

init();

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
