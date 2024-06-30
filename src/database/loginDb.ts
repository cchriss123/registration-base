import { poolDb } from './poolDb';
import * as syslogDb from './syslogDb';
import {Syslog} from "./syslogDb";
import {RowDataPacket} from "mysql2";

interface UserRow extends RowDataPacket {
    refresh_token: string;
}

export async function getRefreshTokenById(id: string): Promise<string | null> {
    const [rows] = await poolDb.query<UserRow[]>('SELECT refresh_token FROM user WHERE id = ? AND is_deleted = false', [id]);
    return rows[0].refresh_token || null;
}

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

export async function selectIdByEmail(email: string) : Promise<string | null> {
    const [rows] = await poolDb.query<RowDataPacket[]>('SELECT id FROM USER WHERE email = ? AND is_deleted = false', [email]);
    return rows[0].id || null;
}

export async function selectUserPasswordByEmail(email: string) : Promise<string | null> {
    const query = 'SELECT password FROM USER WHERE email = ? AND is_deleted = false';
    const [rows] = await poolDb.query<RowDataPacket[]>(query, [email]);
    return rows[0].password || null;
}