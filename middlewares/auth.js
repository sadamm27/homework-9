const jwt = require ("jsonwebtoken");
const secretKey = "Rahasia"
const pool = require("../config.js");

function authentication(req, res, next) {
 const {access_token} = req.headers;
 if(access_token) {
   try {
    const decoded = jwt.verify(access_token, secretKey);
    const {id, email, gender, role} = decoded
    const findUser = `
    SELECT 
        *
    FROM users 
    WHERE id = $1;
    ` 
     pool.query(findUser, [id], (err, result) => {
        if(err) next(err);

        if(result.rows.length === 0){
        next({name: "ErrorNotFound"})
        } else{
            const user = result.rows[0]
            
            req.loggedUser =  {
                id: user.id,
                email: user.email,
                gender: user.gender,
                role: user.role
            }
            next();
        }
     })  
} catch(err){
        next({name: "JWTerror"})
    }
 }  
 else {
    next ({name: "unauthenticated"})
 }
}

function authorization(req, res, next) {

    const {username, email, id} = req.loggedUser;

    if(username){
        next();
    } else{
        next({ name: "unauthorized"})
    }
}

module.exports = {
    authentication,
    authorization
}
