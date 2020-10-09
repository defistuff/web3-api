require('colors');

function requestLogger(req, res, next) {
    const url = req.originalUrl;
    const method = req.method;
    const date = new Date(Date.now()).toISOString();

    console.log(
        'Request URL:',
        url.yellow.bold,
        ' Rrequest Method: ',
        method.yellow.bold,
        ' Time:',
        date.yellow.bold
    );
    next();
}

function errorHandler(req, res, next) {
    // respond with html page
    return res
        .status(404)
        .send("<p>Page not found. Error 404</p><p><a href='/api/v1'>Go Home</a></p>");
}

module.exports = {
    requestLogger,
    errorHandler,
};
