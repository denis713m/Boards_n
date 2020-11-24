module.exports = logResponseBody = (req, res, next) => {
    const oldEnd = res.end;  
    const chunks = []; 
    res.end = function (chunk) {
      if (chunk) chunks.push(chunk);
      const body = Buffer.concat(chunks.map(x => (typeof (x) === "string" ? Buffer.from(x, 'binary') : x))).toString('utf8'); 
      console.log(req.path, req.body, body);  
      oldEnd.apply(res, arguments);
    };  
    next();
  }