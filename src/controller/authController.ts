import {Router, Request, Response} from "express";
import {login, logout, refreshToken} from '../service/loginService';
import {AuthenticatedRequest, verifyAccessToken} from "../middleware/auth";

const router = Router();
export default router;

router.post('/login', (req: Request, res: Response) => {
    login(req.body)
        .then(tokens => res.status(200).json({tokens}))
        .catch(error => res.status(401).json({error: error.message}));
});

router.post('/refresh-token', (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];
    refreshToken(token)
        .then(accessToken => res.status(200).json(accessToken))
        .catch(error => res.status(401).json({error: error.message}));
});

router.post('/logout', verifyAccessToken, async (req: AuthenticatedRequest, res: Response) => {
    logout(req.userId)
        .then(() => res.status(200).send('User logged out'))
        .catch(error => res.status(401).json({error: error.message}));
});
