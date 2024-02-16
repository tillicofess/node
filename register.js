const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10; // 加密轮数，可以根据需求调整

module.exports = (connection) => {
  // 注册接口
  router.post('/', async (req, res) => {
    const { username, password } = req.body;

    // 使用 bcrypt 加密密码
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 插入数据到数据库
    connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error inserting data:', err);
        res.status(500).send('Error inserting data');
        return;
      }
      console.log('Data inserted:', result);
      // 返回注册成功消息
      res.status(200).json({ message: 'Registration successful' });
    });
  });

  return router;
};
