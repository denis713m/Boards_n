module.exports = errorH = (err, req, res, next) => {
    console.log(err);
    console.log('!!!!!');
    if ( !err.message || !err.code) {
      res.status(500).send('Server Error');
    } else {
      res.status(err.code).send(err.message);
    }
  };