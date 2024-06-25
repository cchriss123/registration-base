import {RegistrationBody} from "./registrationService";
import sgMail from '@sendgrid/mail';

export async function sendMail(token: string, registrationBody: RegistrationBody) : Promise<void> {
    const clickHere = `http://${process.env.HOST}/api/auth/verify/${token}`;
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
        to: registrationBody.email,
        from: 'svarainte@smode-reply.se',
        subject: 'Confirm your registration',
        text: `Please confirm your registration by clicking on the link below: \n${clickHere}`,
        html: `<strong>Please confirm your registration by clicking <a href="${clickHere}">here</a>.</strong>`,
    };

    await sgMail.send(msg);
}