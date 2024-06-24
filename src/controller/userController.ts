import {Router, Request, Response} from "express";
import {appendUser} from '../service/registrationService';

const router = Router();
export default router;


router.post('/insert-user', (req: Request, res: Response) => {
    appendUser(req.body)
        .then(() => res.status(201).send('User created'))
        .catch(error => res.status(400).json({error: error.message}));
});