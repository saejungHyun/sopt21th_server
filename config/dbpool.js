const mysql = require('mysql');
const dbConfig = {
    host: 'localhost',
    port: '3306', //mysql 포트
    user: 'saejung95',
    password: 'sj06', //mysql 비밀번호
    database: '4thhomework', //mysql 스키마이름
    connectionLimit: 23 // 커넥션 갯수를 23개로 제한 보통 default 로 23개 많이씀
};
const dbpool = mysql.createPool(dbConfig);

module.exports = dbpool;
