function errorsHandler(err, req, res, next) {

    console.log(err)

    res.status(500).json({
        error: err.name,
        message: err.message
    });
}

module.exports = errorsHandler;