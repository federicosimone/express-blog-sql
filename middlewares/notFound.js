function notFound(req, res) {
    res.status(404).json({
        error: "Not Found",
        message: "Risorsa non trovata"
    });
}

module.exports = notFound;