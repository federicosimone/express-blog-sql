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

function store(req, res) {

    const newPost = {
        id: posts[posts.length - 1].id + 1,
        title: req.body.title,
        content: req.body.content,
        image: req.body.image,
        tags: req.body.tags
    };
    posts.push(newPost)
    console.log(newPost)
    res.status(201).json(newPost);
}

function show(req, res) {

    const id = Number(req.params.id);

    if (id < 0) {
        return res.status(400).json({ error: "Error", message: "ID non valido" });
    }

    const sqlQuery = "SELECT FROM posts WHERE id = ?";
    const parametriQuery = [id];

    dbConnection.query(sqlQuery, parametriQuery, error => {
        if (error) {
            return res.status(500).json({ error: "DB Error", message: "Impossile eliminare il post" })
        }

        res.json(sqlQuery);
    })

}

function destroy(req, res) {
    const id = Number(req.params.id);

    if (id < 0) {
        return res.status(400).json({ error: "Error", message: "ID non valido" });
    }

    const sqlQuery = "DELETE FROM posts WHERE id = ?";
    const parametriQuery = [id];

    dbConnection.query(sqlQuery, parametriQuery, error => {
        if (error) {
            return res.status(500).json({ error: "DB Error", message: "Impossile eliminare il post" })
        }

        res.sendStatus(204);
    })


}



function update(req, res) { //modifico interamente l'elemento 

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

    //sto comunicando che la proprietà di result (result.proprietà) deve modificarsi in base a cosa viene fornito dall' oggetto
    //fornito nel body di postman (req.body.proprietà)

    result.title = req.body.title
    result.content = req.body.content
    result.image = req.body.image
    result.tags = req.body.tags

    //restituisco un json del solo elemento modificato 

    return res.json(result);
}

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