//returns a nicely formated object 
function errorHandler(error, request, response, next){
    return response.status(error.status || 500).json({
        //this object will always have the key of error and a value of message
        error: {
            //we will always get some kind of string
            message: error.message || "Something went wrong."
        }
    });
}

module.exports = errorHandler;