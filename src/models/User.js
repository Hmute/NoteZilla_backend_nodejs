const { run, get } = require('../db/db');

const User = {
  findByEmail(email) {
    return get(`SELECT * FROM Users WHERE email = ?`, [email]);
  },

  findById(id) {
    return get(`SELECT * FROM Users WHERE id = ?`, [id]);
  },

  async create({ firstName, lastName, email, passwordHash, role = 'user' }) {
    return run(
      `INSERT INTO Users (firstName, lastName, email, passwordHash, role, apiCalls)
       VALUES (?, ?, ?, ?, ?, 0)`,
      [firstName, lastName, email, passwordHash, role]
    );
  },

  async incrementApiCalls(userId) {
    return run(
      `UPDATE Users SET apiCalls = apiCalls + 1 WHERE id = ?`,
      [userId]
    );
  },
};

module.exports = User;
