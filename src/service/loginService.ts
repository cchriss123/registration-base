import 'dotenv/config';
import * as database from '../database/loginDb';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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