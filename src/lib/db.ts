import mysql from "mysql2/promise";

const db = mysql.createPool({
	host: "sql12.freesqldatabase.com", // Your MySQL host
	user: "sql12748194", // Your MySQL username
	password: "9sGRK3nFTp", // Your MySQL password
	database: "sql12748194", // Your database name
	port: 3306,
});

export default db;
