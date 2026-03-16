const dbConnection = require('../data/db');

function index(req, res) {

    const sqlQuery = "SELECT * FROM posts";

    dbConnection.query(sqlQuery, (error, rows) => {
        if (error) {
            return res.status(500).json({ error: "DB Error", message: "Errore nel recuperare i dati dal DB" });
        }

        let results = rows;



        res.json(results);
    });
}

//

function store(req, res) {

    console.log('STORE CALLED');
    console.log('BODY:', req.body);

    const { title, content, image } = req.body;



    const sqlQueryIns = "INSERT INTO posts (title, content, image) VALUES (?, ?, ?)";
    console.log(dbConnection.state)
    console.log('BODY:', req.body);


    dbConnection.query(
        sqlQueryIns,
        [title, content, image],
        (error, results) => {
            if (error) return res.status(500).json({ error: 'Failed to insert post' });
            res.status(201).json({ id: results.insertId });
            console.log(results);
        }
    );

    /*const newPost = {
        id: posts[posts.length - 1].id + 1,
        title: req.body.title,
        content: req.body.content,
        image: req.body.image,
        tags: req.body.tags
    };
    posts.push(newPost)
    console.log(newPost)*/


}

//

function show(req, res) {

    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: "Error", message: "ID non valido" });
    }

    //dbConnection.query(sqlQuery,parametriQuery,callback)

    const sqlQuery = "SELECT * FROM posts WHERE id = ?" //query per il post 
    const parametriQuery = [id]

    const sqlQuerytags = `
        SELECT T.*
        FROM tags T
        JOIN post_tag
        ON post_tag.tag_id = T.id
        WHERE post_tag.post_id = ? `;

    dbConnection.query(sqlQuery, parametriQuery, (error, postResult) => {
        if (error) {
            return res.status(500).json({ error: "DB Error", message: "Impossile eseguire la richiesta" })
        }

        if (postResult.length === 0) {
            return res.status(404).json({ error: "Not Found", message: "Impossile trovare il post" })
        }

        const risultatoPost = postResult[0]; //indice 0 perchè nello show ci interessa vedere la prima e unica riga del db , ovvero, quella chiamata con l'id. 
        // a differenza dell' index che invece mi mostra TUTTI i dati e quindi non mi serve un indice, perchè li voglio tutti 

        dbConnection.query(sqlQuerytags, parametriQuery, (error, tagsResult) => {  //eseguo la seconda query per i tags
            if (error) {
                return res.status(500).json({ error: "Database query failed" })
            };
            console.log(tagsResult)

            risultatoPost.tags = tagsResult;  //aggiungo al post una proprietà chiamata "tags", all'interno dell'oggetto "risultatoPost" che corrisponde
            res.json(risultatoPost)           //al risultato della query riferita ai tags. 
        });

    });


};
//


function destroy(req, res) {
    const id = Number(req.params.id); //id diventa una variabile che riceve il parametro inserito dall'utente

    if (isNaN(id)) {
        return res.status(400).json({ error: "Error", message: "ID non valido" });
    }

    const sqlQuery = "DELETE FROM posts WHERE id = ?";
    const parametriQuery = [id];  //recuperato nella prima riga

    //SINTASSI:  dbConnection.query(sqlQuery, parametriQuery, callback)  

    dbConnection.query(sqlQuery, parametriQuery, error => {
        if (error) {
            res.status(500).json({ error: "DB Error", message: "Impossile eliminare il post" })
        }

        return res.sendStatus(204);
    })


}

//

function update(req, res) { //modifico interamente l'elemento 

    //controllo che l'id inserito sia un numero 

    const id = Number(req.params.id);

    //se l'id inserito non corrisponde ad un numero o minore di 0, allora dico che l'id non è valido 

    if (id < 0) {
        return res.status(400).json({ error: "Error", message: "ID non valido" });
    }

    //creo costante con cui trovo l'elemento che cerco all'interno dell'array 

    /*const result = posts.find(post => post.id == id);

    //se non trovo il risultato restituisco l'errore

    if (!result) {
        return res.status(404).json({ error: "Not Found", message: "Post non trovato" });
    }*/

    //sto comunicando che la proprietà di result (result.proprietà) deve modificarsi in base a cosa viene fornito dall' oggetto
    //fornito nel body di postman (req.body.proprietà)

    /*result.title = req.body.title
    result.content = req.body.content
    result.image = req.body.image
    result.tags = req.body.tags*/

    //restituisco un json del solo elemento modificato 

    const { title, content, image } = req.body;

    const sqlQueryUpdate = "UPDATE posts SET title = ?, content= ?, image = ? WHERE id = ?"

    dbConnection.query(
        sqlQueryUpdate,
        [title, content, image, id],
        (error) => {
            if (error) return res.status(500).json({ error: "FAILED TO UPDATE POST" });
            res.json({ message: "Post updated successfully" })
        }
    )
}

//

function modify(req, res) { //modifico parzialmente l'elemento 

    //controllo che l'id inserito sia un numero 

    const id = Number(req.params.id);

    //se l'id inserito non corrisponde ad un numero o minore di 0, allora dico che l'id non è valido 

    if (id < 0) {
        return res.status(400).json({ error: "Error", message: "ID non valido" });
    }

    //creo costante con cui trovo l'elemento che cerco all'interno dell'array 

    const result = posts.find(post => post.id == id);

    //se non trovo il risultato restituisco l'errore

    if (!result) {
        return res.status(404).json({ error: "Not Found", message: "Post non trovato" });
    }

    // con la chiamata PATCH, a differenza, della chiamata PUT, posso anche fornire solamente la modifica di una sola proprietà.
    // Potrei anche scrivere nel body l'intero oggetto uguale al "vecchio", con la modifica solo sulla parte interessata, ma lo posso fare nel PUT. 
    // Se voglio modificare il title, scrivo solamente "title" = "nuovo titolo", ma automaticamente, tutte le altre proprietà risultano undefined
    // QUindi con gli if, gli sto dicendo  "Modifica il titolo SOLO SE il client mi ha effettivamente mandato il titolo.” OVVERO se fai la modifica solo se la proprietà
    //che leggi è diversa da undefined 

    if (req.body.title !== undefined) {
        result.title = req.body.title;
    }

    if (req.body.content !== undefined) {
        result.content = req.body.content;
    }

    if (req.body.image !== undefined) {
        result.image = req.body.image;
    }

    if (req.body.tags !== undefined) {
        result.tags = req.body.tags;
    }

    //restituisco un json del solo elemento modificato 

    return res.json(result);
}

const funzioni = {
    index,
    show,
    destroy,
    store,
    update,
    modify
}

module.exports = funzioni