function errorHandler(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        //Jwt authentication error
        //Esto aparece ya que el usuario tiene que
        // enviar el token para poder realizar las peticiones
        return res.status(401).json({message: "The user is not authorized"})
    }
    
    if (err.name === 'ValidationError') {
        // Validation error
        return res.status(500).json({message: err})
    } 

    // Default to 500 server error
    return res.status(500).json({message: err})

}

module.exports = errorHandler;
