import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
    userId?: string;
}

export function verifyAccessToken(req: AuthenticatedRequest, res: Response, next: NextFunction): Response | void {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).json({ error: 'Authorization header must be provided' });
    }

    const token = authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token must be provided in the Authorization header' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return res.status(500).json({ error: 'JWT secret is not defined' });
    }

    try {
        const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
        if (decoded.type === 'access') {
            req.userId = decoded.id;
            return next();
        } else {
            return res.status(401).json({ error: 'Invalid token type' });
        }
    } catch (e) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}
