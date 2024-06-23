import { poolDb } from './poolDb';

export interface Syslog {
    entity_type: string;
    action: string;
    description?: string;
    details?: string;
    entity_id: string;
    title: string;
    created_by?: string;

}

export async function insertSyslog(syslog: Syslog) {

        const keys = Object.keys(syslog);
        const placeholders = keys.map(() => '?').join(', ');
        const values = keys.map(key => syslog[key]);
        const query = `INSERT INTO SYSTEM_LOG (${keys.join(', ')}) VALUES (${placeholders})`;
        await poolDb.execute(query, values);
}