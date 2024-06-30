import 'dotenv/config';
import * as database from '../database/loginDb';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function refreshToken(token: string): Promise<{ accessToken: string }> {

    if (!token) {
        throw new Error('Refresh token must be provided');
    }

    let id: string;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;
        id = decoded.id;
    } catch (e) {
        throw new Error('Invalid or expired token');
    }
    const storedToken = await database.getRefreshTokenById(id);
    if (storedToken !== token)
        throw new Error('Invalid or mismatching token');

    const accessToken = jwt.sign({ id: id, type: 'access' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { accessToken };
}


interface loginBody {
    email: string;
    password: string;
}

export async function login(body: loginBody) : Promise<{accessToken: string, refreshToken: string}> {

    if (!body.email)
        throw new Error('email must be provided');

    if (!body.password)
        throw new Error('password must be provided');

    const userPassword = await database.selectUserPasswordByEmail(body.email);
    if (!userPassword)
        throw new Error('User not found');

    if (!await bcrypt.compare(body.password, userPassword))
        throw new Error('Incorrect password');

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT secret is not set. Ensure environment variables are properly configured.");
    }

    const id = await database.selectIdByEmail(body.email);
    if (!id)
        throw new Error('User not found');

    const accessToken = jwt.sign({ id: id, type: 'access' }, jwtSecret, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: id, type: 'refresh' }, jwtSecret, { expiresIn: '7d' });
    await database.saveRefreshToken(refreshToken, id);

    return { accessToken, refreshToken };
}