import {Router, Request, Response} from "express";
import {login} from '../service/loginService';

const router = Router();
export default router;

router.post('/login', (req: Request, res: Response) => {
    login(req.body)
        .then(tokens => res.status(200).json({tokens}))
        .catch(error => res.status(401).json({error: error.message}));
});