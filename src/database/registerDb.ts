import {insertSyslog, Syslog} from "./syslogDb";
import {poolDb} from "./poolDb";
import {FieldPacket, ResultSetHeader, RowDataPacket} from "mysql2";
import bcrypt from "bcrypt";


export async function insertUser(email: string, password: string) {

    const query = `INSERT INTO USER (email, password, user_type, is_deleted, created)
        VALUES (?, ?, 'user', false, NOW()) `;

    const [insertResult]: [ResultSetHeader, FieldPacket[]] = await poolDb.execute(query, [email, password]);
    const id = insertResult.insertId.toString();

    const syslog: Syslog = {
        entity_id: id,
        entity_type: 'USER',
        action: 'CREATE',
        title: 'Creation of User',
        description: 'A new user was created in the system.',
        details: JSON.stringify({email}),
        created_by: id,
    }
    await insertSyslog(syslog);

    const deleteQuery = `DELETE FROM PENDING_USER WHERE email = ?`;
    await poolDb.execute(deleteQuery, [email]);

    const deleteLog: Syslog = {
        entity_id: id,
        entity_type: 'PENDING_USER',
        action: 'DELETE',
        title: 'Deletion of Pending User',
        description: 'A pending user was deleted after registration.',
        details: JSON.stringify({email}),
        created_by: id,
    }
    await insertSyslog(deleteLog);
    console.log('A new user was created in the system');
}

export async function selectPendingUserByToken(token: string) {

    const query = "SELECT email, password FROM PENDING_USER WHERE token = ?"
    const [rows] = await poolDb.query<RowDataPacket[]>(query,token);
    return rows[0] || null;
}


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

export async function saveAppendingUser(email: string, hashedPassword: string, token: string) {
    const query = `
        INSERT INTO PENDING_USER (email, password, token, created, modified)
        VALUES (?, ?, ?, ?, NULL)
        ON DUPLICATE KEY UPDATE 
        password = VALUES(password),  
        token = VALUES(token),
        modified = NOW();
    `;


    const [insertResult] = await poolDb.execute<ResultSetHeader>(query, [email, hashedPassword, token, new Date()]);

    const syslog: Syslog = {
        entity_id: insertResult.insertId.toString(),
        entity_type: 'PENDING_USER',
        action: 'CREATE',
        title: 'Creation of Pending User',
        description: 'A new pending user was created in the system.',
        details: JSON.stringify({email}),
    }
    await insertSyslog(syslog);
}

export async function selectUserByEmail(email: string): Promise<UserEmailRow | null> {
    const [rows] = await poolDb.query<UserEmailRow[]>('SELECT email FROM USER WHERE email = ?', [email]);
    return rows[0] || null;
}

interface UserEmailRow extends RowDataPacket {
    id: string;
}

