const jwt = require('jsonwebtoken');
export default () =>{
    const accessToken = window.localStorage.getItem('accessToken');
    if (!accessToken) {return false;}
    else {
        const {exp} = jwt.decode(accessToken);
        if (Date.now() >= exp * 1000) {return false;}
        else return true;
    }
}