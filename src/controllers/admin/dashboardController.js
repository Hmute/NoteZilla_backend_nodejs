const { all } = require('../../db/db');

const getAllUsers = async (req, res, next) => {
  try {
    const users = await all(`
      SELECT id, firstName, lastName, email, role, apiCalls, createdAt 
      FROM Users 
      ORDER BY createdAt DESC
    `);

    res.json({
      users,
      totalUsers: users.length,
      totalApiCalls: users.reduce((sum, user) => sum + (user.apiCalls || 0), 0)
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllUsers
};