const mysql = require("mysql2");

const dbConfiguration = {
    host: "localhost",
    user: "root",
    password: "root",
    database: "blog"
}

function onDatabaseConnection(error) {
    if (error) throw error;

    console.log("Connessione a MySQL avvenuta con successo!");
}

const db = mysql.createConnection(dbConfiguration);
db.connect(onDatabaseConnection);

module.export = db