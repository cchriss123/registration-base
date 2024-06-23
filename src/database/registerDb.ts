import { insertSyslog } from "./syslogDb";
import {poolDb} from "./poolDb";
import {RowDataPacket} from "mysql2";
import bcrypt from "bcrypt";

export async function insertSuperAdmin() {

    const [rows] = await poolDb.query<RowDataPacket[]>('SELECT * FROM USER WHERE user_type = "super_admin"');
    if (rows.length !== 0) return;

    const hashedPassword = await bcrypt.hash('super_admin', 10);



}

