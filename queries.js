const { Pool } = require("pg");
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "postgres",
    database: "currencybird",
    port: 5432,
});

async function getInvitations() {
    const result = await pool.query(
        `SELECT c.fullname, registrations, (i.registrations * 5000) as total
            FROM client c
            JOIN invitation i on i.client_id = c.id
            WHERE i.registrations > 0
            ORDER BY total DESC`
    );
    return result.rows;
}

async function getInvitation(invitationCode) {
    const result = await pool.query(`SELECT * FROM invitation WHERE code = '${invitationCode}'`);
    return result.rows[0];
}

async function getInvitationClient(client_id) {
    const result = await pool.query(`SELECT * FROM invitation WHERE client_id = ${client_id}`);
    return result.rows[0];
}

async function registerClient(fullname, email, address, sex) {
    const result = await pool.query(
        `INSERT INTO client (fullname, email, address, sex) 
         VALUES ('${fullname}', '${email}', '${address}', ${sex}) RETURNING *`);
    return result.rows[0];
}

async function getClient(email, fullname) {
    const result = await pool.query(`SELECT * FROM client WHERE email = '${email}' AND fullname = '${fullname}'`);
    return result.rows[0];
}

async function getClientEmail(email) {
    const result = await pool.query(`SELECT * FROM client WHERE email = '${email}'`);
    return result.rows[0];
}

async function saveInvitation(code, client_id) {
    const result = await pool.query(
        `INSERT INTO invitation (code, registrations, client_id) 
         VALUES ('${code}', 0, ${client_id}) RETURNING *`);
    return result.rows[0];
}

async function increaseInvitationsUsed(id) {
    const result = await pool.query(
        `UPDATE invitation SET registrations = registrations + 1 WHERE id = ${id} RETURNING *`);
    return result.rows[0];
}

module.exports = {
    getInvitations,
    getInvitation,
    getInvitationClient,
    registerClient,
    getClient,
    getClientEmail,
    saveInvitation,
    increaseInvitationsUsed,
}