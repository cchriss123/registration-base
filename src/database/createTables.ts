import {poolDb} from "./poolDb";

export async function createTables() {
    await createPendingUserTable();
    await createUserTable();
}


async function createPendingUserTable() {
    const query = `
        CREATE TABLE IF NOT EXISTS PENDING_USER (
            id INT PRIMARY KEY AUTO_INCREMENT,
            email VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            token VARCHAR(255) NOT NULL,
            created DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;
    await poolDb.execute(query);
}

async function createUserTable() {
    await poolDb.execute(`
        CREATE TABLE IF NOT EXISTS USER (
            id INT AUTO_INCREMENT,
            name VARCHAR(255),
            email VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            user_type ENUM('super_admin', 'admin', 'user') NOT NULL,
            phone_number VARCHAR(255),
            refresh_token VARCHAR(255),                
            is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
            modified DATETIME,
            created DATETIME DEFAULT CURRENT_TIMESTAMP,
            modified_by INT,
            PRIMARY KEY (id),
            UNIQUE (email),
            UNIQUE (phone_number)
        );
    `);
}
