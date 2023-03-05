function errorHandler(err, req, res, next){

    if(err.name === "ErrorNotFound") {
            res.status(404).json({
                message: "Error Not Found"
            })
    } else if(err.name === "password salah"){
        res.status(400).json( {
            message: "pasword salah"
        })
    }
    else if(err.name === "unauthenticated")
        res.status(400).json({
            message: "unauthenticated"
        })

        else if(err.name === "JWTerror"){
            res.status(400).json({
                message: "JWT Error"
            })
        } else if(err.name === "unauthorized") {
            res.status(401).json({
                message: "uanuthorized"
            })
        }
    else {
        res.status(500).json()
        message: "Internal Server Error"
    }
    console.log(err)
}

module.exports = errorHandler;
