import crypto from "crypto";
import bcrypt from "bcrypt";
import * as database from "../database/registerDb";
import { sendMail } from "./emailService";

export async function verifyUser(token: string) {

    const pendingUser = await database.selectPendingUserByToken(token);
    if (!pendingUser)
        throw new Error('Token not found');

    await database.insertUser(pendingUser.email, pendingUser.password);
}


export interface RegistrationBody {
    email: string;
    password: string;
}

export async function appendUser(registrationBody: RegistrationBody) {

    if (!registrationBody.email)
        throw new Error('email must be provided');
    if (!registrationBody.password)
        throw new Error('password must be provided');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(registrationBody.email))
        throw new Error('Invalid email format');

    const userByEmail = await database.selectUserByEmail(registrationBody.email);

    if (userByEmail !== null) {
        console.log('Email already in use');
        throw new Error('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(registrationBody.password, 10);
    const token = crypto.randomBytes(42).toString('hex');
    await database.saveAppendingUser(registrationBody.email, hashedPassword, token);


    try {
        await sendMail(token, registrationBody);
        console.log('Verification email sent successfully');
    } catch (error) {
        console.error('Failed to send verification email:', error);
        throw new Error('Email could not be sent');
    }
}