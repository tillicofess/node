const express = require('express');
const router = express.Router();
const multer = require('multer');

module.exports = (connection) => {
    // 设置存储引擎
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'D:/vue/vue3/imgfile/'); // 指定文件存储的目录
        },
        filename: function (req, file, cb) {
            // 查询数据库中已有的文件数量，然后将文件名设为数量加一
            connection.query('SELECT COUNT(*) AS count FROM avator', (err, rows) => {
                if (err) {
                    console.error('Error querying database:', err);
                    return cb(err);
                }
                const count = rows[0].count + 1;
                cb(null, count + '_' + file.originalname); // 使用数量加一作为文件名前缀
            });
        }
    });
    const upload = multer({ storage: storage });

    // 创建处理上传的路由
    router.post('/', upload.single('file'), (req, res) => {
        // 在这里处理接收到的 FormData
        console.log(req.file); // 输出 FormData 的内容
        console.log(req.body);

        // 将文件信息插入到 MySQL 数据库中的 avator 表中
        const { name, voice } = req.body;
        const fileUrl = 'D:/vue/vue3/imgfile/' + req.file.filename; // 文件在服务器上的路径
        const sql = 'INSERT INTO avator (name, voice, fileUrl) VALUES (?, ?, ?)';
        connection.query(sql, [name, voice, fileUrl], (err, result) => {
            if (err) {
                console.error('Error inserting data:', err);
                res.status(500).send('Error inserting data');
                return;
            }
            console.log('Data inserted:', result);
            // 响应客户端
            res.json({ message: "Received FormData" });
        });
    });
    return router;
}
