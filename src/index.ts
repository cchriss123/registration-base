import express, { Request, Response } from 'express';
import cors from 'cors';
import { createTables } from './database/createTables';
import * as registerDatabase from './database/registerDb';

const app = express();
const PORT = process.env.PORT || 8097;

createTables()
    .then(() => registerDatabase.insertSuperAdmin())
    .catch(error => console.error(error));

app.use(cors());
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

app.get('/api/ping', (_req: Request, res: Response) => res.send('pong'));



