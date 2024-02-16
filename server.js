// 引入 Express 和其他模块
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// 使用 CORS 中间件
app.use(cors());

// 创建数据库连接
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Kua2016520',
  database: 'login'
});

// 连接到数据库
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// 使用 Express 解析请求体
app.use(express.json());

// 将注册接口路由到 login.js 中处理
app.use('/register', require('./register')(connection));
app.use('/login', require('./login')(connection));
app.use('/upload', require('./upload')(connection));

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

