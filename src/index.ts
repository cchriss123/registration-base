import express, { Request, Response } from 'express';
import cors from 'cors';


const app = express();
const PORT = process.env.PORT || 8097;

app.use(cors());
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

app.get('/api/ping', (_req: Request, res: Response) => res.send('pong'));



