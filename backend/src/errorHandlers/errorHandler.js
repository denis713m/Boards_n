module.exports = errorHandler = (err, req, res, next) => {
    if (!err.message && !err.code) {
        res.status(500).send('Server Error');
    } else if (!err.message) {
        res.send('Server Error');
    } else if (!err.code) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(500).send('Name exists');
        } else res.status(500).send(err.message);
    } else {
        res.status(err.code).send(err.message);
    }
};