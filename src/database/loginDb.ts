import { poolDb } from './poolDb';
import * as syslogDb from './syslogDb';
import {Syslog} from "./syslogDb";

export async function saveRefreshToken(refreshToken: string, id: string) : Promise<void> {
    await poolDb.execute('UPDATE USER SET refresh_token = ? WHERE id = ?', [refreshToken, id]);

    const syslog: Syslog = {
        entity_id: id,
        entity_type: 'USER',
        action: 'UPDATE',
        title: 'Refresh Token Update',
        description: 'Someone logged in and a new refresh token was generated.',
        created_by: id
    }
    await syslogDb.insertSyslog(syslog);
}

export async function selectIdByEmail(email: string) {
    //TODO
}

export async function selectUserPasswordByEmail(email: string) {
    //TODO
}
