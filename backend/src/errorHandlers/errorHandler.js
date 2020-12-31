module.exports = errorH = (err, req, res, next) => {
    if (!err.message) {
        res.status(500).send('Server Error');
    } else {
        res.status(500).send(err.message);
    }
};
