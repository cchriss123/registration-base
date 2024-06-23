import {poolDb} from "./poolDb";

export async function createTables() {
    await createPendingUserTable();
    await createUserTable();
    await createSystemLogTable();
}


async function createPendingUserTable() {
    await poolDb.execute(`
        CREATE TABLE IF NOT EXISTS PENDING_USER (
            id INT PRIMARY KEY AUTO_INCREMENT,
            email VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            token VARCHAR(255) NOT NULL,
            created DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
}

async function createUserTable() {
    await poolDb.execute(`
        CREATE TABLE IF NOT EXISTS USER (
            id INT AUTO_INCREMENT,
            name VARCHAR(255),
            email VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            user_type ENUM('super_admin', 'admin', 'user') NOT NULL,
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

async function createSystemLogTable() {
    await poolDb.execute(`
        CREATE TABLE IF NOT EXISTS SYSTEM_LOG (
            id INT AUTO_INCREMENT PRIMARY KEY,
            entity_id VARCHAR(255),  
            entity_type VARCHAR(50),
            action VARCHAR(50),
            title VARCHAR(255),
            description TEXT,
            details TEXT,
            created DATETIME DEFAULT CURRENT_TIMESTAMP,
            created_by INT DEFAULT NULL,
            FOREIGN KEY (created_by) REFERENCES USER(id)
        );
    `);
}
