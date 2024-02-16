const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

module.exports = (connection) => {
  // 登录接口
  router.post("/", async (req, res) => {
    const { username, password } = req.body;

    try {
      // 查询数据库中是否存在匹配的用户
      connection.query(
        "SELECT * FROM users WHERE username = ?",
        [username],
        async (err, results) => {
          if (err) {
            console.error("Error querying database:", err);
            //插叙数据库失败返回500
            res.status(500).send("Error querying database");
            return;
          }

          // 如果查询结果中存在匹配的用户
          if (results.length > 0) {
            const user = results[0];
            const match = await bcrypt.compare(password, user.password);

            if (match) {
              res.json({ message: "Login successfully" });
            } else {
              res.status(401).json({ message: "Invalid credentials" });
            }
          } else {
            res.status(401).json({ message: "Invalid credentials" });
          }
        }
      );
    } catch (error) {
      console.error("Error comparing passwords:", error);
      res.status(500).send("Error comparing passwords");
    }
  });

  return router;
};
