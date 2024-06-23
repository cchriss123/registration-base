import {poolDb} from "./poolDb";

export async function createTables() {
    await createPendingUserTable();
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
