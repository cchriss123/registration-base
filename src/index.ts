import express, { Request, Response } from 'express';
import cors from 'cors';
import { createTables } from './database/createTables';
import * as registerDatabase from './database/registerDb';
import regRoutes from './controller/regController';
import {customJsonParser} from "./utility/customJsonParser";

const app = express();
const PORT = process.env.PORT || 8097;

app.use(customJsonParser);
app.use(cors());

app.get('/api/ping', (_req: Request, res: Response) => res.send('pong'));
app.use('/api/reg', regRoutes);


app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

createTables()
    .then(() => registerDatabase.insertSuperAdmin())
    .catch(error => console.error(error));
