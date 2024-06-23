import {insertSyslog, Syslog} from "./syslogDb";
import {poolDb} from "./poolDb";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import bcrypt from "bcrypt";

export async function insertSuperAdmin() {

    const [rows] = await poolDb.query<RowDataPacket[]>('SELECT * FROM USER WHERE user_type = "super_admin"');
    if (rows.length !== 0) return;

    const hashedPassword = await bcrypt.hash('super_admin', 10);

    const query = `
        INSERT INTO USER (name, email, password, user_type)
        VALUES (?, ?, ?, ?);
    `;

    const [insertResult] = await poolDb.execute<ResultSetHeader>(query, ['Super Admin', 'super_admin@super_admin.com', hashedPassword, 'super_admin']);

    const syslog: Syslog = {
        entity_id: insertResult.insertId.toString(),
        entity_type: 'USER',
        action: 'CREATE',
        title: 'Creation of Super Admin',
        description: 'A new super admin was created in the system.',
        details: JSON.stringify({email: 'super_admin@super_admin.com', name: 'Super Admin'}),
    }
    await insertSyslog(syslog);
}



