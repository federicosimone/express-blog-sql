const mysql = require("mysql2");  //importo la libreria npm install mysql2

const dbConfiguration = {
    host: "localhost",  //di default gira sulla porta localhost3306
    user: "root",
    password: "root",
    database: "blog" //nome dello schema 
}

function onDatabaseConnection(error) {
    if (error) throw error;  //se non c'è errore vedrò la stringa stampata sotto. 

    console.log("Connessione a MySQL avvenuta con successo!");  //questa frase viene stampata una volta che lancio express, npm run dev
}

const db = mysql.createConnection(dbConfiguration);
db.connect(onDatabaseConnection);

module.exports = db